(() => {
  const STORAGE_KEY = "parcellink_language";
  const FALLBACK_LANGUAGE = "en";
  const SUPPORTED_LANGUAGES = ["en", "ar"];

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
  };

  const setLanguage = (lang, options = { persist: true }) => {
    currentLanguage = normalizeLanguage(lang);
    if (options.persist) {
      try {
        localStorage.setItem(STORAGE_KEY, currentLanguage);
      } catch (_) {
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
    createLanguageSwitcher();
    applyTranslations();
    createLanguagePrompt();
  });
})();
