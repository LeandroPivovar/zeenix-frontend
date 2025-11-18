<template>
    <div class="modal-overlay preview-overlay">
        <div class="student-preview-app">
            <button class="btn btn-close-preview" @click="$emit('close')">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                Voltar aos Cursos
            </button>
            <div v-if="courseData && courseData.id" class="preview-grid">
                <div class="course-sidebar">
                    <div class="course-header">
                        <span class="back-link" @click="$emit('close')">← Voltar aos Cursos</span>
                        <h3 class="course-title">{{ courseData.name }}</h3>
                    </div>
                    <div class="course-progress">
                        <p class="progress-text">{{ completedLessonsCount }} de {{ totalLessonsCount }} aulas concluídas</p>
                        <div class="progress-bar-container">
                            <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
                        </div>
                        <p class="progress-percentage">{{ progressPercentage }}%</p>
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
                                    v-for="(lesson, index) in filteredLessonsForModule(module.id, false)"
                                    :key="lesson.id"
                                    class="nav-lesson-item"
                                    :class="{ 'active-lesson': lesson.id === activeLessonId, 'completed-lesson': completedLessonIds.includes(lesson.id) }"
                                    @click="setActiveLesson(lesson.id)"
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
                        <h2 class="lesson-title">{{ activeLesson.name || 'Selecione uma aula' }}</h2>
                        <p class="lesson-meta" v-if="activeLesson.name">
                            Duração: {{ activeLesson.duration }}min <span class="status-dot"></span> {{ activeLesson.id === activeLessonId ? 'Em andamento' : 'Concluída' }}
                        </p>
                        <div class="completion-bar" v-if="activeLesson.name"></div>
                    </div>
                    <div class="video-player" v-if="activeLesson.name">
                        <span class="zenix-logo">ZENIX</span>
                        <h1 class="video-placeholder-text">{{ activeLesson.name }}</h1>
                    </div>
                    <div class="content-actions" v-if="activeLesson.name">
                        <div class="action-buttons">
                            <!-- Botão de download pode ser condicional baseado em materiais -->
                            <button class="btn btn-action-download" v-if="getMaterialCountForLesson(activeLesson.id) > 0">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                Baixar material da aula
                            </button>
                            <button class="btn btn-action-complete" v-if="!completedLessonIds.includes(activeLesson.id)" @click="markLessonComplete(activeLesson.id)">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f1013" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                Marcar como concluída
                            </button>
                            <span class="btn-action-replay" v-else @click="markLessonIncomplete(activeLesson.id)">
                                Desfazer conclusão
                            </span>
                        </div>
                    </div>
                    <div class="complementary-materials" v-if="activeLesson.name">
                        <h3>Materiais Complementares</h3>
                        <ul class="materials-list">
                            <li v-for="material in materialsList.filter(m => m.lessonId === activeLesson.id)" :key="material.id" @click="openMaterialLink(material.link)">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00ff7f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                                {{ material.type }}: {{ material.name }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <p v-else class="list-placeholder">Carregando dados do curso ou nenhum curso selecionado.</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'StudentPreview',
    // Recebe os dados do curso e módulos/aulas do componente pai
    props: {
        courseData: {
            type: Object,
            required: true
        },
        modules: {
            type: Array,
            required: true
        },
        lessons: {
            type: Array,
            required: true
        },
        materialsList: {
            type: Array,
            default: () => []
        },
        initialCompletedLessonIds: {
            type: Array,
            default: () => []
        }
    },
    emits: ['close'], // Evento para fechar o modal do preview
    data() {
        return {
            completedLessonIds: [...this.initialCompletedLessonIds], // Cópia local para gerenciar conclusão
            activeLessonId: null // ID da aula ativa no preview
        };
    },
    computed: {
        filteredModulesForPreview() {
            // Filtra módulos do curso que não estejam arquivados
            return this.modules.filter(
                module => module.courseId === this.courseData.id && module.status !== 'archived'
            );
        },
        totalLessonsCount() {
            // Conta todas as aulas ativas dentro dos módulos filtrados
            return this.lessons.filter(lesson =>
                this.filteredModulesForPreview.some(mod => mod.id === lesson.moduleId) && lesson.isActive
            ).length;
        },
        completedLessonsCount() {
            return this.completedLessonIds.length;
        },
        progressPercentage() {
            if (this.totalLessonsCount === 0) return 0;
            return Math.round((this.completedLessonsCount / this.totalLessonsCount) * 100);
        },
        activeLesson() {
            // Retorna os dados da aula ativa ou um objeto vazio
            return this.lessons.find(lesson => lesson.id === this.activeLessonId) || {};
        }
    },
    methods: {
        filteredLessonsForModule(moduleId, includeInactive) {
            if (includeInactive) {
                return this.lessons.filter(lesson => lesson.moduleId === moduleId);
            } else {
                // Apenas aulas ativas e publicadas
                return this.lessons.filter(lesson => lesson.moduleId === moduleId && lesson.isActive);
            }
        },
        getMaterialCountForLesson(lessonId) {
            return this.materialsList.filter(m => m.lessonId === lessonId).length;
        },
        setActiveLesson(lessonId) {
            this.activeLessonId = lessonId;
        },
        markLessonComplete(lessonId) {
            if (!this.completedLessonIds.includes(lessonId)) {
                this.completedLessonIds.push(lessonId);
            }
        },
        markLessonIncomplete(lessonId) {
            const index = this.completedLessonIds.indexOf(lessonId);
            if (index > -1) {
                this.completedLessonIds.splice(index, 1);
            }
        },
        openMaterialLink(link) {
            window.open(link, '_blank');
        }
    },
    mounted() {
        // Define a primeira aula do primeiro módulo como ativa ao carregar, se existir
        if (this.filteredModulesForPreview.length > 0) {
            const firstModule = this.filteredModulesForPreview[0];
            const firstLesson = this.filteredLessonsForModule(firstModule.id, false)[0];
            if (firstLesson) {
                this.setActiveLesson(firstLesson.id);
            }
        }
    }
}
</script>

