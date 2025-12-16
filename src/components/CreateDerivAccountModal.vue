<template>
  <div v-if="visible" :class="['overlay', { 'inline-mode': inline }]" @click.self="!inline && onClose()">
    <div :class="['modal', { 'card-mode': inline, 'has-absolute-header': !inline && currentStep > 1 }]">
      <!-- Título e botão X dentro do modal quando não é inline (desktop) OU quando é inline no passo 1 -->
      <div v-if="!inline || (inline && currentStep === 1)" :class="['modal-header', { 'absolute-header': !inline && currentStep > 1 }]">
        <h3 class="title">Criar Conta na Deriv</h3>
        <button class="close-btn" @click="onClose" :disabled="loading">×</button>
      </div>
      
      <p v-if="currentStep === 1" class="subtitle">Preencha seu e-mail para criar sua conta DEMO ($10.000) e REAL (USD).</p>
      
      <div class="info-box" v-if="!emailVerified">
        <svg  viewBox="0 0 492 492" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M245.786 0C110.029 0 1.33359e-06 110.029 1.33359e-06 245.76C-0.00336113 278.038 6.35178 310 18.7025 339.822C31.0532 369.644 49.1575 396.74 71.9814 419.564C94.8054 442.388 121.902 460.492 151.724 472.843C181.545 485.194 213.508 491.549 245.786 491.546C381.491 491.546 491.546 381.517 491.546 245.76C491.546 110.029 381.491 0 245.786 0ZM268.723 88.7296C292.685 88.7296 299.725 102.63 299.725 118.528C299.725 138.368 283.853 156.723 256.742 156.723C234.061 156.723 223.258 145.331 223.923 126.464C223.923 110.566 237.21 88.7296 268.723 88.7296ZM207.334 392.96C190.95 392.96 178.995 383.002 190.438 339.354L209.203 261.914C212.454 249.523 212.992 244.557 209.203 244.557C204.314 244.557 183.04 253.107 170.496 261.555L162.33 248.166C202.138 214.912 247.91 195.405 267.494 195.405C283.878 195.405 286.592 214.758 278.426 244.557L256.922 325.965C253.107 340.352 254.746 345.318 258.56 345.318C263.475 345.318 279.552 339.379 295.373 326.912L304.64 339.354C265.907 378.061 223.693 392.96 207.334 392.96Z" fill="#22C55C" fill-opacity="0.933333"/>
        </svg>

        <p><strong>Passo 1:</strong> Verifique seu email primeiro. Um código será enviado para você.</p>
      </div>
      
      <div class="info-box success" v-if="emailVerified && !verificationCode">
        <svg class="check-icon-svg" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14" fill="#1A3A1A"/>
          <path d="M12 16l3 3 6-6" stroke="#22C55E" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
        <p><strong>Email verificado!</strong> Verifique sua caixa de entrada e digite o código recebido.</p>
      </div>
      
      <!-- PASSO 1: Verificar Email -->
      <div v-if="!emailVerified" class="form">
        <div class="form-group">
          <label>E-mail <span class="required">*</span></label>
          <div class="email-input-wrapper">
            <svg class="envelope-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <input type="email" v-model="formData.email" placeholder="seu@email.com" required class="email-input">
          </div>
        </div>
        
        <button type="button" @click="verifyEmail" class="submit-btn" :disabled="loading || !formData.email">
          <span v-if="!loading">Enviar Código de Verificação</span>
          <span v-else>Enviando código...</span>
          <svg v-if="!loading" class="arrow-icon-btn" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- PASSO 2: Inserir Código -->
      <div v-if="emailVerified && !verificationCode" class="form">
        <div class="form-group">
          <label>Código de Verificação <span class="required">*</span></label>
          <p class="code-instruction">Digite o código recebido por email</p>
          <div class="code-input-wrapper">
            <svg class="shield-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <input 
              type="text" 
              v-model="codeInput" 
              placeholder="000000" 
              maxlength="10"
              @input="codeInput = codeInput.toUpperCase()"
              required
              class="code-input"
            >
          </div>
          <small>
            <svg class="info-icon-small" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 16v-4M12 8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Verifique sua caixa de entrada e spam
          </small>
        </div>
        
        <div class="button-group">
          <button type="button" @click="confirmCode" class="submit-btn" :disabled="loading || !codeInput">
            <span v-if="!loading">Confirmar Código</span>
            <span v-else>Verificando...</span>
            <svg v-if="!loading" class="check-icon-btn" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button type="button" @click="backToEmail" class="secondary-btn">
            <svg class="back-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12l6-6m-6 6l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Voltar
          </button>
        </div>
      </div>

      <!-- PASSO 3: Preencher Dados e Criar Conta -->
      <form v-if="emailVerified && verificationCode" @submit.prevent="handleSubmit" class="form form-step-3">
        <!-- DADOS PESSOAIS -->
        <h4 class="section-title">Dados Pessoais</h4>
        
        <div class="form-group">
          <label>Nome <span class="required">*</span></label>
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <input type="text" v-model="formData.nome" placeholder="Seu nome" required>
          </div>
        </div>
        
        <div class="form-group">
          <label>Sobrenome <span class="required">*</span></label>
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <input type="text" v-model="formData.sobrenome" placeholder="Seu sobrenome" required>
          </div>
        </div>
        
        <div class="form-group">
          <label>E-mail <span class="required">*</span></label>
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <input type="email" v-model="formData.email" placeholder="seu@email.com" required>
          </div>
        </div>
        
        <div class="form-group">
          <label>WhatsApp/Telefone <span class="required">*</span></label>
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <input type="tel" v-model="formData.telefone" placeholder="+55 (11) 99999-9999" @input="formatPhone" required>
          </div>
        </div>
        
        <div class="form-group">
          <label>Data de Nascimento <span class="required">*</span></label>
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <input type="date" v-model="formData.dataNascimento" @change="validateAge" required>
          </div>
        </div>
        
        <div class="section-separator"></div>
        
        <!-- ENDEREÇO -->
        <h4 class="section-title">Endereço</h4>
        
        <div class="form-group">
          <label>Endereço Completo <span class="required">*</span></label>
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <input type="text" v-model="formData.endereco" placeholder="Rua, número, complemento" required>
          </div>
        </div>
        
        <div class="form-group">
          <label>Cidade <span class="required">*</span></label>
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 21h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M5 21V7l8-4v18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M19 21V11l-6-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <input type="text" v-model="formData.cidade" placeholder="Sua cidade" required>
          </div>
        </div>
        
        <div class="form-group">
          <label>Estado <span class="required">*</span></label>
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="8" y1="2" x2="8" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="16" y1="6" x2="16" y2="22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <input type="text" v-model="formData.estado" placeholder="Selecione" maxlength="2" @input="formData.estado = formData.estado.toUpperCase()" required>
          </div>
        </div>
        
        <div class="form-group">
          <label>CEP <span class="required">*</span></label>
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="4" y1="9" x2="20" y2="9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="4" y1="15" x2="20" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="10" y1="3" x2="8" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="16" y1="3" x2="14" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <input type="text" v-model="formData.cep" placeholder="00000-000" maxlength="9" @input="formatCEP" required>
          </div>
        </div>
        
        <div class="form-group">
          <label>País <span class="required">*</span></label>
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <select v-model="formData.pais" required>
              <option value="">Selecione</option>
              <option value="br" selected>Brasil</option>
              <option value="pt">Portugal</option>
              <option value="ao">Angola</option>
              <option value="mz">Moçambique</option>
            </select>
          </div>
        </div>
        
        <div class="section-separator"></div>
        
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
          <svg class="shield-icon-btn" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          {{ loading ? 'Criando contas...' : 'Criar Conta DEMO + REAL' }}
        </button>
        
        <button type="button" @click="onClose" class="secondary-btn" :disabled="loading" style="margin-top: 12px;">
          <svg class="back-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12l6-6m-6 6l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Voltar
        </button>
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

