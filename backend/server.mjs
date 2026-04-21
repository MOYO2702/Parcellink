// backend/server.mjs
import 'dotenv/config';
import express from "express";
import path from "path";
import cors from "cors";
import crypto from "crypto";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { body, validationResult } from "express-validator";
import * as db from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = path.join(__dirname, "..");
const IS_PRODUCTION = String(process.env.NODE_ENV || "").toLowerCase() === "production";
const I18N_SCRIPT_TAG = '<script src="/js/i18n.js"></script>';

console.log("Starting server:", __filename, "PID:", process.pid);

// Middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} → ${req.method} ${req.originalUrl}`);
  next();
});

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Security + parsing
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "").split(",").filter(Boolean);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) {
      return callback(null, true);
    }
    if (!IS_PRODUCTION && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX) || 240, // limit each IP
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    const ip = req.ip || req.socket?.remoteAddress || "";
    const host = req.hostname || "";
    return ip === "::1" || ip === "127.0.0.1" || host === "localhost";
  },
});
app.use("/api", limiter);

const AUTH_TOKEN_SECRET = (process.env.AUTH_TOKEN_SECRET || process.env.ADMIN_PASSWORD || "").trim();
const AUTH_TOKEN_TTL_HOURS = Number(process.env.AUTH_TOKEN_TTL_HOURS || 24);
const PASSWORD_RESET_TTL_MINUTES = Number(process.env.PASSWORD_RESET_TTL_MINUTES || 60);

function toBase64Url(input) {
  return Buffer.from(input).toString("base64url");
}

function signAuthToken(payload, type) {
  if (!AUTH_TOKEN_SECRET) return "";
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const ttlSeconds = type === "user-reset"
    ? Math.max(5, PASSWORD_RESET_TTL_MINUTES) * 60
    : Math.max(1, AUTH_TOKEN_TTL_HOURS) * 3600;
  const exp = now + ttlSeconds;
  const tokenPayload = { ...payload, typ: type, iat: now, exp };
  const encodedHeader = toBase64Url(JSON.stringify(header));
  const encodedPayload = toBase64Url(JSON.stringify(tokenPayload));
  const data = `${encodedHeader}.${encodedPayload}`;
  const sig = crypto.createHmac("sha256", AUTH_TOKEN_SECRET).update(data).digest("base64url");
  return `${data}.${sig}`;
}

function verifyAuthToken(token, expectedType) {
  if (!AUTH_TOKEN_SECRET || !token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [encodedHeader, encodedPayload, providedSig] = parts;
  const data = `${encodedHeader}.${encodedPayload}`;
  const expectedSig = crypto.createHmac("sha256", AUTH_TOKEN_SECRET).update(data).digest("base64url");
  if (providedSig !== expectedSig) return null;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) return null;
    if (expectedType && payload.typ !== expectedType) return null;
    return payload;
  } catch {
    return null;
  }
}

function getBearerToken(req) {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) return "";
  return authHeader.slice(7).trim();
}

function requireUserAuth(req, res, next) {
  const token = getBearerToken(req);
  const payload = verifyAuthToken(token, "user");
  if (!payload?.email) {
    return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
  }
  req.authUser = payload;
  return next();
}

function requireStaffAuth(req, res, next) {
  const token = getBearerToken(req);
  const payload = verifyAuthToken(token, "staff");
  if (!payload?.staffId) {
    return res.status(401).json({ success: false, message: "Unauthorized staff session." });
  }
  req.authStaff = payload;
  return next();
}

function requireStaffAuthOrLocal(req, res, next) {
  const ip = req.ip || req.socket?.remoteAddress || "";
  const host = req.hostname || "";
  const isLocal =
    ip === "::1" ||
    ip === "127.0.0.1" ||
    ip === "::ffff:127.0.0.1" ||
    host === "localhost";
  if (isLocal) return next();
  return requireStaffAuth(req, res, next);
}

// ================= HELPER FUNCTIONS =================
function generateReceiptNumber() {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.floor(10000 + Math.random() * 90000);
  return `RCP-${datePart}-${randomPart}`;
}

function generateTrackingCode() {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.floor(100000 + Math.random() * 900000);
  return `PL-${datePart}-${randomPart}`;
}

async function generateSuiteNumberDb() {
  const res = await db.query("SELECT COUNT(*) FROM users");
  const count = Number(res.rows[0]?.count || 0);
  return "PL" + (100000 + count + 1);
}

async function getOrCreateSystemUser() {
  const systemEmail = process.env.SYSTEM_USER_EMAIL || "system@parcellink.local";
  let user = await db.getUserByEmail(systemEmail);
  if (!user) {
    const suiteNumber = "PLSYS001";
    const passwordHash = await bcrypt.hash("ChangeMe123!", 10);
    user = await db.createUser("ParcelLink System", systemEmail, suiteNumber, passwordHash);
  }
  return user;
}

function buildPricingFromRow(row) {
  if (row.base_cost === null || row.final_cost === null) {
    return null;
  }
  return {
    baseCost: Number(row.base_cost),
    discountPercentage: Number(row.discount_percentage || 0),
    finalCost: Number(row.final_cost),
    currency: "AED"
  };
}

function mapParcelRow(row, statusHistory = []) {
  return {
    trackingCode: row.tracking_code,
    senderName: row.sender_name,
    receiverName: row.receiver_name,
    senderEmail: row.sender_email || "",
    receiverEmail: row.receiver_email || "",
    senderPhone: row.sender_phone || "",
    receiverPhone: row.receiver_phone || "",
    from: row.sender_location,
    to: row.receiver_location,
    weight: Number(row.weight || 0),
    length: Number(row.length || 0),
    width: Number(row.width || 0),
    height: Number(row.height || 0),
    notes: row.notes || "",
    pricing: buildPricingFromRow(row),
    createdAt: row.created_at,
    statusHistory
  };
}

async function sendHtmlWithI18n(res, filePath) {
  try {
    let html = await fs.readFile(filePath, "utf8");
    if (!html.includes('/js/i18n.js')) {
      if (/<\/body>/i.test(html)) {
        html = html.replace(/<\/body>/i, `\n${I18N_SCRIPT_TAG}\n</body>`);
      } else {
        html += `\n${I18N_SCRIPT_TAG}\n`;
      }
    }
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    return res.type("html").send(html);
  } catch (error) {
    console.error("Failed to render HTML page:", filePath, error);
    return res.status(500).send("Unable to load page.");
  }
}

