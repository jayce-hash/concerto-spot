// Scene elements
const sceneIntro    = document.getElementById("scene-intro");
const sceneEvents   = document.getElementById("scene-events");
const sceneFeatured = document.getElementById("scene-featured");
const sceneGuides   = document.getElementById("scene-guides");
const sceneVenue    = document.getElementById("scene-venue");
const outro         = document.getElementById("outro");

const scenes = [sceneIntro, sceneEvents, sceneFeatured, sceneGuides, sceneVenue];

// Video elements
const videoEvents   = document.getElementById("video-events");
const videoFeatured = document.getElementById("video-featured");
const videoGuides   = document.getElementById("video-guides");

// Venue images
const imgVenue1 = document.getElementById("img-venue-1");
const imgVenue2 = document.getElementById("img-venue-2");
const imgVenue3 = document.getElementById("img-venue-3");
const imgVenue4 = document.getElementById("img-venue-4");

// Media file assignments
videoEvents.src   = "events-near-me.mp4";
videoFeatured.src = "featured-tours.mp4";
videoGuides.src   = "city-guides.mp4";

imgVenue1.src = "venue-rideshare.png";
imgVenue2.src = "venue-bags.png";
imgVenue3.src = "venue-concessions.png";
imgVenue4.src = "venue-parking.png";

// Timeline configuration (ms)
// Intro: 1.5s, Events: 3s, Featured: 3s, Guides: 3s, Venue: 3s, Outro: 1.5s
const DURATIONS = {
  intro:   1500,
  events:  3000,
  feature: 3000,
  guides:  3000,
  venue:   3000,
  outro:   1500
};

const TOTAL =
  DURATIONS.intro +
  DURATIONS.events +
  DURATIONS.feature +
  DURATIONS.guides +
  DURATIONS.venue +
  DURATIONS.outro; // 15000 ms

function showScene(target) {
  scenes.forEach(s => s.classList.remove("active"));
  if (target) target.classList.add("active");
}

function tick(startTime) {
  const now = performance.now();
  const elapsed = now - startTime;

  const tIntroEnd   = DURATIONS.intro;
  const tEventsEnd  = tIntroEnd   + DURATIONS.events;
  const tFeatEnd    = tEventsEnd  + DURATIONS.feature;
  const tGuidesEnd  = tFeatEnd    + DURATIONS.guides;
  const tVenueEnd   = tGuidesEnd  + DURATIONS.venue;
  const tOutroStart = TOTAL - DURATIONS.outro;

  // Scene selection
  if (elapsed < tIntroEnd) {
    showScene(sceneIntro);
  } else if (elapsed < tEventsEnd) {
    showScene(sceneEvents);
    if (videoEvents.paused) {
      videoEvents.currentTime = 0;
      videoEvents.play().catch(() => {});
    }
  } else if (elapsed < tFeatEnd) {
    showScene(sceneFeatured);
    if (videoFeatured.paused) {
      videoFeatured.currentTime = 0;
      videoFeatured.play().catch(() => {});
    }
  } else if (elapsed < tGuidesEnd) {
    showScene(sceneGuides);
    if (videoGuides.paused) {
      videoGuides.currentTime = 0;
      videoGuides.play().catch(() => {});
    }
  } else if (elapsed < tVenueEnd) {
    showScene(sceneVenue);
  } else {
    // Past venue range: fix to final scene
    showScene(sceneVenue);
  }

  // Outro overlay during last 1.5s
  if (elapsed >= tOutroStart && elapsed <= TOTAL) {
    outro.classList.add("active");
  }

  // Stop exactly at TOTAL
  if (elapsed < TOTAL) {
    requestAnimationFrame(() => tick(startTime));
  } else {
    showScene(sceneVenue);
    outro.classList.add("active");
  }
}

function startSpot() {
  const startTime = performance.now();
  tick(startTime);
}

// Start automatically
window.addEventListener("load", () => {
  startSpot();

  // Mobile autoplay fallback
  document.body.addEventListener(
    "click",
    () => {
      [videoEvents, videoFeatured, videoGuides].forEach(v => {
        v.muted = true;
        v.play().catch(() => {});
      });
    },
    { once: true }
  );
});
