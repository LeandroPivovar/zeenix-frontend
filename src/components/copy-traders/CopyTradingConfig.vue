<template>
	<div class="copy-trading-config">
		<div class="card card-left">
			<h3 class="card-title">
				Selecionar Trader
				<TooltipsCopyTraders position="right">
					<h4>Trader</h4>
					<p >Mostra o Trader Mestre atualmente selecionado. As operações dele serão replicadas automaticamente após a ativação do Copy.</p>
				</TooltipsCopyTraders>
			</h3>
			
			<div class="search-wrapper">
				<svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path 
						d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" 
						fill="#555"
					/>
				</svg>
				<input 
					type="text" 
					class="search-input" 
					placeholder="Busque por nome ou ID do trader..."
					v-model="searchQuery"
				>
			</div>
			
			<div class="empty-state">
				<div class="empty-icon">
					<img src="../../assets/icons/add-people.svg" alt="" width="50px" height="50px">
				</div>
				<p>Nenhum trader selecionado</p>
				<small>Clique no campo acima para escolher</small>
			</div>
		</div>

		<div class="card card-middle">
			<h3 class="card-title">Configurações do Copy</h3>
			
			<div class="form-group">
				<label class="form-label">
					Tipo de Alocação
					<TooltipsCopyTraders position="center">
						<div class="section-title">Proporção (%)</div>
						<p>Replica a mesma porcentagem de risco usada pelo Trader Mestre em cada operação.</p>
						<p>Se o mestre entrar com 2% do saldo dele, você também entra com 2% do seu saldo.</p>
						<p class="caution">Use valores moderados para evitar risco excessivo.</p>
						<div class="section-title">Valor Fixo ($)</div>
						<p>Replica exatamente o mesmo valor financeiro que o Trader Mestre usa nas operações.</p>
						<p>Se o mestre entrar com $5, sua conta também entra com $5, independentemente do seu saldo total.</p>
					</TooltipsCopyTraders>
				</label>
				<div class="button-group">
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
						<h4>Alavancagem</h4>
						<p>A alavancagem multiplica proporcionalmente o valor das suas operações em relação ao Trader Mestre.</p>
						<p class="example">Exemplo:</p>
						<p class="">Se o trader abre $10 e sua alavancagem é 2x, sua entrada será $20.</p>
						<p class="">Use com cautela — aumenta tanto os ganhos quanto as perdas.</p>
					</TooltipsCopyTraders>
				</label>
				<select v-model="leverage">
					<option>1x</option>
					<option>2x</option>
					<option>5x</option>
					<option>10x</option>
				</select>
			</div>

			<div class="form-group">
				<label class="form-label">
					Stop Loss
					<TooltipsCopyTraders position="center">
						<h4>Stop Loss</h4>
						<p>Limite máximo de perda permitido dentro do Copy.</p>
						<p>Ao atingir esse valor, o Copy pausa automaticamente para proteger o saldo.</p>
						<p class="highlight-green">Recomendado: manter sempre configurado.</p>
					</TooltipsCopyTraders>
				</label>
				<input type="text" v-model="stopLoss">
			</div>

			<div class="form-group">
				<label class="form-label">
					Take Profit
					<TooltipsCopyTraders>
						<h4>Take Profit</h4>
						<p>Meta de lucro para encerrar o Copy automaticamente.</p>
						<p>Quando este valor é alcançado, o sistema pausa as operações para preservar o ganho do dia.</p>
					</TooltipsCopyTraders>
				</label>
				<input type="text" v-model="takeProfit">
			</div>

			<div class="toggle-wrapper">
				<div class="toggle-info">
					<h4>
						Stop Loss Blindado
						<TooltipsCopyTraders position="center">
							<h4>Stop Loss Blindado</h4>
							<p>Proteção avançada contra séries de perdas consecutivas.</p>
							<p>Mesmo que o Trader Mestre continue operando, sua conta é bloqueada ao detectar comportamento arriscado.</p>
							<p class="highlight-green">Ideal para momentos de alta volatilidade.</p>
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
						<h4>Trader</h4>
						<p>Mostra o Trader Mestre atualmente selecionado.</p>
					</TooltipsCopyTraders>
				</span>
				<span class="value">{{ selectedTraderName }}</span>
			</div>

			<div class="summary-item">
				<span class="label">
					Alocação
					<TooltipsCopyTraders position="left">
						<h4>Alocação</h4>
						<p>Indica se você está copiando em Porcentagem (%) ou Valor Fixo ($). Isso afeta diretamente o valor das entradas copiadas na sua conta.</p>
					</TooltipsCopyTraders>
				</span>
				<span class="value">{{ allocationType === 'percentage' ? 'Porcentagem %' : 'Valor Fixo $' }}</span>
			</div>

			<div class="summary-item">
				<span class="label">
					Alavancagem
					<TooltipsCopyTraders position="left">
						<h4>Alavancagem</h4>
						<p>A alavancagem multiplica proporcionalmente o valor das suas operações em relação ao Trader Mestre.</p>
					</TooltipsCopyTraders>
				</span>
				<span class="value">{{ leverage }}</span>
			</div>

			<div class="form-group">
				<div class="summary-item">
					<span class="label">
						Stop Loss
						<TooltipsCopyTraders position="left">
							<h4>Stop Loss</h4>
							<p>Valor máximo de perda permitido antes do Copy encerrar as operações automaticamente.</p>
						</TooltipsCopyTraders>
					</span>
					<span class="value red">{{ stopLoss }}</span>
				</div>
			</div>

			<div class="summary-item">
				<span class="label">
					Take Profit
					<TooltipsCopyTraders position="left">
						<h4>Take Profit</h4>
						<p>Meta diária de lucro. Quando alcançada, o Copy é pausado para garantir o ganho.</p>
					</TooltipsCopyTraders>
				</span>
				<span class="value green">{{ takeProfit }}</span>
			</div>

			<div class="summary-item">
				<span class="label">
					Proteção
					<TooltipsCopyTraders position="left"> 
						<h4>Proteção</h4>
						<p>O Stop Loss Blindado protege contra perdas consecutivas.</p>
					</TooltipsCopyTraders>
				</span>
				<span :class="['value', { green: armoredStopLossActive, red: !armoredStopLossActive }]">
					{{ armoredStopLossActive ? 'Ativa' : 'Inativa' }}
				</span>
			</div>

			<div class="status-badge">
				<span class="status-dot"></span>
				<div class="status-text">
					<strong>Aguardando Ativação</strong>
					<small>O Copy será iniciado após você confirmar</small>
				</div>
			</div>

			<button class="activate-btn" @click="activateCopy">ATIVAR COPY</button>

			<p class="warning-text">
				<span class="highlight">Aviso:</span> O Copy está configurado para operar com 
				<span class="highlight">risco controlado</span>. Verifique as configurações antes de ativar.
			</p>
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
			searchQuery: '',
			selectedTraderName: 'TraderMaster',
			allocationType: 'percentage',
			leverage: '1x',
			stopLoss: '$250',
			takeProfit: '$500',
			armoredStopLossActive: true,
		};
	},
	methods: {
		activateCopy() {
			const config = {
				trader: this.selectedTraderName,
				allocationType: this.allocationType,
				leverage: this.leverage,
				stopLoss: this.stopLoss,
				takeProfit: this.takeProfit,
				armoredStopLoss: this.armoredStopLossActive,
			};
			
			console.log('Ativando Copy Trading com configurações:', config);
			alert(`Copy Trading Ativado!\n\nTrader: ${config.trader}\nAlocação: ${config.allocationType === 'percentage' ? 'Porcentagem' : 'Valor Fixo'}\nAlavancagem: ${config.leverage}`);
		},
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
	background: #111;
	border: 1px solid #222;
	border-radius: 8px;
	padding: 24px;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	position: relative; 
	/* Z-index base simplificado para 1 para todos */
	z-index: 0; 
}