// Pricing calculation with discounts
function calculateShippingCost(weight, baseRatePerKg = 10) {
  // Base cost calculation
  const baseCost = weight * baseRatePerKg;
  
  // Determine discount percentage
  let discountPercentage = 10; // Default 10% discount for all shipments
  
  if (weight >= 100) {
    discountPercentage = 20; // 20% discount for 100kg and above
  }
  
  // Calculate discount amount
  const discountAmount = (baseCost * discountPercentage) / 100;
  
  // Final cost after discount
  const finalCost = baseCost - discountAmount;
  
  return {
    weight,
    baseRatePerKg,
    baseCost: parseFloat(baseCost.toFixed(2)),
    discountPercentage,
    discountAmount: parseFloat(discountAmount.toFixed(2)),
    finalCost: parseFloat(finalCost.toFixed(2)),
    currency: "AED" // You can change this to your preferred currency
  };
}

function buildInvestmentDashboard(interestRow) {
  const annualRoi = Number(process.env.INVESTOR_ANNUAL_ROI || 25);
  const dailyRate = Math.pow(1 + (annualRoi / 100), 1 / 365) - 1;

  const startDate = new Date(interestRow.investment_start_date);
  const today = new Date();
  const msPerDay = 24 * 60 * 60 * 1000;
  const startUtc = Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate());
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const elapsedDays = Math.max(0, Math.floor((todayUtc - startUtc) / msPerDay));

  const principal = Number(interestRow.initial_investment || 0);
  const currentValue = principal * Math.pow(1 + dailyRate, elapsedDays);
  const totalGrowth = currentValue - principal;
  const growthPercent = principal > 0 ? (totalGrowth / principal) * 100 : 0;

  const timeline = [];
  let previousValue = principal;
  for (let day = 0; day <= elapsedDays; day += 1) {
    const openingValue = day === 0 ? principal : previousValue;
    const closingValue = principal * Math.pow(1 + dailyRate, day);
    const dailyProfit = day === 0 ? 0 : (closingValue - openingValue);
    const entryDate = new Date(startUtc + (day * msPerDay));
    timeline.push({
      day,
      dayIndex: day + 1,
      date: entryDate.toISOString().slice(0, 10),
      openingBalance: Number(openingValue.toFixed(2)),
      dailyProfit: Number(dailyProfit.toFixed(2)),
      closingBalance: Number(closingValue.toFixed(2)),
      portfolioValue: Number(closingValue.toFixed(2)),
      cumulativeGrowth: Number((closingValue - principal).toFixed(2)),
      dailyGrowth: Number(dailyProfit.toFixed(2))
    });
    previousValue = closingValue;
  }

  const projected30d = principal * Math.pow(1 + dailyRate, 30);
  const projected90d = principal * Math.pow(1 + dailyRate, 90);
  const projected365d = principal * Math.pow(1 + dailyRate, 365);

  return {
    profile: {
      inquiryId: interestRow.inquiry_id,
      investorName: interestRow.full_name,
      email: interestRow.email,
      phoneNumber: interestRow.phone_number,
      initialInvestment: principal,
      investmentStartDate: interestRow.investment_start_date,
      confirmationStatus: interestRow.status || "confirmed",
      confirmedAt: interestRow.confirmed_at || interestRow.created_at
    },
    metrics: {
      elapsedDays,
      annualRoiPercent: Number(annualRoi.toFixed(2)),
      dailyRatePercent: Number((dailyRate * 100).toFixed(4)),
      currentPortfolioValue: Number(currentValue.toFixed(2)),
      totalGrowthAmount: Number(totalGrowth.toFixed(2)),
      totalGrowthPercent: Number(growthPercent.toFixed(2))
    },
    projections: {
      after30Days: Number(projected30d.toFixed(2)),
      after90Days: Number(projected90d.toFixed(2)),
      after365Days: Number(projected365d.toFixed(2))
    },
    timeline
  };
}

// Email helper
const smtpPort = parseInt(process.env.EMAIL_PORT || "587", 10);
const smtpSecure = ["1", "true", "yes"].includes(String(process.env.EMAIL_SECURE || "").toLowerCase()) || smtpPort === 465;
const emailFromAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER || "no-reply@parcellink.ae";
const emailFromName = process.env.EMAIL_FROM_NAME || "ParcelLink";
const emailReplyTo = process.env.EMAIL_REPLY_TO || emailFromAddress;

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "sandbox.smtp.mailtrap.io",
  port: smtpPort,
  secure: smtpSecure,
  auth: {
    user: process.env.EMAIL_USER || "YOUR_MAILTRAP_USER",
    pass: process.env.EMAIL_PASS || "YOUR_MAILTRAP_PASS"
  }
});

async function sendWelcomeEmail(to, fullName, suiteNumber) {
  try {
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("⚠️ SMTP not fully configured. Skipping welcome email.");
      return false;
    }

    await transporter.sendMail({
      from: `"${emailFromName}" <${emailFromAddress}>`,
      replyTo: emailReplyTo,
      to,
      subject: "Welcome to ParcelLink",
      html: `
          <h2>Welcome to ParcelLink, ${fullName}!</h2>
          <p>Your account has been created successfully.</p>
          <p><strong>Your Suite Number:</strong> ${suiteNumber}</p>
          <p>You can log in using either your email or your suite number.</p>
          <p><a href="https://www.parcellinkuae.com/login">Log in to your ParcelLink account</a></p>
        `
      });
      console.log("✅ Welcome email sent to", to);
      return true;
    } catch (err) {
      console.error("❌ Error sending email:", err.message);
      return false;
    }
  }

async function sendPasswordResetEmail(to, fullName, resetUrl) {
  try {
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("⚠️ SMTP not fully configured. Skipping password reset email.");
      return false;
    }

    await transporter.sendMail({
      from: `"${emailFromName}" <${emailFromAddress}>`,
      replyTo: emailReplyTo,
      to,
      subject: "ParcelLink password reset",
      html: `
        <h2>Hello ${fullName || "ParcelLink customer"},</h2>
        <p>We received a request to reset your ParcelLink password.</p>
        <p><a href="${resetUrl}">Reset your password</a></p>
        <p>This link expires in ${Math.max(5, PASSWORD_RESET_TTL_MINUTES)} minutes.</p>
        <p>If you did not request this, you can safely ignore this email.</p>
      `
    });
    console.log("✅ Password reset email sent to", to);
    return true;
  } catch (err) {
    console.error("❌ Password reset email error:", err.message);
    return false;
  }
}

