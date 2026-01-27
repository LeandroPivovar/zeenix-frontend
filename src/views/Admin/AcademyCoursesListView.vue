<!-- AcademyCoursesListView.vue -->
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
                        <h1 class="page-title">Zenix Academy - Cursos</h1>
                        <p class="page-subtitle">Gerencie seus cursos, módulos e aulas.</p>
                    </div>
                    <div class="header-actions">
                        <button class="btn btn-primary" @click="createNewCourse">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 4V20M4 12H20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Novo Curso
                        </button>
                    </div>
                </header>

                <div class="courses-grid" v-if="!loading && courses.length > 0">
                    <div 
                        v-for="course in courses" 
                        :key="course.id" 
                        class="course-card"
                        @click="openCourse(course.id)"
                    >
                        <div class="course-card-image">
                            <img 
                                v-if="course.coverImage" 
                                :src="course.coverImage" 
                                :alt="course.name || course.title"
                            />
                            <div v-else class="course-card-placeholder">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                            <div class="course-card-image-gradient"></div>
                            <div class="course-reorder-btns">
                                <button 
                                    class="reorder-btn" 
                                    @click.stop="moveCourse(course, -1)" 
                                    :disabled="courses.indexOf(course) === 0"
                                    title="Mover para Cima"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18 15l-6-6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </button>
                                <button 
                                    class="reorder-btn" 
                                    @click.stop="moveCourse(course, 1)" 
                                    :disabled="courses.indexOf(course) === courses.length - 1"
                                    title="Mover para Baixo"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </button>
                            </div>
                            <button 
                                class="course-delete-btn" 
                                @click.stop="deleteCourse(course.id)"
                                title="Excluir Curso"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                            <div class="course-card-status" :class="getStatusClass(course.status)">
                                {{ getStatusLabel(course.status) }}
                            </div>
                        </div>
                        <div class="course-card-content">
                            <h3 class="course-card-title">{{ course.name || course.title }}</h3>
                            <p class="course-card-description">{{ truncateText(course.description, 120) }}</p>
                            <div class="course-card-meta">
                                <span class="course-meta-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    {{ course.totalLessons || 0 }} aulas
                                </span>
                                <span class="course-meta-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                                        <polyline points="12 6 12 12 16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    {{ course.totalDuration || '0min' }}
                                </span>
                            </div>
                            <div class="course-card-footer">
                                <span class="course-visibility" :class="getVisibilityClass(course.visibility)">
                                    {{ getVisibilityLabel(course.visibility) }}
                                </span>
                                <span class="course-price" v-if="course.access === '1' && course.price">
                                    {{ course.currency || 'R$' }} {{ formatPrice(course.price) }}
                                </span>
                                <span class="course-price free" v-else-if="course.access === '2'">
                                    Gratuito
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="empty-state" v-if="!loading && courses.length === 0">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <h3>Nenhum curso encontrado</h3>
                    <p>Crie seu primeiro curso para começar a gerenciar a Academy.</p>
                    <button class="btn btn-primary" @click="createNewCourse">
                        Criar Primeiro Curso
                    </button>
                </div>

                <div class="loading-state" v-if="loading">
                    <div class="spinner"></div>
                    <p>Carregando cursos...</p>
                </div>
                </div>
            </main>
        </div>
        
        <!-- Modal de Confirmação de Exclusão -->
        <DeleteCourseModal
            :visible="deleteModal.isOpen"
            :course-name="deleteModal.courseName"
            @cancel="closeDeleteModal"
            @confirm="confirmDelete"
        />

        <!-- Settings Modal -->
        <SettingsSidebar
            :is-open="showSettingsModal"
            @close="showSettingsModal = false"
        />
    </div>
</template>

<script>
import AppSidebar from '../../components/Sidebar.vue';
import TopNavbar from '../../components/TopNavbar.vue';
import SettingsSidebar from '../../components/SettingsSidebar.vue';
import DeleteCourseModal from '../../components/modals/DeleteCourseModal.vue';

