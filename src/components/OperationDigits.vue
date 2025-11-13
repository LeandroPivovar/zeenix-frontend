<template>
    <div class="main-container">
        <div v-if="connectionError || isConnecting" class="connection-loading">
            <div class="loading-spinner"></div>
            <p>{{ loadingMessage }}</p>
        </div>
            
        <div v-else class="flex-row-gap">
            <div class="col-left">
                <div class="card">
                    <h3 class="card-header space-between">
                        Saldo da Conta 
                        <span class="status-time status-green">🟢 Online</span>
                    </h3>
                    <p class="account-balance space-between">
                        <span>{{ accountBalance }}</span> 
                        <span v-if="balanceChange" :class="['balance-change', balanceChange >= 0 ? 'status-green' : 'status-red']">
                            {{ balanceChange >= 0 ? '+' : '' }}{{ displayCurrency }} {{ Math.abs(balanceChange).toFixed(2) }}
                        </span>
                    </p>
                    <p class="text-small-opacity">Operações de dígitos em tempo real.</p>
                </div>

                <div class="card">
                    <h3 class="card-header">Configuração da Ordem</h3>
                    
                    <div class="input-group">
                        <label class="input-label">Mercado</label>
                        <select v-model="symbol" @change="handleSymbolChange" :disabled="!isAuthorized || isLoadingSymbol" class="select-field">
                            <optgroup label="Índices Contínuos">
                                <option v-for="market in marketsByCategory['Índices Contínuos']" :key="market.value" :value="market.value">
                                    {{ market.label }}
                                </option>
                            </optgroup>
                            <optgroup label="Criptomoedas">
                                <option v-for="market in marketsByCategory['Criptomoedas']" :key="market.value" :value="market.value">
                                    {{ market.label }}
                                </option>
                            </optgroup>
                            <optgroup label="Forex Majors">
                                <option v-for="market in marketsByCategory['Forex Majors']" :key="market.value" :value="market.value">
                                    {{ market.label }}
                                </option>
                            </optgroup>
                            <optgroup label="Forex Minors">
                                <option v-for="market in marketsByCategory['Forex Minors']" :key="market.value" :value="market.value">
                                    {{ market.label }}
                                </option>
                            </optgroup>
                            <optgroup label="Forex Exotics">
                                <option v-for="market in marketsByCategory['Forex Exotics']" :key="market.value" :value="market.value">
                                    {{ market.label }}
                                </option>
                            </optgroup>
                            <optgroup label="Metais">
                                <option v-for="market in marketsByCategory['Metais']" :key="market.value" :value="market.value">
                                    {{ market.label }}
                                </option>
                            </optgroup>
                        </select>
                    </div>

                    <div class="input-group">
                        <label class="input-label">Tipo de contrato de dígito</label>
                        <select v-model="digitType" class="select-field" :disabled="isTrading" @change="onDigitTypeChange">
                            <option value="DIGITMATCH">Match (Igual)</option>
                            <option value="DIGITDIFF">Differs (Diferente)</option>
                            <option value="DIGITOVER">Over (Maior que)</option>
                            <option value="DIGITUNDER">Under (Menor que)</option>
                            <option value="DIGITEVEN">Even (Par)</option>
                            <option value="DIGITODD">Odd (Ímpar)</option>
                        </select>
                </div>

                    <div v-if="needsDigitBarrier" class="input-group">
                        <label class="input-label">Dígito de referência (0-9)</label>
                        <select v-model="digitBarrier" class="select-field" :disabled="isTrading" @change="subscribeToProposal">
                            <option v-for="d in [0,1,2,3,4,5,6,7,8,9]" :key="d" :value="String(d)">{{ d }}</option>
                        </select>
                    </div>

                    <div class="input-row-flex">
                        <div class="input-group-half">
                            <label class="input-label">Duração (Ticks)</label>
                            <input type="number" min="1" max="10" v-model.number="duration" class="input-field-value" :disabled="isTrading" @input="subscribeToProposal" />
                        </div>
                        <div class="input-group-half">
                            <label class="input-label">Valor da entrada ({{ displayCurrency }})</label>
                            <input type="number" min="0.35" step="0.01" v-model.number="orderValue" class="input-field-value" :disabled="isTrading" @input="subscribeToProposal" />
                        </div>
                    </div>

                    <div v-if="currentProposalPrice" class="proposal-info">
                        <div class="proposal-price-label">Preço de Compra:</div>
                        <div class="proposal-price-value">{{ displayCurrency }} {{ currentProposalPrice.toFixed(2) }}</div>
                    </div>

                    <div v-if="realTimeProfit !== null && activeContract" class="profit-info" :class="{ 'profit-positive': realTimeProfit > 0, 'profit-negative': realTimeProfit < 0 }">
                        <div class="profit-label">P&L em Tempo Real:</div>
                        <div class="profit-value">{{ displayCurrency }} {{ realTimeProfit > 0 ? '+' : '' }}{{ realTimeProfit.toFixed(2) }}</div>
                    </div>

                    <button 
                        v-if="!activeContract"
                        @click="executeBuy" 
                        class="btn-execute-operation btn-buy" 
                        :disabled="isTrading || !isAuthorized || !currentProposalId"
                    >
                        {{ isTrading ? 'Aguardando confirmação...' : 'COMPRAR' }}
                    </button>

                    <p v-if="tradeMessage" class="trade-message success">{{ tradeMessage }}</p>
                    <p v-if="tradeError" class="trade-message error">{{ tradeError }}</p>
                </div>

                <div class="card">
                    <h3 class="card-header space-between">
                        Status da Ordem
                        <span v-if="activeContract" class="text-bold-yellow">{{ contractTimeRemaining }}</span>
                    </h3>
                    <div v-if="activeContract" class="order-status-labels">
                        <span>Iniciado</span>
                        <span class="status-yellow">Ativo</span>
                        <span>Finalizado</span>
                    </div>
                    <div v-else class="order-status-labels">
                        <span>Iniciado</span>
                        <span>Analisando</span>
                        <span>Finalizado</span>
                    </div>
                    <div class="progress-bar-container">
                        <div v-if="activeContract" class="progress-bar-fill-yellow" :style="{ width: contractProgress + '%' }"></div>
                        <div v-else class="progress-bar-fill-yellow" style="width: 50%"></div>
                    </div>
                    <p v-if="activeContract" class="order-analysis">Contrato ativo - Monitorando resultado...</p>
                    <p v-else class="order-analysis">Aguardando operação...</p>
                    <div v-if="activeContract" class="order-detail">
                        <span>Tipo:</span>
                        <span class="order-type-buy">{{ getDigitTypeLabel(digitType) }} {{ needsDigitBarrier ? `(${digitBarrier})` : '' }}</span>
                    </div>
                </div>
            </div>

            <div class="col-middle">
                <div class="card full-height">
                    <h3 class="card-header">Últimos 20 Dígitos</h3>
                    <div class="digit-list">
                        <span v-for="(digit, index) in last20Digits.slice(0, 19)" :key="'d1'+index" class="digit-item">{{ digit }}</span>
                        <span v-if="last20Digits.length >= 20" class="digit-item-active">{{ last20Digits[19] }}</span>
                    </div>
                    <p class="digit-repetition">{{ currentRepetition }}</p>
                    
                    <div class="volatility-analysis-placeholder">
                        <p class="text-placeholder">Análise de Volatilidade de Dígitos</p>
                        <p class="text-small-opacity">Último preço: {{ latestTick ? latestTick.value.toFixed(pricePrecision) : '--' }}</p>
                    </div>
                </div>

                <div class="card">
                    <h3 class="card-header">Paridade</h3>
                    
                    <div class="parity-section">
                        <div class="parity-info">
                            <p class="parity-label">Pares</p>
                            <div class="parity-bar-bg margin-top-5">
                                <div class="parity-bar-purple" :style="{ width: digitFrequency.parity.even + '%' }"></div>
                            </div>
                        </div>
                        <span class="parity-percentage text-bold-purple">{{ digitFrequency.parity.even }}%</span>
                    </div>

                    <div class="parity-section margin-top-10">
                        <div class="parity-info">
                            <p class="parity-label">Ímpares</p>
                            <div class="parity-bar-bg margin-top-5">
                                <div class="parity-bar-red" :style="{ width: digitFrequency.parity.odd + '%' }"></div>
                            </div>
                        </div>
                        <span class="parity-percentage text-bold-red">{{ digitFrequency.parity.odd }}%</span>
                    </div>

                    <p :class="['parity-trend', parityTrendClass]">{{ parityTrendText }}</p>
                    <p class="text-micro-opacity margin-top-5">"Paridade limpa" — equilíbrio traz previsibilidade.</p>
                </div>
            </div>

            <div class="col-right">
                <div class="card">
                    <h3 class="card-header">Frequência por Dígito</h3>
                    <div class="frequency-list">
                        <div v-for="item in digitFrequencies" :key="item.digit" class="frequency-item">
                            <span class="digit-label">{{ item.digit }}</span>
                            <div class="frequency-bar-bg">
                                <div :class="`frequency-bar frequency-bar-color-${item.digit}`" :style="{ width: item.percentage + '%' }"></div>
                            </div>
                            <span :class="['frequency-percentage', getFrequencyClass(item.digit, item.percentage)]">{{ item.percentage }}%</span>
                        </div>
                    </div>
                    <p class="text-micro-opacity-border-top">Linha cinza marca a faixa neutra (10%)</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
