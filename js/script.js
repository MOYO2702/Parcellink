/* ============================
   GLOBAL / MENU TOGGLE
============================ */
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.querySelector(".nav-links ul");
  const dropdownItems = document.querySelectorAll(".nav-links .has-dropdown");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => navLinks.classList.toggle("show"));
  }

  dropdownItems.forEach((item) => {
    const toggleBtn = item.querySelector(".nav-dropdown-toggle");
    if (!toggleBtn) return;

    toggleBtn.addEventListener("click", (event) => {
      event.preventDefault();
      const shouldOpen = !item.classList.contains("open");
      dropdownItems.forEach((node) => node.classList.remove("open"));
      if (shouldOpen) item.classList.add("open");
      toggleBtn.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
    });
  });

  document.addEventListener("click", (event) => {
    dropdownItems.forEach((item) => {
      if (!item.contains(event.target)) {
        item.classList.remove("open");
        const toggleBtn = item.querySelector(".nav-dropdown-toggle");
        if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "false");
      }
    });
  });
});

/* ============================
   TAB SWITCHING (HERO FORMS)
============================ */
document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab-btn");
  const forms = document.querySelectorAll(".parcel-form");
  if (!tabs.length || !forms.length) return;

  const showForm = (targetId) => {
    tabs.forEach(t => t.classList.remove("active"));
    const clicked = Array.from(tabs).find(t => t.dataset.target === targetId);
    if (clicked) clicked.classList.add("active");

    forms.forEach(f => f.classList.remove("active"));
    const targetForm = document.getElementById(targetId);
    if (targetForm) targetForm.classList.add("active");
  };

  tabs.forEach(btn => btn.addEventListener("click", () => showForm(btn.dataset.target)));

  // Initial state
  const defaultTab = Array.from(tabs).find(t => t.classList.contains("active")) || tabs[0];
  if (defaultTab) showForm(defaultTab.dataset.target);
});

/* ============================
   PARCEL FORM CALCULATION
   (works for whichever .parcel-form is active)
============================ */
document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("submit", async (e) => {
    const form = e.target;
    if (!form.classList || !form.classList.contains("parcel-form")) return;
    e.preventDefault();

    const responseBox =
      form.id === "international-form" ? document.getElementById("response-international") :
      form.id === "uae-form" ? document.getElementById("response-uae") :
      document.getElementById("response-corporate");

    const selects = form.querySelectorAll("select");
    const from = selects[0]?.value || "";
    const to = selects[1]?.value || "";

    // ✅ COLLECT ALL PACKAGES (not just the first one)
    const packageBlocks = form.querySelectorAll(".package-block");
    let totalWeight = 0, totalLength = 0, totalWidth = 0, totalHeight = 0;
    let packageCount = 0;

    packageBlocks.forEach(block => {
      const inputs = block.querySelectorAll("input");
      const weight = parseFloat(inputs[0]?.value) || 0;
      const length = parseFloat(inputs[1]?.value) || 0;
      const width = parseFloat(inputs[2]?.value) || 0;
      const height = parseFloat(inputs[3]?.value) || 0;

      if (weight > 0 || length > 0 || width > 0 || height > 0) {
        totalWeight += weight;
        totalLength += length;
        totalWidth += width;
        totalHeight += height;
        packageCount++;
      }
    });

    // If no packages entered, use UAE form fields (single package)
    if (packageCount === 0) {
      const inputs = form.querySelectorAll("input");
      totalWeight = parseFloat(inputs[0]?.value) || 0;
      totalLength = parseFloat(inputs[1]?.value) || 0;
      totalWidth = parseFloat(inputs[2]?.value) || 0;
      totalHeight = parseFloat(inputs[3]?.value) || 0;
      packageCount = 1;
    }

    const isUaeToUae = form.id === "uae-form";
    const baseRate = isUaeToUae ? 6 : 10;
    const price = (totalWeight * baseRate) + (totalLength * 0.2) + (totalWidth * 0.15) + (totalHeight * 0.1);

    const parcelData = {
      from, to,
      weight: totalWeight,
      length: totalLength,
      width: totalWidth,
      height: totalHeight,
      packageCount,
      price,
      service: isUaeToUae ? "uae-domestic" : "international"
    };

    if (responseBox) {
      responseBox.style.color = "blue";
      responseBox.textContent = "Calculating... Please wait.";
    }

    try {
      const res = await fetch("/api/parcel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parcelData)
      });
      const data = await res.json();

      if (responseBox) {
        responseBox.style.color = "green";
        responseBox.innerHTML = `
          <strong>${data.message || "Quote calculated"}</strong><br>
          ${packageCount > 1 ? `<strong>${packageCount} packages</strong> - ` : ""}
          Estimated shipping cost from <b>${from}</b> to <b>${to}</b>:
          <span style="color:#8b5cf6;">AED ${price.toFixed(2)}</span>
        `;
      }
    } catch (error) {
      console.error("Parcel submit error:", error);
      if (responseBox) {
        responseBox.style.color = "red";
        responseBox.textContent = "Error: Could not connect to backend.";
      }
    }
  });
});

