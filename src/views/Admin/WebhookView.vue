<template>
    <div class="layout" ref="layoutContainer">
        <AppSidebar :is-open="isSidebarOpen" :is-collapsed="isSidebarCollapsed" @toggle-collapse="toggleSidebarCollapse" />

        <main class="layout-content">
            <button class="hamburger-btn" @click="toggleSidebar" aria-label="Abrir menu">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>                
            <header class=" header-webhook">
                <div class="header-info">
                    <h1>Webhooks de Vendas</h1>
                    <p class="header-subtitle">Integre KiwiFy para sincronizar assinaturas, compras e renovações.</p>
                </div>
                <button class="btn btn-primary btn-new-connection">
                    + Nova Conexão
                </button>
            </header>

            <section class="webhook-cards-grid">
                <div 
                    v-for="connection in connections" 
                    :key="connection.id" 
                    :class="['webhook-card', connection.status]"
                >
                    <div class="card-header">
                        <h2>{{ connection.name.toUpperCase() }}</h2>
                        
                        <div :class="['status-indicator', connection.status]">
                            <span class="status-dot"></span>
                            <span class="status-text">
                                {{ connection.status === 'active' ? 'Ativo' : 'Pausado' }}
                            </span>
                        </div>
                        </div>
                    
                    <div class="card-details">
                        <p class="detail-label">Endpoint</p>
                        <input type="text" :value="connection.endpoint" readonly disabled />
                        
                        <p class="detail-label">Segredo HMAC</p>
                        <input type="password" value="••••••••••••••••" readonly disabled />
                        
                        <p class="detail-label last-event">
                            Último evento: 
                            <strong>{{ connection.lastEvent }}</strong>
                        </p>
                    </div>

                    <div class="card-actions">
                        <button class="btn-link">Editar</button>
                        <button class="btn-link">Logs</button>
                        <button class="btn-link">Testar</button>
                        <button 
                            v-if="connection.status === 'active'" 
                            class="btn-link btn-danger"
                        >
                            Desativar
                        </button>
                        <button 
                            v-else 
                            class="btn-link btn-success-action"
                        >
                            Ativar
                        </button>
                    </div>
                </div>
            </section>
            
            <section class="webhook-settings">
                <div class="tabs-navigation">
                    <button 
                        v-for="tab in tabs" 
                        :key="tab"
                        :class="['tab-btn', { active: activeTab === tab.toLowerCase() }]"
                        @click="activeTab = tab.toLowerCase()"
                    >
                        {{ tab }}
                    </button>
                </div>

                <div v-if="activeTab === 'eventos'" class="tab-content events-content">
                    <div class="events-grid">
                        
                        <div v-for="(column, colIndex) in eventColumns" :key="colIndex" class="event-column">
                            <label 
                                v-for="event in column" 
                                :key="event.key" 
                                class="checkbox-container"
                            >
                                <input 
                                    class="checkbox-custom" type="checkbox" 
                                    v-model="selectedEvents" 
                                    :value="event.key"
                                >
                                <span class="checkbox-custom-style"></span>
                                {{ event.label }}
                            </label>
                        </div>
                    </div>
                    <button class="btn btn-success btn-save-events">Salvar Eventos</button>
                </div>
            </section>

            <footer class="alert-uptime-footer">
                <div class="alert-settings">
                    <div class="alert-toggle">
                        <p>Alertas por e-mail/WhatsApp ao falhar</p>
                        <label class="switch">
                            <input type="checkbox" v-model="emailAlertsEnabled">
                            <span class="slider round"></span>
                        </label>
                    </div>
                    <div class="alert-destinations">
                        <p>Destinatários</p>
                        <input type="text" v-model="alertDestinations" />
                    </div>
                </div>
                
                <div class="uptime-metrics">
                    <p class="uptime-text">Uptime 24h: <strong>{{ uptimePercentage }}</strong></p>
                    <div class="uptime-chart">
                        <div class="bar-chart-placeholder"></div>
                    </div>
                    <p class="deliveries-label">Entregas por hora</p>
                </div>
            </footer>
        </main>
    </div>
</template>

<script>
import AppSidebar from '../../components/Sidebar.vue';

