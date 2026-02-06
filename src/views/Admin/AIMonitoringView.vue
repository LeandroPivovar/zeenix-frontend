<template>
    <div class="dashboard-layout">
        <div v-if="isSidebarOpen && isMobile" class="sidebar-overlay" @click="closeSidebar"></div>
        
        <AppSidebar 
            :is-open="isSidebarOpen" 
            :is-collapsed="isSidebarCollapsed" 
            :is-mobile="isMobile" 
            @close-sidebar="closeSidebar" 
            @toggle-collapse="toggleSidebarCollapse" 
            @open-settings="showSettingsModal = true" 
        />

        <div class="dashboard-content-wrapper" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
            <TopNavbar 
                :is-sidebar-collapsed="isSidebarCollapsed"
                :balance="monitoringStats.balance"
                :account-type="accountType"
                :balances-by-currency-real="balancesByCurrencyReal"
                :balances-by-currency-demo="balancesByCurrencyDemo"
                :currency-prefix="preferredCurrencyPrefix"
                @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
                @toggle-sidebar-collapse="toggleSidebarCollapse"
                @open-settings="showSettingsModal = true"
            />

            <main class="flex-1 overflow-auto flex flex-col justify-start w-full" 
                  :style="{ padding: isMobile ? '5rem 1rem 8rem 1rem' : '5rem 2rem' }">
                <!-- Header Stats Card -->
                <div class="w-full bg-gradient-to-br from-secondary/60 via-secondary/40 to-secondary/20 rounded-2xl border border-border/30 p-4 md:p-6 lg:p-8 relative overflow-hidden fade-in shadow-2xl shadow-black/40">
                    <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                        <div class="absolute w-1 h-1 rounded-full bg-success/30" style="top: 20%; left: 15%; animation: float-particle 8s ease-in-out 0s infinite;"></div>
                        <div class="absolute w-0.5 h-0.5 rounded-full bg-success/20" style="top: 60%; left: 40%; animation: float-particle 10s ease-in-out 2s infinite;"></div>
                        <div class="absolute w-1 h-1 rounded-full bg-success/25" style="top: 40%; right: 20%; animation: float-particle 9s ease-in-out 1s infinite;"></div>
                    </div>
                    
                    <div class="absolute top-0 left-4 right-4 md:left-8 md:right-8 h-px bg-gradient-to-r from-transparent via-success/30 to-transparent"></div>
                    
                    <div class="relative grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-4 md:gap-5 lg:gap-6 items-center">
                        <!-- Strategy Info -->
                        <div class="col-span-2 md:col-span-3 lg:col-span-3 flex items-center gap-3 lg:gap-4">
                            <div class="relative flex-shrink-0">
                                <div class="absolute inset-0 rounded-full bg-success/30 blur-2xl scale-[2]"></div>
                                <div class="absolute inset-0 rounded-full bg-success/15 blur-xl scale-[1.5]"></div>
                                <div class="relative w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-gradient-to-br from-success/20 to-success/5 border border-success/30 flex items-center justify-center backdrop-blur-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity w-6 h-6 lg:w-8 lg:h-8 text-success drop-shadow-[0_0_8px_hsl(142,76%,45%,0.5)]"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path></svg>
                                    <div class="absolute inset-0 rounded-full border border-success/20 animate-ping" style="animation-duration: 3s;"></div>
                                </div>
                                <div class="absolute w-1.5 h-1.5 rounded-full bg-success/60 animate-pulse" style="top: -4px; right: 4px;"></div>
                                <div class="absolute w-1 h-1 rounded-full bg-success/40 animate-pulse" style="bottom: 4px; left: -2px; animation-delay: 1s;"></div>
                            </div>
                            <div class="flex flex-col min-w-0">
                                <div class="flex items-center gap-2 lg:gap-2.5 mb-1">
                                    <span class="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-success animate-pulse shadow-[0_0_8px_hsl(142,76%,45%,0.6)]"></span>
                                    <span class="text-lg lg:text-3xl font-black text-success tracking-tighter drop-shadow-[0_0_12px_hsl(142,76%,45%,0.4)] uppercase">
                                        IA {{ currentConfig.strategy }}
                                    </span>
                                </div>
                                <div class="h-5 overflow-hidden">
                                    <p class="text-[10px] lg:text-xs text-foreground/90 font-medium transition-all duration-300 opacity-100 translate-y-0 uppercase tracking-widest">
                                        {{ iaStatusDisplay }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="col-span-1 md:col-span-3 lg:col-span-2 text-center md:border-l border-border/50 md:pl-4 lg:pl-6">
                            <p class="text-[9px] lg:text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Capital</p>
                            <p class="text-xl lg:text-3xl font-bold text-foreground tracking-tight">
                                {{ preferredCurrencyPrefix }} {{ Math.floor(monitoringStats.balance).toLocaleString('pt-BR') }},{{ (monitoringStats.balance % 1).toFixed(2).split('.')[1] || '00' }}
                            </p>
                        </div>

                        <!-- Resultado -->
                        <div class="col-span-1 md:col-span-3 lg:col-span-2 text-center border-l border-border/50 pl-3 lg:pl-6 flex flex-col items-center">
                            <p class="text-[9px] lg:text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Resultado</p>
                            <div class="flex items-baseline justify-center gap-1 lg:gap-3">
                                <p class="text-2xl lg:text-4xl font-bold tracking-tight drop-shadow-[0_0_20px_hsl(142,76%,45%,0.3)]"
                                   :class="monitoringStats.profit >= 0 ? 'text-success' : 'text-red-500'">
                                    {{ monitoringStats.profit >= 0 ? '+' : '' }}{{ preferredCurrencyPrefix }}{{ monitoringStats.profit.toFixed(2).replace('.', ',') }}
                                </p>
                                <span class="text-xs lg:text-lg font-semibold px-2 py-0.5 rounded-lg border hidden md:inline"
                                      :class="monitoringStats.profit >= 0 ? 'text-success/90 bg-success/10 border-success/20' : 'text-red-500/90 bg-red-500/10 border-red-500/20'">
                                    {{ monitoringStats.profit >= 0 ? '+' : '' }}{{ ((monitoringStats.profit / (monitoringStats.initialBalance || 1)) * 100).toFixed(2) }}%
                                </span>
                            </div>
                            <div class="mt-2 lg:mt-3 h-1 w-[100px] mx-auto bg-gradient-to-r rounded-full line-grow hidden md:block"
                                 :class="monitoringStats.profit >= 0 ? 'from-success/70 via-success/40 to-transparent' : 'from-red-500/70 via-red-500/40 to-transparent'"></div>
                        </div>

                        <!-- Operations Stats -->
                        <div class="col-span-2 md:col-span-3 lg:col-span-3 border-t md:border-t-0 md:border-l border-border/50 pt-4 md:pt-0 md:pl-4 lg:pl-6 mt-2 md:mt-0">
                            <p class="text-[9px] lg:text-[10px] text-muted-foreground uppercase tracking-widest mb-2 lg:mb-3">Operações</p>
                            <div class="flex items-center justify-between md:justify-start gap-3 lg:gap-4 text-sm">
                                <div class="text-center">
                                    <span class="text-lg lg:text-xl font-semibold text-foreground/90">{{ monitoringStats.wins + monitoringStats.losses }}</span>
                                    <span class="text-[10px] lg:text-xs text-muted-foreground block">Total</span>
                                </div>
                                <span class="text-muted-foreground/30 text-lg lg:text-xl hidden md:inline">·</span>
                                <div class="text-center">
                                    <span class="text-lg lg:text-xl font-semibold text-success/90">{{ monitoringStats.wins }}</span>
                                    <span class="text-[10px] lg:text-xs text-muted-foreground block">Win</span>
                                </div>
                                <span class="text-muted-foreground/30 text-lg lg:text-xl hidden md:inline">·</span>
                                <div class="text-center">
                                    <span class="text-lg lg:text-xl font-semibold text-red-500/60">{{ monitoringStats.losses }}</span>
                                    <span class="text-[10px] lg:text-xs text-muted-foreground block">Loss</span>
                                </div>
                                <span class="text-muted-foreground/30 text-lg lg:text-xl hidden md:inline">·</span>
                                <div class="text-center">
                                    <span class="text-lg lg:text-xl font-semibold text-success/90">
                                        {{ monitoringStats.wins + monitoringStats.losses > 0 ? ((monitoringStats.wins / (monitoringStats.wins + monitoringStats.losses)) * 100).toFixed(0) : 0 }}%
                                    </span>
                                    <span class="text-[10px] lg:text-xs text-muted-foreground block">Winrate</span>
                                </div>
                            </div>
                        </div>

                        <!-- Execution Time -->
                        <div class="col-span-2 md:col-span-3 lg:col-span-2 border-t md:border-t-0 md:border-l border-border/50 pt-4 md:pt-0 md:pl-4 lg:pl-6 mt-2 md:mt-0 flex flex-col items-center justify-center">
                            <p class="text-[9px] lg:text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Tempo de Execução</p>
                            <div class="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                <p class="text-xl lg:text-2xl font-bold text-white tracking-tight tabular-nums">
                                    {{ executionTime }}
                                </p>
                            </div>
                        </div>

                        <!-- Mobile Pause Button (Inside Card) -->
                        <div v-if="isMobile" class="col-span-2 mt-4">
                            <button @click="isSessionFinished ? restartIA() : stopIA()" :disabled="isStopping && !isSessionFinished" class="w-full py-4 bg-[#FCD34D] hover:bg-[#FBBF24] text-black font-black uppercase tracking-widest text-[11px] rounded-2xl transition-all duration-300 active:scale-[0.98] disabled:opacity-50">
                                {{ isSessionFinished ? 'Reiniciar IA' : (isStopping ? 'Parando...' : 'Pausar IA') }}
                            </button>
                        </div>

                    </div>
                </div>




                <!-- Mobile Configuration Cards Stack (Visible only on Mobile) -->


                <!-- Main Content Layout (70/30 Split on Desktop, stack on Mobile) -->
                <div class="mt-4 md:mt-6 lg:mt-8 flex flex-col lg:flex-row gap-4 lg:gap-6 w-full flex-1">
                    <!-- Left Column: Tabs & Content (Chart/History/Logs) -->
                    <div class="w-full lg:w-[72%] card-glass rounded-2xl border border-border/50 p-4 md:p-6 lg:p-8 fade-in-delay-1 gradient-border flex flex-col">
                        <div class="w-full flex-1 flex flex-col">
                            <!-- Custom Tabs -->
                            <div class="flex items-center justify-start text-muted-foreground border-b border-border mb-6 gap-6 h-auto p-0">
                                <button v-if="isMobile" @click="activeMonitoringTab = 'config'" :class="{ 'border-success text-success': activeMonitoringTab === 'config' }" class="inline-flex items-center justify-center py-1.5 text-sm font-medium border-b-2 border-transparent px-0 pb-3 transition-colors hover:text-foreground">
                                    Config
                                </button>
                                <button @click="activeMonitoringTab = 'chart'" :class="{ 'border-success text-success': activeMonitoringTab === 'chart' }" class="inline-flex items-center justify-center py-1.5 text-sm font-medium border-b-2 border-transparent px-0 pb-3 transition-colors hover:text-foreground">
                                    Gráfico
                                </button>
                                <button @click="activeMonitoringTab = 'history'" :class="{ 'border-success text-success': activeMonitoringTab === 'history' }" class="inline-flex items-center justify-center py-1.5 text-sm font-medium border-b-2 border-transparent px-0 pb-3 transition-colors hover:text-foreground">
                                    Histórico
                                </button>
                                <button @click="activeMonitoringTab = 'logs'" :class="{ 'border-success text-success': activeMonitoringTab === 'logs' }" class="inline-flex items-center justify-center py-1.5 text-sm font-medium border-b-2 border-transparent px-0 pb-3 transition-colors hover:text-foreground">
                                    Registros
                                </button>
                            </div>

                            <!-- Config Tab (Mobile Only) -->
                            <div v-show="activeMonitoringTab === 'config' && isMobile" class="animate-fadeIn flex-1 flex flex-col space-y-4">
                                <!-- Card 1: AI Identity -->

                                <div class="p-4 bg-secondary/40 rounded-2xl border border-border/40 flex items-center gap-4 w-full">
                                    <div class="w-14 h-14 rounded-xl bg-success/10 border border-success/30 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-success"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"></path><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"></path><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"></path></svg>
                                    </div>
                                    <div>
                                        <h3 class="text-lg font-black text-foreground tracking-wide uppercase">Configuração Ativa</h3>
                                        <p class="text-xs text-muted-foreground">Resumo</p>
                                    </div>
                                </div>

                                <!-- Card 2: Strategy Mode -->
                                <div class="p-5 bg-secondary/40 rounded-2xl border border-border/40 space-y-4 w-full">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path></svg>
                                            <span class="text-xs text-muted-foreground font-black uppercase tracking-wider">Modo</span>
                                        </div>
                                        <span class="text-sm font-black text-foreground uppercase tracking-wider">{{ currentConfig.mode }}</span>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                                            <span class="text-xs text-muted-foreground font-black uppercase tracking-wider">Gestão</span>
                                        </div>
                                        <span class="text-sm font-black text-foreground uppercase tracking-wider">{{ currentConfig.modoMartingale || 'Moderado' }}</span>
                                    </div>
                                </div>

                                <!-- Card 3: Parameters -->
                                <div class="p-5 bg-secondary/40 rounded-2xl border border-border/40 space-y-4 w-full">
                                    <div class="flex items-center justify-between">
                                        <span class="text-xs text-muted-foreground font-black uppercase tracking-wider">Entrada</span>
                                        <span class="text-sm font-black text-foreground tracking-wider">{{ currencySymbol }}{{ currentConfig.stake.toFixed(2).replace('.', ',') }}</span>
                                    </div>
                                    <div class="flex items-center justify-between pt-1 border-t border-border/10 mt-1">
                                        <span class="text-xs text-muted-foreground font-black uppercase tracking-wider">Alvo</span>
                                        <span class="text-sm font-black text-success tracking-wider">{{ currencySymbol }}{{ (currentConfig.profitTarget || 0).toFixed(2).replace('.', ',') }}</span>
                                    </div>
                                    <div class="flex items-center justify-between pt-1 border-t border-border/10 mt-1">
                                        <span class="text-xs text-muted-foreground font-black uppercase tracking-wider">Limite</span>
                                        <span class="text-sm font-black text-foreground tracking-wider">{{ currencySymbol }}{{ (currentConfig.lossLimit || 0).toFixed(2).replace('.', ',') }}</span>
                                    </div>
                                    <div class="flex items-center justify-between pt-1 mt-1">
                                        <span class="text-xs text-muted-foreground font-black uppercase tracking-wider">Stop Blindado</span>
                                        <span class="text-xs font-black uppercase tracking-widest" :class="currentConfig.stoplossBlindado ? 'text-success' : 'text-muted-foreground'">{{ currentConfig.stoplossBlindado ? 'ATIVO' : 'INATIVO' }}</span>
                                    </div>
                                </div>

                                <!-- Mobile History Button -->
                                <button @click="showHistoryModal = true" 
                                        class="w-full py-4 bg-secondary/40 hover:bg-secondary/60 border border-border/40 rounded-2xl flex items-center justify-center gap-2 group transition-all duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-success"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                                    <span class="text-xs font-black text-success uppercase tracking-widest">Histórico Completo</span>
                                </button>


                            </div>

                            <!-- Chart Tab -->

                            <div v-show="activeMonitoringTab === 'chart'" class="space-y-6 animate-fadeIn flex-1 flex flex-col">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <h3 style="font-size: 18px; color: #FFFFFF;" class="font-bold tracking-tight">
                                                {{ activeChartMode === 'profit' ? `Evolução do Resultado da IA ${currentConfig.strategy.toUpperCase()}` : 'Movimentação do Mercado (Ticks)' }}
                                            </h3>
                                            <p style="font-size: 14px; color: #a6a6a6;" class="mt-1">
                                                {{ activeChartMode === 'profit' ? 'Desempenho financeiro em tempo real' : `Monitorando ${currentConfig.market || 'R_100'} em tempo real` }}
                                            </p>
                                        </div>
                                        <div class="flex items-center gap-2 bg-secondary/20 p-1 rounded-lg border border-border/20">
                                            <button 
                                                @click="activeChartMode = 'profit'"
                                                :class="activeChartMode === 'profit' ? 'bg-success/20 text-success border-success/30' : 'text-muted-foreground hover:text-white border-transparent'"
                                                class="px-3 py-1 text-xs font-bold rounded-md border transition-all"
                                            >
                                                Resultado ({{ currencySymbol }})
                                            </button>
                                            <button 
                                                @click="activeChartMode = 'tick'"
                                                :class="activeChartMode === 'tick' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'text-muted-foreground hover:text-white border-transparent'"
                                                class="px-3 py-1 text-xs font-bold rounded-md border transition-all"
                                            >
                                                Ticks (Preço)
                                            </button>
                                        </div>
                                    </div>
                                    <div class="flex-1 min-h-80 w-full bg-secondary/10 rounded-xl border border-border/20 px-0 py-4 relative overflow-hidden">
                                        <div class="relative w-full h-[320px]">
                                    <div v-show="activeChartMode === 'profit'" class="w-full h-full relative" ref="profitChartContainer">
                                        <LightweightLineChart
                                            ref="profitChart"
                                            :data="profitChartData"
                                            :markers="profitChartMarkers"
                                            :color="monitoringStats.profit >= 0 ? '#22C55E' : '#EF4444'"
                                            :height="320" 
                                            :currencySymbol="preferredCurrencyPrefix"
                                        />
                                    </div>
                                    <div v-show="activeChartMode === 'tick'"
                                         ref="chartContainer"
                                         class="w-full h-[320px] rounded-lg overflow-hidden relative"
                                    ></div>
                                    
                                </div>        
                                
                                <div v-if="(activeChartMode === 'profit' && profitChartData.length <= 1) || (activeChartMode === 'tick' && tickHistory.length === 0)" 
                                     class="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[2px] z-10 transition-opacity duration-500 pointer-events-none">
                                    <div class="text-center pointer-events-auto">
                                       <i class="fas fa-chart-line text-5xl text-muted-foreground/20 mb-4 block animate-bounce"></i>
                                       <p class="text-muted-foreground text-sm font-medium">Aguardando dados...</p>
                                   </div>
                                </div>
                            </div>
                        </div>

                            <!-- History Tab -->
                            <div v-if="activeMonitoringTab === 'history'" class="animate-fadeIn flex-1 flex flex-col">
                                <div class="space-y-6">
                                    <div class="flex items-start justify-between">
                                        <div>
                                            <h3 style="font-size: 18px; color: #FFFFFF;" class="font-bold mb-1 flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock w-5 h-5 text-muted-foreground"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                                Histórico de Operações
                                            </h3>
                                            <p style="font-size: 14px; color: #a6a6a6;">Extrato oficial das operações executadas pela IA</p>
                                        </div>
                                    </div>

                                    <div class="rounded-xl border border-border/30 overflow-hidden bg-[#0B0B0B]">
                                        <!-- Desktop Table -->
                                        <div class="relative w-full overflow-auto max-h-[600px] custom-scrollbar-zenix hidden md:block">
                                            <table class="w-full text-sm border-collapse">
                                                <thead class="sticky top-0 bg-[#161616] z-10 text-xs text-muted-foreground uppercase font-semibold tracking-wider border-b border-border/30">
                                                    <tr>
                                                        <th class="px-4 py-4 text-left font-semibold">HORARIO</th>
                                                        <th class="px-4 py-4 text-left font-semibold">MERCADO</th>
                                                        <th class="px-4 py-4 text-left font-semibold">ORDEM</th>
                                                        <th class="px-4 py-4 text-left font-semibold">PREÇO DE ENTRADA</th>
                                                        <th class="px-4 py-4 text-left font-semibold">PREÇO DE SAIDA</th>
                                                        <th class="px-4 py-4 text-left font-semibold">ÚLTIMO DÍGITO</th>
                                                        <th class="px-4 py-4 text-left font-semibold">INVESTIMENTO</th>
                                                        <th class="px-4 py-4 text-right font-semibold">RESULTADO</th>
                                                    </tr>
                                                </thead>
                                                <tbody class="text-[13px]">
                                                    <tr v-for="(op, index) in monitoringOperations" :key="op.id" 
                                                        class="border-b border-border/20 transition-colors hover:bg-secondary/30"
                                                        :class="index % 2 === 0 ? 'bg-transparent' : 'bg-secondary/10'">
                                                        <td class="px-4 py-4 font-mono font-medium text-foreground">{{ op.time }}</td>
                                                        <td class="px-4 py-4 text-muted-foreground font-mono">{{ op.market }}</td>
                                                        <td class="px-4 py-4">
                                                            <span class="text-foreground font-bold">{{ getContractDisplayName(op.contract) }}</span>
                                                        </td>
                                                        <td class="px-4 py-4 text-foreground font-medium">{{ op.entryPrice || '-' }}</td>
                                                        <td class="px-4 py-4 text-foreground font-medium">{{ op.exitPrice || '-' }}</td>
                                                        <td class="px-4 py-4 text-foreground font-medium font-mono text-center">{{ op.lastDigit || '-' }}</td>
                                                        <td class="px-4 py-4 text-foreground font-medium">{{ currencySymbol }} {{ op.stake.toFixed(2) }}</td>
                                                        <td class="px-4 py-4 text-right">
                                                            <span v-if="op.result === 'OPEN' || op.result === 'PENDING'" class="text-yellow-500 font-bold uppercase tracking-tight">PENDENTE</span>
                                                            <span v-else class="font-bold whitespace-nowrap" :class="op.result === 'WON' || op.result === 'WIN' ? 'text-success' : 'text-red-500'">
                                                                {{ op.result === 'WON' || op.result === 'WIN' ? '+' : '' }}{{ currencySymbol }}{{ op.pnl.toFixed(2) }}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <!-- Mobile Card View -->
                                        <div class="md:hidden max-h-[600px] overflow-auto custom-scrollbar-zenix p-3 space-y-3">
                                            <div v-for="op in monitoringOperations" :key="op.id" class="p-4 bg-secondary/15 rounded-xl border border-border/20 space-y-3">
                                                <div class="flex items-center justify-between">
                                                    <span class="text-xs font-mono text-muted-foreground font-bold">{{ op.time }}</span>
                                                    <span v-if="op.result === 'OPEN'" class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">PENDENTE</span>
                                                    <span v-else :class="op.result === 'WON' ? 'bg-success/10 text-success border-success/20' : 'bg-red-500/10 text-red-500 border-red-500/20'" 
                                                          class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase border">
                                                        {{ op.result }}
                                                    </span>
                                                </div>
                                                <div class="flex items-center justify-between">
                                                    <div class="flex flex-col">
                                                        <span class="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-0.5">Mercado / Tipo</span>
                                                        <span class="text-xs font-bold text-foreground">{{ op.market }} / {{ op.type === 'CALL' ? 'COMPRA' : 'VENDA' }}</span>
                                                    </div>
                                                </div>
                                                <div class="flex items-center justify-between pt-2 border-t border-border/10">
                                                    <div class="flex flex-col">
                                                        <span class="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-0.5">Investido</span>
                                                        <span class="text-xs font-bold text-foreground">{{ currencySymbol }} {{ op.stake.toFixed(2) }}</span>
                                                    </div>
                                                    <div class="flex flex-col items-end">
                                                        <span class="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-0.5">Resultado</span>
                                                        <span v-if="op.result === 'OPEN'" class="text-xs font-bold text-muted-foreground">-</span>
                                                        <span v-else class="text-xs font-black" :class="op.result === 'WON' ? 'text-success' : 'text-red-500'">
                                                            {{ op.result === 'WON' ? '+' : '' }}{{ profitCurrencySymbol }}{{ op.pnl.toFixed(2) }}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <tr v-if="monitoringOperations.length === 0">
                                            <div class="text-center py-20 text-muted-foreground/30 uppercase text-[10px] font-black tracking-[0.2em]">
                                                Aguardando primeira operação...
                                            </div>
                                        </tr>
                                    </div>
                                    <div class="flex items-center justify-between text-xs text-muted-foreground/60 pt-2">
                                        <span>Atualizado em tempo real</span>
                                        <span>Sessão iniciada às {{ sessionStartTime || '09:30' }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Logs Tab -->
                            <div v-if="activeMonitoringTab === 'logs'" class="animate-fadeIn">
                                <!-- Mobile Logs Header -->
                                <div v-if="isMobile" class="mb-6 space-y-4">
                                    <div class="space-y-1">
                                        <h3 style="font-size: 18px; color: #FFFFFF;" class="font-black uppercase tracking-tight">Registros da IA</h3>
                                        <p style="font-size: 14px; color: #a6a6a6;">Acompanhe cada ação realizada pelo sistema</p>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <div class="text-[10px] text-muted-foreground/60 font-black uppercase tracking-[0.2em]">
                                            {{ monitoringLogs.length }} EVENTOS
                                        </div>
                                        <button @click="exportLogs" class="px-4 py-3 bg-success/20 hover:bg-success/30 border border-success/30 rounded-xl text-[10px] font-black uppercase tracking-widest text-success transition-all">
                                            EXPORTAR LOGS
                                        </button>
                                    </div>
                                </div>

                                <!-- Desktop Logs Header -->
                                <div v-else class="mb-8 px-1 flex items-end justify-between">
                                    <div class="space-y-1">
                                        <h3 style="font-size: 18px; color: #FFFFFF;" class="font-bold tracking-tight">Registros da IA</h3>
                                        <p style="font-size: 14px; color: #a6a6a6;">Acompanhe cada ação realizada pelo sistema</p>
                                    </div>
                                    <div class="flex flex-col items-end gap-3">
                                        <span class="text-[10px] text-muted-foreground/60 font-black uppercase tracking-[0.2em]">{{ monitoringLogs.length }} EVENTOS</span>
                                        <button @click="exportLogs" class="px-5 py-2.5 bg-success/20 hover:bg-success/30 border border-success/30 rounded-lg text-[10px] font-bold uppercase tracking-widest text-success transition-all">
                                            EXPORTAR LOGS
                                        </button>
                                    </div>
                                </div>
                                <div class="flex flex-col space-y-2 w-full max-h-[600px] overflow-y-auto custom-scrollbar-zenix pr-2">
                                    <div v-for="log in monitoringLogs" :key="log.id" class="w-full flex items-start gap-3 py-2 border-b border-border/5 hover:bg-secondary/10 transition-colors">
                                        <span class="text-[10px] font-mono text-muted-foreground/40 mt-0.5 min-w-[60px]">[{{ log.time }}]</span>
                                        <div class="w-1.5 h-1.5 rounded-full mt-1.5" 
                                             :class="{ 
                                                'bg-success shadow-[0_0_10px_#22C55E]': log.type === 'success', 
                                                'bg-red-500 shadow-[0_0_10px_#EF4444]': log.type === 'error', 
                                                'bg-blue-400 shadow-[0_0_10px_#60A5FA]': log.type === 'info', 
                                                'bg-yellow-400 shadow-[0_0_10px_#FACC15]': log.type === 'warning' 
                                             }"></div>
                                        <div class="flex-1">
                                            <h4 class="text-[10px] font-black uppercase tracking-[0.14em] mb-1"
                                                :class="{ 
                                                    'text-success': log.type === 'success', 
                                                    'text-red-500': log.type === 'error', 
                                                    'text-blue-400': log.type === 'info', 
                                                    'text-yellow-400': log.type === 'warning' 
                                                }">
                                                {{ log.title }}
                                            </h4>
                                            <ul class="space-y-0.5">
                                                <li v-for="(line, idx) in log.details.filter(l => l.toLowerCase() !== 'info')" :key="idx" class="flex items-start gap-2">
                                                    <span class="text-muted-foreground/20 text-[8px] mt-0.5">•</span>
                                                    <span class="text-[10px] font-medium text-[#d1d1d6] leading-relaxed" v-html="line"></span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div v-if="monitoringLogs.length === 0" class="text-center py-20 text-muted-foreground/30 uppercase text-[10px] font-black tracking-[0.2em]">
                                        Aguardando primeiros logs...
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Sidebar (Visible only on Desktop) -->
                    <div v-if="!isMobile" class="w-full lg:w-[28%] flex flex-col gap-4 lg:gap-6">
                        <!-- Histórico Button -->
                        <button @click="showHistoryModal = true" 
                                class="w-full py-3 px-4 rounded-xl bg-success/10 hover:bg-success/20 border border-success/30 hover:border-success/40 transition-all duration-200 flex items-center justify-center gap-2 group">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-success group-hover:scale-110 transition-transform">
                                <path d="M3 3v18h18"/>
                                <path d="m19 9-5 5-4-4-3 3"/>
                            </svg>
                            <span class="text-sm font-bold text-success uppercase tracking-wide">Histórico</span>
                        </button>

                        <div class="h-full card-glass rounded-2xl border border-border/50 p-5 flex flex-col gradient-border">
                            <!-- Header Info -->
                            <div class="p-4 rounded-xl bg-secondary/60 border border-border/60">
                                <div class="flex items-center gap-3">
                                    <div class="relative">
                                        <div class="w-11 h-11 rounded-lg bg-success/10 border border-success/30 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-brain w-5 h-5 text-success"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"></path><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"></path><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"></path><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"></path><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"></path><path d="M3.477 10.896a4 4 0 0 1 .585-.396"></path><path d="M19.938 10.5a4 4 0 0 1 .585.396"></path><path d="M6 18a4 4 0 0 1-1.967-.516"></path><path d="M19.967 17.484A4 4 0 0 1 18 18"></path></svg>
                                        </div>
                                        <div class="absolute inset-0 rounded-lg bg-success/20 blur-lg -z-10"></div>
                                    </div>
                                    <div>
                                        <h3 class="text-base font-bold text-foreground tracking-wide uppercase">Configuração Ativa</h3>
                                        <p class="text-xs text-muted-foreground">Resumo</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Mode & Risk -->
                            <div class="mt-3 p-4 rounded-xl bg-secondary/60 border border-border/60">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap w-3.5 h-3.5 text-muted-foreground"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path></svg>
                                        <span class="text-xs text-muted-foreground uppercase tracking-wider">Modo</span>
                                    </div>
                                    <span class="text-sm font-bold text-foreground uppercase">{{ currentConfig.mode }}</span>
                                </div>
                                <div class="border-t border-border/40 mt-3 pt-3 flex items-center justify-between">
                                    <div class="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-up w-3.5 h-3.5 text-muted-foreground"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                                        <span class="text-xs text-muted-foreground uppercase tracking-wider">Gestão</span>
                                    </div>
                                    <span class="text-sm font-bold text-foreground uppercase">{{ currentConfig.modoMartingale || 'Moderado' }}</span>
                                </div>
                            </div>

                            <!-- Parameters -->
                            <div class="mt-3 p-4 rounded-xl bg-secondary/60 border border-border/60 space-y-2.5">
                                <div class="flex justify-between items-center">
                                    <span class="text-xs text-muted-foreground uppercase tracking-wider">Entrada</span>
                                    <span class="text-sm font-bold text-foreground">{{ preferredCurrencyPrefix }}{{ currentConfig.stake.toFixed(2) }}</span>
                                </div>
                                <div class="border-t border-border/40 pt-2.5 flex justify-between items-center">
                                    <span class="text-xs text-muted-foreground uppercase tracking-wider">Alvo</span>
                                    <span class="text-sm font-bold text-success">{{ preferredCurrencyPrefix }}{{ (currentConfig.profitTarget || 0).toFixed(2) }}</span>
                                </div>
                                <div class="border-t border-border/40 pt-2.5 flex justify-between items-center">
                                    <span class="text-xs text-muted-foreground uppercase tracking-wider">Limite</span>
                                    <span class="text-sm font-bold text-foreground">{{ preferredCurrencyPrefix }}{{ (currentConfig.lossLimit || 0).toFixed(2) }}</span>
                                </div>
                                <div class="pt-2.5 flex justify-between items-center">
                                    <span class="text-xs text-muted-foreground uppercase tracking-wider">Stop Blindado</span>
                                    <span class="text-[10px] font-black uppercase tracking-[0.1em]" :class="currentConfig.stoplossBlindado ? 'text-success' : 'text-muted-foreground'">
                                        {{ currentConfig.stoplossBlindado ? 'ATIVO' : 'INATIVO' }}
                                    </span>
                                </div>
                            </div>

                            

                            <!-- IA EM FUNCIONAMENTO / Footer -->
                            <div class="mt-4 mb-5 relative z-10 px-1">
                                <h4 class="text-[14px] font-bold text-[#D4D4D4] uppercase mb-1 text-left">IA Em Funcionamento</h4>
                                <p class="text-[12px] text-[#AAAAAA] leading-snug text-left">
                                    Monitorando o mercado e executando apenas quando há vantagem estatística.
                                </p>
                            </div>

                            <!-- Desktop Pause Button -->
                            <div class="mt-0 px-1 pt-0">
                                <button @click="isSessionFinished ? restartIA() : stopIA()" :disabled="isStopping && !isSessionFinished" class="group flex items-center justify-center w-full h-[52px] bg-[#FCD34D] hover:bg-[#FBBF24] text-black font-black uppercase tracking-widest text-[11px] rounded-xl transition-all duration-300 active:scale-[0.98] disabled:opacity-50">
                                    <div class="flex items-center gap-3">
                                        <svg v-if="!isSessionFinished" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" class="w-4 h-4"><rect x="14" y="4" width="4" height="16" rx="1"></rect><rect x="6" y="4" width="4" height="16" rx="1"></rect></svg>
                                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                                        <span class="mt-0.5">{{ isSessionFinished ? 'Reiniciar IA' : (isStopping ? 'Parando...' : 'Pausar IA') }}</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <DesktopBottomNav />
        </div>

        <SettingsSidebar 
            :is-open="showSettingsModal" 
            :balance="balanceNumeric"
            :account-type="accountType"
            :balances-by-currency-real="balancesByCurrencyReal"
            :balances-by-currency-demo="balancesByCurrencyDemo"
            :currency-prefix="preferredCurrencyPrefix"
            @close="showSettingsModal = false"
            @account-type-changed="switchAccount"
        />

        <!-- Modals -->
        <Teleport to="body">
            <StopLossModal
                v-if="showStopModal && stopResult.type === 'error'"
                :visible="showStopModal"
                :result="stopResult.profit"
                @confirm="showStopModal = false"
            />

            <TargetProfitModal
                v-if="showStopModal && stopResult.type === 'success'"
                :visible="showStopModal"
                :result="stopResult.profit"
                @confirm="showStopModal = false"
            />

            <StopBlindadoModal
                v-if="showStopModal && stopResult.type === 'warning'"
                :visible="showStopModal"
                :result="stopResult.profit"
                @confirm="showStopModal = false"
            />

            <SessionHistoryModal
                :visible="showHistoryModal"
                :userId="getUserId()"
                @close="showHistoryModal = false"
            />
        </Teleport>
    </div>
