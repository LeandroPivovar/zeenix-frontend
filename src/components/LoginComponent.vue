<template>
  <div class="login-wrapper">
    <div class="login-content">
      
      <!-- Left Column - Login Card -->
      <div class="login-section">
        <div class="login-card">
          
          <!-- Logo -->
          <div class="logo-container">
            <div class="logo-text">
              <span class="logo-dark">ZENI</span>
              <span class="logo-green">X</span>
            </div>
          </div>

          <!-- Header -->
          <div class="header-section">
            <h1 class="title">Acesse sua conta</h1>
            <p class="subtitle">Se você já possui uma conta, preencha seus dados para acessar a plataforma.</p>
          </div>

          <!-- Login Form -->
          <form @submit.prevent="handleLogin" class="login-form">
            <!-- Email Input -->
            <div class="form-group">
              <label for="email" class="form-label">E-mail</label>
              <input 
                type="email" 
                id="email"
                v-model="email"
                placeholder="Digite seu e-mail"
                class="form-input"
                required
              />
            </div>

            <!-- Password Input -->
            <div class="form-group">
              <label for="password" class="form-label">Senha</label>
              <div class="password-input-wrapper">
                <input 
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  v-model="password"
                  placeholder="Digite sua senha"
                  class="form-input password-input"
                  required
                />
                <button 
                  type="button"
                  @click="togglePassword"
                  class="password-toggle"
                  aria-label="Mostrar/Ocultar senha"
                >
                  <i :class="showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'"></i>
                </button>
              </div>
            </div>

            <!-- Login Button -->
            <button 
              type="submit" 
              class="btn-login"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="spinner"></span>
              <span>{{ isLoading ? 'Entrando...' : 'Acessar minha conta' }}</span>
              <i v-if="!isLoading" class="fa-solid fa-arrow-right"></i>
            </button>
          </form>

          <!-- Links -->
          <div class="links-section">
            <router-link to="/forgot-password" class="link-secondary">
              Esqueceu sua senha?
            </router-link>
            <router-link to="/register" class="link-primary">
              Criar uma nova conta
            </router-link>
          </div>

          <!-- Footer -->
          <div class="card-footer">
            <p class="footer-text">
              Ao acessar, você concorda com nossos 
              <a href="#" class="footer-link">Termos de Uso</a> e 
              <a href="#" class="footer-link">Política de Privacidade</a>.
            </p>
          </div>
        </div>
      </div>

      <!-- Right Column - Hero Content -->
      <div class="hero-section">
        
        <!-- Main Title -->
        <div class="hero-header">
          <h2 class="hero-title">
            <span class="title-white">Você é</span>
            <span class="title-green">único.</span>
          </h2>
          <p class="hero-description">
            Tecnologia inteligente, segurança e precisão — o padrão Zenix Pro para traders profissionais.
          </p>
        </div>

        <!-- Benefits List -->
        <div class="benefits-list">
          
          <!-- Benefit 1 -->
          <div class="benefit-item">
            <div class="benefit-icon">
              <i class="fa-solid fa-brain"></i>
            </div>
            <div class="benefit-content">
              <h3 class="benefit-title">IA de Investimento</h3>
              <p class="benefit-description">Análise inteligente em tempo real</p>
            </div>
          </div>

          <!-- Benefit 2 -->
          <div class="benefit-item">
            <div class="benefit-icon">
              <i class="fa-solid fa-copy"></i>
            </div>
            <div class="benefit-content">
              <h3 class="benefit-title">Copy Trading</h3>
              <p class="benefit-description">Copie estratégias de traders experientes</p>
            </div>
          </div>

          <!-- Benefit 3 -->
          <div class="benefit-item">
            <div class="benefit-icon">
              <i class="fa-solid fa-robot"></i>
            </div>
            <div class="benefit-content">
              <h3 class="benefit-title">Automação Completa</h3>
              <p class="benefit-description">Agentes autônomos 24/7</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginComponent",
  data() {
    return {
      email: '',
      password: '',
      isLoading: false,
      showPassword: false
    }
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    async handleLogin() {
      if (this.isLoading) return;
      this.isLoading = true;
      try {
        const res = await fetch((process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000') + '/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.email, password: this.password })
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.message || 'Falha no login');
        }
        const data = await res.json();
        localStorage.setItem('token', data.token);
        localStorage.removeItem('deriv_token');
        localStorage.removeItem('deriv_connection');
        localStorage.removeItem('deriv_app_id');
        this.$router.push('/dashboard');
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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
  font-family: 'Inter', sans-serif;
}

