<template>
	<div id="copy-trading-monitor">

		<div v-if="tabAtiva === 'monitor'" class="grid">

			<div class="card div1">
				<div class="card-header">
					<span class="card-title">Resumo do Dia</span>
					<TooltipsCopyTraders position="right">
						<p>Consolidação das operações do dia.</p>
					</TooltipsCopyTraders>
				</div>
				<div class="profit-box">
					<div class="profit-label">Lucro Hoje</div>
					<span class="profit-value">{{ resumo.lucroHoje }}</span>
					<span class="profit-percent">{{ resumo.percentualHoje }}</span>
				</div>
				<div class="stats-row">
					<div class="stat-item">
						<span class="label">Wins</span>
						<span class="value green">{{ resumo.wins }}</span>
					</div>
					<div class="stat-item">
						<span class="label">Losses</span>
						<span class="value red">{{ resumo.losses }}</span>
					</div>
				</div>
				<div class="weekly">
					<span>Últimos 7 dias</span><br>
					<span class="weekly-value">{{ resumo.lucroSemana }} ({{ resumo.percentualSemana }})</span>
				</div>
			</div>

			<div class="card status-card div2">
				<div class="card-header">
					<span class="card-title">Status Atual do Copy</span>
					<TooltipsCopyTraders position="right">
						<p>Indica o estado atual do Copy. Atualiza em tempo real conforme o trader mestre opera.</p>
					</TooltipsCopyTraders>
				</div>
				<div class="status-header">
					<div class="status-row">
						<div class="status-icon">
							<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
						</div>
						<div class="status-info">
							<div class="label">Status</div>
							<div class="value">{{ statusCopy.status }}</div>
						</div>
					</div>
					<button class="pause-btn">PAUSAR COPY</button>
				</div>
				<div class="trader-row">
					<div class="trader-info">
						<div class="trader-avatar">
							<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
						</div>
						<div class="trader-details">
							<div class="label">Trader Seguido</div>
							<div class="name">{{ statusCopy.trader }}</div>
						</div>
					</div>
					<div class="ops-today">
						<div class="label">Operações Hoje</div>
						<div class="value">{{ statusCopy.operacoesHoje }}</div>
					</div>
				</div>
				<div class="sync-row">
					<div class="sync-info">
						<div class="label">Última Sincronização</div>
						<div class="value">{{ statusCopy.ultimaSincronizacao }}</div>
						</div>
					<div class="sync-tags">
						<span class="sync-tag">SL: {{ statusCopy.slValor }}</span>
						<span class="sync-tag">TP: {{ statusCopy.tpValor }}</span>
						<span class="sl-badge">
							<i><img src="../../assets/icons/security.svg" alt="" width="10px" height="10px"></i>
							SL Blindado</span>
					</div>
				</div>
			</div>

			<div class="card div4">
				<div class="card-header">
					<span class="card-title">Operações Replicadas</span>
					<TooltipsCopyTraders position="right">
						<p>Todas as operações replicadas automaticamente.</p>
					</TooltipsCopyTraders>
				</div>
				<div class="operations-list">
					<div v-for="op in operacoes" :key="op.time" class="op-item">
						<div class="op-left-wrapper">
							<span :class="['op-check', op.result.startsWith('+') ? 'win' : 'loss']">
								{{ op.result.startsWith('+') ? '✓' : '✗' }}
							</span>
							<span class="op-time">{{ op.time }}</span>
							<span :class="['op-type', op.type.toLowerCase()]">{{ op.type }}</span>
							<span class="op-vol">Vol {{ op.volume }}</span>
						</div>
						<span :class="['op-result', op.result.startsWith('+') ? 'green' : 'red']">{{ op.result }}</span>
					</div>
				</div>
				<button class="view-btn">Ver tudo</button>
			</div>

			<div class="card div3">
				<div class="card-header">
					<span class="card-title">Exposição &amp; Risco</span>
					<TooltipsCopyTraders position="right">
						<p class="tooltip-box bottom-right">Seu nível de risco no Copy Trading.</p>
					</TooltipsCopyTraders>
				</div>
				<div class="risk-row">
					<span class="risk-label">Exposição Atual</span>
					<span class="risk-value yellow">{{ risco.exposicaoAtual }}</span>
				</div>
				<div class="risk-row">
					<span class="risk-label">SL Diário</span>
					<span :class="['risk-value', risco.slDiario.startsWith('$') ? 'red' : 'green']">{{ risco.slDiario }}</span>
				</div>
				<div class="risk-row">
					<span class="risk-label">TP Diário</span>
					<span class="risk-value green">{{ risco.tpDiario }}</span>
				</div>
				<div class="risk-row">
					<span class="risk-label">SL Blindado</span>
					<span class="risk-value green">{{ risco.slBlindado }}</span>
				</div>
				<div class="risk-badge">
					<div class="risk-badge-left">
						<span class="risk-dot"></span>
						<span class="risk-text">Risco Baixo</span>
					</div>
					<div class="risk-icon">
            <img src="../../assets/icons/security.svg" alt="" width="13px" height="13px">
          </div>
				</div>
			</div>

			<div class="card full-width performance-card">
				<div class="chart-header">
					<div class="card-header" style="margin-bottom:0">
						<span class="card-title">Evolução da Performance</span>
						<TooltipsCopyTraders position="left">
							<p class="tooltip-box bottom-left">Evolução da sua performance com base nas operações replicadas.</p>
						</TooltipsCopyTraders>
					</div>
					<div class="period-btns">
						<button v-for="periodo in periodos" :key="periodo.label" :class="['period-btn', { active: periodoAtivo === periodo.label }]" @click="setPeriodo(periodo.label)">
							<span v-if="periodo.label !== 'Personalizado'">{{ periodo.label }}</span>
							<span v-else>📅 {{ periodo.label }}</span>
						</button>
					</div>
				</div>
				<div class="chart-content">
					<div class="chart-y">
						<span v-for="y in chart.yLabels" :key="y">{{ y }}</span>
					</div>
					<div class="chart-area-wrapper">
							<div class="chart-area">
								<svg viewBox="0 0 600 180" preserveAspectRatio="none">
									<defs>
										<linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
											<stop offset="0%" stop-color="#22c55e" stop-opacity="0.3"/>
											<stop offset="100%" stop-color="#22c55e" stop-opacity="0"/>
										</linearGradient>
									</defs>
									<line x1="0" y1="30" x2="600" y2="30" stroke="#222" stroke-dasharray="4"/>
									<line x1="0" y1="90" x2="600" y2="90" stroke="#222" stroke-dasharray="4"/>
									<line x1="0" y1="150" x2="600" y2="150" stroke="#222" stroke-dasharray="4"/>
									<line x1="100" y1="0" x2="100" y2="180" stroke="#1a1a1a"/>
									<line x1="200" y1="0" x2="200" y2="180" stroke="#1a1a1a"/>
									<line x1="300" y1="0" x2="300" y2="180" stroke="#1a1a1a"/>
									<line x1="400" y1="0" x2="400" y2="180" stroke="#1a1a1a"/>
									<line x1="500" y1="0" x2="500" y2="180" stroke="#1a1a1a"/>

									<polygon :points="chart.polygonPoints" fill="url(#grad)"/>
									<polyline :points="chart.linePoints" fill="none" stroke="#22c55e" stroke-width="2"/>
									<circle v-for="(point, index) in chart.points" :key="index" :cx="point.cx" :cy="point.cy" r="3" :fill="point.result === 'loss' ? '#ef4444' : '#22c55e'" stroke="none"/>
								</svg>
							</div>
					</div>
				</div>
				
				<div class="chart-x-wrapper">
					<div class="chart-x">
						<span v-for="x in chart.xLabels" :key="x">{{ x }}</span>
					</div>
				</div>
				
				<div class="performance-footer">
					<div class="footer-item">
						<div class="label">ROI Total</div>
						<div class="value green">{{ performance.roiTotal }}</div>
					</div>
					<div class="footer-item">
						<div class="label">Média Diária</div>
						<div class="value">{{ performance.mediaDiaria }}</div>
					</div>
					<div class="footer-item">
						<div class="label">Maior Ganho</div>
						<div class="value green">{{ performance.maiorGanho }}</div>
					</div>
					<div class="footer-item">
						<div class="label">Maior Perda</div>
						<div class="value red">{{ performance.maiorPerda }}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import TooltipsCopyTraders from '../TooltipsCopyTraders.vue'; // Assumindo que o componente está em um arquivo separado ou localmente definido

