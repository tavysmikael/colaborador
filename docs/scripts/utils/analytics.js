// frontend/src/scripts/utils/analytics.js

/**
 * Rastreia a visualização de uma página no Google Analytics.
 * @param {string} pageTitle O título da página atual.
 */
export function trackPageView(pageTitle) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'page_view', {
      'page_title': pageTitle,
      'page_location': window.location.href,
    });
  }
}

/**
 * Inicializa o rastreamento de cliques em elementos de navegação principais.
 */
export function initializeClickTracking() {
  document.addEventListener('click', (e) => {
    const iconLink = e.target.closest('.icone-link');
    if (iconLink) {
      const linkText = iconLink.querySelector('span')?.textContent;
      if (linkText && typeof gtag !== 'undefined') {
        gtag('event', 'click', {
          'event_category': 'navigation',
          'event_label': linkText,
        });
      }
    }
  });
}