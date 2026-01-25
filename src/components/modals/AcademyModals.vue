<template>
  <div>
    <!-- Modal de Novo Módulo -->
    <div v-if="isNewModuleModalOpen" class="modal-overlay" @click.self="closeNewModuleModal">
      <div class="modal-content new-module-card">
        <h2 class="card-title">{{ newModule.id ? 'Editar Módulo' : 'Adicionar Módulo' }}</h2>
        <p class="card-subtitle-modal">Defina o nome e a descrição do módulo para este curso.</p>
        <div class="create-module-form">
          <div class="form-group">
            <label for="module-name">Nome do Módulo</label>
            <input type="text" id="module-name" class="input-text" :value="newModule.name" @input="updateNewModule({ name: $event.target.value })" placeholder="Ex: Introdução ao Mercado" />
          </div>
          <div class="form-group">
            <label for="module-description">Descrição Curta (Opcional)</label>
            <textarea id="module-description" class="input-textarea" :value="newModule.shortDescription" @input="updateNewModule({ shortDescription: $event.target.value })" placeholder="Breve descrição do módulo..."></textarea>
          </div>
          <div class="modal-actions">
            <button class="btn btn-save-module" @click="saveNewModule" :disabled="!newModule.name">
              {{ newModule.id ? 'Salvar Alterações' : 'Adicionar Módulo' }}
            </button>
            <button class="btn btn-cancel" @click="closeNewModuleModal">Cancelar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Nova Aula -->
    <div v-if="isNewLessonModalOpen" class="modal-overlay" @click.self="closeNewLessonModal">
      <div class="modal-content new-lesson-card">
        <h2 class="card-title">{{ newLesson.id ? 'Editar Aula' : 'Nova Aula' }} no Módulo: {{ selectedModuleForLesson.title || 'Selecione um Módulo' }}</h2>
        <p class="card-subtitle-modal">{{ newLesson.id ? 'Atualize as informações da aula.' : 'Crie o conteúdo da nova aula e defina as configurações de acesso.' }}</p>
        <div class="form-group" v-if="!newLesson.moduleId">
          <label for="modal-select-module">Selecionar Módulo</label>
          <select id="modal-select-module" class="input-select" :value="newLesson.moduleId" @change="updateNewLesson({ moduleId: $event.target.value })">
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
            <input type="text" id="lesson-name" class="input-text" :value="newLesson.name" @input="updateNewLesson({ name: $event.target.value })" placeholder="Ex: Conceitos Básicos" :disabled="!newLesson.moduleId" />
          </div>
          <div class="form-group half-width-group">
            <div class="half-group">
              <label for="content-type">Tipo de Conteúdo</label>
              <select
                id="content-type"
                class="input-select"
                :value="newLesson.contentType"
                @change="handleContentTypeChange($event.target.value)"
                :disabled="!newLesson.moduleId"
              >
                <option value="Video">Vídeo</option>
                <option value="Text">Texto</option>
                <option value="PDF">PDF</option>
              </select>
            </div>
            <div class="half-group">
              <label for="duration">Duração (minutos)</label>
              <input type="number" id="duration" class="input-text" :value="newLesson.duration" @input="updateNewLesson({ duration: Number($event.target.value) || 0 })" placeholder="15" min="1" :disabled="!newLesson.moduleId" />
            </div>
          </div>
          <div class="form-group" v-if="newLesson.contentType === 'Video'">
            <label for="video-source">Origem do Vídeo</label>
            <select id="video-source" class="input-select" :value="newLesson.videoSource || 'upload'" @change="updateNewLesson({ videoSource: $event.target.value })" :disabled="!newLesson.moduleId">
              <option value="upload">Fazer Upload de Vídeo</option>
              <option value="external">Vídeo Externo (YouTube/Vimeo)</option>
            </select>
          </div>

          <div class="form-group" v-if="newLesson.contentType === 'Video' && (newLesson.videoSource === 'upload' || !newLesson.videoSource)">
            <label for="lesson-video">Upload do Vídeo</label>
            <input
              type="file"
              id="lesson-video"
              class="input-file"
              accept="video/*"
              @change="handleVideoUpload"
              :disabled="!newLesson.moduleId"
            />
            <p v-if="newLesson.videoFileName" class="video-file-info">
              Vídeo selecionado: {{ newLesson.videoFileName }}
              <button type="button" class="btn btn-link" @click="removeVideoFile">Remover</button>
            </p>
            <p v-else-if="newLesson.videoPath" class="video-file-info">
              Vídeo enviado: {{ newLesson.videoPath.split('/').pop() }}
            </p>
          </div>

          <div class="form-group" v-if="newLesson.contentType === 'Video' && newLesson.videoSource === 'external'">
            <label for="video-url">URL do Vídeo (YouTube ou Vimeo)</label>
            <input
              type="url"
              id="video-url"
              class="input-text"
              :value="newLesson.videoPath"
              @input="updateNewLesson({ videoPath: $event.target.value })"
              placeholder="Ex: https://www.youtube.com/watch?v=..."
              :disabled="!newLesson.moduleId"
            />
          </div>
          <div class="form-group" v-else>
            <label for="content-link">Link do Conteúdo</label>
            <input
              type="url"
              id="content-link"
              class="input-text"
              :value="newLesson.contentLink"
              @input="updateNewLesson({ contentLink: $event.target.value })"
              placeholder="https://..."
              :disabled="!newLesson.moduleId"
            />
          </div>
          <div class="form-group release-status-group">
            <div class="release-group">
              <label for="release">Liberação</label>
              <select id="release" class="input-select" :value="newLesson.releaseType" @change="updateNewLesson({ releaseType: $event.target.value })" :disabled="!newLesson.moduleId">
                <option value="Imediata">Imediata</option>
                <option value="Agendada">Agendada</option>
              </select>
            </div>
            <div class="status-group">
              <label for="status">Status</label>
              <div class="toggle-switch-container">
                <span class="toggle-label">{{ newLesson.isActive ? 'Ativa' : 'Inativa' }}</span>
                <label class="toggle-switch">
                  <!-- Use @change para checkboxes -->
                  <input type="checkbox" :checked="newLesson.isActive" @change="updateNewLesson({ isActive: $event.target.checked })" :disabled="!newLesson.moduleId">
                  <span class="slider round"></span>
                </label>
              </div>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn btn-save-lesson" @click="saveNewLesson" :disabled="!newLesson.moduleId || !newLesson.name || isSavingLesson">
              <span v-if="isSavingLesson" class="loader"></span>
              {{ isSavingLesson ? 'Salvando...' : (newLesson.id ? 'Salvar Alterações' : 'Salvar Aula') }}
            </button>
            <button class="btn btn-cancel" @click="closeNewLessonModal" :disabled="isSavingLesson">Cancelar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Exclusão de Aula -->
    <div v-if="isDeleteLessonModalOpen" class="modal-overlay" @click.self="closeDeleteLessonModal">
      <div class="modal-content delete-confirmation-card">
        <h2 class="card-title">Excluir Aula</h2>
        <p class="card-subtitle-modal">Tem certeza que deseja excluir a aula <strong>"{{ lessonToDelete?.name || lessonToDelete?.title }}"</strong>?</p>
        <div class="modal-actions">
          <button class="btn btn-delete-confirm" @click="confirmDeleteLesson">
            Confirmar Exclusão
          </button>
          <button class="btn btn-cancel" @click="closeDeleteLessonModal">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Modal de Materiais -->
    <div v-if="isMaterialsModalOpen" class="modal-overlay" @click.self="closeMaterialsModal">
      <div class="modal-content materials-modal-card">
        <h2 class="card-title">Materiais da Aula: {{ selectedLessonForMaterials.name }}</h2>
        <p class="card-subtitle-modal">Gerencie arquivos, links e materiais de apoio para esta aula.</p>
        <div class="add-material-section card-border-section">
          <div class="section-header-flex">
            <h3 class="form-section-title">{{ newMaterial.id ? 'Editar Material' : 'Adicionar Novo Material' }}</h3>
             <button v-if="newMaterial.id" class="btn btn-cancel-small" @click="cancelEditMaterial">Cancelar Edição</button>
          </div>
          <div class="form-group">
            <label for="material-name">Nome do Arquivo/Material</label>
            <input type="text" id="material-name" class="input-text" :value="newMaterial.name" @input="updateNewMaterial({ name: $event.target.value })" placeholder="Ex: PDF de Exercícios" />
          </div>
          <div class="form-group half-width-group">
            <div class="half-group">
              <label for="material-type">Tipo</label>
              <select id="material-type" class="input-select" :value="newMaterial.type" @change="updateNewMaterial({ type: $event.target.value })">
                <option value="PDF">PDF</option>
                <option value="DOC">Documento (DOC/TXT)</option>
                <option value="XLS">Planilha (XLS)</option>
                <option value="PPT">Apresentação (PPT)</option>
                <option value="LINK">Link Externo (URL)</option>
                <option value="OTHER">Outros Arquivos</option>
              </select>
            </div>
            <div class="half-group">
              <label v-if="newMaterial.type === 'LINK'" for="material-link">Link do Arquivo (URL)</label>
              <label v-else for="material-file">Upload do Arquivo</label>
              
              <input v-if="newMaterial.type === 'LINK'" type="url" id="material-link" class="input-text" :value="newMaterial.link" @input="updateNewMaterial({ link: $event.target.value })" placeholder="https://link-para-o-material.com/arquivo" />
              <div v-else class="file-upload-wrapper">
                <input type="file" id="material-file" class="input-file" @change="handleMaterialFileUpload" />
                <p v-if="newMaterial.fileName" class="video-file-info">
                  Arquivo: {{ newMaterial.fileName }}
                  <button type="button" class="btn btn-link" @click="removeMaterialFile">Remover</button>
                </p>
                <p v-else-if="newMaterial.filePath" class="video-file-info">
                   Arquivo salvo: {{ newMaterial.filePath.split('/').pop() }}
                   <span class="file-change-hint">(Envie novo arquivo para substituir)</span>
                </p>
              </div>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn btn-primary" @click="saveNewMaterial" :disabled="!newMaterial.name || (newMaterial.type === 'LINK' ? !newMaterial.link : !newMaterial.file && !newMaterial.filePath)">
               {{ newMaterial.id ? 'Salvar Alterações' : 'Salvar Material' }}
            </button>
          </div>
        </div>
        <div class="materials-list-section card-border-section" v-if="getMaterialCountForLesson(normalizedSelectedLessonId) > 0">
          <h3 class="form-section-title">Materiais Atuais ({{ getMaterialCountForLesson(normalizedSelectedLessonId) }})</h3>
          <ul class="modal-materials-list">
            <li v-for="material in materialsForSelectedLesson" :key="material.id" class="material-item">
              <div class="material-info">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="file-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                <span class="material-name-display">{{ material.name }}</span>
                <span class="material-type-tag">{{ material.type }}</span>
              </div>
              <div class="material-actions">
                <a :href="material.link" target="_blank" class="btn btn-action-icon edit-btn" title="Visualizar Link" v-if="material.link">Abrir</a>
                <button class="btn btn-action-icon edit-btn" title="Editar" @click="editMaterial(material)">
                     <img src="../../assets/icons/edit-academy.svg" alt="" filter="invert(1)" width="14" height="14">
                </button>
                <button class="btn btn-action-icon delete-btn" title="Excluir" @click="deleteMaterial(material.id)">Excluir</button>
              </div>
            </li>
          </ul>
        </div>
        <div v-else class="list-placeholder">
          Nenhum material de apoio adicionado para esta aula.
        </div>
        <div class="modal-actions-footer">
          <button class="btn btn-cancel" @click="closeMaterialsModal">Fechar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AcademyModals',
  props: {
    // Propriedades que o componente pai passa
    isNewModuleModalOpen: Boolean,
    isNewLessonModalOpen: Boolean,
    isMaterialsModalOpen: Boolean,
    selectedLessonIdForMaterials: {
      type: [String, Number],
      default: null,
    },
    selectedLessonForMaterials: Object,
    courses: Array,
    modules: Array,
    materialsList: Array,
    newModule: Object,
    newLesson: Object,
    newMaterial: Object,
    isSavingLesson: {
      type: Boolean,
      default: false,
    },
    isDeleteLessonModalOpen: Boolean,
    lessonToDelete: Object,
  },
  emits: [
    'closeNewModuleModal',
    'closeNewLessonModal',
    'closeMaterialsModal',
    'saveNewModule',
    'saveNewLesson',
    'saveNewMaterial',
    'deleteMaterial',
    'closeDeleteLessonModal',
    'confirmDeleteLesson',
    // Novos eventos para atualizar os objetos no pai
    'update:new-module',
    'update:new-lesson',
    'update:new-material',
    'edit-material',
    'cancel-edit-material',
  ],
  computed: {
    selectedModuleForLesson() {
      const moduleInModal = this.modules.find(module => module.id === this.newLesson.moduleId);
      return moduleInModal || {};
    },
    normalizedSelectedLessonId() {
      if (this.selectedLessonIdForMaterials === null || this.selectedLessonIdForMaterials === undefined) {
        return null;
      }
      return this.selectedLessonIdForMaterials.toString();
    },
    materialsForSelectedLesson() {
      if (!this.normalizedSelectedLessonId) {
        return [];
      }
      return this.materialsList.filter(m => m.lessonId === this.normalizedSelectedLessonId);
    },
  },
  methods: {
    getMaterialCountForLesson(lessonId) {
      if (!lessonId && lessonId !== 0) {
        return 0;
      }
      const normalizedId = lessonId.toString();
      return this.materialsList.filter(m => m.lessonId === normalizedId).length;
    },
    closeNewModuleModal() {
      this.$emit('closeNewModuleModal');
    },
    closeNewLessonModal() {
      this.$emit('closeNewLessonModal');
    },
    closeDeleteLessonModal() {
      this.$emit('closeDeleteLessonModal');
    },
    confirmDeleteLesson() {
      this.$emit('confirm-delete-lesson');
    },
    closeMaterialsModal() {
      this.$emit('closeMaterialsModal');
    },
    saveNewModule() {
      this.$emit('saveNewModule');
    },
    saveNewLesson() {
      this.$emit('saveNewLesson');
    },
    saveNewMaterial() {
      this.$emit('saveNewMaterial');
    },
    editMaterial(material) {
      this.$emit('edit-material', material);
    },
    cancelEditMaterial() {
      this.$emit('cancel-edit-material');
    },
    deleteMaterial(materialId) {
      this.$emit('deleteMaterial', materialId);
    },
    // Métodos para emitir atualizações dos objetos
    updateNewModule(updates) {
      // Combina o objeto atual com as atualizações
      this.$emit('update:new-module', { ...this.newModule, ...updates });
    },
    updateNewLesson(updates) {
      // Combina o objeto atual com as atualizações
      this.$emit('update:new-lesson', { ...this.newLesson, ...updates });
    },
    updateNewMaterial(updates) {
      // Combina o objeto atual com as atualizações
      this.$emit('update:new-material', { ...this.newMaterial, ...updates });
    },
    handleContentTypeChange(value) {
      const updates = { contentType: value };
      if (value !== 'Video') {
        updates.videoFile = null;
        updates.videoFileName = '';
        updates.videoPath = '';
      }
      this.updateNewLesson(updates);
    },
    handleVideoUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.updateNewLesson({ videoFile: file, videoFileName: file.name, videoPath: '' });
      } else {
        this.removeVideoFile();
      }
    },
    removeVideoFile() {
      this.updateNewLesson({ videoFile: null, videoFileName: '', videoPath: '' });
    },
    handleMaterialFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.updateNewMaterial({ file: file, fileName: file.name, filePath: '', link: '' });
      } else {
        this.removeMaterialFile();
      }
    },
    removeMaterialFile() {
      this.updateNewMaterial({ file: null, fileName: '', filePath: '' });
    },
  },
};
</script>

