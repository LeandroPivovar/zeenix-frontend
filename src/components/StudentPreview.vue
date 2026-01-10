<template>
    <div class="modal-overlay preview-overlay" @click.self="$emit('close')">
        <div class="student-preview-app" @click.stop>
            <button class="btn btn-close-preview" @click="$emit('close')" title="Fechar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
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
                        <div class="lesson-meta-container" v-if="activeLesson.name">
                            <div class="lesson-badges">
                                <span class="lesson-badge duration-badge">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                    {{ activeLesson.duration }}min
                                </span>
                                <span class="lesson-badge status-badge" :class="{ 'status-active': activeLesson.id === activeLessonId, 'status-completed': activeLesson.id !== activeLessonId && completedLessonIds.includes(activeLesson.id) }">
                                    <span class="status-indicator"></span>
                                    {{ activeLesson.id === activeLessonId ? 'Em andamento' : completedLessonIds.includes(activeLesson.id) ? 'Concluída' : 'Não iniciada' }}
                                </span>
                            </div>
                        </div>
                        <div class="completion-bar" v-if="activeLesson.name">
                            <div class="completion-progress" :style="{ width: '50%' }"></div>
                        </div>
                    </div>
                    <div class="video-player" v-if="activeLesson.name">
                        <div class="video-overlay">
                            <div class="play-button-container">
                                <div class="play-button">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M8 5v14l11-7z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
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
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8) !important;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 70px 20px;
    overflow-y: auto;
    overflow-x: hidden;
    z-index: 10001 !important;
    cursor: pointer;
    box-sizing: border-box;
}

.student-preview-app {
    width: 100%;
    max-width: 1400px;
    max-height: calc(100vh - 140px);
    display: flex;
    flex-direction: column;
    background: #1e1e1e;
    cursor: default;
    position: relative;
    z-index: 10002 !important;
    margin: auto;
    box-sizing: border-box;
    border-radius: 12px;
    overflow-y: auto;
}

.btn-close-preview {
    position: absolute;
    top: 15px;
    right: 15px;
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    padding: 10px;
    font-size: 0.9rem;
    z-index: 10003 !important;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.2);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    transition: all 0.2s ease;
}

.btn-close-preview:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
}

.btn-close-preview:active {
    transform: scale(0.95);
}

.btn-close-preview svg {
    width: 20px;
    height: 20px;
}

.preview-grid {
    display: flex;
    flex: 1;
    align-items: stretch;
    min-height: 0;
}

.course-sidebar {
    width: 350px;
    min-width: 350px;
    background: #252525;
    padding: 20px 0;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #333;
    flex-shrink: 0;
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
    text-align: left;
}

