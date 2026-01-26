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
          <p>TERMOS DE USO – ZENIX</p>
          <p>Ao acessar, cadastrar-se ou utilizar a plataforma ZENIX, o usuário {{ modalUserName }} declara que leu, compreendeu e concorda integralmente com os presentes Termos de Uso, ficando legalmente vinculado a todas as suas disposições.</p>
          <p>Estes Termos regulam a relação entre o USUÁRIO e a ZENIX, doravante denominada PLATAFORMA.</p>

          <h4>1. OBJETO</h4>
          <p>1.1. Os presentes Termos têm por objeto regular o acesso e o uso da plataforma ZENIX, que disponibiliza recursos tecnológicos de automação operacional, incluindo sistemas automatizados, ferramentas técnicas, dashboards, registros operacionais (logs) e integrações com corretoras terceiras, conforme o plano contratado.</p>
          <p>1.2. O acesso à plataforma confere ao USUÁRIO uma licença de uso pessoal, não exclusiva, intransferível e revogável, limitada às funcionalidades contratadas.</p>

          <h4>2. NATUREZA DA PLATAFORMA</h4>
          <p>2.1. A ZENIX é uma plataforma de tecnologia, não sendo corretora, instituição financeira, gestora de recursos, administradora de carteiras ou prestadora de serviços de consultoria ou assessoria financeira.</p>
          <p>2.2. A ZENIX não capta recursos, não administra capital de terceiros, não executa operações financeiras, não realiza depósitos ou saques e não possui acesso às contas financeiras do USUÁRIO.</p>
          <p>2.3. Todo capital utilizado pelo USUÁRIO permanece sob sua exclusiva titularidade e responsabilidade, alocado em corretoras de sua livre escolha.</p>

          <h4>3. AUSÊNCIA DE INDICAÇÃO OU RECOMENDAÇÃO</h4>
          <p>3.1. A ZENIX não realiza recomendações de investimento, não indica ativos, não sugere operações e não fornece aconselhamento financeiro de qualquer natureza.</p>
          <p>3.2. As informações e funcionalidades disponibilizadas possuem caráter exclusivamente técnico, informativo e operacional.</p>

          <h4>4. CIÊNCIA DE RISCO</h4>
          <p>4.1. O USUÁRIO declara estar ciente de que operações em mercados financeiros envolvem riscos elevados e podem resultar em perda parcial ou total do capital utilizado, independentemente do uso de sistemas automatizados.</p>
          <p>4.2. O USUÁRIO reconhece que fatores externos, como volatilidade de mercado, falhas técnicas, indisponibilidade de corretoras ou eventos de força maior, podem impactar os resultados.</p>

          <h4>5. AUSÊNCIA DE GARANTIA DE RESULTADOS</h4>
          <p>5.1. A ZENIX não garante lucros, rentabilidade, desempenho, recuperação de capital ou qualquer resultado financeiro específico.</p>
          <p>5.2. Resultados passados não constituem garantia de resultados futuros.</p>

          <h4>6. RESPONSABILIDADE DO USUÁRIO</h4>
          <p>6.1. O USUÁRIO é o único responsável por definir valores operacionais, parâmetros de risco, configurações, estratégias e decisões de uso da plataforma.</p>
          <p>6.2. O USUÁRIO assume integral responsabilidade por perdas, ganhos, tributos, taxas, custos operacionais e quaisquer consequências decorrentes do uso da plataforma.</p>

          <h4>7. LIMITAÇÃO DE RESPONSABILIDADE</h4>
          <p>7.1. A ZENIX não será responsável por danos diretos, indiretos, incidentais, consequenciais, lucros cessantes ou danos morais decorrentes do uso ou da impossibilidade de uso da plataforma.</p>
          <p>7.2. Em nenhuma hipótese a responsabilidade da ZENIX excederá o valor efetivamente pago pelo USUÁRIO pelo acesso à plataforma.</p>

          <h4>8. CADASTRO E SEGURANÇA</h4>
          <p>8.1. O USUÁRIO compromete-se a fornecer informações verdadeiras e atualizadas.</p>
          <p>8.2. O login e a senha são pessoais e intransferíveis, sendo o USUÁRIO integralmente responsável por sua guarda e uso.</p>
          <p>8.3. É vedado o compartilhamento de acesso, sob pena de suspensão ou cancelamento.</p>

          <h4>9. SUPORTE E DISPONIBILIDADE</h4>
          <p>9.1. A ZENIX poderá disponibilizar suporte técnico e materiais educativos, sem que isso caracterize prestação de consultoria financeira.</p>
          <p>9.2. A ZENIX não se responsabiliza por falhas ou indisponibilidades decorrentes de corretoras terceiras, internet, servidores externos, manutenções ou eventos de força maior.</p>

          <h4>10. SUSPENSÃO E ENCERRAMENTO</h4>
          <p>10.1. A ZENIX poderá suspender ou encerrar o acesso do USUÁRIO, a qualquer tempo, em caso de violação destes Termos, uso indevido da plataforma, tentativa de engenharia reversa, compartilhamento de acesso, fraude ou atividade ilícita.</p>

          <h4>11. ALTERAÇÕES DOS TERMOS</h4>
          <p>11.1. A ZENIX poderá alterar estes Termos a qualquer momento.</p>
          <p>11.2. O uso continuado da plataforma após alterações caracteriza aceite automático da versão vigente.</p>

          <h4>12. DISPOSIÇÕES GERAIS</h4>
          <p>12.1. A eventual tolerância quanto ao descumprimento de quaisquer disposições não constituirá novação ou renúncia de direitos.</p>
          <p>12.2. Caso qualquer cláusula seja considerada inválida, as demais permanecerão em pleno vigor.</p>
          
          <h4>13. FORO</h4>
          <p>13.1. Fica eleito o foro da comarca de Curitiba/PR, com renúncia a qualquer outro, por mais privilegiado que seja.</p>
          
          <h4>14. ACEITE</h4>
          <p>14.1. Ao acessar ou utilizar a plataforma ZENIX, o USUÁRIO declara que leu, compreendeu e concorda integralmente com estes Termos de Uso.</p>
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
    visible: { type: Boolean, default: false },
    userName: { type: String, default: 'USUÁRIO' }
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
      needsManualCurrentPassword: false,
      modalUserName: 'USUÁRIO'
    }
  },
  mounted() {
    this.setDisplayedName();
  },
  computed: {
    displayedName() {
      return this.modalUserName;
    },
    isPasswordValid() {
      const isNewPasswordValid = this.newPassword.length >= 6 && this.newPassword === this.confirmPassword;
      if (this.needsManualCurrentPassword) {
        return isNewPasswordValid && this.currentPassword.length > 0;
      }
      return isNewPasswordValid;
    }
  },
  watch: {
    userName: {
      immediate: true,
      handler() {
        this.setDisplayedName();
      }
    },
    confirmPassword() {
      if (this.confirmPassword && this.newPassword !== this.confirmPassword) {
        this.passwordError = 'As senhas não coincidem';
      } else {
        this.passwordError = '';
      }
    }
  },
  methods: {
    setDisplayedName() {
      if (this.userName && this.userName !== 'USUÁRIO') {
        this.modalUserName = this.userName;
        return;
      }
      
      const userInfo = localStorage.getItem('user');
      if (userInfo) {
        try {
          const user = JSON.parse(userInfo);
          if (user.name) {
             this.modalUserName = user.name;
             return;
          }
        } catch (e) {
          console.error('Erro ao ler nome do localStorage:', e);
        }
      }
      this.modalUserName = 'USUÁRIO';
    },
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