</template>

<script>
import { toRaw } from 'vue';
import AppSidebar from '../../components/Sidebar.vue';
import TopNavbar from '../../components/TopNavbar.vue';
import DesktopBottomNav from '../../components/DesktopBottomNav.vue';
import SettingsSidebar from '../../components/SettingsSidebar.vue';
import LightweightLineChart from '@/components/LightweightLineChart.vue';
import { StrategyAnalysis } from '../../utils/StrategyAnalysis';
import { RiskManager } from '../../utils/RiskManager';
// Import strategy configurations
import apolloStrategy from '../../utils/strategies/apollo.json';
import atlasStrategy from '../../utils/strategies/atlas.json';
import nexusStrategy from '../../utils/strategies/nexus.json';
import orionStrategy from '../../utils/strategies/orion.json';
import titanStrategy from '../../utils/strategies/titan.json';
import SessionHistoryModal from '@/components/SessionHistoryModal.vue';
import StopLossModal from '../../components/StopLossModal.vue';
import TargetProfitModal from '../../components/TargetProfitModal.vue';
import StopBlindadoModal from '../../components/StopBlindadoModal.vue';
import { createChart, ColorType } from 'lightweight-charts';
import accountBalanceMixin from '../../mixins/accountBalanceMixin';

const strategyConfigs = {
	apollo: apolloStrategy,
	atlas: atlasStrategy,
	nexus: nexusStrategy,
	orion: orionStrategy,
	titan: titanStrategy
};

