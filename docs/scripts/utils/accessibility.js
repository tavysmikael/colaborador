// frontend/src/scripts/utils/accessibility.js

/**
 * Inicializa os listeners para melhorar a acessibilidade da navegação por teclado.
 */
export function initializeAccessibility() {
  // Adiciona uma classe ao body quando o usuário navega com a tecla Tab
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('user-is-tabbing');
    }
  });

  // Remove a classe quando o usuário clica com o mouse
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('user-is-tabbing');
  });
}