/**
 * Initializes page-specific functionality for principais-servicos-da-agr.html.
 * @module principais-servicos-da-agr
 */
import { showNotification } from '../utils/notifications.js';

/**
 * Initializes the countdown and redirect functionality.
 * @private
 */
function initRedirect() {
  const countdownElement = document.getElementById('countdown');
  const redirectBtn = document.getElementById('redirectBtn');
  let countdown = 5;

  if (!countdownElement || !redirectBtn) {
    showNotification('Erro: Elementos de redirecionamento não encontrados.', 'error');
    return;
  }

  const timer = setInterval(() => {
    countdown--;
    countdownElement.textContent = countdown;
    if (countdown <= 0) {
      clearInterval(timer);
      window.open('https://www.agr.go.gov.br', '_blank');
      showNotification('Redirecionado para o site oficial da AGR!', 'success');
    }
  }, 1000);

  const handleRedirect = () => {
    redirectBtn.innerHTML = `
      <div class="loading-spinner"></div>
      Redirecionando...
    `;
    redirectBtn.disabled = true;
    showNotification('Iniciando redirecionamento...', 'info');
    setTimeout(() => {
      window.open('https://www.agr.go.gov.br', '_blank');
    }, 500);
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'click', {
        event_category: 'redirect',
        event_label: 'Acessar Site Oficial da AGR'
      });
    }
  };

  redirectBtn.addEventListener('click', handleRedirect);
  redirectBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleRedirect();
    }
  });
}

/**
 * Initializes page-specific functionality for principais-servicos-da-agr.html.
 */
export function initPrincipaisServicos() {
  initRedirect();
}