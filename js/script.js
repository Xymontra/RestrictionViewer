// Sistem durumu kontrolü
const startTime = performance.now(); // İsteğin başlangıç zamanını al

// Status Toggle (Aç/Kapa)
const statusToggle = document.getElementById("status-toggle");

// Genel Durum Kontrolü
let isAllOperational = true; // Varsayılan olarak tüm sistemler çalışıyor

function updateSystemStatus() {
  const statusToggle = document.getElementById("status-toggle");

  // Backend ve YouTube API durumlarını kontrol et
  Promise.all([
    fetch("https://restrictionchecker.onrender.com/healthz"),
    fetch("https://restrictionchecker.onrender.com/check_youtube"),
  ])
    .then((responses) => Promise.all(responses.map((res) => res.json())))
    .then((data) => {
      const backendStatus = data[0].status === "ok";
      const youtubeStatus = data[1].status === "Operational";

      if (backendStatus && youtubeStatus) {
        // Tüm sistemler çalışıyorsa yeşil animasyon
        statusToggle.classList.remove("status-btn-error");
        statusToggle.classList.add("status-btn-operational");
        statusToggle.textContent = "All Systems Operational";
      } else {
        // Bir veya daha fazla sistemde sorun varsa kırmızı animasyon
        statusToggle.classList.remove("status-btn-operational");
        statusToggle.classList.add("status-btn-error");
        statusToggle.textContent = "System Error Detected";
      }
    })
    .catch((error) => {
      // Hata durumunda kırmızı animasyon
      console.error("System status check failed:", error);
      statusToggle.classList.remove("status-btn-operational");
      statusToggle.classList.add("status-btn-error");
      statusToggle.textContent = "System Error Detected";
    });
}

// Sayfa yüklendiğinde sistem durumunu kontrol et
document.addEventListener("DOMContentLoaded", updateSystemStatus);

// Belirli bir aralıkla (örneğin her 10 saniyede bir) sistem durumunu kontrol et
setInterval(updateSystemStatus, 600000);


const statusDetails = document.getElementById("status-details");

// Tıklama olayını dinle
statusToggle.addEventListener("click", () => {
  // Durumu kontrol et ve sınıfları değiştir
  if (statusDetails.classList.contains("status-hidden")) {
    statusDetails.classList.remove("status-hidden");
    statusDetails.classList.add("status-visible");
  } else {
    statusDetails.classList.remove("status-visible");
    statusDetails.classList.add("status-hidden");
  }
});




// Backend Durumu (API)
// Backend (API)
fetch("https://restrictionchecker.onrender.com/healthz")
  .then((response) => response.json())
  .then((data) => {
    const apiStatus = document.getElementById("api-status");
    if (data.status === "ok") {
      apiStatus.textContent = "Operational";
      apiStatus.classList.add("status-operational");
    } else {
      apiStatus.textContent = "Error";
      apiStatus.classList.add("status-error");
    }
  })
  .catch(() => {
    const apiStatus = document.getElementById("api-status");
    apiStatus.textContent = "Error";
    apiStatus.classList.add("status-error");
  });


// Frontend Durumu (Netlify)
fetch(window.location.href)
  .then((response) => {
    const uiStatus = document.getElementById("ui-status");
    if (response.ok) {
      uiStatus.textContent = "Operational";
      uiStatus.style.color = "green";
    } else {
      uiStatus.textContent = "Error";
      uiStatus.style.color = "red";
    }
  })
  .catch(() => {
    const uiStatus = document.getElementById("ui-status");
    uiStatus.textContent = "Error";
    uiStatus.style.color = "red";
  });

