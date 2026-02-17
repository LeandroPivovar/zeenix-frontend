<template>
    <div class="monitoring-dashboard-wrapper h-full animate-fadeIn w-full" :class="{ 'px-4': isMobile }">
        <!-- Header Stats Card -->
        <div class="w-full bg-[#050505] rounded-2xl border border-[#222] p-6 relative overflow-visible shadow-2xl mb-6">
            <!-- Green Glow Effect on Left -->
            <div class="absolute left-0 top-0 bottom-0 w-32 bg-green-500/5 blur-[50px] pointer-events-none"></div>

            <div class="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10 text-center lg:text-left">
                
                <!-- Identity -->
                <div class="flex items-center gap-5 w-full lg:w-auto justify-center lg:justify-start">
                     <div class="w-16 h-16 rounded-full border border-green-500/20 bg-green-500/5 flex items-center justify-center relative shrink-0">
                        <i :class="`fa-solid fa-${sessionState.icon || 'brain'} text-2xl text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]`"></i>
                        <!-- Pulse Dot -->
                        <div class="absolute top-0 right-0 w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e] border-2 border-[#050505]"></div>
                     </div>
                     <div class="flex flex-col items-start">
                         <h2 class="text-3xl font-black text-green-500 tracking-tighter uppercase drop-shadow-[0_0_15px_rgba(34,197,94,0.3)] leading-none mb-1">
                             IA {{ sessionState.strategy?.toUpperCase() || 'ATIVA' }}
                         </h2>
                         <span class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                             {{ stats.status || 'Ativo' }}
                         </span>
                     </div>
                </div>

                <!-- Vertical Separator -->
                <div class="hidden lg:block w-px h-12 bg-[#222]"></div>

                <!-- Capital -->
                <div class="flex flex-col items-center">
                    <p class="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-1">Capital</p>
                    <p class="text-3xl font-bold text-white tracking-tight leading-none">
                        $ {{ Math.floor(Number(stats.balance) || 0).toLocaleString('en-US') }}<span class="text-lg text-gray-500 font-medium">.{{ ((Number(stats.balance) || 0) % 1).toFixed(2).split('.')[1] || '00' }}</span>
                    </p>
                </div>

                <!-- Result -->
                <div class="flex flex-col items-center">
                   <p class="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-1">Resultado</p>
                   <div class="flex items-center gap-3">
                       <p class="text-4xl font-bold tracking-tight leading-none" :class="(Number(stats.profit) || 0) >= 0 ? 'text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.2)]'">
                           {{ (Number(stats.profit) || 0) >= 0 ? '+' : '' }}${{ Math.abs(Number(stats.profit) || 0).toFixed(2).replace('.', ',') }}
                       </p>
                       <span class="px-2 py-0.5 rounded text-xs font-bold tracking-wide"
                             :class="(Number(stats.profit) || 0) >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'">
                           {{ (Number(stats.profit) || 0) >= 0 ? '+' : '' }}0.00%
                       </span>
                   </div>
                   <!-- Progress Line -->
                   <div class="h-1 w-24 bg-[#222] mt-2 rounded-full overflow-hidden">
                       <div class="h-full transition-all duration-500"
                            :class="(Number(stats.profit) || 0) >= 0 ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'"
                            :style="{ width: '100%' }"></div>
                   </div>
                </div>

                <!-- Vertical Separator -->
                <div class="hidden lg:block w-px h-12 bg-[#222]"></div>

                <!-- Operations -->
                <div class="flex flex-col items-center">
                     <p class="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-2">Operações</p>
                     <div class="flex items-center gap-6">
                         <div class="text-center group cursor-help relative">
                             <span class="block text-xl font-bold text-white leading-none">{{ (stats.wins || 0) + (stats.losses || 0) }}</span>
                             <span class="text-[9px] text-gray-500 font-bold uppercase mt-1">Total</span>
                         </div>
                         <div class="w-px h-6 bg-[#222]"></div>
                         <div class="text-center">
                             <span class="block text-xl font-bold text-green-500 leading-none">{{ stats.wins || 0 }}</span>
                             <span class="text-[9px] text-gray-500 font-bold uppercase mt-1">Win</span>
                         </div>
                         <div class="w-px h-6 bg-[#222]"></div>
                         <div class="text-center">
                             <span class="block text-xl font-bold text-red-500 leading-none">{{ stats.losses || 0 }}</span>
                             <span class="text-[9px] text-gray-500 font-bold uppercase mt-1">Loss</span>
                         </div>
                         <div class="w-px h-6 bg-[#222]"></div>
                         <div class="text-center">
                             <span class="block text-xl font-bold text-green-500 leading-none">
                                 {{ ((stats.wins || 0) + (stats.losses || 0)) > 0 ? (((Number(stats.wins) || 0) / ((Number(stats.wins) || 0) + (Number(stats.losses) || 0))) * 100).toFixed(0) : 0 }}%
                             </span>
                             <span class="text-[9px] text-gray-500 font-bold uppercase mt-1">Winrate</span>
                         </div>
                     </div>
                </div>

                <!-- Vertical Separator -->
                <div class="hidden lg:block w-px h-12 bg-[#222]"></div>

                <!-- Execution Time -->
                <div class="flex flex-col items-center">
                    <p class="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-1">Tempo de Execução</p>
                    <div class="flex items-center gap-2">
                         <i class="far fa-clock text-white/50 text-sm"></i>
                         <p class="text-2xl font-bold text-white tracking-tight tabular-nums leading-none">
                             {{ stats.uptime || '00:00:00' }}
                         </p>
                    </div>
                </div>

            </div>
            
            <!-- Mobile Pause Button (Inside Card) -->
            <div v-if="isMobile" class="mt-6 border-t border-[#222] pt-4">
                 <button @click="$emit('stop')" class="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-widest text-[11px] rounded-xl transition-all duration-300 active:scale-[0.98] shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                    Parar Robô
                </button>
            </div>

        </div>

        <!-- Main Content Split Layout -->
        <div class="flex flex-col lg:flex-row gap-6 w-full flex-1 min-h-0 pb-10">
            <!-- Left Column: Tabs Content -->
            <div class="w-full lg:w-[72%] bg-[#121212]/40 backdrop-blur-md rounded-2xl border border-[rgba(255,255,255,0.05)] p-4 md:p-6 lg:p-8 gradient-border flex flex-col shadow-xl">
                <div class="flex items-center justify-start text-gray-500 border-b border-[rgba(255,255,255,0.05)] mb-6 gap-6 h-auto p-0 overflow-x-auto no-scrollbar">
                    <button @click="activeTab = 'history'" :class="{ 'border-[#22C55E] text-[#22C55E]': activeTab === 'history' }" class="inline-flex items-center justify-center py-2 text-sm font-bold border-b-2 border-transparent px-0 pb-3 transition-colors hover:text-white whitespace-nowrap">
                        <i class="fas fa-history mr-2"></i> Histórico
                    </button>
                    <button @click="activeTab = 'logs'" :class="{ 'border-[#22C55E] text-[#22C55E]': activeTab === 'logs' }" class="inline-flex items-center justify-center py-2 text-sm font-bold border-b-2 border-transparent px-0 pb-3 transition-colors hover:text-white whitespace-nowrap">
                        <i class="fas fa-list-ul mr-2"></i> Registros
                    </button>
                    <button v-if="isAdmin" @click="activeTab = 'validator'" :class="{ 'border-[#22C55E] text-[#22C55E]': activeTab === 'validator' }" class="inline-flex items-center justify-center py-2 text-sm font-bold border-b-2 border-transparent px-0 pb-3 transition-colors hover:text-white whitespace-nowrap">
                        <i class="fas fa-clipboard-check mr-2"></i> Validador
                    </button>
                </div>

                <!-- Content Area -->
                <div class="flex-1 min-h-[400px]">

                    <!-- History View -->
                    <div v-show="activeTab === 'history'" class="animate-fadeIn h-full">
                        <div class="rounded-xl border border-[rgba(255,255,255,0.05)] overflow-hidden bg-[#0B0B0B]/50">
                            <div class="overflow-x-auto overflow-y-auto max-h-[500px] custom-scrollbar">
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
                                        <tr v-for="(op, index) in operations" :key="index" 
                                            class="border-b border-border/20 transition-colors hover:bg-secondary/30"
                                            :class="index % 2 === 0 ? 'bg-transparent' : 'bg-secondary/10'">
                                            <td class="px-4 py-4 font-mono font-medium text-foreground">{{ op.time }}</td>
                                            <td class="px-4 py-4 text-muted-foreground font-mono">{{ op.market }}</td>
                                            <td class="px-4 py-4">
                                                <span class="text-foreground font-bold">{{ op.contract }}</span>
                                            </td>
                                            <td class="px-4 py-4 text-foreground font-medium">{{ op.entryPrice || '-' }}</td>
                                            <td class="px-4 py-4 text-foreground font-medium">{{ op.exitPrice || '-' }}</td>
                                            <td class="px-4 py-4 text-foreground font-medium font-mono text-center">{{ op.lastDigit || '-' }}</td>
                                            <td class="px-4 py-4 text-foreground font-medium">$ {{ (Number(op.stake) || 0).toFixed(2) }}</td>
                                            <td class="px-4 py-4 text-right">
                                                <span v-if="op.result === 'OPEN' || op.result === 'PENDING'" class="text-yellow-500 font-bold uppercase tracking-tight">PENDENTE</span>
                                                <span v-else class="font-bold whitespace-nowrap" :class="op.result === 'WON' || op.result === 'WIN' ? 'text-success' : 'text-red-500'">
                                                    {{ (op.result === 'WON' || op.result === 'WIN' ? '+' : '') }}${{ (Number(op.pnl) || 0).toFixed(2) }}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr v-if="operations.length === 0">
                                            <td colspan="8" class="text-center py-20 text-muted-foreground/30 uppercase text-[10px] font-black tracking-[0.2em] w-full">
                                                Aguardando primeira operação...
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- Logs View -->
                    <div v-show="activeTab === 'logs'" class="animate-fadeIn h-full">
                        <!-- Log Controls -->
                        <div class="flex justify-end gap-3 mb-4">
                            <button @click="exportLogs" class="text-[10px] font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2 bg-blue-400/5 px-3 py-1.5 rounded-lg border border-blue-400/20">
                                <i class="fas fa-file-export"></i> Exportar Logs
                            </button>
                            <button @click="clearLogs" class="text-[10px] font-bold uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors flex items-center gap-2 bg-red-400/5 px-3 py-1.5 rounded-lg border border-red-400/20">
                                <i class="fas fa-trash-alt"></i> Limpar Logs
                            </button>
                        </div>

                        <div class="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                            <div v-for="log in logs" :key="log.id" class="p-4 bg-[#0D0D0D]/60 rounded-xl border border-[rgba(255,255,255,0.03)] hover:border-[#22C55E]/20 transition-all duration-300">
                                <div class="flex items-start gap-4">
                                    <span class="text-[10px] font-mono text-gray-600 mt-0.5">[{{ log.time }}]</span>
                                    <div class="flex-1">
                                        <div class="flex items-center gap-2 mb-1">
                                            <div class="w-1.5 h-1.5 rounded-full" 
                                                 :class="{ 
                                                    'bg-[#22C55E] shadow-[0_0_10px_rgba(34,197,94,0.5)]': log.type === 'success', 
                                                    'bg-[#EF4444] shadow-[0_0_10px_rgba(239,68,68,0.5)]': log.type === 'error', 
                                                    'bg-blue-400 shadow-[0_0_10px_#60A5FA]': log.type === 'info', 
                                                    'bg-yellow-400 shadow-[0_0_10px_#FACC15]': log.type === 'warning' 
                                                 }"></div>
                                            <span class="text-xs font-bold" :class="{ 'text-[#22C55E]': log.type === 'success', 'text-[#EF4444]': log.type === 'error', 'text-blue-400': log.type === 'info', 'text-yellow-400': log.type === 'warning' }" v-html="log.message">
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="logs.length === 0" class="py-20 text-center text-gray-600 uppercase text-[10px] font-black tracking-widest">
                                Nenhum log registrado na sessão.
                            </div>
                        </div>
                    </div>

                    <!-- Validator View -->
                    <div v-show="activeTab === 'validator'" class="animate-fadeIn h-full overflow-y-auto custom-scrollbar pr-2">
                        <div class="space-y-4">
                            <!-- Static Item 1 -->
                            <label class="flex items-center gap-3 p-4 bg-[#1E1E1E] rounded-lg border border-[#333] cursor-pointer hover:border-[#22C55E] transition-colors">
                                <input type="checkbox" v-model="localValidator.aiStarted" class="form-checkbox h-5 w-5 text-[#22C55E] rounded border-gray-600 bg-[#2b2b2b] focus:ring-[#22C55E] focus:ring-offset-0 focus:ring-2" />
                                <span class="text-white font-medium select-none">A IA iniciou</span>
                            </label>

                            <!-- Attack Filter -->
                            <label class="flex items-center gap-3 p-4 bg-[#1E1E1E] rounded-lg border border-[#333] cursor-pointer hover:border-[#22C55E] transition-colors">
                                <input type="checkbox" v-model="localValidator.attackFilterCorrect" class="form-checkbox h-5 w-5 text-[#22C55E] rounded border-gray-600 bg-[#2b2b2b] focus:ring-[#22C55E] focus:ring-offset-0 focus:ring-2" />
                                <span class="text-white font-medium select-none">
                                    IA esta aplicando o filtro de ataque corretamente 
                                    <span class="text-[#22C55E] text-sm ml-1" v-if="attackFilters && attackFilters.length">({{ activeAttackFilterNames }})</span>
                                    <span class="text-gray-500 text-xs ml-1" v-else>(Nenhum filtro)</span>
                                </span>
                            </label>

                            <!-- Base Stake -->
                            <label class="flex items-center gap-3 p-4 bg-[#1E1E1E] rounded-lg border border-[#333] cursor-pointer hover:border-[#22C55E] transition-colors">
                                <input type="checkbox" v-model="localValidator.baseStakeCorrect" class="form-checkbox h-5 w-5 text-[#22C55E] rounded border-gray-600 bg-[#2b2b2b] focus:ring-[#22C55E] focus:ring-offset-0 focus:ring-2" />
                                <span class="text-white font-medium select-none">A IA esta usando corretamente o stake base</span>
                            </label>

                            <!-- Soros Applied -->
                            <label class="flex items-center gap-3 p-4 bg-[#1E1E1E] rounded-lg border border-[#333] cursor-pointer hover:border-[#22C55E] transition-colors">
                                <input type="checkbox" v-model="localValidator.sorosApplied" class="form-checkbox h-5 w-5 text-[#22C55E] rounded border-gray-600 bg-[#2b2b2b] focus:ring-[#22C55E] focus:ring-offset-0 focus:ring-2" />
                                <span class="text-white font-medium select-none">A IA aplicou o soros</span>
                            </label>

                            <!-- Soros Reset -->
                            <label class="flex items-center gap-3 p-4 bg-[#1E1E1E] rounded-lg border border-[#333] cursor-pointer hover:border-[#22C55E] transition-colors">
                                <input type="checkbox" v-model="localValidator.sorosReset" class="form-checkbox h-5 w-5 text-[#22C55E] rounded border-gray-600 bg-[#2b2b2b] focus:ring-[#22C55E] focus:ring-offset-0 focus:ring-2" />
                                <span class="text-white font-medium select-none">A IA resetou para o stake base após ganhar no soros</span>
                            </label>

                            <!-- Recovery Mode Entered -->
                            <label class="flex items-center gap-3 p-4 bg-[#1E1E1E] rounded-lg border border-[#333] cursor-pointer hover:border-[#22C55E] transition-colors">
                                <input type="checkbox" v-model="localValidator.recoveryModeEntered" class="form-checkbox h-5 w-5 text-[#22C55E] rounded border-gray-600 bg-[#2b2b2b] focus:ring-[#22C55E] focus:ring-offset-0 focus:ring-2" />
                                <span class="text-white font-medium select-none">A IA entrou no modo de recuperação</span>
                            </label>

                            <!-- Recovery Contract Switched -->
                            <label class="flex items-center gap-3 p-4 bg-[#1E1E1E] rounded-lg border border-[#333] cursor-pointer hover:border-[#22C55E] transition-colors">
                                <input type="checkbox" v-model="localValidator.recoveryContractSwitched" class="form-checkbox h-5 w-5 text-[#22C55E] rounded border-gray-600 bg-[#2b2b2b] focus:ring-[#22C55E] focus:ring-offset-0 focus:ring-2" />
                                <span class="text-white font-medium select-none">A IA trocou o contrato no modo de recuperação</span>
                            </label>

                            <!-- Recovery Filters (Dynamic) -->
                            <div v-if="recoveryConfig.attackFilters && recoveryConfig.attackFilters.length > 0">
                                <label v-for="filter in recoveryConfig.attackFilters" :key="filter.id" class="flex items-center gap-3 p-4 bg-[#1E1E1E] rounded-lg border border-[#333] cursor-pointer hover:border-[#22C55E] transition-colors mb-4">
                                    <input type="checkbox" v-model="localValidator.recoveryFilters[filter.id]" class="form-checkbox h-5 w-5 text-[#22C55E] rounded border-gray-600 bg-[#2b2b2b] focus:ring-[#22C55E] focus:ring-offset-0 focus:ring-2" />
                                    <span class="text-white font-medium select-none">
                                        A IA usou corretamente o filtro 
                                        <span class="text-[#22C55E] text-sm ml-1">({{ filter.name }})</span>
                                    </span>
                                </label>
                            </div>
                            <div v-else class="p-4 bg-[#1E1E1E] rounded-lg border border-[#333] opacity-60">
                                <div class="flex items-center gap-2">
                                    <i class="fa-solid fa-info-circle text-gray-500"></i>
                                    <span class="text-gray-500 text-sm">Sem filtros de recuperação configurados</span>
                                </div>
                            </div>

                             <!-- Martingale 100% -->
                             <label class="flex items-center gap-3 p-4 bg-[#1E1E1E] rounded-lg border border-[#333] cursor-pointer hover:border-[#22C55E] transition-colors">
                                <input type="checkbox" v-model="localValidator.martingale100" class="form-checkbox h-5 w-5 text-[#22C55E] rounded border-gray-600 bg-[#2b2b2b] focus:ring-[#22C55E] focus:ring-offset-0 focus:ring-2" />
                                <span class="text-white font-medium select-none">Quando o Martingale passa de 6 o Robô para e espera o filtro de saída</span>
                            </label>
                            
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Column: Sidebar (Desktop) -->
            <div v-if="!isMobile" class="w-full lg:w-[28%] flex flex-col gap-6">
                <div class="bg-[#121212]/40 backdrop-blur-md rounded-2xl border border-[rgba(255,255,255,0.05)] p-5 flex flex-col gradient-border h-full shadow-xl">
                    <!-- Header Info -->
                    <div class="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                        <div class="flex items-center gap-3">
                            <div class="relative">
                                <div class="w-11 h-11 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-center">
                                    <i class="fas fa-brain text-[#22C55E] text-lg"></i>
                                </div>
                                <div class="absolute inset-0 rounded-lg bg-[#22C55E]/20 blur-lg -z-10"></div>
                            </div>
                            <div>
                                <h3 class="text-sm font-bold text-white uppercase tracking-wider">IA {{ sessionState.strategy || 'Ativa' }}</h3>
                                <p class="text-[10px] text-gray-500">Robot de análise probabilística</p>
                            </div>
                        </div>
                    </div>

                    <!-- Config Card -->
                    <div class="mt-4 space-y-3">
                        <div class="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                            <div class="flex items-center justify-between mb-3 pb-3 border-b border-white/[0.05]">
                                <div class="flex items-center gap-2">
                                    <i class="fas fa-bolt text-gray-500 text-xs"></i>
                                    <span class="text-[10px] text-gray-500 uppercase tracking-widest">Modo</span>
                                </div>
                                <span class="text-xs font-bold text-white uppercase">{{ sessionState.mode }}</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <i class="fas fa-shield-alt text-gray-500 text-xs"></i>
                                    <span class="text-[10px] text-gray-500 uppercase tracking-widest">Gestão</span>
                                </div>
                                <span class="text-xs font-bold text-white uppercase">{{ sessionState.modoMartingale || 'Moderado' }}</span>
                            </div>
                        </div>

                        <div class="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] space-y-3">
                            <div class="flex justify-between items-center text-[11px]">
                                <span class="text-gray-500 uppercase tracking-widest">Stake Inicial</span>
                                <span class="font-bold text-gray-200">${{ (Number(sessionState.stake) || 0).toFixed(2) }}</span>
                            </div>
                            <div class="flex justify-between items-center text-[11px]">
                                <span class="text-gray-500 uppercase tracking-widest">Meta de Lucro</span>
                                <span class="font-bold text-[#22C55E]">${{ (Number(sessionState.profitTarget) || 0).toFixed(2) }}</span>
                            </div>
                            <div class="flex justify-between items-center text-[11px]">
                                <span class="text-gray-500 uppercase tracking-widest">Stop Loss</span>
                                <span class="font-bold text-[#EF4444]">${{ (Number(sessionState.lossLimit) || 0).toFixed(2) }}</span>
                            </div>
                        </div>

                        <div class="p-4 rounded-xl bg-[#22C55E]/5 border border-[#22C55E]/20">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-lg bg-[#22C55E]/10 flex items-center justify-center border border-[#22C55E]/20 text-[#22C55E] text-xs">
                                        <i class="fas fa-user-shield"></i>
                                    </div>
                                    <span class="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Stop Blindado</span>
                                </div>
                                <span class="text-[9px] font-black text-[#22C55E] uppercase tracking-wider">{{ sessionState.stoplossBlindado ? 'ATIVO' : 'INATIVO' }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="flex-1 min-h-[40px]"></div>

                    <!-- Desktop Stop Button -->
                    <div class="mt-auto pt-6 border-t border-white/[0.05]">
                        <button @click="$emit('stop')" class="group flex items-center justify-center w-full h-[52px] bg-[#22C55E] hover:bg-[#1EAE54] text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-xl transition-all duration-300 shadow-xl shadow-[#22C55E]/20 active:scale-[0.98]">
                            <div class="flex items-center gap-3">
                                <i class="fas fa-stop text-xs"></i>
                                <span class="mt-0.5">Parar Operação</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MonitoringDashboard',
    props: {
        stats: {
            type: Object,
            required: true
        },
        logs: {
            type: Array,
            default: () => []
        },
        operations: {
            type: Array,
            default: () => []
        },
        sessionState: {
            type: Object,
            required: true
        },
        validator: {
            type: Object,
            required: true
        },
        attackFilters: {
            type: Array,
            default: () => []
        },
        recoveryConfig: {
            type: Object,
            default: () => ({})
        }
    },
    emits: ['stop', 'clear-logs', 'update:validator'],
    data() {
        return {
            activeTab: 'history',
            isMobile: false,
            localValidator: JSON.parse(JSON.stringify(this.validator))
        }
    },
    watch: {
        validator: {
            handler(newVal) {
                const currentLocal = JSON.stringify(this.localValidator);
                const incoming = JSON.stringify(newVal);
                if (currentLocal !== incoming) {
                    this.localValidator = JSON.parse(incoming);
                }
            },
            deep: true
        },
        localValidator: {
            handler(newVal) {
                const currentProp = JSON.stringify(this.validator);
                const local = JSON.stringify(newVal);
                if (currentProp !== local) {
                    console.log('[MonitoringDashboard] Emitting validator update:', local);
                    this.$emit('update:validator', JSON.parse(local));
                }
            },
            deep: true
        }
    },
    mounted() {
        this.checkMobile();
        window.addEventListener('resize', this.checkMobile);
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.checkMobile);
    },
    methods: {
        checkMobile() {
            this.isMobile = window.innerWidth < 1024;
        },
        exportLogs() {
            if (this.logs.length === 0) return;
            // Extract text from messages (remove HTML tags)
            const logText = this.logs.map(log => {
                const temp = document.createElement('div');
                temp.innerHTML = log.message;
                return `[${log.time}] [${log.type.toUpperCase()}] ${temp.textContent || temp.innerText}`;
            }).join('\n');
            
            const iaName = (this.sessionState.strategy || 'Estrategia').toLowerCase().replace(/\s+/g, '-');
            const mode = (this.sessionState.mode || 'modo').toLowerCase();
            const risk = (this.sessionState.modoMartingale || 'risco').toLowerCase();
            const date = new Date().toISOString().split('T')[0];
            const fileName = `zenix-${iaName}-${mode}-${risk}-${date}.txt`;

            const blob = new Blob([logText], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        },
        clearLogs() {
            if (confirm('Tem certeza que deseja limpar todos os registros?')) {
                this.$emit('clear-logs');
            }
        }
    },
    computed: {
        activeAttackFilterNames() {
            if (!this.attackFilters || !this.attackFilters.length) return '';
            return this.attackFilters.map(f => f.name).join(', ');
        },
        isAdmin() {
            try {
                const token = localStorage.getItem('token');
                if (!token) return false;
                
                // Decodificar JWT token
                const payload = JSON.parse(atob(token.split('.')[1]));
                
                // Verificar se o usuário tem role de admin
                const role = payload.role || payload.roles || payload.userRole || payload.user_role;
                const isAdminFlag = payload.isAdmin || payload.is_admin;
                
                // Verificar se role contém 'admin' ou se isAdmin é true
                if (isAdminFlag === true || isAdminFlag === 'true') {
                    return true;
                }
                
                if (role) {
                    const roleStr = Array.isArray(role) ? role.join(',').toLowerCase() : role.toString().toLowerCase();
                    const result = roleStr.includes('admin') || roleStr === 'admin';
                    return result;
                }
                
                return false;
            } catch (error) {
                console.error('[MonitoringDashboard] Erro ao verificar se usuário é admin:', error);
                return false;
            }
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

.animate-fadeIn {
    animation: fadeIn 0.4s ease-out forwards;
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

.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(34, 197, 94, 0.1); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(34, 197, 94, 0.2); }
</style>
