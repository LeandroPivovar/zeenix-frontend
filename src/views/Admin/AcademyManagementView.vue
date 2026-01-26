<template>
    <div class="dashboard-layout" ref="layoutContainer">
        <div v-if="isSidebarOpen && isMobile" class="sidebar-overlay" @click="isSidebarOpen = false"></div>
        
        <AppSidebar :is-open="isSidebarOpen" :is-collapsed="isSidebarCollapsed" :is-mobile="isMobile" @toggle-collapse="toggleSidebarCollapse" @close-sidebar="isSidebarOpen = false" @open-settings="showSettingsModal = true" />
        
        <div class="dashboard-content-wrapper" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
            <TopNavbar 
                :is-sidebar-collapsed="isSidebarCollapsed"
                @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
                @toggle-sidebar-collapse="toggleSidebarCollapse"
                @open-settings="showSettingsModal = true"
            />

            <main class="layout-content">
                <div class="container">
                <header class="page-header">
                    <div class="header-info">
                        <h1 class="page-title" color="white" style="font-size: 20px;">Zenix Academy - Gestão de Cursos</h1>
                        <p class="page-subtitle" style="font-size: 14px;">Crie e organize cursos, módulos, aulas e materiais para o aluno.</p>
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
                        <p class="card-subtitle">Adicione módulos e crie aulas dentro de cada módulo para o curso <strong>{{ course.name || 'Novo Curso' }}</strong>.</p>
                        <div class="modules-list-container">
                            <div class="list-header">
                                <h3 class="list-title">Módulos do Curso Selecionado</h3>
                                <button
                                    class="btn btn-primary"
                                    title="Adicionar Novo Módulo"
                                    @click="openNewModuleModal(course.selectedCourseId || $route.params.id)"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4V20M4 12H20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                    Novo Módulo
                                </button>
                            </div>
                            <div v-for="module in filteredModules" :key="module.id" class="module-block">
                                <div class="module-header">
                                    <div class="module-reorder-btns">
                                        <button class="btn-reorder" @click="moveModule(module, -1)" :disabled="filteredModules.indexOf(module) === 0">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>
                                        </button>
                                        <button class="btn-reorder" @click="moveModule(module, 1)" :disabled="filteredModules.indexOf(module) === filteredModules.length - 1">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
                                        </button>
                                    </div>
                                    <span class="module-title-list">
                                        Módulo {{ module.id.toString().slice(-2) }}: {{ module.title.split(' - ')[1] || module.title }}
                                    </span>
                                    <div class="module-actions module-btn-group">
                                        <button class="btn btn-action-icon edit-btn" title="Editar Módulo" @click="openEditModule(module)">Editar</button>
                                        <button class="btn btn-action-icon delete-btn" title="Excluir Módulo" @click="requestDeleteModule(module)">Excluir</button>
                                        <button class="btn btn-secondary add-lesson-btn" title="Adicionar Nova Aula" @click="openNewLessonModal(module.id)">+ Adicionar Aula</button>
                                    </div>
                                </div>
                                <ul class="lesson-list">
                                    <li v-for="lesson in filteredLessonsForModule(module.id, true)" :key="lesson.id" class="lesson-item">
                                        <div class="lesson-info">
                                            <button 
                                                class="btn-star" 
                                                :class="{ 'active': lesson.isDerivTutorial }" 
                                                @click.stop="toggleDerivTutorial(lesson)"
                                                title="Definir como Tutorial Deriv da Home"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                                </svg>
                                            </button>
                                            <svg v-if="lesson.contentType === 'Video'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lesson-icon video-icon"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                                            <svg v-else-if="lesson.contentType === 'Text' || lesson.contentType === 'PDF'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lesson-icon document-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                                            <span class="lesson-name">{{ lesson.name }}</span>
                                            <div class="lesson-reorder-btns">
                                                <button class="btn-reorder-small" @click="moveLesson(module.id, lesson, -1)" :disabled="filteredLessonsForModule(module.id, true).indexOf(lesson) === 0">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>
                                                </button>
                                                <button class="btn-reorder-small" @click="moveLesson(module.id, lesson, 1)" :disabled="filteredLessonsForModule(module.id, true).indexOf(lesson) === filteredLessonsForModule(module.id, true).length - 1">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
                                                </button>
                                            </div>
                                            <span class="lesson-duration">{{ lesson.duration }} min</span>
                                            <span
                                                :class="['status-tag', lesson.isActive ? 'active-tag' : 'inactive-tag']"
                                            >
                                                {{ lesson.isActive ? 'Ativa' : 'Oculta' }}
                                            </span>
                                        </div>
                                        
                                        <div class="lesson-actions lesson-btn-group desktop-actions">
                                            <button class="btn btn-action-icon edit-btn" title="Editar Aula" @click="openEditLesson(lesson)">
                                                <img src="../../assets/icons/edit-academy.svg" alt="" filter="invert(1)" width="16" height="16">
                                            </button>
                                            <button class="btn btn-action-icon delete-btn" title="Excluir Aula" @click="openDeleteLesson(lesson)">
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
                                                <button class="dropdown-item edit-btn" title="Editar Aula" @click="openEditLesson(lesson)">
                                                    <img src="../../assets/icons/edit-academy.svg" alt="" filter="invert(1)" width="16" height="16"> Editar
                                                </button>
                                                <button class="dropdown-item delete-btn" title="Excluir Aula" @click="openDeleteLesson(lesson)">
                                                    <img src="../../assets/icons/trash.svg" alt="" width="16" height="16"> Excluir
                                                </button>
                                                <button class="dropdown-item btn-materials" title="Gerenciar Materiais" @click="openMaterialsModal(lesson.id); openLessonDropdown = null">Materiais</button>
                                            </div>
                                        </div>
                                        
                                    </li>
                                </ul>
                            </div>
                            <p v-if="filteredModules.length === 0" class="list-placeholder">Nenhum módulo encontrado. Clique em "Novo Módulo" para começar.</p>
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
                </div>
            </div>

            <AcademyModals
                :is-new-module-modal-open="isNewModuleModalOpen"
                :is-new-lesson-modal-open="isNewLessonModalOpen"
                :is-delete-lesson-modal-open="isDeleteLessonModalOpen"
                :lesson-to-delete="lessonToDelete"
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
                :is-saving-lesson="isSavingLesson"
                @close-new-module-modal="closeNewModuleModal"
                @close-new-lesson-modal="closeNewLessonModal"
                @close-delete-lesson-modal="closeDeleteLessonModal"
                @confirm-delete-lesson="confirmDeleteLesson"
                @close-materials-modal="closeMaterialsModal"
                @save-new-module="saveNewModule"
                @save-new-lesson="saveNewLesson"
                @save-new-material="saveNewMaterial"
                @edit-material="openEditMaterial"
                @cancel-edit-material="cancelEditMaterial"
                @delete-material="requestDeleteMaterial"
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

            <!-- Settings Modal -->
            <SettingsSidebar
                :is-open="showSettingsModal"
                @close="showSettingsModal = false"
            />
            
            <!-- Confirm Modal -->
            <ConfirmActionModal
                :visible="confirmModalData.visible"
                :title="confirmModalData.title"
                :message="confirmModalData.message"
                confirm-text="Sim, excluir"
                cancel-text="Cancelar"
                @confirm="handleConfirmAction"
                @cancel="confirmModalData.visible = false"
            />
            </main>
        </div>
    </div>
