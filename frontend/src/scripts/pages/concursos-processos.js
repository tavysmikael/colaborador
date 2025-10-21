/**
 * Initializes page-specific functionality for concursos-processos.html.
 * @module concursos-processos
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
      event_category: 'concursos',
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
 * Initializes page-specific functionality for concursos-processos.html.
 */
export function initConcursosProcessos() {
  const actions = {
    viewOpenPositions: {
      message: 'Carregando vagas abertas...',
      url: '/pages/vagas-abertas.html'
    },
    registerForContest: {
      message: 'Abrindo formulário de inscrição...',
      url: '/pages/inscricao-concurso.html'
    },
    viewEditals: {
      message: 'Carregando editais...',
      url: '/pages/editais.html'
    },
    viewCorrections: {
      message: 'Abrindo retificações...',
      url: '/pages/retificacoes.html'
    },
    viewResults: {
      message: 'Carregando resultados...',
      url: '/pages/resultados.html'
    },
    viewRanking: {
      message: 'Abrindo classificação...',
      url: '/pages/classificacao.html'
    },
    viewSchedule: {
      message: 'Carregando cronograma...',
      url: '/pages/cronograma.html'
    },
    viewDocuments: {
      message: 'Abrindo documentos necessários...',
      url: '/pages/documentos-concurso.html'
    },
    viewForms: {
      message: 'Carregando formulários...',
      url: '/pages/formularios-concurso.html'
    },
    contactSupport: {
      message: 'Abrindo contato com suporte...',
      url: '/pages/suporte-concurso.html'
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