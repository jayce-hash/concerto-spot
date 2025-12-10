// Scene timing (ms)
const DURATIONS = {
  intro: 1500,    // 0 - 1.5s
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

const scenes = document.querySelectorAll(".scene");
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

  // gently nudge videos to play when their scene is active
  if (key in videos) {
    Object.values(videos).forEach((v) => v && v.pause());
    const v = videos[key];
    if (v) {
      v.currentTime = 0;
      v.muted = true;
      v.play().catch(() => {});
    }
  } else {
    Object.values(videos).forEach((v) => v && v.pause());
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

  // Decide which scene should be on
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
    // Hold final outro frame
    setActiveScene("outro");
  }
}

function startSpot() {
  const startTime = performance.now();
  tick(startTime);
}

// Start automatically
window.addEventListener("load", () => {
  // Begin with intro visible
  setActiveScene("intro");
  startSpot();

  // Mobile/autoplay nudge
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