// YouTube API Durumu
fetch("https://restrictionchecker.onrender.com/check_youtube")
  .then((response) => response.json())
  .then((data) => {
    const youtubeStatus = document.getElementById("youtube-status");
    if (data.status === "Operational") {
      youtubeStatus.textContent = "Operational";
      youtubeStatus.style.color = "green";
    } else {
      youtubeStatus.textContent = "Error";
      youtubeStatus.style.color = "red";
    }
  })
  .catch((error) => {
    const youtubeStatus = document.getElementById("youtube-status");
    youtubeStatus.textContent = "Error";
    youtubeStatus.style.color = "red";
    console.error("Error fetching YouTube status:", error);
  });




  const map = L.map("map", {
    maxBounds: [
      [-90, -180], // Güneybatı köşesi
      [90, 180],   // Kuzeydoğu köşesi
    ],
    maxBoundsViscosity: 1.0,
  }).setView([20, 0], 2);
  
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
  }).addTo(map);
  

function showBlockedRegions(blockedRegions) {
  blockedRegions.forEach((region) => {
    const coords = regionCoordinates[region]; // Bölge koordinatlarını eşleştirin
    if (coords) {
      const marker = L.marker(coords).addTo(map);
      marker.bindPopup(`<b>${region}</b> - Restricted`);
      marker.on("mouseover", function () {
        this.openPopup();
      });
      marker.on("mouseout", function () {
        this.closePopup();
      });
    }
  });
}