@media (max-width: 768px) {
  .modal {
    padding: 20px;
  }
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
  text-align: left;
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
  text-align: left;
}

.step2-instruction {
  color: #8D8D8D;
  margin-bottom: 20px;
  font-size: 14px;
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
  background: rgba(34, 197, 94, 0.15);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 8px;
  text-align: left;
}

.info-icon-svg {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  margin-top: 2px;
}

.check-icon-svg {
  width: 40px;
  height: 40px;
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
  text-align: left;
}

@media (max-width: 768px) {
  .inline-mode .form-step-3 .section-title {
    color: #FFFFFF !important;
  }
}

.form-group {
  margin-bottom: 20px;
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
  text-align: left;
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
  display: flex;
  align-items: center;
  color: #8D8D8D;
  margin-top: 8px;
  margin-bottom: 10px;
  font-size: 12px;
  text-align: left;
}

.code-instruction {
  color: #8D8D8D;
  font-size: 13px;
  margin-bottom: 12px;
  margin-top: 0;
  text-align: left;
}

.code-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.shield-icon {
  position: absolute;
  left: 15px;
  width: 20px;
  height: 20px;
  color: #8D8D8D;
  z-index: 1;
  pointer-events: none;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.code-input {
  font-size: 18px;
  letter-spacing: 6px;
  text-align: center;
  font-weight: 600;
  padding: 12px 45px;
  border-radius: 8px;
}

.info-icon-small {
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 6px;
  color: #8D8D8D;
  flex-shrink: 0;
}

.email-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.envelope-icon {
  position: absolute;
  left: 15px;
  width: 20px;
  height: 20px;
  color: #8D8D8D;
  z-index: 1;
  pointer-events: none;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.email-input {
  padding-left: 45px !important;
}

/* Input wrapper para passo 3 */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 15px;
  width: 18px;
  height: 18px;
  color: #8D8D8D;
  z-index: 1;
  pointer-events: none;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-wrapper input,
.input-wrapper select {
  padding-left: 45px !important;
  width: 100%;
}

.section-separator {
  height: 2px;
  background: #1C1C1C;
  margin: 20px 0;
  width: 100%;
}

.shield-icon-btn {
  width: 20px;
  height: 20px;
  stroke: #000;
}

.info-box-external {
  margin-top: 15px;
  margin-bottom: 0;
  display: none;
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
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-color: #2C2C2C;
  border: 1px solid #FFFFFF;
  border-radius: 3px;
  position: relative;
  flex-shrink: 0;
}

input[type="checkbox"]:checked {
  background-color: #22C55E;
  border-color: #22C55E;
}

input[type="checkbox"]:checked::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 4px;
  height: 8px;
  border: solid #FFFFFF;
  border-width: 0 2px 2px 0;
  transform: translate(-50%, -60%) rotate(45deg);
}

.checkbox-item label {
  margin: 0;
  font-weight: 400;
  font-size: 13px;
  cursor: pointer;
  color: #DFDFDF;
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
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.check-icon-btn {
  width: 20px;
  height: 20px;
  stroke: #000;
}

.arrow-icon-btn {
  width: 20px;
  height: 20px;
  stroke: #000;
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
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.secondary-btn {
  width: 100%;
  background: #1C1C1C;
  color: #DFDFDF;
  border: 1px solid #2C2C2C;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 15px;
  margin-top: 0;
}

.back-icon {
  width: 18px;
  height: 18px;
}


.submit-btn {
  width: 100%;
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
    padding: 24px 20px !important;
    background: #1A1A1A !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    border-radius: 18px !important;
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
    padding: 20px !important;
    background: #1A1A1A !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    border-radius: 18px !important;
    max-width: 100% !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }
  
  .inline-mode .modal-header {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    margin-bottom: 12px !important;
    padding: 0 !important;
    width: 100% !important;
  }
  
  .inline-mode .modal-header .title {
    font-size: 18px !important;
    font-weight: 600 !important;
    color: #DFDFDF !important;
    margin: 0 !important;
  }
  
  .inline-mode .modal-header .close-btn {
    font-size: 28px !important;
    color: #DFDFDF !important;
    background: none !important;
    border: none !important;
    padding: 0 !important;
    width: 28px !important;
    height: 28px !important;
    cursor: pointer !important;
  }
  
  .inline-mode .subtitle {
    font-size: 13px !important;
    margin-bottom: 15px !important;
    margin-top: 0 !important;
    color: #8D8D8D !important;
    padding: 0 !important;
    line-height: 1.4 !important;
    text-align: left !important;
  }
  
  .modal-header-external {
    margin-bottom: 12px;
  }
  
  .modal-header-external .title {
    font-size: 18px;
  }
  
  .inline-mode .info-box {
    font-size: 12px;
    padding: 10px 12px;
    margin-bottom: 15px;
  }
  
  /* Estilos específicos para passo 3 no mobile */
  .inline-mode .form-step-3 .form-group {
    margin-bottom: 10px !important;
  }
  
  .inline-mode .form-step-3 .section-title {
    margin: 20px 0 12px 0 !important;
    font-size: 15px !important;
  }
  
  .inline-mode .form-step-3 .input-wrapper input[type="text"],
  .inline-mode .form-step-3 .input-wrapper input[type="email"],
  .inline-mode .form-step-3 .input-wrapper input[type="tel"],
  .inline-mode .form-step-3 .input-wrapper input[type="date"],
  .inline-mode .form-step-3 .input-wrapper select {
    padding: 15px 12px 15px 40px !important;
    font-size: 13px !important;
    margin-bottom: 0 !important;
  }
  
  .inline-mode .form-step-3 .input-icon {
    left: 12px !important;
    width: 16px !important;
    height: 16px !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
  }
  
  .inline-mode .form-step-3 .section-separator {
    margin: 20px 0 !important;
    height: 2px !important;
    background: #272727 !important;
  }
  
  .inline-mode .form-step-3 .form-group {
    padding-top: 5px;
    padding-bottom: 5px;
  }
  
  .inline-mode .form-step-3 .checkbox-group {
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
    margin-bottom: 20px !important;
  }
  
  .inline-mode .form-step-3 .checkbox-item {
    margin-bottom: 16px !important;
  }
  
  .inline-mode .form-step-3 .checkbox-item:last-child {
    margin-bottom: 0 !important;
  }
  
  .inline-mode .form-step-3 input[type="checkbox"] {
    width: 20px !important;
    height: 20px !important;
    margin-right: 12px !important;
    margin-top: 2px !important;
    appearance: none !important;
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
    background-color: #2C2C2C !important;
    border: 1px solid #FFFFFF !important;
    border-radius: 3px !important;
    position: relative !important;
  }

  .inline-mode .form-step-3 input[type="checkbox"]:checked {
    background-color: #22C55E !important;
    border-color: #22C55E !important;
  }

  .inline-mode .form-step-3 input[type="checkbox"]:checked::after {
    content: '' !important;
    position: absolute !important;
    left: 50% !important;
    top: 50% !important;
    width: 4px !important;
    height: 8px !important;
    border: solid #FFFFFF !important;
    border-width: 0 2px 2px 0 !important;
    transform: translate(-50%, -60%) rotate(45deg) !important;
  }
  
  .inline-mode .form-step-3 .checkbox-item label {
    font-size: 14px !important;
    line-height: 1.5 !important;
    color: #DFDFDF !important;
  }
  
  
  .inline-mode .form-step-3 .checkbox-item label a {
    color: #22C55E !important;
    text-decoration: none !important;
  }
  
  .inline-mode .form-step-3 .checkbox-group {
    margin-bottom: 15px !important;
    padding: 12px !important;
  }
  
  .inline-mode .form-step-3 .submit-btn {
    padding: 12px;
    font-size: 14px;
    border-radius: 12px;
    margin: 0;
    color: white;
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

  .info-box.success {
    background: rgba(34, 197, 94, 0.15) !important;
    border: 1px solid rgba(34, 197, 94, 0.3) !important;
    border-radius: 8px !important;
    text-align: left !important;
  }
  
  .info-box-external {
    margin-top: 0 !important;
    margin-bottom: 15px !important;
    padding: 12px 15px !important;
    border-radius: 12px !important;
    display: flex !important;
    align-items: center !important;
    gap: 12px !important;
  }
  
  .inline-mode .info-box-external {
    display: flex !important;
  }
  
  .inline-mode .form-step-3 .section-title {
    text-align: left !important;
  }
  
  .info-box-external .check-icon-svg {
    width: 20px !important;
    height: 20px !important;
    flex-shrink: 0 !important;
  }
  
  .info-box-external p {
    width: 100% !important;
    margin: 0 !important;
  }
  
  .info-box-external strong {
    color: #22C55E !important;
  }
  
  .info-box strong{
    color: white!important;
  }

  .info-box p{
    width: 80%;
  }
  
  /* Centralizar SVGs nos passos 1 e 2 */
  .inline-mode .envelope-icon,
  .inline-mode .shield-icon {
    top: 50% !important;
    transform: translateY(-70%) !important;
  }
  
}
</style>

