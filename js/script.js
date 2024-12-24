document.getElementById("video-form").addEventListener("submit", function (e) {
    e.preventDefault(); // Formun sayfayı yenilemesini engeller
  
    const videoUrl = document.getElementById("video-url").value;
    const resultDiv = document.getElementById("result");
  
    // Sonuç mesajı
    resultDiv.innerHTML = "Checking restrictions...";
  
    // API isteği
    fetch("https://restrictionchecker.onrender.com/check_video", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ video_url: videoUrl }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          // Hata mesajı
          resultDiv.innerHTML = `Error: ${data.error}`;
        } else {
          const restrictions = data.restrictions;
          if (restrictions.blocked) {
            // Kısıtlı bölgeleri göster
            resultDiv.innerHTML = `This video is restricted in the following regions: ${restrictions.blocked.join(", ")}`;
          } else {
            // Hiçbir kısıtlama yok
            resultDiv.innerHTML = "This video is not restricted in any region!";
          }
        }
      })
      .catch((error) => {
        // Ağ veya diğer hatalar
        resultDiv.innerHTML = `An error occurred: ${error}`;
      });
  });
  