/* ============================
   IMPORT/EXPORT TOGGLE (International Form)
============================ */
document.addEventListener("DOMContentLoaded", () => {
  const typeButtons = document.querySelectorAll(".type-btn");
  const fromSelect = document.getElementById("intl-from");
  const toSelect = document.getElementById("intl-to");

  if (!typeButtons.length || !fromSelect || !toSelect) return;

  // Lists
  const uaeList = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah"];
  const intlList = ["United Kingdom", "USA", "Canada", "Germany", "France"];

  function updateMode(mode) {
    // Toggle active button styles
    typeButtons.forEach(btn => {
      btn.classList.remove("active");
      if (btn.dataset.type === mode) btn.classList.add("active");
    });

    // Export: UAE → International
    if (mode === "export") {
      fromSelect.innerHTML = uaeList.map(c => `<option>${c}</option>`).join("");
      toSelect.innerHTML = intlList.map(c => `<option>${c}</option>`).join("");
    }

    // Import: International → UAE
    if (mode === "import") {
      fromSelect.innerHTML = intlList.map(c => `<option>${c}</option>`).join("");
      toSelect.innerHTML = uaeList.map(c => `<option>${c}</option>`).join("");
    }
  }

  // Event listeners
  typeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      updateMode(btn.dataset.type);
    });
  });

  // Add Package Button
document.querySelector(".add-package").addEventListener("click", function () {
    const container = document.getElementById("packages-container");

    // Create new package block
    const block = document.createElement("div");
    block.classList.add("package-block");

    block.innerHTML = `
        <button type="button" class="remove-package">×</button>

        <div class="form-row">
            <div class="form-group">
                <label>Weight (kg)</label>
                <input type="number" class="weight" step="0.01" placeholder="0.5">
            </div>

            <div class="form-group">
                <label>Length (cm)</label>
                <input type="number" class="length" step="0.1">
            </div>

            <div class="form-group">
                <label>Width (cm)</label>
                <input type="number" class="width" step="0.1">
            </div>

            <div class="form-group">
                <label>Height (cm)</label>
                <input type="number" class="height" step="0.1">
            </div>
        </div>
    `;

    container.appendChild(block);

    // REMOVE PACKAGE EVENT
    block.querySelector(".remove-package").addEventListener("click", function () {
        block.remove();
    });
});

  // Default
  updateMode("export");
});



