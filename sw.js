/* Service worker do painel Liberação Caixa — versão 20260915T134600.
   -------------------------------------------------------------------------
   Estratégia: rede primeiro, sempre. O cache próprio existe só para abrir sem
   internet — nunca para decidir qual versão do app roda.

   Por que este arquivo foi reescrito: uma publicação quebrada ficou presa no
   cache dos navegadores e o app parou de abrir. O mecanismo que buscaria a
   correção morava dentro do próprio app que não carregava, então não havia
   como se curar sozinho. Agora, sempre que o app é publicado, este arquivo
   muda junto (a versão está no nome do cache), o navegador é obrigado a
   instalar o service worker novo, e o novo APAGA TODOS os caches antigos —
   não só os de nome diferente. Uma publicação ruim deixa de virar pane
   permanente: basta publicar a correção. */
const VERSAO = '20260915T134600';
const CACHE = 'liberacao-caixa-' + VERSAO;
const ARQUIVOS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-512-maskable.png'];

self.addEventListener('install', (e) => {
  // Assume o controle imediatamente, sem esperar as abas antigas fecharem.
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARQUIVOS)).catch(() => {}));
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    // Apaga TODOS os caches, inclusive um de mesmo nome que possa guardar uma
    // cópia defeituosa. Reconstruir custa um carregamento; ficar preso numa
    // versão quebrada custa o dia de trabalho de alguém.
    const chaves = await caches.keys();
    await Promise.all(chaves.map((k) => caches.delete(k)));
    await self.clients.claim();
    // Avisa as abas abertas para recarregarem já com o app corrigido.
    const abas = await self.clients.matchAll({ type: 'window' });
    for (const aba of abas) aba.postMessage({ tipo: 'sw-atualizado', versao: VERSAO });
  })());
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

  /* Navegação (abrir o app) vai SEMPRE à rede, sem cache HTTP. Se a rede
     falhar, aí sim serve a última cópia guardada — que é o comportamento
     offline legítimo. Para os demais arquivos, mesma ideia. */
  const pedido = new Request(e.request, { cache: 'no-store' });
  e.respondWith(
    fetch(pedido).then((resp) => {
      if (resp && resp.ok) {
        const copia = resp.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copia)).catch(() => {});
      }
      return resp;
    }).catch(() => caches.match(e.request).then((r) => r || caches.match('./index.html')))
  );
});
