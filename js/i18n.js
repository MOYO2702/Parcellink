(() => {
  const STORAGE_KEY = "parcellink_language";
  const FALLBACK_LANGUAGE = "en";
  const SUPPORTED_LANGUAGES = ["en", "ar"];
  const GOOGLE_TRANSLATE_CONTAINER_ID = "google_translate_element";
  const GOOGLE_TRANSLATE_SCRIPT_ID = "parcellink-google-translate-script";
  const RUNTIME_STYLE_ID = "parcellink-i18n-runtime-style";

  const dictionaries = {
    en: {
      "meta.title": "ParcelLink",
      "prompt.title": "Choose your language",
      "prompt.message": "Would you like to view ParcelLink in Arabic?",
      "prompt.arabic": "Arabic",
      "prompt.english": "English",
      "switch.label": "Language",
      "switch.en": "EN",
      "switch.ar": "AR",

      "promo.discount10": "🔥 10% discount on all freights",
      "promo.discount20": "🚚 20% discount if parcel is greater than 100kg",

      "top.login": "Login",
      "top.register": "Register",

      "nav.home": "HOME",
      "nav.send": "SEND",
      "nav.track": "TRACK",
      "nav.services": "OUR SERVICES",
      "nav.help": "HELP",
      "nav.careers": "CAREERS",
      "nav.admin": "ADMINISTRATIVE",
      "nav.clientzone": "CLIENT ZONE",

      "hero.title": "The Cheapest Parcel Delivery In The UAE.",
      "tabs.international": "Send Parcel International",
      "tabs.uae": "Send UAE to UAE",
      "tabs.corporate": "Corporate SME’s",

      "forms.export": "Export",
      "forms.import": "Import",
      "forms.from": "From",
      "forms.to": "To",
      "forms.package1": "Package 1",
      "forms.weight": "Weight (kg)",
      "forms.length": "Length (cm)",
      "forms.width": "Width (cm)",
      "forms.height": "Height (cm)",
      "forms.addPackage": "➕ Add another package",
      "forms.calcShipping": "Calculate Shipping",
      "forms.sendUae": "Send UAE To UAE",
      "forms.intercity": "Inter-City",
      "forms.express": "Express",
      "forms.pickupLocation": "Pickup Location",
      "forms.deliveryLocation": "Delivery Location",
      "forms.cityDubai": "Dubai",
      "forms.cityAbuDhabi": "Abu Dhabi",
      "forms.citySharjah": "Sharjah",
      "forms.cityAjman": "Ajman",
      "forms.countryUK": "United Kingdom",
      "forms.countryUSA": "USA",
      "forms.packageType": "Package Type",
      "forms.smallParcel": "Small Parcel",
      "forms.mediumParcel": "Medium Parcel",
      "forms.largeParcel": "Large Parcel",
      "forms.document": "Document",
      "forms.calcUae": "Calculate UAE Shipping",
      "forms.corporateNotice": "Corporate SME quotes coming soon. Please use International or UAE-to-UAE for now.",
      "forms.package": "Package",
      "forms.remove": "Remove",

      "logistics.title": "Reliable Logistics Services You Can Trust",
      "logistics.desc": "Whether you're shipping across the UAE or sending parcels worldwide, ParcelLink ensures smooth, fast, and secure deliveries. Our logistics network operates with precision, giving you confidence that every shipment is handled professionally from pick-up to drop-off.",

      "services.title": "Our Value-Added Logistics Services",
      "services.protectTitle": "Protect Your Shipments",
      "services.protectDesc": "Secure your parcels against loss, damage, and unexpected transit risks with our comprehensive freight insurance solutions.",
      "services.protectBtn": "Get Protected",
      "services.customsTitle": "Simplify Customs Duties",
      "services.customsDesc": "Experience faster international shipping with our bonded warehousing and duty-free customs clearance solutions.",
      "services.customsBtn": "Clear Shipments Faster",
      "services.storageTitle": "Optimize Storage Solutions",
      "services.storageDesc": "Store, manage, and control your inventory with real-time warehouse visibility and smart storage technology.",
      "services.storageBtn": "View Storage Options",
      "services.transferTitle": "Streamline Transfers",
      "services.transferDesc": "Accelerate your supply chain using our efficient cross-docking and cargo transfer services.",
      "services.transferBtn": "Speed Up Delivery",
      "services.insightsTitle": "Gain Tailored Insights",
      "services.insightsDesc": "Monitor shipments, track performance, and analyze logistics data with our intelligent real-time dashboard.",
      "services.insightsBtn": "Open Live Dashboard",
      "services.packagingTitle": "Ensure Secure Packaging",
      "services.packagingDesc": "Protect your goods using professional packaging engineered for impact resistance and long-distance shipping.",
      "services.packagingBtn": "Pack & Ship Securely",

      "stores.title": "Shop Your Favorite UAE & GCC Stores",
      "stores.subtitle": "Fast Delivery • Best Rates • Zero Hassle",
      "stores.button": "Explore All Supported Stores",

      "footer.desc": "Your trusted logistics partner delivering excellence across the UAE and worldwide with speed, reliability, and care.",
      "footer.company": "Company",
      "footer.services": "Services",
      "footer.support": "Support",
      "footer.getInTouch": "Get In Touch",
      "footer.aboutUs": "About Us",
      "footer.careers": "Careers",
      "footer.ourServices": "Our Services",
      "footer.press": "Press & Media",
      "footer.blog": "Blog",
      "footer.sendParcel": "Send Parcel",
      "footer.trackShipment": "Track Shipment",
      "footer.expressDelivery": "Express Delivery",
      "footer.internationalShipping": "International Shipping",
      "footer.freightCargo": "Freight & Cargo",
      "footer.helpCenter": "Help Center",
      "footer.clientZone": "Client Zone",
      "footer.shippingCalculator": "Shipping Calculator",
      "footer.termsConditions": "Terms & Conditions",
      "footer.privacyPolicy": "Privacy Policy",
      "footer.address": "Business Bay, Dubai<br>United Arab Emirates",
      "footer.rights": "© 2025 ParcelLink Logistics. All Rights Reserved.",
      "footer.terms": "Terms",
      "footer.privacy": "Privacy",
      "footer.cookies": "Cookies",

      "ui.calculating": "Calculating... Please wait.",
      "ui.quoteCalculated": "Quote calculated",
      "ui.packages": "packages",
      "ui.estimatedShipping": "Estimated shipping cost from",
      "ui.to": "to",
      "ui.backendError": "Error: Could not connect to backend.",

      "track.errorTitle": "Error",
      "track.noTrackingInfo": "No tracking information found.",
      "track.lastUpdated": "Last updated:",
      "track.noStatus": "No status",
      "track.historyTitle": "Tracking History",
      "track.noEvents": "No events yet",
      "track.unableFetch": "Unable to fetch tracking info",
      "track.enterTracking": "Please enter a tracking number",
      "track.loading": "Loading tracking information…"
    },
    ar: {
      "meta.title": "بارسل لينك",
      "prompt.title": "اختر لغتك",
      "prompt.message": "هل ترغب في عرض موقع بارسل لينك باللغة العربية؟",
      "prompt.arabic": "العربية",
      "prompt.english": "الإنجليزية",
      "switch.label": "اللغة",
      "switch.en": "EN",
      "switch.ar": "AR",

      "promo.discount10": "🔥 خصم 10% على جميع الشحنات",
      "promo.discount20": "🚚 خصم 20% إذا كان وزن الشحنة أكثر من 100 كجم",

      "top.login": "تسجيل الدخول",
      "top.register": "إنشاء حساب",

      "nav.home": "الرئيسية",
      "nav.send": "إرسال",
      "nav.track": "تتبع",
      "nav.services": "خدماتنا",
      "nav.help": "المساعدة",
      "nav.careers": "الوظائف",
      "nav.admin": "الإدارة",
      "nav.clientzone": "منطقة العملاء",

      "hero.title": "أرخص خدمة توصيل طرود في الإمارات.",
      "tabs.international": "إرسال طرد دولي",
      "tabs.uae": "إرسال داخل الإمارات",
      "tabs.corporate": "حلول الشركات الصغيرة والمتوسطة",

      "forms.export": "تصدير",
      "forms.import": "استيراد",
      "forms.from": "من",
      "forms.to": "إلى",
      "forms.package1": "الطرد 1",
      "forms.weight": "الوزن (كجم)",
      "forms.length": "الطول (سم)",
      "forms.width": "العرض (سم)",
      "forms.height": "الارتفاع (سم)",
      "forms.addPackage": "➕ إضافة طرد آخر",
      "forms.calcShipping": "احسب تكلفة الشحن",
      "forms.sendUae": "إرسال داخل الإمارات",
      "forms.intercity": "بين المدن",
      "forms.express": "سريع",
      "forms.pickupLocation": "موقع الاستلام",
      "forms.deliveryLocation": "موقع التسليم",
      "forms.cityDubai": "دبي",
      "forms.cityAbuDhabi": "أبوظبي",
      "forms.citySharjah": "الشارقة",
      "forms.cityAjman": "عجمان",
      "forms.countryUK": "المملكة المتحدة",
      "forms.countryUSA": "الولايات المتحدة",
      "forms.packageType": "نوع الطرد",
      "forms.smallParcel": "طرد صغير",
      "forms.mediumParcel": "طرد متوسط",
      "forms.largeParcel": "طرد كبير",
      "forms.document": "مستند",
      "forms.calcUae": "احسب شحن الإمارات",
      "forms.corporateNotice": "عروض الشركات الصغيرة والمتوسطة قريبًا. يرجى استخدام الشحن الدولي أو الشحن داخل الإمارات حاليًا.",
      "forms.package": "الطرد",
      "forms.remove": "إزالة",

      "logistics.title": "خدمات لوجستية موثوقة يمكنك الاعتماد عليها",
      "logistics.desc": "سواء كنت تشحن داخل الإمارات أو إلى أنحاء العالم، تضمن بارسل لينك توصيلًا سلسًا وسريعًا وآمنًا. تعمل شبكتنا اللوجستية بدقة عالية لتمنحك الثقة بأن كل شحنة تتم إدارتها باحتراف من الاستلام حتى التسليم.",

      "services.title": "خدماتنا اللوجستية ذات القيمة المضافة",
      "services.protectTitle": "احمِ شحناتك",
      "services.protectDesc": "أمّن طرودك ضد الفقدان أو التلف والمخاطر غير المتوقعة أثناء النقل عبر حلول التأمين الشاملة لدينا.",
      "services.protectBtn": "احصل على حماية",
      "services.customsTitle": "بسّط الإجراءات الجمركية",
      "services.customsDesc": "استمتع بشحن دولي أسرع مع حلول التخزين الجمركي والتخليص المعفى من الرسوم.",
      "services.customsBtn": "سرّع التخليص",
      "services.storageTitle": "حسّن حلول التخزين",
      "services.storageDesc": "قم بتخزين وإدارة ومتابعة مخزونك برؤية فورية وتقنيات تخزين ذكية.",
      "services.storageBtn": "عرض خيارات التخزين",
      "services.transferTitle": "سهولة نقل الشحنات",
      "services.transferDesc": "سرّع سلسلة الإمداد لديك عبر خدمات النقل والتجميع الفعّالة.",
      "services.transferBtn": "سرّع التسليم",
      "services.insightsTitle": "احصل على رؤى مخصصة",
      "services.insightsDesc": "راقب الشحنات وتتبع الأداء وحلل البيانات اللوجستية عبر لوحة معلومات ذكية وفورية.",
      "services.insightsBtn": "افتح لوحة المعلومات",
      "services.packagingTitle": "تغليف آمن ومحترف",
      "services.packagingDesc": "احمِ بضائعك بتغليف احترافي مصمم لمقاومة الصدمات والشحن لمسافات طويلة.",
      "services.packagingBtn": "غلّف واشحن بأمان",

      "stores.title": "تسوق من أشهر متاجر الإمارات والخليج",
      "stores.subtitle": "توصيل سريع • أفضل الأسعار • بدون تعقيد",
      "stores.button": "استعرض جميع المتاجر المدعومة",

      "footer.desc": "شريكك اللوجستي الموثوق لتوصيل متميز داخل الإمارات وحول العالم بسرعة وموثوقية واهتمام.",
      "footer.company": "الشركة",
      "footer.services": "الخدمات",
      "footer.support": "الدعم",
      "footer.getInTouch": "تواصل معنا",
      "footer.aboutUs": "من نحن",
      "footer.careers": "الوظائف",
      "footer.ourServices": "خدماتنا",
      "footer.press": "الإعلام والصحافة",
      "footer.blog": "المدونة",
      "footer.sendParcel": "إرسال طرد",
      "footer.trackShipment": "تتبع الشحنة",
      "footer.expressDelivery": "توصيل سريع",
      "footer.internationalShipping": "شحن دولي",
      "footer.freightCargo": "الشحن والبضائع",
      "footer.helpCenter": "مركز المساعدة",
      "footer.clientZone": "منطقة العملاء",
      "footer.shippingCalculator": "حاسبة الشحن",
      "footer.termsConditions": "الشروط والأحكام",
      "footer.privacyPolicy": "سياسة الخصوصية",
      "footer.address": "الخليج التجاري، دبي<br>الإمارات العربية المتحدة",
      "footer.rights": "© 2025 بارسل لينك للخدمات اللوجستية. جميع الحقوق محفوظة.",
      "footer.terms": "الشروط",
      "footer.privacy": "الخصوصية",
      "footer.cookies": "ملفات تعريف الارتباط",

      "ui.calculating": "جارٍ الحساب... يرجى الانتظار.",
      "ui.quoteCalculated": "تم حساب السعر",
      "ui.packages": "طرود",
      "ui.estimatedShipping": "تكلفة الشحن التقديرية من",
      "ui.to": "إلى",
      "ui.backendError": "خطأ: تعذر الاتصال بالخادم.",

      "track.errorTitle": "خطأ",
      "track.noTrackingInfo": "لا توجد معلومات تتبع.",
      "track.lastUpdated": "آخر تحديث:",
      "track.noStatus": "لا توجد حالة",
      "track.historyTitle": "سجل التتبع",
      "track.noEvents": "لا توجد تحديثات بعد",
      "track.unableFetch": "تعذر جلب بيانات التتبع",
      "track.enterTracking": "يرجى إدخال رقم التتبع",
      "track.loading": "جارٍ تحميل بيانات التتبع…"
    }
  };

  const literalFallbackAr = {
    "Home": "الرئيسية",
    "Track": "تتبع",
    "Send": "إرسال",
    "Services": "الخدمات",
    "Careers": "الوظائف",
    "Help": "المساعدة",
    "Client Zone": "منطقة العملاء",
    "Admin": "الإدارة",
    "Admin Portal": "بوابة الإدارة",
    "Staff Portal": "بوابة الموظفين",
    "Investor Portal": "بوابة المستثمر",
    "ROI Dashboard": "لوحة عائد الاستثمار",
    "Dashboard": "لوحة التحكم",
    "Login": "تسجيل الدخول",
    "Register": "إنشاء حساب",
    "Logout": "تسجيل الخروج",
    "Welcome": "مرحبًا",
    "Sign In": "تسجيل الدخول",
    "Email": "البريد الإلكتروني",
    "Password": "كلمة المرور",
    "Phone": "الهاتف",
    "Phone Number": "رقم الهاتف",
    "City": "المدينة",
    "Order Status": "حالة الطلب",
    "Track Your Order": "تتبع طلبك",
    "Enter tracking code": "أدخل رمز التتبع",
    "Help Center": "مركز المساعدة",
    "Contact Support": "تواصل مع الدعم",
    "Frequently Asked Questions": "الأسئلة الشائعة",
    "Still need help?": "هل ما زلت بحاجة إلى مساعدة؟",
    "Client Login": "تسجيل دخول العميل",
    "Quick Actions": "إجراءات سريعة",
    "Track Shipments": "تتبع الشحنات",
    "Invoice History": "سجل الفواتير",
    "Download Statements": "تنزيل الكشوفات",
    "Welcome to your Dashboard": "مرحبًا بك في لوحة التحكم",
    "Parcels Sent": "الطرود المرسلة",
    "In Transit": "قيد النقل",
    "Delivered": "تم التسليم",
    "Account Balance": "رصيد الحساب",
    "Create Account": "إنشاء حساب",
    "Forgot password?": "نسيت كلمة المرور؟",
    "Don't have an account?": "ليس لديك حساب؟",
    "Already have an account?": "لديك حساب بالفعل؟",
    "Privacy Policy": "سياسة الخصوصية",
    "Terms & Conditions": "الشروط والأحكام",
    "Partner With ParcelLink": "كن شريكًا مع بارسل لينك",
    "View Services": "عرض الخدمات",
    "Request Partnership": "طلب شراكة",
    "Send a Parcel": "إرسال طرد",
    "Sender Information": "معلومات المرسل",
    "Receiver Information": "معلومات المستلم",
    "Parcel Information": "معلومات الطرد",
    "Sender Name": "اسم المرسل",
    "Receiver Name": "اسم المستلم",
    "Pickup Address": "عنوان الاستلام",
    "Delivery Address": "عنوان التسليم",
    "P.O. Box (optional)": "صندوق بريد (اختياري)",
    "Weight (kg)": "الوزن (كجم)",
    "Parcel Type": "نوع الطرد",
    "Document": "مستند",
    "Small Box": "صندوق صغير",
    "Medium Box": "صندوق متوسط",
    "Large Box": "صندوق كبير",
    "Dimensions (optional)": "الأبعاد (اختياري)",
    "Notes (optional)": "ملاحظات (اختياري)",
    "Submit Shipment": "إرسال الشحنة",
    "2025 ParcelLink Logistics - Fast | Secure | Reliable": "2025 بارسل لينك للخدمات اللوجستية - سريع | آمن | موثوق",
    "© 2026 ParcelLink Logistics. All rights reserved.": "© 2026 بارسل لينك للخدمات اللوجستية. جميع الحقوق محفوظة.",
    "© 2026 ParcelLink - All Rights Reserved": "© 2026 بارسل لينك - جميع الحقوق محفوظة"
  };

  const literalFallbackEn = Object.fromEntries(
    Object.entries(literalFallbackAr).map(([en, ar]) => [ar, en])
  );

  const normalizeLanguage = (value) => {
    const normalized = (value || "").toLowerCase();
    return SUPPORTED_LANGUAGES.includes(normalized) ? normalized : FALLBACK_LANGUAGE;
  };

  const hasStoredPreference = () => {
    try {
      return !!localStorage.getItem(STORAGE_KEY);
    } catch (_) {
      return false;
    }
  };

  const textNodeOriginal = new WeakMap();
  const attrOriginal = new WeakMap();
  let googleTranslateReady = false;
  let pendingGoogleLanguage = null;

  let currentLanguage = (() => {
    try {
      return normalizeLanguage(localStorage.getItem(STORAGE_KEY));
    } catch (_) {
      return FALLBACK_LANGUAGE;
    }
  })();

  const t = (key, fallback = "") => {
    const activeDictionary = dictionaries[currentLanguage] || {};
    const fallbackDictionary = dictionaries[FALLBACK_LANGUAGE] || {};
    return activeDictionary[key] || fallbackDictionary[key] || fallback || "";
  };

  const ensureArabicFont = () => {
    if (document.querySelector('link[data-i18n-font="tajawal"]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap";
    link.setAttribute("data-i18n-font", "tajawal");
    document.head.appendChild(link);
  };

  const injectRuntimeStyles = () => {
    if (document.getElementById(RUNTIME_STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = RUNTIME_STYLE_ID;
    style.textContent = `
      #${GOOGLE_TRANSLATE_CONTAINER_ID} {
        position: fixed;
        left: -9999px;
        top: -9999px;
        width: 1px;
        height: 1px;
        overflow: hidden;
      }
      .goog-te-banner-frame.skiptranslate,
      .goog-te-gadget-icon,
      .goog-logo-link,
      .goog-te-gadget span {
        display: none !important;
      }
      body { top: 0 !important; }
      .goog-te-gadget { font-size: 0 !important; color: transparent !important; }

      .lang-switcher {
        position: fixed !important;
        right: 16px !important;
        top: var(--parcellink-lang-top, 16px) !important;
        bottom: auto !important;
        z-index: 4000;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 10px;
        background: rgba(255, 255, 255, 0.96);
        border: 1px solid #dbe3f0;
        border-radius: 999px;
        box-shadow: 0 10px 30px rgba(2, 8, 23, 0.15);
      }

      .lang-switcher-label {
        font-size: 12px;
        font-weight: 600;
        color: #0f172a;
      }

      .lang-switch-btn {
        border: 1px solid #c7d2fe;
        background: #fff;
        color: #1d6cff;
        border-radius: 999px;
        padding: 4px 10px;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
      }

      .lang-switch-btn.active {
        background: #1d6cff;
        border-color: #1d6cff;
        color: #fff;
      }

      .lang-prompt-overlay {
        position: fixed;
        inset: 0;
        z-index: 5000;
        display: grid;
        place-items: center;
        background: rgba(2, 8, 23, 0.45);
        padding: 18px;
      }

      .lang-prompt-card {
        width: min(520px, 92vw);
        background: #fff;
        border-radius: 14px;
        padding: 22px;
        border: 1px solid #dbe3f0;
        box-shadow: 0 20px 50px rgba(2, 8, 23, 0.25);
      }

      .lang-prompt-title {
        font-size: 1.15rem;
        margin-bottom: 8px;
        color: #0f172a;
      }

      .lang-prompt-message {
        font-size: 0.95rem;
        color: #334155;
        margin-bottom: 16px;
        line-height: 1.55;
      }

      .lang-prompt-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        flex-wrap: wrap;
      }

      .lang-prompt-btn {
        border: 1px solid #dbe3f0;
        background: #fff;
        color: #0f172a;
        border-radius: 8px;
        padding: 10px 14px;
        font-weight: 600;
        cursor: pointer;
      }

      .lang-prompt-btn.primary {
        background: #1d6cff;
        color: #fff;
        border-color: #1d6cff;
      }

      html[lang="ar"] body {
        font-family: 'Tajawal', 'Poppins', sans-serif !important;
      }

      html[dir="rtl"] .lang-switcher {
        right: 16px !important;
        left: auto !important;
      }

      @media (max-width: 768px) {
        .lang-switcher {
          right: 10px !important;
          top: var(--parcellink-lang-top-mobile, 10px) !important;
          gap: 6px;
          padding: 7px 9px;
        }

        html[dir="rtl"] .lang-switcher {
          right: 10px !important;
          left: auto !important;
        }

        .lang-switcher-label {
          display: none;
        }
      }
    `;
    document.head.appendChild(style);
  };

  const isElementVisible = (element) => {
    if (!element) return false;
    const style = window.getComputedStyle(element);
    if (style.display === "none" || style.visibility === "hidden" || parseFloat(style.opacity || "1") === 0) {
      return false;
    }
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  };

  const updateSwitcherPosition = () => {
    const root = document.documentElement;
    if (!root || !document.body) return;

    let desktopTop = 16;
    let mobileTop = 10;

    const blockers = [
      ...document.querySelectorAll(".top-header .auth-links"),
      ...document.querySelectorAll(".top-header")
    ];

    blockers.forEach((element) => {
      if (!isElementVisible(element)) return;
      const rect = element.getBoundingClientRect();

      if (rect.top <= 120) {
        const safeTop = Math.ceil(rect.bottom + 8);
        desktopTop = Math.max(desktopTop, safeTop);
        mobileTop = Math.max(mobileTop, safeTop);
      }
    });

    root.style.setProperty("--parcellink-lang-top", `${desktopTop}px`);
    root.style.setProperty("--parcellink-lang-top-mobile", `${mobileTop}px`);
  };

  const ensureGoogleContainer = () => {
    if (document.getElementById(GOOGLE_TRANSLATE_CONTAINER_ID)) return;
    const container = document.createElement("div");
    container.id = GOOGLE_TRANSLATE_CONTAINER_ID;
    container.setAttribute("aria-hidden", "true");
    document.body.appendChild(container);
  };

  const initializeGoogleTranslate = () => {
    try {
      if (!(window.google && window.google.translate && window.google.translate.TranslateElement)) return;
      ensureGoogleContainer();
      if (!window.__parcelLinkGoogleTranslateInitialized) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,ar",
            autoDisplay: false,
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
          },
          GOOGLE_TRANSLATE_CONTAINER_ID
        );
        window.__parcelLinkGoogleTranslateInitialized = true;
      }
      googleTranslateReady = true;
      if (pendingGoogleLanguage) {
        applyGoogleLanguage(pendingGoogleLanguage);
      }
    } catch (error) {
      console.warn("Google Translate init failed:", error);
    }
  };

  const loadGoogleTranslate = () => {
    ensureGoogleContainer();

    if (window.google && window.google.translate && window.google.translate.TranslateElement) {
      initializeGoogleTranslate();
      return;
    }

    window.googleTranslateElementInit = () => {
      initializeGoogleTranslate();
    };

    if (document.getElementById(GOOGLE_TRANSLATE_SCRIPT_ID)) return;

    const script = document.createElement("script");
    script.id = GOOGLE_TRANSLATE_SCRIPT_ID;
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    script.onerror = () => {
      console.warn("Google Translate script could not be loaded. Falling back to local phrase translation.");
    };
    document.body.appendChild(script);
  };

  const applyGoogleLanguage = (lang, retries = 12) => {
    pendingGoogleLanguage = normalizeLanguage(lang);
    if (!googleTranslateReady) return;

    const combo = document.querySelector(".goog-te-combo");
    if (!combo) {
      if (retries > 0) {
        setTimeout(() => applyGoogleLanguage(lang, retries - 1), 250);
      }
      return;
    }

    const targetValue = pendingGoogleLanguage === "ar" ? "ar" : "en";
    if (combo.value !== targetValue) {
      combo.value = targetValue;
      combo.dispatchEvent(new Event("change"));
    }
  };

  const shouldIgnoreTextNode = (node) => {
    if (!node || !node.parentElement) return true;
    const parent = node.parentElement;
    const tag = (parent.tagName || "").toLowerCase();
    if (["script", "style", "noscript", "textarea"].includes(tag)) return true;
    if (parent.closest(".lang-switcher, .lang-prompt-overlay, #google_translate_element")) return true;
    return false;
  };

  const preserveWhitespace = (originalText, translatedText) => {
    const leading = originalText.match(/^\s*/)?.[0] || "";
    const trailing = originalText.match(/\s*$/)?.[0] || "";
    return `${leading}${translatedText}${trailing}`;
  };

  const replaceLiteralText = (rawText, language) => {
    const sourceMap = language === "ar" ? literalFallbackAr : literalFallbackEn;
    const trimmed = rawText.trim();
    if (!trimmed) return rawText;

    const direct = sourceMap[trimmed];
    if (direct) return preserveWhitespace(rawText, direct);

    let updated = rawText;
    const entries = Object.entries(sourceMap).sort((a, b) => b[0].length - a[0].length);
    for (const [from, to] of entries) {
      if (updated.includes(from)) {
        updated = updated.split(from).join(to);
      }
    }
    return updated;
  };

  const applyLiteralFallbackTranslations = () => {
    if (!document.body) return;

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    textNodes.forEach((node) => {
      if (shouldIgnoreTextNode(node)) return;

      if (!textNodeOriginal.has(node)) {
        textNodeOriginal.set(node, node.nodeValue || "");
      }

      const original = textNodeOriginal.get(node) || "";
      if (currentLanguage === "en") {
        node.nodeValue = original;
      } else {
        node.nodeValue = replaceLiteralText(original, "ar");
      }
    });

    document.querySelectorAll("[placeholder], [title], [aria-label]").forEach((element) => {
      const attrs = ["placeholder", "title", "aria-label"];
      if (!attrOriginal.has(element)) {
        attrOriginal.set(element, {});
      }
      const originalAttrs = attrOriginal.get(element);

      attrs.forEach((attr) => {
        const currentValue = element.getAttribute(attr);
        if (currentValue == null) return;
        if (!(attr in originalAttrs)) {
          originalAttrs[attr] = currentValue;
        }

        if (currentLanguage === "en") {
          element.setAttribute(attr, originalAttrs[attr]);
        } else {
          element.setAttribute(attr, replaceLiteralText(originalAttrs[attr], "ar"));
        }
      });
    });
  };

  const installDialogTranslationWrappers = () => {
    if (window.__parcelLinkDialogTranslationInstalled) return;
    window.__parcelLinkDialogTranslationInstalled = true;

    const nativeAlert = window.alert.bind(window);
    const nativeConfirm = window.confirm.bind(window);
    const nativePrompt = window.prompt.bind(window);

    const translateMessage = (message) => {
      if (typeof message !== "string") return message;
      if (currentLanguage === "en") return message;
      return replaceLiteralText(message, "ar");
    };

    window.alert = (message) => nativeAlert(translateMessage(message));
    window.confirm = (message) => nativeConfirm(translateMessage(message));
    window.prompt = (message, defaultValue) => nativePrompt(translateMessage(message), defaultValue);
  };

  const applyTranslations = () => {
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";
    document.body.classList.toggle("lang-ar", currentLanguage === "ar");
    document.title = t("meta.title", document.title);

    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.getAttribute("data-i18n");
      const translated = t(key, node.textContent.trim());
      if (!translated) return;

      if (node.hasAttribute("data-i18n-html")) {
        node.innerHTML = translated;
      } else {
        node.textContent = translated;
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
      const key = node.getAttribute("data-i18n-placeholder");
      const translated = t(key, node.getAttribute("placeholder") || "");
      if (translated) node.setAttribute("placeholder", translated);
    });

    applyLiteralFallbackTranslations();

    const switcherLabel = document.querySelector("[data-lang-switcher-label]");
    const enButton = document.querySelector("[data-lang-switch='en']");
    const arButton = document.querySelector("[data-lang-switch='ar']");

    if (switcherLabel) switcherLabel.textContent = t("switch.label", "Language");
    if (enButton) {
      enButton.textContent = t("switch.en", "EN");
      enButton.classList.toggle("active", currentLanguage === "en");
    }
    if (arButton) {
      arButton.textContent = t("switch.ar", "AR");
      arButton.classList.toggle("active", currentLanguage === "ar");
    }

    document.dispatchEvent(new CustomEvent("parcellink:language-changed", { detail: { lang: currentLanguage } }));
    applyGoogleLanguage(currentLanguage);
  };

  const setLanguage = (lang, options = { persist: true }) => {
    currentLanguage = normalizeLanguage(lang);
    if (options.persist) {
      try {
        localStorage.setItem(STORAGE_KEY, currentLanguage);
      } catch (_) {
        // ignore storage failures
      }
    }
    applyTranslations();
  };

  const createLanguageSwitcher = () => {
    if (document.querySelector(".lang-switcher")) return;

    const wrapper = document.createElement("div");
    wrapper.className = "lang-switcher";
    wrapper.innerHTML = `
      <span class="lang-switcher-label" data-lang-switcher-label>Language</span>
      <button type="button" class="lang-switch-btn" data-lang-switch="en">EN</button>
      <button type="button" class="lang-switch-btn" data-lang-switch="ar">AR</button>
    `;

    wrapper.querySelectorAll("[data-lang-switch]").forEach((button) => {
      button.addEventListener("click", () => {
        const lang = button.getAttribute("data-lang-switch");
        setLanguage(lang, { persist: true });
      });
    });

    document.body.appendChild(wrapper);
  };

  const createLanguagePrompt = () => {
    if (hasStoredPreference()) return;

    const overlay = document.createElement("div");
    overlay.className = "lang-prompt-overlay";
    overlay.innerHTML = `
      <div class="lang-prompt-card" role="dialog" aria-modal="true" aria-labelledby="lang-prompt-title">
        <h3 id="lang-prompt-title" class="lang-prompt-title">${t("prompt.title", "Choose your language")}</h3>
        <p class="lang-prompt-message">${t("prompt.message", "Would you like to view ParcelLink in Arabic?")}</p>
        <div class="lang-prompt-actions">
          <button type="button" class="lang-prompt-btn primary" data-lang-choice="ar">${t("prompt.arabic", "Arabic")}</button>
          <button type="button" class="lang-prompt-btn" data-lang-choice="en">${t("prompt.english", "English")}</button>
        </div>
      </div>
    `;

    overlay.querySelectorAll("[data-lang-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        const choice = button.getAttribute("data-lang-choice") || FALLBACK_LANGUAGE;
        setLanguage(choice, { persist: true });
        overlay.remove();
      });
    });

    document.body.appendChild(overlay);
  };

  window.ParcelLinkI18n = {
    t,
    setLanguage,
    getLanguage: () => currentLanguage
  };

  document.addEventListener("DOMContentLoaded", () => {
    ensureArabicFont();
    injectRuntimeStyles();
    installDialogTranslationWrappers();
    createLanguageSwitcher();
    loadGoogleTranslate();
    applyTranslations();
    updateSwitcherPosition();
    createLanguagePrompt();

    window.addEventListener("resize", updateSwitcherPosition);
    window.addEventListener("load", updateSwitcherPosition);
    setTimeout(updateSwitcherPosition, 200);
    setTimeout(updateSwitcherPosition, 800);
  });
})();