async function sendStaffAccessEmail(to, fullName, staffId, accountType) {
  try {
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return;
    }

    const accountLabel = accountType === "investor" ? "Investor" : "Admin";

    await transporter.sendMail({
      from: `"${emailFromName}" <${emailFromAddress}>`,
      replyTo: emailReplyTo,
      to,
      subject: `Your ParcelLink ${accountLabel} Portal Access`,
      html: `
        <h2>Hello ${fullName},</h2>
        <p>Your ParcelLink ${accountLabel.toLowerCase()} portal account is ready.</p>
        <p><strong>Portal ID:</strong> ${staffId}</p>
        <p>You can use this ID every time you log in to the ParcelLink portal.</p>
      `
    });

    console.log("✅ Staff access email sent to", to);
  } catch (err) {
    console.error("❌ Staff access email error:", err.message);
  }
}

async function sendCareerApplicationNotification(application) {
  try {
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return;
    }

    const notificationRecipient = process.env.HR_NOTIFICATION_EMAIL || emailReplyTo || emailFromAddress;
    await transporter.sendMail({
      from: `"${emailFromName}" <${emailFromAddress}>`,
      replyTo: emailReplyTo,
      to: notificationRecipient,
      subject: `New Career Application - ${application.role_interest}`,
      html: `
        <h3>New Career Application Received</h3>
        <p><strong>Application ID:</strong> ${application.application_id}</p>
        <p><strong>Name:</strong> ${application.full_name}</p>
        <p><strong>Email:</strong> ${application.email}</p>
        <p><strong>Phone:</strong> ${application.phone}</p>
        <p><strong>Role Interest:</strong> ${application.role_interest}</p>
        <p><strong>Message:</strong> ${application.message || "N/A"}</p>
        <p><strong>CV File:</strong> ${application.cv_file_name || "Not provided"}</p>
        <p><strong>Submitted At:</strong> ${application.submitted_at}</p>
      `
    });
    console.log("✅ Career application notification sent:", application.application_id);
  } catch (err) {
    console.error("❌ Career notification email error:", err.message);
  }
}

// ================= API ROUTES =================
if (!IS_PRODUCTION) {
  app.get("/_debug/isalive", (req, res) => res.json({ pid: process.pid, ts: Date.now() }));
}

app.get("/api/status", (req, res) => {
  res.send("ParcelLink backend is running 🚀");
});

app.get("/api/db-health", async (req, res) => {
  try {
    const health = await db.testConnection();
    if (!health.success) {
      return res.status(500).json({ success: false, message: "Database connection failed", error: health.error });
    }
    return res.json({ success: true, message: "Database connected", data: health.timestamp });
  } catch (err) {
    console.error("DB health error:", err);
    return res.status(500).json({ success: false, message: "Database health check failed" });
  }
});

app.post(
  "/api/investor-interest",
  [
    body("name").trim().isLength({ min: 2, max: 120 }).withMessage("Name is required."),
    body("email").trim().isEmail().withMessage("A valid email is required."),
    body("phone").trim().isLength({ min: 7, max: 30 }).withMessage("A valid phone number is required."),
    body("initialInvestment").isFloat({ gt: 0 }).withMessage("Initial investment must be greater than 0."),
    body("startDate").isISO8601().withMessage("A valid investment start date is required.")
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array(), message: "Please complete all required fields correctly." });
      }

      const { name, email, phone, initialInvestment, startDate } = req.body;
      const saved = await db.createInvestorInterest({
        fullName: name,
        email,
        phoneNumber: phone,
        initialInvestment: Number(initialInvestment),
        investmentStartDate: startDate
      });

      return res.status(201).json({
        success: true,
        message: "Your investment interest has been submitted successfully.",
        inquiryId: saved.inquiry_id,
        confirmation: {
          status: "confirmed",
          note: "ParcelLink Investment Desk has confirmed your investment request."
        }
      });
    } catch (err) {
      console.error("Investor interest submission error:", err);
      return res.status(500).json({ success: false, message: "Unable to submit investor interest right now." });
    }
  }
);

app.get("/api/investor-interest/me/dashboard", requireStaffAuth, async (req, res) => {
  try {
    const accountType = String(req.authStaff?.accountType || "").toLowerCase();
    const department = String(req.authStaff?.department || "").toLowerCase();
    const role = String(req.authStaff?.role || "").toLowerCase();
    const isInvestor = accountType === "investor" || department === "investors" || role === "investor";
    if (!isInvestor) {
      return res.status(403).json({ success: false, message: "Investor access only." });
    }

    const investorEmail = String(req.authStaff?.email || "").trim().toLowerCase();
    if (!investorEmail) {
      return res.status(400).json({ success: false, message: "Investor email is missing in session." });
    }

    const interest = await db.getLatestInvestorInterestByEmail(investorEmail);
    if (!interest) {
      return res.status(404).json({ success: false, message: "No investment onboarding record found." });
    }

    const dashboard = buildInvestmentDashboard(interest);
    return res.json({
      success: true,
      message: "Investor dashboard loaded successfully.",
      dashboard
    });
  } catch (err) {
    console.error("Investor me dashboard fetch error:", err);
    return res.status(500).json({ success: false, message: "Unable to load investor dashboard right now." });
  }
});

app.get("/api/investor-interest/:inquiryId/dashboard", async (req, res) => {
  try {
    const inquiryId = (req.params.inquiryId || "").trim();
    if (!inquiryId) {
      return res.status(400).json({ success: false, message: "Inquiry ID is required." });
    }

    const interest = await db.getInvestorInterestByInquiryId(inquiryId);
    if (!interest) {
      return res.status(404).json({ success: false, message: "Investor record not found." });
    }

    const dashboard = buildInvestmentDashboard(interest);
    return res.json({
      success: true,
      message: "Investor dashboard loaded successfully.",
      dashboard
    });
  } catch (err) {
    console.error("Investor dashboard fetch error:", err);
    return res.status(500).json({ success: false, message: "Unable to load investor dashboard right now." });
  }
});

app.post(
  "/api/career-applications",
  [
    body("fullName").trim().isLength({ min: 2, max: 120 }).withMessage("Full name is required."),
    body("email").trim().isEmail().withMessage("A valid email is required."),
    body("phone").trim().isLength({ min: 7, max: 30 }).withMessage("A valid phone number is required."),
    body("roleInterest").trim().isLength({ min: 2, max: 150 }).withMessage("Role interest is required."),
    body("message").optional({ checkFalsy: true }).trim().isLength({ max: 2000 }).withMessage("Message is too long."),
    body("cvFileName").optional({ checkFalsy: true }).trim().isLength({ max: 255 }).withMessage("CV file name is too long.")
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
          message: "Please complete all required fields correctly."
        });
      }

      const { fullName, email, phone, roleInterest, message, cvFileName } = req.body;
      const savedApplication = await db.createCareerApplication({
        fullName,
        email,
        phone,
        roleInterest,
        message: message || "",
        cvFileName: cvFileName || ""
      });

      sendCareerApplicationNotification(savedApplication).catch(() => {});

      return res.status(201).json({
        success: true,
        message: "Application submitted successfully.",
        data: {
          applicationId: savedApplication.application_id,
          submittedAt: savedApplication.submitted_at
        }
      });
    } catch (err) {
      console.error("Career application submission error:", err);
      return res.status(500).json({ success: false, message: "Unable to submit application right now." });
    }
  }
);

