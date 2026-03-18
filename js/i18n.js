(() => {
  const STORAGE_KEY = "parcellink_language";
  const FALLBACK_LANGUAGE = "en";
  const SUPPORTED_LANGUAGES = ["en", "ar"];
  const RUNTIME_STYLE_ID = "parcellink-i18n-runtime-style";

  const dictionaries = {
    en: {
      "meta.title": "ParcelLink",
      "switch.en": "English",
      "switch.ar": "Arabic",

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
      "switch.en": "English",
      "switch.ar": "Arabic",

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

  Object.assign(dictionaries.en, {
    "smallBox": "Small Box",
    "mediumBox": "Medium Box",
    "largeBox": "Large Box",
    "send.metaTitle": "Send Parcel | ParcelLink",
    "send.title": "Send a Parcel",
    "send.subtitle": "Provide sender and receiver details to create a seamless delivery experience.",
    "send.senderInfo": "Sender Information",
    "send.senderName": "Sender Name",
    "send.phoneNumber": "Phone Number",
    "send.pickupAddress": "Pickup Address",
    "send.city": "City",
    "send.poBoxOptional": "P.O. Box (optional)",
    "send.receiverInfo": "Receiver Information",
    "send.receiverName": "Receiver Name",
    "send.deliveryAddress": "Delivery Address",
    "send.parcelInfo": "Parcel Information",
    "send.dimensionsOptional": "Dimensions (optional)",
    "send.notesOptional": "Notes (optional)",
    "send.submitShipment": "Submit Shipment",
    "send.placeholder.senderName": "John Doe",
    "send.placeholder.senderPhone": "+971 55 123 4567",
    "send.placeholder.pickupAddress": "123 Main St, Dubai",
    "send.placeholder.pickupCity": "Dubai",
    "send.placeholder.senderPoBox": "P.O. Box 12345",
    "send.placeholder.receiverName": "Jane Smith",
    "send.placeholder.receiverPhone": "+44 123 456 7890",
    "send.placeholder.deliveryAddress": "456 Oxford St, London",
    "send.placeholder.deliveryCity": "London",
    "send.placeholder.receiverPoBox": "P.O. Box 67890",
    "send.placeholder.weight": "0.5",
    "send.placeholder.dimensions": "L x W x H (cm)",
    "send.placeholder.notes": "Fragile, handle with care"
  });

  Object.assign(dictionaries.ar, {
    "smallBox": "\u0635\u0646\u062f\u0648\u0642 \u0635\u063a\u064a\u0631",
    "mediumBox": "\u0635\u0646\u062f\u0648\u0642 \u0645\u062a\u0648\u0633\u0637",
    "largeBox": "\u0635\u0646\u062f\u0648\u0642 \u0643\u0628\u064a\u0631",
    "send.metaTitle": "\u0625\u0631\u0633\u0627\u0644 \u0637\u0631\u062f | \u0628\u0627\u0631\u0633\u0644 \u0644\u064a\u0646\u0643",
    "send.title": "\u0625\u0631\u0633\u0627\u0644 \u0637\u0631\u062f",
    "send.subtitle": "\u0642\u062f\u0651\u0645 \u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u0645\u0631\u0633\u0644 \u0648\u0627\u0644\u0645\u0633\u062a\u0644\u0645 \u0644\u0625\u0646\u0634\u0627\u0621 \u062a\u062c\u0631\u0628\u0629 \u062a\u0633\u0644\u064a\u0645 \u0633\u0644\u0633\u0629.",
    "send.senderInfo": "\u0645\u0639\u0644\u0648\u0645\u0627\u062a \u0627\u0644\u0645\u0631\u0633\u0644",
    "send.senderName": "\u0627\u0633\u0645 \u0627\u0644\u0645\u0631\u0633\u0644",
    "send.phoneNumber": "\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062a\u0641",
    "send.pickupAddress": "\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0627\u0633\u062a\u0644\u0627\u0645",
    "send.city": "\u0627\u0644\u0645\u062f\u064a\u0646\u0629",
    "send.poBoxOptional": "\u0635\u0646\u062f\u0648\u0642 \u0628\u0631\u064a\u062f (\u0627\u062e\u062a\u064a\u0627\u0631\u064a)",
    "send.receiverInfo": "\u0645\u0639\u0644\u0648\u0645\u0627\u062a \u0627\u0644\u0645\u0633\u062a\u0644\u0645",
    "send.receiverName": "\u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u062a\u0644\u0645",
    "send.deliveryAddress": "\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u062a\u0633\u0644\u064a\u0645",
    "send.parcelInfo": "\u0645\u0639\u0644\u0648\u0645\u0627\u062a \u0627\u0644\u0637\u0631\u062f",
    "send.dimensionsOptional": "\u0627\u0644\u0623\u0628\u0639\u0627\u062f (\u0627\u062e\u062a\u064a\u0627\u0631\u064a)",
    "send.notesOptional": "\u0645\u0644\u0627\u062d\u0638\u0627\u062a (\u0627\u062e\u062a\u064a\u0627\u0631\u064a)",
    "send.submitShipment": "\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0634\u062d\u0646\u0629",
    "send.placeholder.senderName": "\u0623\u062d\u0645\u062f \u0639\u0644\u064a",
    "send.placeholder.senderPhone": "+971 55 123 4567",
    "send.placeholder.pickupAddress": "123 \u0627\u0644\u0634\u0627\u0631\u0639 \u0627\u0644\u0631\u0626\u064a\u0633\u064a\u060c \u062f\u0628\u064a",
    "send.placeholder.pickupCity": "\u062f\u0628\u064a",
    "send.placeholder.senderPoBox": "\u0635.\u0628 12345",
    "send.placeholder.receiverName": "\u0633\u0627\u0631\u0629 \u062e\u0627\u0644\u062f",
    "send.placeholder.receiverPhone": "+44 123 456 7890",
    "send.placeholder.deliveryAddress": "456 \u0623\u0643\u0633\u0641\u0648\u0631\u062f \u0633\u062a\u0631\u064a\u062a\u060c \u0644\u0646\u062f\u0646",
    "send.placeholder.deliveryCity": "\u0644\u0646\u062f\u0646",
    "send.placeholder.receiverPoBox": "\u0635.\u0628 67890",
    "send.placeholder.weight": "0.5",
    "send.placeholder.dimensions": "\u0637 x \u0639 x \u0627 (\u0633\u0645)",
    "send.placeholder.notes": "\u0642\u0627\u0628\u0644 \u0644\u0644\u0643\u0633\u0631\u060c \u064a\u0631\u062c\u0649 \u0627\u0644\u062a\u0639\u0627\u0645\u0644 \u0628\u0639\u0646\u0627\u064a\u0629"
  });

  Object.assign(dictionaries.en, {
    "trackPage.metaTitle": "Track | ParcelLink",
    "trackPage.title": "Track Your Order",
    "trackPage.subtitle": "Type your order number to see the latest delivery status in real time.",
    "trackPage.inputPlaceholder": "Enter tracking code",
    "trackPage.button": "Track",
    "trackPage.statusTitle": "Order Status",
    "trackPage.footer": "2025 ParcelLink Logistics - Fast | Secure | Reliable",

    "helpPage.metaTitle": "Help Center | ParcelLink",
    "helpPage.title": "Help Center",
    "helpPage.subtitle": "Find answers, resolve issues, and get expert support - quickly and efficiently.",
    "helpPage.sectionTitle": "How can we help you today?",
    "helpPage.faqTitle": "Frequently Asked Questions",
    "helpPage.contactTitle": "Still need help?",
    "helpPage.contactSubtitle": "Our support team is available 24/7 to assist you.",
    "helpPage.contactButton": "Contact Support",

    "client.metaTitle": "ParcelLink - Client Zone",
    "client.heroTitle": "Welcome to Your Client Zone",
    "client.heroSubtitle": "Manage your parcels, view shipment history, download invoices, and track deliveries in one secure place.",
    "client.loginTitle": "Client Login",
    "client.signIn": "Sign In",
    "client.email": "Email",
    "client.password": "Password",
    "client.loginButton": "Login",
    "client.quickActions": "Quick Actions",
    "client.trackShipments": "Track Shipments",
    "client.invoiceHistory": "Invoice History",
    "client.downloadStatements": "Download Statements",
    "client.footer": "© 2026 ParcelLink - All Rights Reserved",
    "client.enterCredentials": "Please enter your credentials.",
    "client.loginSuccess": "Login successful! Loading your dashboard...",
    "client.invalidCredentials": "Invalid credentials.",
    "client.connectionError": "Connection error. Please try again.",
    "client.welcome": "Welcome",
    "client.myShipments": "My Shipments",
    "client.downloadReceipts": "Download Receipts",
    "client.logout": "Logout",
    "client.yourShipments": "Your Shipments",
    "client.status": "Status",
    "client.pendingPayment": "Pending Payment",
    "client.noShipments": "No shipments found.",
    "client.shipmentsLoadError": "Failed to load shipments.",
    "client.receipts": "Your Receipts",
    "client.receiptLabel": "Receipt",
    "client.trackingLabel": "Tracking",
    "client.amountLabel": "Amount",
    "client.paymentLabel": "Payment",
    "client.dateLabel": "Paid",
    "client.noReceipts": "No receipts found. Make a payment first!",
    "client.receiptsLoadError": "Failed to load receipts.",

    "servicesPage.kicker": "Enterprise Logistics",
    "servicesPage.metaTitle": "Our Services | ParcelLink",
    "servicesPage.heroTitle": "Integrated Logistics Services Built for Reliable Growth",
    "servicesPage.heroSubtitle": "From secure shipping and intelligent storage to customs processing and live operational analytics, ParcelLink delivers an end-to-end logistics experience for individuals, merchants, and enterprise teams.",
    "servicesPage.metric1Label": "Real-time shipment visibility",
    "servicesPage.metric2Label": "Regional transfer capability",
    "servicesPage.metric3Label": "Import and export support",
    "Partners": "Partners",
    "Operations": "Operations",
    "Contact": "Contact",
    "Track Parcel": "Track Parcel",
    "Dubai, UAE": "Dubai, UAE",
    "2026 ParcelLink. All rights reserved.": "2026 ParcelLink. All rights reserved."
  });

  Object.assign(dictionaries.ar, {
    "trackPage.metaTitle": "\u062a\u062a\u0628\u0639 | \u0628\u0627\u0631\u0633\u0644 \u0644\u064a\u0646\u0643",
    "trackPage.title": "\u062a\u062a\u0628\u0639 \u0637\u0644\u0628\u0643",
    "trackPage.subtitle": "\u0627\u0643\u062a\u0628 \u0631\u0642\u0645 \u0637\u0644\u0628\u0643 \u0644\u0631\u0624\u064a\u0629 \u0622\u062e\u0631 \u062d\u0627\u0644\u0629 \u0644\u0644\u062a\u0633\u0644\u064a\u0645 \u0641\u064a \u0627\u0644\u0648\u0642\u062a \u0627\u0644\u0641\u0639\u0644\u064a.",
    "trackPage.inputPlaceholder": "\u0623\u062f\u062e\u0644 \u0631\u0645\u0632 \u0627\u0644\u062a\u062a\u0628\u0639",
    "trackPage.button": "\u062a\u062a\u0628\u0639",
    "trackPage.statusTitle": "\u062d\u0627\u0644\u0629 \u0627\u0644\u0637\u0644\u0628",
    "trackPage.footer": "2025 \u0628\u0627\u0631\u0633\u0644 \u0644\u064a\u0646\u0643 \u0644\u0644\u062e\u062f\u0645\u0627\u062a \u0627\u0644\u0644\u0648\u062c\u0633\u062a\u064a\u0629 - \u0633\u0631\u064a\u0639 | \u0622\u0645\u0646 | \u0645\u0648\u062b\u0648\u0642",

    "helpPage.metaTitle": "\u0645\u0631\u0643\u0632 \u0627\u0644\u0645\u0633\u0627\u0639\u062f\u0629 | \u0628\u0627\u0631\u0633\u0644 \u0644\u064a\u0646\u0643",
    "helpPage.title": "\u0645\u0631\u0643\u0632 \u0627\u0644\u0645\u0633\u0627\u0639\u062f\u0629",
    "helpPage.subtitle": "\u0627\u0628\u062d\u062b \u0639\u0646 \u0627\u0644\u0625\u062c\u0627\u0628\u0627\u062a\u060c \u0648\u062d\u0644 \u0627\u0644\u0645\u0634\u0627\u0643\u0644\u060c \u0648\u0627\u062d\u0635\u0644 \u0639\u0644\u0649 \u062f\u0639\u0645 \u062e\u0628\u064a\u0631 - \u0628\u0633\u0631\u0639\u0629 \u0648\u0643\u0641\u0627\u0621\u0629.",
    "helpPage.sectionTitle": "\u0643\u064a\u0641 \u064a\u0645\u0643\u0646\u0646\u0627 \u0645\u0633\u0627\u0639\u062f\u062a\u0643 \u0627\u0644\u064a\u0648\u0645\u061f",
    "helpPage.faqTitle": "\u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0634\u0627\u0626\u0639\u0629",
    "helpPage.contactTitle": "\u0647\u0644 \u0645\u0627 \u0632\u0644\u062a \u0628\u062d\u0627\u062c\u0629 \u0625\u0644\u0649 \u0645\u0633\u0627\u0639\u062f\u0629\u061f",
    "helpPage.contactSubtitle": "\u0641\u0631\u064a\u0642 \u0627\u0644\u062f\u0639\u0645 \u0644\u062f\u064a\u0646\u0627 \u0645\u062a\u0627\u062d \u0639\u0644\u0649 \u0645\u062f\u0627\u0631 24/7 \u0644\u0645\u0633\u0627\u0639\u062f\u062a\u0643.",
    "helpPage.contactButton": "\u062a\u0648\u0627\u0635\u0644 \u0645\u0639 \u0627\u0644\u062f\u0639\u0645",

    "client.metaTitle": "\u0628\u0627\u0631\u0633\u0644 \u0644\u064a\u0646\u0643 - \u0645\u0646\u0637\u0642\u0629 \u0627\u0644\u0639\u0645\u0644\u0627\u0621",
    "client.heroTitle": "\u0645\u0631\u062d\u0628\u064b\u0627 \u0628\u0643 \u0641\u064a \u0645\u0646\u0637\u0642\u0629 \u0627\u0644\u0639\u0645\u0644\u0627\u0621",
    "client.heroSubtitle": "\u0623\u062f\u0631 \u0637\u0631\u0648\u062f\u0643\u060c \u0648\u0627\u0637\u0644\u0639 \u0639\u0644\u0649 \u0633\u062c\u0644 \u0627\u0644\u0634\u062d\u0646\u0627\u062a\u060c \u0648\u0646\u0632\u0651\u0644 \u0627\u0644\u0641\u0648\u0627\u062a\u064a\u0631\u060c \u0648\u062a\u0627\u0628\u0639 \u0627\u0644\u062a\u0633\u0644\u064a\u0645 \u0641\u064a \u0645\u0643\u0627\u0646 \u0622\u0645\u0646 \u0648\u0627\u062d\u062f.",
    "client.loginTitle": "\u062a\u0633\u062c\u064a\u0644 \u062f\u062e\u0648\u0644 \u0627\u0644\u0639\u0645\u064a\u0644",
    "client.signIn": "\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644",
    "client.email": "\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a",
    "client.password": "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631",
    "client.loginButton": "\u062f\u062e\u0648\u0644",
    "client.quickActions": "\u0625\u062c\u0631\u0627\u0621\u0627\u062a \u0633\u0631\u064a\u0639\u0629",
    "client.trackShipments": "\u062a\u062a\u0628\u0639 \u0627\u0644\u0634\u062d\u0646\u0627\u062a",
    "client.invoiceHistory": "\u0633\u062c\u0644 \u0627\u0644\u0641\u0648\u0627\u062a\u064a\u0631",
    "client.downloadStatements": "\u062a\u0646\u0632\u064a\u0644 \u0627\u0644\u0643\u0634\u0648\u0641\u0627\u062a",
    "client.footer": "\u00a9 2026 \u0628\u0627\u0631\u0633\u0644 \u0644\u064a\u0646\u0643 - \u062c\u0645\u064a\u0639 \u0627\u0644\u062d\u0642\u0648\u0642 \u0645\u062d\u0641\u0648\u0638\u0629",
    "client.enterCredentials": "\u064a\u0631\u062c\u0649 \u0625\u062f\u062e\u0627\u0644 \u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u062f\u062e\u0648\u0644.",
    "client.loginSuccess": "\u062a\u0645 \u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644 \u0628\u0646\u062c\u0627\u062d! \u062c\u0627\u0631\u064d \u062a\u062d\u0645\u064a\u0644 \u0644\u0648\u062d\u0629 \u0627\u0644\u062a\u062d\u0643\u0645...",
    "client.invalidCredentials": "\u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u062f\u062e\u0648\u0644 \u063a\u064a\u0631 \u0635\u062d\u064a\u062d\u0629.",
    "client.connectionError": "\u062e\u0637\u0623 \u0641\u064a \u0627\u0644\u0627\u062a\u0635\u0627\u0644. \u064a\u0631\u062c\u0649 \u0627\u0644\u0645\u062d\u0627\u0648\u0644\u0629 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649.",
    "client.welcome": "\u0645\u0631\u062d\u0628\u064b\u0627",
    "client.myShipments": "\u0634\u062d\u0646\u0627\u062a\u064a",
    "client.downloadReceipts": "\u062a\u0646\u0632\u064a\u0644 \u0627\u0644\u0625\u064a\u0635\u0627\u0644\u0627\u062a",
    "client.logout": "\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062e\u0631\u0648\u062c",
    "client.yourShipments": "\u0634\u062d\u0646\u0627\u062a\u0643",
    "client.status": "\u0627\u0644\u062d\u0627\u0644\u0629",
    "client.pendingPayment": "\u0628\u0627\u0646\u062a\u0638\u0627\u0631 \u0627\u0644\u062f\u0641\u0639",
    "client.noShipments": "\u0644\u0627 \u062a\u0648\u062c\u062f \u0634\u062d\u0646\u0627\u062a.",
    "client.shipmentsLoadError": "\u0641\u0634\u0644 \u0641\u064a \u062a\u062d\u0645\u064a\u0644 \u0627\u0644\u0634\u062d\u0646\u0627\u062a.",
    "client.receipts": "\u0625\u064a\u0635\u0627\u0644\u0627\u062a\u0643",
    "client.receiptLabel": "\u0627\u0644\u0625\u064a\u0635\u0627\u0644",
    "client.trackingLabel": "\u0627\u0644\u062a\u062a\u0628\u0639",
    "client.amountLabel": "\u0627\u0644\u0645\u0628\u0644\u063a",
    "client.paymentLabel": "\u0627\u0644\u062f\u0641\u0639",
    "client.dateLabel": "\u062a\u0627\u0631\u064a\u062e \u0627\u0644\u062f\u0641\u0639",
    "client.noReceipts": "\u0644\u0627 \u062a\u0648\u062c\u062f \u0625\u064a\u0635\u0627\u0644\u0627\u062a. \u0642\u0645 \u0628\u0627\u0644\u062f\u0641\u0639 \u0623\u0648\u0644\u0627\u064b!",
    "client.receiptsLoadError": "\u0641\u0634\u0644 \u0641\u064a \u062a\u062d\u0645\u064a\u0644 \u0627\u0644\u0625\u064a\u0635\u0627\u0644\u0627\u062a.",

    "servicesPage.kicker": "\u0627\u0644\u062d\u0644\u0648\u0644 \u0627\u0644\u0644\u0648\u062c\u0633\u062a\u064a\u0629 \u0644\u0644\u0634\u0631\u0643\u0627\u062a",
    "servicesPage.metaTitle": "\u062e\u062f\u0645\u0627\u062a\u0646\u0627 | \u0628\u0627\u0631\u0633\u0644 \u0644\u064a\u0646\u0643",
    "servicesPage.heroTitle": "\u062e\u062f\u0645\u0627\u062a \u0644\u0648\u062c\u0633\u062a\u064a\u0629 \u0645\u062a\u0643\u0627\u0645\u0644\u0629 \u0645\u0628\u0646\u064a\u0629 \u0644\u0646\u0645\u0648 \u0645\u0648\u062b\u0648\u0642",
    "servicesPage.heroSubtitle": "\u0645\u0646 \u0627\u0644\u0634\u062d\u0646 \u0627\u0644\u0622\u0645\u0646 \u0648\u0627\u0644\u062a\u062e\u0632\u064a\u0646 \u0627\u0644\u0630\u0643\u064a \u0625\u0644\u0649 \u0627\u0644\u0645\u0639\u0627\u0644\u062c\u0629 \u0627\u0644\u062c\u0645\u0631\u0643\u064a\u0629 \u0648\u0627\u0644\u062a\u062d\u0644\u064a\u0644\u0627\u062a \u0627\u0644\u062a\u0634\u063a\u064a\u0644\u064a\u0629 \u0627\u0644\u0645\u0628\u0627\u0634\u0631\u0629\u060c \u062a\u0642\u062f\u0645 \u0628\u0627\u0631\u0633\u0644 \u0644\u064a\u0646\u0643 \u062a\u062c\u0631\u0628\u0629 \u0644\u0648\u062c\u0633\u062a\u064a\u0629 \u0645\u062a\u0643\u0627\u0645\u0644\u0629 \u0644\u0644\u0623\u0641\u0631\u0627\u062f \u0648\u0627\u0644\u062a\u062c\u0627\u0631 \u0648\u0641\u0631\u0642 \u0627\u0644\u0634\u0631\u0643\u0627\u062a.",
    "servicesPage.metric1Label": "\u0631\u0624\u064a\u0629 \u0641\u0648\u0631\u064a\u0629 \u0644\u0644\u0634\u062d\u0646\u0627\u062a",
    "servicesPage.metric2Label": "\u0642\u062f\u0631\u0629 \u0627\u0644\u062a\u062d\u0648\u064a\u0644 \u0627\u0644\u0625\u0642\u0644\u064a\u0645\u064a",
    "servicesPage.metric3Label": "\u062f\u0639\u0645 \u0627\u0644\u0627\u0633\u062a\u064a\u0631\u0627\u062f \u0648\u0627\u0644\u062a\u0635\u062f\u064a\u0631",
    "Partners": "\u0627\u0644\u0634\u0631\u0643\u0627\u0621",
    "Operations": "\u0627\u0644\u0639\u0645\u0644\u064a\u0627\u062a",
    "Contact": "\u0627\u062a\u0635\u0644 \u0628\u0646\u0627",
    "Track Parcel": "\u062a\u062a\u0628\u0639 \u0627\u0644\u0637\u0631\u062f",
    "Dubai, UAE": "\u062f\u0628\u064a\u060c \u0627\u0644\u0625\u0645\u0627\u0631\u0627\u062a",
    "2026 ParcelLink. All rights reserved.": "2026 \u0628\u0627\u0631\u0633\u0644 \u0644\u064a\u0646\u0643. \u062c\u0645\u064a\u0639 \u0627\u0644\u062d\u0642\u0648\u0642 \u0645\u062d\u0641\u0648\u0638\u0629."
  });

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
    "© 2026 ParcelLink - All Rights Reserved": "© 2026 بارسل لينك - جميع الحقوق محفوظة",
    "Log In": "تسجيل الدخول",
    "Portal Login": "تسجيل دخول البوابة",
    "Manager Login": "تسجيل دخول المدير",
    "Manager Access": "وصول المدير",
    "ParcelLink | Login": "بارسل لينك | تسجيل الدخول",
    "ParcelLink | Register": "بارسل لينك | إنشاء حساب",
    "ParcelLink | Dashboard": "بارسل لينك | لوحة التحكم",
    "Staff Portal | ParcelLink": "بوابة الموظفين | بارسل لينك",
    "Admin Portal | ParcelLink": "بوابة الإدارة | بارسل لينك",
    "Investor Portal | ParcelLink": "بوابة المستثمر | بارسل لينك",
    "Investor ROI Dashboard": "لوحة عائد الاستثمار للمستثمر",
    "Investor ROI Dashboard | ParcelLink": "لوحة عائد الاستثمار للمستثمر | بارسل لينك",
    "Welcome to Your Client Zone": "مرحبًا بك في منطقة العملاء",
    "ParcelLink - Client Zone": "بارسل لينك - منطقة العملاء",
    "Manager-only workspace to create staff and investor logins. Sign in once, then generate IDs and passwords easily.": "مساحة عمل مخصصة للمديرين لإنشاء حسابات دخول الموظفين والمستثمرين. سجّل الدخول مرة واحدة ثم أنشئ المعرفات وكلمات المرور بسهولة.",
    "Use your manager/admin staff account. Non-manager accounts will be redirected to Staff or Investor portal.": "استخدم حساب الموظف الإداري/المدير. سيتم تحويل الحسابات غير الإدارية إلى بوابة الموظفين أو المستثمرين.",
    "Staff Access Manager Console": "لوحة إدارة وصول الموظفين",
    "Provision Key (optional fallback)": "مفتاح التهيئة (احتياطي اختياري)",
    "Create Login": "إنشاء تسجيل دخول",
    "View Accounts": "عرض الحسابات",
    "Load Accounts": "تحميل الحسابات",
    "Account Type": "نوع الحساب",
    "Role (optional check)": "الدور (تحقق اختياري)",
    "Staff/Investor ID": "معرّف الموظف/المستثمر",
    "Staff/Admin": "موظف/إداري",
    "-- Select Role --": "-- اختر الدور --",
    "Type": "النوع",
    "Search": "بحث",
    "Limit": "الحد",
    "Department": "القسم",
    "Role": "الدور",
    "Staff ID": "معرّف الموظف",
    "Investor ID": "معرّف المستثمر",
    "New Password": "كلمة المرور الجديدة",
    "Reset Password": "إعادة تعيين كلمة المرور",
    "Go to Staff Portal": "الانتقال إلى بوابة الموظفين",
    "Go to Investor Portal": "الانتقال إلى بوابة المستثمر",
    "Investor Login": "تسجيل دخول المستثمر",
    "Secure investor login for portfolio tracking and daily growth visibility. Use your assigned `INV` ID and password.": "تسجيل دخول آمن للمستثمرين لتتبع المحفظة ورؤية النمو اليومي. استخدم معرّف `INV` وكلمة المرور المخصصين لك.",
    "Annual ROI model:": "نموذج العائد السنوي:",
    "split into daily growth tracking across 365 days.": "مقسّم إلى تتبع نمو يومي على مدار 365 يومًا.",
    "Key Responsibilities": "المسؤوليات الرئيسية",
    "Requirements": "المتطلبات",
    "Apply for this role": "قدّم لهذا الدور",
    "View details": "عرض التفاصيل",
    "Submit Application": "إرسال الطلب",
    "Attach CV (optional)": "إرفاق السيرة الذاتية (اختياري)",
    "Email Address": "عنوان البريد الإلكتروني",
    "Phone (with country code)": "الهاتف (مع رمز الدولة)",
    "Role / Area of Interest": "الدور / مجال الاهتمام",
    "Select area": "اختر المجال",
    "Brief Introduction": "نبذة مختصرة",
    "Didn't see a perfect match?": "لم تجد الوظيفة المناسبة تمامًا؟",
    "We review every application submitted through this form.": "نراجع كل طلب يتم تقديمه عبر هذا النموذج.",
    "Shortlisted candidates will be contacted by the HR team.": "سيتم التواصل مع المرشحين المختارين من قبل فريق الموارد البشرية.",
    "You can attach a CV file name for HR review after submission.": "يمكنك إرفاق اسم ملف السيرة الذاتية لمراجعته من قبل الموارد البشرية بعد التقديم.",
    "Delivery Rider (Motorbike)": "مندوب توصيل (دراجة نارية)",
    "Warehouse Associate": "موظف مستودع",
    "Customer Experience Officer": "مسؤول تجربة العملاء",
    "Dispatch Coordinator": "منسق التوزيع",
    "Operations Supervisor": "مشرف العمليات",
    "Finance & Billing Officer": "مسؤول المالية والفوترة",
    "Delivery Rider": "مندوب توصيل",
    "Operations": "العمليات",
    "Warehouse": "المستودع",
    "Dispatch": "التوزيع",
    "Fleet": "الأسطول",
    "Customer Service": "خدمة العملاء",
    "Finance": "المالية",
    "Corporate": "الشركات",
    "All": "الكل",
    "Full-time - Dubai": "دوام كامل - دبي",
    "Full-time - Dubai (Hybrid)": "دوام كامل - دبي (هجين)",
    "Full-time - Field": "دوام كامل - ميداني",
    "Dubai & Sharjah": "دبي والشارقة",
    "Sunday - Friday": "الأحد - الجمعة",
    "Night Shift Available": "تتوفر مناوبة ليلية",
    "Same-day & Next-day": "نفس اليوم واليوم التالي",
    "English + Arabic preferred": "يفضّل الإنجليزية + العربية",
    "Valid UAE license required": "مطلوب رخصة إماراتية سارية",
    "Good knowledge of city routes.": "معرفة جيدة بمسارات المدينة.",
    "Valid UAE motorbike license.": "رخصة دراجة نارية إماراتية سارية.",
    "Good knowledge of Dubai roads and industrial areas.": "معرفة جيدة بطرق دبي والمناطق الصناعية.",
    "Basic English or Arabic communication.": "القدرة على التواصل الأساسي بالإنجليزية أو العربية.",
    "Experience in route planning or dispatch preferred.": "يفضّل وجود خبرة في تخطيط المسارات أو التوزيع.",
    "1-3 years in customer support or call centre.": "من 1 إلى 3 سنوات في دعم العملاء أو مركز الاتصال.",
    "2+ years in logistics or operations.": "أكثر من سنتين في اللوجستيات أو العمليات.",
    "Degree or diploma in Accounting/Finance.": "درجة أو دبلوم في المحاسبة/المالية.",
    "Experience with basic accounting systems.": "خبرة في أنظمة المحاسبة الأساسية.",
    "Excellent communication skills and empathy.": "مهارات تواصل ممتازة وتعاطف.",
    "Strong communication and people management skills.": "مهارات قوية في التواصل وإدارة الأفراد.",
    "Physically fit and comfortable with manual handling.": "لياقة بدنية جيدة والقدرة على التعامل اليدوي.",
    "Plan daily routes based on shipment volume.": "خطط المسارات اليومية بناءً على حجم الشحنات.",
    "Coordinate with drivers to avoid failed deliveries.": "نسّق مع السائقين لتجنب فشل عمليات التسليم.",
    "Complete daily assigned delivery routes.": "أكمل مسارات التسليم اليومية الموكلة.",
    "Capture proof of delivery via mobile app.": "سجّل إثبات التسليم عبر تطبيق الهاتف.",
    "Maintain safety, speed and professionalism.": "حافظ على السلامة والسرعة والاحترافية.",
    "Sort parcels by route and destination.": "فرز الطرود حسب المسار والوجهة.",
    "Handle loading/unloading of vehicles.": "التعامل مع تحميل/تفريغ المركبات.",
    "Report damages and discrepancies promptly.": "الإبلاغ عن الأضرار والاختلافات فورًا.",
    "Monitor KPIs such as delivery time, exceptions and returns.": "راقب مؤشرات الأداء مثل وقت التسليم والاستثناءات والمرتجعات.",
    "Track live performance using internal tools.": "تتبّع الأداء المباشر باستخدام الأدوات الداخلية.",
    "Work closely with Dispatch and Warehouse teams.": "العمل عن قرب مع فرق التوزيع والمستودع.",
    "Coordinate inbound and outbound parcel flow.": "تنسيق تدفق الطرود الواردة والصادرة.",
    "Respond to customer queries via phone, email and chat.": "الرد على استفسارات العملاء عبر الهاتف والبريد الإلكتروني والدردشة.",
    "Coordinate with operations for escalated cases.": "التنسيق مع العمليات للحالات المصعّدة.",
    "Capture feedback and suggest service improvements.": "جمع الملاحظات واقتراح تحسينات الخدمة.",
    "Prepare and issue invoices to clients on time.": "إعداد وإصدار الفواتير للعملاء في الوقت المناسب.",
    "Reconcile payments, adjustments and credits.": "مطابقة المدفوعات والتعديلات والأرصدة.",
    "Support management with financial insights.": "دعم الإدارة برؤى مالية.",
    "Manage billing cycles, reconciliations and financial reporting for parcel accounts and partners.": "إدارة دورات الفوترة والمطابقات والتقارير المالية لحسابات الطرود والشركاء.",
    "Pick up and deliver parcels safely and professionally while representing the ParcelLink brand.": "استلام وتسليم الطرود بأمان واحترافية مع تمثيل علامة بارسل لينك.",
    "Plan and assign delivery routes, support drivers on-road and optimize last-mile coverage.": "تخطيط وتوزيع مسارات التسليم، ودعم السائقين ميدانيًا، وتحسين تغطية الميل الأخير.",
    "Scan, sort and stage parcels accurately while maintaining safety and cleanliness standards.": "مسح الطرود وفرزها وتجهيزها بدقة مع الالتزام بمعايير السلامة والنظافة.",
    "Support senders and receivers with tracking, delivery changes and issue resolution across channels.": "دعم المرسلين والمستلمين في التتبع وتغييرات التسليم وحل المشكلات عبر القنوات المختلفة.",
    "Roles are available across Operations, Fleet, Customer Experience and Corporate teams.": "تتوفر الأدوار عبر فرق العمليات والأسطول وتجربة العملاء وفرق الشركات.",
    "Other / General Application": "أخرى / طلب عام",
    "B2B & corporate clients": "عملاء الشركات وB2B",
    "Terms & Conditions | ParcelLink": "الشروط والأحكام | بارسل لينك",
    "Privacy Policy | ParcelLink": "سياسة الخصوصية | بارسل لينك",
    "Partners | ParcelLink": "الشركاء | بارسل لينك",
    "Service Scope": "نطاق الخدمة",
    "Customer Responsibilities": "مسؤوليات العميل",
    "Liability": "المسؤولية",
    "Provide accurate sender and receiver details.": "قدّم بيانات دقيقة للمرسل والمستلم.",
    "Ensure packaging is suitable for transit.": "تأكد من أن التغليف مناسب للنقل.",
    "Declare shipment contents and comply with legal restrictions.": "صرّح بمحتويات الشحنة والتزم بالقيود القانونية.",
    "Pay applicable charges before release where required.": "ادفع الرسوم المستحقة قبل الإفراج عند الحاجة.",
    "For terms-related questions, contact": "للاستفسارات المتعلقة بالشروط، تواصل مع",
    "Information We Collect": "المعلومات التي نجمعها",
    "How We Use Your Information": "كيف نستخدم معلوماتك",
    "Data Security": "أمن البيانات",
    "Process parcel bookings, tracking, and delivery operations.": "معالجة حجوزات الطرود والتتبع وعمليات التسليم.",
    "Generate receipts, billing records, and account history.": "إنشاء الإيصالات وسجلات الفوترة وسجل الحساب.",
    "Send service notifications and support updates.": "إرسال إشعارات الخدمة وتحديثات الدعم.",
    "Improve reliability, fraud prevention, and platform security.": "تحسين الموثوقية ومنع الاحتيال وأمن المنصة.",
    "For privacy requests or questions, contact us at": "لطلبات الخصوصية أو الاستفسارات، تواصل معنا على",
    "Last updated: March 5, 2026": "آخر تحديث: 5 مارس 2026",
    "ParcelLink Logistics. All rights reserved.": "بارسل لينك للخدمات اللوجستية. جميع الحقوق محفوظة.",
    "Logistics Partners": "شركاء الخدمات اللوجستية",
    "Storage Partners": "شركاء التخزين",
    "Enterprise Merchants": "تجّار المؤسسات",
    "Join our transport and distribution network for route-level collaboration and delivery optimization.": "انضم إلى شبكة النقل والتوزيع لدينا للتعاون على مستوى المسارات وتحسين التسليم.",
    "Offer warehousing capacity, inventory handling, and fulfillment support through structured service agreements.": "قدّم سعة تخزينية ومعالجة للمخزون ودعمًا للتنفيذ عبر اتفاقيات خدمة منظمة.",
    "Integrate shipping operations, tracking, and dispatch workflows for scalable customer delivery experiences.": "دمج عمليات الشحن والتتبع وسير عمل التوزيع لتجارب تسليم قابلة للتوسع.",
    "© 2025 ParcelLink Logistics. All Rights Reserved.": "© 2025 بارسل لينك للخدمات اللوجستية. جميع الحقوق محفوظة.",
    "➕ Add another package": "➕ إضافة طرد آخر",
    "🔥 10% discount on all freights": "🔥 خصم 10% على جميع الشحنات",
    "🚚 20% discount if parcel is greater than 100kg": "🚚 خصم 20% إذا كان وزن الشحنة أكثر من 100 كجم",
    "123 Main St, Dubai": "123 الشارع الرئيسي، دبي",
    "2026 ParcelLink. All rights reserved.": "2026 بارسل لينك. جميع الحقوق محفوظة.",
    "456 Oxford St, London": "456 شارع أكسفورد، لندن",
    "About Us": "من نحن",
    "Abu Dhabi": "أبوظبي",
    "Accelerate your supply chain using our efficient cross-docking and cargo transfer services.": "سرّع سلسلة الإمداد لديك عبر خدمات النقل العابر وتحويل الشحنات بكفاءة.",
    "Access Client Dashboard": "الوصول إلى لوحة العميل",
    "Account & Login": "الحساب وتسجيل الدخول",
    "ADMINISTRATIVE": "الإدارة",
    "Administrator": "المسؤول",
    "After the merchant approves, we arrange the pickup.": "بعد موافقة التاجر، نقوم بترتيب الاستلام.",
    "Ajman": "عجمان",
    "Be part of a modern tech-enabled logistics company.": "كن جزءًا من شركة لوجستية حديثة مدعومة بالتقنية.",
    "Billing issues, refunds, payment failures, and transaction verification.": "مشكلات الفوترة، الاسترداد، فشل الدفع، والتحقق من المعاملات.",
    "Blog": "المدونة",
    "Bonded warehouse processing": "إجراءات المستودعات الجمركية",
    "Browse available roles and apply for the one that best matches your experience.": "تصفّح الوظائف المتاحة وقدّم على الوظيفة الأنسب لخبرتك.",
    "Build Your Career with ParcelLink": "ابنِ مسيرتك المهنية مع بارسل لينك",
    "Business Bay, Dubai": "الخليج التجاري، دبي",
    "Business dashboards for delivery, revenue, and performance metrics.": "لوحات أعمال لمؤشرات التسليم والإيرادات والأداء.",
    "Business-level operational insights": "رؤى تشغيلية على مستوى الأعمال",
    "Calculate Shipping": "احسب تكلفة الشحن",
    "Calculate UAE Shipping": "احسب شحن الإمارات",
    "CAREERS": "الوظائف",
    "Careers | ParcelLink Logistics": "الوظائف | بارسل لينك للخدمات اللوجستية",
    "Clear Shipments Faster": "سرّع تخليص الشحنات",
    "CLIENT ZONE": "منطقة العملاء",
    "Company": "الشركة",
    "Contact": "اتصل بنا",
    "Contact support immediately.": "تواصل مع الدعم فورًا.",
    "Cookies": "ملفات تعريف الارتباط",
    "Corporate SME quotes coming soon. Please use International or UAE-to-UAE for now.": "عروض الشركات الصغيرة والمتوسطة قريبًا. يرجى استخدام الشحن الدولي أو الشحن داخل الإمارات حاليًا.",
    "Corporate SME’s": "حلول الشركات الصغيرة والمتوسطة",
    "Create Transfer Shipment": "إنشاء شحنة تحويل",
    "Cross-Docking": "النقل العابر",
    "Customer Experience": "تجربة العملاء",
    "Customs & Bonded": "الجمارك والمستودعات الجمركية",
    "Damaged parcels, insurance claims, return support.": "الطرود المتضررة، مطالبات التأمين، ودعم المرتجعات.",
    "Delivery Location": "موقع التسليم",
    "Delivery performance analytics": "تحليلات أداء التسليم",
    "Driver": "سائق",
    "Driver/partner onboarding, documentation, payout cycles, navigation.": "تهيئة السائقين/الشركاء، التوثيق، دورات الدفعات، والملاحة.",
    "Drivers & Riders": "السائقون والمندوبون",
    "Dubai": "دبي",
    "Dubai, UAE": "دبي، الإمارات",
    "Duty handling, paperwork, and faster border clearance workflows.": "إدارة الرسوم والمستندات وسير عمل أسرع للتخليص الحدودي.",
    "Duty-free logistics solutions": "حلول لوجستية معفاة من الرسوم",
    "Email or Suite Number": "البريد الإلكتروني أو رقم الجناح",
    "Ensure correct input.": "يرجى التأكد من صحة الإدخال.",
    "Ensure Secure Packaging": "ضمان تغليف آمن",
    "Enter password": "أدخل كلمة المرور",
    "Enterprise Logistics": "الخدمات اللوجستية للمؤسسات",
    "Experience faster international shipping with our bonded warehousing and duty-free customs clearance solutions.": "استمتع بشحن دولي أسرع عبر حلول المستودعات الجمركية والتخليص المعفى من الرسوم.",
    "Explore All Supported Stores": "استعرض جميع المتاجر المدعومة",
    "Export": "تصدير",
    "Express": "سريع",
    "Express Delivery": "توصيل سريع",
    "Facebook": "فيسبوك",
    "Fast claims resolution": "معالجة سريعة للمطالبات",
    "Fast Delivery • Best Rates • Zero Hassle": "توصيل سريع • أفضل الأسعار • بدون تعقيد",
    "Faster customs clearance worldwide": "تخليص جمركي أسرع حول العالم",
    "Faster regional and international distribution": "توزيع إقليمي ودولي أسرع",
    "Find answers, resolve issues, and get expert support - quickly and efficiently.": "اعثر على الإجابات، وحل المشكلات، واحصل على دعم متخصص بسرعة وكفاءة.",
    "for individuals, SMEs, and enterprise clients across the UAE.": "للأفراد والشركات الصغيرة والمتوسطة وعملاء المؤسسات في جميع أنحاء الإمارات.",
    "Fragile, handle with care": "قابل للكسر، يُرجى التعامل بحذر",
    "Freight & Cargo": "الشحن والبضائع",
    "From": "من",
    "From secure shipping and intelligent storage to customs processing and live operational analytics, ParcelLink delivers an end-to-end logistics experience for individuals, merchants, and enterprise teams.": "من الشحن الآمن والتخزين الذكي إلى المعالجة الجمركية والتحليلات التشغيلية المباشرة، تقدم بارسل لينك تجربة لوجستية متكاملة للأفراد والتجار وفرق المؤسسات.",
    "Full name": "الاسم الكامل",
    "Full Name": "الاسم الكامل",
    "Full-value coverage and rapid claims support for high-value goods.": "تغطية كاملة القيمة ودعم سريع للمطالبات للبضائع عالية القيمة.",
    "Full-value insurance coverage": "تغطية تأمينية كاملة القيمة",
    "Gain Tailored Insights": "احصل على رؤى مخصصة",
    "Get In Touch": "تواصل معنا",
    "Get Protected": "احصل على الحماية",
    "Global": "عالمي",
    "Growth & Innovation": "النمو والابتكار",
    "Heavy-duty boxing for bulk cargo": "تغليف قوي للشحنات الضخمة",
    "Height (cm)": "الارتفاع (سم)",
    "HELP": "المساعدة",
    "Help Center | ParcelLink": "مركز المساعدة | بارسل لينك",
    "HOME": "الرئيسية",
    "How can we help you today?": "كيف يمكننا مساعدتك اليوم؟",
    "How do I return a parcel?": "كيف يمكنني إرجاع طرد؟",
    "I entered the wrong address": "أدخلت عنوانًا خاطئًا",
    "I missed my delivery": "فاتني التسليم",
    "ID, name, email, role": "المعرف، الاسم، البريد الإلكتروني، الدور",
    "If dispatch has not started, we can update the address.": "إذا لم يبدأ الإرسال بعد، يمكننا تحديث العنوان.",
    "If you don't find an exact role that fits your profile, you can still send us a general application.": "إذا لم تجد وظيفة مطابقة تمامًا لملفك، يمكنك إرسال طلب عام.",
    "If your parcel is over 48 hours late, contact support.": "إذا تأخر طردك أكثر من 48 ساعة، تواصل مع الدعم.",
    "Import": "استيراد",
    "Import and export documentation": "مستندات الاستيراد والتصدير",
    "Import and export support": "دعم الاستيراد والتصدير",
    "Inclusive and performance-driven culture.": "ثقافة شاملة قائمة على الأداء.",
    "Instagram": "إنستغرام",
    "Integrated Logistics Services Built for Reliable Growth": "خدمات لوجستية متكاملة مصممة لنمو موثوق",
    "Inter-City": "بين المدن",
    "International Shipping": "شحن دولي",
    "International shipping compliant packing": "تغليف متوافق مع متطلبات الشحن الدولي",
    "Investor": "مستثمر",
    "Join a fast-growing last-mile logistics team in Dubai, delivering thousands of parcels daily": "انضم إلى فريق لوجستي سريع النمو للميل الأخير في دبي يوصل آلاف الطرود يوميًا",
    "Join ParcelLink and enjoy fast global deliveries": "انضم إلى بارسل لينك واستمتع بتوصيل عالمي سريع",
    "L x W x H (cm)": "الطول × العرض × الارتفاع (سم)",
    "Large Parcel": "طرد كبير",
    "Length (cm)": "الطول (سم)",
    "Liability, claims windows, and compensation limits are governed by service type and applicable law. Supporting documents may be required for investigation.": "تخضع المسؤولية وفترات المطالبات وحدود التعويض لنوع الخدمة والقانون المعمول به، وقد تُطلب مستندات داعمة للتحقيق.",
    "LinkedIn": "لينكدإن",
    "Live tracking dashboards": "لوحات تتبع مباشرة",
    "Local and international protection": "حماية محلية ودولية",
    "Log in to your ParcelLink Account": "سجّل الدخول إلى حسابك في بارسل لينك",
    "Logistics & Fleet": "اللوجستيات والأسطول",
    "London": "لندن",
    "Long-term and short-term storage available": "يتوفر تخزين قصير وطويل الأجل",
    "Manage your parcels, view shipment history, download invoices, and track deliveries in one secure place.": "أدر طرودك، واطّلع على سجل الشحنات، وحمّل الفواتير، وتتبع التسليمات في مكان آمن واحد.",
    "Management": "الإدارة",
    "Medium Parcel": "طرد متوسط",
    "Minimum 8 characters": "8 أحرف على الأقل",
    "Monitor shipments, track performance, and analyze logistics data with our intelligent real-time dashboard.": "راقب الشحنات وتتبع الأداء وحلل البيانات اللوجستية عبر لوحة معلومات ذكية وفورية.",
    "My parcel is delayed": "طردي متأخر",
    "My tracking number is invalid": "رقم التتبع غير صحيح",
    "New secure password": "كلمة مرور جديدة وآمنة",
    "Only if needed": "فقط عند الحاجة",
    "Open Live Dashboard": "افتح لوحة المعلومات المباشرة",
    "Open Positions": "الوظائف المتاحة",
    "Operational Insights": "رؤى تشغيلية",
    "Opportunities across Operations, Dispatch, Fleet, and Corporate roles.": "فرص عبر العمليات والتوزيع والأسطول والأدوار المؤسسية.",
    "Optimize Storage Solutions": "حسّن حلول التخزين",
    "Our analytics suite gives teams clear visibility into operations, service levels, revenue patterns, and dispatch performance.": "توفر مجموعة التحليلات لدينا رؤية واضحة للفرق حول العمليات ومستويات الخدمة وأنماط الإيرادات وأداء التوزيع.",
    "Our courier will try again within 24 hours.": "سيحاول مندوبنا التسليم مرة أخرى خلال 24 ساعة.",
    "Our cross-docking and transfer systems reduce idle time and accelerate regional and international distribution.": "تقلل أنظمة النقل العابر والتحويل لدينا وقت التعطل وتسرّع التوزيع الإقليمي والدولي.",
    "Our professional packaging standards protect your goods from vibration, impact, humidity, and route-specific handling conditions.": "تحمي معايير التغليف الاحترافية لدينا بضائعك من الاهتزاز والصدمات والرطوبة وظروف المناولة الخاصة بكل مسار.",
    "Our Services": "خدماتنا",
    "OUR SERVICES": "خدماتنا",
    "Our Services | ParcelLink": "خدماتنا | بارسل لينك",
    "Our smart warehousing technology ensures inventory is stored, managed, and dispatched with predictable speed and security.": "تضمن تقنيات المستودعات الذكية لدينا تخزين المخزون وإدارته وإرساله بسرعة متوقعة وبأمان.",
    "Our support team is available 24/7 to assist you.": "فريق الدعم لدينا متاح على مدار الساعة لمساعدتك.",
    "Our Value-Added Logistics Services": "خدماتنا اللوجستية ذات القيمة المضافة",
    "Oversee day-to-day hub activities, ensuring parcels move on time and according to service-level agreements.": "الإشراف على أنشطة المركز اليومية لضمان تحرك الطرود في الوقت المحدد ووفق اتفاقيات مستوى الخدمة.",
    "Pack & Ship Securely": "غلّف واشحن بأمان",
    "Pack and Ship Now": "غلّف واشحن الآن",
    "Package 1": "الطرد 1",
    "Package status, delivery delays, missed delivery, location issues.": "حالة الطرد، تأخر التسليم، فوات التسليم، ومشكلات الموقع.",
    "Package Type": "نوع الطرد",
    "ParcelLink": "بارسل لينك",
    "ParcelLink collects details required to process shipping and support requests, including contact data, shipment information, and account credentials.": "تجمع بارسل لينك البيانات اللازمة لمعالجة طلبات الشحن والدعم، بما في ذلك بيانات الاتصال ومعلومات الشحنة وبيانات الحساب.",
    "ParcelLink provides shipping and logistics services subject to availability, route limitations, and operational safety requirements.": "تقدم بارسل لينك خدمات الشحن والخدمات اللوجستية وفق التوفر وحدود المسارات ومتطلبات السلامة التشغيلية.",
    "Partner Support": "دعم الشركاء",
    "Partners": "الشركاء",
    "Password issues, authentication errors, updating profile details.": "مشكلات كلمة المرور، أخطاء التحقق، وتحديث بيانات الملف الشخصي.",
    "Payments & Charges": "المدفوعات والرسوم",
    "Pickup Location": "موقع الاستلام",
    "Pickup problems, address errors, packaging requirements.": "مشكلات الاستلام، أخطاء العنوان، ومتطلبات التغليف.",
    "Press & Media": "الإعلام والصحافة",
    "Privacy": "الخصوصية",
    "Process International Shipment": "معالجة شحنة دولية",
    "Professional packaging standards for domestic and global shipping.": "معايير تغليف احترافية للشحن المحلي والعالمي.",
    "Protect your goods using professional packaging engineered for impact resistance and long-distance shipping.": "احمِ بضائعك بتغليف احترافي مصمم لمقاومة الصدمات والشحن لمسافات طويلة.",
    "Protect Your Shipments": "احمِ شحناتك",
    "Provide sender and receiver details to create a seamless delivery experience.": "قدّم بيانات المرسل والمستلم لإنشاء تجربة تسليم سلسة.",
    "Rapid inbound-to-outbound transfers that cut delays and cost.": "تحويلات سريعة من الوارد إلى الصادر تقلل التأخير والتكلفة.",
    "Real-time inventory visibility": "رؤية فورية للمخزون",
    "Real-time shipment visibility": "رؤية فورية للشحنات",
    "Reduced cargo handling damage": "تقليل أضرار مناولة الشحنات",
    "Reduced warehousing costs": "خفض تكاليف التخزين",
    "Regional transfer capability": "قدرة تحويل إقليمية",
    "Reliable Logistics Services You Can Trust": "خدمات لوجستية موثوقة يمكنك الاعتماد عليها",
    "Request Storage Partnership": "طلب شراكة تخزين",
    "Returns & Claims": "المرتجعات والمطالبات",
    "Returns depend on the merchant.": "المرتجعات تعتمد على سياسة التاجر.",
    "Revenue and shipment reporting": "تقارير الإيرادات والشحنات",
    "Risk-free shipping for fragile and high-value goods": "شحن آمن للبضائع الهشة وعالية القيمة",
    "Same-day": "نفس اليوم",
    "Same-day inbound-to-outbound movement": "حركة من الوارد إلى الصادر في نفس اليوم",
    "Secure Packaging": "تغليف آمن",
    "Secure your parcels against loss, damage, and unexpected transit risks with our comprehensive freight insurance solutions.": "أمّن طرودك ضد الفقدان أو التلف والمخاطر غير المتوقعة أثناء النقل عبر حلول التأمين الشاملة لدينا.",
    "SEND": "إرسال",
    "Send a General Application": "إرسال طلب عام",
    "Send Parcel": "إرسال طرد",
    "Send Parcel | ParcelLink": "إرسال طرد | بارسل لينك",
    "Send Parcel International": "إرسال طرد دولي",
    "Send UAE to UAE": "إرسال داخل الإمارات",
    "Send UAE To UAE": "إرسال داخل الإمارات",
    "Sending a Parcel": "إرسال طرد",
    "Sharjah": "الشارقة",
    "Ship With Full Protection": "اشحن مع حماية كاملة",
    "Shipment Protection": "حماية الشحنات",
    "Shipping Calculator": "حاسبة الشحن",
    "Shock-resistant packaging": "تغليف مقاوم للصدمات",
    "Shop Your Favorite UAE & GCC Stores": "تسوق من أشهر متاجر الإمارات والخليج",
    "Simplify Customs Duties": "بسّط الإجراءات الجمركية",
    "Small Parcel": "طرد صغير",
    "Smart logistics and freight solutions built for speed, reliability, and scale.": "حلول لوجستية وشحن ذكية مصممة للسرعة والموثوقية وقابلية التوسع.",
    "Smart storage, live inventory control, and climate-safe options.": "تخزين ذكي، تحكم مباشر بالمخزون، وخيارات آمنة مناخيًا.",
    "Smart warehouse automation": "أتمتة ذكية للمستودعات",
    "Speed Up Delivery": "سرّع التسليم",
    "Staff": "الموظفون",
    "Store, manage, and control your inventory with real-time warehouse visibility and smart storage technology.": "قم بتخزين وإدارة والتحكم في مخزونك برؤية فورية وتقنيات تخزين ذكية.",
    "Streamline Transfers": "سهولة نقل الشحنات",
    "Structured training, mentorship and clear growth paths.": "تدريب منظم وإرشاد ومسارات نمو واضحة.",
    "Support": "الدعم",
    "Tell us a bit about your experience and availability": "أخبرنا قليلًا عن خبرتك ومدى توفرك",
    "Temperature-controlled secure facilities": "مرافق آمنة مع تحكم بدرجة الحرارة",
    "Terms": "الشروط",
    "The Cheapest Parcel Delivery In The UAE.": "أرخص خدمة توصيل طرود في الإمارات.",
    "Toggle navigation menu": "تبديل قائمة التنقل",
    "TRACK": "تتبع",
    "Track | ParcelLink": "تتبع | بارسل لينك",
    "Track Parcel": "تتبع الطرد",
    "Track Shipment": "تتبع الشحنة",
    "Tracking & Delivery": "التتبع والتسليم",
    "Tracking may activate 1-3 hours after parcel creation.": "قد يتفعّل التتبع خلال 1-3 ساعات بعد إنشاء الطرد.",
    "Tracking Page": "صفحة التتبع",
    "Twitter": "إكس",
    "Type your order number to see the latest delivery status in real time.": "أدخل رقم طلبك لرؤية أحدث حالة للتسليم في الوقت الفعلي.",
    "United Arab Emirates": "الإمارات العربية المتحدة",
    "United Kingdom": "المملكة المتحدة",
    "Updates appear instantly as the parcel moves through our network.": "تظهر التحديثات فورًا أثناء انتقال الطرد عبر شبكتنا.",
    "USA": "الولايات المتحدة",
    "Use your assigned unique Staff ID and password to access your workspace. Account creation and password governance are handled by Staff Access Manager.": "استخدم معرّف الموظف الفريد وكلمة المرور المخصصين لك للوصول إلى مساحة العمل. تتم إدارة إنشاء الحسابات وسياسات كلمات المرور عبر مدير وصول الموظفين.",
    "Use your tracking number on our": "استخدم رقم التتبع الخاص بك على",
    "View Open Roles": "عرض الوظائف المفتوحة",
    "View Storage Options": "عرض خيارات التخزين",
    "Warehousing": "التخزين",
    "Waterproof and climate-safe protection": "حماية مقاومة للماء وآمنة مناخيًا",
    "We apply technical and organizational safeguards to protect stored and transmitted information. Access is restricted to authorized personnel and systems.": "نطبق ضوابط تقنية وتنظيمية لحماية المعلومات المخزنة والمنقولة. ويقتصر الوصول على الأفراد والأنظمة المصرح لهم فقط.",
    "We eliminate border delays with professional bonded warehousing and efficient customs support built for global trade flows.": "نزيل التأخيرات الحدودية عبر مستودعات جمركية احترافية ودعم جمركي فعّال مصمم لتدفقات التجارة العالمية.",
    "We work with logistics operators, warehousing providers, and enterprise merchants to extend reliable last-mile and freight capabilities across the UAE and beyond.": "نعمل مع مشغلي اللوجستيات ومزودي التخزين وتجار المؤسسات لتوسيع قدرات الميل الأخير والشحن الموثوقة في الإمارات وخارجها.",
    "We're always interested in meeting passionate people who want to grow with us.": "نحن دائمًا مهتمون بالتعرّف على أشخاص طموحين يرغبون في النمو معنا.",
    "Weather, traffic, holidays, or customs may cause delays.": "قد تتسبب الأحوال الجوية أو الازدحام أو العطلات أو الجمارك في التأخير.",
    "Where is my package?": "أين طردي؟",
    "Whether you're shipping across the UAE or sending parcels worldwide, ParcelLink ensures smooth, fast, and secure deliveries. Our logistics network operates with precision, giving you confidence that every shipment is handled professionally from pick-up to drop-off.": "سواء كنت تشحن داخل الإمارات أو ترسل طرودًا إلى أنحاء العالم، تضمن بارسل لينك توصيلًا سلسًا وسريعًا وآمنًا. تعمل شبكتنا اللوجستية بدقة عالية لتمنحك الثقة بأن كل شحنة تُدار باحترافية من الاستلام حتى التسليم.",
    "Why Work at ParcelLink?": "لماذا العمل في بارسل لينك؟",
    "Width (cm)": "العرض (سم)",
    "You can also request redelivery or pickup from the nearest hub.": "يمكنك أيضًا طلب إعادة التسليم أو الاستلام من أقرب مركز.",
    "Your cargo deserves absolute protection. Our insurance programs are designed to secure every shipment from pickup to final delivery.": "شحناتك تستحق حماية كاملة. برامج التأمين لدينا مصممة لتأمين كل شحنة من الاستلام حتى التسليم النهائي.",
    "Your full name": "اسمك الكامل",
    "Your trusted logistics partner delivering excellence across the UAE and worldwide with speed, reliability, and care.": "شريكك اللوجستي الموثوق لتقديم خدمة متميزة داخل الإمارات وحول العالم بسرعة وموثوقية واهتمام.",
    "YouTube": "يوتيوب",
    "20% discount if parcel is greater than 100kg": "خصم 20% إذا كان وزن الشحنة أكثر من 100 كجم",
    "10% discount on all freights": "خصم 10% على جميع الشحنات",
    "ðŸšš 20% discount if parcel is greater than 100kg": "🚚 خصم 20% إذا كان وزن الشحنة أكثر من 100 كجم",
    "ðŸ”¥ 10% discount on all freights": "🔥 خصم 10% على جميع الشحنات"
  };

  const literalFallbackEn = Object.fromEntries(
    Object.entries(literalFallbackAr).map(([en, ar]) => [ar, en])
  );

  const literalEntriesAr = Object.entries(literalFallbackAr).sort((a, b) => b[0].length - a[0].length);
  const literalEntriesEn = Object.entries(literalFallbackEn).sort((a, b) => b[0].length - a[0].length);

  const normalizeLanguage = (value) => {
    const normalized = (value || "").toLowerCase();
    return SUPPORTED_LANGUAGES.includes(normalized) ? normalized : FALLBACK_LANGUAGE;
  };

  const textNodeOriginal = new WeakMap();
  const attrOriginal = new WeakMap();
  let mutationObserver = null;
  let mutationTimer = null;
  let mutationPassActive = false;

  let currentLanguage = (() => {
    try {
      const rawStored = localStorage.getItem(STORAGE_KEY);
      if (rawStored) return normalizeLanguage(rawStored);
    } catch (_) {
      // ignore storage failures
    }
    return FALLBACK_LANGUAGE;
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

  const ensureNoTranslateMeta = () => {
    document.documentElement.classList.add("notranslate");
    document.documentElement.setAttribute("translate", "no");
    if (document.body) {
      document.body.classList.add("notranslate");
      document.body.setAttribute("translate", "no");
    }

    if (!document.querySelector('meta[name="google"][content="notranslate"]')) {
      const meta = document.createElement("meta");
      meta.name = "google";
      meta.content = "notranslate";
      document.head.appendChild(meta);
    }
  };

  const injectRuntimeStyles = () => {
    if (document.getElementById(RUNTIME_STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = RUNTIME_STYLE_ID;
    style.textContent = `
      .lang-switcher {
        position: fixed !important;
        right: 20px !important;
        top: auto !important;
        bottom: 20px !important;
        z-index: 4000;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px;
        background: rgba(255, 255, 255, 0.96);
        border: 1px solid #dbe3f0;
        border-radius: 999px;
        box-shadow: 0 10px 30px rgba(2, 8, 23, 0.15);
      }

      .lang-switch-btn {
        border: 1px solid #c7d2fe;
        background: #fff;
        color: #1d6cff;
        border-radius: 999px;
        min-width: 88px;
        padding: 8px 14px;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
      }

      .lang-switch-btn.active {
        background: #1d6cff;
        border-color: #1d6cff;
        color: #fff;
      }

      html[lang="ar"] body {
        font-family: 'Tajawal', 'Poppins', sans-serif !important;
      }

      html[dir="rtl"] .lang-switcher {
        right: auto !important;
        left: 20px !important;
        bottom: 20px !important;
      }

      .send-hero,
      .hero,
      .hero-section {
        overflow: visible;
      }

      body {
        padding-bottom: 88px;
      }

      .notranslate {
        translate: no;
      }

      @media (max-width: 768px) {
        .lang-switcher {
          right: 12px !important;
          bottom: 12px !important;
          gap: 6px;
          padding: 7px 9px;
        }

        html[dir="rtl"] .lang-switcher {
          right: auto !important;
          left: 12px !important;
        }

        .lang-switch-btn {
          min-width: 76px;
          padding: 7px 12px;
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

  const shouldIgnoreTextNode = (node) => {
    if (!node || !node.parentElement) return true;
    const parent = node.parentElement;
    const tag = (parent.tagName || "").toLowerCase();
    if (["script", "style", "noscript", "textarea"].includes(tag)) return true;
    if (parent.closest(".lang-switcher")) return true;
    if (parent.closest("[data-i18n], [data-i18n-placeholder]")) return true;
    return false;
  };

  const preserveWhitespace = (originalText, translatedText) => {
    const leading = originalText.match(/^\s*/)?.[0] || "";
    const trailing = originalText.match(/\s*$/)?.[0] || "";
    return `${leading}${translatedText}${trailing}`;
  };

  const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const replaceLiteralText = (rawText, language) => {
    const sourceMap = language === "ar" ? literalFallbackAr : literalFallbackEn;
    const trimmed = rawText.trim();
    if (!trimmed) return rawText;

    const direct = sourceMap[trimmed];
    if (direct) return preserveWhitespace(rawText, direct);

    let updated = rawText;
    const entries = language === "ar" ? literalEntriesAr : literalEntriesEn;
    for (const [from, to] of entries) {
      if (updated.includes(from)) {
        const pattern = new RegExp(`(^|[^\\p{L}\\p{N}])(${escapeRegExp(from)})(?=$|[^\\p{L}\\p{N}])`, "gu");
        updated = updated.replace(pattern, (match, prefix) => `${prefix}${to}`);
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

  const scheduleMutationTranslationPass = () => {
    if (mutationTimer) {
      clearTimeout(mutationTimer);
    }

    mutationTimer = setTimeout(() => {
      if (mutationPassActive) return;
      mutationPassActive = true;
      try {
        applyLiteralFallbackTranslations();
      } finally {
        mutationPassActive = false;
      }
    }, 120);
  };

  const startAutoTranslationObserver = () => {
    if (mutationObserver || !document.body) return;

    mutationObserver = new MutationObserver((mutations) => {
      if (mutationPassActive) return;

      const shouldTranslate = mutations.some((mutation) => {
        if (mutation.type === "characterData") return true;
        if (mutation.type === "attributes") return true;
        return mutation.type === "childList" && (mutation.addedNodes?.length || mutation.removedNodes?.length);
      });

      if (shouldTranslate) {
        scheduleMutationTranslationPass();
      }
    });

    mutationObserver.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "title", "aria-label"]
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
    if (!document.querySelector("title[data-i18n]")) {
      document.title = t("meta.title", document.title);
    }

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

    const enButton = document.querySelector("[data-lang-switch='en']");
    const arButton = document.querySelector("[data-lang-switch='ar']");

    if (enButton) {
      enButton.textContent = t("switch.en", "English");
      enButton.classList.toggle("active", currentLanguage === "en");
    }
    if (arButton) {
      arButton.textContent = t("switch.ar", "Arabic");
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
      <button type="button" class="lang-switch-btn" data-lang-switch="en">English</button>
      <button type="button" class="lang-switch-btn" data-lang-switch="ar">Arabic</button>
    `;

    wrapper.querySelectorAll("[data-lang-switch]").forEach((button) => {
      button.addEventListener("click", () => {
        const lang = button.getAttribute("data-lang-switch");
        setLanguage(lang, { persist: true });
      });
    });

    document.body.appendChild(wrapper);
  };

  const createLanguagePrompt = () => {};

  window.ParcelLinkI18n = {
    t,
    setLanguage,
    getLanguage: () => currentLanguage
  };

  document.addEventListener("DOMContentLoaded", () => {
    ensureArabicFont();
    ensureNoTranslateMeta();
    injectRuntimeStyles();
    installDialogTranslationWrappers();
    createLanguageSwitcher();
    applyTranslations();
    updateSwitcherPosition();
    startAutoTranslationObserver();

    window.addEventListener("resize", updateSwitcherPosition);
    window.addEventListener("load", updateSwitcherPosition);
    setTimeout(updateSwitcherPosition, 200);
    setTimeout(updateSwitcherPosition, 800);
  });
})();