const APP_ID = process.env.VUE_APP_DERIV_APP_ID || '1089';

export default {
    name: 'OperationDigits',
    props: {
        accountBalance: { type: String, required: true },
        accountCurrency: { type: String, default: 'USD' },
        preferredCurrency: { type: String, default: 'USD' },
        accountLoginid: { type: String, default: null },
        orderConfig: { type: Object, required: true },
        lastOrders: { 
            type: Array, 
            required: true,
            default: () => [],
        },
    },
    data() {
        return {
            ws: null,
            tickSubscriptionId: null,
            token: null,
            appId: null,
            isConnecting: false,
            isAuthorized: false,
            isLoadingSymbol: false,
            connectionError: '',
            tradeMessage: '',
            tradeError: '',
            symbol: 'R_100',
            markets: [
                // Índices Contínuos
                { value: 'R_10', label: 'Volatility 10 Index', category: 'Índices Contínuos' },
                { value: 'R_25', label: 'Volatility 25 Index', category: 'Índices Contínuos' },
                { value: 'R_50', label: 'Volatility 50 Index', category: 'Índices Contínuos' },
                { value: 'R_75', label: 'Volatility 75 Index', category: 'Índices Contínuos' },
                { value: 'R_100', label: 'Volatility 100 Index', category: 'Índices Contínuos' },
                { value: '1HZ10V', label: 'Volatility 10 (1s) Index', category: 'Índices Contínuos' },
                { value: '1HZ25V', label: 'Volatility 25 (1s) Index', category: 'Índices Contínuos' },
                { value: '1HZ50V', label: 'Volatility 50 (1s) Index', category: 'Índices Contínuos' },
                { value: '1HZ75V', label: 'Volatility 75 (1s) Index', category: 'Índices Contínuos' },
                { value: '1HZ100V', label: 'Volatility 100 (1s) Index', category: 'Índices Contínuos' },
                
                // Criptomoedas
                { value: 'cryBTCUSD', label: 'BTC/USD (Bitcoin)', category: 'Criptomoedas' },
                { value: 'cryETHUSD', label: 'ETH/USD (Ethereum)', category: 'Criptomoedas' },
                
                // Forex (Majors)
                { value: 'frxEURUSD', label: 'EUR/USD (Euro / Dólar)', category: 'Forex Majors' },
                { value: 'frxUSDJPY', label: 'USD/JPY (Dólar / Iene)', category: 'Forex Majors' },
                { value: 'frxGBPUSD', label: 'GBP/USD (Libra / Dólar)', category: 'Forex Majors' },
                { value: 'frxUSDCHF', label: 'USD/CHF (Dólar / Franco)', category: 'Forex Majors' },
                { value: 'frxAUDUSD', label: 'AUD/USD (Dólar Australiano)', category: 'Forex Majors' },
                { value: 'frxUSDCAD', label: 'USD/CAD (Dólar / Dólar Canadense)', category: 'Forex Majors' },
                { value: 'frxNZDUSD', label: 'NZD/USD (Dólar Neozelandês)', category: 'Forex Majors' },
                
                // Forex (Minors/Exotics)
                { value: 'frxEURGBP', label: 'EUR/GBP (Euro / Libra)', category: 'Forex Minors' },
                { value: 'frxEURJPY', label: 'EUR/JPY (Euro / Iene)', category: 'Forex Minors' },
                { value: 'frxGBPJPY', label: 'GBP/JPY (Libra / Iene)', category: 'Forex Minors' },
                { value: 'frxAUDCAD', label: 'AUD/CAD (Dólar Australiano / Canadense)', category: 'Forex Minors' },
                { value: 'frxAUDJPY', label: 'AUD/JPY (Dólar Australiano / Iene)', category: 'Forex Minors' },
                { value: 'frxCHFJPY', label: 'CHF/JPY (Franco / Iene)', category: 'Forex Minors' },
                { value: 'frxEURAUD', label: 'EUR/AUD (Euro / Dólar Australiano)', category: 'Forex Minors' },
                { value: 'frxGBPAUD', label: 'GBP/AUD (Libra / Dólar Australiano)', category: 'Forex Minors' },
                { value: 'frxUSDMXN', label: 'USD/MXN (Dólar / Peso Mexicano)', category: 'Forex Exotics' },
                
                // Metais
                { value: 'frxXAUUSD', label: 'XAU/USD (Ouro / Dólar)', category: 'Metais' },
                { value: 'frxXAGUSD', label: 'XAG/USD (Prata / Dólar)', category: 'Metais' },
                { value: 'frxXPTUSD', label: 'XPT/USD (Platina / Dólar)', category: 'Metais' },
                { value: 'frxXPDUSD', label: 'XPD/USD (Paládio / Dólar)', category: 'Metais' },
            ],
            ticks: [],
            latestTick: null,
            lastUpdate: null,
            digitType: 'DIGITMATCH',
            digitBarrier: '5',
            duration: 5,
            orderValue: 10,
            isTrading: false,
            currentProposal: null,
            proposalSubscriptionId: null,
            contractSubscriptionId: null,
            activeContract: null,
            currentProposalId: null,
            currentProposalPrice: null,
            realTimeProfit: null,
            connectionCurrency: null,
            retryCount: 0,
            retryTimeout: null,
            retryDelay: 3000,
            contractStartTime: null,
            contractDuration: null,
            isDestroying: false,
            digitFrequency: {
                digits: [],
                frequency: {},
                parity: { even: 0, odd: 0 },
            },
        }
    },
    computed: {
        marketsByCategory() {
            const grouped = {};
            this.markets.forEach(market => {
                const category = market.category || 'Outros';
                if (!grouped[category]) {
                    grouped[category] = [];
                }
                grouped[category].push(market);
            });
            return grouped;
        },
        loadingMessage() {
            if (this.connectionError) {
                return 'Reconectando automaticamente...';
            }
            if (this.isConnecting) {
                return 'Conectando à Deriv...';
            }
            return 'Carregando...';
        },
        pricePrecision() {
            if (this.symbol.startsWith('frx')) return 5;
            if ((this.accountCurrency || '').toUpperCase() === 'BTC') return 8;
            return 2;
        },
        displayCurrency() {
            let currency = this.preferredCurrency || this.accountCurrency || this.connectionCurrency || 'USD';
            if (currency.toUpperCase() === 'DEMO') {
                currency = 'USD';
            }
            return currency.toUpperCase();
        },
        needsDigitBarrier() {
            return this.digitType !== 'DIGITEVEN' && this.digitType !== 'DIGITODD';
        },
        last20Digits() {
            return this.digitFrequency.digits.slice(-20);
        },
        digitFrequencies() {
            const counts = new Array(10).fill(0);
            const totalDigits = this.digitFrequency.digits.length;

            this.digitFrequency.digits.forEach(digit => {
                if (digit >= 0 && digit <= 9) {
                    counts[digit]++;
                }
            });

            return counts.map((count, index) => {
                const percentage = totalDigits > 0 ? (count / totalDigits) * 100 : 0;
                return {
                    digit: index,
                    percentage: Math.round(percentage)
                };
            });
        },
        currentRepetition() {
            if (this.digitFrequency.digits.length === 0) {
                return 'Aguardando dados...';
            }
            const counts = new Array(10).fill(0);
            this.digitFrequency.digits.forEach(digit => {
                if (digit >= 0 && digit <= 9) {
                    counts[digit]++;
                }
            });

            let maxCount = 0;
            let maxDigit = -1;

            for (let i = 0; i < counts.length; i++) {
                if (counts[i] > maxCount) {
                    maxCount = counts[i];
                    maxDigit = i;
                }
            }
            
            if (maxDigit !== -1) {
                return `Repetição atual: ${maxCount}x dígito ${maxDigit}`;
            }
            return 'Repetição atual: 0x';
        },
        parityTrendText() {
            const diff = this.digitFrequency.parity.even - this.digitFrequency.parity.odd;
            if (Math.abs(diff) < 5) {
                return 'Tendência: equilibrada';
            }
            return diff > 0 
                ? 'Tendência: favorecendo pares'
                : 'Tendência: favorecendo ímpares';
        },
        parityTrendClass() {
            const diff = this.digitFrequency.parity.even - this.digitFrequency.parity.odd;
            if (Math.abs(diff) < 5) {
                return 'parity-trend-neutral';
            }
            return diff > 0 ? 'parity-trend-green' : 'parity-trend-red';
        },
        contractTimeRemaining() {
            if (!this.activeContract || !this.contractStartTime || !this.contractDuration) {
                return '--:--';
            }
            const now = Math.floor(Date.now() / 1000);
            const elapsed = now - this.contractStartTime;
            const remaining = Math.max(0, this.contractDuration - elapsed);
            const minutes = Math.floor(remaining / 60);
            const seconds = remaining % 60;
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        },
        contractProgress() {
            if (!this.activeContract || !this.contractStartTime || !this.contractDuration) {
                return 0;
            }
            const now = Math.floor(Date.now() / 1000);
            const elapsed = now - this.contractStartTime;
            return Math.min(100, (elapsed / this.contractDuration) * 100);
        },
        balanceChange() {
            // Calcular mudança de saldo baseado em operações recentes
            return null; // Implementar se necessário
        },
    },
    methods: {
        getDigitTypeLabel(type) {
            const labels = {
                'DIGITMATCH': 'MATCH',
                'DIGITDIFF': 'DIFFERS',
                'DIGITOVER': 'OVER',
                'DIGITUNDER': 'UNDER',
                'DIGITEVEN': 'EVEN',
                'DIGITODD': 'ODD',
            };
            return labels[type] || type;
        },
        getFrequencyClass(digit, percentage) {
            if (percentage > 15) return 'status-green';
            if (percentage > 10) return 'status-yellow';
            return '';
        },
        initConnection() {
            console.log('[OperationDigits] initConnection - Iniciando conexão WebSocket');
            
            if (this.retryTimeout) {
                clearTimeout(this.retryTimeout);
                this.retryTimeout = null;
            }
            
            if (this.ws) {
                this.teardownConnection();
            }

            this.ticks = [];
            this.latestTick = null;
            this.isLoadingSymbol = true;
            this.connectionError = '';
            this.isConnecting = true;
            
            this.token = this.getTokenForAccount();
            this.appId = localStorage.getItem('deriv_app_id') || APP_ID;

            if (!this.token) {
                console.error('[OperationDigits] ERRO: Nenhum token Deriv encontrado');
                this.isConnecting = false;
                localStorage.removeItem('deriv_connection');
                localStorage.removeItem('deriv_token');
                localStorage.removeItem('deriv_tokens_by_loginid');
                this.$router.push('/dashboard');
                return;
            }

            const endpoint = `wss://ws.derivws.com/websockets/v3?app_id=${this.appId}`;
            this.ws = new WebSocket(endpoint);

            this.ws.onopen = () => {
                setTimeout(() => {
                    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                        this.send({ authorize: this.token });
                    } else {
                        this.connectionError = 'Erro ao autorizar conexão. Reconectando automaticamente...';
                        this.scheduleRetry();
                    }
                }, 50);
            };

            this.ws.onmessage = (event) => {
                try {
                    const msg = JSON.parse(event.data);
                    this.handleMessage(msg);
                } catch (error) {
                    console.error('[OperationDigits] ERRO ao interpretar mensagem:', error);
                }
            };

            this.ws.onerror = (error) => {
                console.error('[OperationDigits] Erro no WebSocket:', error);
                this.connectionError = 'Erro na conexão com a Deriv. Reconectando automaticamente...';
                this.isConnecting = false;
                this.isAuthorized = false;
                this.scheduleRetry();
            };

            this.ws.onclose = () => {
                if (!this.isConnecting) {
                    this.connectionError = 'Conexão com a Deriv encerrada. Reconectando automaticamente...';
                    this.scheduleRetry();
                }
                this.isConnecting = false;
                this.isAuthorized = false;
                this.ws = null;
            };
        },
        scheduleRetry() {
            if (this.retryTimeout) {
                clearTimeout(this.retryTimeout);
            }
            
            this.retryCount++;
            const delay = Math.min(this.retryDelay * Math.pow(1.5, this.retryCount - 1), 30000);
            
            this.retryTimeout = setTimeout(() => {
                this.retryTimeout = null;
                this.initConnection();
            }, delay);
        },
        teardownConnection() {
            if (this.ws) {
                try {
                    this.ws.close();
                } catch (error) {
                    console.warn('Erro ao encerrar WebSocket', error);
                }
            }
            this.ws = null;
            this.tickSubscriptionId = null;
        },
        handleMessage(msg) {
            if (msg.error) {
                this.handleDerivError(msg.error);
                return;
            }

            switch (msg.msg_type) {
                case 'authorize':
                    this.processAuthorize(msg);
                    break;
                case 'history':
                    this.processHistory(msg);
                    break;
                case 'tick':
                    this.processTick(msg);
                    break;
                case 'proposal':
                    this.processProposal(msg);
                    break;
                case 'buy':
                    this.processBuy(msg);
                    break;
                case 'proposal_open_contract':
                    this.processProposalOpenContract(msg);
                    break;
            }
        },
        processAuthorize(msg) {
            console.log('[OperationDigits] ✓ Autorização recebida');
            const authorizeData = msg.authorize || {};
            this.isAuthorized = true;
            this.isConnecting = false;
            this.connectionError = '';
            this.retryCount = 0;
            this.connectionCurrency = authorizeData.currency?.toUpperCase() || this.accountCurrency;
            this.subscribeToSymbol();
            setTimeout(() => {
                this.subscribeToProposal();
            }, 500);
        },
        handleDerivError(error) {
            const message = error?.message || 'Erro desconhecido na Deriv';
            if (this.isTrading) {
                this.tradeError = message;
                this.tradeMessage = '';
                this.isTrading = false;
            } else {
                this.connectionError = `${message}. Reconectando automaticamente...`;
                this.isAuthorized = false;
                this.scheduleRetry();
            }
        },
        subscribeToSymbol() {
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
                return;
            }

            this.isLoadingSymbol = true;
            this.ticks = [];
            this.latestTick = null;

            if (this.tickSubscriptionId) {
                this.send({ forget: this.tickSubscriptionId });
                this.tickSubscriptionId = null;
            }

            const payload = {
                ticks_history: this.symbol,
                adjust_start_time: 1,
                count: 500,
                end: 'latest',
                subscribe: 1,
                style: 'ticks',
            };
            
            this.send(payload);
        },
        processHistory(msg) {
            const history = msg.history;
            if (!history || !history.prices) {
                return;
            }
            
            const prices = history.prices.map(price => Number(price));
            const times = history.times?.map(time => Number(time)) || [];
            this.ticks = prices.map((value, index) => ({ value, epoch: times[index] || index }));
            
            if (msg.subscription?.id) {
                this.tickSubscriptionId = msg.subscription.id;
            }
            
            this.isLoadingSymbol = false;
            this.calculateDigitFrequency();
        },
        processTick(msg) {
            const tick = msg.tick;
            if (!tick) {
                return;
            }
            
            if (tick.id && !this.tickSubscriptionId) {
                this.tickSubscriptionId = tick.id;
            }
            
            const value = Number(tick.quote);
            if (isNaN(value)) {
                return;
            }
            
            this.latestTick = { value, epoch: tick.epoch };
            this.lastUpdate = Date.now();
            this.ticks.push({ value, epoch: tick.epoch });
            
            if (this.ticks.length > 1000) {
                this.ticks.shift();
            }
            
            // Coletar os últimos 10 ticks e printar no console
            const last10Ticks = this.ticks.slice(-10);
            console.log('[OperationDigits] Últimos 10 ticks:', last10Ticks);
            
            this.calculateDigitFrequency();
        },
        calculateDigitFrequency() {
            const last20Ticks = this.ticks.slice(-20);
            const digits = [];
            const frequency = {};
            
            for (let i = 0; i <= 9; i++) {
                frequency[i] = 0;
            }
            
            last20Ticks.forEach(tick => {
                const value = Math.floor(tick.value);
                const lastDigit = value % 10;
                digits.push(lastDigit);
                frequency[lastDigit] = (frequency[lastDigit] || 0) + 1;
            });
            
            let evenCount = 0;
            let oddCount = 0;
            digits.forEach(d => {
                if (d % 2 === 0) evenCount++;
                else oddCount++;
            });
            
            const total = digits.length;
            this.digitFrequency = {
                digits,
                frequency,
                parity: {
                    even: total > 0 ? Math.round((evenCount / total) * 100) : 0,
                    odd: total > 0 ? Math.round((oddCount / total) * 100) : 0,
                },
            };
        },
        handleSymbolChange() {
            this.subscribeToSymbol();
            this.subscribeToProposal();
        },
        onDigitTypeChange() {
            this.subscribeToProposal();
        },
        subscribeToProposal() {
            this.unsubscribeFromProposal();
            
            if (!this.isAuthorized || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
                return;
            }
            
            if (this.activeContract) {
                return;
            }
            
            const payload = {
                proposal: 1,
                amount: Number(this.orderValue),
                basis: 'stake',
                contract_type: this.digitType,
                currency: this.displayCurrency,
                duration: Math.max(1, Number(this.duration)),
                duration_unit: 't',
                symbol: this.symbol,
                subscribe: 1,
            };
            
            if (this.needsDigitBarrier) {
                payload.barrier = this.digitBarrier;
            }
            
            console.log('[OperationDigits] Subscribing to proposal:', JSON.stringify(payload, null, 2));
            this.send(payload);
        },
        unsubscribeFromProposal() {
            if (this.proposalSubscriptionId && this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.send({ forget: this.proposalSubscriptionId });
                this.proposalSubscriptionId = null;
            }
            this.currentProposalId = null;
            this.currentProposalPrice = null;
        },
        processProposal(msg) {
            const proposal = msg.proposal;
            if (!proposal) {
                this.tradeError = 'Proposta inválida retornada pela Deriv.';
                this.currentProposalId = null;
                this.currentProposalPrice = null;
                return;
            }
            
            this.currentProposalId = proposal.id;
            this.currentProposalPrice = Number(proposal.ask_price);
            
            if (msg.subscription?.id) {
                this.proposalSubscriptionId = msg.subscription.id;
            }
        },
        executeBuy() {
            if (!this.isAuthorized) {
                this.tradeError = 'Conecte-se à Deriv antes de operar.';
                return;
            }
            
            if (!this.currentProposalId || !this.currentProposalPrice) {
                this.tradeError = 'Aguarde a proposta ser carregada.';
                return;
            }
            
            if (this.isTrading) {
                return;
            }
            
            this.tradeError = '';
            this.tradeMessage = '';
            this.isTrading = true;
            
            const buyPayload = {
                buy: this.currentProposalId,
                price: this.currentProposalPrice,
            };
            
            console.log('[OperationDigits] Executando compra:', JSON.stringify(buyPayload, null, 2));
            this.send(buyPayload);
        },
        processBuy(msg) {
            const buy = msg.buy;
            if (!buy) {
                this.tradeError = 'A Deriv não confirmou a compra.';
                this.isTrading = false;
                return;
            }

            console.log('[OperationDigits] ✓ Compra executada com sucesso!');
            
            this.unsubscribeFromProposal();
            
            this.activeContract = {
                contract_id: buy.contract_id,
                symbol: this.symbol,
                type: this.digitType,
                entry_spot: Number(buy.entry_spot || buy.spot || this.latestTick?.value || 0),
                purchase_time: buy.purchase_time,
                buy_price: Number(buy.buy_price),
                currency: this.displayCurrency,
                digitBarrier: this.needsDigitBarrier ? this.digitBarrier : null,
            };
            
            this.contractStartTime = buy.purchase_time || Math.floor(Date.now() / 1000);
            this.contractDuration = Number(this.duration);
            
            this.subscribeToContract(buy.contract_id);
            
            this.tradeMessage = 'Compra executada com sucesso. Monitorando contrato...';
            this.tradeError = '';
            this.isTrading = false;
            
            this.$emit('trade-result', {
                contractId: buy.contract_id,
                buyPrice: Number(buy.buy_price),
                balanceAfter: buy.balance_after != null ? Number(buy.balance_after) : null,
                purchaseTime: buy.purchase_time,
                currency: this.displayCurrency,
                direction: this.digitType,
                status: 'EXECUTED',
            });
        },
        subscribeToContract(contractId) {
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
                return;
            }
            
            const payload = {
                proposal_open_contract: 1,
                contract_id: contractId,
                subscribe: 1,
            };
            
            this.send(payload);
        },
        unsubscribeFromContract() {
            if (this.contractSubscriptionId && this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.send({ forget: this.contractSubscriptionId });
                this.contractSubscriptionId = null;
            }
        },
        processProposalOpenContract(msg) {
            const contract = msg.proposal_open_contract;
            if (!contract) {
                return;
            }
            
            if (msg.subscription?.id) {
                this.contractSubscriptionId = msg.subscription.id;
            }
            
            if (contract.profit !== undefined && contract.profit !== null) {
                this.realTimeProfit = Number(contract.profit);
            }
            
            if (contract.is_sold === 1) {
                setTimeout(() => {
                    this.finalizeContract(contract);
                }, 100);
            }
        },
        finalizeContract(contract) {
            this.unsubscribeFromContract();
            
            let finalProfit = 0;
            if (contract.profit !== undefined && contract.profit !== null) {
                finalProfit = Number(contract.profit);
            } else if (this.realTimeProfit !== null && this.realTimeProfit !== undefined) {
                finalProfit = Number(this.realTimeProfit);
            }
            
            this.$emit('trade-result', {
                contractId: this.activeContract?.contract_id,
                buyPrice: this.activeContract?.buy_price,
                sellPrice: contract.sell_price ? Number(contract.sell_price) : null,
                profit: finalProfit,
                balanceAfter: contract.balance_after ? Number(contract.balance_after) : null,
                currency: this.activeContract?.currency || this.displayCurrency,
                direction: this.activeContract?.type,
                status: 'CLOSED',
            });
            
            this.activeContract = null;
            this.realTimeProfit = null;
            this.contractStartTime = null;
            this.contractDuration = null;
            
            setTimeout(() => {
                this.subscribeToProposal();
            }, 500);
        },
        getTokenForAccount() {
            if (this.accountLoginid) {
                try {
                    const tokensByLoginIdStr = localStorage.getItem('deriv_tokens_by_loginid') || '{}';
                    const tokensByLoginId = JSON.parse(tokensByLoginIdStr);
                    const specificToken = tokensByLoginId[this.accountLoginid];
                    if (specificToken) {
                        return specificToken;
                    }
                } catch (error) {
                    console.error('[OperationDigits] Erro ao buscar token:', error);
                }
            }
            
            const defaultToken = localStorage.getItem('deriv_token');
            return defaultToken;
        },
        send(payload) {
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
                console.error('[OperationDigits] WebSocket não está pronto');
                return;
            }
            
            this.ws.send(JSON.stringify(payload));
        },
    },
    mounted() {
        console.log('[OperationDigits] Componente montado');
        if (this.orderConfig && this.orderConfig.value !== undefined) {
            this.orderValue = Number(this.orderConfig.value);
        }
        this.initConnection();
    },
    beforeUnmount() {
        console.log('[OperationDigits] Componente sendo desmontado');
        this.isDestroying = true;
        
        if (this.retryTimeout) {
            clearTimeout(this.retryTimeout);
            this.retryTimeout = null;
        }
        
        this.unsubscribeFromProposal();
        this.unsubscribeFromContract();
        this.teardownConnection();
    },
}
</script>

