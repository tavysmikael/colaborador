/**
 * Initializes page-specific functionality for integrantes-agr.html.
 * @module integrantes-agr
 */
import { showNotification } from '../utils/notifications.js';

/**
 * Opens a node profile with notification and analytics tracking.
 * @param {string} url - The profile URL.
 * @param {string} title - The profile title.
 * @private
 */
function openNodeProfile(url, title) {
  window.open(url, '_blank', 'noopener');
  showNotification(`Abrindo perfil: ${title}`, 'info');
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'click_node', {
      event_category: 'organograma',
      event_label: title
    });
  }
}

/**
 * Initializes page-specific functionality for integrantes-agr.html.
 */
export function initIntegrantesAgr() {
  const nodes = document.querySelectorAll('.organograma-node, .organograma-presidente');
  nodes.forEach(node => {
    const urlMatch = node.getAttribute('onclick')?.match(/'([^']+)'/);
    const url = urlMatch ? urlMatch[1] : null;
    const title = node.getAttribute('aria-label')?.replace('Abrir perfil da ', '') || 'Unknown';
    if (!url) {
      showNotification('Erro: URL do perfil não encontrada.', 'error');
      return;
    }
    node.addEventListener('click', () => openNodeProfile(url, title));
    node.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openNodeProfile(url, title);
      }
    });
  });

  // Remove global exposure
  delete window.openNodeProfile;
}