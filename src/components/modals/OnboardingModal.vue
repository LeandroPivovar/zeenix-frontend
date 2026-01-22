<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content onboarding-card">
      <!-- Step Indicator -->
      <div class="step-indicator">
        <div :class="['step-dot', { active: step === 1 }]"></div>
        <div :class="['step-dot', { active: step === 2 }]"></div>
      </div>

      <!-- Step 1: Terms of Use -->
      <div v-if="step === 1" class="step-container">
        <h3 class="modal-title">Termos de Uso e Privacidade</h3>
        <p class="step-description">Para continuar utilizando a plataforma ZENIX, você deve ler e aceitar nossos termos de uso.</p>
        
        <div class="terms-box">
          <h4>1. Aceitação dos Termos</h4>
          <p>Ao acessar e utilizar a plataforma ZENIX, você concorda em cumprir estes termos e todas as leis aplicáveis.</p>
          
          <h4>2. Riscos de Investimento</h4>
          <p>Operações no mercado financeiro envolvem riscos significativos. A ZENIX fornece ferramentas e tecnologias, mas as decisões de investimento são de inteira responsabilidade do usuário.</p>
          
          <h4>3. Segurança da Conta</h4>
          <p>Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorram em sua conta.</p>
          
          <h4>4. Uso da Tecnologia</h4>
          <p>Nossas IAs e ferramentas de Copy Trading são baseadas em algoritmos matemáticos e históricos. Resultados passados não garantem resultados futuros.</p>
        </div>

        <div class="checkbox-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="acceptedTerms" />
            <span class="checkmark"></span>
            Eu li e aceito todos os termos de uso e a política de privacidade.
          </label>
        </div>

        <div class="modal-actions">
          <button class="btn-next" @click="nextStep" :disabled="!acceptedTerms">
            Próximo Passo
            <i class="fas fa-arrow-right ml-2"></i>
          </button>
        </div>
      </div>

      <!-- Step 2: Change Password -->
      <div v-if="step === 2" class="step-container">
        <h3 class="modal-title">Segurança da sua conta</h3>
        <p class="step-description">Agora, para sua maior segurança, você deve alterar sua senha temporária para uma senha pessoal e forte.</p>

        <form @submit.prevent="handleFinish">
          <div v-if="needsManualCurrentPassword" class="form-group animate-in">
            <label>Senha Atual</label>
            <input 
              type="password" 
              v-model="currentPassword" 
              class="form-input"
              placeholder="Digite sua senha atual"
              required
            />
            <p class="input-hint">Insira a senha que você recebeu no e-mail ou a que definiu no cadastro.</p>
          </div>

          <div class="form-group">
            <label>Nova Senha</label>
            <div class="password-input-wrapper">
              <input 
                :type="showPassword ? 'text' : 'password'" 
                v-model="newPassword" 
                class="form-input"
                placeholder="No mínimo 6 caracteres"
                required
              />
              <button type="button" class="eye-btn" @click="showPassword = !showPassword">
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label>Confirmar Nova Senha</label>
            <div class="password-input-wrapper">
              <input 
                :type="showConfirmPassword ? 'text' : 'password'" 
                v-model="confirmPassword" 
                class="form-input"
                placeholder="Repita a nova senha"
                required
              />
              <button type="button" class="eye-btn" @click="showConfirmPassword = !showConfirmPassword">
                <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>

          <p v-if="passwordError" class="error-text">{{ passwordError }}</p>

          <div class="modal-actions">
            <button type="submit" class="btn-save" :disabled="loading || !isPasswordValid">
              {{ loading ? 'Salvando...' : 'Finalizar Acesso' }}
              <i v-if="!loading" class="fas fa-check ml-2"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OnboardingModal',
  props: {
    visible: { type: Boolean, default: false }
  },
  data() {
    return {
      step: 1,
      acceptedTerms: false,
      newPassword: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      loading: false,
      passwordError: '',
      currentPassword: 'zeenix2025',
      needsManualCurrentPassword: false
    }
  },
  computed: {
    isPasswordValid() {
      const isNewPasswordValid = this.newPassword.length >= 6 && this.newPassword === this.confirmPassword;
      if (this.needsManualCurrentPassword) {
        return isNewPasswordValid && this.currentPassword.length > 0;
      }
      return isNewPasswordValid;
    }
  },
  watch: {
    confirmPassword() {
      if (this.confirmPassword && this.newPassword !== this.confirmPassword) {
        this.passwordError = 'As senhas não coincidem';
      } else {
        this.passwordError = '';
      }
    }
  },
  methods: {
    nextStep() {
      if (this.acceptedTerms) {
        this.step = 2;
      }
    },
    async handleFinish() {
      if (!this.isPasswordValid) return;
      
      this.loading = true;
      this.passwordError = '';
      
      try {
        const token = localStorage.getItem('token');
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';

        // Tenta realizar a troca
        const res = await fetch(`${apiBaseUrl}/settings/password`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify({
            currentPassword: this.currentPassword,
            newPassword: this.newPassword
          })
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          const errorMessage = err.message || 'Erro ao alterar a senha.';
          
          // Se o erro for senha atual incorreta e ainda não estivermos pedindo a senha manual
          if (errorMessage.includes('Senha atual incorreta') && !this.needsManualCurrentPassword) {
            this.needsManualCurrentPassword = true;
            this.currentPassword = '';
            throw new Error('A senha temporária padrão não funcionou. Por favor, insira a senha que você recebeu no e-mail ou a que você definiu no cadastro.');
          }
          
          throw new Error(errorMessage);
        }

        this.$root.$toast.success('Senha atualizada e acesso configurado com sucesso!');
        this.$emit('finish');
      } catch (err) {
        console.error('Erro no onboarding:', err);
        this.passwordError = err.message;
        this.$root.$toast.error(err.message);
      } finally {
        this.loading = false;
      }
    }
  },
  emits: ['finish']
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  backdrop-filter: blur(8px);
}

