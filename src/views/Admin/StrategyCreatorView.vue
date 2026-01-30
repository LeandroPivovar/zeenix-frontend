<template>
    <div class="dashboard-layout">
        <div v-if="isSidebarOpen && isMobile" class="sidebar-overlay" @click="isSidebarOpen = false"></div>
        
        <AppSidebar 
            :is-open="isSidebarOpen" 
            :is-collapsed="isSidebarCollapsed" 
            :is-mobile="isMobile" 
            @close-sidebar="isSidebarOpen = false" 
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

            <main class="layout-content">
                <div class="content-header mb-6 flex justify-between items-center px-4">
                    <div>
                        <h1 class="text-2xl font-bold text-white">{{ isMonitoring ? 'Acompanhamento de Estratégia [BETA]' : 'Criador de Estratégias [BETA]' }}</h1>
                        <p class="text-sm text-[#7D7D7D]">{{ isMonitoring ? 'Acompanhe a atividade do robô em tempo real.' : 'Configure sua estratégia automatizada para execução no mercado.' }}</p>
                    </div>
                    <button v-if="isMonitoring" @click="stopMonitoring" class="stop-btn">
                        <i class="fas fa-stop mr-2"></i> Parar Robô
                    </button>
                    <div v-else class="flex gap-3">
                        <div class="balance-card">
                            <span class="text-[10px] uppercase text-[#7D7D7D] font-bold">Saldo Disponível</span>
                            <span class="text-lg font-bold text-white block">$ {{ balance.toLocaleString() }}</span>
                        </div>
                    </div>
                </div>

                <!-- MONITORING DASHBOARD -->
                <div v-if="isMonitoring" class="monitoring-dashboard animate-fadeIn px-4">
                    <!-- Summary Cards -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div class="stats-card">
                            <div class="stats-icon-wrapper blue">
                                <i class="fas fa-wallet"></i>
                            </div>
                            <div class="stats-info">
                                <span class="stats-label">Saldo Atual</span>
                                <span class="stats-value">$ {{ monitoringStats.balance.toFixed(2) }}</span>
                            </div>
                        </div>
                        <div class="stats-card">
                            <div class="stats-icon-wrapper" :class="monitoringStats.profit >= 0 ? 'green' : 'red'">
                                <i class="fas fa-chart-line"></i>
                            </div>
                            <div class="stats-info">
                                <span class="stats-label">Sessão P/L</span>
                                <span class="stats-value" :class="monitoringStats.profit >= 0 ? 'text-zenix-green' : 'text-red-500'">
                                    {{ monitoringStats.profit >= 0 ? '+' : '' }}$ {{ monitoringStats.profit.toFixed(2) }}
                                </span>
                            </div>
                        </div>
                        <div class="stats-card">
                            <div class="stats-icon-wrapper yellow">
                                <i class="fas fa-percentage"></i>
                            </div>
                            <div class="stats-info">
                                <span class="stats-label">Assertividade</span>
                                <span class="stats-value">{{ monitoringStats.wins + monitoringStats.losses > 0 ? ((monitoringStats.wins / (monitoringStats.wins + monitoringStats.losses)) * 100).toFixed(0) : 0 }}%</span>
                                <span class="text-[10px] text-[#7A7A7A] ml-1">{{ monitoringStats.wins }}W / {{ monitoringStats.losses }}L</span>
                            </div>
                        </div>
                        <div class="stats-card">
                            <div class="stats-icon-wrapper green pulse">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div class="stats-info">
                                <span class="stats-label">Status da IA</span>
                                <span class="stats-value text-sm">{{ monitoringStats.status }}</span>
                                <p class="text-[10px] text-zenix-green">{{ monitoringStats.statusDesc }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Tabs -->
                    <div class="monitoring-tabs-container mb-4">
                        <div class="monitoring-tabs flex gap-4 border-b border-[#333]">
                            <button @click="activeMonitoringTab = 'chart'" :class="{ 'active text-zenix-green border-b-2 border-zenix-green': activeMonitoringTab === 'chart' }" class="pb-2 px-4 transition-all hover:text-white text-[#7A7A7A]">
                                <i class="fas fa-chart-area mr-2"></i> Gráfico
                            </button>
                            <button @click="activeMonitoringTab = 'logs'" :class="{ 'active text-zenix-green border-b-2 border-zenix-green': activeMonitoringTab === 'logs' }" class="pb-2 px-4 transition-all hover:text-white text-[#7A7A7A]">
                                <i class="fas fa-list-ul mr-2"></i> Registros
                            </button>
                            <button @click="activeMonitoringTab = 'history'" :class="{ 'active text-zenix-green border-b-2 border-zenix-green': activeMonitoringTab === 'history' }" class="pb-2 px-4 transition-all hover:text-white text-[#7A7A7A]">
                                <i class="fas fa-history mr-2"></i> Histórico
                            </button>
                        </div>
                    </div>

                    <!-- Tab Content -->
                    <div class="tab-content-container bg-[#141414] border border-[#333] rounded-xl p-6 min-h-[400px]">
                        <!-- Chart Placeholder -->
                        <div v-show="activeMonitoringTab === 'chart'" class="chart-tab-content flex items-center justify-center h-full min-h-[300px]">
                            <div class="text-center">
                                <i class="fas fa-chart-line text-6xl text-zenix-green/20 mb-4 block"></i>
                                <p class="text-[#7A7A7A]">Aguardando conexão com o mercado...</p>
                            </div>
                        </div>

                        <!-- Logs Tab -->
                        <div v-if="activeMonitoringTab === 'logs'" class="logs-tab-content h-full">
                            <div class="logs-list-wrapper space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
                                <div v-for="log in monitoringLogs" :key="log.id" class="p-3 bg-[#0B0B0B] rounded-lg border border-[#222] font-mono text-xs flex gap-3">
                                    <span class="text-gray-500">[{{ log.time }}]</span>
                                    <span :class="{ 'text-zenix-green': log.type === 'success', 'text-red-500': log.type === 'error', 'text-blue-400': log.type === 'info' }">
                                        {{ log.message }}
                                    </span>
                                </div>
                                <div v-if="monitoringLogs.length === 0" class="text-center py-12 text-[#7A7A7A]">
                                    Nenhum log registrado ainda.
                                </div>
                            </div>
                        </div>

                        <!-- History Tab -->
                        <div v-if="activeMonitoringTab === 'history'" class="history-tab-content">
                            <div class="overflow-x-auto">
                                <table class="w-full text-left">
                                    <thead class="border-b border-[#333] text-xs text-[#7A7A7A] uppercase tracking-wider">
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
                                        <tr v-for="op in monitoringOperations" :key="op.id" class="border-b border-[#222] last:border-0">
                                            <td class="py-4">{{ op.time }}</td>
                                            <td class="py-4">{{ op.market }}</td>
                                            <td class="py-4 text-xs">{{ op.contract }}</td>
                                            <td class="py-4">$ {{ op.stake.toFixed(2) }}</td>
                                            <td class="py-4">
                                                <span :class="op.result === 'WIN' ? 'bg-zenix-green/10 text-zenix-green border-zenix-green/20' : 'bg-red-500/10 text-red-500 border-red-500/20'" class="px-2 py-1 rounded border text-[10px] font-bold">
                                                    {{ op.result }}
                                                </span>
                                            </td>
                                            <td class="py-4 text-right font-bold" :class="op.result === 'WIN' ? 'text-zenix-green' : 'text-red-500'">
                                                {{ op.result === 'WIN' ? '+' : '' }}{{ op.pnl }}
                                            </td>
                                        </tr>
                                        <tr v-if="monitoringOperations.length === 0">
                                            <td colspan="6" class="text-center py-12 text-[#7A7A7A]">Nenhuma operação executada nesta sessão.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- CONFIGURATION FORM -->
                <div v-else class="strategy-creator-form-container px-4">
                    <form @submit.prevent="submitForm" class="space-y-8">
                        <div class="grid grid-cols-12 gap-6">
                            <div class="col-span-12">
                            <!-- Mercado Section (Fixed) -->
                            <div class="form-group mb-6">
                                <label class="block text-white font-bold mb-2">Mercado</label>
                                <button
                                    type="button"
                                    @click="openMarketModal"
                                    class="w-full bg-[#1E1E1E] border border-[#333] rounded-lg py-4 px-4 text-white hover:border-zenix-green focus:border-zenix-green transition-all text-left flex items-center justify-between"
                                >
                                    <span class="font-medium text-lg">{{ selectedMarketLabel }}</span>
                                    <i class="fa-solid fa-chevron-down text-gray-400"></i>
                                </button>
                            </div>

                            <!-- <p v-if="selectedMarketDescription" class="mt-2 text-zenix-green text-sm">
                                {{ selectedMarketDescription }}
                            </p> -->
                        </div>

                        <!-- Tipo de Negociação -->
                        <div class="form-group col-span-12">
                            <label class="block text-white font-bold mb-2">Tipo de Negociação</label>
                            <button
                                type="button"
                                @click="openTradeTypeModal"
                                :disabled="!contracts.length && !form.market"
                                class="w-full bg-[#1E1E1E] border border-[#333] rounded-lg py-4 px-4 text-white hover:border-zenix-green focus:border-zenix-green transition-all text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div class="flex items-center gap-3">
                                    <img v-if="selectedTradeTypeGroupIcon" :src="selectedTradeTypeGroupIcon" class="w-6 h-6 contrast-[1.5] brightness-[1.5]" alt="" />
                                    <span class="font-medium text-lg">{{ selectedTradeTypeGroupLabel }}</span>
                                </div>
                                <i class="fa-solid fa-chevron-down text-gray-400"></i>
                            </button>
                        </div>

                        <!-- Duração, Unidade, Multiplicador -->
                        <div class="col-span-12">
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label class="block text-white font-bold mb-2">Duração</label>
                                    <input 
                                        type="number" 
                                        v-model.number="form.duration" 
                                        class="w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg p-3 focus:outline-none focus:border-zenix-green transition-colors"
                                        min="1"
                                    />
                                </div>
                                <div>
                                    <label class="block text-white font-bold mb-2">Unidade</label>
                                    <div class="relative">
                                        <select 
                                            v-model="form.durationUnit" 
                                            class="w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg p-3 appearance-none focus:outline-none focus:border-zenix-green transition-colors"
                                        >
                                            <option value="t">Tique</option>
                                            <option value="s">Segundos</option>
                                            <option value="m">Minutos</option>
                                            <option value="h">Horas</option>
                                        </select>
                                        <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                            <i class="fa-solid fa-chevron-down text-gray-400"></i>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-white font-bold mb-2">Multiplicador</label>
                                    <input 
                                        type="number" 
                                        v-model.number="form.multiplier" 
                                        step="0.1" 
                                        class="w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg p-3 focus:outline-none focus:border-zenix-green transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Configurações Virtuais -->
                        <div class="col-span-12">
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label class="block text-white font-bold mb-2">Perdas virtuais</label>
                                    <input 
                                        type="number" 
                                        v-model.number="form.virtualLosses" 
                                        class="w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg p-3 focus:outline-none focus:border-zenix-green transition-colors"
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label class="block text-white font-bold mb-2">Negociações virtuais</label>
                                    <div class="relative">
                                        <select 
                                            v-model="form.virtualTradeAction" 
                                            class="w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg p-3 appearance-none focus:outline-none focus:border-zenix-green transition-colors"
                                        >
                                            <option value="loss">Na perda</option>
                                            <option value="win">Na vitória</option>
                                            <option value="always">Sempre</option>
                                        </select>
                                        <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                            <i class="fa-solid fa-chevron-down text-gray-400"></i>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-white font-bold mb-2">Iniciar com virtuais</label>
                                    <div class="relative">
                                        <select 
                                            v-model="form.startWithVirtual" 
                                            class="w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg p-3 appearance-none focus:outline-none focus:border-zenix-green transition-colors"
                                        >
                                            <option :value="true">Sim</option>
                                            <option :value="false">Não</option>
                                        </select>
                                        <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                            <i class="fa-solid fa-chevron-down text-gray-400"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Configuração de Recuperação (New Section) -->
                        <div class="col-span-12">
                            <div class="bg-[#141414] border border-[#333] rounded-xl p-6 relative overflow-hidden">
                                <div class="absolute top-0 right-0 p-4 opacity-5">
                                    <i class="fa-solid fa-shield-heart text-6xl"></i>
                                </div>
                                <h3 class="text-xl font-bold text-white mb-4 relative z-10 flex items-center gap-2">
                                    <i class="fa-solid fa-shield-heart text-zenix-green"></i>
                                    Configuração de Recuperação
                                </h3>
                                
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                    <div>
                                        <label class="block text-white font-bold mb-2">Mercado de Recuperação</label>
                                        <button
                                            type="button"
                                            @click="openMarketModal('recovery')"
                                            class="w-full bg-[#1E1E1E] border border-[#333] rounded-lg py-3 px-4 text-white hover:border-zenix-green focus:border-zenix-green transition-all text-left flex items-center justify-between"
                                        >
                                            <span class="font-medium text-sm">{{ selectedRecoveryMarketLabel }}</span>
                                            <i class="fa-solid fa-chevron-down text-gray-400 text-xs"></i>
                                        </button>
                                    </div>
                                    <div>
                                        <label class="block text-white font-bold mb-2">Tipo de Negociação</label>
                                        <button
                                            type="button"
                                            @click="openTradeTypeModal('recovery')"
                                            :disabled="!recoveryContracts.length && !recoveryConfig.market"
                                            class="w-full bg-[#1E1E1E] border border-[#333] rounded-lg py-3 px-4 text-white hover:border-zenix-green focus:border-zenix-green transition-all text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <div class="flex items-center gap-2">
                                                <img v-if="selectedRecoveryTradeTypeGroupIcon" :src="selectedRecoveryTradeTypeGroupIcon" class="w-4 h-4 contrast-[1.5] brightness-[1.5]" alt="" />
                                                <span class="font-medium text-sm">{{ selectedRecoveryTradeTypeGroupLabel }}</span>
                                            </div>
                                            <i class="fa-solid fa-chevron-down text-gray-400 text-xs"></i>
                                        </button>
                                    </div>
                                    <div>
                                        <label class="block text-white font-bold mb-2">Perdas para ativar</label>
                                        <input 
                                            type="number" 
                                            v-model.number="recoveryConfig.lossesToActivate" 
                                            class="w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg p-3 focus:outline-none focus:border-zenix-green transition-colors"
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <label class="block text-white font-bold mb-2">Troca de contrato</label>
                                        <div class="relative">
                                            <select 
                                                v-model="recoveryConfig.contractSwitch" 
                                                class="w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg p-3 appearance-none focus:outline-none focus:border-zenix-green transition-colors"
                                            >
                                                <option :value="true">Ativado</option>
                                                <option :value="false">Desativado</option>
                                            </select>
                                            <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                                <i class="fa-solid fa-chevron-down text-gray-400"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div class="flex items-center justify-between bg-[#1E1E1E] p-3 rounded-lg border border-[#333]">
                                            <span class="text-sm font-bold">Troca para modo normal</span>
                                            <div 
                                                class="w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300"
                                                :class="recoveryConfig.switchToNormal ? 'bg-zenix-green' : 'bg-gray-600'"
                                                @click="recoveryConfig.switchToNormal = !recoveryConfig.switchToNormal"
                                            >
                                                <div 
                                                    class="w-4 h-4 rounded-full bg-white absolute top-1 transition-all duration-300"
                                                    :style="{ left: recoveryConfig.switchToNormal ? 'calc(100% - 1.25rem)' : '0.25rem' }"
                                                ></div>
                                            </div>
                                        </div>
                                        <div class="flex items-center justify-between bg-[#1E1E1E] p-3 rounded-lg border border-[#333]">
                                            <span class="text-sm font-bold">Troca para modo preciso</span>
                                            <div 
                                                class="w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300"
                                                :class="recoveryConfig.switchToPrecise ? 'bg-zenix-green' : 'bg-gray-600'"
                                                @click="recoveryConfig.switchToPrecise = !recoveryConfig.switchToPrecise"
                                            >
                                                <div 
                                                    class="w-4 h-4 rounded-full bg-white absolute top-1 transition-all duration-300"
                                                    :style="{ left: recoveryConfig.switchToPrecise ? 'calc(100% - 1.25rem)' : '0.25rem' }"
                                                ></div>
                                            </div>
                                        </div>
                                        <div>
                                            <!-- <label class="block text-xs text-gray-400 mb-1">Máx. perdas (Preciso)</label> -->
                                            <input 
                                                type="number" 
                                                placeholder="Máx. perdas preciso"
                                                v-if="recoveryConfig.switchToPrecise"
                                                v-model.number="recoveryConfig.maxPreciseLosses" 
                                                class="w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg p-3 text-sm focus:outline-none focus:border-zenix-green transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <div class="md:col-span-2 flex gap-4">
                                         <button 
                                            type="button" 
                                            @click="showFilterModal = true"
                                            class="flex-1 bg-[#2A2A2A] hover:bg-[#333] text-white py-3 rounded-lg border border-[#444] font-medium transition-colors flex items-center justify-center gap-2"
                                        >
                                            <i class="fa-solid fa-filter"></i> Filtros
                                        </button>
                                         <button 
                                            type="button" 
                                            @click="showPauseModal = true"
                                            class="flex-1 bg-[#2A2A2A] hover:bg-[#333] text-white py-3 rounded-lg border border-[#444] font-medium transition-colors flex items-center justify-center gap-2"
                                        >
                                            <i class="fa-solid fa-pause"></i> Pausa Estratégia
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Valores Monetários -->
                        <div class="col-span-12">
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label class="block text-white font-bold mb-2">Quantia inicial</label>
                                    <div class="relative">
                                        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-white font-bold">Ð</span>
                                        <input 
                                            type="number" 
                                            v-model.number="form.initialStake" 
                                            class="w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg py-3 pl-8 pr-4 focus:outline-none focus:border-zenix-green transition-colors"
                                            step="0.01"
                                        />
                                    </div>
                                    <p class="mt-1 text-zenix-green text-xs font-bold">{{ calculatePercentage(form.initialStake) }}% do saldo</p>
                                </div>
                                <div>
                                    <label class="block text-white font-bold mb-2">Lucro alvo</label>
                                    <div class="relative">
                                        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-white font-bold">Ð</span>
                                        <input 
                                            type="number" 
                                            v-model.number="form.takeProfit" 
                                            class="w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg py-3 pl-8 pr-4 focus:outline-none focus:border-zenix-green transition-colors"
                                            step="0.01"
                                        />
                                    </div>
                                    <p class="mt-1 text-zenix-green text-xs font-bold">{{ calculatePercentage(form.takeProfit) }}% do saldo</p>
                                </div>
                                <div>
                                    <div class="flex justify-between items-center mb-2">
                                        <label class="block text-white font-bold">Limite de perda</label>
                                        <!-- <i class="fa-solid fa-gear text-gray-400 cursor-pointer hover:text-white transition-colors"></i> -->
                                    </div>
                                    <div class="relative">
                                        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-white font-bold">Ð</span>
                                        <input 
                                            type="number" 
                                            v-model.number="form.stopLoss" 
                                            class="w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg py-3 pl-8 pr-4 focus:outline-none focus:border-zenix-green transition-colors"
                                            step="0.01"
                                        />
                                    </div>
                                    <p class="mt-1 text-zenix-green text-xs font-bold">{{ calculatePercentage(form.stopLoss) }}% do saldo</p>
                                </div>
                            </div>
                        </div>

                        <!-- Submit Button -->
                        <div class="col-span-12 pt-6">
                            <button 
                                type="submit" 
                                class="w-full bg-zenix-green hover:bg-green-600 text-black font-bold text-lg py-4 rounded-lg flex justify-center items-center gap-3 transition-colors shadow-lg hover:shadow-zenix-green/20"
                            >
                                <i class="fa-solid fa-play"></i>
                                <span>Iniciar Robô</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            </main>
        </div>

        <SettingsSidebar 
            :is-open="showSettingsModal" 
            @close="showSettingsModal = false" 
        />

        <!-- Market Selection Modal -->
        <Teleport to="body">
            <div 
                v-if="showMarketModal" 
                class="modal-overlay" 
                data-modal="market" 
                @click.self="closeMarketModal"
            >
                <div class="modal-content categorized-modal">
                    <div class="modal-header">
                        <h3 class="modal-title">Selecionar Mercado</h3>
                        <button @click="closeMarketModal" class="modal-close-btn">
                            <i class="fa-solid fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="categories-grid">
                            <div v-for="(markets, category) in marketsByCategory" :key="category" class="category-card">
                                <div class="category-card-header">
                                    <div class="category-icon-wrapper">
                                        <svg v-if="category === 'Índices Contínuos'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M22 11L13.5 15.5L8.5 10.5L2 14" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M16 11H22V17" stroke="#FF444F" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        <svg v-else-if="category === 'Criptomoedas'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2.5"/>
                                            <path d="M9 12H15M12 9V15" stroke="#FF444F" stroke-width="2.5" stroke-linecap="round"/>
                                        </svg>
                                        <svg v-else-if="category === 'Major Pairs' || category === 'Forex Minors' || category === 'Forex Exotics'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2.5"/>
                                            <path d="M15 9L9 15M9 9L15 15" stroke="#FF444F" stroke-width="2.5" stroke-linecap="round"/>
                                            <path d="M12 2V22" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                                        </svg>
                                        <svg v-else-if="category === 'Metais'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 4L18 4L21 9L12 21L3 9L6 4Z" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M3 9H21" stroke="#FF444F" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M12 21V9" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        <i v-else class="fa-solid fa-bars text-white"></i>
                                    </div>
                                    <h4 class="category-card-title">{{ category }}</h4>
                                </div>
                                <div class="category-items-list">
                                    <button
                                        v-for="market in markets"
                                        :key="market.value"
                                        @click="selectMarket(market.value)"
                                        :class="['category-item-btn', { 'active': form.market === market.value }]"
                                    >
                                        {{ market.label }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Teleport>
          
        <!-- Trade Type Selection Modal -->
        <Teleport to="body">
            <div 
                v-if="showTradeTypeModal" 
                class="modal-overlay" 
                data-modal="trade-type" 
                @click.self="closeTradeTypeModal"
            >
                <div class="modal-content categorized-modal">
                    <div class="modal-header">
                        <h3 class="modal-title">Selecionar Tipo de Negociação</h3>
                        <button @click="closeTradeTypeModal" class="modal-close-btn">
                            <i class="fa-solid fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="categories-grid">
                            <div v-for="category in availableTradeTypeGroups" :key="category.id" class="category-card">
                                <div class="category-card-header">
                                    <div class="category-icon-wrapper">
                                        <svg v-if="category.id === 'rising_falling'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M22 11L13.5 15.5L8.5 10.5L2 14" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M16 11H22V17" stroke="#FF444F" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        <svg v-else-if="category.id === 'digits'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4 9H20" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M4 15H20" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M10 3L8 21" stroke="#FF444F" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M16 3L14 21" stroke="#FF444F" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        <svg v-else-if="category.id === 'accumulators'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M2 17L12 22L22 17" stroke="#FF444F" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M2 12L12 17L22 12" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        <svg v-else-if="category.id === 'multipliers'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2.5"/>
                                            <path d="M15 9L9 15M9 9L15 15" stroke="#FF444F" stroke-width="2.5" stroke-linecap="round"/>
                                        </svg>
                                        <i v-else :class="category.icon"></i>
                                    </div>
                                    <h4 class="category-card-title">{{ category.label }}</h4>
                                </div>
                                <div class="category-items-list">
                                    <button
                                        v-for="item in category.items"
                                        :key="item.value"
                                        @click="selectTradeType(item)"
                                        :class="['category-item-btn', { 'active': form.selectedTradeTypeGroup === item.value }]"
                                    >
                                        <div class="flex items-center gap-2">
                                            <img v-if="item.icon" :src="`/deriv_icons/${item.icon}`" class="w-5 h-5 contrast-[1.5] brightness-[1.5]" alt="" />
                                            <span>{{ item.label }}</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Teleport>

        <!-- Filter Modal Placeholder -->
        <Teleport to="body">
            <div v-if="showFilterModal" class="modal-overlay" @click.self="showFilterModal = false">
                <div class="modal-content" style="max-width: 500px">
                     <div class="modal-header">
                        <h3 class="modal-title">Filtros de Entrada</h3>
                        <button @click="showFilterModal = false" class="modal-close-btn">
                            <i class="fa-solid fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                         <div class="space-y-4">
                             <div v-for="filter in filters" :key="filter.id" class="flex flex-col gap-3 p-4 bg-[#111] rounded-xl border border-[#333] transition-all" :class="{ 'border-zenix-green/30 bg-zenix-green/5': filter.active }">
                                 <div class="flex items-center gap-3">
                                     <input type="checkbox" :id="filter.id" v-model="filter.active" class="w-5 h-5 accent-zenix-green cursor-pointer" />
                                     <label :for="filter.id" class="text-white font-bold cursor-pointer select-none">{{ filter.name }}</label>
                                 </div>
                                 <div v-if="filter.active" class="pl-8 transition-all animate-fadeIn">
                                     <input 
                                         type="number" 
                                         v-model.number="filter.value" 
                                         :placeholder="filter.placeholder"
                                         class="w-full bg-[#1A1A1A] text-white border border-[#333] rounded-lg p-3 text-sm focus:outline-none focus:border-zenix-green/50 transition-colors"
                                     />
                                 </div>
                             </div>
                             <div class="p-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm rounded-xl">
                                 Mais filtros serão adicionados em breve.
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        </Teleport>

        <!-- Pause Strategy Modal -->
        <Teleport to="body">
            <div v-if="showPauseModal" class="modal-overlay" @click.self="showPauseModal = false">
                <div class="modal-content" style="max-width: 500px">
                     <div class="modal-header">
                        <h3 class="modal-title">Pausa Estratégica</h3>
                        <button @click="showPauseModal = false" class="modal-close-btn">
                            <i class="fa-solid fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body space-y-6">
                         <div>
                            <label class="block text-white font-bold mb-2">Derrotas para ativar (Sequenciais)</label>
                            <input 
                                type="number" 
                                v-model.number="recoveryConfig.pauseLosses"
                                class="w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg p-3 focus:outline-none focus:border-zenix-green transition-colors"
                            />
                        </div>
                        
                        <div class="pt-4 border-t border-[#333]">
                            <h4 class="text-lg font-bold text-white mb-3">Filtro de Saída (Retomar)</h4>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs text-gray-400 mb-1">Volatilidade (DVX &lt; ?)</label>
                                    <input 
                                        type="number"
                                        placeholder="Ex: 50" 
                                        class="w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg p-3 focus:outline-none focus:border-zenix-green transition-colors"
                                    />
                                </div>
                                <div>
                                    <label class="block text-xs text-gray-400 mb-1">Tempo (minutos)</label>
                                    <input 
                                        type="number"
                                        placeholder="Ex: 5" 
                                        class="w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg p-3 focus:outline-none focus:border-zenix-green transition-colors"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div class="pt-4">
                            <button @click="showPauseModal = false" class="w-full bg-zenix-green text-black font-bold py-3 rounded-lg">
                                Salvar Configuração
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Teleport>

    </div>
</template>

<script>
import AppSidebar from '../../components/Sidebar.vue';
import TopNavbar from '../../components/TopNavbar.vue';
import SettingsSidebar from '../../components/SettingsSidebar.vue';

export default {
    name: 'StrategyCreatorView',
    components: {
        AppSidebar,
        TopNavbar,
        SettingsSidebar
    },
    data() {
        return {
            isSidebarOpen: true,
            isSidebarCollapsed: false,
            isMobile: false,
            showSettingsModal: false,
            
            // UI Modals
            showMarketModal: false,
            showTradeTypeModal: false,
            showFilterModal: false,
            showPauseModal: false,
            modalContext: 'main', // 'main' or 'recovery'

            markets: [],
            contracts: [],
            
            form: {
                market: '',
                selectedTradeTypeGroup: '', // For grouping
                tradeType: '', // Actual API value
                duration: 1,
                durationUnit: 't',
                multiplier: 2.2,
                virtualLosses: 0,
                virtualTradeAction: 'loss',
                startWithVirtual: true,
                initialStake: 1,
                takeProfit: 20,
                stopLoss: 1000
            },
            
            recoveryConfig: {
                market: '',
                selectedTradeTypeGroup: '',
                tradeType: '',
                lossesToActivate: 2,
                contractSwitch: true,
                switchToNormal: false,
                switchToPrecise: true,
                maxPreciseLosses: 3,
                pauseLosses: 5
            },
            recoveryContracts: [],

            // WebSocket Tick Monitoring
            ws: null,
            tickSubscriptionId: null,
            tickCount: 0,
            lastTickPrice: null,,

            balance: 5889.28, // Mock implementation or fetch from store
            isMonitoring: false,
            activeMonitoringTab: 'chart',
            monitoringStats: {
                balance: 5889.28,
                profit: 0,
                wins: 0,
                losses: 0,
                status: 'Aguardando sinal...',
                statusDesc: 'Analisando condições de mercado'
            },
            monitoringLogs: [],
            monitoringOperations: [],
            simulationInterval: null,
            filters: [
                { id: 'trend', name: 'Seguir Tendência (EMA)', active: false, value: 20, placeholder: 'Período EMA' },
                { id: 'rsi', name: 'Filtro RSI (Sobrecompra/Sobrevenda)', active: false, value: 70, placeholder: 'Nível RSI' },
                { id: 'volatility', name: 'Filtro de Volatilidade (DVX)', active: false, value: 50, placeholder: 'Máx. DVX' }
            ],
            // Hardcoded Category Data (from OperationChart.vue)
            tradeTypeCategories: [
                {
                    id: 'rising_falling',
                    label: 'Sobe / Desce',
                    icon: 'fas fa-chart-line',
                    items: [
                        { value: 'rise_fall', label: 'Sobe / Desce', icon: 'TradeTypesRiseFallIcon.svg', directions: [
                            { value: 'CALL', label: 'Sobe' },
                            { value: 'PUT', label: 'Desce' }
                        ]},
                        { value: 'rise_fall_equal', label: 'Sobe / Desce Igual', icon: 'TradeTypesRiseFallEqualIcon.svg', directions: [
                            { value: 'CALLE', label: 'Sobe Igual' },
                            { value: 'PUTE', label: 'Desce Igual' }
                        ]}
                    ]
                },
                {
                    id: 'digits',
                    label: 'Dígitos',
                    icon: 'fas fa-sort-numeric-up',
                    items: [
                        { value: 'match_diff', label: 'Combina / Difere', icon: 'TradeTypesDigitsMatchDiffIcon.svg', directions: [
                            { value: 'DIGITMATCH', label: 'Combina' },
                            { value: 'DIGITDIFF', label: 'Difere' }
                        ]},
                        { value: 'even_odd', label: 'Par / Ímpar', icon: 'TradeTypesDigitsEvenOddIcon.svg', directions: [
                            { value: 'DIGITEVEN', label: 'Par' },
                            { value: 'DIGITODD', label: 'Ímpar' }
                        ]},
                        { value: 'over_under', label: 'Acima / Abaixo', icon: 'TradeTypesDigitsOverUnderIcon.svg', directions: [
                            { value: 'DIGITOVER', label: 'Acima' },
                            { value: 'DIGITUNDER', label: 'Abaixo' }
                        ]}
                    ]
                },
                {
                    id: 'one_barrier',
                    label: 'Uma Barreira',
                    icon: 'fas fa-bullseye',
                    items: [
                        { value: 'touch_no_touch', label: 'Toca / Não Toca', icon: 'TradeTypesHighsAndLowsTouchIcon.svg', directions: [
                            { value: 'ONETOUCH', label: 'Toca' },
                            { value: 'NOTOUCH', label: 'Não Toca' }
                        ]},
                        { value: 'higher_lower', label: 'Maior / Menor', icon: 'TradeTypesHighsAndLowsHigherIcon.svg', directions: [
                            { value: 'HIGHER', label: 'Maior' },
                            { value: 'LOWER', label: 'Menor' }
                        ]}
                    ]
                },
                {
                    id: 'two_barriers',
                    label: 'Duas Barreiras',
                    icon: 'fas fa-shield-alt',
                    items: [
                        { value: 'in_out', label: 'Permanece Dentro / Sai Fora', icon: 'TradeTypesInsAndOutsStaysInIcon.svg', directions: [
                            { value: 'RANGE', label: 'Permanece Dentro' },
                            { value: 'UPORDOWN', label: 'Sai Fora' }
                        ]},
                        { value: 'ends_in_out', label: 'Termina Dentro / Termina Fora', icon: 'TradeTypesInsAndOutsEndsInIcon.svg', directions: [
                            { value: 'EXPIRYRANGE', label: 'Termina Dentro' },
                            { value: 'EXPIRYMISS', label: 'Termina Fora' }
                        ]}
                    ]
                },
                {
                    id: 'no_expiry',
                    label: 'Sem Vencimento',
                    icon: 'fas fa-bolt',
                    items: [
                        { value: 'multipliers_mult', label: 'Multiplicadores', icon: 'TradeTypesMultipliersUpIcon.svg', directions: [
                            { value: 'MULTUP', label: 'Alta' },
                            { value: 'MULTDOWN', label: 'Baixa' }
                        ]},
                        { value: 'accumulators_accu', label: 'Acumuladores', icon: 'TradeTypesAccumulatorStayInIcon.svg', directions: [
                            { value: 'ACCU', label: 'Acumuladores' }
                        ]}
                    ]
                }
            ],
            allTradeTypes: [
                { value: 'CALL', label: 'Subida' }, { value: 'PUT', label: 'Queda' },
                { value: 'DIGITMATCH', label: 'Combina' }, { value: 'DIGITDIFF', label: 'Difere' },
                { value: 'DIGITEVEN', label: 'Par' }, { value: 'DIGITODD', label: 'Ímpar' },
                { value: 'DIGITOVER', label: 'Superior' }, { value: 'DIGITUNDER', label: 'Inferior' },
                { value: 'CALLE', label: 'Subida Igual' }, { value: 'PUTE', label: 'Queda Igual' },
                { value: 'ACCU', label: 'Acumuladores' },
                { value: 'MULTUP', label: 'Alta' }, { value: 'MULTDOWN', label: 'Baixa' },
                { value: 'ONETOUCH', label: 'Toca' }, { value: 'NOTOUCH', label: 'Não Toca' },
                { value: 'HIGHER', label: 'Maior' }, { value: 'LOWER', label: 'Menor' },
                { value: 'RANGE', label: 'Permanece Dentro' }, { value: 'UPORDOWN', label: 'Sai Fora' },
                { value: 'EXPIRYRANGE', label: 'Termina Dentro' }, { value: 'EXPIRYMISS', label: 'Termina Fora' },
            ]
        }
    },
    computed: {
        marketsByCategory() {
            const grouped = {};
            
            // Priority Order (Matching OperationChart)
            const categoryPriority = {
                'Índices Contínuos': 1,
                'Índices Daily Reset': 2,
                'Índices Step': 3,
                'Índices JUMP': 4,
                'Índices Crash/Boom': 5,
                'Criptomoedas': 6,
                'Forex Majors': 7,
                'Major Pairs': 7,
                'Forex Minors': 8,
                'Outros': 99
            };

            const nameMap = {
                'Indices Step': 'Índices Step',
                'Jump Indices': 'Índices JUMP',
                'Boom/Crash': 'Índices Crash/Boom',
                'Daily Reset Indices': 'Índices Daily Reset',
                'Major Pairs': 'Forex Majors',
                'Minor Pairs': 'Forex Minors',
                'Continuous Indices': 'Índices Contínuos'
            };
            
            this.markets.forEach(market => {
                let category = market.category || 'Outros';
                
                if (nameMap[category]) {
                    category = nameMap[category];
                }

                if (!grouped[category]) {
                    grouped[category] = [];
                }
                grouped[category].push(market);
            });

            const sortedGrouped = {};
            const categories = Object.keys(grouped).sort((a, b) => {
                const pA = categoryPriority[a] || 99;
                const pB = categoryPriority[b] || 99;
                if (pA !== pB) return pA - pB;
                return a.localeCompare(b);
            });

            categories.forEach(cat => {
                sortedGrouped[cat] = grouped[cat];
            });

            return sortedGrouped;
        },
        selectedMarketLabel() {
            const market = this.markets.find(m => m.symbol === this.form.market); // Using 'symbol' property usually used in StrategyCreator
            if (market) return market.displayName || market.label;
            
            // Try matching by value if symbol not found (fallback)
            const marketByValue = this.markets.find(m => m.value === this.form.market);
            return marketByValue ? marketByValue.label : 'Selecione um mercado';
        },
        selectedTradeTypeGroupLabel() {
            if (!this.form.selectedTradeTypeGroup) return 'Selecionar Tipo';
            
            for (const cat of this.tradeTypeCategories) {
                const item = cat.items.find(i => i.value === this.form.selectedTradeTypeGroup);
                if (item) return item.label;
            }
            return 'Selecionar Tipo';
        },
        selectedTradeTypeGroupIcon() {
            if (!this.form.selectedTradeTypeGroup) return null;
            
            for (const cat of this.tradeTypeCategories) {
                const item = cat.items.find(i => i.value === this.form.selectedTradeTypeGroup);
                if (item && item.icon) return `/deriv_icons/${item.icon}`;
            }
            return null;
        },
        selectedRecoveryMarketLabel() {
            const market = this.markets.find(m => m.symbol === this.recoveryConfig.market);
            if (market) return market.displayName || market.label;
            
            const marketByValue = this.markets.find(m => m.value === this.recoveryConfig.market);
            return marketByValue ? marketByValue.label : 'Mercado de Recuperação';
        },
        selectedRecoveryTradeTypeGroupLabel() {
            if (!this.recoveryConfig.selectedTradeTypeGroup) return 'Selecionar Tipo';
            
            for (const cat of this.tradeTypeCategories) {
                const item = cat.items.find(i => i.value === this.recoveryConfig.selectedTradeTypeGroup);
                if (item) return item.label;
            }
            return 'Selecionar Tipo';
        },
        selectedRecoveryTradeTypeGroupIcon() {
            if (!this.recoveryConfig.selectedTradeTypeGroup) return null;
            
            for (const cat of this.tradeTypeCategories) {
                const item = cat.items.find(i => i.value === this.recoveryConfig.selectedTradeTypeGroup);
                if (item && item.icon) return `/deriv_icons/${item.icon}`;
            }
            return null;
        },
        availableContracts() {
            if (!this.contracts || this.contracts.length === 0) return [];
            return this.contracts.map(c => c.contractType.toUpperCase());
        },
        availableRecoveryContracts() {
            if (!this.recoveryContracts || this.recoveryContracts.length === 0) return [];
            return this.recoveryContracts.map(c => c.contractType.toUpperCase());
        },
        availableTradeTypeGroups() {
             const contextContracts = this.modalContext === 'main' ? this.availableContracts : this.availableRecoveryContracts;
             
             if (!contextContracts.length) return []; 

             return this.tradeTypeCategories.map(category => {
                const filteredItems = category.items.filter(item => {
                  return item.directions.some(dir => contextContracts.includes(dir.value.toUpperCase()));
                });
                
                if (filteredItems.length > 0) {
                  return {
                    ...category,
                    items: filteredItems
                  };
                }
                return null;
              }).filter(Boolean);
        }
    },
    mounted() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
        this.fetchMarkets();
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.handleResize);
    },
    methods: {
        handleResize() {
            this.isMobile = window.innerWidth < 1024;
            if (this.isMobile) {
                this.isSidebarOpen = false;
            }
        },
        toggleSidebarCollapse() {
            this.isSidebarCollapsed = !this.isSidebarCollapsed;
        },
        async fetchMarkets() {
            try {
                const token = localStorage.getItem('token');
                const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                
                const res = await fetch(`${apiBaseUrl}/markets`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    
                    const allowedForex = ['frxEURUSD', 'frxUSDJPY', 'frxGBPUSD', 'frxAUDUSD', 'frxUSDCHF', 'frxUSDCAD', 'frxNZDUSD', 'frxEURGBP', 'frxEURJPY', 'frxGBPJPY'];
                    const allowedCrypto = ['cryBTCUSD', 'cryETHUSD', 'cryLTCUSD', 'cryXRPUSD', 'cryBCHUSD'];
                    const allowedSynthetic = ['Continuous Indices', 'Daily Reset Indices', 'Indices Step', 'Jump Indices', 'Boom/Crash'];

                    const filteredData = data.filter(m => {
                        if (m.symbol.startsWith('frx')) return allowedForex.includes(m.symbol);
                        if (m.symbol.startsWith('cry')) return allowedCrypto.includes(m.symbol);
                        
                        const submarket = m.submarketDisplayName;
                        if (allowedSynthetic.includes(submarket)) return true;
                        
                        if (m.symbol.startsWith('R_') || m.symbol.startsWith('1HZ') || 
                            m.symbol.startsWith('JDM') || m.symbol.startsWith('BOOM') || 
                            m.symbol.startsWith('CRASH') || m.symbol.startsWith('STP') ||
                            m.symbol.startsWith('RDBEAR') || m.symbol.startsWith('RDBULL')) {
                            return true;
                        }
                        return false;
                    });

                    this.markets = filteredData.map(m => {
                        let category = m.submarketDisplayName || m.marketDisplayName || 'Outros';
                        
                        if (m.symbol.startsWith('frx')) {
                            category = 'Major Pairs';
                        } else if (m.symbol.startsWith('cry')) {
                            category = 'Criptomoedas';
                        } else if (m.symbol.startsWith('R_') || m.symbol.startsWith('1HZ')) {
                            category = 'Índices Contínuos';
                        } else if (m.symbol.startsWith('JDM')) {
                            category = 'Jump Indices';
                        } else if (m.symbol.startsWith('BOOM') || m.symbol.startsWith('CRASH')) {
                            category = 'Boom/Crash';
                        } else if (m.symbol.startsWith('STP')) {
                            category = 'Indices Step';
                        } else if (m.symbol.startsWith('RDBEAR') || m.symbol.startsWith('RDBULL')) {
                            category = 'Daily Reset Indices';
                        }

                        return {
                            ...m,
                            value: m.symbol,
                            label: m.displayName,
                            category: category
                        };
                    });
                }
            } catch (error) {
                console.error('Erro ao buscar mercados:', error);
                this.$root.$toast.error('Erro ao carregar mercados');
            }
        },
        async onMarketChange(context = 'main') {
            const market = context === 'main' ? this.form.market : this.recoveryConfig.market;
            if (!market) return;
            
            if (context === 'main') {
                this.contracts = [];
                this.form.selectedTradeTypeGroup = '';
                this.form.tradeType = '';
            } else {
                this.recoveryContracts = [];
                this.recoveryConfig.selectedTradeTypeGroup = '';
                this.recoveryConfig.tradeType = '';
            }
            
            try {
                const token = localStorage.getItem('token');
                const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                
                const res = await fetch(`${apiBaseUrl}/markets/${market}/contracts`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
+
                if (res.ok) {
                    const contracts = await res.json();
                    if (context === 'main') {
                        this.contracts = contracts;
                    } else {
                        this.recoveryContracts = contracts;
                    }
                }
            } catch (error) {
                console.error('Erro ao buscar contratos:', error);
                this.$root.$toast.error('Erro ao carregar contratos do mercado');
            }
        },
        // Modal Handlers
        openMarketModal(context = 'main') {
            this.modalContext = context;
            this.showMarketModal = true;
        },
        closeMarketModal() {
            this.showMarketModal = false;
        },
        selectMarket(symbol) {
            if (this.modalContext === 'main') {
                this.form.market = symbol;
            } else {
                this.recoveryConfig.market = symbol;
            }
            this.closeMarketModal();
            this.onMarketChange(this.modalContext);
        },
        openTradeTypeModal(context = 'main') {
            const contracts = context === 'main' ? this.contracts : this.recoveryContracts;
            if (!contracts.length) return;
            this.modalContext = context;
            this.showTradeTypeModal = true;
        },
        closeTradeTypeModal() {
            this.showTradeTypeModal = false;
        },
        selectTradeType(item) {
            if (this.modalContext === 'main') {
                this.form.selectedTradeTypeGroup = item.value;
                if (item.directions && item.directions.length > 0) {
                     this.form.tradeType = item.directions[0].value;
                }
            } else {
                this.recoveryConfig.selectedTradeTypeGroup = item.value;
                if (item.directions && item.directions.length > 0) {
                     this.recoveryConfig.tradeType = item.directions[0].value;
                }
            }
            
            this.closeTradeTypeModal();
        },
        
        calculatePercentage(value) {
            if (!value || !this.balance) return '0.00';
            return ((value / this.balance) * 100).toFixed(2);
        },
        submitForm() {
            this.isMonitoring = true;
            this.startSimulation();
            this.$root.$toast.success('Estratégia iniciada com sucesso!');
        },
        stopMonitoring() {
            this.isMonitoring = false;
            if (this.simulationInterval) {
                clearInterval(this.simulationInterval);
                this.simulationInterval = null;
            }
            this.stopTickConnection(); // Close WebSocket
            this.monitoringLogs = [];
            this.monitoringOperations = [];
            this.monitoringStats.profit = 0;
            this.monitoringStats.wins = 0;
            this.monitoringStats.losses = 0;
        },
        startSimulation() {
            this.addLog('🤖 Robô iniciado. Aguardando conexão com mercado...', 'info');
            
            // Iniciar Monitoramento de Ticks Real-time
            this.initTickConnection();
            
            this.simulationInterval = setInterval(() => {
                const rand = Math.random();
                if (rand > 0.95) { // Reduzi frequência de trades simulados para não poluir
                    this.simulateTrade();
                } else if (rand > 0.8) {
                    this.simulateLog();
                }
            }, 8000);
        },
        // WebSocket Tick Monitoring Methods
        async initTickConnection() {
            if (!this.form.market) {
                this.addLog('⚠️ Nenhum mercado selecionado.', 'error');
                return;
            }

            this.stopTickConnection();
            this.tickCount = 0;

            const appId = localStorage.getItem('deriv_app_id') || '1089'; // Default App ID
            const endpoint = `wss://ws.derivws.com/websockets/v3?app_id=${appId}`;
            
            this.ws = new WebSocket(endpoint);

            this.ws.onopen = () => {
                this.addLog(`🔌 Conectado ao mercado: ${this.selectedMarketLabel}`, 'success');
                this.subscribeTicks();
            };

            this.ws.onmessage = (event) => {
                try {
                    const msg = JSON.parse(event.data);
                    this.handleTickMessage(msg);
                } catch (e) {
                    console.error('[WS] Erro JSON:', e);
                }
            };

            this.ws.onerror = (e) => {
                console.error('[WS] Erro:', e);
                this.addLog('❌ Erro na conexão com o mercado.', 'error');
            };

            this.ws.onclose = () => {
                if (this.isMonitoring) {
                    this.addLog('📡 Conexão encerrada. Tentando reconectar...', 'info');
                    setTimeout(() => {
                        if (this.isMonitoring) this.initTickConnection();
                    }, 3000);
                }
            };
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
            this.tickCount = 0;
        },

        subscribeTicks() {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify({
                    ticks: this.form.market,
                    subscribe: 1
                }));
            }
        },

        handleTickMessage(msg) {
            if (msg.error) {
                this.addLog(`❌ Erro Deriv: ${msg.error.message}`, 'error');
                return;
            }

            if (msg.msg_type === 'tick' && msg.tick) {
                this.tickCount++;
                const price = msg.tick.quote;
                this.lastTickPrice = price;
                
                if (msg.subscription) {
                    this.tickSubscriptionId = msg.subscription.id;
                }

                this.addLog(`📈 Tick recebido: ${price} - Tick #${this.tickCount}`, 'info');
                
                // Opcional: Atualizar mini stats ou algo visual
            }
        },
        simulateTrade() {
            const isWin = Math.random() > 0.4;
            const winAmount = (this.form.stake * 0.95).toFixed(2);
            const lossAmount = this.form.stake.toFixed(2);
            const pnl = isWin ? parseFloat(winAmount) : -parseFloat(lossAmount);
            
            this.monitoringStats.profit += pnl;
            if (isWin) this.monitoringStats.wins++;
            else this.monitoringStats.losses++;
            
            this.monitoringStats.balance += pnl;

            const trade = {
                id: Date.now(),
                time: new Date().toLocaleTimeString(),
                market: this.form.market,
                contract: this.form.tradeType,
                stake: this.form.stake,
                pnl: pnl.toFixed(2),
                result: isWin ? 'WIN' : 'LOSS'
            };

            this.monitoringOperations.unshift(trade);
            this.addLog(`${isWin ? '💰 Lucro' : '🔴 Perda'} de $${Math.abs(pnl).toFixed(2)} em ${this.form.market}`, isWin ? 'success' : 'error');
        },
        simulateLog() {
            const logs = [
                'Analisando tendência...',
                'EMA 20 cruzando para cima.',
                'RSI em nível de neutralidade.',
                'Aguardando confirmação de RSI...',
                'Filtro de volatilidade OK.',
                'Padrão Candlestick detectado.'
            ];
            const msg = logs[Math.floor(Math.random() * logs.length)];
            this.addLog(msg, 'info');
        },
        addLog(message, type) {
            this.monitoringLogs.unshift({
                id: Date.now(),
                time: new Date().toLocaleTimeString(),
                message,
                type
            });
            if (this.monitoringLogs.length > 50) this.monitoringLogs.pop();
        }
    }
}
</script>

