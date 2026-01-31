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

        <div class="dashboard-content-wrapper">
            <TopNavbar 
                :is-sidebar-collapsed="isSidebarCollapsed"
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
                                     <span class="text-lg lg:text-2xl font-bold text-success tracking-wide drop-shadow-[0_0_12px_hsl(142,76%,45%,0.4)]">
                                        IA {{ currentConfig.strategy.toUpperCase() }}
                                    </span>
                                </div>
                                <div class="h-5 overflow-hidden">
                                    <p class="text-xs lg:text-sm text-foreground/90 font-medium transition-all duration-300 opacity-100 translate-y-0">
                                        {{ activeContracts.size > 0 ? 'Operação em curso' : (monitoringOperations.length > 0 ? 'Coletando dados' : 'Analisando tiques em tempo real') }}
                                    </p>
                                </div>
                                <p class="text-[9px] lg:text-[10px] text-muted-foreground mt-1 uppercase tracking-wider hidden md:block">Sistema operando automaticamente</p>
                            </div>
                        </div>

                        <!-- Capital -->
                        <div class="col-span-1 md:col-span-3 lg:col-span-2 text-center md:border-l border-border/50 md:pl-4 lg:pl-6">
                            <p class="text-[9px] lg:text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Capital</p>
                            <p class="text-xl lg:text-3xl font-bold text-foreground tracking-tight">
                                R$ {{ Math.floor(monitoringStats.balance).toLocaleString('pt-BR') }}<span class="text-base lg:text-xl text-muted-foreground hidden md:inline">,{{ (monitoringStats.balance % 1).toFixed(2).split('.')[1] || '00' }}</span>
                            </p>
                        </div>

                        <!-- Resultado -->
                        <div class="col-span-1 md:col-span-3 lg:col-span-3 text-center border-l border-border/50 pl-3 lg:pl-6 flex flex-col items-center">
                            <p class="text-[9px] lg:text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Resultado</p>
                            <div class="flex items-baseline justify-center gap-1 lg:gap-3">
                                <p class="text-2xl lg:text-4xl font-bold tracking-tight drop-shadow-[0_0_20px_hsl(142,76%,45%,0.3)]"
                                   :class="monitoringStats.profit >= 0 ? 'text-success' : 'text-red-500'">
                                    {{ monitoringStats.profit >= 0 ? '+' : '' }}${{ monitoringStats.profit.toFixed(2).replace('.', ',') }}
                                </p>
                                <span class="text-xs lg:text-lg font-semibold px-1.5 lg:px-2 py-0.5 rounded hidden md:inline"
                                      :class="monitoringStats.profit >= 0 ? 'text-success/80 bg-success/10' : 'text-red-500/80 bg-red-500/10'">
                                    {{ monitoringStats.profit >= 0 ? '+' : '' }}{{ ((monitoringStats.profit / (monitoringStats.balance - monitoringStats.profit || 1)) * 100).toFixed(1) }}%
                                </span>
                            </div>
                            <div class="mt-2 lg:mt-3 h-1 w-[100px] mx-auto bg-gradient-to-r rounded-full line-grow hidden md:block"
                                 :class="monitoringStats.profit >= 0 ? 'from-success/70 via-success/40 to-transparent' : 'from-red-500/70 via-red-500/40 to-transparent'"></div>
                        </div>

                        <!-- Operations Stats -->
                        <div class="col-span-2 md:col-span-3 lg:col-span-4 border-t md:border-t-0 md:border-l border-border/50 pt-4 md:pt-0 md:pl-4 lg:pl-6 mt-2 md:mt-0">
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
                                    <span class="text-[10px] lg:text-xs text-muted-foreground block">WR</span>
                                </div>
                            </div>
                            <!-- Mobile Pause Button -->
                            <button @click="stopIA" :disabled="isStopping" class="inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 w-full mt-4 bg-success hover:bg-success/90 text-success-foreground font-bold py-4 text-sm rounded-xl shadow-lg shadow-success/20 lg:hidden">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pause w-4 h-4 mr-2"><rect x="14" y="4" width="4" height="16" rx="1"></rect><rect x="6" y="4" width="4" height="16" rx="1"></rect></svg>
                                {{ isStopping ? 'Parando...' : 'Pausar IA' }}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Mobile Configuration Cards Stack (Visible only on Mobile) -->
                <div v-if="isMobile" class="mt-4 flex flex-col gap-3 w-full">
                    <!-- Card 1: AI Identity -->
                    <div class="p-4 bg-secondary/40 rounded-2xl border border-border/40 flex items-center gap-4 w-full">
                        <div class="w-14 h-14 rounded-xl bg-success/10 border border-success/30 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-success"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"></path><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"></path><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"></path></svg>
                        </div>
                        <div>
                            <h3 class="text-lg font-black text-foreground tracking-wide uppercase">IA {{ currentConfig.strategy.toUpperCase() }}</h3>
                            <p class="text-xs text-muted-foreground">Especialista em probabilidade</p>
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
                            <span class="text-sm font-black text-foreground tracking-wider">${{ currentConfig.stake.toFixed(2).replace('.', ',') }}</span>
                        </div>
                        <div class="flex items-center justify-between pt-1 border-t border-border/10 mt-1">
                            <span class="text-xs text-muted-foreground font-black uppercase tracking-wider">Alvo</span>
                            <span class="text-sm font-black text-success tracking-wider">${{ (currentConfig.profitTarget || 0).toFixed(2).replace('.', ',') }}</span>
                        </div>
                        <div class="flex items-center justify-between pt-1 border-t border-border/10 mt-1">
                            <span class="text-xs text-muted-foreground font-black uppercase tracking-wider">Limite</span>
                            <span class="text-sm font-black text-foreground tracking-wider">${{ (currentConfig.lossLimit || 0).toFixed(2).replace('.', ',') }}</span>
                        </div>
                    </div>

                    <!-- Card 4: Protection -->
                    <div class="p-5 bg-secondary/40 rounded-2xl border border-border/40 flex items-center justify-between w-full">
                        <div class="flex items-center gap-4">
                            <div class="w-10 h-10 rounded-lg bg-success/5 border border-success/20 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-success"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                            </div>
                            <span class="text-xs font-black text-foreground tracking-wider uppercase">Stoploss Blindado</span>
                        </div>
                        <span class="text-xs font-black text-success uppercase tracking-widest">{{ currentConfig.stoplossBlindado ? 'ATIVO' : 'INATIVO' }}</span>
                    </div>

                    <!-- Mobile Pause Button -->
                    <button @click="stopIA" :disabled="isStopping" class="w-full mt-2 py-4 bg-success text-black font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl transition-all duration-300 shadow-xl shadow-success/20 active:scale-[0.98] disabled:opacity-50">
                        {{ isStopping ? 'Parando...' : 'Pausar IA' }}
                    </button>
                </div>

                <!-- Main Content Layout (70/30 Split on Desktop, stack on Mobile) -->
                <div class="mt-4 md:mt-6 lg:mt-8 flex flex-col lg:flex-row gap-4 lg:gap-6 w-full flex-1">
                    <!-- Left Column: Tabs & Content (Chart/History/Logs) -->
                    <div class="w-full lg:w-[72%] card-glass rounded-2xl border border-border/50 p-4 md:p-6 lg:p-8 fade-in-delay-1 gradient-border flex flex-col">
                        <div class="w-full flex-1 flex flex-col">
                            <!-- Custom Tabs -->
                            <div class="flex items-center justify-start text-muted-foreground border-b border-border mb-6 gap-6 h-auto p-0">
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

                            <!-- Chart Tab -->
                            <div v-show="activeMonitoringTab === 'chart'" class="space-y-6 animate-fadeIn flex-1 flex flex-col">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <h3 style="font-size: 18px; color: #FFFFFF;" class="font-bold tracking-tight">Evolução do Resultado da IA {{ currentConfig.strategy.toUpperCase() }}</h3>
                                        <p style="font-size: 14px; color: #a6a6a6;" class="mt-1">Desempenho financeiro em tempo real</p>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <div class="w-8 h-0.5 bg-gradient-to-r from-success to-success/40 rounded-full"></div>
                                        <span class="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Resultado ($)</span>
                                    </div>
                                </div>
                                <div class="flex-1 min-h-80 w-full bg-secondary/10 rounded-xl border border-border/20 p-4 relative overflow-hidden">
                                    <LineChart 
                                       chartId="monitoring-profit-chart" 
                                       :data="profitHistory" 
                                       :height="320"
                                       color="#22C55E"
                                    />
                                    <div v-if="profitHistory.length <= 1" class="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[2px] z-10 transition-opacity duration-500">
                                        <div class="text-center">
                                           <i class="fas fa-chart-line text-5xl text-success/20 mb-4 block animate-bounce"></i>
                                           <p class="text-muted-foreground text-sm font-medium">Aguardando primeira operação...</p>
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
                                                        <th class="px-4 py-4 text-left font-semibold">
                                                            <div class="flex items-center gap-2">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock w-3.5 h-3.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                                                Horário
                                                            </div>
                                                        </th>
                                                        <th class="px-4 py-4 text-left font-semibold">Tipo</th>
                                                        <th class="px-4 py-4 text-left font-semibold">Mercado</th>
                                                        <th class="px-4 py-4 text-left font-semibold">Investido</th>
                                                        <th class="px-4 py-4 text-left font-semibold">Status</th>
                                                        <th class="px-4 py-4 text-right font-semibold">Resultado</th>
                                                    </tr>
                                                </thead>
                                                <tbody class="text-[13px]">
                                                    <tr v-for="(op, index) in monitoringOperations" :key="op.id" 
                                                        class="border-b border-border/20 transition-colors hover:bg-secondary/30"
                                                        :class="index % 2 === 0 ? 'bg-transparent' : 'bg-secondary/10'">
                                                        <td class="px-4 py-4 font-mono font-medium text-foreground">{{ op.time }}</td>
                                                        <td class="px-4 py-4">
                                                            <span :class="op.type === 'CALL' ? 'bg-success/10 text-success border-success/20' : 'bg-red-500/10 text-red-500/70 border-red-500/20'" 
                                                                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border uppercase tracking-wider">
                                                                <svg v-if="op.type === 'CALL'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-up w-3 h-3"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                                                                <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-down w-3 h-3"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline><polyline points="16 17 22 17 22 11"></polyline></svg>
                                                                {{ op.type === 'CALL' ? 'Compra' : 'Venda' }}
                                                            </span>
                                                        </td>
                                                        <td class="px-4 py-4 text-muted-foreground font-mono">{{ op.market }}</td>
                                                        <td class="px-4 py-4 text-foreground font-medium">$ {{ op.stake.toFixed(2) }}</td>
                                                        <td class="px-4 py-4 text-foreground font-medium">
                                                            <span v-if="op.result === 'OPEN'" class="text-yellow-500 font-bold uppercase tracking-tight">OPEN</span>
                                                            <span v-else :class="op.result === 'WIN' ? 'text-success' : 'text-red-500'" class="font-bold">
                                                                {{ op.result }}
                                                            </span>
                                                        </td>
                                                        <td class="px-4 py-4 text-right">
                                                            <span v-if="op.result === 'OPEN'" class="text-muted-foreground/40 font-bold">-</span>
                                                            <span v-else class="font-bold" :class="op.result === 'WIN' ? 'text-success' : 'text-red-500'">
                                                                {{ op.result === 'WIN' ? '+' : '' }}${{ op.pnl.toFixed(2) }}
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
                                                    <span v-else :class="op.result === 'WIN' ? 'bg-success/10 text-success border-success/20' : 'bg-red-500/10 text-red-500 border-red-500/20'" 
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
                                                        <span class="text-xs font-bold text-foreground">$ {{ op.stake.toFixed(2) }}</span>
                                                    </div>
                                                    <div class="flex flex-col items-end">
                                                        <span class="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-0.5">Resultado</span>
                                                        <span v-if="op.result === 'OPEN'" class="text-xs font-bold text-muted-foreground">-</span>
                                                        <span v-else class="text-xs font-black" :class="op.result === 'WIN' ? 'text-success' : 'text-red-500'">
                                                            {{ op.result === 'WIN' ? '+' : '' }}${{ op.pnl.toFixed(2) }}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <tr v-if="monitoringOperations.length === 0">
                                            <div class="text-center py-20 text-muted-foreground/30 uppercase text-[10px] font-black tracking-[0.2em] w-full">
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
                                    <div class="flex items-center gap-3">
                                        <button @click="clearLogs" class="flex-1 px-4 py-3 bg-secondary/20 hover:bg-secondary/40 border border-border/30 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground transition-all">
                                            LIMPAR LOGS
                                        </button>
                                        <button @click="exportLogs" class="flex-1 px-4 py-3 bg-success/10 hover:bg-success/20 border border-success/30 rounded-xl text-[10px] font-black uppercase tracking-widest text-success transition-all">
                                            EXPORTAR LOGS
                                        </button>
                                    </div>
                                    <div class="text-[10px] text-muted-foreground/60 font-black uppercase tracking-[0.2em] text-right">
                                        {{ monitoringLogs.length }} ENTRADAS
                                    </div>
                                </div>

                                <!-- Desktop Logs Header -->
                                <div v-else class="mb-8 px-1 flex items-end justify-between">
                                    <div class="space-y-1">
                                        <h3 style="font-size: 18px; color: #FFFFFF;" class="font-bold tracking-tight">Registros da IA</h3>
                                        <p style="font-size: 14px; color: #a6a6a6;">Acompanhe cada ação realizada pelo sistema</p>
                                    </div>
                                    <div class="flex flex-col items-end gap-3">
                                        <span class="text-[10px] text-muted-foreground/60 font-black uppercase tracking-[0.2em]">{{ monitoringLogs.length }} ENTRADAS</span>
                                        <div class="flex items-center gap-3">
                                            <button @click="clearLogs" class="px-5 py-2.5 bg-secondary/10 hover:bg-secondary/20 border border-border/20 rounded-lg text-[10px] font-bold uppercase tracking-widest text-muted-foreground transition-all">
                                                LIMPAR LOGS
                                            </button>
                                            <button @click="exportLogs" class="px-5 py-2.5 bg-success/5 hover:bg-success/15 border border-success/30 rounded-lg text-[10px] font-bold uppercase tracking-widest text-success transition-all">
                                                EXPORTAR LOGS
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-col space-y-4 w-full max-h-[600px] overflow-y-auto custom-scrollbar-zenix pr-2">
                                    <div v-for="log in monitoringLogs" :key="log.id" 
                                         class="w-full group relative p-5 bg-[#0D0D0D] rounded-xl border border-border/10 hover:border-success/20 transition-all duration-300">
                                        <!-- Mobile Item: Inline Timestamp -->
                                        <div v-if="isMobile">
                                            <div class="flex items-center gap-2.5 mb-2.5">
                                                <span class="text-[10px] font-mono text-muted-foreground/40 mt-0.5">[{{ log.time }}]</span>
                                                <div class="w-1.5 h-1.5 rounded-full" 
                                                     :class="{ 
                                                        'bg-success shadow-[0_0_10px_#22C55E]': log.type === 'success', 
                                                        'bg-red-500 shadow-[0_0_10px_#EF4444]': log.type === 'error', 
                                                        'bg-blue-400 shadow-[0_0_10px_#60A5FA]': log.type === 'info', 
                                                        'bg-yellow-400 shadow-[0_0_10px_#FACC15]': log.type === 'warning' 
                                                     }"></div>
                                                <h4 class="text-[10px] font-black uppercase tracking-[0.14em]"
                                                    :class="{ 
                                                        'text-success': log.type === 'success', 
                                                        'text-red-500': log.type === 'error', 
                                                        'text-blue-400 font-bold': log.type === 'info', 
                                                        'text-yellow-400': log.type === 'warning' 
                                                    }">
                                                    {{ log.title }}
                                                </h4>
                                            </div>
                                            <ul class="space-y-1.5 ml-4 border-l border-border/10 pl-3">
                                                <li v-for="(line, idx) in log.details.filter(l => l.toLowerCase() !== 'info')" :key="idx" class="flex items-start gap-3">
                                                    <span class="text-muted-foreground/20 mt-1">•</span>
                                                    <span class="text-[10px] font-medium text-[#d1d1d6] leading-relaxed">{{ line }}</span>
                                                </li>
                                            </ul>
                                        </div>
                                        <!-- Desktop Item -->
                                        <div v-else class="flex items-start gap-4">
                                            <span class="text-[11px] font-mono text-muted-foreground/40 mt-1">[{{ log.time }}]</span>
                                            <div class="flex-1">
                                                <div class="flex items-center gap-2.5 mb-2.5">
                                                    <div class="w-1.5 h-1.5 rounded-full" 
                                                         :class="{ 
                                                            'bg-success shadow-[0_0_10px_#22C55E]': log.type === 'success', 
                                                            'bg-red-500 shadow-[0_0_10px_#EF4444]': log.type === 'error', 
                                                            'bg-blue-400 shadow-[0_0_10px_#60A5FA]': log.type === 'info', 
                                                            'bg-yellow-400 shadow-[0_0_10px_#FACC15]': log.type === 'warning' 
                                                         }"></div>
                                                    <h4 class="text-[11px] font-black uppercase tracking-[0.15em]"
                                                        :class="{ 
                                                            'text-success': log.type === 'success', 
                                                            'text-red-500': log.type === 'error', 
                                                            'text-blue-400 font-bold': log.type === 'info', 
                                                            'text-yellow-400': log.type === 'warning' 
                                                        }">
                                                        {{ log.title }}
                                                    </h4>
                                                </div>
                                                <ul class="space-y-1.5 ml-[1.125rem]">
                                                    <li v-for="(line, idx) in log.details.filter(l => l.toLowerCase() !== 'info')" :key="idx" class="flex items-start gap-3">
                                                        <span class="text-muted-foreground/20 select-none mt-1">•</span>
                                                        <span class="text-[11px] font-medium text-[#d1d1d6] leading-relaxed">{{ line }}</span>
                                                    </li>
                                                </ul>
                                            </div>
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
                                        <h3 class="text-base font-bold text-foreground tracking-wide uppercase">IA {{ currentConfig.strategy.toUpperCase() }}</h3>
                                        <p class="text-xs text-muted-foreground">Especialista em probabilidade</p>
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
                                    <span class="text-sm font-bold text-foreground">${{ currentConfig.stake.toFixed(2) }}</span>
                                </div>
                                <div class="border-t border-border/40 pt-2.5 flex justify-between items-center">
                                    <span class="text-xs text-muted-foreground uppercase tracking-wider">Alvo</span>
                                    <span class="text-sm font-bold text-success">${{ (currentConfig.profitTarget || 0).toFixed(2) }}</span>
                                </div>
                                <div class="border-t border-border/40 pt-2.5 flex justify-between items-center">
                                    <span class="text-xs text-muted-foreground uppercase tracking-wider">Limite</span>
                                    <span class="text-sm font-bold text-foreground">${{ (currentConfig.lossLimit || 0).toFixed(2) }}</span>
                                </div>
                            </div>

                            <!-- Protections -->
                            <div class="mt-3 p-4 rounded-xl bg-success/5 border border-success/30 hover:bg-success/10 transition-colors">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <div class="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center border border-success/30">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-check w-4 h-4 text-success"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></svg>
                                        </div>
                                        <span class="text-sm font-bold text-foreground">Stoploss Blindado</span>
                                    </div>
                                    <span class="text-[10px] font-black text-success uppercase tracking-[0.1em]">
                                        {{ currentConfig.stoplossBlindado ? 'ATIVO' : 'INATIVO' }}
                                    </span>
                                </div>
                            </div>

                            <div class="flex-1 min-h-[40px]"></div>

                            <!-- Desktop Pause Button -->
                            <div class="mt-auto px-1 pt-6 border-t border-border/40">
                                <button @click="stopIA" :disabled="isStopping" class="group flex items-center justify-center w-full h-[52px] bg-success text-black font-black uppercase tracking-widest text-[11px] rounded-xl transition-all duration-300 shadow-xl shadow-success/30 active:scale-[0.98] disabled:opacity-50">
                                    <div class="flex items-center gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" class="w-4 h-4"><rect x="14" y="4" width="4" height="16" rx="1"></rect><rect x="6" y="4" width="4" height="16" rx="1"></rect></svg>
                                        <span class="mt-0.5">{{ isStopping ? 'Parando...' : 'Pausar IA' }}</span>
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
            @close="showSettingsModal = false" 
        />
    </div>
