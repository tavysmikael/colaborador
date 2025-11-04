// frontend/src/scripts/utils/pwa.js

/**
 * Registra o Service Worker para funcionalidades PWA.
 */
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registrado com sucesso:', registration);
        })
        .catch(registrationError => {
          console.error('Falha ao registrar Service Worker:', registrationError);
        });
    });
  }
}