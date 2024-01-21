function getCurrentSeason() {
  const month = new Date().getMonth();
  if (month <= 2 || month === 11) {
    return "winter";
  } else if (month <= 5) {
    return "spring";
  } else if (month <= 8) {
    return "summer";
  } else if (month <= 11) {
    return "fall";
  }
}

// Change UI elements based on season
const season = "fall"; // Only for testing
// Get all important elements
const landscape = document.getElementById("landscape");
umbrellaIMG = document.getElementById("umbrellaIMG");
sunscreenIMG = document.getElementById("sunscreenIMG");
activitiesIMG = document.getElementById("activitiesIMG");
outfitIMG = document.getElementById("outfitIMG");
cards = document.querySelectorAll(".card");
h2s = document.querySelectorAll("h2");

// Actually change the elements
switch (season) {
  case "winter":
    landscape.src = "assets/winter.jpg";
    break;
  case "spring":
    landscape.src = "assets/spring.jpg";
    break;
  case "summer":
    landscape.src = "assets/summer.jpg";
    break;
  case "fall":
    landscape.src = "./IMG/fall_landscape.jpg";
    umbrellaIMG.src = "./IMG/fall_umbrella.png";
    sunscreenIMG.src = "./IMG/fall_sunscreen.png";
    activitiesIMG.src = "./IMG/fall_activities.png";
    outfitIMG.src = "./IMG/fall_outfit.png";
    cards.forEach((card) => {
      card.classList.add("fall");
    });
    h2s.forEach((h2) => {
      h2.classList.add("fall");
    });
    break;
}

function toggleCard(cardElement) {
  cardElement.classList.toggle("flipped");

  setTimeout(() => {
    // Toggle display property after 1 second
    const cardFront = cardElement.querySelector(".cardFront");
    const cardBack = cardElement.querySelector(".cardBack");

    if (cardElement.classList.contains("flipped")) {
      cardFront.style.display = "none";
      cardBack.style.display = "flex";
    } else {
      cardFront.style.display = "flex";
      cardBack.style.display = "none";
    }
  }, 250); // half of the transition time (500ms)
}

function toggleCardHeight(cardElement) {
  cardElement.classList.toggle("expanded");
}

// Get users location
if ("geolocation" in navigator) {
  // Geolocation is supported
} else {
  // Geolocation is not supported
  console.log("Geolocation is not supported.");
}

navigator.geolocation.getCurrentPosition(
  function (position) {
    // Handle successful location retrieval
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const cords = [latitude, longitude];

    // Fetch data from API
    let backendUrl;
    if (window.location.hostname === "") {
      // When developing
      backendUrl = "http://localhost:3000/api/smart-weather/testing";
      console.log("local");
    } else {
      // When in production
      backendUrl =
        "https://main-api-0xrx.onrender.com/api/smart-weather/production";
      console.log("hosted");
    }
    fetch(`${backendUrl}/${cords}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Process the data
        console.log(data);
        // Umbrella
        if (data.umbrellaNeed >= 0.5) {
          document.getElementById("umbrellaNeed").innerHTML = "Yes";
        } else if (data.umbrellaNeed < 0.5) {
          document.getElementById("umbrellaNeed").innerHTML = "No";
        }
        const umbrellaMarker = document.getElementById("umbrellaSpectrumLine");
        const umbrellaMarkerPosition = data.umbrellaNeed * 100;
        umbrellaMarker.style.left = `${umbrellaMarkerPosition}%`;
        // Sunscreen
        if (data.sunscreenNeed >= 0.5) {
          document.getElementById("sunscreenNeed").innerHTML = "Yes";
        } else if (data.sunscreenNeed < 0.5) {
          document.getElementById("sunscreenNeed").innerHTML = "No";
        }
        const sunscreenMarker = document.getElementById(
          "sunscreenSpectrumLine",
        );
        const sunscreenMarkerPosition = data.sunscreenNeed * 100;
        sunscreenMarker.style.left = `${sunscreenMarkerPosition}%`;
        // Outdoor activities
        if (data.outdoorActivities <= 0.5) {
          document.getElementById("outdoorActivities").innerHTML = "No";
        } else if (data.outdoorActivities > 0.5) {
          document.getElementById("outdoorActivities").innerHTML = "Yes";
        }
        const outdoorActivitiesMarker = document.getElementById(
          "outdoorSpectrumLine",
        );
        const outdoorActivitiesMarkerPosition = data.outdoorActivities * 100;
        outdoorActivitiesMarker.style.left = `${outdoorActivitiesMarkerPosition}%`;
        // Outfit
        if (data.outfit <= 0.2) {
          document.getElementById("outfit").innerHTML = "Cold winter";
        } else if (data.outfit <= 0.4) {
          document.getElementById("outfit").innerHTML = "Winter";
        } else if (data.outfit <= 0.6) {
          document.getElementById("outfit").innerHTML = "Warm winter";
        } else if (data.outfit <= 0.8) {
          document.getElementById("outfit").innerHTML = "Spring";
        } else if (data.outfit <= 1) {
          document.getElementById("outfit").innerHTML = "Summer";
        }
        const outfitMarker = document.getElementById("outfitSpectrumLine");
        const outfitMarkerPosition = data.outfit * 100;
        outfitMarker.style.left = `${outfitMarkerPosition}%`;
      })
      .catch((error) => {
        // Handle errors
        console.error("Fetch error:", error);
      });

    // Now you can use the latitude and longitude as needed
  },
  function (error) {
    // Handle error
    alert("This website does not work without location services enabled.");
  },
);