// Dummy koordinatlar
const regionCoordinates = {
  AD: [42.546245, 1.601554], // Andorra
  AE: [23.424076, 53.847818], // United Arab Emirates
  AF: [33.93911, 67.709953], // Afghanistan
  AG: [17.060816, -61.796428], // Antigua and Barbuda
  AI: [18.220554, -63.068615], // Anguilla
  AL: [41.153332, 20.168331], // Albania
  AM: [40.069099, 45.038189], // Armenia
  AO: [-11.202692, 17.873887], // Angola
  AQ: [-75.250973, -0.071389], // Antarctica
  AR: [-38.416097, -63.616672], // Argentina
  AS: [-14.270972, -170.132217], // American Samoa
  AT: [47.516231, 14.550072], // Austria
  AU: [-25.274398, 133.775136], // Australia
  AW: [12.52111, -69.968338], // Aruba
  AX: [60.178524, 19.91561], // Åland Islands
  AZ: [40.143105, 47.576927], // Azerbaijan
  BA: [43.915886, 17.679076], // Bosnia and Herzegovina
  BB: [13.193887, -59.543198], // Barbados
  BD: [23.684994, 90.356331], // Bangladesh
  BE: [50.503887, 4.469936], // Belgium
  BF: [12.238333, -1.561593], // Burkina Faso
  BG: [42.733883, 25.48583], // Bulgaria
  BH: [25.930414, 50.637772], // Bahrain
  BI: [-3.373056, 29.918886], // Burundi
  BJ: [9.30769, 2.315834], // Benin
  BL: [17.896435, -62.852748], // Saint Barthélemy
  BM: [32.321384, -64.75737], // Bermuda
  BN: [4.535277, 114.727669], // Brunei
  BO: [-16.290154, -63.588653], // Bolivia
  BQ: [12.20189, -68.262383], // Caribbean Netherlands
  BR: [-14.235004, -51.92528], // Brazil
  BS: [25.03428, -77.39628], // Bahamas
  BT: [27.514162, 90.433601], // Bhutan
  BV: [-54.423199, 3.413194], // Bouvet Island
  BW: [-22.328474, 24.684866], // Botswana
  BY: [53.709807, 27.953389], // Belarus
  BZ: [17.189877, -88.49765], // Belize
  CA: [56.130366, -106.346771], // Canada
  CC: [-12.164165, 96.870956], // Cocos Islands
  CD: [-4.038333, 21.758664], // Democratic Republic of the Congo
  CF: [6.611111, 20.939444], // Central African Republic
  CG: [-0.228021, 15.827659], // Republic of the Congo
  CH: [46.818188, 8.227512], // Switzerland
  CI: [7.539989, -5.54708], // Ivory Coast
  CK: [-21.236736, -159.777671], // Cook Islands
  CL: [-35.675147, -71.542969], // Chile
  CM: [7.369722, 12.354722], // Cameroon
  CN: [35.86166, 104.195397], // China
  CO: [4.570868, -74.297333], // Colombia
  CR: [9.748917, -83.753428], // Costa Rica
  CU: [21.521757, -77.781167], // Cuba
  CV: [16.002082, -24.013197], // Cape Verde
  CW: [12.16957, -68.990021], // Curaçao
  CX: [-10.447525, 105.690449], // Christmas Island
  CY: [35.126413, 33.429859], // Cyprus
  CZ: [49.817492, 15.472962], // Czech Republic
  DE: [51.165691, 10.451526], // Germany
  DJ: [11.825138, 42.590275], // Djibouti
  DK: [56.26392, 9.501785], // Denmark
  DM: [15.414999, -61.370976], // Dominica
  DO: [18.735693, -70.162651], // Dominican Republic
  DZ: [28.033886, 1.659626], // Algeria
  EC: [-1.831239, -78.183406], // Ecuador
  EE: [58.595272, 25.013607], // Estonia
  EG: [26.820553, 30.802498], // Egypt
  EH: [24.215527, -12.885834], // Western Sahara
  ER: [15.179384, 39.782334], // Eritrea
  ES: [40.463667, -3.74922], // Spain
  ET: [9.145, 40.489673], // Ethiopia
  FI: [61.92411, 25.748151], // Finland
  FJ: [-16.578193, 179.414413], // Fiji
  FM: [7.425554, 150.550812], // Micronesia
  FO: [61.892635, -6.911806], // Faroe Islands
  FR: [46.603354, 1.888334], // France
  GA: [-0.803689, 11.609444], // Gabon
  GB: [55.378051, -3.435973], // United Kingdom
  GD: [12.262776, -61.604171], // Grenada
  GE: [42.315407, 43.356892], // Georgia
  GF: [3.933889, -53.125782], // French Guiana
  GG: [49.465691, -2.585278], // Guernsey
  GH: [7.946527, -1.023194], // Ghana
  GI: [36.137741, -5.345374], // Gibraltar
  GL: [71.706936, -42.604303], // Greenland
  GM: [13.443182, -15.310139], // Gambia
  GN: [9.945587, -9.696645], // Guinea
  GP: [16.995971, -62.067641], // Guadeloupe
  GQ: [1.650801, 10.267895], // Equatorial Guinea
  GR: [39.074208, 21.824312], // Greece
  GT: [15.783471, -90.230759], // Guatemala
  GU: [13.444304, 144.793731], // Guam
  GW: [11.803749, -15.180413], // Guinea-Bissau
  GY: [4.860416, -58.93018], // Guyana
  HN: [15.199999, -86.241905], // Honduras
  HR: [45.1, 15.2], // Croatia
  HT: [18.971187, -72.285215], // Haiti
  HU: [47.162494, 19.503304], // Hungary
  ID: [-0.789275, 113.921327], // Indonesia
  IE: [53.41291, -8.24389], // Ireland
  IL: [31.046051, 34.851612], // Israel
  IM: [54.236107, -4.548056], // Isle of Man
  IN: [20.593684, 78.96288], // India
  IO: [-6.343194, 71.876519], // British Indian Ocean Territory
  IQ: [33.223191, 43.679291], // Iraq
  IR: [32.427908, 53.688046], // Iran
  IS: [64.963051, -19.020835], // Iceland
  IT: [41.87194, 12.56738], // Italy
  JE: [49.214439, -2.13125], // Jersey
  JM: [18.109581, -77.297508], // Jamaica
  JO: [30.585164, 36.238414], // Jordan
  JP: [36.204824, 138.252924], // Japan
  KE: [-1.286389, 36.817223], // Kenya
  KG: [41.20438, 74.766098], // Kyrgyzstan
  KH: [12.565679, 104.990963], // Cambodia
  KI: [-3.370417, -168.734039], // Kiribati
  KM: [-11.875001, 43.872219], // Comoros
  KN: [17.357822, -62.782998], // Saint Kitts and Nevis
  KP: [40.339852, 127.510093], // North Korea
  KR: [35.907757, 127.766922], // South Korea
  KW: [29.31166, 47.481766], // Kuwait
  KY: [19.3133, -81.2546], // Cayman Islands
  KZ: [48.019573, 66.923684], // Kazakhstan
  LA: [19.85627, 102.495496], // Laos
  LB: [33.854721, 35.862285], // Lebanon
  LC: [13.909444, -60.978893], // Saint Lucia
  LI: [47.166, 9.555373], // Liechtenstein
  LK: [7.873054, 80.771797], // Sri Lanka
  LR: [6.428055, -9.429499], // Liberia
  LS: [-29.609988, 28.233608], // Lesotho
  LT: [55.169438, 23.881275], // Lithuania
  LU: [49.815273, 6.129583], // Luxembourg
  LV: [56.879635, 24.603189], // Latvia
  LY: [26.3351, 17.228331], // Libya
  MA: [31.791702, -7.09262], // Morocco
  MC: [43.750298, 7.412841], // Monaco
  MD: [47.411631, 28.369885], // Moldova
  ME: [42.708678, 19.37439], // Montenegro
  MF: [18.0708, -63.0501], // Saint Martin
  MG: [-18.766947, 46.869107], // Madagascar
  MH: [7.131474, 171.184478], // Marshall Islands
  MK: [41.608635, 21.745275], // North Macedonia
  ML: [17.570692, -3.996166], // Mali
  MM: [21.913965, 95.956223], // Myanmar
  MN: [46.862496, 103.846656], // Mongolia
  MO: [22.198745, 113.543873], // Macau
  MP: [15.0979, 145.6739], // Northern Mariana Islands
  MQ: [14.6415, -61.0242], // Martinique
  MR: [21.00789, -10.940835], // Mauritania
  MS: [16.742498, -62.187366], // Montserrat
  MT: [35.899721, 14.514552], // Malta
  MU: [-20.348404, 57.552152], // Mauritius
  MV: [3.202778, 73.22068], // Maldives
  MW: [-13.254308, 34.301525], // Malawi
  MX: [23.634501, -102.552784], // Mexico
  MY: [4.210484, 101.975766], // Malaysia
  MZ: [-18.665695, 35.529562], // Mozambique
  NA: [-22.95764, 18.49041], // Namibia
  NC: [-20.904305, 165.618042], // New Caledonia
  NE: [17.607789, 8.081666], // Niger
  NF: [-29.040835, 167.954712], // Norfolk Island
  NG: [9.081999, 8.675277], // Nigeria
  NI: [12.865416, -85.207229], // Nicaragua
  NL: [52.132633, 5.291266], // Netherlands
  NO: [60.472024, 8.468946], // Norway
  NP: [28.394857, 84.124008], // Nepal
  NR: [-0.522778, 166.931503], // Nauru
  NU: [-19.054445, -169.867233], // Niue
  NZ: [-40.900557, 174.885971], // New Zealand
  OM: [21.473533, 55.975413], // Oman
  PA: [8.537981, -80.782127], // Panama
  PE: [-9.189967, -75.015152], // Peru
  PF: [-17.679742, -149.406843], // French Polynesia
  PG: [-6.314993, 143.95555], // Papua New Guinea
  PH: [12.879721, 121.774017], // Philippines
  PK: [30.375321, 69.345116], // Pakistan
  PL: [51.919438, 19.145136], // Poland
  PM: [46.941936, -56.27111], // Saint Pierre and Miquelon
  PN: [-24.703615, -127.439308], // Pitcairn Islands
  PR: [18.220833, -66.590149], // Puerto Rico
  PS: [31.952162, 35.233154], // Palestine
  PT: [39.399872, -8.224454], // Portugal
  PW: [7.51498, 134.58252], // Palau
  PY: [-23.442503, -58.443832], // Paraguay
  QA: [25.354826, 51.183884], // Qatar
  RE: [-21.115141, 55.536384], // Réunion
  RO: [45.943161, 24.96676], // Romania
  RS: [44.016521, 21.005859], // Serbia
  RU: [61.52401, 105.318756], // Russia
  RW: [-1.940278, 29.873888], // Rwanda
  SA: [23.885942, 45.079162], // Saudi Arabia
  SB: [-9.64571, 160.156194], // Solomon Islands
  SC: [-4.679574, 55.491977], // Seychelles
  SD: [12.862807, 30.217636], // Sudan
  SE: [60.128161, 18.643501], // Sweden
  SG: [1.352083, 103.819836], // Singapore
  SI: [46.151241, 14.995463], // Slovenia
  SK: [48.669026, 19.699024], // Slovakia
  SL: [8.460555, -11.779889], // Sierra Leone
  SM: [43.933333, 12.45], // San Marino
  SN: [14.497401, -14.452362], // Senegal
  SO: [5.152149, 46.199616], // Somalia
  SR: [3.919305, -56.027783], // Suriname
  SS: [6.877, 31.307], // South Sudan
  ST: [0.18636, 6.613081], // Sao Tome and Principe
  SV: [13.794185, -88.89653], // El Salvador
  SX: [18.04248, -63.05483], // Sint Maarten
  SY: [34.802075, 38.996815], // Syria
  SZ: [-26.522503, 31.465866], // Eswatini
  TC: [21.694025, -71.797928], // Turks and Caicos Islands
  TD: [15.454166, 18.732207], // Chad
  TF: [-49.280366, 69.348557], // French Southern Territories
  TG: [8.619543, 0.824782], // Togo
  TH: [15.870032, 100.992541], // Thailand
  TJ: [38.861034, 71.276093], // Tajikistan
  TK: [-8.967363, -171.855881], // Tokelau
  TL: [-8.874217, 125.727539], // Timor-Leste
  TM: [38.969719, 59.556278], // Turkmenistan
  TN: [33.886917, 9.537499], // Tunisia
  TO: [-21.178986, -175.198242], // Tonga
  TR: [38.963745, 35.243322], // Turkey
  TT: [10.691803, -61.222503], // Trinidad and Tobago
  TV: [-7.109535, 177.64933], // Tuvalu
  TW: [23.69781, 120.960515], // Taiwan
  TZ: [-6.369028, 34.888822], // Tanzania
  UA: [48.379433, 31.16558], // Ukraine
  UG: [1.373333, 32.290275], // Uganda
  US: [37.09024, -95.712891], // United States
  UY: [-32.522779, -55.765835], // Uruguay
  UZ: [41.377491, 64.585262], // Uzbekistan
  VA: [41.902916, 12.453389], // Vatican City
  VC: [13.252817, -61.1971], // Saint Vincent and the Grenadines
  VE: [6.42375, -66.58973], // Venezuela
  VG: [18.420695, -64.639968], // British Virgin Islands
  VI: [18.335765, -64.896335], // U.S. Virgin Islands
  VN: [14.058324, 108.277199], // Vietnam
  VU: [-15.376706, 166.959158], // Vanuatu
  WF: [-13.768752, -177.156097], // Wallis and Futuna
  WS: [-13.759029, -172.104629], // Samoa
  XK: [42.602636, 20.902977], // Kosovo
  YE: [15.552727, 48.516388], // Yemen
  YT: [-12.8275, 45.166244], // Mayotte
  ZA: [-30.559482, 22.937506], // South Africa
  ZM: [-13.133897, 27.849332], // Zambia
  ZW: [-19.015438, 29.154857] // Zimbabwe
};

