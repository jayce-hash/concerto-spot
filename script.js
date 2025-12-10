// Scene timing (ms) – approx 15s total
const DURATIONS = {
  intro: 1500,    // 0 - 1.5
  events: 2300,   // 1.5 - 3.8
  tours: 2300,    // 3.8 - 6.1
  guides: 2300,   // 6.1 - 8.4
  concerto: 2300, // 8.4 - 10.7
  venue: 2300,    // 10.7 - 13.0
  outro: 2000     // 13.0 - 15.0
};

const TOTAL =
  DURATIONS.intro +
  DURATIONS.events +
  DURATIONS.tours +
  DURATIONS.guides +
  DURATIONS.concerto +
  DURATIONS.venue +
  DURATIONS.outro;

// Grab scenes
const scenes = document.querySelectorAll(".scene");

// Videos for single-feature scenes
const videos = {
  events: document.getElementById("vid-events"),
  tours: document.getElementById("vid-tours"),
  guides: document.getElementById("vid-guides"),
  concerto: document.getElementById("vid-concerto"),
};

let currentSceneKey = null;

function setActiveScene(key) {
  if (key === currentSceneKey) return;
  currentSceneKey = key;

  scenes.forEach((scene) => {
    const sKey = scene.getAttribute("data-scene");
    if (sKey === key) {
      scene.classList.add("is-active");
    } else {
      scene.classList.remove("is-active");
    }
  });

  // Handle video playback
  Object.values(videos).forEach((v) => v && v.pause());

  if (key in videos) {
    const vid = videos[key];
    if (vid) {
      vid.currentTime = 0;
      vid.muted = true;
      vid.play().catch(() => {});
    }
  }
}

function tick(startTime) {
  const now = performance.now();
  const elapsed = now - startTime;

  const tIntroEnd = DURATIONS.intro;
  const tEventsEnd = tIntroEnd + DURATIONS.events;
  const tToursEnd = tEventsEnd + DURATIONS.tours;
  const tGuidesEnd = tToursEnd + DURATIONS.guides;
  const tConcertoEnd = tGuidesEnd + DURATIONS.concerto;
  const tVenueEnd = tConcertoEnd + DURATIONS.venue;
  const tOutroStart = TOTAL - DURATIONS.outro;

  if (elapsed < tIntroEnd) {
    setActiveScene("intro");
  } else if (elapsed < tEventsEnd) {
    setActiveScene("events");
  } else if (elapsed < tToursEnd) {
    setActiveScene("tours");
  } else if (elapsed < tGuidesEnd) {
    setActiveScene("guides");
  } else if (elapsed < tConcertoEnd) {
    setActiveScene("concerto");
  } else if (elapsed < tVenueEnd) {
    setActiveScene("venue");
  } else {
    setActiveScene("outro");
  }

  if (elapsed < TOTAL) {
    requestAnimationFrame(() => tick(startTime));
  } else {
    // Hold final frame on outro
    setActiveScene("outro");
  }
}

function startSpot() {
  const startTime = performance.now();
  tick(startTime);
}

window.addEventListener("load", () => {
  setActiveScene("intro");
  startSpot();

  // mobile autoplay nudge
  document.body.addEventListener(
    "click",
    () => {
      Object.values(videos).forEach((v) => {
        if (v) {
          v.muted = true;
          v.play().catch(() => {});
        }
      });
    },
    { once: true }
  );
});
