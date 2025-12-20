<!-- AcademyCoursesListView.vue -->
<template>
    <div class="dashboard-layout" ref="layoutContainer">
        <div v-if="isSidebarOpen && isMobile" class="sidebar-overlay" @click="isSidebarOpen = false"></div>
        
        <AppSidebar :is-open="isSidebarOpen" :is-collapsed="isSidebarCollapsed" :is-mobile="isMobile" @toggle-collapse="toggleSidebarCollapse" @close-sidebar="isSidebarOpen = false" />
        
        <div class="dashboard-content-wrapper" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
            <TopNavbar 
                v-if="!isMobile"
                :is-sidebar-collapsed="isSidebarCollapsed"
                @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
                @toggle-sidebar-collapse="toggleSidebarCollapse"
            />
            
            <div v-if="isMobile" class="mobile-header-admin">
                <button class="menu-toggler-btn" @click="isSidebarOpen = true">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <div class="mobile-brand">
                    <span class="text-white font-bold text-lg">ZEN</span><span class="text-white font-bold text-lg">I</span><span class="text-[#22C55E] font-bold text-lg">X</span>
                </div>
            </div>

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
    </div>
</template>

<script>
import AppSidebar from '../../components/Sidebar.vue';
import TopNavbar from '../../components/TopNavbar.vue';

export default {
    name: 'AcademyCoursesListView',
    components: {
        AppSidebar,
        TopNavbar,
    },
    data() {
        return {
            isSidebarOpen: true,
            isSidebarCollapsed: false,
            isMobile: false,
            courses: [],
            loading: true,
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
    margin-left: 280px;
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

/* Mobile Header */
.mobile-header-admin {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    background-color: #0b0b0b;
    z-index: 998;
    padding: 0 20px;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #1C1C1C;
}

.mobile-brand {
    display: flex;
    align-items: center;
}

.menu-toggler-btn {
    background-color: #1e1e1e;
    color: rgb(255, 255, 255);
    border: 1px solid #333;
    border-radius: 8px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s;
}

.menu-toggler-btn:hover {
    background-color: #2a2a2a;
}

/* Responsividade */
@media (max-width: 1024px) {
    .dashboard-content-wrapper {
        margin-left: 0;
    }
    
    .dashboard-content-wrapper.sidebar-collapsed {
        margin-left: 0;
    }
    
    .mobile-header-admin {
        display: flex;
    }
    
    .layout-content {
        padding-top: 80px;
    }
}

.container {
    max-width: 1400px;
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
    font-size: 2rem;
    font-weight: 700;
    color: #f0f2f5;
    margin: 0 0 0.5rem 0;
}

.header-info p {
    color: #8c929a;
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
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
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

.course-card-status {
    position: absolute;
    top: 1rem;
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

@media (max-width: 768px) {
    .courses-grid {
        grid-template-columns: 1fr;
    }
    
    .page-header {
        flex-direction: column;
    }
}
</style>

