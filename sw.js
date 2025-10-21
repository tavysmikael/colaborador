const CACHE_NAME = 'agr-portal-v1';
const urlsToCache = [
  '/',
  '/styles/main.css',
  '/scripts/main.js',
  '/src/scripts/index.js',
  '/src/scripts/agenda.js',
  '/src/pages/index.html',
  '/src/pages/agenda.html',


  '/scripts/components/header.js',
  '/scripts/components/footer.js',
  '/scripts/components/back-to-top.js',
  '/scripts/components/hamburger-menu.js',
  '/scripts/components/accordion.js',

  '/scripts/utils/notifications.js',
  '/scripts/utils/dark-mode.js',
  '/scripts/utils/analytics.js',
  '/scripts/utils/accessibility.js',
  '/scripts/utils/loading-overlay.js',
  '/scripts/pwa/service-worker.js',
  
  '/scripts/pages/concursos-processos.js',
  '/scripts/pages/quem-somos.js',
  '/scripts/pages/recadastramento.js',
  '/scripts/pages/documents.js',
  '/scripts/pages/principais-servicos-da-agr.js',
  '/scripts/pages/saude-servidor.js',
  '/scripts/pages/jornada.js',
  '/scripts/pages/integrantes-agr.js',
  '/scripts/pages/folha-pagamentos.js',
  '/scripts/pages/ferias.js',
  '/scripts/pages/beneficios-auxilios.js',
  '/scripts/pages/beneficios-previdenciarios.js',
  '/scripts/pages/concursos-processos.js',
  '/scripts/pages/demonstrativos-financeiros.js',
  '/scripts/pages/desenvolvimento-pessoas.js',
  '/scripts/pages/desligamento.js',
  '/scripts/pages/direitos-estatutarios.js',

  '/images/logo-azul.png',
  '/images/logocompleto.webp',
  '/images/banner1.png',
  '/images/banner2.png',
  '/images/teste.png',
  '/images/Na agr (1).png',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});