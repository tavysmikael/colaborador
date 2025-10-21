/**
 * Initializes page-specific functionality for profile.html.
 * @module profile
 */
import { showNotification } from '../utils/notifications.js';

/**
 * Loads saved profile data from localStorage.
 * @private
 */
function loadProfileData() {
  const profilePhoto = document.getElementById('profile-photo');
  const savedData = localStorage.getItem('profileData');
  if (savedData) {
    const data = JSON.parse(savedData);
    document.getElementById('full-name').value = data.fullName || '';
    document.getElementById('email').value = data.email || '';
    document.getElementById('phone').value = data.phone || '';
    document.getElementById('function').value = data.function || '';
    document.getElementById('workplace').value = data.workplace || '';
    document.getElementById('biography').value = data.biography || '';
  }
  const savedPhoto = localStorage.getItem('profilePhoto');
  if (savedPhoto && profilePhoto) {
    profilePhoto.src = savedPhoto;
  }
}

/**
 * Saves profile data to localStorage.
 * @private
 */
function saveProfile() {
  const formData = {
    fullName: document.getElementById('full-name')?.value.trim(),
    email: document.getElementById('email')?.value.trim(),
    phone: document.getElementById('phone')?.value.trim(),
    function: document.getElementById('function')?.value.trim(),
    workplace: document.getElementById('workplace')?.value.trim(),
    biography: document.getElementById('biography')?.value.trim()
  };

  if (!formData.fullName || !formData.email || !formData.function || !formData.workplace) {
    showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    showNotification('Por favor, insira um e-mail válido.', 'error');
    return;
  }

  localStorage.setItem('profileData', JSON.stringify(formData));
  showNotification('Perfil salvo com sucesso!', 'success');
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'form_submit', {
      event_category: 'perfil',
      event_label: 'Salvar Perfil'
    });
  }
}

/**
 * Cancels profile changes and resets the form.
 * @private
 */
function cancelProfile() {
  const profileForm = document.getElementById('profile-form');
  const profilePhoto = document.getElementById('profile-photo');
  if (profileForm) {
    profileForm.querySelectorAll('input, textarea, select').forEach(field => {
      field.value = '';
    });
  }
  if (profilePhoto) {
    profilePhoto.src = 'https://img.icons8.com/ios-filled/100/000000/user.png';
  }
  localStorage.removeItem('profileData');
  localStorage.removeItem('profilePhoto');
  showNotification('Alterações canceladas.', 'info');
  window.history.back();
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'click_button', {
      event_category: 'perfil',
      event_label: 'Cancelar Perfil'
    });
  }
}

/**
 * Initializes page-specific functionality for profile.html.
 */
export function initProfile() {
  const changePhotoBtn = document.getElementById('change-photo-btn');
  const photoInput = document.getElementById('photo-input');
  const profilePhoto = document.getElementById('profile-photo');

  if (!changePhotoBtn || !photoInput || !profilePhoto) {
    showNotification('Erro: Elementos do perfil não encontrados.', 'error');
    return;
  }

  changePhotoBtn.addEventListener('click', () => {
    photoInput.click();
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'click_button', {
        event_category: 'perfil',
        event_label: 'Alterar Foto de Perfil'
      });
    }
  });

  changePhotoBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      photoInput.click();
    }
  });

  photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showNotification('Por favor, selecione um arquivo de imagem.', 'error');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        showNotification('A imagem deve ter no máximo 2MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        profilePhoto.src = e.target.result;
        localStorage.setItem('profilePhoto', e.target.result);
        showNotification('Foto de perfil atualizada com sucesso!', 'success');
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'photo_upload', {
            event_category: 'perfil',
            event_label: 'Foto de Perfil Atualizada'
          });
        }
      };
      reader.readAsDataURL(file);
    }
  });

  loadProfileData();

  // Expose for HTML event handlers
  return { saveProfile, cancelProfile };
}