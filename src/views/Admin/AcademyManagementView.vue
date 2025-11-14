<template>
    <div class="layout" ref="layoutContainer">
        <AppSidebar :is-open="isSidebarOpen" :is-collapsed="isSidebarCollapsed" @toggle-collapse="toggleSidebarCollapse" />

        <main class="layout-content">
            <div class="background-glow"></div>
            <div class="background-grid"></div>
            
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
                        <button class="btn btn-preview">Preview do Aluno</button>
                        <button class="btn btn-publish">Publicar</button>
                    </div>
                </header>

                <div class="content-sections">
                    <section class="card course-info-section">
                        <h2 class="card-title">Informações do Curso</h2>
                        
                        <div class="form-group">
                            <label for="course-name">Nome do Curso</label>
                            <input type="text" id="course-name" class="input-text" v-model="course.name" />
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
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 4V20M4 12H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
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
                            <textarea id="course-description" class="input-textarea" :placeholder="course.description" v-model="course.description"></textarea>
                        </div>
                    </section>
                    
                    <hr class="section-divider">

                    <section class="card modules-section">
                        <h2 class="card-title">Módulos e Aulas</h2>
                        <p class="card-subtitle">Selecione o curso, adicione módulos e crie aulas dentro de cada módulo.</p>

                        <div class="form-group course-selection-group">
                            <label for="select-course">Selecionar Curso</label>
                            <div class="input-with-icon">
                                <select id="select-course" class="input-select" v-model="course.selectedCourseId">
                                    <option :value="null">Escolha um curso...</option>
                                    </select>
                                <button class="btn btn-icon" title="Atualizar Lista">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 4.2C17.3 1.5 13.8 0 10 0C4.5 0 0 4.5 0 10C0 15.5 4.5 20 10 20C13.5 20 16.6 18.2 18.5 15.4L16.7 13.6C15.2 16.1 12.8 17.6 10 17.6C5.9 17.6 2.4 14.1 2.4 10C2.4 5.9 5.9 2.4 10 2.4C12.8 2.4 15.2 3.9 16.7 6.4L13 10H20V4.2Z" fill="currentColor"/></svg>
                                    Atualizar Lista
                                </button>
                            </div>
                        </div>

                        <div class="modules-list-container">
                            <div class="list-header">
                                <h3 class="list-title">Módulos do Curso Selecionado</h3>
                                <button class="btn btn-primary" title="Adicionar Novo Módulo" @click="openNewModuleModal">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4V20M4 12H20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                    Novo Módulo
                                </button>
                            </div>

                            <div v-for="module in modules" :key="module.id" class="module-item">
                                <span class="module-title">{{ module.title }}</span>
                                <div class="module-actions">
                                    <button class="btn btn-action-icon edit-btn" title="Editar Módulo">Editar</button>
                                    <button class="btn btn-action-icon delete-btn" title="Excluir Módulo">Excluir</button>
                                    <button class="btn btn-secondary add-lesson-btn" title="Adicionar Nova Aula">Adicionar Aula</button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <div v-if="isNewModuleModalOpen" class="modal-overlay">
                <div class="modal-content new-module-card">
                    <h2 class="card-title">Módulos e Aulas</h2>
                    <p class="card-subtitle-modal">Selecione o curso, adicione módulos e crie aulas dentro de cada módulo.</p>

                    <div class="form-group">
                        <label for="modal-select-course">Selecionar Curso</label>
                        <div class="input-with-icon">
                            <select id="modal-select-course" class="input-select" v-model="course.selectedCourseId">
                                <option :value="null">Escolha um curso...</option>
                                </select>
                            <button class="btn btn-icon" title="Atualizar Lista">Atualizar Lista</button>
                        </div>
                    </div>

                    <div class="modules-list-container-modal">
                          <div class="list-header">
                            <h3 class="list-title">Módulos do Curso Selecionado</h3>
                            <button class="btn btn-primary btn-modal-module" disabled>
                                Novo Módulo
                            </button>
                        </div>
                        
                        <div class="module-item module-item-selected">
                            <span class="module-title">Módulo 1: Introdução ao Mercado</span>
                        </div>
                    </div>

                    <div class="create-module-form">
                        <h3 class="form-section-title">Criar Novo Módulo</h3>
                        
                        <div class="form-group">
                            <label for="module-name">Nome do Módulo</label>
                            <input type="text" id="module-name" class="input-text" v-model="newModule.name" placeholder="Ex: Introdução ao Mercado" />
                        </div>
                        
                        <div class="form-group">
                            <label for="module-description">Descrição Curta (Opcional)</label>
                            <textarea id="module-description" class="input-textarea" v-model="newModule.shortDescription" placeholder="Breve descrição do módulo..."></textarea>
                        </div>

                        <div class="modal-actions">
                            <button class="btn btn-save-module" @click="saveNewModule">Salvar Módulo</button>
                            <button class="btn btn-cancel" @click="closeNewModuleModal">Cancelar</button>
                        </div>
                    </div>

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
            // Variáveis de Controle de Layout
            isSidebarOpen: true, 
            isSidebarCollapsed: false,
            
            // Variáveis de Estado do Formulário (Informações do Curso)
            course: {
                name: 'Mestre do Day Trade', // Valor inicial da imagem
                description: 'Descreva o que os alunos aprenderão neste curso.',
                coverImage: null, // O arquivo real para envio (File object)
                coverImagePreview: null, // URL da pré-visualização da imagem (String)
                selectedCourseId: null,
            },

            // Variáveis de Estado do Modal de Novo Módulo
            isNewModuleModalOpen: false,
            newModule: {
                name: '',
                shortDescription: ''
            },
            
            // Exemplo de Dados Estruturados para Módulos
            modules: [
                { id: 1, title: 'Módulo 1: Introdução ao Mercado', lessons: 5, status: 'published' }
            ]
        };
    },
    methods: {
        // Métodos de Controle de Layout
        toggleSidebar() {
            this.isSidebarOpen = !this.isSidebarOpen;
        },
        toggleSidebarCollapse() {
            this.isSidebarCollapsed = !this.isSidebarCollapsed;
        },

        // NOVO MÉTODO: Lidar com Upload da Imagem de Capa e Pré-visualização
        handleCoverUpload(event) {
            const file = event.target.files[0];
            if (file) {
                // 1. Armazena o objeto File real para ser enviado ao servidor
                this.course.coverImage = file;
                
                // 2. Cria uma URL temporária para pré-visualização
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

        // Métodos de Controle do Modal de Novo Módulo
        openNewModuleModal() {
            this.isNewModuleModalOpen = true;
            this.newModule = { name: '', shortDescription: '' }; // Limpa o formulário ao abrir
        },
        closeNewModuleModal() {
            this.isNewModuleModalOpen = false;
        },
        saveNewModule() {
            // Lógica para salvar o novo módulo (chamar API)
            console.log('Novo Módulo Salvo:', this.newModule);
            // Simular adição à lista:
            this.modules.push({ 
                id: Date.now(), 
                title: this.newModule.name, 
                lessons: 0, 
                status: 'draft' 
            });
            this.closeNewModuleModal();
        },
        
        // Métodos de Ação do Curso
        saveCourse() {
            console.log('Salvando Curso:', this.course);
            // Lógica para salvar o curso
        }
    }
}
</script>

<style scoped>
/*
 * CORES FIXAS (DARK THEME)
 */
/* Cores utilizadas: */
/* Fundo Principal: #0f1013 */
/* Fundo Cartão/Modal: #171a20 */
/* Texto Claro: #f0f2f5 */
/* Texto Muted/Secundário: #8c929a */
/* Verde Neon (Primary): #00ff7f */
/* Botão Secundário/Fundo Input: #33363d */
/* Borda: #2c3038 */
/* Azul de Ação: #007bff */
/* Vermelho de Excluir: #ff4d4f */

.layout-content {
    flex-grow: 1;
    padding: 30px;
    background-color: #0f1013; /* Fundo Principal */
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
    color: #f0f2f5; /* Texto Claro */
}

.container {
    position: relative;
    width: 100%;
    margin: 0 auto;
    padding: 20px 0;
    z-index: 10;
}

/*
 * ESTILOS DO CABEÇALHO E BOTÕES DE AÇÃO
 */

.header-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
.page-header {
    display: flex;
    flex-direction: column;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #2c3038; /* Borda */
}

.page-subtitle {
    color: #8c929a; /* Texto Muted */
    font-size: 1rem;
    margin-bottom: 20px;
}

.header-actions {
    display: flex;
    gap: 10px;
    align-self: flex-end;
    position: absolute;
    top: 20px;
    right: 0;
}

.btn {
    padding: 10px 18px;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.9rem;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.btn-save {
    background-color: #007bff; /* Azul de Ação */
    color: white;
}

.btn-preview {
    background-color: #33363d; /* Botão Secundário */
    color: #f0f2f5; /* Texto Claro */
    border: 1px solid #2c3038; /* Borda */
}

.btn-publish {
    background-color: #00ff7f; /* Verde Neon (Primary) */
    color: #0f1013; /* Fundo Principal */
}

.btn:hover {
    opacity: 0.9;
}

/*
 * ESTILOS DE CARTÃO E INPUTS
 */
.card {
    background-color: #171a20; /* Fundo Cartão/Modal */
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    margin-bottom: 30px;
    border: 1px solid #2c3038; /* Borda */
}

.card-title {
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #2c3038; /* Borda */
}

.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    font-size: 0.9rem;
    font-weight: 500;
    color: #8c929a; /* Texto Muted */
    margin-bottom: 8px;

}

label, h2{
    text-align: left;
}

.input-text,
.input-textarea,
.input-select {
    width: 100%;
    padding: 12px 15px;
    background-color: #0f1013; /* Fundo Principal */
    border: 1px solid #2c3038; /* Borda */
    border-radius: 6px;
    color: #f0f2f5; /* Texto Claro */
    font-size: 1rem;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
    transition: border-color 0.2s;
}

.input-text:focus,
.input-textarea:focus,
.input-select:focus {
    border-color: #00ff7f; /* Verde Neon (Primary) */
    outline: none;
}

.input-textarea {
    resize: vertical;
    min-height: 100px;
}

/*
 * ESTILOS DE UPLOAD DE CAPA (Modificado)
 */
.cover-upload-area {
    display: flex;
    align-items: center;
    gap: 30px;
}

.upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 120px;
    border: 2px dashed #2c3038; /* Borda */
    border-radius: 8px;
    color: #8c929a; /* Texto Muted */
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s, opacity 0.2s;
}

