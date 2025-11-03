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
import '../assets/css/auth/loginComponent.css'

export default {
  name: "LoginComponent",
  data() {
    return {
    }
  },

}
</script>

<style>
    p{
        margin-top: 1rem;
        margin-bottom: 0.5rem;
        font-size: 1rem;
        font-weight: 700;
    }
</style>