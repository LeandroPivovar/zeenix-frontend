<template>
  <div>
    <router-view/>
    <ToastNotification ref="toast" />
    <GlobalDialog />
  </div>
</template>

<script>
import ToastNotification from './components/Toast.vue'
import GlobalDialog from './components/GlobalDialog.vue'

export default {
  name: 'App',
  components: {
    ToastNotification,
    GlobalDialog
  },
  mounted() {
    // Tornar o toast acessível globalmente
    if (this.$refs.toast) {
      this.$root.$toast = this.$refs.toast
    }
  }

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}


nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
