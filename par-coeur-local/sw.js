// Offline cache for Par Cœur. Updates arrive automatically; bump VERSION only to clear old cached files.
const VERSION = "pc-v5";
const FILES = ["./", "index.html", "manifest.webmanifest", "icon.svg", "icon-180.png", "icon-512.png",
  "vendor/diff_match_patch.js", "vendor/pdf.min.js", "vendor/pdf.worker.min.js", "vendor/mammoth.browser.min.js", "fonts/fonts.css",
  "fonts/figtree_Xms-HUzqDCFdgfMm4S9DaRvzig.woff2", "fonts/figtree_Xms-HUzqDCFdgfMm4q9DaRvziissg.woff2", "fonts/or3PQ6P12-iJxAIgLa78DkTtAoDhk0oVpaK3YLanFLHpPf2TbLi4J_HWTEKVt8k.woff2", "fonts/or3PQ6P12-iJxAIgLa78DkTtAoDhk0oVpaK3YLanFLHpPf2TbLi4J__WTEKVt8m1ow.woff2", "fonts/or3yQ6P12-iJxAIgLYT1PLs1a-t7PU0AbeE9KK5U5Cl4OOCT.woff2", "fonts/or3yQ6P12-iJxAIgLYT1PLs1a-t7PU0AbeE9KK5a5Cl4OOCTVNg.woff2"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Network first, so a new upload reaches everyone on their next online visit;
// the cache answers when offline or when the network takes longer than 4 s.
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(VERSION);
    try {
      const res = await Promise.race([fetch(req, {cache:"no-cache"}), new Promise((_, no) => setTimeout(() => no(new Error("timeout")), 4000))]);
      if (res.ok) cache.put(req, res.clone());
      return res;
    } catch (err) {
      const hit = await cache.match(req, {ignoreSearch:true});
      if (hit) return hit;
      throw err;
    }
  })());
});
