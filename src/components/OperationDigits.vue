<template>
    <div class="main-container">
        <div v-if="connectionError || isConnecting" class="connection-loading">
            <div class="loading-spinner"></div>
            <p>{{ loadingMessage }}</p>
        </div>
            
        <div v-else class="digits-layout">
            <!-- Top Section: Semáforo + Histórico -->
            <div class="top-section">
                    <!-- Card Semáforo -->
                    <div id="semaphoreCard" class="semaphore-card semaphore-fade" :class="semaphoreStateClass">
                        <div class="semaphore-header">
                            <div class="semaphore-title-group">
                                <i :class="['fas', semaphoreIcon, 'semaphore-icon']"></i>
                                <h3 class="semaphore-title">{{ semaphoreTitle }}</h3>
                            </div>
                            <div class="relative group">
                                <i class="far fa-question-circle text-sm text-[#0099FF] cursor-help"></i>
                                <div class="tooltip-content">
                                    <div class="tooltip-title">Como Usar o Semáforo</div>
                                    <div class="tooltip-text">
                                        Este é o indicador PRINCIPAL.<br><br>
                                        Verde = sinal claro para operar com a estratégia mostrada.<br>
                                        Amarelo = aguarde, sem padrão claro ainda.<br>
                                        Vermelho = NÃO opere, condições desfavoráveis.<br><br>
                                        <strong>Exemplo:</strong> Verde mostrando 'MATCHES 7, Confiança 78%' = Entre na Deriv e faça uma operação Matches no dígito 7 por 5 ticks.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="semaphore-status-container">
                            <div class="semaphore-status">{{ semaphoreStatus }}</div>
                        </div>
                        <div class="semaphore-reason-box">
                            <div class="semaphore-reason-label">Razão</div>
                            <div class="semaphore-reason">{{ semaphoreReason }}</div>
                        </div>
                    </div>

                    <!-- Card Histórico -->
                    <div class="history-card">
                        <div class="card-header-with-help">
                            <h3 class="card-header">Histórico dos Últimos Dígitos</h3>
                            <div class="relative group">
                                <i class="far fa-question-circle text-sm text-[#0099FF] cursor-help opacity-80"></i>
                                <div class="tooltip-content">
                                    <div class="tooltip-title">Visualização do Histórico</div>
                                    <div class="tooltip-text">
                                        Mostra os últimos 20 dígitos recebidos em tempo real. O dígito destacado (em verde) é o mais recente.<br><br>
                                        Use este painel para validar visualmente padrões como repetições, alternâncias e clusters.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="digit-history-grid">
                            <div 
                                v-for="(digit, index) in last20Digits" 
                                :key="'hist-'+index" 
                                :class="['digit-history-item', index === last20Digits.length - 1 ? 'digit-history-active' : '']"
                            >
                                {{ digit }}
                            </div>
                        </div>
                    </div>
            </div>

            <!-- Trading Panel -->
            <div class="trading-panel">
                    <div class="trading-panel-header">
                        <h3 class="card-header">Negociação Manual — Dígitos</h3>
                    </div>
                    <div class="trading-panel-content">
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
                            <label class="input-label">Tipo de Operação</label>
                            <select v-model="digitType" class="select-field" :disabled="isTrading" @change="onDigitTypeChange">
                                <option value="DIGITMATCH">Dígitos (Último dígito)</option>
                            </select>
                        </div>

                        <div class="input-group">
                            <label class="input-label">Duração</label>
                            <div class="duration-input-group">
                                <select class="duration-select">
                                    <option>Ticks</option>
                                </select>
                                <input type="number" value="5" v-model.number="duration" class="duration-input" :disabled="isTrading" @input="subscribeToProposal" />
                            </div>
                        </div>

                        <div class="input-group">
                            <label class="input-label">Previsão</label>
                            <div class="prediction-buttons">
                                <button class="prediction-btn">Acima</button>
                                <button class="prediction-btn">Abaixo</button>
                            </div>
                        </div>

                        <div class="input-group">
                            <label class="input-label">Valor de entrada</label>
                            <input 
                                type="number" 
                                placeholder="Ex: 1.00, 2.50..." 
                                v-model.number="orderValue" 
                                class="input-field-value" 
                                :disabled="isTrading" 
                                @input="subscribeToProposal"
                            />
                        </div>

                        <div v-if="currentProposalPrice" class="proposal-info">
                            <div class="proposal-price-label">Preço de Compra:</div>
                            <div class="proposal-price-value">{{ displayCurrency }} {{ currentProposalPrice.toFixed(2) }}</div>
                        </div>

                        <div v-if="realTimeProfit !== null && activeContract" class="profit-info" :class="{ 'profit-positive': realTimeProfit > 0, 'profit-negative': realTimeProfit < 0 }">
                            <div class="profit-label">P&L em Tempo Real:</div>
                            <div class="profit-value">{{ displayCurrency }} {{ realTimeProfit > 0 ? '+' : '' }}{{ realTimeProfit.toFixed(2) }}</div>
                        </div>

                        <div class="trading-buttons">
                            <button 
                                v-if="!activeContract"
                                @click="executeBuy" 
                                class="btn-call" 
                                :disabled="isTrading || !isAuthorized || !currentProposalId"
                            >
                                CALL
                            </button>
                            <button 
                                v-if="!activeContract"
                                @click="executeBuy" 
                                class="btn-put" 
                                :disabled="isTrading || !isAuthorized || !currentProposalId"
                            >
                                PUT
                            </button>
                        </div>

                        <p v-if="tradeMessage" class="trade-message success">{{ tradeMessage }}</p>
                        <p v-if="tradeError" class="trade-message error">{{ tradeError }}</p>
                    </div>
            </div>

            <!-- Main Content Grid -->
            <div class="main-content-grid">
                <div class="cards-grid">
                    <!-- Linha 1: Mapa de Frequência + Heatmap -->
                    <div class="frequency-map-card">
                    <div class="card-header-with-help">
                        <h3 class="card-header">Mapa de Frequência dos Dígitos (0–9)</h3>
                        <i class="far fa-question-circle text-sm text-[#0099FF] cursor-help"></i>
                    </div>
                    <div class="frequency-map-grid">
                        <div v-for="item in digitFrequenciesWithStats" :key="'freq-'+item.digit" class="frequency-digit-block">
                            <div class="frequency-percentage-label">{{ item.percentage }}%</div>
                            <div 
                                class="frequency-bar-visual" 
                                :class="item.statusClass"
                                :style="{ height: item.barHeight + 'px' }"
                            ></div>
                            <div class="frequency-digit-number">{{ item.digit }}</div>
                            <div class="frequency-status-label">{{ item.statusText }}</div>
                            <div class="frequency-z-score">Z: {{ item.zScore }}</div>
                        </div>
                    </div>
                    </div>

                    <div class="heatmap-card">
                    <div class="card-header-with-help">
                        <h3 class="card-header">Heatmap Estatístico de Dígitos (0–9)</h3>
                        <i class="far fa-question-circle text-sm text-[#0099FF] cursor-help"></i>
                    </div>
                    <div class="heatmap-grid">
                        <div 
                            v-for="item in digitFrequenciesWithStats" 
                            :key="'heat-'+item.digit" 
                            class="heatmap-digit-block"
                            :class="[item.statusClass, item.isHighlighted ? 'heatmap-highlighted' : '']"
                        >
                            <div class="frequency-percentage-label">{{ item.percentage }}%</div>
                            <div 
                                class="frequency-bar-visual" 
                                :class="item.statusClass"
                                :style="{ height: item.barHeight + 'px' }"
                            ></div>
                            <div class="frequency-digit-number">{{ item.digit }}</div>
                            <div class="frequency-status-label">{{ item.statusText }}</div>
                            <div class="frequency-z-score">Z: {{ item.zScore }}</div>
                        </div>
                    </div>
                    <div class="heatmap-legend">
                        <div class="legend-item">
                            <div class="legend-dot legend-dot-green"></div>
                            <span>Subaquecido</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-dot legend-dot-yellow"></div>
                            <span>Normal</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-dot legend-dot-orange"></div>
                            <span>Aquecido</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-dot legend-dot-red"></div>
                            <span>Sobreaquecido</span>
                        </div>
                    </div>
                    </div>

                    <!-- Linha 2: DVX + Paridade -->
                    <div class="dvx-card">
                    <div class="card-header-with-help">
                        <div>
                            <h3 class="card-header">Índice de Volatilidade (DVX)</h3>
                            <p class="card-subtitle">Mede a variabilidade dos dígitos</p>
                        </div>
                        <div class="relative group">
                            <i class="far fa-question-circle text-sm text-[#0099FF] cursor-help"></i>
                            <div class="tooltip-content">
                                <div class="tooltip-title">Como interpretar o DVX</div>
                                <div class="tooltip-text">
                                    O DVX mede a dispersão dos dígitos ao longo do tempo.<br><br>
                                    • Verde (0–30): ambiente estável e ideal para operar<br>
                                    • Amarelo (31–60): volatilidade moderada, operar com cautela<br>
                                    • Vermelho (61–100): mercado errático — não operar
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="dvx-gauge-container">
                        <svg width="240" height="120" class="dvx-gauge-svg">
                            <path d="M 30 110 A 90 90 0 0 1 72 35" stroke="#22C55E" stroke-width="16" fill="none" opacity="0.4"></path>
                            <path d="M 72 35 A 90 90 0 0 1 168 35" stroke="#FFD058" stroke-width="16" fill="none" opacity="0.4"></path>
                            <path d="M 168 35 A 90 90 0 0 1 210 110" stroke="#FF4747" stroke-width="16" fill="none" opacity="0.4"></path>
                            <line 
                                x1="120" 
                                y1="110" 
                                :x2="dvxGaugeX2" 
                                :y2="dvxGaugeY2" 
                                stroke="#DFDFDF" 
                                stroke-width="3" 
                                stroke-linecap="round"
                            ></line>
                            <circle cx="120" cy="110" r="6" fill="#DFDFDF"></circle>
                        </svg>
                        <div class="dvx-value-container">
                            <div class="dvx-value">{{ dvxValue }}</div>
                            <div class="dvx-status" :class="dvxStatusClass">{{ dvxStatusText }}</div>
                            <div class="dvx-subtitle">Ambiente {{ dvxEnvironmentText }}</div>
                        </div>
                    </div>
                    <div class="dvx-legend">
                        <div class="dvx-legend-item">
                            <div class="dvx-legend-bar dvx-legend-green"></div>
                            <span>0–30 | Baixa</span>
                        </div>
                        <div class="dvx-legend-item">
                            <div class="dvx-legend-bar dvx-legend-yellow"></div>
                            <span>30–60 | Moderada</span>
                        </div>
                        <div class="dvx-legend-item">
                            <div class="dvx-legend-bar dvx-legend-red"></div>
                            <span>60–100 | Alta</span>
                        </div>
                    </div>
                </div>

                <!-- Medidor de Paridade -->
                <div class="parity-meter-card">
                    <div class="card-header-with-help">
                        <div>
                            <h3 class="card-header">Medidor de Paridade</h3>
                            <p class="card-subtitle">Distribuição Par vs Ímpar (esperado: 50/50)</p>
                        </div>
                        <div class="relative group">
                            <i class="far fa-question-circle text-sm text-[#0099FF] cursor-help"></i>
                            <div class="tooltip-content">
                                <div class="tooltip-title">Estratégia Even/Odd</div>
                                <div class="tooltip-text">
                                    Mostra a distribuição de dígitos pares (0,2,4,6,8) vs ímpares (1,3,5,7,9).<br>
                                    O esperado é 50/50. Se houver desequilíbrio (>55% para um lado),<br>
                                    o próximo tick tende a reverter para o lado oposto.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="parity-meter-content">
                        <div class="parity-meter-item">
                            <div class="parity-meter-header">
                                <span>Par (0,2,4,6,8)</span>
                                <span class="parity-meter-percentage text-blue">{{ digitFrequency.parity.even }}%</span>
                            </div>
                            <div class="parity-meter-bar-container">
                                <div class="parity-meter-bar parity-meter-bar-blue" :style="{ width: digitFrequency.parity.even + '%' }"></div>
                                <div class="parity-meter-value">{{ evenCount }}</div>
                            </div>
                        </div>
                        <div class="parity-meter-item">
                            <div class="parity-meter-header">
                                <span>Ímpar (1,3,5,7,9)</span>
                                <span class="parity-meter-percentage text-orange">{{ digitFrequency.parity.odd }}%</span>
                            </div>
                            <div class="parity-meter-bar-container">
                                <div class="parity-meter-bar parity-meter-bar-orange" :style="{ width: digitFrequency.parity.odd + '%' }"></div>
                                <div class="parity-meter-value">{{ oddCount }}</div>
                            </div>
                        </div>
                        <div class="parity-meter-recommendation">
                            <i class="fas fa-check text-green"></i>
                            <span>{{ parityRecommendationText }}</span>
                        </div>
                    </div>
                </div>

                <!-- Distribuição Alto/Baixo -->
                <div class="high-low-card">
                    <div class="card-header-with-help">
                        <div>
                            <h3 class="card-header">Distribuição Alto/Baixo</h3>
                            <p class="card-subtitle">Baixos (0–4) vs Altos (5–9) — esperado: 50/50</p>
                        </div>
                        <div class="relative group">
                            <i class="far fa-question-circle text-sm text-[#0099FF] cursor-help"></i>
                            <div class="tooltip-content">
                                <div class="tooltip-title">Estratégia Over/Under</div>
                                <div class="tooltip-text">
                                    Divide os dígitos em Baixos (0–4) e Altos (5–9).<br>
                                    O esperado é 50/50. Desequilíbrio indica que o próximo tick<br>
                                    terá maior probabilidade de ser do lado oposto.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="high-low-content">
                        <div class="high-low-item">
                            <div class="high-low-header">
                                <span>Baixos (0–4)</span>
                                <span class="high-low-percentage text-green">{{ lowPercentage }}%</span>
                            </div>
                            <div class="high-low-bar-container">
                                <div class="high-low-bar high-low-bar-green" :style="{ width: lowPercentage + '%' }"></div>
                                <div class="high-low-value">{{ lowCount }}</div>
                            </div>
                        </div>
                        <div class="high-low-item">
                            <div class="high-low-header">
                                <span>Altos (5–9)</span>
                                <span class="high-low-percentage text-purple">{{ highPercentage }}%</span>
                            </div>
                            <div class="high-low-bar-container">
                                <div class="high-low-bar high-low-bar-purple" :style="{ width: highPercentage + '%' }"></div>
                                <div class="high-low-value">{{ highCount }}</div>
                            </div>
                        </div>
                        <div class="high-low-recommendation">
                            <i class="fas fa-arrow-right text-green"></i>
                            <span>{{ highLowRecommendationText }}</span>
                        </div>
                    </div>
                </div>
                </div>
            </div>

            <!-- Resultado da Operação -->
            <div v-if="showResultNotification" class="result-notification-overlay" @click="closeResultNotification">
                <div class="result-notification" :class="resultNotificationClass" @click.stop>
                    <div class="result-header">
                        <h3>{{ resultNotificationTitle }}</h3>
                        <button @click="closeResultNotification" class="close-btn">✕</button>
                    </div>
                    <div class="result-body">
                        <div class="result-icon">{{ resultNotificationIcon }}</div>
                        <div class="result-profit">
                            {{ lastTradeResult.profit >= 0 ? '+' : '' }}{{ displayCurrency }} {{ (lastTradeResult.profit || 0).toFixed(2) }}
                        </div>
                        <div class="result-details">
                            <div class="result-detail-item">
                                <span>Tipo:</span>
                                <span>{{ getDigitTypeLabel(lastTradeResult.direction) }} {{ lastTradeResult.barrier ? `(${lastTradeResult.barrier})` : '' }}</span>
                            </div>
                            <div class="result-detail-item">
                                <span>Investimento:</span>
                                <span>{{ displayCurrency }} {{ (lastTradeResult.buyPrice || 0).toFixed(2) }}</span>
                            </div>
                            <div class="result-detail-item">
                                <span>Retorno:</span>
                                <span>{{ displayCurrency }} {{ (lastTradeResult.sellPrice || 0).toFixed(2) }}</span>
                            </div>
                        </div>
                    </div>
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
            showResultNotification: false,
            lastTradeResult: {
                profit: 0,
                buyPrice: 0,
                sellPrice: 0,
                direction: '',
                barrier: null,
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
        resultNotificationTitle() {
            if (!this.lastTradeResult || this.lastTradeResult.profit === undefined) {
                return 'Resultado da Operação';
            }
            return this.lastTradeResult.profit >= 0 ? '🎉 LUCRO!' : '📉 PERDA';
        },
        resultNotificationIcon() {
            if (!this.lastTradeResult || this.lastTradeResult.profit === undefined) {
                return '📊';
            }
            return this.lastTradeResult.profit >= 0 ? '✅' : '❌';
        },
        resultNotificationClass() {
            if (!this.lastTradeResult || this.lastTradeResult.profit === undefined) {
                return '';
            }
            return this.lastTradeResult.profit >= 0 ? 'result-profit' : 'result-loss';
        },
        // Semáforo
        semaphoreState() {
            if (this.digitFrequency.digits.length < 50) {
                return 'AGUARDAR';
            }
            const dvx = this.dvxValue;
            if (dvx > 60) {
                return 'STOP';
            }
            // Verificar padrões favoráveis
            const frequencies = this.digitFrequenciesWithStats;
            const hasClearPattern = frequencies.some(f => Math.abs(f.zScore) > 1.5);
            if (hasClearPattern && dvx <= 30) {
                return 'GO';
            }
            return 'AGUARDAR';
        },
        semaphoreStateClass() {
            return `semaphore-${this.semaphoreState.toLowerCase()}`;
        },
        semaphoreIcon() {
            const states = {
                'GO': 'fa-check-circle',
                'AGUARDAR': 'fa-clock',
                'STOP': 'fa-exclamation-triangle'
            };
            return states[this.semaphoreState] || 'fa-clock';
        },
        semaphoreTitle() {
            const states = {
                'GO': 'OPERAR',
                'AGUARDAR': 'AGUARDAR',
                'STOP': 'NÃO OPERAR'
            };
            return states[this.semaphoreState] || 'AGUARDAR';
        },
        semaphoreStatus() {
            return this.semaphoreState;
        },
        semaphoreReason() {
            if (this.semaphoreState === 'GO') {
                return 'Condição favorável identificada pelos padrões estatísticos.';
            } else if (this.semaphoreState === 'AGUARDAR') {
                return 'Aguardando mais dados (mínimo 50 ticks).';
            } else {
                return 'Alta volatilidade ou sinais contraditórios detectados.';
            }
        },
        // DVX (Índice de Volatilidade)
        dvxValue() {
            if (this.digitFrequency.digits.length < 20) {
                return 0;
            }
            const frequencies = this.digitFrequencies;
            const expected = 10; // 10% esperado para cada dígito
            let variance = 0;
            frequencies.forEach(f => {
                variance += Math.pow(f.percentage - expected, 2);
            });
            const stdDev = Math.sqrt(variance / 10);
            // Normalizar para 0-100
            return Math.min(100, Math.round((stdDev / 10) * 100));
        },
        dvxStatusClass() {
            if (this.dvxValue <= 30) return 'dvx-status-green';
            if (this.dvxValue <= 60) return 'dvx-status-yellow';
            return 'dvx-status-red';
        },
        dvxStatusText() {
            if (this.dvxValue <= 30) return 'Volatilidade Baixa';
            if (this.dvxValue <= 60) return 'Volatilidade Moderada';
            return 'Volatilidade Alta';
        },
        dvxEnvironmentText() {
            if (this.dvxValue <= 30) return 'estável';
            if (this.dvxValue <= 60) return 'moderado';
            return 'arriscado';
        },
        // Estatísticas de dígitos com Z-score
        digitFrequenciesWithStats() {
            const totalDigits = this.digitFrequency.digits.length;
            if (totalDigits === 0) {
                return Array.from({ length: 10 }, (_, i) => ({
                    digit: i,
                    percentage: 0,
                    zScore: 0,
                    statusClass: 'status-normal',
                    statusText: 'Normal',
                    barHeight: 42,
                    isHighlighted: false
                }));
            }
            
            const expected = totalDigits / 10;
            const frequencies = this.digitFrequencies;
            
            return frequencies.map(item => {
                const count = (item.percentage / 100) * totalDigits;
                const zScore = expected > 0 ? ((count - expected) / Math.sqrt(expected)).toFixed(1) : 0;
                const z = parseFloat(zScore);
                
                let statusClass, statusText, barHeight;
                if (z < -1.5) {
                    statusClass = 'status-underheated';
                    statusText = 'Subaquec.';
                    barHeight = 42;
                } else if (z < -0.5) {
                    statusClass = 'status-normal';
                    statusText = 'Normal';
                    barHeight = 81;
                } else if (z < 1.5) {
                    statusClass = 'status-heated';
                    statusText = z < 0.5 ? 'Lev. aquec.' : 'Aquecido';
                    barHeight = z < 0.5 ? 93 : 106;
                } else {
                    statusClass = 'status-overheated';
                    statusText = 'Sobreaquec.';
                    barHeight = 110;
                }
                
                // Destacar dígito 7 se for subaquecido (exemplo do HTML)
                const isHighlighted = item.digit === 7 && z < -1.5;
                
                return {
                    digit: item.digit,
                    percentage: item.percentage.toFixed(1),
                    zScore: zScore,
                    statusClass,
                    statusText,
                    barHeight,
                    isHighlighted
                };
            });
        },
        // Contadores para paridade
        evenCount() {
            return this.digitFrequency.digits.filter(d => d % 2 === 0).length;
        },
        oddCount() {
            return this.digitFrequency.digits.filter(d => d % 2 === 1).length;
        },
        parityRecommendationText() {
            const diff = Math.abs(this.digitFrequency.parity.even - this.digitFrequency.parity.odd);
            if (diff < 5) {
                return 'Distribuição equilibrada — sem vantagem clara';
            }
            if (this.digitFrequency.parity.even > 55) {
                return 'Próximo tick: maior probabilidade de ÍMPAR (ODD)';
            } else {
                return 'Próximo tick: maior probabilidade de PAR (EVEN)';
            }
        },
        // Contadores para alto/baixo
        lowCount() {
            return this.digitFrequency.digits.filter(d => d >= 0 && d <= 4).length;
        },
        highCount() {
            return this.digitFrequency.digits.filter(d => d >= 5 && d <= 9).length;
        },
        lowPercentage() {
            const total = this.digitFrequency.digits.length;
            return total > 0 ? Math.round((this.lowCount / total) * 100 * 10) / 10 : 0;
        },
        highPercentage() {
            const total = this.digitFrequency.digits.length;
            return total > 0 ? Math.round((this.highCount / total) * 100 * 10) / 10 : 0;
        },
        highLowRecommendationText() {
            const diff = Math.abs(this.lowPercentage - this.highPercentage);
            if (diff < 5) {
                return 'Distribuição equilibrada — sem vantagem clara';
            }
            if (this.lowPercentage > 55) {
                return 'Próximo tick: maior probabilidade de ALTO (OVER 4)';
            } else {
                return 'Próximo tick: maior probabilidade de BAIXO (UNDER 5)';
            }
        },
        // DVX Gauge coordinates
        dvxGaugeX2() {
            const angle = (this.dvxValue / 100) * Math.PI - Math.PI / 2;
            return 120 + 70 * Math.cos(angle);
        },
        dvxGaugeY2() {
            const angle = (this.dvxValue / 100) * Math.PI - Math.PI / 2;
            return 110 + 70 * Math.sin(angle);
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
        closeResultNotification() {
            this.showResultNotification = false;
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
                console.log('[OperationDigits] ⚠ Contrato vazio em proposal_open_contract');
                return;
            }
            
            console.log('[OperationDigits] 📊 Atualização de contrato recebida:', {
                is_sold: contract.is_sold,
                profit: contract.profit,
                status: contract.status
            });
            
            if (msg.subscription?.id) {
                this.contractSubscriptionId = msg.subscription.id;
            }
            
            if (contract.profit !== undefined && contract.profit !== null) {
                this.realTimeProfit = Number(contract.profit);
                console.log('[OperationDigits] P&L atualizado:', this.realTimeProfit);
            }
            
            if (contract.is_sold === 1) {
                console.log('[OperationDigits] ✅ Contrato vendido, finalizando...');
                setTimeout(() => {
                    this.finalizeContract(contract);
                }, 100);
            } else {
                console.log('[OperationDigits] ⏳ Contrato ainda ativo (is_sold =', contract.is_sold, ')');
            }
        },
        finalizeContract(contract) {
            console.log('[OperationDigits] ========== FINALIZANDO CONTRATO ==========');
            console.log('[OperationDigits] Dados do contrato:', contract);
            
            this.unsubscribeFromContract();
            
            let finalProfit = 0;
            if (contract.profit !== undefined && contract.profit !== null) {
                finalProfit = Number(contract.profit);
            } else if (this.realTimeProfit !== null && this.realTimeProfit !== undefined) {
                finalProfit = Number(this.realTimeProfit);
            }
            
            // Armazenar resultado para exibição
            this.lastTradeResult = {
                profit: finalProfit,
                buyPrice: this.activeContract?.buy_price || 0,
                sellPrice: contract.sell_price ? Number(contract.sell_price) : 0,
                direction: this.activeContract?.type || '',
                barrier: this.activeContract?.digitBarrier || null,
            };
            
            console.log('[OperationDigits] Resultado armazenado:', this.lastTradeResult);
            
            // Exibir notificação de resultado
            this.showResultNotification = true;
            
            console.log('[OperationDigits] showResultNotification definido como:', this.showResultNotification);
            
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

/* Notificação de Resultado */
.result-notification-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.3s ease;
}

.result-notification {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    border-radius: 16px;
    padding: 0;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    animation: slideUp 0.4s ease;
    border: 1px solid rgba(148, 163, 184, 0.2);
}

.result-notification.result-profit {
    border-color: rgba(16, 185, 129, 0.5);
}

.result-notification.result-loss {
    border-color: rgba(239, 68, 68, 0.5);
}

.result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}

