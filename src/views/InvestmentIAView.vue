<template>
    <div class="layout-ia-investment">
        <AppSidebar :is-open="isSidebarOpen" :is-collapsed="isSidebarCollapsed" @toggle-collapse="toggleSidebarCollapse" />

        <main class="layout-content-investment">
            <button class="hamburger-btn" @click="toggleSidebar" aria-label="Abrir menu">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button> 
            
            <header class="header-investment">
                <div class="header-info-container">
                    
                    <div class="header-info-item balance-item">
                        <span class="info-label">Saldo</span>
                        <div class="info-value-group">
                            <span class="info-value">R$18.250,00</span>
                            <span class="badge real-badge">Real</span>
                            <span class="badge demo-badge">Demo</span>
                        </div>
                    </div>
                    
                    <div class="header-info-item result-item">
                        <span class="info-label">Resultado Hoje</span>
                        <div class="info-value-group">
                            <span class="info-value result-value">+R$247,50</span>
                            <span class="result-percent">(+1,34%)</span>
                        </div>
                    </div>

                    <div class="header-info-item trades-item">
                        <span class="info-label">Trades Hoje</span>
                        <span class="info-value">23</span>
                    </div>

                    <div class="header-info-item status-item">
                        <span class="info-label">Status</span>
                        <div class="info-value-group">
                            <span class="status-dot" :class="{ 'active': isInvestmentActive }"></span>
                            <span class="info-value status-text" :class="{ 'active': isInvestmentActive }">IA {{ isInvestmentActive ? 'Ativa' : 'Inativa' }}</span>
                        </div>
                    </div>
                </div>

                <div class="header-actions">
                    <button class="btn-action pause-btn" :class="{ 'active': isInvestmentActive, 'inactive': !isInvestmentActive }" @click="toggleInvestmentState">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path v-if="isInvestmentActive" d="M6 19H10V5H6V19ZM14 5V19H18V5H14Z" fill="white"/>
                            <path v-else d="M8 5V19L19 12L8 5Z" fill="white"/>
                        </svg>
                        {{ isInvestmentActive ? 'Pausar IA' : 'Ativar IA' }}
                    </button>
                    <button class="btn-action disconnect-btn">Desconectar</button>
                </div>
            </header>
            
            <div class="main-content-area">
                <InvestmentActive v-if="isInvestmentActive" />
                <InvestmentInactive v-else />
            </div>
        </main>

        <footer class="zenix-footer">
            <div class="footer-inner">
                <div class="footer-grid">
                    <div class="footer-brand-section">
                        <div class="zenix-logo-text-footer">
                            <div class="logo-main-text">ZENIX</div>
                            <div class="logo-sub-text">PRO</div>
                        </div>
                        <p class="footer-description">
                            Plataforma inteligente de investimentos com IA, copy trading e automação para traders profissionais.
                        </p>
                        <div class="footer-social-links">
                            <a href="#" class="social-link">
                                <i class="fa-brands fa-twitter text-sm"></i>
                            </a>
                            <a href="#" class="social-link">
                                <i class="fa-brands fa-linkedin text-sm"></i>
                            </a>
                            <a href="#" class="social-link">
                                <i class="fa-brands fa-instagram text-sm"></i>
                            </a>
                            <a href="#" class="social-link">
                                <i class="fa-brands fa-youtube text-sm"></i>
                            </a>
                        </div>
                    </div>

                    <div v-for="section in footerSections" :key="section.title" class="footer-section">
                        <h3 class="footer-section-title">{{ section.title }}</h3>
                        <ul class="footer-links-list">
                            <li v-for="link in section.links" :key="link">
                                <a href="#" class="footer-link">{{ link }}</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="footer-bottom-bar">
                    <div class="footer-bottom-content">
                        <p class="footer-copyright">© 2025 Zenix Pro. Todos os direitos reservados.</p>
                        <div class="footer-legal-links">
                            <a href="#" class="footer-link-legal">Política de Privacidade</a>
                            <span class="footer-separator">|</span>
                            <a href="#" class="footer-link-legal">Termos de Uso</a>
                            <span class="footer-separator">|</span>
                            <a href="#" class="footer-link-legal">Cookies</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</template>

<script>
// Componentes e lógica mantidos
import AppSidebar from '../components/Sidebar.vue';
import InvestmentInactive from '@/components/Investments/InvestmentInactive.vue'; 
import InvestmentActive from '@/components/Investments/InvestmentActive.vue';