export default {
    name: 'WebhookView',
    components: {
        AppSidebar
    },
    data() {
        return {
            // Layout data (mantido do original)
            isSidebarOpen: false,
            isSidebarCollapsed: false,
            
            // --- Dados do Conteúdo da Imagem ---

            // 1. Cards de Webhooks
            connections: [
                { id: 2, name: 'KiwiFy', endpoint: 'https://api.zenix.pro/webhooks/...', status: 'paused', lastEvent: 'há 2 horas' },
            ],

            // 2. Guias (Tabs)
            tabs: ['Eventos', 'Mapeamento', 'Segurança', 'Testes', 'Logs'],
            activeTab: 'eventos',

            // 3. Eventos e Checkboxes
            eventColumns: [
                [
                    { key: 'compra_aprovada', label: 'Compra aprovada' },
                    { key: 'upgrade_downgrade', label: 'Upgrade/Downgrade' },
                ],
                [
                    { key: 'boleto_pago', label: 'Boleto pago' },
                    { key: 'reembolso', label: 'Reembolso' },
                ],
                [
                    { key: 'assinatura_criada', label: 'Assinatura criada' },
                    { key: 'chargeback', label: 'Chargeback' },
                ],
                [
                    { key: 'renovacao', label: 'Renovação' },
                    { key: 'cancelado_inadimplente', label: 'Cancelado/Inadimplente' },
                ],
            ],
            // Valores iniciais selecionados (simulando o estado da imagem)
            selectedEvents: ['compra_aprovada', 'boleto_pago', 'assinatura_criada', 'renovacao'],

            // 4. Alertas e Uptime
            emailAlertsEnabled: true,
            alertDestinations: 'admin@zenix.pro, +5511999999999',
            uptimePercentage: '99.98%',
        }
    },
    methods: {
        toggleSidebar() {
            this.isSidebarOpen = !this.isSidebarOpen;
        },
        toggleSidebarCollapse() {
            this.isSidebarCollapsed = !this.isSidebarCollapsed;
        }
    }
}
</script>

<style>
:root {
    --color-bg-card:#131213;
    --color-text-light: #f9fafb;
    --color-text-muted: #9ca3af; 
    --color-text-black: #000000;
    --color-border: #374151; 
    --color-primary: #10b981; 
    --color-secondary: #3b82f6; 
    --color-danger: #ef4444; 
    --color-success: #10b981; 
}

.layout {
    background-color: #0e0f0f;
    color: #fff;
    min-height: 100vh;
    box-sizing: border-box;
    transition: margin-left 0.3s ease, width 0.3s ease;
}

.layout-content {
    margin: 0;
    padding: 40px;
    background: #0e0f0f;
    width: 100%;
}

.header-webhook {
    margin: 20px;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    position: relative;
    padding-bottom: 1rem;
    width: 100%;
}

.header-info{
    text-align: left;
    display: flex;
    flex-direction: column;
}

.page-header h1 {
    font-size: 1.5rem;
    font-weight: 600;
    flex-basis: 100%; 
    margin-bottom: 0.5rem;
}

.header-subtitle {
    font-size: 0.9rem;
    color: var(--color-text-muted);
    flex-grow: 1; /* O subtítulo ocupa o espaço restante */
}

.btn-new-connection {
    position: absolute; /* Ajusta o botão para o canto superior direito */
    top: 0;
    right: 0;
}

/* --- Estilos de Botões Genéricos --- */
.btn {
    padding: 0.5rem 1rem;
    border-radius: 0.375rem; /* 6px */
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    border: none;
}

.btn-primary {
    background-color: var(--color-success);
    color: #ffffff;
}

.btn-primary:hover {
    background-color: #059669; /* Verde um pouco mais escuro */
}

.btn-success {
    background-color: var(--color-success);
    color: #ffffff;
}

/* --- Cards de Webhooks Grid --- */
.webhook-cards-grid {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(auto-fit, minmax(300px, 2fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
}

.webhook-card {
    background-color: var(--color-bg-card);
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
}

.card-header {
    display: flex;
    align-items: center;
    /* CORREÇÃO 1: Garante que o nome e o status fiquem nas extremidades */
    justify-content: space-between;
    margin-bottom: 1rem;
}

.card-header h2 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text-light);
    text-align: left;
}

/* Status Dot e Texto */

