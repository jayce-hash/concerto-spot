// Elements
const introOverlay = document.getElementById("introOverlay");
const outroOverlay = document.getElementById("outroOverlay");

const phoneRig = document.getElementById("phoneRig");
const phoneVideo = document.getElementById("phoneVideo");
const venueGrid = document.getElementById("venueGrid");

const copyGroups = {
  events: document.querySelector('.copy-group--events'),
  featured: document.querySelector('.copy-group--featured'),
  guides: document.querySelector('.copy-group--guides'),
  venue: document.querySelector('.copy-group--venue'),
};

// Media
const VIDEO_SOURCES = {
  events: "events-near-me.mp4",
  featured: "featured-tours.mp4",
  guides: "city-guides.mp4",
};

const imgVenue1 = document.getElementById("img-venue-1");
const imgVenue2 = document.getElementById("img-venue-2");
const imgVenue3 = document.getElementById("img-venue-3");
const imgVenue4 = document.getElementById("img-venue-4");

// Assign venue images
imgVenue1.src = "venue-rideshare.png";
imgVenue2.src = "venue-bags.png";
imgVenue3.src = "venue-concessions.png";
imgVenue4.src = "venue-parking.png";

// Timeline (ms)
const DURATIONS = {
  intro:   1500,  // 0–1.5s
  events:  3000,  // 1.5–4.5
  featured:3000,  // 4.5–7.5
  guides:  3000,  // 7.5–10.5
  venue:   3000,  // 10.5–13.5
  outro:   1500,  // 13.5–15
};

const TOTAL =
  DURATIONS.intro +
  DURATIONS.events +
  DURATIONS.featured +
  DURATIONS.guides +
  DURATIONS.venue +
  DURATIONS.outro;

// Helpers
let currentSceneKey = null;
let lastSrc = null;

function setScene(key) {
  if (key === currentSceneKey) return;
  currentSceneKey = key;

  // Copy groups
  Object.entries(copyGroups).forEach(([k, el]) => {
    if (!el) return;
    if (k === key) {
      el.classList.add("active");
    } else {
      el.classList.remove("active");
    }
  });

  // Hero phone vs venue grid
  if (key === "events" || key === "featured" || key === "guides") {
    venueGrid.classList.remove("active");
    phoneRig.classList.add("active");

    // Update pose
    phoneRig.classList.remove("phone-rig--events", "phone-rig--featured", "phone-rig--guides", "switching");
    phoneRig.classList.add(`phone-rig--${key}`);

    // Video source
    const src = VIDEO_SOURCES[key];
    if (src && src !== lastSrc) {
      lastSrc = src;
      phoneVideo.src = src;
      phoneVideo.currentTime = 0;
      phoneVideo.play().catch(() => {});
    }
  } else if (key === "venue") {
    // Hide hero phone, show grid
    phoneRig.classList.remove("active");
    venueGrid.classList.add("active");
  }
}

function tick(startTime) {
  const now = performance.now();
  const elapsed = now - startTime;

  const tIntroEnd    = DURATIONS.intro;
  const tEventsEnd   = tIntroEnd + DURATIONS.events;
  const tFeaturedEnd = tEventsEnd + DURATIONS.featured;
  const tGuidesEnd   = tFeaturedEnd + DURATIONS.guides;
  const tVenueEnd    = tGuidesEnd + DURATIONS.venue;
  const tOutroStart  = TOTAL - DURATIONS.outro;

  // Intro overlay
  if (elapsed < tIntroEnd) {
    introOverlay.classList.remove("hidden");
  } else {
    introOverlay.classList.add("hidden");
  }

  // Scene selection
  if (elapsed >= tIntroEnd && elapsed < tEventsEnd) {
    setScene("events");
  } else if (elapsed >= tEventsEnd && elapsed < tFeaturedEnd) {
    setScene("featured");
  } else if (elapsed >= tFeaturedEnd && elapsed < tGuidesEnd) {
    setScene("guides");
  } else if (elapsed >= tGuidesEnd && elapsed < tVenueEnd) {
    setScene("venue");
  }

  // Outro overlay
  if (elapsed >= tOutroStart && elapsed <= TOTAL) {
    outroOverlay.classList.add("active");
  }

  if (elapsed < TOTAL) {
    requestAnimationFrame(() => tick(startTime));
  } else {
    // Hold final frame
    setScene("venue");
    outroOverlay.classList.add("active");
    introOverlay.classList.add("hidden");
  }
}

function startSpot() {
  const startTime = performance.now();
  tick(startTime);
}

// Autoplay on load
window.addEventListener("load", () => {
  // Start with hero phone setup (even while intro overlay is on top)
  setScene("events");
  startSpot();

  // Mobile autoplay fallback
  document.body.addEventListener(
    "click",
    () => {
      phoneVideo.muted = true;
      phoneVideo.play().catch(() => {});
    },
    { once: true }
  );
});
