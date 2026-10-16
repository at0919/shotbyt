/* shotByT — site logic. You shouldn't need to edit this; edit shots.js instead. */
(() => {
  const SITE = window.SITE || {};
  const SHOTS = (window.SHOTS || []).filter(s => s && s.src);
  const $ = sel => document.querySelector(sel);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Links & text from settings ---------- */
  const handle = (SITE.instagram || "shotbyt").replace(/^@/, "");
  const igUrl = `https://instagram.com/${handle}`;
  ["#navIg", "#heroIg", "#bigIg"].forEach(id => { const a = $(id); if (a) a.href = igUrl; });
  $("#heroIg").textContent = "@" + handle;
  $("#bigIg").firstChild.textContent = "@" + handle + " ";
  if (SITE.email) {
    $("#emailLine").innerHTML = "";
    const a = document.createElement("a");
    a.href = "mailto:" + SITE.email; a.textContent = SITE.email;
    $("#emailLine").append("Bookings & collabs — ", a);
  }
  if (SITE.homeBase) $("#homeBase").textContent = "Home base — " + SITE.homeBase;
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Counts ---------- */
  const photos = SHOTS.filter(s => s.type !== "video");
  const videos = SHOTS.filter(s => s.type === "video");
  const places = [...new Set(SHOTS.map(s => (s.location || "").trim()).filter(Boolean))];
  $("#cAll").textContent = SHOTS.length;
  $("#cPhoto").textContent = photos.length;
  $("#cVideo").textContent = videos.length;

  /* ---------- Helpers ---------- */
  const mediaEl = (shot, { controls = false, autoplay = false } = {}) => {
    if (shot.type === "video") {
      const v = document.createElement("video");
      v.src = shot.src; v.muted = !controls; v.loop = !controls; v.playsInline = true;
      v.preload = autoplay ? "auto" : "metadata";
      if (shot.poster) v.poster = shot.poster;
      if (controls) v.controls = true;
      if (autoplay) { v.autoplay = true; v.muted = true; }
      v.setAttribute("aria-label", shot.alt || shot.title || "Drone video");
      return v;
    }
    const img = document.createElement("img");
    img.src = shot.src; img.alt = shot.alt || shot.title || "Drone photo";
    img.loading = "lazy"; img.decoding = "async";
    return img;
  };
  const pad = n => String(n).padStart(3, "0");

  /* ---------- Hero viewfinder ---------- */
  const hero = SHOTS.find(s => s.featured) || SHOTS[0];
  if (hero) {
    const m = mediaEl(hero, { autoplay: !reduce });
    if (m.tagName === "IMG") m.loading = "eager";
    $("#vfMedia").append(m);
    $("#vfCaption").textContent = hero.title || "";
    $("#vfCoords").textContent = hero.coords || (hero.location || "").toUpperCase() || "—";
    $("#vfMedia").addEventListener("click", () => openLightbox(SHOTS.indexOf(hero)));
  }
  // Ticking timecode + gently drifting altitude in the HUD
  const t0 = performance.now();
  setInterval(() => {
    const s = Math.floor((performance.now() - t0) / 1000);
    const f = Math.floor(((performance.now() - t0) % 1000) / 33.4);
    $("#timecode").textContent =
      `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
    $("#vfAlt").textContent = (118 + Math.sin(s / 3) * 3).toFixed(0);
  }, 100);

  /* ---------- Ticker ---------- */
  const tickerItems = places.length ? places : ["From above", "Different perspective", "shotByT"];
  const tickerList = [];
  while (tickerList.length < 10) tickerList.push(...tickerItems);
  const ticker = $("#ticker");
  [...tickerList, ...tickerList].forEach(p => { const s = document.createElement("span"); s.textContent = p; ticker.append(s); });

  /* ---------- Gallery ---------- */
  const grid = $("#grid");
  if (!SHOTS.length) {
    grid.innerHTML = '<p class="empty">First flights coming soon.</p>';
  }
  const cards = SHOTS.map((shot, i) => {
    const card = document.createElement("button");
    card.className = "card"; card.type = "button"; card.dataset.type = shot.type === "video" ? "video" : "photo";
    card.setAttribute("aria-label", `Open ${shot.title || "shot"}`);

    const frame = document.createElement("div"); frame.className = "card-frame";
    const m = mediaEl(shot);
    frame.append(m);
    ["tl", "tr", "bl", "br"].forEach(c => { const s = document.createElement("span"); s.className = "corner " + c; frame.append(s); });
    if (shot.type === "video") {
      const b = document.createElement("span"); b.className = "badge"; b.textContent = "VIDEO"; frame.append(b);
      card.addEventListener("mouseenter", () => m.play().catch(() => {}));
      card.addEventListener("mouseleave", () => m.pause());
    }

    const meta = document.createElement("div"); meta.className = "card-meta";
    const left = document.createElement("div");
    const t = document.createElement("div"); t.className = "card-title"; t.textContent = shot.title || "Untitled";
    const l = document.createElement("div"); l.className = "card-loc";
    l.textContent = [shot.location, shot.date].filter(Boolean).join(" · ");
    left.append(t, l);
    const n = document.createElement("div"); n.className = "card-num"; n.textContent = "#" + pad(SHOTS.length - i);
    meta.append(left, n);

    card.append(frame, meta);
    card.addEventListener("click", () => openLightbox(i));
    grid.append(card);
    return card;
  });

  // Filters
  document.querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach(c => { c.classList.remove("active"); c.setAttribute("aria-selected", "false"); });
      chip.classList.add("active"); chip.setAttribute("aria-selected", "true");
      const f = chip.dataset.filter;
      cards.forEach(c => c.classList.toggle("hide", f !== "all" && c.dataset.type !== f));
    });
  });

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));
  cards.forEach((c, i) => { c.style.transitionDelay = (i % 3) * 80 + "ms"; io.observe(c); });

  /* ---------- Stats count-up ---------- */
  const countUp = (el, to) => {
    if (reduce || !to) { el.textContent = to; return; }
    const start = performance.now();
    const step = now => {
      const p = Math.min(1, (now - start) / 1200);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const statsIO = new IntersectionObserver(es => {
    if (es[0].isIntersecting) {
      countUp($("#sPhotos"), photos.length); countUp($("#sVideos"), videos.length); countUp($("#sPlaces"), places.length);
      statsIO.disconnect();
    }
  });
  statsIO.observe($(".stats"));

  /* ---------- Nav + altimeter ---------- */
  const nav = $(".nav"), needle = $(".alt-needle"), altVal = $("#altValue");
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    nav.classList.toggle("scrolled", scrollY > 30);
    needle.style.top = (p * 218) + "px";
    altVal.textContent = Math.round(400 * (1 - p));
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Lightbox ---------- */
  const lb = $("#lightbox"), stage = $("#lbStage"), lbMeta = $("#lbMeta");
  let current = 0, lastFocus = null;
  function render() {
    const shot = SHOTS[current];
    stage.innerHTML = "";
    const m = mediaEl(shot, { controls: true });
    if (m.tagName === "IMG") m.loading = "eager";
    else { m.muted = false; m.play().catch(() => {}); }
    stage.append(m);
    lbMeta.innerHTML = "";
    const t = document.createElement("div"); t.className = "t"; t.textContent = shot.title || "";
    const l = document.createElement("div"); l.className = "l";
    l.textContent = ["#" + pad(SHOTS.length - current), shot.location, shot.date].filter(Boolean).join("  ·  ");
    lbMeta.append(t, l);
  }
  function openLightbox(i) {
    if (i < 0) return;
    lastFocus = document.activeElement;
    current = i; render(); lb.hidden = false; document.body.style.overflow = "hidden";
    lb.querySelector(".lb-close").focus();
  }
  function closeLightbox() {
    lb.hidden = true; stage.innerHTML = ""; document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  const visibleIdx = () => cards.map((c, i) => c.classList.contains("hide") ? -1 : i).filter(i => i >= 0);
  const go = dir => {
    const v = visibleIdx(); if (!v.length) return;
    let k = v.indexOf(current); if (k < 0) k = 0;
    current = v[(k + dir + v.length) % v.length]; render();
  };
  lb.querySelector(".lb-close").addEventListener("click", closeLightbox);
  lb.querySelector(".lb-prev").addEventListener("click", () => go(-1));
  lb.querySelector(".lb-next").addEventListener("click", () => go(1));
  lb.addEventListener("click", e => { if (e.target === lb || e.target === stage) closeLightbox(); });
  addEventListener("keydown", e => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  });
  let touchX = null;
  lb.addEventListener("touchstart", e => { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", e => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    touchX = null;
  });

  /* ---------- Topographic contour background ---------- */
  const cv = $("#topo"), ctx = cv.getContext("2d");
  function drawTopo() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const w = innerWidth, h = innerHeight;
    cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(79,138,166,0.22)"; ctx.lineWidth = 1;
    let seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const peaks = [[0.12, 0.2], [0.88, 0.75], [0.6, 0.05], [0.25, 0.95]];
    peaks.forEach(([px, py]) => {
      const cx = px * w, cy = py * h;
      const waves = [1, 2, 3, 5].map(n => ({ n, a: 0.04 + rnd() * 0.08, ph: rnd() * 6.28 }));
      for (let k = 1; k <= 14; k++) {
        const base = k * Math.max(w, h) * 0.028;
        ctx.beginPath();
        for (let s = 0; s <= 120; s++) {
          const th = (s / 120) * Math.PI * 2;
          let r = base;
          waves.forEach(wv => { r *= 1 + wv.a * Math.sin(wv.n * th + wv.ph + k * 0.18); });
          const x = cx + Math.cos(th) * r * 1.25, y = cy + Math.sin(th) * r;
          s ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.closePath(); ctx.stroke();
      }
    });
  }
  drawTopo();
  let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(drawTopo, 150); });
})();
