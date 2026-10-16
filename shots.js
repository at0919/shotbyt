/* ==========================================================================
   shotByT — YOUR CONTENT FILE
   This is the only file you need to edit to add photos & videos.
   ========================================================================== */

/* ---- Site settings ---------------------------------------------------- */
window.SITE = {
  instagram: "shotbyt.jpg",          // your Instagram handle, without the @
  email: "",                     // optional, e.g. "hello@shotbyt.com" (leave "" to hide)
  pilot: "T",                    // how you want to be credited
  homeBase: "Ottawa, ON"         // shown in the About section (change or leave "")
};

/* ---- Your shots ------------------------------------------------------- */
/*
  Add one { ... } block per photo or video. Newest first looks best.

  PHOTO:
    { type: "photo", src: "media/photos/my-file.jpg",
      title: "Sunrise over the river", location: "Ottawa, ON", date: "2026-10" },

  VIDEO:
    { type: "video", src: "media/videos/my-clip.mp4",
      poster: "media/videos/my-clip-poster.jpg",   // a still frame (optional but recommended)
      title: "Fall colours flyover", location: "Gatineau Park", date: "2026-10" },

  Optional extras on any shot:
    featured: true        -> the big shot at the top of the page (pick one)
    coords: "45.42°N 75.69°W"   -> shown in the viewfinder HUD
    alt: "description for screen readers"

  Remember the comma after each } block.
*/
window.SHOTS = [
  {
    type: "video",
    src: "media/videos/sample-flight.mp4",
    poster: "media/videos/sample-flight-poster.jpg",
    title: "Sample flight — replace me",
    location: "Somewhere green",
    date: "2026-10",
    featured: true,
    coords: "45.42°N 75.69°W"
  },
  { type: "photo", src: "media/photos/sample-1.jpg", title: "River delta", location: "Sample location", date: "2026-10" },
  { type: "photo", src: "media/photos/sample-2.jpg", title: "Dunes at noon", location: "Sample location", date: "2026-09" },
  { type: "photo", src: "media/photos/sample-3.jpg", title: "Shallow water", location: "Sample location", date: "2026-09" },
  { type: "photo", src: "media/photos/sample-4.jpg", title: "Patchwork fields", location: "Sample location", date: "2026-08" },
  { type: "photo", src: "media/photos/sample-5.jpg", title: "First snow", location: "Sample location", date: "2026-08" },
  { type: "photo", src: "media/photos/sample-6.jpg", title: "Treeline", location: "Sample location", date: "2026-07" }
];
