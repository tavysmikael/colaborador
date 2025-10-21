/**
 * Initializes page-specific functionality for desenvolvimento-pessoas.html.
 * @module desenvolvimento-pessoas
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
      event_category: 'desenvolvimento',
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
 * Initializes page-specific functionality for desenvolvimento-pessoas.html.
 */
export function initDesenvolvimentoPessoas() {
  const actions = {
    viewCourses: {
      message: 'Carregando cursos disponíveis...',
      url: '/pages/cursos.html'
    },
    viewMentorship: {
      message: 'Abrindo programa de mentoria...',
      url: '/pages/mentoria.html'
    },
    viewCareerPlan: {
      message: 'Carregando plano de carreira...',
      url: '/pages/plano-carreira.html'
    },
    viewMobility: {
      message: 'Abrindo informações sobre mobilidade funcional...',
      url: '/pages/mobilidade-funcional.html'
    },
    startEvaluation: {
      message: 'Iniciando processo de avaliação...',
      url: '/pages/avaliacao.html'
    },
    viewCertifications: {
      message: 'Carregando certificações disponíveis...',
      url: '/pages/certificacoes.html'
    },
    viewEvents: {
      message: 'Carregando eventos...',
      url: '/pages/eventos.html'
    },
    viewResources: {
      message: 'Abrindo biblioteca de recursos...',
      url: '/pages/recursos.html'
    },
    scheduleConsultation: {
      message: 'Abrindo agenda para consultoria...',
      url: '/pages/consultoria.html'
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