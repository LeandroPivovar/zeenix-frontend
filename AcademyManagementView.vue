<!-- AcademyManagementView.vue -->
<template>
    <div class="layout" ref="layoutContainer">
        <AppSidebar
            :is-open="isSidebarOpen"
            :is-collapsed="isSidebarCollapsed"
            @toggle-collapse="toggleSidebarCollapse"
        />
        <main class="layout-content" :class="{ 'sidebar-collapsed': isSidebarCollapsed, 'sidebar-closed': !isSidebarOpen }">
            <div class="container">
                <header class="page-header">
                    <div class="header-info">
                        <h1 class="page-title">Zenix Academy - Gestão de Cursos</h1>
                        <p class="page-subtitle">Crie e organize cursos, módulos, aulas e materiais para o aluno.</p>
                    </div>
                    <div class="header-actions">
                        <button class="btn btn-secondary" @click="goBack">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Voltar
                        </button>
                        <button class="btn btn-save" @click="saveCourse">Salvar Curso</button>
                        <button class="btn btn-preview" @click="openPreviewModal" :disabled="!course.selectedCourseId || course.selectedCourseId === 'new'">
                            Preview do Aluno
                        </button>
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
                        <div class="form-group course-selection-group" v-if="!course.selectedCourseId || course.selectedCourseId === 'new'">
                            <label for="select-course">Selecionar Curso</label>
                            <div class="input-with-icon">
                                <select id="select-course" class="input-select" v-model="course.selectedCourseId" @change="handleCourseSelection">
                                    <option :value="null">Escolha um curso...</option>
                                    <option value="new">+ Criar Novo Curso</option>
                                    <option v-for="c in courses" :key="c.id" :value="c.id">{{ c.name }}</option>
                                </select>
                                <button class="btn btn-icon" title="Atualizar Lista" @click="loadCourses">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 4.2C17.3 1.5 13.8 0 10 0C4.5 0 0 4.5 0 10C0 15.5 4.5 20 10 20C13.5 20 16.6 18.2 18.5 15.4L16.7 13.6C15.2 16.1 12.8 17.6 10 17.6C5.9 17.6 2.4 14.1 2.4 10C2.4 5.9 5.9 2.4 10 2.4C12.8 2.4 15.2 3.9 16.7 6.4L13 10H20V4.2Z" fill="currentColor"/></svg>
                                    Atualizar Lista
                                </button>
                            </div>
                        </div>
                        <div v-else class="form-group course-selection-group">
                            <label>Curso Selecionado</label>
                            <div class="selected-course-info">
                                <strong>{{ course.name || 'Novo Curso' }}</strong>
                                <button class="btn btn-link" @click="goBack">Voltar para lista</button>
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
                                        <div class="lesson-actions lesson-btn-group">
                                            <button class="btn btn-action-icon edit-btn" title="Editar Aula">
                                                <img src="../../assets/icons/edit-academy.svg" alt="" filter="invert(1)" width="16" height="16">
                                            </button>
                                            <button class="btn btn-action-icon delete-btn" title="Excluir Aula">
                                                <img src="../../assets/icons/trash.svg" alt="" width="16" height="16">
                                            </button>
                                            <div class="materials-group">
                                                <span class="material-count">{{ getMaterialCountForLesson(lesson.id) }}</span>
                                                <button class="btn btn-materials" title="Gerenciar Materiais" @click="openMaterialsModal(lesson.id)">Materiais</button>
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
                    <!-- Nova Seção: SEO & Compartilhamento -->
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
                                <div class="cover-upload-area">
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

            <!-- Componente de Modais -->
            <AcademyModals
                :is-new-module-modal-open="isNewModuleModalOpen"
                :is-new-lesson-modal-open="isNewLessonModalOpen"
                :is-materials-modal-open="isMaterialsModalOpen"
                :selected-lesson-id-for-materials="selectedLessonIdForMaterials"
                :selected-lesson-for-materials="selectedLessonForMaterials"
                :courses="courses"
                :modules="modules"
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

            <!-- Componente StudentPreview substitui a div antiga do preview -->
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
        AcademyModals // Registre o novo componente
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
                selectedCourseId: null,
                status: 'draft',
                visibility: 'public',
                // Campos adicionados para "Acesso & Preço"
                access: "1",           // Valor padrão para Modelo de Acesso
                price: 0,              // Valor padrão para Preço
                currency: "R$",        // Valor padrão para Moeda
                subscription: "1",     // Valor padrão para Plano de Assinatura
                discount: "0",         // Valor padrão para Desconto
                // Campos adicionados para "SEO & Compartilhamento"
                slug: 'mestre-do-day-trade', // Slug/URL
                seoTitle: 'Curso Mestre do Day Trade | Zenix Academy', // Título SEO
                seoDescription: 'Aprenda as melhores estratégias de day trade com a Zenix.', // Descrição SEO
                keywords: ['trading'], // Palavras-chave
                socialImage: null, // Imagem para compartilhamento social
                socialImagePreview: null, // Prévia da imagem para compartilhamento
            },
            // Preview
            isPreviewModalOpen: false,
            previewCourse: {},
            // Cursos
            courses: [],
            // Novo estado para palavras-chave e imagem social
            newKeyword: '', // Para o input de palavras-chave
            isSocialPreviewModalOpen: false, // Para o modal de preview social (opcional)
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
            materialsList: [],
            newMaterial: { // Estado para o formulário de novo material
                name: '',
                type: 'PDF',
                link: ''
            },
            // Dados do Backend
            modules: [],
            lessons: []
        };
    },
    async mounted() {
        // Verifica se há um ID na rota
        const courseId = this.$route.params.id;
        if (courseId) {
            if (courseId === 'new') {
                // Modo de criação de novo curso
                this.course.selectedCourseId = null;
                this.course.name = '';
                this.course.description = '';
                // Reseta todos os campos
                this.resetCourseFields();
            } else {
                this.course.selectedCourseId = courseId;
            }
        }
        await this.loadCourses();
        if (this.course.selectedCourseId && this.course.selectedCourseId !== 'new') {
            await this.loadCourseDetails();
        }
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
        goBack() {
            this.$router.push({ name: 'AcademyCoursesList' });
        },
        resetCourseFields() {
            this.course.access = "1";
            this.course.price = 0;
            this.course.currency = "R$";
            this.course.subscription = "1";
            this.course.discount = "0";
            this.course.status = "draft";
            this.course.visibility = "public";
            this.course.slug = '';
            this.course.seoTitle = '';
            this.course.seoDescription = '';
            this.course.keywords = [];
            this.course.coverImage = null;
            this.course.coverImagePreview = null;
            this.course.socialImage = null;
            this.course.socialImagePreview = null;
            this.course.availableFrom = '';
            this.course.availableUntil = '';
            this.modules = [];
            this.lessons = [];
        },
        // Curso
        handleCourseSelection() {
            if (this.course.selectedCourseId === 'new') {
                this.resetCourseFields();
                this.course.selectedCourseId = null;
            } else if (this.course.selectedCourseId) {
                this.loadCourseDetails();
            }
        },
        async loadCourses() {
            try {
                const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                const response = await fetch(`${apiBaseUrl}/courses`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    this.courses = data.map(c => ({
                        id: c.id,
                        name: c.name || c.title,
                        title: c.title,
                        description: c.description,
                        slug: c.slug,
                        seoTitle: c.seoTitle,
                        seoDescription: c.seoDescription,
                        keywords: c.keywords || [],
                    }));
                } else {
                    console.error('Erro ao carregar cursos:', response.statusText);
                }
            } catch (error) {
                console.error('Erro ao carregar cursos:', error);
            }
        },
        async loadCourseDetails() {
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
                this.modules = [];
                this.lessons = [];
                return;
            }
            try {
                const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                const response = await fetch(`${apiBaseUrl}/courses/${courseId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const courseData = await response.json();
                    // Atualiza dados do curso
                    this.course.name = courseData.name || courseData.title;
                    this.course.description = courseData.description;
                    this.course.coverImagePreview = courseData.coverImage || courseData.imagePlaceholder;
                    this.course.slug = courseData.slug || '';
                    this.course.seoTitle = courseData.seoTitle || '';
                    this.course.seoDescription = courseData.seoDescription || '';
                    this.course.keywords = courseData.keywords || [];
                    this.course.socialImagePreview = courseData.socialImage;
                    this.course.access = courseData.access || "1";
                    this.course.price = courseData.price || 0;
                    this.course.currency = courseData.currency || "R$";
                    this.course.subscription = courseData.subscription || "1";
                    this.course.discount = courseData.discount || "0";
                    this.course.status = courseData.status || "draft";
                    this.course.availableFrom = courseData.availableFrom ? courseData.availableFrom.split('T')[0] : '';
                    this.course.availableUntil = courseData.availableUntil ? courseData.availableUntil.split('T')[0] : '';
                    this.course.visibility = courseData.visibility || "public";
                    // Atualiza módulos e aulas
                    if (courseData.modules) {
                        this.modules = courseData.modules.map(m => ({
                            id: m.id,
                            courseId: m.courseId,
                            title: m.title,
                            shortDescription: m.shortDescription,
                            status: m.status,
                            orderIndex: m.orderIndex,
                        }));
                        this.lessons = courseData.modules.flatMap(m => 
                            (m.lessons || []).map(l => ({
                                id: l.id,
                                moduleId: l.moduleId,
                                name: l.name || l.title,
                                title: l.title,
                                contentType: l.contentType || 'Video',
                                duration: l.duration,
                                isActive: l.isActive !== undefined ? l.isActive : true,
                            }))
                        );
                    }
                } else {
                    console.error('Erro ao carregar detalhes do curso:', response.statusText);
                }
            } catch (error) {
                console.error('Erro ao carregar detalhes do curso:', error);
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
        async saveCourse() {
            if (!this.course.name || this.course.name.trim() === '') {
                this.$root.$toast.error('O nome do curso é obrigatório.');
                return;
            }
            try {
                const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                const courseDataToSave = {
                    title: this.course.name,
                    description: this.course.description,
                    slug: this.course.slug,
                    seoTitle: this.course.seoTitle,
                    seoDescription: this.course.seoDescription,
                    keywords: this.course.keywords,
                    coverImage: this.course.coverImagePreview,
                    socialImage: this.course.socialImagePreview,
                    access: this.course.access,
                    price: this.course.price,
                    currency: this.course.currency,
                    subscription: this.course.subscription,
                    discount: this.course.discount,
                    status: this.course.status,
                    availableFrom: this.course.availableFrom || null,
                    availableUntil: this.course.availableUntil || null,
                    visibility: this.course.visibility,
                };
                let response;
                if (this.course.selectedCourseId) {
                    // Atualiza curso existente
                    response = await fetch(`${apiBaseUrl}/courses/${this.course.selectedCourseId}`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(courseDataToSave),
                    });
                } else {
                    // Cria novo curso
                    response = await fetch(`${apiBaseUrl}/courses`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(courseDataToSave),
                    });
                }
                if (response.ok) {
                    const savedCourse = await response.json();
                    if (!this.course.selectedCourseId || this.course.selectedCourseId === 'new') {
                        this.course.selectedCourseId = savedCourse.id;
                        // Atualiza a rota com o ID real
                        this.$router.replace({ name: 'AcademyManagement', params: { id: savedCourse.id } });
                    }
                    await this.loadCourses();
                    await this.loadCourseDetails();
                    this.$root.$toast.success('Curso salvo com sucesso!');
                } else {
                    const error = await response.json().catch(() => ({ message: 'Erro ao salvar curso' }));
                    this.$root.$toast.error(`Erro ao salvar curso: ${error.message}`);
                }
            } catch (error) {
                console.error('Erro ao salvar curso:', error);
                this.$root.$toast.info('Erro ao salvar curso. Verifique sua conexão.');
            }
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
            this.$root.$toast.info('Funcionalidade de Preview Social ainda não implementada.');
            // Aqui você poderia abrir um modal ou redirecionar para uma página de visualização.
        },
        // Preview
        openPreviewModal() {
            if (!this.course.selectedCourseId) {
                this.$root.$toast.info('Selecione um curso para ver o preview.');
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
        async saveNewModule() {
            if (!this.newModule.courseId || !this.newModule.name) {
                this.$root.$toast.error('O curso e o nome do módulo são obrigatórios.');
                return;
            }
            try {
                const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                const moduleCount = this.modules.filter(m => m.courseId === this.newModule.courseId).length;
                const response = await fetch(`${apiBaseUrl}/courses/modules`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        courseId: this.newModule.courseId,
                        title: `Módulo ${moduleCount + 1} - ${this.newModule.name}`,
                        shortDescription: this.newModule.shortDescription,
                        status: 'draft',
                        orderIndex: moduleCount,
                    }),
                });
                if (response.ok) {
                    await this.loadCourseDetails();
                    this.closeNewModuleModal();
                    this.$root.$toast.success(`Módulo adicionado com sucesso!`);
                } else {
                    const error = await response.json().catch(() => ({ message: 'Erro ao criar módulo' }));
                    this.$root.$toast.error(`Erro ao criar módulo: ${error.message}`);
                }
            } catch (error) {
                console.error('Erro ao criar módulo:', error);
                this.$root.$toast.info('Erro ao criar módulo. Verifique sua conexão.');
            }
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
        async saveNewLesson() {
            if (!this.newLesson.moduleId || !this.newLesson.name) {
                this.$root.$toast.error('O módulo e o nome da aula são obrigatórios.');
                return;
            }
            try {
                const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                const module = this.modules.find(m => m.id === this.newLesson.moduleId);
                if (!module) {
                    this.$root.$toast.info('Módulo não encontrado.');
                    return;
                }
                const response = await fetch(`${apiBaseUrl}/courses/lessons`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        courseId: module.courseId,
                        moduleId: this.newLesson.moduleId,
                        title: this.newLesson.name,
                        contentType: this.newLesson.contentType,
                        contentLink: this.newLesson.contentLink,
                        releaseType: this.newLesson.releaseType,
                        isActive: this.newLesson.isActive,
                        duration: `${this.newLesson.duration} min`,
                    }),
                });
                if (response.ok) {
                    await this.loadCourseDetails();
                    this.closeNewLessonModal();
                    this.$root.$toast.success(`Aula "${this.newLesson.name}" salva com sucesso!`);
                } else {
                    const error = await response.json().catch(() => ({ message: 'Erro ao criar aula' }));
                    this.$root.$toast.error(`Erro ao criar aula: ${error.message}`);
                }
            } catch (error) {
                console.error('Erro ao criar aula:', error);
                this.$root.$toast.info('Erro ao criar aula. Verifique sua conexão.');
            }
        },
        // Materiais
        async openMaterialsModal(lessonId) {
            this.selectedLessonIdForMaterials = lessonId;
            this.selectedLessonForMaterials = this.lessons.find(l => l.id === lessonId);
            this.isMaterialsModalOpen = true;
            this.newMaterial = { name: '', type: 'PDF', link: '' };
            // Carrega materiais da aula
            await this.loadMaterialsForLesson(lessonId);
        },
        closeMaterialsModal() {
            this.isMaterialsModalOpen = false;
            this.selectedLessonIdForMaterials = null;
            this.selectedLessonForMaterials = {};
        },
        async loadMaterialsForLesson(lessonId) {
            try {
                const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                const response = await fetch(`${apiBaseUrl}/courses/lessons/${lessonId}/materials`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const materials = await response.json();
                    this.materialsList = this.materialsList.filter(m => m.lessonId !== lessonId);
                    materials.forEach(m => {
                        this.materialsList.push({
                            id: m.id,
                            lessonId: m.lessonId,
                            name: m.name,
                            type: m.type,
                            link: m.link,
                        });
                    });
                }
            } catch (error) {
                console.error('Erro ao carregar materiais:', error);
            }
        },
        async saveNewMaterial() {
            if (!this.newMaterial.name || !this.newMaterial.link) {
                this.$root.$toast.error('O nome e o link do material são obrigatórios.');
                return;
            }
            try {
                const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                const response = await fetch(`${apiBaseUrl}/courses/materials`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        lessonId: this.selectedLessonIdForMaterials,
                        name: this.newMaterial.name,
                        type: this.newMaterial.type,
                        link: this.newMaterial.link,
                    }),
                });
                if (response.ok) {
                    const materialName = this.newMaterial.name;
                    this.newMaterial = { name: '', type: 'PDF', link: '' };
                    await this.loadMaterialsForLesson(this.selectedLessonIdForMaterials);
                    this.$root.$toast.success(`Material "${materialName}" adicionado com sucesso!`);
                } else {
                    const error = await response.json().catch(() => ({ message: 'Erro ao criar material' }));
                    this.$root.$toast.error(`Erro ao criar material: ${error.message}`);
                }
            } catch (error) {
                console.error('Erro ao criar material:', error);
                this.$root.$toast.info('Erro ao criar material. Verifique sua conexão.');
            }
        },
        async deleteMaterial(materialId) {
            if (confirm('Tem certeza que deseja excluir este material?')) {
                try {
                    const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                    const response = await fetch(`${apiBaseUrl}/courses/materials/${materialId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    if (response.ok) {
                        const index = this.materialsList.findIndex(m => m.id === materialId);
                        if (index !== -1) {
                            this.materialsList.splice(index, 1);
                        }
                        this.$root.$toast.success('Material excluído.');
                    } else {
                        this.$root.$toast.info('Erro ao excluir material.');
                    }
                } catch (error) {
                    console.error('Erro ao excluir material:', error);
                    this.$root.$toast.info('Erro ao excluir material.');
                }
            }
        }
    }
}
</script>
<style src="../../assets/css/views/admin/AcademyManagementView.css"></style>