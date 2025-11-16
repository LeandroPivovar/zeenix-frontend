<template>
    <div class="layout">
        <AppSidebar :is-open="isSidebarOpen" :is-collapsed="isSidebarCollapsed" @toggle-collapse="toggleSidebarCollapse" />
        <main class="adminContainer">
            
        </main>
    </div>
</template>
<script>
import AppSidebar from '../../components/Sidebar.vue'; 

export default {
    name: 'AdministrativoView',
    components: {
        AppSidebar,
    },
}
</script>