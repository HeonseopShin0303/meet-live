// Minimal shell cache. Its real job is to make the app installable — Chrome
// requires a service worker before it offers "install" — and to let the page open
// without a network round trip. Transcription itself always needs the network.
const CACHE = "meet-live-v2";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  // Drop older versions so a redeploy does not serve last week's page forever.
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  // Network first: a stale copy of the app is worse than a brief wait, and the
  // cache is only there for when the network is genuinely gone.
  // GitHub Pages serves the page with max-age=600, so a plain fetch can be
  // answered from the HTTP cache and "network first" would still hand back the
  // previous deploy for ten minutes. Revalidate the document itself.
  const fresh = event.request.destination === "document" || event.request.mode === "navigate"
    ? new Request(event.request, { cache: "no-cache" })
    : event.request;
  event.respondWith(
    fetch(fresh)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(event.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(event.request).then((hit) => hit || caches.match("./index.html")))
  );
});
