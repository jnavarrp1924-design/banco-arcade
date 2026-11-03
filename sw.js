
const CACHE_NAME = "banco-arcade-v3";

const ARCHIVOS = [
  "./",
  "./index.html",
  "./lider.html",
  "./lider_nfc_ios.html",
  "./premios.html"
];

// Instalar la nueva versión
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ARCHIVOS))
      .then(() => self.skipWaiting())
  );
});

// Activar la nueva versión y eliminar cachés antiguas
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key.startsWith("banco-arcade-") && key !== CACHE_NAME)
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Interceptar solicitudes
self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // No interceptar Supabase ni otros servicios externos.
  if (url.origin !== self.location.origin) return;

  // Las páginas HTML siempre consultan primero la versión publicada.
  if (
    request.mode === "navigate" ||
    request.destination === "document"
  ) {
    event.respondWith(
      fetch(request)
        .then(async response => {
          if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, response.clone());
          }

          return response;
        })
        .catch(async () => {
          const guardado = await caches.match(request);

          if (guardado) return guardado;

          return caches.match("./index.html");
        })
    );

    return;
  }

  // Para recursos locales distintos de HTML:
  // primero se intenta obtener la versión de internet.
  event.respondWith(
    fetch(request)
      .then(async response => {
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, response.clone());
        }

        return response;
      })
      .catch(async () => {
        const guardado = await caches.match(request);

        if (guardado) return guardado;

        return Response.error();
      })
  );
});
