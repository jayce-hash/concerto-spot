// Video elements
const featuredVideo = document.getElementById("featuredVideo");
const guidesVideo = document.getElementById("guidesVideo");

// Image elements for venue info
const venueImg1 = document.getElementById("venueImg1");
const venueImg2 = document.getElementById("venueImg2");
const venueImg3 = document.getElementById("venueImg3");
const venueImg4 = document.getElementById("venueImg4");

// Scene elements
const introScene = document.getElementById("intro-scene");
const featuredScene = document.getElementById("featured-scene");
const guidesScene = document.getElementById("guides-scene");
const venueScene = document.getElementById("venue-scene");
const outroOverlay = document.getElementById("outro-overlay");

const allScenes = [introScene, featuredScene, guidesScene, venueScene];

// Assign your media files here (make sure the filenames exist in your repo)
featuredVideo.src = "featured-tours.mp4";
guidesVideo.src = "city-guides.mp4";

venueImg1.src = "venue-rideshare.png";
venueImg2.src = "venue-bags.png";
venueImg3.src = "venue-concessions.png";
venueImg4.src = "venue-parking.png";

function showScene(sceneEl) {
  allScenes.forEach((el) => el.classList.remove("active"));
  if (sceneEl) sceneEl.classList.add("active");
}

function startTimeline() {
  const start = performance.now();

  // Start with intro visible
  showScene(introScene);

  function step(now) {
    const elapsed = now - start; // ms

    // 0 – 2000 ms: Intro
    if (elapsed < 2000) {
      showScene(introScene);
    }
    // 2000 – 6000 ms: Featured Tours
    else if (elapsed >= 2000 && elapsed < 6000) {
      showScene(featuredScene);
      if (featuredVideo.paused) {
        featuredVideo.currentTime = 0;
        featuredVideo.play().catch(() => {});
      }
    }
    // 6000 – 10000 ms: City Guides
    else if (elapsed >= 6000 && elapsed < 10000) {
      showScene(guidesScene);
      if (guidesVideo.paused) {
        guidesVideo.currentTime = 0;
        guidesVideo.play().catch(() => {});
      }
    }
    // 10000 – 15000 ms: Venue info + outro fade
    else if (elapsed >= 10000 && elapsed < 15000) {
      showScene(venueScene);

      // Fade in outro text between 12.2–15s
      if (elapsed > 12200) {
        outroOverlay.classList.add("active");
      }
    }

    // Stop at 15s (hold final frame)
    if (elapsed < 15000) {
      requestAnimationFrame(step);
    } else {
      showScene(venueScene);
      outroOverlay.classList.add("active");
    }
  }

  requestAnimationFrame(step);
}

// Autostart on load, with a click fallback for autoplay restrictions
window.addEventListener("load", () => {
  startTimeline();

  // Tap/click once to ensure videos can play on mobile if autoplay is blocked
  document.body.addEventListener(
    "click",
    () => {
      [featuredVideo, guidesVideo].forEach((v) => {
        v.muted = true;
        v.play().catch(() => {});
      });
    },
    { once: true }
  );
});
