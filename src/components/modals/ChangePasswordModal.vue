<template>
  <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h3 class="modal-title">Alterar Senha</h3>
      <div class="form-group">
        <label>Senha Atual</label>
        <div class="input-wrapper">
          <input 
            :type="showCurrentPassword ? 'text' : 'password'" 
            v-model="currentPassword" 
            class="form-input"
            placeholder="Digite sua senha atual"
          />
          <button 
            type="button" 
            class="toggle-password" 
            @click="showCurrentPassword = !showCurrentPassword"
            tabindex="-1"
          >
            <i :class="showCurrentPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
        </div>
      </div>
      <div class="form-group">
        <label>Nova Senha</label>
        <div class="input-wrapper">
          <input 
            :type="showNewPassword ? 'text' : 'password'" 
            v-model="newPassword" 
            class="form-input"
            placeholder="Digite sua nova senha"
          />
          <button 
            type="button" 
            class="toggle-password" 
            @click="showNewPassword = !showNewPassword"
            tabindex="-1"
          >
            <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
        </div>
      </div>
      <div class="form-group">
        <label>Confirmar Nova Senha</label>
        <div class="input-wrapper">
          <input 
            :type="showConfirmPassword ? 'text' : 'password'" 
            v-model="confirmPassword" 
            class="form-input"
            placeholder="Confirme sua nova senha"
            @keyup.enter="handleSave"
          />
          <button 
            type="button" 
            class="toggle-password" 
            @click="showConfirmPassword = !showConfirmPassword"
            tabindex="-1"
          >
            <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
        </div>
      </div>
      <div v-if="error" class="error-message">{{ error }}</div>
      <div class="modal-actions">
        <button class="btn-cancel" @click="$emit('close')">Cancelar</button>
        <button class="btn-save" @click="handleSave" :disabled="!isValid">
          Salvar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChangePasswordModal',
  props: {
    visible: { type: Boolean, default: false }
  },
  data() {
    return {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      error: '',
      showCurrentPassword: false,
      showNewPassword: false,
      showConfirmPassword: false
    }
  },
  computed: {
    isValid() {
      return this.currentPassword && 
             this.newPassword && 
             this.newPassword.length >= 6 && 
             this.newPassword === this.confirmPassword
    }
  },
  watch: {
    visible(newVal) {
      if (!newVal) {
        this.currentPassword = ''
        this.newPassword = ''
        this.confirmPassword = ''
        this.error = ''
        this.showCurrentPassword = false
        this.showNewPassword = false
        this.showConfirmPassword = false
      }
    },
    newPassword() {
      this.validate()
    },
    confirmPassword() {
      this.validate()
    }
  },
  emits: ['close', 'save'],
  methods: {
    validate() {
      this.error = ''
      if (this.newPassword && this.newPassword.length < 6) {
        this.error = 'A nova senha deve ter pelo menos 6 caracteres'
      } else if (this.confirmPassword && this.newPassword !== this.confirmPassword) {
        this.error = 'As senhas não coincidem'
      }
    },
    handleSave() {
      if (!this.isValid) return
      
      if (this.newPassword !== this.confirmPassword) {
        this.error = 'As senhas não coincidem'
        return
      }

      this.$emit('save', {
        current: this.currentPassword,
        new: this.newPassword
      })
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
.input-wrapper { position: relative; width: 100%; display: flex; align-items: center; }
.form-input { width: 100%; background: #1a1f1d; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 10px 40px 10px 10px; color: #e5e7eb; font-size: 14px; height: 42px; }
.form-input:focus { outline: none; border-color: #10B981; }
.toggle-password { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: transparent; border: none; color: #9ca3af; cursor: pointer; padding: 0; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; transition: color 0.2s; }
.toggle-password:hover { color: #10B981; }
.toggle-password i { font-size: 16px; line-height: 1; }
.error-message { color: #ef4444; font-size: 13px; margin-bottom: 12px; }
.modal-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; }
.btn-cancel { background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #e5e7eb; border-radius: 8px; padding: 10px 20px; cursor: pointer; }
.btn-cancel:hover { background: rgba(255,255,255,0.05); }
.btn-save { background: #10B981; border: none; color: #04130b; border-radius: 8px; padding: 10px 20px; font-weight: 700; cursor: pointer; }
.btn-save:hover:not(:disabled) { background: #34D399; }
.btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
</style>

