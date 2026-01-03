<template>
    <div class="copy-trading-config">
        <div class="card card-left">
            <h3 class="card-title">
                Selecionar Trader
                <TooltipsCopyTraders position="right">
                    <p>Mostra o Trader Mestre atualmente selecionado. As operações dele serão replicadas automaticamente após a ativação do Copy.</p>
                </TooltipsCopyTraders>
            </h3>
            
            <div class="select-wrapper">
                <select 
                    v-model="selectedTrader" 
                    @change="onTraderSelected"
                    class="trader-select"
                    :disabled="loadingTraders"
                >
                    <option value="">{{ loadingTraders ? 'Carregando traders...' : 'Selecione um trader' }}</option>
                    <option v-for="trader in tradersList" :key="trader.id" :value="trader.id">
                        {{ trader.name }} (ROI: {{ trader.roi }}%, Win Rate: {{ trader.winRate }}%)
                    </option>
                </select>
            </div>
            
            <div class="trader-info-area">
                <div v-if="!selectedTrader" class="empty-state">
                    <div class="empty-icon">
                        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="25" cy="25" r="25" fill="#2a2a2a"/>
                            <g fill="#22C55E" transform="translate(-3, 0)">
                                <circle cx="25" cy="18" r="6"/>
                                <path d="M15 35c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke="#22C55E" stroke-width="2" fill=""/>
                                <line x1="37" y1="20" x2="43" y2="20" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round"/>
                                <line x1="40" y1="17" x2="40" y2="23" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round"/>
                            </g>
                        </svg>
                    </div>
                    <p>Nenhum trader selecionado</p>
                    <small>Clique no campo acima para escolher</small>
                </div>
                
                <div v-else class="trader-info-card">
                    <div class="trader-info-row">
                        <span class="info-label">Nome:</span>
                        <span class="info-value">{{ selectedTraderStats.name }}</span>
                    </div>
                    <div class="trader-info-row">
                        <span class="info-label">ROI:</span>
                        <span class="info-value green">{{ selectedTraderStats.roi }}%</span>
                    </div>
                    <div class="trader-info-row">
                        <span class="info-label">Drawdown:</span>
                        <span class="info-value">{{ selectedTraderStats.dd }}%</span>
                    </div>
                    <div class="trader-info-row">
                        <span class="info-label">Seguidores:</span>
                        <span class="info-value">{{ selectedTraderStats.followers }}k</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="card card-middle">
            <h3 class="card-title">Configurações do Copy</h3>
            
            <div class="form-group">
                <label class="form-label">
                    Tipo de Replicação
                    <TooltipsCopyTraders position="center">
                        <p><strong>Proporção (%):</strong> Replica a mesma porcentagem de risco usada pelo Trader Mestre. Exemplo: Se o mestre entrar com 2% do saldo dele, você também entra com 2% do seu saldo.</p>
                        <p><strong>Valor Fixo ($):</strong> Replica exatamente o mesmo valor financeiro do Trader Mestre. Exemplo: Se o mestre entrar com $5, sua conta também entra com $5.</p>
                    </TooltipsCopyTraders>
                </label>
                <div class="allocation-buttons-group">
                    <button 
                        :class="{ active: allocationType === 'percentage' }" 
                        @click="allocationType = 'percentage'"
                    >
                        Proporção (%)
                    </button>
                    <button 
                        :class="{ active: allocationType === 'fixed' }" 
                        @click="allocationType = 'fixed'"
                    >
                        Valor Fixo ($)
                    </button>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">
                    Alavancagem
                    <TooltipsCopyTraders position="center">
                        <p>A alavancagem multiplica proporcionalmente o valor das suas operações em relação ao Trader Mestre. Use com cautela, pois aumenta tanto os ganhos quanto as perdas.</p>
                    </TooltipsCopyTraders>
                </label>
                <select v-model="leverage">
                    <option>1x</option>
                    <option>2x</option>
                    <option>5x</option>
                    <option>10x</option>
                </select>
            </div>

            <div class="profit-loss-group">
                <div class="form-group">
                    <label class="form-label">
                        Limite de perda
                        <TooltipsCopyTraders position="center">
                            <p>O valor máximo que você aceita arriscar na sessão. Nosso sistema possui Stop de Precisão: ele ajusta automaticamente o valor da última entrada para garantir que você nunca perca mais do que definiu aqui.</p>
                        </TooltipsCopyTraders>
                    </label>
                    <input type="number" v-model.number="stopLoss" step="0.01" min="0" placeholder="250">
                </div>

                <div class="form-group">
                    <label class="form-label">
                        Alvo de lucro
                        <TooltipsCopyTraders>
                            <p>Sua meta financeira para a sessão. O sistema encerrará as operações automaticamente assim que este valor for atingido ou superado.</p>
                        </TooltipsCopyTraders>
                    </label>
                    <input type="number" v-model.number="takeProfit" step="0.01" min="0" placeholder="500">
                </div>
            </div>

            <div class="toggle-wrapper">
                <div class="toggle-info">
                    <h4>
                        Stop Loss Blindado
                        <TooltipsCopyTraders position="center">
                            <p>Ative para proteção dinâmica. Quando você atinge 40% da meta, o sistema cria um 'piso de segurança' móvel. Se o mercado virar, o sistema para com lucro garantido (50% do pico), impedindo que você devolva seus ganhos.</p>
                        </TooltipsCopyTraders>
                    </h4>
                    <p>Protege contra operações consecutivas fora do padrão</p>
                </div>
                <label class="toggle">
                    <input type="checkbox" v-model="armoredStopLossActive">
                    <span class="slider"></span>
                </label>
            </div>
        </div>

        <div class="card card-right">
            <h3 class="card-title">Resumo da Configuração</h3>
            
            <div class="summary-item">
                <span class="label">
                    Trader
                    <TooltipsCopyTraders position="left">
                        <p>Mostra o Trader Mestre atualmente selecionado.</p>
                    </TooltipsCopyTraders>
                </span>
                <span class="value">{{ selectedTraderName || 'Nenhum selecionado' }}</span>
            </div>

            <div class="summary-item">
                <span class="label">
                    Alocação
                    <TooltipsCopyTraders position="left">
                        <p>Indica se você está copiando em Porcentagem (%) ou Valor Fixo ($). Isso afeta diretamente o valor das entradas copiadas na sua conta.</p>
                    </TooltipsCopyTraders>
                </span>
                <span class="value">{{ allocationType === 'percentage' ? 'Proporção %' : 'Valor Fixo $' }}</span>
            </div>
            
            <div class="summary-item">
                <span class="label">
                    Base de Replicação
                    <TooltipsCopyTraders position="left">
                        <p>Como o sistema irá replicar as operações do trader.</p>
                    </TooltipsCopyTraders>
                </span>
                <span class="value">
                    {{ allocationType === 'fixed' ? 'Mesmo Valor do Trader' : 'Mesma % do Trader' }}
                </span>
            </div>

            <div class="summary-item">
                <span class="label">
                    Alavancagem
                    <TooltipsCopyTraders position="left">
                        <p>A alavancagem multiplica proporcionalmente o valor das suas operações em relação ao Trader Mestre.</p>
                    </TooltipsCopyTraders>
                </span>
                <span class="value">{{ leverage }}</span>
            </div>

            <div class="form-group">
                <div class="summary-item">
                    <span class="label">
                        Limite de perda
                        <TooltipsCopyTraders position="left">
                            <p>O valor máximo que você aceita arriscar na sessão. Nosso sistema possui Stop de Precisão: ele ajusta automaticamente o valor da última entrada para garantir que você nunca perca mais do que definiu aqui.</p>
                        </TooltipsCopyTraders>
                    </span>
                    <span class="value red">{{ stopLoss }}</span>
                </div>
            </div>

            <div class="summary-item">
                <span class="label">
                    Alvo de lucro
                    <TooltipsCopyTraders position="left">
                        <p>Sua meta financeira para a sessão. O sistema encerrará as operações automaticamente assim que este valor for atingido ou superado.</p>
                    </TooltipsCopyTraders>
                </span>
                <span class="value green">{{ takeProfit }}</span>
            </div>

            <div class="summary-item">
                <span class="label">
                    Stop Loss Blindado
                    <TooltipsCopyTraders position="left">
                        <p>Ative para proteção dinâmica. Quando você atinge 40% da meta, o sistema cria um 'piso de segurança' móvel. Se o mercado virar, o sistema para com lucro garantido (50% do pico), impedindo que você devolva seus ganhos.</p>
                    </TooltipsCopyTraders>
                </span>
                <span :class="['value', { green: armoredStopLossActive, red: !armoredStopLossActive }]">
                    {{ armoredStopLossActive ? 'Ativa' : 'Inativa' }}
                </span>
            </div>

            <div class="status-badge status-badge-inside">
                <span class="status-dot"></span>
                <div class="status-text">
                    <div class="status-title">
						<strong>Aguardando Ativação</strong> 
						<TooltipsCopyTraders position="right">
							<p>O Copy será iniciado após você confirmar</p>
						</TooltipsCopyTraders>
					</div>
                    <small>O Copy será iniciado após você confirmar</small>
                </div>
            </div>

            <button class="activate-btn" @click="activateCopy" :disabled="activating">
                {{ activating ? 'Ativando...' : 'ATIVAR COPY' }}
            </button>

            <p class="warning-text">
             O Copy está configurado para operar com 
            risco controlado. Verifique as configurações antes de ativar.
            </p>
        </div>
        
        <!-- Status badge separado no mobile -->
        <div class="card status-badge-mobile">
            <div class="status-badge">
                <span class="status-dot"></span>
                <div class="status-text">
                    <div class="status-title">
						<strong>Aguardando Ativação</strong> 
						<TooltipsCopyTraders position="right">
							<p>O Copy será iniciado após você confirmar</p>
						</TooltipsCopyTraders>
					</div>
                    <small>O Copy será iniciado após você confirmar</small>
                </div>
            </div>
            
            <button class="activate-btn activate-btn-mobile" @click="activateCopy" :disabled="activating">
                {{ activating ? 'Ativando...' : 'ATIVAR COPY' }}
            </button>
        </div>
    </div>