export default {
	name: 'CopyTradingMonitor',
	components: {
		TooltipsCopyTraders,
	},
	data() {
		// Dados do gráfico simulados para refletir a imagem
		const chartData = [
			{ date: '01/11', value: 100, result: 'win' },
			{ date: '02/11', value: 110, result: 'win' },
			{ date: '03/11', value: 105, result: 'loss' },
			{ date: '04/11', value: 125, result: 'win' },
			{ date: '05/11', value: 120, result: 'loss' },
			{ date: '06/11', value: 140, result: 'win' },
			{ date: '07/11', value: 145, result: 'win' }
		];
		
		// Mapeamento de valor para coordenada Y (de 0 a 180)
		const maxChartValue = 150; 
		const chartHeight = 180;
		const chartWidth = 600;
		const stepX = chartWidth / (chartData.length - 1);

		const mapValueToY = (value) => {
			const normalized = value / maxChartValue;
			return chartHeight - (normalized * chartHeight);
		};

		const linePoints = chartData.map((d, i) => `${i * stepX},${mapValueToY(d.value)}`).join(' ');
		const polygonPoints = `${linePoints} ${chartWidth},${chartHeight} 0,${chartHeight}`;

		const chartPoints = chartData.map((d, i) => ({
			cx: i * stepX,
			cy: mapValueToY(d.value),
			result: d.result
		}));

		return {
			tabAtiva: 'monitor', 
			periodoAtivo: '7 dias', 

			resumo: {
				lucroHoje: '+$89.50',
				percentualHoje: '+1.7%',
				wins: 8,
				losses: 2,
				lucroSemana: '+$142.00',
				percentualSemana: '+2.3%',
			},
			statusCopy: {
				status: 'COPIANDO',
				trader: '@TraderMaster',
				operacoesHoje: 3,
				ultimaSincronizacao: 'há 2 minutos',
				slValor: '$250',
				tpValor: '$500',
			},
			operacoes: [
				{ time: '15:05', type: 'CALL', volume: 75, result: '+$17.60' },
				{ time: '14:20', type: 'PUT', volume: 100, result: '+$19.40' },
				{ time: '13:42', type: 'MATCHES', volume: 75, result: '+$15.80' },
				{ time: '12:08', type: 'CALL', volume: 100, result: '-$4.20' },
			],
			risco: {
				exposicaoAtual: '2.3%',
				slDiario: '$250',
				tpDiario: '$500',
				slBlindado: 'Ativo',
				riscoNivel: 'Baixo',
			},
			performance: {
				roiTotal: '+42.0%',
				mediaDiaria: '+$20.43',
				maiorGanho: '+$17.00',
				maiorPerda: '-$7.00',
			},
			periodos: [
				{ label: 'Hoje' },
				{ label: '7 dias' },
				{ label: '30 dias' },
				{ label: 'Personalizado' }
			],
			chart: {
				yLabels: ['$150', '$100', '$50', '$0'], 
				xLabels: chartData.map(d => d.date),
				linePoints,
				polygonPoints,
				points: chartPoints,
			}
		};
	},
	methods: {
		setTab(tab) {
			this.tabAtiva = tab;
		},
		setPeriodo(periodo) {
			this.periodoAtivo = periodo;
			// Lógica para carregar dados do gráfico aqui
		}
	}
};
</script>

