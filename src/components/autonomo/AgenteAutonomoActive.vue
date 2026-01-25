<template>
	<div class="min-h-screen text-[#FAFAFA] font-sans" style="padding-top: 2rem;">
		<!-- Header -->
		<div class="flex flex-col items-start md:flex-row md:items-center md:justify-between mb-6 gap-4 md:mt-8 mt-0">
			<div class="text-left flex flex-col gap-[3px]">
				<h2 class="text-xl font-bold leading-tight">Monitoramento de agentes</h2>
				<p class="text-[#A1A1AA] text-xs leading-tight">Acompanhe os resultados dos seus agentes ativos ou configure um novo agente.</p>
			</div>
			<div class="flex flex-row items-center gap-2 w-full md:w-auto">
				<div class="relative z-[40] flex-1 md:flex-none">
					<button 
						@click.stop="toggleDatePicker"
						class="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-[#27272a] hover:bg-[#27272a] hover:text-white h-9 px-4 py-2 justify-between gap-2 bg-[#0c0c0c] text-[#FAFAFA] w-full md:min-w-[180px]" 
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

		<div class="mb-6">
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
			
			<!-- Metric Cards -->
			<div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<!-- Capital Inicial -->
				<div class="rounded-lg border border-[#27272a] bg-[#0c0c0c] p-[0.8rem] md:p-5 h-full transition-all duration-200 hover:bg-[#121212] hidden md:block">
					<div class="flex items-center mb-4 gap-2">
						<div class="text-green-500">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-dollar-sign"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
						</div>
						<span class="text-[#A1A1AA] text-xs uppercase tracking-wide font-medium">Entrada Inicial</span>
					</div>
					<div class="text-2xl font-bold mb-1 tabular-nums text-[#FAFAFA] text-left">
						{{ hideValues ? '••••' : '$' + initialCapital.toFixed(2) }}
					</div>
				</div>

				<!-- Capital Final -->
				<div class="rounded-lg border border-[#27272a] bg-[#0c0c0c] p-[0.8rem] md:p-5 h-full transition-all duration-200 hover:bg-[#121212]">
					<div class="flex items-center gap-2 mb-3">
						<div class="text-green-500">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wallet"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path></svg>
						</div>
						<span class="text-[#A1A1AA] text-xs uppercase tracking-wide font-medium whitespace-nowrap">Capital Final</span>
					</div>
					<div class="text-2xl font-bold mb-1 tabular-nums text-green-500 text-left">
						{{ hideValues ? '••••' : '$' + finalCapital.toFixed(2) }}
					</div>
				</div>

				<!-- Lucro do Periodo -->
				<div 
					class="rounded-lg border bg-[#0c0c0c] p-[0.8rem] md:p-5 h-full transition-all duration-200 hover:bg-[#121212] relative overflow-hidden"
					:class="periodProfit >= 0 ? 'border-green-500/20' : 'border-red-500/20'"
				>
					<div 
						class="absolute inset-0 pointer-events-none"
						:class="periodProfit >= 0 ? 'bg-green-500/5' : 'bg-red-500/5'"
					></div>
					<div class="flex items-center gap-2 mb-3 relative z-10">
						<div :class="periodProfit >= 0 ? 'text-green-500' : 'text-red-500'">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-up" v-if="periodProfit >= 0"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-down" v-else><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline><polyline points="16 17 22 17 22 11"></polyline></svg>
						</div>
						<span class="text-[#A1A1AA] text-xs uppercase tracking-wide font-medium whitespace-nowrap">Lucro do Período</span>
					</div>
					<div 
						class="text-2xl font-bold mb-1 tabular-nums relative z-10 text-left"
						:class="periodProfit >= 0 ? 'text-green-500' : 'text-red-500'"
					>
						{{ hideValues ? '••••' : (periodProfit >= 0 ? '+' : '') + '$' + periodProfit.toFixed(2) }}
					</div>
					<div class="flex items-center gap-2 relative z-10">
						<div 
							class="inline-flex items-center rounded-full border border-transparent font-semibold text-[10px] px-2 py-0.5" 
							:class="periodProfit >= 0 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'"
							v-if="!hideValues"
						>
							{{ periodProfit >= 0 ? '+' : '' }}{{ periodProfitPercent.toFixed(2) }}%
						</div>
					</div>
				</div>

				<!-- Lucro Medio/Dia -->
				<div 
					class="rounded-lg border bg-[#0c0c0c] p-[0.8rem] md:p-5 h-full transition-all duration-200 hover:bg-[#121212] hidden md:block"
					:class="avgDailyProfit >= 0 ? 'border-[#27272a]' : 'border-red-500/20'"
				>
					<div class="flex items-center gap-2 mb-3">
						<div :class="avgDailyProfit >= 0 ? 'text-green-500' : 'text-red-500'">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chart-column"><path d="M3 3v16a2 2 0 0 0 2 2h16"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path></svg>
						</div>
						<span class="text-[#A1A1AA] text-xs uppercase tracking-wide font-medium">Lucro Médio/Dia</span>
					</div>
					<div 
						class="text-2xl font-bold mb-1 tabular-nums text-left"
						:class="avgDailyProfit >= 0 ? 'text-green-500' : 'text-red-500'"
					>
						{{ hideValues ? '••••' : (avgDailyProfit >= 0 ? '+' : '') + '$' + avgDailyProfit.toFixed(2) }}
					</div>
				</div>
			</div>
		</div>

		<!-- Additional Stats Row -->
		<div class="rounded-lg border border-[#27272a] bg-[#0c0c0c] p-4 mb-6 relative">
			<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
				
				<!-- Estrategia -->
				<div class="relative flex-1">
					<div 
						class="flex items-center justify-between hover:bg-[#1a1a1a] rounded-lg p-2 -m-2 transition-colors cursor-pointer group"
						@click.stop="toggleAgentSwitcher"
					>
						<div class="flex items-center gap-3">
							<div class="p-2 bg-[#1a1a1a] rounded-md">
								<i class="fas fa-microchip text-green-500 text-base"></i>
							</div>
							<div class="text-left">
								<div class="text-[#A1A1AA] text-[10px] uppercase tracking-wide flex items-center gap-1">
									AGENTE ATIVO
									<i class="fas fa-chevron-down text-[8px] transition-transform duration-200" :class="{ 'rotate-180': showAgentSwitcher }"></i>
								</div>
								<div class="text-sm font-medium flex items-center gap-1.5 text-[#FAFAFA] text-left">
									<span class="text-lg">{{ runningAgents.find(a => a.id === agenteData.id)?.emoji || '⚡' }}</span>
									<span>{{ agenteData.estrategia.replace('IA ', '').charAt(0).toUpperCase() + agenteData.estrategia.replace('IA ', '').slice(1) }}</span>
									<span class="w-1.5 h-1.5 rounded-full bg-green-500 ml-1"></span>
								</div>
							</div>
						</div>
					</div>

					<!-- Agent Switcher Dropdown -->
					<div 
						v-if="showAgentSwitcher"
						class="absolute top-full left-0 mt-4 w-[280px] bg-[#0c0c0c] border border-[#27272a] rounded-lg shadow-2xl z-[60] overflow-hidden animate-fade-in"
					>
						<div class="p-3 border-b border-[#27272a] bg-[#121212]/50">
							<h4 class="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider text-left">SELECIONE O AGENTE</h4>
						</div>
						
						<div class="max-h-[300px] overflow-y-auto custom-scrollbar">
							<div 
								v-for="agent in runningAgents" 
								:key="agent.id"
								@click="selectAgent(agent.id)"
								class="p-3 flex items-center gap-3 hover:bg-[#1a1a1a] cursor-pointer transition-colors border-b border-[#27272a]/50 last:border-0"
								:class="{ 'bg-green-500/[0.01] border-green-500/40 shadow-[inset_0_0_15px_rgba(34,197,94,0.27)]': agenteData.id === agent.id }"
							>
								<div class="w-10 h-10 rounded-md bg-[#1a1a1a] flex items-center justify-center text-xl relative">
									<span>{{ agent.emoji }}</span>
									<div v-if="agenteData.id === agent.id" class="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0c0c0c] flex items-center justify-center">
										<i class="fas fa-check text-[8px] text-black"></i>
									</div>
								</div>
								<div class="flex-1 min-w-0">
									<div class="flex items-center justify-between gap-2">
										<h5 class="text-xs font-bold text-white truncate text-left">{{ agent.title }}</h5>
										<span v-if="agenteData.id === agent.id" class="text-[8px] text-white font-bold uppercase tracking-tighter shrink-0">Ativo</span>
									</div>
									<p class="text-[10px] text-[#A1A1AA] mt-0.5 text-left leading-tight pr-2 whitespace-pre-line" v-html="formatAgentDescription(agent.description)"></p>
									<div class="flex items-center gap-2 mt-1.5 text-left">
										<span class="text-[9px] text-[#A1A1AA]">WR: <span class="text-white">{{ agent.winRate }}%</span></span>
										<span class="text-[9px] text-[#A1A1AA]">Estilo: <span class="text-white">{{ agent.style }}</span></span>
									</div>
								</div>
							</div>
						</div>

						<button 
							@click="goToConfiguration"
							class="w-full p-4 flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#222] transition-colors text-white text-xs font-bold"
						>
							<i class="fas fa-plus text-[10px] text-green-500"></i>
							Configurar Novo Agente
						</button>
					</div>
				</div>

				<!-- Resultado do dia -->
				<div class="flex items-center gap-3">
					<div class="p-2 bg-[#1a1a1a] rounded-md">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-up" :class="(sessionStats?.netProfit || 0) >= 0 ? 'text-green-500' : 'text-red-500'" v-if="(sessionStats?.netProfit || 0) >= 0"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-down" :class="(sessionStats?.netProfit || 0) >= 0 ? 'text-green-500' : 'text-red-500'" v-else><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline><polyline points="16 17 22 17 22 11"></polyline></svg>
					</div>
					<div>
						<div class="text-[#A1A1AA] text-[10px] uppercase tracking-wide">Resultado do dia</div>
						<div class="text-sm font-medium tabular-nums text-left" :class="(sessionStats?.netProfit || 0) >= 0 ? 'text-green-500' : 'text-red-500'">
							{{ hideValues ? '••••' : ((sessionStats?.netProfit || 0) >= 0 ? '+' : '') + '$' + (sessionStats?.netProfit || 0).toFixed(2) }}
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
				<span class="text-[#A1A1AA] text-xs">{{ dateRangeText }}</span>
			</div>
			
			<div ref="performanceChartContainer" class="h-[300px] w-full bg-gradient-to-b from-green-500/5 to-transparent border-b border-[#27272a] mb-4 relative">
				<!-- Lightweight Charts will inject here -->
			</div>

			<div class="flex justify-between mt-4">
				<div class="flex items-center gap-2">
					<div class="inline-flex items-center rounded-full border border-green-500/30 bg-green-500/10 text-green-500 font-semibold text-[10px] px-2.5 py-0.5">
						Melhor dia
					</div>
					<span class="text-xs text-[#FAFAFA] tabular-nums" v-if="!hideValues">+${{ bestDay?.value?.toFixed(2) || '0.00' }} ({{ bestDay?.date || '--' }})</span>
					<span class="text-xs text-[#FAFAFA] tabular-nums" v-else>•••• ({{ bestDay?.date || '--' }})</span>
				</div>
				<div class="flex items-center gap-2">
					<div class="inline-flex items-center rounded-full border border-red-500/30 bg-red-500/10 text-red-500 font-semibold text-[10px] px-2.5 py-0.5">
						Pior dia
					</div>
					<span class="text-xs text-[#FAFAFA] tabular-nums" v-if="!hideValues">-${{ worstDay?.value?.toFixed(2) || '0.00' }} ({{ worstDay?.date || '--' }})</span>
					<span class="text-xs text-[#FAFAFA] tabular-nums" v-else>•••• ({{ worstDay?.date || '--' }})</span>
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
				<div class="overflow-x-auto">
					<table class="w-full text-[11px] sm:text-xs md:text-sm">
						<thead class="border-b border-[#27272a]">
							<tr class="text-[#A1A1AA] text-[10px] sm:text-xs">
								<th class="text-left py-2 px-1 font-medium uppercase tracking-wide">Semana</th>
								<th class="text-right py-2 px-1 font-medium uppercase tracking-wide">Lucro</th>
								<th class="text-right py-2 px-1 font-medium uppercase tracking-wide">Capital Final</th>
								<th class="text-right py-2 px-1 font-medium uppercase tracking-wide">%</th>
								<th class="text-right py-2 px-1 font-medium uppercase tracking-wide">Ops</th>
								<th class="text-right py-2 px-1 font-medium uppercase tracking-wide">Win Rate</th>
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
					<div class="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] sm:text-xs font-semibold bg-green-500/10 text-green-500 border-green-500/20 mr-8 sm:mr-10">
						{{ activeDayDetails.profit >= 0 ? '+' : '' }}${{ activeDayDetails.profit.toFixed(2) }}
					</div>
				</h2>
			</div>

			<!-- KPI Grid -->
			<div class="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mt-4 text-left">
				<!-- Lucro do Dia -->
				<div class="rounded-lg border border-[#27272a] bg-[#0c0c0c] p-2 sm:p-3">
					<div class="text-[#A1A1AA] text-[8px] sm:text-[10px] uppercase tracking-wide mb-0.5 text-left">Lucro do Dia</div>
					<div class="text-base sm:text-xl font-bold tabular-nums text-left" :class="activeDayDetails.profit >= 0 ? 'text-green-500' : 'text-red-500'">
						{{ activeDayDetails.profit >= 0 ? '+' : '' }}${{ activeDayDetails.profit.toFixed(2) }}
					</div>
				</div>

				<!-- Capital -->
				<div class="rounded-lg border border-[#27272a] bg-[#0c0c0c] p-2 sm:p-3">
					<div class="text-[#A1A1AA] text-[8px] sm:text-[10px] uppercase tracking-wide mb-0.5 text-left">Capital</div>
					<!-- Estimating start capital for display logic -->
					<div class="text-[10px] sm:text-sm font-medium tabular-nums text-[#FAFAFA] text-left">
						${{ (activeDayDetails.capital - activeDayDetails.profit).toFixed(2) }} → ${{ activeDayDetails.capital.toFixed(2) }}
					</div>
				</div>

				<!-- Meta Diária -->
				<div class="rounded-lg border border-[#27272a] bg-[#0c0c0c] p-2 sm:p-3 flex flex-col items-start">
					<div class="text-[#A1A1AA] text-[8px] sm:text-[10px] uppercase tracking-wide mb-0.5 text-left">Meta Diária</div>
					<div class="inline-flex items-center rounded-full border px-2 py-0.5 font-semibold transition-colors text-[10px] sm:text-xs text-left bg-green-500/10 text-green-500 border-green-500/20">
						${{ agenteData.goalValue ? agenteData.goalValue.toFixed(2) : '50.00' }}
					</div>
					<div class="text-[#A1A1AA] text-[9px] sm:text-xs mt-0.5 sm:mt-1 text-left" v-if="activeDayDetails.activationTime">
						Ativação: {{ activeDayDetails.activationTime }}
					</div>
				</div>

				<!-- Firewall -->
				<div class="rounded-lg border border-[#27272a] bg-[#0c0c0c] p-2 sm:p-3 flex flex-col items-start">
					<div class="text-[#A1A1AA] text-[8px] sm:text-[10px] uppercase tracking-wide mb-0.5 text-left">Firewall</div>
					<div class="inline-flex items-center rounded-full border px-2 py-0.5 font-semibold transition-colors bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-[10px] sm:text-xs text-left">
						${{ agenteData.stopValue ? agenteData.stopValue.toFixed(2) : '25.00' }}
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
						{{ activeDayDetails.profit >= 0 ? '+' : '' }}${{ (activeDayDetails.profit / (activeDayDetails.ops || 1)).toFixed(2) }}
					</div>
					<div class="text-[8px] sm:text-[10px] text-[#A1A1AA] uppercase">Média/Op</div>
				</div>
			</div>

			<!-- Intraday Operations Table (Static Mock per snippet requirement) -->
			<div class="mt-4">
				<h4 class="text-sm font-semibold mb-3 uppercase tracking-wide flex items-center gap-2 text-left text-[#FAFAFA]">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity w-4 h-4 text-green-500"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path></svg>
					Operações Intraday
				</h4>
				<div class="overflow-x-auto max-h-[300px] overflow-y-auto custom-scrollbar">
					<table class="w-full text-[10px] sm:text-xs">
						<thead class="sticky top-0 bg-[#09090b] shadow-sm">
							<tr class="border-b border-[#27272a]">
								<th class="text-left py-2 text-[#A1A1AA] font-medium px-1">Hora</th>
								<th class="text-left py-2 text-[#A1A1AA] font-medium px-1">Mercado</th>
								<th class="text-left py-2 text-[#A1A1AA] font-medium px-1">Tipo</th>
								<th class="text-right py-2 text-[#A1A1AA] font-medium px-1">Entrada</th>
								<th class="text-right py-2 text-[#A1A1AA] font-medium px-1">Saída</th>
								<th class="text-right py-2 text-[#A1A1AA] font-medium px-1">Inv.</th>
								<th class="text-right py-2 text-[#A1A1AA] font-medium px-1">Res.</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(op, idx) in dailyTrades" :key="idx" class="border-b border-[#27272a]/50 hover:bg-[#27272a]/20">
								<td class="py-2 px-1 font-mono text-[#A1A1AA] text-left">{{ formatToSPTime(op.time) }}</td>
								<td class="py-2 px-1 text-[#FAFAFA] text-left truncate max-w-[50px] sm:max-w-none">{{op.market}}</td>
								<td class="py-2 px-1 text-left">
                                    <span class="px-1.5 py-0.5 rounded-md text-[9px] font-bold"
                                        :class="op.contract === 'DIGITMATCH' ? 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'">
                                        {{ op.contract }}
                                    </span>
                                </td>
								<td class="py-2 px-1 text-right tabular-nums text-[#FAFAFA]">${{op.entry}}</td>
								<td class="py-2 px-1 text-right tabular-nums text-[#FAFAFA]">${{op.exit}}</td>
								<td class="py-2 px-1 text-right tabular-nums text-[#FAFAFA]">${{op.stake.toFixed(2)}}</td>
								<td class="py-2 px-1 text-right tabular-nums font-semibold" :class="op.profit >= 0 ? 'text-green-500' : 'text-red-500'">{{op.result}}</td>
							</tr>
                            <tr v-if="dailyTrades.length === 0">
                                <td colspan="7" class="py-8 text-center text-[#A1A1AA] text-xs">Nenhuma operação neste dia.</td>
                            </tr>
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
					<h3 class="text-xl font-bold text-[#FAFAFA] mb-1">{{ stopStatusData.title }}</h3>
					<p class="text-[#A1A1AA] text-sm">{{ stopStatusData.description }}</p>
				</div>

				<div class="w-full bg-[#1a1a1a] rounded-lg p-4 custom-border-card mt-2">
					<div class="flex justify-between items-center mb-2">
						<span class="text-xs text-[#A1A1AA] uppercase font-bold">Resultado da Sessão</span>
						<span class="text-xs text-[#A1A1AA]">{{ currentDate }}</span>
					</div>
					<div class="text-2xl font-bold tabular-nums" :class="(sessionStats?.netProfit || 0) >= 0 ? 'text-green-500' : 'text-red-500'">
						{{ (sessionStats?.netProfit || 0) >= 0 ? '+' : '' }}${{ (sessionStats?.netProfit || 0).toFixed(2) }}
					</div>
				</div>

				<button @click="closeStopStatusModal" class="w-full bg-[#FAFAFA] text-black hover:bg-[#e4e4e7] font-bold py-3 rounded-lg transition-colors text-sm mt-2">
					Entendi
				</button>
			</div>
		</div>
	</div>
    </Teleport>

	<!-- Modal de Stop (Novos) -->
	<StopLossModal v-if="showNewStopLossModal" @close="showNewStopLossModal = false" />
	<TargetProfitModal v-if="showNewTargetProfitModal" @close="showNewTargetProfitModal = false" />
	<StopBlindadoModal v-if="showNewStopBlindadoModal" @close="showNewStopBlindadoModal = false" />
	
	<!-- Novos Modais de Ajuste de Precisão -->
	<StopLossAjusteModal 
		:visible="showStopLossAjusteModal" 
		:result="sessionStats?.netProfit || 0"
		@confirm="handleConfirmStopAjuste" 
	/>
	<StopBlindadoAjusteModal 
		:visible="showStopBlindadoAjusteModal" 
		:result="sessionStats?.netProfit || 0"
		@confirm="handleConfirmStopAjuste" 
	/>
</template>

<script>
	import { createChart, ColorType } from 'lightweight-charts';
	import AutonomousAgentLogs from './AutonomousAgentLogs.vue';

	export default {
		name: 'AgenteAutonomoPanel',
		components: {
			AutonomousAgentLogs,
			StopLossModal: () => import('@/components/StopLossModal.vue'),
			TargetProfitModal: () => import('@/components/TargetProfitModal.vue'),
			StopBlindadoModal: () => import('@/components/StopBlindadoModal.vue'),
			StopLossAjusteModal: () => import('@/components/StopLossAjusteModal.vue'),
			StopBlindadoAjusteModal: () => import('@/components/StopBlindadoAjusteModal.vue')
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
				showNewStopLossModal: false,
				showNewTargetProfitModal: false,
				showNewStopBlindadoModal: false,
				showStopLossAjusteModal: false,
				showStopBlindadoAjusteModal: false,
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
				showStopLossModal: false,
				
				// Novas propriedades para o layout redesenhado
				showDatePicker: false,
				selectedPeriod: 'session',
				dateOptions: [
					{ label: 'Sessão Atual', value: 'session' },
					{ label: 'Hoje', value: 'today' },
					{ label: 'Ontem', value: 'yesterday' },
					{ label: 'Últimos 7 dias', value: '7d' },
					{ label: 'Últimos 30 dias', value: '30d' },
					{ label: 'Mês Atual', value: 'thisMonth' },
					{ label: 'Mês Passado', value: 'lastMonth' },
				],
				weeklyData: [],
				dailyData: [],
			dailyTrades: [],
			agentConfig: null,

				// Agent Switcher
				showAgentSwitcher: false,
				runningAgents: [

					{ 
						id: 'falcon', 
						title: 'Falcon', 
						emoji: '🦅', 
						description: 'Análise: Momentum Direcional (Rise/Fall)\nAssertividade: 53% a 65%\nRetorno: 92%',
						winRate: 53,
						style: 'Momentum'
					},
					{ 
						id: 'zeus', 
						title: 'Zeus', 
						emoji: '⚡', 
						description: 'Análise: 8 Filtros Estatísticos + Troca de Contrato\nAssertividade: 95% a 98%\nRetorno: 70% / 800%',
						winRate: 95,
						style: 'Estatístico'
					}
				],
				hideValues: false,
				pollingInterval: null
			};
		},
		mounted() {
			window.addEventListener('click', this.closeDropdownsOnClickOutside);
			
			if (this.abaAtiva === 'grafico') {
				this.$nextTick(() => {
					this.initIndexChart();
					// Buscar dados iniciais
					this.fetchAllStats();
					
					// Iniciar Polling (5 segundos)
					this.pollingInterval = setInterval(() => {
						this.fetchAllStats();
					}, 5000);
				});
			}
		},
		beforeUnmount() {
			window.removeEventListener('click', this.closeDropdownsOnClickOutside);
			if (this.pollingInterval) {
				clearInterval(this.pollingInterval);
			}
		},
		computed: {
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
				return this.agentConfig?.initialStake || 0;
			},
			finalCapital() {
				return (this.agentConfig?.initialBalance || 0) + this.periodProfit;
			},
			periodProfit() {
				return this.sessionStats?.netProfit || 0;
			},
			periodProfitPercent() {
				const startBalance = this.agentConfig?.initialBalance || 0;
				if (startBalance <= 0) return 0;
				return (this.periodProfit / startBalance) * 100;
			},
			avgDailyProfit() {
				// Lucro médio por dia referente à sessão atual: lucro da sessão / dias executando
				if (!this.agentConfig || !this.agentConfig.sessionDate) {
					// Fallback se não tiver sessionDate
					return this.periodProfit; 
				}
				
				const sessionStart = new Date(this.agentConfig.sessionDate);
				const now = new Date();
				
				// Diferença em milissegundos
				const diffTime = Math.abs(now - sessionStart);
				// Converter para dias (arredondando para cima, mínimo 1 dia)
				const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
				
				return this.periodProfit / diffDays;
			},
	avgProfitPerOp() {
		// Calculate average profit per operation
		const totalOps = this.sessionStats?.totalTrades || 0;
		if (totalOps === 0) return 0;
		return this.periodProfit / totalOps;
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
					return {
						...this.selectedDay,
						profit: this.sessionStats?.netProfit || 0,
                        ops: this.sessionStats?.totalTrades || 0,
                        winRate: this.sessionStats?.winRate || 0,
                        capital: (this.agentConfig?.initialBalance || 0) + (this.sessionStats?.netProfit || 0),
					};
				}
				
				// Se não for hoje, retorna dados estáticos
				return this.selectedDay;
			}
		},
		watch: {
			'agenteData.accountBalance'() { this.$forceUpdate(); },
			selectedPeriod() {
				// Atualizar dados quando o filtro mudar
				this.fetchProfitEvolution();
			},
			'agenteData.sessionStatus'(newStatus) {
				// Apenas logar, o modal agora é controlado exclusivamente pelos LOGS (checkLogsForStopEvents)
				if (newStatus && newStatus !== 'active') {
					console.log('[AgenteAutonomo] Session Status Inativo detectado:', newStatus);
				}
			},
            'sessionStats.evolution': {
                immediate: true,
                handler(newEvolution) {
                    if (this.selectedPeriod === 'session' && newEvolution && newEvolution.length > 0) {
                        console.log('[AgenteAutonomo] 📈 Atualizando gráfico via sessionStats.evolution:', newEvolution.length, 'pontos');
                        this.updateIndexChart(newEvolution);
                    }
                }
            },
            realtimeLogs: {
                deep: true,
                handler(newLogs) {
                    if (newLogs && newLogs.length > 0) {
                        this.checkLogsForStopEvents(newLogs);
                    }
                }
            }
		},
		methods: {
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
					.replace(/Assertividade:/g, '<span style="color: white; font-weight: bold;">Assertividade:</span>')
					.replace(/Retorno:/g, '<span style="color: white; font-weight: bold;">Retorno:</span>');
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
                    crosshair: {
                        mode: 1, // CrosshairMode.Normal
                        vertLine: {
                            color: 'rgba(34, 197, 94, 0.5)',
                            width: 1,
                            style: 3,
                            labelBackgroundColor: '#22c55e',
                        },
                        horzLine: {
                            color: 'rgba(34, 197, 94, 0.5)',
                            width: 1,
                            style: 3,
                            labelBackgroundColor: '#22c55e',
                        },
                    },
				});

                console.log('[AgenteAutonomo] Gráfico criado com sucesso');

				this.indexChartSeries = this.indexChart.addLineSeries({
					color: 'rgba(34, 197, 94, 1)',
					lineWidth: 2,
                    crosshairMarkerVisible: true,
                    crosshairMarkerRadius: 4,
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
                
                // Limpar trades anteriores enquanto carrega
                this.dailyTrades = [];

                try {
                    // Use fullDate if available (YYYY-MM-DD), otherwise fallback (might fail if not standard)
                    const dateQuery = day.fullDate || 'today';
                    console.log('[AgenteAutonomo] Buscando daily-trades para:', dateQuery);
                    
					const apiBase = process.env.VUE_APP_API_BASE_URL || "https://iazenix.com/api";
                    const url = `${apiBase}/autonomous-agent/daily-trades/${userId}?date=${dateQuery}`;
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
					console.log('[AgenteAutonomo] Buscando stats diários em:', `${apiBase}/autonomous-agent/daily-stats/${userId}?days=30`);
					const url = `${apiBase}/autonomous-agent/daily-stats/${userId}?days=30`;
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

			async fetchWeeklyStats() {
				const userId = this.getUserId();
				console.log('[AgenteAutonomo] fetchWeeklyStats chamado para user:', userId);
				if (!userId) return;

				try {
					const apiBase = process.env.VUE_APP_API_BASE_URL || "https://iazenix.com/api";
					const url = `${apiBase}/autonomous-agent/weekly-stats/${userId}?weeks=10`;
					console.log('[AgenteAutonomo] Buscando stats semanais em:', url);
					
					const response = await fetch(url, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					});

					console.log('[AgenteAutonomo] Weekly Stats Response Status:', response.status);

					if (response.ok) {
						const result = await response.json();
						console.log('[AgenteAutonomo] weekly-stats resultado:', result);
						if (result.success && result.data) {
							this.weeklyData = result.data;
						}
					} else {
						console.error('[AgenteAutonomo] Erro na resposta de weekly-stats:', response.status);
					}
				} catch (error) {
					console.error("[AgenteAutonomo] Erro ao buscar stats semanais:", error);
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
				if (this.selectedPeriod === 'thisMonth') days = new Date().getDate();
				if (this.selectedPeriod === 'lastMonth') days = 60; // Approximate fallback

				try {
					const apiBase = process.env.VUE_APP_API_BASE_URL || "https://iazenix.com/api";
                    
                    if (this.selectedPeriod === 'session') {
                        url = `${apiBase}/autonomous-agent/session-evolution/${userId}`;
                    } else {
                        url = `${apiBase}/autonomous-agent/profit-evolution/${userId}?days=${days}`;
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
                            // Log chart data in readable format for inspection
                            const debugData = result.data.map(d => {
                                // Convert timestamp/string to readable time
                                let timeStr = d.time;
                                if (typeof d.time === 'number') {
                                    // Timestamp
                                    const date = new Date(d.time * 1000);
                                    timeStr = date.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
                                }
                                return `${timeStr}: ${d.value}`;
                            });
                            console.log('[AgenteAutonomo] 📊 Dados do Gráfico (Time: Value):', debugData.join(' | '));
							// Se days <= 1, time vem como timestamp number. Se > 1, vem como string YYYY-MM-DD
							const formattedData = result.data.map(point => ({
								time: point.time,
								value: point.value
							}));
							this.updateIndexChart(formattedData);
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
				if (this.showAgentSwitcher && !event.target.closest('.relative.flex-1')) {
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
				this.showAgentSwitcher = false;
				// Implementation would go here - likely emitting an event or navigating
			},
			goToConfiguration() {
				// Navigate to configuration page
				this.$router.push('/autonomous-agent/config');
				this.showAgentSwitcher = false;
			},
            
            /**
             * ✅ Verifica os logs recentes para detectar mensagens de stop
             * Garante que o modal seja mostrado mesmo se o sessionStatus do polling demorar
             */
            checkLogsForStopEvents(logs) {
                if (!logs || logs.length === 0) return;
                
                // Verificar os últimos 10 logs (mais recentes)
                const recentLogs = logs.slice(0, 10);
                
                // 1. STOP BLINDADO ATINGIDO (Extreme Strict Mode)
                const hasBlindadoHit = recentLogs.some(log => 
                    log.message && (
                        log.message.trim().includes('🛡️ STOP BLINDADO ATINGIDO!')
                    )
                );
                
                if (hasBlindadoHit) {
                    if (!this.showNewStopBlindadoModal && !this.showNewStopLossModal && !this.showStopBlindadoAjusteModal) {
                        console.log('[AgenteAutonomo] 🛡️ [Logs] Exact Hit detected!');
                        
                        // Verificar se é por ajuste de entrada
                        const isAjuste = recentLogs.some(log => 
                            log.message && log.message.includes('STOP BLINDADO ATINGIDO POR AJUSTE DE ENTRADA!')
                        );
                        
                        if (isAjuste) {
                            this.showStopBlindadoAjusteModal = true;
                        } else {
                            this.showNewStopBlindadoModal = true;
                        }
                    }
                }
                
                // 2. STOP LOSS NORMAL (Avoiding collision with Blindado)
                const hasNormalStopLossMessage = recentLogs.some(log => 
                    log.message && (
                        log.message.includes('STOP LOSS ATINGIDO') ||
                        log.message.includes('STOP LOSS REACHED') ||
                        (log.message.includes('STOP LOSS') && !log.message.includes('BLINDADO') && log.message.includes('ATINGIDO'))
                    )
                );
                
                if (hasNormalStopLossMessage) {
                    if (!this.showNewStopLossModal && !this.showNewStopBlindadoModal && !this.showStopLossAjusteModal) {
                        console.log('[AgenteAutonomo] 🛑 [Logs] Stop Loss detectado!');
                        
                        // Verificar se é por ajuste de entrada
                        const isAjuste = recentLogs.some(log => 
                            log.message && log.message.includes('STOP LOSS ATINGIDO POR AJUSTE DE ENTRADA!')
                        );
                        
                        if (isAjuste) {
                            this.showStopLossAjusteModal = true;
                        } else {
                            this.showNewStopLossModal = true;
                        }
                    }
                }

                // 3. META DE LUCRO ATINGIDA
                const hasProfitMessage = recentLogs.some(log => 
                    log.message && (
                        log.message.includes('META DE LUCRO ATINGIDA') ||
                        log.message.includes('META ATINGIDA')
                    )
                );

                if (hasProfitMessage) {
                    if (!this.showNewTargetProfitModal) {
                        console.log('[AgenteAutonomo] 🎯 [Logs] Meta de Lucro detectada!');
                        this.showNewTargetProfitModal = true;
                    }
                }
            },
			handleConfirmStopAjuste() {
				this.showStopLossAjusteModal = false;
				this.showStopBlindadoAjusteModal = false;
				this.pausarAgenteEIrParaTopo();
			},
			fetchAllStats() {
				this.fetchAgentConfig(); 
				this.fetchProfitEvolution();
				this.fetchDailyStats();
				this.fetchWeeklyStats();
				// Se modal aberto, atualiza detalhes
				if (this.selectedDay && this.selectedDay.fullDate === new Date().toISOString().split('T')[0]) {
					this.fetchDailyDetails(this.selectedDay);
				}
			}
		},
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
