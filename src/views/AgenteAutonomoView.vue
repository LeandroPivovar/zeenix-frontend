<template>
    <div class="layout-ia-investment" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
        <main class="layout-content-investment">
            <div class="agent-config-container">
                <header class="config-header">
                    <h1>Configuração do Agente Autônomo</h1>
                    <p>Configure uma única vez. O agente operará todos os dias até atingir suas metas.</p>
                </header>

                <section class="config-section">
                    <h2>Mercado</h2>
                    <div class="market-options options-grid">
                        <div 
                            class="option-card"
                            :class="{ 'selected': selectedMarket === 'synthetic_indices' }"
                            @click="selectMarket('synthetic_indices')"
                        >
                            <svg class="icon-market" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            <h3>Índices Sintéticos</h3>
                            <p>Volatilidade contínua ideal para o agente.</p>
                        </div>
                        <div 
                            class="option-card"
                            :class="{ 'selected': selectedMarket === 'metals' }"
                            @click="selectMarket('metals')"
                        >
                            <svg class="icon-market" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"></path><path d="M15 9l-4 6-4-2"></path><path d="M9 9h6v6H9z"></path></svg>
                            <h3>Metais</h3>
                            <p>Tendências amplas e movimentos consistentes.</p>
                        </div>
                        <div 
                            class="option-card"
                            :class="{ 'selected': selectedMarket === 'forex' }"
                            @click="selectMarket('forex')"
                        >
                            <svg class="icon-market" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V5h18"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v6H3"></path></svg>
                            <h3>Forex</h3>
                            <p>Mercado global 24h com dinâmica moderada.</p>
                        </div>
                        <div 
                            class="option-card"
                            :class="{ 'selected': selectedMarket === 'crypto' }"
                            @click="selectMarket('crypto')"
                        >
                            <svg class="icon-market" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.875 16.5a4.5 4.5 0 1 1 0-9h-1.5a.75.75 0 0 0-.75.75v7.5c0 .414.336.75.75.75h1.5z"></path><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"></path><path d="M17.25 10.5h-4.5"></path><path d="M17.25 13.5h-4.5"></path></svg>
                            <h3>Cripto</h3>
                            <p>Alta volatilidade e grandes amplitudes de preço.</p>
                        </div>
                    </div>
                </section>

                <section class="config-section">
                    <h2>Estratégias Disponíveis</h2>
                    <div class="strategies-options options-grid">
                        <div 
                            class="option-card"
                            :class="{ 'selected': selectedStrategy === 'arion' }"
                            @click="selectStrategy('arion')"
                        >
                            <svg class="icon-strategy" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                            <h3>Arion</h3>
                            <p>Microtransações rápidas e alta liquidez.</p>
                        </div>
                        <div 
                            class="option-card"
                            :class="{ 'selected': selectedStrategy === 'cryptomax' }"
                            @click="selectStrategy('cryptomax')"
                        >
                            <svg class="icon-strategy" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.875 16.5a4.5 4.5 0 1 1 0-9h-1.5a.75.75 0 0 0-.75.75v7.5c0 .414.336.75.75.75h1.5z"></path><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"></path><path d="M17.25 10.5h-4.5"></path><path d="M17.25 13.5h-4.5"></path></svg>
                            <h3>CryptoMax</h3>
                            <p>Otimizada para cripto com volatilidade elevada.</p>
                        </div>
                        <div 
                            class="option-card"
                            :class="{ 'selected': selectedStrategy === 'orion_ultra' }"
                            @click="selectStrategy('orion_ultra')"
                        >
                            <svg class="icon-strategy" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                            <h3>Orion Ultra</h3>
                            <p>Confirmação tripla com filtros inteligentes.</p>
                        </div>
                        <div 
                            class="option-card"
                            :class="{ 'selected': selectedStrategy === 'metaflow' }"
                            @click="selectStrategy('metaflow')"
                        >
                            <svg class="icon-strategy" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"></path><path d="M15 9l-4 6-4-2"></path><path d="M9 9h6v6H9z"></path></svg>
                            <h3>MetaFlow</h3>
                            <p>Otimizada para os ciclos dos metais.</p>
                        </div>
                    </div>
                </section>

                <section class="config-section risk-section">
                    <h2>Nível de Risco</h2>
                    <div class="risk-options">
                        <div 
                            class="option-card"
                            :class="{ 'selected': selectedRisk === 'conservative' }"
                            @click="selectRisk('conservative')"
                        >
                            <svg class="icon-risk" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                            <h3>Conservador</h3>
                            <p>Baixo risco, retornos estáveis</p>
                        </div>
                        <div 
                            class="option-card"
                            :class="{ 'selected': selectedRisk === 'balanced' }"
                            @click="selectRisk('balanced')"
                        >
                            <svg class="icon-risk" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 18v-6"></path><path d="M17 12h5l-1-4h-5z"></path><path d="M7 12H2l1-4h5z"></path><path d="M12 2L9 6h6z"></path><path d="M19 19c-3.3 0-6 2-6 3h6"></path><path d="M5 19c3.3 0 6 2 6 3H5"></path></svg>
                            <h3>Equilibrado</h3>
                            <p>Risco moderado, bom equilíbrio</p>
                        </div>
                        <div 
                            class="option-card"
                            :class="{ 'selected': selectedRisk === 'aggressive' }"
                            @click="selectRisk('aggressive')"
                        >
                            <svg class="icon-risk" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C10.5 4 10 6 10 8c0 3 2 5 3 7 1.5 2 2 3 2 4 0 1.5-1 2-2 2s-2-.5-2-2.5c0-.5-.5-1-1-1s-1 .5-1 1c0 1.5-2 3-3 3-1 0-2-1-2-3 0-2.5 1.5-4 2-5 1-2 1-3 1-5 0-3-1.5-5-3-7z"></path></svg>
                            <h3>Agressivo</h3>
                            <p>Alto risco, maiores retornos</p>
                        </div>
                    </div>
                </section>

                <section class="config-section daily-params-section">
                    <h2>Parâmetros Diários</h2>
                    <div class="daily-params-grid">
                        <div class="param-input-group">
                            <h3>Valor por operação</h3>
                            <div class="input-display">${{ valorOperacao }}</div>
                        </div>
                        <div class="param-input-group">
                            <h3>Meta diária de lucro</h3>
                            <div class="input-display">${{ metaLucro }}</div>
                        </div>
                        <div class="param-input-group">
                            <h3>Limite de perda do dia</h3>
                            <div class="input-display">${{ limitePerda }}</div>
                        </div>
                    </div>
                </section>

                <section class="config-section summary-section">
                    <h2>Resumo da Configuração</h2>
                    <div class="summary-grid">
                        <div class="summary-item">
                            <svg class="icon-summary-market" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            <span>Mercado</span>
                            <strong>{{ getMarketTitle(selectedMarket) }}</strong>
                        </div>
                        <div class="summary-item value-per-op">
                            <svg class="icon-value-op" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M15 8.44c-.58 0-1.2-.35-1.78-.9-.67-.62-1.3-.77-2.02-.77-1.15 0-2.08.76-2.08 1.96 0 1.25.75 1.83 2.05 2.5.9.48 1.77.8 2.37 1.15 1.4.82 2.3 1.8 2.3 3.3 0 1.8-1.1 2.8-2.6 2.8-.82 0-1.6-.26-2.4-.76-.73-.46-1.5-.7-2.15-.7"></path><path d="M12 4v16"></path></svg>
                            <span>Valor por operação</span>
                            <strong>${{ valorOperacao }}</strong>
                        </div>
                        <div class="summary-item">
                            <svg class="icon-summary-strategy" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                            <span>Estratégia</span>
                            <strong>{{ getStrategyTitle(selectedStrategy) }}</strong>
                        </div>
                        <div class="summary-item daily-goal">
                            <svg class="icon-daily-goal" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="12" y1="2" x2="12" y2="4"></line><line x1="12" y1="20" x2="12" y2="22"></line><line x1="2" y1="12" x2="4" y2="12"></line><line x1="20" y1="12" x2="22" y2="12"></line></svg>
                            <span>Meta diária</span>
                            <strong>${{ metaLucro }}</strong>
                        </div>
                        <div class="summary-item">
                            <svg class="icon-summary-risk" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 18v-6"></path><path d="M17 12h5l-1-4h-5z"></path><path d="M7 12H2l1-4h5z"></path><path d="M12 2L9 6h6z"></path><path d="M19 19c-3.3 0-6 2-6 3h6"></path><path d="M5 19c3.3 0 6 2 6 3H5"></path></svg>
                            <span>Nível de risco</span>
                            <strong>{{ getRiskTitle(selectedRisk) }}</strong>
                        </div>
                        <div class="summary-item daily-loss">
                            <svg class="icon-daily-loss" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
                            <span>Limite de perda</span>
                            <strong>${{ limitePerda }}</strong>
                        </div>
                    </div>
                </section>

                <button class="start-button">
                    INICIAR AGENTE AUTÔNOMO
                </button>

                <footer class="config-footer">
                    O agente executará operações automaticamente 24/7. Ao atingir a meta diária ou limite de perda, ele pausa e retorna somente no próximo ciclo.
                </footer>
            </div>
        </main>
    </div>
