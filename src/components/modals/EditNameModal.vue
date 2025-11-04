<template>
  <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h3 class="modal-title">Editar Nome</h3>
      <div class="form-group">
        <label>Novo Nome</label>
        <input 
          type="text" 
          v-model="name" 
          class="form-input"
          placeholder="Digite seu nome"
          @keyup.enter="handleSave"
        />
      </div>
      <div class="modal-actions">
        <button class="btn-cancel" @click="$emit('close')">Cancelar</button>
        <button class="btn-save" @click="handleSave" :disabled="!name || name.trim().length < 2">
          Salvar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditNameModal',
  props: {
    visible: { type: Boolean, default: false },
    currentName: { type: String, default: '' }
  },
  data() {
    return {
      name: ''
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.name = this.currentName || ''
      }
    },
    currentName(newVal) {
      if (this.visible) {
        this.name = newVal || ''
      }
    }
  },
  emits: ['close', 'save'],
  methods: {
    handleSave() {
      if (this.name && this.name.trim().length >= 2) {
        this.$emit('save', this.name.trim())
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
.modal-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; }
.btn-cancel { background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #e5e7eb; border-radius: 8px; padding: 10px 20px; cursor: pointer; }
.btn-cancel:hover { background: rgba(255,255,255,0.05); }
.btn-save { background: #10B981; border: none; color: #04130b; border-radius: 8px; padding: 10px 20px; font-weight: 700; cursor: pointer; }
.btn-save:hover:not(:disabled) { background: #34D399; }
.btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
</style>

