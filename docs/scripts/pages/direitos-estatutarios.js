/**
 * Initializes page-specific functionality for direitos-estatutarios.html.
 * @module direitos-estatutarios
 */
import { showNotification } from '../utils/notifications.js';

/**
 * Handles navigation with notification and analytics tracking.
 * @param {string} action - The action identifier.
 * @param {string} message - The notification message.
 * @param {string} url - The navigation URL (optional).
 * @private
 */
function handleNavigation(action, message, url) {
  showNotification(message, 'info');
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'navigate', {
      event_category: 'estatutarios',
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
 * Initializes page-specific functionality for direitos-estatutarios.html.
 */
export function initDireitosEstatutarios() {
  const actions = {
    viewStatute: {
      message: 'Carregando estatuto completo...',
      url: '/pages/estatuto-completo.html'
    },
    viewChanges: {
      message: 'Abrindo alterações recentes...',
      url: '/pages/alteracoes-estatuto.html'
    },
    viewRemuneration: {
      message: 'Carregando direitos remuneratórios...',
      url: '/pages/direitos-remuneratorios.html'
    },
    viewVacations: {
      message: 'Abrindo direitos de férias...',
      url: '/pages/direitos-ferias.html'
    },
    viewProgression: {
      message: 'Carregando progressão funcional...',
      url: '/pages/progressao-funcional.html'
    },
    viewPromotion: {
      message: 'Abrindo informações sobre promoção...',
      url: '/pages/promocao.html'
    },
    viewStability: {
      message: 'Carregando informações sobre estabilidade...',
      url: '/pages/estabilidade.html'
    },
    viewDuties: {
      message: 'Abrindo deveres do servidor...',
      url: '/pages/deveres-servidor.html'
    },
    viewResponsibilities: {
      message: 'Carregando responsabilidades...',
      url: '/pages/responsabilidades.html'
    },
    contactLegal: {
      message: 'Abrindo contato com assessoria jurídica...',
      url: '/pages/assessoria-juridica.html'
    }
  };

  Object.entries(actions).forEach(([action, { message, url }]) => {
    const button = document.querySelector(`[data-action="${action}"]`) || document.querySelector(`[onclick="window.${action}()"]`);
    if (button) {
      button.addEventListener('click', () => handleNavigation(action, message, url));
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNavigation(action, message, url);
        }
      });
    }
  });
}