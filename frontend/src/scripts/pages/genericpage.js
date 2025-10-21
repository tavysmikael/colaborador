// frontend/src/scripts/pages/genericPage.js
import { showNotification } from '../utils/notification.js';

/**
 * Inicializa páginas genéricas que disparam notificações ao clicar em botões.
 * Requer que os botões no HTML tenham os atributos:
 * data-notification-button="true"
 * data-notification-message="Sua mensagem aqui"
 * data-notification-type="info|success|warning|error" (opcional, padrão 'info')
 */
export function initGenericPage() {
  document.addEventListener('click', (e) => {
    const button = e.target.closest('[data-notification-button="true"]');
    if (!button) return;

    const message = button.dataset.notificationMessage || 'Ação executada.';
    const type = button.dataset.notificationType || 'info';
    
    showNotification(message, type);
  });
}