.course-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: #f0f2f5;
    text-align: left;
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
    flex: 1;
    min-width: 0;
    background: #1e1e1e;
    display: flex;
    flex-direction: column;
    align-items: stretch;
}
.content-header {
    padding: 24px 32px;
    background: linear-gradient(135deg, #0f1013 0%, #1a1a1a 100%);
    border-bottom: 1px solid rgba(34, 197, 94, 0.1);
    position: relative;
    width: 100%;
    box-sizing: border-box;
    align-self: stretch;
}
.lesson-title {
    font-size: 1.75rem;
    margin-bottom: 16px;
    font-weight: 700;
    color: #f0f2f5;
    letter-spacing: -0.02em;
    line-height: 1.3;
}
.lesson-meta-container {
    margin-bottom: 16px;
}
.lesson-badges {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}
.lesson-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s ease;
}
.duration-badge {
    background: rgba(255, 255, 255, 0.05);
    color: #8c929a;
    border: 1px solid rgba(255, 255, 255, 0.1);
}
.duration-badge svg {
    width: 14px;
    height: 14px;
    color: #8c929a;
}
.status-badge {
    background: rgba(34, 197, 94, 0.1);
    color: rgb(34, 197, 94);
    border: 1px solid rgba(34, 197, 94, 0.2);
}
.status-badge.status-completed {
    background: rgba(34, 197, 94, 0.15);
    color: rgb(34, 197, 94);
    border: 1px solid rgba(34, 197, 94, 0.3);
}
.status-indicator {
    width: 8px;
    height: 8px;
    background: rgb(34, 197, 94);
    border-radius: 50%;
    display: inline-block;
    animation: pulse 2s infinite;
}
@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}
.completion-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: rgba(255, 255, 255, 0.05);
    overflow: hidden;
}
.completion-progress {
    height: 100%;
    background: linear-gradient(90deg, rgb(34, 197, 94) 0%, rgba(34, 197, 94, 0.6) 100%);
    transition: width 0.3s ease;
    box-shadow: 0 0 10px rgba(34, 197, 94, 0.3);
}
.video-player {
    background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400px;
    aspect-ratio: 16 / 9;
    border-radius: 12px;
    margin: 24px auto;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    width: calc(100% - 128px);
    max-width: 1200px;
    box-sizing: border-box;
    align-self: center;
}
.video-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.2);
    transition: background 0.3s ease;
    z-index: 1;
}
.video-overlay:hover {
    background: rgba(0, 0, 0, 0.3);
}
.play-button-container {
    display: flex;
    justify-content: center;
    align-items: center;
}
.play-button {
    width: 80px;
    height: 80px;
    background: rgba(34, 197, 94, 0.9);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(34, 197, 94, 0.4);
    color: #0f0f0f;
}
.play-button:hover {
    transform: scale(1.1);
    background: rgb(34, 197, 94);
    box-shadow: 0 6px 30px rgba(34, 197, 94, 0.6);
}
.play-button svg {
    width: 32px;
    height: 32px;
    margin-left: 4px;
}
.zenix-logo {
    position: absolute;
    top: 20px;
    right: 20px;
    color: rgba(34, 197, 94, 0.2);
    font-weight: 700;
    font-size: 1rem;
    letter-spacing: 0.1em;
    z-index: 2;
}
.video-placeholder-text {
    font-size: 2rem;
    color: rgba(255, 255, 255, 0.1);
    font-weight: 700;
    letter-spacing: 0.05em;
    z-index: 0;
    position: relative;
}
.content-actions {
    padding: 24px 32px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    background: rgba(15, 16, 19, 0.5);
}
.action-buttons {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
}
.btn-action-download {
    background: rgba(255, 255, 255, 0.05);
    color: #f0f2f5;
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 12px 20px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
}
.btn-action-download:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
}
.btn-action-download svg {
    width: 18px;
    height: 18px;
}
.btn-action-complete {
    background: rgb(34, 197, 94);
    color: #0f0f0f;
    padding: 12px 20px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    border: none;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}
.btn-action-complete:hover {
    background: rgb(40, 210, 105);
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(34, 197, 94, 0.4);
}
.btn-action-complete svg {
    width: 18px;
    height: 18px;
}
.btn-action-replay {
    color: #8c929a;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 8px 12px;
    border-radius: 6px;
}
.btn-action-replay:hover {
    color: rgb(34, 197, 94);
    background: rgba(34, 197, 94, 0.1);
}
.complementary-materials {
    padding: 32px;
    background: rgba(15, 16, 19, 0.3);
}
.complementary-materials h3 {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 20px;
    color: #f0f2f5;
    letter-spacing: -0.01em;
}
.materials-list {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.materials-list li {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    color: rgb(34, 197, 94);
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}
.materials-list li:hover {
    background: rgba(34, 197, 94, 0.1);
    border-color: rgba(34, 197, 94, 0.3);
    transform: translateX(4px);
}
.materials-list li svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    stroke: rgb(34, 197, 94);
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
        left: 0 !important;
    }
}