.status-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem; /* Espaço de 8px entre o ponto e o texto */
    font-size: 0.875rem;
    font-weight: 500;
}

.status-dot {
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
}

.status-indicator.active {
    color: var(--color-primary); /* Cor do texto Ativo */
}

.status-indicator.active .status-dot {
    background-color: var(--color-primary); /* Cor do ponto Ativo */
}

.status-indicator.paused {
    color: var(--color-danger); /* Cor do texto Pausado */
}

.status-indicator.paused .status-dot {
    background-color: var(--color-danger); /* Cor do ponto Pausado */
}


/* Detalhes do Card */
.detail-label {
    font-size: 0.75rem;
    color: var(--color-text-muted);
    margin-top: 0.75rem;
    margin-bottom: 0.25rem;
}


.card-details{
    text-align: left    ;
}

.card-details input {
    width: 100%;
    padding: 0.5rem;
    background-color: #131213; /* Um tom um pouco mais claro que o card */
    border: 1px solid var(--color-border);
    border-radius: 0.25rem;
    color: var(--color-text-light);
    font-size: 0.875rem;
    pointer-events: none; /* Desativa a interação para inputs readonly */
    box-sizing: border-box;

    padding-right: 2.5rem;
}

.detail-label.last-event {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    margin-top: 1.5rem;
    margin-bottom: 1rem;
}

.detail-label.last-event strong {
    color: var(--color-text-light);
    font-weight: 600;
}

/* Ações do Card */
.card-actions {
    display: flex;
    gap: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border);
}

.btn-link {
    background: none;
    border: none;
    color: var(--color-text-muted);
    font-size: 0.875rem;
    cursor: pointer;
    padding: 0;
    transition: color 0.2s;
}

.btn-link:hover {
    color: var(--color-text-light);
}

.btn-link.btn-danger {
    color: var(--color-danger);
}

.btn-link.btn-success-action {
    color: var(--color-primary);
}

/* --- Configurações de Eventos (Abas) --- */
.webhook-settings {
    background-color: var(--color-bg-card);
    border-radius: 0.5rem;
    padding: 1.5rem;
    margin-bottom: 3rem;
    width: 100%;
}

.tabs-navigation {
    display: flex;
    gap: 1.5rem;
    border-bottom: 1px solid var(--color-border);
    margin-bottom: 1.5rem;
}

.tab-btn {
    background: none;
    border: none;
    color: var(--color-text-muted);
    font-weight: 500;
    padding: 0.5rem 0;
    cursor: pointer;
    transition: color 0.2s, border-bottom 0.2s;
    position: relative;
    font-size: 1rem;
}

.tab-btn.active {
    color: var(--color-text-light);
}

.tab-btn.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: var(--color-primary); /* Alterado para a cor verde da imagem */
}

/* Conteúdo da Aba Eventos */
.events-content {
    padding: 1rem 0;
    position: relative; /* Para o botão Salvar Eventos */
    min-height: 150px;
}

.events-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr); /* 4 colunas como na imagem */
    gap: 1.5rem;
    margin-bottom: 1.5rem;
}


.btn-save-events {
    color: var( --color-text-black);
    position: absolute;
    bottom: 0;
    right: 0;
}

/* --- Estilo Personalizado dos Checkboxes (Radio Style) --- */

.checkbox-container {
    display: flex;
    align-items: center;
    position: relative; /* Para posicionar o estilo personalizado */
    padding-left: 1.75rem; /* Espaço para o checkbox personalizado */
    margin-bottom: 0.75rem;
    cursor: pointer;
    font-size: 0.9rem;
    color: var(--color-text-light); /* Cor do texto do evento */
    user-select: none;
}

.checkbox-custom {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}

.checkbox-custom-style {
    position: absolute;
    top: 0;
    left: 0;
    height: 1.25rem; /* 20px */
    width: 1.25rem; /* 20px */
    background-color: transparent;
    border-radius: 50%; /* Torna-o circular */
    border: 2px solid var(--color-primary); /* Borda verde */
    transition: all 0.2s;
}

/* Quando o input (invisível) é marcado */
.checkbox-container input:checked ~ .checkbox-custom-style {
    background-color: var(--color-primary); 
    border-color: var(--color-primary);
}