.upload-placeholder:hover {
    border-color: #00ff7f; /* Verde Neon */
    color: #00ff7f;
}

.hidden-on-preview {
    opacity: 0.5; /* Suaviza o placeholder quando uma imagem está em preview */
}

.cover-preview-box {
    width: 250px;
    height: 140.625px; /* Proporção 16:9 */
    background-color: #33363d; /* Botão Secundário */
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8c929a; /* Texto Muted */
    border-radius: 6px;
    overflow: hidden; /* Importante para o preview da imagem */
}

/* NOVO ESTILO: Garante que a imagem de preview preencha o box */
.cover-image-preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
}


/*
 * ESTILOS DE SELEÇÃO DE CURSO (MÓDULOS E AULAS)
 */
.input-with-icon {
    display: flex;
    gap: 10px;
    align-items: center;
}

.input-with-icon .input-select {
    flex-grow: 1;
}

.btn-icon {
    background-color: transparent;
    border: none;
    color: #8c929a; /* Texto Muted */
    padding: 0;
    font-weight: 400;
    transition: color 0.2s;
}

.btn-icon:hover {
    color: #00ff7f; /* Verde Neon */
}

/*
 * ESTILOS DA LISTA DE MÓDULOS
 */
.modules-list-container {
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid #2c3038; /* Borda */
}

