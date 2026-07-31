// Service worker minimal : juste ce qu'il faut pour rendre le site "installable".
// Strategie "network first" volontairement simple, sans precache agressif,
// pour eviter le probleme deja rencontre sur Tablio (service worker qui sert
// une version perimee du site aux utilisateurs).

self.addEventListener("install", () => {
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});