<template>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inria+Sans:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    <main>
        <component :is="componenteAtivo"></component>
    </main>
</template>

<script>
import LoginComponent from '../components/LoginComponent.vue'
import RegisterComponent from '../components/RegisterComponent.vue'
import ForgotPasswordComponent from '../components/ForgotPasswordComponent.vue'
export default {
  components: {
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent
  },
  data() {
    return {
      componenteAtivo: 'LoginComponent'
    };
  },
  mounted() {
    this.atualizarComponente();
  },
  watch: {
    '$route.path'() {
      this.atualizarComponente();
    }
  },
  methods: {
    atualizarComponente() {
      const path = this.$route.path;
      
      if (path === '/register') {
        this.componenteAtivo = 'RegisterComponent';
      } else if (path === '/login' || path === '/') {
        this.componenteAtivo = 'LoginComponent';
      }
      if (path === '/forgot-password') {
        this.componenteAtivo = 'ForgotPasswordComponent';
      }
    }
  }
}
</script>

<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    main {
        width: 100%;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: rgb(5, 10, 4);
    }

    h1 {
        font-family: "Roboto", sans-serif;
        text-align: center;
        font-size: 1.875rem;
        font-weight: bold;
        color: white;
        margin-top: -1rem;
    }

    h1 strong {
        color: #4ade80;
    }
    
    h2 {
        font-size: 1.5rem;
        margin: 0.5rem;
        color: rgb(247, 246, 245);
    }
</style>