.list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.btn-primary {
    background-color: #00ff7f; /* Verde Neon (Primary) */
    color: #0f1013; /* Fundo Principal */
    font-size: 0.85rem;
}

.btn-secondary {
    background-color: #33363d; /* Botão Secundário */
    color: #f0f2f5; /* Texto Claro */
    font-size: 0.85rem;
    border: 1px solid #2c3038; /* Borda */
}

.module-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background-color: #0f1013; /* Fundo Principal */
    border: 1px solid #2c3038; /* Borda */
    border-radius: 6px;
    margin-bottom: 10px;
}

.module-actions {
    display: flex;
    gap: 15px;
    align-items: center;
}

.btn-action-icon {
    background: none;
    border: none;
    color: #8c929a; /* Texto Muted */
    font-size: 0.85rem;
    padding: 5px 10px;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: color 0.2s;
}

.edit-btn:hover {
    color: #007bff; /* Azul de Ação */
}

.delete-btn {
    color: #ff4d4f; /* Vermelho de Excluir */
}

.delete-btn:hover {
    color: #ff7875;
}

.add-lesson-btn {
    padding: 8px 15px;
}

/*
 * ESTILOS DO MODAL
 */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: #171a20; /* Fundo Cartão/Modal */
    padding: 30px;
    border-radius: 10px;
    width: 90%;
    max-width: 600px; /* Adicionado para melhor visualização do modal */
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
    border: 1px solid #2c3038; /* Borda */
}

.card-subtitle-modal {
    color: #8c929a;
    margin-bottom: 30px;
}

.modules-list-container-modal {
    margin-bottom: 25px;
}

.module-item-selected {
    background-color: #171a20; /* Igual ao modal para parecer que está na mesma área */
    border: 1px solid #00ff7f; /* Borda Neon para indicar seleção */
    color: #00ff7f;
    padding-right: 20px;
    margin-bottom: 20px;
}

.module-item-selected .module-title {
    font-weight: 700;
}

.btn-modal-module {
    background-color: #00ff7f;
    pointer-events: none; /* Desabilita o botão como na imagem */
    opacity: 1;
}

.create-module-form {
    padding-top: 20px;
    border-top: 1px solid #2c3038;
}

.form-section-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #f0f2f5;
    margin-bottom: 20px;
}

.modal-actions {
    display: flex;
    justify-content: flex-start;
    gap: 10px;
    margin-top: 30px;
}

.btn-save-module {
    background-color: #00ff7f; /* Verde Neon */
    color: #0f1013;
}

.btn-cancel {
    background-color: #33363d;
    color: #f0f2f5;
    border: 1px solid #2c3038;
}
</style>