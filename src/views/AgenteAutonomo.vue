<template>
    <div class="layout-agente-autnomo" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
        
        <AppSidebar 
            :is-open="isSidebarOpen" 
            :is-collapsed="isSidebarCollapsed" 
            @close-sidebar="closeSidebar" 
            @toggle-collapse="toggleSidebarCollapse" 
        />
        
        <div class="container">
            <component :is="componenteAtual"></component>
        </div>
        
        <footer class="agente-autonomo-footer">
            <button 
                @click="toggleAgenteStatus" 
                class="iniciar-button"
                :class="{ 'pause-button': agenteEstaAtivo }" >
                {{ textoDoBotao }} 
            </button>
        </footer>
    </div>
</template>

<script>
// Importa os componentes de layout e estado
import AppSidebar from '../components/Sidebar.vue';
import AgenteAutonomoActive from '../components/autonomo/AgenteAutonomoActive.vue';
import AgenteAutonomoInactive from '../components/autonomo/AgenteAutonomoInactive.vue';

export default {
    name: 'AgenteAutonomoView',
    components: {
        AgenteAutonomoActive,
        AgenteAutonomoInactive,
        AppSidebar
    },
    
    data() {
        return {
        // 1. Estado principal para controlar se o agente está ativo
        agenteEstaAtivo: false, 
        
        // **Atenção:** As propriedades de sidebar (isSidebarOpen, isSidebarCollapsed) 
        // precisam ser definidas aqui ou via Vuex/Pinia, caso ainda não estejam.
        // Adicionei elas aqui como placeholders.
        isSidebarOpen: true,
        isSidebarCollapsed: false,
        };
    },

    computed: {
        // 2. Propriedade computada para escolher o componente a ser exibido
        componenteAtual() {
            // Retorna 'AgenteAutonomoActive' se estiver ativo, senão 'AgenteAutonomoInactive'
            return this.agenteEstaAtivo ? 'AgenteAutonomoActive' : 'AgenteAutonomoInactive';
        },
        
        // 3. Propriedade computada para o texto dinâmico do botão
        textoDoBotao() {
            return this.agenteEstaAtivo ? 'Pausar Agente Autônomo' : 'Iniciar Agente Autônomo';
        }
    },

    methods: {
        // 4. Método para alternar o estado do agente (Inicia e Pausa)
        toggleAgenteStatus() {
            // Inverte o valor booleano atual
            this.agenteEstaAtivo = !this.agenteEstaAtivo;

            if (this.agenteEstaAtivo) {
                console.log('Agente Autônomo INICIADO. Componente: Active.');
            } else {
                console.log('Agente Autônomo PAUSADO. Componente: Inactive.');
            }
        },

        // Métodos de Sidebar, mantidos para completude
        closeSidebar() {
            this.isSidebarOpen = false;
        },
        toggleSidebarCollapse() {
            this.isSidebarCollapsed = !this.isSidebarCollapsed;
        }
    },
};
</script>

<style scoped>
.layout-agente-autnomo {
    padding: 40px;
    background-color: #0d0d0d; /* Fundo principal escuro */
    min-height: 100vh;
    width: calc(100% - 240px);
    margin-left: 240px;
}

/* Estilos para o Footer e Botão */
.agente-autonomo-footer {
    position: fixed;
    bottom: 0;
    left: 240px; /* Alinhar com o conteúdo principal */
    width: calc(100% - 240px);
    background-color: #1a1a1a; /* Fundo mais escuro para o footer */
    padding: 15px 40px;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: flex-end; /* Alinhar o botão à direita */
    z-index: 1000;
}

.iniciar-button {
    background-color: #4CAF50; /* Verde para Iniciar */
    color: white;
    border: none;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 8px;
    transition: background-color 0.3s ease;
    font-weight: bold;
}

.iniciar-button.pause-button {
    background-color: #f44336; /* Vermelho para Pausar */
}

.iniciar-button:hover {
    opacity: 0.9;
}
</style>