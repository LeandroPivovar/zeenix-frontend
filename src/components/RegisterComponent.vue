<template>
    <div class="register-container container">
        <h1>ZENI<strong>X</strong></h1>
        <h2>Crie sua conta</h2>
        <div class="form-register">
            <div class="form-group">                
                <label for="name">
                    Nome Completo
                </label>
                <input 
                    type="text" 
                    id="name" 
                    v-model="name"
                    placeholder="Nome"
                />
            </div>
            
            <div class="form-group"> 
                <label for="email">
                    E-mail
                </label>
                <input 
                    type="email" 
                    id="email" 
                    v-model="email"
                    placeholder="seu.email@exemplo.com"
                />
            </div>

            <div class="form-group">
                <label for="cpf">
                    CPF
                </label>
                <input 
                    type="text" 
                    id="cpf" 
                    v-model="cpf"
                    @input="formatCPF"
                    placeholder="000.000.000-00"
                    maxlength="14"
                />
            </div>

            <div class="form-group">
                <label for="whatsapp">
                    Whatsapp
                </label>
                <input 
                    type="text" 
                    id="whatsapp" 
                    v-model="whatsapp"
                    @input="formatPhone"
                    placeholder="(41) 99999-9999"
                    maxlength="15"
                />
            </div>

            <div class="form-group">
                <label for="password">
                    Senha
                </label>
                <div class="password-input-wrapper">
                    <input 
                        :type="showPassword ? 'text' : 'password'" 
                        id="password" 
                        v-model="password"
                        placeholder="••••••••"
                    />
                    <button 
                        type="button" 
                        class="toggle-password"
                        @click="showPassword = !showPassword"
                    >
                    </button>
                </div>
                
                <div v-if="password" class="password-strength-container">
                    <div class="strength-header">
                        <span class="strength-label">Força da senha</span>
                        <span class="strength-value" :style="{ color: strengthColor }">
                            {{ strengthLabel }}
                        </span>
                    </div>
                    <div class="progress-bar">
                        <div 
                            class="progress-fill" 
                            :style="{ 
                                width: passwordStrength + '%',
                                backgroundColor: strengthColor 
                            }"
                        ></div>
                    </div>
                    
                    <!-- Checklist de requisitos -->
                    <div class="password-requirements">
                        <div class="requirements-list">
                            <div :class="['requirement-item', { 'met': password.length >= 8 }]">
                                <span class="check">{{ password.length >= 8 ? '✓' : '•' }}</span>
                                Pelo menos 8 caracteres
                            </div>
                            <div :class="['requirement-item', { 'met': /[A-Z]/.test(password) }]">
                                <span class="check">{{ /[A-Z]/.test(password) ? '✓' : '•' }}</span>
                                Letras maiúsculas
                            </div>
                            <div :class="['requirement-item', { 'met': /[0-9]/.test(password) }]">
                                <span class="check">{{ /[0-9]/.test(password) ? '✓' : '•' }}</span>
                                Números
                            </div>
                            <div :class="['requirement-item', { 'met': /[^a-zA-Z0-9]/.test(password) }]">
                                <span class="check">{{ /[^a-zA-Z0-9]/.test(password) ? '✓' : '•' }}</span>
                                Caracteres especiais (!@#$%)
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="form-group">
                <label for="confirmPassword">
                    Confirmar Senha
                </label>
                <div class="password-input-wrapper">
                    <input 
                        :type="showConfirmPassword ? 'text' : 'password'" 
                        id="confirmPassword" 
                        v-model="confirmPassword"
                        placeholder="••••••••"
                    />
                    <button 
                        type="button" 
                        class="toggle-password"
                        @click="showConfirmPassword = !showConfirmPassword"
                    >
                        <img src="../assets/icons/eye.svg" alt="" class="label-img">
                    </button>
                </div>
                
                <!-- Validação de senhas -->
                <div v-if="confirmPassword" class="password-match">
                    <div v-if="password === confirmPassword" class="match-success">
                        ✓ Senhas correspondem
                    </div>
                    <div v-else class="match-error">
                        ✗ As senhas não correspondem
                    </div>
                </div>
            </div>  
 
            
            <button class="btn-register" @click="handleRegister" :disabled="isLoading">
                <span v-if="isLoading" class="spinner" aria-hidden="true"></span>
                <span>{{ isLoading ? 'Criando...' : 'Registrar' }}</span>
            </button>

            <p class="login-text">
              Já possui uma conta? 
              <router-link to="/login">voltar ao login</router-link>
            </p>

            <p class="terms-text">Ao cadastrar você concorda com os nossos <a href="#">Termos de Uso</a> e <a href="#">Política de Privacidade</a>.</p>
        </div>
    </div>
</template>

<script>
import '../assets/css/auth/registerComponent.css'

export default {
  name: "RegisterComponent",
  data() {
    return {
      name: '',
      email: '',
      cpf: '',
      whatsapp: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      passwordStrength: 0,
      strengthLabel: '',
      strengthColor: '#e5e7eb',
      isLoading: false
    }
  },
  watch: {
    password(newPassword) {
      this.calculatePasswordStrength(newPassword);
    }
  },
  methods: {
    calculatePasswordStrength(password) {
      if (!password) {
        this.passwordStrength = 0;
        this.strengthLabel = '';
        this.strengthColor = '#e5e7eb';
        return;
      }
      
      let strength = 0;
      
      if (password.length >= 8) strength += 25;
      if (password.length >= 12) strength += 10;
      if (/[a-z]/.test(password)) strength += 15;
      if (/[A-Z]/.test(password)) strength += 15;
      if (/[0-9]/.test(password)) strength += 15;
      if (/[^a-zA-Z0-9]/.test(password)) strength += 20;
      
      this.passwordStrength = Math.min(strength, 100);
      
      if (this.passwordStrength < 40) {
        this.strengthLabel = 'Fraca';
        this.strengthColor = '#ef4444';
      } else if (this.passwordStrength < 70) {
        this.strengthLabel = 'Média';
        this.strengthColor = '#f59e0b';
      } else if (this.passwordStrength < 90) {
        this.strengthLabel = 'Boa';
        this.strengthColor = '#3b82f6';
      } else {
        this.strengthLabel = 'Forte';
        this.strengthColor = '#10b981';
      }
    },
    formatCPF(event) {
      let value = event.target.value.replace(/\D/g, '');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      this.cpf = value;
    },
    formatPhone(event) {
      let value = event.target.value.replace(/\D/g, '');
      value = value.replace(/(\d{2})(\d)/, '($1) $2');
      value = value.replace(/(\d{5})(\d)/, '$1-$2');
      this.whatsapp = value;
    },
    async handleRegister() {
      if (this.isLoading) return;
      if (this.password !== this.confirmPassword) {
        alert('As senhas não correspondem!');
        return;
      }
      try {
        this.isLoading = true;
        const res = await fetch((process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000') + '/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: this.name, email: this.email, password: this.password })
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.message || 'Falha no cadastro');
        }
        const data = await res.json();
        localStorage.setItem('token', data.token);
        alert('Cadastro realizado com sucesso');
        this.$router.push('/login');
      } catch (e) {
        alert(e.message || 'Erro inesperado');
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>

<style scoped>
.btn-register[disabled] {
  opacity: 0.7;
  cursor: not-allowed;
}
.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 8px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
