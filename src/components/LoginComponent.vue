<template>
    <div class="login-container container">
        <h1>ZENI<strong>X</strong></h1>
        <div class="form-login">
            <div class="form-group">
                <label for="email">
                    <span>E-mail</span>
                </label>
                <input 
                    type="email" 
                    id="email" 
                    v-model="email"
                    placeholder="seu.email@exemplo.com"
                />
            </div>
            
            <div class="form-group password-group">
                <label for="password">
                    <span>Senha</span>
                    <router-link to="/forgot-password" class="forgot-password">Esqueceu sua senha?</router-link>
                </label>
                <input 
                    type="password" 
                    id="password" 
                    v-model="password"
                    placeholder="••••••••"
                />
            </div>
            
            <button class="btn-login" @click="handleLogin" :disabled="isLoading">
              <span v-if="isLoading" class="spinner" aria-hidden="true"></span>
              <span>{{ isLoading ? 'Entrando...' : 'Entrar' }}</span>
            </button>
            
            <p class="signup-text">
                Não tem uma conta? 
                <router-link to="/register">criar conta</router-link>
            </p>

        </div>
    </div>
</template>

<script>
import '../assets/css/auth/loginComponent.css'

export default {
  name: "LoginComponent",
  data() {
    return {
      email: '',
      password: '',
      isLoading: false
    }
  },
  methods: {
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
.btn-login[disabled] {
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