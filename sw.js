
const CACHE_NAME = "banco-arcade-v11";

self.addEventListener("install", event => {
  // No precargamos archivos: evitamos que un archivo inexistente
  // impida instalar la nueva versión.
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key =>
              key.startsWith("banco-arcade-") &&
              key !== CACHE_NAME
            )
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Solo manejar archivos del propio sitio.
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    try {
      // Consultar siempre la versión publicada, evitando la caché HTTP.
      const response = await fetch(request, {
        cache: "no-store"
      });

      if (response.ok) {
        await cache.put(request, response.clone());
      }

      return response;

    } catch (error) {
      // Si no hay conexión, utilizar la versión guardada.
      const saved = await cache.match(request);

      if (saved) return saved;

      if (
        request.mode === "navigate" ||
        request.destination === "document"
      ) {
        const fallback = await cache.match("./index.html");

        if (fallback) return fallback;
      }

      return new Response("Recurso no disponible sin conexión.", {
        status: 503,
        headers: {
          "Content-Type": "text/plain; charset=utf-8"
        }
      });
    }
  })());
});