</template>

<script>
export default {
    name: 'AgenteAutonomoView',
    data() {
        return {
            isSidebarCollapsed: false,
            
            // Estado de seleção inicial
            selectedMarket: 'synthetic_indices',
            selectedStrategy: 'arion',
            selectedRisk: 'balanced',

            // Parâmetros
            valorOperacao: '50.00',
            metaLucro: '100.00',
            limitePerda: '50.00',
        };
    },
    methods: {
        selectMarket(marketId) {
            this.selectedMarket = marketId;
        },
        selectStrategy(strategyId) {
            this.selectedStrategy = strategyId;
        },
        selectRisk(riskId) {
            this.selectedRisk = riskId;
        },
        getMarketTitle(id) {
            const map = {
                'synthetic_indices': 'Índices Sintéticos',
                'metals': 'Metais',
                'forex': 'Forex',
                'crypto': 'Cripto'
            };
            return map[id] || id;
        },
        getStrategyTitle(id) {
            const map = {
                'arion': 'Arion',
                'cryptomax': 'CryptoMax',
                'orion_ultra': 'Orion Ultra',
                'metaflow': 'MetaFlow'
            };
            return map[id] || id;
        },
        getRiskTitle(id) {
            const map = {
                'conservative': 'Conservador',
                'balanced': 'Equilibrado',
                'aggressive': 'Agressivo'
            };
            return map[id] || id;
        }
    },
}
</script>

