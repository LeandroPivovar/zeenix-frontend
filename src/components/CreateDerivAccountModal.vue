<template>
  <div v-if="visible" :class="['overlay', { 'inline-mode': inline }]" @click.self="!inline && onClose()">
    <div :class="['modal', { 'card-mode': inline, 'has-absolute-header': !inline && currentStep > 1 }]">
      <!-- Título e botão X dentro do modal quando não é inline OU quando é inline na etapa 1 -->
      <div v-if="!inline || (inline && currentStep === 1)" :class="['modal-header', { 'absolute-header': !inline && currentStep > 1 }]">
        <h3 class="title">Criar Conta na Deriv</h3>
        <button class="close-btn" @click="onClose" :disabled="loading">×</button>
      </div>
      
      <p :class="['subtitle', { 'absolute-subtitle': !inline && currentStep > 1 }]">Preencha os dados abaixo para criar sua conta DEMO ($10.000) e REAL (USD)</p>
      
      <div class="info-box" v-if="!emailVerified">
        <svg  viewBox="0 0 492 492" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M245.786 0C110.029 0 1.33359e-06 110.029 1.33359e-06 245.76C-0.00336113 278.038 6.35178 310 18.7025 339.822C31.0532 369.644 49.1575 396.74 71.9814 419.564C94.8054 442.388 121.902 460.492 151.724 472.843C181.545 485.194 213.508 491.549 245.786 491.546C381.491 491.546 491.546 381.517 491.546 245.76C491.546 110.029 381.491 0 245.786 0ZM268.723 88.7296C292.685 88.7296 299.725 102.63 299.725 118.528C299.725 138.368 283.853 156.723 256.742 156.723C234.061 156.723 223.258 145.331 223.923 126.464C223.923 110.566 237.21 88.7296 268.723 88.7296ZM207.334 392.96C190.95 392.96 178.995 383.002 190.438 339.354L209.203 261.914C212.454 249.523 212.992 244.557 209.203 244.557C204.314 244.557 183.04 253.107 170.496 261.555L162.33 248.166C202.138 214.912 247.91 195.405 267.494 195.405C283.878 195.405 286.592 214.758 278.426 244.557L256.922 325.965C253.107 340.352 254.746 345.318 258.56 345.318C263.475 345.318 279.552 339.379 295.373 326.912L304.64 339.354C265.907 378.061 223.693 392.96 207.334 392.96Z" fill="#22C55C" fill-opacity="0.933333"/>
        </svg>

        <p><strong>Passo 1:</strong> Verifique seu email primeiro. Um código será enviado para você.</p>
      </div>
      
      <div class="info-box success" v-if="emailVerified && !verificationCode">
        <svg class="check-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="glow-check">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <circle cx="12" cy="12" r="10" fill="#22C55E" opacity="0.4" filter="url(#glow-check)"/>
          <circle cx="12" cy="12" r="8" fill="#22C55E" filter="url(#glow-check)"/>
          <path d="M9 12l2 2 4-4" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none" filter="url(#glow-check)"/>
        </svg>
        <p><strong>Email verificado!</strong> Verifique sua caixa de entrada e digite o código recebido.</p>
      </div>
      
      <div class="info-box" v-if="emailVerified && verificationCode">
        <p><strong>Conta DEMO liberada na hora!</strong> Você poderá operar imediatamente com $10.000 virtuais.</p>
      </div>

      <!-- PASSO 1: Verificar Email -->
      <div v-if="!emailVerified" class="form">
        <div class="form-group">
          <label>Email <span class="required">*</span></label>
          <input type="email" v-model="formData.email" placeholder="seu@email.com" required>
        </div>
        
        <button type="button" @click="verifyEmail" class="submit-btn" :disabled="loading || !formData.email">
          {{ loading ? 'Enviando código...' : 'Enviar Código de Verificação' }}
        </button>
      </div>

      <!-- PASSO 2: Inserir Código -->
      <div v-if="emailVerified && !verificationCode" class="form">
        <div class="form-group">
          <label>Código de Verificação <span class="required">*</span></label>
          <input 
            type="text" 
            v-model="codeInput" 
            placeholder="Digite o código recebido por email" 
            maxlength="10"
            @input="codeInput = codeInput.toUpperCase()"
            required
          >
          <small>Verifique sua caixa de entrada e spam</small>
        </div>
        
        <div class="button-group">
          <button type="button" @click="backToEmail" class="secondary-btn">
            Voltar
          </button>
          <button type="button" @click="confirmCode" class="submit-btn" :disabled="loading || !codeInput">
            {{ loading ? 'Verificando...' : 'Confirmar Código' }}
          </button>
        </div>
      </div>

      <!-- PASSO 3: Preencher Dados e Criar Conta -->
      <form v-if="emailVerified && verificationCode" @submit.prevent="handleSubmit" class="form">
        <!-- DADOS PESSOAIS -->
        <h4 class="section-title">Dados Pessoais</h4>
        
        <div class="row">
          <div class="form-group">
            <label>Nome <span class="required">*</span></label>
            <input type="text" v-model="formData.nome" placeholder="João" required>
          </div>
          
          <div class="form-group">
            <label>Sobrenome <span class="required">*</span></label>
            <input type="text" v-model="formData.sobrenome" placeholder="Silva" required>
          </div>
        </div>
        
        <div class="form-group">
          <label>Email <span class="required">*</span></label>
          <input type="email" v-model="formData.email" placeholder="seu@email.com" required>
        </div>
        
        <div class="form-group">
          <label>WhatsApp/Telefone <span class="required">*</span></label>
          <input type="tel" v-model="formData.telefone" placeholder="+55 11 99999-9999" @input="formatPhone" required>
        </div>
        
        <div class="form-group">
          <label>Data de Nascimento <span class="required">*</span></label>
          <input type="date" v-model="formData.dataNascimento" @change="validateAge" required>
        </div>
        
        <!-- ENDEREÇO -->
        <h4 class="section-title">Endereço</h4>
        
        <div class="form-group">
          <label>Endereço Completo <span class="required">*</span></label>
          <input type="text" v-model="formData.endereco" placeholder="Rua das Flores, 123, Apto 45" required>
        </div>
        
        <div class="row">
          <div class="form-group">
            <label>Cidade <span class="required">*</span></label>
            <input type="text" v-model="formData.cidade" placeholder="São Paulo" required>
          </div>
          
          <div class="form-group">
            <label>Estado <span class="required">*</span></label>
            <input type="text" v-model="formData.estado" placeholder="SP" maxlength="2" @input="formData.estado = formData.estado.toUpperCase()" required>
          </div>
        </div>
        
        <div class="row">
          <div class="form-group">
            <label>CEP <span class="required">*</span></label>
            <input type="text" v-model="formData.cep" placeholder="01000-000" maxlength="9" @input="formatCEP" required>
          </div>
          
          <div class="form-group">
            <label>País <span class="required">*</span></label>
            <select v-model="formData.pais" required>
              <option value="">Selecione...</option>
              <option value="br" selected>Brasil</option>
              <option value="pt">Portugal</option>
              <option value="ao">Angola</option>
              <option value="mz">Moçambique</option>
            </select>
          </div>
        </div>
        
        <!-- DECLARAÇÕES -->
        <h4 class="section-title">Declarações</h4>
        
        <div class="checkbox-group">
          <div class="checkbox-item">
            <input type="checkbox" id="termos" v-model="formData.aceitouTermos" required>
            <label for="termos">
              Eu aceito os <a href="https://deriv.com/terms-and-conditions" target="_blank">termos e condições</a> da Deriv <span class="required">*</span>
            </label>
          </div>
          
          <div class="checkbox-item">
            <input type="checkbox" id="naoPEP" v-model="formData.naoPEP" required>
            <label for="naoPEP">
              Declaro que NÃO sou uma Pessoa Politicamente Exposta (PEP) <span class="required">*</span>
            </label>
          </div>
          
          <div class="checkbox-item">
            <input type="checkbox" id="fatca" v-model="formData.naoFATCA" required>
            <label for="fatca">
              Declaro que NÃO sou cidadão ou residente fiscal dos EUA <span class="required">*</span>
            </label>
          </div>
        </div>
        
        <div v-if="error" class="error-box">{{ error }}</div>
        
        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? 'Criando contas...' : 'Criar Conta DEMO + REAL' }}
        </button>
        
        <p class="info-text">Leva apenas 2 minutos</p>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateDerivAccountModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    inline: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'success', 'step-change'],
  data() {
    return {
      loading: false,
      error: '',
      emailVerified: false,
      verificationCode: '',
      codeInput: '',
      formData: {
        nome: '',
        sobrenome: '',
        email: '',
        telefone: '',
        dataNascimento: '',
        endereco: '',
        cidade: '',
        estado: '',
        cep: '',
        pais: 'br',
        aceitouTermos: false,
        naoPEP: false,
        naoFATCA: false
      }
    }
  },
  computed: {
    currentStep() {
      if (!this.emailVerified) return 1;
      if (this.emailVerified && !this.verificationCode) return 2;
      if (this.emailVerified && this.verificationCode) return 3;
      return 1;
    }
  },
  watch: {
    currentStep(newStep) {
      this.$emit('step-change', newStep);
    }
  },
  mounted() {
    this.$emit('step-change', this.currentStep);
  },
  methods: {
    onClose() {
      if (this.loading) return;
      this.$emit('close');
      this.resetForm();
    },
    resetForm() {
      this.formData = {
        nome: '',
        sobrenome: '',
        email: '',
        telefone: '',
        dataNascimento: '',
        endereco: '',
        cidade: '',
        estado: '',
        cep: '',
        pais: 'br',
        aceitouTermos: false,
        naoPEP: false,
        naoFATCA: false
      };
      this.error = '';
      this.emailVerified = false;
      this.verificationCode = '';
      this.codeInput = '';
    },
    async verifyEmail() {
      if (!this.formData.email) {
        this.error = 'Por favor, informe um email válido.';
        return;
      }

      this.loading = true;
      this.error = '';

      try {
        const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
        const response = await fetch(`${apiBase}/broker/deriv/verify-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            email: this.formData.email
          })
        });

        const resultado = await response.json();

        if (resultado.success) {
          this.emailVerified = true;
          this.error = '';
        } else {
          this.error = resultado.message || 'Erro ao verificar email. Tente novamente.';
        }
      } catch (erro) {
        console.error('Erro ao verificar email:', erro);
        this.error = 'Erro ao verificar email. Verifique sua conexão e tente novamente.';
      } finally {
        this.loading = false;
      }
    },
    confirmCode() {
      if (!this.codeInput || this.codeInput.length < 4) {
        this.error = 'Por favor, digite o código de verificação recebido por email.';
        return;
      }

      this.verificationCode = this.codeInput.trim();
      this.error = '';
    },
    backToEmail() {
      this.emailVerified = false;
      this.codeInput = '';
      this.verificationCode = '';
      this.error = '';
    },
    formatPhone(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (!value.startsWith('55')) {
        value = '55' + value;
      }
      if (value.length > 2) {
        value = '+' + value.slice(0, 2) + ' ' + value.slice(2);
      }
      if (value.length > 6) {
        value = value.slice(0, 6) + ' ' + value.slice(6);
      }
      if (value.length > 12) {
        value = value.slice(0, 12) + '-' + value.slice(12, 16);
      }
      this.formData.telefone = value;
    },
    formatCEP(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 5) {
        value = value.slice(0, 5) + '-' + value.slice(5, 8);
      }
      this.formData.cep = value;
    },
    validateAge() {
      if (!this.formData.dataNascimento) return;
      const dataNasc = new Date(this.formData.dataNascimento);
      const hoje = new Date();
      let idade = hoje.getFullYear() - dataNasc.getFullYear();
      const mes = hoje.getMonth() - dataNasc.getMonth();
      
      if (mes < 0 || (mes === 0 && hoje.getDate() < dataNasc.getDate())) {
        idade--;
      }
      
      if (idade < 18) {
        alert('Você deve ter 18 anos ou mais para criar uma conta.');
        this.formData.dataNascimento = '';
      }
    },
    async handleSubmit() {
      this.error = '';
      
      // Validações
      if (!this.formData.nome || !this.formData.sobrenome || !this.formData.email) {
        this.error = 'Por favor, preencha todos os campos obrigatórios.';
        return;
      }
      
      const telefoneNumeros = this.formData.telefone.replace(/\D/g, '');
      if (telefoneNumeros.length < 12) {
        this.error = 'Telefone inválido. Use o formato: +55 11 99999-9999';
        return;
      }
      
      const cepNumeros = this.formData.cep.replace(/\D/g, '');
      if (cepNumeros.length !== 8) {
        this.error = 'CEP inválido. Use o formato: 00000-000';
        return;
      }
      
      if (this.formData.estado.length !== 2) {
        this.error = 'Estado inválido. Use a sigla de 2 letras (ex: SP)';
        return;
      }
      
      if (!this.verificationCode) {
        this.error = 'Código de verificação é obrigatório.';
        return;
      }

      this.loading = true;
      
      try {
        const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
        const response = await fetch(`${apiBase}/broker/deriv/create-account`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            ...this.formData,
            telefone: telefoneNumeros,
            cep: cepNumeros,
            verificationCode: this.verificationCode // Código recebido por email
          })
        });
        
        const resultado = await response.json();
        
        if (resultado.success) {
          this.$emit('success', resultado);
          this.onClose();
        } else {
          this.error = resultado.message || 'Erro ao criar conta. Tente novamente.';
        }
      } catch (erro) {
        console.error('Erro ao criar conta:', erro);
        this.error = 'Erro ao criar conta. Verifique sua conexão e tente novamente.';
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  padding: 20px;
}

.modal {
  background: #0B0B0B;
  border: 1px solid #1C1C1C;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 30px;
  color: #DFDFDF;
  position: relative;
}

.modal.has-absolute-header {
  padding-top: 140px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.modal-header.absolute-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 30px;
  background: #0B0B0B;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  z-index: 10;
  margin-bottom: 0;
}

.modal-header-external {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  width: 100%;
  max-width: 420px;
  padding: 0;
  box-sizing: border-box;
}

.modal-header-external .title {
  font-size: 20px;
  font-weight: 600;
  color: #DFDFDF;
  margin: 0;
}

.modal-header-external .close-btn {
  background: none;
  border: none;
  color: #DFDFDF;
  font-size: 28px;
  cursor: pointer;
  padding: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.modal-header-external .close-btn:hover {
  color: #22C55E;
}

.modal-header-internal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  width: 100%;
  padding: 0;
  box-sizing: border-box;
}

.modal-header-internal .title {
  font-size: 20px;
  font-weight: 600;
  color: #DFDFDF;
  margin: 0;
}

.modal-header-internal .close-btn {
  background: none;
  border: none;
  color: #DFDFDF;
  font-size: 28px;
  cursor: pointer;
  padding: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.modal-header-internal .close-btn:hover {
  color: #22C55E;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #DFDFDF;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #DFDFDF;
  font-size: 32px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.close-btn:hover {
  color: #22C55E;
}

.subtitle {
  color: #8D8D8D;
  margin-bottom: 20px;
  font-size: 14px;
}

.subtitle.absolute-subtitle {
  position: absolute;
  top: 80px;
  left: 30px;
  right: 30px;
  z-index: 10;
  margin-bottom: 0;
  padding-top: 10px;
  background: #0B0B0B;
}

.info-box {
  background: #0A1A0A;
  border-left: 4px solid #22C55E;
  padding: 12px 15px;
  margin-bottom: 25px;
  border-radius: 4px;
  font-size: 13px;
  color: #FFFFFF;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.info-box.success {
  background: rgba(34, 197, 94, 0.3);
  border-left: 4px solid #22C55E;
}

.info-icon-svg,
.check-icon-svg {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  margin-top: 2px;
}

.info-box strong {
  color: #FFFFFF;
  font-weight: 600;
}

.section-title {
  color: #22C55E;
  font-size: 16px;
  font-weight: 600;
  margin: 25px 0 15px 0;
}

.form-group {
  margin-bottom: 0;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

label {
  display: block;
  color: #DFDFDF;
  font-weight: 500;
  margin-bottom: 8px;
  font-size: 14px;
}

.required {
  color: #f44336;
}

input[type="text"],
input[type="email"],
input[type="tel"],
input[type="date"],
select {
  width: 100%;
  padding: 12px 15px;
  background: #0E0E0E;
  border: 1px solid #1C1C1C;
  border-radius: 8px;
  color: #DFDFDF;
  font-size: 14px;
  box-sizing: border-box;
  margin-bottom: 8px;
}

input:focus,
select:focus {
  outline: none;
  border-color: #22C55E;
}

small {
  display: block;
  color: #8D8D8D;
  margin-top: 5px;
  margin-bottom: 10px;
  font-size: 12px;
}

.checkbox-group {
  background: #0E0E0E;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #1C1C1C;
}

.checkbox-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
}

.checkbox-item:last-child {
  margin-bottom: 0;
}

input[type="checkbox"] {
  margin-right: 10px;
  margin-top: 3px;
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #22C55E;
}

.checkbox-item label {
  margin: 0;
  font-weight: 400;
  font-size: 13px;
  cursor: pointer;
}

.checkbox-item label a {
  color: #22C55E;
  text-decoration: none;
}

.checkbox-item label a:hover {
  text-decoration: underline;
}

.error-box {
  background: rgba(244, 67, 54, 0.1);
  border-left: 4px solid #f44336;
  padding: 12px 15px;
  margin-bottom: 20px;
  border-radius: 4px;
  font-size: 13px;
  color: #f44336;
}

.submit-btn {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%);
  color: #000;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-bottom: 10px;
}

.info-box svg{
  width: 16px;
  margin-top: 4px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(34, 197, 94, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.info-text {
  text-align: center;
  margin-top: 15px;
  font-size: 12px;
  color: #8D8D8D;
}

.button-group {
  display: flex;
  gap: 10px;
}

.secondary-btn {
  flex: 1;
  background: #1C1C1C;
  color: #DFDFDF;
  border: 1px solid #2C2C2C;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}


.submit-btn {
  flex: 2;
}

/* Modo inline (card) - apenas mobile */
.inline-mode {
  position: static !important;
  background: transparent !important;
  padding: 0 !important;
  display: block !important;
  z-index: 1 !important;
}

.inline-mode .modal {
  max-width: 100% !important;
  width: 100% !important;
  max-height: none !important;
  padding: 20px !important;
  background: transparent !important;
  border: none !important;
  border-radius: 0 !important;
}

.card-mode {
  background: transparent !important;
  border: none !important;
}

@media (max-width: 768px) {
  .row {
    grid-template-columns: 1fr;
  }
  
  .modal {
    padding: 20px;
  }
  
  .inline-mode .modal {
    padding: 0 !important;
  }
  
  .inline-mode .modal-header {
    display: none !important;
  }
  
  .modal-header-external {
    margin-bottom: 12px;
  }
  
  .modal-header-external .title {
    font-size: 18px;
  }
  
  .inline-mode .subtitle {
    font-size: 13px;
    margin-bottom: 15px;
  }
  
  .inline-mode .info-box {
    font-size: 12px;
    padding: 10px 12px;
    margin-bottom: 15px;
  }
  
  .inline-mode .form-group {
    margin-bottom: 12px;
  }
  
  .inline-mode input[type="text"],
  .inline-mode input[type="email"],
  .inline-mode input[type="tel"],
  .inline-mode input[type="date"],
  .inline-mode select {
    padding: 10px 12px;
    font-size: 13px;
  }
  
  .inline-mode .submit-btn {
    padding: 12px;
    font-size: 14px;
    border-radius: 12px;
    margin: 0;
    color: white;
  }

  .info-box {
    font-size: 12px;
    padding: 20px 12px!important;
    margin-bottom: 15px;
    border: 2px solid #143c26!important;
    background: #101c18!important;

    text-align: left;
    color: rgb(209, 209, 209)!important;
    border-radius: 12px;
  }

  .info-box strong{
    color: white!important;
  }

  .info-box p{
    width: 80%;
  }
  

  
}
</style>

