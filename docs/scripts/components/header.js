// frontend/src/scripts/components/header.js

/**
 * Inicializa a funcionalidade do menu dropdown do cabeçalho.
 */
export function initializeHeader() {
  const menuHamburger = document.getElementById('menuHamburger');
  const menuDropdown = document.getElementById('menuDropdown');

  if (!menuHamburger || !menuDropdown) {
    console.warn('Componentes do header (menuHamburger ou menuDropdown) não encontrados.');
    return;
  }

  // Função para alternar a visibilidade do menu
  const toggleMenu = (e) => {
    e.preventDefault();
    const isExpanded = menuDropdown.classList.toggle('show');
    menuHamburger.setAttribute('aria-expanded', String(isExpanded));
  };

  menuHamburger.addEventListener('click', toggleMenu);
  menuHamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      toggleMenu(e);
    }
  });

  // Fecha o menu se o usuário clicar fora dele
  document.addEventListener('click', (e) => {
    const isClickInside = menuDropdown.contains(e.target) || menuHamburger.contains(e.target);
    if (menuDropdown.classList.contains('show') && !isClickInside) {
      menuDropdown.classList.remove('show');
      menuHamburger.setAttribute('aria-expanded', 'false');
    }
  });
}