// frontend/src/scripts/main.js

// 1. IMPORTAÇÃO DOS MÓDULOS GLOBAIS 
import { initializeAccessibility } from './utils/accessibility.js';
import { registerServiceWorker } from './utils/pwa.js';
import { trackPageView, initializeClickTracking } from './utils/analytics.js';
import { initializeHeader } from './components/header.js';
import { initializeLoadingScreen, initializeBackToTopButton, initializeAccordion, initTooltips } from './components/ui.js';
import { initializeDarkMode } from './components/darkmode.js';

// 2. FUNÇÃO PARA INICIALIZAR OS SCRIPTS GLOBAIS 
function initGlobalScripts() {
  initializeAccessibility();
  registerServiceWorker();
  initializeClickTracking();
  initializeHeader(); // Inclui lógica do menu hamburger
  initializeLoadingScreen();
  initializeBackToTopButton();
  initializeAccordion();
  initializeDarkMode();
  trackPageView(document.title); // Rastreia a visualização da página atual
  initTooltips(); // Inicializa tooltips em toda a aplicação
}

// 3. MAPA DE PÁGINAS → MÓDULOS
const pageModules = {
  'page-index': () => import('./pages/index.js').then(m => m.initIndexPage()),
  'page-kanban': () => import('./pages/kanban.js').then(m => m.initKanbanPage()),
  'page-edificio': () => import('./pages/edificio.js').then(m => m.initEdificioPage()),
  'page-calendar': () => import('./pages/calendar.js').then(m => m.initCalendarPage()),
  'page-profile': () => import('./pages/profile.js').then(m => m.initProfilePage()),
  'page-gallery': () => import('./pages/gallery.js').then(m => m.initGalleryPage()),
};

// 4. FUNÇÃO PARA CARREGAR O SCRIPT DA PÁGINA ESPECÍFICA
async function loadPageScript() {
  const pageId = document.body.id;
  if (!pageId) {
    console.info('O <body> da página não tem um ID. Nenhum script de página específico foi carregado.');
    return;
  }

  // Páginas genéricas
  if (pageId.startsWith('page-generic')) {
    const { initGenericPage } = await import('./pages/genericpage.js');
    initGenericPage();
    return;
  }

  // Páginas mapeadas
  if (pageModules[pageId]) {
    await pageModules[pageId]();
  } else {
    console.warn(`Nenhum módulo encontrado para a página com id "${pageId}".`);
  }
}

// 5. PONTO DE PARTIDA DA APLICAÇÃO
document.addEventListener('DOMContentLoaded', () => {
  initGlobalScripts();
  loadPageScript();
});
