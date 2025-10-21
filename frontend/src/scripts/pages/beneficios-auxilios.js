/**
 * Initializes page-specific functionality for beneficios-auxilios.html.
 * @module beneficios-auxilios
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
      event_category: 'beneficios',
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
 * Initializes page-specific functionality for beneficios-auxilios.html.
 */
export function initBeneficiosAuxilios() {
  const actions = {
    viewFoodAllowance: {
      message: 'Carregando detalhes do vale refeição...',
      url: '/pages/vale-refeicao.html' // Placeholder
    },
    viewPartnerRestaurants: {
      message: 'Abrindo restaurantes conveniados...',
      url: '/pages/restaurantes-conveniados.html' // Placeholder
    },
    viewTransportAllowance: {
      message: 'Carregando detalhes do vale transporte...',
      url: '/pages/vale-transporte.html' // Placeholder
    },
    viewParking: {
      message: 'Abrindo informações de estacionamento...',
      url: '/pages/estacionamento.html' // Placeholder
    },
    viewHealthPlan: {
      message: 'Carregando detalhes do plano de saúde...',
      url: '/pages/plano-saude.html' // Placeholder
    },
    viewNetwork: {
      message: 'Abrindo rede credenciada...',
      url: '/pages/rede-credenciada.html' // Placeholder
    },
    viewGympass: {
      message: 'Carregando detalhes do Gympass...',
      url: '/pages/gympass.html' // Placeholder
    },
    viewCorporateDiscounts: {
      message: 'Abrindo descontos corporativos...',
      url: '/pages/descontos-corporativos.html' // Placeholder
    },
    requestBenefit: {
      message: 'Abrindo formulário de solicitação...',
      url: '/pages/solicitacao-beneficio.html' // Placeholder
    },
    changeBenefit: {
      message: 'Carregando formulário de alteração...',
      url: '/pages/alteracao-beneficio.html' // Placeholder
    },
    contactHR: {
      message: 'Abrindo contato com RH...',
      url: '/pages/contato-rh.html' // Placeholder
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