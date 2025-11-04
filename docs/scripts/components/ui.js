// frontend/src/scripts/components/ui.js

// Loading overlay
export function initializeLoadingScreen() {
  window.addEventListener('load', function () {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.style.opacity = '0';
      setTimeout(() => {
        loadingOverlay.style.display = 'none';
      }, 300);
    }
  });
}

/**
 * Configura o botão "Voltar ao Topo".
 */
export function initializeBackToTopButton() {
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.style.display = 'flex';
    } else {
      backToTopBtn.style.display = 'none';
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/**
 * Inicializa a funcionalidade do componente accordion.
 */
export function initializeAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  if (accordionHeaders.length === 0) return;

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const isExpanded = header.getAttribute('aria-expanded') === 'true';

      // Fecha todos os outros para ter apenas um aberto por vez
      accordionHeaders.forEach(otherHeader => {
        if (otherHeader !== header) {
          otherHeader.setAttribute('aria-expanded', 'false');
          otherHeader.nextElementSibling.classList.remove('show');
        }
      });
      
      header.setAttribute('aria-expanded', String(!isExpanded));
      content.classList.toggle('show');
    });
  });
}

/* TOOLTIPS*/
export function initTooltips() {
    const tooltipRoot = document.getElementById("tooltip-root");
    if (!tooltipRoot) return;

    document.querySelectorAll(".list-item[data-tooltip]").forEach(item => {
        const text = item.getAttribute("data-tooltip");
        if (!text) return;

        let tooltip;

        item.addEventListener("mouseenter", () => {
            tooltip = document.createElement("div");
            tooltip.className = "tooltip visible";
            tooltip.textContent = text;
            tooltipRoot.appendChild(tooltip);

            const rect = item.getBoundingClientRect();
            tooltip.style.top = rect.top + rect.height / 2 + "px";
            tooltip.style.left = rect.right + 10 + "px";
            tooltip.style.transform = "translateY(-50%)";
        });

        item.addEventListener("mouseleave", () => {
            if (tooltip) {
                tooltip.remove();
                tooltip = null;
            }
        });
    });
}