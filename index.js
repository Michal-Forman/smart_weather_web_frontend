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
    fetch(`http://localhost:3000/${cords}`)
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
        // Sunscreen
        if (data.sunscreenNeed >= 0.5) {
          document.getElementById("sunscreenNeed").innerHTML = "Yes";
        } else if (data.sunscreenNeed < 0.5) {
          document.getElementById("sunscreenNeed").innerHTML = "No";
        }
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
        // Outdoor activities
        if (data.outdoorActivities <= 0.5) {
          document.getElementById("outdoorActivities").innerHTML = "No";
        } else if (data.outdoorActivities > 0.5) {
          document.getElementById("outdoorActivities").innerHTML = "Yes";
        }
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