<style scoped>
.dashboard-layout {
    display: flex;
    min-height: 100vh;
    background-color: #0B0B0B;
    color: #fff;
    font-family: 'Roboto', sans-serif;
}

.sidebar-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
}

.dashboard-content-wrapper {
    flex-grow: 1;
    transition: margin-left 0.3s ease;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.dashboard-content-wrapper.sidebar-collapsed {
    margin-left: 80px;
}

.layout-content {
    flex-grow: 1;
    padding: 20px;
    padding-top: 50px;
    padding-bottom: 40px;
    background-color: #0B0B0B;
    width: 100%;
    overflow-y: auto;
}

@media (max-width: 1024px) {
    .dashboard-content-wrapper { margin-left: 0; }
    .dashboard-content-wrapper.sidebar-collapsed { margin-left: 0; }
    .layout-content { padding-top: 70px; }
}

/* Modal Styles Copied/Adapted from OperationChart */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
  pointer-events: auto;
}

.modal-content {
  position: relative;
  background: #0F0F0F;
  border: 1px solid #1A1A1A;
  border-radius: 24px;
  padding: 0;
  min-width: 480px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: none;
  animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px;
  border-bottom: 1px solid #1A1A1A;
  background: #0F0F0F;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #f8fafc;
  margin: 0;
}