/* Cria o "ponto" branco no centro do checkbox marcado */
.checkbox-custom-style:after {
    content: "";
    position: absolute;
    display: none;
}

.checkbox-container input:checked ~ .checkbox-custom-style:after {
    display: block;
}

.checkbox-container .checkbox-custom-style:after {
    /* Estilo do círculo interno */
    top: 4px; /* 20px de altura - 8px de ponto / 2 */
    left: 4px; /* 20px de largura - 8px de ponto / 2 */
    width: 8px; 
    height: 8px;
    border-radius: 50%;
    background: var(--color-bg-card); /* Cor de fundo do card para o círculo interno */
}


/* --- Alerta e Uptime Footer --- */
.alert-uptime-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end; /* Alinha o gráfico à parte inferior */
    padding-top: 1.5rem;
    border-top: 1px solid var(--color-border);
    width: 100%;
}

.alert-settings {
    flex-grow: 1;
    text-align: left;
}

.alert-toggle {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    gap: 1rem;
}

.alert-toggle p {
    font-size: 1rem;
    font-weight: 500;
}

.alert-destinations p {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    margin-bottom: 0.25rem;
}

.alert-destinations input {
    width: 400px; 
    padding: 0.5rem 0.75rem;
    background-color: #1f2937;
    border-radius: 0.25rem;
    color: var(--color-text-light);
    font-size: 0.875rem;
}

/* --- Switch Toggle (Personalizado) --- */
.switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--color-border);
    transition: 0.4s;
    border-radius: 24px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
}

input:checked + .slider {
    background-color: var(--color-primary);
}

input:checked + .slider:before {
    transform: translateX(20px);
}

/* --- Uptime / Gráfico --- */
.uptime-metrics {
    text-align: right;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.uptime-text {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-primary);
}

.uptime-chart {
    width: 150px;
    height: 60px;
    display: flex;
    gap: 3px;
    align-items: flex-end;
    margin: 0.5rem 0;
}

.bar-chart-placeholder {
    /* Simulação das barras do gráfico (placeholder) */
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

.bar-chart-placeholder::before {
    content: '';
    /* Simulação das barras usando uma máscara SVG */
    display: block;
    width: 100%;
    height: 100%;
    background: var(--color-primary);
    /* SVG para simular barras de diferentes alturas */
    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Crect x='0' y='10' width='1.5' height='10' rx='0.2'/%3E%3Crect x='2.5' y='5' width='1.5' height='15' rx='0.2'/%3E%3Crect x='5' y='7' width='1.5' height='13' rx='0.2'/%3E%3Crect x='7.5' y='3' width='1.5' height='17' rx='0.2'/%3E%3Crect x='10' y='1' width='1.5' height='19' rx='0.2'/%3E%3Crect x='12.5' y='8' width='1.5' height='12' rx='0.2'/%3E%3Crect x='15' y='4' width='1.5' height='16' rx='0.2'/%3E%3Crect x='17.5' y='6' width='1.5' height='14' rx='0.2'/%3E%3C/svg%3E");
    mask-repeat: no-repeat;
    mask-size: cover;
}


.deliveries-label {
    font-size: 0.75rem;
    color: var(--color-text-muted);
}

@media (min-width: 768px) {
    .webhook-card{
        min-height: 300px;
    }

    .layout{
        max-width: calc(100% - 240px);
        padding: 0 20px;
        margin-left: 240px;
    }
}

/* --- Responsividade (Opcional, mas recomendado) --- */
@media (max-width: 1200px) {
    .events-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {

    .header-webhook {
        display: flex;
        gap: 15px;
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 1px solid #2c3038;
        align-items: center;
        flex-direction: column-reverse;
    }
    .webhook-cards-grid {
        grid-template-columns: 1fr;
    }
    
    .events-grid {
        grid-template-columns: 1fr;
    }

    .alert-uptime-footer {
        flex-direction: column;
        align-items: flex-start;
        gap: 2rem;
    }

    .alert-destinations input {
        width: 100%;
    }
    
    .btn-new-connection {
        position: static;
        width: 100%;
        order: -1; /* Mover para cima em telas pequenas */
        margin-bottom: 1rem;
    }

    .tabs-navigation{
        overflow-x: auto;
        overflow-y: hidden;
    }
}
</style>
