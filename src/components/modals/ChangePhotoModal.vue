<template>
  <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h3 class="modal-title">Trocar Foto de Perfil</h3>
      <div class="form-group">
        <label>Selecione uma imagem</label>
        <div class="file-input-wrapper">
          <input 
            ref="fileInput"
            type="file" 
            accept="image/*"
            @change="handleFileChange"
            class="file-input"
            id="profilePictureInput"
          />
          <label for="profilePictureInput" class="file-label">
            <i class="fas fa-cloud-upload-alt mr-2"></i>
            {{ selectedFile ? selectedFile.name : 'Escolher arquivo' }}
          </label>
        </div>
        <p class="hint">Formatos aceitos: JPG, PNG, GIF, WEBP (máximo 5MB)</p>
      </div>
      <div v-if="previewUrl" class="preview">
        <img :src="previewUrl" alt="Preview" />
      </div>
      <div v-if="uploading" class="uploading-message">
        <i class="fas fa-spinner fa-spin mr-2"></i>
        Enviando foto...
      </div>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div class="modal-actions">
        <button class="btn-cancel" @click="handleClose" :disabled="uploading">Cancelar</button>
        <button class="btn-save" @click="handleSave" :disabled="!selectedFile || uploading">
          {{ uploading ? 'Enviando...' : 'Salvar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChangePhotoModal',
  props: {
    visible: { type: Boolean, default: false }
  },
  data() {
    return {
      selectedFile: null,
      previewUrl: null,
      uploading: false,
      errorMessage: ''
    }
  },
  watch: {
    visible(newVal) {
      if (!newVal) {
        this.resetForm()
      }
    }
  },
  emits: ['close', 'save'],
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0]
      if (!file) {
        this.resetForm()
        return
      }

      // Validar tamanho (5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'Arquivo muito grande! Máximo 5MB.'
        this.resetForm()
        return
      }

      // Validar tipo
      if (!file.type.match(/^image\/(jpg|jpeg|png|gif|webp)$/)) {
        this.errorMessage = 'Formato inválido! Use JPG, PNG, GIF ou WEBP.'
        this.resetForm()
        return
      }

      this.selectedFile = file
      this.errorMessage = ''

      // Criar preview
      const reader = new FileReader()
      reader.onload = (e) => {
        this.previewUrl = e.target.result
      }
      reader.readAsDataURL(file)
    },
    async handleSave() {
      if (!this.selectedFile) return

      this.uploading = true
      this.errorMessage = ''

      try {
        const formData = new FormData()
        formData.append('file', this.selectedFile)

        const token = localStorage.getItem('token')
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'

        const response = await fetch(`${apiBaseUrl}/settings/upload-profile-picture`, {
          method: 'POST',
          headers: {
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: formData
        })

        if (!response.ok) {
          const error = await response.json().catch(() => ({}))
          throw new Error(error.message || 'Erro ao fazer upload')
        }

        const data = await response.json()
        
        // Emitir evento de sucesso para recarregar as configurações
        this.$emit('save', data.url)
        this.resetForm()
      } catch (error) {
        console.error('Erro ao fazer upload:', error)
        this.errorMessage = error.message || 'Erro ao fazer upload da foto'
      } finally {
        this.uploading = false
      }
    },
    handleClose() {
      if (!this.uploading) {
        this.$emit('close')
      }
    },
    resetForm() {
      this.selectedFile = null
      this.previewUrl = null
      this.errorMessage = ''
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = ''
      }
    }
  }
}
</script>

<style scoped>
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: grid; place-items: center; z-index: 1000; }
.modal-content { background: #0f1411; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 24px; min-width: 400px; }
.modal-title { font-weight: 700; font-size: 20px; margin: 0 0 20px; color: #e5e7eb; }
.form-group { margin-bottom: 16px; }
.form-group label { display: block; margin-bottom: 8px; font-size: 14px; color: #9ca3af; }
.file-input-wrapper { position: relative; }
.file-input { position: absolute; width: 0.1px; height: 0.1px; opacity: 0; overflow: hidden; z-index: -1; }
.file-label { display: flex; align-items: center; justify-content: center; width: 100%; background: #1a1f1d; border: 2px dashed rgba(255,255,255,0.2); border-radius: 8px; padding: 20px; color: #9ca3af; font-size: 14px; cursor: pointer; transition: all 0.2s; text-align: center; }
.file-label:hover { border-color: #10B981; color: #10B981; background: rgba(16, 185, 129, 0.05); }
.file-label i { font-size: 16px; }
.mr-2 { margin-right: 8px; }
.hint { font-size: 12px; color: #6b7280; margin-top: 4px; }
.preview { margin: 16px 0; text-align: center; }
.preview img { width: 150px; height: 150px; border-radius: 50%; object-fit: cover; border: 3px solid #10B981; }
.uploading-message { color: #10B981; font-size: 14px; margin: 12px 0; text-align: center; }
.error-message { color: #ef4444; font-size: 13px; margin: 12px 0; text-align: center; }
.modal-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; }
.btn-cancel { background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #e5e7eb; border-radius: 8px; padding: 10px 20px; cursor: pointer; transition: all 0.2s; }
.btn-cancel:hover:not(:disabled) { background: rgba(255,255,255,0.05); }
.btn-cancel:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-save { background: #10B981; border: none; color: #04130b; border-radius: 8px; padding: 10px 20px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.btn-save:hover:not(:disabled) { background: #34D399; }
.btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
</style>

