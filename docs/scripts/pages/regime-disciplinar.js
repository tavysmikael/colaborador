/**
 * Initializes page-specific functionality for regime.html.
 * @module regime-disciplinar
 */
import { showNotification } from '../utils/notifications.js';

/**
 * Handles navigation with notification and analytics tracking.
 * @param {string} eventLabel - The analytics event label.
 * @param {string} message - The notification message.
 * @param {string} url - The navigation URL (placeholder).
 * @private
 */
function handleNavigation(eventLabel, message, url) {
  showNotification(message, 'info');
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'click', {
      event_category: 'regime',
      event_label: eventLabel
    });
  }
  if (url) {
    setTimeout(() => {
      window.location.href = url;
    }, 1000);
  }
}

/**
 * Initializes page-specific functionality for regime.html.
 */
export function initRegime() {
  // Navigation handlers
  const actions = {
    viewLegislation: {
      message: 'Abrindo legislação aplicável...',
      url: '/pages/legislation.html' // Placeholder
    },
    viewPADInfo: {
      message: 'Carregando informações sobre PAD...',
      url: '/pages/pad-info.html' // Placeholder
    },
    viewProcessPhases: {
      message: 'Abrindo detalhes das fases do processo...',
      url: '/pages/process-phases.html' // Placeholder
    },
    viewPenalties: {
      message: 'Carregando penalidades detalhadas...',
      url: '/pages/penalties.html' // Placeholder
    },
    viewRights: {
      message: 'Abrindo direitos do servidor...',
      url: '/pages/rights.html' // Placeholder
    },
    downloadDefenseForm: {
      message: 'Iniciando download do formulário de defesa...',
      url: null // No navigation, simulates download
    }
  };

  Object.entries(actions).forEach(([action, { message, url }]) => {
    const button = document.querySelector(`[onclick="window.${action}()"]`);
    if (button) {
      button.addEventListener('click', () => {
        handleNavigation(action, message, url);
        if (action === 'downloadDefenseForm') {
          setTimeout(() => {
            showNotification('Formulário baixado com sucesso!', 'success');
          }, 2000);
        }
      });
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNavigation(action, message, url);
          if (action === 'downloadDefenseForm') {
            setTimeout(() => {
              showNotification('Formulário baixado com sucesso!', 'success');
            }, 2000);
          }
        }
      });
    }
  });

  // Remove global window exposures
  delete window.viewLegislation;
  delete window.viewPADInfo;
  delete window.viewProcessPhases;
  delete window.viewPenalties;
  delete window.viewRights;
  delete window.downloadDefenseForm;
}