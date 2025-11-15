<template>
    <div class="layout" ref="layoutContainer">
        <AppSidebar 
            :is-open="isSidebarOpen" 
            :is-collapsed="isSidebarCollapsed" 
            @toggle-collapse="toggleSidebarCollapse" 
        />
        <main class="layout-content" :class="{ 'sidebar-collapsed': isSidebarCollapsed, 'sidebar-closed': !isSidebarOpen }">
            <div class="background-glow"></div>
            <div class="background-grid"></div>
            <div class="container">
                <header class="page-header">
                    <div class="header-info">
                        <h1 class="page-title">Zenix Academy - Gestão de Cursos</h1>
                        <p class="page-subtitle">Crie e organize cursos, módulos, aulas e materiais para o aluno.</p>
                    </div>
                    <div class="header-actions">
                        <button class="btn btn-save" @click="saveCourse">Salvar Curso</button>
                        <button class="btn btn-preview" @click="openPreviewModal" :disabled="!course.selectedCourseId">
                            Preview do Aluno
                        </button>
                        <button class="btn btn-publish">Publicar</button>
                    </div>
                </header>
                <div class="content-sections">
                    <section class="card course-info-section">
                        <h2 class="card-title">Informações do Curso</h2>
                        <div class="form-group">
                            <label for="course-name">Nome do Curso</label>
                            <input type="text" id="course-name" class="input-text"  placeholder="Ex: Mestre do Day Trade" />
                        </div>
                        <div class="form-group cover-upload-group">
                            <label>Capa do curso (16:9)</label>
                            <div class="cover-upload-area">
                                <input 
                                    type="file" 
                                    ref="coverFileInput" 
                                    @change="handleCoverUpload" 
                                    accept="image/*" 
                                    style="display: none;" 
                                />
                                <div 
                                    class="upload-placeholder" 
                                    @click="$refs.coverFileInput.click()"
                                    :class="{ 'hidden-on-preview': course.coverImagePreview }"
                                >   
                                    <span>Arraste ou clique para enviar</span>
                                </div>
                                <div class="cover-preview-box">
                                    <img 
                                        v-if="course.coverImagePreview" 
                                        :src="course.coverImagePreview" 
                                        alt="Prévia da Capa do Curso" 
                                        class="cover-image-preview"
                                    />
                                    <span v-else>Preview da Capa</span>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="course-description">Descrição do curso</label>
                            <textarea id="course-description" class="input-textarea"  placeholder="Descreva o que os alunos aprenderão neste curso."></textarea>
                        </div>
                    </section>
                    <section class="card modules-section">
                        <h2 class="card-title">Módulos e Aulas</h2>
                        <p class="card-subtitle">Selecione o curso, adicione módulos e crie aulas dentro de cada módulo.</p>
                        <div class="form-group course-selection-group">
                            <label for="select-course">Selecionar Curso</label>
                            <div class="input-with-icon">
                                <select id="select-course" class="input-select" @change="loadCourseDetails">
                                    <option :value="null">Escolha um curso...</option>
                                    <option v-for="c in courses" :key="c.id" :value="c.id">{{ c.name }}</option>
                                </select>
                                <button class="btn btn-icon" title="Atualizar Lista" @click="loadCourses">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 4.2C17.3 1.5 13.8 0 10 0C4.5 0 0 4.5 0 10C0 15.5 4.5 20 10 20C13.5 20 16.6 18.2 18.5 15.4L16.7 13.6C15.2 16.1 12.8 17.6 10 17.6C5.9 17.6 2.4 14.1 2.4 10C2.4 5.9 5.9 2.4 10 2.4C12.8 2.4 15.2 3.9 16.7 6.4L13 10H20V4.2Z" fill="currentColor"/></svg>
                                    Atualizar Lista
                                </button>
                            </div>
                        </div>
                        <div class="modules-list-container">
                            <div class="list-header">
                                <h3 class="list-title">Módulos do Curso Selecionado</h3>
                                <button 
                                    class="btn btn-primary" 
                                    title="Adicionar Novo Módulo" 
                                    @click="openNewModuleModal(course.selectedCourseId)"
                                    :disabled="!course.selectedCourseId"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4V20M4 12H20M4 18H20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                    Novo Módulo
                                </button>
                            </div>
                            <div v-for="module in filteredModules" :key="module.id" class="module-item">
                                <span class="module-title">{{ module.title }} ({{ getLessonCountForModule(module.id) }} aulas)</span>
                                <div class="module-actions">
                                    <button class="btn btn-action-icon edit-btn" title="Editar Módulo">Editar</button>
                                    <button class="btn btn-action-icon delete-btn" title="Excluir Módulo">Excluir</button>
                                    <button class="btn btn-secondary add-lesson-btn" title="Adicionar Nova Aula" @click="openNewLessonModal(module.id)">Adicionar Aula</button>
                                </div>
                            </div>
                            <p v-if="!course.selectedCourseId" class="list-placeholder">Selecione um curso para visualizar ou adicionar módulos.</p>
                            <p v-else-if="filteredModules.length === 0" class="list-placeholder">Nenhum módulo encontrado. Clique em "Novo Módulo" para começar.</p>
                        </div>
                    </section>
                </div>
            </div>
            <div v-if="isNewModuleModalOpen" class="modal-overlay">
                <div class="modal-content new-module-card">
                    <h2 class="card-title">Criar Novo Módulo</h2>
                    <p class="card-subtitle-modal">Associe a um curso existente e defina o nome do módulo.</p>
                    <div class="form-group">
                        <label for="modal-select-course">Selecionar Curso</label>
                        <select id="modal-select-course" class="input-select" v-model="newModule.courseId">
                            <option :value="null">Escolha um curso...</option>
                            <option v-for="c in courses" :key="c.id" :value="c.id">{{ c.name }}</option>
                        </select>
                    </div>
                    <div class="create-module-form" :class="{ 'disabled-form': !newModule.courseId }">
                        <div class="form-group">
                            <label for="module-name">Nome do Módulo</label>
                            <input type="text" id="module-name" class="input-text" v-model="newModule.name" placeholder="Ex: Introdução ao Mercado" :disabled="!newModule.courseId" />
                        </div>
                        <div class="form-group">
                            <label for="module-description">Descrição Curta (Opcional)</label>
                            <textarea id="module-description" class="input-textarea" v-model="newModule.shortDescription" placeholder="Breve descrição do módulo..." :disabled="!newModule.courseId"></textarea>
                        </div>
                        <div class="modal-actions">
                            <button class="btn btn-save-module" @click="saveNewModule" :disabled="!newModule.courseId || !newModule.name">Salvar Módulo</button>
                            <button class="btn btn-cancel" @click="closeNewModuleModal">Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="isNewLessonModalOpen" class="modal-overlay">
                <div class="modal-content new-lesson-card">
                    <h2 class="card-title">Nova Aula no Módulo: {{ selectedModuleForLesson.title || 'Selecione um Módulo' }}</h2>
                    <p class="card-subtitle-modal">Crie o conteúdo da nova aula e defina as configurações de acesso.</p>
                    <div class="form-group" v-if="!newLesson.moduleId">
                        <label for="modal-select-module">Selecionar Módulo</label>
                        <select id="modal-select-module" class="input-select" v-model="newLesson.moduleId">
                            <option :value="null">Escolha um módulo...</option>
                            <optgroup v-for="c in courses" :key="c.id" :label="c.name">
                                <option 
                                    v-for="m in modules.filter(mod => mod.courseId === c.id)" 
                                    :key="m.id" 
                                    :value="m.id"
                                >
                                    {{ m.title }}
                                </option>
                            </optgroup>
                        </select>
                    </div>
                    <div class="create-lesson-form" :class="{ 'disabled-form': !newLesson.moduleId }">
                        <div class="form-group">
                            <label for="lesson-name">Nome da Aula</label>
                            <input type="text" id="lesson-name" class="input-text" v-model="newLesson.name" placeholder="Ex: Conceitos Básicos" :disabled="!newLesson.moduleId" />
                        </div>
                        <div class="form-group half-width-group">
                            <div class="half-group">
                                <label for="content-type">Tipo de Conteúdo</label>
                                <select id="content-type" class="input-select" v-model="newLesson.contentType" :disabled="!newLesson.moduleId">
                                    <option value="Video">Vídeo</option>
                                    <option value="Text">Texto</option>
                                    <option value="PDF">PDF</option>
                                </select>
                            </div>
                            <div class="half-group">
                                <label for="duration">Duração (minutos)</label>
                                <input type="number" id="duration" class="input-text" v-model.number="newLesson.duration" placeholder="15" min="1" :disabled="!newLesson.moduleId" />
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="content-link">Link do Conteúdo</label>
                            <input type="url" id="content-link" class="input-text" v-model="newLesson.contentLink" placeholder="https://..." :disabled="!newLesson.moduleId" />
                        </div>
                        <div class="form-group release-status-group">
                            <div class="release-group">
                                <label for="release">Liberação</label>
                                <select id="release" class="input-select" v-model="newLesson.releaseType" :disabled="!newLesson.moduleId">
                                    <option value="Imediata">Imediata</option>
                                    <option value="Agendada">Agendada</option>
                                </select>
                            </div>
                            <div class="status-group">
                                <label for="status">Status</label>
                                <div class="toggle-switch-container">
                                    <span class="toggle-label">{{ newLesson.isActive ? 'Ativa' : 'Inativa' }}</span>
                                    <label class="toggle-switch">
                                        <input type="checkbox" v-model="newLesson.isActive" :disabled="!newLesson.moduleId">
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="modal-actions">
                            <button class="btn btn-save-lesson" @click="saveNewLesson" :disabled="!newLesson.moduleId || !newLesson.name">Salvar Aula</button>
                            <button class="btn btn-cancel" @click="closeNewLessonModal">Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="isPreviewModalOpen" class="modal-overlay preview-overlay">
                <div class="student-preview-app">
                    <button class="btn btn-close-preview" @click="closePreviewModal">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        Voltar aos Cursos
                    </button>
                    <div v-if="previewCourse.id" class="preview-grid">
                        <div class="course-sidebar">
                            <div class="course-header">
                                <span class="back-link" @click="closePreviewModal">← Voltar aos Cursos</span>
                                <h3 class="course-title">{{ previewCourse.name }}</h3>
                            </div>
                            <div class="course-progress">
                                <p class="progress-text">3 de {{ totalLessons }} aulas concluídas</p>
                                <div class="progress-bar-container">
                                    <div class="progress-bar" :style="{ width: '25%' }"></div>
                                </div>
                                <p class="progress-percentage">25%</p>
                            </div>
                            <div class="course-modules-nav">
                                <div 
                                    v-for="module in filteredModulesForPreview" 
                                    :key="module.id" 
                                    class="nav-module"
                                >
                                    <div class="nav-module-header">
                                        <span class="module-title-nav">{{ module.title }}</span>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevron-icon"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </div>
                                    <ul class="nav-lessons-list">
                                        <li 
                                            v-for="(lesson, index) in filteredLessonsForModule(module.id)" 
                                            :key="lesson.id" 
                                            class="nav-lesson-item"
                                            :class="{ 'active-lesson': module.id === 101 && index === 1, 'completed-lesson': module.id === 101 && index === 0 }"
                                        >
                                            <div class="lesson-info">
                                                <span class="lesson-number">{{ index + 1 }}.</span>
                                                <span class="lesson-name">{{ lesson.name }}</span>
                                                <span class="lesson-duration">{{ lesson.duration }}min</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <p class="unlock-tip">Complete todas as aulas para desbloquear seu certificado Zenix.</p>
                        </div>
                        <div class="course-content">
                            <div class="content-header">
                                <h2 class="lesson-title">O que é Copy Trading e como funciona na prática</h2>
                                <p class="lesson-meta">
                                    Duração: 8m20s <span class="status-dot"></span> Em andamento
                                </p>
                                <div class="completion-bar"></div>
                            </div>
                            <div class="video-player">
                                <span class="zenix-logo">ZENIX</span>
                                <h1 class="video-placeholder-text">Copy Trading Video Lesson</h1>
                            </div>
                            <div class="content-actions">
                                <div class="action-buttons">
                                    <button class="btn btn-action-download">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                        Baixar material da aula
                                    </button>
                                    <button class="btn btn-action-complete">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f1013" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        Marcar como concluída
                                    </button>
                                    <span class="btn-action-replay">Assistir novamente</span>
                                </div>
                            </div>
                            <div class="complementary-materials">
                                <h3>Materiais Complementares</h3>
                                <ul class="materials-list">
                                    <li>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00ff7f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                                        PDF: Estratégia de Copy Trading
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <p v-else class="list-placeholder">Selecione e salve um curso para ver o preview.</p>
                </div>
            </div>
        </main>
    </div>