// USER ROUTES
app.post(
  "/api/register",
  [
    body("fullName").trim().notEmpty().withMessage("Full name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { fullName, email, password } = req.body;
      const normalizedEmail = (email || "").trim().toLowerCase();
      const normalizedName = (fullName || "").trim();

      const existing = await db.getUserByEmail(normalizedEmail);
      if (existing) {
        return res.status(400).json({ success: false, message: "An account with this email already exists." });
      }

      const suiteNumber = await generateSuiteNumberDb();
      const passwordHash = await bcrypt.hash(password, 10);

      const newUser = await db.createUser(normalizedName, normalizedEmail, suiteNumber, passwordHash);

      const welcomeEmailSent = await sendWelcomeEmail(normalizedEmail, normalizedName, suiteNumber);

      console.log("New user created:", newUser);

      return res.json({
      success: true,
      message: welcomeEmailSent
        ? "Registration successful. A welcome email has been sent."
        : "Registration successful.",
      suiteNumber,
      emailSent: welcomeEmailSent
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const normalizedIdentifier = (identifier || "").trim();

    if (!normalizedIdentifier || !password) {
      return res.status(400).json({ success: false, message: "Both fields are required." });
    }

    const userByEmail = await db.getUserByEmail(normalizedIdentifier);
    const userBySuite = await db.getUserBySuiteNumber(normalizedIdentifier);
    const user = userByEmail || userBySuite;

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials." });
    }

    const storedPasswordHash = user.password_hash || user.passwordHash;
    if (!storedPasswordHash) {
      console.error("Login error: user record has no password hash", { identifier: normalizedIdentifier });
      return res.status(500).json({ success: false, message: "Server error." });
    }

    const passwordMatch = await bcrypt.compare(password, storedPasswordHash);
    if (!passwordMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials." });
    }

    return res.json({
      success: true,
      message: "Login successful.",
      user: {
        fullName: user.full_name,
        email: user.email,
        suiteNumber: user.suite_number
      },
      token: signAuthToken({ email: user.email, suiteNumber: user.suite_number }, "user")
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

app.post(
  "/api/forgot-password",
  [
    body("email").trim().isEmail().withMessage("A valid email is required.")
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: "Please enter a valid email address." });
      }

      const normalizedEmail = String(req.body.email || "").trim().toLowerCase();
      const user = await db.getUserByEmail(normalizedEmail);

      if (user) {
        const token = signAuthToken({ email: user.email }, "user-reset");
        const resetUrl = `${req.protocol}://${req.get("host")}/reset-password?token=${encodeURIComponent(token)}`;
        await sendPasswordResetEmail(user.email, user.full_name, resetUrl);
      }

      return res.json({
        success: true,
        message: "If an account exists for that email, a password reset link has been sent."
      });
    } catch (err) {
      console.error("Forgot password error:", err);
      return res.status(500).json({ success: false, message: "Unable to start password reset right now." });
    }
  }
);

app.post(
  "/api/reset-password",
  [
    body("token").trim().notEmpty().withMessage("Reset token is required."),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters.")
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: "Please provide a valid reset token and password." });
      }

      const token = String(req.body.token || "").trim();
      const password = String(req.body.password || "");
      const payload = verifyAuthToken(token, "user-reset");

      if (!payload?.email) {
        return res.status(400).json({ success: false, message: "This reset link is invalid or has expired." });
      }

      const user = await db.getUserByEmail(payload.email);
      if (!user) {
        return res.status(400).json({ success: false, message: "This reset link is invalid or has expired." });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const updatedUser = await db.updateUserPassword(user.email, passwordHash);
      if (!updatedUser) {
        return res.status(500).json({ success: false, message: "Unable to reset password right now." });
      }

      return res.json({ success: true, message: "Password reset successful. You can now log in." });
    } catch (err) {
      console.error("Reset password error:", err);
      return res.status(500).json({ success: false, message: "Unable to reset password right now." });
    }
  }
);

// PARCEL ROUTES
app.post("/api/parcel", (req, res) => {
  const { from, to, weight, length, width, height, date } = req.body;
  console.log("Received parcel data:", req.body);
  res.json({
    message: "Parcel received successfully!",
    data: { from, to, weight, length, width, height, date },
  });
});

