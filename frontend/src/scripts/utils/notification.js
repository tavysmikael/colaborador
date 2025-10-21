// frontend/src/scripts/utils/notification.js

/**
 * Exibe uma notificação toast na tela.
 * @param {string} message A mensagem a ser exibida.
 * @param {'info'|'success'|'warning'|'error'} type O tipo de notificação.
 */
export function showNotification(message, type = 'info') {
  const toast = document.getElementById('notification-toast');
  if (!toast) {
    console.error('Elemento #notification-toast não encontrado no HTML.');
    return;
  }

  toast.textContent = message;
  toast.className = `notification-toast ${type}`; // Reseta as classes de tipo
  toast.style.display = 'block';

  setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}