<style src="../assets/css/components/OperationDigits.css"></style>
<style scoped>
.connection-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 64px 32px;
    min-height: 400px;
}

.loading-spinner {
    width: 48px;
    height: 48px;
    border: 4px solid rgba(255, 255, 255, 0.1);
    border-top-color: #06d6a0;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 24px;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.input-group {
    margin-bottom: 16px;
}

.input-label {
    display: block;
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 8px;
}

.select-field, .input-field-value {
    width: 100%;
    padding: 10px 12px;
    background: rgba(30, 41, 59, 0.6);
    border: 1px solid rgba(148, 163, 184, 0.2);
    border-radius: 6px;
    color: #f8fafc;
    font-size: 0.9rem;
}

.input-row-flex {
    display: flex;
    gap: 12px;
}

.input-group-half {
    flex: 1;
}

.proposal-info {
    margin: 16px 0;
    padding: 12px;
    background: rgba(99, 102, 241, 0.1);
    border-radius: 8px;
    border: 1px solid rgba(99, 102, 241, 0.3);
}

.proposal-price-label {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 4px;
}

.proposal-price-value {
    font-size: 1.1rem;
    font-weight: 700;
    color: #6366f1;
}

.profit-info {
    margin: 16px 0;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid;
}

.profit-info.profit-positive {
    background: rgba(16, 185, 129, 0.1);
    border-color: rgba(16, 185, 129, 0.3);
}

