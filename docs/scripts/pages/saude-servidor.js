/**
 * Initializes page-specific functionality for saude-servidor.html.
 * @module saude-servidor
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
      event_category: 'saude',
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
 * Initializes page-specific functionality for saude-servidor.html.
 */
export function initSaudeServidor() {
  const actions = {
    viewAtestadosMedicos: {
      message: 'Carregando informações sobre atestados médicos...',
      url: '/pages/atestados-medicos.html' // Placeholder
    },
    viewLicencaMedica: {
      message: 'Carregando informações sobre licença médica...',
      url: '/pages/licenca-medica.html' // Placeholder
    },
    viewTratamentoContinuo: {
      message: 'Carregando informações sobre tratamento contínuo...',
      url: '/pages/tratamento-continuo.html' // Placeholder
    },
    consultarRede: {
      message: 'Consultando rede credenciada...',
      url: '/pages/rede-credenciada.html' // Placeholder
    },
    agendarAtendimento: {
      message: 'Abrindo agenda de atendimento...',
      url: '/pages/agendar-atendimento.html' // Placeholder
    },
    verSaudeMental: {
      message: 'Carregando programas de saúde mental...',
      url: '/pages/saude-mental.html' // Placeholder
    }
  };

  Object.entries(actions).forEach(([action, { message, url }]) => {
    const button = document.querySelector(`[onclick="window.${action}()"]`);
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

  // Remove global exposures
  delete window.viewAtestadosMedicos;
  delete window.viewLicencaMedica;
  delete window.viewTratamentoContinuo;
  delete window.consultarRede;
  delete window.agendarAtendimento;
  delete window.verSaudeMental;
}