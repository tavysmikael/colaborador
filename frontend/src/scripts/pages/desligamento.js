/**
 * Initializes page-specific functionality for desligamento.html.
 * @module desligamento
 */
import { showNotification } from '../utils/notifications.js';

/**
 * Handles navigation or request with notification and analytics tracking.
 * @param {string} action - The action identifier.
 * @param {string} message - The notification message.
 * @param {string} url - The navigation URL (optional).
 * @param {boolean} isRequest - Whether the action is a request.
 * @private
 */
function handleAction(action, message, url = null, isRequest = false) {
  showNotification(message, isRequest ? 'success' : 'info');
  if (isRequest) {
    setTimeout(() => {
      showNotification(`${message.replace('Solicitando', 'Solicitação concluída')}!`, 'success');
    }, 2000);
  }
  if (typeof window.gtag === 'function') {
    window.gtag('event', isRequest ? 'request' : 'navigate', {
      event_category: 'desligamento',
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
 * Initializes page-specific functionality for desligamento.html.
 */
export function initDesligamento() {
  const actions = {
    viewExoneration: {
      message: 'Carregando informações sobre exoneração...',
      url: '/pages/exoneracao.html'
    },
    viewDismissal: {
      message: 'Abrindo informações sobre demissão...',
      url: '/pages/demissao.html'
    },
    viewProcedures: {
      message: 'Carregando procedimentos de desligamento...',
      url: '/pages/procedimentos-desligamento.html'
    },
    viewDocuments: {
      message: 'Abrindo documentação necessária...',
      url: '/pages/documentos-desligamento.html'
    },
    viewSeverancePay: {
      message: 'Carregando informações sobre verbas rescisórias...',
      url: '/pages/verbas-rescisorias.html'
    },
    viewRefunds: {
      message: 'Abrindo informações sobre restituições...',
      url: '/pages/restituicoes.html'
    },
    viewUnemploymentInsurance: {
      message: 'Carregando informações sobre seguro desemprego...',
      url: '/pages/seguro-desemprego.html'
    },
    viewPensionBenefits: {
      message: 'Abrindo benefícios previdenciários...',
      url: '/pages/beneficios-previdenciarios.html'
    },
    requestContributionCertificate: {
      message: 'Solicitando certidão de tempo de contribuição...',
      url: null,
      isRequest: true
    },
    requestDischargeDeclaration: {
      message: 'Solicitando declaração de desligamento...',
      url: null,
      isRequest: true
    },
    contactLegal: {
      message: 'Abrindo contato com assessoria jurídica...',
      url: '/pages/assessoria-juridica.html'
    }
  };

  Object.entries(actions).forEach(([action, { message, url, isRequest = false }]) => {
    const button = document.querySelector(`[data-action="${action}"]`) || document.querySelector(`[onclick="window.${action}()"]`);
    if (button) {
      button.addEventListener('click', () => handleAction(action, message, url, isRequest));
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleAction(action, message, url, isRequest);
        }
      });
    }
  });
}