export default {
    name: 'InvestmentIAView',
    components: {
        AppSidebar,
        InvestmentInactive,
        InvestmentActive
    },
    data() {
        return {
            isSidebarOpen: false,
            isSidebarCollapsed: false,
            // ⭐️ Alterado para 'false' para iniciar no estado Inativo
            isInvestmentActive: false, 

            footerSections: [
                {
                    title: 'Produto',
                    links: ['IA de Investimento', 'Copy Trading', 'Agente Autônomo', 'Zenix Academy']
                },
                {
                    title: 'Empresa',
                    links: ['Sobre Nós', 'Planos', 'Blog', 'Carreiras']
                },
                {
                    title: 'Suporte',
                    links: ['Central de Ajuda', 'Documentação', 'Status do Sistema', 'Contato']
                }
            ]
        }
    },
    methods: {
        // Método para alternar o estado
        toggleInvestmentState() {
            this.isInvestmentActive = !this.isInvestmentActive;
        },
        toggleSidebar() {
            this.isSidebarOpen = !this.isSidebarOpen;
        },
        toggleSidebarCollapse() {
            this.isSidebarCollapsed = !this.isSidebarCollapsed;
        }
    }
}
</script>

<style scoped>
/* Variáveis de Cores (Sugestões para o estilo escuro) */
:root {
    --zenix-background: #1e1e1e; /* Fundo Escuro */
    --zenix-text: #ffffff; /* Texto Claro */
    --zenix-secondary: #aaaaaa; /* Texto Secundário (cinza claro) */
    --zenix-dark-border: #333333; /* Borda/Separador escuro */
    --zenix-green: #4CAF50; /* Verde principal para Ativo */
    --zenix-red: #f44336; /* Vermelho para Pausar/Inativo */
    --zenix-header-height: 80px; /* Altura aproximada do header */
}

/* ------------------ Layout Geral e Responsividade ------------------ */

.layout-ia-investment {
    min-height: 100vh;
    background-color: var(--zenix-background);
    color: var(--zenix-text);
    font-family: Arial, sans-serif;
    width: calc(100% - 240px);
    margin-left: 240px;
}

.layout-content-investment {
    width: 100%;
    padding: 0;
}

/* Compensação de altura para o header fixo */
.main-content-area {
    width: 100%;
    padding: 20px;
    padding-top: var(--zenix-header-height); /* Adiciona espaço no topo */
}

/* Ajuste para quando a sidebar estiver fechada ou no mobile (o CSS da sidebar controlaria isso) */
@media (max-width: 1024px) {
    .layout-ia-investment {
        width: 100%;
        margin-left: 0;
    }
    
    .header-investment {
        max-width: 100%; /* O header fixo ocupa a largura total no mobile */
    }
}

/* Botão hamburger (oculto em desktop) */
.hamburger-btn {
    display: none;
    position: absolute;
    top: 15px;
    left: 15px;
    z-index: 20;
    background: none;
    color: white;
}


/* ------------------ Header (Baseado na Imagem) ------------------ */

.header-investment {
    display: flex;
    justify-content: space-between; 
    align-items: center;
    padding: 15px 20px;
    background-color: #0e0f0f; 
    border-bottom: 1px solid var(--zenix-dark-border);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
    width: 100%;
    position: fixed; /* FIXO */
    top: 0;
    z-index: 10;
    max-width: calc(100% - 240px);
    height: var(--zenix-header-height);
}

.header-info-container {
    display: flex;
    gap: 20px; /* Espaçamento mais apertado como na imagem */
    align-items: center;
}

/* Removendo borda dos itens, mantendo apenas a separação */
.header-info-item {
    display: flex;
    flex-direction: column;
    white-space: nowrap; 
    text-align: left;
    padding-right: 20px; /* Espaçamento para o separador */
    border-right: 1px solid var(--zenix-dark-border); /* Separador vertical */
}

/* O último item não tem separador */
.header-info-item:last-child {
    border-right: none;
    padding-right: 0;
}

/* Ajuste para o item de Saldo, que é maior */
.balance-item {
     padding-right: 30px;
}


.info-label {
    font-size: 0.8rem;
    color: var(--zenix-secondary);
    margin-bottom: 3px;
    text-transform: uppercase;
    font-weight: 500;
}

.info-value-group {
    display: flex;
    align-items: center;
    gap: 8px;
}

.info-value {
    font-size: 1.2rem; /* Aumentado para melhor destaque */
    font-weight: 700;
}

/* Estilos Específicos */
.result-value {
    color: var(--zenix-green); 
}

.result-percent {
    font-size: 0.9rem;
    color: var(--zenix-green);
    font-weight: 500;
}

.badge {
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
}

.real-badge {
    background-color: var(--zenix-green);
    color: #000000;
}

.demo-badge {
    background-color: #333333;
    color: var(--zenix-secondary);
}

.status-item .info-value-group {
    gap: 5px;
}

.status-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
}

.status-dot {
    background-color: var(--zenix-red); /* Cor padrão inativa */
}

.status-dot.active {
    background-color: var(--zenix-green);
}

.status-text {
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--zenix-red); /* Cor padrão inativa */
}

.status-text.active {
    color: var(--zenix-green);
}

/* Ações do Header */
.header-actions {
    display: flex;
    gap: 10px;
}

.btn-action {
    padding: 12px 20px; /* Aumentado um pouco */
    border-radius: 8px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background-color 0.2s;
    border: none;
    cursor: pointer ;
}

