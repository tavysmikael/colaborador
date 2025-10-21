/**
 * Initializes page-specific functionality for jornada.html and banco-horas.html.
 * @module jornada-banco-horas
 */
import { showNotification } from '../utils/notifications.js';

/**
 * Handles button actions with notification and analytics tracking.
 * @param {string} action - The action identifier.
 * @param {string} message - The notification message.
 * @param {boolean} isDownload - Whether the action simulates a download.
 * @private
 */
function handleAction(action, message, isDownload = false) {
  showNotification(message, isDownload ? 'success' : 'info');
  if (isDownload) {
    setTimeout(() => {
      showNotification(`${message.replace('Gerando', 'Gerado').replace('...', '!')}`, 'success');
    }, 2000);
  }
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'click_button', {
      event_category: 'jornada',
      event_label: action
    });
  }
}

/**
 * Initializes page-specific functionality for jornada.html.
 */
export function initJornada() {
  const actions = {
    registrarEntrada: {
      message: 'Entrada registrada com sucesso!',
      isDownload: true
    },
    registrarSaida: {
      message: 'Saída registrada com sucesso!',
      isDownload: true
    },
    registrarPausa: {
      message: 'Pausa para almoço registrada!',
      isDownload: true
    },
    verFrequenciaMensal: {
      message: 'Carregando frequência mensal...',
      isDownload: false
    },
    verHistoricoFrequencia: {
      message: 'Carregando histórico de frequência...',
      isDownload: false
    },
    consultarEscala: {
      message: 'Consultando escala de horário flexível...',
      isDownload: false
    },
    verBancoHoras: {
      message: 'Carregando banco de horas...',
      isDownload: false
    },
    gerarRelatorioMensal: {
      message: 'Gerando relatório mensal...',
      isDownload: true
    },
    verEstatisticas: {
      message: 'Carregando estatísticas...',
      isDownload: false
    }
  };

  Object.entries(actions).forEach(([action, { message, isDownload }]) => {
    const button = document.querySelector(`[onclick="window.${action}()"]`);
    if (button) {
      button.addEventListener('click', () => handleAction(action, message, isDownload));
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleAction(action, message, isDownload);
        }
      });
    }
  });

  // Remove global exposures
  delete window.registrarEntrada;
  delete window.registrarSaida;
  delete window.registrarPausa;
  delete window.verFrequenciaMensal;
  delete window.verHistoricoFrequencia;
  delete window.consultarEscala;
  delete window.verBancoHoras;
  delete window.gerarRelatorioMensal;
  delete window.verEstatisticas;
}

/**
 * App para o relógio flip do banco de horas.
 * @private
 */
const bancoHorasApp = {
  // Dados de exemplo dos funcionários (Criar API)
  employees: [
    { name: "João Silva", date: "2025-10-13", days: 5, hours: 3, mins: 45 },
    { name: "Maria Oliveira", date: "2025-10-13", days: 2, hours: 12, mins: 30 },
    { name: "Pedro Santos", date: "2025-10-12", days: 1, hours: 8, mins: 15 },
    { name: "Ana Costa", date: "2025-10-13", days: 0, hours: 4, mins: 20 },
    // Adicione mais dados conforme necessário
  ],

  init() {
    this.cacheDOM();
    this.bindEvents();
    this.setDefaultEmployee(); // Define um padrão inicial
  },

  cacheDOM() {
    this.clock = document.querySelector('.clock');
    if (!this.clock) return; // Só roda se for a página certa
    this.days = this.clock.querySelector('.clock__number--days');
    this.hours = this.clock.querySelector('.clock__number--hours');
    this.minutes = this.clock.querySelector('.clock__number--minutes');
    this.employeeName = document.getElementById('employeeName');
  },

  bindEvents() {
    // Eventos já estão no HTML via oninput="filterEmployee()"
    // Mas expõe globalmente para compatibilidade
    window.filterEmployee = this.filterEmployee.bind(this);
  },

  // Função para filtrar e atualizar (chamada pelos inputs)
  filterEmployee() {
    const nameSearch = document.getElementById('nameSearch').value.toLowerCase();
    const dateFilter = document.getElementById('dateFilter').value;

    // Encontra o primeiro match (nome parcial e data exata, se fornecida)
    let selected = null;
    for (let emp of this.employees) {
      const nameMatch = emp.name.toLowerCase().includes(nameSearch);
      const dateMatch = !dateFilter || emp.date === dateFilter;
      if (nameMatch && dateMatch) {
        selected = emp;
        break;
      }
    }

    if (selected) {
      this.updateClock(selected);
      this.employeeName.textContent = `Saldo para ${selected.name} em ${selected.date}`;
    } else if (!nameSearch && !dateFilter) {
      this.setDefaultEmployee();
    } else {
      this.employeeName.textContent = 'Nenhum funcionário encontrado.';
      this.resetClock();
    }
  },

  setDefaultEmployee() {
    // Pega o primeiro funcionário como padrão
    if (this.employees.length > 0) {
      this.updateClock(this.employees[0]);
      this.employeeName.textContent = `Saldo padrão para ${this.employees[0].name}`;
    }
  },

  updateClock(emp) {
    const time = {
      days: this.pad(emp.days),
      hours: this.pad(emp.hours),
      minutes: this.pad(emp.mins)
    };

    this.appendTime(time);
  },

  appendTime(time) {
    if (this.days.innerText !== time.days) this.flip(this.days, time.days);
    if (this.hours.innerText !== time.hours) this.flip(this.hours, time.hours);
    if (this.minutes.innerText !== time.minutes) this.flip(this.minutes, time.minutes);
  },

  flip(elm, time) {
    elm.classList.add('flip');
    elm.dataset.time = time;
    elm.innerText = time;
    setTimeout(() => {
      elm.classList.remove('flip');
    }, 1000);
  },

  resetClock() {
    this.flip(this.days, '00');
    this.flip(this.hours, '00');
    this.flip(this.minutes, '00');
  },

  pad(number) {
    const fixNumber = number.toString();
    return fixNumber.length < 2 ? `0${fixNumber}` : fixNumber;
  }
};

/**
 * Initializes page-specific functionality for banco-horas.html.
 */
export function initBancoHoras() {
  // Inicializa o app do relógio
  bancoHorasApp.init();

  // Se houver botões específicos para esta página, adicione aqui
  // Exemplo: ações de download de relatório de banco de horas
  const actions = {
    gerarRelatorioBancoHoras: {
      message: 'Gerando relatório de banco de horas...',
      isDownload: true
    }
    // Adicione mais ações conforme necessário
  };

  Object.entries(actions).forEach(([action, { message, isDownload }]) => {
    const button = document.querySelector(`[onclick="window.${action}()"]`);
    if (button) {
      button.addEventListener('click', () => handleAction(action, message, isDownload));
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleAction(action, message, isDownload);
        }
      });
    }
  });

  // Remove global exposures se houver
  delete window.gerarRelatorioBancoHoras;
}