/* Mobile (≤ 768px) - Estilo igual ao CourseDetailView */
@media (max-width: 768px) {
    .preview-overlay {
        padding: 70px 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        margin-left: 0 !important;
        left: 0 !important;
        right: 0 !important;
        align-items: flex-start !important;
        justify-content: center !important;
        overflow-x: hidden !important;
        box-sizing: border-box !important;
    }

    .student-preview-app {
        height: auto;
        min-height: auto;
        max-height: calc(100vh - 140px);
        width: 80% !important;
        max-width: 80% !important;
        margin: 0 auto !important;
        background: #0b0b0b !important;
        box-sizing: border-box !important;
        overflow-x: hidden !important;
    }

    .preview-grid {
        flex-direction: column;
        width: 100% !important;
    }

    .course-content {
        width: 100% !important;
        min-height: auto;
        background: transparent;
        padding: 1rem 0.5rem;
        order: 1;
        max-width: 100% !important;
        box-sizing: border-box;
    }

    .course-sidebar {
        width: 100% !important;
        min-width: 100% !important;
        min-height: auto;
        border-right: none;
        border-top: 1px solid #1C1C1C;
        background: transparent;
        padding: 1.5rem 0.5rem;
        order: 2;
        max-width: 100% !important;
        box-sizing: border-box;
    }

    .content-header {
        padding: 1.5rem 1rem;
        background: transparent;
        border-bottom: none;
        width: 100%;
        box-sizing: border-box;
    }

    .lesson-title {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        width: 100%;
    }
    
    .lesson-badges {
        gap: 8px;
    }
    
    .lesson-badge {
        padding: 6px 12px;
        font-size: 0.8125rem;
    }

    .video-player {
        min-height: 250px;
        max-height: 400px;
        border-radius: 0.75rem;
        border: 1px solid rgba(255, 255, 255, 0.05);
        margin: 1.5rem 1rem;
        width: calc(100% - 2rem);
        box-sizing: border-box;
    }
    
    .play-button {
        width: 64px;
        height: 64px;
    }
    
    .play-button svg {
        width: 24px;
        height: 24px;
    }
    
    .zenix-logo {
        top: 12px;
        right: 12px;
        font-size: 0.75rem;
    }
    
    .video-placeholder-text {
        font-size: 1.5rem;
    }

    .content-actions {
        padding: 0 0.5rem 1.5rem 0.5rem;
        border-bottom: none;
        width: 100%;
        box-sizing: border-box;
    }

    .action-buttons {
        display: none;
    }

    .complementary-materials {
        padding: 0 0.5rem 1.5rem 0.5rem;
        width: 100%;
        box-sizing: border-box;
    }

    .complementary-materials h3 {
        font-size: 1rem;
        margin-bottom: 1rem;
    }

    .materials-list li {
        padding: 0.875rem 1rem;
        font-size: 0.8125rem;
        width: 100%;
        box-sizing: border-box;
    }

    /* Estilos do sidebar mobile */
    .course-header {
        padding: 1rem 0.5rem;
        border-bottom: none;
        width: 100%;
        box-sizing: border-box;
        text-align: left;
    }

    .course-title {
        font-size: 1.125rem;
        width: 100%;
        text-align: left;
    }

    .back-link {
        text-align: left;
    }

    .course-progress {
        padding: 1rem 0.5rem;
        background: transparent;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
        width: 100%;
        box-sizing: border-box;
    }

    .progress-text {
        font-size: 0.75rem;
        width: 100%;
    }

    .progress-bar-container {
        width: 100%;
    }

    .progress-percentage {
        font-size: 0.75rem;
    }

    .course-modules-nav {
        padding-top: 0;
        width: 100%;
        box-sizing: border-box;
    }

    .nav-module {
        margin-bottom: 0.75rem;
        background: linear-gradient(to bottom, #0e683118 0%, #0b0b0b 100%) !important;
        border: 1px solid #1C1C1C;
        border-radius: 0.5rem;
        overflow: hidden;
        width: 100% !important;
        box-sizing: border-box;
    }

    .nav-module-header {
        padding: 0.875rem 0.75rem;
        background: transparent;
        font-size: 0.875rem;
        width: 100%;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        box-sizing: border-box;
    }

    .module-title-nav {
        font-size: 0.875rem;
        line-height: 1.3;
        color: #DFDFDF;
        font-weight: 600;
    }

    .nav-lessons-list {
        padding: 0.75rem 1rem 1rem 1rem;
        width: 100%;
        box-sizing: border-box;
    }

    .nav-lesson-item {
        padding: 0.75rem;
        border-left: none;
        border: 1px solid #2A2A2A;
        border-radius: 0.5rem;
        background-color: #1C1C1C;
        margin-bottom: 0.5rem;
        gap: 0.625rem;
        width: 100%;
        box-sizing: border-box;
    }

    .nav-lesson-item:last-child {
        margin-bottom: 0;
    }

    .nav-lesson-item:hover {
        background: #252525;
        border-color: #3A3A3A;
    }

    .active-lesson {
        background-color: rgba(34, 197, 94, 0.12);
        border-color: #22C55E;
        border-width: 2px;
    }

    .active-lesson .lesson-name {
        color: #DFDFDF;
        font-weight: 500;
    }

    .nav-lesson-item .lesson-info {
        font-size: 0.875rem;
        flex-direction: row;
        align-items: center;
        gap: 0.625rem;
        width: 100%;
    }

    .nav-lesson-item .lesson-name {
        font-size: 0.8125rem;
        color: #8D8D8D;
    }

    .nav-lesson-item .lesson-duration {
        font-size: 0.6875rem;
        color: #525252;
        background: transparent;
        padding: 0;
    }

    .active-lesson .lesson-duration {
        color: #22C55E;
    }

    .unlock-tip {
        padding: 1rem 0.5rem;
        font-size: 0.6875rem;
        border-top: 1px solid #1C1C1C;
        text-align: left;
        width: 100%;
        box-sizing: border-box;
    }

    .btn-close-preview {
        top: 10px;
        right: 10px;
        width: 36px;
        height: 36px;
        padding: 8px;
    }

    .btn-close-preview svg {
        width: 18px;
        height: 18px;
    }
}

/* Mobile pequeno (≤ 480px) */
@media (max-width: 480px) {
    .preview-overlay {
        padding: 70px 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        overflow-x: hidden !important;
        box-sizing: border-box !important;
    }

    .student-preview-app {
        width: 80% !important;
        max-width: 80% !important;
        max-height: calc(100vh - 140px);
        margin: 0 auto !important;
        background: #0b0b0b !important;
        box-sizing: border-box !important;
        overflow-x: hidden !important;
    }

    .preview-grid {
        width: 100% !important;
    }

    .course-content {
        padding: 1rem;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box;
    }

    .course-sidebar {
        padding: 1rem;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box;
    }

    .video-player {
        max-height: 300px;
        border-radius: 0.375rem;
        width: 100%;
        box-sizing: border-box;
    }

    .lesson-title {
        font-size: 1.125rem;
        width: 100%;
    }

    .content-header {
        padding: 1rem;
        width: 100%;
        box-sizing: border-box;
    }

    .content-actions {
        padding: 0 1rem 1.5rem 1rem;
        width: 100%;
        box-sizing: border-box;
    }

    .complementary-materials {
        padding: 0 1rem 1.5rem 1rem;
        width: 100%;
        box-sizing: border-box;
    }

    .course-header {
        padding: 1rem;
        width: 100%;
        box-sizing: border-box;
        text-align: left;
    }

    .back-link {
        text-align: left;
    }

    .course-title {
        text-align: left;
    }

    .course-progress {
        padding: 1rem;
        width: 100%;
        box-sizing: border-box;
    }

    .nav-module {
        width: 100% !important;
        box-sizing: border-box;
    }

    .nav-module-header {
        padding: 0.625rem 0.75rem;
        font-size: 0.8125rem;
        width: 100%;
        box-sizing: border-box;
    }

    .module-title-nav {
        font-size: 0.8125rem;
        line-height: 1.3;
    }

    .nav-lessons-list {
        padding: 0.625rem 0.75rem 0.75rem 0.75rem;
        width: 100%;
        box-sizing: border-box;
    }

    .nav-lesson-item {
        padding: 0.625rem;
        gap: 0.625rem;
        width: 100%;
        box-sizing: border-box;
    }

    .nav-lesson-item .lesson-info {
        font-size: 0.8125rem;
        width: 100%;
    }

    .nav-lesson-item .lesson-name {
        font-size: 0.8125rem;
        line-height: 1.3;
    }

    .nav-lesson-item .lesson-duration {
        font-size: 0.6875rem;
        margin-top: 0.125rem;
    }

    .unlock-tip {
        padding: 1rem;
        font-size: 0.6875rem;
        width: 100%;
        box-sizing: border-box;
    }

    .materials-list li {
        width: 100%;
        box-sizing: border-box;
    }
}
</style>