/**
 * Initializes page-specific functionality for documentos.html.
 * @module documents
 */
import { showNotification } from '../utils/notifications.js';

/**
 * Handles document-related actions with notification and analytics tracking.
 * @param {string} action - The action identifier.
 * @param {string} message - The notification message.
 * @param {string} url - The navigation URL (optional).
 * @private
 */
function handleDocumentAction(action, message, url) {
  showNotification(message, 'info');
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'document_action', {
      event_category: 'documents',
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
 * Initializes page-specific functionality for documentos.html.
 */
export function initDocuments() {
  showNotification('Documentos carregados com sucesso!', 'info');
  
  const actions = {
    viewDocuments: {
      message: 'Carregando lista de documentos...',
      url: '/pages/lista-documentos.html' // Placeholder
    },
    uploadDocument: {
      message: 'Abrindo formulário de upload...',
      url: '/pages/upload-documento.html' // Placeholder
    }
  };

  Object.entries(actions).forEach(([action, { message, url }]) => {
    const button = document.querySelector(`[data-action="${action}"]`);
    if (button) {
      button.addEventListener('click', () => handleDocumentAction(action, message, url));
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleDocumentAction(action, message, url);
        }
      });
    }
  });
}