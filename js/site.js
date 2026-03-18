/* ============================
   SHARED SITE BEHAVIOR
============================ */
const i18n = {
  t(key, fallback = "") {
    if (window.ParcelLinkI18n && typeof window.ParcelLinkI18n.t === "function") {
      return window.ParcelLinkI18n.t(key, fallback);
    }
    return fallback;
  },
  getLanguage() {
    if (window.ParcelLinkI18n && typeof window.ParcelLinkI18n.getLanguage === "function") {
      return window.ParcelLinkI18n.getLanguage();
    }
    return "en";
  }
};

function ensureSharedFavicons() {
  const head = document.head;
  if (!head) return;

  const existingIcons = head.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]');
  existingIcons.forEach((icon) => icon.remove());

  const icons = [
    { rel: "icon", type: "image/svg+xml", href: "/images/favicon/favicon.svg?v=4", sizes: "any" },
    { rel: "icon", type: "image/png", href: "/images/favicon/favicon-64x64.png?v=4", sizes: "64x64" },
    { rel: "icon", type: "image/png", href: "/images/favicon/favicon-128x128.png?v=4", sizes: "128x128" },
    { rel: "icon", type: "image/png", href: "/images/favicon/favicon-256x256.png?v=4", sizes: "256x256" },
    { rel: "apple-touch-icon", href: "/images/favicon/favicon-256x256.png?v=4", sizes: "256x256" },
    { rel: "shortcut icon", href: "/favicon.ico?v=4" }
  ];

  icons.forEach(({ rel, type, href, sizes }) => {
    const link = document.createElement("link");
    link.rel = rel;
    link.href = href;
    if (type) link.type = type;
    if (sizes) link.sizes = sizes;
    head.appendChild(link);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  ensureSharedFavicons();

  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.querySelector(".nav-links ul");
  const dropdownItems = document.querySelectorAll(".nav-links .has-dropdown");

  if (menuToggle && navLinks) {
    const closeMenu = () => {
      navLinks.classList.remove("show");
      menuToggle.setAttribute("aria-expanded", "false");
    };

    const toggleMenu = () => {
      const isOpen = navLinks.classList.toggle("show");
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    };

    menuToggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleMenu();
    });

    menuToggle.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleMenu();
      }
    });

    navLinks.querySelectorAll("a").forEach((anchor) => {
      anchor.addEventListener("click", () => {
        if (window.matchMedia("(max-width: 992px)").matches) {
          closeMenu();
        }
      });
    });

    document.addEventListener("click", (event) => {
      if (!menuToggle.contains(event.target) && !navLinks.contains(event.target)) {
        closeMenu();
      }
    });
  }

  dropdownItems.forEach((item) => {
    const toggleBtn = item.querySelector(".nav-dropdown-toggle");
    if (!toggleBtn) return;

    toggleBtn.addEventListener("click", (event) => {
      event.preventDefault();
      const shouldOpen = !item.classList.contains("open");
      dropdownItems.forEach((node) => node.classList.remove("open"));
      item.classList.toggle("open", shouldOpen);
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

document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab-btn");
  const forms = document.querySelectorAll(".parcel-form");
  if (!tabs.length || !forms.length) return;

  const showForm = (targetId) => {
    tabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.target === targetId);
    });

    forms.forEach((form) => {
      form.classList.toggle("active", form.id === targetId);
    });
  };

  tabs.forEach((btn) => {
    btn.addEventListener("click", () => showForm(btn.dataset.target));
  });

  const defaultTab = Array.from(tabs).find((tab) => tab.classList.contains("active")) || tabs[0];
  if (defaultTab) showForm(defaultTab.dataset.target);
});

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("submit", async (event) => {
    const form = event.target;
    if (!form.classList || !form.classList.contains("parcel-form")) return;
    event.preventDefault();

    const responseBox =
      form.id === "international-form" ? document.getElementById("response-international")
      : form.id === "uae-form" ? document.getElementById("response-uae")
      : document.getElementById("response-corporate");

    const selects = form.querySelectorAll("select");
    const from = selects[0]?.value || "";
    const to = selects[1]?.value || "";

    const packageBlocks = form.querySelectorAll(".package-block");
    let totalWeight = 0;
    let totalLength = 0;
    let totalWidth = 0;
    let totalHeight = 0;
    let packageCount = 0;

    packageBlocks.forEach((block) => {
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
        packageCount += 1;
      }
    });

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
      from,
      to,
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
      responseBox.textContent = i18n.t("ui.calculating", "Calculating... Please wait.");
    }

    try {
      const res = await fetch("/api/parcel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parcelData)
      });
      const data = await res.json();

      if (responseBox) {
        const quoteMessage = data.message || i18n.t("ui.quoteCalculated", "Quote calculated");
        const packageSummary = packageCount > 1
          ? `<strong>${packageCount} ${i18n.t("ui.packages", "packages")}</strong> - `
          : "";

        responseBox.style.color = "green";
        responseBox.innerHTML = `
          <strong>${quoteMessage}</strong><br>
          ${packageSummary}
          ${i18n.t("ui.estimatedShipping", "Estimated shipping cost from")} <b>${from}</b> ${i18n.t("ui.to", "to")} <b>${to}</b>:
          <span style="color:#8b5cf6;">AED ${price.toFixed(2)}</span>
        `;
      }
    } catch (error) {
      console.error("Parcel submit error:", error);
      if (responseBox) {
        responseBox.style.color = "red";
        responseBox.textContent = i18n.t("ui.backendError", "Error: Could not connect to backend.");
      }
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const typeButtons = document.querySelectorAll(".type-btn");
  const fromSelect = document.getElementById("intl-from");
  const toSelect = document.getElementById("intl-to");

  if (!typeButtons.length || !fromSelect || !toSelect) return;

  const uaeList = [
    { en: "Dubai", ar: "\u062f\u0628\u064a" },
    { en: "Abu Dhabi", ar: "\u0623\u0628\u0648\u0638\u0628\u064a" },
    { en: "Sharjah", ar: "\u0627\u0644\u0634\u0627\u0631\u0642\u0629" },
    { en: "Ajman", ar: "\u0639\u062c\u0645\u0627\u0646" },
    { en: "Ras Al Khaimah", ar: "\u0631\u0623\u0633 \u0627\u0644\u062e\u064a\u0645\u0629" }
  ];
  const intlList = [
    { en: "United Kingdom", ar: "\u0627\u0644\u0645\u0645\u0644\u0643\u0629 \u0627\u0644\u0645\u062a\u062d\u062f\u0629" },
    { en: "USA", ar: "\u0627\u0644\u0648\u0644\u0627\u064a\u0627\u062a \u0627\u0644\u0645\u062a\u062d\u062f\u0629" },
    { en: "Canada", ar: "\u0643\u0646\u062f\u0627" },
    { en: "Germany", ar: "\u0623\u0644\u0645\u0627\u0646\u064a\u0627" },
    { en: "France", ar: "\u0641\u0631\u0646\u0633\u0627" }
  ];

  const mapOptions = (list) => list
    .map((item) => `<option>${i18n.getLanguage() === "ar" ? item.ar : item.en}</option>`)
    .join("");

  const updateMode = (mode) => {
    typeButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.type === mode);
    });

    if (mode === "import") {
      fromSelect.innerHTML = mapOptions(intlList);
      toSelect.innerHTML = mapOptions(uaeList);
      return;
    }

    fromSelect.innerHTML = mapOptions(uaeList);
    toSelect.innerHTML = mapOptions(intlList);
  };

  typeButtons.forEach((btn) => {
    btn.addEventListener("click", () => updateMode(btn.dataset.type));
  });

  updateMode("export");

  document.addEventListener("parcellink:language-changed", () => {
    const activeMode = document.querySelector(".type-btn.active")?.dataset.type || "export";
    updateMode(activeMode);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("trackForm") || document.getElementById("track-form");
  const input = document.getElementById("trackingInput") || document.getElementById("trackingNumber");
  const resultCard = document.getElementById("resultCard") || document.getElementById("trackResult");

  if (!form || !input || !resultCard || form.dataset.trackBound === "true") return;
  form.dataset.trackBound = "true";

  const showResult = (html, options = {}) => {
    resultCard.innerHTML = html;
    resultCard.hidden = false;
    resultCard.classList.remove("hidden");
    resultCard.classList.add("track-visible");
    resultCard.style.display = "block";

    if (options.scroll !== false) {
      try {
        resultCard.scrollIntoView({ behavior: "smooth", block: "center" });
      } catch (_) {
        // no-op
      }
    }
  };

  const showError = (message) => {
    showResult(
      `<div class="track-error"><strong>${i18n.t("track.errorTitle", "Error")}</strong><div style="margin-top:8px">${message}</div></div>`
    );
  };

  const fetchTrack = async (code) => {
    try {
      let res = await fetch(`/api/track/${encodeURIComponent(code)}`);
      if (!res.ok) {
        res = await fetch(`/api/track?code=${encodeURIComponent(code)}`);
      }
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Server returned ${res.status}: ${text || res.statusText}`);
      }

      const data = await res.json().catch(() => null);
      if (!data || !data.success || !data.parcel) {
        throw new Error(data?.message || i18n.t("track.noTrackingInfo", "No tracking information found."));
      }

      const parcel = data.parcel;
      const current = data.latestStatus || parcel.statusHistory?.[parcel.statusHistory.length - 1] || null;
      const lastUpdated = current
        ? new Date(current.timestamp).toLocaleString()
        : i18n.t("track.noEvents", "No events yet");

      const timeline = (parcel.statusHistory || []).slice().reverse().map((status) => `
        <li class="track-step ${status === current ? "current" : ""}">
          <strong>${status.status}</strong>
          <div class="meta">${status.location || ""} - ${new Date(status.timestamp).toLocaleString()}</div>
          ${status.remark ? `<div class="remark">${status.remark}</div>` : ""}
        </li>
      `).join("") || `<li>${i18n.t("track.noEvents", "No events yet")}</li>`;

      showResult(`
        <div class="track-summary">
          <h3>${parcel.trackingCode}</h3>
          <div class="track-meta">${parcel.from || ""} -> ${parcel.to || ""}</div>
          <div class="track-current">
            <div><strong>${current ? current.status : i18n.t("track.noStatus", "No status")}</strong></div>
            <div class="track-meta">${i18n.t("track.lastUpdated", "Last updated:")} ${lastUpdated}</div>
          </div>
        </div>
        <div class="track-history">
          <h4>${i18n.t("track.historyTitle", "Tracking History")}</h4>
          <ul class="track-timeline">${timeline}</ul>
        </div>
      `);
    } catch (error) {
      console.error("Tracking error:", error);
      showError(error.message || i18n.t("track.unableFetch", "Unable to fetch tracking info"));
    }
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const code = (input.value || "").trim();
    if (!code) {
      showError(i18n.t("track.enterTracking", "Please enter a tracking number"));
      return;
    }

    showResult(`<div>${i18n.t("track.loading", "Loading tracking information...")}</div>`);
    fetchTrack(code);
  });

  try {
    const urlCode = new URL(location.href).searchParams.get("code");
    if (urlCode && !input.value) {
      input.value = urlCode;
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    }
  } catch (_) {
    // no-op
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const navAnchors = document.querySelectorAll(".nav-links a");
  if (!navAnchors.length) return;

  const normalize = (path) => (path || "/").replace(/\/$/, "").toLowerCase();
  const currentPath = normalize(location.pathname);

  let matched = false;
  navAnchors.forEach((anchor) => {
    const href = anchor.getAttribute("href") || "/";
    let path = href;
    try {
      path = new URL(href, location.origin).pathname;
    } catch (_) {
      // keep raw href
    }

    const isActive = normalize(path) === currentPath;
    anchor.classList.toggle("active", isActive);
    if (isActive) matched = true;
  });

  if (!matched) {
    const home = Array.from(navAnchors).find((anchor) => anchor.textContent.trim().toLowerCase() === "home");
    if (home) home.classList.add("active");
  }

  if (["/admin", "/staff", "/investor"].includes(currentPath)) {
    const adminToggle = document.querySelector(".nav-dropdown-toggle");
    if (adminToggle) adminToggle.classList.add("active");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector(".add-package");
  const container = document.getElementById("packages-container");

  if (!addBtn || !container) return;

  let packageCount = 1;

  const renumberPackages = () => {
    const headings = container.querySelectorAll(".package-block h4");
    packageCount = headings.length;

    headings.forEach((heading, index) => {
      const removeBtn = heading.querySelector(".remove-package");
      heading.textContent = `${i18n.t("forms.package", "Package")} ${index + 1}`;
      if (removeBtn) {
        heading.appendChild(document.createTextNode(" "));
        removeBtn.textContent = `✖ ${i18n.t("forms.remove", "Remove")}`;
        heading.appendChild(removeBtn);
      }
    });
  };

  const bindRemoveButton = (block) => {
    const removeBtn = block.querySelector(".remove-package");
    if (!removeBtn || removeBtn.dataset.bound === "true") return;

    removeBtn.dataset.bound = "true";
    removeBtn.addEventListener("click", () => {
      block.remove();
      renumberPackages();
    });
  };

  container.querySelectorAll(".package-block").forEach(bindRemoveButton);
  renumberPackages();

  addBtn.addEventListener("click", () => {
    packageCount += 1;

    const newPackage = document.createElement("div");
    newPackage.className = "package-block";
    newPackage.innerHTML = `
      <h4>${i18n.t("forms.package", "Package")} ${packageCount}
        <button type="button" class="remove-package">✖ ${i18n.t("forms.remove", "Remove")}</button>
      </h4>
      <div class="form-row">
        <div class="form-group">
          <label>${i18n.t("forms.weight", "Weight (kg)")}</label>
          <input type="number" name="weight" step="0.01" placeholder="0.5">
        </div>
        <div class="form-group">
          <label>${i18n.t("forms.length", "Length (cm)")}</label>
          <input type="number" name="length" step="0.1">
        </div>
        <div class="form-group">
          <label>${i18n.t("forms.width", "Width (cm)")}</label>
          <input type="number" name="width" step="0.1">
        </div>
        <div class="form-group">
          <label>${i18n.t("forms.height", "Height (cm)")}</label>
          <input type="number" name="height" step="0.1">
        </div>
      </div>
    `;

    container.appendChild(newPackage);
    bindRemoveButton(newPackage);
    renumberPackages();
  });

  document.addEventListener("parcellink:language-changed", renumberPackages);
});

const cards = document.querySelectorAll(".service-card");
if (cards.length && "IntersectionObserver" in window) {
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, { threshold: 0.2 });

  cards.forEach((card) => reveal.observe(card));
}
