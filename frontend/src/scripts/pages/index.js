// frontend/src/scripts/pages/index.js
// Import relativo (ajuste se usar bundler com @ alias)
import { showNotification } from '../utils/notification.js';  // Sem @, use relativo

function initializeCarousel() {
  document.addEventListener('DOMContentLoaded', () => {  // Garante DOM pronto
    const imgElement = document.getElementById('dynamicImage');
    if (!imgElement) {
      console.error('Elemento #dynamicImage não encontrado!');
      return;
    }

    // Paths corrigidos: sem 'public/', absolutos para servir de /public/
    const images = [
      '/images/panel/banner1.webp',
      '/images/panel/banner2.webp',
      '/images/panel/banner3.png'
    ];
    let currentIndex = 0;
    let intervalId;

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!prevBtn || !nextBtn) {
      console.error('Botões do carousel não encontrados!');
      return;
    }

    // Função para mostrar imagem com error handling
    const showImage = (index) => {
      const imgSrc = images[index];
      imgElement.src = imgSrc;
      imgElement.alt = `Banner ${index + 1} da AGR`;  // Acessibilidade
      currentIndex = index;

      // Fallback se falhar (ex: 404)
      imgElement.onerror = () => {
        imgElement.src = '/images/fallback-banner.jpg';  // Crie um placeholder
        console.warn(`Imagem ${imgSrc} não carregou, usando fallback.`);
        showNotification('Algumas imagens do banner não carregaram. Verifique a conexão.', 'warning');
      };
      imgElement.onload = () => console.log(`Imagem ${imgSrc} carregada.`);  // Debug
    };

    const startAutoSlide = () => {
      stopAutoSlide();
      intervalId = setInterval(() => {
        showImage((currentIndex + 1) % images.length);
      }, 6000);  // 6s
    };

    const stopAutoSlide = () => {
      if (intervalId) clearInterval(intervalId);
    };

    // Eventos nos botões
    prevBtn.addEventListener('click', () => {
      console.log('Botão anterior clicado');  // Debug
      stopAutoSlide();
      showImage((currentIndex - 1 + images.length) % images.length);
      startAutoSlide();
    });

    nextBtn.addEventListener('click', () => {
      console.log('Botão próximo clicado');  // Debug
      stopAutoSlide();
      showImage((currentIndex + 1) % images.length);
      startAutoSlide();
    });

    // Teclado para acessibilidade (opcional)
    imgElement.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prevBtn.click();
      if (e.key === 'ArrowRight') nextBtn.click();
    });

    // Inicializa
    showImage(0);  // Primeira img
    startAutoSlide();
    console.log('Carousel inicializado!');  // Debug
  });
}

function initializeQuickActions() {
  document.body.addEventListener('click', (e) => {
    const quickActionButton = e.target.closest('[data-action]');
    if (quickActionButton) {
      const action = quickActionButton.dataset.action;
      let url = '';
      let message = '';

      switch (action) {
        case 'ferias':
          url = 'ferias.html';  // Path relativo
          message = 'Redirecionando para solicitação de férias...';
          break;
        case 'documentos':
          url = 'documentos.html';
          message = 'Redirecionando para documentos...';
          break;
        case 'agenda':
          url = 'agenda.html';
          message = 'Redirecionando para agenda...';
          break;
        default:
          console.warn(`Ação desconhecida: ${action}`);
          return;
      }
      if (url) {
        showNotification(message, 'info');
        setTimeout(() => { window.location.href = url; }, 1000);
      }
    }
  });
}

/**
 * Função de inicialização para a página Index.
 */
export function initIndexPage() {
  initializeCarousel();
  initializeQuickActions();
}