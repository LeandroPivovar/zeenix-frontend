<!-- AcademyCoursesListView.vue -->
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
</template>

<script>
import AppSidebar from '../../components/Sidebar.vue';

export default {
    name: 'AcademyCoursesListView',
    components: {
        AppSidebar,
    },
    data() {
        return {
            isSidebarOpen: true,
            isSidebarCollapsed: false,
            courses: [],
            loading: true,
        };
    },
    async mounted() {
        await this.loadCourses();
    },
    methods: {
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
.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
}

.header-info h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 0.5rem 0;
}

.header-info p {
    color: #666;
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
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.course-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
    cursor: pointer;
}

.course-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.course-card-image {
    position: relative;
    width: 100%;
    height: 200px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    overflow: hidden;
}

.course-card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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
}

.course-card-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 0.5rem 0;
}

.course-card-description {
    color: #666;
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 0 0 1rem 0;
}

.course-card-meta {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1rem;
    font-size: 0.875rem;
    color: #666;
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
    border-top: 1px solid #e5e7eb;
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
    color: #667eea;
    font-size: 1.1rem;
}

.course-price.free {
    color: #10b981;
}

.empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: #666;
}

.empty-state svg {
    margin-bottom: 1rem;
    opacity: 0.5;
}

.empty-state h3 {
    font-size: 1.5rem;
    margin: 1rem 0 0.5rem 0;
    color: #1a1a1a;
}

.empty-state p {
    margin-bottom: 2rem;
}

.loading-state {
    text-align: center;
    padding: 4rem 2rem;
}

.spinner {
    width: 48px;
    height: 48px;
    border: 4px solid #e5e7eb;
    border-top-color: #667eea;
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

