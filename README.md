# shotByT

Static site for shotByT — aerial photo & video. No build step, hosted free on GitHub Pages.

## Folder layout

```
index.html        page structure (rarely needs editing)
style.css         look & feel
main.js           gallery, lightbox, altimeter, viewfinder (don't need to edit)
shots.js          ← YOUR CONTENT: settings + list of photos/videos
favicon.png
assets/           logo + icons
media/photos/     ← put photos here
media/videos/     ← put videos (+ poster stills) here
```

## Adding a new shot

1. Export the file
   - Photos: JPG, about 2000–2500px on the long side, under ~1 MB.
   - Videos: MP4 (H.264), 1080p, ideally under 25 MB. GitHub refuses files over 100 MB.
   - Use simple names: lowercase, no spaces, e.g. `ottawa-river-sunrise.jpg`.
2. Upload it on github.com: open the repo → `media/photos` (or `media/videos`) → **Add file → Upload files** → drag in → **Commit changes**.
3. Edit `shots.js` on github.com (pencil icon) and add a line at the top of `window.SHOTS`:

   ```js
   { type: "photo", src: "media/photos/ottawa-river-sunrise.jpg", title: "River sunrise", location: "Ottawa, ON", date: "2026-10" },
   ```
   For video:
   ```js
   { type: "video", src: "media/videos/fall-flyover.mp4", poster: "media/videos/fall-flyover.jpg", title: "Fall flyover", location: "Gatineau Park", date: "2026-10" },
   ```
4. Commit. The live site updates in about a minute.

Add `featured: true` to the one shot you want in the big viewfinder at the top.

Delete the `sample-*` files and their lines in `shots.js` once you have real shots.

## Shrinking a drone video (optional)

With [HandBrake](https://handbrake.fr): preset **Fast 1080p30**, check **Web Optimized**.
Or with ffmpeg:

```
ffmpeg -i input.mp4 -vf scale=1920:-2 -c:v libx264 -crf 24 -preset slow -an -movflags +faststart output.mp4
ffmpeg -i output.mp4 -ss 2 -frames:v 1 -q:v 3 output.jpg     # poster still
```