</template>

<script>
import AppSidebar from '../../components/Sidebar.vue';
import TopNavbar from '../../components/TopNavbar.vue';
import DesktopBottomNav from '../../components/DesktopBottomNav.vue';
import SettingsSidebar from '../../components/SettingsSidebar.vue';
import LineChart from '../../components/Charts/LineChart.vue';
import { StrategyAnalysis } from '../../utils/StrategyAnalysis';
import RiskManager from '../../utils/RiskManager';
// Import strategy configurations
import apolloStrategy from '../../utils/strategies/apollo.json';
import atlasStrategy from '../../utils/strategies/atlas.json';
import nexusStrategy from '../../utils/strategies/nexus.json';
import orionStrategy from '../../utils/strategies/orion.json';
import titanStrategy from '../../utils/strategies/titan.json';

const strategyConfigs = {
	apollo: apolloStrategy,
	atlas: atlasStrategy,
	nexus: nexusStrategy,
	orion: orionStrategy,
	titan: titanStrategy
};

export default {
    name: 'AIMonitoringView',
    components: {
        AppSidebar,
        TopNavbar,
        DesktopBottomNav,
        SettingsSidebar,
        LineChart
    },
    data() {
        return {
            isSidebarOpen: false,
            isSidebarCollapsed: false,
            isMobile: false,
            showSettingsModal: false,
            isStopping: false,
            activeMonitoringTab: 'chart',

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

           // ✅ RiskManager State
            sessionState: {
                isRecoveryMode: false,
                isStopped: false,
                peakProfit: 0,
                stopBlindadoActive: false,
                stopBlindadoFloor: 0,
                
                // RiskManager Variables
                analysisType: 'PRINCIPAL',
                negotiationMode: 'VELOZ',
                activeStrategy: 'PRINCIPAL',
                lastResultWin: false,
                lastProfit: 0,
                lastStake: 0,
                lastPayoutPrincipal: null,
                lastProfitPrincipal: 0,
                lastStakePrincipal: 0,
                lastPayoutRecovery: null,
                lastProfitRecovery: 0,
                lastStakeRecovery: 0,
                consecutiveLosses: 0,
                consecutiveWins: 0,
                lossStreakRecovery: 0,
                totalLossAccumulated: 0,
                recoveredAmount: 0,
                skipSorosNext: false,
                lastContractType: null
            },

            // ✅ Recovery Configuration
            recoveryConfig: {
                tradeType: 'DIGITUNDER',
                prediction: 4,
                duration: 1,
                durationUnit: 't',
                market: 'R_100',
                expectedPayout: 1.26,
                attackFilters: [],
                pauseFilters: [],
                lossesToActivate: 1,
                riskProfile: 'moderado'
            },

            monitoringStats: {
                balance: 0,
                profit: 0,
                wins: 0,
                losses: 0,
                status: 'Conectando...',
                statusDesc: 'Inicializando WebSocket'
            },

            monitoringLogs: [],
            monitoringOperations: [],
            profitHistory: [0], // Start with 0 profit
            activeContracts: new Map()
        }
    },
    mounted() {
        this.checkMobile();
        window.addEventListener('resize', this.checkMobile);
        this.loadConfiguration();
        this.initTickConnection();
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.checkMobile);
        this.stopTickConnection();
    },
    methods: {
        checkMobile() {
            this.isMobile = window.innerWidth < 768;
            if (!this.isMobile) this.isSidebarOpen = false;
        },
        closeSidebar() {
            this.isSidebarOpen = false;
        },
        toggleSidebarCollapse() {
            this.isSidebarCollapsed = !this.isSidebarCollapsed;
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
                        expectedPayout: parsed.expectedPayout || baseConfig.form.expectedPayout || 1.20,
                        sorosLevel: parsed.sorosLevel !== undefined ? parsed.sorosLevel : (baseConfig.form.sorosLevel || 1),
                        attackFilters: baseConfig.form.attackFilters // Sempre usar filtros do arquivo base para integridade
                    };

                    // 3. Merge Configuração de Recuperação
                    // Prioridade: Base do Arquivo (para garantir estrutura) > Ajustes se necessário
                    this.recoveryConfig = {
                        ...baseConfig.recoveryConfig,
                        // Se quisermos permitir override via UI no futuro:
                        // ...parsed.recoveryConfig
                    };
                    
                    // Garantir types corretos
                    this.currentConfig.initialStake = parseFloat(this.currentConfig.initialStake || this.currentConfig.stake);
                    
                    // Inicializar Risk Session com valores corretos
                    this.sessionState = RiskManager.initSession(this.currentConfig.initialStake);
                    this.sessionState.activeStrategy = 'PRINCIPAL';
                    
                    // Initial Logs according to ZENIX protocol
                    this.addLog('Início de Sessão', [
                        `Saldo Inicial: $${this.monitoringStats.balance.toFixed(2)}`,
                        `Meta de Lucro: $${(this.currentConfig.profitTarget || 100).toFixed(2)}`,
                        `Stop Loss: $${(this.currentConfig.lossLimit || 100).toFixed(2)}`,
                        `Estratégia: ${this.currentConfig.strategy.toUpperCase()}`,
                        `Payout Mínimo: ${this.currentConfig.expectedPayout}x`
                    ], 'info');

                    this.addLog('Configuração Inicial', [
                        `Agente: ${this.currentConfig.strategy.toUpperCase()}`,
                        `Modo: ${this.currentConfig.mode.toUpperCase()}`,
                        `Stake: $${this.currentConfig.initialStake.toFixed(2)}`,
                        `Soros Level: ${this.currentConfig.sorosLevel}`
                    ], 'info');

                } catch (e) {
                    console.error('Error loading config:', e);
                    this.addLog('Erro Config', `Falha ao carregar configuração: ${e.message}`, 'error');
                }
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
                        if (tokensByLoginId[accountLoginid]) {
                            return tokensByLoginId[accountLoginid].trim();
                        }
                    }
                }
                const defaultToken = localStorage.getItem('deriv_token');
                return defaultToken ? defaultToken.trim() : null;
            } catch (e) {
                console.error('Error getting token:', e);
                return null;
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
                                    `Mensagem: ${msg.error.message}`
                                ], 'error');
                            } else {
                                this.isAuthorized = true;
                                this.monitoringStats.balance = msg.authorize.balance;
                                this.addLog('Execução Confirmada', [
                                    `Status: Autorizado`,
                                    `Saldo: $${this.monitoringStats.balance.toFixed(2)}`,
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
                                this.addLog('Proposta Negada', [
                                    `Motivo: ${msg.error.message}`,
                                    `Ação: Entrada cancelada`
                                ], 'error');
                                return;
                            }
                            
                            const proposalId = msg.proposal.id;
                            const payout = msg.proposal.payout;
                            const stakeValue = msg.proposal.ask_price;
                            
                            // Debug Info
                            this.addLog('Proposta Recebida', [
                                `Payout: $${payout} (${((payout - stakeValue)/stakeValue*100).toFixed(1)}%)`,
                                `Stake: $${stakeValue}`,
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
                            } else {
                                const payout = msg.buy.payout;
                                const contractType = this.sessionState.lastContractType || 'Contrato'; // Saved in state
                                
                                this.addLog('Contrato Criado', [
                                    `Contrato ID: ${msg.buy.contract_id}`,
                                    `Tipo: ${contractType}`,
                                    `Payout Potencial: $${payout}`,
                                    `Status: aguardar execução`
                                ], 'success');
                                this.subscribeToContract(msg.buy.contract_id);
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
                this.ws.close();
                this.ws = null;
            }
            this.tickSubscriptionId = null;
        },
        subscribeTicks() {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify({
                    ticks: 'R_100',
                    subscribe: 1
                }));
                this.monitoringStats.status = 'Monitorando';
                this.monitoringStats.statusDesc = 'Analisando tiques em tempo real';
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
                if (msg.subscription) this.tickSubscriptionId = msg.subscription.id;
                if (this.tickCount % 10 === 0) this.addLog(`📈 Tick #${this.tickCount}: ${price}`, 'info');
                this.tickHistory.unshift(price);
                if (this.tickHistory.length > 100) this.tickHistory.pop();
                const lastDigit = parseInt(price.toString().slice(-1));
                this.digitHistory.unshift(lastDigit);
                if (this.digitHistory.length > 100) this.digitHistory.pop();
                this.runAIAnalysis();
            }
        },
        runAIAnalysis() {
            // ✅ Sincronização: Aguardar resultado do contrato antes de nova análise
            if (this.activeContracts.size > 0) return;

            const strategyKey = this.currentConfig.strategy.toLowerCase();
            const strategyConfig = strategyConfigs[strategyKey];
            if (!strategyConfig || !strategyConfig.config) return;
            const attackFilters = strategyConfig.config.form.attackFilters || [];
            if (attackFilters.length === 0) return;
            const data = { tickHistory: this.tickHistory, digitHistory: this.digitHistory };
            const results = attackFilters.map(filter => StrategyAnalysis.evaluate(filter, data));
            const allPassed = results.every(r => r.pass);
            results.forEach(res => { if (!res.pass) this.addLog(`🔍 ${res.reason}`, 'info'); });
            if (allPassed) {
                this.addLog('Sinal de Entrada', [
                    `Análise: PRINCIPAL`,
                    `Direção: CONFIRMADA`,
                    `Contrato: EVALUATING`,
                    `Ação: Executar ordem`
                ], 'success');
                this.executeAITrade(strategyConfig);
            }
        },
        calculateNextStake() {
            const isRecovery = this.sessionState.analysisType === 'RECUPERACAO';
            const config = isRecovery ? this.recoveryConfig : this.currentConfig;
            
            console.log('[AIMonitoring] calculateNextStake:', {
                isRecovery,
                consecutiveWins: this.sessionState.consecutiveWins,
                lastResultWin: this.sessionState.lastResultWin,
                skipSorosNext: this.sessionState.skipSorosNext,
                totalLossAccumulated: this.sessionState.totalLossAccumulated
            });
            
            const stake = RiskManager.calculateNextStake(this.sessionState, config);
            
            // Log Soros if active
            if (!isRecovery && this.sessionState.consecutiveWins === 2 && this.sessionState.lastResultWin) {
                this.addLog('Gestão Soros', [
                    `🚀 SOROS ATIVADO`,
                    `Stake: Base + Lucro = $${stake.toFixed(2)}`,
                    `Sequência: ${this.sessionState.consecutiveWins} vitórias`
                ], 'info');
            }
            
            console.log('[AIMonitoring] Calculated stake:', stake);
            return stake;
        },
        executeAITrade() {
            if (!this.isAuthorized) {
                this.addLog('⚠️ Entrada negada: Não autorizado', 'warning');
                return;
            }
            if (this.activeContracts.size > 0) return;
            
            // ✅ USE RISKMANAGER & CONFIGS
            const isFinancialRecovery = this.sessionState.analysisType === 'RECUPERACAO';
            // Determine active config (use merged configs from this, not raw strategyConfig)
            const config = isFinancialRecovery ? this.recoveryConfig : this.currentConfig;
            
            // ✅ Calculate stake dynamically
            const stake = this.calculateNextStake();
            
            // Update Contract Type state for logging
            this.sessionState.lastContractType = config.tradeType;
            
            const proposalParams = {
                proposal: 1,
                amount: stake,
                basis: 'stake',
                contract_type: config.tradeType,
                currency: 'USD',
                duration: config.duration || 1,
                duration_unit: config.durationUnit || 't',
                symbol: config.market || 'R_100'
            };
            
            if (['DIGITOVER', 'DIGITUNDER', 'DIGITMATCH', 'DIGITDIFF'].includes(config.tradeType)) {
                proposalParams.barrier = (config.prediction || 8).toString();
            }
            
            const mode = isFinancialRecovery ? 'RECUPERAÇÃO/MARTINGALE' : 'PRINCIPAL';
            this.addLog('Solicitando Proposta', [
                `Modo: ${mode}`,
                `Contrato: ${config.tradeType}`,
                `Mercado: ${proposalParams.symbol}`,
                `Stake: $${stake.toFixed(2)}`
            ], 'info');
            
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify(proposalParams));
            } else {
                this.addLog('❌ WebSocket não conectado', 'error');
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
                    stake: contract.buy_price,
                    pnl: contract.profit || 0,
                    analysisType: this.sessionState.analysisType, // ✅ CRITICAL
                    result: 'OPEN',
                    barrier: contract.barrier,
                    fastResultApplied: false
                };
                this.monitoringOperations.unshift(trade);
                this.activeContracts.set(id, trade);
            } else {
                trade.pnl = contract.profit || 0;
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
                    
                    // Store old analysis type for logging
                    const oldAnalysis = this.sessionState.analysisType;
                    
                    RiskManager.processTradeResult(
                        this.sessionState, 
                        trade.result === 'WON', 
                        trade.pnl, 
                        trade.stake, 
                        trade.analysisType, 
                        this.recoveryConfig.lossesToActivate
                    );

                    this.sessionState.isRecoveryMode = this.sessionState.analysisType === 'RECUPERACAO';

                    // Recovery Logs
                    if (oldAnalysis === 'PRINCIPAL' && this.sessionState.analysisType === 'RECUPERACAO') {
                         const lossSum = this.sessionState.totalLossAccumulated || this.sessionState.lastStakePrincipal;
                         this.addLog('Ativação de Recuperação', [
                             `⚠️ Modo MARTINGALE ativado`,
                             `Perda acumulada: $${lossSum.toFixed(2)}`,
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
                             `Total acumulado: $${this.sessionState.totalLossAccumulated.toFixed(2)}`
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

                // Result Logs
                if (trade.result === 'WON') {
                    this.addLog('Resultado da Operação', [
                        `Status: WIN`,
                        `Contrato ID: ${id}`,
                        `Resultado Financeiro: +$${trade.pnl.toFixed(2)}`,
                        `Stake: $${trade.stake.toFixed(2)}`,
                        `Saldo Atual: $${(this.monitoringStats.balance + trade.pnl).toFixed(2)}`
                    ], 'success');
                } else {
                    this.addLog('Resultado da Operação', [
                        `Status: LOSS`,
                        `Contrato ID: ${id}`,
                        `Resultado Financeiro: -$${Math.abs(trade.pnl).toFixed(2)}`,
                        `Stake: $${trade.stake.toFixed(2)}`,
                        `Saldo Atual: $${(this.monitoringStats.balance + trade.pnl).toFixed(2)}`
                    ], 'error');
                }
                
                // Update stats
                this.monitoringStats.profit += trade.pnl;
                this.profitHistory.push(parseFloat(this.monitoringStats.profit.toFixed(2)));
                if (this.profitHistory.length > 50) this.profitHistory.shift();
                
                this.monitoringStats.balance = parseFloat(this.monitoringStats.balance) + trade.pnl;
                this.activeContracts.delete(id);
            }
        },
        async stopIA() {
            this.isStopping = true;
            this.stopTickConnection();
            this.addLog('Encerramento de Sessão', [
                `Motivo: parada pelo usuário`,
                `Status: Finalizado`
            ], 'info');
            localStorage.removeItem('ai_active_config');
            setTimeout(() => { this.$router.push('/StatsIAs'); }, 1000);
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
        addLog(title, details = [], type = 'info') {
            this.monitoringLogs.unshift({
                id: Date.now() + Math.random(),
                time: new Date().toLocaleTimeString(),
                title,
                details: Array.isArray(details) ? details : [details],
                type
            });
            if (this.monitoringLogs.length > 100) this.monitoringLogs = this.monitoringLogs.slice(0, 100);
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
	background-color: #0B0B0B;
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
	margin-left: 280px;
	width: calc(100% - 280px);
	transition: all 0.3s ease;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
}

.dashboard-content-wrapper.sidebar-collapsed {
	margin-left: 0;
	width: 100%;
}

@media (max-width: 1024px) {
	.dashboard-content-wrapper { 
		margin-left: 0; 
		width: 100%;
	}
	.dashboard-content-wrapper.sidebar-collapsed { margin-left: 0; }
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
</style>