/* .card-middle { z-index: 2; } */


.summary-item[data-v-fdae4e08]:last-of-type{
	border-bottom: 1px solid #222;
}
.card-title {
	font-size: 16px;
	font-weight: 600;
	margin-bottom: 20px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
	text-transform: capitalize;
}

/* --- Form Elements --- */

/* Novo wrapper para posicionamento do ícone */
.search-wrapper {
	position: relative;
	margin-bottom: 20px;
}

/* Estilo do ícone SVG */
.search-icon {
	position: absolute;
	top: 50%;
	left: 16px; 
	transform: translateY(-50%);
	color: #555; 
}

/* CORREÇÃO: Aumenta a especificidade para garantir o padding esquerdo */
.search-wrapper .search-input {
	width: 100%;
	background: #0a0a0a;
	border: 1px solid #222;
	border-radius: 6px;
	/* Padding esquerdo de 48px para liberar espaço para o ícone */
	padding: 12px 16px 12px 48px;
	color: #fff;
	font-size: 14px;
	margin-bottom: 0; 
}

/* Estilos gerais para inputs (exceto o de busca, que é mais específico) e selects */
select, input[type="text"] {
	width: 100%;
	background: #0a0a0a;
	border: 1px solid #222;
	border-radius: 6px;
	/* Padding padrão para os outros campos */
	padding: 12px;
	color: #fff;
	font-size: 14px;
}

.search-input::placeholder {
	color: #555;
}

select:focus, input[type="text"]:focus {
	outline: none;
	border-color: #4ade80;
}


.form-label {
	display: flex;
	align-items: center;
	gap: 6px;
	font-size: 14px;
	color: #aaa;
	margin-bottom: 8px;
}

.button-group {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 0;
	border-radius: 6px;
	overflow: hidden;
}

.button-group button {
	background: #1a1a1a;
	border: 1px solid #222;
	color: #888;
	padding: 12px;
	cursor: pointer;
	font-size: 14px;
	transition: all 0.3s;
}

.button-group button.active {
	background: #16a34a;
	color: #fff;
	border-color: #16a34a;
}

.button-group button:hover:not(.active) {
	background: #252525;
}


.form-group input{
	margin: 0;
}
/* --- Empty State --- */
.empty-state {
	background: #0a0a0a;
	border: 1px dashed #333;
	border-radius: 8px;
	padding: 0px 20px;
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
	font-size: 14px;
	font-weight: 500;
	margin-bottom: 4px;
	display: flex;
	align-items: center;
	gap: 6px;
}

.toggle-info p {
	font-size: 12px;
	color: #666;
	width: 100%;
	max-width: 200px;
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

input:checked + .slider {
	background-color: #16a34a; 
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

/* Força a borda no último item de resumo ANTES do badge de status */
.card-right .summary-item:nth-last-child(2) {
	border-bottom: 1px solid #222;
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
	color: #fbbf24;
	font-size: 14px;
	margin-bottom: 4px;
}

.status-text small {
	color: #666;
	font-size: 12px;
}

.activate-btn {
	width: 100%;
	background: #16a34a;
	border: none;
	color: #fff;
	padding: 16px;
	border-radius: 6px;
	font-size: 15px;
	font-weight: 600;
	cursor: pointer;
	margin-bottom: 16px;
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
</style>