.modal-close-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

.modal-close-btn:hover {
  color: #f8fafc;
  background: rgba(255, 255, 255, 0.1);
}

.modal-body {
  padding: 24px 32px;
  background: #0F0F0F;
}

.categorized-modal {
  min-width: 900px !important;
  max-width: 1100px !important;
  background: #0B0B0B !important;
  border-radius: 12px !important;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.category-card {
  background: rgba(17, 17, 17, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 320px;
  width: 100%; 
}

.category-card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
}

.category-icon-wrapper {
  width: 52px;
  height: 52px;
  background: rgba(34, 197, 94, 0.15) !important;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid rgba(34, 197, 94, 0.25);
}

.category-icon-wrapper svg, .category-icon-wrapper svg path {
  stroke: #22C55E !important;
}

.category-card-title {
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
  margin: 0;
}

.category-items-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-item-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  text-align: left;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
}

.category-item-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #FFFFFF;
}

.category-item-btn.active {
  background: rgba(34, 197, 94, 0.1);
  color: #22C55E;
  font-weight: 500;
  border-left: 2px solid #22C55E;
  border-radius: 0 6px 6px 0;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}

@media (max-width: 1024px) {
  .categorized-modal {
    min-width: 95% !important;
  }
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .categories-grid {
    grid-template-columns: 1fr;
    gap: 16px !important;
  }
  .categorized-modal {
    min-width: auto !important;
    max-width: 100% !important;
    margin: 0 !important;
    max-height: calc(100vh - 20px) !important;
  }
  .modal-body {
     padding: 20px 16px !important; 
  }
  .category-card {
     min-height: auto !important; 
  }
}
/* Monitoring Dashboard Styles */
.monitoring-dashboard {
    height: 100%;
}

