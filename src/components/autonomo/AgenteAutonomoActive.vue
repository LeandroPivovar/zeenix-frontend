<template>
	<div class="min-h-screen text-[#FAFAFA] font-sans" :style="{ 
		paddingTop: isMobile ? '30px' : '2.2rem',
		paddingLeft: isMobile ? '1rem' : '0',
		paddingRight: isMobile ? '1rem' : '0',
		paddingBottom: isMobile ? '30px' : '0'
	}">
		<!-- Header -->
		<div class="flex flex-col items-start md:flex-row md:items-center md:justify-between mb-2 gap-4 md:mt-2 mt-2 fade-in">
			<!-- Title Section -->
			<div v-if="showTitle" class="text-left">
				<h1 class="text-xl font-bold text-zenix-text mb-1">Monitoramento do Agente</h1>
				<p class="text-sm text-zenix-secondary">Acompanhe em tempo real a performance do seu agente autônomo.</p>
			</div>

			<div class="flex flex-row items-center gap-3 w-full md:w-auto ml-auto">
                <!-- Agent Selector REMOVED as per user request -->

				<div class="relative z-[40] flex-1 md:flex-none">
					<button 
						@click.stop="toggleDatePicker"
						class="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-[#27272a] hover:bg-[#27272a] h-9 px-4 py-2 justify-between gap-2 bg-[#0c0c0c] text-[#FAFAFA] w-full md:min-w-[180px]" 
						type="button"
					>
						<div class="flex items-center gap-2">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar text-green-500"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
							<span class="font-medium">{{ dateRangeText }}</span>
						</div>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down text-[#A1A1AA] transition-transform duration-200" :class="{ 'rotate-180': showDatePicker }"><path d="m6 9 6 6 6-6"></path></svg>
					</button>

					<!-- Dropdown Menu -->
					<div 
						v-if="showDatePicker"
						class="absolute top-full left-0 mt-1 w-full rounded-md border border-[#27272a] bg-[#0c0c0c] shadow-lg z-[50] py-1"
					>
						<button 
							v-for="option in dateOptions" 
							:key="option.value"
							@click="selectDateRange(option)"
							class="w-full text-left px-4 py-2 text-sm text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#27272a] transition-colors flex items-center justify-between group"
							:class="{ 'text-green-500 bg-[#27272a]': selectedPeriod === option.value }"
						>
							<span>{{ option.label }}</span>
							<svg v-if="selectedPeriod === option.value" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check text-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
						</button>
					</div>
				</div>



				
				<button @click="pausarAgenteEIrParaTopo" class="flex-1 md:flex-none h-9 md:w-auto md:px-5 md:py-2 text-sm md:text-xs font-bold bg-[#FFBC29] text-black rounded-lg md:rounded-md hover:bg-[#ffc64d] transition-colors shadow-[0_0_15px_rgba(255,188,41,0.2)] flex items-center justify-center gap-2 whitespace-nowrap">
            PAUSAR AGENTE
          </button>
			</div>
		</div>

		<div class="mb-2">
			<div class="flex justify-end mb-2">
				<button 
					@click="hideValues = !hideValues"
					class="flex items-center gap-1.5 text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors text-xs"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye" v-if="!hideValues"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>
					<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off" v-else><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" x2="22" y1="2" y2="22"></line></svg>
					<span>{{ hideValues ? 'Mostrar valores' : 'Ocultar valores' }}</span>
				</button>
			</div>

            <!-- Cycle Completion Modal -->
            <CycleCompletionModal
                :visible="showCycleCompletionModal"
                :cycle-number="currentCycleNumber"
                :result="currentCycleNumber >= 4 ? (sessionStats?.netProfit || 0) : currentCycleProfit"
                :currency-symbol="preferredCurrencyPrefix"
                @close="showCycleCompletionModal = false"
                @confirm="handleConfirmCycle"
            />
			
			<!-- Metric Cards -->
			<div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<!-- Capital Inicial -->
				<div v-if="!isMobile" class="rounded-lg border border-[#27272a] bg-[#0c0c0c] p-[0.8rem] md:p-5 h-full transition-all duration-200 hover:bg-[#121212]">
					<div class="flex items-center mb-4 gap-2">
						<div class="p-2 rounded-lg bg-[#22C55E]/10 flex items-center justify-center">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-dollar-sign text-[#22C55E]"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
						</div>
						<span class="text-[#A1A1AA] text-xs capitalize tracking-wide font-medium">Entrada Inicial</span>
					</div>
					<div class="text-2xl font-bold mb-1 tabular-nums text-[#FAFAFA] text-left">
						{{ hideValues ? '••••' : preferredCurrencyPrefix + formatPrice(renderedInitialCapital) }}
					</div>
				</div>



				<!-- Capital Final -->
				<div class="rounded-lg border border-[#27272a] bg-[#0c0c0c] p-[0.8rem] md:p-5 h-full transition-all duration-200 hover:bg-[#121212]">
					<div class="flex items-center gap-2 mb-3">
						<div class="p-2 rounded-lg bg-[#22C55E]/10 flex items-center justify-center">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wallet text-[#22C55E]"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path></svg>
						</div>
						<span class="text-[#A1A1AA] text-xs capitalize tracking-wide font-medium whitespace-nowrap">Capital</span>
					</div>
				<div class="text-2xl font-bold mb-1 tabular-nums text-left text-[#FAFAFA]">
						{{ hideValues ? '••••' : (renderedFinalCapital >= 0 ? preferredCurrencyPrefix : '-' + preferredCurrencyPrefix) + formatPrice(Math.abs(renderedFinalCapital)) }}
					</div>
				</div>

				<!-- Lucro do Periodo -->
				<div 
					class="rounded-lg border bg-[#0c0c0c] p-[0.8rem] md:p-5 h-full transition-all duration-200 hover:bg-[#121212] relative overflow-hidden"
					:class="renderedPeriodProfit >= 0 ? 'border-green-500/20' : 'border-red-500/20'"
				>
					<div 
						class="absolute inset-0 pointer-events-none"
						:class="renderedPeriodProfit >= 0 ? 'bg-green-500/5' : 'bg-red-500/5'"
					></div>
					<div class="flex items-center gap-2 mb-3 relative z-10">
						<div :class="renderedPeriodProfit >= 0 ? 'text-green-500' : 'text-red-500'">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-up" v-if="renderedPeriodProfit >= 0"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-down" v-else><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline><polyline points="16 17 22 17 22 11"></polyline></svg>
						</div>
						<span class="text-[#A1A1AA] text-xs capitalize tracking-wide font-medium whitespace-nowrap">Lucro do Período</span>
					</div>
					<div 
						class="text-2xl font-bold mb-1 tabular-nums relative z-10 text-left"
						:class="renderedPeriodProfit >= 0 ? 'text-green-500' : 'text-red-500'"
					>
						{{ hideValues ? '••••' : (renderedPeriodProfit < 0 ? '-' : (renderedPeriodProfit > 0 ? '+' : '')) + preferredCurrencyPrefix + formatPrice(Math.abs(renderedPeriodProfit)) }}
					</div>
					<!-- ✅ Formatação Dual: Mostrar Percentual -->
					<div class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium tabular-nums opacity-90 mt-1"
						:class= "renderedPeriodProfit >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'"
					>
						<span v-if="!hideValues">
							{{ (renderedPeriodProfitPercent >= 0 ? '+' : '') + renderedPeriodProfitPercent.toFixed(2) }}%
						</span>
						<span v-else-if="hideValues">••••</span>
					</div>
					<!-- Percentage Badge Removed -->
				</div>
				<!-- Lucro Medio/Dia -->
				<div 
					v-if="!isMobile"
					class="rounded-lg border bg-[#0c0c0c] p-[0.8rem] md:p-5 h-full transition-all duration-200 hover:bg-[#121212]"
					:class="renderedAvgDailyProfit >= 0 ? 'border-[#27272a]' : 'border-red-500/20'"
				>
					<div class="flex items-center gap-2 mb-3">
						<div :class="renderedAvgDailyProfit >= 0 ? 'text-green-500' : 'text-red-500'">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chart-column"><path d="M3 3v16a2 2 0 0 0 2 2h16"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path></svg>
						</div>
						<span class="text-[#A1A1AA] text-xs capitalize tracking-wide font-medium">Lucro Médio/Dia</span>
					</div>
					<div 
						class="text-2xl font-bold mb-1 tabular-nums text-left"
						:class="renderedAvgDailyProfit >= 0 ? 'text-green-500' : 'text-red-500'"
					>
						{{ hideValues ? '••••' : (renderedAvgDailyProfit < 0 ? '-' : (renderedAvgDailyProfit > 0 ? '+' : '')) + preferredCurrencyPrefix + formatPrice(Math.abs(renderedAvgDailyProfit)) }}
					</div>
					<div class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium tabular-nums opacity-90"
						:class="renderedAvgDailyProfit >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'"
					>
						<span v-if="!hideValues">
							{{ (renderedAvgDailyProfitPercent >= 0 ? '+' : '') + renderedAvgDailyProfitPercent.toFixed(2) + '%' }}
						</span>
						<span v-else>••••</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Additional Stats Row -->
		<div class="rounded-lg border border-[#27272a] bg-[#0c0c0c] p-4 mb-6 relative">
			<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
				
				<!-- Estrategia -->
				<div class="relative flex-1 agent-switcher-container">
					<div 
						class="flex items-center justify-between hover:bg-[#1a1a1a] rounded-lg p-2 -m-2 transition-colors cursor-pointer group"
						@click.stop="toggleAgentSwitcher"
					>
						<div class="flex items-center gap-3">
							<div class="p-2 bg-[#1a1a1a] rounded-md overflow-hidden flex items-center justify-center w-10 h-10 border border-[#27272a]">
                                <img 
                                    v-if="currentAgentId === 'zeus'"
                                    src="/img/agents/zeus.png"
                                    class="w-full h-full object-cover rounded-sm"
                                />
                                <img 
                                    v-else-if="currentAgentId === 'falcon'"
                                    src="/img/agents/falcon.png"
                                    class="w-full h-full object-cover rounded-sm"
                                />
                                <div v-else class="strategy-icons-inline text-lg">
                                    {{ runningAgents.find(a => a.id === currentAgentId)?.emoji || '⚡' }}
                                </div>
							</div>
                            <div class="flex flex-col">
                                <span class="text-[10px] text-[#A1A1AA] font-bold uppercase tracking-wider mb-0.5">AGENTE ATIVO</span>
								<span class="text-white font-bold">{{ agenteData.estrategia ? agenteData.estrategia.replace('IA ', '') : 'Agente' }}</span>
                            </div>
						</div>
					</div>

					<!-- Agent Switcher Backdrop (Mobile) -->
					<div 
						v-if="showAgentSwitcher && isMobile" 
						class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] animate-fade-in"
						@click="showAgentSwitcher = false"
					></div>

					<!-- Agent Switcher Dropdown (Responsive Fix) -->
					<div 
						v-if="showAgentSwitcher"
						class="bg-[#0c0c0c] border border-[#27272a] rounded-xl shadow-2xl z-[60] overflow-hidden animate-fade-in"
						:class="isMobile ? 'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[400px] h-auto max-h-[80vh]' : 'absolute top-full mt-4 left-0 w-[460px]'"
					>
						<div class="sticky top-0 p-4 border-b border-[#27272a] bg-[#121212] z-10 flex items-center justify-between">
							<h4 class="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider text-left">SELECIONE O AGENTE</h4>
							<button v-if="isMobile" @click="showAgentSwitcher = false" class="text-[#A1A1AA] hover:text-white">
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
							</button>
						</div>
						
						<div class="max-h-[420px] overflow-y-auto custom-scrollbar p-3">
							<div 
								v-for="agent in runningAgents" 
								:key="agent.id"
								@click="selectAgent(agent.id)"
								class="w-full flex flex-col p-4 cursor-pointer transition-all rounded-xl mb-3 last:mb-0 relative group shadow-lg border"
								:class="currentAgentId === agent.id ? 'bg-[#092012]/15 border-[#22c55e]/50 shadow-[#22c55e]/10' : 'bg-[#141414] border-[#27272a] hover:border-[#333] shadow-black/20'"
							>
								<!-- Ativo Badge in Top Right Corner -->
								<div 
									v-if="currentAgentId === agent.id" 
									class="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-[#1b3324] border border-[#22c55e]/40 shadow-sm z-30 flex items-center justify-center"
								>
									<span class="text-[8px] text-[#22c55e] font-black uppercase tracking-widest text-center">ATIVO</span>
								</div>

								<!-- Top Section: Icon + Title -->
								<div class="flex items-center gap-4 mb-3">
									<!-- Icon Container -->
									<div class="w-12 h-12 rounded-lg bg-[#0c0c0c] flex items-center justify-center relative shrink-0 border border-[#27272a]">
										<img 
											v-if="agent.id === 'zeus'"
											src="/img/agents/zeus.png"
											class="w-full h-full object-cover rounded-md"
										/>
										<img 
											v-else-if="agent.id === 'falcon'"
											src="/img/agents/falcon.png"
											class="w-full h-full object-cover rounded-md"
										/>
										<div v-else class="strategy-icons-inline text-2xl">
											{{ agent.emoji }}
										</div>
									</div>

									<!-- Title and Description -->
									<div class="flex-1 min-w-0">
										<h5 class="text-[13px] font-bold text-[#f0f0f0] uppercase tracking-wide mb-0.5">
											{{ agent.title.toUpperCase() }}
										</h5>
										<p class="text-[10px] text-[#A1A1AA] leading-tight truncate">
											{{ agent.description.split('\n')[0].replace('Análise: ', '') }}
										</p>
									</div>
								</div>

								<!-- Divider -->
								<div class="h-px w-full bg-[#27272a] mb-3"></div>

								<!-- Bottom Section: Stats Inline and Centered -->
								<div class="flex items-center justify-center gap-6">
									<div class="flex items-center gap-2">
										<span class="text-[8px] text-[#7d807e] font-bold uppercase tracking-tight">ASSERTIVIDADE</span>
										<span class="text-[12px] font-black text-[#f0f0f0]">
											{{ agent.description.match(/Assertividade: (.*)%/)?.[1] || (agent.id === 'zeus' ? '90' : '70') }}%
										</span>
									</div>
									<div class="flex items-center gap-2">
										<span class="text-[8px] text-[#7d807e] font-bold uppercase tracking-tight">RETORNO</span>
										<span class="text-[12px] font-black text-[#22c55e]">
											{{ agent.id === 'zeus' ? '+' + zeusReturn.toFixed(2) + '%' : agent.id === 'falcon' ? '+' + falconReturn.toFixed(2) + '%' : 'N/A' }}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Resultado do dia -->
				<div class="flex items-center gap-3">
					<div class="p-2 bg-[#1a1a1a] rounded-md">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-up" :class="renderedDailyResultValue >= 0 ? 'text-green-500' : 'text-red-500'" v-if="renderedDailyResultValue >= 0"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-down" :class="renderedDailyResultValue >= 0 ? 'text-green-500' : 'text-red-500'" v-else><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline><polyline points="16 17 22 17 22 11"></polyline></svg>
					</div>
					<div>
						<div class="text-[#A1A1AA] text-[10px] capitalize tracking-wide">Resultado do dia</div>
						<div class="text-sm font-medium tabular-nums text-left" :class="renderedDailyResultValue >= 0 ? 'text-green-500' : 'text-red-500'">
							{{ hideValues ? '••••' : (renderedDailyResultValue < 0 ? '-' : (renderedDailyResultValue > 0 ? '+' : '')) + preferredCurrencyPrefix + formatPrice(Math.abs(renderedDailyResultValue)) }}
						</div>
					</div>
				</div>

				<!-- Operacoes Hoje -->
				<div class="flex items-center gap-3">
					<div class="p-2 rounded-lg bg-[#22C55E]/10 flex items-center justify-center">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity text-[#22C55E]"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path></svg>
					</div>
					<div>
						<div class="text-[#A1A1AA] text-[10px] capitalize tracking-wide">OPERAÇÕES HOJE</div>
						<div class="text-sm font-medium tabular-nums text-[#FAFAFA] text-left">{{ renderedOperacoesHoje }}</div>
					</div>
				</div>

				<!-- Tempo Ativo -->
				<div class="flex items-center gap-3">
					<div class="p-2 rounded-lg bg-[#22C55E]/10 flex items-center justify-center">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock text-[#22C55E]"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
					</div>
					<div>
						<div class="text-[#A1A1AA] text-[10px] capitalize tracking-wide">Tempo ativo</div>
						<div class="text-sm font-medium tabular-nums text-[#FAFAFA] text-left">{{ tempoAtivoDisplay }}</div>
					</div>
				</div>
				<!-- Meta Diária -->
				<div class="flex items-center gap-3">
					<div class="p-2 rounded-lg bg-[#22C55E]/10 flex items-center justify-center">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-target text-[#22C55E]"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
					</div>
					<div>
						<div class="text-[#A1A1AA] text-[10px] capitalize tracking-wide">Meta Diária</div>
						<div class="text-sm font-medium tabular-nums text-[#FAFAFA] text-left">
							{{ hideValues ? '••••' : preferredCurrencyPrefix + formatPrice(agenteData.goalValue || agentConfig?.profitTarget || 50) }}
						</div>
					</div>
				</div>

				<!-- Stop Loss -->
				<div class="flex items-center gap-3">
					<div class="p-2 rounded-lg bg-red-500/10 flex items-center justify-center">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-alert text-red-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path><path d="M12 8v4"></path><path d="M12 16h.01"></path></svg>
					</div>
					<div>
						<div class="text-[#A1A1AA] text-[10px] capitalize tracking-wide">Stop Loss</div>
						<div class="text-sm font-medium tabular-nums text-[#FAFAFA] text-left">
							{{ hideValues ? '••••' : preferredCurrencyPrefix + formatPrice(agenteData.stopValue || agentConfig?.lossLimit || 25) }}
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Performance Chart -->
		<div class="rounded-lg border border-[#27272a] bg-[#0c0c0c] p-5 mb-6">
			<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
				<h3 class="text-sm font-semibold flex items-center gap-2 uppercase tracking-wide text-[#FAFAFA]">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-up text-green-500"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
					PERFORMANCE
				</h3>
                
                <div class="flex items-center gap-4 ml-auto">
                    <div class="flex items-center gap-1 bg-[#1a1a1a] p-1 rounded-lg border border-[#27272a]">
                        <button 
                            v-for="type in [{id:'session', label:'HOJE'}, {id:'7d', label:'SEMANA'}, {id:'30d', label:'MÊS'}, {id:'6m', label:'SEMESTRE'}, {id:'1y', label:'ANO'}]" 
                            :key="type.id"
                            @click="selectDateRange({value: type.id})"
                            class="px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all"
                            :class="selectedPeriod === type.id ? 'bg-[#FAFAFA] text-black shadow-lg shadow-white/5' : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'"
                        >
                            {{ type.label }}
                        </button>
                    </div>
                    <span v-if="!isMobile" class="text-[#A1A1AA] text-xs font-medium uppercase tracking-tight">{{ dateRangeText }}</span>
                </div>
			</div>
			
			<div ref="performanceChartContainer" class="h-[300px] w-full bg-gradient-to-b from-green-500/5 to-transparent border-b border-[#27272a] mb-4 relative">
				<!-- Lightweight Charts will inject here -->
			</div>

			<div class="flex justify-between mt-4">
				<div class="flex items-center gap-2">
					<div class="inline-flex items-center rounded-full border border-green-500/30 bg-green-500/10 text-green-500 font-semibold text-[10px] px-2.5 py-0.5">
						Melhor dia
					</div>
					<span class="text-xs text-[#FAFAFA] tabular-nums" v-if="!hideValues">+{{ preferredCurrencyPrefix }}{{ formatPrice(bestDay?.value) }} ({{ bestDay?.date || '--' }})</span>
					<span class="text-xs text-[#FAFAFA] tabular-nums" v-else>•••• ({{ bestDay?.date || '--' }})</span>
				</div>
				<div class="flex items-center gap-2">
					<div class="inline-flex items-center rounded-full border border-red-500/30 bg-red-500/10 text-red-500 font-semibold text-[10px] px-2.5 py-0.5">
						Pior dia
					</div>
					<span class="text-xs text-[#FAFAFA] tabular-nums" v-if="!hideValues">-{{ preferredCurrencyPrefix }}{{ formatPrice(Math.abs(worstDay?.value || 0)) }} ({{ worstDay?.date || '--' }})</span>
					<span class="text-xs text-[#FAFAFA] tabular-nums" v-else>•••• ({{ worstDay?.date || '--' }})</span>
				</div>
			</div>
		</div>

		<!-- Distribution Tables -->
		<div class="rounded-lg border border-[#27272a] bg-[#0c0c0c] p-5">
			<h3 class="text-sm font-semibold flex items-center gap-2 mb-4 uppercase tracking-wide text-[#FAFAFA]">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity text-green-500"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path></svg>
				Distribuição Performance
			</h3>

			<!-- Weekly Table -->
			<div class="overflow-x-auto mb-6">
				<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
					<h4 class="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wide text-left flex items-center gap-2">
                        Resumo {{ selectedAggregation === 'week' ? 'Semanal' : selectedAggregation === 'month' ? 'Mensal' : selectedAggregation === 'semester' ? 'Semestral' : 'Anual' }}
                        <span v-if="selectedPeriodFilter" class="bg-green-500/10 text-green-500 text-[10px] px-2 py-0.5 rounded border border-green-500/20">Filtrado</span>
                    </h4>
                    
                    <div class="flex items-center gap-3 ml-auto">
                        <div class="flex items-center gap-1 bg-[#1a1a1a] p-1 rounded-lg border border-[#27272a]">
                            <button 
                                v-for="type in [{id:'week', label:'SEMANA'}, {id:'month', label:'MÊS'}, {id:'semester', label:'SEMESTRE'}, {id:'year', label:'ANO'}]" 
                                :key="type.id"
                                @click="selectAggregation(type.id)"
                                class="px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all"
                                :class="selectedAggregation === type.id ? 'bg-[#FAFAFA] text-black shadow-lg shadow-white/5' : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'"
                            >
                                {{ type.label }}
                            </button>
                        </div>

                        <button v-if="selectedPeriodFilter" @click="clearPeriodFilter" class="text-[10px] text-red-500 hover:text-red-400 font-bold uppercase transition-colors flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-filter-x"><path d="M13.013 17.653 21 21v-3.5a2 2 0 0 1 2-2.13L21 15"/><path d="m3 3 18 18"/><path d="M14.761 2.362A3 3 0 0 1 20 5.337L15 13.5v7l-2.091-2.091"/></svg>
                            LIMPAR FILTRO
                        </button>
                    </div>
				</div>
				<div class="overflow-x-auto overflow-y-auto max-h-[300px] custom-scrollbar">
					<table class="w-full text-[11px] sm:text-xs md:text-sm">
						<thead class="border-b border-[#27272a]">
							<tr class="text-[#A1A1AA] text-[10px] sm:text-xs">
								<th class="text-left py-2 px-1 font-medium uppercase tracking-wide">Periodo</th>
								<th class="text-right py-2 px-1 font-medium uppercase tracking-wide">Lucro</th>
								<th class="text-right py-2 px-1 font-medium uppercase tracking-wide">Capital Final</th>
								<th class="text-right py-2 px-1 font-medium uppercase tracking-wide">%</th>
								<th class="text-right py-2 px-1 font-medium uppercase tracking-wide">Ops</th>
								<th class="text-right py-2 px-1 font-medium uppercase tracking-wide">Win Rate</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="week in weeklyData" :key="week.period" 
								class="border-b border-[#27272a]/50 hover:bg-[#1a1a1a] transition-colors cursor-pointer"
								:class="{ 'bg-[#1a1a1a] border-green-500/30': selectedPeriodFilter === week.period }"
								@click="selectPeriodFilter(week)">
								<td class="text-left py-2.5 px-1 font-medium text-white">
									<div class="flex items-center gap-2">
										<div class="w-1.5 h-1.5 rounded-full" :class="selectedPeriodFilter === week.period ? 'bg-green-500' : 'bg-transparent'"></div>
										{{ week.period }}
									</div>
								</td>
								<td class="text-right py-2.5 px-1 tabular-nums font-medium" :class="week.profit >= 0 ? 'text-green-500' : 'text-red-500'">
									{{ week.profit < 0 ? '-' : (week.profit > 0 ? '+' : '') }}{{ preferredCurrencyPrefix }}{{ formatPrice(Math.abs(week.profit)) }}
								</td>
								<td class="text-right py-2.5 px-1 tabular-nums text-[#FAFAFA]">{{ preferredCurrencyPrefix }}{{ formatPrice(week.finalCapital) }}</td>
								<td class="text-right py-2.5 px-1 tabular-nums" :class="week.percent >= 0 ? 'text-green-500' : 'text-red-500'">
									{{ week.percent >= 0 ? '+' : '' }}{{ week.percent.toFixed(2) }}%
								</td>
								<td class="text-right py-2.5 px-1 tabular-nums text-[#FAFAFA]">{{ week.ops }}</td>
								<td class="text-right py-2.5 px-1 tabular-nums">
									<span class="bg-white/5 text-[#FAFAFA] border border-white/10 px-2 py-0.5 rounded text-[10px]">
										{{ week.winRate.toFixed(1) }}%
									</span>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<!-- Daily Table -->
			<div>
				<h4 class="text-xs font-semibold text-[#A1A1AA] mb-3 uppercase tracking-wide text-left">Detalhamento Diário</h4>
				<div class="relative overflow-hidden h-[400px]"> 
					<div class="overflow-y-auto custom-scrollbar h-full relative">
						<table class="w-full text-[11px] sm:text-xs md:text-sm">
							<thead class="sticky top-0 bg-[#0c0c0c] z-10 box-border border-b border-[#27272a]">
								<tr class="text-[#A1A1AA] text-[10px] sm:text-xs">
									<th class="text-left py-2.5 px-1 font-medium uppercase tracking-wide">Dia</th>
									<th class="text-right py-2.5 px-1 font-medium uppercase tracking-wide">Lucro</th>
									<th class="text-right py-2.5 px-1 font-medium uppercase tracking-wide">Capital</th>
									<th class="text-right py-2.5 px-1 font-medium uppercase tracking-wide">Ops</th>
									<th class="text-right py-2.5 px-1 font-medium uppercase tracking-wide">Win%</th>
									<th class="text-right py-2.5 px-1 font-medium uppercase tracking-wide">Tempo Ops</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="day in filteredDailyData" :key="day.date" 
									class="border-b border-[#27272a]/50 hover:bg-[#1a1a1a] transition-colors cursor-pointer"
									:class="{'bg-green-500/5 hover:bg-green-500/10': day.badge === 'Melhor', 'bg-red-500/5 hover:bg-red-500/10': day.badge === 'Pior'}"
									@click="openDayDetails(day)">
									<td class="py-3 px-1 font-medium text-[#FAFAFA]">
										<div class="flex items-center gap-2">
											<span>{{ day.date }}</span>
											<div v-if="day.badge" 
												class="inline-flex items-center rounded-full border font-semibold text-[8px] px-1 py-0"
												:class="day.badge === 'Melhor' ? 'border-green-500 text-green-500 bg-green-500/10' : day.badge === 'Pior' ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-yellow-400 text-yellow-500 bg-yellow-400/10'">
												<svg v-if="day.badge === 'Melhor'" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-up mr-0.5"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
												<svg v-if="day.badge === 'Pior'" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-down mr-0.5"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline><polyline points="16 17 22 17 22 11"></polyline></svg>
												{{ day.badge }}
											</div>
										</div>
									</td>
									<td class="text-right py-3 px-1 tabular-nums font-semibold" :class="day.profit >= 0 ? 'text-green-500' : 'text-red-500'">
										{{ day.profit < 0 ? '-' : (day.profit > 0 ? '+' : '') }}{{ preferredCurrencyPrefix }}{{ formatPrice(Math.abs(day.profit)) }}
									</td>
									<td class="text-right py-3 px-1 tabular-nums text-[#FAFAFA]">{{ preferredCurrencyPrefix }}{{ formatPrice(day.capital) }}</td>
									<td class="text-right py-3 px-1 tabular-nums text-[#FAFAFA]">{{ day.ops }}</td>
									<td class="text-right py-3 px-1 tabular-nums font-medium">
										<span 
											class="px-2 py-0.5 rounded text-[10px] border"
											:class="day.winRate >= 70 ? 'text-green-500 bg-green-500/10 border-green-500/20' : day.winRate >= 50 ? 'text-[#FAFAFA] bg-white/5 border-white/10' : 'text-red-500 bg-red-500/10 border-red-500/20'"
										>
											{{ day.winRate.toFixed(1) }}%
										</span>
									</td>
									<td class="text-right py-3 px-1 tabular-nums text-[#A1A1AA]">{{ day.avgTime }}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<p class="text-[#A1A1AA] text-[10px] mt-3">Clique em uma linha para ver detalhes do dia</p>
			</div>
		</div>


		<!-- Strategy Logs Section -->
		<div class="mt-8 rounded-lg border text-card-foreground shadow-sm bg-[#0c0c0c] border-[#27272a] overflow-hidden">
			<button 
				@click="showLogs = !showLogs"
				class="w-full p-4 flex items-center justify-between hover:bg-[#1a1a1a] transition-colors"
			>
				<div class="flex items-center gap-2">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-terminal w-4 h-4 text-green-500"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" x2="20" y1="19" y2="19"></line></svg>
					<span class="text-sm font-semibold uppercase tracking-wide text-[#FAFAFA] text-left">Logs do Agente Selecionado</span>
					<span class="text-xs text-[#A1A1AA]" v-if="realtimeLogs.length">({{ realtimeLogs.length }} registros)</span>
				</div>
				<div class="flex items-center gap-2">
					<span class="text-xs text-[#A1A1AA]">{{ showLogs ? 'Ocultar Logs' : 'Mostrar Logs' }}</span>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-up w-4 h-4 text-[#A1A1AA] transition-transform duration-200" :class="{ 'rotate-180': !showLogs }"><path d="m18 15-6-6-6 6"></path></svg>
				</div>
			</button>
			
			<div v-show="showLogs" class="border-t border-[#27272a] animate-in fade-in slide-in-from-top-2 duration-300">
				<AutonomousAgentLogs 
					:userId="getUserId()" 
					:isActive="true"
					:agentName="agenteData.estrategia.replace('IA ', '')"
					:market="agenteData.mercado"
					:riskProfile="agenteData.risco"
					:accountType="accountType === 'demo' ? 'test' : 'prod'"
					ref="strategyLogs"
					@update-logs="realtimeLogs = $event"
				/>
			</div>
		</div>

		<div class="text-center mt-8 py-4 border-t border-[#27272a]">
			<p class="text-[#A1A1AA] text-xs">Sistema operando automaticamente • Dados atualizados em tempo real</p>
		</div>
	</div>

	<!-- Daily Details Modal -->
	<Teleport to="body">
	<div v-if="selectedDay" 
		class="!fixed !inset-0 !z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-300" 
		@click.self="selectedDay = null"
	>
		<div role="dialog" 
			class="w-full max-w-[95%] sm:max-w-4xl border border-[#27272a] p-3 sm:p-6 shadow-2xl rounded-xl max-h-[90vh] overflow-y-auto bg-[#09090b] relative flex flex-col scale-in-center animate-in zoom-in-95 duration-200"
		>
			
			<!-- Close Button -->
			<button type="button" class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none text-[#A1A1AA] hover:text-[#FAFAFA]" @click="selectedDay = null">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x h-4 w-4"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
				<span class="sr-only">Close</span>
			</button>

			<!-- Header -->
			<div class="flex flex-col space-y-1.5 text-left mb-2">
				<h2 class="text-sm sm:text-lg font-semibold leading-none tracking-tight flex items-center justify-between gap-4">
					<span class="text-[#FAFAFA]">Relatório Diário — {{ activeDayDetails.date }}/2026</span>
					<div class="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] sm:text-xs font-semibold mr-8 sm:mr-10"
						:class="activeDayDetails.profit >= 0 ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'"
					>
						{{ activeDayDetails.profit < 0 ? '-' : (activeDayDetails.profit > 0 ? '+' : '') }}{{ preferredCurrencyPrefix }}{{ Math.abs(activeDayDetails.profit).toFixed(2) }}
					</div>
				</h2>
			</div>

			<!-- KPI Grid -->
			<div class="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mt-4 text-left">
				<!-- Lucro do Dia -->
				<div class="rounded-lg border border-[#27272a] bg-[#0c0c0c] p-2 sm:p-3">
					<div class="text-[#A1A1AA] text-[8px] sm:text-[10px] uppercase tracking-wide mb-0.5 text-left">Lucro do Dia</div>
					<div class="text-base sm:text-xl font-bold tabular-nums text-left" :class="activeDayDetails.profit >= 0 ? 'text-green-500' : 'text-red-500'">
						{{ activeDayDetails.profit < 0 ? '-' : (activeDayDetails.profit > 0 ? '+' : '') }}{{ preferredCurrencyPrefix }}{{ Math.abs(activeDayDetails.profit).toFixed(2) }}
					</div>
				</div>

				<!-- Capital -->
				<div class="rounded-lg border border-[#27272a] bg-[#0c0c0c] p-2 sm:p-3">
					<div class="text-[#A1A1AA] text-[8px] sm:text-[10px] uppercase tracking-wide mb-0.5 text-left">Capital</div>
					<!-- Estimating start capital for display logic -->
					<div class="text-[10px] sm:text-sm font-medium tabular-nums text-[#FAFAFA] text-left">
						{{ preferredCurrencyPrefix }}{{ (activeDayDetails.capital - activeDayDetails.profit).toFixed(2) }} → {{ preferredCurrencyPrefix }}{{ activeDayDetails.capital.toFixed(2) }}
					</div>
				</div>

				<!-- Meta Diária -->
				<div class="rounded-lg border border-[#27272a] bg-[#0c0c0c] p-2 sm:p-3 flex flex-col items-start">
					<div class="text-[#A1A1AA] text-[8px] sm:text-[10px] uppercase tracking-wide mb-0.5 text-left">Meta Diária</div>
					<div class="inline-flex items-center rounded-full border px-2 py-0.5 font-semibold transition-colors text-[10px] sm:text-xs text-left bg-green-500/10 text-green-500 border-green-500/20">
						{{ preferredCurrencyPrefix }}{{ agenteData.goalValue ? agenteData.goalValue.toFixed(2) : '50.00' }}
					</div>
					<div class="text-[#A1A1AA] text-[9px] sm:text-xs mt-0.5 sm:mt-1 text-left" v-if="activeDayDetails.activationTime">
						Ativação: {{ activeDayDetails.activationTime }}
					</div>
				</div>

				<!-- Stop Loss -->
				<div class="rounded-lg border border-[#27272a] bg-[#0c0c0c] p-2 sm:p-3 flex flex-col items-start">
					<div class="text-[#A1A1AA] text-[8px] sm:text-[10px] uppercase tracking-wide mb-0.5 text-left">Stop Loss</div>
					<div class="inline-flex items-center rounded-full border px-2 py-0.5 font-semibold transition-colors text-[10px] sm:text-xs text-left"
						:class="(agenteData.stopValue || 0) < 0 ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'">
						{{ (agenteData.stopValue || 0) < 0 ? '' : '' }}{{ preferredCurrencyPrefix }}{{ (agenteData.stopValue || 25).toFixed(2) }}
					</div>
				</div>
			</div>

			<!-- Statistics Grid -->
			<div class="grid grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3 mt-4">
				<div class="text-center p-1.5 sm:p-2 bg-[#27272a]/30 rounded">
					<div class="text-base sm:text-lg font-bold tabular-nums text-[#FAFAFA]">{{ activeDayDetails.ops }}</div>
					<div class="text-[8px] sm:text-[10px] text-[#A1A1AA] uppercase">Operações</div>
				</div>
				<div class="text-center p-1.5 sm:p-2 bg-[#27272a]/30 rounded">
					<!-- Approximating wins based on winrate -->
					<div class="text-base sm:text-lg font-bold tabular-nums text-green-500">{{ Math.round(activeDayDetails.ops * (activeDayDetails.winRate / 100)) }}</div>
					<div class="text-[8px] sm:text-[10px] text-[#A1A1AA] uppercase">Positivas</div>
				</div>
				<div class="text-center p-1.5 sm:p-2 bg-[#27272a]/30 rounded">
					<div class="text-base sm:text-lg font-bold tabular-nums text-red-500">{{ activeDayDetails.ops - Math.round(activeDayDetails.ops * (activeDayDetails.winRate / 100)) }}</div>
					<div class="text-[8px] sm:text-[10px] text-[#A1A1AA] uppercase">Negativas</div>
				</div>
				<div class="text-center p-1.5 sm:p-2 bg-[#27272a]/30 rounded">
					<div class="text-base sm:text-lg font-bold tabular-nums text-[#FAFAFA]">{{ activeDayDetails.winRate.toFixed(1) }}%</div>
					<div class="text-[8px] sm:text-[10px] text-[#A1A1AA] uppercase">Win Rate</div>
				</div>
				<div class="text-center p-1.5 sm:p-2 bg-[#27272a]/30 rounded">
					<div class="text-base sm:text-lg font-bold tabular-nums" :class="activeDayDetails.profit >= 0 ? 'text-green-500' : 'text-red-500'">
						{{ activeDayDetails.profit < 0 ? '-' : (activeDayDetails.profit > 0 ? '+' : '') }}{{ preferredCurrencyPrefix }}{{ Math.abs(activeDayDetails.profit / (activeDayDetails.ops || 1)).toFixed(2) }}
					</div>
					<div class="text-[8px] sm:text-[10px] text-[#A1A1AA] uppercase">Média/Op</div>
				</div>
				<div class="flex flex-col items-center justify-center p-1.5 sm:p-2 bg-[#27272a]/30 rounded text-center">
					<div 
						class="text-xs sm:text-sm font-bold tabular-nums uppercase" 
						:style="{ color: riskColor }"
					>
						{{ formattedRiskProfile }}
					</div>
					<div class="text-[8px] sm:text-[10px] text-[#A1A1AA] uppercase">Gestão</div>
				</div>
			</div>

			<!-- Intraday Operations Table (Static Mock per snippet requirement) -->
			<div class="mt-4">
				<h4 class="text-sm font-semibold mb-3 uppercase tracking-wide flex items-center gap-2 text-left text-[#FAFAFA]">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity w-4 h-4 text-green-500"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path></svg>
					OPERAÇÕES DIÁRIAS
				</h4>
				<div class="overflow-x-auto max-h-[300px] overflow-y-auto custom-scrollbar">
					<table class="w-full text-[10px] sm:text-xs">
						<thead class="sticky top-0 bg-[#09090b] shadow-sm z-10">
							<tr class="border-b border-[#27272a]">
								<th class="text-left py-2 text-[#A1A1AA] font-medium px-1">Hora</th>
								<th class="text-left py-2 text-[#A1A1AA] font-medium px-1">Mercado</th>
								<th class="text-left py-2 text-[#A1A1AA] font-medium px-1">Tipo</th>
								<th class="text-right py-2 text-[#A1A1AA] font-medium px-1">Entrada</th>
								<th class="text-right py-2 text-[#A1A1AA] font-medium px-1">Saída</th>
								<th class="text-right py-2 text-[#A1A1AA] font-medium px-1">Invest.</th>
								<th class="text-right py-2 text-[#A1A1AA] font-medium px-1">Resultado</th>
							</tr>
						</thead>
						<tbody>
                            <!-- Session grouping logic -->
                            <template v-for="(item, idx) in formattedSessionItems" :key="item.id || idx">
                                <!-- SESSION HEADER: INICIO -->
                                <tr v-if="item.type === 'header'" class="bg-[#1a1a1a]">
                                    <td colspan="7" class="py-1.5 px-2 text-[10px] font-bold text-yellow-500 uppercase tracking-wider border-y border-[#27272a] text-left">
                                         SESSÃO {{ item.sessionNumber }} - INÍCIO {{ item.startTime }}
                                    </td>
                                </tr>

                                <!-- TRADE ROW -->
                                <tr v-else-if="item.type === 'trade'" class="border-b border-[#27272a]/50 hover:bg-[#27272a]/20">
                                    <td class="py-2 px-1 font-mono text-[#A1A1AA] text-left">{{ formatToSPTime(item.data.createdAt) }}</td>
                                    <td class="py-2 px-1 text-[#FAFAFA] text-left truncate max-w-[50px] sm:max-w-none">{{item.data.market}}</td>
                                    <td class="py-2 px-1 text-left">
                                        <span class="px-1.5 py-0.5 rounded-md text-[9px] font-bold"
                                            :class="item.data.contract === 'DIGITMATCH' ? 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'">
                                            {{ item.data.contract }}
                                        </span>
                                    </td>
                                    <td class="py-2 px-1 text-right tabular-nums text-[#FAFAFA] text-[10px]">{{ preferredCurrencyPrefix }}{{item.data.entry}}</td>
                                    <td class="py-2 px-1 text-right tabular-nums text-[#FAFAFA] text-[10px]">{{ preferredCurrencyPrefix }}{{item.data.exit}}</td>
                                    <td class="py-2 px-1 text-right tabular-nums text-[#FAFAFA] text-[10px]">{{ preferredCurrencyPrefix }}{{parseFloat(item.data.stake).toFixed(2)}}</td>
                                    <td class="py-2 px-1 text-right tabular-nums font-semibold" :class="parseFloat(item.data.profit) >= 0 ? 'text-green-500' : 'text-red-500'">
                                        {{ parseFloat(item.data.profit) >= 0 ? '+' : '-' }}{{ preferredCurrencyPrefix }}{{ Math.abs(parseFloat(item.data.profit)).toFixed(2) }}
                                    </td>
                                </tr>

                                <!-- SESSION FOOTER: FIM/PAUSA -->
                                <tr v-else-if="item.type === 'footer'" class="bg-[#0c0c0c]">
                                    <td colspan="7" class="py-1.5 px-2 text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider border-b border-[#27272a] text-left">
                                        <div class="flex items-center justify-between">
                                            <span>FIM DA SESSÃO - {{ item.endTime }}</span>
                                            <span :class="item.totalProfit >= 0 ? 'text-green-500' : 'text-red-500'">
                                                RESULTADO: {{ item.totalProfit < 0 ? '-' : (item.totalProfit > 0 ? '+' : '') }}{{ preferredCurrencyPrefix }}{{ Math.abs(item.totalProfit).toFixed(2) }}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            </template>
						</tbody>

					</table>
				</div>
			</div>
		</div>
	</div>
    </Teleport>

	<!-- Stop Status Modal -->
	<Teleport to="body">
	<div v-if="showStopStatusModal" 
		class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300"
		@click.self="closeStopStatusModal"
	>
		<div role="dialog" 
			class="w-full max-w-md border border-[#27272a] bg-[#09090b] p-6 shadow-2xl rounded-xl relative flex flex-col scale-in-center animate-in zoom-in-95 duration-200"
		>
			<button class="absolute right-4 top-4 text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors" @click="closeStopStatusModal">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x h-5 w-5"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
			</button>

			<div class="flex flex-col items-center text-center gap-4">
				<div class="w-16 h-16 rounded-full flex items-center justify-center mb-2"
					:class="stopStatusData.type === 'profit' ? 'bg-green-500/20 text-green-500' : stopStatusData.type === 'blindado' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'"
				>
					<svg v-if="stopStatusData.type === 'profit'" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trophy"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17"></path><path d="M14 14.66V17"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
					<svg v-else-if="stopStatusData.type === 'blindado'" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-alert"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path><path d="M12 8v4"></path><path d="M12 16h.01"></path></svg>
					<svg v-else xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-octagon-x"><path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z"></path><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg>
				</div>

				<div>
					<h1 class="text-[20px] font-bold text-white mb-1">
						Agente Autônomo Zenix
					</h1>
					<p class="text-[14px] text-white/50">
						Agente de alta frequência em mercado futuro.
					</p>
				</div>

				<div class="w-full bg-[#1a1a1a] rounded-lg p-4 custom-border-card mt-2">
					<div class="flex justify-between items-center mb-2">
						<span class="text-xs text-[#A1A1AA] uppercase font-bold">Resultado da Sessão</span>
						<span class="text-xs text-[#A1A1AA]">{{ currentDate }}</span>
					</div>
					<div class="text-2xl font-bold tabular-nums" :class="(sessionStats?.netProfit || 0) >= 0 ? 'text-green-500' : 'text-red-500'">
						{{ (sessionStats?.netProfit || 0) < 0 ? '-' : ((sessionStats?.netProfit || 0) > 0 ? '+' : '') }}{{ preferredCurrencyPrefix }}{{ Math.abs(sessionStats?.netProfit || 0).toFixed(2) }}
					</div>
				</div>

				<button @click="closeStopStatusModal" class="w-full bg-[#FAFAFA] text-black hover:bg-[#e4e4e7] font-bold py-3 rounded-lg transition-colors text-sm mt-2">
					Entendi
				</button>
			</div>
		</div>
	</div>
	</Teleport>

	<!-- Novo Modal Unificado de Resumo da Sessão -->
	<SessionSummaryModal
		:visible="showSessionSummaryModal"
		:total-profit="sessionSummaryData.profit"
		:cycle="sessionSummaryData.cycle"
		:reason="sessionSummaryData.reason"
		:currency-symbol="preferredCurrencyPrefix"
		@close="handleCloseSessionSummary"
		@view-details="handleViewDetails"
	/>

    <!-- Stop Loss Modal -->
    <StopLossModal
        :visible="showStopLossModal"
        :result="sessionSummaryData.profit"
        :loss-limit="agenteData.stopValue"
        :currency="preferredCurrencyPrefix"
        @confirm="handleCloseStopLoss"
    />

    <!-- Stop Blindado Modal -->
    <StopBlindadoModal
        :visible="showBlindadoModal"
        :result="sessionSummaryData.profit"
        :protected-info="'50%'"
        :currency="preferredCurrencyPrefix"
        @confirm="handleCloseBlindado"
    />

    <!-- Target Profit Modal -->
    <TargetProfitModal
        :visible="showTargetProfitModal"
        :result="sessionSummaryData.profit"
        :final-profit="agenteData.goalValue"
        :currency="preferredCurrencyPrefix"
        @confirm="handleCloseTargetProfit"
    />

    <!-- Consecutive Loss Modal (Zeus) -->
    <ConsecutiveLossModal
        :visible="showConsecutiveLossModal"
        :result="sessionSummaryData.profit"
        :currency="preferredCurrencyPrefix"
        @confirm="handleCloseConsecutiveLoss"
    />
</template>

<script>
	import { createChart, ColorType } from 'lightweight-charts';
	import AutonomousAgentLogs from './AutonomousAgentLogs.vue';
	import accountBalanceMixin from '@/mixins/accountBalanceMixin';
	import { defineAsyncComponent } from 'vue';

	export default {
		name: 'AgenteAutonomoPanel',
		mixins: [accountBalanceMixin],
		components: {
			AutonomousAgentLogs,
            CycleCompletionModal: defineAsyncComponent(() => import('@/components/CycleCompletionModal.vue')),
			SessionSummaryModal: defineAsyncComponent(() => import('@/components/modals/SessionSummaryModal.vue')),
            StopLossModal: defineAsyncComponent(() => import('@/components/StopLossModal.vue')),
            ConsecutiveLossModal: defineAsyncComponent(() => import('@/components/ConsecutiveLossModal.vue')),
            StopBlindadoModal: defineAsyncComponent(() => import('@/components/StopBlindadoModal.vue')),
            TargetProfitModal: defineAsyncComponent(() => import('@/components/TargetProfitModal.vue')),
		},
		props: {
			agenteData: {
				type: Object,
				default: () => ({
					estrategia: 'IA SENTINEL',
					mercado: 'Volatility 100 Index',
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
					accountBalance: 0,
					sessionStatus: 'active',
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
                    session_status: 'active', // ✅ [ZENIX v2.6] Status da sessão para modais
				})
			},
			tradeHistory: {
				type: Array,
				default: () => []
			},
			userId: {
				type: String,
				default: null
			},
			shouldTeleport: {
				type: Boolean,
				default: false
			},
			showTitle: {
				type: Boolean,
				default: true
			},
			isMobile: {
				type: Boolean,
				default: false
			}
		},
		emits: ['pausarAgente'],
		data() {
			return {
				selectedDay: null,
				abaAtiva: 'grafico',
				showLogs: false,
				ultimaAtualizacao: new Date().toLocaleTimeString('pt-BR'),
				filtroDataSelecionado: 'hoje',
				showStopStatusModal: false,
				stopStatusData: {
					type: 'info', // profit, loss, blindado
					title: '',
					description: ''
				},
				lastProcessedStatus: null, // Evitar abrir modal repetidamente para o mesmo status
				showSessionSummaryModal: false,
                showStopLossModal: false,
                showConsecutiveLossModal: false,
                showBlindadoModal: false,
                showTargetProfitModal: false,
				sessionSummaryData: {
					profit: 0,
					cycle: 1,
					reason: 'STOP_LOSS'
				},
				// Mantendo controle de modal ativo global para evitar sobreposição
				// window.zenixStopModalActive -> Usado globalmente via window


				dataInicio: new Date().toISOString().split('T')[0],
				dataFim: new Date().toISOString().split('T')[0],
				periodoMobile: 'hoje',
				progressoMeta: {
					atual: 0,
					meta: 50,
					stop: 25,
				},
				// Dados para gráficos e logs
				indexChartData: [],
				priceHistoryInterval: null,
				pricePollingInterval: null,
				timeUpdateInterval: null,
				chartUpdateThrottle: null,
				priceTicks: [],
				
				// Chart.js instance
				chartInstance: null,
				
				localTradeHistory: [],
				realtimeLogs: [],
				lastLogTimestamp: null,
				logsPollingInterval: null,
				unidadeTimeframeSelecionada: 'minutos',
				valorTimeframeSelecionado: 1,
				tipoGraficoSelecionado: 'Velas',
				symbol: 'R_75',
				timeframeOptions: {
					minutos: [1, 2, 3, 5, 10, 15, 30],
					horas: [1, 2, 4, 8],
					Dias: [1, 2, 3, 4, 5, 6, 7],
				},
				tiposGrafico: ['Linha', 'Velas'],
				acoesAgente: [
					{ hora: '14:32:15', classe: 'success', titulo: 'Operação finalizada com sucesso', descricao: '14:32:15 - Lucro de $8.50' },
					{ hora: '14:32:00', classe: 'success', titulo: 'Entrada executada', descricao: '14:32:00 - CALL em Volatility 75' },
					{ hora: '14:31:45', classe: 'warning', titulo: 'Volume detectado', descricao: '14:31:45 - Confirmação de padrão' },
					{ hora: '14:30:00', classe: 'info', titulo: 'Aguardando padrão da estratégia', descricao: '14:30:00 - Análise em andamento' },
				],

				
				// Novas propriedades para o layout redesenhado
				showDatePicker: false,
				selectedPeriod: 'session',
				dateOptions: [
					{ label: 'Sessão', value: 'session' },
					{ label: 'Hoje', value: 'today' },
					{ label: 'Ontem', value: 'yesterday' },
					{ label: 'Últimos 7 dias', value: '7d' },
					{ label: 'Últimos 30 dias', value: '30d' },
					{ label: 'Semestre', value: '6m' },
					{ label: 'Ano', value: '1y' },
					{ label: 'Mês Atual', value: 'thisMonth' },
					{ label: 'Mês Passado', value: 'lastMonth' },
					{ label: 'Este Ano', value: 'thisYear' },
					{ label: 'Todo o Período', value: 'all' },
				],
				weeklyData: [],
                
				dailyData: [],
                dailyTrades: [],
                agentConfig: null,
                
				selectedPeriodFilter: null, // Novo estado para filtro
				selectedAgentFilter: 'all', // Novo filtro de agente
				selectedAggregation: 'week', // week, month, semester, year
				customDateRange: null, // { start: 'YYYY-MM-DD', end: 'YYYY-MM-DD' }

				// Agent Switcher
				showAgentSwitcher: false,
				runningAgents: [
					{ 
						id: 'zeus', 
						title: 'Agente Zeus',
						marketType: 'Digits',
						icons: ['/deriv_icons/TradeTypesDigitsOverIcon.svg', '/deriv_icons/TradeTypesDigitsUnderIcon.svg'],
                        video: '/Zeus_Lança_Raio_em_Vídeo.mp4',
						emoji: '⚡', 
						description: 'Análise: Estatística de Dígitos (Over 5)\nAssertividade: 65% a 80% Retorno: 19% a 126%',
						winRate: 72,
						style: 'Agressivo / Híbrido'
					},
					{ 
						id: 'falcon', 
						title: 'Agente Falcon',
						marketType: 'Digits',
						icons: ['/deriv_icons/TradeTypesDigitsEvenIcon.svg', '/deriv_icons/TradeTypesDigitsOddIcon.svg'],
                        video: '/Animação_de_Voo_Gerada.mp4',
						emoji: '🦅', 
						description: 'Análise: Estatística de Dígitos (Over 2)\nAssertividade: 91% a 95% Retorno: 65% a 86%',
						winRate: 62,
						style: 'Estatístico / Preciso'
					}
				],
				hideValues: false,
				pollingInterval: null,
                
                // Flags para evitar reabertura de modais já vistos na sessão
                stopLossAcknowledged: false,
                targetProfitAcknowledged: false,
                stopBlindadoAcknowledged: false,

                // Cycle Modal State
                showCycleCompletionModal: false,
                currentCycleNumber: 1,
                currentCycleProfit: 0,

                // ✅ Balance Loading State (like TopNavbar)
                isBalanceReady: false,
                renderedFinalCapital: 0,
                renderedInitialCapital: 0,
                lastProcessedCycle: null,
                zeusReturn: 3.93,
                falconReturn: 2.89,
                returnInterval: null,
                
                // ✅ [ZENIX v2.1] Buffering de valores para evitar blinks de NaN ou 0,00
                renderedPeriodProfit: 0,
                renderedPeriodProfitPercent: 0,
                renderedAvgDailyProfit: 0,
                renderedAvgDailyProfitPercent: 0,
                renderedDailyResultValue: 0,
                renderedOperacoesHoje: '--',
                lastProcessedLogId: null, // ✅ [ZENIX v2.2] Evitar re-processar logs já vistos
			};
		},
		mounted() {
            // Resetar flag global de modal no início
            window.zenixStopModalActive = false;

			window.addEventListener('click', this.closeDropdownsOnClickOutside);
			
            if (this.logs && this.logs.length > 0) {
                 this.checkLogsForStopEvents(this.logs);
            }
            
			if (this.abaAtiva === 'grafico') {
				this.$nextTick(() => {
					this.initIndexChart();
					// Buscar dados iniciais
					this.fetchAllStats();
					
					// ✅ [ZENIX v2.3] Polling de 3s removido para evitar pulos de dados e consumo excessivo.
                    // O sistema agora é 100% orientado a eventos e WebSockets vindos do pai.
				});
			}

			// Oscilação sutil do retorno
			this.startReturnOscillation();

			// ✅ Real-time Balance Polling (5 segundos) - Atualiza saldo da corretora em tempo real
			//  [ZENIX v2.3] Balance Polling removido (WS-driven)

			// ✅ Balance Loading State: Handled by mixin and isBalanceReady watcher
			// const delayTime = this.isFictitiousBalanceActive ? 200 : 300;
			// setTimeout(() => {
			// 	this.isBalanceReady = true;
			// 	this.tryUpdateRenderedCapitals();
			// }, delayTime);
		},
		beforeUnmount() {
			window.removeEventListener('click', this.closeDropdownsOnClickOutside);
			if (this.pollingInterval) {
				clearInterval(this.pollingInterval);
			}
			if (this.returnInterval) {
				clearInterval(this.returnInterval);
			}
			// ✅ Parar polling de saldo ao desmontar
			this.stopBalancePolling();
		},
		computed: {
			currentAgentId() {
				// Normalizar ID do agente se não vier explícito
				// Se agenteData.id existir, usa. Senão, tenta inferir da estratégia.
				if (this.agenteData && this.agenteData.id) return this.agenteData.id;
				const strategy = this.agenteData?.estrategia?.toLowerCase() || '';
				if (strategy.includes('zeus')) return 'zeus';
				if (strategy.includes('falcon')) return 'falcon';
                if (strategy.includes('atlas')) return 'atlas';
                if (strategy.includes('apollo')) return 'apollo';
                if (strategy.includes('nexus')) return 'nexus';
                if (strategy.includes('orion')) return 'orion';
                if (strategy.includes('titan')) return 'titan';
				return 'zeus'; // Fallback default
			},
			dateRangeText() {
				const option = this.dateOptions.find(o => o.value === this.selectedPeriod);
				if (option) return option.label;
				
				const today = new Date();
				const startDate = new Date(today);
				startDate.setDate(today.getDate() - 30);
				
				const formatDate = (date) => {
					const day = date.getDate();
					const month = date.toLocaleDateString('pt-BR', { month: 'short' });
					return `${day} ${month}`;
				};
				
				return `${formatDate(startDate)} - ${formatDate(today)} ${today.getFullYear()}`;
			},
			initialCapital() {
				// ✅ [ZENIX v2.4] Reverted to prioritize initialStake as per user request
				// Fallback to balance only if stake is missing (but user wants stake)
				return this.agentConfig?.initialStake || this.agentConfig?.initialCapital || this.agentConfig?.initialBalance || 0;
			},
			finalCapital() {
				// ✅ Always use current balance from mixin (same pattern as TopNavbar)
				// This ensures Capital Final matches the balance displayed in the header
				// FIX: Prioritize balanceNumeric (summed) over info.balance (raw)
				return this.balanceNumeric || this.currentBalance?.balance || this.info?.balance || 0;
			},
			realtimeStats() {
				// ✅ [ZENIX v2.3] Prioridade absoluta para sessionStats (vido do pai via WS)
				return {
					netProfit: this.sessionStats?.netProfit || 0,
					totalOps: this.sessionStats?.operationsToday || 0,
					avgProfit: (this.sessionStats?.totalTrades > 0) ? (this.sessionStats.netProfit / this.sessionStats.totalTrades) : 0
				};
			},
            dailyRealtimeStats() {
                return {
                    netProfit: this.sessionStats?.netProfit || 0,
                    totalOps: this.sessionStats?.operationsToday || 0
                };
            },
            dailyResultValue() {
                if (this.dailyRealtimeStats) return this.dailyRealtimeStats.netProfit;
                return this.sessionStats?.netProfit || 0;
            },
            dailyOpsValue() {
                if (this.dailyRealtimeStats) return this.dailyRealtimeStats.totalOps;
                return this.sessionStats?.operationsToday ?? this.agenteData?.operacoesHoje ?? 0;
            },
			periodProfit() {
				// ✅ [ZENIX v2.3] Prioridade absoluta para sessionStats (vido do pai via WS) para evitar flickering
                if (this.selectedPeriod === 'session' || this.selectedPeriod === 'today') {
                    const val = this.sessionStats?.netProfit;
                    return (val === undefined || val === null || isNaN(val)) ? 0 : val;
                }
				
				// Fallback para soma de dados históricos (filtros passados)
                if (!this.dailyData || this.dailyData.length === 0) return 0;
                const total = this.dailyData.reduce((sum, day) => {
                    const profit = day.profit;
                    return sum + (isNaN(profit) ? 0 : (profit || 0));
                }, 0);
                return isNaN(total) ? 0 : total;
            },
			periodProfitPercent() {
				const profit = this.periodProfit;
                const base = this.finalCapital;
                
                if (!base || base <= 0 || isNaN(profit) || isNaN(base)) return 0;
                const percent = (profit / base) * 100;
                return isNaN(percent) ? 0 : percent;
			},
			avgDailyProfitPercent() {
				const avgProfit = this.avgDailyProfit;
                const base = this.finalCapital;

                if (!base || base <= 0 || isNaN(avgProfit) || isNaN(base)) return 0;
                const percent = (avgProfit / base) * 100;
                return isNaN(percent) ? 0 : percent;
			},
			avgDailyProfit() {
				// Se for sessão, cálculo de média/dia baseado na duração da sessão
                if (this.selectedPeriod === 'session') {
                     // Use realtime stats for consistenc
                     if (this.realtimeStats) return this.realtimeStats.netProfit; // For session, avg/day is essentially the session profit as it is 1 day
                     
                     if (!this.agentConfig || !this.agentConfig.sessionDate) return this.periodProfit; 
                     const sessionStart = new Date(this.agentConfig.sessionDate);
                     const now = new Date();
                     const diffTime = Math.abs(now - sessionStart);
                     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
                     return this.periodProfit / diffDays;
                }
                
                // Para outros filtros, média simples dos dias retornados
				if (!this.dailyData || this.dailyData.length === 0) return 0;
				// periodProfit já é a soma
				return this.periodProfit / this.dailyData.length;
			},
	avgProfitPerOp() {
		// Calculate average profit per operation
        if (this.selectedPeriod === 'session' && this.realtimeStats) {
            return isNaN(this.realtimeStats.avgProfit) ? 0 : this.realtimeStats.avgProfit;
        }
		const totalOps = this.sessionStats?.totalTrades || 0;
		if (totalOps === 0) return 0;
        const profit = this.periodProfit;
        const avg = profit / totalOps;
		return isNaN(avg) ? 0 : avg;
	},
			bestDay() {
				if (!Array.isArray(this.dailyData) || this.dailyData.length === 0) {
					return { value: 0, date: '--' };
				}
				try {
					const best = this.dailyData.reduce((max, day) => {
						if (!day || !max) return max || day;
						return (day.profit ?? 0) > (max.profit ?? 0) ? day : max;
					}, this.dailyData[0]);
					
					if (!best) return { value: 0, date: '--' };
					return { value: best.profit ?? 0, date: best.date ?? '--' };
				} catch (e) {
					console.error('Error calculating bestDay:', e);
					return { value: 0, date: '--' };
				}
			},
			worstDay() {
				if (!Array.isArray(this.dailyData) || this.dailyData.length === 0) {
					return { value: 0, date: '--' };
				}
				try {
					const worst = this.dailyData.reduce((min, day) => {
						if (!day || !min) return min || day;
						return (day.profit ?? 0) < (min.profit ?? 0) ? day : min;
					}, this.dailyData[0]);

					if (!worst) return { value: 0, date: '--' };
					return { value: Math.abs(worst.profit ?? 0), date: worst.date ?? '--' };
				} catch (e) {
					console.error('Error calculating worstDay:', e);
					return { value: 0, date: '--' };
				}
			},
			// Métodos auxiliares legados mantidos para compatibilidade
			userIdComputed() { return this.getUserId(); },
			tempoAtivoDisplay() {
				if (this.tempoAtivo && this.tempoAtivo !== '0h 0m 0s') return this.tempoAtivo;
				if (this.agenteData && this.agenteData.tempoAtivo) return this.agenteData.tempoAtivo;
				return '0h 0m 0s';
			},
			operacoesHojeDisplay() {
				// ✅ [ZENIX v2.3] Consistência absoluta com sessionStats
				return this.sessionStats?.operationsToday ?? this.agenteData?.operacoesHoje ?? 0;
			},
			totalCapital() {
				// Só para compatibilidade interna se usado em outros lugares
				return this.sessionStats?.totalCapital || this.agenteData?.accountBalance || 0;
			},
			timeframeFinal() {
				const unidadeMap = { 'minutos': 'm', 'horas': 'h', 'Dias': 'D' };
				return `${this.valorTimeframeSelecionado}${unidadeMap[this.unidadeTimeframeSelecionada]}`;
			},
            formattedRiskProfile() {
                if (!this.agenteData || !this.agenteData.risco) return 'Normal';
                
                const rawRisk = String(this.agenteData.risco).toLowerCase();
                const riskMap = {
                    'conservative': 'Conservador',
                    'conservador': 'Conservador',
                    'balanced': 'Moderado',
                    'moderado': 'Moderado',
                    'equilibrado': 'Moderado',
                    'aggressive': 'Agressivo',
                    'agressivo': 'Agressivo',
                    'fixed': 'Fixo',
                    'fixo': 'Fixo',
                    'normal': 'Normal'
                };

                // Tentar match direto
                if (riskMap[rawRisk]) return riskMap[rawRisk];
                
                // Tentar match da primeira palavra (ex: "Conservador-Adaptativo" -> "conservador")
                const firstPart = rawRisk.split('-')[0].split(' ')[0].trim();
                if (riskMap[firstPart]) return riskMap[firstPart];

                // Fallback para exibir formatado (primeira letra maiúscula) se não estiver no mapa
                const fallback = this.agenteData.risco.split('-')[0].split(' ')[0].trim();
                return fallback.charAt(0).toUpperCase() + fallback.slice(1).toLowerCase();
            },
            riskColor() {
                const profile = this.formattedRiskProfile;
                const colors = {
                    'Agressivo': '#EF4444', // Vermelho (Tailwind red-500)
                    'Moderado': '#FBBF24',  // Amarelo (Tailwind amber-400)
                    'Conservador': '#15803D', // Verde mais escuro (Tailwind green-700)
                    'Fixo': '#22C55E',      // Verde (Requested)
                    'Normal': '#A1A1AA'     // Cinza fallback
                };
                return colors[profile] || '#FFFFFF';
            },

			historicoOperacoesFiltradas() {
				// Simplificado para evitar erro, usando dados mock ou tradeHistory
				return this.tradeHistory || [];
			},
			currentDate() {
				return new Date().toLocaleDateString('pt-BR');
			},
			activeDayDetails() {
				// Se não houver dia selecionado, retorna objeto vazio seguro
				if (!this.selectedDay) return {};
				
				// Verifica se o dia selecionado é Hoje
				const todayStr = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
				// selectedDay.date vem como "24/01" por exemplo
				
				if (this.selectedDay.date === todayStr) {
                    // Tentar encontrar dados atualizados H OJE em dailyData
                    const todayData = this.dailyData.find(d => {
                        // Verifica formato DD/MM
                        const dStr = new Date(d.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
                        return dStr === todayStr || d.date === todayStr; // Suporta YYYY-MM-DD se d.date for assim
                    });

                    if (todayData) {
                        return {
                            ...this.selectedDay,
                            ...todayData, // Sobrescreve com dados frescos do polling
                            // Recalcular campos derivados se necessário
                            activeProfit: todayData.profit, // Alias para garantir refresh
                        };
                    }

                    // Fallback para sessionStats se dailyData não tiver hoje (menos provável com polling)
					// Mas priorizar realtimeStats se existir
					const rt = this.dailyRealtimeStats;
					return {
						...this.selectedDay,
						profit: rt ? rt.netProfit : (this.sessionStats?.netProfit || 0),
                        ops: rt ? rt.totalOps : (this.sessionStats?.totalTrades || 0),
                        winRate: this.sessionStats?.winRate || 0,
                        capital: (this.agentConfig?.initialBalance || 0) + (rt ? rt.netProfit : (this.sessionStats?.netProfit || 0)),
					};
				}
				
				// Se não for hoje, retorna dados estáticos
				return this.selectedDay;
			},
			filteredDailyData() {
				// 1. Se houver um filtro de período selecionado na tabela (range customizado)
				if (this.selectedPeriodFilter) {
					try {
						const [startStr, endStr] = this.selectedPeriodFilter.split(' - ');
						const currentYear = new Date().getFullYear();
						const [startDay, startMonth] = startStr.trim().split('/');
						const [endDay, endMonth] = endStr.trim().split('/');
						const startDate = new Date(currentYear, parseInt(startMonth) - 1, parseInt(startDay));
						const endDate = new Date(currentYear, parseInt(endMonth) - 1, parseInt(endDay));
						endDate.setHours(23, 59, 59, 999);
						
						return this.dailyData.filter(day => {
							if (!day.fullDate) return true;
							const dayDate = new Date(day.fullDate + 'T12:00:00');
							return dayDate >= startDate && dayDate <= endDate;
						});
					} catch (e) {
						console.error('Erro ao filtrar datas (tabela):', e);
					}
				}

				// 2. Se não houver filtro de tabela, filtrar baseado no selectedPeriod (Dropdown de cima)
				if (!this.dailyData || this.dailyData.length === 0) return [];

				const now = new Date();
				const todayStr = now.toISOString().split('T')[0];
				
				switch (this.selectedPeriod) {
					case 'today':
						return this.dailyData.filter(d => d.fullDate === todayStr);
					
					case 'yesterday': {
						const yesterday = new Date(now);
						yesterday.setDate(now.getDate() - 1);
						const yesterdayStr = yesterday.toISOString().split('T')[0];
						return this.dailyData.filter(d => d.fullDate === yesterdayStr);
					}
					
					case '7d': {
						const weekAgo = new Date(now);
						weekAgo.setDate(now.getDate() - 7);
						return this.dailyData.filter(d => new Date(d.fullDate) >= weekAgo);
					}

					case '30d': {
						const monthAgo = new Date(now);
						monthAgo.setDate(now.getDate() - 30);
						return this.dailyData.filter(d => new Date(d.fullDate) >= monthAgo);
					}

					case 'session':
						// Para sessão, costumamos mostrar o dia de hoje na tabela/resumo
						return this.dailyData.filter(d => d.fullDate === todayStr);

					default:
						return this.dailyData;
				}
			},
			periodLabel() {
				if (this.selectedPeriodFilter) return 'Filtrado';
                // Retorna 'Semanal', 'Mensal' etc baseado na range geral se quiser, por padrão 'Semanal' baseada na tabela
				return 'Semanal';
			},
			formattedSessionItems() {
				// Decide source array based on selectedPeriod
				let sourceTrades = [];
				if (this.selectedPeriod === 'session') {
					// Prioritize the reactive tradeHistory prop for real-time updates
					sourceTrades = this.tradeHistory || [];
				} else {
					// Fallback to dailyTrades for historical views
					sourceTrades = this.dailyTrades || [];
				}

				if (!sourceTrades || sourceTrades.length === 0) return [];
				
				// 1. Normalize and Sort Trades
				const normalizedTrades = sourceTrades.map(trade => {
					// Handle potential snake_case from backend vs camelCase from frontend mapping
					const createdAt = trade.createdAt || trade.created_at || trade.time;
					const rawProfit = trade.profit !== undefined ? parseFloat(trade.profit) : (trade.profit_loss !== undefined ? parseFloat(trade.profit_loss) : (trade.result !== undefined ? parseFloat(trade.result) : 0));
					const profit = isNaN(rawProfit) ? 0 : rawProfit;
					
					const rawStake = trade.stake !== undefined ? parseFloat(trade.stake) : (trade.stake_amount !== undefined ? parseFloat(trade.stake_amount) : (trade.buy_price !== undefined ? parseFloat(trade.buy_price) : (trade.entry !== undefined ? parseFloat(trade.entry) : 0)));
					const stake = isNaN(rawStake) ? 0 : rawStake;

					const rawEntry = trade.entry !== undefined ? parseFloat(trade.entry) : (trade.entry_price !== undefined ? parseFloat(trade.entry_price) : (trade.entryPrice !== undefined ? parseFloat(trade.entryPrice) : 0));
					const entry = isNaN(rawEntry) ? 0 : rawEntry;

					const rawExit = trade.exit !== undefined ? parseFloat(trade.exit) : (trade.exit_price !== undefined ? parseFloat(trade.exit_price) : (trade.exitPrice !== undefined ? parseFloat(trade.exitPrice) : 0));
					const exit = isNaN(rawExit) ? 0 : rawExit;
					
					const market = trade.market || trade.symbol || trade.asset || 'Unknown';
					
					const contract = trade.contract || trade.contract_type || trade.contractType || trade.type || 'Unknown';

					// ✅ Get sessionId for grouping
					const sessionId = trade.sessionId || trade.session_id || null;

					return {
						id: trade.id || Math.random().toString(36).substr(2, 9),
						createdAt, // Date object or ISO string
						market,
						contract,
						entry: entry.toFixed(2),
						exit: exit.toFixed(2),
						stake: stake.toFixed(2),
						profit: profit.toFixed(2),
						sessionId,
						// Keep original for referencing if needed
						original: trade 
					};
				}).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Newest first

				// 2. Group trades into sessions (using sessionId)
				const sessions = [];
				let currentSessionTrades = [];
				
				if (normalizedTrades.length > 0) {
					currentSessionTrades.push(normalizedTrades[0]);
					
					for (let i = 1; i < normalizedTrades.length; i++) {
						const prevSessionId = normalizedTrades[i-1].sessionId;
						const currSessionId = normalizedTrades[i].sessionId;
						
						// Session boundary check: if sessionIds differ (and both exist)
						// Fallback: If sessionId is missing, use the 30 min gap only as secondary measure 
						// but primarily trust sessionId if available.
						let isNewSession = false;
						if (prevSessionId && currSessionId && prevSessionId !== currSessionId) {
							isNewSession = true;
						} else if (!prevSessionId || !currSessionId) {
							// Secondary check: 30 min gap if sessionId is missing (legacy compat)
							const prevTradeTime = new Date(normalizedTrades[i-1].createdAt).getTime();
							const currTradeTime = new Date(normalizedTrades[i].createdAt).getTime();
							const diffMinutes = (prevTradeTime - currTradeTime) / (1000 * 60);
							if (diffMinutes > 30) isNewSession = true;
						}
						
						if (isNewSession) {
							sessions.push(currentSessionTrades);
							currentSessionTrades = [];
						}
						currentSessionTrades.push(normalizedTrades[i]);
					}
					sessions.push(currentSessionTrades);
				}
				
				const items = [];
				
				sessions.forEach((sessionTrades, idx) => {
					const sessionNum = sessions.length - idx; // Session 1 is the oldest
					
					// Calculate session data
					const startTime = this.formatToSPTime(sessionTrades[sessionTrades.length - 1].createdAt);
					const endTime = this.formatToSPTime(sessionTrades[0].createdAt);
					const totalProfit = sessionTrades.reduce((acc, t) => acc + parseFloat(t.profit), 0);
					
					// 1. Footer: END (At TOP of block because trades are DESC)
					let footerText = `FIM DA SESSÃO - ${endTime}`;
					
					if (idx === 0 && this.agenteData.sessionStatus !== 'active' && this.agenteData.sessionStatus) {
						const statusMap = {
							'paused': 'AGENTE PAUSADO',
							'stopped_loss': 'STOP LOSS ATINGIDO',
							'stopped_profit': 'META ATINGIDA',
							'stopped_blindado': 'STOP BLINDADO ATINGIDO',
							'error': 'ERRO NO SISTEMA',
							'inactive': 'SESSÃO ENCERRADA'
						};
						const reason = statusMap[this.agenteData.sessionStatus] || (this.lastProcessedStatus ? statusMap[this.lastProcessedStatus] : null) || this.agenteData.sessionStatus.toUpperCase();
						footerText += ` (${reason})`;
					}

					items.push({
						type: 'footer',
						id: `footer-${idx}`,
						endTime: footerText,
						totalProfit: totalProfit
					});

					// 2. Trades (Newest first)
					sessionTrades.forEach(trade => {
						items.push({
							type: 'trade',
							id: trade.id,
							data: trade
						});
					});

					// 3. Header: START (At BOTTOM of block)
					items.push({
						type: 'header',
						id: `header-${idx}`,
						sessionNumber: sessionNum,
						startTime: startTime
					});
				});
				
				return items;
			},
		},
		watch: {
			'agenteData.accountBalance'() { this.$forceUpdate(); },
			selectedPeriod() {
				// Atualizar dados quando o filtro mudar
				this.fetchProfitEvolution();
                this.fetchDailyStats();
                this.syncRenderedValues();
			},
			'agenteData.sessionStatus'(newStatus) {
				// Apenas logar, o modal agora é controlado exclusivamente pelos LOGS (checkLogsForStopEvents)
				if (newStatus && newStatus !== 'active') {
					console.log('[AgenteAutonomo] Session Status Inativo detectado:', newStatus);
				}
			},
            realtimeLogs: {
                // ✅ [ZENIX v2.2] Removido 'deep: true' para performance (logs são substituídos, não mutados)
                handler(newLogs) {
                    if (newLogs && newLogs.length > 0) {
                        this.checkLogsForStopEvents(newLogs);
                    }
                }
            },
            finalCapital: {
                immediate: true,
                handler(newVal) {
                    if (newVal !== undefined && newVal !== null) {
                        // console.log('[AgenteAutonomoActive] 💰 finalCapital changed:', newVal);
                        // ✅ [ZENIX v2.2] REMOVIDO: this.$emit('live-balance-update', newVal);
                        // O emit era redundante e circular (causava múltiplos updates globais)
                        
                        // ✅ [ZENIX v2.1] Atualizar capital renderizado apenas quando o saldo estiver pronto
                        if (this.isBalanceReady && newVal >= 0) {
                            this.renderedFinalCapital = newVal;
                        } else if (!this.isBalanceReady) {
                            this.renderedFinalCapital = 0;
                        }
                    }
                }
            },
            // ✅ [ZENIX v2.2] Removido watcher redundante 'logs' (consolidado no realtimeLogs)
            // ✅ Watch for mixin's loading state completion
            isBalanceReady(newVal) {
                if (newVal) {
                    this.tryUpdateRenderedCapitals();
                }
            },
            // ✅ Balance Loading State Watcher for initialCapital
            initialCapital(newVal) {
                if (this.isBalanceReady && newVal >= 0) {
                    this.renderedInitialCapital = newVal;
                } else if (!this.isBalanceReady) {
                    this.renderedInitialCapital = 0;
                }
            },
            
            // ✅ [ZENIX v2.1] Watchers de Buffering: Manter valor antigo se o novo for inválido
            periodProfit(newVal) {
                if (newVal !== null && !isNaN(newVal)) {
                    this.renderedPeriodProfit = newVal;
                }
            },
            periodProfitPercent(newVal) {
                if (newVal !== null && !isNaN(newVal)) {
                    this.renderedPeriodProfitPercent = newVal;
                }
            },
            avgDailyProfit(newVal) {
                if (newVal !== null && !isNaN(newVal)) {
                    this.renderedAvgDailyProfit = newVal;
                }
            },
            avgDailyProfitPercent(newVal) {
                if (newVal !== null && !isNaN(newVal)) {
                    this.renderedAvgDailyProfitPercent = newVal;
                }
            },
            dailyResultValue(newVal) {
                if (newVal !== null && !isNaN(newVal)) {
                    this.renderedDailyResultValue = newVal;
                }
            },
            operacoesHojeDisplay(newVal) {
                if (newVal && newVal !== '--' && newVal !== '0 ops') {
                    this.renderedOperacoesHoje = newVal;
                } else if (newVal === '0 ops' && (this.renderedOperacoesHoje === '--' || this.selectedPeriod === 'session')) {
                    // Permitir 0 ops se for o estado inicial ou estiver na sessão (que reseta)
                    this.renderedOperacoesHoje = newVal;
                }
            },
            // ✅ [ZENIX v2.5] Monitorar status da sessão para triggers de modal
            'sessionStats.session_status': function(newStatus) {
                if (newStatus === 'stopped_consecutive_loss') {
					console.log('[AgenteAutonomo] 🛑 STOP POR PERDAS CONSECUTIVAS DETECTADO! Abrindo modal...');
                    this.showConsecutiveLossModal = true;
                    this.stopLossAcknowledged = true; // Evitar abrir outros modais
                }
            },
		},

		methods: {
			// ✅ Balance Loading State Method
			tryUpdateRenderedCapitals() {
				if (this.isBalanceReady) {
					this.renderedFinalCapital = this.finalCapital;
					this.renderedInitialCapital = this.initialCapital;
                    this.syncRenderedValues();
				}
			},
            syncRenderedValues() {
                // Sincronização inicial ou pós-filtro
                this.renderedPeriodProfit = this.periodProfit || 0;
                this.renderedPeriodProfitPercent = this.periodProfitPercent || 0;
                this.renderedAvgDailyProfit = this.avgDailyProfit || 0;
                this.renderedAvgDailyProfitPercent = this.avgDailyProfitPercent || 0;
                this.renderedDailyResultValue = this.dailyResultValue || 0;
                this.renderedOperacoesHoje = this.operacoesHojeDisplay || '--';
            },
			checkStopStatus(status) {
				if (!status || status === 'active' || status === this.lastProcessedStatus) return;
				
				// O modal agora é controlado exclusivamente pelos LOGS para evitar re-trigger redundante.
				// Este método agora apenas registra que o status mudou para controle de botões se necessário.
				if (['stopped_profit', 'stopped_loss', 'stopped_blindado'].includes(status)) {
					this.lastProcessedStatus = status;
					console.log('[AgenteAutonomo] Mudança de status bloqueada para trigger de modal (usando logs):', status);
				}
			},
			closeStopStatusModal() {
				this.showStopStatusModal = false;
				// Não resetar lastProcessedStatus para não abrir de novo na mesma sessão enquanto não mudar
			},
			formatAgentDescription(description) {
				if (!description) return '';
				// Destacar palavras-chave em branco e negrito
				return description
					.replace(/Análise:/g, '<span style="color: white; font-weight: bold;">Análise:</span>')
					.replace(/Precisão:/g, '<span style="color: white; font-weight: bold;">Precisão:</span>')
					.replace(/Retorno:/g, '<span style="color: white; font-weight: bold;">Retorno:</span>');
			},
            formatPrice(value) {
                if (value === null || value === undefined || isNaN(value)) return '0,00';
                return Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            },
			getUserId() {
				return this.userId || localStorage.getItem('userId') || localStorage.getItem('user_id');
			},
            formatToSPTime(ts) {
                if (!ts) return '--:--:--';
                try {
                    // Se já for apenas horário HH:mm:ss, tentar devolver como está ou processar se tiver data
                    // Mas assumindo que o backend mande ISO ou Timestamp completo em 'time' ou 'created_at'
                    // Se 'ts' for apenas horário, new Date() falha ou pega data atual.
                    // Verificamos se parece data completa
                    if (String(ts).includes('T') || String(ts).includes('-') || typeof ts === 'number') {
                        const d = new Date(ts);
                        return d.toLocaleTimeString('pt-BR', { 
                            hour12: false,
                            timeZone: 'America/Sao_Paulo'
                        });
                    }
                    return ts; // Retorna original se não for parseável como data completa
                } catch (e) {
                    return ts;
                }
            },
			pausarAgenteEIrParaTopo() {
				this.$emit('pausarAgente');
				window.scrollTo({ top: 0, behavior: 'smooth' });
			},
			
			// Métodos do Gráfico
			selectPeriodFilter(row) {
				if (this.selectedPeriodFilter === row.period) {
					this.clearPeriodFilter();
					return;
				}
				this.selectedPeriodFilter = row.period;
                
                // Definir range de datas customizado a partir da linha clicada
                if (row.startDate && row.endDate) {
                    this.customDateRange = { start: row.startDate, end: row.endDate };
                    this.selectedPeriod = 'custom';
                    
                    // Buscar detalhes para este período
                    this.fetchDailyStats();
                    this.fetchProfitEvolution();
                }
			},
			clearPeriodFilter() {
				this.selectedPeriodFilter = null;
                this.customDateRange = null;
                this.selectedPeriod = 'session'; 
                
                this.fetchDailyStats();
                this.fetchProfitEvolution();
			},
            selectAggregation(type) {
                this.selectedAggregation = type;
                this.selectedPeriodFilter = null; 
                this.customDateRange = null; 
                this.fetchSummaryStats();
            },
			initIndexChart() {
                console.log('[AgenteAutonomo] initIndexChart iniciado');
				if (!this.$refs.performanceChartContainer) {
                    console.warn('[AgenteAutonomo] performanceChartContainer não encontrado, tentativa de recuperar...');
                    // Se não encontrar, tentar novamente no nextTick
                    this.$nextTick(() => {
                        if (this.$refs.performanceChartContainer) {
                            this.initIndexChart();
                        }
                    });
                    return;
                }

                // Se já existe chart, remover
                if (this.indexChart) {
                    try {
                        this.indexChart.remove();
                    } catch (e) { console.error('Error removing chart', e); }
                    this.indexChart = null;
                }

				// Limpar container 
				this.$refs.performanceChartContainer.innerHTML = '';

				this.indexChart = createChart(this.$refs.performanceChartContainer, {
					layout: {
						background: { type: ColorType.Solid, color: 'transparent' },
						textColor: '#A0A0A0',
					},
					grid: {
						vertLines: { visible: false },
						horzLines: { color: 'rgba(42, 46, 57, 0.2)' },
					},
					localization: {
						priceFormatter: price => '$' + price.toFixed(2),
					},
					leftPriceScale: {
						visible: true,
						borderColor: 'rgba(197, 203, 206, 0.2)',
					},
					rightPriceScale: {
						visible: false,
					},
					width: this.$refs.performanceChartContainer.clientWidth,
					height: 300,
					timeScale: {
						borderColor: 'rgba(197, 203, 206, 0.2)',
						timeVisible: true,
					},
				});

                console.log('[AgenteAutonomo] Gráfico criado com sucesso');

				this.indexChartSeries = this.indexChart.addAreaSeries({
					lineColor: '#22C55E', // Cor da linha superior (Verde Zenix)
					topColor: 'rgba(34, 197, 94, 0.4)', // Cor do preenchimento no topo
					bottomColor: 'rgba(34, 197, 94, 0.0)', // Degradê para transparente no fundo
					lineWidth: 2,
				});

				this.indexChartInitialized = true;

				// Responsividade
				const resizeObserver = new ResizeObserver(entries => {
					if (entries.length === 0 || !entries[0].target) return;
					if (this.indexChart) {
						this.indexChart.resize(entries[0].contentRect.width, 300);
                        this.indexChart.timeScale().fitContent();
					}
				});
				resizeObserver.observe(this.$refs.performanceChartContainer);
			},


			
			// ... (existing methods)

			updateIndexChart(data) {
                console.log('[AgenteAutonomo] updateIndexChart chamado com', data ? data.length : 0, 'pontos');
				if (this.indexChartSeries && data) {
					this.indexChartSeries.setData(data);
                    if(data.length > 0) {
                        this.indexChart.timeScale().fitContent();
                    }
				}
			},

            async openDayDetails(day) {
                console.log('[AgenteAutonomo] openDayDetails:', day);
				this.selectedDay = day;
                
                // Garantir que temos a configuração do agente para calcular metas
                if (!this.agentConfig) {
                    await this.fetchAgentConfig();
                }
                
                await this.fetchDailyDetails(day);
			},

            async fetchDailyDetails(day) {
                const userId = this.getUserId();
                if (!userId || !day) return;
                
                
                try {
                    // Use fullDate if available (YYYY-MM-DD), otherwise fallback (might fail if not standard)
                    const dateQuery = day.fullDate || 'today';
                    console.log('[AgenteAutonomo] Buscando daily-trades para:', dateQuery);
                    
					const apiBase = process.env.VUE_APP_API_BASE_URL || "https://iazenix.com/api";
                    const agentFilter = this.selectedAgentFilter !== 'all' ? `&agent=${this.selectedAgentFilter}` : '';
                    // Backend uses param date, updated in previous steps
                    const url = `${apiBase}/autonomous-agent/daily-trades/${userId}?date=${dateQuery}${agentFilter}`;
                    const options = {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					};
                    console.log('[AgenteAutonomo] Sending GET request to:', url);
                    console.log('[AgenteAutonomo] Request Options:', options);

					const response = await fetch(url, options);

                    console.log('[AgenteAutonomo] Daily Details Response Status:', response.status);

					if (response.ok) {
						const result = await response.json();
                        console.log('[AgenteAutonomo] daily-trades resultado:', result);
						if (result.success) {
                            this.dailyTrades = result.data;
                            
                            // Calcular se a meta foi atingida e quando
                            const target = this.agentConfig?.dailyProfitTarget || 0;
                            let cumulativeProfit = 0;
                            let activationTime = null;

                            // Ordenar do mais antigo para o mais novo para calcular acumulado corretamente
                            const sortedTrades = [...result.data].sort((a, b) => 
                                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                            );

                            for (const trade of sortedTrades) {
                                cumulativeProfit += trade.profit;
                                if (target > 0 && cumulativeProfit >= target && !activationTime) {
                                    activationTime = this.formatToSPTime(trade.createdAt);
                                }
                            }

                            // Recalcular avgTime para ser consistente com os trades exibidos no modal
                            let avgTime = '--';
                            if (sortedTrades.length > 1) {
                                const first = new Date(sortedTrades[0].createdAt).getTime();
                                const last = new Date(sortedTrades[sortedTrades.length - 1].createdAt).getTime();
                                const diffMs = last - first;
                                const diffMin = Math.round(diffMs / (60000 * (sortedTrades.length - 1)));
                                avgTime = diffMin >= 60 ? `${Math.floor(diffMin / 60)}h ${diffMin % 60}m` : `${diffMin}min`;
                            } else if (sortedTrades.length === 1) {
                                avgTime = '0min';
                            }

                            this.selectedDay = {
                                ...this.selectedDay,
                                avgTime: avgTime,
                                isMetaAtingida: target > 0 && cumulativeProfit >= target,
                                activationTime: activationTime,
                                metaStatus: (target > 0 && cumulativeProfit >= target) ? 'Atingida' : (day.fullDate === new Date().toISOString().split('T')[0] ? 'Pendente' : 'Não atingida')
                            };
                        }
                    } else {
                        console.error('[AgenteAutonomo] Erro na resposta de daily-trades:', response.status);
                    }
				} catch(error) {
					console.error("[AgenteAutonomo] Erro ao buscar detalhes diários:", error);
				}
			},
            async fetchDailyStats() {
				const userId = this.getUserId();
				console.log('[AgenteAutonomo] fetchDailyStats chamado para user:', userId);
				if (!userId) return;

				try {
					const apiBase = process.env.VUE_APP_API_BASE_URL || "https://iazenix.com/api";
                    const agentFilter = this.selectedAgentFilter !== 'all' ? `&agent=${this.selectedAgentFilter}` : '';
                    let dateRangeParams = '';
                    
                    // Determine days based on selectedPeriod (similar to fetchProfitEvolution)
                    let days = 30; // Default
                    if (this.selectedPeriod === '7d') days = 7;
                    if (this.selectedPeriod === 'today') days = 1;
                    if (this.selectedPeriod === 'yesterday') days = 2; // Logic handled by backend potentially or just fetch last 2 days
                    if (this.selectedPeriod === '30d') days = 30;
                    if (this.selectedPeriod === '6m') days = 180;
                    if (this.selectedPeriod === '1y') days = 365;
                    if (this.selectedPeriod === 'thisMonth') days = new Date().getDate(); 
                    if (this.selectedPeriod === 'all') days = 3650;
                    if (this.selectedPeriod === 'session') days = 7; // Fallback for table if in session mode, show recent history

                    if (this.selectedPeriod === 'custom' && this.customDateRange) {
                         dateRangeParams = `&startDate=${this.customDateRange.start}&endDate=${this.customDateRange.end}`;
                    }

					console.log('[AgenteAutonomo] Buscando stats diários em:', `${apiBase}/autonomous-agent/daily-stats/${userId}?days=${days}${agentFilter}${dateRangeParams}`);
					const url = `${apiBase}/autonomous-agent/daily-stats/${userId}?days=${days}${agentFilter}${dateRangeParams}`;
					const options = {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					};
					console.log('[AgenteAutonomo] Sending GET request to:', url);
					console.log('[AgenteAutonomo] Request Options:', options);
					
					const response = await fetch(url, options);

					console.log('[AgenteAutonomo] Daily Stats Response Status:', response.status);

					if (response.ok) {
						const result = await response.json();
						console.log('[AgenteAutonomo] daily-stats resultado:', result);
						if (result.success) {
							this.dailyData = result.data.map(day => ({
								...day,
								// Ensure fullDate is present for querying details
                                fullDate: day.fullDate || day.date, // Backend might send fullDate, otherwise use date (if it is YYYY-MM-DD)
								// Recalcula badges no front se necessário, ou usa o que vem do back
								badge: day.badge || '' 
							}));
							
							// Calcular badges de Melhor/Pior dia
							if (this.dailyData.length > 0) {
								let best = this.dailyData[0];
								let worst = this.dailyData[0];
								
								this.dailyData.forEach(day => {
									if (day.profit > best.profit) best = day;
									if (day.profit < worst.profit) worst = day;
								});
								
								if (best.profit > 0) best.badge = 'Melhor';
								if (worst.profit < 0) worst.badge = 'Pior';
							}
                            console.log('[AgenteAutonomo] dailyData atualizado:', this.dailyData);
						}
					} else {
                        console.error('[AgenteAutonomo] Erro na resposta de daily-stats:', response.status, response.statusText);
                    }
				} catch (error) {
					console.error("[AgenteAutonomo] Erro ao buscar estatísticas diárias:", error);
				}
			},

			async fetchAgentConfig() {
				const userId = this.getUserId();
				console.log('[AgenteAutonomo] fetchAgentConfig chamado para user:', userId);
				if (!userId) return;

				try {
					const apiBase = process.env.VUE_APP_API_BASE_URL || "https://iazenix.com/api";
					const url = `${apiBase}/autonomous-agent/config/${userId}`;
					console.log('[AgenteAutonomo] Buscando config do agente em:', url);
					
					const response = await fetch(url, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					});

					console.log('[AgenteAutonomo] Agent Config Response Status:', response.status);

					if (response.ok) {
						const result = await response.json();
						console.log('[AgenteAutonomo] agent-config resultado:', result);
						if (result.success && result.data) {
							this.agentConfig = result.data;
							console.log('[AgenteAutonomo] ✅ Agent config carregado:', {
								initialBalance: this.agentConfig.initialBalance,
								isActive: this.agentConfig.isActive,
								sessionDate: this.agentConfig.sessionDate
							});
						}
					} else {
						console.error('[AgenteAutonomo] Erro na resposta de agent-config:', response.status);
					}
				} catch (error) {
					console.error("[AgenteAutonomo] Erro ao buscar config do agente:", error);
				}
			},

			async fetchSummaryStats() {
				const userId = this.getUserId();
				console.log('[AgenteAutonomo] fetchSummaryStats chamado para user:', userId);
				if (!userId) return;

				try {
					const apiBase = process.env.VUE_APP_API_BASE_URL || "https://iazenix.com/api";
                    const agentFilter = this.selectedAgentFilter !== 'all' ? `&agent=${this.selectedAgentFilter}` : '';
                    const groupFilter = `&groupBy=${this.selectedAggregation}`;
					const url = `${apiBase}/autonomous-agent/summary-stats/${userId}?v=${Date.now()}${agentFilter}${groupFilter}`; 
					console.log('[AgenteAutonomo] Buscando stats sumarizados em:', url);
					
					const response = await fetch(url, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					});

					if (response.ok) {
						const result = await response.json();
                        // console.log('[AgenteAutonomo] summary-stats resultado:', result);
						if (result.success && result.data) {
							this.weeklyData = result.data; // Reusing weeklyData variable for summary table
						}
					} else {
						console.error('[AgenteAutonomo] Erro na resposta de summary-stats:', response.status);
					}
				} catch (error) {
					console.error("[AgenteAutonomo] Erro ao buscar stats sumarizados:", error);
				}
			},

            async fetchProfitEvolution() {
				const userId = this.getUserId();
                console.log('[AgenteAutonomo] fetchProfitEvolution chamado para user:', userId);
				if (!userId) return;

				// Determinar dias baseado no filtro selecionado
				let days = 30;
                let url = '';
				if (this.selectedPeriod === '7d') days = 7;
				if (this.selectedPeriod === 'today') days = 1;
				if (this.selectedPeriod === 'yesterday') days = 2;
				if (this.selectedPeriod === '30d') days = 30; // Garante 30 dias explicitamente
				if (this.selectedPeriod === '6m') days = 180;
				if (this.selectedPeriod === '1y') days = 365;
				if (this.selectedPeriod === 'thisMonth') days = new Date().getDate();
				if (this.selectedPeriod === 'lastMonth') days = 60; // Approximate fallback
				if (this.selectedPeriod === 'thisYear') {
					const now = new Date();
					const startOfYear = new Date(now.getFullYear(), 0, 1);
					const diff = now - startOfYear;
					days = Math.ceil(diff / (1000 * 60 * 60 * 24));
				}
				if (this.selectedPeriod === 'all') days = 3650; // 10 years as "all time"

				try {
					const apiBase = process.env.VUE_APP_API_BASE_URL || "https://iazenix.com/api";
                    const agentFilter = this.selectedAgentFilter !== 'all' ? `&agent=${this.selectedAgentFilter}` : '';
                    
                    if (this.selectedPeriod === 'session') {
                        // Sempre agrupado por dia, até na sessão
                        url = `${apiBase}/autonomous-agent/profit-evolution/${userId}?days=1${agentFilter}&aggregateBy=day`;
                    } else if (this.selectedPeriod === 'custom' && this.customDateRange) {
                         url = `${apiBase}/autonomous-agent/profit-evolution/${userId}?startDate=${this.customDateRange.start}&endDate=${this.customDateRange.end}${agentFilter}&aggregateBy=day`;
                    } else {
                        url = `${apiBase}/autonomous-agent/profit-evolution/${userId}?days=${days}${agentFilter}&aggregateBy=day`;
                    }
                    
                    console.log('[AgenteAutonomo] Buscando evolução em:', url);
					const options = {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					};
                    console.log('[AgenteAutonomo] Sending GET request to:', url);
					console.log('[AgenteAutonomo] Request Options:', options);

					const response = await fetch(url, options);

					console.log('[AgenteAutonomo] Profit Evolution Response Status:', response.status);

					if (response.ok) {
						const result = await response.json();
                        console.log('[AgenteAutonomo] profit-evolution resultado:', result);

						if (result.success && result.data) {
							this.updateIndexChart(result.data);
						}
					} else {
                        console.error('[AgenteAutonomo] Erro na resposta de profit-evolution:', response.status, response.statusText);
                    }
				} catch (error) {
					console.error("[AgenteAutonomo] Erro ao buscar evolução do lucro:", error);
				}
			},
			toggleDatePicker() {
				this.showDatePicker = !this.showDatePicker;
				if (this.showDatePicker) this.showAgentSwitcher = false;
			},
			closeDropdownsOnClickOutside(event) {
				if (this.showDatePicker && !event.target.closest('.relative.z-\\[40\\]')) {
					this.showDatePicker = false;
				}
				if (this.showAgentSwitcher && !event.target.closest('.agent-switcher-container')) {
					this.showAgentSwitcher = false;
				}
			},
			selectDateRange(option) {
				this.selectedPeriod = option.value;
				this.showDatePicker = false;
			},
			toggleAgentSwitcher() {
				this.showAgentSwitcher = !this.showAgentSwitcher;
				if (this.showAgentSwitcher) this.showDatePicker = false;
			},
			selectAgent(agentId) {
				console.log('Switching to agent:', agentId);
				this.selectedAgentFilter = agentId;
				this.showAgentSwitcher = false;
				
				// Se for um agente específico (não 'all'), emitir evento para o pai ativar
				if (agentId !== 'all') {
					this.$emit('change-agent', agentId);
                    // Pausar IA e ir para o topo ao trocar de agente como solicitado
                    this.pausarAgenteEIrParaTopo();
				}
				
				// Recarregar todos os dados com o novo filtro
				this.fetchAllStats();
			},
			goToConfiguration() {
				// Navigate to configuration page
				this.$router.push('/agente-autonomo');
				this.showAgentSwitcher = false;
			},
            
            /**
             * ✅ Verifica os logs recentes para detectar mensagens de stop
             * Garante que o modal seja mostrado mesmo se o sessionStatus do polling demorar
             */
            /**
     * ✅ Verifica os logs recentes para detectar mensagens de stop
     * Garante que o modal seja mostrado mesmo se o sessionStatus do polling demorar
     */
    checkLogsForStopEvents(logs) {
        if (!logs || logs.length === 0) return;
        
        // ✅ [ZENIX v2.2] Performance: Evitar re-processar se o log mais recente for o mesmo
        const latestLog = logs[0];
        const latestId = latestLog.id || latestLog.timestamp + latestLog.message;
        if (this.lastProcessedLogId === latestId) return;
        this.lastProcessedLogId = latestId;

        // Se já estiver mostrando modal ou já tiver reconhecido, ignora
        if (this.showSessionSummaryModal || window.zenixStopModalActive) return;

        // ✅ [ZENIX v2.2] Performance: Analisar apenas os últimos 20 logs (os mais recentes tem prioridade)
        const recentLogs = logs.slice(0, 20);
        let stopDetected = false;
        let stopReason = '';
        let stopCycle = 1;
        let stopProfit = this.sessionStats?.netProfit || 0; // Fallback

        // ✅ Helper: Encontrar o ciclo mais recente nos logs (Contexto)
        const findRecentCycle = (logsList) => {
            // Procura nos últimos 15 logs por menção de ciclo
            for (const log of logsList) {
                const match = log.message && log.message.match(/(?:cycle=|ciclo\s)(\d+)/i);
                if (match) return parseInt(match[1]);
            }
            return 1;
        };

        // ✅ Helper: Tentar extrair lucro do log de resultado ou stop
        const findRecentProfit = (logsList) => {
            // Tenta achar nos últimos 10 logs
            const subset = logsList.slice(0, 10);
            for (const log of subset) {
                const text = log.message || '';
                const moneyRegex = /(?:Lucro\/Prejuízo|Profit|Loss|Drawdown|Resultado).*?(?:\$|R\$)\s*([+-]?\d+(?:\.\d{2})?)/i;
                const match = text.match(moneyRegex);
                if (match) {
                     const val = parseFloat(match[1]);
                     if (!isNaN(val)) return val;
                }
            }
            return null; // Retorna null para usar o fallback do sessionStats
        };

        // 0. SAFEGUARD: Ignorar Drawdown de Ciclo se não houver "Sessão Finalizada" (Pausa Técnica)
        // Mas se tiver "Stop Loss" ou "Encerrando Sessão" explícito, DEIXA PASSAR.
        const drawdownLog = recentLogs.find(l => l.message && l.message.toUpperCase().includes('DRAWDOWN MÁXIMO DO CICLO'));
        const sessionEndLog = recentLogs.find(l => l.message && (
            l.message.toUpperCase().includes('SESSÃO FINALIZADA') || 
            l.message.toUpperCase().includes('ENCERRANDO SESSÃO')
        ));
        const stopLossLogGlobal = recentLogs.find(l => l.message && l.message.toUpperCase().includes('STOP LOSS'));

        if (drawdownLog && !sessionEndLog && !stopLossLogGlobal) {
            const currentCycle = findRecentCycle(recentLogs);
            if (currentCycle < 4) {
                // É apenas uma pausa de ciclo (1, 2 ou 3). Não mostrar modal de stop.
                stopDetected = false;
                return; 
            }
        }

        // 1. STOP BLINDADO
        const blindadoLog = recentLogs.find(log => 
            log.message && (
                log.message.toUpperCase().includes('STOP BLINDADO ATINGIDO') || 
                log.message.toUpperCase().includes('BLINDADO ATINGIDO')
            )
        );
        
        if (blindadoLog) {
            stopDetected = true;
            stopReason = 'BLINDADO';
            stopCycle = findRecentCycle(recentLogs);
        }
        
        // 2. STOP LOSS NORMAL / DRAWDOWN GLOBAL
        // Apenas considera stop final se tiver 'Stop Loss Atingido' (global) ou se o Drawdown vier junto com 'Sessão Finalizada'
        if (!stopDetected) {
            const stopLossLog = recentLogs.find(log => 
                log.message && (
                    (log.message.toUpperCase().includes('STOP LOSS ATINGIDO') || log.message.toUpperCase().includes('STOP LOSS REACHED')) &&
                    !log.message.toUpperCase().includes('CONFIGURAÇÃO INICIAL')
                )
            );

            if (stopLossLog) {
                // ✅ Check if it is a Consecutive Loss specifically
                const isConsecutive = recentLogs.find(l => l.message && l.message.toUpperCase().includes('PERDAS CONSECUTIVAS'));
                
                if (isConsecutive) {
                    stopDetected = true;
                    stopReason = 'CONSECUTIVE_LOSS';
                } else {
                    stopDetected = true;
                    stopReason = 'STOP_LOSS';
                }
                stopCycle = findRecentCycle(recentLogs);
            }
        }

        // 3. META DE LUCRO / SESSÃO FINALIZADA / CICLOS CONCLUÍDOS
        if (!stopDetected) {
             const sessionEndLog = recentLogs.find(log => 
                log.message && (
                    log.message.toUpperCase().includes('META DE LUCRO ATINGIDA') ||
                    log.message.toUpperCase().includes('META ATINGIDA') ||
                    log.message.toUpperCase().includes('LUCRO ATINGIDO') ||
                    log.message.toUpperCase().includes('SESSÃO FINALIZADA') ||
                    log.message.toUpperCase().includes('CICLOS CONCLUIDOS') ||
                    log.message.toUpperCase().includes('TODOS CICLOS')
                )
            );

            if (sessionEndLog) {
                stopDetected = true;
                stopCycle = findRecentCycle(recentLogs);
                
                // ✅ V4 Fix: Refinar a causa real da finalização
                const extractedProfit = findRecentProfit(recentLogs);
                const currentProfit = extractedProfit !== null ? extractedProfit : (this.sessionStats?.netProfit || 0);
                const isLoss = currentProfit < 0;
                
                // Se houver log de drawdown RECENTE ou se o lucro for negativo, a causa foi falha no ciclo
                const drawdownLogRec = recentLogs.find(l => l.message && l.message.toUpperCase().includes('DRAWDOWN MÁXIMO DO CICLO'));
                
                if (isLoss || drawdownLogRec) {
                    stopReason = 'CYCLE_STOP';
                } else {
                    stopReason = 'TARGET';
                }
            }
        }

        // Tentar refinar o lucro se detectou stop
        if (stopDetected) {
            const extractedProfit = findRecentProfit(recentLogs);
            if (extractedProfit !== null) {
                stopProfit = extractedProfit;
            }
        }

        // Disparar Modal Unificado
        if (stopDetected) {
             if (!this.sessionSummaryAcknowledged) {
                window.zenixStopModalActive = true;
                console.log(`[AgenteAutonomo] 🛑 [Logs] Stop Detected: ${stopReason} | Cycle: ${stopCycle} | Profit: ${stopProfit}`);
                
                this.sessionSummaryData = {
                    profit: stopProfit,
                    cycle: stopCycle,
                    reason: stopReason
                };

                // Route to specific modal
                if (stopReason === 'CYCLE_STOP') {
                     // Caso especial: Drawdown do Ciclo Final -> Modal de Ciclo (Fim de Sessão)
                     this.currentCycleNumber = stopCycle;
                     // Mapear profit para o prop 'result' do modal via currentCycleProfit?
                     // O modal usa :result="currentCycleNumber >= 4 ? (sessionStats?.netProfit || 0) : currentCycleProfit"
                     // Então precisamos garantir que sessionStats esteja atualizado ou manipular o prop.
                     // Mas 'result' é local no modal? Não, é prop.
                     // Vamos setar currentCycleProfit = stopProfit para garantir.
                     this.currentCycleProfit = stopProfit;
                     this.showCycleCompletionModal = true;
                } else if (stopReason === 'STOP_LOSS') {
                     this.showStopLossModal = true;
                } else if (stopReason === 'CONSECUTIVE_LOSS') {
                     this.showConsecutiveLossModal = true;
                } else if (stopReason === 'BLINDADO') {
                     this.showBlindadoModal = true;
                } else if (stopReason === 'TARGET' || stopReason === 'META') {
                     this.showTargetProfitModal = true;
                } else {
                     this.showSessionSummaryModal = true; // Fallback
                }
             }
        }

        // 4. CICLO CONCLUÍDO (Lógica Existente)
        // ... (Manter lógica de ciclo se necessário, mas o modal de resumo deve ter prioridade no stop)
        // Se parou, não mostra modal de ciclo parcial, mostra o resumo final.
        // Mas se completou um ciclo e CONTINUA (não parou), aí mostra o modal de ciclo.
        if (!stopDetected) {
                    const cycleLog = recentLogs.find(log => 
                        log.message && log.message.toUpperCase().includes('CICLO') && log.message.toUpperCase().includes('CONCLUÍDO')
                    );

                    if (cycleLog) {
                        let match = cycleLog.message.match(/CICLO (\d+)\/(\d+) CONCLUÍDO/i);
                        let cycleNum = '1';
                        let totalCycles = '4'; 

                        if (match) {
                            cycleNum = match[1];
                            totalCycles = match[2];
                        } else {
                            match = cycleLog.message.match(/CICLO (\d+) CONCLUÍDO/i);
                            if (match) cycleNum = match[1];
                        }

                        const profitMatch = cycleLog.message.match(/LUCRO: \$?(\d+(\.\d+)?)/i);
                        const profit = profitMatch ? parseFloat(profitMatch[1]) : 0;

                        // Se NÃO detectou stop, então é apenas uma conclusão de ciclo parcial ou final
                        // Mas se for final (4/4), geralmente vira stop (META ou BLINDADO se falhar).
                        // Se atingiu meta 4/4 -> vai gerar log de META DE LUCRO também.
                        // Então essa lógica aqui é mais para feedback visual durante a operação.
                        
                        // LÓGICA DE TRIGGER: Apenas se for o último ciclo (Ex: 4/4) E não tiver stop detectado acima (redundancia)
                        const isFinalCycle = (cycleNum === totalCycles);

                        if (isFinalCycle && this.lastProcessedCycle !== cycleNum) {
                            console.log(`[AgenteAutonomo] 🔄 [Logs] Final Cycle ${cycleNum}/${totalCycles} Completion Detected!`);
                            this.currentCycleNumber = parseInt(cycleNum);
                            this.currentCycleProfit = profit;
                            this.showCycleCompletionModal = true;
                            this.lastProcessedCycle = cycleNum;
                        }
                    }
                }
            },
            handleConfirmCycle() {
                this.showCycleCompletionModal = false;
            },

			handleCloseSessionSummary() {
				this.showSessionSummaryModal = false;
				window.zenixStopModalActive = false;
				this.sessionSummaryAcknowledged = true;
			},
            handleCloseStopLoss() {
                this.showStopLossModal = false;
                window.zenixStopModalActive = false;
                this.sessionSummaryAcknowledged = true;
            },
            handleCloseConsecutiveLoss() {
                this.showConsecutiveLossModal = false;
                window.zenixStopModalActive = false;
                this.sessionSummaryAcknowledged = true;
            },
            handleCloseBlindado() {
                this.showBlindadoModal = false;
                window.zenixStopModalActive = false;
                this.sessionSummaryAcknowledged = true;
            },
            handleCloseTargetProfit() {
                this.showTargetProfitModal = false;
                window.zenixStopModalActive = false;
                this.sessionSummaryAcknowledged = true;
            },
            handleViewDetails() {
                // Fechar o modal de resumo
                this.handleCloseSessionSummary();
                
                // Abrir o modal de detalhes diários
                // Se selectedDay não estiver setado para hoje, forçar
                if (!this.selectedDay || this.selectedDay.fullDate !== new Date().toISOString().split('T')[0]) {
                     // Cria um objeto parcial para hoje, openDayDetails buscará o resto
                     const todayStr = new Date().toISOString().split('T')[0];
                     this.openDayDetails({ fullDate: todayStr, date: new Date().toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'}) });
                } else {
                    this.openDayDetails(this.selectedDay);
                }
            },

			handleCloseNewStopModal(modalVar) {
				// Legacy handler - keeping for safety but logic moved to SessionSummary
				this[modalVar] = false;
				window.zenixStopModalActive = false;
			},
			fetchAllStats() {
				this.fetchAgentConfig(); 
				this.fetchProfitEvolution();
				this.fetchDailyStats();
				this.fetchSummaryStats();
				// Se modal aberto, atualiza detalhes
				if (this.selectedDay && this.selectedDay.fullDate === new Date().toISOString().split('T')[0]) {
					this.fetchDailyDetails(this.selectedDay);
				}
			},
			startReturnOscillation() {
				this.returnInterval = setInterval(() => {
					// Oscilação Zeus: entre 3.50% e 4.10% (Valor Verde)
					const zeusVar = (Math.random() * 0.08 - 0.04); // +/- 0.04
					this.zeusReturn = Math.max(3.50, Math.min(4.10, this.zeusReturn + zeusVar));

					// Oscilação Falcon: entre 2.50% e 3.20% (Valor Verde)
					const falconVar = (Math.random() * 0.06 - 0.03); // +/- 0.03
					this.falconReturn = Math.max(2.50, Math.min(3.20, this.falconReturn + falconVar));
				}, 50000); // A cada 50 segundos
			}
		},
	}
</script>

<style scoped>
.strategy-icons-inline {
    display: flex;
    align-items: center;
    gap: 6px;
}

.deriv-svg-icon {
    width: 28px;
    height: 28px;
    filter: brightness(0) invert(1);
}

.deriv-svg-icon-small {
    width: 20px;
    height: 20px;
    filter: brightness(0) invert(1);
}

/* Custom sidebar styles for specific internal scrollbars if tailwind classes aren't enough */
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: #0E0E0E;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #555;
}

.agent-avatar-mask-small {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    background: #111;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #333;
}

.agent-video-avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>
