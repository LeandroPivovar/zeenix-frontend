<template>
  <div class="admin-login-wrapper">
    <!-- Efeitos de fundo premium idênticos ao LoginComponent -->
    <div class="zenix-animated-bg"></div>
    <div class="zenix-texture-layer"></div>
    <div class="zenix-light-primary"></div>
    <div class="zenix-light-secondary"></div>
    <div class="zenix-particles">
      <div v-for="i in 20" :key="i" class="zenix-particle"></div>
    </div>

    <div class="admin-login-card">
      <div class="logo">
        <span class="text-white font-bold text-3xl">ZEN</span><span class="text-white font-bold text-3xl">I</span><span class="text-zenix-green font-bold text-3xl">X</span>
        <div class="admin-badge">ADMIN</div>
      </div>
      
      <h1 class="title">Acesso Administrativo</h1>
      <p class="subtitle">Entre com suas credenciais de administrador</p>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label>E-mail</label>
          <div class="input-container">
            <i class="fa-solid fa-envelope input-icon"></i>
            <input 
              type="email" 
              v-model="email" 
              placeholder="Digite o seu e-mail" 
              required
              class="admin-input"
            >
          </div>
        </div>

        <div class="form-group">
          <label>Senha</label>
          <div class="input-container">
            <i class="fa-solid fa-lock input-icon"></i>
            <input 
              :type="showPassword ? 'text' : 'password'" 
              v-model="password" 
              placeholder="Digite sua senha" 
              required
              class="admin-input"
            >
            <button type="button" @click="showPassword = !showPassword" class="password-toggle">
              <i class="fa-solid" :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
            </button>
          </div>
        </div>

        <button type="submit" class="btn-login" :disabled="isLoading">
          <span v-if="isLoading" class="spinner"></span>
          <span>{{ isLoading ? 'Entrando...' : 'Acessar Painel' }}</span>
          <i v-if="!isLoading" class="fa-solid fa-arrow-right ml-2 text-sm"></i>
        </button>
      </form>

      <div class="footer">
        <router-link to="/login" class="back-link">
          <i class="fa-solid fa-arrow-left mr-1"></i> Voltar para área do cliente
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminLoginView',
  data() {
    return {
      email: '',
      password: '',
      isLoading: false,
      showPassword: false
    }
  },
  methods: {
    async handleLogin() {
      if (this.isLoading) return;
      this.isLoading = true;

      try {
        const response = await fetch((process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000') + '/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.email, password: this.password })
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err?.message || 'Falha no login');
        }

        const data = await response.json();
        const token = data.token;
        
        // Verificar se é admin
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload.role || payload.roles || payload.userRole || payload.user_role;
        const isAdminFlag = payload.isAdmin || payload.is_admin;
        
        const roleStr = Array.isArray(role) ? role.join(',').toLowerCase() : (role ? role.toString().toLowerCase() : '');
        const hasAdminAccess = isAdminFlag === true || isAdminFlag === 'true' || roleStr.includes('admin');

        if (!hasAdminAccess) {
          throw new Error('Acesso negado. Esta área é restrita a administradores.');
        }

        localStorage.setItem('token', token);
        localStorage.removeItem('deriv_connection');
        
        // Redireciona para o markup
        window.location.href = '/markup';
      } catch (e) {
        if (this.$root && this.$root.$toast) {
          this.$root.$toast.error(e.message);
        } else {
          alert(e.message);
        }
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.admin-login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0b0b0b;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}

/* Background Effects Logic from AuthView.vue */
.zenix-animated-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: linear-gradient(145deg, #0B0B0B 0%, #111111 35%, #0F0F0F 65%, #0B0B0B 100%);
}

.zenix-texture-layer {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0.11;
  background-image: radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.03) 0%, transparent 2%);
  background-size: 200px 200px;
}

.zenix-light-primary {
  position: fixed;
  width: 800px;
  height: 800px;
  background: radial-gradient(ellipse at center, rgba(34, 197, 94, 0.15) 0%, transparent 80%);
  filter: blur(150px);
  z-index: 2;
  top: -10%;
  left: -20%;
}

.zenix-particles {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 3;
}

.zenix-particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.20);
  border-radius: 50%;
  width: 2px;
  height: 2px;
}

.admin-login-card {
  width: 100%;
  max-width: 440px;
  background-color: #ffffff;
  padding: 48px;
  border-radius: 20px;
  border: 1px solid #ededed;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  z-index: 10;
  text-align: center;
}

.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
}

.logo span {
  color: #0B0B0B !important;
}

.logo span.text-zenix-green {
  color: #22C55E !important;
}

.admin-badge {
  background-color: #22C55E;
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  margin-top: 8px;
  letter-spacing: 1.5px;
}

.title {
  color: #0B0B0B;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 12px;
}

.subtitle {
  color: #6A6A6A;
  font-size: 15px;
  margin-bottom: 36px;
  line-height: 1.6;
}

.login-form {
  text-align: left;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  color: #0B0B0B;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 10px;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  color: #6A6A6A;
  font-size: 16px;
}

.admin-input {
  width: 100%;
  background-color: #f5f5f5;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 14px 16px 14px 48px;
  color: #0B0B0B;
  font-size: 15px;
  transition: border-color 0.2s, background-color 0.2s;
}

.admin-input:focus {
  outline: none;
  border-color: #22C55E;
  background-color: #ffffff;
}

.password-toggle {
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  color: #6A6A6A;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;
}

.password-toggle:hover {
  color: #22C55E;
}

.btn-login {
  width: 100%;
  background-color: #22C55E;
  color: white;
  border: none;
  border-radius: 9999px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 12px;
}

.btn-login:hover:not(:disabled) {
  background-color: #16A34A;
}

.btn-login:active:not(:disabled) {
  transform: scale(0.99);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.footer {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #eee;
}

.back-link {
  color: #6A6A6A;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s;
  display: inline-flex;
  align-items: center;
}

.back-link:hover {
  color: #22C55E;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-right: 10px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 480px) {
  .admin-login-card {
    padding: 32px 24px;
    margin: 20px;
  }
}
</style>