</template>

<script>
import TooltipsCopyTraders from '../TooltipsCopyTraders.vue';

export default {
    name: 'CopyTradingConfig',
    components: {
        TooltipsCopyTraders,
    },
    data() {
        return {
            selectedTrader: '',
            selectedTraderName: '',
            allocationType: 'percentage', // Mantido como 'percentage' por padrão
            allocationValue: null,
            leverage: '1x',
            stopLoss: 250,
            takeProfit: 500,
            armoredStopLossActive: true,
            tradersList: [],
            loadingTraders: false,
            activating: false,
        };
    },
    computed: {
        selectedTraderStats() {
            const trader = this.tradersList.find(t => t.id === this.selectedTrader);
            return trader || { name: '', roi: '0', dd: '0', followers: '0' };
        }
    },
    methods: {
        async loadTraders() {
            this.loadingTraders = true;
            try {
                const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
                const response = await fetch(`${apiBase}/copy-trading/traders`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                const result = await response.json();
                if (result.success && result.data) {
                    this.tradersList = result.data;
                } else {
                    console.error('Erro ao carregar traders:', result.message || 'Unknown error');
                    this.tradersList = [];
                }
            } catch (error) {
                console.error('Erro ao buscar traders disponíveis:', error);
                this.tradersList = [];
            } finally {
                this.loadingTraders = false;
            }
        },
        onTraderSelected() {
            if (this.selectedTrader) {
                const trader = this.tradersList.find(t => t.id === this.selectedTrader);
                this.selectedTraderName = trader ? trader.name : '';
            } else {
                this.selectedTraderName = '';
            }
        },
        async activateCopy() {
            // Validação 1: Trader selecionado
            if (!this.selectedTrader) {
                // Log de erro de validação (substituindo o alert)
                console.error('Erro de validação: Por favor, selecione um trader antes de ativar o copy!');
                return;
            }

            // Não precisa mais validar allocation_value
            // O sistema irá replicar automaticamente os valores do trader

            this.activating = true;

            try {
                const userId = this.getUserId();
                if (!userId) {
                    console.error('Erro: Usuário não identificado. Faça login novamente.');
                    this.activating = false;
                    return;
                }

                const derivToken = this.getDerivToken();
                if (!derivToken) {
                    console.error('Erro: Token Deriv não encontrado. Conecte sua conta Deriv primeiro.');
                    this.activating = false;
                    return;
                }

                const selectedTraderData = this.tradersList.find(t => t.id === this.selectedTrader);
                if (!selectedTraderData) {
                    console.error('Erro: Trader selecionado não encontrado.');
                    this.activating = false;
                    return;
                }

                // Limpar 'x' do leverage
                const leverageValue = this.leverage.replace('x', '').replace('X', '');
                const leverageFormatted = `${leverageValue}x`;
                
                // Lógica de valores para API
                // O valor será replicado automaticamente do trader, não precisa configurar
                const apiAllocationType = this.allocationType === 'percentage' ? 'proportion' : 'fixed';
                const apiAllocationValue = null;  // Sempre null - será baseado no trader
                const apiAllocationPercentage = this.allocationType === 'percentage' ? 100 : null;

                console.log('🚀 Ativando copy trading via API...');

                const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
                const response = await fetch(`${apiBase}/copy-trading/activate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        traderId: this.selectedTrader,
                        traderName: selectedTraderData.name,
                        allocationType: apiAllocationType,
                        allocationValue: apiAllocationValue,
                        allocationPercentage: apiAllocationPercentage,
                        leverage: leverageFormatted,
                        stopLoss: this.stopLoss,
                        takeProfit: this.takeProfit,
                        blindStopLoss: this.armoredStopLossActive,
                        derivToken: derivToken,
                        currency: this.getPreferredCurrency() || 'USD'
                    }),
                });

                const result = await response.json();

                if (result.success) {
                    console.log('✅ Copy Trading ativado com sucesso!');
                    console.log('📊 Sessão criada:', result.data);
                    this.$emit('copy-activated');
                } else {
                    console.error('❌ Erro ao ativar:', result.message || 'Erro ao ativar copy trading. Tente novamente.');
                }
            } catch (error) {
                console.error('❌ Erro ao ativar copy trading:', error);
                console.error('Erro ao ativar copy trading. Verifique sua conexão e tente novamente.');
            } finally {
                this.activating = false;
            }
        },
        getUserId() {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    return payload.userId || payload.sub || payload.id;
                }

                const userInfoStr = localStorage.getItem('user_info');
                if (userInfoStr) {
                    const userInfo = JSON.parse(userInfoStr);
                    return userInfo.id || userInfo.userId;
                }

                return null;
            } catch (error) {
                console.error('Erro ao obter userId:', error);
                return null;
            }
        },
        getDerivToken() {
            try {
                const connectionStr = localStorage.getItem('deriv_connection');
                if (connectionStr) {
                    const connection = JSON.parse(connectionStr);
                    const accountLoginid = connection.loginid;

                    if (accountLoginid) {
                        const tokensByLoginIdStr = localStorage.getItem('deriv_tokens_by_loginid') || '{}';
                        const tokensByLoginId = JSON.parse(tokensByLoginIdStr);
                        const specificToken = tokensByLoginId[accountLoginid];
                        if (specificToken) {
                            return specificToken;
                        }
                    }
                }
                return localStorage.getItem('deriv_token');
            } catch (error) {
                console.error('Erro ao obter token Deriv:', error);
                return localStorage.getItem('deriv_token');
            }
        },
        getPreferredCurrency() {
            try {
                const connectionStr = localStorage.getItem('deriv_connection');
                if (connectionStr) {
                    const connection = JSON.parse(connectionStr);
                    if (connection.tradeCurrency) {
                        return connection.tradeCurrency.toUpperCase();
                    }
                }
            } catch (error) {
                console.error('Erro ao obter moeda preferida:', error);
            }
            return 'USD';
        },
    },
    async mounted() {
        await this.loadTraders();
    },
};
</script>

<style scoped>
.copy-trading-config {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
}

/* --- Card --- */
.card {
    background: #ebebeb;
    border: 1px solid #222;
    border-radius: 0px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    position: relative;
    z-index: 0;
    margin: 0;
}

/* .card-middle { z-index: 2; } */


.summary-item[data-v-fdae4e08]:last-of-type{
    border-bottom: 1px solid #222;
}
.card-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #DFDFDF;
    margin-bottom: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
}

/* --- Form Elements --- */

/* Select wrapper */
.select-wrapper {
    position: relative;
    margin-bottom: 20px;
}

.trader-select {
    width: 100%;
    background: #0a0a0a;
    border: 1px solid #222;
    border-radius: 6px;
    padding: 12px 16px;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 40px;
}

.trader-select:focus {
    outline: none;
    border-color: #4ade80;
}

/* Área de informações do trader */
.trader-info-area {
    min-height: 120px;
}

.trader-info-card {
    background: #0a0a0a;
    border: 1px solid #222;
    border-radius: 8px;
    padding: 16px;
}

.trader-info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #222;
}

.trader-info-row:last-child {
    border-bottom: none;
}

.info-label {
    font-size: 14px;
    color: #a5a5a5;
}

.info-value {
    font-size: 14px;
    font-weight: 500;
    color: #fff;
}

.info-value.green {
    color: #4ade80;
}

/* Estilos gerais para inputs (exceto o de busca, que é mais específico) e selects */
select, input[type="text"], input[type="number"] {
    width: 100%;
    background: #0a0a0a;
    border: 1px solid #222;
    border-radius: 6px;
    /* Padding padrão para os outros campos */
    padding: 12px;
    color: #fff;
    font-size: 14px;
}

select:focus, input[type="text"]:focus, input[type="number"]:focus {
    outline: none;
    border-color: #4ade80;
}


.form-label {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.875rem;
    color: #A1A1A1;
    margin-bottom: 0.5rem;
}

/* NOVO ESTILO PARA BOTÕES DE ALOCAÇÃO SEPARADOS */
.allocation-buttons-group {
    display: flex; /* Flexbox para organizar lado a lado */
    gap: 10px; /* Espaço entre os botões */
}

.allocation-buttons-group button {
    flex: 1; /* Divide o espaço igualmente */
    background: #0a0a0a;
    border: none;
    border-radius: 6px; /* Borda arredondada */
    color: #888;
    padding: 12px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s;
}

.allocation-buttons-group button.active {
    background: transparent;
    color: #22C55E;
    border: 1px solid #22C55E;
    box-shadow: inset 0 0 10px rgba(34, 197, 94, 0.2);
}

.allocation-buttons-group button:hover:not(.active) {
    background: #1a1a1a;
}
/* FIM NOVO ESTILO */


.form-group input{
    margin: 0;
}

.profit-loss-group {
    display: flex;
    flex-direction: column;
    gap: 0;
}
/* Estilo para a mensagem de alocação padrão (REMOVIDA) */
/* .allocation-info-message {
    background: #0a0a0a;
    border: 1px dashed #333;
    border-radius: 6px;
    padding: 12px;
}
.allocation-info-message p {
    font-size: 14px;
    color: #fff;
    margin-bottom: 4px;
}
.allocation-info-message small {
    font-size: 12px;
    color: #666;
} */

/* --- Empty State --- */
.empty-state {
    background: #0a0a0a;
    border: 1px dashed #333;
    border-radius: 8px;
    padding: 10px 20px;
    text-align: center;
}

.empty-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
    font-size: 32px;
    color: #333;
}

.empty-state p {
    color: #fff;
    margin-bottom: 4px;
    font-size: 18px;
}

.empty-state small {
    color: #666;
    font-size: 14px;
}

/* --- Toggle Switch --- */
.toggle-wrapper {
    background: #0a0a0a;
    border: 1px solid #222;
    border-radius: 6px;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
    margin-top: 20px;
}

.toggle-info h4 {
    font-size: 0.875rem;
    font-weight: 500;
    color: #A1A1A1;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 6px;
}

.toggle-info > p {
    font-size: 0.75rem;
    color: #7A7A7A;
    width: 100%;
    max-width: 200px;
    margin: 0;
}

.toggle {
    position: relative;
    display: inline-block; 
    width: 46px; 
    height: 24px; 
    margin: 0; 
}

.toggle input {
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
    background-color: #333; 
    transition: .4s;
    border-radius: 24px; 
}

.slider:before {
    position: absolute;
    content: "";
    height: 18px; 
    width: 18px; 
    left: 3px; 
    bottom: 3px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}

.status-title {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	gap: 8px;
}

input:checked + .slider {
    background-color: #22C55E; 
}

input:checked + .slider:before {
    transform: translateX(22px); 
}

/* --- Summary Card --- */
.summary-item {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #222;
    font-size: 14px;
}

.summary-item:last-of-type {
    border-bottom: none;
}

/* Borda abaixo do Stop Loss */
.card-right .form-group .summary-item {
    border-bottom: 1px solid #222 !important;
    padding-bottom: 12px;
    margin-bottom: 0;
}

/* Remover border none e padding 0 do form-group do Stop Loss */
.card-right .form-group {
    border: initial;
    padding: initial;
}

/* Remover borda abaixo de Proteção */
.card-right .summary-item:last-of-type {
    border-bottom: 1px solid #222 !important;
}



.summary-item .label {
    color: #a5a5a5;
    display: flex;
    align-items: center;
    gap: 6px;
}

.summary-item .value {
    font-weight: 500;
}

.value.red {
    color: #ef4444;
}

.value.green {
    color: #4ade80;
}

.status-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #0a0a0a;
    border: 1px solid #333;
    border-radius: 6px;
    padding: 16px;
    margin: 20px 0;
}

/* Status badge mobile - oculto por padrão (desktop) */
.status-badge-mobile {
    display: none;
}

.status-dot {
    width: 8px;
    height: 8px;
    background: #fbbf24;
    border-radius: 50%;
    animation: pulse-dot 2s infinite;
}

@keyframes pulse-dot {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.4;
    }
}

.status-text {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: column;
    flex: 1;
}

.status-text strong {
    display: block;
    color: #ebebeb;
    font-size: 14px;
    margin-bottom: 4px;
}

.status-text small {
    color: #666;
    font-size: 12px;
}

.activate-btn {
    width: 100%;
    background: #22C55E;
    border: none;
    color: #fff;
    padding: 16px;
    border-radius: 6px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 0px;
    transition: background 0.3s;
}

.activate-btn:hover {
    background: #15803d;
}

.activate-btn:active {
    transform: scale(0.98);
}

.warning-text {
    font-size: 12px;
    color: #666;
    text-align: center;
    line-height: 1.5;
}

.warning-text .highlight {
    color: #fbbf24;
    font-weight: 500;
}

/* Classes de Destaque */
.tooltip-box .highlight { color: #fbbf24; font-weight: 500; }
.tooltip-box .caution { color: #ef4444; font-weight: 500; }
.tooltip-box .highlight-green { color: #4ade80; font-weight: 500; }

.tooltip-box.tooltip-lef {
    left: 0;
    transform: translateX(0);

    width: 350px;
    z-index: 9999;

}

/* Responsividade - Desktop mantém layout grid de 3 colunas */
@media (min-width: 1025px) {
    .copy-trading-config {
        grid-template-columns: 1fr 1fr 1fr;
        gap: 20px;
    }
    
    /* Cor dos cards no desktop */
    .card {
        background: #0b0b0b !important;
    }
    
    /* Botões de alocação no desktop */
    .allocation-buttons-group button {
        background: #0a0a0a;
        border: 1px solid #555;
        color: #888;
    }
    
    .allocation-buttons-group button.active {
        background: #16a34a;
        color: #fff;
        border: 1px solid #22C55E;
        box-shadow: none;
    }
    
    /* Ocultar status badge mobile no desktop */
    .status-badge-mobile {
        display: none;
    }
    
    /* Mostrar status badge e botão dentro do resumo no desktop */
    .card-right .status-badge-inside {
        display: flex;
    }
    
    .card-right .activate-btn {
        display: block;
    }
    
    .activate-btn-mobile {
        display: none;
    }
}

/* Tablet */
@media (max-width: 1200px) and (min-width: 769px) {
    .copy-trading-config {
        grid-template-columns: 1fr 1fr;
        gap: 16px;
    }
    
    .card-right {
        grid-column: 1 / -1;
    }
}

/* Mobile - Layout Vertical como na imagem */
@media (max-width: 768px) {
    .copy-trading-config {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding-bottom: 90px;
    }
    
    .card {
        width: 100%;
        padding: 20px 20px 10px 20px;
        margin: 0;
        background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%) !important;
        border: 1px solid #1C1C1C;
        border-radius: 8px;
    }
    
    /* Ocultar status-badge e botão dentro do resumo no mobile */
    .card-right .status-badge-inside {
        display: none;
    }
    
    .card-right .activate-btn {
        display: none;
    }
    
    /* Mostrar status-badge como card separado no mobile */
    .status-badge-mobile {
        display: block;
    }
    
    /* Ajustar resumo no mobile */
    .card-right .summary-item:last-of-type {
        margin-bottom: 0;
    }
    
    .card-right .warning-text {
        display: none;
    }
    
    /* Status badge mobile como card separado */
    .status-badge-mobile .status-badge {
        margin: 0 0 20px 0;
        border: none;
        background: transparent;
        padding: 0;
    }
    
    /* Botão dentro do card status-badge-mobile */
    .status-badge-mobile .activate-btn-mobile {
        display: block;
        margin-top: 0;
    }
    
    .card-title {
        font-size: 15px;
        margin-bottom: 16px;
    }
    
    .allocation-buttons-group {
        display: flex;
        gap: 10px;
    }
    
    .allocation-buttons-group button {
        flex: 1;
        background: #0a0a0a;
        border: none;
        color: #888;
    }
    
    .allocation-buttons-group button.active {
        background: transparent;
        color: #22C55E;
        border: 1px solid #22C55E;
        box-shadow: inset 0 0 10px rgba(34, 197, 94, 0.2);
    }
    
    .profit-loss-group {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
    }
    
    .toggle-wrapper {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
    }
    
    .toggle-wrapper .toggle {
        flex-shrink: 0;
    }

    .select-wrapper,
    .trader-select,
    select,
    input[type="text"],
    input[type="number"] {
        width: 100%;
    }
}
</style>