app.get("/api/track/:code", async (req, res) => {
  try {
    const { code } = req.params;
    if (!code) {
      return res.status(400).json({ success: false, message: "Tracking code is required." });
    }

    const parcelRow = await db.getParcelByTrackingCode(code);
    if (!parcelRow) {
      return res.status(404).json({
        success: false,
        message: "Tracking number not found."
      });
    }

    const statusHistory = await db.getStatusHistory(parcelRow.id);
    const parcel = mapParcelRow(parcelRow, statusHistory);
    const latestStatus = statusHistory?.[statusHistory.length - 1] || null;

    return res.json({
      success: true,
      parcel,
      latestStatus
    });
  } catch (err) {
    console.error("Error in /api/track/:code:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

app.get("/api/track", async (req, res) => {
  try {
    const code = (req.query.code || "").toString().trim();
    if (!code) {
      return res.status(400).json({ success: false, message: "Tracking code is required." });
    }

    const parcelRow = await db.getParcelByTrackingCode(code);
    if (!parcelRow) {
      return res.status(404).json({ success: false, message: "Tracking number not found." });
    }

    const statusHistory = await db.getStatusHistory(parcelRow.id);
    const parcel = mapParcelRow(parcelRow, statusHistory);
    const latestStatus = statusHistory?.[statusHistory.length - 1] || null;

    return res.json({ success: true, parcel, latestStatus });
  } catch (err) {
    console.error("Error in /api/track (query):", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

app.post("/api/parcels", requireUserAuth, async (req, res) => {
  try {
    const {
      senderName,
      receiverName,
      from,
      to,
      weight,
      length,
      width,
      height,
      notes
    } = req.body;

    if (!from || !to || !weight) {
      return res.json({
        success: false,
        message: "From, To and Weight are required."
      });
    }

    const trackingCode = generateTrackingCode();
    const now = new Date().toISOString();

    // Calculate shipping cost with discounts
    const pricing = calculateShippingCost(Number(weight) || 0);

    const authedUser = await db.getUserByEmail(req.authUser.email);
    if (!authedUser) {
      return res.status(401).json({ success: false, message: "Authenticated user not found." });
    }

    const parcelRow = await db.createParcel({
      trackingCode,
      userId: authedUser.user_id,
      senderName: senderName || "",
      senderEmail: authedUser.email || "",
      senderPhone: "",
      receiverName: receiverName || "",
      receiverEmail: "",
      receiverPhone: "",
      senderLocation: from,
      receiverLocation: to,
      packageType: "",
      weight: Number(weight) || 0,
      length: Number(length) || 0,
      width: Number(width) || 0,
      height: Number(height) || 0,
      baseCost: pricing.baseCost,
      discountPercentage: pricing.discountPercentage,
      finalCost: pricing.finalCost,
      notes: notes || ""
    });

    await db.addStatusHistory(
      parcelRow.id,
      "Shipment created",
      from,
      "Parcel booked and awaiting pickup."
    );

    const statusHistory = await db.getStatusHistory(parcelRow.id);
    const parcel = mapParcelRow(parcelRow, statusHistory);

    return res.json({
      success: true,
      message: "Parcel created successfully.",
      trackingCode,
      parcel,
      pricing // Return pricing breakdown to frontend
    });
  } catch (err) {
    console.error("Error creating parcel:", err);
    return res.json({ success: false, message: "Server error." });
  }
});

// Payment and Receipt endpoint
app.post("/api/payments", requireUserAuth, async (req, res) => {
  try {
    const {
      trackingCode,
      amount,
      paymentMethod,
      cardDetails
    } = req.body;

    if (!trackingCode || !amount) {
      return res.json({
        success: false,
        message: "Tracking code and amount are required."
      });
    }

    // Find the parcel
    const parcelRow = await db.getParcelByTrackingCode(trackingCode);
    if (!parcelRow) {
      return res.json({
        success: false,
        message: "Parcel not found."
      });
    }

    const authedUser = await db.getUserByEmail(req.authUser.email);
    if (!authedUser || parcelRow.user_id !== authedUser.user_id) {
      return res.status(403).json({ success: false, message: "Forbidden: parcel does not belong to authenticated user." });
    }

    // Generate receipt
    const receiptNumber = generateReceiptNumber();
    const now = new Date().toISOString();

    await db.createReceipt({
      receiptNumber,
      parcelId: parcelRow.id,
      userEmail: authedUser.email,
      amount: parseFloat(amount),
      paymentMethod: paymentMethod || "Card"
    });

    const parcel = mapParcelRow(parcelRow, await db.getStatusHistory(parcelRow.id));
    const receipt = {
      receiptNumber,
      trackingCode,
      userEmail: authedUser.email,
      amount: parseFloat(amount),
      paymentMethod: paymentMethod || "Card",
      cardLast4: cardDetails?.last4 || "****",
      parcelDetails: {
        from: parcel.from,
        to: parcel.to,
        weight: parcel.weight,
        senderName: parcel.senderName,
        receiverName: parcel.receiverName
      },
      pricing: parcel.pricing,
      paidAt: now,
      status: "Paid"
    };

    return res.json({
      success: true,
      message: "Payment successful!",
      receiptNumber,
      receipt
    });
  } catch (err) {
    console.error("Error processing payment:", err);
    return res.json({ success: false, message: "Payment processing failed." });
  }
});

// Get user receipts
app.get("/api/receipts/:email", requireUserAuth, async (req, res) => {
  try {
    const { email } = req.params;
    if ((email || "").trim().toLowerCase() !== (req.authUser.email || "").toLowerCase()) {
      return res.status(403).json({ success: false, message: "Forbidden: cannot access another user's receipts." });
    }
    const userReceipts = await db.getReceiptsByEmail(email);

    return res.json({
      success: true,
      receipts: userReceipts
    });
  } catch (err) {
    console.error("Error fetching receipts:", err);
    return res.json({ success: false, message: "Server error." });
  }
});

// Get user parcels
app.get("/api/parcels/user/:email", requireUserAuth, async (req, res) => {
  try {
    const { email } = req.params;
    if ((email || "").trim().toLowerCase() !== (req.authUser.email || "").toLowerCase()) {
      return res.status(403).json({ success: false, message: "Forbidden: cannot access another user's parcels." });
    }
    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.json({ success: false, message: "User not found." });
    }

    const parcelRows = await db.getParcelsByUserId(user.user_id);
    const parcels = await Promise.all(
      parcelRows.map(async (row) => mapParcelRow(row, await db.getStatusHistory(row.id)))
    );

    return res.json({
      success: true,
      parcels,
      user: {
        fullName: user.full_name,
        email: user.email,
        suiteNumber: user.suite_number
      }
    });
  } catch (err) {
    console.error("Error fetching user parcels:", err);
    return res.json({ success: false, message: "Server error." });
  }
});

app.post("/api/parcels/:code/status", requireStaffAuthOrLocal, async (req, res) => {
  try {
    const { code } = req.params;
    const { status, location, remark } = req.body;

    if (!status) {
      return res.json({ success: false, message: "Status is required." });
    }

    const parcelRow = await db.getParcelByTrackingCode(code);
    if (!parcelRow) {
      return res.json({ success: false, message: "Parcel not found." });
    }

    await db.addStatusHistory(
      parcelRow.id,
      status,
      location || "",
      remark || ""
    );
    await db.updateParcelStatus(parcelRow.id, status);

    const parcel = mapParcelRow(parcelRow, await db.getStatusHistory(parcelRow.id));

    return res.json({
      success: true,
      message: "Status updated.",
      parcel
    });
  } catch (err) {
    console.error("Error adding status:", err);
    return res.json({ success: false, message: "Server error." });
  }
});

// ================= STAFF & INVESTOR HUB =================
const DEFAULT_STAFF_PASSWORD = (process.env.ADMIN_PASSWORD || "").trim();

const STAFF_MEMBERS = [
  // Management / Admin
  { id: "ADM001", name: "Aisha Khan",       role: "Head of Operations",   department: "Management" },
  { id: "ADM002", name: "Omar Farouk",      role: "Operations Manager",   department: "Management" },

  // Dispatch / Routing
  { id: "DSP001", name: "Lara Martins",     role: "Dispatch Supervisor",  department: "Dispatch" },
  { id: "DSP002", name: "Faisal Rahman",    role: "Route Planner",        department: "Dispatch" },

  // Warehouse
  { id: "WH001",  name: "Ahmed Ali",        role: "Warehouse Manager",    department: "Warehouse" },
  { id: "WH002",  name: "Maryam Yusuf",     role: "Inventory Officer",    department: "Warehouse" },

  // Customer Service
  { id: "CS001",  name: "Joy Okafor",       role: "Customer Service Lead", department: "Customer Service" },
  { id: "CS002",  name: "Bilal Hassan",     role: "Customer Support",      department: "Customer Service" },

  // Finance / Billing
  { id: "FIN001", name: "Rita Martins",     role: "Finance & Billing Officer", department: "Finance" },

  // IT / Systems
  { id: "IT001",  name: "Khaled Hussein",   role: "IT & Systems Support", department: "IT" },

  // Fleet / Drivers / Riders
  { id: "DRV001", name: "Samuel John",      role: "Senior Driver",        department: "Fleet" },
  { id: "DRV002", name: "Imran Khan",       role: "Rider",                department: "Fleet" },

  // Investor Hub – treated as a "staff" role
  { id: "INV001", name: "ParcelLink Investor Hub", role: "Investor",      department: "Investors" }
];

const STAFF_ACCOUNT_TYPE_META = {
  admin: {
    prefix: "ADM",
    minimumCounter: 2,
    defaultRole: "Administrator",
    defaultDepartment: "Management"
  },
  investor: {
    prefix: "INV",
    minimumCounter: 1,
    defaultRole: "Investor",
    defaultDepartment: "Investors"
  }
};

const ALLOW_LEGACY_STAFF_LOGIN = ["1", "true", "yes"].includes(
  String(process.env.ALLOW_LEGACY_STAFF_LOGIN || "").toLowerCase()
);

function resolveStaffPassword(staffId) {
  const normalizedStaffId = (staffId || "").trim().toUpperCase();
  const specificKey = `STAFF_PASSWORD_${normalizedStaffId}`;
  const legacySpecificKey = `STAFF_PASS_${normalizedStaffId}`;
  const specificPassword = process.env[specificKey] || process.env[legacySpecificKey];

  if (specificPassword && String(specificPassword).trim()) {
    return String(specificPassword).trim();
  }

  return DEFAULT_STAFF_PASSWORD;
}

function validateProvisionKey(providedKey) {
  const provisioningSecret = (process.env.STAFF_PROVISION_KEY || process.env.ADMIN_PASSWORD || "").trim();
  if (!provisioningSecret) {
    return {
      ok: false,
      status: 500,
      message: "Staff provisioning is not configured on this environment."
    };
  }

  const providedProvisionKey = String(providedKey || "").trim();
  if (providedProvisionKey !== provisioningSecret) {
    return {
      ok: false,
      status: 403,
      message: "Invalid provisioning key."
    };
  }

  return { ok: true };
}

function hasStaffAccessManagerPrivileges(staffPayload) {
  if (!staffPayload) return false;

  const accountType = String(staffPayload.accountType || "").trim().toLowerCase();
  const role = String(staffPayload.role || "").trim().toLowerCase();
  const department = String(staffPayload.department || "").trim().toLowerCase();

  if (accountType === "investor" || role === "investor" || department === "investors") {
    return false;
  }

  if (role.includes("head") || role.includes("admin") || role.includes("manager")) {
    return true;
  }

  return department === "management" || department === "operations";
}

function requireStaffManagerOrProvisionKey(req, res, next) {
  const token = getBearerToken(req);
  const staffPayload = verifyAuthToken(token, "staff");

  if (staffPayload?.staffId) {
    if (hasStaffAccessManagerPrivileges(staffPayload)) {
      req.authStaff = staffPayload;
      req.staffManagerAuthMethod = "staff-token";
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Your staff account is not permitted to manage staff access."
    });
  }

  const providedProvisionKey = String(
    req.body?.provisionKey || req.headers["x-provision-key"] || ""
  ).trim();

  const provisionValidation = validateProvisionKey(providedProvisionKey);
  if (!provisionValidation.ok) {
    return res.status(provisionValidation.status).json({
      success: false,
      message: provisionValidation.message
    });
  }

  req.staffManagerAuthMethod = "provision-key";
  return next();
}


app.post(
  "/api/staff/register",
  requireStaffManagerOrProvisionKey,
  [
    body("fullName").trim().isLength({ min: 2, max: 120 }).withMessage("Full name is required."),
    body("email").trim().isEmail().withMessage("A valid email is required."),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters."),
    body("accountType").trim().toLowerCase().isIn(["admin", "investor"]).withMessage("Account type must be admin or investor."),
    body("provisionKey").optional({ checkFalsy: true }).trim(),
    body("role").optional({ checkFalsy: true }).trim().isLength({ min: 2, max: 120 }).withMessage("Role must be between 2 and 120 characters."),
    body("department").optional({ checkFalsy: true }).trim().isLength({ min: 2, max: 120 }).withMessage("Department must be between 2 and 120 characters.")
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
          message: "Please provide valid staff registration details."
        });
      }

      const normalizedName = String(req.body.fullName || "").trim();
      const normalizedEmail = String(req.body.email || "").trim().toLowerCase();
      const normalizedAccountType = String(req.body.accountType || "").trim().toLowerCase();

      const accountMeta = STAFF_ACCOUNT_TYPE_META[normalizedAccountType];
      if (!accountMeta) {
        return res.status(400).json({ success: false, message: "Unsupported account type." });
      }

      const existingStaff = await db.getStaffAccountByEmail(normalizedEmail);
      if (existingStaff) {
        return res.status(409).json({
          success: false,
          message: "A staff account with this email already exists.",
          data: {
            staffId: existingStaff.staff_id,
            accountType: existingStaff.account_type
          }
        });
      }

      const normalizedRole = normalizedAccountType === "investor"
        ? accountMeta.defaultRole
        : (String(req.body.role || "").trim() || accountMeta.defaultRole);

      const normalizedDepartment = normalizedAccountType === "investor"
        ? accountMeta.defaultDepartment
        : (String(req.body.department || "").trim() || accountMeta.defaultDepartment);

      const passwordHash = await bcrypt.hash(String(req.body.password || ""), 10);

      const createdStaff = await db.createStaffAccount({
        prefix: accountMeta.prefix,
        minimumCounter: accountMeta.minimumCounter,
        accountType: normalizedAccountType,
        fullName: normalizedName,
        email: normalizedEmail,
        passwordHash,
        role: normalizedRole,
        department: normalizedDepartment,
        status: "active"
      });

      sendStaffAccessEmail(normalizedEmail, normalizedName, createdStaff.staff_id, normalizedAccountType).catch(() => {});

      return res.status(201).json({
        success: true,
        message: `${normalizedAccountType === "investor" ? "Investor" : "Admin"} account created successfully.`,
        data: {
          staffId: createdStaff.staff_id,
          fullName: createdStaff.full_name,
          email: createdStaff.email,
          role: createdStaff.role,
          department: createdStaff.department,
          accountType: createdStaff.account_type,
          createdAt: createdStaff.created_at
        }
      });
    } catch (err) {
      console.error("Staff registration error:", err);
      return res.status(500).json({ success: false, message: "Unable to register staff account right now." });
    }
  }
);

app.post(
  "/api/staff/accounts/search",
  requireStaffManagerOrProvisionKey,
  [
    body("provisionKey").optional({ checkFalsy: true }).trim(),
    body("accountType").optional({ checkFalsy: true }).trim().toLowerCase().isIn(["all", "admin", "investor"]).withMessage("Account type must be all, admin, or investor."),
    body("search").optional({ checkFalsy: true }).trim().isLength({ max: 120 }).withMessage("Search value is too long."),
    body("limit").optional({ checkFalsy: true }).isInt({ min: 1, max: 200 }).withMessage("Limit must be between 1 and 200.")
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
          message: "Please provide valid staff search details."
        });
      }

      const accountTypeRaw = String(req.body.accountType || "all").trim().toLowerCase();
      const accountType = accountTypeRaw === "all" ? "" : accountTypeRaw;
      const searchTerm = String(req.body.search || "").trim();
      const limit = req.body.limit ? Number(req.body.limit) : 50;

      const rows = await db.listStaffAccounts({
        accountType,
        search: searchTerm,
        limit
      });

      const accounts = rows.map((row) => ({
        staffId: row.staff_id,
        accountType: row.account_type,
        fullName: row.full_name,
        email: row.email,
        role: row.role,
        department: row.department,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));

      return res.json({
        success: true,
        message: "Staff accounts loaded successfully.",
        data: {
          count: accounts.length,
          accounts
        }
      });
    } catch (err) {
      console.error("Staff account search error:", err);
      return res.status(500).json({ success: false, message: "Unable to load staff accounts right now." });
    }
  }
);