/* Estilo do botão de Pausa/Ativação */
.pause-btn.active {
    background-color: var(--zenix-green);
    color: white;
}
.pause-btn.active:hover {
    background-color: #3e8e41; /* Verde mais escuro no hover */
}

.pause-btn.inactive {
    background-color: var(--zenix-red); /* Exemplo para quando estiver Inativo (botão Ativar IA) */
    color: white;
}
.pause-btn.inactive:hover {
    background-color: #c0392b; /* Vermelho mais escuro no hover */
}

.disconnect-btn {
    background-color: #333333;
    color: white;
}
.disconnect-btn:hover {
    background-color: #555555;
}


/* ------------------ Responsividade do Header ------------------ */

@media (max-width: 1024px) {
    .hamburger-btn {
        display: block; /* Mostra o botão hamburger no mobile */
    }

    .header-investment {
        max-width: 100%;
        padding-left: 60px; /* Espaço para o botão hamburger */
    }
}

@media (max-width: 900px) {
    .header-investment {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
        height: auto; /* Altura flexível */
        position: relative; /* Deixa de ser fixo no topo em telas menores */
        padding-top: 60px; /* Mais espaço para o hamburger se estiver ativado */
    }
    
    .main-content-area {
        padding-top: 20px; /* Remove a compensação fixa de altura */
    }


    .header-info-container {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(2, 1fr); /* 2 colunas */
        gap: 20px 15px;
    }
    
    .header-info-item {
        border-right: none; /* Remove separador vertical */
        padding-right: 0;
        border-bottom: 1px solid var(--zenix-dark-border); /* Adiciona separador horizontal */
        padding-bottom: 10px;
    }

    .header-info-item:last-child {
        border-bottom: none;
    }
    
    .header-actions {
        width: 100%;
        justify-content: space-between;
        margin-top: 10px;
    }

    .btn-action {
        flex-grow: 1; 
        justify-content: center;
    }
}

@media (max-width: 500px) {
     .header-info-container {
        grid-template-columns: 1fr; /* 1 coluna em telas muito pequenas */
    }
}


/* ------------------ Footer Responsividade ------------------ */

/* Estilos de Footer mantidos (sem alterações aqui, pois já estavam bons) */

.zenix-footer {
    background-color: var(--zenix-background);
    border-top: 1px solid var(--zenix-dark-border);
    padding: 30px;
}

.footer-inner {
    width: 100%;
    margin: 0 auto;
    padding: 0 1rem;
}

.footer-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 32px;
}

.footer-brand-section {
    grid-column: span 2;
}

/* Mobile: O footer vira 2 colunas */
@media (max-width: 768px) {
    .footer-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 30px;
    }

    .footer-brand-section {
        grid-column: span 2; 
    }

    .footer-section {
        grid-column: span 1; 
    }
}

/* Mobile Pequeno: O footer vira 1 coluna */
@media (max-width: 480px) {
    .footer-grid {
        grid-template-columns: 1fr;
        gap: 40px;
    }

    .footer-brand-section, .footer-section {
        grid-column: span 1;
    }

    .footer-bottom-content {
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }

    .footer-legal-links {
        flex-wrap: wrap;
        justify-content: center;
    }

    .footer-separator:first-of-type {
        display: none; 
    }
}

.zenix-logo-text-footer {
    display: flex;
    align-items: baseline;
    gap: 4px;
    margin-bottom: 12px;
}

.logo-main-text {
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: 0.05em;
}

.logo-sub-text {
    font-size: 0.875rem;
    color: var(--zenix-secondary);
    font-weight: 700;
}

.footer-description {
    font-size: 0.875rem;
    color: var(--zenix-secondary);
    margin-bottom: 24px;
    text-align: left;
    max-width: 350px;
}

.footer-social-links {
    display: flex;
    gap: 16px;
}

.social-link {
    color: var(--zenix-secondary);
    transition: color 0.2s;
}
.social-link:hover {
    color: var(--zenix-green);
}

.footer-section-title {
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 12px;
    text-align: left;

}

.footer-links-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    text-align: left;

}

.footer-link {
    font-size: 0.875rem;
    color: var(--zenix-secondary);
    text-decoration: none;
    transition: color 0.2s;
}
.footer-link:hover {
    color: var(--zenix-text);
}

.footer-bottom-bar {
    margin-top: 32px;
    padding-top: 16px;
    border-top: 1px solid var(--zenix-dark-border);
}

.footer-bottom-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.footer-copyright {
    font-size: 0.75rem;
    color: var(--zenix-secondary);
}

.footer-legal-links {
    display: flex;
    align-items: center;
    gap: 12px;
}

.footer-link-legal {
    font-size: 0.75rem;
    color: var(--zenix-secondary);
    text-decoration: none;
    transition: color 0.2s;
}
.footer-link-legal:hover {
    color: var(--zenix-text);
}

.footer-separator {
    color: rgba(141, 141, 141, 0.5);
    font-size: 0.75rem;
}

</style>
