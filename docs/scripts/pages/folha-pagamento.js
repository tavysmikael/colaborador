/**
 * Initializes page-specific functionality for folha-pagamentos.html.
 * @module folha-pagamentos
 */
import { showNotification } from '../utils/notifications.js';

/**
 * Handles navigation or download actions with notification and analytics.
 * @param {string} section - The section name or action.
 * @param {boolean} isDownload - Whether the action is a download.
 * @param {string} url - The navigation URL (optional).
 * @private
 */
function handleAction(section, isDownload = false, url = null) {
  const message = isDownload ? 'Download do contracheque iniciado!' : `Navegando para ${section}...`;
  showNotification(message, isDownload ? 'success' : 'info');
  if (isDownload) {
    setTimeout(() => {
      showNotification('Contracheque baixado com sucesso!', 'success');
    }, 2000);
  }
  if (typeof window.gtag === 'function') {
    window.gtag('event', isDownload ? 'download' : 'navigate', {
      event_category: 'folha',
      event_label: section
    });
  }
  if (url) {
    setTimeout(() => {
      window.location.href = url;
    }, 1000);
  }
}

/**
 * Initializes page-specific functionality for folha-pagamentos.html.
 */
export function initFolhaPagamentos() {
  const actions = {
    downloadContracheque: {
      section: 'Contracheque',
      isDownload: true,
      url: null
    },
    navigateToFolha: {
      section: 'Folha de Pagamento',
      isDownload: false,
      url: '/pages/folha-detalhes.html' // Placeholder
    }
  };

  Object.entries(actions).forEach(([action, { section, isDownload, url }]) => {
    const button = document.querySelector(`[onclick="window.${action}()"]`);
    if (button) {
      button.addEventListener('click', () => handleAction(section, isDownload, url));
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleAction(section, isDownload, url);
        }
      });
    }
  });

  // Remove global exposures
  delete window.navigateTo;
  delete window.downloadContracheque;
}