.stop-btn {
    background-color: #ef4444;
    color: white;
    padding: 10px 20px;
    border-radius: 12px;
    font-weight: bold;
    font-size: 14px;
    transition: all 0.2s;
    border: none;
    cursor: pointer;
}

.stop-btn:hover {
    background-color: #dc2626;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

.stats-card {
    background: #141414;
    border: 1px solid #333;
    border-radius: 16px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 16px;
    transition: all 0.3s;
}

.stats-card:hover {
    border-color: #444;
}

.stats-icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
}

.stats-icon-wrapper.blue { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
.stats-icon-wrapper.green { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
.stats-icon-wrapper.red { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
.stats-icon-wrapper.yellow { background: rgba(234, 179, 8, 0.1); color: #eab308; }

.stats-icon-wrapper.pulse {
    animation: statsPulse 2s infinite;
}

@keyframes statsPulse {
    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
    70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}

.stats-label {
    display: block;
    font-size: 10px;
    text-transform: uppercase;
    color: #7A7A7A;
    font-weight: bold;
    letter-spacing: 0.05em;
    margin-bottom: 2px;
}

.stats-value {
    display: block;
    font-size: 18px;
    font-weight: bold;
    color: #fff;
}

.monitoring-tabs-container {
    border-bottom: 1px solid #333;
}

.tab-content-container {
    background: #141414;
    border: 1px solid #333;
    border-radius: 16px;
    min-height: 400px;
}

.log-entry.info { border-left: 3px solid #3b82f6; }
.log-entry.success { border-left: 3px solid #22c55e; }
.log-entry.error { border-left: 3px solid #ef4444; }

.status-badge {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: bold;
}

.badge-win { background: rgba(34, 197, 94, 0.1); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.2); }
.badge-loss { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); }
</style>

