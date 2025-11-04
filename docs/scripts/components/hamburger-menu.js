/**
 * Manages the hamburger menu and dropdown functionality.
 * @module hamburgerMenu
 */

/**
 * Initializes the hamburger menu with click and keyboard support.
 */
export function initHamburgerMenu() {
  const menuHamburger = document.getElementById('menuHamburger');
  const menuDropdown = document.getElementById('menuDropdown');
  if (!menuHamburger || !menuDropdown) return;

  const toggleMenu = () => {
    const isExpanded = menuDropdown.classList.toggle('show');
    menuHamburger.setAttribute('aria-expanded', isExpanded);
    if (isExpanded) {
      const firstFocusable = menuDropdown.querySelector('button, a');
      if (firstFocusable) firstFocusable.focus();
    }
  };

  document.addEventListener('click', (e) => {
    if (
      menuDropdown.classList.contains('show') &&
      !menuDropdown.contains(e.target) &&
      e.target !== menuHamburger &&
      !menuHamburger.contains(e.target)
    ) {
      menuDropdown.classList.remove('show');
      menuHamburger.setAttribute('aria-expanded', 'false');
    }
  });

  menuHamburger.addEventListener('click', (e) => {
    e.preventDefault();
    toggleMenu();
  });

  menuHamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMenu();
    }
  });
}