<style scoped>
/* Estilos copiados e adaptados para o componente isolado */
/* Mantém as classes originais para reutilizar o CSS */
/* Ajustes mínimos para encapsulamento, se necessário */

.modal-overlay.preview-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000;
    align-items: flex-start;
    padding: 50px;
    width: calc(100% - 240px); /* Ajuste para largura da sidebar, pode ser passado via prop */
    margin-left: 240px; /* Ajuste para largura da sidebar, pode ser passado via prop */
    overflow-y: auto; /* Adiciona scroll se necessário */
    z-index: 1000; /* Garante que fique sobre outros elementos */
}

.student-preview-app {
    width: 100%;
    height: 90vh;
    display: flex;
    flex-direction: column;
    background: #1e1e1e;
}

.btn-close-preview {
    position: absolute;
    top: 15px;
    right: 20px;
    background: var(--color-secondary, #007bff);
    color: #fff;
    padding: 8px 15px;
    font-size: 0.9rem;
    z-index: 1001;
    border-radius: 4px;
    border: none;
    cursor: pointer;
}

.preview-grid {
    display: flex;
    flex-grow: 1;
    overflow: hidden;
}

.course-sidebar {
    width: 350px;
    background: #252525;
    padding: 20px 0;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    border-right: 1px solid #333;
    min-height: 100%;
}

.course-header {
    padding: 0 20px 20px;
    border-bottom: 1px solid #333;
}

.back-link {
    color: #8c929a;
    font-size: 0.9rem;
    margin-bottom: 10px;
    display: block;
    cursor: pointer;
}

.course-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: #f0f2f5;
}

.course-progress {
    padding: 20px;
    background: #1a1a1a;
    display: flex;
    align-items: center;
    gap: 10px;
}

.progress-text {
    flex-grow: 1;
    font-size: 0.9rem;
    color: #8c929a;
}

