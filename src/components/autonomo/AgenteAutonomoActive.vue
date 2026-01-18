<template>
	<div class="min-h-screen text-[#FAFAFA] font-sans">
		<!-- Header -->
		<div class="flex items-center justify-between mb-6">
			<div>
				<h2 class="text-xl font-bold mb-1">Agente Autônomo</h2>
				<p class="text-[#A1A1AA] text-sm">Dados baseados no período selecionado</p>
			</div>
			<div class="flex items-center gap-2">
				<button class="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-[#27272a] hover:bg-[#27272a] hover:text-white h-9 px-4 py-2 justify-between gap-2 bg-[#0c0c0c] text-[#FAFAFA] min-w-[240px]" type="button">
					<div class="flex items-center gap-2">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar text-green-500"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
						<span class="font-medium">{{ dateRangeText }}</span>
					</div>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down text-[#A1A1AA]"><path d="m6 9 6 6 6-6"></path></svg>
				</button>
				
				<button @click="pausarAgenteEIrParaTopo" class="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-[#27272a] hover:bg-[#27272a] h-9 px-4 py-2 bg-[#0c0c0c] text-[#FAFAFA] gap-2 ml-2">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pause"><rect width="4" height="16" x="6" y="4"></rect><rect width="4" height="16" x="14" y="4"></rect></svg>
					PAUSAR AGENTE
				</button>
			</div>
		</div>

		<div class="mb-6">
			<div class="flex justify-end mb-2">
				<button class="flex items-center gap-1.5 text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors text-xs">
					<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>
					<span>Ocultar valores</span>
				</button>
			</div>
			
			<!-- Metric Cards -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<!-- Capital Inicial -->
				<div class="rounded-lg border border-[#27272a] bg-[#0c0c0c] p-5 h-full transition-all duration-200 hover:bg-[#121212]">
					<div class="flex items-center gap-2 mb-3">
						<div class="text-green-500">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-dollar-sign"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
						</div>
						<span class="text-[#A1A1AA] text-xs uppercase tracking-wide font-medium">Capital Inicial</span>
					</div>
					<div class="text-2xl font-bold mb-1 tabular-nums text-[#FAFAFA] text-left">${{ initialCapital.toFixed(2) }}</div>
					<div class="flex items-center gap-2">
						<span class="text-[#A1A1AA] text-xs">R$ {{ (initialCapital * 5.19).toFixed(3) }}</span>
					</div>
				</div>

				<!-- Capital Final -->
				<div class="rounded-lg border border-[#27272a] bg-[#0c0c0c] p-5 h-full transition-all duration-200 hover:bg-[#121212]">
					<div class="flex items-center gap-2 mb-3">
						<div class="text-green-500">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wallet"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path></svg>
						</div>
						<span class="text-[#A1A1AA] text-xs uppercase tracking-wide font-medium">Capital Final</span>
					</div>
					<div class="text-2xl font-bold mb-1 tabular-nums text-green-500 text-left">${{ finalCapital.toFixed(2) }}</div>
					<div class="flex items-center gap-2">
						<span class="text-[#A1A1AA] text-xs">R$ {{ (finalCapital * 5.19).toFixed(3) }}</span>
					</div>
				</div>

				<!-- Lucro do Periodo -->
				<div class="rounded-lg border border-green-500/20 bg-[#0c0c0c] p-5 h-full transition-all duration-200 hover:bg-[#121212] relative overflow-hidden">
					<div class="absolute inset-0 bg-green-500/5 pointer-events-none"></div>
					<div class="flex items-center gap-2 mb-3 relative z-10">
						<div class="text-green-500">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-up"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
						</div>
						<span class="text-[#A1A1AA] text-xs uppercase tracking-wide font-medium">Lucro do Período</span>
					</div>
					<div class="text-2xl font-bold mb-1 tabular-nums text-green-500 relative z-10 text-left">+${{ periodProfit.toFixed(2) }}</div>
					<div class="flex items-center gap-2 relative z-10">
						<span class="text-[#A1A1AA] text-xs">R$ {{ (periodProfit * 5.19).toFixed(3) }}</span>
						<div class="inline-flex items-center rounded-full border border-transparent bg-green-500/20 text-green-500 font-semibold text-[10px] px-2 py-0.5">
							+{{ periodProfitPercent.toFixed(2) }}%
						</div>
					</div>
				</div>

				<!-- Lucro Medio/Dia -->
				<div class="rounded-lg border border-[#27272a] bg-[#0c0c0c] p-5 h-full transition-all duration-200 hover:bg-[#121212]">
					<div class="flex items-center gap-2 mb-3">
						<div class="text-green-500">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chart-column"><path d="M3 3v16a2 2 0 0 0 2 2h16"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path></svg>
						</div>
						<span class="text-[#A1A1AA] text-xs uppercase tracking-wide font-medium">Lucro Médio/Dia</span>
					</div>
					<div class="text-2xl font-bold mb-1 tabular-nums text-green-500 text-left">+${{ avgDailyProfit.toFixed(2) }}</div>
					<div class="flex items-center gap-2">
						<span class="text-[#A1A1AA] text-xs">$25,03/op</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Additional Stats Row -->
		<div class="rounded-lg border border-[#27272a] bg-[#0c0c0c] p-4 mb-6">
			<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
				
				<!-- Estrategia -->
				<div class="flex items-center gap-3 hover:bg-[#1a1a1a] rounded-lg p-2 -m-2 transition-colors">
					<div class="p-2 bg-[#1a1a1a] rounded-md">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bot text-green-500"><path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path></svg>
					</div>
					<div class="text-left">
						<div class="text-[#A1A1AA] text-[10px] uppercase tracking-wide">Estratégia</div>
						<div class="text-sm font-medium flex items-center gap-1.5 text-[#FAFAFA] text-left">
							<span class="text-lg">🦅</span>
							<span>{{ agenteData.estrategia }}</span>
							<span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
						</div>
					</div>
				</div>

				<!-- Resultado do dia -->
				<div class="flex items-center gap-3">
					<div class="p-2 bg-[#1a1a1a] rounded-md">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-up text-green-500"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
					</div>
					<div>
						<div class="text-[#A1A1AA] text-[10px] uppercase tracking-wide">Resultado do dia</div>
						<div class="text-sm font-medium tabular-nums text-left" :class="(sessionStats?.netProfit || 0) >= 0 ? 'text-green-500' : 'text-red-500'">
							{{ (sessionStats?.netProfit || 0) >= 0 ? '+' : '' }}${{ (sessionStats?.netProfit || 0).toFixed(2) }}
						</div>
					</div>
				</div>

				<!-- Operacoes Hoje -->
				<div class="flex items-center gap-3">
					<div class="p-2 bg-[#1a1a1a] rounded-md">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity text-green-500"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path></svg>
					</div>
					<div>
						<div class="text-[#A1A1AA] text-[10px] uppercase tracking-wide">OPERAÇÕES HOJE</div>
						<div class="text-sm font-medium tabular-nums text-[#FAFAFA] text-left">{{ operacoesHojeDisplay }}</div>
					</div>
				</div>

				<!-- Tempo Ativo -->
				<div class="flex items-center gap-3">
					<div class="p-2 bg-[#1a1a1a] rounded-md">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock text-green-500"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
					</div>
					<div>
						<div class="text-[#A1A1AA] text-[10px] uppercase tracking-wide">Tempo ativo</div>
						<div class="text-sm font-medium tabular-nums text-[#FAFAFA] text-left">{{ tempoAtivoDisplay }}</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Performance Chart -->
		<div class="rounded-lg border border-[#27272a] bg-[#0c0c0c] p-5 mb-6">
			<div class="flex items-center justify-between mb-4">
				<h3 class="text-sm font-semibold flex items-center gap-2 uppercase tracking-wide text-[#FAFAFA]">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-up text-green-500"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
					PERFORMANCE
				</h3>
				<span class="text-[#A1A1AA] text-xs">30 dias</span>
			</div>
			
			<div class="h-[300px] w-full bg-gradient-to-b from-green-500/5 to-transparent border-b border-[#27272a] mb-4">
				<div ref="performanceChartContainer" class="w-full h-full"></div>
			</div>

			<div class="flex justify-between mt-4">
				<div class="flex items-center gap-2">
					<div class="inline-flex items-center rounded-full border border-green-500/30 bg-green-500/10 text-green-500 font-semibold text-[10px] px-2.5 py-0.5">
						Melhor dia
					</div>
					<span class="text-xs text-[#FAFAFA] tabular-nums">+${{ bestDay?.value?.toFixed(2) || '0.00' }} ({{ bestDay?.date || '--' }})</span>
				</div>
				<div class="flex items-center gap-2">
					<div class="inline-flex items-center rounded-full border border-red-500/30 bg-red-500/10 text-red-500 font-semibold text-[10px] px-2.5 py-0.5">
						Pior dia
					</div>
					<span class="text-xs text-[#FAFAFA] tabular-nums">-${{ worstDay?.value?.toFixed(2) || '0.00' }} ({{ worstDay?.date || '--' }})</span>
				</div>
			</div>
		</div>

		<!-- Distribution Tables -->
		<div class="rounded-lg border border-[#27272a] bg-[#0c0c0c] p-5">
			<h3 class="text-sm font-semibold flex items-center gap-2 mb-4 uppercase tracking-wide text-[#FAFAFA]">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity text-green-500"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path></svg>
				Distribuição Diária de Performance
			</h3>

			<!-- Weekly Table -->
			<div class="overflow-x-auto mb-6">
				<h4 class="text-xs font-semibold text-[#A1A1AA] mb-3 uppercase tracking-wide text-left">Resumo Semanal</h4>
				<table class="w-full text-xs">
					<thead>
						<tr class="border-b border-[#27272a]">
							<th class="text-left py-2 px-1 text-[#A1A1AA] font-medium uppercase tracking-wide text-[10px]">Semana</th>
							<th class="text-right py-2 px-1 text-[#A1A1AA] font-medium uppercase tracking-wide text-[10px]">Lucro</th>
							<th class="text-right py-2 px-1 text-[#A1A1AA] font-medium uppercase tracking-wide text-[10px]">Capital Final</th>
							<th class="text-right py-2 px-1 text-[#A1A1AA] font-medium uppercase tracking-wide text-[10px]">%</th>
							<th class="text-right py-2 px-1 text-[#A1A1AA] font-medium uppercase tracking-wide text-[10px]">Ops</th>
							<th class="text-right py-2 px-1 text-[#A1A1AA] font-medium uppercase tracking-wide text-[10px]">Win Rate</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="week in weeklyData" :key="week.period" class="border-b border-[#27272a]/50 hover:bg-[#1a1a1a] transition-colors">
							<td class="text-left py-2.5 px-1 font-medium">{{ week.period }}</td>
							<td class="text-right py-2.5 px-1 tabular-nums font-medium" :class="week.profit >= 0 ? 'text-green-500' : 'text-red-500'">
								{{ week.profit >= 0 ? '+' : '' }}${{ week.profit.toFixed(2) }}
							</td>
							<td class="text-right py-2.5 px-1 tabular-nums text-[#FAFAFA]">${{ week.finalCapital.toFixed(2) }}</td>
							<td class="text-right py-2.5 px-1 tabular-nums" :class="week.percent >= 0 ? 'text-green-500' : 'text-red-500'">
								{{ week.percent >= 0 ? '+' : '' }}{{ week.percent.toFixed(2) }}%
							</td>
							<td class="text-right py-2.5 px-1 tabular-nums text-[#FAFAFA]">{{ week.ops }}</td>
							<td class="text-right py-2.5 px-1 tabular-nums text-[#FAFAFA]">{{ week.winRate.toFixed(1) }}%</td>
						</tr>
					</tbody>
				</table>
			</div>

			<!-- Daily Table -->
			<div>
				<h4 class="text-xs font-semibold text-[#A1A1AA] mb-3 uppercase tracking-wide text-left">Detalhamento Diário</h4>
				<div class="relative overflow-hidden h-[400px]"> 
					<div class="overflow-y-auto custom-scrollbar h-full relative">
						<table class="w-full text-xs">
							<thead class="sticky top-0 bg-[#0c0c0c] z-10 box-border border-b border-[#27272a]">
								<tr>
									<th class="text-left py-2.5 px-1 text-[#A1A1AA] font-medium uppercase tracking-wide text-[10px]">Dia</th>
									<th class="text-right py-2.5 px-1 text-[#A1A1AA] font-medium uppercase tracking-wide text-[10px]">Lucro</th>
									<th class="text-right py-2.5 px-1 text-[#A1A1AA] font-medium uppercase tracking-wide text-[10px]">Capital</th>
									<th class="text-right py-2.5 px-1 text-[#A1A1AA] font-medium uppercase tracking-wide text-[10px]">Ops</th>
									<th class="text-right py-2.5 px-1 text-[#A1A1AA] font-medium uppercase tracking-wide text-[10px]">Win%</th>
									<th class="text-right py-2.5 px-1 text-[#A1A1AA] font-medium uppercase tracking-wide text-[10px]">Tempo Ops</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="day in dailyData" :key="day.date" 
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
										{{ day.profit >= 0 ? '+' : '' }}${{ day.profit.toFixed(2) }}
									</td>
									<td class="text-right py-3 px-1 tabular-nums text-[#FAFAFA]">${{ day.capital.toFixed(2) }}</td>
									<td class="text-right py-3 px-1 tabular-nums text-[#FAFAFA]">{{ day.ops }}</td>
									<td class="text-right py-3 px-1 tabular-nums font-medium" 
										:class="day.winRate >= 70 ? 'text-green-500' : day.winRate >= 50 ? 'text-[#FAFAFA]' : 'text-red-500'">
										{{ day.winRate.toFixed(1) }}%
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

		<div class="text-center mt-8 py-4 border-t border-[#27272a]">
			<p class="text-[#A1A1AA] text-xs">Sistema operando automaticamente • Dados atualizados em tempo real</p>
		</div>
	</div>

	<!-- Daily Details Modal -->
	<div v-if="selectedDay" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 duration-200" @click.self="selectedDay = null">
		<div role="dialog" class="grid w-full gap-4 border border-[#27272a] p-6 shadow-lg sm:rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto bg-[#09090b] relative animate-in fade-in zoom-in-95 duration-200">
			
			<!-- Close Button -->
			<button type="button" class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none text-[#A1A1AA] hover:text-[#FAFAFA]" @click="selectedDay = null">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x h-4 w-4"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
				<span class="sr-only">Close</span>
			</button>

			<!-- Header -->
			<div class="flex flex-col space-y-1.5 text-center sm:text-left">
				<h2 class="text-lg font-semibold leading-none tracking-tight flex items-center justify-between">
					<span class="text-lg font-semibold text-[#FAFAFA]">Relatório Diário — {{ selectedDay.date }}/2026</span>
					<div class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors bg-green-500/10 text-green-500 border-green-500/20 mr-8">
						{{ selectedDay.profit >= 0 ? '+' : '' }}${{ selectedDay.profit.toFixed(2) }}
					</div>
				</h2>
			</div>

			<!-- KPI Grid -->
			<div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
				<!-- Lucro do Dia -->
				<div class="rounded-lg border border-[#27272a] shadow-sm bg-[#0c0c0c] p-3">
					<div class="text-[#A1A1AA] text-[10px] uppercase tracking-wide mb-1 text-left">Lucro do Dia</div>
					<div class="text-xl font-bold tabular-nums text-left" :class="selectedDay.profit >= 0 ? 'text-green-500' : 'text-red-500'">
						{{ selectedDay.profit >= 0 ? '+' : '' }}${{ selectedDay.profit.toFixed(2) }}
					</div>
					<div class="text-[#A1A1AA] text-xs tabular-nums text-left">R$ {{ (selectedDay.profit * 5.19).toFixed(3) }}</div>
				</div>

				<!-- Capital -->
				<div class="rounded-lg border border-[#27272a] shadow-sm bg-[#0c0c0c] p-3">
					<div class="text-[#A1A1AA] text-[10px] uppercase tracking-wide mb-1 text-left">Capital</div>
					<!-- Estimating start capital for display logic -->
					<div class="text-sm font-medium tabular-nums text-[#FAFAFA] text-left">
						${{ (selectedDay.capital - selectedDay.profit).toFixed(2) }} → ${{ selectedDay.capital.toFixed(2) }}
					</div>
					<div class="text-xs tabular-nums text-left" :class="selectedDay.profit >= 0 ? 'text-green-500' : 'text-red-500'">
						{{ selectedDay.profit >= 0 ? '+' : '' }}{{ ((selectedDay.profit / (selectedDay.capital - selectedDay.profit)) * 100).toFixed(2) }}%
					</div>
				</div>

				<!-- Meta Diária -->
				<div class="rounded-lg border border-[#27272a] shadow-sm bg-[#0c0c0c] p-3">
					<div class="text-[#A1A1AA] text-[10px] uppercase tracking-wide mb-1 text-left">Meta Diária</div>
					<div class="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors bg-green-500/10 text-green-500 border-green-500/20 text-xs text-left">
						Atingida
					</div>
					<div class="text-[#A1A1AA] text-xs mt-1 text-left">Ativação: 09:01:06</div>
				</div>

				<!-- Firewall -->
				<div class="rounded-lg border border-[#27272a] shadow-sm bg-[#0c0c0c] p-3">
					<div class="text-[#A1A1AA] text-[10px] uppercase tracking-wide mb-1 text-left">Firewall</div>
					<div class="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-xs text-left">
						Ativado
					</div>
				</div>
			</div>

			<!-- Statistics Grid -->
			<div class="grid grid-cols-3 md:grid-cols-6 gap-3 mt-4">
				<div class="text-center p-2 bg-[#27272a]/30 rounded">
					<div class="text-lg font-bold tabular-nums text-[#FAFAFA]">{{ selectedDay.ops }}</div>
					<div class="text-[10px] text-[#A1A1AA] uppercase">Operações</div>
				</div>
				<div class="text-center p-2 bg-[#27272a]/30 rounded">
					<!-- Approximating wins based on winrate -->
					<div class="text-lg font-bold tabular-nums text-green-500">{{ Math.round(selectedDay.ops * (selectedDay.winRate / 100)) }}</div>
					<div class="text-[10px] text-[#A1A1AA] uppercase">Positivas</div>
				</div>
				<div class="text-center p-2 bg-[#27272a]/30 rounded">
					<div class="text-lg font-bold tabular-nums text-red-500">{{ selectedDay.ops - Math.round(selectedDay.ops * (selectedDay.winRate / 100)) }}</div>
					<div class="text-[10px] text-[#A1A1AA] uppercase">Negativas</div>
				</div>
				<div class="text-center p-2 bg-[#27272a]/30 rounded">
					<div class="text-lg font-bold tabular-nums text-[#FAFAFA]">{{ selectedDay.winRate.toFixed(1) }}%</div>
					<div class="text-[10px] text-[#A1A1AA] uppercase">Win Rate</div>
				</div>
				<div class="text-center p-2 bg-[#27272a]/30 rounded">
					<div class="text-lg font-bold tabular-nums" :class="selectedDay.profit >= 0 ? 'text-green-500' : 'text-red-500'">
						{{ selectedDay.profit >= 0 ? '+' : '' }}${{ (selectedDay.profit / selectedDay.ops).toFixed(2) }}
					</div>
					<div class="text-[10px] text-[#A1A1AA] uppercase">Média/Op</div>
				</div>
				<div class="text-center p-2 bg-[#27272a]/30 rounded">
					<div class="text-lg font-bold tabular-nums text-[#FAFAFA]">{{ selectedDay.avgTime }}</div>
					<div class="text-[10px] text-[#A1A1AA] uppercase">Intervalo</div>
				</div>
			</div>

			<!-- Intraday Operations Table (Static Mock per snippet requirement) -->
			<div class="mt-4">
				<h4 class="text-sm font-semibold mb-3 uppercase tracking-wide flex items-center gap-2 text-left text-[#FAFAFA]">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity w-4 h-4 text-green-500"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path></svg>
					Operações Intraday
				</h4>
				<div class="overflow-x-auto max-h-[300px] overflow-y-auto custom-scrollbar">
					<table class="w-full text-xs">
						<thead class="sticky top-0 bg-[#09090b] shadow-sm">
							<tr class="border-b border-[#27272a]">
								<th class="text-left py-2 text-[#A1A1AA] font-medium">Hora</th>
								<th class="text-left py-2 text-[#A1A1AA] font-medium">Mercado</th>
								<th class="text-right py-2 text-[#A1A1AA] font-medium">Entrada</th>
								<th class="text-right py-2 text-[#A1A1AA] font-medium">Saída</th>
								<th class="text-right py-2 text-[#A1A1AA] font-medium">Investimento</th>
								<th class="text-right py-2 text-[#A1A1AA] font-medium">Resultado</th>
							</tr>
						</thead>
						<tbody>
							<!-- Using mock rows from snippet, mapped to resemble dynamic feel if possible or just static as requested -->
							<tr class="border-b border-[#27272a]/50 hover:bg-[#27272a]/20">
								<td class="py-2 font-mono text-[#A1A1AA] text-left">06:19:00</td>
								<td class="py-2 text-[#FAFAFA] text-left">ETH/USD</td>
								<td class="py-2 text-right tabular-nums text-[#FAFAFA]">$8.209,46</td>
								<td class="py-2 text-right tabular-nums text-[#FAFAFA]">$8.349,92</td>
								<td class="py-2 text-right tabular-nums text-[#FAFAFA]">$205,25</td>
								<td class="py-2 text-right tabular-nums font-medium text-green-500">+$186,05</td>
							</tr>
							<tr class="border-b border-[#27272a]/50 hover:bg-[#27272a]/20">
								<td class="py-2 font-mono text-[#A1A1AA] text-left">06:38:00</td>
								<td class="py-2 text-[#FAFAFA] text-left">Índice V75</td>
								<td class="py-2 text-right tabular-nums text-[#FAFAFA]">$32.252,62</td>
								<td class="py-2 text-right tabular-nums text-[#FAFAFA]">$32.253,70</td>
								<td class="py-2 text-right tabular-nums text-[#FAFAFA]">$128,60</td>
								<td class="py-2 text-right tabular-nums font-medium text-green-500">+$109,87</td>
							</tr>
							<tr class="border-b border-[#27272a]/50 hover:bg-[#27272a]/20">
								<td class="py-2 font-mono text-[#A1A1AA] text-left">09:45:00</td>
								<td class="py-2 text-[#FAFAFA] text-left">BTC/USD</td>
								<td class="py-2 text-right tabular-nums text-[#FAFAFA]">$16.943,85</td>
								<td class="py-2 text-right tabular-nums text-[#FAFAFA]">$16.846,71</td>
								<td class="py-2 text-right tabular-nums text-[#FAFAFA]">$247,75</td>
								<td class="py-2 text-right tabular-nums font-medium text-red-500">-$236,42</td>
							</tr>
							<tr class="border-b border-[#27272a]/50 hover:bg-[#27272a]/20">
								<td class="py-2 font-mono text-[#A1A1AA] text-left">10:08:00</td>
								<td class="py-2 text-[#FAFAFA] text-left">BTC/USD</td>
								<td class="py-2 text-right tabular-nums text-[#FAFAFA]">$41.289,35</td>
								<td class="py-2 text-right tabular-nums text-[#FAFAFA]">$41.525,65</td>
								<td class="py-2 text-right tabular-nums text-[#FAFAFA]">$156,85</td>
								<td class="py-2 text-right tabular-nums font-medium text-green-500">+$117,66</td>
							</tr>
							<tr class="border-b border-[#27272a]/50 hover:bg-[#27272a]/20">
								<td class="py-2 font-mono text-[#A1A1AA] text-left">12:12:00</td>
								<td class="py-2 text-[#FAFAFA] text-left">ETH/USD</td>
								<td class="py-2 text-right tabular-nums text-[#FAFAFA]">$3.321,80</td>
								<td class="py-2 text-right tabular-nums text-[#FAFAFA]">$3.288,25</td>
								<td class="py-2 text-right tabular-nums text-[#FAFAFA]">$237,71</td>
								<td class="py-2 text-right tabular-nums font-medium text-red-500">-$212,10</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { createChart, ColorType } from 'lightweight-charts';

	export default {
		name: 'AgenteAutonomoPanel',
		components: {},
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
				selectedDay: null,
				abaAtiva: 'grafico',
				ultimaAtualizacao: new Date().toLocaleTimeString('pt-BR'),
				filtroDataSelecionado: 'hoje',
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
				indexChart: null,
				indexChartSeries: null,
				indexChartInitialized: false,
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
				showStopLossModal: false,
				
				// Novas propriedades para o layout redesenhado
				selectedPeriod: '30d',
				weeklyData: [
					{ period: '15/12 - 21/12', profit: 3385.05, finalCapital: 105428.46, percent: 3.32, ops: 84, winRate: 75.0 },
					{ period: '22/12 - 28/12', profit: 6641.49, finalCapital: 112069.95, percent: 6.30, ops: 271, winRate: 72.3 },
					{ period: '29/12 - 04/01', profit: 6664.37, finalCapital: 118734.32, percent: 5.95, ops: 268, winRate: 72.8 },
					{ period: '05/01 - 11/01', profit: 6424.36, finalCapital: 125158.68, percent: 5.41, ops: 282, winRate: 73.4 },
					{ period: '12/01 - 18/01', profit: 5769.39, finalCapital: 130928.07, percent: 4.61, ops: 249, winRate: 73.9 },
				],
				dailyData: [
                    { date: '19/12', badge: 'Melhor', profit: 2657.82, capital: 104701.23, ops: 43, winRate: 74.4, avgTime: '24min' },
					{ date: '25/12', badge: '', profit: 1169.77, capital: 111704.38, ops: 38, winRate: 71.0, avgTime: '24min' },
					{ date: '26/12', badge: '', profit: -511.89, capital: 111192.49, ops: 40, winRate: 75.0, avgTime: '24min' },
					{ date: '27/12', badge: '', profit: 387.73, capital: 111580.23, ops: 22, winRate: 72.7, avgTime: '27min' },
					{ date: '28/12', badge: '', profit: 489.72, capital: 112069.95, ops: 20, winRate: 75.0, avgTime: '27min' },
					{ date: '29/12', badge: '', profit: 1678.16, capital: 113749.11, ops: 52, winRate: 71.2, avgTime: '22min' },
					{ date: '30/12', badge: 'Pior', profit: -584.66, capital: 113163.45, ops: 40, winRate: 72.5, avgTime: '24min' },
					{ date: '31/12', badge: '', profit: 1210.03, capital: 114373.48, ops: 44, winRate: 75.0, avgTime: '23min' },
					{ date: '01/01', badge: '', profit: 1318.99, capital: 115692.47, ops: 43, winRate: 74.4, avgTime: '24min' },
					{ date: '02/01', badge: '', profit: 1966.64, capital: 117659.11, ops: 51, winRate: 70.6, avgTime: '22min' },
					{ date: '03/01', badge: '', profit: 584.80, capital: 118243.90, ops: 15, winRate: 73.3, avgTime: '28min' },
				],
			};
		},
		mounted() {
			if (this.abaAtiva === 'grafico') {
				this.$nextTick(() => {
					this.initIndexChart();
					// Mock data inicial
					this.fetchPriceHistory();
				});
			}
		},
		computed: {
			dateRangeText() {
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
				return this.sessionStats?.totalCapital || this.totalCapital || 27808.68;
			},
			finalCapital() {
				return this.initialCapital + this.periodProfit;
			},
			periodProfit() {
				return this.sessionStats?.netProfit || 0;
			},
			periodProfitPercent() {
				if (this.initialCapital <= 0) return 0;
				return (this.periodProfit / this.initialCapital) * 100;
			},
			avgDailyProfit() {
				if (!this.dailyData || this.dailyData.length === 0) return 0;
				const totalProfit = this.dailyData.reduce((sum, day) => sum + day.profit, 0);
				return totalProfit / this.dailyData.length;
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
				return this.sessionStats?.operationsToday ?? this.agenteData?.operacoesHoje ?? 0;
			},
			totalCapital() {
				// Só para compatibilidade interna se usado em outros lugares
				return this.sessionStats?.totalCapital || this.agenteData?.accountBalance || 0;
			},
			timeframeFinal() {
				const unidadeMap = { 'minutos': 'm', 'horas': 'h', 'Dias': 'D' };
				return `${this.valorTimeframeSelecionado}${unidadeMap[this.unidadeTimeframeSelecionada] || ''}`;
			},
			historicoOperacoesFiltradas() {
				// Simplificado para evitar erro, usando dados mock ou tradeHistory
				return this.tradeHistory || [];
			}
		},
		methods: {
			openDayDetails(day) {
				this.selectedDay = day;
			},
			getUserId() {
				return localStorage.getItem('userId') || localStorage.getItem('user_id');
			},
			pausarAgenteEIrParaTopo() {
				this.$emit('pausarAgente');
				window.scrollTo({ top: 0, behavior: 'smooth' });
			},
			
			// Métodos do Gráfico
			initIndexChart() {
				if (!this.$refs.performanceChartContainer) return;

				// Limpar container se já tiver algo
				this.$refs.performanceChartContainer.innerHTML = '';

				this.indexChart = createChart(this.$refs.performanceChartContainer, {
					layout: {
						background: { type: ColorType.Solid, color: 'transparent' },
						textColor: '#A0A0A0',
					},
					grid: {
						vertLines: { color: 'rgba(42, 46, 57, 0)' },
						horzLines: { color: 'rgba(42, 46, 57, 0.2)' },
					},
					width: this.$refs.performanceChartContainer.clientWidth,
					height: 300,
					timeScale: {
						borderColor: 'rgba(197, 203, 206, 0.2)',
						timeVisible: true,
						secondsVisible: false,
					},
				});

				this.indexChartSeries = this.indexChart.addAreaSeries({
					topColor: 'rgba(34, 197, 94, 0.56)',
					bottomColor: 'rgba(34, 197, 94, 0.04)',
					lineColor: 'rgba(34, 197, 94, 1)',
					lineWidth: 2,
				});

				this.indexChartInitialized = true;

				// Responsividade
				const resizeObserver = new ResizeObserver(entries => {
					if (entries.length === 0 || !entries[0].target) return;
					if (this.indexChart) {
						this.indexChart.resize(entries[0].contentRect.width, 300);
					}
				});
				resizeObserver.observe(this.$refs.performanceChartContainer);
			},
			fetchPriceHistory() {
				// Mock data generator for performance visualization
				const data = [];
				let price = 1000;
				const now = new Date();
				for (let i = 0; i < 100; i++) {
					// 1 minute intervals, 100 points
					const time = new Date(now.getTime() - (100 - i) * 60000); 
					// Random walk price
					price += (Math.random() - 0.5) * 10;
					data.push({ time: time.getTime() / 1000, value: price });
				}
				this.updateIndexChart(data);
			},
			updateIndexChart(data) {
				if (this.indexChartSeries && data) {
					this.indexChartSeries.setData(data);
				}
			},

			// Métodos placeholder
			stopPricePolling() {},
			stopLogsPolling() {},
			startLogsPolling() {},
		},
		watch: {
			'agenteData.accountBalance'() { this.$forceUpdate(); }
		}
	}
</script>

<style scoped>
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
</style>
