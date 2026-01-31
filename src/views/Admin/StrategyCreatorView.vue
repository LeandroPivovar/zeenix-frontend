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

        <div class="dashboard-content-wrapper">
            <TopNavbar 
                :is-sidebar-collapsed="isSidebarCollapsed"
                @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
                @toggle-sidebar-collapse="toggleSidebarCollapse"
                @open-settings="showSettingsModal = true"
            />

            <main class="layout-content">
                <div class="content-header mb-6 flex justify-between items-center px-4 w-full">
                    <div>
                        <h1 class="text-2xl font-bold text-white">{{ isMonitoring ? 'Acompanhamento de Estratégia [BETA]' : 'Criador de Estratégias [BETA]' }}</h1>
                        <p class="text-sm text-[#7D7D7D]">{{ isMonitoring ? 'Acompanhe a atividade do robô em tempo real.' : 'Configure sua estratégia automatizada para execução no mercado.' }}</p>
                    </div>
                    <button v-if="isMonitoring" @click="stopMonitoring" class="stop-btn">
                        <i class="fas fa-stop mr-2"></i> Parar Robô
                    </button>
                    <div v-else class="flex flex-wrap items-center gap-3">
                        <div class="flex items-center gap-2 bg-[#141414] border border-[#333] rounded-lg p-1">
                            <select 
                                v-model="selectedSavedStrategyId" 
                                @change="loadSavedStrategy"
                                class="bg-[#141414] text-white text-xs border-none focus:ring-0 min-w-[150px] cursor-pointer hover:text-zenix-green transition-colors"
                            >
                                <option value="" disabled class="bg-[#141414] text-gray-500">Selecionar Estratégia</option>
                                <option v-for="s in savedStrategies" :key="s.id" :value="s.id" class="bg-[#141414] text-white">{{ s.name }}</option>
                            </select>
                            <button 
                                v-if="selectedSavedStrategyId"
                                @click="deleteSavedStrategy"
                                title="Excluir estratégia"
                                class="text-red-500 hover:text-red-400 p-2 transition-colors"
                            >
                                <i class="fas fa-trash-alt text-xs"></i>
                            </button>
                            <button 
                                v-if="selectedSavedStrategyId"
                                @click="updateCurrentStrategy" 
                                title="Atualizar IA"
                                class="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 border border-blue-500/30"
                            >
                                <i class="fas fa-sync-alt"></i> Atualizar
                            </button>
                            <button 
                                @click="saveCurrentStrategy" 
                                title="Salvar Nova IA"
                                class="bg-zenix-green/10 text-zenix-green hover:bg-zenix-green/20 p-2 rounded-lg text-xs font-bold transition-all border border-zenix-green/30"
                            >
                                <i class="fas fa-save"></i>
                            </button>
                            <button 
                                @click="exportToJSON" 
                                title="Exportar para Arquivo (.json)"
                                class="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 p-2 rounded-lg text-xs font-bold transition-all border border-blue-500/30"
                            >
                                <i class="fas fa-file-export"></i>
                            </button>
                            <button 
                                @click="$refs.importInput.click()" 
                                title="Importar de Arquivo"
                                class="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 p-2 rounded-lg text-xs font-bold transition-all border border-purple-500/30"
                            >
                                <i class="fas fa-file-import"></i>
                                <input type="file" ref="importInput" class="hidden" accept=".json" @change="handleImportJSON">
                            </button>
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
                                <span class="stats-value" :class="monitoringStats.profit >= 0 ? 'text-zenix-green glow-green-text' : 'text-red-500'">
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
                                <span class="stats-value text-zenix-green">{{ monitoringStats.wins + monitoringStats.losses > 0 ? ((monitoringStats.wins / (monitoringStats.wins + monitoringStats.losses)) * 100).toFixed(0) : 0 }}%</span>
                                <span class="text-[10px] text-[#7A7A7A] ml-1">{{ monitoringStats.wins }}W / {{ monitoringStats.losses }}L</span>
                            </div>
                        </div>
                        <div v-if="sessionState.isRecoveryMode" class="stats-card border border-zenix-green/30 bg-zenix-green/5">
                            <div class="stats-icon-wrapper green">
                                <i class="fas fa-undo"></i>
                            </div>
                            <div class="stats-info">
                                <span class="stats-label">Recuperação</span>
                                <span class="stats-value text-zenix-green glow-green-text">$ {{ (sessionState.totalLossAccumulated - sessionState.recoveredAmount).toFixed(2) }}</span>
                                <p class="text-[10px] text-gray-500">Restante para Meta</p>
                            </div>
                        </div>
                        <div v-else class="stats-card">
                            <div class="stats-icon-wrapper green pulse">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div class="stats-info">
                                <span class="stats-label">Status da IA</span>
                                <span class="stats-value text-sm text-zenix-green">{{ monitoringStats.status }}</span>
                                <p class="text-[10px] text-zenix-green/80">{{ monitoringStats.statusDesc }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Tabs -->
                    <div class="monitoring-tabs-container mb-4">
                        <div class="monitoring-tabs flex gap-4 border-b border-[#333]">
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
                                                <span :class="op.result === 'WON' ? 'bg-zenix-green/10 text-zenix-green border-zenix-green/20' : 'bg-red-500/10 text-red-500 border-red-500/20'" class="px-2 py-1 rounded border text-[10px] font-bold">
                                                    {{ op.result }}
                                                </span>
                                            </td>
                                            <td class="py-4 text-right font-bold" :class="op.result === 'WON' ? 'text-zenix-green' : 'text-red-500'">
                                                {{ op.result === 'WON' ? '+' : '' }}{{ op.pnl }}
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
                            <!-- Mercado e Tipo de Negociação -->
                            <div class="col-span-12 md:col-span-6">
                                <div class="form-group">
                                    <label class="block text-white font-bold mb-2">Mercado</label>
                                    <button
                                        type="button"
                                        @click="openMarketModal('main')"
                                        class="w-full bg-[#1E1E1E] border border-[#333] rounded-lg py-4 px-4 text-white hover:border-zenix-green focus:border-zenix-green transition-all text-left flex items-center justify-between"
                                    >
                                        <span class="font-medium text-lg">{{ selectedMarketLabel }}</span>
                                        <i class="fa-solid fa-chevron-down text-gray-400"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="col-span-12 md:col-span-6">
                                <div class="form-group">
                                    <label class="block text-white font-bold mb-2">Tipo de Negociação</label>
                                    <button
                                        type="button"
                                        @click="openTradeTypeModal('main')"
                                        :disabled="!contracts.length && !form.market"
                                        class="w-full bg-[#1E1E1E] border border-[#333] rounded-lg py-4 px-4 text-white hover:border-zenix-green focus:border-zenix-green transition-all text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <div class="flex items-center gap-3">
                                            <div v-if="selectedTradeTypeIcon" class="w-6 h-6 flex items-center justify-center text-zenix-green">
                                                <i class="fa-solid fa-chart-line" v-if="form.tradeType === 'CALL' || form.tradeType === 'PUT'"></i>
                                                <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11L13.5 15.5L8.5 10.5L2 14"/><path d="M16 11H22V17"/></svg>
                                            </div>
                                            <span class="font-medium text-lg">{{ selectedTradeTypeLabel }}</span>
                                        </div>
                                        <i class="fa-solid fa-chevron-down text-gray-400"></i>
                                    </button>
                                </div>
                            </div>

                        <!-- Parâmetros de Execução -->
                        <div class="col-span-12">
                            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                                    <label class="block text-white font-bold mb-2">Nível de Soros</label>
                                    <input 
                                        type="number" 
                                        v-model.number="form.sorosLevel" 
                                        class="w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg p-3 focus:outline-none focus:border-zenix-green transition-colors"
                                        min="0"
                                    />
                                </div>
                                <div v-if="['DIGITOVER', 'DIGITUNDER', 'DIGITMATCH', 'DIGITDIFF'].includes(form.tradeType)">
                                    <label class="block text-white font-bold mb-2">Dígito Alvo (Previsão)</label>
                                    <div class="relative">
                                        <select 
                                            v-model.number="form.prediction" 
                                            class="w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg p-3 appearance-none focus:outline-none focus:border-zenix-green transition-colors"
                                        >
                                            <option v-for="n in 10" :key="n-1" :value="n-1">{{ n-1 }}</option>
                                        </select>
                                        <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                            <i class="fa-solid fa-chevron-down text-gray-400"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Filtros de Ataque (Primary Entry) -->
                        <div class="col-span-12">
                            <div class="bg-[#141414] border border-[#333] rounded-xl p-6 relative overflow-hidden">
                                <div class="absolute top-0 right-0 p-4 opacity-5">
                                    <i class="fa-solid fa-bolt text-6xl"></i>
                                </div>
                                <h3 class="text-xl font-bold text-white mb-4 relative z-10 flex items-center gap-2">
                                    <i class="fa-solid fa-crosshairs text-zenix-green"></i>
                                    Filtros de Ataque (Sinal de Entrada)
                                </h3>
                                
                                <div class="space-y-4 relative z-10">
                                    <div v-if="form.attackFilters.length === 0" class="p-4 bg-[#1E1E1E] border border-dashed border-[#444] rounded-lg text-center">
                                        <p class="text-gray-400 text-sm mb-3">Nenhum filtro de ataque configurado. O robô entrará em cada sinal disponível.</p>
                                        <button 
                                            type="button" 
                                            @click="openFilterModal('main')"
                                            class="bg-zenix-green/10 text-zenix-green border border-zenix-green/30 px-6 py-2 rounded-lg hover:bg-zenix-green/20 transition-all font-bold text-sm"
                                        >
                                            Configurar Filtros
                                        </button>
                                    </div>
                                    
                                    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div v-for="filter in form.attackFilters" :key="filter.id" class="p-4 bg-[#1E1E1E] border border-[#333] rounded-lg flex items-center justify-between">
                                            <div>
                                                <span class="block text-white font-bold text-sm">{{ filter.name }}</span>
                                                <span class="text-[10px] text-gray-400">Ativo • Configurado</span>
                                            </div>
                                            <button type="button" @click="openFilterModal('main')" class="text-gray-500 hover:text-white transition-colors">
                                                <i class="fa-solid fa-gear"></i>
                                            </button>
                                        </div>
                                        <button 
                                            v-if="form.attackFilters.length < 2"
                                            type="button" 
                                            @click="openFilterModal('main')"
                                            class="p-4 border border-dashed border-[#444] rounded-lg flex items-center justify-center gap-2 text-gray-500 hover:text-white hover:border-gray-500 transition-all"
                                        >
                                            <i class="fa-solid fa-plus text-xs"></i>
                                            <span class="text-sm">Adicionar Segundo Filtro</span>
                                        </button>
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
                                <h3 class="text-xl font-bold text-white mb-4 relative z-10 flex items-center justify-between gap-2">
                                    <div class="flex items-center gap-2">
                                        <i class="fa-solid fa-shield-heart text-zenix-green"></i>
                                        Configuração de Recuperação
                                    </div>
                                    <label class="relative inline-flex items-center cursor-pointer scale-90">
                                        <input type="checkbox" v-model="recoveryConfig.enabled" class="sr-only peer">
                                        <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zenix-green"></div>
                                        <span class="ms-3 text-xs font-bold text-gray-400 uppercase tracking-tighter">{{ recoveryConfig.enabled ? 'Ativa' : 'Inativa' }}</span>
                                    </label>
                                </h3>
                                
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10" :class="{ 'opacity-40 grayscale pointer-events-none': !recoveryConfig.enabled }">
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
                                                <img v-if="selectedRecoveryTradeTypeIcon" :src="selectedRecoveryTradeTypeIcon" class="w-4 h-4 contrast-[1.5] brightness-[1.5]" alt="" />
                                                <span class="font-medium text-sm">{{ selectedRecoveryTradeTypeLabel }}</span>
                                            </div>
                                            <i class="fa-solid fa-chevron-down text-gray-400 text-xs"></i>
                                        </button>
                                    </div>
                                    <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div>
                                            <label class="block text-white font-bold mb-2 text-sm">Perfil de Risco</label>
                                            <div class="relative">
                                                <select 
                                                    v-model="form.riskProfile" 
                                                    class="w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg p-3 appearance-none focus:outline-none focus:border-zenix-green transition-colors text-sm"
                                                >
                                                    <option value="conservador">Conservador (0%)</option>
                                                    <option value="moderado">Moderado (15%)</option>
                                                    <option value="agressivo">Agressivo (30%)</option>
                                                </select>
                                                <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                                    <i class="fa-solid fa-chevron-down text-gray-400"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-if="['DIGITOVER', 'DIGITUNDER', 'DIGITMATCH', 'DIGITDIFF'].includes(recoveryConfig.tradeType)">
                                            <label class="block text-white font-bold mb-2 text-sm">Dígito Alvo Rec.</label>
                                            <div class="relative">
                                                <select 
                                                    v-model.number="recoveryConfig.prediction" 
                                                    class="w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg p-3 appearance-none focus:outline-none focus:border-zenix-green transition-colors text-sm"
                                                >
                                                    <option v-for="n in 10" :key="n-1" :value="n-1">{{ n-1 }}</option>
                                                </select>
                                                <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                                    <i class="fa-solid fa-chevron-down text-gray-400"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label class="block text-white font-bold mb-2 text-sm">Perdas para Rec.</label>
                                            <input 
                                                type="number" 
                                                v-model.number="recoveryConfig.lossesToActivate" 
                                                class="w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg p-3 focus:outline-none focus:border-zenix-green transition-colors text-sm"
                                                min="1"
                                            />
                                        </div>
                                        <div class="flex items-end gap-2">
                                             <button 
                                                type="button" 
                                                @click="openFilterModal('recovery')"
                                                class="flex-1 bg-[#2A2A2A] hover:bg-[#333] text-white h-[46px] rounded-lg border border-[#444] font-medium transition-colors flex items-center justify-center gap-2 text-xs"
                                            >
                                                <i class="fa-solid fa-filter"></i> Filtros
                                            </button>
                                             <button 
                                                type="button" 
                                                @click="showPauseModal = true"
                                                class="flex-1 bg-[#2A2A2A] hover:bg-[#333] text-white h-[46px] rounded-lg border border-[#444] font-medium transition-colors flex items-center justify-center gap-2 text-xs"
                                            >
                                                <i class="fa-solid fa-pause"></i> Pausa
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Valores Monetários -->
                        <div class="col-span-12">
                            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                                            v-model.number="form.profitTarget" 
                                            class="w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg py-3 pl-8 pr-4 focus:outline-none focus:border-zenix-green transition-colors"
                                            step="0.01"
                                        />
                                    </div>
                                    <p class="mt-1 text-zenix-green text-xs font-bold">{{ calculatePercentage(form.profitTarget) }}% do saldo</p>
                                </div>
                                <div>
                                    <div class="flex justify-between items-center mb-2">
                                        <label class="block text-white font-bold">Limite de perda</label>
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
                                <div>
                                    <div class="flex justify-between items-center mb-2">
                                        <label class="block text-white font-bold">Stop Blindado</label>
                                    </div>
                                    <div class="flex items-center gap-4 bg-[#1E1E1E] border border-[#333] rounded-lg p-2 h-[50px]">
                                        <div 
                                            class="w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-300"
                                            :class="form.useBlindado ? 'bg-zenix-green' : 'bg-gray-600'"
                                            @click="form.useBlindado = !form.useBlindado"
                                        >
                                            <div 
                                                class="w-3 h-3 rounded-full bg-white absolute top-1 transition-all duration-300"
                                                :style="{ left: form.useBlindado ? 'calc(100% - 1rem)' : '0.25rem' }"
                                            ></div>
                                        </div>
                                        <div v-if="form.useBlindado" class="flex flex-1 items-center gap-2">
                                            <select v-model.number="form.stopBlindadoPercent" class="bg-transparent text-zenix-green text-sm font-bold border-none p-0 focus:ring-0">
                                                <option value="30">30%</option>
                                                <option value="50">50%</option>
                                                <option value="70">70%</option>
                                            </select>
                                            <span class="text-[10px] text-gray-500 uppercase">Piso</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Submit Button -->
                        <div class="col-span-12 pt-6">
                            <button 
                                type="button" 
                                @click="handleStartClick"
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

        <!-- Account Selection Modal -->
        <Teleport to="body">
            <div 
                v-if="showAccountModal" 
                class="modal-overlay" 
                @click.self="showAccountModal = false"
            >
                <div class="modal-content" style="max-width: 500px">
                    <div class="modal-header">
                        <h3 class="modal-title font-bold text-white">Selecionar Conta</h3>
                        <button @click="showAccountModal = false" class="modal-close-btn">
                            <i class="fa-solid fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div v-if="isLoadingAccounts" class="flex flex-col items-center justify-center py-10 gap-4">
                            <div class="w-10 h-10 border-4 border-zenix-green/30 border-t-zenix-green rounded-full animate-spin"></div>
                            <p class="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Carregando contas disponíveis...</p>
                        </div>
                        <div v-else-if="availableAccounts.length === 0" class="text-center py-10">
                            <i class="fa-solid fa-triangle-exclamation text-yellow-500 text-3xl mb-4"></i>
                            <p class="text-white font-bold uppercase">Nenhuma conta encontrada</p>
                            <p class="text-gray-400 text-xs mt-2 font-bold uppercase">Certifique-se de que você está conectado à Deriv.</p>
                        </div>
                        <div v-else class="space-y-3">
                            <p class="text-xs text-gray-500 mb-4 font-bold uppercase tracking-widest">Escolha a conta para iniciar as operações:</p>
                            <div 
                                v-for="account in availableAccounts" 
                                :key="account.loginid"
                                @click="selectAccount(account)"
                                class="p-4 rounded-xl border border-[#333] bg-[#111] hover:border-zenix-green hover:bg-zenix-green/5 transition-all cursor-pointer group flex items-center justify-between"
                            >
                                <div class="flex items-center gap-4">
                                    <div 
                                        class="w-10 h-10 rounded-full flex items-center justify-center border border-[#333]"
                                        :class="account.isDemo ? 'bg-orange-500/10 text-orange-500' : 'bg-zenix-green/10 text-zenix-green'"
                                    >
                                        <i class="fa-solid" :class="account.isDemo ? 'fa-vial' : 'fa-dollar-sign'"></i>
                                    </div>
                                    <div>
                                        <div class="text-white font-bold">{{ account.loginid }}</div>
                                        <div class="text-[10px] uppercase font-bold" :class="account.isDemo ? 'text-orange-500' : 'text-zenix-green'">
                                            {{ account.isDemo ? 'Conta Demo' : 'Conta Real' }}
                                        </div>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="text-white font-bold tracking-tight">{{ account.currency }} {{ account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</div>
                                    <div class="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Saldo Disponível</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Teleport>

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
                            <div v-for="(marketsList, category) in marketsByCategory" :key="category" class="category-card">
                                <div class="category-card-header">
                                    <div class="category-icon-wrapper">
                                        <svg v-if="category === 'Índices Contínuos' || category === 'Continuous Indices'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M22 11L13.5 15.5L8.5 10.5L2 14" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M16 11H22V17" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        <svg v-else-if="category === 'Criptomoedas'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2.5"/>
                                            <path d="M9 12H15M12 9V15" stroke="#FF444F" stroke-width="2.5" stroke-linecap="round"/>
                                        </svg>
                                        <svg v-else-if="category === 'Forex Majors' || category === 'Minor Pairs' || category === 'Major Pairs'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2.5"/>
                                            <path d="M12 7V17M15 12H9" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round"/>
                                        </svg>
                                        <svg v-else-if="category === 'Metais'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 4L18 4L21 9L12 21L3 9L6 4Z" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M3 9H21" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M12 21V9" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        <i v-else class="fa-solid fa-bars text-white"></i>
                                    </div>
                                    <h4 class="category-card-title">{{ category }}</h4>
                                </div>
                                <div class="category-items-list">
                                    <button
                                        v-for="m in marketsList"
                                        :key="m.value"
                                        @click="selectMarket(m.value)"
                                        :class="['category-item-btn', { 'active': (modalContext === 'main' ? form.market : recoveryConfig.market) === m.value }]"
                                    >
                                        {{ m.label }}
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
                                            <path d="M16 11H22V17" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        <svg v-else-if="category.id === 'daily_reset_indices' || category.id === 'Índices Daily Reset'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2V22" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                                            <path d="M17 7L12 2L7 7" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M17 17L12 22L7 17" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        <svg v-else-if="category.id === 'digits'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4 9H20" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M4 15H20" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M10 3L8 21" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M16 3L14 21" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        <svg v-else-if="category.id === 'accumulators'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M2 17L12 22L22 17" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M2 12L12 17L22 12" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        <svg v-else-if="category.id === 'multipliers'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2.5"/>
                                            <path d="M15 9L9 15M9 9L15 15" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round"/>
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
                                        :class="['category-item-btn', { 'active': (modalContext === 'main' ? form.tradeType : recoveryConfig.tradeType) === item.value }]"
                                    >
                                        <div class="flex items-center gap-2">
                                            <div class="w-5 h-5 flex items-center justify-center text-zenix-green">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                                    <path d="M22 11L13.5 15.5L8.5 10.5L2 14"/>
                                                    <path d="M16 11H22V17"/>
                                                </svg>
                                            </div>
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

        <!-- Advanced Filter Modal -->
        <Teleport to="body">
            <div v-if="showFilterModal" class="modal-overlay" @click.self="showFilterModal = false">
                <div class="modal-content categorized-modal" style="max-width: 600px">
                    <div class="modal-header">
                        <div class="flex items-center gap-3">
                            <button v-if="filterStep === 2" @click="prevFilterStep" class="text-gray-400 hover:text-white transition-colors">
                                <i class="fa-solid fa-arrow-left"></i>
                            </button>
                            <h3 class="modal-title font-bold text-white">{{ filterStep === 1 ? (modalContext === 'main' ? 'Selecionar Filtros de Ataque' : 'Selecionar Filtros de Recuperação') : 'Configurar Filtros' }}</h3>
                        </div>
                        <button @click="showFilterModal = false" class="modal-close-btn">
                            <i class="fa-solid fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body custom-scrollbar" style="max-height: 70vh; overflow-y: auto;">
                        <!-- Step 1: Selection -->
                         <div v-if="filterStep === 1" class="space-y-4">
                            <p class="text-sm text-gray-400 mb-4 px-1">Selecione até 2 filtros para as entradas de {{ modalContext === 'main' ? 'ataque' : 'recuperação' }}.</p>
                            <div class="grid grid-cols-1 gap-3">
                                <div 
                                    v-for="filter in activeFiltersForModal" 
                                    :key="filter.id" 
                                    @click="toggleFilter(filter)"
                                    class="p-4 rounded-xl border transition-all cursor-pointer group"
                                    :class="[
                                        filter.active ? 'border-zenix-green bg-zenix-green/5' : 'border-[#333] bg-[#111] hover:border-[#444]',
                                        !filter.active && activeFiltersForModal.filter(f => f.active).length >= 2 ? 'opacity-50 cursor-not-allowed' : ''
                                    ]"
                                >
                                    <div class="flex items-center gap-3 mb-2">
                                        <div 
                                            class="w-5 h-5 rounded border flex items-center justify-center transition-colors"
                                            :class="filter.active ? 'bg-zenix-green border-zenix-green text-black' : 'border-[#444] group-hover:border-gray-500'"
                                        >
                                            <i v-if="filter.active" class="fa-solid fa-check text-[10px]"></i>
                                        </div>
                                        <span class="text-white font-bold">{{ filter.name }}</span>
                                    </div>
                                    <p class="text-xs text-gray-500 pl-8 leading-relaxed">{{ filter.desc }}</p>
                                </div>
                            </div>
                            <div class="mt-8">
                                <button 
                                    @click="nextFilterStep" 
                                    class="w-full bg-zenix-green hover:bg-green-600 shadow-lg shadow-green-500/10 text-black font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all"
                                >
                                    <span>Continuar para Configuração</span>
                                    <i class="fa-solid fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Step 2: Configuration -->
                        <div v-else class="space-y-6 animate-fadeIn">
                            <div v-for="filter in activeFiltersForModal.filter(f => f.active)" :key="filter.id" class="p-6 bg-[#0B0B0B] border border-[#333] rounded-xl space-y-4">
                                <div class="flex items-center gap-2 border-b border-[#222] pb-3 mb-4">
                                    <i class="fa-solid fa-gear text-zenix-green text-xs"></i>
                                    <h4 class="text-white font-bold">{{ filter.name }}</h4>
                                </div>

                                <!-- Digit Density Config -->
                                <div v-if="filter.id === 'digit_density'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Janela (Ticks/Dígitos)</label>
                                        <input type="number" v-model.number="filter.config.window" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Dígitos Alvo (Sep. por vírgula)</label>
                                        <input type="text" v-model="filter.config.digits" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Operador</label>
                                        <select v-model="filter.config.operator" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none">
                                            <option value="<">Menor que (&lt;)</option>
                                            <option value=">">Maior que (&gt;)</option>
                                            <option value="=">Igual a (=)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Quantidade Limite</label>
                                        <input type="number" v-model.number="filter.config.threshold" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                </div>

                                <!-- Digit Sequence Config -->
                                <div v-if="filter.id === 'digit_sequence'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Tamanho da Sequência</label>
                                        <input type="number" v-model.number="filter.config.length" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Grupo Alvo</label>
                                        <select v-model="filter.config.target" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none">
                                            <option value="under_4">Abaixo de 4 (0,1,2,3)</option>
                                            <option value="over_5">Acima de 5 (6,7,8,9)</option>
                                            <option value="even">Pares</option>
                                            <option value="odd">Ímpares</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Parity Majority Config -->
                                <div v-if="filter.id === 'parity_majority'" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Janela</label>
                                        <input type="number" v-model.number="filter.config.window" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">% Mínima</label>
                                        <input type="number" v-model.number="filter.config.percentage" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Máx. Ruído</label>
                                        <input type="number" v-model.number="filter.config.maxNoise" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                </div>

                                <!-- Price Momentum Config -->
                                <div v-if="filter.id === 'price_momentum'" class="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Janela</label>
                                        <input type="number" v-model.number="filter.config.window" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Tiques Conf.</label>
                                        <input type="number" v-model.number="filter.config.ticksToConfirm" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Delta Mín.</label>
                                        <input type="number" v-model.number="filter.config.minDelta" step="0.01" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                </div>
                            </div>

                            <button @click="saveFilters" class="w-full bg-zenix-green hover:bg-green-600 shadow-xl shadow-green-500/5 text-black font-bold py-4 rounded-lg flex items-center justify-center gap-2 mt-8 transition-all">
                                <i class="fa-solid fa-circle-check"></i>
                                Salvar Filtros Selecionados
                            </button>
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
                                        v-model.number="recoveryConfig.pauseVolatility"
                                        placeholder="Ex: 50" 
                                        class="w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg p-3 focus:outline-none focus:border-zenix-green transition-colors"
                                    />
                                </div>
                                <div>
                                    <label class="block text-xs text-gray-400 mb-1">Tempo (minutos)</label>
                                    <input 
                                        type="number"
                                        v-model.number="recoveryConfig.pauseTime"
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
import { StrategyAnalysis } from '../../utils/StrategyAnalysis';
import apolloConfig from '@/utils/strategies/apollo.json';
import atlasConfig from '@/utils/strategies/atlas.json';
import nexusConfig from '@/utils/strategies/nexus.json';
import orionConfig from '@/utils/strategies/orion.json';
import titanConfig from '@/utils/strategies/titan.json';
import { RiskManager } from '../../utils/RiskManager';

const defaultStrategies = [apolloConfig, atlasConfig, nexusConfig, orionConfig, titanConfig];

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
            showAccountModal: false,
            isLoadingAccounts: false,
            availableAccounts: [],
            selectedToken: null,
            savedStrategies: [],
            selectedSavedStrategyId: '',
            recoveryFilters: [],
            modalContext: 'main', // 'main' or 'recovery'
            filterStep: 1, // 1: Selection, 2: Configuration

            markets: [],
            contracts: [],
            
            form: {
                initialStake: 0.35,
                profitTarget: 10,
                stopLoss: 50,
                riskProfile: 'moderado', // 'conservador', 'moderado', 'agressivo'
                useBlindado: false,
                stopBlindadoPercent: 50,
                duration: 1,
                durationUnit: 't',
                market: 'R_100',
                tradeType: null,
                prediction: 0, 
                sorosLevel: 1,
                attackFilters: []
            },

            // Strategy Execution State
            sessionState: {
                analysisType: 'PRINCIPAL', // 'PRINCIPAL' | 'RECUPERACAO'
                isRecoveryMode: false, // Legacy support, synced with analysisType
                consecutiveLosses: 0,
                consecutiveWins: 0,
                totalLossAccumulated: 0,
                recoveredAmount: 0,
                lastPayoutPrincipal: 0.95,
                lastPayoutRecovery: 0.95,
                lastProfit: 0,
                lastStake: 0,
                lastProfitPrincipal: 0,
                lastStakePrincipal: 0,
                lastProfitRecovery: 0,
                lastStakeRecovery: 0,
                lastResultWin: false,
                lastContractType: '',
                negotiationMode: 'VELOZ', // 'VELOZ' | 'NORMAL' | 'PRECISO'
                activeStrategy: 'PRINCIPAL', // 'PRINCIPAL' | 'RECUPERACAO' (Filters/Contracts)
                skipSorosNext: false,
                lossStreakRecovery: 0,
                peakProfit: 0,
                stopBlindadoActive: false,
                stopBlindadoFloor: 0,
                isStopped: false
            },
            
            // Internal State
            isNegotiating: false,
            retryingProposal: false,
            
            recoveryConfig: {
                enabled: true,
                market: '',
                selectedTradeTypeGroup: '',
                tradeType: '',
                prediction: 0,
                lossesToActivate: 1, // Default changed to 1 for immediate recovery (User Preference)
                contractSwitch: true,
                switchToNormal: false,
                switchToPrecise: true,
                maxPreciseLosses: 3,
                pauseLosses: 6,
                pauseVolatility: 50,
                pauseTime: 5,
                attackFilters: []
            },
            recoveryContracts: [],
            isFetchingContracts: false,

            // WebSocket Tick & Trade Monitoring
            ws: null,
            tickSubscriptionId: null,
            tickCount: 0,
            lastTickPrice: null,
            tickHistory: [], // Buffer for Price Momentum
            digitHistory: [], // Buffer for Digit Density/Sequence/Majority
            isAuthorized: false,
            activeContracts: new Map(), // To track multiple overlapping trades if any

            balance: 5889.28, // Mock implementation or fetch from store
            isMonitoring: false,
            activeMonitoringTab: 'logs',
            pendingFastResult: { contractId: null, barrier: null, contractType: null, active: false, stake: 0 },
            monitoringStats: {
                balance: 5889.28,
                profit: 0,
                wins: 0,
                losses: 0,
                status: 'Aguardando sinal...',
                statusDesc: 'Analisando condições de mercado'
            },
            monitoringLogs: [],
            logCounter: 0,
            monitoringOperations: [],
            simulationInterval: null,
            filters: [
                { 
                    id: 'digit_density', 
                    name: 'Densidade de Dígitos (Apollo)', 
                    active: false, 
                    type: 'digit',
                    desc: 'Analisa a frequência de dígitos específicos numa janela.',
                    config: { window: 20, digits: '8,9', operator: '<', threshold: 5 }
                },
                { 
                    id: 'digit_sequence', 
                    name: 'Sequência de Dígitos (Orion)', 
                    active: false, 
                    type: 'digit',
                    desc: 'Busca sequências de dígitos (Par, Ímpar, <4, etc).',
                    config: { length: 3, target: 'under_4' }
                },
                { 
                    id: 'parity_majority', 
                    name: 'Maioria de Paridade (Titan)', 
                    active: false, 
                    type: 'digit',
                    desc: 'Exige que um lado (Par/Ímpar) domine a janela.',
                    config: { window: 24, percentage: 60, maxNoise: 8 }
                },
                { 
                    id: 'price_momentum', 
                    name: 'Momentum de Preço (Nexus)', 
                    active: false, 
                    type: 'price',
                    desc: 'Analisa a força e direção dos tiques de preço.',
                    config: { window: 10, ticksToConfirm: 2, minDelta: 0.1 }
                }
            ],
            // Hardcoded Category Data (Expanded for Specific Contracts)
            tradeTypeCategories: [
                {
                    id: 'rising_falling',
                    label: 'Sobe / Desce',
                    icon: 'fas fa-chart-line',
                    items: [
                        { value: 'CALL', label: 'Sobe (Call)', icon: 'TradeTypesRiseFallIcon.svg' },
                        { value: 'PUT', label: 'Desce (Put)', icon: 'TradeTypesRiseFallIcon.svg' },
                        { value: 'CALLE', label: 'Sobe Igual (CallE)', icon: 'TradeTypesRiseFallEqualIcon.svg' },
                        { value: 'PUTE', label: 'Desce Igual (PutE)', icon: 'TradeTypesRiseFallEqualIcon.svg' }
                    ]
                },
                {
                    id: 'even_odd',
                    label: 'Par / Ímpar',
                    icon: 'fas fa-sort-numeric-up',
                    items: [
                        { value: 'DIGITEVEN', label: 'Par', icon: 'TradeTypesEvenOddIcon.svg' },
                        { value: 'DIGITODD', label: 'Ímpar', icon: 'TradeTypesEvenOddIcon.svg' }
                    ]
                },
                {
                    id: 'over_under',
                    label: 'Acima / Abaixo',
                    icon: 'fas fa-arrow-up',
                    items: [
                        { value: 'DIGITOVER', label: 'Acima (Over)', icon: 'TradeTypesOverUnderIcon.svg' },
                        { value: 'DIGITUNDER', label: 'Abaixo (Under)', icon: 'TradeTypesOverUnderIcon.svg' }
                    ]
                },
                {
                    id: 'match_diff',
                    label: 'Combina / Difere',
                    icon: 'fas fa-check-double',
                    items: [
                        { value: 'DIGITMATCH', label: 'Combina (Match)', icon: 'TradeTypesMatchDiffIcon.svg' },
                        { value: 'DIGITDIFF', label: 'Difere (Diff)', icon: 'TradeTypesMatchDiffIcon.svg' }
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
        selectedTradeTypeLabel() {
            if (!this.form.tradeType) return 'Selecionar';
            // Search manually since flatMap might not be available or compatible in all envs without polyfill
            for (const cat of this.tradeTypeCategories) {
                for (const item of cat.items) {
                    if (item.value === this.form.tradeType) {
                        return `${cat.label} - ${item.label}`;
                    }
                }
            }
            return this.form.tradeType;
        },
        selectedTradeTypeIcon() {
            if (!this.form.tradeType) return null;
            
            for (const cat of this.tradeTypeCategories) {
                const item = cat.items.find(i => i.value === this.form.tradeType);
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
                    if (contextContracts.includes(item.value.toUpperCase())) return true;
                    if (item.directions) {
                         return item.directions.some(dir => contextContracts.includes(dir.value.toUpperCase()));
                    }
                    return false;
                });
                if (filteredItems.length > 0) return { ...category, items: filteredItems };
                return null;
              }).filter(Boolean);
        },
        activeFiltersForModal() {
            return this.modalContext === 'main' ? this.filters : this.recoveryFilters;
        },
        selectedRecoveryTradeTypeLabel() {
            if (!this.recoveryConfig.tradeType) return 'Selecionar';
            for (const cat of this.tradeTypeCategories) {
                const item = cat.items.find(i => i.value === this.recoveryConfig.tradeType);
                if (item) return `${cat.label} - ${item.label}`;
            }
            return this.recoveryConfig.tradeType;
        },
        selectedRecoveryTradeTypeIcon() {
            if (!this.recoveryConfig.tradeType) return null;
            for (const cat of this.tradeTypeCategories) {
                const item = cat.items.find(i => i.value === this.recoveryConfig.tradeType);
                if (item && item.icon) return `/deriv_icons/${item.icon}`;
            }
            return null;
        }
    },
    mounted() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
        this.fetchMarkets();
        this.loadStrategiesFromStorage();
        // Initialize recovery filters as a clone of main filters
        this.recoveryFilters = JSON.parse(JSON.stringify(this.filters));
        this.onMarketChange('main');
        this.onMarketChange('recovery');
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
            
            this.isFetchingContracts = true;
            try {
                const token = localStorage.getItem('token');
                const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                
                const res = await fetch(`${apiBaseUrl}/markets/${market}/contracts`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

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
            } finally {
                this.isFetchingContracts = false;
            }
        },
        // Filter Management Methods
        openFilterModal(context = 'main') {
            this.modalContext = context;
            this.filterStep = 1;
            this.showFilterModal = true;
        },
        toggleFilter(filter) {
            if (filter.active) {
                filter.active = false;
                return;
            }

            const targetArray = this.modalContext === 'main' ? this.filters : this.recoveryFilters;
            const activeCount = targetArray.filter(f => f.active).length;
            if (activeCount >= 2) {
                this.$root.$toast.warning('Selecione no máximo 2 filtros.');
                return;
            }

            filter.active = true;
        },
        nextFilterStep() {
            const sourceArray = this.modalContext === 'main' ? this.filters : this.recoveryFilters;
            const activeCount = sourceArray.filter(f => f.active).length;
            if (activeCount === 0) {
                this.$root.$toast.warning('Selecione pelo menos 1 filtro para configurar.');
                return;
            }
            this.filterStep = 2;
        },
        prevFilterStep() {
            this.filterStep = 1;
        },
        saveFilters() {
            const target = this.modalContext === 'main' ? this.form : this.recoveryConfig;
            const sourceArray = this.modalContext === 'main' ? this.filters : this.recoveryFilters;
            
            // Persist the active filters to the target object
            target.attackFilters = sourceArray
                .filter(f => f.active)
                .map(f => ({
                    id: f.id,
                    name: f.name,
                    config: JSON.parse(JSON.stringify(f.config))
                }));
            
            console.log(`[saveFilters] Saved ${target.attackFilters.length} filters for context ${this.modalContext}`);
            
            this.showFilterModal = false;
            this.$root.$toast.success('Filtros configurados com sucesso!');
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
            
            const market = this.markets.find(m => m.symbol === symbol);
            this.$root.$toast.success(`Mercado selecionado: ${market ? market.label : symbol}`);
            
            this.closeMarketModal();
            this.onMarketChange(this.modalContext);
        },
        openTradeTypeModal(context = 'main') {
            const contracts = context === 'main' ? this.contracts : this.recoveryContracts;
            
            if (this.isFetchingContracts) {
                this.$root.$toast.info('Carregando contratos... Por favor, aguarde.');
                return;
            }

            if (!contracts.length) {
                this.$root.$toast.warning('Selecione um mercado válido primeiro.');
                return;
            }

            this.modalContext = context;
            this.showTradeTypeModal = true;
        },
        closeTradeTypeModal() {
            this.showTradeTypeModal = false;
        },
        selectTradeType(item) {
            // Find the category to set the group correctly
            let categoryId = '';
            for (const cat of this.tradeTypeCategories) {
                if (cat.items.find(i => i.value === item.value)) {
                    categoryId = cat.id;
                    break;
                }
            }

            if (this.modalContext === 'main') {
                this.form.tradeType = item.value;
                this.form.selectedTradeTypeGroup = categoryId;
            } else {
                this.recoveryConfig.tradeType = item.value;
                this.recoveryConfig.selectedTradeTypeGroup = categoryId;
            }
            
            this.$root.$toast.success(`Tipo de contrato selecionado: ${item.label}`);
            this.closeTradeTypeModal();
        },
        
        calculatePercentage(value) {
            if (!value || !this.balance) return '0.00';
            return ((value / this.balance) * 100).toFixed(2);
        },
        
        getDerivToken() {
            try {
                // 1. Tentar loginid ativo
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
                
                // 2. Fallback para deriv_token padrão
                const defaultToken = localStorage.getItem('deriv_token');
                return defaultToken ? defaultToken.trim() : null;
            } catch (e) {
                console.error('[StrategyCreator] Erro ao obter token:', e);
                return null;
            }
        },
        async handleStartClick() {
             this.isLoadingAccounts = true;
             this.showAccountModal = true;
             this.availableAccounts = [];
             
             try {
                 const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
                 const userToken = localStorage.getItem('token');
                 
                 if (!userToken) {
                     this.$root.$toast.error('Sessão expirada. Faça login novamente.');
                     return;
                 }

                 const response = await fetch(`${apiBase}/settings`, {
                     headers: {
                         'Authorization': `Bearer ${userToken}`,
                         'Content-Type': 'application/json'
                     }
                 });

                 if (!response.ok) throw new Error('Falha ao buscar configurações do backend');

                 const data = await response.json();
                 const accounts = [];

                 // Adicionar Conta Real se existir token
                 if (data.tokenReal) {
                     accounts.push({
                         loginid: data.idRealAccount || 'Conta Real',
                         token: data.tokenReal,
                         balance: Number(data.realAmount) || 0,
                         currency: data.tokenRealCurrency || 'USD',
                         isDemo: false
                     });
                 }

                 // Adicionar Conta Demo se existir token
                 if (data.tokenDemo) {
                     accounts.push({
                         loginid: data.idDemoAccount || 'Conta Demo',
                         token: data.tokenDemo,
                         balance: Number(data.demoAmount) || 0,
                         currency: data.tokenDemoCurrency || 'USD',
                         isDemo: true
                     });
                 }

                 this.availableAccounts = accounts;

                 if (accounts.length === 0) {
                     console.warn('[StrategyCreator] Nenhuma conta com token encontrada no backend');
                 }
             } catch (error) {
                 console.error('[StrategyCreator] Erro ao carregar contas do backend:', error);
                 this.$root.$toast.error('Erro ao conectar com o servidor. Tente novamente.');
             } finally {
                 this.isLoadingAccounts = false;
             }
        },
        selectAccount(account) {
            this.selectedToken = account.token;
            const balanceValue = Number(account.balance);
            this.balance = balanceValue;
            this.monitoringStats.balance = balanceValue;
            this.showAccountModal = false;
            this.submitForm();
        },
        submitForm() {
            if (!this.selectedToken) {
                this.handleStartClick();
                return;
            }
            this.isMonitoring = true;
            this.startSimulation();
            this.$root.$toast.success('Estratégia iniciada com sucesso!');
        },

        // --- Local Strategy Library Methods ---
        loadStrategiesFromStorage() {
            try {
                const stored = localStorage.getItem('zeenix_saved_strategies');
                let userStrategies = stored ? JSON.parse(stored) : [];

                // Merge default strategies
                defaultStrategies.forEach(def => {
                    const index = userStrategies.findIndex(s => s.id === def.id);
                    if (index !== -1) {
                        // Update existing default strategy
                        userStrategies[index] = def;
                    } else {
                        // Add new default strategy
                        userStrategies.push(def);
                    }
                });

                this.savedStrategies = userStrategies;
            } catch (e) {
                console.error('Erro ao carregar estratégias:', e);
                this.savedStrategies = [...defaultStrategies];
            }
        },

        saveCurrentStrategy() {
            const name = prompt('Nome da estratégia:', `Minha Estratégia ${new Date().toLocaleDateString()}`);
            if (!name) return;

            const newStrategy = {
                id: Date.now().toString(),
                name: name,
                config: {
                    form: JSON.parse(JSON.stringify(this.form)),
                    recoveryConfig: JSON.parse(JSON.stringify(this.recoveryConfig))
                }
            };

            this.savedStrategies.push(newStrategy);
            localStorage.setItem('zeenix_saved_strategies', JSON.stringify(this.savedStrategies));
            this.selectedSavedStrategyId = newStrategy.id;
            this.$root.$toast.success('Estratégia salva com sucesso!');
        },

        loadSavedStrategy() {
            const strategy = this.savedStrategies.find(s => s.id === this.selectedSavedStrategyId);
            if (!strategy) return;

            // Deep clone to avoid proxy issues
            this.form = JSON.parse(JSON.stringify(strategy.config.form));
            this.recoveryConfig = JSON.parse(JSON.stringify(strategy.config.recoveryConfig));
            
            // Restore filters active state for main
            this.filters.forEach(f => {
                const active = this.form.attackFilters.find(af => af.id === f.id);
                f.active = !!active;
                if (active) f.config = { ...active.config };
            });

            // Restore filters active state for recovery
            this.recoveryFilters.forEach(f => {
                const active = this.recoveryConfig.attackFilters.find(af => af.id === f.id);
                f.active = !!active;
                if (active) f.config = { ...active.config };
            });

            this.addLog(`📂 Estratégia carregada: ${strategy.name}`, 'info');
            this.$root.$toast.success(`Estratégia "${strategy.name}" carregada!`);
        },

        updateCurrentStrategy() {
            if (!this.selectedSavedStrategyId) return;
            const strategy = this.savedStrategies.find(s => s.id === this.selectedSavedStrategyId);
            if (!strategy) return;

            strategy.config = {
                form: JSON.parse(JSON.stringify(this.form)),
                recoveryConfig: JSON.parse(JSON.stringify(this.recoveryConfig))
            };

            localStorage.setItem('zeenix_saved_strategies', JSON.stringify(this.savedStrategies));
            this.$root.$toast.success('IA Atualizada com sucesso!');
        },

        deleteSavedStrategy() {
            if (!confirm('Tem certeza que deseja excluir esta estratégia?')) return;
            
            this.savedStrategies = this.savedStrategies.filter(s => s.id !== this.selectedSavedStrategyId);
            localStorage.setItem('zeenix_saved_strategies', JSON.stringify(this.savedStrategies));
            this.selectedSavedStrategyId = '';
            this.$root.$toast.info('Estratégia excluída.');
        },

        exportToJSON() {
            const strategyData = {
                version: '1.0',
                timestamp: new Date().toISOString(),
                config: {
                    form: this.form,
                    recoveryConfig: this.recoveryConfig
                }
            };

            const json = JSON.stringify(strategyData, null, 4);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `zeenix-estrategia-${Date.now()}.json`;
            link.click();
            
            URL.revokeObjectURL(url);
            this.$root.$toast.success('Arquivo JSON gerado e baixado!');
        },

        handleImportJSON(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (data.config && data.config.form && data.config.recoveryConfig) {
                        this.form = JSON.parse(JSON.stringify(data.config.form));
                        this.recoveryConfig = JSON.parse(JSON.stringify(data.config.recoveryConfig));
                        
                        // Sync filter active states
                        this.filters.forEach(f => {
                            const active = this.form.attackFilters.find(af => af.id === f.id);
                            f.active = !!active;
                            if (active) f.config = { ...active.config };
                        });
                        this.recoveryFilters.forEach(f => {
                            const active = this.recoveryConfig.attackFilters.find(af => af.id === f.id);
                            f.active = !!active;
                            if (active) f.config = { ...active.config };
                        });

                        this.addLog('📁 Estratégia importada com sucesso de arquivo.', 'success');
                        this.$root.$toast.success('Estratégia importada com sucesso!');
                    } else {
                        throw new Error('Formato de arquivo inválido.');
                    }
                } catch (err) {
                    this.$root.$toast.error('Erro ao importar JSON: ' + err.message);
                }
            };
            reader.readAsText(file);
            event.target.value = ''; // Reset input
        },
        startSimulation() {
            // Zeus-style Initial Logs
            const mode = this.sessionState.negotiationMode;
            const profile = this.form.riskProfile || 'MODERADO';
            
            const configLog = `⚙️ CONFIGURAÇÃO INICIAL<br>` +
                `• Agente: ZEUS (Strategy Creator)<br>` +
                `• Modo: ${mode}<br>` +
                `• Perfil: ${profile.toUpperCase()}<br>` +
                `• Meta Lucro: $${this.form.profitTarget.toFixed(2)}<br>` +
                `• Stop Loss: $${this.form.stopLoss.toFixed(2)}<br>` +
                `• Stop Blindado: ${this.form.useBlindado ? 'ATIVO 🛡️' : 'INATIVO ❌'}`;
            
            this.addLog(configLog, 'info');

            const sessionLog = `🚀 INICIANDO SESSÃO DE OPERAÇÕES<br>` +
                `• Banca Inicial: $${this.balance.toFixed(2)}<br>` +
                `• Meta do Dia: +$${this.form.profitTarget.toFixed(2)}<br>` +
                `• Stop Loss: -$${this.form.stopLoss.toFixed(2)}<br>` +
                `• Modo Inicial: ${mode}`;

            this.addLog(sessionLog, 'info');
            
            // Iniciar Monitoramento de Ticks Real-time
            this.initTickConnection();
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
                this.addLog(`🔌 Conectado. Autorizando...`, 'info');
                const token = this.selectedToken || this.getDerivToken();
                
                if (token) {
                    console.log('[WS] Enviando token de autorização Deriv...');
                    this.ws.send(JSON.stringify({ authorize: token }));
                } else {
                    console.warn('[WS] Token Deriv não encontrado!');
                    this.addLog('⚠️ Token Deriv não encontrado. Operações reais desativadas.', 'warning');
                    this.subscribeTicks();
                }
            };

            this.ws.onmessage = (event) => {
                try {
                    const msg = JSON.parse(event.data);
                    
                    // Debug Log for Critical Messages
                    if (['authorize', 'buy', 'proposal', 'proposal_open_contract'].includes(msg.msg_type) || msg.error) {
                         console.log(`[WS] Mensagem Recebida (${msg.msg_type}):`, msg);
                    }
                    
                    if (msg.msg_type === 'authorize') {
                        if (msg.error) {
                            console.error('[WS] Erro na autorização:', msg.error);
                            this.addLog(`❌ Falha na autorização: ${msg.error.message}`, 'error');
                        } else {
                            this.isAuthorized = true;
                            const balanceValue = Number(msg.authorize.balance);
                            this.balance = balanceValue;
                            this.monitoringStats.balance = balanceValue;
                            console.log('[WS] Autorizado com sucesso! Dados:', msg.authorize);
                            this.addLog(`✅ Autorizado! Saldo: $${balanceValue.toFixed(2)}`, 'success');
                            this.subscribeTicks();
                        }
                    }

                    if (msg.msg_type === 'proposal') {
                        if (msg.error) {
                            this.addLog(`❌ Erro na proposta: ${msg.error.message}`, 'error');
                            this.isNegotiating = false; // Reset lock on error
                        } else {
                            const proposalId = msg.proposal.id;
                            const payout = msg.proposal.payout;
                            const stakeValue = msg.proposal.ask_price;
                            
                            this.addLog(`🔍 Proposta recebida: Payout $${payout} (Stake: $${stakeValue})`, 'info');
                            
                            // 1. Update sessionState with the real PROFIT RATE for accuracy in next calculations
                            // Deriv Payout = Stake + Profit. 
                            // We need Profit Rate = (Payout - Stake) / Stake.
                            const realProfitRate = (payout - stakeValue) / stakeValue;
                            
                            if (this.sessionState.analysisType === 'RECUPERACAO') {
                                this.sessionState.lastPayoutRecovery = realProfitRate;
                            } else {
                                this.sessionState.lastPayoutPrincipal = realProfitRate;
                            }
                            
                            // Normalize Key to match RiskManager
                            const cType = (msg.proposal.contract_type || '').toUpperCase();
                            if (cType) {
                                // Prefix with current mode to separate histories
                                // Prefix with current mode to separate histories
                                const prefix = this.sessionState.analysisType === 'RECUPERACAO' ? 'RECUPERACAO_' : 'PRINCIPAL_';
                                
                                // Append Barrier if this contract has one in the request context
                                // We need to access the CONFIG that generated this proposal to be sure?
                                // Or use msg.proposal.barrier if available? Deriv response usually contains it in 'echo_req'?
                                // msg.echo_req.barrier is reliable.
                                let barrierSuffix = '';
                                if (msg.echo_req.barrier !== undefined) {
                                    barrierSuffix = '_' + msg.echo_req.barrier;
                                }
                                
                                RiskManager.updatePayoutHistory(prefix + cType + barrierSuffix, realProfitRate);
                            }

                            // 2. CHECK IF STAKE ADJUSTMENT IS NEEDED
                            if (this.sessionState.analysisType === 'RECUPERACAO') {
                                const activeStrategy = this.sessionState.activeStrategy === 'RECUPERACAO' ? 'RECUPERACAO' : 'PRINCIPAL';
                                const config = activeStrategy === 'RECUPERACAO' ? this.recoveryConfig : this.form;
                                
                                // Debug: Check if PayoutHistory was updated
                                // console.log('DEBUG PAYOUT:', cType, RiskManager.payoutHistory[cType]);

                                // We manually temporarily inject the just-learned payout history into the calculation
                                // BETTER: We now pass it explicitly to ensure precision regardless of history state
                                const exactStake = RiskManager.calculateNextStake(this.sessionState, config, realProfitRate);
                                
                                // Tolerance check
                                if (Math.abs(exactStake - stakeValue) > 0.02) {
                                    this.addLog(`⚠️ Calibrando Martingale: Payout ${realProfitRate.toFixed(2)}x pede $${exactStake.toFixed(2)} (Era $${stakeValue})`, 'warning');
                                    
                                    // RE-REQUEST PROPOSAL with corrected stake
                                    // Track retries using a request ID based mechanism or simple session state flag (less robust but works for single thread)
                                    // Better: We see the echo_req has 'req_id'. We can skip based on that? No.
                                    // Use a temporary Set of retried proposal IDs to avoid loops if the new proposal also mismatches slightly?
                                    // Or simply check if we just did a retry?
                                    
                                    // Current hack: msg.echo_req.passthrough (if Deriv supports it) or just trust that exactStake calculation is stable.
                                    // Problem: If payout changes AGAIN, we might loop.
                                    // Let's rely on checking if the NEW stake is the same as the PREVIOUS stake we just rejected? No, that's not it.
                                    // We need to know if THIS request was already a correction.
                                    
                                    // Solution: Do not send is_retry to API. Store it in a class property map.
                                    if (!this.retryingProposal) {
                                        this.retryingProposal = true; // Set flag
                                        
                                        const newParams = { ...msg.echo_req, amount: exactStake };
                                        delete newParams.req_id; 
                                        delete newParams.is_retry; // Ensure it's gone
                                        
                                        this.ws.send(JSON.stringify(newParams));
                                        return; // ABORT BUY
                                    } else {
                                        this.retryingProposal = false; // Reset flag
                                        this.addLog(`⚠️ Stake ajustado novamente. Aceitando $${stakeValue} para evitar loop.`, 'warning');
                                    }
                                }
                            }

                            // 2. Prepare for fast result calculation with the EXACT payout
                            this.pendingFastResult.payout = payout;
                            
                            // 3. Execute the Buy
                            this.addLog(`💸 Comprando contrato via ID: ${proposalId}`, 'info');
                            this.ws.send(JSON.stringify({
                                buy: proposalId,
                                price: stakeValue
                            }));
                            
                            // Successful negotiation logic resets the retry flag
                            this.retryingProposal = false;  
                        }
                    }

                    if (msg.msg_type === 'tick') {
                        this.handleTickMessage(msg);
                    }

                    if (msg.msg_type === 'buy') {
                        console.log('[WS] Resposta de compra recebida:', msg);
                        if (msg.error) {
                            console.error('[WS] Erro na compra:', msg.error);
                            this.addLog(`❌ ERRO NA COMPRA: ${msg.error.message}`, 'error');
                            this.isNegotiating = false; // Reset lock on buy error
                            this.retryingProposal = false; // Ensure flag is cleared
                        } else {
                            const payout = msg.buy.payout;
                            const stake = msg.buy.buy_price;
                            const profitPercent = (((payout - stake) / stake) * 100).toFixed(0);
                            
                            console.log(`[WS] Sucesso! ID: ${msg.buy.contract_id}, Entrada: $${stake}, Payout: $${payout} (${profitPercent}%)`);
                            
                            const profitExpected = (payout - stake).toFixed(2);
                            let contractType = this.sessionState.lastContractType || 'Desconhecido';
                            
                            // Append Barrier if available (Critical for user to see contract switch)
                            const config = (this.sessionState.analysisType === 'RECUPERACAO') ? this.recoveryConfig : this.form;
                            if (['DIGITOVER', 'DIGITUNDER', 'DIGITMATCH', 'DIGITDIFF'].includes(contractType)) {
                                 contractType += ` (${config.prediction})`;
                            }

                            const purchaseLog = `🚀 COMPRA REALIZADA!<br>` +
                                `• Contrato: ${contractType}<br>` +
                                `• Investimento: $${stake.toFixed(2)}<br>` +
                                `• Payout Esperado: $${payout.toFixed(2)} (${profitPercent}%)<br>` +
                                `• Lucro Esperado: $${profitExpected}`;
                                
                            this.addLog(purchaseLog, 'success');
                            
                            // Activate fast result calculation if it's 1-tick
                            /* 
                                DISABLED FAST RESULT: User requested to rely on official broker response only.
                            if (this.pendingFastResult.duration === 1 && this.pendingFastResult.durationUnit === 't') {
                                this.pendingFastResult.contractId = msg.buy.contract_id;
                                this.pendingFastResult.payout = payout; // Store real payout for fast result estimation
                                this.pendingFastResult.active = true;
                                console.log('[FastResult] Monitoramento rápido ativado para o próximo tick.');
                            }
                            */
                            
                            this.isNegotiating = false; // Reset lock on success
                            this.subscribeToContract(msg.buy.contract_id);
                        }
                    }

                    if (msg.msg_type === 'proposal_open_contract') {
                        console.log('[WS] Atualização de contrato:', msg.proposal_open_contract);
                        this.handleContractUpdate(msg.proposal_open_contract);
                    }

                } catch (e) {
                    console.error('[WS] Erro JSON:', e);
                    this.isNegotiating = false; // Emergency Unlock
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

                // --- Fast Result Calculation ---
                // DISABLED as per user request
                /*
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

                    this.addLog(`⚡ RESULTADO RÁPIDO: ${win ? 'WIN' : 'LOSS'} (Dígito: ${lastDigit})`, win ? 'success' : 'error');
                    
                    // Pre-update trade in activeContracts if present
                    const trade = this.activeContracts.get(contractId);
                    if (trade) {
                        trade.result = win ? 'WON' : 'LOST';
                        trade.fastResultApplied = true;
                    }

                    // Update stats immediately to allow next trade
                    const realPayout = this.pendingFastResult.payout || (stake * (this.sessionState.analysisType === 'RECUPERACAO' ? this.sessionState.lastPayoutRecovery : this.sessionState.lastPayoutPrincipal) + stake);
                    const estimatedProfit = win 
                        ? (realPayout - stake)
                        : -stake;

                    if (win) this.monitoringStats.wins++;
                    else this.monitoringStats.losses++;

                    RiskManager.processTradeResult(this.sessionState, win, estimatedProfit, stake, this.pendingFastResult.analysisType, this.recoveryConfig.lossesToActivate);
                    this.activeContracts.delete(this.pendingFastResult.contractId);
                    
                    // Keep isRecoveryMode sync for legacy UI if needed
                    this.sessionState.isRecoveryMode = this.sessionState.analysisType === 'RECUPERACAO';

                    if (!win && this.sessionState.analysisType === 'RECUPERACAO' && this.sessionState.lossStreakRecovery === 1) {
                         this.addLog('🔄 MODO RECUPERAÇÃO ATIVADO (RÁPIDO)...', 'warning');
                    }

                    this.pendingFastResult.active = false;
                    
                    this.checkLimits();
                }
                */
                
                // --- Real-time Analysis Integration ---
                // Add to history buffers (limit to 100 for performance)
                this.tickHistory.unshift(price);
                if (this.tickHistory.length > 100) this.tickHistory.pop();

                const lastDigit = parseInt(price.toString().slice(-1));
                this.digitHistory.unshift(lastDigit);
                if (this.digitHistory.length > 100) this.digitHistory.pop();

                // Trigger Analysis
                this.runAnalysis();
            }
        },
        runAnalysis() {
            const activeFilters = this.sessionState.activeStrategy === 'RECUPERACAO' 
                ? this.recoveryConfig.attackFilters 
                : this.form.attackFilters;
                
            if (activeFilters.length === 0) return;
            
            // Prevent spamming analysis if we are already in a trade or negotiating one
            if (this.activeContracts.size > 0 || this.isNegotiating) return;
            // Also pendingFastResult might be active but contract not yet in activeContracts list?
            if (this.pendingFastResult && this.pendingFastResult.active) return;

            const data = {
                tickHistory: this.tickHistory,
                digitHistory: this.digitHistory
            };

            const results = activeFilters.map(filter => {
                return StrategyAnalysis.evaluate(filter, data);
            });

            const allPassed = results.every(r => r.pass);
            
            // Log details for each filter
            results.forEach(res => {
                if (!res.pass) {
                    // Log blocked entry with reason (Zeus style)
                    // Reducing spam: only log if it's a specific "Entry Blocked" scenario, or simplify
                    // For now, simpler concise log
                     this.addLog(`⏸️ ENTRADA BLOQUEADA: ${res.reason}`, 'warning');
                }
            });

            if (allPassed) {
                // Detailed Analysis Log (Zeus style)
                const mode = this.sessionState.negotiationMode;
                const isRec = this.sessionState.activeStrategy === 'RECUPERACAO';
                
                let analysisLog = `🧠 ANÁLISE DO MERCADO<br>` +
                    `• MODO: ${mode} ${isRec ? '(RECUPERAÇÃO)' : ''}<br>` +
                    `• STATUS: Confirmado<br>` +
                    `• GATILHO: Filtros de Ataque Atendidos`;
                
                this.addLog(analysisLog, 'info');
                this.executeRealTrade(); 
            }
        },
        checkLimits() {
            if (this.sessionState.isStopped) return true;

            const lucroAtual = this.monitoringStats.profit;
            const target = this.form.profitTarget;
            const stopLoss = this.form.stopLoss;

            // 1. Profit Target
            if (target > 0 && lucroAtual >= target) {
                this.addLog(`🎯 META ATINGIDA: +$${lucroAtual.toFixed(2)}`, 'success');
                this.stopMonitoring('Meta atingida');
                return true;
            }

            // 2. Stop Blindado
            if (this.form.useBlindado && target > 0) {
                const activationThreshold = target * 0.40;
                const currentPeak = this.sessionState.peakProfit;

                if (currentPeak >= activationThreshold) {
                    if (!this.sessionState.stopBlindadoActive) {
                        this.sessionState.stopBlindadoActive = true;
                        const factor = (this.form.stopBlindadoPercent || 50) / 100;
                        this.sessionState.stopBlindadoFloor = activationThreshold * factor;
                        this.addLog(`🛡️ STOP BLINDADO ATIVADO! Piso: $${this.sessionState.stopBlindadoFloor.toFixed(2)}`, 'info');
                    }

                    if (lucroAtual <= this.sessionState.stopBlindadoFloor) {
                        this.addLog(`🛡️ STOP BLINDADO ATINGIDO: Protegendo $${lucroAtual.toFixed(2)}`, 'warning');
                        this.stopMonitoring('Stop Blindado atingido');
                        return true;
                    }
                }
            }

            // 3. Stop Loss
            if (stopLoss > 0 && lucroAtual <= -stopLoss) {
                this.addLog(`🛑 STOP LOSS ATINGIDO: -$${Math.abs(lucroAtual).toFixed(2)}`, 'error');
                this.stopMonitoring('Stop Loss atingido');
                return true;
            }

            return false;
        },
        calculateNextStake() {
            const isRecovery = this.sessionState.analysisType === 'RECUPERACAO';
            const config = isRecovery ? this.recoveryConfig : this.form;
            const stake = RiskManager.calculateNextStake(this.sessionState, config);
            
            // Log if Soros is active (Principal mode only)
            if (!isRecovery) {
                const sorosLevel = this.form.sorosLevel || 1;
                const cyclePosition = this.sessionState.consecutiveWins % (sorosLevel + 1);
                
                if (cyclePosition > 0 && this.sessionState.lastResultWin) {
                    this.addLog(`🚀 SOROS ATIVADO (Mão ${cyclePosition}/${sorosLevel}): $${stake}`, 'info');
                }
            }

            return stake;
        },
        stopMonitoring(reason = 'Finalizado pelo usuário') {
            // Handle PointerEvents if called from @click
            const stopReason = (reason instanceof Event) ? 'Finalizado pelo usuário' : reason;
            
            this.isMonitoring = false;
            this.sessionState.isStopped = true;
            this.monitoringStats.status = 'Parado';
            this.monitoringStats.statusDesc = stopReason;
            this.stopTickConnection();
            this.addLog(`⏹️ Monitoramento parado: ${stopReason}`, 'info');
        },
        executeRealTrade() {
            if (!this.isAuthorized) {
                this.addLog('⚠️ Entrada negada: Não autorizado (Token inválido ou ausente).', 'warning');
                return;
            }

            if (this.checkLimits()) return;

            // Note: isRecovery for logic is based on activeStrategy (filters/contracts)
            const isRecoveryStrategy = this.sessionState.activeStrategy === 'RECUPERACAO';
            // Note: isRecovery for financial (stake) is based on analysisType (Martingale)
            const isFinancialRecovery = this.sessionState.analysisType === 'RECUPERACAO';

            // CRITICAL: If we are in Financial Recovery (Martingale), we MUST use the Recovery Contract 
            // to ensure the Payout (e.g. 126%) matches the Stake Calculation.
            // So we override 'config' to recoveryConfig if isFinancialRecovery is true.
            const config = (isFinancialRecovery || isRecoveryStrategy) ? this.recoveryConfig : this.form;
            
            // Check for Contract Switch
            if (this.sessionState.lastContractType && this.sessionState.lastContractType !== config.tradeType) {
                this.addLog(`📊 CONTRATO ALTERADO: ${this.sessionState.lastContractType} ➔ ${config.tradeType}`, 'info');
            }
            this.sessionState.lastContractType = config.tradeType;
            const stake = this.calculateNextStake();

            this.addLog(`📡 Solicitando proposta (${isFinancialRecovery ? 'RECUPERAÇÃO/MARTINGALE' : 'PRINCIPAL'}): ${config.tradeType} $${stake}`, 'info');
            
            // Step 1: Request Proposal to get exact payout
            const proposalParams = {
                proposal: 1,
                amount: stake,
                basis: 'stake',
                contract_type: config.tradeType,
                currency: 'USD',
                duration: this.form.duration,
                duration_unit: this.form.durationUnit,
                symbol: config.market || this.form.market
            };

            if (['DIGITOVER', 'DIGITUNDER', 'DIGITMATCH', 'DIGITDIFF'].includes(config.tradeType)) {
                proposalParams.barrier = config.prediction.toString(); 
            }

            // Store current context for fast result (will be activated on buy response)
            this.pendingFastResult = {
                contractId: null,
                barrier: config.prediction,
                contractType: config.tradeType,
                active: false, // DISABLED FAST RESULT as per user request
                stake: stake,
                analysisType: isFinancialRecovery ? 'RECUPERACAO' : 'PRINCIPAL',
                payout: null, // Will be filled when proposal arrives
                duration: this.form.duration,
                durationUnit: this.form.durationUnit
            };

            this.ws.send(JSON.stringify(proposalParams));
        },
        subscribeToContract(contractId) {
            this.ws.send(JSON.stringify({
                proposal_open_contract: 1,
                contract_id: contractId,
                subscribe: 1
            }));
        },
        handleContractUpdate(contract) {
            const id = contract.contract_id;
            
            // Check if it's already in our list
            let trade = this.monitoringOperations.find(o => o.id === id);
            
            if (!trade) {
                trade = {
                    id: id,
                    time: new Date(contract.date_start * 1000).toLocaleTimeString(),
                    market: contract.display_name,
                    contract: contract.contract_type,
                    stake: contract.buy_price,
                    pnl: contract.profit || 0,
                    analysisType: this.sessionState.analysisType,
                    result: 'OPEN',
                    // Save Barrier for history key update later
                    barrier: contract.barrier
                };
                this.monitoringOperations.unshift(trade);
                this.activeContracts.set(id, trade);
            } else {
                trade.pnl = contract.profit || 0;
            }

            if (contract.is_sold) {
                trade.result = contract.status.toUpperCase(); // 'WON' or 'LOST'
                trade.pnl = parseFloat(contract.profit || 0);

                if (trade.result === 'WON') {
                    this.addLog(`💰 WIN! Resultado: +$${trade.pnl.toFixed(2)} (Stake: $${trade.stake.toFixed(2)})`, 'success');
                } else {
                    this.addLog(`🔴 LOSS! Prejuízo: -$${Math.abs(trade.pnl).toFixed(2)} (Stake: $${trade.stake.toFixed(2)})`, 'error');
                }

                // Refinar resultado se já processado pelo resultado rápido
                if (trade.fastResultApplied) {
                    RiskManager.refineTradeResult(this.sessionState, trade.pnl, trade.stake, trade.analysisType);
                } 
                
                // Always update payout history for this contract type (Win or Loss? Payout is mostly constant per type unless barrier changes)
                // For a loss, we don't know the real payout unless we saved it from proposal. 
                // But for a WIN, we know exactly.
                if (trade.result === 'WON') {
                     const payoutRate = trade.pnl / trade.stake;
                     
                     // Determine prefix (use stored analysisType from trade if available, or current? Trade has it)
                     // Determine prefix (use stored analysisType from trade if available, or current? Trade has it)
                     const prefix = (trade.analysisType === 'RECUPERACAO') ? 'RECUPERACAO_' : 'PRINCIPAL_';
                     
                     let barrierSuffix = '';
                     if (trade.barrier !== undefined) {
                         barrierSuffix = '_' + trade.barrier;
                     } 
                     
                     RiskManager.updatePayoutHistory(prefix + trade.contract + barrierSuffix, payoutRate);
                }
                else {
                    // Se não foi processado pelo rápido, marcar como processado e atualizar lógica
                    trade.fastResultApplied = true;
                    if (trade.result === 'WON') this.monitoringStats.wins++;
                    else this.monitoringStats.losses++;
                    
                    // CRITICAL: Must notify RiskManager to update state (Reset Recovery, etc.)
                    RiskManager.processTradeResult(
                        this.sessionState, 
                        trade.result === 'WON', 
                        trade.pnl, 
                        trade.stake, 
                        trade.analysisType, 
                        this.recoveryConfig.lossesToActivate
                    );

                    
                    const oldAnalysis = this.sessionState.analysisType;
                    const oldMode = this.sessionState.negotiationMode;

                    // Update State via Risk Manager
                    RiskManager.processTradeResult(this.sessionState, trade.result === 'WON', trade.pnl, trade.stake, trade.analysisType, this.recoveryConfig.lossesToActivate);
                    
                    // Sync legacy mode
                    this.sessionState.isRecoveryMode = this.sessionState.analysisType === 'RECUPERACAO';

                    // Mode Switching Logs
                    if (this.sessionState.negotiationMode !== oldMode) {
                        this.addLog(`🔄 MODO ${this.sessionState.negotiationMode} ATIVADO`, 'warning');
                    }

                    // Special Recovery Logs
                    if (oldAnalysis === 'PRINCIPAL' && this.sessionState.analysisType === 'RECUPERACAO') {
                         const lossSum = this.sessionState.totalLossAccumulated || this.sessionState.lastStakePrincipal;
                         this.addLog(`📉 Loss acumulado ($${lossSum.toFixed(2)}). Ativando RECUPERAÇÃO.`, 'warning');
                    } else if (oldAnalysis === 'RECUPERACAO' && this.sessionState.analysisType === 'PRINCIPAL') {
                         this.addLog('✅ RECUPERAÇÃO CONCLUÍDA!', 'success');
                    } else if (this.sessionState.analysisType === 'RECUPERACAO' && !trade.result === 'WON') {
                         this.addLog(`📉 Loss na Recuperação. Ajustando Martingale...`, 'warning');
                    }
                    // Refine result from Fast Result logic with official data
                    RiskManager.refineTradeResult(this.sessionState, trade.pnl, trade.stake);
                }

                // track peak profit for Stop Blindado
                if (this.monitoringStats.profit > this.sessionState.peakProfit) {
                    this.sessionState.peakProfit = this.monitoringStats.profit;
                }

                // Update official profit and balance
                this.monitoringStats.profit += trade.pnl;
                this.monitoringStats.balance = parseFloat(this.balance) + this.monitoringStats.profit;

                this.activeContracts.delete(id);
                this.checkLimits();
            }
        },
        simulateTrade() {
            // Deprecated in favor of executeRealTrade, but kept for non-authorized testing if needed
            this.executeRealTrade();
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
            this.logCounter++;
            this.monitoringLogs.unshift({
                id: `log-${Date.now()}-${this.logCounter}`,
                time: new Date().toLocaleTimeString(),
                message,
                type
            });
            if (this.monitoringLogs.length > 100) this.monitoringLogs.pop();
        }
    }
}
</script>

