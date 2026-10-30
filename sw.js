
const CACHE_NAME = "banco-arcade-v2";

const ARCHIVOS = [
  "./",
  "./index.html",
  "./lider.html",
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ARCHIVOS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  const esLocal = url.origin === self.location.origin;
  const esSupabaseCDN =
    url.origin === "https://cdn.jsdelivr.net";

  if (!esLocal && !esSupabaseCDN) return;

  event.respondWith(
    caches.match(event.request).then(async guardado => {
      if (guardado) return guardado;

      try {
        const respuesta = await fetch(event.request);

        if (respuesta.ok) {
          const copia = respuesta.clone();
          const cache = await caches.open(CACHE_NAME);
          await cache.put(event.request, copia);
        }

        return respuesta;
      } catch (error) {
        if (esLocal) {
          return caches.match("./lider.html");
        }

        throw error;
      }
    })
  );
});
