<template>
  <div v-if="visible" class="overlay" @click.self="onClose">
    <div class="modal">
      <div class="modal-header">
        <h3 class="title">Criar Conta na Deriv</h3>
        <button class="close-btn" @click="onClose" :disabled="loading">×</button>
      </div>
      
      <p class="subtitle">Preencha os dados abaixo para criar sua conta DEMO ($10.000) e REAL (USD)</p>
      
      <div class="info-box" v-if="!emailVerified">
        <strong>Passo 1:</strong> Verifique seu email primeiro. Um código será enviado para você.
      </div>
      
      <div class="info-box success" v-if="emailVerified && !verificationCode">
        <strong>✓ Email verificado!</strong> Verifique sua caixa de entrada e digite o código recebido.
      </div>
      
      <div class="info-box" v-if="emailVerified && verificationCode">
        <strong>Conta DEMO liberada na hora!</strong> Você poderá operar imediatamente com $10.000 virtuais.
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
    }
  },
  emits: ['close', 'success'],
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
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
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

.info-box {
  background: rgba(34, 197, 94, 0.1);
  border-left: 4px solid #22C55E;
  padding: 12px 15px;
  margin-bottom: 25px;
  border-radius: 4px;
  font-size: 13px;
  color: #22C55E;
}

.info-box.success {
  background: rgba(34, 197, 94, 0.15);
  border-left: 4px solid #22C55E;
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
  padding: 15px;
  background: #1C1C1C;
  color: #DFDFDF;
  border: 1px solid #2C2C2C;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.secondary-btn:hover {
  background: #2C2C2C;
  border-color: #3C3C3C;
}

.submit-btn {
  flex: 2;
}

@media (max-width: 768px) {
  .row {
    grid-template-columns: 1fr;
  }
  
  .modal {
    padding: 20px;
  }
}
</style>