<style scoped>
/* Estilos copiado do HTML original */
* { margin: 0; padding: 0; box-sizing: border-box; }
#copy-trading-monitor {
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	background: #0a0b0a; color: #fff; padding: 20px; min-height: 100vh;
}
.tabs { display: flex; gap: 24px; border-bottom: 1px solid #222; padding-bottom: 12px; margin-bottom: 20px; }
.tab { background: none; border: none; color: #666; font-size: 14px; cursor: pointer; padding-bottom: 12px; }
.tab.active { color: #fff; border-bottom: 2px solid #22c55e; margin-bottom: -13px; }

.grid {
	display: grid;
	grid-template-columns: repeat(6, 1fr);
	gap: 16px;
}

.div1 { grid-area: 1 / 1 / 3 / 3; }
.div2 { grid-area: 1 / 3 / 3 / 7; }
.div3 { grid-area: 3 / 4 / 6 / 7; } 
.div4 { grid-area: 3 / 1 / 6 / 4; } 
.performance-card { grid-area: 6 / 1 / 7 / 7; } 


.card { background: #0e0f0f; border: 1px solid #1a1a1a; border-radius: 12px; padding: 20px; }
.card-header { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
.card-title { font-size: 19px; color: #ececec; font-weight: 500; text-transform: capitalize;}


.profit-box { background: #102117; border: 1px solid #2f6646; border-radius: 8px; padding: 16px; margin-bottom: 16px; text-align: left; display: flex; flex-direction: column; justify-content: space-between; }
.profit-label { font-size: 12px; color: #9e9e9e; margin-bottom: 4px; }
.profit-value { font-size: 25px; font-weight: 700; color: #22c55e; }
.profit-percent { font-size: 12px; color: #22c55e; margin-left: 8px; }
.stats-row { display: flex; gap: 24px; margin-bottom: 16px; width: 100%; }
.stat-item{
	display: flex;
	flex-direction: column;
	text-align: left;
	justify-content: space-between;
	width: 100%;
	background: #0a0b0a;
	padding: 15px;
	border-radius: 12px;
}

.stat-item .label { font-size: 14px; color: #9b9696 ; display: block; }
.stat-item .value { font-size: 20px; font-weight: 600; }
.stat-item .value.green { color: #22c55e; }
.stat-item .value.red { color: #ef4444; }

.weekly { font-size: 14px; color: #9b9696; text-align: left;}
.weekly-value { font-size: 14px; color: #22c55e; font-weight: 500; }
.status-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
.status-row { display: flex; align-items: center; gap: 12px; }
.status-row .value{
	background: #102117;
	padding: 3px 15px;
	border-radius: 8px;
}
.status-icon { width: 50px; height: 50px; background: rgba(34,197,94,0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.status-icon svg { width: 18px; height: 18px; color: #22c55e; }
.status-info .label { font-size: 12px; color: #838282; }
.status-info .value { font-size: 13px; color: #22c55e; font-weight: 600; }
.pause-btn { background:#ef44441e; border: 1px solid ; color: #ef4444; padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.pause-btn:hover { background: rgba(239,68,68,0.1); }
.trader-row { display: flex; align-items: center; margin-bottom: 16px; }
.trader-info { display: flex; align-items: center; gap: 12px; background: #0a0b0a; padding: 15px 20px; border-radius: 8px; text-align: left; width: 100%; 
	border: 1px solid #1a1a1a;}
.trader-avatar { width: 40px; height: 40px; background: #222; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.trader-avatar svg { width: 20px; height: 20px; color: #666; }
.trader-details .label { font-size: 11px; color: #666; }
.trader-details .name { font-size: 13px; font-weight: 500; }
.ops-today{
	display: flex;
	flex-direction: column;
	width: 100%;
	background: #0a0b0a;
	height: 70px;
	padding: 15px 20px;
	justify-content: center;
	text-align: left;
	border-radius: 8px;
	border: 1px solid #1a1a1a;
}
.ops-today .label { font-size: 11px; color: #666; }
.ops-today .value { font-size: 20px; font-weight: 600; color: #22c55e; }
.sync-row { display: flex; align-items: center; justify-content: flex-start; gap: 12px; width: 100%; text-align: left;}
.sync-info {
	border-right: 1px solid #1d1c1c;
	padding-right: 20px;
}
.sync-info .label { font-size: 12px; color: #929292; }
.sync-info .value { font-size: 13px; color: #ccc; }
.sync-tags { display: flex; align-items: center; gap: 12px; }
.sync-tag { font-size: 12px; color: #d4d3d3; background: #0a0b0a; padding: 6px 12px; border-radius: 8px; border: 1px solid #1d1c1c;}
.sl-badge { background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.3); color: #22c55e; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 500; display: flex; align-items: center; gap: 8px; }

/* * ESTILOS CORRIGIDOS PARA O CARD "OPERAÇÕES REPLICADAS" (div4) 
*/
.operations-list { 
	margin-bottom: 12px; 
	padding-top: 10px;
	padding-bottom: 10px;
}
.op-item { 
	display: flex; 
	justify-content: space-between; 
	align-items: center; 
	padding: 14px 0; /* Aumentado o padding para mais espaço vertical (como na imagem) */
	border: 1px solid #1a1a1a; /* Linha divisória mais escura/sólida */
  background: #0a0b0a;
  margin-bottom: 10px;
  border-radius: 12px;
}
.op-item:last-child { border-bottom: none; }

/* Novo wrapper para agrupar elementos da esquerda (check, time, type, vol) */
.op-left-wrapper { 
	display: flex; 
	align-items: center; 
}

/* Tamanhos e cores dos ícones (para corresponder à imagem) */
.op-check { 
	font-size: 18px; /* Aumenta o ícone de check */
	font-weight: 700; 

}
.op-check.win { color: #22c55e; max-width: 35px;}
.op-check.loss { color: #ef4444; }

.op-time { 
	font-size: 14px; 
	color: #ccc; /* Mais visível */
	margin-right: 15px; /* Espaço após a hora */
  max-width: 60px;
}
.op-type { 
	font-size: 14px; 
	font-weight: 400; 
	padding: 4px 10px; /* Aumenta o tamanho do badge */
	border-radius: 6px; 
	text-transform: uppercase;
  width: 100%;
	text-align: center;
	margin-right: 15px; /* Espaço após o tipo (badge) */
}

.op-item span:nth-child(3){
  width: 100%;
  max-width: 100px;
  min-width: 90px;
  text-align: left;
}
.op-vol { 
	font-size: 14px; 
	color: #ccc; 
  text-align: left;
}

.op-item span:nth-child(4){
  text-align: left;
}

/* Estilo do resultado na direita (separado do op-left-wrapper pelo space-between) */
.op-result { 
	font-size: 15px; /* Maior e mais destacado */
	font-weight: 600; 
}
.op-result.green { color: #22c55e; }
.op-result.red { color: #ef4444; }

/* Botão "Ver tudo" */
.view-btn { 
	width: 100%; 
	border: 1px solid #22c55e; 
	color: #22c55e; 
	padding: 12px; 
	border-radius: 8px; 
	font-size: 14px; 
	font-weight: 600;
	margin-top: 10px; 
	cursor: pointer;
}
.view-btn:hover { background: #22c55e17; }
/* * FIM DOS ESTILOS CORRIGIDOS 
*/

.risk-row { display: flex; justify-content: space-between; align-items: center; padding: 15px 10px; border: 1px solid #151515; background: #0a0b0a; border-radius: 12px;}
.risk-row:last-child { border-bottom: none; }
.risk-label { font-size: 14px; color: #888; }
.risk-value { font-size: 16px; font-weight: 600; }
.risk-value.green { color: #22c55e; }
.risk-value.red { color: #ef4444; }
.risk-value.yellow { color: #f5a623; }
.risk-badge { background: rgba(34,197,94,0.15);     border: 1px solid #22c55e;; border-radius: 8px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; margin-top: 12px; }
.risk-badge-left { display: flex; align-items: center; gap: 8px; }
.risk-dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; }
.risk-text { font-size: 15px; font-weight: 500; }
.risk-icon { width: 24px; height: 24px; background: rgba(50, 54, 52, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.risk-icon svg { width: 14px; height: 14px; color: #22c55e; }
.full-width { grid-column: 1 / -1; } 
.chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.period-btns { display: flex; gap: 8px; }
.period-btn { background: #1a1a1a; border: none; color: #929292; padding: 6px 14px; border-radius: 6px; font-size: 12px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 4px; font-weight: 600;}
.period-btn.active { background: #22c55e21; color: #0fc552; border:  1px solid #22c55e; border-radius: 6px;}
.period-btn:hover:not(.active) { color: #fff; }

.chart-content { 
	display: flex; 
	height: 200px; 
}
.chart-y { 
	width: 40px;
	display: flex; 
	flex-direction: column; 
	justify-content: space-between; 
	font-size: 11px; 
	color: #666; 
	padding-top: 10px;
	padding-bottom: 10px;
}
.chart-area-wrapper {
	flex-grow: 1;
	position: relative;
}
.chart-area { 
	height: 100%; 
	position: relative; 
	width: 100%;
}
.chart-area svg { 
	width: 100%; 
	height: 100%; 
	position: absolute;
	top: 0;
	left: 0;
}

.chart-x-wrapper {
	margin-left: 40px; 
	overflow: hidden;
}
.chart-x { 
	display: flex; 
	justify-content: space-between; 
	margin-top: 8px; 
	font-size: 11px; 
	color: #666; 
}

.performance-footer {
	display: flex;
	justify-content: space-between;
	gap: 20px;
	margin-top: 30px;
	padding-top: 20px;
	border-top: 1px solid #1a1a1a;
}

.footer-item {
	text-align: center;
	flex-grow: 1;
}
.footer-item .label {
	font-size: 12px;
	color: #9e9a9a;
	margin-bottom: 4px;
}
.footer-item .value {
	font-size: 18px;
	font-weight: 600;
}
.footer-item .value.green { color: #22c55e; }
.footer-item .value.red { color: #ef4444; }


.status-card .trader-row {
	display: flex;
	align-items: center;
	margin-bottom: 16px;
	padding: 10px 0;
	gap: 12px;
}

.status-card .sync-row {
	flex-direction: row; 
	justify-content: flex-start;
	align-items: center;
	gap: 24px;
	padding-top: 10px;
	border-top: 1px solid #151515;
}

@media (max-width: 1200px) {
	.grid { grid-template-columns: repeat(4, 1fr); }
	.div1 { grid-area: 1 / 1 / 2 / 3; }
	.div2 { grid-area: 1 / 3 / 3 / 5; }
	.div3 { grid-area: 3 / 3 / 5 / 5; }
	.div4 { grid-area: 2 / 1 / 5 / 3; }
	.performance-card { grid-area: 5 / 1 / 6 / 5; }
}

@media (max-width: 768px) {
	.grid { grid-template-columns: 1fr; }
	.div1, .div2, .div3, .div4, .performance-card { grid-area: initial; }
	.sync-row { flex-direction: column; align-items: flex-start; }
	.performance-footer { flex-wrap: wrap; }
	.footer-item { min-width: 45%; flex-grow: 0; }
}
</style>