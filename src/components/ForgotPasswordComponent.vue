<template>
    <div class="login-container container">
        <h1>ZENI<strong>X</strong></h1>
        <h2>Recuperar senha</h2>
        <p>Insira seu e-mail para receber as instruções de recuperação de senha.</p>
        <p></p>
        <div class="form-login">
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
            
            <button class="btn-login" @click="handleLogin">Enviar</button>
            
            <p class="signup-text">
                <router-link to="/login">Voltar ao Login</router-link>
            </p>
        </div>
    </div>
</template>

<script>
import '../assets/css/auth/forgotPasswordComponent.css'

export default {
  name: "ForgotPasswordComponent",
  data() {
    return {
      email: ''
    }
  },
  methods: {
    async handleLogin() {
      // Implementar lógica de recuperação de senha
      console.log('Recuperar senha para:', this.email);
    }
  }
}
</script>