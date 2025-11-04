<template>
  <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h3 class="modal-title">Trocar Foto de Perfil</h3>
      <div class="form-group">
        <label>URL da Imagem</label>
        <input 
          type="url" 
          v-model="photoUrl" 
          class="form-input"
          placeholder="https://exemplo.com/foto.jpg"
          @keyup.enter="handleSave"
        />
        <p class="hint">Cole o link da imagem que deseja usar como foto de perfil</p>
      </div>
      <div v-if="photoUrl" class="preview">
        <img :src="photoUrl" alt="Preview" @error="showPreviewError = true" />
        <div v-if="showPreviewError" class="preview-error">Erro ao carregar imagem</div>
      </div>
      <div class="modal-actions">
        <button class="btn-cancel" @click="$emit('close')">Cancelar</button>
        <button class="btn-save" @click="handleSave" :disabled="!photoUrl || !isValidUrl">
          Salvar
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
      photoUrl: '',
      showPreviewError: false
    }
  },
  computed: {
    isValidUrl() {
      try {
        new URL(this.photoUrl)
        return true
      } catch {
        return false
      }
    }
  },
  watch: {
    visible(newVal) {
      if (!newVal) {
        this.photoUrl = ''
        this.showPreviewError = false
      }
    },
    photoUrl() {
      this.showPreviewError = false
    }
  },
  emits: ['close', 'save'],
  methods: {
    handleSave() {
      if (this.isValidUrl) {
        this.$emit('save', this.photoUrl)
      }
    }
  }
}
</script>

<style scoped>
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: grid; place-items: center; z-index: 1000; }
.modal-content { background: #0f1411; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 24px; min-width: 400px; }
.modal-title { font-weight: 700; font-size: 20px; margin: 0 0 20px; }
.form-group { margin-bottom: 16px; }
.form-group label { display: block; margin-bottom: 8px; font-size: 14px; color: #9ca3af; }
.form-input { width: 100%; background: #1a1f1d; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 10px; color: #e5e7eb; font-size: 14px; }
.form-input:focus { outline: none; border-color: #10B981; }
.hint { font-size: 12px; color: #6b7280; margin-top: 4px; }
.preview { margin: 16px 0; text-align: center; }
.preview img { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255,255,255,0.1); }
.preview-error { color: #ef4444; font-size: 12px; margin-top: 8px; }
.modal-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; }
.btn-cancel { background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #e5e7eb; border-radius: 8px; padding: 10px 20px; cursor: pointer; }
.btn-cancel:hover { background: rgba(255,255,255,0.05); }
.btn-save { background: #10B981; border: none; color: #04130b; border-radius: 8px; padding: 10px 20px; font-weight: 700; cursor: pointer; }
.btn-save:hover:not(:disabled) { background: #34D399; }
.btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
</style>

