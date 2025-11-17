<template>
    <div class="layout" ref="layoutContainer">
        <AppSidebar
            :is-open="isSidebarOpen"
            :is-collapsed="isSidebarCollapsed"
            @toggle-collapse="toggleSidebarCollapse"
        />
        <main class="layout-content" :class="{ 'sidebar-collapsed': isSidebarCollapsed, 'sidebar-closed': !isSidebarOpen }">
            <button class="hamburger-btn" @click="toggleSidebar" aria-label="Abrir menu">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
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
                            <input type="text" id="course-name" class="input-text" v-model="course.name" placeholder="Ex: Mestre do Day Trade" />
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
                            <textarea id="course-description" class="input-textarea" v-model="course.description" placeholder="Descreva o que os alunos aprenderão neste curso."></textarea>
                        </div>
                    </section>
                    <section class="card modules-section">
                        <h2 class="card-title">Módulos e Aulas</h2>
                        <p class="card-subtitle">Selecione o curso, adicione módulos e crie aulas dentro de cada módulo.</p>
                        <div class="form-group course-selection-group">
                            <label for="select-course">Selecionar Curso</label>
                            <div class="input-with-icon">
                                <select id="select-course" class="input-select" v-model="course.selectedCourseId" @change="loadCourseDetails">
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
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4V20M4 12H20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                    Novo Módulo
                                </button>
                            </div>
                            <div v-for="module in filteredModules" :key="module.id" class="module-block">
                                <div class="module-header">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="drag-handle"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                                    <span class="module-title-list">
                                        Módulo {{ module.id.toString().slice(-2) }}: {{ module.title.split(' - ')[1] || module.title }}
                                    </span>
                                    <div class="module-actions module-btn-group">
                                        <button class="btn btn-action-icon edit-btn" title="Editar Módulo">Editar</button>
                                        <button class="btn btn-action-icon delete-btn" title="Excluir Módulo">Excluir</button>
                                        <button class="btn btn-secondary add-lesson-btn" title="Adicionar Nova Aula" @click="openNewLessonModal(module.id)">+ Adicionar Aula</button>
                                    </div>
                                </div>
                                <ul class="lesson-list">
                                    <li v-for="lesson in filteredLessonsForModule(module.id, true)" :key="lesson.id" class="lesson-item">
                                        <div class="lesson-info">
                                            <svg v-if="lesson.contentType === 'Video'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lesson-icon video-icon"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                                            <svg v-else-if="lesson.contentType === 'Text' || lesson.contentType === 'PDF'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lesson-icon document-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                                            <span class="lesson-name">{{ lesson.name }}</span>
                                            <span class="lesson-duration">{{ lesson.duration }} min</span>
                                            <span
                                                :class="['status-tag', lesson.isActive ? 'active-tag' : 'inactive-tag']"
                                            >
                                                {{ lesson.isActive ? 'Ativa' : 'Oculta' }}
                                            </span>
                                        </div>
                                        
                                        <div class="lesson-actions lesson-btn-group desktop-actions">
                                            <button class="btn btn-action-icon edit-btn" title="Editar Aula">
                                                <img src="../../assets/icons/edit-academy.svg" alt="" filter="invert(1)" width="16" height="16">
                                            </button>
                                            <button class="btn btn-action-icon delete-btn" title="Excluir Aula">
                                                <img src="../../assets/icons/trash.svg" alt="" width="16" height="16">
                                            </button>
                                            <div class="materials-group">
                                                <button class="btn btn-materials" title="Gerenciar Materiais" @click="openMaterialsModal(lesson.id)">Materiais</button>
                                            </div>
                                        </div>

                                        <div class="lesson-actions-mobile">
                                            <button class="btn btn-action-icon more-options-btn" @click.stop="toggleLessonDropdown(lesson.id)">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                                            </button>

                                            <div v-if="openLessonDropdown === lesson.id" class="lesson-dropdown-menu">
                                                <button class="dropdown-item edit-btn" title="Editar Aula">
                                                    <img src="../../assets/icons/edit-academy.svg" alt="" filter="invert(1)" width="16" height="16"> Editar
                                                </button>
                                                <button class="dropdown-item delete-btn" title="Excluir Aula">
                                                    <img src="../../assets/icons/trash.svg" alt="" width="16" height="16"> Excluir
                                                </button>
                                                <button class="dropdown-item btn-materials" title="Gerenciar Materiais" @click="openMaterialsModal(lesson.id); openLessonDropdown = null">Materiais</button>
                                            </div>
                                        </div>
                                        
                                    </li>
                                </ul>
                            </div>
                            <p v-if="!course.selectedCourseId" class="list-placeholder">Selecione um curso para visualizar ou adicionar módulos.</p>
                            <p v-else-if="filteredModules.length === 0" class="list-placeholder">Nenhum módulo encontrado. Clique em "Novo Módulo" para começar.</p>
                        </div>
                    </section>
                    <section class="card class-acess">
                        <h2 class="card-title"> Acesso & Preço</h2>
                        <form action="#">
                            <div class="form-group">
                                <label for="acess">Modelo de Acesso</label>
                                <select id="acess" class="input-select" v-model="course.access">
                                    <option value="1">Pago</option>
                                    <option value="2">Gratuito</option>
                                    <option value="3">Convidado</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="price">Preço</label>
                                <input type="number" id="price" class="input-text" v-model.number="course.price" placeholder="R$ 0,00" />
                            </div>
                            <div class="form-group">
                                <label for="currency">Moeda</label>
                                <select id="currency" class="input-select" v-model="course.currency">
                                    <option value="R$">BRL</option>
                                    <option value="USD">USD</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="subscription">Plano de Assinatura</label>
                                <select id="subscription" class="input-select" v-model="course.subscription">
                                    <option value="1" disabled>Nenhum</option>
                                    <option value="2">Premium</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="discount">Desconto</label>
                                <select id="discount" class="input-select" v-model="course.discount">
                                    <option value="0" disabled>Sem desconto</option>
                                    <option value="1">ZENIX50</option>
                                </select>
                            </div>
                        </form>
                    </section>
                    <section class="card class-acess">
                        <h2 class="card-title">Publicação & Visibilidade</h2>
                        <form action="#">
                            <div class="form-group">
                                <label for="status">Status</label>
                                <select id="status" class="input-select" v-model="course.status">
                                    <option value="draft">Rascunho</option>
                                    <option value="published">Publicado</option>
                                    <option value="archived">Arquivado</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="available-from">Disponível de</label>
                                <input type="date" id="available-from" class="input-text" v-model="course.availableFrom" />
                            </div>
                            <div class="form-group">
                                <label for="available-until">Disponível até</label>
                                <input type="date" id="available-until" class="input-text" v-model="course.availableUntil" />
                            </div>
                            <div class="form-group">
                                <label for="visibility">Visibilidade</label>
                                <select id="visibility" class="input-select" v-model="course.visibility">
                                    <option value="public">Público</option>
                                    <option value="private">Privado</option>
                                    <option value="restricted">Restrito (por plano)</option>
                                </select>
                            </div>
                        </form>
                    </section>
                    <section class="card seo-sharing-section">
                        <h2 class="card-title">SEO & Compartilhamento</h2>
                        <div class="form-group">
                            <label for="slug">Slug/URL</label>
                            <input type="text" id="slug" class="input-text" v-model="course.slug" placeholder="Ex: mestre-do-day-trade" />
                        </div>
                        <div class="form-group">
                            <label for="seo-title">Título SEO</label>
                            <input type="text" id="seo-title" class="input-text" v-model="course.seoTitle" placeholder="Ex: Curso Mestre do Day Trade | Zenix Academy" />
                        </div>
                        <div class="form-group">
                            <label for="seo-description">Descrição SEO</label>
                            <textarea id="seo-description" class="input-textarea" v-model="course.seoDescription" placeholder="Descreva o curso para motores de busca..."></textarea>
                        </div>
                        <div class="form-group">
                            <label for="keywords">Palavras-chave</label>
                            <div class="keywords-input-container">
                                <div class="keyword-tags">
                                    <span v-for="(keyword, index) in course.keywords" :key="index" class="keyword-tag">
                                        {{ keyword }}
                                        <button @click="removeKeyword(index)" class="btn-remove-keyword">×</button>
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    id="keywords"
                                    class="input-text"
                                    v-model="newKeyword"
                                    placeholder="Adicionar palavra-chave e pressionar Enter"
                                    @keyup.enter="addKeyword"
                                />
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="social-image">Imagem para compartilhamento social</label>
                            <div class="social-image-upload-area">
                                <input
                                    type="file"
                                    ref="socialImageFileInput"
                                    @change="handleSocialImageUpload"
                                    accept="image/*"
                                    style="display: none;"
                                />
                                <div class="cover-upload-area seo-cover-area">
                                    <div
                                        class="upload-placeholder social-image-upload-area upload-image"
                                        @click="$refs.socialImageFileInput.click()"
                                        :class="{ 'hidden-on-preview': course.socialImagePreview }"
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="17 8 12 3 7 8"></polyline>
                                            <line x1="12" y1="3" x2="12" y2="15"></line>
                                        </svg>
                                        <span>Enviar imagem</span>
                                    </div>
                                    
                                    <div class="social-image-preview-box">
                                        <img
                                            v-if="course.socialImagePreview"
                                            :src="course.socialImagePreview"
                                            alt="Prévia da Imagem Social"
                                            class="social-image-preview"
                                        />
                                        <span v-else>Preview Social</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <AcademyModals
                :is-new-module-modal-open="isNewModuleModalOpen"
                :is-new-lesson-modal-open="isNewLessonModalOpen"
                :is-materials-modal-open="isMaterialsModalOpen"
                :selected-lesson-id-for-materials="selectedLessonIdForMaterials"
                :selected-lesson-for-materials="selectedLessonForMaterials"
                :courses="courses"
                :modules="modules"
                :lessons="lessons"
                :materials-list="materialsList"
                :new-module="newModule"
                :new-lesson="newLesson"
                :new-material="newMaterial"
                @close-new-module-modal="closeNewModuleModal"
                @close-new-lesson-modal="closeNewLessonModal"
                @close-materials-modal="closeMaterialsModal"
                @save-new-module="saveNewModule"
                @save-new-lesson="saveNewLesson"
                @save-new-material="saveNewMaterial"
                @delete-material="deleteMaterial"
                @update:new-module="newModule = $event"
                @update:new-lesson="newLesson = $event"
                @update:new-material="newMaterial = $event"
            />

            <StudentPreview
                v-if="isPreviewModalOpen"
                :course-data="previewCourse"
                :modules="modules"
                :lessons="lessons"
                :materials-list="materialsList"
                @close="closePreviewModal"
            />
        </main>
    </div>
