// Sistem durumu kontrolü
const startTime = performance.now(); // İsteğin başlangıç zamanını al

// Status Toggle (Aç/Kapa)
const statusToggle = document.getElementById("status-toggle");

// Genel Durum Kontrolü
let isAllOperational = true; // Varsayılan olarak tüm sistemler çalışıyor

Promise.all([
  fetch("https://restrictionchecker.onrender.com/healthz"),
  fetch(window.location.href),
  fetch("https://www.googleapis.com/youtube/v3/videos?part=id&id=dummy_id&key=YOUR_API_KEY"),
])
  .then((responses) => {
    responses.forEach((response, index) => {
      if (!response.ok) {
        isAllOperational = false;
      }
    });

    if (isAllOperational) {
      statusToggle.classList.add("status-btn-operational");
    } else {
      statusToggle.classList.add("status-btn-error");
    }
  })
  .catch(() => {
    isAllOperational = false;
    statusToggle.classList.add("status-btn-error");
  });

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
fetch("https://www.googleapis.com/youtube/v3/videos?part=id&id=dummy_id&key=YOUR_API_KEY")
  .then((response) => {
    const youtubeStatus = document.getElementById("youtube-status");
    if (response.ok) {
      youtubeStatus.textContent = "Operational";
      youtubeStatus.style.color = "green";
    } else {
      youtubeStatus.textContent = "Error";
      youtubeStatus.style.color = "red";
    }
  })
  .catch(() => {
    const youtubeStatus = document.getElementById("youtube-status");
    youtubeStatus.textContent = "Error";
    youtubeStatus.style.color = "red";
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
  "US": [37.0902, -95.7129],
  "RU": [61.524, 105.3188],
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