.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #0B0B0B 0%, #0B0B0B 70%, rgba(34, 197, 94, 0.03) 100%);
}

.login-content {
  width: 100%;
  max-width: 1400px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5rem;
}

/* ===== LOGIN CARD ===== */
.login-section {
  flex: 0 0 480px;
  width: 480px;
}

.login-card {
  background: white;
  border: 1px solid #EDEDED;
  border-radius: 1rem;
  padding: 2.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1), 
              0 8px 32px rgba(0, 0, 0, 0.05);
}

/* Logo */
.logo-container {
  margin-bottom: 2rem;
}

.logo-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-dark {
  font-size: 1.875rem;
  font-weight: 700;
  color: #0B0B0B;
}

.logo-green {
  font-size: 1.875rem;
  font-weight: 700;
  color: #22C55E;
}

/* Header */
.header-section {
  margin-bottom: 2rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #0B0B0B;
  margin-bottom: 0.75rem;
}

.subtitle {
  font-size: 0.875rem;
  color: #6A6A6A;
  line-height: 1.6;
}

/* Form */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #0B0B0B;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  background: #F5F5F5;
  border: 1px solid #E5E5E5;
  border-radius: 0.75rem;
  padding: 1rem;
  font-size: 0.875rem;
  color: #0B0B0B;
  transition: border-color 0.2s;
}

.form-input::placeholder {
  color: #6A6A6A;
}

.form-input:focus {
  outline: none;
  border-color: #22C55E;
}

/* Password Input */
.password-input-wrapper {
  position: relative;
}

.password-input {
  padding-right: 3rem;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6A6A6A;
  cursor: pointer;
  font-size: 1rem;
  transition: color 0.2s;
  padding: 0;
}

.password-toggle:hover {
  color: #22C55E;
}

/* Login Button */
.btn-login {
  width: 100%;
  background: #22C55E;
  color: white;
  font-weight: 600;
  padding: 1rem;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.btn-login:hover:not(:disabled) {
  background: #16A34A;
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Links */
.links-section {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: center;
}

.link-secondary {
  font-size: 0.875rem;
  color: #6A6A6A;
  text-decoration: none;
  transition: color 0.2s;
}

.link-secondary:hover {
  color: #0B0B0B;
}

.link-primary {
  font-size: 0.875rem;
  color: #22C55E;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
}

.link-primary:hover {
  color: #16A34A;
}

/* Footer */
.card-footer {
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #E5E5E5;
}

.footer-text {
  font-size: 0.75rem;
  color: #6A6A6A;
  text-align: center;
  line-height: 1.6;
}

.footer-link {
  color: #22C55E;
  text-decoration: none;
}

.footer-link:hover {
  text-decoration: underline;
}

/* ===== HERO SECTION ===== */
.hero-section {
  flex: 1;
  padding-left: 5rem;
  max-width: 600px;
}

/* Hero Header */
.hero-header {
  margin-bottom: 3rem;
}

.hero-title {
  font-size: 3.75rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 1rem;
}

.title-white {
  color: white;
  display: block;
}

.title-green {
  color: #22C55E;
  display: block;
}

.hero-description {
  font-size: 1.125rem;
  color: #C6C6C6;
  line-height: 1.6;
  max-width: 28rem;
}

/* Benefits */
.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.benefit-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, transparent 70%);
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.benefit-icon i {
  color: #22C55E;
  font-size: 1.125rem;
}

.benefit-content {
  flex: 1;
}

.benefit-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.25rem;
}

.benefit-description {
  font-size: 0.875rem;
  color: #C6C6C6;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1200px) {
  .login-content {
    gap: 3rem;
  }
  
  .hero-section {
    padding-left: 3rem;
  }
  
  .hero-title {
    font-size: 3rem;
  }
}

@media (max-width: 992px) {
  .hero-section {
    display: none;
  }
  
  .login-section {
    flex: 0 0 auto;
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
  }
}

@media (max-width: 576px) {
  .login-wrapper {
    padding: 1rem;
  }
  
  .login-section {
    width: 100%;
  }
  
  .login-card {
    padding: 1.5rem;
  }
  
  .logo-dark,
  .logo-green {
    font-size: 1.5rem;
  }
  
  .title {
    font-size: 1.25rem;
  }
}
</style>