app.post(
  "/api/staff/reset-password",
  requireStaffManagerOrProvisionKey,
  [
    body("staffId").trim().isLength({ min: 3, max: 20 }).withMessage("Staff ID is required."),
    body("newPassword").isLength({ min: 8 }).withMessage("New password must be at least 8 characters."),
    body("provisionKey").optional({ checkFalsy: true }).trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
          message: "Please provide valid password reset details."
        });
      }

      const normalizedStaffId = String(req.body.staffId || "").trim().toUpperCase();
      const existingStaff = await db.getStaffAccountByStaffId(normalizedStaffId);
      if (!existingStaff) {
        return res.status(404).json({
          success: false,
          message: "Staff account not found."
        });
      }

      const newPasswordHash = await bcrypt.hash(String(req.body.newPassword || ""), 10);
      const updatedStaff = await db.updateStaffAccountPassword(normalizedStaffId, newPasswordHash);
      if (!updatedStaff) {
        return res.status(500).json({
          success: false,
          message: "Unable to reset password right now."
        });
      }

      return res.json({
        success: true,
        message: "Staff password reset successful.",
        data: {
          staffId: updatedStaff.staff_id,
          fullName: updatedStaff.full_name,
          updatedAt: updatedStaff.updated_at
        }
      });
    } catch (err) {
      console.error("Staff password reset error:", err);
      return res.status(500).json({ success: false, message: "Unable to reset password right now." });
    }
  }
);