.profit-info.profit-negative {
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.3);
}

.profit-label {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 4px;
}

.profit-value {
    font-size: 1.2rem;
    font-weight: 700;
}

.profit-info.profit-positive .profit-value {
    color: #10b981;
}

.profit-info.profit-negative .profit-value {
    color: #ef4444;
}

.btn-execute-operation {
    width: 100%;
    padding: 14px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    margin-top: 16px;
}

.btn-execute-operation.btn-buy {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
}

.btn-execute-operation.btn-buy:hover:not(:disabled) {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-execute-operation:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.trade-message {
    margin-top: 12px;
    font-size: 0.85rem;
    padding: 8px;
    border-radius: 6px;
}

.trade-message.success {
    color: #4ade80;
    background: rgba(16, 185, 129, 0.1);
}

.trade-message.error {
    color: #f87171;
    background: rgba(239, 68, 68, 0.1);
}

.parity-bar-purple {
    height: 100%;
    background: linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%);
    border-radius: 4px;
    transition: width 0.3s ease;
}

.parity-bar-red {
    height: 100%;
    background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
    border-radius: 4px;
    transition: width 0.3s ease;
}

.parity-trend-neutral {
    color: #94a3b8;
}

.parity-trend-red {
    color: #ef4444;
}
</style>
