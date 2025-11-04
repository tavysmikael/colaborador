export function initKanbanPage() {
    // Verifica se estamos na página do Kanban antes de executar
    if (!document.getElementById('page-kanban')) {
        return;
    }

    lucide.createIcons();

    const { jsPDF } = window.jspdf;
    
    // Elementos DOM - mantendo os originais
    const primarySidebar = document.getElementById('primary-sidebar');
    const secondarySidebar = document.getElementById('secondary-sidebar');
    const secondaryTitle = document.getElementById('secondary-title');
    const secondaryContent = document.getElementById('secondary-content');
    const closeSecondary = document.getElementById('close-secondary');
    const columns = document.querySelectorAll('.column');
    const taskSearch = document.getElementById('taskSearch');
    const floorFilter = document.getElementById('floorFilter');
    const managementFilter = document.getElementById('managementFilter');
    const priorityChips = document.getElementById('priorityChips');
    const contentSelect = document.getElementById('contentSelect');
    const modal = document.getElementById('modal');
    const saveEdit = document.getElementById('save-edit');
    const closeModal = document.getElementById('close-modal');
    const mainTitle = document.getElementById('main-title');
    const clock = document.getElementById('clock');
    const logoImg = document.getElementById('logo-img');
    const statusFilter = document.getElementById('statusFilter');
    const addTaskGlobal = document.getElementById('add-task-global');
    const settingsBtn = document.getElementById('settings-btn');
    const body = document.body;

    const taskDetailsView = document.getElementById('task-details-view');
    const taskEditForm = document.getElementById('task-edit-form');

    // Dados - com validação simples
    let issues = [];
    try {
        const stored = localStorage.getItem('issues');
        issues = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(issues)) issues = [];
    } catch (e) {
        issues = [];
    }

    let meetings = [];
    try {
        const stored = localStorage.getItem('meetings');
        meetings = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(meetings)) meetings = [];
    } catch (e) {
        meetings = [];
    }

    let currentEditTask = null;
    let currentType = 'issue';
    let currentSection = 'Projetos';
    let currentSubStatus = 'reunioes';
    let calendarInstance = null;

    // Configurações - mantendo originais
    const funcIcons = {
        'Adicionar Tarefa': 'plus', 'Filtrar Tarefas': 'filter', 'Exportar Kanban': 'download',
        'Configurações de Coluna': 'settings', 'Adicionar Reunião': 'plus', 'Filtrar Reuniões': 'filter',
        'Exportar Calendário': 'download', 'Todos': 'list', 'Reuniões': 'calendar',
        'Canceladas': 'x', 'Arquivadas': 'archive'
    };

    const sections = {
        'Projetos': { sub: ['Adicionar Tarefa', 'Filtrar Tarefas', 'Exportar Kanban', 'Configurações de Coluna'] },
        'Reuniões': { sub: ['Todos', 'Reuniões', 'Canceladas', 'Arquivadas', 'Adicionar Reunião', 'Filtrar Reuniões', 'Exportar Calendário'] },
        'Funcionários': { sub: [] }
    };

    // Sanitização simples (opcional, pode remover se causar problemas)
    function sanitizeInput(input) {
        return input ? String(input).replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') : '';
    }

    // Relógio - mantendo original
    function updateClock() {
        const now = new Date();
        const options = {
            hour: '2-digit', minute: '2-digit', timeZoneName: 'short', timeZone: 'America/Sao_Paulo'
        };
        if (clock) {
            clock.textContent = `${now.toLocaleTimeString('pt-BR', options)}, ${now.toLocaleDateString('pt-BR', { weekday: 'short' })}, ${now.toLocaleDateString('pt-BR')}`;
        }
    }

    function saveIssues() {
        try {
            localStorage.setItem('issues', JSON.stringify(issues));
        } catch (e) {
            console.error('Erro ao salvar issues:', e);
        }
    }

    function saveMeetings() {
        try {
            localStorage.setItem('meetings', JSON.stringify(meetings));
        } catch (e) {
            console.error('Erro ao salvar meetings:', e);
        }
    }

    // Função para formatar data como "10 de set."
    function formatDate(isoDate) {
        if (!isoDate) return '';
        const date = new Date(isoDate);
        return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
    }

    // Função para truncar texto
    function truncate(text, maxLength) {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            showNotification('Botão de Configurações clicado!');
        });
    }

    // Sidebar principal - mantendo original
    // Variável de controle para o último item clicado
    let lastClickedSection = null;

    if (primarySidebar) {
        primarySidebar.addEventListener('click', (e) => {
            const item = e.target.closest('.list-item');
            if (item) {
                const section = item.dataset.section;
                if (!sections[section]) return;

                // Se o mesmo item foi clicado antes, abre ou fecha a secondary sidebar
                if (lastClickedSection === section) {
                    secondarySidebar.classList.toggle('open');
                } else {
                    // Primeiro clique: atualiza título e conteúdo mas não abre
                    if (secondaryTitle) secondaryTitle.textContent = section;
                    if (secondaryContent) {
                        secondaryContent.innerHTML = '';
                        sections[section].sub.forEach(func => {
                            const li = document.createElement('div');
                            li.classList.add('archived');
                            li.innerHTML = `<span class="icon"><i data-lucide="${funcIcons[func] || 'circle'}"></i></span><span>${func}</span>`;
                            li.addEventListener('click', () => handleSecondaryMenuClick(func));
                            secondaryContent.appendChild(li);
                        });
                    }
                    lucide.createIcons();
                    if (mainTitle) mainTitle.textContent = section;

                    // 🔹 Atualiza a seção atual corretamente
                    currentSection = section;
                    currentSubStatus = null; // reseta o submenu quando troca de seção

                    renderContent();
                    toggleMiniCalendar(section === 'Reuniões');


                    // Atualiza o último item clicado
                    lastClickedSection = section;
                }
            }
        });
    }


    if (closeSecondary) {
        closeSecondary.addEventListener('click', () => {
            if (secondarySidebar) secondarySidebar.classList.remove('open');
            lastClickedSection = null; // reset
        });
    }


    // Função do menu secundário - mantendo original
    function handleSecondaryMenuClick(func) {
        if (func.includes('Adicionar')) {
            openNewTaskModal();
        } else if (func.includes('Filtrar')) {
            if (taskSearch) taskSearch.focus();
        } else if (func === 'Exportar Kanban') {
            exportKanbanToPDF();
        } else if (func.includes('Configurações')) {
            showNotification('Função não implementada.');
        } else if (func === 'Exportar Calendário') {
            showNotification('Função não implementada.');
        } else {
            currentSubStatus = func.toLowerCase();
            renderContent();
            if (secondarySidebar) secondarySidebar.classList.remove('open');
        }
    }

    // Mini calendário - mantendo original
    function toggleMiniCalendar(show) {
        const miniEl = document.getElementById('mini-calendar');
        if (!miniEl) return;
        
        miniEl.style.display = show ? 'block' : 'none';
        if (show && miniEl.innerHTML === '') {
            try {
                const miniCalendar = new FullCalendar.Calendar(miniEl, {
                    initialView: 'dayGridMonth', 
                    locale: 'pt-br', 
                    height: 'auto',
                    headerToolbar: { left: '', center: 'title', right: '' },
                    events: meetings.map(m => ({ title: m.title, start: m.date, color: getMeetingColor(m.status) })),
                    dateClick: (info) => { 
                        if (calendarInstance) calendarInstance.gotoDate(info.dateStr); 
                    }
                });
                miniCalendar.render();
            } catch (e) {
                console.error('Erro ao renderizar mini calendário:', e);
            }
        }
    }

    // Fechar sidebar secundária
    if (closeSecondary) {
        closeSecondary.addEventListener('click', () => {
            if (secondarySidebar) secondarySidebar.classList.remove('open');
        });
    }

    // Colunas - mantendo original
    columns.forEach(column => {
        const header = column.querySelector('.column-header');
        const body = column.querySelector('.column-body');
        if (header && body) {
            header.addEventListener('click', (e) => {
                if (!e.target.classList.contains('add-task-btn')) {
                    body.classList.toggle('open');
                }
            });
            
            const addBtn = header.querySelector('.add-task-btn');
            if (addBtn) {
                addBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openNewTaskModal(column.id);
                });
            }
        }
    });

    // Botão global de adicionar tarefa
    if (addTaskGlobal) {
        addTaskGlobal.addEventListener('click', () => openNewTaskModal());
    }

    // Modal - mantendo estrutura original
    function openNewTaskModal(columnId = 'Solicitado') {
        currentEditTask = null;
        currentType = currentSection === 'Reuniões' ? 'meeting' : 'issue';

        taskDetailsView.style.display = 'none';
        taskEditForm.style.display = 'block';
        // Altera o título do formulário
        taskEditForm.querySelector('h2').textContent = 'Nova Tarefa';
        
        const titleField = document.getElementById('edit-title');
        const descField = document.getElementById('edit-desc');
        const priorityField = document.getElementById('edit-priority');
        const assigneeField = document.getElementById('edit-assignee');
        const dueField = document.getElementById('edit-due');
        const labelsField = document.getElementById('edit-labels');
        const commentsField = document.getElementById('edit-comments');
        const attachmentsField = document.getElementById('edit-attachments');
        const floorField = document.getElementById('edit-floor');
        const managementField = document.getElementById('edit-management');
        
        if (titleField) titleField.value = '';
        if (descField) descField.value = '';
        if (priorityField) priorityField.value = 'Medium';
        if (assigneeField) assigneeField.value = 'Você';
        if (dueField) dueField.value = '';
        if (labelsField) labelsField.value = '';
        if (commentsField) commentsField.value = 0;
        if (attachmentsField) attachmentsField.value = 0;
        if (floorField) floorField.value = '';
        if (managementField) managementField.value = '';
        
        adjustModalForType(currentType);
        if (modal) modal.style.display = 'flex';

         // Limpa todos os campos do formulário para garantir que esteja em branco
        document.getElementById('edit-title').value = '';
        document.getElementById('edit-desc').value = '';
        document.getElementById('edit-priority').value = 'Medium'; // Valor padrão
        document.getElementById('edit-assignee').value = 'Você'; // Valor padrão
        document.getElementById('edit-due').value = '';
        document.getElementById('edit-floor').value = '';
        document.getElementById('edit-management').value = '';

        modal.style.display = 'flex';
    }

    function adjustModalForType(type) {
        const h2 = modal ? modal.querySelector('h2') : null;
        const due = document.getElementById('edit-due');
        const statusSelect = document.getElementById('edit-status');
        
        if (h2) h2.textContent = type === 'meeting' ? 'Nova Reunião' : 'Nova Tarefa';
        if (due) due.type = type === 'meeting' ? 'datetime-local' : 'date';
        if (statusSelect) statusSelect.style.display = type === 'meeting' ? 'block' : 'none';
        
        const issueFields = ['edit-priority', 'edit-labels', 'edit-comments', 'edit-attachments', 'edit-floor', 'edit-management'];
        issueFields.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = type === 'issue' ? 'block' : 'none';
        });
    }

    // Criar item de tarefa - atualizado para o novo design
    function createTaskItem(issue) {
        const task = document.createElement('div');
        task.className = `task-item priority-${issue.priority.toLowerCase()}`;
        task.dataset.id = issue.id;
        task.dataset.type = 'issue';

        const formattedDate = issue.due 
            ? new Date(issue.due + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
            : '';

        // Nova estrutura HTML para layout de linha única
        task.innerHTML = `
            <i data-lucide="bar-chart-horizontal" class="task-type-icon"></i>
            <div class="task-content-wrapper" title="${sanitizeInput(issue.title)}">
                <span class="task-title">${sanitizeInput(issue.title)}</span>
                ${issue.desc ? `<span class="task-separator">›</span><span class="task-details-tag">${sanitizeInput(issue.desc)}</span>` : ''}
            </div>
            <div class="task-meta-wrapper">
                ${issue.management ? `<span class="task-meta-tag">${sanitizeInput(issue.management)}</span>` : ''}
                ${issue.floor ? `<span class="task-meta-tag">${sanitizeInput(issue.floor)}º Andar</span>` : ''}
                ${formattedDate ? `<span class="task-date">${formattedDate}</span>` : ''}
            </div>
            <button class="edit-btn" aria-label="Opções da Tarefa">
                <i data-lucide="more-horizontal"></i>
            </button>
        `;

        task.addEventListener('click', () => {
            openDetailsModal(issue);
        });
        
        const editBtn = task.querySelector('.edit-btn');
        if (editBtn) {
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openEditModal(issue, 'issue');
            });
        }
        
        task.addEventListener('click', () => {
        openDetailsModal(issue);
    });

    return task;
    }

    // Renderizar conteúdo - mantendo original
    function renderContent() {
        const kanbanView = document.getElementById('kanban-view');
        const reunioesView = document.getElementById('reunioes-view');
        
        if (kanbanView) kanbanView.style.display = currentSection === 'Projetos' ? 'block' : 'none';
        if (reunioesView) reunioesView.style.display = currentSection === 'Reuniões' ? 'block' : 'none';

        if (currentSection === 'Projetos') renderIssues();
        if (currentSection === 'Reuniões') renderMeetings();
    }

    // Renderizar issues - mantendo original
    function renderIssues() {
        if (!statusFilter) return;
        
        const activeStatusTab = statusFilter.querySelector('.status-tab.active');
        if (!activeStatusTab) return;
        
        const activeStatus = activeStatusTab.dataset.status;

        columns.forEach(c => {
            const body = c.querySelector('.column-body');
            if (body) body.innerHTML = '';
        });
        
        const filteredIssues = issues.filter(issue => {
            const searchTerm = (taskSearch ? taskSearch.value.toLowerCase() : '');
            const priority = priorityChips ? Array.from(priorityChips.querySelectorAll('.chip.active')).map(chip => chip.dataset.priority) : [];
            
            const statusMatch = (activeStatus === 'all') ||
                                (activeStatus === 'active' && issue.state !== 'arquivado') ||
                                (activeStatus === 'archived' && issue.state === 'arquivado');

            return (issue.title.toLowerCase().includes(searchTerm) || (issue.desc || '').toLowerCase().includes(searchTerm)) &&
                   (!floorFilter || !floorFilter.value || issue.floor === floorFilter.value) &&
                   (!managementFilter || !managementFilter.value || issue.management === managementFilter.value) &&
                   (priority.length === 0 || priority.includes(issue.priority.toLowerCase())) &&
                   statusMatch;
        });

        filteredIssues.forEach(issue => {
            const column = document.getElementById(issue.state);
            if (column) {
                const body = column.querySelector('.column-body');
                if (body) body.appendChild(createTaskItem(issue));
            }
        });

        // Isso irá renderizar TODOS os ícones que acabaram de ser adicionados ao DOM.
        lucide.createIcons(); 
        
        updateColumnCounts();
    }

    function updateColumnCounts() {
        columns.forEach(c => {
            const countEl = c.querySelector('.column-count');
            const body = c.querySelector('.column-body');
            if (countEl && body) {
                countEl.textContent = body.childElementCount;
            }
        });
    }

    function getMeetingColor(status) {
        if (status === 'cancelada') return 'red';
        if (status === 'arquivadas') return 'gray';
        return 'green';
    }

    // Renderizar reuniões - mantendo original
    function renderMeetings() {
        const calendarEl = document.getElementById('calendar');
        const meetingsListEl = document.getElementById('meetings-list');
        
        if (meetingsListEl) meetingsListEl.innerHTML = '';

        if (calendarEl && !calendarInstance) {
            try {
                calendarInstance = new FullCalendar.Calendar(calendarEl, {
                    initialView: 'timeGrid',
                    locale: 'pt-br',
                    headerToolbar: { left: 'prev,next', center: 'title', right: '' },
                    allDaySlot: false,
                    nowIndicator: true,
                });
                calendarInstance.render();
            } catch (e) {
                console.error('Erro ao inicializar calendário:', e);
            }
        }
        
        if (calendarInstance) {
            const events = meetings.map(m => ({
                id: m.id,
                title: m.title,
                start: m.date,
                color: getMeetingColor(m.status)
            }));
            calendarInstance.getEvents().forEach(event => event.remove());
            calendarInstance.addEventSource(events);
        }
    }

    // Modal de edição - mantendo original
    function openEditModal(itemData, type) {
        currentType = type;
        currentEditTask = itemData;
        
        const titleField = document.getElementById('edit-title');
        const descField = document.getElementById('edit-desc');
        const assigneeField = document.getElementById('edit-assignee');
        const priorityField = document.getElementById('edit-priority');
        const dueField = document.getElementById('edit-due');
        const labelsField = document.getElementById('edit-labels');
        const commentsField = document.getElementById('edit-comments');
        const attachmentsField = document.getElementById('edit-attachments');
        const floorField = document.getElementById('edit-floor');
        const managementField = document.getElementById('edit-management');
        
        if (titleField) titleField.value = itemData.title;
        if (descField) descField.value = itemData.desc || '';
        if (assigneeField) assigneeField.value = itemData.assignee || '';
        if (labelsField) labelsField.value = (itemData.labels || []).join(', ');
        if (commentsField) commentsField.value = itemData.comments || 0;
        if (attachmentsField) attachmentsField.value = itemData.attachments || 0;
        if (floorField) floorField.value = itemData.floor || '';
        if (managementField) managementField.value = itemData.management || '';
        
        if (type === 'issue') {
            if (priorityField) priorityField.value = itemData.priority;
            if (dueField) dueField.value = itemData.due || '';
        } else {
            const statusField = document.getElementById('edit-status');
            if (dueField && itemData.date) {
                dueField.value = new Date(itemData.date).toISOString().slice(0, 16);
            }
            if (statusField) statusField.value = itemData.status;
        }
        
        adjustModalForType(type);
        if (modal) modal.style.display = 'flex';

        taskEditForm.querySelector('h2').textContent = 'Editar Tarefa';

        // O código para popular os campos
        if (titleField) titleField.value = itemData.title;
        // etc...

        // O código para mostrar o modal 
        taskDetailsView.style.display = 'none';
        taskEditForm.style.display = 'block';
        modal.style.display = 'flex';
    }

    // Salvar edição - atualizado para incluir todos os campos
    if (saveEdit) {
        saveEdit.addEventListener('click', () => {
            const titleField = document.getElementById('edit-title');
            if (!titleField || !titleField.value.trim()) {
                showNotification('O título é obrigatório!');
                return;
            }

            const title = titleField.value.trim();

            if (currentType === 'issue') {
                const labelsStr = document.getElementById('edit-labels')?.value.trim() || '';
                const labels = labelsStr ? labelsStr.split(',').map(l => l.trim()).filter(l => l) : [];

                const issueData = {
                    title: document.getElementById('edit-title').value.trim(),
                    desc: document.getElementById('edit-desc')?.value.trim() || '',
                    priority: document.getElementById('edit-priority')?.value || 'Medium',
                    assignee: document.getElementById('edit-assignee')?.value.trim() || 'Você',
                    due: document.getElementById('edit-due')?.value || '',
                    floor: document.getElementById('edit-floor')?.value.trim() || '',
                    management: document.getElementById('edit-management')?.value.trim() || '',
                    updated: new Date().toISOString()
                };

                if (currentEditTask) {
                    const index = issues.findIndex(i => i.id === currentEditTask.id);
                    if (index !== -1) {
                        issues[index] = { ...issues[index], ...issueData };
                    }
                } else {
                    issues.push({
                    id: Date.now(),
                    ...issueData, 
                    state: 'Solicitado', 
                    section: 'Projetos'
                    });
                }
                saveIssues();
            } else { // meeting
                const meetingData = {
                    title,
                    desc: document.getElementById('edit-desc')?.value.trim() || '',
                    date: document.getElementById('edit-due')?.value || '',
                    status: document.getElementById('edit-status')?.value || 'reunioes',
                    assignee: document.getElementById('edit-assignee')?.value.trim() || 'Você',
                    updated: new Date().toISOString()
                };

                if (currentEditTask) {
                    const index = meetings.findIndex(m => m.id === currentEditTask.id);
                    if (index !== -1) {
                        meetings[index] = { ...meetings[index], ...meetingData };
                    }
                } else {
                    meetings.push({
                        id: Date.now(),
                        ...meetingData,
                        section: 'Reuniões'
                    });
                }
                saveMeetings();
            }

            renderContent();
            if (modal) modal.style.display = 'none';
        });
    }

    // Fechar modal
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            if (modal) modal.style.display = 'none';
        });
    }

    // Filtros - mantendo original
    if (taskSearch) taskSearch.addEventListener('input', renderContent);
    if (floorFilter) floorFilter.addEventListener('input', renderContent);
    if (managementFilter) managementFilter.addEventListener('input', renderContent);
    
    if (priorityChips) {
        priorityChips.addEventListener('click', e => {
            if (e.target.classList.contains('chip')) {
                e.target.classList.toggle('active');
                renderContent();
            }
        });
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('click', e => {
            if (e.target.classList.contains('status-tab')) {
                statusFilter.querySelector('.active')?.classList.remove('active');
                e.target.classList.add('active');
                renderContent();
            }
        });
    }
    
    function openDetailsModal(issue) {
        currentEditTask = issue; // Guarda a tarefa atual para edição futura

        // Mostra a view de detalhes e esconde o formulário
        taskDetailsView.style.display = 'block';
        taskEditForm.style.display = 'none';

        // Popula os campos de detalhes
        document.getElementById('details-title').textContent = issue.title;
        document.getElementById('details-desc').textContent = issue.desc || 'Nenhuma descrição fornecida.';
        document.getElementById('details-state').textContent = issue.state;
        document.getElementById('details-priority').textContent = issue.priority;
        document.getElementById('details-management').textContent = issue.management || 'Não definido';
        document.getElementById('details-floor').textContent = issue.floor ? `${issue.floor}º Andar` : 'Não definido';
        document.getElementById('details-assignee').textContent = issue.assignee;
        document.getElementById('details-due').textContent = issue.due 
            ? new Date(issue.due + 'T00:00:00').toLocaleDateString('pt-BR') 
            : 'Sem prazo';

        modal.style.display = 'flex';
        lucide.createIcons(); // Garante que o ícone de fechar renderize
    }

    // --- Adicionar os eventos para os botões do modal ---
    // Dentro de initKanbanPage, adicione estes listeners:

    document.getElementById('switch-to-edit-mode').addEventListener('click', () => {
        // Esconde a view de detalhes e mostra o formulário de edição
        taskDetailsView.style.display = 'none';
        taskEditForm.style.display = 'block';
        // A função openEditModal já popula o formulário, então vamos chamá-la
        openEditModal(currentEditTask, 'issue'); 
    });

    // Encontre o botão "cancel-edit" que você adicionou ao HTML e crie um listener para ele
    document.getElementById('cancel-edit').addEventListener('click', () => {
        // Simplesmente volta para a tela de detalhes
        taskDetailsView.style.display = 'block';
        taskEditForm.style.display = 'none';
    });

    // Exportar PDF - implementação simples
    function exportKanbanToPDF() {
        if (typeof jsPDF === 'undefined') {
            showNotification('jsPDF não carregado!');
            return;
        }
        
        try {
            const doc = new jsPDF();
            doc.setFontSize(16);
            doc.text('Kanban Board', 10, 10);
            let y = 20;

            columns.forEach(column => {
                const tasks = Array.from(column.querySelector('.column-body')?.children || []);
                if (tasks.length > 0) {
                    doc.setFontSize(12);
                    doc.text(column.id, 10, y);
                    y += 10;
                    tasks.forEach(task => {
                        const title = task.querySelector('.task-title')?.textContent || '';
                        doc.setFontSize(10);
                        doc.text(`- ${title}`, 15, y);
                        y += 7;
                    });
                    y += 5;
                }
            });

            doc.save('kanban.pdf');
            showNotification('Kanban exportado como PDF!');
        } catch (e) {
            showNotification('Erro ao exportar PDF: ' + e.message);
        }
    }

    // Inicialização
    updateClock();
    setInterval(updateClock, 60000); // Manter intervalo original
    renderContent();
}