.result-header h3 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: #f8fafc;
}

.close-btn {
    background: rgba(148, 163, 184, 0.1);
    border: none;
    color: #94a3b8;
    font-size: 1.5rem;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.close-btn:hover {
    background: rgba(148, 163, 184, 0.2);
    color: #f8fafc;
}

.result-body {
    padding: 32px 24px;
    text-align: center;
}

.result-icon {
    font-size: 4rem;
    margin-bottom: 16px;
    animation: bounce 0.6s ease;
}

.result-profit {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 24px;
}

.result-notification.result-profit .result-profit {
    color: #10b981;
    text-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
}

.result-notification.result-loss .result-profit {
    color: #ef4444;
    text-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
}

.result-details {
    background: rgba(15, 23, 42, 0.6);
    border-radius: 12px;
    padding: 16px;
    margin-top: 20px;
}

.result-detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}

.result-detail-item:last-child {
    border-bottom: none;
}

.result-detail-item span:first-child {
    color: #94a3b8;
    font-size: 0.9rem;
}

.result-detail-item span:last-child {
    color: #f8fafc;
    font-weight: 600;
    font-size: 0.95rem;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes slideUp {
    from {
        transform: translateY(30px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
    }
    40% {
        transform: translateY(-20px);
    }
    60% {
        transform: translateY(-10px);
    }
}
</style>