.onboarding-card {
  background: #0B0B0B;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(34, 197, 94, 0.1);
}

.step-indicator {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 30px;
}

.step-dot {
  width: 40px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.step-dot.active {
  background: #22C55E;
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
}

.step-container {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-title {
  color: white;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
  text-align: center;
}

.step-description {
  color: #9CA3AF;
  font-size: 14px;
  text-align: center;
  margin-bottom: 24px;
  line-height: 1.6;
}

.terms-box {
  background: #141414;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  height: 200px;
  overflow-y: auto;
  margin-bottom: 20px;
  font-size: 13px;
  line-height: 1.6;
  color: #D1D5DB;
  text-align: left;
}

.terms-box h4 {
  color: #22C55E;
  margin: 15px 0 8px;
  font-size: 14px;
}

.terms-box p {
  margin-bottom: 12px;
}

/* Scrollbar para o box de termos */
.terms-box::-webkit-scrollbar {
  width: 6px;
}

.terms-box::-webkit-scrollbar-track {
  background: transparent;
}

.terms-box::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.checkbox-group {
  margin-bottom: 30px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  color: #E5E7EB;
  font-size: 13px;
  cursor: pointer;
  position: relative;
  padding-left: 35px;
  text-align: left;
}

.checkbox-label input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 22px;
  width: 22px;
  background-color: #1A1A1A;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  transition: all 0.2s ease;
}

.checkbox-label:hover input ~ .checkmark {
  border-color: #22C55E;
}

.checkbox-label input:checked ~ .checkmark {
  background-color: #22C55E;
  border-color: #22C55E;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-label input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-label .checkmark:after {
  left: 8px;
  top: 4px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #9CA3AF;
}

.password-input-wrapper {
  position: relative;
}

.form-input {
  width: 100%;
  background: #141414;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 14px 16px;
  padding-right: 48px;
  color: white;
  font-size: 15px;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #22C55E;
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.1);
}

.eye-btn {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #4B5563;
  cursor: pointer;
  padding: 0;
  font-size: 16px;
  transition: color 0.2s ease;
}

.eye-btn:hover {
  color: #22C55E;
}

.btn-next, .btn-save {
  width: 100%;
  background: #22C55E;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;
}

.btn-next:hover:not(:disabled), .btn-save:hover:not(:disabled) {
  background: #16A34A;
  transform: translateY(-1px);
}

.btn-next:disabled, .btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-text {
  color: #EF4444;
  font-size: 12px;
  margin-top: -10px;
  margin-bottom: 20px;
  text-align: left;
}

.ml-2 {
  margin-left: 8px;
}
.animate-in {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.input-hint {
  font-size: 11px;
  color: #6B7280;
  margin-top: 6px;
  line-height: 1.4;
}
</style>
