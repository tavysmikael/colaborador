// frontend/src/scripts/components/darkMode.js

function updateDarkModeIcon() {
  const iconContainer = document.getElementById('dark-mode-icon');
  if (!iconContainer) return;
  
  if (document.body.classList.contains('dark-mode')) {
    iconContainer.innerHTML = '&#9728;'; // Ícone de sol
  } else {
    // Ícone de lua
    iconContainer.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
  }
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  
  // Garante que o menu suspenso feche ao trocar de tema
  document.getElementById('menuDropdown')?.classList.remove('show');
  document.getElementById('menuHamburger')?.setAttribute('aria-expanded', 'false');

  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
  updateDarkModeIcon();
}

/**
 * Inicializa a funcionalidade do botão de modo escuro.
 */
export function initializeDarkMode() {
  const darkModeBtn = document.getElementById('dark-mode-btn');
  if (!darkModeBtn) return;

  // Verifica a preferência salva no localStorage ao carregar a página
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
  }

  updateDarkModeIcon();

  darkModeBtn.addEventListener('click', toggleDarkMode);
}