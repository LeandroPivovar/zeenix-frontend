<template>
  <div class="profile-layout">
    <AppSidebar />
    <main class="profile-content">
      <div class="card">
        <h2>Seu Perfil</h2>
        <p>Em breve: detalhes do usuário.</p>
        <button class="back" @click="$router.push('/dashboard')">Voltar ao Dashboard</button>
      </div>
    </main>
  </div>
</template>

<script>
import AppSidebar from '../components/Sidebar.vue'
export default { name: 'ProfileView', components: { AppSidebar } }
</script>

<style scoped>
.profile-layout { display: flex; min-height: 100vh; background: #070B07; color: #e5e7eb; }
.profile-content { flex: 1; display: grid; place-items: center; padding: 24px; }
.card { background: #0f1411; border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 20px; min-width: 300px; }
.back { margin-top: 12px; background: #10B981; border: none; padding: 8px 14px; border-radius: 9999px; color: #04130b; cursor: pointer; }
.back:hover { background: #34D399; }
</style>