</template>
<script>
import AppSidebar from '../../components/Sidebar.vue';
import TopNavbar from '../../components/TopNavbar.vue';
import SettingsSidebar from '../../components/SettingsSidebar.vue';
import StudentPreview from '../../components/StudentPreview.vue';
import AcademyModals from '../../components/modals/AcademyModals.vue'; 
import ConfirmActionModal from '../../components/modals/ConfirmActionModal.vue'; 

export default {
    name: 'AcademyManagementView',
    components: {
        AppSidebar,
        TopNavbar,
        SettingsSidebar,
        StudentPreview,
        AcademyModals,
        ConfirmActionModal,
    },
    data() {
        return {
            // Layout
            isSidebarOpen: true, // Será ajustado em mounted/checkScreenSize
            isSidebarCollapsed: false,
            isMobile: false,
            showSettingsModal: false,
            openLessonDropdown: null,
            // ... (Restante do seu estado 'course', 'isPreviewModalOpen', 'courses', etc.)
            course: {
                name: 'Fundamentos do Copy Trading',
                description: 'Aprenda do zero as estratégias mais avançadas para Day Trade.',
                    coverImagePath: '',
                coverImagePreview: null,
                selectedCourseId: null,
                status: 'draft',
                visibility: 'public', 
                access: "1", 
                price: 0, 
                currency: "R$", 
                subscription: "1", 
                discount: "0", 
            },
            // Preview
            isPreviewModalOpen: false,
            previewCourse: {},
            // Cursos
            courses: [],
            // Modal Módulo
            isNewModuleModalOpen: false,
            newModule: {
                courseId: null,
                name: '',
                shortDescription: ''
            },
            // Modal Aula
            isNewLessonModalOpen: false,
            isSavingLesson: false,
            newLesson: {
                id: null,
                moduleId: null,
                name: '',
                contentType: 'Video',
                duration: 15,
                contentLink: '',
                releaseType: 'Imediata',
                isActive: true,
                videoFile: null,
                videoPath: '',
                videoFileName: '',
                videoSource: 'upload'
            },
            isDeleteLessonModalOpen: false,
            lessonToDelete: null,
            // Modal Materiais
            isMaterialsModalOpen: false,
            selectedLessonIdForMaterials: null,
            selectedLessonForMaterials: {},
            materialsList: [],
            newMaterial: { 
                name: '',
                type: 'PDF',
                link: ''
            },
            
            // Modal de Confirmação
            confirmModalData: {
                visible: false,
                title: '',
                message: '',
                confirmAction: null
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
                // Curso já está selecionado via rota
                this.course.selectedCourseId = courseId;
                await this.loadCourseDetails();
            }
        } else {
            // Se não há ID na rota, redireciona para lista
            this.$router.push({ name: 'AcademyCoursesList' });
            return;
        }
        await this.loadCourses();
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
            const courseId = this.course.selectedCourseId || this.$route.params.id;
            const isNewCourse = courseId === 'new' || courseId === null || !courseId;
            // Se for curso novo, mostra módulos locais. Se não, filtra por courseId
            if (isNewCourse) {
                return this.modules.filter(module => module.isLocal || module.courseId === 'temp');
            }
            return this.modules.filter(module => module.courseId === courseId);
        },
        filteredModulesForPreview() {
            const courseId = this.previewCourse.id || this.course.selectedCourseId || this.$route.params.id;
            return this.modules.filter(
                module => module.courseId === courseId && module.status !== 'archived'
            );
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
            this.isMobile = window.innerWidth < 1024;
            if (this.isMobile) { 
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
        async handleCoverUpload(event) {
            const file = event.target.files[0];
            if (!file) {
                this.course.coverImagePath = '';
                this.course.coverImagePreview = null;
                return;
            }
            this.course.coverImagePath = '';
            this.generateLocalImagePreview(file, 'coverImagePreview');
            const uploadedPath = await this.uploadCourseImage(file, 'cover');
            if (uploadedPath) {
                this.course.coverImagePath = uploadedPath;
            } else {
                this.course.coverImagePreview = null;
            }
            event.target.value = '';
        },
        async saveCourse() {
            if (!this.course.name || this.course.name.trim() === '') {
                this.$root.$toast.error('O nome do curso é obrigatório.');
                return;
            }
            
            const isNewCourse = !this.course.selectedCourseId || this.course.selectedCourseId === 'new' || this.$route.params.id === 'new';
            
            try {
                const apiBaseUrl = this.getApiBaseUrl();
                // Não envia imagens base64 se forem muito grandes (apenas URLs ou null)
                const courseDataToSave = {
                    title: this.course.name,
                    description: this.course.description,
                    coverImage: this.course.coverImagePath || null,
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
                let savedCourse;
                
                // Salva o curso
                if (this.course.selectedCourseId && !isNewCourse) {
                    response = await fetch(`${apiBaseUrl}/courses/${this.course.selectedCourseId}`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(courseDataToSave),
                    });
                } else {
                    response = await fetch(`${apiBaseUrl}/courses`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(courseDataToSave),
                    });
                }
                
                if (!response.ok) {
                    const error = await response.json().catch(() => ({ message: 'Erro ao salvar curso' }));
                    this.$root.$toast.error(`Erro ao salvar curso: ${error.message}`);
                    return;
                }
                
                savedCourse = await response.json();
                const courseId = savedCourse.id;

                // ATUALIZAÇÃO: Salva também módulos e aulas existentes para persistir a nova ordem
                const existingModules = this.modules.filter(m => !m.isLocal);
                for (let i = 0; i < existingModules.length; i++) {
                    const module = existingModules[i];
                    await fetch(`${apiBaseUrl}/courses/modules/${module.id}`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            orderIndex: i
                        }),
                    });

                    const moduleLessons = this.lessons.filter(l => l.moduleId === module.id && !l.isLocal);
                    for (let j = 0; j < moduleLessons.length; j++) {
                        const lesson = moduleLessons[j];
                        await fetch(`${apiBaseUrl}/courses/lessons/${lesson.id}`, {
                            method: 'PUT',
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                orderIndex: j
                            }),
                        });
                    }
                }
                
                // Se for curso novo, salva módulos, aulas e materiais locais
                if (isNewCourse) {
                    // Salva módulos locais
                    const localModules = this.modules.filter(m => m.isLocal);
                    for (let i = 0; i < localModules.length; i++) {
                        const module = localModules[i];
                        try {
                            const moduleResponse = await fetch(`${apiBaseUrl}/courses/modules`, {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    courseId: courseId,
                                    title: module.title,
                                    shortDescription: module.shortDescription,
                                    status: module.status || 'draft',
                                    orderIndex: i,
                                }),
                            });
                            
                            if (moduleResponse.ok) {
                                const savedModule = await moduleResponse.json();
                                // Guarda o ID temporário antes de atualizar
                                const tempModuleId = module.id;
                                
                                // Atualiza o ID do módulo local com o ID real
                                module.id = savedModule.id;
                                module.courseId = courseId;
                                module.isLocal = false;
                                
                                // Salva aulas locais deste módulo (usa o ID temporário do módulo)
                                const moduleLessons = this.lessons.filter(l => {
                                    // Encontra aulas que pertencem a este módulo pelo ID temporário
                                    return l.isLocal && l.moduleId === tempModuleId;
                                });
                                for (let j = 0; j < moduleLessons.length; j++) {
                                    const lesson = moduleLessons[j];
                                    // Guarda o ID temporário da aula antes de salvar
                                    const tempLessonId = lesson.id;
                                    try {
                                        const lessonResponse = await fetch(`${apiBaseUrl}/courses/lessons`, {
                                            method: 'POST',
                                            headers: {
                                                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({
                                                courseId: courseId,
                                                moduleId: savedModule.id,
                                                title: lesson.name || lesson.title,
                                                contentType: lesson.contentType || 'Video',
                                                contentLink: lesson.contentLink || '',
                                                releaseType: lesson.releaseType || 'Imediata',
                                                isActive: lesson.isActive !== undefined ? lesson.isActive : true,
                                                duration: lesson.duration || '15 min',
                                                videoUrl: lesson.videoUrl || '',
                                            }),
                                        });
                                        
                                        if (lessonResponse.ok) {
                                            const savedLesson = await lessonResponse.json();
                                            lesson.id = savedLesson.id;
                                            lesson.moduleId = savedModule.id;
                                            lesson.courseId = courseId;
                                            lesson.isLocal = false;
                                            
                                            // Salva materiais locais desta aula
                                            const lessonMaterials = this.materialsList.filter(m => m.lessonId === tempLessonId && m.isLocal);
                                            for (let k = 0; k < lessonMaterials.length; k++) {
                                                const material = lessonMaterials[k];
                                                try {
                                                    const materialResponse = await fetch(`${apiBaseUrl}/courses/materials`, {
                                                        method: 'POST',
                                                        headers: {
                                                            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
                                                            'Content-Type': 'application/json',
                                                        },
                                                        body: JSON.stringify({
                                                            lessonId: savedLesson.id,
                                                            name: material.name,
                                                            type: material.type,
                                                            link: material.link,
                                                        }),
                                                    });
                                                    
                                                    if (materialResponse.ok) {
                                                        const savedMaterial = await materialResponse.json();
                                                        material.id = savedMaterial.id;
                                                        material.lessonId = savedLesson.id;
                                                        material.isLocal = false;
                                                    }
                                                } catch (error) {
                                                    console.error(`Erro ao salvar material ${material.name}:`, error);
                                                }
                                            }
                                        }
                                    } catch (error) {
                                        console.error(`Erro ao salvar aula ${lesson.name}:`, error);
                                    }
                                }
                            }
                        } catch (error) {
                            console.error(`Erro ao salvar módulo ${module.title}:`, error);
                        }
                    }
                }
                
                // Atualiza estado e rota
                this.course.selectedCourseId = courseId;
                if (isNewCourse) {
                    this.$router.replace({ name: 'AcademyManagement', params: { id: courseId } });
                }
                
                await this.loadCourses();
                await this.loadCourseDetails();
                this.$root.$toast.success('Curso e todos os módulos/aulas salvos com sucesso!');
            } catch (error) {
                console.error('Erro ao salvar curso:', error);
                this.$root.$toast.info('Erro ao salvar curso. Verifique sua conexão.');
            }
        },
        moveModule(module, direction) {
            const index = this.modules.indexOf(module);
            const newIndex = index + direction;
            if (newIndex >= 0 && newIndex < this.modules.length) {
                const temp = this.modules[index];
                this.modules[index] = this.modules[newIndex];
                this.modules[newIndex] = temp;
                // Força reatividade
                this.modules = [...this.modules];
            }
        },
        moveLesson(moduleId, lesson, direction) {
            const moduleLessons = this.lessons.filter(l => l.moduleId === moduleId);
            const index = moduleLessons.indexOf(lesson);
            const newIndex = index + direction;

            if (newIndex >= 0 && newIndex < moduleLessons.length) {
                // Encontra os índices reais no array principal 'lessons'
                const actualIndex = this.lessons.indexOf(lesson);
                const otherLesson = moduleLessons[newIndex];
                const actualOtherIndex = this.lessons.indexOf(otherLesson);

                // Troca as posições
                const temp = this.lessons[actualIndex];
                this.lessons[actualIndex] = this.lessons[actualOtherIndex];
                this.lessons[actualOtherIndex] = temp;
                
                // Força reatividade
                this.lessons = [...this.lessons];
            }
        },
        async toggleDerivTutorial(lesson) {
            // Optimistic update
            const newState = !lesson.isDerivTutorial;
            
            // Reset all locally
            this.lessons.forEach(l => l.isDerivTutorial = false);
            
            // Set clicked one
            lesson.isDerivTutorial = newState;
            
            try {
                const apiBaseUrl = this.getApiBaseUrl();
                const response = await fetch(`${apiBaseUrl}/courses/lessons/${lesson.id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        isDerivTutorial: lesson.isDerivTutorial
                    }),
                });

                if (!response.ok) {
                    throw new Error('Falha ao atualizar');
                }
                
                this.$root.$toast.success(lesson.isDerivTutorial ? 'Definido como Tutorial Deriv' : 'Removido de Tutorial Deriv');
            } catch (error) {
                console.error(error);
                this.$root.$toast.error('Erro ao atualizar. Revertendo...');
                await this.loadCourseDetails();
            }
        },
        getApiBaseUrl() {
            return process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
        },
        resolveImageUrl(path) {
            if (!path) {
                return null;
            }
            if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
                return path;
            }
            if (path.startsWith('/')) {
                return `${this.getApiBaseUrl()}${path}`;
            }
            return path;
        },
        generateLocalImagePreview(file, targetProperty) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.course[targetProperty] = e.target.result;
            };
            reader.readAsDataURL(file);
        },
        async uploadCourseImage(file, type = 'cover') {
            try {
                const apiBaseUrl = this.getApiBaseUrl();
                const formData = new FormData();
                formData.append('file', file);
                const headers = {};
                const token = localStorage.getItem('token');
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
                const response = await fetch(`${apiBaseUrl}/courses/upload/${type}`, {
                    method: 'POST',
                    headers,
                    body: formData,
                });
                if (!response.ok) {
                    const error = await response.json().catch(() => ({ message: 'Erro no upload da imagem.' }));
                    throw new Error(error.message || 'Erro no upload da imagem.');
                }
                const data = await response.json();
                return data.path;
            } catch (error) {
                console.error('Erro ao enviar imagem:', error);
                this.$root.$toast.info('Não foi possível enviar a imagem. Tente novamente.');
                return null;
            }
        },
        async uploadLessonVideo(file) {
            try {
                const apiBaseUrl = this.getApiBaseUrl();
                const formData = new FormData();
                formData.append('file', file);
                const headers = {};
                const token = localStorage.getItem('token');
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
                const response = await fetch(`${apiBaseUrl}/courses/lessons/upload/video`, {
                    method: 'POST',
                    headers,
                    body: formData,
                });
                if (!response.ok) {
                    const error = await response.json().catch(() => ({ message: 'Erro no upload de vídeo' }));
                    this.$root.$toast.error(error.message || 'Erro no upload de vídeo.');
                    return null;
                }
                const data = await response.json();
                return data.path;
            } catch (error) {
                console.error('Erro ao enviar vídeo da aula:', error);
                this.$root.$toast.info('Erro ao enviar vídeo da aula. Verifique sua conexão.');
                return null;
            }
        },
        async uploadMaterialFile(file) {
            try {
                const apiBaseUrl = this.getApiBaseUrl();
                const formData = new FormData();
                formData.append('file', file);
                const headers = {};
                const token = localStorage.getItem('token');
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
                const response = await fetch(`${apiBaseUrl}/courses/lessons/upload/material`, {
                    method: 'POST',
                    headers,
                    body: formData,
                });
                if (!response.ok) {
                    const error = await response.json().catch(() => ({ message: 'Erro no upload de material' }));
                    this.$root.$toast.error(error.message || 'Erro no upload de material.');
                    return null;
                }
                const data = await response.json();
                return data.path;
            } catch (error) {
                console.error('Erro ao enviar material da aula:', error);
                this.$root.$toast.info('Erro ao enviar material da aula. Verifique sua conexão.');
                return null;
            }
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
            console.log('🔍 [AcademyManagement] Abrindo modal de novo módulo', { courseId, selectedCourseId: this.course.selectedCourseId, routeId: this.$route.params.id });
            this.isNewModuleModalOpen = true;
            // Pega o courseId da rota, do curso selecionado, ou do parâmetro passado
            const currentCourseId = courseId || this.course.selectedCourseId || this.$route.params.id;
            this.newModule = {
                courseId: currentCourseId === 'new' ? null : currentCourseId,
                name: '',
                shortDescription: ''
            };
            console.log('🔍 [AcademyManagement] Modal aberto, newModule:', this.newModule);
        },
        closeNewModuleModal() {
            this.isNewModuleModalOpen = false;
        },
        async saveNewModule() {
            console.log('🔍 [AcademyManagement] Salvando módulo', this.newModule);
            if (!this.newModule.name) {
                this.$root.$toast.error('O nome do módulo é obrigatório.');
                return;
            }

            const isNewCourse = !this.course.selectedCourseId || this.course.selectedCourseId === 'new' || this.$route.params.id === 'new';
            const isEditing = !!this.newModule.id;
            console.log('🔍 [AcademyManagement] É curso novo?', isNewCourse, 'Editando?', isEditing, { selectedCourseId: this.course.selectedCourseId, routeId: this.$route.params.id });
            
            // Se for curso novo ou módulo local, lida localmente
            if (isNewCourse || (isEditing && this.newModule.id.toString().startsWith('temp-module-'))) {
                if (isEditing) {
                    const index = this.modules.findIndex(m => m.id === this.newModule.id);
                    if (index !== -1) {
                        // Atualiza o módulo existente preservando o prefixo "Módulo X - " se necessário ou gerando novo
                        const currentTitle = this.modules[index].title;
                        const match = currentTitle.match(/^Módulo (\d+) - /);
                        const prefix = match ? `Módulo ${match[1]} - ` : '';
                        
                        this.modules[index].title = `${prefix}${this.newModule.name}`;
                        this.modules[index].shortDescription = this.newModule.shortDescription || '';
                        this.$root.$toast.success(`Módulo "${this.newModule.name}" atualizado localmente.`);
                    }
                } else {
                    const moduleCount = this.modules.filter(m => m.isLocal || m.courseId === 'temp').length;
                    const tempModuleId = `temp-module-${Date.now()}-${Math.random()}`;
                    const newModuleObject = {
                        id: tempModuleId,
                        courseId: 'temp', 
                        title: `Módulo ${moduleCount + 1} - ${this.newModule.name}`,
                        shortDescription: this.newModule.shortDescription || '',
                        status: 'draft',
                        orderIndex: moduleCount,
                        isLocal: true,
                    };
                    console.log('🔍 [AcademyManagement] Adicionando módulo local:', newModuleObject);
                    this.modules.push(newModuleObject);
                    this.$root.$toast.success(`Módulo "${this.newModule.name}" adicionado localmente.`);
                }
                this.closeNewModuleModal();
                return;
            }

            // Se o curso já existe e não é módulo local, salva no backend
            const courseId = this.course.selectedCourseId || this.$route.params.id;
            try {
                const apiBaseUrl = this.getApiBaseUrl();
                let response;
                
                if (isEditing) {
                    // Busca o módulo atual para manter o índice/título original se possível
                    const currentModule = this.modules.find(m => m.id === this.newModule.id);
                    const match = currentModule?.title?.match(/^Módulo (\d+) - /);
                    const prefix = match ? `Módulo ${match[1]} - ` : '';

                    response = await fetch(`${apiBaseUrl}/courses/modules/${this.newModule.id}`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            title: `${prefix}${this.newModule.name}`,
                            shortDescription: this.newModule.shortDescription,
                            status: currentModule?.status || 'draft',
                        }),
                    });
                } else {
                    const moduleCount = this.modules.filter(m => m.courseId === courseId && !m.isLocal).length;
                    response = await fetch(`${apiBaseUrl}/courses/modules`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            courseId: courseId,
                            title: `Módulo ${moduleCount + 1} - ${this.newModule.name}`,
                            shortDescription: this.newModule.shortDescription,
                            status: 'draft',
                            orderIndex: moduleCount,
                        }),
                    });
                }

                if (response.ok) {
                    await this.loadCourseDetails();
                    this.closeNewModuleModal();
                    this.$root.$toast.success(`Módulo ${isEditing ? 'atualizado' : 'adicionado'} com sucesso!`);
                } else {
                    const error = await response.json().catch(() => ({ message: `Erro ao ${isEditing ? 'atualizar' : 'criar'} módulo` }));
                    this.$root.$toast.error(`Erro: ${error.message}`);
                }
            } catch (error) {
                console.error(`Erro ao ${isEditing ? 'atualizar' : 'criar'} módulo:`, error);
                this.$root.$toast.info('Erro de conexão com o servidor.');
            }
        },
        // Aula
        // Editar e Excluir Módulo
        openEditModule(module) {
          // Preenche o formulário de novo módulo com os dados existentes
          this.isNewModuleModalOpen = true;
          this.newModule = {
            id: module.id,
            courseId: module.courseId,
            name: module.title.replace(/^Módulo \d+ - /, ''),
            shortDescription: module.shortDescription || ''
          };
        },
        requestDeleteModule(module) {
            this.confirmModalData = {
                visible: true,
                title: 'Excluir Módulo',
                message: `Tem certeza que deseja excluir o módulo "<strong>${module.title.replace(/^Módulo \d+ - /, '')}</strong>"?`,
                confirmAction: () => this.deleteModule(module)
            };
        },
        async deleteModule(module) {
          const isLocal = !module.id || module.id.toString().startsWith('temp-module-') || module.isLocal;
          
          // Confirmação já feita pelo modal


          if (isLocal) {
            // Módulo ainda não salvo no backend, remove localmente
            const index = this.modules.findIndex(m => m.id === module.id);
            if (index !== -1) {
              this.modules.splice(index, 1);
              // Também remove as aulas associadas a este módulo que ainda não foram salvas
              this.lessons = this.lessons.filter(l => l.moduleId !== module.id);
              this.$root.$toast.success('Módulo removido localmente.');
            }
            return;
          }

          try {
            const apiBaseUrl = this.getApiBaseUrl();
            const response = await fetch(`${apiBaseUrl}/courses/modules/${module.id}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
                'Content-Type': 'application/json'
              }
            });
            if (response.ok) {
              // Remove o módulo e suas aulas do estado local
              const idx = this.modules.findIndex(m => m.id === module.id);
              if (idx !== -1) this.modules.splice(idx, 1);
              this.lessons = this.lessons.filter(l => l.moduleId !== module.id);
              
              this.$root.$toast.success('Módulo excluído com sucesso.');
            } else {
              const err = await response.json().catch(() => ({ message: response.statusText }));
              this.$root.$toast.error(`Erro ao excluir módulo: ${err.message}`);
            }
          } catch (e) {
            console.error('Erro ao excluir módulo:', e);
            this.$root.$toast.info('Erro ao excluir módulo. Verifique sua conexão.');
          }
        },
        // Aula
        openNewLessonModal(moduleId = null) {
            this.isNewLessonModalOpen = true;
            this.newLesson = {
                id: null,
                moduleId: moduleId,
                name: '',
                contentType: 'Video',
                duration: 15,
                contentLink: '',
                releaseType: 'Imediata',
                isActive: true,
                videoFile: null,
                videoPath: '',
                videoFileName: ''
            };
        },
        openEditLesson(lesson) {
            this.isNewLessonModalOpen = true;
            
            // Detecta se é vídeo externo ou upload
            const isExternal = lesson.videoUrl && (
                lesson.videoUrl.includes('youtube.com') || 
                lesson.videoUrl.includes('youtu.be') || 
                lesson.videoUrl.includes('vimeo.com')
            );

            this.newLesson = {
                id: lesson.id,
                moduleId: lesson.moduleId,
                name: lesson.name || lesson.title,
                contentType: lesson.contentType || 'Video',
                duration: parseInt(lesson.duration) || 15,
                contentLink: lesson.contentLink || '',
                releaseType: lesson.releaseType || 'Imediata',
                isActive: lesson.isActive !== undefined ? lesson.isActive : true,
                videoFile: null,
                videoPath: lesson.videoUrl || '',
                videoFileName: !isExternal && lesson.videoUrl ? lesson.videoUrl.split('/').pop() : '',
                videoSource: isExternal ? 'external' : 'upload'
            };
        },
        openDeleteLesson(lesson) {
            this.lessonToDelete = lesson;
            this.isDeleteLessonModalOpen = true;
        },
        closeDeleteLessonModal() {
            this.isDeleteLessonModalOpen = false;
            this.lessonToDelete = null;
        },
        async confirmDeleteLesson() {
            if (!this.lessonToDelete) return;

            const lesson = this.lessonToDelete;
            const isLocal = lesson.id && (lesson.id.toString().startsWith('temp-lesson-') || lesson.isLocal);

            if (isLocal) {
                const index = this.lessons.findIndex(l => l.id === lesson.id);
                if (index !== -1) {
                    this.lessons.splice(index, 1);
                    this.$root.$toast.success('Aula removida localmente.');
                }
                this.closeDeleteLessonModal();
                return;
            }

            try {
                const apiBaseUrl = this.getApiBaseUrl();
                const response = await fetch(`${apiBaseUrl}/courses/lessons/${lesson.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const index = this.lessons.findIndex(l => l.id === lesson.id);
                    if (index !== -1) this.lessons.splice(index, 1);
                    this.$root.$toast.success('Aula excluída com sucesso.');
                    this.closeDeleteLessonModal();
                } else {
                    const error = await response.json().catch(() => ({ message: 'Erro ao excluir aula' }));
                    this.$root.$toast.error(`Erro ao excluir aula: ${error.message}`);
                }
            } catch (error) {
                console.error('Erro ao excluir aula:', error);
                this.$root.$toast.info('Erro ao excluir aula. Verifique sua conexão.');
            }
        },
        closeNewLessonModal() {
            this.isNewLessonModalOpen = false;
        },
        async saveNewLesson() {
            if (!this.newLesson.moduleId || !this.newLesson.name) {
                this.$root.$toast.error('O módulo e o nome da aula são obrigatórios.');
                return;
            }
            
            this.isSavingLesson = true;
            
            try {
                const isNewCourse = !this.course.selectedCourseId || this.course.selectedCourseId === 'new' || this.$route.params.id === 'new';
                const module = this.modules.find(m => m.id === this.newLesson.moduleId);
                
                if (!module) {
                    this.$root.$toast.info('Módulo não encontrado.');
                    return;
                }

                let videoPath = this.newLesson.videoPath || '';
                if (this.newLesson.contentType === 'Video') {
                    if (this.newLesson.videoSource === 'upload' && this.newLesson.videoFile) {
                        const uploadedVideoPath = await this.uploadLessonVideo(this.newLesson.videoFile);
                        if (!uploadedVideoPath) {
                            return;
                        }
                        videoPath = uploadedVideoPath;
                        this.newLesson.videoPath = uploadedVideoPath;
                    } else if (this.newLesson.videoSource === 'external') {
                        if (!videoPath) {
                            this.$root.$toast.info('Informe a URL do vídeo antes de salvar.');
                            return;
                        }
                    } else if (this.newLesson.videoSource === 'upload' && !videoPath) {
                        this.$root.$toast.info('Envie o vídeo da aula antes de salvar.');
                        return;
                    }
                }

                // Se for curso novo, adiciona localmente
                if (isNewCourse || module.isLocal) {
                    if (this.newLesson.id) {
                        // Editando aula local
                        const index = this.lessons.findIndex(l => l.id === this.newLesson.id);
                        if (index !== -1) {
                            this.lessons[index] = {
                                ...this.lessons[index],
                                name: this.newLesson.name,
                                title: this.newLesson.name,
                                contentType: this.newLesson.contentType || 'Video',
                                contentLink: this.newLesson.contentLink || '',
                                releaseType: this.newLesson.releaseType || 'Imediata',
                                isActive: this.newLesson.isActive !== undefined ? this.newLesson.isActive : true,
                                duration: `${this.newLesson.duration || 15} min`,
                                videoUrl: videoPath,
                            };
                            this.$root.$toast.info(`Aula "${this.newLesson.name}" atualizada localmente.`);
                        }
                    } else {
                        // Nova aula local
                        const tempLessonId = `temp-lesson-${Date.now()}-${Math.random()}`;
                        const newLessonObject = {
                            id: tempLessonId,
                            moduleId: this.newLesson.moduleId,
                            courseId: 'temp',
                            name: this.newLesson.name,
                            title: this.newLesson.name,
                            contentType: this.newLesson.contentType || 'Video',
                            contentLink: this.newLesson.contentLink || '',
                            releaseType: this.newLesson.releaseType || 'Imediata',
                            isActive: this.newLesson.isActive !== undefined ? this.newLesson.isActive : true,
                            duration: `${this.newLesson.duration || 15} min`,
                            isLocal: true, // Flag para identificar aulas locais
                            videoUrl: videoPath,
                        };
                        this.lessons.push(newLessonObject);
                        this.$root.$toast.info(`Aula "${this.newLesson.name}" adicionada localmente. Salve o curso para persistir.`);
                    }
                    this.closeNewLessonModal();
                    return;
                }

                // Se o curso já existe, salva no backend
                const apiBaseUrl = this.getApiBaseUrl();
                let response;
                
                if (this.newLesson.id) {
                    // PUT /courses/lessons/:id
                    response = await fetch(`${apiBaseUrl}/courses/lessons/${this.newLesson.id}`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            title: this.newLesson.name,
                            contentType: this.newLesson.contentType,
                            contentLink: this.newLesson.contentLink,
                            releaseType: this.newLesson.releaseType,
                            isActive: this.newLesson.isActive,
                            duration: `${this.newLesson.duration} min`,
                            videoUrl: videoPath,
                        }),
                    });
                } else {
                    // POST /courses/lessons
                    response = await fetch(`${apiBaseUrl}/courses/lessons`, {
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
                            videoUrl: videoPath,
                        }),
                    });
                }

                if (response.ok) {
                    await this.loadCourseDetails();
                    this.closeNewLessonModal();
                    this.$root.$toast.success(`Aula "${this.newLesson.name}" ${this.newLesson.id ? 'atualizada' : 'salva'} com sucesso!`);
                } else {
                    const error = await response.json().catch(() => ({ message: `Erro ao ${this.newLesson.id ? 'atualizar' : 'criar'} aula` }));
                    this.$root.$toast.error(`Erro ao ${this.newLesson.id ? 'atualizar' : 'criar'} aula: ${error.message}`);
                }
            } catch (error) {
                console.error('Erro ao criar aula:', error);
                this.$root.$toast.info('Erro ao criar aula. Verifique sua conexão.');
            } finally {
                this.isSavingLesson = false;
            }
        },
        // Materiais
        async openMaterialsModal(lessonId) {
            const normalizedLessonId = lessonId ? lessonId.toString() : null;
            this.selectedLessonIdForMaterials = normalizedLessonId;
            this.selectedLessonForMaterials = this.lessons.find(l => l.id === normalizedLessonId) || {};
            this.isMaterialsModalOpen = true;
            this.newMaterial = { name: '', type: 'PDF', link: '', file: null, fileName: '', filePath: '' };
            await this.loadMaterialsForLesson(normalizedLessonId);
        },
        closeMaterialsModal() {
            this.isMaterialsModalOpen = false;
            this.selectedLessonIdForMaterials = null;
            this.selectedLessonForMaterials = {};
        },
        async loadMaterialsForLesson(lessonId) {
            if (!lessonId) {
                return;
            }
            try {
                const apiBaseUrl = this.getApiBaseUrl();
                const response = await fetch(`${apiBaseUrl}/courses/lessons/${encodeURIComponent(lessonId)}/materials`, {
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
                } else {
                    const error = await response.json().catch(() => ({ message: response.statusText }));
                    console.error('Erro ao carregar materiais:', error);
                    this.$root.$toast.error(error.message || 'Erro ao carregar materiais.');
                }
            } catch (error) {
                console.error('Erro ao carregar materiais:', error);
                this.$root.$toast.info('Erro ao carregar materiais. Verifique sua conexão.');
            }
        },
                openEditMaterial(material) {
            this.newMaterial = { ...material };
            // Se for link, garante que o tipo está correto
            if (this.newMaterial.link && !this.newMaterial.filePath) {
                this.newMaterial.type = 'LINK';
            }
            // Se tiver filePath e não for link, tenta inferir ou mantém
        },
        cancelEditMaterial() {
             this.newMaterial = { name: '', type: 'PDF', link: '', file: null, fileName: '', filePath: '' };
        },
        async saveNewMaterial() {
            if (!this.newMaterial.name || (!this.newMaterial.link && !this.newMaterial.file && !this.newMaterial.filePath)) {
                this.$root.$toast.error('O nome do material e um arquivo ou link são obrigatórios.');
                return;
            }
            
            const isNewCourse = !this.course.selectedCourseId || this.course.selectedCourseId === 'new' || this.$route.params.id === 'new';
            const lesson = this.lessons.find(l => l.id === this.selectedLessonIdForMaterials);
            
            try {
                let filePath = this.newMaterial.filePath || '';
                
                // Se houver um arquivo selecionado, faz o upload primeiro
                if (this.newMaterial.file) {
                    const uploadedPath = await this.uploadMaterialFile(this.newMaterial.file);
                    if (uploadedPath) {
                        filePath = uploadedPath;
                    } else {
                        return; // O erro já foi tratado no uploadMaterialFile
                    }
                }

                // 1. CASO EDIÇÃO (Se já tem ID)
                if (this.newMaterial.id) {
                     // Verifica se é material local (temp)
                    const isLocalMaterial = this.newMaterial.isLocal || this.newMaterial.id.toString().startsWith('temp-material');

                    if (isNewCourse || isLocalMaterial || (lesson && lesson.isLocal)) {
                        // ATUALIZAÇÃO LOCAL
                        const index = this.materialsList.findIndex(m => m.id === this.newMaterial.id);
                        if (index !== -1) {
                            this.materialsList[index] = {
                                ...this.materialsList[index],
                                name: this.newMaterial.name,
                                type: this.newMaterial.type,
                                link: this.newMaterial.link,
                                filePath: filePath
                            };
                             // Força reatividade manualmente se necessário, mas atribuição direta por index em Vue 2 pode não ser reativa.
                             // Usar splice para garantir reatividade
                            this.materialsList.splice(index, 1, this.materialsList[index]);

                            this.$root.$toast.success(`Material "${this.newMaterial.name}" atualizado localmente.`);
                            this.cancelEditMaterial(); // Limpa o form
                        }
                    } else {
                        // ATUALIZAÇÃO NO BACKEND
                        const apiBaseUrl = this.getApiBaseUrl();
                        const response = await fetch(`${apiBaseUrl}/courses/materials/${this.newMaterial.id}`, {
                            method: 'PUT',
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                name: this.newMaterial.name,
                                type: this.newMaterial.type,
                                link: this.newMaterial.link,
                                filePath: filePath,
                            }),
                        });

                        if (response.ok) {
                            await this.loadMaterialsForLesson(this.selectedLessonIdForMaterials);
                             this.$root.$toast.success(`Material "${this.newMaterial.name}" atualizado com sucesso!`);
                             this.cancelEditMaterial();
                        } else {
                            const error = await response.json().catch(() => ({ message: 'Erro ao atualizar material' }));
                            this.$root.$toast.error(`Erro ao atualizar material: ${error.message}`);
                        }
                    }
                    return; // Sai da função após edição
                }

                // 2. CASO CRIAÇÃO (Sem ID) - Lógica original mantida abaixo
                // Se for curso novo ou aula local, adiciona localmente
                if (isNewCourse || (lesson && lesson.isLocal)) {
                    const tempMaterialId = `temp-material-${Date.now()}-${Math.random()}`;
                    const newMaterialObject = {
                        id: tempMaterialId,
                        lessonId: this.selectedLessonIdForMaterials,
                        name: this.newMaterial.name,
                        type: this.newMaterial.type,
                        link: this.newMaterial.link,
                        filePath: filePath,
                        isLocal: true,
                    };
                    this.materialsList.push(newMaterialObject);
                    const materialName = this.newMaterial.name;
                    this.newMaterial = { name: '', type: 'PDF', link: '', file: null, fileName: '', filePath: '' };
                    this.$root.$toast.success(`Material "${materialName}" adicionado localmente. Salve o curso para persistir.`);
                    return;
                }
                
                // Se o curso já existe, salva no backend
                const apiBaseUrl = this.getApiBaseUrl();
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
                        filePath: filePath,
                    }),
                });
                if (response.ok) {
                    const materialName = this.newMaterial.name;
                    this.newMaterial = { name: '', type: 'PDF', link: '', file: null, fileName: '', filePath: '' };
                    await this.loadMaterialsForLesson(this.selectedLessonIdForMaterials);
                    this.$root.$toast.success(`Material "${materialName}" adicionado com sucesso!`);
                } else {
                    const error = await response.json().catch(() => ({ message: 'Erro ao criar material' }));
                    this.$root.$toast.error(`Erro ao criar material: ${error.message}`);
                }
            } catch (error) {
                console.error('Erro ao salvar material:', error);
                this.$root.$toast.info('Erro ao salvar material. Verifique sua conexão.');
            }
        },
        requestDeleteMaterial(materialId) {
            this.confirmModalData = {
                visible: true,
                title: 'Excluir Material',
                message: 'Tem certeza que deseja excluir este material?',
                confirmAction: () => this.deleteMaterial(materialId)
            };
        },
        handleConfirmAction() {
            if (this.confirmModalData.confirmAction) {
                this.confirmModalData.confirmAction();
            }
            this.confirmModalData.visible = false;
        },
        async deleteMaterial(materialId) {
            // Confirmação via modal
            try {
                const apiBaseUrl = this.getApiBaseUrl();
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
            this.course.coverImagePath = '';
            this.course.coverImagePreview = null;
            this.course.availableFrom = '';
            this.course.availableUntil = '';
            this.modules = [];
            this.lessons = [];
        },
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
                const apiBaseUrl = this.getApiBaseUrl();
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
                this.resetCourseFields();
                return;
            }
            try {
                const apiBaseUrl = this.getApiBaseUrl();
                const response = await fetch(`${apiBaseUrl}/courses/${courseId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const courseData = await response.json();
                    this.fillCourseDataFromResponse(courseData);
                } else {
                    console.error('Erro ao carregar detalhes do curso:', response.statusText);
                }
            } catch (error) {
                console.error('Erro ao carregar detalhes do curso:', error);
            }
        },
        fillCourseDataFromResponse(courseData) {
            this.course.name = courseData.name || courseData.title;
            this.course.description = courseData.description;
            this.course.coverImagePath = courseData.coverImage || '';
            this.course.coverImagePreview = this.resolveImageUrl(courseData.coverImage) || courseData.imagePlaceholder || null;
            this.course.access = courseData.access || "1";
            this.course.price = courseData.price || 0;
            this.course.currency = courseData.currency || "R$";
            this.course.subscription = courseData.subscription || "1";
            this.course.discount = courseData.discount || "0";
            this.course.status = courseData.status || "draft";
            this.course.availableFrom = courseData.availableFrom ? courseData.availableFrom.split('T')[0] : '';
            this.course.availableUntil = courseData.availableUntil ? courseData.availableUntil.split('T')[0] : '';
            this.course.visibility = courseData.visibility || "public";

            if (courseData.modules) {
                this.modules = courseData.modules.map(m => ({
                    id: m.id,
                    courseId: m.courseId || this.course.selectedCourseId,
                    title: m.title,
                    shortDescription: m.shortDescription,
                    status: m.status || 'draft',
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

                        videoUrl: l.videoUrl,
                        isDerivTutorial: l.isDerivTutorial,
                    }))
                );
            } else {
                this.modules = [];
                this.lessons = [];
            }

            if (courseData.modules && courseData.modules.length > 0) {
                this.previewCourse = {
                    ...courseData,
                    id: courseData.id,
                    name: courseData.name || courseData.title,
                    description: courseData.description,
                    coverImagePreview: this.resolveImageUrl(courseData.coverImage) || courseData.imagePlaceholder || null,
                };
            }
        },
    },
}
</script>
<style src="../../assets/css/views/Admin/AcademyManagementView.css"></style>