<style>
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
}
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
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.dashboard-content-wrapper.sidebar-collapsed {
}

.layout-content {
    flex-grow: 1;
    padding: 20px;
    padding-top: 80px;
    padding-bottom: 40px;
    background-color: #0B0B0B;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
}

.strategy-creator-form-container,
.monitoring-dashboard {
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding-left: 10px !important;
    padding-right: 10px !important;
}

.strategy-creator-form-container form,
.monitoring-dashboard > div {
    width: 100% !important;
    max-width: 100% !important;
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
    background: rgba(20, 20, 20, 0.6);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    padding: 1.25rem;
    display: flex;
    align-items: center;
    gap: 16px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.stats-card:hover {
    background: rgba(26, 26, 26, 0.8);
    border-color: rgba(34, 197, 94, 0.3);
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.stats-icon-wrapper {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    transition: all 0.3s ease;
}

.stats-icon-wrapper.blue { background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.2); }
.stats-icon-wrapper.green { background: rgba(34, 197, 94, 0.1); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.2); }
.stats-icon-wrapper.red { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); }
.stats-icon-wrapper.yellow { background: rgba(234, 179, 8, 0.1); color: #eab308; border: 1px solid rgba(234, 179, 8, 0.2); }

.stats-card:hover .stats-icon-wrapper {
    transform: scale(1.1);
}

.glow-green-text {
    text-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
}

.text-zenix-green {
    color: #22C55E;
}

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
    color: #A1A1AA;
    font-weight: 800;
    letter-spacing: 0.1em;
    margin-bottom: 4px;
}

.stats-value {
    display: block;
    font-size: 20px;
    font-weight: 900;
    color: #fff;
    line-height: 1;
}

.monitoring-tabs-container {
    border-bottom: 1px solid #1A1A1A;
}

.tab-content-container {
    background: rgba(15, 15, 15, 0.8) !important;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.05) !important;
    border-radius: 20px !important;
    min-height: 480px !important;
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

/* Form Aesthetics */
.strategy-creator-form-container input, .strategy-creator-form-container select, .strategy-creator-form-container button[type="button"] {
    background: rgba(15, 15, 15, 0.8) !important;
    border: 1px solid #27272a !important;
    transition: all 0.3s ease !important;
}

.strategy-creator-form-container input:focus, .strategy-creator-form-container select:focus {
    border-color: #22C55E !important;
    box-shadow: 0 0 10px rgba(34, 197, 94, 0.1) !important;
}

button[type="submit"].bg-zenix-green {
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.2);
}

button[type="submit"].bg-zenix-green:hover {
    box-shadow: 0 0 30px rgba(34, 197, 94, 0.4);
    transform: translateY(-2px);
}
</style>