</template>
<script>
import AppSidebar from '../../components/Sidebar.vue';
import StudentPreview from '../../components/StudentPreview.vue';
import AcademyModals from '../../components/modals/AcademyModals.vue'; 

export default {
    name: 'AcademyManagementView',
    components: {
        AppSidebar,
        StudentPreview,
        AcademyModals 
    },
    data() {
        return {
            // Layout
            isSidebarOpen: true, // Será ajustado em mounted/checkScreenSize
            isSidebarCollapsed: false,
            openLessonDropdown: null,
            // ... (Restante do seu estado 'course', 'isPreviewModalOpen', 'courses', etc.)
            course: {
                name: 'Fundamentos do Copy Trading',
                description: 'Aprenda do zero as estratégias mais avançadas para Day Trade.',
                coverImage: null,
                coverImagePreview: null,
                selectedCourseId: 1, 
                access: "1", 
                price: 0, 
                currency: "R$", 
                subscription: "1", 
                discount: "0", 
                slug: 'mestre-do-day-trade', 
                seoTitle: 'Curso Mestre do Day Trade | Zenix Academy', 
                seoDescription: 'Aprenda as melhores estratégias de day trade com a Zenix.', 
                keywords: ['trading'], 
                socialImage: null, 
                socialImagePreview: null, 
            },
            // Preview
            isPreviewModalOpen: false,
            previewCourse: {},
            // Cursos (Simulação)
            courses: [
                { id: 1, name: 'Fundamentos do Copy Trading', description: 'Aprenda do zero as estratégias mais avançadas para Day Trade.' },
                { id: 2, name: 'Fundamentos de Marketing', description: 'Aprenda os conceitos básicos de marketing digital e SEO.' },
            ],
            // Novo estado para palavras-chave e imagem social
            newKeyword: '', 
            isSocialPreviewModalOpen: false, 
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
            // Modal Materiais
            isMaterialsModalOpen: false,
            selectedLessonIdForMaterials: null,
            selectedLessonForMaterials: {},
            materialsList: [ 
                { id: 1, lessonId: 1003, name: 'PDF: Estratégia de Copy Trading', type: 'PDF', link: '#' },
                { id: 2, lessonId: 1004, name: 'Checklist de Setup', type: 'DOC', link: '#' },
                { id: 3, lessonId: 1004, name: 'Planilha de Risco (Excel)', type: 'XLS', link: '#' },
                { id: 4, lessonId: 1006, name: 'Ebook: Gestão de Capital', type: 'PDF', link: '#' },
                { id: 5, lessonId: 1006, name: 'Slides da Aula', type: 'PPT', link: '#' },
                { id: 6, lessonId: 1006, name: 'Teste de Conhecimento (Link)', type: 'LINK', link: '#' },
                { id: 7, lessonId: 1002, name: 'Artigo: Análise de Candlesticks', type: 'LINK', link: '#' },
            ],
            newMaterial: { 
                name: '',
                type: 'PDF',
                link: ''
            },
            // Dados (Simulação do Backend)
            modules: [
                { id: 101, courseId: 1, title: 'Módulo 1 - Introdução ao Mercado', status: 'published' },
                { id: 102, courseId: 1, title: 'Módulo 2 - Estratégias Avançadas', status: 'published' },
                { id: 103, courseId: 1, title: 'Módulo 3 - Gestão de Risco', status: 'published' },
                { id: 201, courseId: 2, title: 'Módulo A: Branding Básico', status: 'published' },
            ],
            lessons: [
                { id: 1001, moduleId: 101, name: 'Conceitos Básicos do Trading', contentType: 'Video', duration: 15, isActive: true },
                { id: 1002, moduleId: 101, name: 'Análise Técnica Básica', contentType: 'Text', duration: 22, isActive: false },
                { id: 1003, moduleId: 101, name: 'Escolha de Ativos', contentType: 'Video', duration: 7, isActive: true },
                { id: 1004, moduleId: 102, name: 'Estratégia Zenix Pro', contentType: 'Video', duration: 28, isActive: true },
                { id: 1005, moduleId: 103, name: 'Controle de Stop Loss', contentType: 'Video', duration: 12, isActive: true },
                { id: 1006, moduleId: 103, name: 'Simulação de Mercado', contentType: 'PDF', duration: 5, isActive: true },
                { id: 2001, moduleId: 201, name: 'Aula A.1: Identidade Visual', contentType: 'Video', duration: 8, isActive: true },
            ]
        };
    },
    mounted() {
        this.loadCourseDetails();
        document.addEventListener('click', this.closeLessonDropdown);
        
        // ** INÍCIO: LÓGICA DO HAMBÚRGUER/RESPONSIVIDADE **
        this.checkScreenSize();
        window.addEventListener('resize', this.checkScreenSize);
        // ** FIM: LÓGICA DO HAMBÚRGUER/RESPONSIVIDADE **
    },
    beforeUnmount() {
        document.removeEventListener('click', this.closeLessonDropdown);
        
        // ** INÍCIO: LÓGICA DO HAMBÚRGUER/RESPONSIVIDADE **
        window.removeEventListener('resize', this.checkScreenSize);
        // ** FIM: LÓGICA DO HAMBÚRGUER/RESPONSIVIDADE **
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
                this.filteredModulesForPreview.some(mod => mod.id === lesson.moduleId) && lesson.isActive
            ).length;
        }
    },
    methods: {
        // ** INÍCIO: MÉTODOS DO HAMBÚRGUER/RESPONSIVIDADE **
        checkScreenSize() {
            // Define a Sidebar como fechada (mobile/tablet) ou aberta (desktop)
            if (window.innerWidth <= 1024) { 
                this.isSidebarOpen = false; 
            } else {
                this.isSidebarOpen = true; 
            }
        },
        toggleSidebar() {
            // Alterna a abertura no clique do botão hambúrguer
            this.isSidebarOpen = !this.isSidebarOpen;
            // Opcional: Garante que o sidebar não fique colapsado quando aberto no mobile
            if (this.isSidebarCollapsed && this.isSidebarOpen) {
                this.isSidebarCollapsed = false;
            }
        },
        // ** FIM: MÉTODOS DO HAMBÚRGUER/RESPONSIVIDADE **

        getMaterialCountForLesson(lessonId) {
            // Retorna a contagem de materiais para a aula específica
            return this.materialsList.filter(m => m.lessonId === lessonId).length;
        },
        filteredLessonsForModule(moduleId, includeInactive) {
            if (includeInactive) {
                return this.lessons.filter(lesson => lesson.moduleId === moduleId);
            } else {
                return this.lessons.filter(lesson => lesson.moduleId === moduleId && lesson.isActive);
            }
        },
        // Layout
        toggleSidebarCollapse() {
            this.isSidebarCollapsed = !this.isSidebarCollapsed;
        },
        // ... (Restante dos seus métodos 'loadCourses', 'loadCourseDetails', 'handleCoverUpload', 'saveCourse', etc.)
        toggleLessonDropdown(lessonId) {
            this.openLessonDropdown = this.openLessonDropdown === lessonId ? null : lessonId;
        },
        // Método para fechar o dropdown ao clicar fora (opcional, mas recomendado)
        closeLessonDropdown(event) {
            if (!event.target.closest('.lesson-item')) {
                this.openLessonDropdown = null;
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
            // Cria um objeto com todos os dados do curso, incluindo SEO
            const courseDataToSave = {
                id: this.course.selectedCourseId,
                name: this.course.name,
                description: this.course.description,
                slug: this.course.slug,
                seoTitle: this.course.seoTitle,
                seoDescription: this.course.seoDescription,
                keywords: [...this.course.keywords], // Copia o array
                // ... outros campos como access, price, etc., se necessário
            };
            if (this.course.selectedCourseId !== null && this.course.selectedCourseId !== '') {
                const existingCourseIndex = this.courses.findIndex(c => c.id === this.course.selectedCourseId);
                if (existingCourseIndex !== -1) {
                    // Atualiza o curso existente
                    this.courses[existingCourseIndex] = { ...this.courses[existingCourseIndex], ...courseDataToSave };
                    console.log('Curso editado:', this.courses[existingCourseIndex]);
                }
            } else {
                // Cria um novo curso
                const newCourseId = Date.now();
                const newCourseObject = {
                    id: newCourseId,
                    ...courseDataToSave,
                };
                this.courses.push(newCourseObject);
                this.course.selectedCourseId = newCourseId;
                this.loadCourseDetails();
                console.log('Novo Curso Criado e Selecionado:', newCourseObject);
            }
            alert('Curso salvo com sucesso!');
        },
        // SEO & Compartilhamento
        addKeyword() {
            if (this.newKeyword.trim()) {
                this.course.keywords.push(this.newKeyword.trim());
                this.newKeyword = ''; // Limpa o campo
            }
        },
        removeKeyword(index) {
            this.course.keywords.splice(index, 1);
        },
        handleSocialImageUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.course.socialImage = file;
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.course.socialImagePreview = e.target.result;
                };
                reader.readAsDataURL(file);
            } else {
                this.course.socialImage = null;
                this.course.socialImagePreview = null;
            }
        },
        openSocialPreviewModal() {
            alert('Funcionalidade de Preview Social ainda não implementada.');
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
                title: `Módulo ${this.modules.filter(m => m.courseId === this.newModule.courseId).length + 1} - ${this.newModule.name}`,
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
        },
        // Materiais
        openMaterialsModal(lessonId) {
            this.selectedLessonIdForMaterials = lessonId;
            this.selectedLessonForMaterials = this.lessons.find(l => l.id === lessonId);
            this.isMaterialsModalOpen = true;
            this.newMaterial = { name: '', type: 'PDF', link: '' }; // Limpa o formulário
        },
        closeMaterialsModal() {
            this.isMaterialsModalOpen = false;
            this.selectedLessonIdForMaterials = null;
            this.selectedLessonForMaterials = {};
        },
        saveNewMaterial() {
            if (!this.newMaterial.name || !this.newMaterial.link) {
                alert('O nome e o link do material são obrigatórios.');
                return;
            }
            const newMaterialObject = {
                id: Date.now() + Math.random(),
                lessonId: this.selectedLessonIdForMaterials,
                name: this.newMaterial.name,
                type: this.newMaterial.type,
                link: this.newMaterial.link
            };
            this.materialsList.push(newMaterialObject);
            this.newMaterial = { name: '', type: 'PDF', link: '' };
            alert(`Material "${newMaterialObject.name}" adicionado com sucesso!`);
        },
        deleteMaterial(materialId) {
            if (confirm('Tem certeza que deseja excluir este material?')) {
                const index = this.materialsList.findIndex(m => m.id === materialId);
                if (index !== -1) {
                    this.materialsList.splice(index, 1);
                    alert('Material excluído.');
                }
            }
        },
        loadCourseDetails() {
            const courseId = this.course.selectedCourseId;
            if (!courseId) {
                this.course.name = '';
                this.course.description = '';
                this.course.coverImage = null;
                this.course.coverImagePreview = null;
                // Reseta os campos de acesso & preço
                this.course.access = "1";
                this.course.price = 0;
                this.course.currency = "R$";
                this.course.subscription = "1";
                this.course.discount = "0";
                // Reseta os campos de SEO & Compartilhamento
                this.course.slug = '';
                this.course.seoTitle = '';
                this.course.seoDescription = '';
                this.course.keywords = [];
                this.course.socialImage = null;
                this.course.socialImagePreview = null;
                return;
            }
            const selectedCourse = this.courses.find(c => c.id === courseId);
            if (selectedCourse) {
                this.course.name = selectedCourse.name;
                this.course.description = selectedCourse.description;
                this.course.coverImage = null;
                this.course.coverImagePreview = null;
                // Carrega os campos de SEO & Compartilhamento do curso selecionado
                this.course.slug = selectedCourse.slug || '';
                this.course.seoTitle = selectedCourse.seoTitle || '';
                this.course.seoDescription = selectedCourse.seoDescription || '';
                this.course.keywords = [...(selectedCourse.keywords || [])]; // Copia o array
                this.course.socialImage = null;
                this.course.socialImagePreview = null;
            }
        },
        loadCourses() {
            console.log('Lista de cursos atualizada. (Simulação)');
        },
    },
}
</script>
<style src="../../assets/css/views/admin/AcademyManagementView.css"></style>