.progress-bar-container {
    width: 100px;
    height: 8px;
    background: #333;
    border-radius: 4px;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    background: var(--color-primary, #00ff7f);
    transition: width 0.3s;
}

.progress-percentage {
    font-weight: 600;
    color: var(--color-primary, #00ff7f);
    font-size: 0.9rem;
}

.course-modules-nav {
    padding-top: 10px;
    flex-grow: 1;
}

.nav-module {
    margin-bottom: 5px;
}

.nav-module-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    color: #f0f2f5;
    font-weight: 600;
    cursor: pointer;
    background: #252525;
}

.chevron-icon {
    color: #8c929a;
    transform: rotate(180deg);
    transition: transform 0.2s;
}

.nav-lessons-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.nav-lesson-item {
    padding: 12px 20px 12px 30px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    cursor: pointer;
    transition: background-color 0.2s;
    position: relative;
    border-left: 5px solid transparent;
}

.nav-lesson-item:hover {
    background: #2c3038;
}

.nav-lesson-item .lesson-info {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 1rem;
    color: #8c929a;
}

.nav-lesson-item .lesson-number {
    font-weight: 600;
}

.nav-lesson-item .lesson-name {
    color: #f0f2f5;
    font-weight: 500;
}

.nav-lesson-item .lesson-duration {
    font-size: 0.85rem;
    color: #8c929a;
}

.lesson-duration{
    background: #3f3f3f4b;
    padding: 5px;
    border-radius: 8px;
}

.active-lesson {
    background: #17382d;
    border-left-color: var(--color-primary, #00ff7f);
}
.active-lesson .lesson-name, .active-lesson .lesson-duration {
    color: var(--color-primary, #00ff7f);
}
.completed-lesson .lesson-name, .completed-lesson .lesson-duration {
    color: #8c929a;
    text-decoration: line-through;
}

.lesson-status {
    font-size: 0.8rem;
    color: var(--color-primary, #00ff7f);
    margin-left: 28px;
    font-style: italic;
    display: flex;
    align-items: center;
    gap: 5px;
}
.completed-lesson .lesson-status {
    color: var(--color-primary, #00ff7f);
    font-style: normal;
}
.unlock-tip {
    font-size: 0.75rem;
    color: #8c929a;
    padding: 20px;
    text-align: center;
    border-top: 1px solid #333;
}
.course-content {
    flex-grow: 1;
    background: #1e1e1e;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
}
.content-header {
    padding: 20px 30px;
    background: #0f1013;
    border-bottom: 1px solid #333;
    position: relative;
}
.lesson-title {
    font-size: 1.5rem;
    margin-bottom: 5px;
    font-weight: 600;
    color: #f0f2f5;
}
.lesson-meta {
    font-size: 0.9rem;
    color: #8c929a;
    display: flex;
    align-items: center;
    gap: 8px;
}
.status-dot {
    width: 8px;
    height: 8px;
    background: var(--color-secondary, #007bff);
    border-radius: 50%;
}
.completion-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 4px;
    width: 50%;
    background: var(--color-primary, #00ff7f);
}
.video-player {
    flex-grow: 1;
    background: #2c3038;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
}
.zenix-logo {
    position: absolute;
    top: 10px;
    right: 10px;
    color: #8c929a;
    font-weight: 700;
    font-size: 0.8rem;
}
.video-placeholder-text {
    font-size: 2.5rem;
    color: #8c929a;
    opacity: 0.4;
    font-weight: 700;
}
.content-actions {
    padding: 20px 30px;
    border-bottom: 1px solid #333;
}
.action-buttons {
    display: flex;
    gap: 20px;
    align-items: center;
}
.btn-action-download {
    background: #33363d;
    color: #f0f2f5;
    border: 1px solid #444;
    padding: 10px 15px;
    font-size: 0.9rem;
    cursor: pointer;
}
.btn-action-complete {
    background: var(--color-primary, #00ff7f);
    color: #0f1013;
    padding: 10px 15px;
    font-size: 0.9rem;
    cursor: pointer;
}
.btn-action-replay {
    color: #8c929a;
    font-size: 0.9rem;
    cursor: pointer;
    transition: color 0.2s;
}
.btn-action-replay:hover {
    color: var(--color-secondary, #007bff);
}
.complementary-materials {
    padding: 30px;
}
.complementary-materials h3 {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 15px;
    color: #f0f2f5;
}
.materials-list {
    list-style: none;
    padding: 0;
}
.materials-list li {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 15px;
    background: #33363d;
    border-radius: 4px;
    margin-bottom: 8px;
    color: var(--color-primary, #00ff7f);
    font-size: 0.95rem;
    cursor: pointer;
}
.materials-list li:hover {
    background: #444;
}

.list-placeholder {
    color: var(--color-text-subtle, #8c929a);
    font-style: italic;
    padding: 15px 20px;
    text-align: center;
    border: 1px dashed var(--color-border, #ffffff);
    border-radius: 6px;
    margin-top: 10px;
}

/* Media Queries para o componente */
@media (max-width: 1200px) {
    .preview-overlay {
        width: 100%;
        margin-left: 0;
        padding: 30px;
    }
}
@media (max-width: 768px) {
    .preview-grid {
        flex-direction: column-reverse;
        overflow-y: auto;
    }
    .course-content {
        width: 100%;
        min-height: auto;
    }
    .course-sidebar {
        width: 100%;
        min-height: auto;
        border-right: none;
        border-top: 1px solid #333;
    }
    .student-preview-app {
        height: auto;
        min-height: 90vh;
    }
    .preview-overlay {
        padding: 20px 10px;
    }
    .content-header, .content-actions, .complementary-materials {
        padding: 15px 20px;
    }
    .video-player {
        min-height: 250px;
    }
}
</style>