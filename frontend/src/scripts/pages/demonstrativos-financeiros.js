/**
 * Initializes page-specific functionality for demonstrativos-financeiros.html.
 * @module demonstrativos-financeiros
 */
import { showNotification } from '../utils/notifications.js';

/**
 * Handles navigation or download with notification and analytics tracking.
 * @param {string} action - The action identifier.
 * @param {string} message - The notification message.
 * @param {string} url - The navigation URL (optional).
 * @param {boolean} isDownload - Whether the action is a download.
 * @private
 */
function handleAction(action, message, url = null, isDownload = false) {
  showNotification(message, isDownload ? 'success' : 'info');
  if (isDownload) {
    setTimeout(() => {
      showNotification(`${message.replace('Iniciado', 'Concluído').replace('Gerando', 'Gerado').replace('...', '!')}`, 'success');
    }, isDownload ? 2000 : 3000);
  }
  if (typeof window.gtag === 'function') {
    window.gtag('event', isDownload ? 'download' : 'navigate', {
      event_category: 'financeiros',
      event_label: action
    });
  }
  if (url) {
    setTimeout(() => {
      window.location.href = url;
    }, 1000);
  }
}

/**
 * Initializes page-specific functionality for demonstrativos-financeiros.html.
 */
export function initDemonstrativosFinanceiros() {
  const actions = {
    downloadContracheque: {
      message: 'Download do contracheque iniciado!',
      url: null,
      isDownload: true
    },
    viewPaymentHistory: {
      message: 'Carregando histórico de pagamentos...',
      url: '/pages/historico-pagamentos.html'
    },
    generateReport: {
      message: 'Gerando relatório personalizado...',
      url: null,
      isDownload: true
    }
  };

  Object.entries(actions).forEach(([action, { message, url, isDownload }]) => {
    const button = document.querySelector(`[data-action="${action}"]`) || document.querySelector(`[onclick="window.${action}()"]`);
    if (button) {
      button.addEventListener('click', () => handleAction(action, message, url, isDownload));
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleAction(action, message, url, isDownload);
        }
      });
    }
  });
}