<style scoped>
/* --------------------------------------------------- */
/* Estilos para a aparência Dark Mode da imagem */
/* --------------------------------------------------- */

/* 1. Reset básico do layout e container */
.layout-content-investment {
    padding: 40px;
    background-color: #0d0d0d; /* Fundo principal escuro */
    min-height: 100vh;
}
.agent-config-container {
    max-width: 900px; 
    margin: 0 auto;
    color: #ffffff;
    font-family: 'Inter', sans-serif;
}

/* 2. Títulos e cabeçalho */
.config-header h1 {
    font-size: 1.8em;
    margin-bottom: 5px;
    font-weight: 600;
}
.config-header p {
    color: #b0b0b0;
    font-size: 0.9em;
    margin-bottom: 40px;
}
.config-section h2 {
    font-size: 1.1em;
    margin-bottom: 15px;
    font-weight: 500;
    color: #e0e0e0;
}

/* 3. Cards de Opção (Mercado, Estratégia, Risco) */
.options-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 40px;
}
.risk-options {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 40px;
    max-width: 650px; 
}
.option-card {
    background-color: #1a1a1a;
    border: 1px solid #333;
    padding: 15px 15px;
    border-radius: 6px;
    transition: all 0.2s;
    cursor: pointer;
    min-height: 90px;
    display: flex;
    flex-direction: column;
    min-width: 250px;
    text-align: left;
}
/* Estilo Selecionado: Fundo preto e borda verde */
.option-card.selected {
    border: 1px solid #00ff66; 
    background-color: #19723b25;
}
.option-card h3 {
    font-size: 0.95em;
    font-weight: 600;
    margin-bottom: 10px;
    margin-top: 5px;
}
.option-card p {
    font-size: 0.8em;
    color: #999;
    line-height: 1.3;
}
/* Estilização dos Ícones (Agora SVGs) */
.option-card svg {
    /* REGRA ATUALIZADA: Força o tamanho 20x20 para os ícones principais */
    width: 30px;
    height: 30px;
    display: block;
    color: #666; 
}
/* Estilo para ícones selecionados, usando a cor do stroke no SVG */
.option-card.selected svg {
    color: #00ff66; 
}
.risk-options .option-card {
    text-align: center;
    align-items: center;
    justify-content: center;
}
.risk-options .option-card svg {
    margin: 0 auto;
}
.risk-options .option-card h3 {
    margin-top: 5px; 
}