// Çerez yönetim fonksiyonları
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (let i = 0; i < cookies.length; i++) {
    const [key, value] = cookies[i].split("=");
    if (key === name) return value;
  }
  return null;
}

// Dil tercihlerini uygulama
const translations = {
  en: {
    title: "Restriction Viewer",
    description: "Enter a YouTube video URL below to check for video restrictions:",
    submit: "Check Restrictions",
    statusTitle: "System Status",
    operational: "Operational",
    error: "Error",
  },
  tr: {
    title: "Kısıtlama Görüntüleyici",
    description: "Aşağıya bir YouTube video URL'si girerek video kısıtlamalarını kontrol edin:",
    submit: "Kısıtlamaları Kontrol Et",
    statusTitle: "Sistem Durumu",
    operational: "Çalışıyor",
    error: "Hata",
  },
};

// Dil tercihlerini uygula
function applyLanguage(lang) {
  // Form kısmını güncelle
  const videoForm = document.querySelector(".container");
  videoForm.querySelector("h1").textContent = translations[lang].title;
  videoForm.querySelector("p").textContent = translations[lang].description;
  videoForm.querySelector("button[type='submit']").textContent = translations[lang].submit;

  // System Status kısmını güncelle
  const statusPanel = document.getElementById("status-panel");
  if (statusPanel) {
    statusPanel.querySelector("h3").textContent = translations[lang].statusTitle;

    // Operational ve Error çevirileri
    const statusItems = statusPanel.querySelectorAll(".status");
    statusItems.forEach((statusItem) => {
      const currentStatus = statusItem.textContent.trim().toLowerCase();
      if (currentStatus === "operational" || currentStatus === "çalışıyor") {
        statusItem.textContent = translations[lang].operational;
      } else if (currentStatus === "error" || currentStatus === "hata") {
        statusItem.textContent = translations[lang].error;
      }
    });
  }
}



