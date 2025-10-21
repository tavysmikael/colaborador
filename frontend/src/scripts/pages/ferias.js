/**
 * Initializes page-specific functionality for ferias.html.
 * @module ferias
 */
import { showNotification } from '../utils/notifications.js';

/**
 * Handles navigation with notification and analytics tracking.
 * @param {string} section - The section name.
 * @param {string} url - The navigation URL (placeholder).
 * @private
 */
function handleNavigation(section, url) {
  showNotification(`Navegando para ${section}...`, 'info');
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'navigate', {
      event_category: 'ferias',
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
 * Initializes page-specific functionality for ferias.html.
 */
export function initFerias() {
  const actions = {
    navigateToFerias: {
      section: 'Férias',
      url: '/pages/ferias-detalhes.html' // Placeholder
    }
  };

  Object.entries(actions).forEach(([action, { section, url }]) => {
    const button = document.querySelector(`[onclick="window.${action}()"]`);
    if (button) {
      button.addEventListener('click', () => handleNavigation(section, url));
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNavigation(section, url);
        }
      });
    }
  });

  // Remove global exposure
  delete window.navigateTo;
}