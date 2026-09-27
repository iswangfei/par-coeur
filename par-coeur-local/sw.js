// Offline cache for Par Cœur. Bump VERSION after changing any file.
const VERSION = "pc-v4";
const FILES = ["./", "index.html", "manifest.webmanifest", "icon.svg", "icon-180.png", "icon-512.png",
  "vendor/diff_match_patch.js", "vendor/pdf.min.js", "vendor/pdf.worker.min.js", "vendor/mammoth.browser.min.js", "fonts/fonts.css",
  "fonts/figtree_Xms-HUzqDCFdgfMm4S9DaRvzig.woff2", "fonts/figtree_Xms-HUzqDCFdgfMm4q9DaRvziissg.woff2", "fonts/or3PQ6P12-iJxAIgLa78DkTtAoDhk0oVpaK3YLanFLHpPf2TbLi4J_HWTEKVt8k.woff2", "fonts/or3PQ6P12-iJxAIgLa78DkTtAoDhk0oVpaK3YLanFLHpPf2TbLi4J__WTEKVt8m1ow.woff2", "fonts/or3yQ6P12-iJxAIgLYT1PLs1a-t7PU0AbeE9KK5U5Cl4OOCT.woff2", "fonts/or3yQ6P12-iJxAIgLYT1PLs1a-t7PU0AbeE9KK5a5Cl4OOCTVNg.woff2"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request, {ignoreSearch:true}).then(hit => hit || fetch(e.request).then(res => {
    if (res.ok && new URL(e.request.url).origin === location.origin){ const copy = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); }
    return res;
  })));
});