// Varsayılan dili kontrol et
let userLang = getCookie("lang") || "en";
applyLanguage(userLang);

// Dil değiştirici
document.getElementById("language-selector").addEventListener("click", (e) => {
  if (e.target.classList.contains("lang-flag")) {
    const selectedLang = e.target.getAttribute("data-lang");
    setCookie("lang", selectedLang, 360); // 360 gün boyunca hatırla
    applyLanguage(selectedLang);
  }
});

// Form gönderme
document.getElementById("video-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const videoUrl = document.getElementById("video-url").value;
  const resultDiv = document.getElementById("result");
  const button = document.querySelector("button");

  resultDiv.innerHTML = "Checking restrictions...";
  button.disabled = true;

  fetch("https://restrictionchecker.onrender.com/check_video", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ video_url: videoUrl }),
  })
    .then((response) => response.json())
    .then((data) => {
      button.disabled = false;
      if (data.error) {
        resultDiv.innerHTML = `Error: ${data.error}`;
      } else {
        const restrictions = data.restrictions.blocked || [];
        const embeddable = data.embeddable;
        resultDiv.innerHTML = restrictions.length
          ? `This video is restricted in the following regions: ${restrictions.join(", ")}`
          : "This video is not restricted in any region!";

        if (!embeddable) {
          resultDiv.innerHTML += "<p>Warning: This video cannot be embedded!</p>";
        }

        map.eachLayer((layer) => {
          if (layer.options && layer.options.attribution) return;
          map.removeLayer(layer);
        });

        restrictions.forEach((region) => {
          // Add region markers (dummy coordinates for now)
          const coords = regionCoordinates[region] || [0, 0];
          L.marker(coords).addTo(map).bindPopup(region);
        });
      }
    })
    .catch((error) => {
      button.disabled = false;
      resultDiv.innerHTML = `An error occurred: ${error}`;
    });

  setTimeout(() => {
    button.disabled = false;
  }, 5000);
});
