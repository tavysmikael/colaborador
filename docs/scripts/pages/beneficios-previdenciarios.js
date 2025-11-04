/**
 * Initializes page-specific functionality for beneficios-previdenciarios.html.
 * @module beneficios-previdenciarios
 */
import { showNotification } from '../utils/notifications.js';

/**
 * Handles navigation or action with notification and analytics tracking.
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
      showNotification(`${message.replace('Gerando', 'Gerado').replace('...', '!')}`, 'success');
    }, 2000);
  }
  if (typeof window.gtag === 'function') {
    window.gtag('event', isDownload ? 'download' : 'navigate', {
      event_category: 'previdenciarios',
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
 * Initializes page-specific functionality for beneficios-previdenciarios.html.
 */
export function initBeneficiosPrevidenciarios() {
  const actions = {
    viewRetirementByTime: {
      message: 'Carregando informações sobre aposentadoria por tempo...',
      url: '/pages/aposentadoria-tempo.html'
    },
    viewRetirementByAge: {
      message: 'Abrindo informações sobre aposentadoria por idade...',
      url: '/pages/aposentadoria-idade.html'
    },
    viewSickLeave: {
      message: 'Carregando informações sobre auxílio-doença...',
      url: '/pages/auxilio-doenca.html'
    },
    viewAccidentAid: {
      message: 'Abrindo informações sobre auxílio-acidente...',
      url: '/pages/auxilio-acidente.html'
    },
    viewDeathPension: {
      message: 'Carregando informações sobre pensão por morte...',
      url: '/pages/pensao-morte.html'
    },
    viewDependents: {
      message: 'Abrindo informações sobre dependentes...',
      url: '/pages/dependentes.html'
    },
    viewContributionHistory: {
      message: 'Carregando histórico de contribuições...',
      url: '/pages/historico-contribuicoes.html'
    },
    generateExtract: {
      message: 'Gerando extrato previdenciário...',
      url: null,
      isDownload: true
    },
    viewRequiredDocuments: {
      message: 'Abrindo documentos necessários...',
      url: '/pages/documentos-obrigatorios.html'
    },
    viewForms: {
      message: 'Carregando formulários...',
      url: '/pages/formularios.html'
    },
    contactINSS: {
      message: 'Abrindo contato com INSS...',
      url: '/pages/contato-inss.html'
    }
  };

  Object.entries(actions).forEach(([action, { message, url, isDownload = false }]) => {
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