// ================= STAFF LOGIN ROUTE =================
app.post("/api/staff-login", async (req, res) => {
  try {
    const { staffId, password } = req.body;

    if (!staffId || !password) {
      return res.status(400).json({
        success: false,
        message: "Staff ID and password are required."
      });
    }

    const idNormalized = staffId.trim().toUpperCase();
    const providedPassword = String(password || "").trim();

    const registeredStaff = await db.getStaffAccountByStaffId(idNormalized);
    if (registeredStaff) {
      const staffStatus = String(registeredStaff.status || "active").trim().toLowerCase();
      if (staffStatus && staffStatus !== "active") {
        return res.status(403).json({
          success: false,
          message: "This staff account is currently inactive."
        });
      }

      const storedPasswordHash = registeredStaff.password_hash || registeredStaff.passwordHash;
      if (!storedPasswordHash) {
        console.error("Staff login error: DB staff record has no password hash", { staffId: idNormalized });
        return res.status(500).json({ success: false, message: "Server error." });
      }

      const passwordMatch = await bcrypt.compare(providedPassword, storedPasswordHash);
      if (!passwordMatch) {
        return res.status(400).json({
          success: false,
          message: "Incorrect password."
        });
      }

      return res.json({
        success: true,
        message: "Login successful.",
        staff: {
          id: registeredStaff.staff_id,
          name: registeredStaff.full_name,
          role: registeredStaff.role,
          department: registeredStaff.department,
          accountType: registeredStaff.account_type,
          email: registeredStaff.email
        },
        token: signAuthToken(
          {
            staffId: registeredStaff.staff_id,
            accountType: registeredStaff.account_type,
            role: registeredStaff.role,
            department: registeredStaff.department,
            email: registeredStaff.email
          },
          "staff"
        )
      });
    }

    const hasProvisionedAccounts = await db.hasAnyStaffAccounts();
    const allowLegacyFallback = ALLOW_LEGACY_STAFF_LOGIN || !hasProvisionedAccounts;

    if (!allowLegacyFallback) {
      return res.status(400).json({
        success: false,
        message: "Invalid Staff ID."
      });
    }

    const staff = STAFF_MEMBERS.find(s => s.id === idNormalized);
    if (!staff) {
      return res.status(400).json({
        success: false,
        message: "Invalid Staff ID."
      });
    }

    const expectedPassword = resolveStaffPassword(idNormalized);
    if (!expectedPassword) {
      console.error("Staff login configuration error: ADMIN_PASSWORD is not set and no specific staff password found.", { staffId: idNormalized });
      return res.status(500).json({
        success: false,
        message: "Staff login is not configured on this environment."
      });
    }

    if (providedPassword !== expectedPassword) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password."
      });
    }

    return res.json({
      success: true,
      message: "Login successful.",
      staff: {
        id: staff.id,
        name: staff.name,
        role: staff.role,
        department: staff.department,
        accountType: staff.department === "Investors" ? "investor" : "admin"
      },
      token: signAuthToken(
        {
          staffId: staff.id,
          accountType: staff.department === "Investors" ? "investor" : "admin",
          role: staff.role,
          department: staff.department
        },
        "staff"
      )
    });
  } catch (err) {
    console.error("Staff login error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});



// ================= PAGE ROUTES =================
app.get("/", (req, res) => {
  return sendHtmlWithI18n(res, path.join(ROOT, "index.html"));
});

app.get("/login", (req, res) => {
  return sendHtmlWithI18n(res, path.join(ROOT, "auth", "login.html"));
});

app.get("/register", (req, res) => {
  return sendHtmlWithI18n(res, path.join(ROOT, "auth", "register.html"));
});

app.get("/forgot-password", (req, res) => {
  return sendHtmlWithI18n(res, path.join(ROOT, "auth", "forgot-password.html"));
});

app.get("/reset-password", (req, res) => {
  return sendHtmlWithI18n(res, path.join(ROOT, "auth", "reset-password.html"));
});

app.get("/dashboard", (req, res) => {
  return sendHtmlWithI18n(res, path.join(ROOT, "dashboard.html"));
});

app.get("/staff", (req, res) => {
  return sendHtmlWithI18n(res, path.join(ROOT, "staff.html"));
});

app.get("/investor", (req, res) => {
  return sendHtmlWithI18n(res, path.join(ROOT, "investor.html"));
});

app.get("/investor-dashboard", (req, res) => {
  return sendHtmlWithI18n(res, path.join(ROOT, "investor-dashboard.html"));
});

app.use(async (req, res, next) => {
  if (req.method !== "GET") return next();

  const urlPath = req.path.toLowerCase();
  const skipPrefixes = ["/api/", "/js/", "/css/", "/images/", "/fonts/", "/favicon"];
  if (skipPrefixes.some(prefix => urlPath.startsWith(prefix))) return next();

  const fileExtension = path.extname(req.path || "").toLowerCase();
  if (fileExtension && fileExtension !== ".html") return next();

  try {
    const cleanPath = (req.path || "/").replace(/^\/+|\/+$/g, "");
    const relativePath = cleanPath ? cleanPath : "index.html";
    const htmlPath = relativePath.endsWith(".html") ? relativePath : `${relativePath}.html`;
    const targetPath = path.join(ROOT, htmlPath);

    const normalizedRoot = path.normalize(ROOT + path.sep);
    const normalizedTarget = path.normalize(targetPath);
    if (!normalizedTarget.startsWith(normalizedRoot)) return next();

    const stat = await fs.stat(normalizedTarget).catch(() => null);
    if (stat && stat.isFile()) {
      return sendHtmlWithI18n(res, normalizedTarget);
    }
  } catch (_) {
    // continue to remaining middleware
  }

  return next();
});

// Favicon handler
app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.join(ROOT, "images", "favicon", "favicon-32x32.png"));
});