<style scoped>
/* O CSS abaixo é uma cópia específica para os modais */
/* --- Estilos Gerais dos Modais --- */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.384);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow-y: auto;
}

.modal-content {
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  box-shadow: 0 8px 25px rgba(0, 0, 0, .5);
  background: #171a20;
  padding: 30px;
  border-radius: 10px;
  border: 1px solid #2c3038;
  overflow-y: auto;
  margin: 20px 0;
}

.new-lesson-card {
  max-width: 700px;
}

.card-subtitle-modal {
  color: #8c929a;
  margin-bottom: 30px;
  text-align: left;
}

.modules-list-container-modal {
  margin-bottom: 25px;
}

.module-item-selected {
  background: #17382d;
  border: 1px solid #00ff7f;
  color: #00ff7f;
  padding-right: 20px;
  margin-bottom: 20px;
}

.module-item-selected .module-title {
  font-weight: 700;
}

.btn-modal-module {
  pointer-events: none;
  opacity: 1;
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

.video-file-info {
  margin-top: 8px;
  font-size: 0.85rem;
  color: #cbd5f5;
  display: flex;
  gap: 8px;
  align-items: center;
}

.btn-link {
  background: none;
  border: none;
  color: #00ff7f;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0;
}

.btn-link:hover {
  text-decoration: underline;
}

.btn {
  padding: 10px 18px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all .2s;
  font-size: .9rem;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn:hover:not(:disabled) {
  opacity: .9;
}

.btn-primary, .btn-save-module, .btn-save-lesson, .btn-modal-module, .btn-delete-confirm {
  background: #00ff7f;
  color: #0f1013;
}

.btn-delete-confirm {
  background: #cc5656;
  color: white;
}

.btn-cancel {
  background: #33363d;
  color: #f0f2f5;
  border: 1px solid #2c3038;
}

.btn-action-icon {
  border: 1px solid transparent;
  padding: 5px 10px;
  margin-left: 5px;
  cursor: pointer;
  font-size: 0.85em;
  border-radius: 8px;
  height: 30px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-btn {
  background: #3636364b;
}

.delete-btn {
  background: #cc5656;
}

.half-width-group {
  display: flex;
  gap: 20px;
}

.half-group {
  flex: 1;
}

.release-status-group {
  display: flex;
  justify-content: space-between;
  gap: 30px;
  align-items: flex-end;
  padding-bottom: 20px;
  border-bottom: 1px solid #2c3038;
}

.release-group {
  flex: 2;
}

.status-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.toggle-switch-container {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 12px;
}

.toggle-label {
  font-weight: 500;
  color: #f0f2f5;
  font-size: 1rem;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 45px;
  height: 34px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #333;
  transition: .4s;
  border-radius: 34px;
  height: 25px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background: #f0f2f5;
  transition: .4s;
  border-radius: 50%;
}

input:checked+.slider {
  background: #00ff7f;
}

input:focus+.slider {
  box-shadow: 0 0 1px #00ff7f;
}

input:checked+.slider:before {
  transform: translateX(18px);
}

.disabled-form {
  opacity: 0.5;
  pointer-events: none;
}

.card-title {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #2c3038;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-size: .9rem;
  font-weight: 500;
  color: #8c929a;
  margin-bottom: 5px;
}

.input-text, .input-textarea, .input-select {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid var(--color-border-subtle);
  background-color: var(--color-dark-gray-1);
  border-radius: 6px;
  color: var(--color-text-light);
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.input-text:focus, .input-textarea:focus, .input-select:focus {
  border-color: #00ff7f;
  outline: none;
}

.input-textarea {
  resize: vertical;
  min-height: 100px;
}

/* --- Estilos Específicos para o Modal de Materiais --- */
.materials-modal-card {
  max-width: 800px;
}

.add-material-section,
.materials-list-section {
  padding: 20px 0;
  margin-top: 15px;
  border-bottom: 1px solid var(--color-border);
}

.add-material-section .modal-actions {
  margin-top: 20px;
  justify-content: flex-end;
}

.modal-materials-list {
  list-style: none;
  padding: 0;
  margin: 15px 0 0 0;
}

.material-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: var(--color-dark-gray-3);
  border-radius: 4px;
  margin-bottom: 8px;
  border: 1px solid var(--color-border-subtle);
}

.material-info {
  display: flex;
  align-items: center;
  flex-grow: 1;
}

.file-icon {
  color: var(--color-text-subtle);
  margin-right: 10px;
}

.material-name-display {
  color: var(--color-text-light);
  font-weight: 500;
  flex-grow: 1;
  text-align: left;
}

.material-type-tag {
  background: var(--color-dark-gray-4);
  color: var(--color-primary);
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-right: 10px;
}

.material-actions {
  display: flex;
  gap: 10px;
}

.modal-actions-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
}

.list-placeholder {
  color: var(--color-text-subtle);
  font-style: italic;
  padding: 15px 20px;
  text-align: center;
  border: 1px dashed var(--color-border);
  border-radius: 6px;
  margin-top: 10px;
}

.loader {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(15, 16, 19, 0.3);
  border-radius: 50%;
  border-top-color: #0f1013;
  animation: spin 0.6s linear infinite;
  margin-right: 8px;
  vertical-align: middle;
}

  to {
    transform: rotate(360deg);
  }
}

.section-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header-flex .form-section-title {
  margin-bottom: 0;
}

.btn-cancel-small {
  background: transparent;
  border: 1px solid var(--color-border);
  color: #cbd5f5;
  padding: 5px 10px;
  font-size: 0.8rem;
}

.btn-cancel-small:hover {
  background: var(--color-dark-gray-3);
}

.file-change-hint {
  display: block;
  font-size: 0.75rem;
  color: #8c929a;
  font-style: italic;
  margin-top: 2px;
}
</style>