/* 4. Parâmetros Diários */
.daily-params-grid {
    display: flex;
    gap: 20px;
    margin-bottom: 40px;
}
.param-input-group h3 {
    font-size: 0.8em;
    color: #999;
    margin-bottom: 8px;
    font-weight: 500;
}
.input-display {
    background-color: #1a1a1a;
    border: 1px solid #333;
    padding: 10px 12px;
    border-radius: 4px;
    font-size: 1.0em;
    font-weight: bold;
    width: 170px; 
    text-align: left;
    color: #fff;
    height: 40px; 
    line-height: 20px;
}


/* 5. Resumo da Configuração */
.summary-section {
    padding: 25px;
    background-color: #111; 
    border-radius: 8px;
    margin-bottom: 30px;
}
.summary-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px 40px;
}
.summary-item {
    display: flex;
    align-items: center;
    font-size: 0.9em;
}
/* Estilos para a coluna da direita (Valores) */
.summary-item.value-per-op, 
.summary-item.daily-goal, 
.summary-item.daily-loss {
    justify-content: flex-end; 
}
/* Ajuste de ícones no resumo */
.summary-item svg {
    /* Mantém o tamanho original (16x16) para ícones de resumo */
    width: 16px; 
    height: 16px;
    color: #00ff66; 
    margin-right: 10px;
}
.summary-item span {
    color: #999;
    margin-right: 5px;
    white-space: nowrap;
}
.summary-item strong {
    font-weight: bold;
    color: #fff;
    white-space: nowrap;
}
/* Força a quebra de linha para o resumo em telas menores */
@media (max-width: 700px) {
    .summary-grid {
        grid-template-columns: 1fr;
        gap: 10px;
    }
    .summary-item.value-per-op, 
    .summary-item.daily-goal, 
    .summary-item.daily-loss {
        justify-content: flex-start; /* Altera o alinhamento para o lado esquerdo em telas pequenas */
    }
}


/* 6. Botão */
.start-button {
    width: 100%;
    padding: 15px;
    background-color: #00ff66;
    color: #000;
    border: none;
    border-radius: 4px;
    font-size: 1.0em;
    font-weight: bold;
    cursor: pointer;
    letter-spacing: 1px;
    transition: background-color 0.2s;
}
.start-button:hover {
    background-color: #33ff88;
}

/* 7. Rodapé */
.config-footer {
    text-align: center;
    font-size: 0.75em;
    color: #888;
    margin-top: 25px;
    line-height: 1.4;
}

.icon-market, .icon-strategy, .icon-risk {
    padding: 5px;
    background: #0e0e0e70;
    border-radius: 8px;
}



</style>