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
                @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
                @toggle-sidebar-collapse="toggleSidebarCollapse"
                @open-settings="showSettingsModal = true"
            />

            <main class="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
                <!-- Header Stats Card -->
                <div class="bg-gradient-to-br from-secondary/60 via-secondary/40 to-secondary/20 rounded-2xl border border-border/30 p-4 md:p-6 lg:p-8 relative overflow-hidden fade-in shadow-2xl shadow-black/40">
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
                                     <span class="text-xl lg:text-3xl font-black text-success tracking-tight drop-shadow-[0_0_12px_hsl(142,76%,45%,0.6)]">
                                        IA {{ currentConfig.strategy.toUpperCase() }}
                                    </span>
                                </div>
                                <div class="h-5 overflow-hidden">
                                    <p class="text-xs lg:text-sm text-foreground/80 font-medium transition-all duration-300 opacity-100 translate-y-0">
                                        {{ monitoringStats.statusDesc || 'Iniciando sistema...' }}
                                    </p>
                                </div>
                                <p class="text-[9px] lg:text-[10px] text-muted-foreground/60 mt-1 uppercase tracking-[0.2em] hidden md:block">Sistema operando automaticamente</p>
                            </div>
                        </div>

                        <!-- Capital -->
                        <div class="col-span-1 md:col-span-3 lg:col-span-3 text-center md:border-l md:border-border/10 md:pl-4 lg:pl-10">
                            <p class="text-[9px] lg:text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-2">Capital</p>
                            <p class="text-2xl lg:text-4xl font-black text-foreground tracking-tight leading-none">
                                ${{ Math.floor(monitoringStats.balance).toLocaleString('pt-BR') }}<span class="text-lg lg:text-2xl text-muted-foreground font-bold">,{{ (monitoringStats.balance % 1).toFixed(2).split('.')[1] || '00' }}</span>
                            </p>
                        </div>

                        <!-- Resultado -->
                        <div class="col-span-1 md:col-span-3 lg:col-span-3 text-center border-l border-border/10 pl-3 lg:pl-10">
                            <p class="text-[9px] lg:text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-2">Resultado</p>
                            <div class="flex flex-col items-center justify-center gap-0">
                                <p class="text-2xl lg:text-5xl font-black tracking-tighter drop-shadow-[0_0_30px_hsl(142,76%,45%,0.5)] leading-tight"
                                   :class="monitoringStats.profit >= 0 ? 'text-success' : 'text-red-500'">
                                    {{ monitoringStats.profit >= 0 ? '+' : '' }}${{ monitoringStats.profit.toFixed(2).replace('.', ',') }}
                                </p>
                                <div class="flex items-center gap-2">
                                    <span class="text-[10px] lg:text-sm font-bold bg-success/15 px-2 py-0.5 rounded-full border border-success/20"
                                          :class="monitoringStats.profit >= 0 ? 'text-success' : 'text-red-500 bg-red-500/15 border-red-500/20'">
                                        {{ monitoringStats.profit >= 0 ? '+' : '' }}{{ ((monitoringStats.profit / (monitoringStats.balance - monitoringStats.profit || 1)) * 100).toFixed(1) }}%
                                    </span>
                                </div>
                            </div>
                            <div class="mt-3 h-1 w-20 lg:w-32 mx-auto bg-gradient-to-r rounded-full line-grow hidden md:block"
                                 :class="monitoringStats.profit >= 0 ? 'from-success via-success/40 to-transparent' : 'from-red-500 via-red-500/40 to-transparent'"></div>
                        </div>

                        <!-- Operations Stats -->
                        <div class="col-span-2 md:col-span-3 lg:col-span-3 border-t md:border-t-0 md:border-l border-border/10 pt-4 md:pt-0 md:pl-4 lg:pl-10 mt-2 md:mt-0">
                            <p class="text-[9px] lg:text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-3">Operações</p>
                            <div class="flex items-center justify-between lg:gap-8 text-sm">
                                <div class="text-center">
                                    <span class="text-xl lg:text-2xl font-black text-foreground">{{ monitoringStats.wins + monitoringStats.losses }}</span>
                                    <span class="text-[9px] lg:text-[10px] text-muted-foreground block uppercase font-bold tracking-wider">Total</span>
                                </div>
                                <div class="text-center">
                                    <span class="text-xl lg:text-2xl font-black text-success">{{ monitoringStats.wins }}</span>
                                    <span class="text-[9px] lg:text-[10px] text-muted-foreground block uppercase font-bold tracking-wider">Win</span>
                                </div>
                                <div class="text-center">
                                    <span class="text-xl lg:text-2xl font-black text-red-500/80">{{ monitoringStats.losses }}</span>
                                    <span class="text-[9px] lg:text-[10px] text-muted-foreground block uppercase font-bold tracking-wider">Loss</span>
                                </div>
                                <div class="text-center">
                                    <span class="text-xl lg:text-2xl font-black text-success">
                                        {{ monitoringStats.wins + monitoringStats.losses > 0 ? ((monitoringStats.wins / (monitoringStats.wins + monitoringStats.losses)) * 100).toFixed(0) : 0 }}%
                                    </span>
                                    <span class="text-[9px] lg:text-[10px] text-muted-foreground block uppercase font-bold tracking-wider">WR</span>
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

                <!-- Main Content Body -->
                <div class="mt-4 md:mt-6 lg:mt-8 flex flex-col lg:flex-row gap-4 lg:gap-6">
                    <!-- Left: Chart & History -->
                    <div class="w-full lg:w-[72%] card-glass rounded-2xl border border-border/50 p-4 md:p-6 lg:p-8 fade-in-delay-1 gradient-border">
                        <div class="w-full">
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
                            <div v-show="activeMonitoringTab === 'chart'" class="space-y-6 animate-fadeIn">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <h3 class="text-base font-bold text-foreground tracking-tight">Evolução do Resultado da IA {{ currentConfig.strategy.toUpperCase() }}</h3>
                                        <p class="text-xs text-muted-foreground mt-1">Desempenho financeiro em tempo real</p>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <div class="w-8 h-0.5 bg-gradient-to-r from-success to-success/40 rounded-full"></div>
                                        <span class="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Resultado ($)</span>
                                    </div>
                                </div>
                                <div class="h-80 w-full bg-secondary/10 rounded-xl border border-border/20 p-4 relative overflow-hidden">
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
                            <div v-if="activeMonitoringTab === 'history'" class="animate-fadeIn">
                                <div class="overflow-x-auto">
                                    <table class="w-full text-left">
                                        <thead class="border-b border-border/30 text-xs text-muted-foreground uppercase tracking-wider">
                                            <tr>
                                                <th class="pb-4">Hora</th>
                                                <th class="pb-4">Mercado</th>
                                                <th class="pb-4">Contrato</th>
                                                <th class="pb-4">Investimento</th>
                                                <th class="pb-4">Resultado</th>
                                                <th class="pb-4 text-right">P/L</th>
                                            </tr>
                                        </thead>
                                        <tbody class="text-sm">
                                            <tr v-for="op in monitoringOperations" :key="op.id" class="border-b border-border/10 last:border-0 hover:bg-white/5 transition-colors">
                                                <td class="py-4">{{ op.time }}</td>
                                                <td class="py-4">{{ op.market }}</td>
                                                <td class="py-4 text-xs">{{ op.contract }}</td>
                                                <td class="py-4">$ {{ op.stake.toFixed(2) }}</td>
                                                <td class="py-4">
                                                    <span :class="op.result === 'WIN' ? 'bg-success/10 text-success border-success/20' : 'bg-red-500/10 text-red-500 border-red-500/20'" class="px-2 py-1 rounded border text-[10px] font-bold">
                                                        {{ op.result }}
                                                    </span>
                                                </td>
                                                <td class="py-4 text-right font-bold" :class="op.result === 'WIN' ? 'text-success' : 'text-red-500'">
                                                    {{ op.result === 'WIN' ? '+' : '' }}{{ op.pnl.toFixed(2) }}
                                                </td>
                                            </tr>
                                            <tr v-if="monitoringOperations.length === 0">
                                                <td colspan="6" class="text-center py-12 text-muted-foreground">Nenhuma operação executada nesta sessão.</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- Logs Tab -->
                            <div v-if="activeMonitoringTab === 'logs'" class="animate-fadeIn">
                                <div class="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
                                    <div v-for="log in monitoringLogs" :key="log.id" class="p-3 bg-secondary/40 rounded-lg border border-border/30 font-mono text-xs flex gap-3">
                                        <span class="text-muted-foreground">[{{ log.time }}]</span>
                                        <span :class="{ 'text-success': log.type === 'success', 'text-red-500': log.type === 'error', 'text-blue-400': log.type === 'info', 'text-yellow-400': log.type === 'warning' }">
                                            {{ log.message }}
                                        </span>
                                    </div>
                                    <div v-if="monitoringLogs.length === 0" class="text-center py-12 text-muted-foreground">
                                        Nenhum log registrado ainda.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Sidebar: Info & Controls -->
                    <div class="w-full lg:w-[28%]">
                        <div class="h-full card-glass rounded-2xl border border-border/50 p-5 flex flex-col gradient-border">
                            <!-- Header Info -->
                            <div class="p-4 rounded-xl bg-secondary/30 border border-border/40">
                                <div class="flex items-center gap-3">
                                    <div class="relative">
                                        <div class="w-11 h-11 rounded-lg bg-success/10 border border-success/30 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-brain w-5 h-5 text-success"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"></path><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"></path><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"></path><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"></path><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"></path><path d="M3.477 10.896a4 4 0 0 1 .585-.396"></path><path d="M19.938 10.5a4 4 0 0 1 .585.396"></path><path d="M6 18a4 4 0 0 1-1.967-.516"></path><path d="M19.967 17.484A4 4 0 0 1 18 18"></path></svg>
                                        </div>
                                        <div class="absolute inset-0 rounded-lg bg-success/20 blur-lg -z-10"></div>
                                    </div>
                                    <div>
                                        <h3 class="text-base font-bold text-foreground tracking-wide">IA {{ currentConfig.strategy.toUpperCase() }}</h3>
                                        <p class="text-xs text-muted-foreground">Especialista em probabilidade</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Mode & Risk -->
                            <div class="mt-3 p-4 rounded-xl bg-secondary/30 border border-border/40">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap w-3.5 h-3.5 text-muted-foreground"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path></svg>
                                        <span class="text-xs text-muted-foreground uppercase tracking-wider">Modo</span>
                                    </div>
                                    <span class="text-sm font-semibold text-foreground uppercase">{{ currentConfig.mode }}</span>
                                </div>
                                <div class="border-t border-border/30 mt-3 pt-3 flex items-center justify-between">
                                    <div class="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-up w-3.5 h-3.5 text-muted-foreground"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                                        <span class="text-xs text-muted-foreground uppercase tracking-wider">Gestão</span>
                                    </div>
                                    <span class="text-sm font-semibold text-foreground uppercase">{{ currentConfig.modoMartingale || 'Moderado' }}</span>
                                </div>
                            </div>

                            <!-- Parameters -->
                            <div class="mt-3 p-4 rounded-xl bg-secondary/30 border border-border/40 space-y-2.5">
                                <div class="flex justify-between items-center">
                                    <span class="text-xs text-muted-foreground uppercase tracking-wider">Entrada</span>
                                    <span class="text-sm font-bold text-foreground">${{ currentConfig.stake.toFixed(2) }}</span>
                                </div>
                                <div class="border-t border-border/30 pt-2.5 flex justify-between items-center">
                                    <span class="text-xs text-muted-foreground uppercase tracking-wider">Alvo</span>
                                    <span class="text-sm font-bold text-success">${{ (currentConfig.profitTarget || 0).toFixed(2) }}</span>
                                </div>
                                <div class="border-t border-border/30 pt-2.5 flex justify-between items-center">
                                    <span class="text-xs text-muted-foreground uppercase tracking-wider">Limite</span>
                                    <span class="text-sm font-bold text-foreground">${{ (currentConfig.lossLimit || 0).toFixed(2) }}</span>
                                </div>
                            </div>

                            <!-- Protections -->
                            <div class="mt-3 p-4 rounded-xl bg-success/5 border border-success/20 hover:bg-success/10 transition-colors">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <div class="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center border border-success/20">
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
                            <div class="mt-auto px-1">
                                <button @click="stopIA" :disabled="isStopping" class="group relative flex items-center justify-center gap-3 w-full h-14 bg-success hover:bg-success/90 text-white font-black text-sm uppercase tracking-widest rounded-xl transition-all duration-300 shadow-[0_8px_20px_rgba(34,197,94,0.3)] hover:shadow-[0_12px_25px_rgba(34,197,94,0.4)] active:scale-[0.98] disabled:opacity-50">
                                    <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div class="w-6 h-6 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pause w-5 h-5"><rect x="14" y="4" width="4" height="16" rx="1"></rect><rect x="6" y="4" width="4" height="16" rx="1"></rect></svg>
                                    </div>
                                    {{ isStopping ? 'Parando...' : 'Pausar IA' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
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
import SettingsSidebar from '../../components/SettingsSidebar.vue';
import LineChart from '../../components/LineChart.vue';
import { StrategyAnalysis } from '../../utils/StrategyAnalysis';

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
                    this.currentConfig = JSON.parse(savedConfig);
                } catch (e) {
                    console.error('Error loading config:', e);
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
                    this.addLog('🔌 Conectado ao mercado', 'success');
                    const token = this.getDerivToken();
                    
                    if (token) {
                        this.ws.send(JSON.stringify({ authorize: token }));
                    } else {
                        this.addLog('⚠️ Token não encontrado. Modo observação.', 'warning');
                        this.subscribeTicks();
                    }
                };

                this.ws.onmessage = (event) => {
                    try {
                        const msg = JSON.parse(event.data);
                        
                        if (msg.msg_type === 'authorize') {
                            if (msg.error) {
                                this.addLog(`❌ Erro de autorização: ${msg.error.message}`, 'error');
                            } else {
                                this.isAuthorized = true;
                                this.monitoringStats.balance = msg.authorize.balance;
                                this.addLog(`✅ Autorizado! Saldo: $${this.monitoringStats.balance}`, 'success');
                                this.subscribeTicks();
                            }
                        }

                        if (msg.msg_type === 'tick') {
                            this.handleTickMessage(msg);
                        }

                        if (msg.msg_type === 'buy') {
                            if (msg.error) {
                                this.addLog(`❌ Erro na compra: ${msg.error.message}`, 'error');
                            } else {
                                const payout = msg.buy.payout;
                                this.addLog(`🚀 Compra realizada! ID: ${msg.buy.contract_id} | Payout: $${payout}`, 'success');
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
                    this.addLog('📡 Conexão encerrada. Reconectando...', 'info');
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
                this.addLog(`❌ Erro: ${msg.error.message}`, 'error');
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
                this.addLog('🎯 SINAL GERADO! Todos os filtros confirmados.', 'success');
                this.executeAITrade(strategyConfig);
            }
        },
        executeAITrade(strategyConfig) {
            if (!this.isAuthorized) {
                this.addLog('⚠️ Entrada negada: Não autorizado', 'warning');
                return;
            }
            if (this.activeContracts.size > 0) {
                this.addLog('⏳ Sinal ignorado: Operação em andamento', 'info');
                return;
            }
            const form = strategyConfig.config.form;
            const stake = this.currentConfig.stake;
            const buyParams = {
                buy: 1,
                price: stake,
                parameters: {
                    amount: stake,
                    basis: 'stake',
                    contract_type: form.tradeType,
                    currency: 'USD',
                    duration: form.duration,
                    duration_unit: form.durationUnit,
                    symbol: form.market
                }
            };
            if (['DIGITOVER', 'DIGITUNDER', 'DIGITMATCH', 'DIGITDIFF'].includes(form.tradeType)) {
                buyParams.parameters.barrier = form.prediction.toString();
            }
            this.addLog(`💸 Executando: ${form.tradeType} em ${form.market} | Stake: $${stake}`, 'info');
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify(buyParams));
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
                    stake: contract.buy_price,
                    pnl: contract.profit || 0,
                    result: 'OPEN'
                };
                this.monitoringOperations.unshift(trade);
                this.activeContracts.set(id, trade);
            } else {
                trade.pnl = contract.profit || 0;
            }
            if (contract.is_sold) {
                trade.result = contract.status.toUpperCase() === 'WON' ? 'WIN' : 'LOSS';
                trade.pnl = parseFloat(contract.profit || 0);
                if (trade.result === 'WIN') {
                    this.monitoringStats.wins++;
                    this.addLog(`💰 WIN! +$${trade.pnl.toFixed(2)}`, 'success');
                } else {
                    this.monitoringStats.losses++;
                    this.addLog(`🔴 LOSS: -$${Math.abs(trade.pnl).toFixed(2)}`, 'error');
                }
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
            this.addLog('⏹️ IA parada pelo usuário', 'info');
            localStorage.removeItem('ai_active_config');
            setTimeout(() => { this.$router.push('/StatsIAs'); }, 1000);
        },
        addLog(message, type) {
            this.monitoringLogs.unshift({
                id: Date.now() + Math.random(),
                time: new Date().toLocaleTimeString(),
                message,
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
	transition: margin-left 0.3s ease;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
}

.dashboard-content-wrapper.sidebar-collapsed {
	margin-left: 0;
}

@media (max-width: 1024px) {
	.dashboard-content-wrapper { margin-left: 0; }
	.dashboard-content-wrapper.sidebar-collapsed { margin-left: 0; }
}

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
</style>