export default {
    name: 'AIMonitoringView',
    mixins: [accountBalanceMixin],
    components: {
        AppSidebar,
        TopNavbar,
        DesktopBottomNav,
        SettingsSidebar,
        LightweightLineChart,
        SessionHistoryModal,
        StopLossModal,
        TargetProfitModal,
        StopBlindadoModal
    },
    data() {
        return {
            // Chart State
            activeChartMode: 'profit', 
            chart: null,
            series: null,
            tickChartData: [],
            profitChartData: [{ time: Math.floor(Date.now() / 1000), value: 0 }],
            profitChartSubscribed: false,
            chartMarkers: [],
            profitChartMarkers: [],
            resizeObserver: null,

            isSidebarOpen: false,
            isSidebarCollapsed: true,
            isMobile: false,
            showSettingsModal: false,
            isStopping: false,
            activeMonitoringTab: 'chart',
            initialTabSet: false,

            // Strategy Config (loaded from local storage)
            currentConfig: {
                strategy: 'Apollo',
                stake: 0.35,
                mode: 'veloz'
            },

            // WebSocket Connection
            ws: null,
            tickSubscriptionId: null,
            isAuthorized: false,
            tickCount: 0,
            tickHistory: [],

            digitHistory: [],
            isNegotiating: false,
            pendingVirtualTrade: null,
            pauseUntil: 0, // Timeout timestamp

            retryingProposal: false, // Flag for calibration loop
            sessionId: null, // Track session ID for backend logging

           // ✅ RiskManager State (initialized with RiskManager.initSession)
            sessionState: RiskManager.initSession('VELOZ'),

            // Modal States
            showStopModal: false,
            stopResult: {
                targetProfitInput: '',
                stopLossInput: '',
                profit: 0,
                type: 'info' // 'info', 'warning', 'success'
            },
            showHistoryModal: false,

            // Timer
            executionTime: '00:00:00',
            sessionStartTime: null,
            timerInterval: null,

            // ✅ Security Configuration (Loss Virtual)
            securityConfig: {
                virtualLoss: {
                    enabled: false,
                    target: 2,
                    current: 0,
                    mode: 'warmup' // 'warmup' | 'cyclic'
                }
            },

            // ✅ Recovery Configuration
            recoveryConfig: {
                tradeType: 'DIGITUNDER',
                prediction: 4,
                duration: 1,
                durationUnit: 't',
                market: 'R_100',
                expectedPayout: 2.26, // ✅ CORRECTed: 126% profit rate (Total 2.26)
                attackFilters: [],
                pauseFilters: [],
                lossesToActivate: 1,
                riskProfile: 'moderado'
            },

            monitoringStats: {
                balance: 0,
                initialBalance: 0, // ✅ New field for ROI calculation
                profit: 0,
                wins: 0,
                losses: 0,
                status: 'Conectando...',
                statusDesc: 'Inicializando WebSocket'
            },

            monitoringLogs: [],
            monitoringOperations: [],
            profitHistory: [0], // Start with 0 profit
            activeContracts: new Map(),
            
            // Fast Result Support
            pendingFastResult: {
                active: false,
                contractId: null,
                barrier: null,
                contractType: null,
                stake: 0,
                payout: 0,
                analysisType: 'PRINCIPAL'
            }
        }
    },
    computed: {
        iaStatusDisplay() {
            if (this.activeContracts.size > 0) return 'Contrato aberto';
            
            // Se existem operações, verifica se a última foi fechada recentemente
            if (this.monitoringOperations.length > 0) {
                const lastOp = this.monitoringOperations[this.monitoringOperations.length - 1];
                if (lastOp.result === 'WON' || lastOp.result === 'LOSS' || lastOp.result === 'WIN') {
                    // Aqui poderíamos ter um timer, mas por enquanto vamos assumir que se não há contrato aberto
                    // e a última op está concluída, ela foi "fechada".
                    // Para evitar que fique preso em "Contrato fechado", podemos checar se a última op foi há pouco tempo.
                    return 'Contrato fechado';
                }
            }

            if (this.tickHistory.length < 5) return 'Coletando dados';
            
            return 'Analisando o mercado';
        },
        // ✅ Fix 'undefined' prefix in logs
                                        currencySymbol() {
                                            return this.preferredCurrencyPrefix || '$';
                                        },
                                        // ✅ Alias for tooltip compatibility
                                        profitCurrencySymbol() {
                                            return this.currencySymbol;
                                        },
                                        // ✅ REACTIVITY FIX: Return a fresh copy to trigger chart update
                                        formattedProfitHistory() {
                                            return [...this.profitHistory];
                                        },
        // ✅ Status da Sessão para o botão Reiniciar
        isSessionFinished() {
            // Se o timer parou (interval null) MAS tem tempo registrado (não 00:00:00), a sessão acabou.
            // OU se algum modal de Stop (Loss/Win/Blindado) está aberto.
            return (this.timerInterval === null && this.executionTime !== '00:00:00') || this.showStopModal;
        }
    },
    watch: {
        balanceNumeric(newVal) {
             console.log('[AIMonitoringView] Balance updated from mixin:', newVal);
             if (newVal !== undefined && newVal !== null) {
                 this.monitoringStats.balance = newVal;
                 // Set initial balance if not set yet (first load)
                 if (this.monitoringStats.initialBalance === 0 && newVal > 0) {
                     this.monitoringStats.initialBalance = newVal;
                     console.log('[AIMonitoringView] Initial Balance Set:', newVal);
                 }
             }
        },
        activeChartMode(val) {
            this.$nextTick(() => {
                if (val === 'tick') {
                    this.initLightweightChart();
                } else if (val === 'profit') {
                    this.setupProfitChartTooltip();
                }
            });

            if (val !== 'tick') {
                // Cleanup chart if switching away? Optional, but good practice
                if (this.chart) {
                    this.chart.remove();
                    this.chart = null;
                    this.series = null;
                }
            }
        },
    },
    mounted() {
        this.checkMobile();
        window.addEventListener('resize', this.checkMobile);
        
        // Sincronizar estado do sidebar com localStorage
        // Sincronizar estado do sidebar com localStorage - REMOVIDO para forçar collapse inicial
        // const savedSidebarState = localStorage.getItem('sidebar_collapsed');
        // if (savedSidebarState !== null) {
        //     this.isSidebarCollapsed = savedSidebarState === 'true';
        // }

        this.loadConfiguration();
        this.loadMasterTraderSettings();
        
        // Sincronizar saldo inicial com o mixin se disponível
        if (this.info && this.info.balance !== undefined) {
            this.monitoringStats.balance = this.info.balance;
            if (this.monitoringStats.initialBalance === 0) this.monitoringStats.initialBalance = this.info.balance;
        }
        
        this.initTickConnection();
        
        // Ensure Profit Chart Tooltip is set on initial load
        if (this.activeChartMode === 'profit') {
            setTimeout(() => this.setupProfitChartTooltip(), 1000);
        }
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.checkMobile);
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        if (this.chart) {
            this.chart.remove();
        }
        if (this.ws) {
            this.ws.close();
        }
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        this.stopTickConnection();
    },
    methods: {
        checkMobile() {
            this.isMobile = window.innerWidth < 768;
            if (!this.isMobile) {
                this.isSidebarOpen = false;
            }
        },

        closeSidebar() {
            this.isSidebarOpen = false;
        },
        toggleSidebarCollapse() {
            this.isSidebarCollapsed = !this.isSidebarCollapsed;
            localStorage.setItem('sidebar_collapsed', this.isSidebarCollapsed);
        },
        loadConfiguration() {
            const savedConfig = localStorage.getItem('ai_active_config');
            if (savedConfig) {
                try {
                    const parsed = JSON.parse(savedConfig);
                    const strategyKey = (parsed.strategy || 'apollo').toLowerCase();
                    
                    // 1. Carregar Configuração Base do Arquivo (Apollo/Atlas/etc)
                    const baseStrategy = strategyConfigs[strategyKey] || strategyConfigs['apollo'];
                    const baseConfig = baseStrategy.config; // { form: ..., recoveryConfig: ... }

                    // 2. Merge Estratégia Principal
                    // Prioridade: Salvo no localStorage > Base do Arquivo
                    this.currentConfig = {
                        ...baseConfig.form,
                        ...parsed, // Overwrite with saved values (stake, stopLoss, etc)
                        // Garantir defaults importantes se faltarem no salvo
                        market: this.resolveMarketSymbol(parsed.market || baseConfig.form.market || 'R_100'),
                        expectedPayout: parsed.expectedPayout || baseConfig.form.expectedPayout || 1.20,
                        sorosLevel: parsed.sorosLevel !== undefined ? parsed.sorosLevel : (baseConfig.form.sorosLevel || 1),
                        attackFilters: (parsed.attackFilters && parsed.attackFilters.length > 0) ? parsed.attackFilters : baseConfig.form.attackFilters // ✅ Fix: Respect saved filters
                    };

                    // 2.5. Carregar Filtros de Segurança (Loss Virtual)
                    const savedSecurity = parsed.securityConfig || {};
                    if (this.securityConfig && this.securityConfig.virtualLoss) {
                        this.securityConfig.virtualLoss.enabled = savedSecurity.virtualLoss?.enabled || false;
                        this.securityConfig.virtualLoss.target = savedSecurity.virtualLoss?.target || 2;
                        this.securityConfig.virtualLoss.mode = savedSecurity.virtualLoss?.mode || 'warmup';
                        this.securityConfig.virtualLoss.current = 0; // Reset counter
                    }

                    // 3. Merge Configuração de Recuperação
                    // Prioridade: Base do Arquivo (para garantir estrutura) > Ajustes se necessário
                    const savedRecovery = parsed.recoveryConfig || {};
                    this.recoveryConfig = {
                        ...baseConfig.recoveryConfig,
                        ...savedRecovery, // ✅ Merge user overrides (RiskProfile, etc.)
                        // ✅ FIX: Map 'modoMartingale' (from InvestmentView) to 'riskProfile'
                        riskProfile: parsed.modoMartingale || parsed.riskProfile || savedRecovery.riskProfile || baseConfig.recoveryConfig.riskProfile || 'moderado',
                        // ✅ FIX: Load recovery filters correctly
                        attackFilters: (savedRecovery.attackFilters && savedRecovery.attackFilters.length > 0) 
                            ? savedRecovery.attackFilters 
                            : (baseConfig.recoveryConfig ? baseConfig.recoveryConfig.attackFilters : []),
                        // ✅ Dynamic Pause Configuration with Fallbacks
                        pauseLosses: savedRecovery.pauseLosses || (baseConfig.recoveryConfig ? baseConfig.recoveryConfig.pauseLosses : 6),
                        pauseTime: savedRecovery.pauseTime || (baseConfig.recoveryConfig ? baseConfig.recoveryConfig.pauseTime : 2),
                        // ✅ Martingale Toggle Loading
                        martingale: savedRecovery.martingale !== undefined ? savedRecovery.martingale : (baseConfig.recoveryConfig && baseConfig.recoveryConfig.martingale !== undefined ? baseConfig.recoveryConfig.martingale : true)
                    };

                    // ✅ FIX: Allow JSON to define payout. Removed forced 1.26 override.
                    // if (this.currentConfig.strategy.toLowerCase() === 'apollo' || this.currentConfig.strategy.toLowerCase() === 'nexus') {
                    //    this.recoveryConfig.expectedPayout = 1.26; 
                    // }
                    
                    // Garantir types corretos
                    this.currentConfig.initialStake = parseFloat(this.currentConfig.initialStake || this.currentConfig.stake);
                    
                    // Inicializar Risk Session com valores corretos
                    this.sessionState = RiskManager.initSession(this.currentConfig.mode || 'VELOZ');
                    this.sessionState.activeStrategy = 'PRINCIPAL';
                    
                    // ✅ Popula sessionState com valores carregados para evitar erro no log
                    this.sessionState.profitTarget = parsed.profitTarget || baseConfig.form.profitTarget || 10;
                    this.sessionState.lossLimit = parsed.lossLimit || baseConfig.form.stopLoss || 50;
                    this.sessionState.strategy = this.currentConfig.strategy;
                    // ✅ FIX: Prioritize version from passed sessionState (if available) over config/default
                    if (this.$route.params.sessionState && this.$route.params.sessionState.version) {
                        this.sessionState.version = this.$route.params.sessionState.version;
                    } else {
                        this.sessionState.version = parsed.version || '1.0';
                    }

                    // Verify Risk Profile
                    console.log(`[AIMonitoring] Loaded Risk Profile: ${this.recoveryConfig.riskProfile || 'DEFAULT (Moderado)'}`);
                    
                    this.addLog('INÍCIO DE SESSÃO', [
                        `Saldo Inicial: ${this.preferredCurrencyPrefix}${(this.monitoringStats.initialBalance || 0).toFixed(2)}`,
                        `Meta de Lucro: ${this.preferredCurrencyPrefix}${(this.sessionState.profitTarget || 0).toFixed(2)}`,
                        `Stop Loss: ${this.preferredCurrencyPrefix}${(this.sessionState.lossLimit || 0).toFixed(2)}`,
                        `Estratégia: ${(this.sessionState.strategy || 'Unknown').toUpperCase()} v${this.sessionState.version || '1.0'}`,
                        `Payout Mínimo: ${this.currentConfig.expectedPayout}x`,
                        `Payout Recuperação: ${this.recoveryConfig?.expectedPayout || this.recoveryConfig?.minPayout || 1.26}x`
                    ], 'info');

                    this.addLog('Configuração Inicial', [
                        `Agente: ${this.currentConfig.strategy.toUpperCase()}`,
                        `Modo: ${this.currentConfig.mode.toUpperCase()}`,
                        `Perfil: ${(this.recoveryConfig.riskProfile || 'MODERADO').toUpperCase()}`,
                        `Stake: ${this.currencySymbol}${this.currentConfig.initialStake.toFixed(2)}`,
                        `Soros Level: ${this.currentConfig.sorosLevel}`
                    ], 'info');

                    // ✅ Start Session Tracking
                    this.startSession();
                    this.startTimer(); // Start timer when configuration is loaded and session begins

                } catch (e) {
                    console.error('Error loading config:', e);
                    this.addLog('Erro Config', `Falha ao carregar configuração: ${e.message}`, 'error');
                }
            } else {
                console.warn('Nenhuma configuração salva encontrada. Redirecionando para investimentos.');
                this.$router.push('/Investments-IA');
                return;
            }

            // ✅ CLEAN & SAVE: Ensure the sanitized config is what persists for reloads
            // This fulfills "apague os dados no localstorage e salve novamente" with CORRECT data
            const cleanConfig = {
                ...this.currentConfig,
                recoveryConfig: this.recoveryConfig
            };
            localStorage.setItem('ai_active_config', JSON.stringify(cleanConfig));
        },
        getDerivToken() {
            try {
                // ✅ 1. Check URL Query Param (Explicit Override)
                const queryLoginId = this.$route.query.loginid;
                if (queryLoginId) {
                     console.log('[AIMonitoringView] 🎯 Using explicit loginid from URL:', queryLoginId);
                     const tokensByLoginId = JSON.parse(localStorage.getItem('deriv_tokens_by_loginid') || '{}');
                     if (tokensByLoginId[queryLoginId]) {
                         return tokensByLoginId[queryLoginId].trim();
                     }
                }

                const connectionStr = localStorage.getItem('deriv_connection');
                console.log('[AIMonitoringView] checking deriv_connection:', connectionStr);

                if (connectionStr) {
                    const connection = JSON.parse(connectionStr);
                    const targetLoginId = connection.loginid;
                    
                    // ✅ ROBUST LOOKUP: Use LoginID to find authoritative token
                    if (targetLoginId) {
                        const tokensByLoginIdStr = localStorage.getItem('deriv_tokens_by_loginid') || '{}';
                        const tokensByLoginId = JSON.parse(tokensByLoginIdStr);
                        if (tokensByLoginId[targetLoginId]) {
                            console.log('[AIMonitoringView] ✅ Found authoritative token for:', targetLoginId);
                            return tokensByLoginId[targetLoginId].trim();
                        }
                    }

                    // Fallback to the token saved in the connection object
                    if (connection.token) {
                         console.log('[AIMonitoringView] Using cached connection token (Fallback).');
                         return connection.token.trim();
                    }
                }
                const defaultToken = localStorage.getItem('deriv_token');
                console.log('[AIMonitoringView] Fallback to default deriv_token');
                return defaultToken ? defaultToken.trim() : null;
            } catch (e) {
                console.error('Error getting token:', e);
                return null;
            }
        },
        async loadMasterTraderSettings() {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                const res = await fetch(`${apiBaseUrl}/settings`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.isFictitiousBalanceActive !== undefined) this.isFictitiousBalanceActive = data.isFictitiousBalanceActive;
                    if (data.showDollarSign !== undefined) this.showDollarSign = data.showDollarSign;
                }
            } catch (error) {
                console.error('[AIMonitoringView] Erro ao carregar configurações de Master Trader:', error);
            }
        },
        async initTickConnection() {
            this.stopTickConnection();
            this.tickCount = 0;

            const appId = localStorage.getItem('deriv_app_id') || '1089';
            const endpoint = `wss://ws.derivws.com/websockets/v3?app_id=${appId}`;
            
            try {
                this.ws = new WebSocket(endpoint);

                this.ws.onopen = () => {
                    this.addLog('Conexão Estabelecida', [
                        'Status: Conectado ao mercado',
                        'Servidor: Deriv WebSocket v3'
                    ], 'success');

                    const token = this.getDerivToken();
                    
                    if (token) {
                        this.ws.send(JSON.stringify({ authorize: token }));
                    } else {
                        this.addLog('Erro de Autorização', [
                            'Motivo: Token não encontrado',
                            'Ação: Modo observação'
                        ], 'warning');
                        this.subscribeTicks();
                    }
                };

                this.ws.onmessage = (event) => {
                    try {
                        const msg = JSON.parse(event.data);
                        
                        if (msg.msg_type === 'authorize') {
                            if (msg.error) {
                                this.addLog('Erro de Sessão', [
                                    `Tipo: Erro de autorização`,
                                    `Mensagem: ${msg.error.message}`,
                                    `Ação: Tentando reconectar (Retry)...`
                                ], 'error');
                                
                                // ✅ AUTO-RETRY ON AUTHORIZATION ERROR
                                setTimeout(() => {
                                    console.log('[AIMonitoringView] 🔄 Auto-retry authorization...');
                                    this.initTickConnection();
                                }, 3000); // 3 seconds delay for retry
                            } else {
                                this.isAuthorized = true;
                                this.monitoringStats.balance = msg.authorize.balance;
                                this.accountType = msg.authorize.is_virtual ? 'demo' : 'real';
                                
                                // ✅ AUTO-CORRECTION FOR ACCOUNT MISMATCH
                                try {
                                    const conn = JSON.parse(localStorage.getItem('deriv_connection') || '{}');
                                    if (conn.loginid && conn.loginid !== msg.authorize.loginid) {
                                         console.warn('[AIMonitoringView] ⚠️ Account Mismatch! Expected:', conn.loginid, 'Got:', msg.authorize.loginid);
                                         
                                         // Attempt to find the correct token
                                         const allTokens = JSON.parse(localStorage.getItem('deriv_tokens_by_loginid') || '{}');
                                         const correctToken = allTokens[conn.loginid];
                                         
                                         // 🛡️ & 🩹 Brute Force Recovery:
                                         // If the "correct" token is actually the WRONG one (corrupted mapping), try others!
                                         const currentUsedToken = this.getDerivToken();
                                         
                                         if (correctToken && correctToken === currentUsedToken) {
                                             console.error('[AIMonitoringView] ⛔ Token Corruption Detected! Mapped token is wrong.');
                                             
                                             // Find ANY other token we haven't tried yet
                                             const otherTokens = Object.values(allTokens).filter(t => t.trim() !== currentUsedToken);
                                             
                                             if (otherTokens.length > 0) {
                                                  const recoveryToken = otherTokens[0]; // Try the first alternative
                                                  console.warn('[AIMonitoringView] 🩹 Attempting Self-Healing with alternative token...');
                                                  
                                                  this.ws.send(JSON.stringify({ authorize: recoveryToken }));
                                                  return;
                                             }

                                             // No other tokens to try...
                                             this.addLog('⚠️ Erro de Token', [
                                                 `Banco de dados local corrompido.`,
                                                 `Ação: Faça LOGOUT e Login novamente.`
                                             ], 'error');
                                         } else if (correctToken) {
                                             console.warn('[AIMonitoringView] 🔄 Silently switching to correct account:', conn.loginid);
                                             this.ws.send(JSON.stringify({ authorize: correctToken }));
                                             return;
                                         } else {
                                             console.error('[AIMonitoringView] ❌ Fatal: Correct token not found for:', conn.loginid);
                                         }
                                    }
                                } catch (e) { console.error('Error in account auto-correction:', e); }

                                this.addLog('Execução Confirmada', [
                                    `Status: Autorizado`,
                                    `Saldo: ${this.currencySymbol}${this.monitoringStats.balance.toFixed(2)}`,
                                    `Conta: ${msg.authorize.loginid}`
                                ], 'success');
                                this.subscribeTicks();
                            }
                        }

                        if (msg.msg_type === 'tick') {
                            this.handleTickMessage(msg);
                        }
                        
                        // ✅ PROPOSAL RESPONSE (Validate Payout)
                        if (msg.msg_type === 'proposal') {
                             if (msg.error) {
                                this.addLog('Erro na Proposta', [`${msg.error.message}`], 'error');
                                this.isNegotiating = false;
                                return;
                            }
                            
                            const proposalId = msg.proposal.id;
                            const payout = msg.proposal.payout;
                            const stakeValue = msg.proposal.ask_price;

                            // 1. Update sessionState with the real PROFIT RATE for accuracy
                            const realPayoutRate = payout / stakeValue;
                            
                            if (this.sessionState.analysisType === 'RECUPERACAO') {
                                this.sessionState.lastPayoutRecovery = realPayoutRate;
                            } else {
                                this.sessionState.lastPayoutPrincipal = realPayoutRate;
                            }
                            
                            // Normalize Key to match RiskManager
                            const cType = (msg.proposal.contract_type || '').toUpperCase();
                            if (cType) {
                                const prefix = this.sessionState.analysisType === 'RECUPERACAO' ? 'RECUPERACAO_' : 'PRINCIPAL_';
                                let barrierSuffix = '';
                                if (msg.echo_req.barrier !== undefined) {
                                    barrierSuffix = '_' + msg.echo_req.barrier;
                                }
                                RiskManager.updatePayoutHistory(prefix + cType + barrierSuffix, realPayoutRate);
                            }
                            
                            // DYNAMIC CALIBRATION: Check if adjusted stake is needed based on REAL payout
                            if (this.sessionState.analysisType === 'RECUPERACAO') {
                                // Map generic config to structure expected by RiskManager if needed
                                // ✅ FIX: Merge Global Config to ensure stopLoss/profitTarget are present
                                const config = {
                                    ...this.currentConfig,
                                    ...this.recoveryConfig,
                                    stopLoss: this.currentConfig.lossLimit || 50,
                                    profitTarget: this.currentConfig.profitTarget || 10
                                };
                                
                                // Re-calculate using the REAL rate we just got
                                let exactStake = RiskManager.calculateNextStake(this.sessionState, config, realPayoutRate);
                                
                                // ✅ SURVIVAL MODE CHECK (AGAIN)
                                // Prevent Martingale Calibration from creating an unsafe stake
                                const currentProfit = this.monitoringStats.profit;
                                const estimatedPayout = config.expectedPayout || 1.20;
                                const blindadoState = {
                                    active: this.sessionState.stopBlindadoActive,
                                    floor: this.sessionState.stopBlindadoFloor
                                };

                                const { stake: survivalStake, reason: survivalReason } = RiskManager.applySurvivalMode(exactStake, currentProfit, config, estimatedPayout, blindadoState);
                                
                                if (survivalStake < exactStake) {
                                    this.addLog('🛡️ Survival Mode (Calibração)', [
                                        `Limitando ajuste de Martingale`,
                                        `Motivo: ${survivalReason}`,
                                        `Ideal: $${exactStake.toFixed(2)}`,
                                        `Limite Seguro: $${survivalStake.toFixed(2)}`
                                    ], 'warning');
                                    exactStake = survivalStake;
                                }

                                // Tolerance check (if diff > 0.02 cents)
                                if (Math.abs(exactStake - stakeValue) > 0.02) {
                                    this.addLog(`⚠️ Calibrando Martingale: Payout ${realPayoutRate.toFixed(2)}x pede $${exactStake.toFixed(2)} (Era $${stakeValue})`, 'warning');
                                    
                                    if (!this.retryingProposal) {
                                        this.retryingProposal = true; // Set flag
                                        
                                        // Retry with corrected stake
                                        const newParams = { ...msg.echo_req, amount: exactStake };
                                        delete newParams.req_id; 
                                        delete newParams.passthrough; // cleanup
                                        
                                        this.ws.send(JSON.stringify(newParams));
                                        return; // ABORT BUY to wait for new proposal
                                    } else {
                                        // ✅ DEADLOCK FIX: If we already retried and it's STILL blocked/unsafe, abort.
                                        this.addLog('⚠️ Cancelando negociação: Ajuste de segurança falhou ou limite atingido.', 'error');
                                        this.isNegotiating = false; // Release lock
                                        this.retryingProposal = false;
                                        return; // BLOCK BUY
                                    }
                                }
                            }

                            this.retryingProposal = false; // Success, reset flag
                            
                            // Debug Info
                            this.addLog('Proposta Recebida', [
                                `Payout: ${this.currencySymbol}${payout} (${((payout - stakeValue)/stakeValue*100).toFixed(1)}%)`,
                                `Stake: ${this.currencySymbol}${stakeValue}`,
                                `ID: ${proposalId}`
                            ], 'info');
                            
                            // BUY
                            this.addLog('Executando Compra', [`Comprando ID: ${proposalId}`], 'info');
                            this.ws.send(JSON.stringify({
                                buy: proposalId,
                                price: stakeValue
                            }));
                        }

                        if (msg.msg_type === 'buy') {
                            if (msg.error) {
                                this.addLog('Entrada Bloqueada', [
                                    `Motivo: Erro na compra`,
                                    `Mensagem: ${msg.error.message}`
                                ], 'error');
                                this.isNegotiating = false;
                            } else {
                                const payout = msg.buy.payout;
                                const contractType = this.sessionState.lastContractType || 'Contrato'; // Saved in state
                                
                                this.addLog('Contrato Criado', [
                                    `Contrato ID: ${msg.buy.contract_id}`,
                                    `Tipo: ${contractType}`,
                                    `Payout Potencial: ${this.currencySymbol}${payout}`,
                                    `Status: aguardar execução`
                                ], 'success');

                                // Activate fast result calculation if it's 1-tick
                                if (this.pendingFastResult.duration === 1 && this.pendingFastResult.durationUnit === 't') {
                                    this.pendingFastResult.contractId = msg.buy.contract_id;
                                    this.pendingFastResult.payout = payout; // Store real payout
                                    // this.pendingFastResult.active = true; // ✅ DESATIVADO: Aguardar resultado oficial
                                    console.log('[FastResult] Monitoramento rápido desativado por solicitação.');
                                }

                                this.subscribeToContract(msg.buy.contract_id);
                                
                                // CRITICAL: isNegotiating is NOT reset here. 
                                // It will be reset in handleContractUpdate or handleTickMessage (Fast Result)
                            }
                        }

                        if (msg.msg_type === 'proposal_open_contract') {
                            this.handleContractUpdate(msg.proposal_open_contract);
                        }
                    } catch (e) {
                        console.error('WebSocket message error:', e);
                    }
                };

                this.ws.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    this.addLog('❌ Erro na conexão WebSocket', 'error');
                };

                this.ws.onclose = () => {
                    if (this.isStopping) return; // ✅ Prevent reconnection on explicit stop

                    this.addLog('Erro de Conexão', [
                        'Tipo: Conexão encerrada',
                        'Ação: Reconectando automaticamente'
                    ], 'info');
                    setTimeout(() => this.initTickConnection(), 3000);
                };
            } catch (error) {
                console.error('WebSocket connection error:', error);
                this.addLog('❌ Falha ao conectar', 'error');
            }
        },
        stopTickConnection() {
            if (this.ws) {
                if (this.tickSubscriptionId) {
                    this.ws.send(JSON.stringify({ forget: this.tickSubscriptionId }));
                }
                this.ws.onclose = null; // ✅ Remove handler to prevent auto-reconnect
                this.ws.close();
                this.ws = null;
            }
            this.tickSubscriptionId = null;
            this.isNegotiating = false; // Reset lock
        },
        subscribeTicks() {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                const market = this.resolveMarketSymbol(this.currentConfig.market || 'R_100');
                this.addLog(`Monitorando Mercado`, [`Símbolo: ${market}`], 'info');
                
                this.ws.send(JSON.stringify({
                    ticks: market,
                    subscribe: 1
                }));
                this.monitoringStats.status = 'Monitorando';
                this.monitoringStats.statusDesc = `Analisando ${market} em tempo real`;
            }
        },
        handleTickMessage(msg) {
            if (msg.error) {
                this.addLog('Erro de Coleta', [
                    `Mensagem: ${msg.error.message}`
                ], 'error');
                return;
            }
            if (msg.msg_type === 'tick' && msg.tick) {
                this.tickCount++;
                const price = msg.tick.quote;
                const time = msg.tick.epoch;
                
                if (msg.subscription) this.tickSubscriptionId = msg.subscription.id;
                if (this.tickCount % 10 === 0) this.addLog(`📈 Tick #${this.tickCount}: ${price}`, 'info');
                
                // 1. Maintain Logic Compatibility
                this.tickHistory.unshift(price);

        // --- Virtual Trade Processing ---
        if (this.pendingVirtualTrade) {
            this.pendingVirtualTrade.tickCount++;
            if (this.pendingVirtualTrade.tickCount >= this.pendingVirtualTrade.duration) {
                this.finishVirtualTrade(price);
            }
        }
                if (this.tickHistory.length > 1000) this.tickHistory.pop();
                
                // 2. Update Chart Data
                const tickObj = { time: time, value: price };
                this.tickChartData.push(tickObj);
                if (this.tickChartData.length > 5000) this.tickChartData.shift(); // Keep more history for chart
                
                // 3. Update Chart Series Realtime
                if (this.series) {
                    this.series.update(tickObj);
                }

                // --- Fast Result Calculation ---
                if (this.pendingFastResult && this.pendingFastResult.active) {
                    const lastDigit = parseInt(price.toString().slice(-1));
                    const { contractId, barrier, contractType, stake } = this.pendingFastResult;
                    
                    let win = false;
                    if (contractType === 'DIGITUNDER') win = lastDigit < barrier;
                    else if (contractType === 'DIGITOVER') win = lastDigit > barrier;
                    else if (contractType === 'DIGITMATCH') win = lastDigit === barrier;
                    else if (contractType === 'DIGITDIFF') win = lastDigit !== barrier;
                    else if (contractType === 'DIGITEVEN') win = lastDigit % 2 === 0;
                    else if (contractType === 'DIGITODD') win = lastDigit % 2 !== 0;

                    this.addLog('Resultado Rápido (1-Tick)', [
                        `Status: ${win ? 'GANHOU' : 'PERDEU'}`,
                        `Dígito: ${lastDigit}`,
                        `Ação: Liberando trava para próxima análise`
                    ], win ? 'success' : 'error');
                    
                    // Pre-update trade in activeContracts if present
                    const trade = this.activeContracts.get(contractId);
                    if (trade) {
                        trade.result = win ? 'WON' : 'LOST';
                        trade.fastResultApplied = true;
                    }

                    // Update stats immediately
                    const realPayout = this.pendingFastResult.payout || (stake * (this.sessionState.analysisType === 'RECUPERACAO' ? this.sessionState.lastPayoutRecovery : this.sessionState.lastPayoutPrincipal));
                    const estimatedProfit = win ? (realPayout - stake) : -stake;

                    if (win) this.monitoringStats.wins++;
                    else this.monitoringStats.losses++;

                    RiskManager.processTradeResult(this.sessionState, win, estimatedProfit, stake, this.pendingFastResult.analysisType, this.recoveryConfig.lossesToActivate);
                    
                    // Update Profit Chart for Fast Result
                    this.monitoringStats.profit += estimatedProfit;
                    const profitTick = { time: Math.floor(Date.now() / 1000), value: parseFloat(this.monitoringStats.profit.toFixed(2)) };
                    if (this.profitChartData.length > 0 && profitTick.time <= this.profitChartData[this.profitChartData.length - 1].time) {
                        profitTick.time = this.profitChartData[this.profitChartData.length - 1].time + 1;
                    }
                    this.profitChartData.push(profitTick);
                    if (this.profitChartData.length > 5000) this.profitChartData.shift();
                    
                    // ✅ Update Markers for Fast Result
                    const fastTrade = { id: contractId, result: win ? 'WON' : 'LOST', pnl: estimatedProfit };
                    this.updateChartMarkers(fastTrade, 'tick');
                    this.updateChartMarkers(fastTrade, 'profit');

                    // Release locks
                    this.pendingFastResult.active = false;
                    this.isNegotiating = false; 
                    this.sessionState.isRecoveryMode = this.sessionState.analysisType === 'RECUPERACAO';
                }
                
                const lastDigit = parseInt(price.toString().slice(-1));
                this.digitHistory.unshift(lastDigit);
                if (this.digitHistory.length > 100) this.digitHistory.pop();
                this.runAIAnalysis();
            }
        },
        runAIAnalysis() {
            // ✅ Sincronização: Aguardar resultado do contrato ou resultado rápido
            if (this.activeContracts.size > 0 || this.isNegotiating) return;
            if (this.pendingFastResult && this.pendingFastResult.active) return;
            if (this.pendingVirtualTrade) return;

            // --- PAUSE CHECK ---
            if (this.pauseUntil) {
                if (Date.now() < this.pauseUntil) {
                    return; // Still Paused
                } else {
                    // Pause Expired
                    this.pauseUntil = 0;
                    this.addLog('▶️ Pausa de resfriamento finalizada. Retomando operações.', 'success');
                }
            }

            // Determinar quais filtros usar (Ataque ou Recuperação Estratégica)
            const activeFilters = this.sessionState.activeStrategy === 'RECUPERACAO' 
                ? (this.recoveryConfig.attackFilters || []) 
                : (this.currentConfig.attackFilters || []);
                
            if (activeFilters.length === 0) return;

            const data = { 
                tickHistory: this.tickHistory, 
                digitHistory: this.digitHistory 
            };

            // ✅ CRITICAL: Pass negotiationMode to evaluate
            const results = activeFilters.map(filter => 
                StrategyAnalysis.evaluate(filter, data, this.sessionState.negotiationMode)
            );

            const allPassed = results.every(r => r.pass);

            // Log analysis failures (Density, Momentum, etc.)
            results.forEach(res => { 
                if (!res.pass) this.addLog(`🔍 ${res.reason}`, 'info'); 
            });

            if (allPassed) {
                const mode = this.sessionState.negotiationMode;
                const isRec = this.sessionState.activeStrategy === 'RECUPERACAO';
                
                let analysisLog = `🧠 ANÁLISE DO MERCADO<br>` +
                    `• MODO: ${mode} ${isRec ? '(RECUPERAÇÃO)' : ''}<br>` +
                    `• STATUS: Confirmado<br>` +
                    `• GATILHO: Filtros de Ataque Atendidos<br><br>` +
                    `📝 DETALHES:<br>`;

                results.forEach((res, index) => {
                    const filterName = activeFilters[index]?.name || 'Filtro';
                    analysisLog += `• ${filterName}: ${res.reason}<br>`;
                });

                this.addLog('Sinal de Entrada Corretora', analysisLog, 'success');
                
                // ✅ DYNAMIC DIRECTION LOGIC
                // Collect signals from all filters that opted to provide a direction
                const directions = results.map(r => r.direction).filter(d => d);
                let dynamicContractType = null;
                
                if (directions.length > 0) {
                     // Require Consensus: If multiple filters provide direction, they must match
                     const uniqueDirections = [...new Set(directions)];
                     if (uniqueDirections.length === 1) {
                         const signal = uniqueDirections[0];
                         const isRec = this.sessionState.activeStrategy === 'RECUPERACAO';
                         const config = isRec ? this.recoveryConfig : this.currentConfig;
                         const baseType = (config.tradeType || '').toUpperCase();
                         
                         // ✅ CRITICAL: Check if user configured a specific contract type (not a group)
                         // If so, only allow dynamic direction if it matches the configured type
                         const isSpecificContract = ['DIGITOVER', 'DIGITUNDER', 'DIGITEVEN', 'DIGITODD', 'DIGITMATCH', 'DIGITDIFF', 'CALL', 'PUT'].includes(baseType);
                         
                         if (isSpecificContract) {
                             // User configured a specific direction - respect it!
                             // Only process if signal matches the configured type
                             const configuredIsUp = ['CALL', 'DIGITOVER', 'DIGITEVEN', 'DIGITMATCH'].includes(baseType);
                             const configuredIsDown = ['PUT', 'DIGITUNDER', 'DIGITODD', 'DIGITDIFF'].includes(baseType);
                             const signalIsUp = ['CALL', 'UP', 'DIGITOVER', 'DIGITEVEN', 'DIGITMATCH'].includes(signal);
                             const signalIsDown = ['PUT', 'DOWN', 'DIGITUNDER', 'DIGITODD', 'DIGITDIFF'].includes(signal);
                             
                             if ((configuredIsUp && !signalIsUp) || (configuredIsDown && !signalIsDown)) {
                                 this.addLog('🚫 Sinal Incompatível', [
                                     `Sinal ${signal} ignorado`,
                                     `Tipo configurado: ${baseType}`,
                                     `Motivo: Direção do sinal não corresponde ao tipo de contrato configurado`
                                 ], 'info');
                                 return;
                             }
                             // Signal matches configured type, use the configured type
                             dynamicContractType = baseType;
                         } else {
                             // Dynamic group - map signal to contract type
                             if (['CALL', 'UP'].includes(signal)) {
                                 dynamicContractType = baseType.includes('DIGIT') ? 'DIGITOVER' : 'CALL';
                             } else if (['PUT', 'DOWN'].includes(signal)) {
                                 dynamicContractType = baseType.includes('DIGIT') ? 'DIGITUNDER' : 'PUT';
                             } else if (['DIGITEVEN', 'DIGITODD', 'DIGITMATCH', 'DIGITDIFF', 'DIGITOVER', 'DIGITUNDER'].includes(signal)) {
                                 dynamicContractType = signal;
                             } else {
                                 // Fallback or unknown signal
                                 dynamicContractType = baseType; 
                             }
                         }

                         // ✅ Direction Mode Restriction (applies to dynamic groups)
                         const directionMode = config.directionMode || 'both';

                         if (directionMode !== 'both' && !isSpecificContract) {
                             const isUpSignal = ['CALL', 'UP', 'DIGITOVER', 'DIGITEVEN', 'DIGITMATCH'].includes(signal);
                             const isDownSignal = ['PUT', 'DOWN', 'DIGITUNDER', 'DIGITODD', 'DIGITDIFF'].includes(signal);
                             
                             if ((directionMode === 'up' && !isUpSignal) || (directionMode === 'down' && !isDownSignal)) {
                                 this.addLog('🚫 Direção Restrita', `Sinal ${signal} ignorado. Modo: ${directionMode === 'up' ? 'Apenas Subida' : 'Apenas Descida'}`, 'info');
                                 return;
                             }
                         }

                         // ✅ Resolve Dynamic Payout
                         const directionPayouts = config.directionPayouts || {};
                         const explicitPayout = directionPayouts[dynamicContractType] || null;
                         this.sessionState.tempExplicitPayout = explicitPayout;
                         
                         this.addLog('🧭 Direção Dinâmica', [
                            `Sinal: ${signal} → ${dynamicContractType}`,
                            explicitPayout ? `Payout: ${(explicitPayout * 100).toFixed(0)}%` : 'Payout: Padrão'
                         ], 'info');
                     } else {
                         this.addLog('⚠️ Conflito de Direção', `Filtros divergentes: ${uniqueDirections.join(', ')}`, 'warning');
                         return; // BLOCK TRADE due to conflict
                     }
                }

                const vl = this.securityConfig.virtualLoss;
                const isRecovery = this.sessionState.analysisType === 'RECUPERACAO';
                let shouldApplyVL = false;

                if (vl && vl.enabled) {
                    if (vl.mode === 'warmup') shouldApplyVL = true;
                    else if (vl.mode === 'cyclic') shouldApplyVL = true;
                    else if (vl.mode === 'attack' && !isRecovery) shouldApplyVL = true;
                    else if (vl.mode === 'recovery' && isRecovery) shouldApplyVL = true;
                }

                if (shouldApplyVL && vl.current < vl.target) {
                    this.executeVirtualTrade(dynamicContractType);
                } else {
                    // Reset Counter Logic based on Mode (Cyclic behavior for specific phases)
                    if (vl && vl.enabled) {
                        if (vl.mode === 'cyclic') vl.current = 0;
                        else if (vl.mode === 'attack' && !isRecovery) vl.current = 0;
                        else if (vl.mode === 'recovery' && isRecovery) vl.current = 0;
                    }
                    this.executeAITrade(dynamicContractType, this.sessionState.tempExplicitPayout);
                    this.sessionState.tempExplicitPayout = null; // Clean up
                }
            }
        },
        calculateNextStake(explicitPayout = null) {
            const isRecovery = this.sessionState.analysisType === 'RECUPERACAO';
            // ✅ FIX: Merge Global Config (this.currentConfig) to ensure stopLoss/profitTarget are present
            const config = {
                ...this.currentConfig,
                ...(isRecovery ? this.recoveryConfig : {}),
                // Force mapping of internal lossLimit to RiskManager's expected stopLoss
                stopLoss: this.currentConfig.lossLimit || 50,
                profitTarget: this.currentConfig.profitTarget || 10
            };
            
            console.log('[AIMonitoring] calculateNextStake:', {
                isRecovery,
                configPayout: config.expectedPayout,
                configRisk: config.riskProfile,
                consecutiveWins: this.sessionState.consecutiveWins,
                lastResultWin: this.sessionState.lastResultWin,
                skipSorosNext: this.sessionState.skipSorosNext,
                totalLossAccumulated: this.sessionState.totalLossAccumulated
            });
            
            let stake = RiskManager.calculateNextStake(this.sessionState, config, explicitPayout);
            
            // ✅ SURVIVAL MODE: Proteger limites de Meta e Stop Loss
            const currentProfit = this.monitoringStats.profit;
            const estimatedPayout = config.expectedPayout || 1.20;
            
            // Preparar estado do Stop Blindado
            const blindadoState = {
                active: this.sessionState.stopBlindadoActive,
                floor: this.sessionState.stopBlindadoFloor
            };

            const { stake: survivalStake, reason: survivalReason } = RiskManager.applySurvivalMode(stake, currentProfit, config, estimatedPayout, blindadoState);
            
            if (survivalStake < stake) {
                this.addLog('🛡️ Survival Mode', [
                    `Stake ajustada para proteger limites`,
                    `Motivo: ${survivalReason || 'Ajuste de Risco'}`,
                    `Original: ${this.preferredCurrencyPrefix}${stake.toFixed(2)}`,
                    `Nova: ${this.preferredCurrencyPrefix}${survivalStake.toFixed(2)}`
                ], 'warning');
                stake = survivalStake;
            }

            // ✅ CRITICAL SAFETY: Validate Minimum Stake
            if (stake < 0.35) {
                this.addLog('🛑 STOP PROTEÇÃO', [
                    `Margem insuficiente para operar`,
                    `Stake Calculado: $${stake.toFixed(2)}`,
                    `Mínimo Permitido: $0.35`
                ], 'error');
                this.stopIA(false);
                return 0;
            }

            // Log Soros if active
            if (!isRecovery && this.sessionState.consecutiveWins === 2 && this.sessionState.lastResultWin) {
                this.addLog('Gestão Soros', [
                    `🚀 SOROS ATIVADO`,
                    `Stake: Base + Lucro = ${this.preferredCurrencyPrefix}${stake.toFixed(2)}`,
                    `Sequência: ${this.sessionState.consecutiveWins} vitórias`
                ], 'info');
            }
            
            console.log('[AIMonitoring] Calculated stake (after survival):', stake);
            return stake;
        },
        executeAITrade(overrideContractType = null, explicitPayout = null) {
            if (!this.isAuthorized) {
                this.addLog('⚠️ Entrada negada: Não autorizado', 'warning');
                return;
            }
            if (this.activeContracts.size > 0 || this.isNegotiating) return;
            
            this.isNegotiating = true;
            
            // ✅ USE RISKMANAGER & CONFIGS
            const isFinancialRecovery = this.sessionState.analysisType === 'RECUPERACAO';
            // Determine active config (use merged configs from this, not raw strategyConfig)
            const config = isFinancialRecovery ? this.recoveryConfig : this.currentConfig;
            
            // ✅ Calculate stake dynamically
            const stake = this.calculateNextStake(explicitPayout);

            // ✅ SURVIVAL STOP: Se a stake for menor que o mínimo (0.35), força o STOP
            if (stake < 0.35) {
                this.addLog('🛑 Stop de Segurança', [
                    `Stake calculada (${this.preferredCurrencyPrefix}${stake.toFixed(2)}) inferior ao mínimo (0.35).`,
                    `Motivo: Modo de Sobrevivência impediu entrada para não romper limites.`,
                    `Ação: Encerrando execução automaticamente.`
                ], 'error');
                this.isNegotiating = false;
                this.stopIA(false);
                return;
            }
            
            // Update Contract Type state for logging and Fast Result
            this.sessionState.lastContractType = overrideContractType || config.tradeType;
            this.pendingFastResult = {
                active: false,
                contractId: null,
                barrier: config.prediction,
                contractType: overrideContractType || config.tradeType,
                stake: stake,
                duration: config.duration || 1,
                durationUnit: config.durationUnit || 't',
                analysisType: this.sessionState.analysisType
            };
            
            const proposalParams = {
                proposal: 1,
                amount: stake,
                basis: 'stake',
                contract_type: overrideContractType || config.tradeType,
                currency: 'USD',
                duration: config.duration || 1,
                duration_unit: config.durationUnit || 't',
                symbol: this.resolveMarketSymbol(config.market || 'R_100')
            };
            
            if (['DIGITOVER', 'DIGITUNDER', 'DIGITMATCH', 'DIGITDIFF'].includes(config.tradeType)) {
                proposalParams.barrier = (config.prediction || 8).toString();
            }
            
            const mode = isFinancialRecovery ? 'RECUPERAÇÃO/MARTINGALE' : 'PRINCIPAL';
            this.addLog('Solicitando Proposta', [
                `Modo: ${mode}`,
                `Contrato: ${overrideContractType || config.tradeType}`,
                `Mercado: ${proposalParams.symbol}`,
                `Stake: ${this.preferredCurrencyPrefix}${stake.toFixed(2)}`
            ], 'info');
            
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify(proposalParams));
            } else {
                this.addLog('❌ WebSocket não conectado', 'error');
            }
        },
        executeVirtualTrade(overrideContractType = null) {
            // Check context
            const isRecoveryStrategy = this.sessionState.activeStrategy === 'RECUPERACAO';
            // ✅ FIX: Correctly merge configs
            const config = {
                ...this.currentConfig,
                ...(isRecoveryStrategy ? this.recoveryConfig : {})
            };

            const vl = this.securityConfig.virtualLoss;
            const current = vl.current + 1; // Current attempt
            const target = vl.target;

            this.addLog('Filtro de Segurança (Loss Virtual)', [
                `Status: Simulando Operação ${current}/${target}`,
                `Ação: Entrada simulada (sem valor financeiro)`
            ], 'info');

            // Set State
            this.isNegotiating = true;
            this.pendingVirtualTrade = {
                startTime: Date.now(),
                entryPrice: this.tickHistory[0],
                tradeType: overrideContractType || config.tradeType,
                prediction: config.prediction,
                duration: config.duration || 1,
                tickCount: 0
            };
        },
        finishVirtualTrade(exitPrice) {
            const trade = this.pendingVirtualTrade;
            if (!trade) return;

            const lastDigit = parseInt(exitPrice.toString().slice(-1));
            const barrier = trade.prediction;
            let win = false;

            // Logic duplicate from Fast Result
            if (trade.tradeType === 'DIGITUNDER') win = lastDigit < barrier;
            else if (trade.tradeType === 'DIGITOVER') win = lastDigit > barrier;
            else if (trade.tradeType === 'DIGITMATCH') win = lastDigit === barrier;
            else if (trade.tradeType === 'DIGITDIFF') win = lastDigit !== barrier;
            else if (trade.tradeType === 'DIGITEVEN') win = lastDigit % 2 === 0;
            else if (trade.tradeType === 'DIGITODD') win = lastDigit % 2 !== 0;

            // Clear State
            this.pendingVirtualTrade = null;
            this.isNegotiating = false; // Unlock analysis

            const vl = this.securityConfig.virtualLoss;
            
            if (win) {
                // Win Virtual = Reset sequence
                vl.current = 0;
                this.addLog('Resultado Loss Virtual', [
                    `Dígito: ${lastDigit}`,
                    `Resultado: WIN (Simulado)`,
                    `Efeito: Sequência quebrada. Contador zerado.`
                ], 'success');
            } else {
                // Loss Virtual = Increment sequence
                vl.current++;
                const faltam = vl.target - vl.current;
                
                if (faltam > 0) {
                     this.addLog('Resultado Loss Virtual', [
                        `Dígito: ${lastDigit}`,
                        `Resultado: LOSS (Simulado)`,
                        `Progresso: ${vl.current}/${vl.target} (Faltam ${faltam})`
                    ], 'warning');
                } else {
                     this.addLog('Alvo Loss Virtual Atingido!', [
                        `Dígito: ${lastDigit}`,
                        `Resultado: LOSS (Simulado)`,
                        `Ação: PRÓXIMA ENTRADA SERÁ EXECUÇÃO REAL`
                    ], 'warning');
                }
            }
        },
        subscribeToContract(contractId) {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify({ proposal_open_contract: 1, contract_id: contractId, subscribe: 1 }));
            }
        },
        handleContractUpdate(contract) {
            const id = contract.contract_id;
            let trade = this.monitoringOperations.find(o => o.id === id);
            
            if (!trade) {
                trade = {
                    id: id,
                    time: new Date(contract.date_start * 1000).toLocaleTimeString(),
                    market: contract.display_name,
                    contract: contract.contract_type,
                    type: contract.contract_type.includes('CALL') ? 'CALL' : (contract.contract_type.includes('PUT') ? 'PUT' : 'CALL'),
                    stake: parseFloat(contract.buy_price),
                    pnl: 0,
                    analysisType: this.sessionState.analysisType, // ✅ CRITICAL
                    result: 'OPEN',
                    barrier: contract.barrier,
                    entryPrice: contract.entry_tick_display_value,
                    exitPrice: contract.exit_tick_display_value,
                    lastDigit: contract.exit_tick_display_value ? contract.exit_tick_display_value.slice(-1) : null,
                    fastResultApplied: false
                };
                this.monitoringOperations.unshift(trade);
                this.activeContracts.set(id, trade);
                
                // Release lock if not handled by Fast Result
                this.isNegotiating = false;
            } else {
                // Durante a operação em aberto, contract.profit costuma ser o profit líquido na Deriv
                trade.pnl = parseFloat(contract.profit || 0);
                if (contract.entry_tick_display_value) trade.entryPrice = contract.entry_tick_display_value;
                if (contract.exit_tick_display_value) {
                    trade.exitPrice = contract.exit_tick_display_value;
                    trade.lastDigit = contract.exit_tick_display_value.slice(-1);
                }
            }
            
            if (contract.is_sold) {
                trade.result = contract.status.toUpperCase(); // 'WON' or 'LOST'
                trade.pnl = parseFloat(contract.profit || 0);

                // ✅ CRITICAL: Process result with RiskManager
                if (trade.fastResultApplied) {
                    RiskManager.refineTradeResult(this.sessionState, trade.pnl, trade.stake, trade.analysisType);
                } else {
                    trade.fastResultApplied = true;
                    if (trade.result === 'WON') this.monitoringStats.wins++;
                    else this.monitoringStats.losses++;
                    
                    // Store old states for logging
                    const oldAnalysis = this.sessionState.analysisType;
                    const oldMode = this.sessionState.negotiationMode;

                    // ✅ Update Chart Markers
                    this.updateChartMarkers(trade, 'tick');
                    this.updateChartMarkers(trade, 'profit');
                    
                    RiskManager.processTradeResult(
                        this.sessionState, 
                        trade.result === 'WON', 
                        trade.pnl, 
                        trade.stake, 
                        trade.analysisType, 
                        this.recoveryConfig.lossesToActivate
                    );

                    // --- Forced Pause Logic (1 Base + 5 Martingales = 6 Losses) ---
                    const totalConsecutiveLosses = this.sessionState.consecutiveLosses + this.sessionState.lossStreakRecovery;
                    
                    if (trade.result !== 'WON') {
                         this.addLog(`🔍 DEBUG PAUSA: Main=${this.sessionState.consecutiveLosses} | Rec=${this.sessionState.lossStreakRecovery} | Total=${totalConsecutiveLosses} | Limit=6`, 'warning');
                    }

                    const limit = this.recoveryConfig.pauseLosses || 6;
                    if (trade.result !== 'WON' && totalConsecutiveLosses >= limit) {
                        const pauseTime = this.recoveryConfig.pauseTime || 2;
                        const pauseDuration = pauseTime * 60 * 1000;
                        this.pauseUntil = Date.now() + pauseDuration;
                        this.addLog(`⏸️ PAUSA ESTRATÉGICA: Limite de ${totalConsecutiveLosses} perdas sequenciais atingido. Pausando por ${pauseTime} min.`, 'warning');
                        // No logic to stop ticks for Monitoring to keep chart alive
                    }

                    this.sessionState.isRecoveryMode = this.sessionState.analysisType === 'RECUPERACAO';

                    // Mode Switching Logs
                    if (this.sessionState.negotiationMode !== oldMode) {
                        this.addLog('Alteração de Sensibilidade', [`🔄 MODO ${this.sessionState.negotiationMode} ATIVADO`], 'warning');
                    }

                    // Recovery Logs
                     if (oldAnalysis === 'PRINCIPAL' && this.sessionState.analysisType === 'RECUPERACAO') {
                          const lossSum = this.sessionState.totalLossAccumulated || this.sessionState.lastStakePrincipal;
                          this.addLog('Ativação de Recuperação', [
                              `⚠️ Modo MARTINGALE ativado`,
                              `Perda acumulada: ${this.preferredCurrencyPrefix}${lossSum.toFixed(2)}`,
                              `Próximo stake: Calculado automaticamente`
                          ], 'warning');
                    } else if (oldAnalysis === 'RECUPERACAO' && this.sessionState.analysisType === 'PRINCIPAL') {
                         this.addLog('Recuperação Concluída', [
                             `✅ SUCESSO na recuperação`,
                             `Voltando ao modo PRINCIPAL`,
                             `Stake resetado para base`
                         ], 'success');
                     } else if (this.sessionState.analysisType === 'RECUPERACAO' && trade.result === 'LOST') {
                          this.addLog('Ajuste Martingale', [
                              `📉 Loss durante recuperação`,
                              `Ajustando stake automaticamente`,
                              `Total acumulado: ${this.preferredCurrencyPrefix}${this.sessionState.totalLossAccumulated.toFixed(2)}`
                          ], 'warning');
                    }
                    
                    RiskManager.refineTradeResult(this.sessionState, trade.pnl, trade.stake);
                }
                
                // Update payout history
                if (trade.result === 'WON') {
                     const payoutRate = (trade.pnl + trade.stake) / trade.stake;
                     const prefix = (trade.analysisType === 'RECUPERACAO') ? 'RECUPERACAO_' : 'PRINCIPAL_';
                     let barrierSuffix = '';
                     if (trade.barrier !== undefined) {
                         barrierSuffix = '_' + trade.barrier;
                     } 
                     RiskManager.updatePayoutHistory(prefix + trade.contract + barrierSuffix, payoutRate);
                }



                // ✅ Sync Session Stats Asynchronously
                this.syncSessionStats();

                // Result Logs
                if (trade.result === 'WON') {
                    this.addLog('Resultado da Operação', [
                        `Status: WIN`,
                        `Contrato ID: ${id}`,
                        `Resultado Financeiro: +${this.preferredCurrencyPrefix}${trade.pnl.toFixed(2)}`,
                        `Stake: ${this.preferredCurrencyPrefix}${trade.stake.toFixed(2)}`,
                        `Extrato: +${this.preferredCurrencyPrefix}${trade.pnl.toFixed(2)} (Líquido)`,
                        `Saldo Atual: ${this.preferredCurrencyPrefix}${this.monitoringStats.balance.toFixed(2)}`
                    ], 'success');
                    } else {
                        const id = trade.id; 
                        this.addLog('Resultado da Operação', [
                            `Status: LOSS`,
                            `Contrato ID: ${id}`,
                        `Resultado Financeiro: -${this.preferredCurrencyPrefix}${Math.abs(trade.pnl).toFixed(2)}`,
                        `Stake: ${this.preferredCurrencyPrefix}${trade.stake.toFixed(2)}`,
                        `Saldo Atual: ${this.preferredCurrencyPrefix}${this.monitoringStats.balance.toFixed(2)}`
                    ], 'error');
                }
                
                // Update stats
                this.monitoringStats.profit += trade.pnl;
                this.profitHistory.push(parseFloat(this.monitoringStats.profit.toFixed(2)));
                
                // Keep history limited (old chart logic - can keep for legacy or remove)
                if (this.profitHistory.length > 50) this.profitHistory.shift();
                
                // Update Lightweight Chart Data
                const profitTick = { time: Math.floor(Date.now() / 1000), value: parseFloat(this.monitoringStats.profit.toFixed(2)) };
                // Ensure time uniqueness (in case trades happen too fast)
                if (this.profitChartData.length > 0 && profitTick.time <= this.profitChartData[this.profitChartData.length - 1].time) {
                    profitTick.time = this.profitChartData[this.profitChartData.length - 1].time + 1;
                }
                this.profitChartData.push(profitTick);
                if (this.profitChartData.length > 5000) this.profitChartData.shift();
                
                this.monitoringStats.balance = parseFloat(this.monitoringStats.balance) + trade.pnl;

                // ✅ UPDATE PEAK PROFIT & STOP BLINDADO
                if (this.monitoringStats.profit > this.sessionState.peakProfit) {
                    this.sessionState.peakProfit = this.monitoringStats.profit;
                }

                // Stop Blindado Trigger (at 50% of target)
                const target = this.currentConfig.profitTarget || 10;
                if (!this.sessionState.stopBlindadoActive && target > 0 && this.monitoringStats.profit >= (target * 0.5)) {
                    this.sessionState.stopBlindadoActive = true;
                    // Protect 40% of peak profit
                    this.sessionState.stopBlindadoFloor = this.sessionState.peakProfit * 0.4;
                    
                    this.addLog('🛡️ STOP BLINDADO ATIVADO', [
                        `Meta: ${this.preferredCurrencyPrefix}${target.toFixed(2)}`,
                        `Gatilho (50%): ${this.preferredCurrencyPrefix}${(target * 0.5).toFixed(2)} atingido`,
                        `Proteção (40% do topo): ${this.preferredCurrencyPrefix}${this.sessionState.stopBlindadoFloor.toFixed(2)} garantidos`
                    ], 'success');
                } else if (this.sessionState.stopBlindadoActive) {
                    // Update floor if peak profit increases
                    const newFloor = this.sessionState.peakProfit * 0.4;
                    if (newFloor > this.sessionState.stopBlindadoFloor) {
                        this.sessionState.stopBlindadoFloor = newFloor;
                    }
                }

                // ✅ LOG PROGRESSO STOP BLINDADO (User Request)
                if (target > 0 && this.currentConfig.useBlindado) {
                    if (!this.sessionState.stopBlindadoActive) {
                        const gatilho = target * 0.5;
                        const faltam = gatilho - this.monitoringStats.profit;
                        if (faltam > 0) {
                            this.addLog('Monitoramento Blindado', [
                                `Status: Inativo (Aguardando Gatilho)`,
                                `Meta Gatilho: ${this.preferredCurrencyPrefix}${gatilho.toFixed(2)} (50% da Meta)`,
                                `Falta: ${this.preferredCurrencyPrefix}${faltam.toFixed(2)} de lucro`
                            ], 'info');
                        }
                    } else {
                         this.addLog('Monitoramento Blindado', [
                            `Status: ATIVO 🛡️`,
                            `Protegendo: ${this.preferredCurrencyPrefix}${this.sessionState.stopBlindadoFloor.toFixed(2)}`,
                            `Lucro Atual: ${this.preferredCurrencyPrefix}${this.monitoringStats.profit.toFixed(2)}`
                        ], 'info');
                    }
                }
                
                // ✅ Check Strategy Limits (Stop Win/Loss/Blindado)
                this.checkStrategyLimits();
                this.activeContracts.delete(id);
            }
        },
        restartIA() {
             this.$router.push('/Investments-IA');
        },
        async stopIA(redirect = true) {
            // ✅ Fix: Do NOT auto-redirect here. Restart logic is handled by restartIA()
            // If session is already finished, strictly do nothing or just show modal (handled below)
            if (this.isSessionFinished && !this.showStopModal) {
                 // Might be a weird state, but let's ensure restarting is explicit
                 return; 
            }

            this.isStopping = true;
            this.stopTickConnection();
            this.addLog('Encerramento de Sessão', [
                `Motivo: ${redirect === true || (typeof redirect === 'object' && redirect.isTrusted) ? 'parada pelo usuário' : 'parada automática'}`,
                `Status: Finalizado`
            ], 'info');
            localStorage.removeItem('ai_active_config');
            if (this.sessionId) await this.syncSessionStats('stopped');
            
            // Only redirect if explicitly requested (default) or if it's a DOM event (click)
            if (redirect === true || (typeof redirect === 'object' && redirect.isTrusted)) {
                setTimeout(() => { this.$router.push('/Investments-IA'); }, 1000);
            } else {
                this.isStopping = false; // Reset loading state if staying on page
            }
            
            // Stop Timer and Log
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
                this.addLog('⏱️ Tempo Total de Sessão', [`Duração: ${this.executionTime}`], 'info');
            }
        },
        startTimer() {
            if (this.timerInterval) return;
            
            this.sessionStartTime = Date.now();
            this.timerInterval = setInterval(this.updateTimer, 1000);
            console.log('[Timer] Started');
        },
        updateTimer() {
            if (!this.sessionStartTime) return;
            
            const now = Date.now();
            const diff = now - this.sessionStartTime;
            
            const hours = Math.floor(diff / 3600000);
            const minutes = Math.floor((diff % 3600000) / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            
            this.executionTime = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        },
        clearLogs() {
            this.monitoringLogs = [];
        },
        exportLogs() {
            if (this.monitoringLogs.length === 0) return;
            
            const formatDate = (date) => {
                const d = new Date(date);
                return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}_${d.getHours()}h${d.getMinutes()}m`;
            };

            const fileName = `zenix-${this.currentConfig.strategy}-${this.currentConfig.mode}-${this.currentConfig.market || 'volatlity'}-${this.currentConfig.risk || 'normal'}-${formatDate(new Date())}.txt`;
            
            let content = `📘 ZENIX LOG EXPORT\n`;
            content += `Estratégia: ${this.currentConfig.strategy}\n`;
            content += `Modo: ${this.currentConfig.mode}\n`;
            content += `Data: ${new Date().toLocaleString()}\n`;
            content += `------------------------------------------\n\n`;

            this.monitoringLogs.forEach(log => {
                content += `[${log.time}] [${log.type.toUpperCase()}] ${log.title}\n`;
                log.details.filter(l => l.toLowerCase() !== 'info').forEach(detail => {
                    content += `  • ${detail}\n`;
                });
                content += `\n`;
            });

            const blob = new Blob([content], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        },
        addLog(title, messages, type = 'info') {
            const time = new Date().toLocaleTimeString();
            this.monitoringLogs.unshift({ title, details: Array.isArray(messages) ? messages : [messages], type, time });
            if (this.monitoringLogs.length > 50000) this.monitoringLogs = this.monitoringLogs.slice(0, 50000);
        },
        getContractDisplayName(type) {
            if (!type) return 'Operação';
            const mapping = {
                'CALL': 'Rise (Compra)',
                'PUT': 'Fall (Venda)',
                'DIGITOVER': 'Over (Acima)',
                'DIGITUNDER': 'Under (Abaixo)',
                'DIGITDIFF': 'Diff (Diferente)',
                'DIGITMATCH': 'Match (Igual)',
                'DIGITEVEN': 'Even (Par)',
                'DIGITODD': 'Odd (Ímpar)'
            };
            return mapping[type] || type;
        },

        resolveMarketSymbol(symbol) {
            const mapping = {
                'vol10': 'R_10',
                'vol25': 'R_25',
                'vol50': 'R_50',
                'vol75': 'R_75',
                'vol100': 'R_100',
                'vol10_1s': '1HZ10V',
                'vol25_1s': '1HZ25V',
                'vol50_1s': '1HZ50V',
                'vol75_1s': '1HZ75V',
                'vol100_1s': '1HZ100V',
                'bear': 'RDBEAR',
                'bull': 'RDBULL'
            };
            return mapping[symbol] || symbol;
        },
        checkStrategyLimits() {
            const profit = parseFloat(this.monitoringStats.profit.toFixed(2));
            const target = this.currentConfig.profitTarget || 10;
            const stopLoss = this.currentConfig.lossLimit || 50;

            // 1. Meta Batida
            if (profit >= target) {
                 this.stopResult = {
                    title: 'Meta Batida! 🚀',
                    message: 'Parabéns! Você atingiu sua meta de lucro.',
                    profit: profit,
                    type: 'success'
                };
                this.showStopModal = true;
                this.stopIA(false);
                return true;
            }

            // 2. Stop Loss
            if (profit <= -stopLoss) {
                console.log('[StopLoss] Triggered! Profit:', profit, 'Limit:', -stopLoss);
                this.stopResult = {
                    title: 'Stop Loss Atingido 🛑',
                    message: 'Limite de perda atingido. Gerenciamento ativado.',
                    profit: profit,
                    type: 'error'
                };
                console.log('[StopLoss] Setting showStopModal = true');
                this.showStopModal = true;
                this.stopIA(false);
                return true;
            }

            // 3. Stop Blindado (Active Protection)
            if (this.sessionState.stopBlindadoActive && profit <= this.sessionState.stopBlindadoFloor) {
                 this.stopResult = {
                    title: 'Stop Blindado 🛡️',
                    message: 'Lucro protegido pelo Stop Blindado.',
                    profit: profit,
                    type: 'warning'
                };
                this.showStopModal = true;
                this.stopIA(false);
                return true;
            }
            
            return false;
        },
        initLightweightChart() {
            if (this.chart) return;
            
            const container = this.$refs.chartContainer;
            if (!container) return;
            
            // Match styles from InvestmentActive.vue
            this.chart = createChart(container, {
                width: container.clientWidth,
                height: 320, 
                layout: {
                    background: { type: ColorType.Solid, color: 'transparent' }, 
                    textColor: '#D9D9D9',
                    padding: { left: 0, right: 0, top: 20, bottom: 0 },
                },
                grid: {
                    vertLines: { color: 'rgba(42, 42, 42, 0.5)' },
                    horzLines: { color: 'rgba(42, 42, 42, 0.5)' },
                },
                timeScale: {
                    timeVisible: true,
                    secondsVisible: true,
                    borderColor: 'rgba(42, 42, 42, 0.5)',
                    rightOffset: 0,
                    fixLeftEdge: true, 
                    shiftVisibleRangeOnNewBar: true,
                },
                rightPriceScale: {
                    borderColor: 'rgba(42, 42, 42, 0.5)',
                },
            });
            
            this.series = this.chart.addLineSeries({
                color: '#22C55E', // Match Green Line
                lineWidth: 2,
            });
            
            if (this.tickChartData.length > 0) {
                this.series.setData(this.tickChartData);
            }

            if (this.chartMarkers.length > 0) {
                this.series.setMarkers(this.chartMarkers);
            }
            
            // Force scroll to latest data
            this.chart.timeScale().scrollToPosition(0, true);
            
            // Handle Resize
            this.resizeObserver = new ResizeObserver(entries => {
                if (entries.length === 0 || !entries[0].contentRect) return;
                const { width } = entries[0].contentRect;
                if (this.chart) {
                    this.chart.applyOptions({ width });
                }
            });
            this.resizeObserver.observe(container);
        },
        updateChartMarkers(trade, type = 'tick') {
            const markersArray = type === 'tick' ? this.chartMarkers : this.profitChartMarkers;
            const dataArray = type === 'tick' ? this.tickChartData : this.profitChartData;
            const seriesObj = type === 'tick' ? this.series : (this.$refs.profitChart ? this.$refs.profitChart.series : null);

            const lastPoint = dataArray[dataArray.length - 1];
            if (!lastPoint) return;

            const existingMarkerIndex = markersArray.findIndex(m => m.id === trade.id);
            
            const markerData = {
                time: lastPoint.time, 
                pnl: trade.pnl || 0,
                id: trade.id,
                count: markersArray.length + (existingMarkerIndex >= 0 ? 0 : 1),
                // Visual marker properties
                position: 'inBar',
                color: (trade.pnl || 0) >= 0 ? '#22C55E' : '#EF4444',
                shape: 'circle',
                size: 0.5, 
                text: `${(trade.pnl || 0) >= 0 ? '+' : ''}${this.currencySymbol}${(trade.pnl || 0).toFixed(2)}`
            };

            if (existingMarkerIndex >= 0) {
                markersArray[existingMarkerIndex] = { ...markersArray[existingMarkerIndex], ...markerData };
            } else {
                markersArray.push(markerData);
            }
            
            if (seriesObj) {
                const rawSeries = toRaw(seriesObj);
                rawSeries.setMarkers(markersArray);
            }
        },
        async startSession() {
            try {
                // ✅ Use helper to extract ID from token (more reliable)
                const userId = this.getUserId() || 'anonymous';
                const aiName = this.currentConfig.strategy || 'Unknown';
                
                const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                
                // Fire and forget, but get ID
                fetch(`${apiBaseUrl}/ai/sessions/start`, {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({ userId, aiName })
                })
                .then(res => res.json())
                .then(data => {
                    if (data && data.data && data.data.sessionId) {
                         this.sessionId = data.data.sessionId;
                         console.log('Session started:', this.sessionId);
                    }
                })
                .catch(e => console.error('Failed to start session:', e));
            } catch (e) { console.error(e); }
        },
        async syncSessionStats(status = 'active') {
            if (!this.sessionId) return;
            const stats = {
                wins: this.monitoringStats.wins,
                losses: this.monitoringStats.losses,
                profit: this.monitoringStats.profit,
                totalTrades: this.monitoringStats.wins + this.monitoringStats.losses,
                status: status
            };
            
            const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
            fetch(`${apiBaseUrl}/ai/sessions/update`, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ sessionId: this.sessionId, stats })
            }).catch(() => {});
        },
        setupProfitChartTooltip() {
            if (!this.$refs.profitChart || this.profitChartSubscribed) return;
            
            this.$nextTick(() => {
                const chart = this.$refs.profitChart.chart;
                const series = this.$refs.profitChart.series;
                const container = this.$refs.profitChartContainer;
                
                if (chart && series && container) {
                    this.profitChartSubscribed = true;
                    console.log('[AIMonitoringView] Profit Chart Hover Interaction Removed');
                }
            });
        },
        getUserId() {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    return payload.userId || payload.sub || payload.id;
                }
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                return user.id;
            } catch (e) { return null; }
        }
    }
}
</script>

<style scoped>
@keyframes fadeIn {
	from { opacity: 0; transform: translateY(10px); }
	to { opacity: 1; transform: translateY(0); }
}

@keyframes float-particle {
    0%, 100% { transform: translateY(0) translateX(0); }
    33% { transform: translateY(-20px) translateX(10px); }
    66% { transform: translateY(10px) translateX(-15px); }
}

@keyframes line-grow {
    from { width: 0; opacity: 0; }
    to { width: 100%; opacity: 1; }
}

.animate-fadeIn {
	animation: fadeIn 0.3s ease-out forwards;
}

.fade-in {
    animation: fadeIn 0.8s ease-out forwards;
}

.fade-in-delay-1 {
    animation: fadeIn 0.8s ease-out 0.2s forwards;
    opacity: 0;
}

.line-grow {
    animation: line-grow 1s ease-out forwards;
}

.card-glass {
    background: rgba(20, 20, 20, 0.4);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
}

.gradient-border {
    position: relative;
}

.gradient-border::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(to bottom right, rgba(34, 197, 94, 0.2), transparent, rgba(255, 255, 255, 0.05));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
}

.dashboard-layout {
	display: flex;
	min-height: 100vh;
	background-color: transparent !important;
	color: #fff;
	font-family: 'Inter', sans-serif;
}

.sidebar-overlay {
	position: fixed;
	inset: 0;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 999;
}

.dashboard-content-wrapper {
	flex-grow: 1;
	transition: all 0.3s ease;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
    padding-left: 280px; /* Default sidebar width */
}

.dashboard-content-wrapper.sidebar-collapsed {
	padding-left: 80px;
}

@media (max-width: 1024px) {
	.dashboard-content-wrapper { 
		width: 100%;
        padding-left: 0 !important;
	}
}

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }

.custom-scrollbar-zenix::-webkit-scrollbar {
    width: 4px;
    height: 4px;
}

.custom-scrollbar-zenix::-webkit-scrollbar-track {
    background: rgba(0, 255, 128, 0.02);
    border-radius: 10px;
}

.custom-scrollbar-zenix::-webkit-scrollbar-thumb {
    background: rgba(0, 255, 128, 0.2);
    border-radius: 10px;
    border: 1px solid rgba(0, 255, 128, 0.05);
}

.custom-scrollbar-zenix::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 255, 128, 0.4);
}

.custom-scrollbar-zenix {
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 255, 128, 0.2) rgba(0, 255, 128, 0.02);
}

.box-shadow-green {
    box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
}

.box-shadow-red {
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
}

</style>