// ================= STATIC FILES =================
app.use("/auth", express.static(path.join(ROOT, "auth")));
app.use("/css", express.static(path.join(ROOT, "css")));
app.use("/js", express.static(path.join(ROOT, "js")));
app.use("/images", express.static(path.join(ROOT, "images")));
app.use("/fonts", express.static(path.join(ROOT, "fonts")));
app.use(express.static(ROOT));

// ================= DATABASE RESET (ADMIN ONLY) =================
app.post("/api/admin/db/reset", async (req, res) => {
  try {
    // Security: require ADMIN_PASSWORD in header or body
    const adminPassword = (process.env.ADMIN_PASSWORD || "").trim();
    if (!adminPassword) {
      return res.status(503).json({
        success: false,
        message: "Database reset is not configured on this server."
      });
    }

    const providedPassword = (
      req.headers["x-admin-password"] ||
      req.body.adminPassword ||
      ""
    ).toString().trim();

    if (providedPassword !== adminPassword) {
      console.warn("[Admin Reset] Unauthorized reset attempt - invalid credentials");
      return res.status(403).json({
        success: false,
        message: "Unauthorized. Invalid admin password."
      });
    }

    console.log("[Admin Reset] Starting database reset...");

    // Tables to clear in dependency order
    const tables = [
      "password_reset_tokens",
      "parcel_status_history",
      "receipts",
      "parcels",
      "career_applications",
      "investor_interest_submissions",
      "partners",
      "staff_accounts",
      "users"
    ];

    for (const table of tables) {
      try {
        await db.query(`TRUNCATE TABLE ${table} CASCADE;`);
        console.log(`[Admin Reset] ✓ Cleared ${table}`);
      } catch (err) {
        // Table might not exist, continue
        console.log(`[Admin Reset] ⊘ ${table} not found (skipped)`);
      }
    }

    console.log("[Admin Reset] ✓ All data cleared successfully!");
    return res.json({
      success: true,
      message: "Database reset complete. All user data has been cleared. Schema remains intact.",
      timestamp: new Date().toISOString(),
      tablesCleared: tables.length
    });
  } catch (err) {
    console.error("[Admin Reset] ✗ Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Database reset failed.",
      error: err.message
    });
  }
});

// ================= FALLBACK =================
app.use(async (req, res, next) => {
  if (req.method !== "GET") return next();
  const urlPath = req.path.toLowerCase();
  const skipPrefixes = ["/api/", "/js/", "/css/", "/images/", "/fonts/", "/auth/", "/favicon"];
  if (skipPrefixes.some(p => urlPath.startsWith(p))) return next();

  try {
    const maybeHtml = path.join(ROOT, req.path.endsWith(".html") ? req.path : req.path + ".html");
    const stat = await fs.stat(maybeHtml).catch(() => null);
    if (stat && stat.isFile()) {
      return sendHtmlWithI18n(res, maybeHtml);
    }
  } catch (_) { /* ignored */ }

  return sendHtmlWithI18n(res, path.join(ROOT, "index.html"));
});

// ================= START SERVER =================
app.listen(PORT, () => {
  const url = `http://127.0.0.1:${PORT}`;
  console.log(`🚀 Server running at ${url}`);
  
  // Print registered routes
  const routes = [];
  if (app._router && app._router.stack) {
    app._router.stack.forEach(layer => {
      if (layer.route && layer.route.path) {
        const methods = Object.keys(layer.route.methods).map(m => m.toUpperCase()).join(',');
        routes.push(`${methods} ${layer.route.path}`);
      }
    });
  }
  console.log("Registered routes:\n", routes.join("\n"));

});