/* ============================
   TRACKING UI (consolidated)
============================ */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("trackForm") || document.getElementById("track-form");
  const input = document.getElementById("trackingInput") || document.getElementById("trackingNumber");
  const resultCard = document.getElementById("resultCard") || document.getElementById("trackResult");

  if (!form || !input || !resultCard) {
    console.warn("[track] missing DOM elements:", { form: !!form, input: !!input, resultCard: !!resultCard });
    return;
  }

  if (form.dataset.trackBound === "true") return;
  form.dataset.trackBound = "true";

  function showResult(html, opts = {}) {
    resultCard.innerHTML = html;
    resultCard.hidden = false;
    resultCard.classList.remove("hidden");
    resultCard.classList.add("track-visible");
    resultCard.style.display = "block";
    if (opts.scroll !== false) {
      try { resultCard.scrollIntoView({ behavior: "smooth", block: "center" }); } catch (_) {}
    }
    try { resultCard.focus({ preventScroll: true }); } catch (_) {}
  }

  function showError(msg) {
    showResult(`<div class="track-error"><strong>Error</strong><div style="margin-top:8px">${msg}</div></div>`, { scroll: true });
  }

  async function fetchTrack(code) {
    try {
      const pathUrl = `/api/track/${encodeURIComponent(code)}`;
      let res = await fetch(pathUrl);
      if (!res.ok) {
        res = await fetch(`/api/track?code=${encodeURIComponent(code)}`);
      }
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Server returned ${res.status}: ${text || res.statusText}`);
      }
      const data = await res.json().catch(() => null);
      if (!data || !data.success || !data.parcel) {
        throw new Error(data?.message || "No tracking information found.");
      }

      const parcel = data.parcel;
      const current = data.latestStatus || parcel.statusHistory?.[parcel.statusHistory.length - 1] || null;
      const lastUpdated = current ? new Date(current.timestamp).toLocaleString() : "No updates yet";
      const timeline = (parcel.statusHistory || []).slice().reverse()
        .map(s => `<li class="track-step ${s === current ? "current" : ""}">
            <strong>${s.status}</strong>
            <div class="meta">${s.location || ""} • ${new Date(s.timestamp).toLocaleString()}</div>
            ${s.remark ? `<div class="remark">${s.remark}</div>` : ""}
          </li>`).join("");

      const html = `
        <div class="track-summary">
          <h3>${parcel.trackingCode}</h3>
          <div class="track-meta">${parcel.from || ""} → ${parcel.to || ""}</div>
          <div class="track-current">
            <div><strong>${current ? current.status : "No status"}</strong></div>
            <div class="track-meta">Last updated: ${lastUpdated}</div>
          </div>
        </div>
        <div class="track-history">
          <h4>Tracking History</h4>
          <ul class="track-timeline">${timeline || "<li>No events yet</li>"}</ul>
        </div>`;
      showResult(html);
    } catch (err) {
      console.error("Tracking error:", err);
      showError(err.message || "Unable to fetch tracking info");
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const code = (input.value || "").trim();
    if (!code) {
      showError("Please enter a tracking number");
      return;
    }
    showResult("<div>Loading tracking information…</div>");
    fetchTrack(code);
  });

  // auto-run if ?code= query exists
  try {
    const urlCode = new URL(location.href).searchParams.get("code");
    if (urlCode && !input.value) {
      input.value = urlCode;
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    }
  } catch (_) { /* ignore */ }
});

/* ============================
   NAV ACTIVE STATE
============================ */
document.addEventListener("DOMContentLoaded", () => {
  const navAnchors = document.querySelectorAll(".nav-links a");
  if (!navAnchors.length) return;

  const normalize = (p) => (p || "/").replace(/\/$/, "").toLowerCase();
  const currentPath = normalize(location.pathname);

  let matched = false;
  navAnchors.forEach(a => {
    const href = a.getAttribute("href") || "/";
    let path;
    try { path = new URL(href, location.origin).pathname; } catch (_) { path = href; }
    if (normalize(path) === currentPath) {
      a.classList.add("active");
      matched = true;
    } else {
      a.classList.remove("active");
    }
  });

  if (!matched) {
    const home = Array.from(navAnchors).find(a => a.textContent.trim().toLowerCase() === "home");
    if (home) home.classList.add("active");
  }

  const currentSection = normalize(location.pathname);
  if (["/admin", "/staff", "/investor"].includes(currentSection)) {
    const adminToggle = document.querySelector(".nav-dropdown-toggle");
    if (adminToggle) adminToggle.classList.add("active");
  }
});
/* ============================
   ADD PACKAGE FUNCTIONALITY
============================ */
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector(".add-package");
  const container = document.getElementById("packages-container");
  
  if (!addBtn || !container) {
    console.warn("Add package button or container not found");
    return;
  }

  let packageCount = 1;

  addBtn.addEventListener("click", () => {
    packageCount++;
    
    const newPackage = document.createElement("div");
    newPackage.className = "package-block";
    newPackage.innerHTML = `
      <h4>Package ${packageCount} 
        <button type="button" class="remove-package">✖ Remove</button>
      </h4>
      <div class="form-row">
        <div class="form-group">
          <label>Weight (kg)</label>
          <input type="number" name="weight" step="0.01" placeholder="0.5">
        </div>
        <div class="form-group">
          <label>Length (cm)</label>
          <input type="number" name="length" step="0.1">
        </div>
        <div class="form-group">
          <label>Width (cm)</label>
          <input type="number" name="width" step="0.1">
        </div>
        <div class="form-group">
          <label>Height (cm)</label>
          <input type="number" name="height" step="0.1">
        </div>
      </div>
    `;
    
    container.appendChild(newPackage);

    // Remove button handler
    newPackage.querySelector(".remove-package").addEventListener("click", () => {
      newPackage.remove();
      packageCount--;
      
      // Renumber remaining packages
      document.querySelectorAll(".package-block h4").forEach((h, i) => {
        const removeBtn = h.querySelector(".remove-package");
        h.childNodes[0].textContent = `Package ${i + 1} `;
        if (removeBtn) h.appendChild(removeBtn); // keep button at end
      });
    });
  });
});

const cards = document.querySelectorAll(".service-card");

const reveal = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add("show");
    }
  });
},{ threshold: 0.2 });

cards.forEach(card => reveal.observe(card));

