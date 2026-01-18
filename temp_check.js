
	import { createChart, ColorType } from 'lightweight-charts';

	export default {
		name: 'AgenteAutonomoPanel',
		components: {},
		props: {
			agenteData: {
				type: Object,
				default: () => ({
					estrategia: 'IA SENTINEL',
					mercado: 'Volatility 100 Index', // âœ… Todos os agentes autÃ´nomos usam R_100
					risco: 'Conservador-Adaptativo',
					goalValue: 50.0,
					stopValue: 25.0,
					dailyProfit: 0.0,
					dailyChange: 0.0,
					accumulatedLoss: 0.0,
					accumulatedChange: 0.0,
					lastExecutionTime: '00:00:00',
					tempoAtivo: '0h 0m 0s',
					operacoesHoje: 0,
					realTimeOperations: [],
					operationHistory: [],
					agentActions: [],
					agentStatus: 'PAUSADO',
					accountBalance: 0, // Mudar de null para 0 para evitar problemas de reatividade
				})
			},
			tempoAtivo: {
				type: String,
				default: '0h 0m 0s'
			},
			sessionStats: {
				type: Object,
				default: () => ({
					totalTrades: 0,
					wins: 0,
					losses: 0,
					winRate: 0,
					totalProfit: 0,
					totalLoss: 0,
					netProfit: 0,
					totalCapital: 0,
					operationsToday: 0,
				})
			},
			tradeHistory: {
				type: Array,
				default: () => []
			},
			shouldTeleport: {
				type: Boolean,
				default: false
			}
		},
		emits: ['pausarAgente'],
		data() {
			return {
				abaAtiva: 'grafico',
				ultimaAtualizacao: new Date().toLocaleTimeString('pt-BR'),
				filtroDataSelecionado: 'hoje',
				dataInicio: new Date().toISOString().split('T')[0],
				dataFim: new Date().toISOString().split('T')[0],
				periodoMobile: 'hoje',
				maiorGanho: 0,
				maiorPerda: 0,
				progressoMeta: {
					atual: 0,
					meta: 50,
					stop: 25,
				},
				// Dados para grÃ¡ficos
				indexChartData: [],
				priceHistoryInterval: null,
				pricePollingInterval: null, // âœ… Novo: Intervalo para polling de preÃ§os (como na IA)
				timeUpdateInterval: null, // âœ… Novo: Intervalo para atualizar tempo
				chartUpdateThrottle: null, // âœ… Novo: Throttle para atualizaÃ§Ãµes do grÃ¡fico
				priceTicks: [],
				indexChart: null,
				indexChartSeries: null,
				indexChartInitialized: false,
				localTradeHistory: [], // HistÃ³rico de trades buscado localmente
				realtimeLogs: [], // Logs em tempo real (igual Ã  IA)
				lastLogTimestamp: null, // Timestamp do Ãºltimo log para polling
				logsPollingInterval: null, // Intervalo para polling de logs
				unidadeTimeframeSelecionada: 'minutos',
				valorTimeframeSelecionado: 1,
				tipoGráfico de Linhas',
				// âœ… REMOVIDO: WebSocket nÃ£o Ã© mais usado no frontend (backend gerencia)
				symbol: 'R_75', // Ãndice do agente autÃ´nomo (serÃ¡ atualizado do backend)
				timeframeOptions: {
					minutos: [1, 2, 3, 5, 10, 15, 30],
					horas: [1, 2, 4, 8],
					Dias: [1, 2, 3, 4, 5, 6, 7],
				},
				tiposGrafico: ['Linha', 'Velas'],
				acoesAgente: [
					{ hora: '14:32:15', classe: 'success', titulo: 'OperaÃ§Ã£o finalizada com sucesso', descricao: '14:32:15 - Lucro de $8.50' },
					{ hora: '14:32:00', classe: 'success', titulo: 'Entrada executada', descricao: '14:32:00 - CALL em Volatility 75' },
					{ hora: '14:31:45', classe: 'warning', titulo: 'Volume detectado', descricao: '14:31:45 - ConfirmaÃ§Ã£o de padrÃ£o' },
					{ hora: '14:30:00', classe: 'info', titulo: 'Aguardando padrÃ£o da estratÃ©gia', descricao: '14:30:00 - AnÃ¡lise em andamento' },
				],
				showStopLossModal: false,
				// Novas propriedades para o layout redesenhado
				selectedPeriod: '30d',
				weeklyData: [
					{ period: '15/12 - 21/12', profit: 82385.05, finalCapital: 112049.48, percent: 3.32, ops: 64, winRate: 76.0 },
					{ period: '22/12 - 28/12', profit: -8843.49, finalCapital: 112049.65, percent: -6.30, ops: 271, winRate: 72.3 },
					{ period: '29/12 - 04/01', profit: 8844.37, finalCapital: 118734.32, percent: 5.95, ops: 268, winRate: 72.8 },
					{ period: '05/01 - 11/01', profit: 8434.36, finalCapital: 125159.68, percent: 5.41, ops: 262, winRate: 73.4 },
					{ period: '12/01 - 18/01', profit: 5789.39, finalCapital: 130928.07, percent: 4.61, ops: 249, winRate: 73.9 },
				],
				dailyData: [
					{ date: '19/12', badge: 'HOJE', profit: 42857.82, capital: 104701.23, ops: 43, winRate: 74.4, avgTime: '24min' },
					{ date: '20/12', badge: '', profit: 2006.41, capital: 106697.83, ops: 20, winRate: 70.0, avgTime: '27min' },
					{ date: '21/12', badge: '', profit: -3298.18, capital: 105426.46, ops: 21, winRate: 76.2, avgTime: '27min' },
					{ date: '22/12', badge: '', profit: 61734.67, capital: 107363.03, ops: 54, winRate: 70.4, avgTime: '22min' },
					{ date: '23/12', badge: '', profit: 41950.53, capital: 108113.65, ops: 41, winRate: 75.6, avgTime: '24min' },
					{ date: '24/12', badge: '', profit: 41421.06, capital: 110534.61, ops: 56, winRate: 69.6, avgTime: '22min' },
					{ date: '25/12', badge: '', profit: 41169.77, capital: 111704.38, ops: 38, winRate: 71.0, avgTime: '24min' },
					{ date: '26/12', badge: '', profit: -511.89, capital: 111192.49, ops: 40, winRate: 75.0, avgTime: '24min' },
					{ date: '27/12', badge: '', profit: 9387.73, capital: 111580.23, ops: 22, winRate: 72.7, avgTime: '27min' },
				],
			};
		},
		computed: {
			statsHoje() {
				// Considerando 'hoje' como 2025-11-25 (ou data atual da simulaÃ§Ã£o) ou baseado nas ops
				// Aqui vou pegar do historicoOperacoes para ser consistente
				const ops = this.historicoOperacoes || [];
				// Usando data simples mockada se necessÃ¡rio ou a atual
				const hoje = new Date().toISOString().split('T')[0];
				
				// Filtro simplificado, considerando que historicoOperacoes jÃ¡ pode estar filtrado ou nÃ£o.
				// Se a aplicaÃ§Ã£o usa dados de "hoje" como padrÃ£o, isso basta.
				const opsHoje = ops.filter(op => op.data === hoje || op.data === '2025-11-25'); 
				
				const wins = opsHoje.filter(op => op.resultado.includes('+')).length;
				const losses = opsHoje.filter(op => op.resultado.includes('-')).length;
				return { wins, losses };
			},
			historicoOperacoes() {
				// âœ… Usar localTradeHistory primeiro (dados buscados localmente), depois tradeHistory (prop), depois operationHistory
				const historyToUse = (this.localTradeHistory && this.localTradeHistory.length > 0) 
					? this.localTradeHistory 
					: (this.tradeHistory && Array.isArray(this.tradeHistory) && this.tradeHistory.length > 0)
						? this.tradeHistory
						: null;
				
				if (historyToUse && historyToUse.length > 0) {
					console.log('[AgenteAutonomoActive] ðŸ“Š Convertendo tradeHistory:', historyToUse.length, 'trades');
					return historyToUse.map(trade => {
						const date = new Date(trade.createdAt || trade.created_at || Date.now());
						const dataStr = date.toISOString().split('T')[0];
						const horaStr = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
						const profitLoss = parseFloat(trade.profitLoss || trade.profit_loss || 0);
						const resultadoStr = profitLoss >= 0 ? `+$${profitLoss.toFixed(2)}` : `-$${Math.abs(profitLoss).toFixed(2)}`;
						
						return {
							data: dataStr,
							hora: horaStr,
							ativo: trade.symbol || 'R_75',
							tipo: (trade.signalDirection || trade.contractType) === 'RISE' || (trade.signalDirection || trade.contractType) === 'HIGHER' ? 'Call' : 'Put',
							entrada: parseFloat(trade.entryPrice || trade.entry_price || 0).toFixed(2),
							saida: (trade.exitPrice || trade.exit_price) ? parseFloat(trade.exitPrice || trade.exit_price).toFixed(2) : '0.00',
							resultado: resultadoStr,
							volume: parseFloat(trade.stakeAmount || trade.stake_amount || 0).toFixed(2),
						};
					});
				}
				// Se nÃ£o houver tradeHistory, usar operationHistory do agenteData
				console.log('[AgenteAutonomoActive] âš ï¸ Nenhum tradeHistory disponÃ­vel. tradeHistory:', this.tradeHistory, 'agenteData.operationHistory:', this.agenteData?.operationHistory);
				return this.agenteData?.operationHistory || [];
			},
			userIdComputed() {
				// Garantir que o userId seja sempre atualizado
				return this.getUserId();
			},
			tempoAtivoDisplay() {
				// Priorizar prop tempoAtivo, depois agenteData.tempoAtivo
				if (this.tempoAtivo && this.tempoAtivo !== '0h 0m 0s') {
					return this.tempoAtivo;
				}
				if (this.agenteData && this.agenteData.tempoAtivo) {
					return this.agenteData.tempoAtivo;
				}
				return '0h 0m 0s';
			},
			acoesAgenteComputed() {
				// Usar agentActions do agenteData se disponÃ­vel
				const actions = this.agenteData?.agentActions || this.acoesAgente || [];
				return actions;
			},
			progressoPorcentagem() {
				const current = this.sessionStats?.netProfit || this.progressoMeta.atual || 0;
				const percentage = (current / this.progressoMeta.meta) * 100;
				return `${Math.min(100, Math.max(0, percentage)).toFixed(0)}%`;
			},
			operacoesHojeDisplay() {
				// Priorizar sessionStats.operationsToday (mais confiÃ¡vel), depois agenteData.operacoesHoje, depois 0
				const valor = this.sessionStats?.operationsToday ?? this.agenteData?.operacoesHoje ?? 0;
				console.log('[AgenteAutonomoActive] operacoesHojeDisplay computed:', valor, 'sessionStats:', this.sessionStats?.operationsToday, 'agenteData:', this.agenteData?.operacoesHoje);
				return valor;
			},
			totalCapital() {
				// Priorizar sessionStats.totalCapital (do backend), depois usar accountBalance do header como fallback
				const backendCapital = this.sessionStats?.totalCapital;
				const headerBalance = this.agenteData?.accountBalance;
				
				// Converter para nÃºmero se necessÃ¡rio
				const backendCapitalNum = backendCapital ? (typeof backendCapital === 'number' ? backendCapital : parseFloat(String(backendCapital)) || 0) : 0;
				const headerBalanceNum = headerBalance !== null && headerBalance !== undefined 
					? (typeof headerBalance === 'number' ? headerBalance : parseFloat(String(headerBalance)) || 0) 
					: 0;
				
				// Log detalhado para debug (sempre logar quando houver valores ou quando agenteData existir)
				if (this.agenteData && (headerBalanceNum > 0 || backendCapitalNum > 0 || headerBalance !== undefined)) {
					console.log('[AgenteAutonomoActive] totalCapital computed:', {
						backendCapital: backendCapital,
						backendCapitalNum: backendCapitalNum,
						headerBalance: headerBalance,
						headerBalanceType: typeof headerBalance,
						headerBalanceNum: headerBalanceNum,
						agenteDataExists: !!this.agenteData,
						agenteDataAccountBalance: this.agenteData?.accountBalance,
						sessionStatsExists: !!this.sessionStats
					});
				}
				
				if (backendCapitalNum > 0) {
					return backendCapitalNum;
				}
				
				if (headerBalanceNum > 0) {
					console.log('[AgenteAutonomoActive] âœ… totalCapital: usando headerBalance como fallback:', headerBalanceNum);
					return headerBalanceNum;
				}
				
				// Log apenas quando realmente nÃ£o hÃ¡ valor (evitar spam)
				if (this.sessionStats && this.agenteData && headerBalanceNum === 0 && backendCapitalNum === 0) {
					console.warn('[AgenteAutonomoActive] âš ï¸ totalCapital: nenhum valor disponÃ­vel. backendCapital:', backendCapitalNum, 'headerBalance:', headerBalanceNum, 'agenteData.accountBalance:', this.agenteData?.accountBalance);
				}
				return 0;
			},
			totalBalance() {
				// âœ… Saldo total da conta (account balance) - usado para calcular porcentagem do resultado do dia
				// IMPORTANTE: NÃƒO usar totalCapital (valor inicial) como fallback, sempre usar o saldo atual da conta
				const accountBalance = this.agenteData?.accountBalance;
				let balanceNum = 0;
				
				if (accountBalance !== null && accountBalance !== undefined) {
					if (typeof accountBalance === 'number') {
						balanceNum = accountBalance;
					} else if (typeof accountBalance === 'object') {
						// Se for um objeto (retornado pelo balanceLoader), extrair o valor numÃ©rico
						if (accountBalance.balance !== undefined && accountBalance.balance !== null) {
							balanceNum = typeof accountBalance.balance === 'number' 
								? accountBalance.balance 
								: parseFloat(String(accountBalance.balance)) || 0;
						} else if (accountBalance.value !== undefined && accountBalance.value !== null) {
							balanceNum = typeof accountBalance.value === 'number' 
								? accountBalance.value 
								: parseFloat(String(accountBalance.value)) || 0;
						} else {
							// Tentar converter o objeto inteiro para nÃºmero (improvÃ¡vel, mas tenta)
							balanceNum = Number(accountBalance) || 0;
						}
					} else if (typeof accountBalance === 'string') {
						// Converter string para nÃºmero, removendo formataÃ§Ã£o se necessÃ¡rio
						// Tratar formato brasileiro: "18.299,07" -> 18299.07
						// Tratar formato americano: "18299.07" -> 18299.07
						let cleanBalance = String(accountBalance).trim();
						
						// Remover sÃ­mbolos de moeda e espaÃ§os
						cleanBalance = cleanBalance.replace(/[Ä$R$\s]/g, '');
						
						// Se tiver vÃ­rgula como separador decimal (formato brasileiro)
						if (cleanBalance.includes(',') && cleanBalance.includes('.')) {
							// Formato: "18.299,07" -> remover pontos de milhar, substituir vÃ­rgula por ponto
							cleanBalance = cleanBalance.replace(/\./g, '').replace(',', '.');
						} else if (cleanBalance.includes(',')) {
							// Apenas vÃ­rgula: "18299,07" -> substituir por ponto
							cleanBalance = cleanBalance.replace(',', '.');
						}
						
						balanceNum = parseFloat(cleanBalance) || 0;
					} else {
						// Tentar converter para nÃºmero diretamente
						balanceNum = Number(accountBalance) || 0;
					}
				}
				
				// Log para debug (sempre logar quando houver netProfit para identificar problemas)
				if (this.sessionStats?.netProfit !== undefined && this.sessionStats.netProfit !== null) {
					const netProfit = this.sessionStats.netProfit || 0;
					const percentage = balanceNum > 0 ? ((netProfit / balanceNum) * 100).toFixed(2) : 'N/A';
					
					console.log('[AgenteAutonomoActive] ðŸ’° totalBalance computed:', {
						accountBalance: accountBalance,
						accountBalanceType: typeof accountBalance,
						balanceNum: balanceNum,
						netProfit: netProfit,
						percentage: percentage,
						agenteDataExists: !!this.agenteData,
						// NÃƒO usar totalCapital como referÃªncia aqui
					});
					
					// Aviso se o saldo nÃ£o estiver disponÃ­vel mas houver netProfit
					if (balanceNum <= 0 && Math.abs(netProfit) > 0.01) {
						console.error('[AgenteAutonomoActive] âŒ ERRO: Saldo total nÃ£o disponÃ­vel para calcular porcentagem!', {
							accountBalance: accountBalance,
							balanceNum: balanceNum,
							netProfit: netProfit,
							agenteData: this.agenteData,
						});
					}
				}
				
				// âŒ NÃƒO usar totalCapital como fallback - sempre usar o saldo atual da conta
				// Se nÃ£o houver saldo vÃ¡lido, retornar 0 (evitar divisÃ£o por zero e cÃ¡lculos incorretos)
				if (balanceNum <= 0) {
					return 0;
				}
				
				return balanceNum;
			},
			tempoOptions() {
				return this.timeframeOptions[this.unidadeTimeframeSelecionada] || [];
			},
			timeframeFinal() {
				const unidadeMap = {
					'minutos': 'm',
					'horas': 'h',
					'Dias': 'D'
				};
				return `${this.valorTimeframeSelecionado}${unidadeMap[this.unidadeTimeframeSelecionada] || ''}`;
			},
			graficoPlaceholder() {
				return `Performance do Agente (Gráfico de ${this.tipoGraficoSelecionado} | ${this.timeframeFinal})`;
			},


			historicoOperacoesFiltradas() {
				const { filtroDataSelecionado, dataInicio, dataFim, historicoOperacoes } = this;
				const getDateNDaysAgo = (n) => {
					const date = new Date();
					date.setDate(date.getDate() - n + 1);
					return date.toISOString().split('T')[0];
				};
				const hoje = new Date().toISOString().split('T')[0];
				let startDate;
				switch (filtroDataSelecionado) {
					case 'hoje':
						startDate = hoje;
						return historicoOperacoes.filter(op => op.data === startDate);
					case 'ontem':
						startDate = getDateNDaysAgo(1);
						return historicoOperacoes.filter(op => op.data === startDate);
					case 'personalizado':
						if (dataInicio && dataFim) {
							return historicoOperacoes.filter(op => op.data >= dataInicio && op.data <= dataFim).sort((a, b) => new Date(b.data + 'T' + b.hora) - new Date(a.data + 'T' + a.hora));
						} else if (dataInicio) {
							return historicoOperacoes.filter(op => op.data >= dataInicio).sort((a, b) => new Date(b.data + 'T' + b.hora) - new Date(a.data + 'T' + a.hora));
						} else if (dataFim) {
							return historicoOperacoes.filter(op => op.data <= dataFim).sort((a, b) => new Date(b.data + 'T' + b.hora) - new Date(a.data + 'T' + a.hora));
						}
						return historicoOperacoes;
					case '7d':
						startDate = getDateNDaysAgo(7);
						return historicoOperacoes.filter(op => op.data >= startDate).sort((a, b) => new Date(b.data + 'T' + b.hora) - new Date(a.data + 'T' + a.hora));
					case '30d':
						startDate = getDateNDaysAgo(30);
						return historicoOperacoes.filter(op => op.data >= startDate).sort((a, b) => new Date(b.data + 'T' + b.hora) - new Date(a.data + 'T' + a.hora));
					default:
						return historicoOperacoes.sort((a, b) => new Date(b.data + 'T' + b.hora) - new Date(a.data + 'T' + a.hora));
				}
			},
			// Transformar dados do histórico para o formato esperado pelo OperationLogs
			formattedTradeResults() {
				if (!this.historicoOperacoes || this.historicoOperacoes.length === 0) {
					return [];
				}
				
				return this.historicoOperacoes.map((op, index) => {
					// Extrair valores numÃ©ricos
					const entrada = parseFloat(op.entrada) || 0;
					const saida = parseFloat(op.saida) || entrada;
					
					// Extrair resultado (ganho/perda)
					const resultadoStr = op.resultado || '+$0.00';
					const resultadoMatch = resultadoStr.replace('$', '').replace('+', '').replace(',', '');
					const profit = parseFloat(resultadoMatch) || 0;
					
					// Determinar direÃ§Ã£o baseado no tipo
					const direction = op.tipo === 'Call' ? 'CALL' : (op.tipo === 'Put' ? 'PUT' : 'CALL');
					
					// Criar ID Ãºnico
					const contractId = `autonomo-${op.data}-${op.hora}-${index}`;
					
					// Converter data e hora para timestamp e Date objects
					const dateTime = new Date(`${op.data}T${op.hora}`);
					const time = Math.floor(dateTime.getTime() / 1000);
					
					// Criar createdAt e closedAt (assumindo que a hora Ã© quando foi fechado)
					const createdAt = dateTime.toISOString();
					const closedAt = dateTime.toISOString(); // Usar mesma data/hora jÃ¡ que nÃ£o temos separaÃ§Ã£o
					
					return {
						contractId: contractId,
						id: contractId,
						buyPrice: entrada,
						price: entrada,
						direction: direction,
						type: direction,
						profit: profit,
						profitLoss: profit,
						exitTick: saida.toFixed(2),
						sellPrice: saida,
						closePrice: saida,
						status: 'CLOSED',
						time: time,
						stakeAmount: entrada,
						createdAt: createdAt,
						closedAt: closedAt
					};
				});
			}
		},
		watch: {
			'agenteData.dailyProfit'(newVal) {
				if (newVal !== undefined) {
					this.progressoMeta.atual = parseFloat(newVal) || 0;
				}
			},
			'agenteData.operacoesHoje'(newVal) {
				console.log('[AgenteAutonomoActive] agenteData.operacoesHoje mudou para:', newVal);
			},
			sessionStats: {
				handler(newStats) {
					if (newStats && newStats.netProfit !== undefined) {
						this.progressoMeta.atual = parseFloat(newStats.netProfit) || 0;
					}
				},
				deep: true,
				immediate: true,
			},
			abaAtiva(newAba, oldAba) {
				// âœ… DESATIVADO: Polling desativado temporariamente para reduzir carga no servidor
				if (newAba === 'grafico') {
					// Buscar histÃ³rico apenas uma vez (sem polling contÃ­nuo)
					this.fetchPriceHistory();
					// this.startPricePolling(); // âœ… DESATIVADO
					
					// Parar polling de logs
					this.stopLogsPolling();
					
					this.$nextTick(() => {
						setTimeout(() => {
							if (this.$refs.indexChartContainer) {
								if (!this.indexChartInitialized) {
									this.initIndexChart();
								} else if (this.priceTicks.length > 0) {
									// Se jÃ¡ estiver inicializado, atualizar com dados
									this.updateIndexChart();
								}
							}
						}, 200);
					});
				} else if (newAba === 'historico') {
					// Buscar histÃ³rico de trades quando entrar na aba histÃ³rico
					this.fetchTradeHistory();
					// Parar polling de logs
					this.stopLogsPolling();
				} else if (newAba === 'registro') {
					// âœ… Iniciar polling de logs quando entrar na aba registro
					this.startLogsPolling();
				} else {
					// âœ… OTIMIZADO: Parar polling quando sair da aba grÃ¡fico
					if (oldAba === 'grafico') {
						this.stopPricePolling();
						console.log('[AgenteAutonomoActive] Polling parado ao sair da aba grÃ¡fico');
					}
					// Parar polling de logs se sair da aba registro
					if (oldAba === 'registro') {
						this.stopLogsPolling();
					}
				}
			},
			'agenteData.goalValue'(newVal) {
				if (newVal !== undefined) {
					this.progressoMeta.meta = newVal || 50;
				}
			},
			'agenteData.stopValue'(newVal) {
				if (newVal !== undefined) {
					this.progressoMeta.stop = newVal || 25;
				}
			},
			'agenteData.lastExecutionTime'(newVal) {
				if (newVal) {
					this.ultimaAtualizacao = newVal;
				}
			},
			'agenteData.tempoAtivo'(newVal, oldVal) {
				// ForÃ§ar atualizaÃ§Ã£o quando tempoAtivo mudar
				if (newVal && newVal !== oldVal) {
					console.log('[AgenteAutonomoActive] tempoAtivo mudou:', { newVal, oldVal });
					this.$forceUpdate();
				}
			},
			'agenteData.accountBalance'(newVal, oldVal) {
				// ForÃ§ar atualizaÃ§Ã£o quando accountBalance mudar para recalcular porcentagens
				if (newVal !== oldVal) {
					console.log('[AgenteAutonomoActive] accountBalance mudou (watch especÃ­fico):', { 
						newVal, 
						oldVal, 
						newValType: typeof newVal,
						isValid: newVal && typeof newVal === 'number' && newVal > 0,
						agenteDataAccountBalance: this.agenteData?.accountBalance
					});
					if (newVal && typeof newVal === 'number' && newVal > 0) {
						console.log('[AgenteAutonomoActive] ForÃ§ando atualizaÃ§Ã£o devido a mudanÃ§a de accountBalance');
						this.$forceUpdate();
					}
				}
			},
			agenteData: {
				handler(newVal, oldVal) {
					// Log de mudanÃ§as em agenteData
					if (newVal && typeof newVal === 'object') {
						console.log('[AgenteAutonomoActive] agenteData mudou:', {
							operacoesHoje: newVal?.operacoesHoje,
							accountBalance: newVal?.accountBalance,
							accountBalanceType: typeof newVal?.accountBalance,
							oldAccountBalance: oldVal?.accountBalance,
							fullAgenteData: newVal
						});
						
						// ForÃ§ar atualizaÃ§Ã£o quando accountBalance mudar
						if (newVal.accountBalance && newVal.accountBalance !== oldVal?.accountBalance) {
							console.log('[AgenteAutonomoActive] accountBalance mudou no agenteData, forÃ§ando atualizaÃ§Ã£o');
							this.$forceUpdate();
						}
						
						// ForÃ§ar atualizaÃ§Ã£o quando agenteData mudar (especialmente tempoAtivo)
						if (newVal.tempoAtivo) {
							console.log('[AgenteAutonomoActive] agenteData mudou:', {
								newTempoAtivo: newVal.tempoAtivo,
								oldTempoAtivo: oldVal?.tempoAtivo
							});
							this.$forceUpdate();
						}
						
						// âœ… NOVO: Quando agenteData Ã© definido pela primeira vez (nova sessÃ£o), buscar ticks atualizados
						if (!oldVal && this.abaAtiva === 'grafico') {
							console.log('[AgenteAutonomoActive] Nova sessÃ£o detectada, buscando ticks atualizados...');
							this.$nextTick(() => {
								setTimeout(() => {
									this.fetchPriceHistory();
								}, 1000); // Aguardar 1 segundo para garantir que o backend processou a ativaÃ§Ã£o
							});
						}
					} else if (newVal && !oldVal) {
						// âœ… Nova sessÃ£o detectada (agenteData definido pela primeira vez)
						if (this.abaAtiva === 'grafico') {
							console.log('[AgenteAutonomoActive] Nova sessÃ£o detectada, buscando ticks atualizados...');
							this.$nextTick(() => {
								setTimeout(() => {
									this.fetchPriceHistory();
								}, 1000); // Aguardar 1 segundo para garantir que o backend processou a ativaÃ§Ã£o
							});
						}
					}
				},
				deep: true,
				immediate: true
			},
			tradeHistory: {
				handler(newHistory) {
					if (newHistory && newHistory.length > 0) {
						// Calcular maior ganho e maior perda
						const profits = newHistory
							.filter(t => t.profitLoss !== null && t.profitLoss > 0)
							.map(t => t.profitLoss);
						const losses = newHistory
							.filter(t => t.profitLoss !== null && t.profitLoss < 0)
							.map(t => Math.abs(t.profitLoss));
						
						this.maiorGanho = profits.length > 0 ? Math.max(...profits) : 0;
						this.maiorPerda = losses.length > 0 ? Math.max(...losses) : 0;
					}
				},
				deep: true,
				immediate: true
			},
			unidadeTimeframeSelecionada(novaUnidade) {
				const primeiroValor = this.timeframeOptions[novaUnidade][0];
				if (this.valorTimeframeSelecionado !== primeiroValor) {
					this.valorTimeframeSelecionado = primeiroValor;
				}
			},
			filtroDataSelecionado(novoFiltro) {
				if (novoFiltro !== 'personalizado') {
					const hoje = new Date().toISOString().split('T')[0];
					this.dataInicio = hoje;
					this.dataFim = hoje;
				}
			},
			priceTicks: {
				handler(newTicks) {
					console.log('[AgenteAutonomoActive] priceTicks atualizado:', newTicks?.length || 0, 'ticks');
					if (newTicks && newTicks.length > 0) {
						if (this.indexChartInitialized && this.abaAtiva === 'grafico') {
							this.$nextTick(() => {
								this.updateIndexChart();
							});
						} else if (this.abaAtiva === 'grafico') {
							// Se o grÃ¡fico ainda nÃ£o foi inicializado mas temos dados, inicializar
							this.$nextTick(() => {
								if (this.$refs.indexChartContainer) {
									this.initIndexChart();
								}
							});
						}
					}
				},
				deep: true,
				immediate: true
			},
			'agenteData.mercado'(newMarket) {
				// Atualizar sÃ­mbolo quando o mercado mudar
				if (newMarket) {
					const marketToSymbol = {
						'Volatility 10 Index': 'R_10',
						'Volatility 25 Index': 'R_25',
						'Volatility 50 Index': 'R_50',
						'Volatility 75 Index': 'R_75',
						'Volatility 100 Index': 'R_100'
					};
					const newSymbol = marketToSymbol[newMarket] || 'R_75';
					if (this.symbol !== newSymbol) {
						this.symbol = newSymbol;
						// Reconectar WebSocket com novo sÃ­mbolo
						if (this.derivWebSocket) {
							this.disconnectDerivWebSocket();
							setTimeout(() => {
								this.connectToDerivWebSocket();
							}, 1000);
						}
					}
				}
			}
		},
		mounted() {
			// Inicializar dados do agente
			if (this.agenteData) {
				this.progressoMeta.atual = this.agenteData.dailyProfit || 0;
				this.progressoMeta.meta = this.agenteData.goalValue || 50;
				this.progressoMeta.stop = this.agenteData.stopValue || 25;
				this.ultimaAtualizacao = this.agenteData.lastExecutionTime || new Date().toLocaleTimeString('pt-BR');
				
				// Atualizar sÃ­mbolo baseado no mercado do agenteData
				if (this.agenteData.mercado) {
					const marketToSymbol = {
						'Volatility 10 Index': 'R_10',
						'Volatility 25 Index': 'R_25',
						'Volatility 50 Index': 'R_50',
						'Volatility 75 Index': 'R_75',
						'Volatility 100 Index': 'R_100'
					};
					this.symbol = marketToSymbol[this.agenteData.mercado] || 'R_75';
				}
			}
			
			// Atualizar Ãºltima atualizaÃ§Ã£o a cada segundo
			this.timeUpdateInterval = setInterval(() => {
				this.ultimaAtualizacao = new Date().toLocaleTimeString('pt-BR');
			}, 1000);
			
			// âœ… DESATIVADO: Polling desativado temporariamente para reduzir carga no servidor
			// NÃ£o usar WebSocket no frontend para evitar requisiÃ§Ãµes travadas
			if (this.abaAtiva === 'grafico') {
				// Buscar histÃ³rico inicial apenas uma vez (sem polling contÃ­nuo)
				this.fetchPriceHistory();
				// this.startPricePolling(); // âœ… DESATIVADO
			} else if (this.abaAtiva === 'historico') {
				// Buscar histÃ³rico de trades se estiver na aba histÃ³rico
				this.fetchTradeHistory();
			}
			
			// Inicializar grÃ¡fico apenas se estiver na aba grÃ¡fico
			if (this.abaAtiva === 'grafico') {
				this.$nextTick(() => {
					setTimeout(() => {
						if (this.$refs.indexChartContainer) {
							this.initIndexChart();
						}
					}, 500);
				});
			}
			
			// âœ… Iniciar polling de logs se estiver na aba registro
			if (this.abaAtiva === 'registro') {
				this.startLogsPolling();
			}
			
			if (this.abaAtiva === 'registro') {
				this.startLogsPolling();
			}

			// Verificar estado do Stop Loss ao montar
			this.checkStopLossState();
			
			// Rolagem instantÃ¢nea para o topo
			window.scrollTo({ top: 0, behavior: 'auto' });
		},
		beforeUnmount() {
			// Limpar todos os intervalos
			if (this.priceHistoryInterval) {
				clearInterval(this.priceHistoryInterval);
			}
			if (this.pricePollingInterval) {
				clearInterval(this.pricePollingInterval);
			}
			if (this.timeUpdateInterval) {
				clearInterval(this.timeUpdateInterval);
			}
			if (this.chartUpdateThrottle) {
				clearTimeout(this.chartUpdateThrottle);
			}
			
			// âœ… Removido: WebSocket nÃ£o Ã© mais usado no frontend
			// this.disconnectDerivWebSocket();
			
			// Destruir grÃ¡fico
			if (this.indexChart) {
				this.indexChart.remove();
				this.indexChart = null;
			}
		},
		methods: {
			trocarAba(aba) {
				this.abaAtiva = aba;
			},
			exportarHistorico() {
				// Removido o alert
				console.log(`Exportando histÃ³rico. Filtro: ${this.filtroDataSelecionado}. Total de operaÃ§Ãµes: ${this.historicoOperacoesFiltradas.length}`);
				// Aqui seria a lÃ³gica real para gerar e baixar um arquivo CSV/Excel/PDF
			},
			// âœ… REMOVIDO: WebSocket nÃ£o Ã© mais usado no frontend
			// O backend gerencia o WebSocket, o frontend usa polling HTTP como na IA
			
			// âœ… NOVO: Buscar histÃ³rico de preÃ§os do backend (como na IA)
			async fetchPriceHistory() {
				try {
					const userId = this.getUserId();
					if (!userId) {
						console.warn('[AgenteAutonomoActive] âš ï¸ userId nÃ£o disponÃ­vel para buscar histÃ³rico');
						return;
					}
					
					const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
					const url = `${apiBase}/autonomous-agent/price-history/${userId}?limit=200`;
					console.log('[AgenteAutonomoActive] ðŸ“¡ Buscando histÃ³rico de preÃ§os:', url);
					
					const response = await fetch(url, {
						headers: {
							'Authorization': `Bearer ${localStorage.getItem('token')}`
						}
					});
					
					if (!response.ok) {
						console.warn(`[AgenteAutonomoActive] âš ï¸ Resposta nÃ£o OK: ${response.status} ${response.statusText}`);
						return;
					}
					
					const result = await response.json();
					console.log('[AgenteAutonomoActive] ðŸ“¦ Resposta recebida:', { success: result.success, dataLength: result.data?.length || 0 });
					
					if (result.success && result.data && Array.isArray(result.data)) {
						// âœ… SEGUINDO PADRÃƒO DA IA: Processamento robusto de ticks
						const ticks = result.data
							.map(tick => {
								// Extrair value de forma robusta (tentar todas as propriedades possÃ­veis)
								const rawValue = tick.value ?? tick.price ?? tick.quote ?? tick.close ?? tick.spot ?? null;
								if (!rawValue || rawValue === 0) {
									return null;
								}
								
								const value = parseFloat(rawValue);
								if (isNaN(value) || !isFinite(value) || value <= 0) {
									return null;
								}
								
								// Extrair epoch/time de forma robusta
								let epoch = tick.epoch || tick.time;
								if (!epoch && tick.timestamp) {
									epoch = Math.floor(new Date(tick.timestamp).getTime() / 1000);
								} else if (epoch > 10000000000) {
									// Se for timestamp em milissegundos, converter para segundos
									epoch = Math.floor(epoch / 1000);
								} else {
									epoch = Math.floor(epoch);
								}
								
								if (!epoch || epoch <= 0) {
									return null;
								}
								
								return {
									value: value,
									epoch: epoch,
									timestamp: tick.timestamp || new Date(epoch * 1000).toISOString()
								};
							})
							.filter(tick => tick !== null && tick.value > 0 && tick.epoch > 0);
						
						this.priceTicks = ticks;
						console.log('[AgenteAutonomoActive] âœ… HistÃ³rico carregado:', ticks.length, 'ticks vÃ¡lidos de', result.data.length, 'total');
						if (ticks.length > 0) {
							console.log('[AgenteAutonomoActive] ðŸ“Š Primeiro tick:', ticks[0], 'Ãšltimo tick:', ticks[ticks.length - 1]);
						}
						
						// Atualizar grÃ¡fico se jÃ¡ estiver inicializado
						if (this.indexChartInitialized) {
							this.updateIndexChart();
						} else if (ticks.length > 0) {
							// Se o grÃ¡fico ainda nÃ£o foi inicializado mas temos dados, inicializar
							this.$nextTick(() => {
								if (this.$refs.indexChartContainer && !this.indexChartInitialized) {
									this.initIndexChart();
								}
							});
						}
					} else {
						console.warn('[AgenteAutonomoActive] âš ï¸ Resposta sem dados vÃ¡lidos:', result);
					}
				} catch (error) {
					console.error('[AgenteAutonomoActive] âŒ Erro ao buscar histÃ³rico:', error);
				}
			},
			
			// âœ… DESATIVADO: Polling de preÃ§os desativado temporariamente para reduzir carga no servidor
			startPricePolling() {
				// Buscar apenas uma vez ao inicializar, sem polling contÃ­nuo
				// this.fetchPriceHistory();
				// Polling desativado para reduzir requisiÃ§Ãµes pendentes
				// this.pricePollingInterval = setInterval(() => {
				// 	if (this.abaAtiva === 'grafico') {
				// 		this.fetchPriceHistory();
				// 	}
				// }, 2000);
			},
			
			// âœ… NOVO: Parar polling de preÃ§os
			stopPricePolling() {
				if (this.pricePollingInterval) {
					clearInterval(this.pricePollingInterval);
					this.pricePollingInterval = null;
				}
			},
			
			// âœ… NOVO: Buscar histÃ³rico de trades do backend
			async fetchTradeHistory() {
				try {
					const userId = this.getUserId();
					if (!userId) {
						console.warn('[AgenteAutonomoActive] âš ï¸ userId nÃ£o disponÃ­vel para buscar histÃ³rico de trades');
						return;
					}
					
					const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
					const url = `${apiBase}/autonomous-agent/trade-history/${userId}?limit=50`;
					console.log('[AgenteAutonomoActive] ðŸ“¡ Buscando histÃ³rico de trades:', url);
					
					const response = await fetch(url, {
						headers: {
							'Authorization': `Bearer ${localStorage.getItem('token')}`
						}
					});
					
					if (!response.ok) {
						console.warn(`[AgenteAutonomoActive] âš ï¸ Resposta nÃ£o OK ao buscar trades: ${response.status} ${response.statusText}`);
						return;
					}
					
					const result = await response.json();
					console.log('[AgenteAutonomoActive] ðŸ“¦ HistÃ³rico de trades recebido:', { success: result.success, dataLength: result.data?.length || 0 });
					
					if (result.success && result.data && Array.isArray(result.data)) {
						// Atualizar localTradeHistory (variÃ¡vel local no data)
						this.localTradeHistory = result.data;
						console.log('[AgenteAutonomoActive] âœ… HistÃ³rico de trades atualizado:', result.data.length, 'trades');
					} else {
						console.warn('[AgenteAutonomoActive] âš ï¸ Resposta sem dados vÃ¡lidos de trades:', result);
					}
				} catch (error) {
					console.error('[AgenteAutonomoActive] âŒ Erro ao buscar histÃ³rico de trades:', error);
				}
			},
			
			// âœ… REMOVIDO: Todo o cÃ³digo do WebSocket foi removido
			// Agora usamos polling HTTP para buscar ticks do backend (como na IA)
			// O backend gerencia o WebSocket com a Deriv
			
			// ============================================
			// GRÃFICO DO ÃNDICE R_75
			// ============================================
			initIndexChart() {
				if (this.indexChartInitialized || !this.$refs.indexChartContainer) {
					return;
				}
				
				try {
					const container = this.$refs.indexChartContainer;
					
					// Verificar se o container tem dimensÃµes vÃ¡lidas
					if (container.offsetWidth === 0 || container.offsetHeight === 0) {
						console.warn('[AgenteAutonomoActive] Container sem dimensÃµes, tentando novamente...');
						setTimeout(() => this.initIndexChart(), 500);
						return;
					}
					
					const containerWidth = container.offsetWidth || 800;
					const containerHeight = container.offsetHeight || 400;
					
					console.log('[AgenteAutonomoActive] Inicializando grÃ¡fico com dimensÃµes:', containerWidth, 'x', containerHeight);
					
					this.indexChart = createChart(container, {
						width: containerWidth,
						height: containerHeight,
						autoSize: true,
						localization: { 
							locale: 'pt-BR',
							timeFormatter: (time) => {
								const date = new Date(time * 1000);
								const hours = String(date.getHours()).padStart(2, '0');
								const minutes = String(date.getMinutes()).padStart(2, '0');
								return `${hours}:${minutes}`;
							}
						},
						layout: {
							background: { type: ColorType.Solid, color: '#0B0B0B' },
							textColor: '#DFDFDF',
						},
						rightPriceScale: {
							borderColor: '#1C1C1C',
						},
						leftPriceScale: {
							visible: false,
						},
						timeScale: {
							borderColor: '#1C1C1C',
							timeVisible: true,
							secondsVisible: false,
						},
						grid: {
							vertLines: { color: 'rgba(148, 163, 184, 0.1)', visible: true },
							horzLines: { color: 'rgba(148, 163, 184, 0.1)', visible: true },
						},
					});
					
					this.indexChartSeries = this.indexChart.addLineSeries({
						color: '#22C55E',
						lineWidth: 2,
						priceFormat: {
							type: 'price',
							precision: 1,
							minMove: 0.1,
						},
					});
					
					this.indexChartInitialized = true;
					console.log('[AgenteAutonomoActive] GrÃ¡fico inicializado. Ticks disponÃ­veis:', this.priceTicks.length);
					
					if (this.priceTicks.length > 0) {
						this.updateIndexChart();
					} else {
						console.warn('[AgenteAutonomoActive] Nenhum tick disponÃ­vel para plotar - tentando buscar histÃ³rico...');
						// Tentar buscar histÃ³rico se ainda nÃ£o tiver dados
						this.fetchPriceHistory();
					}
				} catch (error) {
					console.error('[AgenteAutonomoActive] Erro ao inicializar Gráfico de Ã­ndice:', error);
					this.indexChartInitialized = false;
				}
			},
			
			updateIndexChart() {
				if (!this.indexChartInitialized || !this.indexChartSeries) {
					console.warn('[AgenteAutonomoActive] GrÃ¡fico nÃ£o inicializado ou sÃ©rie nÃ£o disponÃ­vel');
					return;
				}
				
				if (this.priceTicks.length === 0) {
					console.warn('[AgenteAutonomoActive] Nenhum tick disponÃ­vel para atualizar grÃ¡fico');
					return;
				}
				
				try {
					// âœ… SEGUINDO PADRÃƒO DA IA: Processamento robusto de ticks
					const sortedTicks = [...this.priceTicks]
						.map(tick => {
							// Extrair time de forma robusta (como na IA)
							let time = tick.epoch || tick.time;
							if (!time) {
								// Tentar extrair de timestamp se disponÃ­vel
								if (tick.timestamp) {
									time = Math.floor(new Date(tick.timestamp).getTime() / 1000);
								} else {
									time = Date.now() / 1000;
								}
							} else if (time > 10000000000) {
								// Se for timestamp em milissegundos, converter para segundos
								time = Math.floor(time / 1000);
							} else {
								time = Math.floor(time);
							}
							
							// âœ… Extrair value de forma robusta - tentar todas as propriedades possÃ­veis (como na IA)
							let rawValue = tick.value ?? tick.price ?? tick.quote ?? tick.close ?? tick.spot ?? null;
							
							// Se ainda for null/undefined, pular este tick
							if (rawValue == null || rawValue === undefined) {
								return null;
							}
							
							// Converter para nÃºmero
							const value = Number(rawValue);
							
							// Validar antes de retornar (como na IA)
							if (isNaN(value) || !isFinite(value) || value <= 0 || time <= 0) {
								return null;
							}
							
							return { time, value };
						})
						.filter(point => {
							// âœ… CORREÃ‡ÃƒO: Filtrar valores null, undefined, NaN, 0 e negativos (como na IA)
							if (!point) return false;
							return point.value != null
								&& !isNaN(point.value)
								&& isFinite(point.value)
								&& point.value > 0
								&& point.time != null
								&& !isNaN(point.time)
								&& isFinite(point.time)
								&& point.time > 0;
						})
						.sort((a, b) => a.time - b.time);
					
					if (sortedTicks.length === 0) {
						console.warn('[AgenteAutonomoActive] Nenhum tick vÃ¡lido apÃ³s filtragem');
						return;
					}
					
					// âœ… ValidaÃ§Ã£o final: garantir que nÃ£o hÃ¡ valores null/undefined (como na IA)
					const validTicks = sortedTicks.filter(point => {
						return point
							&& typeof point.time === 'number'
							&& typeof point.value === 'number'
							&& point.time > 0
							&& point.value > 0
							&& isFinite(point.time)
							&& isFinite(point.value);
					});
					
					if (validTicks.length === 0) {
						console.warn('[AgenteAutonomoActive] Nenhum tick vÃ¡lido apÃ³s validaÃ§Ã£o final');
						return;
					}
					
					// Limitar dados para melhor performance (Ãºltimos 200 pontos)
					const limitedData = validTicks.slice(-200);
					
					console.log('[AgenteAutonomoActive] Atualizando grÃ¡fico com', limitedData.length, 'pontos vÃ¡lidos de', this.priceTicks.length, 'ticks totais');
					
					// âœ… Usar setData com dados validados
					this.indexChartSeries.setData(limitedData);
					this.indexChart.timeScale().fitContent();
				} catch (error) {
					console.error('[AgenteAutonomoActive] Erro ao atualizar Gráfico de Ã­ndice:', error);
				}
			},
			getUserId() {
				// Tentar obter do localStorage primeiro
				const userStr = localStorage.getItem("user");
				if (userStr) {
					try {
						const user = JSON.parse(userStr);
						if (user.id || user.userId) {
							return user.id || user.userId;
						}
					} catch (error) {
						console.error("[AgenteAutonomoActive] Erro ao parsear user:", error);
					}
				}

				// Fallback: tentar decodificar do token JWT
				const token = localStorage.getItem("token");
				if (token) {
					try {
						const payload = JSON.parse(atob(token.split('.')[1]));
						// Tentar diferentes campos comuns do payload JWT
						if (payload.userId || payload.sub || payload.id) {
							const userId = payload.userId || payload.sub || payload.id;
							console.log("[AgenteAutonomoActive] userId obtido do token JWT:", userId);
							return userId;
						}
					} catch (error) {
						console.error("[AgenteAutonomoActive] Erro ao decodificar token JWT:", error);
					}
				}

				console.warn("[AgenteAutonomoActive] NÃ£o foi possÃ­vel obter userId");
				console.warn("[AgenteAutonomoActive] NÃ£o foi possÃ­vel obter userId");
				return null;
			},

			checkStopLossState() {
				const lastHit = localStorage.getItem('agent_stop_loss_date');
				if (lastHit) {
					const today = new Date().toDateString();
					if (lastHit === today) {
						this.showStopLossModal = true;
					} else {
						// Novo dia, limpar estado
						localStorage.removeItem('agent_stop_loss_date');
						this.showStopLossModal = false;
					}
				}
			},
			
			pausarAgenteEIrParaTopo() {
				console.log('[AgenteAutonomoActive] BotÃ£o pausar clicado, emitindo evento pausar-agente');
				this.$emit('pausar-agente'); // Usa apenas o padrÃ£o kebab-case para evitar duplicidade
				this.$nextTick(() => {
					window.scrollTo({ top: 0, behavior: 'smooth' }); // Ou 'instant'
				});
			},
			
			// âœ… MÃ©todos para logs (igual Ã  IA)
			async fetchRealtimeLogs() {
				try {
					const userId = this.getUserId();
					if (!userId) {
						console.warn('[AgenteAutonomoActive] âš ï¸ UserId nÃ£o disponÃ­vel para buscar logs');
						return;
					}
					
					const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
					const url = `${apiBase}/autonomous-agent/logs/${userId}?limit=100`;
					
					const response = await fetch(url, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${localStorage.getItem('token')}`
						}
					});
					
					if (!response.ok) {
						console.warn('[AgenteAutonomoActive] âš ï¸ Erro ao buscar logs:', response.status);
						return;
					}
					
					const result = await response.json();
					if (result.success && result.data && Array.isArray(result.data)) {
						// Converter logs para o formato esperado (igual Ã  IA)
						const newLogs = result.data.map(log => {
							// Determinar tipo e Ã­cone baseado no mÃ³dulo e mensagem
							let type = 'info';
							let icon = 'â„¹ï¸';
							
							if (log.module === 'TRADER' || log.module === 'API') {
								if (log.level === 'ERROR' || log.message?.toLowerCase().includes('loss') || 
									log.message?.toLowerCase().includes('lost') || log.message?.toLowerCase().includes('perda')) {
									type = 'erro';
									icon = 'ðŸš«';
								} else if (log.message?.toLowerCase().includes('profit') || log.message?.toLowerCase().includes('won') || 
									log.message?.toLowerCase().includes('lucro') || log.message?.toLowerCase().includes('ganho')) {
									type = 'resultado';
									icon = 'âœ…';
								} else if (log.message?.toLowerCase().includes('buy') || log.message?.toLowerCase().includes('proposal') || 
									log.message?.toLowerCase().includes('comprando')) {
									type = 'operacao';
									icon = 'ðŸ’°';
								}
							} else if (log.module === 'ANALYZER') {
								type = 'analise';
								icon = 'ðŸ”';
							} else if (log.module === 'RISK') {
								type = 'alerta';
								icon = 'âš ï¸';
							} else if (log.module === 'CORE') {
								type = 'info';
								icon = 'â„¹ï¸';
							}
							
							// Formatar timestamp (HH:mm:ss)
							let timestamp = '--';
							if (log.timestamp) {
								try {
									const date = new Date(log.timestamp);
									if (!isNaN(date.getTime())) {
										// Formato: HH:mm:ss
										const hours = String(date.getHours()).padStart(2, '0');
										const minutes = String(date.getMinutes()).padStart(2, '0');
										const seconds = String(date.getSeconds()).padStart(2, '0');
										timestamp = `${hours}:${minutes}:${seconds}`;
									}
								} catch (error) {
									timestamp = '--';
								}
							}
							
							// Limpar mensagem removendo prefixos duplicados
							let cleanMessage = log.message || '';
							cleanMessage = cleanMessage.replace(/^\[.*?\]\s*-\s*/g, '');
							
							return {
								id: log.id,
								timestamp,
								type,
								icon,
								message: cleanMessage,
								module: log.module,
								level: log.level || log.logLevel,
							};
						});
						
						// âœ… Verificar logs de Stop Loss
						const stopLossLog = newLogs.find(l => l.message && (l.message.includes('LIMITE DE PERDA ATINGIDO') || l.message.includes('daily_loss=')));
						if (stopLossLog) {
							const today = new Date().toDateString();
							const lastHit = localStorage.getItem('agent_stop_loss_date');
							
							// Se ainda nÃ£o foi mostrado hoje
							if (lastHit !== today) {
								console.log('[AgenteAutonomoActive] âš ï¸ Stop Loss detectado: ativando modal');
								this.showStopLossModal = true;
								localStorage.setItem('agent_stop_loss_date', today);
							}
						}
						
						if (!this.realtimeLogs || this.realtimeLogs.length === 0 || !this.lastLogTimestamp) {
							this.realtimeLogs = newLogs;
							if (this.realtimeLogs && this.realtimeLogs.length > 0) {
								this.lastLogTimestamp = this.realtimeLogs[0].timestamp;
							}
							
							this.$nextTick(() => {
								if (this.$refs.logsContainer) {
									this.$refs.logsContainer.scrollTop = 0;
								}
							});
						} else {
							if (!this.realtimeLogs) {
								this.realtimeLogs = [];
							}
							const existingIds = new Set(this.realtimeLogs.map(log => log.id || log.timestamp));
							const logsToAdd = newLogs.filter(log => {
								const logId = log.id || log.timestamp;
								return !existingIds.has(logId);
							});
							
							if (logsToAdd.length > 0) {
								const container = this.$refs.logsContainer;
								const isAtTop = container && container.scrollTop <= 50;
								
								this.realtimeLogs = [...logsToAdd, ...this.realtimeLogs];
								this.lastLogTimestamp = this.realtimeLogs[0].timestamp;
								
								this.$nextTick(() => {
									if (container && isAtTop) {
										container.scrollTop = 0;
									}
								});
							}
						}
					}
				} catch (error) {
					console.error('[AgenteAutonomoActive] âŒ Erro ao buscar logs:', error);
				}
			},
			
			getLogClass(log) {
				const colors = {
					info: 'text-blue-400',
					tick: 'text-gray-400',
					analise: 'text-purple-400',
					sinal: 'text-yellow-400',
					operacao: 'text-cyan-400',
					resultado: 'text-green-400',
					alerta: 'text-orange-400',
					erro: 'text-red-500'
				};
				
				return colors[log.type] || 'text-gray-400';
			},
			
			exportLogs() {
				if (!this.realtimeLogs || this.realtimeLogs.length === 0) return;
				
				const text = this.realtimeLogs.map(log => {
					return `[${log.timestamp}] ${log.icon} ${log.message}`;
				}).join('\n');
				
				const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `agente-autonomo-logs-${new Date().toISOString().split('T')[0]}.txt`;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				URL.revokeObjectURL(url);
			},
			
			clearLogs() {
				this.realtimeLogs = [];
				this.lastLogTimestamp = null;
			},
			
			startLogsPolling() {
				this.stopLogsPolling();
				
				// Buscar logs imediatamente
				this.fetchRealtimeLogs();
				
				// Polling a cada 2 segundos (igual Ã  IA)
				this.logsPollingInterval = setInterval(() => {
					if (this.abaAtiva === 'registro') {
						this.fetchRealtimeLogs();
					} else {
						this.stopLogsPolling();
					}
				}, 2000);
			},
			
			stopLogsPolling() {
				if (this.logsPollingInterval) {
					clearInterval(this.logsPollingInterval);
					this.logsPollingInterval = null;
				}
			}
		},
	};
