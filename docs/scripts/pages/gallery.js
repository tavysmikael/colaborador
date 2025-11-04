const galleryData = [
  {
    id: 1,
    type: 'image',
    src: 'https://picsum.photos/800/600?random=1',
    title: 'Confraternização de Final de Ano',
    description: 'Equipe reunida para celebrar conquistas de 2024',
    date: '2024-12-15',
    author: 'João Silva'
  },
  {
    id: 2,
    type: 'video',
    src: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    poster: 'https://picsum.photos/800/600?random=2',
    title: 'Vídeo Institucional AGR',
    description: 'Apresentação oficial da agência',
    date: '2024-12-10',
    author: 'Maria Santos'
  },
  // Adicione mais itens...
];

export function initGallery() {
  const galleryGrid = document.getElementById('gallery-grid');
  const uploadBtn = document.getElementById('upload-btn');
  const mediaInput = document.getElementById('media-input');
  const filterSelect = document.getElementById('filter-type');
  const searchInput = document.getElementById('search-input');
  const sortSelect = document.getElementById('sort-select');

  // Render initial gallery
  renderGallery(galleryData);

  // Upload functionality
  uploadBtn.addEventListener('click', () => mediaInput.click());
  
  mediaInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          galleryData.unshift({
            id: Date.now(),
            type: file.type.startsWith('image/') ? 'image' : 'video',
            src: e.target.result,
            title: file.name,
            description: `Nova mídia adicionada por ${getCurrentUser()}`,
            date: new Date().toISOString().split('T')[0],
            author: getCurrentUser()
          });
          renderGallery(galleryData);
          showNotification('Mídia adicionada com sucesso!', 'success');
        };
        reader.readAsDataURL(file);
      }
    });
    mediaInput.value = '';
  });

  // Filter and search
  filterSelect.addEventListener('change', filterAndSort);
  searchInput.addEventListener('input', debounce(filterAndSort, 300));
  sortSelect.addEventListener('change', filterAndSort);

  function renderGallery(items) {
    galleryGrid.innerHTML = items.map(item => `
      <div class="gallery-item" data-id="${item.id}" data-type="${item.type}" data-date="${item.date}" data-title="${item.title}">
        ${item.type === 'image' ? 
          `<img src="${item.src}" alt="${item.title}" class="gallery-image" loading="lazy">` :
          `<video class="gallery-video" poster="${item.poster || ''}" aria-label="${item.title}">
            <source src="${item.src}" type="${item.type}">
          </video>`
        }
        <div class="gallery-overlay">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <span class="gallery-date">${formatDate(item.date)}</span>
        </div>
      </div>
    `).join('');

    // Add click handlers for lightbox
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => openLightbox(item.dataset.id));
    });

    updateStats(items);
  }

  function filterAndSort() {
    const filterType = filterSelect.value;
    const searchTerm = searchInput.value.toLowerCase();
    const sortBy = sortSelect.value;

    let filtered = galleryData.filter(item => {
      const matchesType = filterType === 'all' || item.type === filterType;
      const matchesSearch = !searchTerm || 
        item.title.toLowerCase().includes(searchTerm) || 
        item.description.toLowerCase().includes(searchTerm);
      return matchesType && matchesSearch;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

    renderGallery(filtered);
  }

  function openLightbox(id) {
    const item = galleryData.find(i => i.id == id);
    if (!item) return;

    const lightbox = document.getElementById('lightbox-modal');
    const lightboxMedia = document.getElementById('lightbox-media');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    const lightboxDate = document.getElementById('lightbox-date');
    const lightboxType = document.getElementById('lightbox-type');

    if (item.type === 'image') {
      lightboxMedia.innerHTML = `<img src="${item.src}" alt="${item.title}">`;
    } else {
      lightboxMedia.innerHTML = `
        <video controls>
          <source src="${item.src}" type="${item.type}">
        </video>
      `;
    }

    lightboxTitle.textContent = item.title;
    lightboxDescription.textContent = item.description;
    lightboxDate.textContent = formatDate(item.date);
    lightboxType.textContent = item.type === 'image' ? 'Foto' : 'Vídeo';

    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  // Close lightbox
  document.querySelector('.lightbox-close').addEventListener('click', () => {
    document.getElementById('lightbox-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
  });

  function updateStats(items) {
    document.getElementById('total-media').textContent = items.length;
    document.getElementById('total-photos').textContent = items.filter(i => i.type === 'image').length;
    document.getElementById('total-videos').textContent = items.filter(i => i.type === 'video').length;
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }

  function getCurrentUser() {
    return 'Colaborador AGR'; // Implementar autenticação real
  }

  function showNotification(message, type = 'info') {
    const toast = document.getElementById('notification-toast');
    toast.textContent = message;
    toast.className = `notification-toast ${type}`;
    toast.style.display = 'block';
    setTimeout(() => toast.style.display = 'none', 3000);
  }

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

document.addEventListener('DOMContentLoaded', initGallery);