</template>
<script>
import AppSidebar from '../../components/Sidebar.vue';
export default {
    name: 'AcademyManagementView',
    components: {
        AppSidebar
    },
    data() {
        return {
            // Layout
            isSidebarOpen: true, 
            isSidebarCollapsed: false,
            // Curso
            course: {
                name: 'Fundamentos do Copy Trading',
                description: 'Aprenda do zero as estratégias mais avançadas para Day Trade.',
                coverImage: null, 
                coverImagePreview: null, 
                selectedCourseId: 1,
            },
            // Preview
            isPreviewModalOpen: false,
            previewCourse: {},
            // Cursos
            courses: [
                { id: 1, name: 'Fundamentos do Copy Trading', description: 'Aprenda do zero as estratégias mais avançadas para Day Trade.' },
                { id: 2, name: 'Fundamentos de Marketing', description: 'Aprenda os conceitos básicos de marketing digital e SEO.' },
            ],
            // Modal Módulo
            isNewModuleModalOpen: false,
            newModule: {
                courseId: null, 
                name: '',
                shortDescription: ''
            },
            // Modal Aula
            isNewLessonModalOpen: false,
            newLesson: {
                moduleId: null, 
                name: '',
                contentType: 'Video',
                duration: 15,
                contentLink: '',
                releaseType: 'Imediata',
                isActive: true
            },
            // Dados
            modules: [
                { id: 101, courseId: 1, title: 'Módulo 1 - Introdução', status: 'published' },
                { id: 102, courseId: 1, title: 'Módulo 2 - Primeiros Passos', status: 'published' },
                { id: 103, courseId: 1, title: 'Módulo 3 - Estratégias Avançadas', status: 'published' },
                { id: 201, courseId: 2, title: 'Módulo A: Branding Básico', status: 'published' },
            ],
            lessons: [
                { id: 1001, moduleId: 101, name: 'Boas-vindas ao Zenix', contentType: 'Video', duration: 4.5, isActive: true },
                { id: 1002, moduleId: 101, name: 'O que é Copy Trading', contentType: 'Video', duration: 8.2, isActive: true },
                { id: 1003, moduleId: 101, name: 'Criando sua conta Deriv', contentType: 'Video', duration: 7.4, isActive: true }, 
                { id: 1004, moduleId: 102, name: 'Ajuste de Parâmetros', contentType: 'Video', duration: 15, isActive: true }, 
                { id: 1005, moduleId: 103, name: 'Alavancagem Inteligente', contentType: 'Video', duration: 20, isActive: true }, 
                { id: 1006, moduleId: 103, name: 'Análise de Risco', contentType: 'Text', duration: 5, isActive: true }, 
                { id: 2001, moduleId: 201, name: 'Aula A.1: Identidade Visual', contentType: 'Video', duration: 8, isActive: true },
            ]
        };
    },
    mounted() {
        this.loadCourseDetails(); 
    },
    computed: {
        filteredModules() {
            return this.modules.filter(module => module.courseId === this.course.selectedCourseId);
        },
        filteredModulesForPreview() {
            return this.modules.filter(module => module.courseId === this.previewCourse.id && module.status === 'published');
        },
        selectedModuleForLesson() {
            const moduleInModal = this.modules.find(module => module.id === this.newLesson.moduleId);
            return moduleInModal || {};
        },
        totalLessons() {
            return this.lessons.filter(lesson => 
                this.filteredModulesForPreview.some(mod => mod.id === lesson.moduleId)
            ).length;
        }
    },
    methods: {
        getLessonCountForModule(moduleId) {
            return this.lessons.filter(lesson => lesson.moduleId === moduleId).length;
        },
        filteredLessonsForModule(moduleId) {
            return this.lessons.filter(lesson => lesson.moduleId === moduleId && lesson.isActive);
        },
        // Layout
        toggleSidebarCollapse() {
            this.isSidebarCollapsed = !this.isSidebarCollapsed;
        },
        // Curso
        loadCourses() {
            console.log('Lista de cursos atualizada.');
        },
        loadCourseDetails() {
            const courseId = this.course.selectedCourseId;
            if (courseId === null || courseId === '') {
                this.course.name = '';
                this.course.description = '';
                this.course.coverImage = null; 
                this.course.coverImagePreview = null; 
                return;
            }
            const selectedCourse = this.courses.find(c => c.id === courseId);
            if (selectedCourse) {
                this.course.name = selectedCourse.name;
                this.course.description = selectedCourse.description;
                this.course.coverImage = null; 
                this.course.coverImagePreview = null; 
            }
        },
        handleCoverUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.course.coverImage = file;
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.course.coverImagePreview = e.target.result;
                };
                reader.readAsDataURL(file);
            } else {
                this.course.coverImage = null;
                this.course.coverImagePreview = null;
            }
        },
        saveCourse() {
            if (!this.course.name || this.course.name.trim() === '') {
                alert('O nome do curso é obrigatório.');
                return;
            }
            if (this.course.selectedCourseId !== null && this.course.selectedCourseId !== '') {
                const existingCourseIndex = this.courses.findIndex(c => c.id === this.course.selectedCourseId);
                if (existingCourseIndex !== -1) {
                    this.courses[existingCourseIndex].name = this.course.name;
                    this.courses[existingCourseIndex].description = this.course.description;
                    console.log('Curso editado:', this.courses[existingCourseIndex]);
                }
            } 
            else {
                const newCourseId = Date.now(); 
                const newCourseObject = {
                    id: newCourseId,
                    name: this.course.name,
                    description: this.course.description,
                };
                this.courses.push(newCourseObject);
                this.course.selectedCourseId = newCourseId;
                this.loadCourseDetails(); 
                console.log('Novo Curso Criado e Selecionado:', newCourseObject);
            }
            alert('Curso salvo com sucesso!');
        },
        // Preview
        openPreviewModal() {
            if (!this.course.selectedCourseId) {
                alert('Selecione um curso para ver o preview.');
                return;
            }
            const currentCourseData = this.courses.find(c => c.id === this.course.selectedCourseId);
            this.previewCourse = {
                ...currentCourseData,
                id: this.course.selectedCourseId,
                name: this.course.name,
                description: this.course.description,
                coverImagePreview: this.course.coverImagePreview,
            };
            this.isPreviewModalOpen = true;
        },
        closePreviewModal() {
            this.isPreviewModalOpen = false;
            this.previewCourse = {};
        },
        // Módulo
        openNewModuleModal(courseId) {
            this.isNewModuleModalOpen = true;
            this.newModule = { 
                courseId: courseId || this.course.selectedCourseId, 
                name: '', 
                shortDescription: '' 
            }; 
        },
        closeNewModuleModal() {
            this.isNewModuleModalOpen = false;
        },
        saveNewModule() {
            if (!this.newModule.courseId || !this.newModule.name) {
                alert('O curso e o nome do módulo são obrigatórios.');
                return;
            }
            const newModuleObject = {
                id: Date.now() + Math.random(),
                courseId: this.newModule.courseId,
                title: this.newModule.name, 
                status: 'draft' 
            };
            this.modules.push(newModuleObject);
            this.closeNewModuleModal();
            alert(`Módulo "${newModuleObject.title}" adicionado com sucesso!`);
        },
        // Aula
        openNewLessonModal(moduleId = null) {
            this.isNewLessonModalOpen = true;
            this.newLesson = { 
                moduleId: moduleId,
                name: '',
                contentType: 'Video',
                duration: 15,
                contentLink: '',
                releaseType: 'Imediata',
                isActive: true
            };
        },
        closeNewLessonModal() {
            this.isNewLessonModalOpen = false;
        },
        saveNewLesson() {
            if (!this.newLesson.moduleId || !this.newLesson.name) {
                alert('O módulo e o nome da aula são obrigatórios.');
                return;
            }
            const newLessonObject = {
                id: Date.now() + Math.random(),
                moduleId: this.newLesson.moduleId,
                name: this.newLesson.name,
                contentType: this.newLesson.contentType,
                duration: this.newLesson.duration,
                isActive: this.newLesson.isActive,
            };
            this.lessons.push(newLessonObject);
            this.closeNewLessonModal();
            alert(`Aula "${this.newLesson.name}" salva no módulo com sucesso!`);
        }
    }
}
</script>
<style src="../../assets/css/views/admin/AcademyManagementView.css"></style>