export default {
    name: 'AcademyCoursesListView',
    components: {
        AppSidebar,
        TopNavbar,
        SettingsSidebar,
        DeleteCourseModal,
    },
    data() {
        return {
            isSidebarOpen: true,
            isSidebarCollapsed: false,
            isMobile: false,
            showSettingsModal: false,
            courses: [],
            loading: true,
            deleteModal: {
                isOpen: false,
                courseId: null,
                courseName: ''
            },
        };
    },
    async mounted() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
        await this.loadCourses();
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.handleResize);
    },
    methods: {
        handleResize() {
            this.isMobile = window.innerWidth < 1024;
            if (this.isMobile) {
                this.isSidebarOpen = false;
            }
        },
        async loadCourses() {
            this.loading = true;
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
                        coverImage: this.resolveImageUrl(c.coverImage) || this.resolveImageUrl(c.imagePlaceholder),
                        status: c.status || 'draft',
                        visibility: c.visibility || 'public',
                        access: c.access || '1',
                        price: c.price || 0,
                        currency: c.currency || 'R$',
                        totalLessons: c.totalLessons || 0,
                        totalDuration: c.totalDuration || '0min',
                    }));
                } else {
                    console.error('Erro ao carregar cursos:', response.statusText);
                }
            } catch (error) {
                console.error('Erro ao carregar cursos:', error);
            } finally {
                this.loading = false;
            }
        },
        openCourse(courseId) {
            this.$router.push({ name: 'AcademyManagement', params: { id: courseId } });
        },
        createNewCourse() {
            this.$router.push({ name: 'AcademyManagement', params: { id: 'new' } });
        },
        toggleSidebarCollapse() {
            this.isSidebarCollapsed = !this.isSidebarCollapsed;
        },
        truncateText(text, maxLength) {
            if (!text) return '';
            return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
        },
        getStatusClass(status) {
            const statusMap = {
                'published': 'status-published',
                'draft': 'status-draft',
                'archived': 'status-archived',
            };
            return statusMap[status] || 'status-draft';
        },
        getStatusLabel(status) {
            const labelMap = {
                'published': 'Publicado',
                'draft': 'Rascunho',
                'archived': 'Arquivado',
            };
            return labelMap[status] || 'Rascunho';
        },
        getVisibilityClass(visibility) {
            const visibilityMap = {
                'public': 'visibility-public',
                'private': 'visibility-private',
                'restricted': 'visibility-restricted',
            };
            return visibilityMap[visibility] || 'visibility-public';
        },
        getVisibilityLabel(visibility) {
            const labelMap = {
                'public': 'Público',
                'private': 'Privado',
                'restricted': 'Restrito',
            };
            return labelMap[visibility] || 'Público';
        },
        formatPrice(price) {
            return parseFloat(price).toFixed(2).replace('.', ',');
        },
        getApiBaseUrl() {
            return process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
        },
        resolveImageUrl(path) {
            if (!path) return null;
            if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
                return path;
            }
            if (path.startsWith('/')) {
                return `${this.getApiBaseUrl()}${path}`;
            }
            return path;
        },
        async moveCourse(course, direction) {
            const index = this.courses.indexOf(course);
            const newIndex = index + direction;

            if (newIndex >= 0 && newIndex < this.courses.length) {
                // Swap in frontend
                const temp = this.courses[index];
                this.courses[index] = this.courses[newIndex];
                this.courses[newIndex] = temp;
                this.courses = [...this.courses]; // Trigger reactivity

                // Persist order
                const apiBaseUrl = this.getApiBaseUrl();
                const orders = this.courses.map((c, idx) => ({ id: c.id, orderIndex: idx }));

                try {
                    await fetch(`${apiBaseUrl}/courses/reorder/all`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ orders }),
                    });
                } catch (error) {
                    console.error('Erro ao reordenar cursos:', error);
                    // Revert on error if needed, but for now just log
                }
            }
        },
        deleteCourse(courseId) {
            const course = this.courses.find(c => c.id === courseId);
            if (!course) return;
            
            this.deleteModal.isOpen = true;
            this.deleteModal.courseId = courseId;
            this.deleteModal.courseName = course.name || course.title || 'este curso';
        },
        closeDeleteModal() {
            this.deleteModal.isOpen = false;
            this.deleteModal.courseId = null;
            this.deleteModal.courseName = '';
        },
        async confirmDelete() {
            const courseId = this.deleteModal.courseId;
            
            // Fecha o modal imediatamente
            this.closeDeleteModal();
            
            try {
                const apiBaseUrl = this.getApiBaseUrl();
                const response = await fetch(`${apiBaseUrl}/courses/${courseId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
                        'Content-Type': 'application/json',
                    },
                });
                
                if (response.ok) {
                    // Remove o curso da lista localmente
                    this.courses = this.courses.filter(c => c.id !== courseId);
                    
                    // Exibir mensagem de sucesso
                    if (this.$root.$toast) {
                        this.$root.$toast.success('Curso excluído com sucesso!');
                    }
                } else {
                    const error = await response.json().catch(() => ({ message: 'Erro ao excluir curso' }));
                    if (this.$root.$toast) {
                        this.$root.$toast.error(`Erro: ${error.message}`);
                    } else {
                        await alert(`Erro ao excluir curso: ${error.message}`);
                    }
                }
            } catch (error) {
                console.error('Erro ao excluir curso:', error);
                if (this.$root.$toast) {
                    this.$root.$toast.error('Erro ao excluir curso. Verifique sua conexão.');
                } else {
                    await alert('Erro ao excluir curso. Verifique sua conexão.');
                }
            }
        }
    }
}
</script>

<style scoped>
/* Layout Base - Padrão Dashboard */
.dashboard-layout {
    display: flex;
    min-height: 100vh;
    background-color: #0b0b0b;
    color: #f0f2f5;
}

.sidebar-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
}

.dashboard-content-wrapper {
    flex-grow: 1;
    transition: margin-left 0.3s ease;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.dashboard-content-wrapper.sidebar-collapsed {
    margin-left: 80px;
}

.layout-content {
    flex-grow: 1;
    padding: 20px;
    padding-top: 80px;
    background-color: #0b0b0b;
}


/* Responsividade */
@media (max-width: 1024px) {
    .dashboard-content-wrapper {
        margin-left: 0;
    }
    
    .dashboard-content-wrapper.sidebar-collapsed {
        margin-left: 0;
    }
}

@media (max-width: 768px) {
    .layout-content {
        padding: 12px;
        padding-top: 70px;
    }
}

.container {
    max-width: none;
    width: 100%;
    margin: 0 auto;
    padding: 0;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
}

.header-info h1 {
    font-size: 20px;
    font-weight: 600;
    color: #ffffff;
    margin: 0 0 4px 0;
}

.header-info p {
    font-size: 14px;
    color: #a0a0a0;
    margin: 0;
}

.header-actions {
    display: flex;
    gap: 1rem;
}

.btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s;
}

.btn-primary {
    background: #00ff7f;
    color: #0f1013;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 255, 127, 0.4);
}

.courses-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    margin-top: 2rem;
}

.course-card {
    background: #1a1a1a;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    transition: all 0.3s;
    cursor: pointer;
    border: 1px solid #2c3038;
}

.course-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    border-color: #00ff7f;
}

.course-card-image {
    position: relative;
    width: 100%;
    height: 200px;
    background: linear-gradient(135deg, #1a1a1a 0%, #2c3038 100%);
    overflow: hidden;
}

.course-card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.course-card-image-gradient {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 120px;
    background: linear-gradient(to bottom, 
        transparent 0%, 
        rgba(26, 26, 26, 0.2) 30%, 
        rgba(26, 26, 26, 0.5) 60%, 
        rgba(26, 26, 26, 0.8) 85%, 
        #1a1a1a 100%);
    pointer-events: none;
    z-index: 1;
}

.course-card-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.7);
}


/* Layout Base - Padrão Dashboard */
.course-reorder-btns {
    position: absolute;
    top: 1rem;
    left: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    z-index: 3;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.course-card:hover .course-reorder-btns {
    opacity: 1;
}

.reorder-btn {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    backdrop-filter: blur(4px);
}

.reorder-btn:hover:not(:disabled) {
    background: rgba(0, 0, 0, 0.8);
    transform: scale(1.1);
    color: #00ff7f;
}

.reorder-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.course-delete-btn {
    position: absolute;
    top: 1rem;
    right: 1rem; /* Alterado de left para right */
    left: auto; /* Remove left original */
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 8px;
    background: rgba(239, 68, 68, 0.9);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    opacity: 0;
    transform: scale(0.8);
    z-index: 3;
    backdrop-filter: blur(4px);
}

/* Ajusta o status para não conflitar com o botão de excluir */
.course-card-status {
    position: absolute;
    top: 4rem; /* Move para baixo para não ficar em cima do delete */
    right: 1rem;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    z-index: 2;
}

.status-published {
    background: #10b981;
    color: white;
}

.status-draft {
    background: #f59e0b;
    color: white;
}

.status-archived {
    background: #6b7280;
    color: white;
}

.course-card-content {
    padding: 1.5rem;
    text-align: left;
}

.course-card-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #f0f2f5;
    margin: 0 0 0.5rem 0;
    text-align: left;
}

.course-card-description {
    color: #8c929a;
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 0 0 1rem 0;
    text-align: left;
}

.course-card-meta {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1rem;
    font-size: 0.875rem;
    color: #8c929a;
}

.course-meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.course-card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
    border-top: 1px solid #2c3038;
}

.course-visibility {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
}

.visibility-public {
    background: #dbeafe;
    color: #1e40af;
}

.visibility-private {
    background: #fee2e2;
    color: #991b1b;
}

.visibility-restricted {
    background: #fef3c7;
    color: #92400e;
}

.course-price {
    font-weight: 700;
    color: #00ff7f;
    font-size: 1.1rem;
}

.course-price.free {
    color: #00ff7f;
}

.empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: #8c929a;
}

.empty-state svg {
    margin-bottom: 1rem;
    opacity: 0.5;
    color: #8c929a;
}

.empty-state h3 {
    font-size: 1.5rem;
    margin: 1rem 0 0.5rem 0;
    color: #f0f2f5;
}

.empty-state p {
    margin-bottom: 2rem;
}

.loading-state {
    text-align: center;
    padding: 4rem 2rem;
    color: #8c929a;
}

.spinner {
    width: 48px;
    height: 48px;
    border: 4px solid #2c3038;
    border-top-color: #00ff7f;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

@media (max-width: 1024px) {
    .courses-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .page-header {
        flex-direction: column;
    }
    
    .header-actions {
        width: 100%;
    }
    
    .header-actions .btn {
        flex: 1;
    }
}
</style>

