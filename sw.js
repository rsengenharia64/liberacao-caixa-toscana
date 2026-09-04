/* Service worker do painel Liberação Caixa — versão 20260904T010455.
   Estratégia: rede primeiro, SEM passar pelo cache HTTP do navegador (o
   GitHub Pages manda index.html com validade de 10 minutos, e isso segurava
   versões velhas). Cache próprio só como reserva para abrir sem internet. */
const CACHE = 'liberacao-caixa-20260904T010455';
const ARQUIVOS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-512-maskable.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARQUIVOS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('message', (e) => {
  if (e.data === 'limpar-cache') {
    e.waitUntil(caches.keys().then((ks) => Promise.all(ks.map((k) => caches.delete(k)))));
  }
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  // 'no-cache' obriga o navegador a revalidar com o servidor: se o arquivo
  // mudou, vem o novo; se não, o servidor responde 304 e a cópia vale.
  const pedido = new Request(e.request, { cache: 'no-cache' });
  e.respondWith(
    fetch(pedido).then((resp) => {
      const copia = resp.clone();
      caches.open(CACHE).then((c) => c.put(e.request, copia)).catch(() => {});
      return resp;
    }).catch(() => caches.match(e.request).then((r) => r || caches.match('./index.html')))
  );
});
