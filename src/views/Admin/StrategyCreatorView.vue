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
                <div class="content-header mb-6 flex justify-between items-center px-4 w-full">
                    <div>
                        <h1 class="text-2xl font-bold text-white">
                            {{ isMonitoring ? 'Acompanhamento de Estratégia [BETA]' : 'Criador de Estratégias [BETA]' }}
                            <span v-if="!isMonitoring && selectedSavedStrategyId && currentVersion" class="text-zenix-green ml-2 text-lg">
                                - {{ currentStrategyName }} v{{ currentVersion }}
                            </span>
                        </h1>
                        <p class="text-sm text-[#7D7D7D]">{{ isMonitoring ? 'Acompanhe a atividade do robô em tempo real.' : 'Configure sua estratégia automatizada para execução no mercado.' }}</p>
                    </div>

                    <div v-if="!isMonitoring" class="flex flex-wrap items-center gap-3">
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
                <!-- MONITORING DASHBOARD -->
                <MonitoringDashboard 
                    v-if="isMonitoring" 
                    :stats="monitoringStats" 
                    :logs="monitoringLogs" 
                    :operations="monitoringOperations" 
                    :session-state="sessionState"
                    :validator="validator"
                    :attack-filters="form.attackFilters"
                    :recovery-config="recoveryConfig"
                    @stop="stopMonitoring"
                    @clear-logs="monitoringLogs = []"
                    @update:validator="validator = $event"
                />

                <!-- CONFIGURATION FORM -->
                <div v-else class="strategy-creator-form-container px-4">
                     <!-- Tabs -->
                     <div class="flex items-center gap-4 mb-6 border-b border-[#333] pb-4">
                        <button 
                            type="button"
                            @click="activeTab = 'config'"
                            class="text-sm font-bold uppercase tracking-wider pb-2 border-b-2 transition-all"
                            :class="activeTab === 'config' ? 'text-zenix-green border-zenix-green' : 'text-gray-500 border-transparent hover:text-white'"
                        >
                            Configuração
                        </button>
                    </div>

                    <form v-show="activeTab === 'config'" @submit.prevent="submitForm" class="space-y-8">
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

                            <!-- Direção e Payouts (Attack) -->
                            <div v-if="form.selectedTradeTypeGroup" class="col-span-12 mt-2">
                                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 bg-[#181818] p-6 rounded-xl border border-[#333] shadow-inner">
                                    <div class="md:col-span-2">
                                        <label class="block text-white font-bold mb-3 text-sm flex items-center gap-2">
                                            <i class="fa-solid fa-compass text-zenix-green"></i>
                                            Direção Permitida
                                        </label>
                                        <div class="flex bg-[#111] p-1.5 rounded-xl border border-[#333]">
                                            <button 
                                                type="button"
                                                @click="updatePrincipalDirection('both')"
                                                class="flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all"
                                                :class="form.directionMode === 'both' ? 'bg-zenix-green text-white shadow-lg shadow-zenix-green/20' : 'text-gray-500 hover:text-white'"
                                            >
                                                Ambos
                                            </button>
                                            <button 
                                                v-for="(dir, idx) in selectedDirections" 
                                                :key="dir.value"
                                                type="button"
                                                @click="updatePrincipalDirection(idx === 0 ? 'up' : 'down', dir.value)"
                                                class="flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all"
                                                :class="(idx === 0 && form.directionMode === 'up') || (idx === 1 && form.directionMode === 'down') ? 'bg-zenix-green text-white shadow-lg shadow-zenix-green/20' : 'text-gray-500 hover:text-white'"
                                            >
                                                {{ dir.label }}
                                            </button>
                                        </div>
                                    </div>
                                    <div v-for="dir in selectedDirections" :key="'payout-' + dir.value">
                                        <label class="block text-white font-bold mb-3 text-sm flex items-center gap-2">
                                            <i class="fa-solid fa-hand-holding-dollar text-zenix-green"></i>
                                            Payout ({{ dir.label }})
                                        </label>
                                        <div class="relative group">
                                            <input 
                                                type="number" 
                                                v-model.number="form.directionPayouts[dir.value]" 
                                                class="w-full bg-[#111] text-white border border-[#333] rounded-xl p-3 focus:outline-none focus:border-zenix-green transition-all text-sm group-hover:border-[#444]"
                                                step="1"
                                                min="1"
                                            />
                                            <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                                <span class="text-xs text-gray-500 font-black">%</span>
                                            </div>
                                        </div>
                                    </div>
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
                                    <div v-if="activeAttackFilters.length === 0" class="p-4 bg-[#1E1E1E] border border-dashed border-[#444] rounded-lg text-center">
                                        <p class="text-gray-400 text-sm mb-3">Nenhum filtro de ataque configurado. O robô entrará em cada sinal disponível.</p>
                                        <button 
                                            type="button" 
                                            @click="openFilterModal('main')"
                                            class="bg-zenix-green/10 text-zenix-green border border-zenix-green/30 px-6 py-2 rounded-lg hover:bg-zenix-green/20 transition-all font-bold text-sm"
                                        >
                                            Adicionar Filtros
                                        </button>
                                    </div>
                                    
                                    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div v-for="filter in activeAttackFilters" :key="filter.id" class="p-4 bg-[#1E1E1E] border border-[#333] rounded-lg flex items-center justify-between group hover:border-zenix-green transition-colors">
                                            <div class="flex items-center gap-3">
                                                 <div class="w-8 h-8 rounded bg-zenix-green/10 flex items-center justify-center text-zenix-green">
                                                    <i class="fa-solid fa-filter"></i>
                                                 </div>
                                                 <div>
                                                    <span class="block text-white font-bold text-sm">{{ filter.name }}</span>
                                                    <span class="text-[10px] text-gray-400">Ativo • Configurado</span>
                                                 </div>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <button type="button" @click="openFilterConfigDirect(filter, 'main')" class="w-8 h-8 rounded bg-[#111] hover:bg-[#222] text-gray-400 hover:text-white transition-colors border border-[#333]">
                                                    <i class="fa-solid fa-gear text-xs"></i>
                                                </button>
                                                <button type="button" @click="removeFilter(filter, 'main')" class="w-8 h-8 rounded bg-[#111] hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors border border-[#333] hover:border-red-500/30">
                                                    <i class="fa-solid fa-times text-xs"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <button 
                                            type="button" 
                                            @click="openFilterModal('main')"
                                            class="p-4 border border-dashed border-[#444] rounded-lg flex items-center justify-center gap-2 text-gray-500 hover:text-white hover:border-gray-500 transition-all"
                                        >
                                            <i class="fa-solid fa-plus text-xs"></i>
                                            <span class="text-sm">Adicionar Filtro</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Filtros de Segurança (Loss Virtual) -->
                        <div class="col-span-12">
                            <div class="bg-[#141414] border border-[#333] rounded-xl p-6 relative overflow-hidden">
                                <div class="absolute top-0 right-0 p-4 opacity-5">
                                    <i class="fa-solid fa-user-secret text-6xl"></i>
                                </div>
                                <h3 class="text-xl font-bold text-white mb-4 relative z-10 flex items-center justify-between gap-2">
                                    <div class="flex items-center gap-2">
                                        <i class="fa-solid fa-user-secret text-zenix-green"></i>
                                        Filtros de Segurança (Loss Virtual)
                                    </div>
                                    <label class="relative inline-flex items-center cursor-pointer scale-90">
                                        <input type="checkbox" v-model="securityConfig.virtualLoss.enabled" class="sr-only peer">
                                        <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zenix-green"></div>
                                        <span class="ms-3 text-xs font-bold text-gray-400 uppercase tracking-tighter">{{ securityConfig.virtualLoss.enabled ? 'Ativo' : 'Inativo' }}</span>
                                    </label>
                                </h3>
                                
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10" :class="{ 'opacity-40 grayscale pointer-events-none': !securityConfig.virtualLoss.enabled }">
                                    <div>
                                        <label class="block text-white font-bold mb-2 text-sm">Contagem de Loss Virtual</label>
                                        <p class="text-xs text-gray-400 mb-2">Quantas simulações perdedoras consecutivas esperar antes da entrada real.</p>
                                        <div class="relative">
                                             <input 
                                                type="number" 
                                                v-model.number="securityConfig.virtualLoss.target" 
                                                class="w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg p-3 focus:outline-none focus:border-zenix-green transition-colors text-sm"
                                                min="1"
                                                placeholder="Ex: 2"
                                            />
                                            <div class="absolute inset-y-0 right-0 px-3 flex items-center pointer-events-none">
                                                <span class="text-gray-500 text-xs font-bold">LOSSES</span>
                                            </div>
                                        </div>
                                    </div>

                                    
                                    <div>
                                        <label class="block text-white font-bold mb-2 text-sm">Modo de Operação</label>
                                        <p class="text-xs text-gray-400 mb-2">Quando aplicar o filtro de segurança.</p>
                                        <div class="relative">
                                            <select 
                                                v-model="securityConfig.virtualLoss.mode"
                                                class="w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg p-3 focus:outline-none focus:border-zenix-green transition-colors text-sm appearance-none"
                                            >
                                                <option value="warmup">Aquecimento (Apenas no Início)</option>
                                                <option value="attack">Antes do Ataque (Modo Principal)</option>
                                                <option value="recovery">Antes da Recuperação (Modo Rec.)</option>
                                                <option value="cyclic">Cíclico (Sempre - Ataque e Rec.)</option>
                                            </select>
                                            <div class="absolute inset-y-0 right-0 px-3 flex items-center pointer-events-none">
                                                <i class="fa-solid fa-chevron-down text-gray-400 text-xs"></i>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-span-1 md:col-span-2 flex items-center justify-center p-4 bg-[#1E1E1E] border border-dashed border-[#333] rounded-lg mt-2">
                                        <p class="text-xs text-center text-gray-400">
                                            <i class="fa-solid fa-circle-info mb-1 block text-base text-zenix-green"></i>
                                            O robô simulará operações silenciosamente. Só enviará a ordem real após <b>{{ securityConfig.virtualLoss.target }}</b> perdas virtuais consecutivas.

                                        </p>
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

                                    <!-- Direção e Payouts (Recovery) -->
                                    <div v-if="recoveryConfig.selectedTradeTypeGroup" class="md:col-span-2">
                                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#181818] p-5 rounded-xl border border-[#333] mb-4">
                                            <div class="md:col-span-2">
                                                <label class="block text-white font-bold mb-2 text-[10px] uppercase tracking-[0.2em] opacity-70">Direção Permitida (REC)</label>
                                                <div class="flex bg-[#111] p-1.5 rounded-xl border border-[#333]">
                                                    <button 
                                                        type="button"
                                                        @click="updateRecoveryDirection('both')"
                                                        class="flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all"
                                                        :class="recoveryConfig.directionMode === 'both' ? 'bg-zenix-green text-white' : 'text-gray-500 hover:text-white'"
                                                    >
                                                        Ambos
                                                    </button>
                                                    <button 
                                                        v-for="(dir, idx) in selectedRecoveryDirections" 
                                                        :key="dir.value"
                                                        type="button"
                                                        @click="updateRecoveryDirection(idx === 0 ? 'up' : 'down', dir.value)"
                                                        class="flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all"
                                                        :class="(idx === 0 && recoveryConfig.directionMode === 'up') || (idx === 1 && recoveryConfig.directionMode === 'down') ? 'bg-zenix-green text-white' : 'text-gray-500 hover:text-white'"
                                                    >
                                                        {{ dir.label }}
                                                    </button>
                                                </div>
                                            </div>
                                            <div v-for="dir in selectedRecoveryDirections" :key="'payout-rec-' + dir.value">
                                                <label class="block text-white font-bold mb-2 text-[10px] uppercase tracking-[0.2em] opacity-70">Payout ({{ dir.label }})</label>
                                                <div class="relative group">
                                                    <input 
                                                        type="number" 
                                                        v-model.number="recoveryConfig.directionPayouts[dir.value]" 
                                                        class="w-full bg-[#111] text-white border border-[#333] rounded-xl p-2.5 focus:outline-none focus:border-zenix-green transition-all text-sm group-hover:border-[#444]"
                                                        step="1"
                                                        min="1"
                                                    />
                                                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                        <span class="text-[10px] text-gray-500 font-bold">%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4">

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
                                                @click="showPauseModal = true"
                                                class="flex-1 bg-[#2A2A2A] hover:bg-[#333] text-white h-[46px] rounded-lg border border-[#444] font-medium transition-colors flex items-center justify-center gap-2 text-xs"
                                            >
                                                <i class="fa-solid fa-pause"></i> Pausa
                                            </button>
                                        </div>

                                        <div class="h-[46px] bg-[#1E1E1E] border border-[#333] rounded-lg flex items-center justify-between px-3 self-end">
                                            <span class="text-[10px] font-bold text-gray-400 uppercase">Martingale</span>
                                            <label class="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" v-model="recoveryConfig.martingale" class="sr-only peer">
                                                <div class="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-zenix-green"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Filtros de Recuperação (Standalone Card) -->
                        <div class="col-span-12">
                            <div class="bg-[#141414] border border-[#333] rounded-xl p-6 relative overflow-hidden" :class="{ 'opacity-50 grayscale pointer-events-none': !recoveryConfig.enabled }">
                                <div class="absolute top-0 right-0 p-4 opacity-5">
                                    <i class="fa-solid fa-rotate-left text-6xl"></i>
                                </div>
                                <h3 class="text-xl font-bold text-white mb-4 relative z-10 flex items-center gap-2">
                                    <i class="fa-solid fa-filter text-zenix-green"></i>
                                    Filtros de Recuperação
                                </h3>
                                
                                <div class="space-y-4 relative z-10">
                                    <div v-if="activeRecoveryFilters.length === 0" class="p-4 bg-[#1E1E1E] border border-dashed border-[#444] rounded-lg text-center">
                                        <p class="text-gray-400 text-sm mb-3">Nenhum filtro de recuperação configurado.</p>
                                        <button 
                                            type="button" 
                                            @click="openFilterModal('recovery')"
                                            class="bg-zenix-green/10 text-zenix-green border border-zenix-green/30 px-6 py-2 rounded-lg hover:bg-zenix-green/20 transition-all font-bold text-sm"
                                        >
                                            Adicionar Filtros
                                        </button>
                                    </div>
                                    
                                    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div v-for="filter in activeRecoveryFilters" :key="filter.id" class="p-4 bg-[#1E1E1E] border border-[#333] rounded-lg flex items-center justify-between group hover:border-zenix-green transition-colors">
                                            <div class="flex items-center gap-3">
                                                 <div class="w-8 h-8 rounded bg-zenix-green/10 flex items-center justify-center text-zenix-green">
                                                    <i class="fa-solid fa-filter"></i>
                                                 </div>
                                                 <div>
                                                    <span class="block text-white font-bold text-sm">{{ filter.name }}</span>
                                                    <span class="text-[10px] text-gray-400">Ativo • Configurado</span>
                                                 </div>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <button type="button" @click="openFilterConfigDirect(filter, 'recovery')" class="w-8 h-8 rounded bg-[#111] hover:bg-[#222] text-gray-400 hover:text-white transition-colors border border-[#333]">
                                                    <i class="fa-solid fa-gear text-xs"></i>
                                                </button>
                                                <button type="button" @click="removeFilter(filter, 'recovery')" class="w-8 h-8 rounded bg-[#111] hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors border border-[#333] hover:border-red-500/30">
                                                    <i class="fa-solid fa-times text-xs"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <button 
                                            type="button" 
                                            @click="openFilterModal('recovery')"
                                            class="p-4 border border-dashed border-[#444] rounded-lg flex items-center justify-center gap-2 text-gray-500 hover:text-white hover:border-gray-500 transition-all"
                                        >
                                            <i class="fa-solid fa-plus text-xs"></i>
                                            <span class="text-sm">Adicionar Filtro</span>
                                        </button>
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
                                    <label class="block text-white font-bold mb-2">Modo Inicial</label>
                                    <div class="relative">
                                        <select 
                                            v-model="sessionState.negotiationMode" 
                                            class="w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg py-3 px-4 appearance-none focus:outline-none focus:border-zenix-green transition-colors"
                                        >
                                            <option value="VELOZ">Veloz (Rápido)</option>
                                            <option value="NORMAL">Moderado (Normal)</option>
                                            <option value="PRECISO">Preciso (Lento)</option>
                                        </select>
                                        <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                                            <i class="fa-solid fa-chevron-down text-gray-400 text-xs"></i>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-white font-bold mb-2">Perfil de Risco</label>
                                    <div class="relative">
                                        <select 
                                            v-model="form.riskProfile" 
                                            :disabled="!recoveryConfig.martingale"
                                            class="w-full bg-[#1E1E1E] text-white border border-[#333] rounded-lg py-3 px-4 appearance-none focus:outline-none focus:border-zenix-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <option value="conservador">Conservador (Recupera Perda)</option>
                                        <option value="moderado">Moderado (Recupera + Lucro)</option>
                                        <option value="agressivo">Agressivo (Alavancagem)</option>
                                        <option value="fixo">Fixo (Mão Fixa - Sem Martingale)</option>
                                        </select>
                                        <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                                            <i class="fa-solid fa-chevron-down text-gray-400 text-xs"></i>
                                        </div>
                                    </div>
                                    <p v-if="!recoveryConfig.martingale" class="mt-2 text-[10px] text-yellow-500 font-bold leading-tight">
                                        <i class="fa-solid fa-triangle-exclamation mr-1"></i>
                                        Esta estratégia tem uma gestão de risco fixa (para a ativação envie o valor de conservador)
                                    </p>
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

                                <!-- Target Digits (Conditional) -->
                                <div v-if="['digits_over_under', 'digits_match_diff'].includes(form.selectedTradeTypeGroup)" class="col-span-1 md:col-span-2 grid grid-cols-2 gap-4 bg-[#1E1E1E] border border-[#333] rounded-lg p-3">
                                    <div>
                                        <label class="block text-white font-bold mb-1 text-xs">Dígito Alvo (CIMA/OVER)</label>
                                        <div class="relative">
                                            <input 
                                                type="number" 
                                                v-model.number="form.targetDigitUp" 
                                                class="w-full bg-[#111] text-white border border-[#333] rounded py-2 px-3 focus:outline-none focus:border-zenix-green text-sm"
                                                min="0" max="9"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label class="block text-white font-bold mb-1 text-xs">Dígito Alvo (BAIXO/UNDER)</label>
                                        <div class="relative">
                                            <input 
                                                type="number" 
                                                v-model.number="form.targetDigitDown" 
                                                class="w-full bg-[#111] text-white border border-[#333] rounded py-2 px-3 focus:outline-none focus:border-zenix-green text-sm"
                                                min="0" max="9"
                                            />
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
                                        :class="['category-item-btn', { 'active': (modalContext === 'main' ? form.selectedTradeTypeGroup : recoveryConfig.selectedTradeTypeGroup) === item.value }]"
                                    >
                                        <div class="flex items-center gap-2">
                                            <div class="w-5 h-5 flex items-center justify-center text-zenix-green">
                                                <img 
                                                    v-if="item.icon && item.icon.endsWith('.svg')" 
                                                    :src="`/deriv_icons/${item.icon}`" 
                                                    class="w-full h-full object-contain filter-zenix-green" 
                                                    :alt="item.label" 
                                                />
                                                <i v-else :class="item.icon"></i>
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
                            <p class="text-sm text-gray-400 mb-4 px-1">Selecione os filtros desejados para as entradas de {{ modalContext === 'main' ? 'ataque' : 'recuperação' }}. Todos os filtros devem ser atendidos para executar uma operação.</p>
                            <div class="space-y-8">
                                <div v-for="group in groupedFiltersForModal" :key="group.id" class="space-y-3">
                                    <div class="flex items-center gap-2 px-1 mb-4">
                                        <div class="w-2 h-4 bg-zenix-green rounded-full"></div>
                                        <i :class="[group.icon, 'text-zenix-green text-xs']"></i>
                                        <h4 class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">{{ group.label }}</h4>
                                    </div>
                                    <div class="grid grid-cols-1 gap-3">
                                        <div 
                                            v-for="filter in group.filters" 
                                            :key="filter.id" 
                                            @click="toggleFilter(filter)"
                                            class="p-4 rounded-xl border transition-all cursor-pointer group/item"
                                            :class="[
                                                filter.active ? 'border-zenix-green bg-zenix-green/5' : 'border-[#333] bg-[#111] hover:border-[#444]'
                                            ]"
                                        >
                                            <div class="flex items-center gap-3 mb-2">
                                                <div 
                                                    class="w-5 h-5 rounded border flex items-center justify-center transition-colors"
                                                    :class="filter.active ? 'bg-zenix-green border-zenix-green text-black' : 'border-[#444] group-hover/item:border-gray-500'"
                                                >
                                                    <i v-if="filter.active" class="fa-solid fa-check text-[10px]"></i>
                                                </div>
                                                <span class="text-white font-bold">{{ filter.name }}</span>
                                            </div>
                                            <p class="text-xs text-gray-500 pl-8 leading-relaxed">{{ filter.desc }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- Button Removed -->
                        </div>

                        <div v-else-if="filterStep === 2">
                            <h3 class="text-lg font-bold text-white mb-4">Configurar Filtros</h3>
                            
                            <!-- Config Mode Tabs -->
                            <div class="flex space-x-1 mb-6 bg-[#111] p-1 rounded-lg">
                                <button 
                                    v-for="mode in ['Veloz', 'Moderado', 'Preciso']" 
                                    :key="mode"
                                    @click="activeConfigTab = mode"
                                    :class="[
                                        'flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all',
                                        activeConfigTab === mode 
                                            ? 'bg-zenix-green text-black shadow-lg' 
                                            : 'text-gray-400 hover:text-white hover:bg-[#222]'
                                    ]"
                                >
                                    {{ mode }}
                                </button>
                            </div>
                            <!-- Info Box -->
                            <div class="mb-4 p-3 bg-[#181818] border border-[#333] rounded flex items-center gap-3">
                                <i class="fas fa-info-circle text-zenix-green"></i>
                                <span class="text-xs text-gray-400">
                                    Configurando modo: <strong class="text-white">{{ activeConfigTab }}</strong>. 
                                    O robô usará estes valores quando estiver operando neste modo.
                                </span>
                            </div>

                            <div v-for="filter in activeFiltersForModal.filter(f => f.active)" :key="filter.id" class="mb-8 border-b border-[#333] pb-8 last:border-0 last:pb-0">
                                <template v-if="filter.active">
                                    <div class="flex items-center gap-3 mb-6">
                                        <div class="w-8 h-8 rounded bg-zenix-green/10 flex items-center justify-center text-zenix-green">
                                            <i class="fa-solid fa-filter"></i>
                                        </div>
                                        <h4 class="text-white font-bold text-lg">{{ filter.name }}</h4>
                                    </div>

                                    <!-- Loftop (Explanation) -->
                                    <div v-if="getFilterDescription(filter)" class="mb-6 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                                        <div class="flex items-start gap-3">
                                            <i class="fas fa-info-circle text-blue-500 mt-1 text-sm"></i>
                                            <div>
                                                <h4 class="font-bold text-blue-400 text-sm mb-2">{{ getFilterDescription(filter).title }}</h4>
                                                <ul class="text-xs text-gray-300 space-y-1.5 list-disc pl-4">
                                                    <li><strong class="text-gray-400">O que observa:</strong> {{ getFilterDescription(filter).loftop.what }}</li>
                                                    <li><strong class="text-gray-400">Quando é válido:</strong> {{ getFilterDescription(filter).loftop.when }}</li>
                                                    <li><strong class="text-gray-400">O que acontece:</strong> {{ getFilterDescription(filter).loftop.result }}</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Dynamic Human Text Preview -->
                                    <div v-if="getFilterDescription(filter)" class="mb-6 p-4 bg-[#181818] border border-[#333] rounded-lg relative overflow-hidden">
                                        <div class="absolute left-0 top-0 bottom-0 w-1 bg-zenix-green"></div>
                                        <h4 class="text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-wider flex items-center gap-2">
                                            <i class="fa-solid fa-eye text-zenix-green"></i> Resumo da Estratégia
                                        </h4>
                                        <p class="text-gray-200 text-sm leading-relaxed italic">
                                            "{{ getFilterDescription(filter).text }}"
                                        </p>
                                    </div>
                                    
                                    <!-- Dynamic Inputs Binding to Active Tab -->
                                <!-- Helper Function to get config context: getConfig(filter, activeConfigTab) -->
                                
                                <!-- Digit Density -->
                                <div v-if="filter.id === 'digit_density'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Janela (Ticks/Dígitos)</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].window" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Dígitos Alvo (Sep. por Vírgula)</label>
                                        <input type="text" v-model="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].digits" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" placeholder="Ex: 8,9" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Operador</label>
                                        <select v-model="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].operator" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none">
                                            <option value="<">Menor que (&lt;)</option>
                                            <option value=">">Maior que (&gt;)</option>
                                            <option value="=">Igual a (=)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Quantidade Limite</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].threshold" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                    <div class="md:col-span-2 flex items-center gap-3 bg-[#111] p-3 rounded-lg border border-[#333]">
                                        <input type="checkbox" :id="'unique_' + filter.id" v-model="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].unique" class="w-4 h-4 rounded border-gray-600 text-zenix-green focus:ring-zenix-green bg-[#181818]" />
                                        <label :for="'unique_' + filter.id" class="text-sm text-white cursor-pointer select-none">
                                            Exigir 100% Únicos (Todos diferentes entre si - ZEUS)
                                        </label>
                                    </div>
                                </div>

                                <!-- Digit Sequence Config -->
                                <div v-if="filter.id === 'digit_sequence'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Tamanho da Sequência</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].length" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Grupo Alvo</label>
                                        <select v-model="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].target" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none">
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
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].window" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">% Mínima</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].percentage" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Máx. Ruído</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].maxNoise" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                </div>

                                <!-- Price Momentum Config -->
                                <div v-if="filter.id === 'price_momentum'" class="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Janela</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].window" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Tiques Conf.</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].ticksToConfirm" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Delta Mín.</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].minDelta" step="0.01" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                </div>

                                <!-- Parity Sequence Config -->
                                <div v-if="filter.id === 'parity_sequence'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Tamanho da Sequência</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].length" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Paridade</label>
                                        <select v-model="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].parity" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none">
                                            <option value="even">Par</option>
                                            <option value="odd">Ímpar</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Over/Under Sequence Config -->
                                <div v-if="filter.id === 'over_under_sequence'" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Tamanho</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].length" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Tipo</label>
                                        <select v-model="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].type" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none">
                                            <option value="over">Acima (Over)</option>
                                            <option value="under">Abaixo (Under)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Valor Limite</label>
                                        <select v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].threshold" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none">
                                            <option v-for="n in 10" :key="n-1" :value="n-1">{{ n-1 }}</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Price vs MA Config -->
                                <div v-if="filter.id === 'price_ma'" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Período</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].period" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Tipo</label>
                                        <select v-model="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].type" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none">
                                            <option value="SMA">SMA (Simples)</option>
                                            <option value="EMA">EMA (Exponencial)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Condição (Preço)</label>
                                        <select v-model="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].op" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none">
                                            <option value=">">Acima da Média</option>
                                            <option value="<">Abaixo da Média</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Digit Absence Config -->
                                <div v-if="filter.id === 'digit_absence'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Período (Ticks)</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].period" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Dígito Ausente</label>
                                        <select v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].digit" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none">
                                            <option v-for="n in 10" :key="n-1" :value="n-1">{{ n-1 }}</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- MA Crossover Config -->
                                <div v-if="filter.id === 'ma_crossover'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Média Curta</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].periodShort" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Média Longa</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].periodLong" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Tipo</label>
                                        <select v-model="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].type" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none">
                                            <option value="SMA">SMA</option>
                                            <option value="EMA">EMA</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Cruzamento</label>
                                        <select v-model="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].direction" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none">
                                            <option value="up">Para Cima (Alta)</option>
                                            <option value="down">Para Baixo (Baixa)</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- RSI Config -->
                                <div v-if="filter.id === 'rsi'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Período RSI</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].period" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Condição</label>
                                        <select v-model="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].condition" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none">
                                            <option value="<">Abaixo de (Sobrevenda)</option>
                                            <option value=">">Acima de (Sobrecompra)</option>
                                        </select>
                                    </div>
                                    <div class="col-span-2">
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Nível do RSI</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].level" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                </div>

                                <!-- Digit Equal Sequence -->
                                <div v-if="filter.id === 'digit_equal_sequence'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Tamanho da Sequência</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].length" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Dígito Alvo</label>
                                        <select v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].digit" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none">
                                            <option v-for="n in 10" :key="n-1" :value="n-1">{{ n-1 }}</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Digit Diff Sequence -->
                                <div v-if="filter.id === 'digit_diff_sequence'" class="grid grid-cols-1">
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Tamanho da Sequência (Diferentes)</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].length" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                </div>

                                <!-- Parity Alternation -->
                                <div v-if="filter.id === 'parity_alternation'" class="grid grid-cols-1">
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Tamanho da Sequência (Alternada)</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].length" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                </div>

                                <!-- Digit Frequency -->
                                <div v-if="filter.id === 'digit_frequency'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Dígito</label>
                                        <select v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].digit" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none">
                                            <option v-for="n in 10" :key="n-1" :value="n-1">{{ n-1 }}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Período</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].period" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Operador</label>
                                        <select v-model="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].op" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none">
                                            <option value=">=">&gt;=</option>
                                            <option value="<=">&lt;=</option>
                                            <option value="==">==</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Contagem</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].count" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                </div>

                                <!-- Digit Average -->
                                <div v-if="filter.id === 'digit_average'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Período</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].period" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Operador</label>
                                        <select v-model="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].op" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none">
                                            <option value=">">Maior que (&gt;)</option>
                                            <option value="<">Menor que (&lt;)</option>
                                        </select>
                                    </div>
                                    <div class="col-span-2">
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Valor Limite</label>
                                        <input type="number" step="0.1" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].threshold" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                </div>

                                <!-- Digit Position Return -->
                                <div v-if="filter.id === 'digit_position_return'" class="grid grid-cols-1">
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Período de Retorno</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].period" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                </div>

                                <!-- MA Slope -->
                                <div v-if="filter.id === 'ma_slope'" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Período</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].period" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Lookback (Ticks)</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].lookback" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Direção</label>
                                        <select v-model="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].direction" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none">
                                            <option value="up">Subindo</option>
                                            <option value="down">Descendo</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- MACD -->
                                <div v-if="filter.id === 'macd'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Fast EMA</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].fast" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Slow EMA</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].slow" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Signal EMA</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].signal" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Condição</label>
                                        <select v-model="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].condition" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none">
                                            <option value="cross_up">Cruzamento pra Cima</option>
                                            <option value="cross_down">Cruzamento pra Baixo</option>
                                            <option value="above_signal">Acima do Sinal</option>
                                            <option value="below_signal">Abaixo do Sinal</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Stochastic -->
                                <div v-if="filter.id === 'stochastic'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Período %K</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].k" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Período %D</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].d" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Suavização</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].smooth" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Condição</label>
                                        <select v-model="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].condition" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none">
                                            <option value="oversold">Sobrevenda (&lt; Nível)</option>
                                            <option value="overbought">Sobrecompra (&gt; Nível)</option>
                                            <option value="cross_up">Cruzamento Alta</option>
                                            <option value="cross_down">Cruzamento Baixa</option>
                                        </select>
                                    </div>
                                    <div class="col-span-2">
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Nível</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].level" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                </div>

                                <!-- Bollinger Bands -->
                                <div v-if="filter.id === 'bollinger_bands'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Período</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].period" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Desvio Padrão</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].stdDev" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                    <div class="col-span-2">
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Condição</label>
                                        <select v-model="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].condition" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none">
                                            <option value="cross_lower">Preço cruza Banda Inferior (Compra)</option>
                                            <option value="cross_upper">Preço cruza Banda Superior (Venda)</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- BB Width -->
                                <div v-if="filter.id === 'bb_width'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Período</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].period" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Desvio Padrão</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].stdDev" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Lookback</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].lookback" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Direção</label>
                                        <select v-model="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].direction" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none">
                                            <option value="increasing">Aumentando (Mais Volatilidade)</option>
                                            <option value="decreasing">Diminuindo (Menos Volatilidade)</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Price Action -->
                                <div v-if="filter.id === 'price_action'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Tamanho da Sequência</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].length" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Direção</label>
                                        <select v-model="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].direction" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none">
                                            <option value="rise">Alta (Sobe, Sobe...)</option>
                                            <option value="fall">Baixa (Desce, Desce...)</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Spike Detect -->
                                <div v-if="filter.id === 'spike_detect'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Multiplicador (x Média)</label>
                                        <input type="number" step="0.1" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].multiplier" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Janela de Média</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].window" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                </div>

                                <!-- Step Pattern -->
                                <div v-if="filter.id === 'step_pattern'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Ticks em Lateralização</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].rangeTicks" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] text-gray-500 uppercase mb-1 font-bold">Tamanho do Salto (Min)</label>
                                        <input type="number" v-model.number="getFilterConfig(filter)[activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : activeConfigTab.toLowerCase()].jumpThreshold" class="w-full bg-[#181818] border border-[#333] rounded p-3 text-sm text-white focus:border-zenix-green outline-none" />
                                    </div>
                                </div>

                                </template>
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

        <!-- Stop Modals -->
        <Teleport to="body">
            <StopLossModal
                :visible="showStopModal && stopResult.type === 'error'"
                :result="stopResult.profit"
                :loss-limit="form.stopLoss"
                @confirm="showStopModal = false"
            />

            <TargetProfitModal
                :visible="showStopModal && stopResult.type === 'success'"
                :result="stopResult.profit"
                @confirm="showStopModal = false"
            />

            <StopBlindadoAjusteModal
                :visible="showStopModal && stopResult.type === 'warning'"
                :result="stopResult.profit"
                @confirm="showStopModal = false"
            />
        </Teleport>
    </div>
</template>

<script>
import AppSidebar from '../../components/Sidebar.vue';
import TopNavbar from '../../components/TopNavbar.vue';
import SettingsSidebar from '../../components/SettingsSidebar.vue';
import { StrategyAnalysis } from '../../utils/StrategyAnalysis';
import { RiskManager } from '../../utils/RiskManager';
import MonitoringDashboard from '../../components/ActiveStrategy/MonitoringDashboard.vue';
import StopLossModal from '../../components/StopLossModal.vue';
import TargetProfitModal from '../../components/TargetProfitModal.vue';
import StopBlindadoAjusteModal from '../../components/StopBlindadoAjusteModal.vue';

import { filterDescriptions, getTranslation } from '@/utils/filterDescriptions';

export default {
    name: 'StrategyCreatorView',
    components: {
        AppSidebar,
        TopNavbar,
        SettingsSidebar,
        MonitoringDashboard,
        StopLossModal,
        TargetProfitModal,
        StopBlindadoAjusteModal
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
            showStopModal: false, // New Stop Result Modal
            stopResult: { title: '', message: '', profit: 0, type: 'info' }, // Data for Stop Modal
            isLoadingAccounts: false,
            availableAccounts: [],
            selectedToken: null,
            savedStrategies: [],
            selectedSavedStrategyId: '',
            currentVersion: '',
            currentStrategyName: '',
            recoveryFilters: [],
            modalContext: 'main', // 'main' or 'recovery'
            filterStep: 1, // 1: Selection, 2: Configuration
            activeTab: 'config',
            validator: {
                aiStarted: false,
                attackFilterCorrect: false,
                baseStakeCorrect: false,
                sorosApplied: false,
                sorosReset: false,
                recoveryModeEntered: false,
                recoveryContractSwitched: false,
                recoveryFilters: {}, // Dynamic keys based on filter.id
                martingale100: false
            },

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
                expectedPayout: 1.20, // Default for DIGITUNDER 8 (bet $1, get $1.20 total)
                directionMode: 'both', // 'both', 'up', 'down'
                directionPayouts: {}, // { [contractType]: payout }
                attackFilters: []
            },

            // Strategy Execution State
            sessionState: RiskManager.initSession('VELOZ'), // Will be re-initialized on strategy start with user's selected mode
            
            // Internal State
            isNegotiating: false,
            pendingVirtualTrade: null, // Track active simulation
            retryingProposal: false,
            
            securityConfig: {
                virtualLoss: {
                    enabled: false,
                    target: 2,
                    current: 0,
                    mode: 'warmup' // 'warmup' | 'cyclic'
                }
            },
            
            recoveryConfig: {
                enabled: true,
                market: '',
                selectedTradeTypeGroup: '',
                tradeType: '',
                prediction: 0,
                lossesToActivate: 1, // Default changed to 1 for immediate recovery (User Preference)
                martingale: true, // New field for Optional Martingale
                contractSwitch: true,
                switchToNormal: false,
                switchToPrecise: true,
                maxPreciseLosses: 3,
                pauseLosses: 6,
                pauseVolatility: 50,
                pauseTime: 5,
                expectedPayout: 2.26, // Default for DIGITUNDER 4 (bet $1, get $2.26 total)
                directionMode: 'both', // 'both', 'up', 'down'
                directionPayouts: {}, // { [contractType]: payout }
                initialStake: 1.00,
                profitTarget: 10,
                stopLoss: 50,
                active: false,
                riskProfile: 'moderado',
                attackFilters: []
            },

            // --- UI State ---
            activeConfigTab: 'Veloz', // 'Veloz', 'Moderado', 'Preciso'
            // ----------------
            
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
            pauseUntil: 0, // Timeout timestamp for mandatory pause
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
                    config: { window: 20, digits: '8,9', operator: '<', threshold: 5, unique: false }
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
                },
                // Phase 1 Filters
                {
                    id: 'parity_sequence',
                    name: 'Sequência de Paridade',
                    active: false,
                    type: 'digit',
                    desc: 'Verifica se os últimos X dígitos têm a mesma paridade.',
                    config: { length: 3, parity: 'even' }
                },
                {
                    id: 'over_under_sequence',
                    name: 'Sequência Over/Under',
                    active: false,
                    type: 'digit',
                    desc: 'Verifica se os últimos X dígitos estão acima ou abaixo de um valor.',
                    config: { length: 3, type: 'under', threshold: 5 }
                },
                {
                    id: 'price_ma',
                    name: 'Preço vs. Média Móvel',
                    active: false,
                    type: 'price',
                    desc: 'Verifica se o preço está acima ou abaixo da média móvel.',
                    config: { period: 14, type: 'SMA', op: '>' }
                },
                // Phase 2 Filters
                {
                    id: 'digit_absence',
                    name: 'Ausência de Dígito',
                    active: false,
                    type: 'digit',
                    desc: 'Verifica se um dígito não apareceu nos últimos X ticks.',
                    config: { period: 10, digit: 0 }
                },
                {
                    id: 'ma_crossover',
                    name: 'Cruzamento de Médias',
                    active: false,
                    type: 'price',
                    desc: 'Verifica cruzamento de médias móveis.',
                    config: { periodShort: 9, periodLong: 21, type: 'EMA', direction: 'up' }
                },
                {
                    id: 'rsi',
                    name: 'Índice de Força Relativa (RSI)',
                    active: false,
                    type: 'price',
                    desc: 'Verifica níveis de sobrecompra ou sobrevenda.',
                    config: { period: 14, level: 30, condition: '<' }
                },
                // Phase 3 Filters - Digits
                {
                    id: 'digit_equal_sequence',
                    name: 'Sequência Dígitos Iguais',
                    active: false,
                    type: 'digit',
                    desc: 'Verifica se últimos X ticks terminaram com dígito Y.',
                    config: { length: 3, digit: 0 }
                },
                {
                    id: 'digit_diff_sequence',
                    name: 'Sequência Dígitos Diferentes',
                    active: false,
                    type: 'digit',
                    desc: 'Verifica se últimos X ticks são todos diferentes.',
                    config: { length: 3 }
                },
                {
                    id: 'parity_alternation',
                    name: 'Alternância de Paridade',
                    active: false,
                    type: 'digit',
                    desc: 'Verifica padrão alternado (Par, Ímpar...).',
                    config: { length: 4 }
                },
                 {
                    id: 'digit_frequency',
                    name: 'Frequência de Dígito',
                    active: false,
                    type: 'digit',
                    desc: 'Contagem de dígito Y em X ticks satisfaz condição.',
                    config: { digit: 0, period: 20, op: '>=', count: 3 }
                },
                {
                    id: 'digit_average',
                    name: 'Média dos Últimos Dígitos',
                    active: false,
                    type: 'digit',
                    desc: 'Média dos últimos X dígitos é Op L.',
                    config: { period: 10, op: '>', threshold: 4.5 }
                },
                {
                    id: 'digit_position_return',
                    name: 'Dígito Retorna',
                    active: false,
                    type: 'digit',
                    desc: 'Último dígito igual ao de X ticks atrás.',
                    config: { period: 5 }
                },
                // Phase 3 Filters - Indicators
                {
                    id: 'ma_slope',
                    name: 'Inclinação da Média Móvel',
                    active: false,
                    type: 'price',
                    desc: 'Verifica se a MM está subindo ou descendo.',
                    config: { period: 14, lookback: 2, direction: 'up' }
                },
                {
                    id: 'macd',
                    name: 'MACD',
                    active: false,
                    type: 'price',
                    desc: 'Condições do MACD (Linha vs Sinal).',
                    config: { fast: 12, slow: 26, signal: 9, condition: 'cross_up' }
                },
                {
                    id: 'stochastic',
                    name: 'Estocástico',
                    active: false,
                    type: 'price',
                    desc: 'Condições do Estocástico.',
                    config: { k: 14, d: 3, smooth: 3, condition: 'oversold', level: 20 }
                },
                {
                    id: 'bollinger_bands',
                    name: 'Bandas de Bollinger',
                    active: false,
                    type: 'price',
                    desc: 'Preço em relação às bandas.',
                    config: { period: 20, stdDev: 2, condition: 'cross_lower' }
                },
                {
                    id: 'bb_width',
                    name: 'Largura BB (Volatilidade)',
                    active: false,
                    type: 'price',
                    desc: 'Largura aumentando ou diminuindo.',
                    config: { period: 20, stdDev: 2, lookback: 5, direction: 'increasing' }
                },
                {
                    id: 'price_action',
                    name: 'Sequência de Ticks (PA)',
                    active: false,
                    type: 'price',
                    desc: 'Sequência de ticks de alta ou baixa.',
                    config: { length: 3, direction: 'rise' }
                },
                // Phase 3 Filters - Specific
                {
                    id: 'spike_detect',
                    name: 'Detecção de Spike',
                    active: false,
                    type: 'price',
                    desc: 'Detecta movimento brusco (Crash/Boom).',
                    config: { multiplier: 5, window: 10 }
                },
                {
                    id: 'step_pattern',
                    name: 'Padrão Step Index',
                    active: false,
                    type: 'price',
                    desc: 'Lateralização seguida de salto.',
                    config: { rangeTicks: 10, jumpThreshold: 50 }
                }
            ],

            allTradeTypes: [
                { value: 'CALL', label: 'Rise' }, { value: 'PUT', label: 'Fall' },
                { value: 'DIGITMATCH', label: 'Matches' }, { value: 'DIGITDIFF', label: 'Differs' },
                { value: 'DIGITEVEN', label: 'Even' }, { value: 'DIGITODD', label: 'Odd' },
                { value: 'DIGITOVER', label: 'Over' }, { value: 'DIGITUNDER', label: 'Under' },
                { value: 'CALLE', label: 'Rise Equal' }, { value: 'PUTE', label: 'Fall Equal' },
                { value: 'ACCU', label: 'Accumulators' },
                { value: 'MULTUP', label: 'Up' }, { value: 'MULTDOWN', label: 'Down' },
                { value: 'ONETOUCH', label: 'Touch' }, { value: 'NOTOUCH', label: 'No Touch' },
                { value: 'HIGHER', label: 'Higher' }, { value: 'LOWER', label: 'Lower' },
                { value: 'RANGE', label: 'Ends Between' }, { value: 'UPORDOWN', label: 'Ends Outside' },
                { value: 'EXPIRYRANGE', label: 'Ends Between' }, { value: 'EXPIRYMISS', label: 'Ends Outside' },
            ],
            tradeTypeCategories: [
                {
                  id: 'digits',
                  label: 'Digits',
                  icon: 'fas fa-hashtag',
                  items: [
                    { value: 'digits_over_under', label: 'Over / Under', icon: 'TradeTypesDigitsOverIcon.svg', directions: [
                        { value: 'DIGITOVER', label: 'Over' },
                        { value: 'DIGITUNDER', label: 'Under' }
                      ]
                    },
                    { value: 'digits_match_diff', label: 'Matches / Differs', icon: 'TradeTypesDigitsMatchesIcon.svg', directions: [
                        { value: 'DIGITMATCH', label: 'Matches' },
                        { value: 'DIGITDIFF', label: 'Differs' }
                      ]
                    },
                    { value: 'digits_even_odd', label: 'Even / Odd', icon: 'TradeTypesDigitsEvenIcon.svg', directions: [
                        { value: 'DIGITEVEN', label: 'Even' },
                        { value: 'DIGITODD', label: 'Odd' }
                      ]
                    }
                  ]
                },
                {
                  id: 'rising_falling',
                  label: 'Rise / Fall',
                  icon: 'fas fa-chart-line',
                  items: [
                    { value: 'rising_falling_rise_fall_equal', label: 'Rise/Fall Equal', icon: 'TradeTypesUpsAndDownsRiseIcon.svg', directions: [
                        { value: 'CALLE', label: 'Rise Equal' },
                        { value: 'PUTE', label: 'Fall Equal' }
                      ]
                    },
                    { value: 'rising_falling_rise_fall', label: 'Rise / Fall', icon: 'TradeTypesUpsAndDownsRiseIcon.svg', directions: [
                        { value: 'CALL', label: 'Rise' },
                        { value: 'PUT', label: 'Fall' }
                      ] 
                    },
                    { value: 'reset_high_low', label: 'Reset Call / Put', icon: 'TradeTypesUpsAndDownsResetUpIcon.svg', directions: [
                        { value: 'RESETCALL', label: 'Reset Call' },
                        { value: 'RESETPUT', label: 'Reset Put' }
                      ]
                    },
                    { value: 'runs_high_low', label: 'High / Low Ticks', icon: 'TradeTypesUpsAndDownsOnlyUpsIcon.svg', directions: [
                        { value: 'RUNHIGH', label: 'High Ticks' },
                        { value: 'RUNLOW', label: 'Low Ticks' }
                      ]
                    },
                    { value: 'tick_high_low', label: 'High / Low', icon: 'TradeTypesHighsAndLowsHighIcon.svg', directions: [
                        { value: 'TICKHIGH', label: 'High' },
                        { value: 'TICKLOW', label: 'Low' }
                      ]
                    }
                  ]
                },
                {
                  id: 'one_barrier',
                  label: 'One Barrier',
                  icon: 'fas fa-bullseye',
                  items: [
                    { value: 'touch_no_touch', label: 'Touch / No Touch', icon: 'TradeTypesHighsAndLowsTouchIcon.svg', directions: [
                        { value: 'ONETOUCH', label: 'Touch' },
                        { value: 'NOTOUCH', label: 'No Touch' }
                      ]
                    },
                    { value: 'higher_lower', label: 'Higher / Lower', icon: 'TradeTypesHighsAndLowsHigherIcon.svg', directions: [
                        { value: 'HIGHER', label: 'Higher' },
                        { value: 'LOWER', label: 'Lower' }
                      ]
                    }
                  ]
                },
                {
                  id: 'two_barriers',
                  label: 'Two Barriers',
                  icon: 'fas fa-shield-alt',
                  items: [
                    { value: 'in_out', label: 'Ends In / Ends Out', icon: 'TradeTypesInsAndOutsStaysInIcon.svg', directions: [
                        { value: 'RANGE', label: 'Ends Between' },
                        { value: 'UPORDOWN', label: 'Ends Outside' }
                      ]
                    },
                    { value: 'ends_in_out', label: 'Ends In / Ends Out (Expiry)', icon: 'TradeTypesInsAndOutsEndsInIcon.svg', directions: [
                        { value: 'EXPIRYRANGE', label: 'Ends Between' },
                        { value: 'EXPIRYMISS', label: 'Ends Outside' }
                      ]
                    }
                  ]
                },
                {
                  id: 'no_expiry',
                  label: 'No Expiry',
                  icon: 'fas fa-bolt',
                  items: [
                    { value: 'multipliers_mult', label: 'Multipliers', icon: 'TradeTypesMultipliersUpIcon.svg', directions: [
                        { value: 'MULTUP', label: 'Up' },
                        { value: 'MULTDOWN', label: 'Down' }
                      ]
                    },
                    { value: 'accumulators_accu', label: 'Accumulators', icon: 'TradeTypesAccumulatorStayInIcon.svg', directions: [
                        { value: 'ACCU', label: 'Accumulators' }
                      ]
                    }
                  ]
                }
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
        activeAttackFilters() {
            return this.filters.filter(f => f.active);
        },
        activeRecoveryFilters() {
            return this.recoveryFilters.filter(f => f.active);
        },
        selectedMarketLabel() {
            const market = this.markets.find(m => m.symbol === this.form.market); // Using 'symbol' property usually used in StrategyCreator
            if (market) return market.displayName || market.label;
            
            // Try matching by value if symbol not found (fallback)
            const marketByValue = this.markets.find(m => m.value === this.form.market);
            return marketByValue ? marketByValue.label : 'Selecione um mercado';
        },

        availableContracts() {
            if (!this.contracts || this.contracts.length === 0) return [];
            return this.contracts.map(c => c.contractType.toUpperCase());
        },
        availableRecoveryContracts() {
            if (!this.recoveryContracts || this.recoveryContracts.length === 0) return [];
            return this.recoveryContracts.map(c => c.contractType.toUpperCase());
        },
        // Helpers to get the current list based on context
        currentContextContracts() {
            return this.modalContext === 'main' ? this.contracts : this.recoveryContracts;
        },
        
        // DYNAMIC GENERATION OF CATEGORIES
        availableTradeTypeGroups() {
            // Filter categories and items based on available contracts
            const availableTypes = this.currentContextContracts.map(c => c.contractType.toUpperCase());
            
            return this.tradeTypeCategories.map(category => {
                const filteredItems = category.items.filter(item => {
                    // Item is shown if ANY of its directions are available
                    return item.directions.some(dir => availableTypes.includes(dir.value.toUpperCase()));
                });
                
                if (filteredItems.length > 0) {
                    return {
                        ...category,
                        items: filteredItems
                    };
                }
                return null;
            }).filter(Boolean);
        },
        
        activeFiltersForModal() {
            return this.modalContext === 'main' ? this.filters : this.recoveryFilters;
        },

        groupedFiltersForModal() {
            const filters = this.activeFiltersForModal;
            const groups = [
                {
                    id: 'digits',
                    label: 'Análise de Dígito',
                    icon: 'fas fa-hashtag',
                    filters: filters.filter(f => f.type === 'digit')
                },
                {
                    id: 'indicators',
                    label: 'Análise de Preço (Indicadores)',
                    icon: 'fas fa-chart-line',
                    filters: filters.filter(f => f.type === 'price' && !['spike_detect', 'step_pattern'].includes(f.id))
                },
                {
                    id: 'specific',
                    label: 'Análise de Mercados Específicos',
                    icon: 'fas fa-microchip',
                    filters: filters.filter(f => ['spike_detect', 'step_pattern'].includes(f.id))
                }
            ];
            return groups.filter(g => g.filters.length > 0);
        },
        
        // --- Label Helpers using Contracts Data directly ---
        selectedTradeTypeGroupLabel() {
             if (!this.form.selectedTradeTypeGroup) return 'Selecionar Tipo';
             // Check in static categories
             for (const cat of this.tradeTypeCategories) {
                 const item = cat.items.find(i => i.value === this.form.selectedTradeTypeGroup);
                 if (item) return item.label;
             }
             return this.form.selectedTradeTypeGroup;
        },
        selectedTradeTypeLabel() {
            if (!this.form.tradeType) return 'Selecionar';
            const c = this.contracts.find(x => x.contractType === this.form.tradeType);
            return c ? `${c.contractDisplay}` : this.form.tradeType;
        },
        selectedTradeTypeIcon() {
            if (!this.form.selectedTradeTypeGroup) return null;
             for (const cat of this.tradeTypeCategories) {
                 const item = cat.items.find(i => i.value === this.form.selectedTradeTypeGroup);
                 // Use specific item icon if available, otherwise category icon could be used but item icon is preferred
                 if (item && item.icon) return `/deriv_icons/${item.icon}`;
             }
            // Fallback to contract type check if needed
            return null;
        },

        selectedDirections() {
            if (!this.form.selectedTradeTypeGroup) return [];
            for (const cat of this.tradeTypeCategories) {
                const item = cat.items.find(i => i.value === this.form.selectedTradeTypeGroup);
                if (item) return item.directions;
            }
            return [];
        },
        
        // Recovery Labels
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
             return this.recoveryConfig.selectedTradeTypeGroup;
        },
        selectedRecoveryTradeTypeGroupIcon() {
            if (!this.recoveryConfig.selectedTradeTypeGroup) return null;
            for (const cat of this.tradeTypeCategories) {
                 const item = cat.items.find(i => i.value === this.recoveryConfig.selectedTradeTypeGroup);
                 if (item && item.icon) return `/deriv_icons/${item.icon}`;
             }
            return null;
        },
        selectedRecoveryTradeTypeLabel() {
            if (!this.recoveryConfig.tradeType) return 'Selecionar';
            const c = this.recoveryContracts.find(x => x.contractType === this.recoveryConfig.tradeType);
            return c ? `${c.contractDisplay}` : this.recoveryConfig.tradeType;
        },
        selectedRecoveryTradeTypeIcon() {
             if (!this.recoveryConfig.selectedTradeTypeGroup) return null;
            for (const cat of this.tradeTypeCategories) {
                 const item = cat.items.find(i => i.value === this.recoveryConfig.selectedTradeTypeGroup);
                 if (item && item.icon) return `/deriv_icons/${item.icon}`;
             }
            return null;
        },

        selectedRecoveryDirections() {
            if (!this.recoveryConfig.selectedTradeTypeGroup) return [];
            for (const cat of this.tradeTypeCategories) {
                const item = cat.items.find(i => i.value === this.recoveryConfig.selectedTradeTypeGroup);
                if (item) return item.directions;
            }
            return [];
        },
        
        activeAttackFilterNames() {
            if (!this.form.attackFilters || !this.form.attackFilters.length) return '';
            return this.form.attackFilters.map(f => f.name).join(', ');
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
            this.filterStep = 1; // Always start at selection list
            this.showFilterModal = true;
        },
        toggleFilter(filter) {
            console.log(`[toggleFilter] Clicked: ${filter.name} (${filter.id}) | Current Active: ${filter.active}`);
            
            const targetArray = this.modalContext === 'main' ? this.filters : this.recoveryFilters;
            const index = targetArray.findIndex(f => f.id === filter.id);

            if (index === -1) return;

            // If already active, just close (or maybe user clicked by mistake)
            if (filter.active) {
                this.showFilterModal = false;
                return;
            }

            // Force Reactivity: Create new object and splice it in
            const newFilter = { ...filter, active: true };
            targetArray.splice(index, 1, newFilter);
            
            // Close Modal Immediately
            this.showFilterModal = false;
        },
        
        removeFilter(filter, context) {
             const targetArray = context === 'main' ? this.filters : this.recoveryFilters;
             const index = targetArray.findIndex(f => f.id === filter.id);
             
             if (index !== -1) {
                 const newFilter = { ...filter, active: false };
                 targetArray.splice(index, 1, newFilter);
                 this.$root.$toast.info(`Filtro ${filter.name} removido.`);
             }
        },
        
        getTradeTypeIconName(type) {
            type = type.toUpperCase();
            if (['CALL', 'PUT', 'CALLE', 'PUTE', 'RISE', 'FALL', 'EXPIRYRANGE', 'EXPIRYMISS', 'RANGE', 'UPORDOWN'].some(t => type.includes(t))) return 'TradeTypesRiseFallIcon.svg';
            if (['DIGITEVEN', 'DIGITODD'].some(t => type.includes(t))) return 'TradeTypesEvenOddIcon.svg';
            if (['DIGITOVER', 'DIGITUNDER'].some(t => type.includes(t))) return 'TradeTypesOverUnderIcon.svg';
            if (['DIGITMATCH', 'DIGITDIFF'].some(t => type.includes(t))) return 'TradeTypesMatchDiffIcon.svg';
            if (['ONETOUCH', 'NOTOUCH'].some(t => type.includes(t))) return 'TradeTypesTouchNoTouchIcon.svg'; // Check file name validity? Assuming standard naming convention or using generic
            // Fallback
            return 'TradeTypesRiseFallEqualIcon.svg';
        },


        openFilterConfigDirect(filter, context) {
            this.modalContext = context;
            this.filterStep = 2;
            this.showFilterModal = true;
        },

        prevFilterStep() {
            this.filterStep = 1;
        },

        // --- Triple Config Helper ---
        getFilterConfig(filter) {
            // If legacy config (unified), migrate to triple config
            if (!filter.config.veloz) {
                const baseConfig = { ...filter.config };
                // Direct mutation is reactive in Vue 2 if key exists, but for new keys use $set or reassignment
                // But typically for object properties added later, we need Vue.set or reassignment
                // Best practice: Reassign the whole object to ensure reactivity
                filter.config = {
                    veloz: { ...baseConfig },
                    normal: { ...baseConfig },
                    preciso: { ...baseConfig }
                };
            }
            return filter.config;
        },
        getFilterDescription(filter) {
            const descData = filterDescriptions[filter.id];
            if (!descData) return null;

            const config = this.getFilterConfig(filter)[this.activeConfigTab ? this.activeConfigTab.toLowerCase() === 'moderado' ? 'normal' : this.activeConfigTab.toLowerCase() : 'normal'];
            let text = descData.template;

            // Replace placeholders with values
            for (const [key, value] of Object.entries(config)) {
                const placeholder = `{${key}}`;
                text = text.replace(new RegExp(placeholder, 'g'), value);
                
                // Also try translated values
                const translated = getTranslation(`${key}_translated`, value);
                const translatedPlaceholder = `{${key}_translated}`;
                text = text.replace(new RegExp(translatedPlaceholder, 'g'), translated);
            }
            
            return {
                title: descData.title,
                loftop: descData.loftop,
                text: text
            };
        },
        // ----------------------------

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
        // ✅ Helper to sync filter edits to form/recoveryConfig before saving
        syncFiltersToConfig() {
            // Sync main filters
            this.form.attackFilters = this.filters
                .filter(f => f.active)
                .map(f => ({
                    id: f.id,
                    name: f.name,
                    config: JSON.parse(JSON.stringify(f.config))
                }));
            
            // Sync recovery filters
            this.recoveryConfig.attackFilters = this.recoveryFilters
                .filter(f => f.active)
                .map(f => ({
                    id: f.id,
                    name: f.name,
                    config: JSON.parse(JSON.stringify(f.config))
                }));
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
            // Determine the default direction (Contract Type)
            const contracts = this.modalContext === 'main' ? this.contracts : this.recoveryContracts;
            const availableTypes = contracts.map(c => c.contractType.toUpperCase());
            
            // Find first direction that exists in available contracts
            let selectedDirection = item.directions.find(d => availableTypes.includes(d.value.toUpperCase()));
            
            // Fallback if none found
            if (!selectedDirection) {
                selectedDirection = item.directions[0]; 
            }

            if (this.modalContext === 'main') {
                this.form.selectedTradeTypeGroup = item.value; // Store Item Value for UI
                
                // ✅ Respect Direction Mode: If AMBOS is selected, tradeType MUST be empty
                if (this.form.directionMode === 'both') {
                    this.form.tradeType = '';
                    console.log(`[selectTradeType] Modal: AMBOS mode detected, clearing tradeType for dynamic signaling`);
                } else {
                    this.form.tradeType = selectedDirection.value; // Store Actual Contract Type for API
                }
                
                // Initialize Direction Payouts
                this.form.directionPayouts = {};
                item.directions.forEach(d => {
                    this.form.directionPayouts[d.value] = this.form.expectedPayout || 1.20;
                });
            } else {
                this.recoveryConfig.selectedTradeTypeGroup = item.value;

                // ✅ Respect Direction Mode (Recovery)
                if (this.recoveryConfig.directionMode === 'both') {
                    this.recoveryConfig.tradeType = '';
                    console.log(`[selectTradeType] Modal (REC): AMBOS mode detected, clearing tradeType`);
                } else {
                    this.recoveryConfig.tradeType = selectedDirection.value;
                }

                // Initialize Direction Payouts
                this.recoveryConfig.directionPayouts = {};
                item.directions.forEach(d => {
                    this.recoveryConfig.directionPayouts[d.value] = this.recoveryConfig.expectedPayout || 2.26;
                });
            }
            
            this.$root.$toast.success(`Selecionado: ${item.label} (${selectedDirection.label})`);
            this.closeTradeTypeModal();
        },
        
        // ✅ NEW: Auto-update tradeType when direction mode changes
        updateRecoveryDirection(mode, specificType = null) {
            this.recoveryConfig.directionMode = mode;
            
            if (mode === 'both') {
                this.recoveryConfig.tradeType = ''; // Clear to allow dynamic direction
                console.log(`[updateRecoveryDirection] Direction: both, TradeType cleared for dynamic signals`);
            } else if (specificType) {
                this.recoveryConfig.tradeType = specificType;
                console.log(`[updateRecoveryDirection] Direction: ${mode}, TradeType updated to: ${specificType}`);
                this.$root.$toast.success(`Tipo de contrato atualizado para: ${specificType}`);
            }
        },
        
        updatePrincipalDirection(mode, specificType = null) {
            this.form.directionMode = mode;
            
            if (mode === 'both') {
                this.form.tradeType = ''; // Clear to allow dynamic direction
                console.log(`[updatePrincipalDirection] Direction: both, TradeType cleared for dynamic signals`);
            } else if (specificType) {
                this.form.tradeType = specificType;
                console.log(`[updatePrincipalDirection] Direction: ${mode}, TradeType updated to: ${specificType}`);
                this.$root.$toast.success(`Tipo de contrato atualizado para: ${specificType}`);
            }
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

            // ✅ Sync with Global State for TopNavbar and Mixin
            const connection = {
                token: account.token,
                loginid: account.loginid,
                isDemo: account.isDemo
            };
            localStorage.setItem('deriv_connection', JSON.stringify(connection));
            localStorage.setItem('deriv_account_type', account.isDemo ? 'demo' : 'real');
            
            // Update local state to force UI refresh
            this.accountType = account.isDemo ? 'demo' : 'real';

            this.showAccountModal = false;
            this.submitForm();
        },
        submitForm() {
            if (!this.selectedToken) {
                this.handleStartClick();
                return;
            }
            this.isMonitoring = true;
            
            // Populate extra fields for MonitoringDashboard UI
            this.sessionState.strategy = this.selectedSavedStrategyId 
                ? (this.savedStrategies.find(s => s.id === this.selectedSavedStrategyId)?.name || 'Custom')
                : 'Custom Strategy';
            this.sessionState.mode = this.sessionState.negotiationMode || 'VELOZ';
            this.sessionState.modoMartingale = this.form.riskProfile || 'Moderado';
            // ✅ Explicitly save Martingale Boolean
            this.sessionState.martingale = this.recoveryConfig.martingale !== false; 
            this.recoveryConfig.riskProfile = this.form.riskProfile || 'moderado';
            this.sessionState.stake = this.form.initialStake;
            this.sessionState.profitTarget = this.form.profitTarget;
            this.sessionState.lossLimit = this.form.stopLoss;
            this.sessionState.stoplossBlindado = this.form.useBlindado || false;
            // ✅ Pass Version
            this.sessionState.version = this.currentVersion || '1.0';

            this.startSimulation();
            this.$root.$toast.success('Estratégia iniciada com sucesso!');
        },

        // --- Local Strategy Library Methods ---
        async loadStrategiesFromStorage() {
            try {
                const stored = localStorage.getItem('zeenix_saved_strategies');
                let userStrategies = stored ? JSON.parse(stored) : [];

                // ✅ Load default strategies from API (always fresh)
                const defaultStrategyNames = ['apollo', 'atlas', 'nexus', 'orion', 'titan'];
                const apiBase = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                const token = localStorage.getItem('token');

                for (const strategyName of defaultStrategyNames) {
                    try {
                        const response = await fetch(`${apiBase}/strategies/${strategyName}`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });

                        if (response.ok) {
                            const { data } = await response.json();
                            const strategyConfig = {
                                id: `default_${strategyName}`,
                                name: strategyName.charAt(0).toUpperCase() + strategyName.slice(1),
                                version: data.version || '1.0',
                                config: data.config
                            };

                            const index = userStrategies.findIndex(s => s.id === strategyConfig.id);
                            if (index !== -1) {
                                // Update existing default strategy with fresh data
                                userStrategies[index] = strategyConfig;
                            } else {
                                // Add new default strategy
                                userStrategies.push(strategyConfig);
                            }
                        }
                    } catch (error) {
                        console.error(`[StrategyCreator] Failed to load ${strategyName} from API:`, error);
                    }
                }

                this.savedStrategies = userStrategies;
            } catch (e) {
                console.error('Erro ao carregar estratégias:', e);
                this.savedStrategies = [];
            }
        },

        incrementVersion(currentVersion) {
            if (!currentVersion) return '1.0';
            let [major, minor] = currentVersion.split('.').map(Number);
            minor++;
            if (minor > 100) {
                major++;
                minor = 0;
            }
            return `${major}.${minor}`;
        },

        async saveCurrentStrategy() {
            const name = prompt('Nome da estratégia:', `Minha Estratégia ${new Date().toLocaleDateString()}`);
            if (!name) return;

            // ✅ Sync filter edits before saving
            this.syncFiltersToConfig();

            const newStrategy = {
                id: Date.now().toString(),
                name: name,
                version: '1.0', // Start at version 1.0
                config: {
                    form: JSON.parse(JSON.stringify(this.form)),
                    recoveryConfig: JSON.parse(JSON.stringify(this.recoveryConfig)),
                    validator: JSON.parse(JSON.stringify(this.validator)),
                    securityConfig: JSON.parse(JSON.stringify(this.securityConfig))
                }
            };

            // ✅ Save to server as JSON file
            try {
                const apiBase = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                const token = localStorage.getItem('token');
                const strategyFileName = name.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '_');

                await fetch(`${apiBase}/strategies/${strategyFileName}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newStrategy)
                });

                console.log(`[StrategyCreator] Saved ${strategyFileName}.json to server`);
            } catch (error) {
                console.error('[StrategyCreator] Error saving strategy to server:', error);
            }

            this.savedStrategies.push(newStrategy);
            localStorage.setItem('zeenix_saved_strategies', JSON.stringify(this.savedStrategies));
            this.selectedSavedStrategyId = newStrategy.id;
            this.currentStrategyName = newStrategy.name;
            this.currentVersion = newStrategy.version;
            this.$root.$toast.success('Estratégia salva com sucesso!');
        },

        loadSavedStrategy() {
            const strategy = this.savedStrategies.find(s => s.id === this.selectedSavedStrategyId);
            if (!strategy) return;

            // Deep clone to avoid proxy issues
            // Deep clone and merge to ensure new fields (like expectedPayout) are present
            const savedForm = JSON.parse(JSON.stringify(strategy.config.form));
            this.form = { ...this.form, ...savedForm };

            // ✅ Load Validation: If directionMode is 'both', tradeType MUST be empty for dynamic signaling
            if (this.form.directionMode === 'both') {
                this.form.tradeType = '';
                console.log(`[loadSavedStrategy] Main: AMBOS detected, clearing tradeType`);
            }

            // Ensure expectedPayout and sorosLevel fallback for legacy saves
            if (!this.form.expectedPayout) this.form.expectedPayout = 1.20;
            if (this.form.sorosLevel === undefined) this.form.sorosLevel = 1;
            if (!this.form.duration) this.form.duration = 5; // Default safety
            if (!this.form.durationUnit) this.form.durationUnit = 't';

            const savedRecovery = JSON.parse(JSON.stringify(strategy.config.recoveryConfig));
            this.recoveryConfig = { ...this.recoveryConfig, ...savedRecovery };

            // ✅ Load Validation (Recovery)
            if (this.recoveryConfig.directionMode === 'both') {
                this.recoveryConfig.tradeType = '';
                console.log(`[loadSavedStrategy] Recovery: AMBOS detected, clearing tradeType`);
            }

            if (!this.recoveryConfig.expectedPayout) this.recoveryConfig.expectedPayout = 2.26;
            
            if (strategy.config.validator) {
                const savedValidator = JSON.parse(JSON.stringify(strategy.config.validator));
                this.validator = { 
                    ...this.validator, 
                    ...savedValidator,
                    recoveryFilters: { ...(this.validator.recoveryFilters || {}), ...(savedValidator.recoveryFilters || {}) }
                };
            }

            if (strategy.config.securityConfig) {
                const savedSecurity = JSON.parse(JSON.stringify(strategy.config.securityConfig));
                if (savedSecurity.virtualLoss) {
                    this.securityConfig.virtualLoss = {
                        ...this.securityConfig.virtualLoss,
                        ...savedSecurity.virtualLoss,
                        current: 0
                    };
                }
            }

            // Restore filters active state for main
            this.filters.forEach((f, index) => {
                const active = this.form.attackFilters.find(af => af.id === f.id);
                // Force reactivity using splice
                const newFilter = { ...f, active: !!active };
                if (active) newFilter.config = { ...active.config };
                this.filters.splice(index, 1, newFilter);
            });

            // Restore filters active state for recovery
            this.recoveryFilters.forEach((f, index) => {
                const active = this.recoveryConfig.attackFilters.find(af => af.id === f.id);
                // Force reactivity using splice
                const newFilter = { ...f, active: !!active };
                if (active) newFilter.config = { ...active.config };
                this.recoveryFilters.splice(index, 1, newFilter);
            });

            // ✅ ENFORCE: If Martingale is disabled, force Conservador
            if (this.recoveryConfig.martingale === false) {
                 this.form.riskProfile = 'conservador';
                 // Optional: Debug log
                 console.log('[loadSavedStrategy] Martingale OFF -> Enforcing Risk Profile: Conservador');
            }

            // Set current strategy info for display
            this.currentStrategyName = strategy.name;
            this.currentVersion = strategy.version || '1.0';

            this.addLog(`📂 Estratégia carregada: ${strategy.name} (v${this.currentVersion})`, 'info');
            this.$root.$toast.success(`Estratégia "${strategy.name}" carregada!`);
        },

        async updateCurrentStrategy() {
            if (!this.selectedSavedStrategyId) return;
            
            // Find the index of the strategy to update
            const strategyIndex = this.savedStrategies.findIndex(s => s.id === this.selectedSavedStrategyId);
            if (strategyIndex === -1) return;
            
            const strategy = this.savedStrategies[strategyIndex];

            // ✅ Sync filter edits before updating
            this.syncFiltersToConfig();

            // Calculate new version
            const newVersion = this.incrementVersion(strategy.version || '1.0');

            // Create a completely new strategy object to avoid reference issues
            const updatedStrategy = {
                id: strategy.id,
                name: strategy.name,
                version: newVersion, // Increment version
                config: {
                    form: JSON.parse(JSON.stringify(this.form)),
                    recoveryConfig: JSON.parse(JSON.stringify(this.recoveryConfig)),
                    securityConfig: JSON.parse(JSON.stringify(this.securityConfig)),
                    validator: JSON.parse(JSON.stringify(this.validator))
                }
            };

            // ✅ If updating a default strategy, save to server JSON file
            const defaultStrategyNames = ['apollo', 'atlas', 'nexus', 'orion', 'titan'];
            const strategyName = strategy.name.toLowerCase().trim();
            
            if (defaultStrategyNames.includes(strategyName) || strategy.id.startsWith('default_')) {
                try {
                    const apiBase = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                    const token = localStorage.getItem('token');
                    
                    const response = await fetch(`${apiBase}/strategies/${strategyName}`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updatedStrategy)
                    });

                    if (!response.ok) {
                        throw new Error('Falha ao atualizar arquivo da estratégia');
                    }

                    console.log(`[StrategyCreator] Updated ${strategyName}.json on server`);
                } catch (error) {
                    console.error('[StrategyCreator] Error updating strategy file:', error);
                    this.$root.$toast.error('Erro ao salvar no servidor. Alterações salvas localmente.');
                }
            }

            // Replace the strategy at the specific index
            this.savedStrategies.splice(strategyIndex, 1, updatedStrategy);
            
            // Update current display
            this.currentVersion = newVersion;
            
            // Save to localStorage
            localStorage.setItem('zeenix_saved_strategies', JSON.stringify(this.savedStrategies));
            this.$root.$toast.success(`IA Atualizada com sucesso! (v${newVersion})`);
        },

        deleteSavedStrategy() {
            if (!confirm('Tem certeza que deseja excluir esta estratégia?')) return;
            
            this.savedStrategies = this.savedStrategies.filter(s => s.id !== this.selectedSavedStrategyId);
            localStorage.setItem('zeenix_saved_strategies', JSON.stringify(this.savedStrategies));
            this.selectedSavedStrategyId = '';
            this.$root.$toast.info('Estratégia excluída.');
        },

        exportToJSON() {
            // ✅ Sync filter edits before exporting
            this.syncFiltersToConfig();

            const strategyData = {
                version: this.currentVersion || '1.0',
                timestamp: new Date().toISOString(),
                config: {
                    form: this.form,
                    recoveryConfig: this.recoveryConfig,
                    validator: this.validator,
                    securityConfig: this.securityConfig
                }
            };

            console.log('[StrategyCreator] Exporting strategy to JSON:', strategyData);
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
                        // Merge logic to preserve new fields
                        const importedForm = JSON.parse(JSON.stringify(data.config.form));
                        this.form = { ...this.form, ...importedForm };
                        if (!this.form.expectedPayout) this.form.expectedPayout = 1.20;
                        if (this.form.sorosLevel === undefined) this.form.sorosLevel = 1;
                        // Duration defaults
                        if (!this.form.duration) this.form.duration = 5; 
                        if (!this.form.durationUnit) this.form.durationUnit = 't';

                        const importedRecovery = JSON.parse(JSON.stringify(data.config.recoveryConfig));
                        this.recoveryConfig = { ...this.recoveryConfig, ...importedRecovery };
                        if (!this.recoveryConfig.expectedPayout) this.recoveryConfig.expectedPayout = 2.26;
                        
                        if (data.config.validator) {
                            const importedValidator = JSON.parse(JSON.stringify(data.config.validator));
                            this.validator = { 
                                ...this.validator, 
                                ...importedValidator,
                                recoveryFilters: { ...(this.validator.recoveryFilters || {}), ...(importedValidator.recoveryFilters || {}) }
                            };
                        }

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
                `• Agente: ${this.sessionState.strategy?.toUpperCase() || 'CUSTOM'} (Strategy Creator)<br>` +
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
                            this.retryingProposal = false; // ✅ Reset deadlocked flag
                        } else {
                            const proposalId = msg.proposal.id;
                            const payout = msg.proposal.payout;
                            const stakeValue = msg.proposal.ask_price;
                            
                            this.addLog(`🔍 Proposta recebida: Payout $${payout} (Stake: $${stakeValue})`, 'info');
                            
                            // 1. Update sessionState with the real PROFIT RATE for accuracy in next calculations
                            // Deriv Payout = Stake + Profit. 
                            const realPayoutRate = payout / stakeValue;
                            
                            if (this.sessionState.analysisType === 'RECUPERACAO') {
                                this.sessionState.lastPayoutRecovery = realPayoutRate;
                            } else {
                                this.sessionState.lastPayoutPrincipal = realPayoutRate;
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
                                
                                RiskManager.updatePayoutHistory(prefix + cType + barrierSuffix, realPayoutRate);
                            }

                            // 2. CHECK IF STAKE ADJUSTMENT IS NEEDED
                            if (this.sessionState.analysisType === 'RECUPERACAO') {
                                const activeStrategy = this.sessionState.activeStrategy === 'RECUPERACAO' ? 'RECUPERACAO' : 'PRINCIPAL';
                                const config = {
                                    ...this.form,
                                    ...(activeStrategy === 'RECUPERACAO' ? this.recoveryConfig : {}),
                                    // FORCE GLOBAL LIMITS (Do not allow recovery default 50/10 to overwrite)
                                    stopLoss: this.form.stopLoss,
                                    profitTarget: this.form.profitTarget
                                };
                                
                                // Debug: Check if PayoutHistory was updated
                                // console.log('DEBUG PAYOUT:', cType, RiskManager.payoutHistory[cType]);

                                // We manually temporarily inject the just-learned payout history into the calculation
                                // BETTER: We now pass it explicitly to ensure precision regardless of history state
                                let exactStake = RiskManager.calculateNextStake(this.sessionState, config, realPayoutRate);
                                
                                // ✅ SURVIVAL MODE CHECK (AGAIN)
                                // Prevent Martingale Calibration from creating an unsafe stake
                                const currentProfit = this.monitoringStats.profit || 0; 
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

                                // ✅ CRITICAL: Check Minimum Stake During Calibration
                                if (exactStake < 0.35) {
                                  this.addLog('🛑 STOP PROTEÇÃO (Calibração)', [
                                      `Margem insuficiente após calibração`,
                                      `Stake: $${exactStake.toFixed(2)}`,
                                      `Mínimo: $0.35`
                                  ], 'error');
                                  this.stopMonitoring('Stop de Segurança (Stake < 0.35)');
                                  return; // Abort
                                }
                                
                                // Tolerance check
                                if (Math.abs(exactStake - stakeValue) > 0.02) {
                                    this.addLog(`⚠️ Calibrando Martingale: Payout ${realPayoutRate.toFixed(2)}x pede $${exactStake.toFixed(2)} (Era $${stakeValue})`, 'warning');
                                    
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
                            
                            // 🛑 FINAL SAFETY CHECK BEFORE BUY
                            // Re-verify if the stake we are about to pay is safe
                            // Define needed variables locally to avoid reference errors
                            // ✅ FIX: Start with Global Config (this.form) to ensure stopLoss/profitTarget are present
                            const localConfig = {
                                ...this.form,
                                ...(this.sessionState.analysisType === 'RECUPERACAO' ? this.recoveryConfig : {}),
                                // FORCE GLOBAL LIMITS
                                stopLoss: this.form.stopLoss,
                                profitTarget: this.form.profitTarget
                            };
                            
                            const localBlindadoState = {
                                active: this.sessionState.stopBlindadoActive,
                                floor: this.sessionState.stopBlindadoFloor
                            };

                            const preBuyLimit = RiskManager.applySurvivalMode(stakeValue, (this.monitoringStats.profit || 0), localConfig, 1.0, localBlindadoState);
                            
                            // If the stake we are about to pay ($7.53) is significantly higher than the safe limit ($5.46)
                            // Allow small tolerance (e.g. 0.05) for rounding
                            if (stakeValue > (preBuyLimit.stake + 0.05)) {
                                this.addLog('🛑 COMPRA BLOQUEADA (Safety Net)', [
                                    `Tentativa de compra acima do limite seguro`,
                                    `Stake Tentativa: $${stakeValue.toFixed(2)}`,
                                    `Limite Seguro: $${preBuyLimit.stake.toFixed(2)}`,
                                    `Motivo: ${preBuyLimit.reason}`
                                ], 'error');
                                
                                // Retrying with SAFE stake
                                if (!this.retryingProposal) {
                                    this.retryingProposal = true;
                                    const newParams = { ...msg.echo_req, amount: preBuyLimit.stake };
                                    delete newParams.req_id;
                                    delete newParams.is_retry;
                                    this.ws.send(JSON.stringify(newParams));
                                } else {
                                    // Deadlock Fix: If we already retried and it's STILL blocked, abort.
                                    this.addLog('⚠️ Cancelando negociação: Ajuste de segurança falhou ou limite atingido.', 'warning');
                                    this.isNegotiating = false; // Release lock
                                    this.retryingProposal = false;
                                }
                                return; // BLOCK BUY
                            }

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
                            
                            // Get real barrier from proposal config stored in pendingFastResult
                            let barrierInfo = '';
                            if (this.pendingFastResult && this.pendingFastResult.barrier !== undefined) {
                                barrierInfo = ` (${this.pendingFastResult.barrier})`;
                            }

                            const purchaseLog = `🚀 COMPRA REALIZADA!<br>` +
                                `• Contrato: ${this.sessionState.lastContractType || 'Desconhecido'}${barrierInfo}<br>` +
                                `• Investimento: $${stake.toFixed(2)}<br>` +
                                `• Payout Esperado: $${payout.toFixed(2)} (${profitPercent}%)<br>` +
                                `• Lucro Esperado: $${profitExpected}`;
                                
                            this.addLog(purchaseLog, 'success');
                            
                            // Activate fast result calculation if it's 1-tick
                            // This allows immediate feedback on the NEXT tick
                            if (this.pendingFastResult.duration === 1 && this.pendingFastResult.durationUnit === 't') {
                                this.pendingFastResult.contractId = msg.buy.contract_id;
                                this.pendingFastResult.payout = payout; // Store real payout
                                // this.pendingFastResult.active = true; // ✅ DESATIVADO: Aguardar resultado oficial
                                console.log('[FastResult] Monitoramento rápido desativado para o próximo tick.');
                            }

                            // CRITICAL: isNegotiating is NOT reset here. 
                            // It will be reset in handleContractUpdate or handleTickMessage (Fast Result)
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

                // --- Virtual Trade Processing ---
                if (this.pendingVirtualTrade) {
                    this.pendingVirtualTrade.tickCount++;
                    if (this.pendingVirtualTrade.tickCount >= this.pendingVirtualTrade.duration) {
                        this.finishVirtualTrade(price);
                    }
                }

                // --- Fast Result Calculation ---
                // Process result on the VERY NEXT tick for 1-tick contracts
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
                    
                    // --- PAUSE CHECK (Fast Result) ---
                    const totalConsecutiveLosses = this.sessionState.consecutiveLosses + this.sessionState.lossStreakRecovery;
                    if (!win) {
                         this.addLog(`🔍 DEBUG PAUSA (Fast): Main=${this.sessionState.consecutiveLosses} | Rec=${this.sessionState.lossStreakRecovery} | Total=${totalConsecutiveLosses} | Limit=6`, 'warning');
                    }
                    const limit = this.recoveryConfig.pauseLosses || 6;
                    if (!win && totalConsecutiveLosses >= limit) {
                        const pauseTime = this.recoveryConfig.pauseTime || 2;
                        const pauseDuration = pauseTime * 60 * 1000;
                        this.pauseUntil = Date.now() + pauseDuration;
                        this.addLog(`⏸️ PAUSA ESTRATÉGICA: Limite de ${totalConsecutiveLosses} perdas sequenciais atingido. Pausando por ${pauseTime} min.`, 'warning');
                        // No logic to stop ticks, just block next
                    }

                    // CRITICAL: Release locks immediately
                    this.pendingFastResult.active = false;
                    this.isNegotiating = false; 
                    
                    // Sync legacy mode
                    this.sessionState.isRecoveryMode = this.sessionState.analysisType === 'RECUPERACAO';

                    if (!win && this.sessionState.analysisType === 'RECUPERACAO' && this.sessionState.lossStreakRecovery === 1) {
                         this.addLog('🔄 MODO RECUPERAÇÃO ATIVADO (RÁPIDO)...', 'warning');
                    }

                    this.checkLimits();
                }
                
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
            
            // Prevent spamming analysis
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

            const data = {
                tickHistory: this.tickHistory,
                digitHistory: this.digitHistory
            };

            const results = activeFilters.map(filter => {
                return StrategyAnalysis.evaluate(filter, data, this.sessionState.negotiationMode);
            });

            const allPassed = results.every(r => r.pass);
            
            results.forEach(res => {
                if (!res.pass) {
                     this.addLog(`⏸️ ENTRADA BLOQUEADA: ${res.reason}`, 'warning');
                }
            });

                if (allPassed) {
                    // ✅ DYNAMIC DIRECTION LOGIC (Simulation)
                    const directions = results.map(r => r.direction).filter(d => d);
                    let dynamicContractType = null;

                    if (directions.length > 0) {
                        const uniqueDirections = [...new Set(directions)];
                        if (uniqueDirections.length === 1) {
                            const signal = uniqueDirections[0];
                            const isRec = this.sessionState.activeStrategy === 'RECUPERACAO';
                            const configModel = isRec ? this.recoveryConfig : this.form;
                            const baseType = (configModel.tradeType || '').toUpperCase();

                            // 🔍 DEBUG LOG for recovery vs principal config
                            console.log(`[Direction Check] Mode: ${isRec ? 'RECUPERAÇÃO' : 'PRINCIPAL'}, Signal: ${signal}, Configured Type: ${baseType}`);

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
                                // Dynamic group or EMPTY tradeType - map signal to contract type
                                // If baseType is empty, we must infer the contract group from the signal or activeTradeTypeGroup
                                const group = configModel.selectedTradeTypeGroup || '';
                                const isDigitGroup = group.includes('digit') || ['DIGITEVEN', 'DIGITODD', 'DIGITMATCH', 'DIGITDIFF', 'DIGITOVER', 'DIGITUNDER'].includes(signal);

                                if (['CALL', 'UP'].includes(signal)) {
                                    dynamicContractType = isDigitGroup ? 'DIGITOVER' : 'CALL';
                                } else if (['PUT', 'DOWN'].includes(signal)) {
                                    dynamicContractType = isDigitGroup ? 'DIGITUNDER' : 'PUT';
                                } else if (['DIGITEVEN', 'DIGITODD', 'DIGITMATCH', 'DIGITDIFF', 'DIGITOVER', 'DIGITUNDER'].includes(signal)) {
                                    dynamicContractType = signal;
                                } else {
                                    dynamicContractType = baseType || signal; // Fallback to signal if baseType is empty
                                }
                            }

                            // ✅ Direction Mode Restriction (applies to dynamic groups)
                            const directionMode = configModel.directionMode || 'both';

                            if (directionMode !== 'both' && !isSpecificContract) {
                                const isUpSignal = ['CALL', 'UP', 'DIGITOVER', 'DIGITEVEN', 'DIGITMATCH'].includes(signal);
                                const isDownSignal = ['PUT', 'DOWN', 'DIGITUNDER', 'DIGITODD', 'DIGITDIFF'].includes(signal);
                                
                                if ((directionMode === 'up' && !isUpSignal) || (directionMode === 'down' && !isDownSignal)) {
                                    this.addLog(`🚫 Direção Restrita (Simulação): Sinal ${signal} ignorado.`, 'info');
                                    return;
                                }
                            }

                            // ✅ Resolve Dynamic Payout
                            const directionPayouts = configModel.directionPayouts || {};
                            const explicitPayout = directionPayouts[dynamicContractType] || null;
                            this.sessionState.tempExplicitPayout = explicitPayout;

                            this.addLog('🧭 Direção Dinâmica (Simulação)', [
                                `Sinal: ${signal} → ${dynamicContractType}`,
                                explicitPayout ? `Payout: ${(explicitPayout * 100).toFixed(0)}%` : 'Payout: Padrão'
                            ], 'info');
                        } else {
                            this.addLog('⚠️ Conflito de Direção (Simulação)', `Filtros divergentes: ${uniqueDirections.join(', ')}`, 'warning');
                            return;
                        }
                    }

                    // --- Virtual Loss Check ---
                    const vl = this.securityConfig.virtualLoss;
                    const isRecovery = this.sessionState.activeStrategy === 'RECUPERACAO';
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
                            if (vl.mode === 'cyclic') {
                                vl.current = 0;
                                this.addLog('🛡️ Segurança: Ciclo Reiniciado (Modo Cíclico).', 'info');
                            } else if (vl.mode === 'attack' && !isRecovery) {
                                vl.current = 0;
                            } else if (vl.mode === 'recovery' && isRecovery) {
                                vl.current = 0;
                            }
                        }
                        this.executeRealTrade(dynamicContractType, this.sessionState.tempExplicitPayout);
                        this.sessionState.tempExplicitPayout = null; // Clear
                    }
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
                this.stopResult = {
                    title: 'Meta Batida! 🚀',
                    message: 'Parabéns! Você atingiu sua meta de lucro.',
                    profit: lucroAtual,
                    type: 'success'
                };
                this.showStopModal = true;
                return true;
            }

            // 2. Stop Blindado (Updated Logic)
            if (this.form.useBlindado && target > 0) {
                // Trigger: 50% of Target
                const activationThreshold = target * 0.50;
                const currentPeak = this.sessionState.peakProfit;
                const protectedAmount = currentPeak * 0.40; // Protect 40% of Peak

                if (currentPeak >= activationThreshold) {
                    if (!this.sessionState.stopBlindadoActive) {
                        this.sessionState.stopBlindadoActive = true;
                        this.sessionState.stopBlindadoFloor = protectedAmount;
                        this.addLog(`🛡️ STOP BLINDADO ATIVADO! (Meta > 50%) - Protegendo: $${protectedAmount.toFixed(2)}`, 'info');
                    } else {
                        // Update floor if peak increases (Trailing)
                        if (protectedAmount > this.sessionState.stopBlindadoFloor) {
                            this.sessionState.stopBlindadoFloor = protectedAmount;
                        }
                    }

                    if (lucroAtual <= this.sessionState.stopBlindadoFloor) {
                        this.addLog(`🛡️ STOP BLINDADO ATINGIDO: Protegendo $${lucroAtual.toFixed(2)}`, 'warning');
                        this.stopMonitoring('Stop Blindado atingido');
                        this.stopResult = {
                            title: 'Stop Blindado 🛡️',
                            message: `Parada de segurança acionada. Você garantiu $${lucroAtual.toFixed(2)} de lucro!`,
                            profit: lucroAtual,
                            type: 'warning'
                        };
                        this.showStopModal = true;
                        return true;
                    }
                }
            }

            // 3. Stop Loss
            if (stopLoss > 0 && lucroAtual <= -stopLoss) {
                this.addLog(`🛑 STOP LOSS ATINGIDO: -$${Math.abs(lucroAtual).toFixed(2)}`, 'error');
                this.stopMonitoring('Stop Loss atingido');
                this.stopResult = {
                    title: 'Stop Loss Atingido 🛑',
                    message: 'Limite de perda alcançado. Respeite seu gerenciamento.',
                    profit: lucroAtual,
                    type: 'error'
                };
                this.showStopModal = true;
                return true;
            }

            return false;
        },
        calculateNextStake(explicitPayout = null) {
            const isRecovery = this.sessionState.analysisType === 'RECUPERACAO';
            const config = isRecovery ? this.recoveryConfig : this.form;
            
            let stake = RiskManager.calculateNextStake(this.sessionState, config, explicitPayout);
            
            // --- Survival Mode ---
            const currentProfit = this.monitoringStats.profit;
            const globalConfig = this.form; 
            const payoutRate = isRecovery ? (this.sessionState.lastPayoutRecovery || 0.95) : (this.sessionState.lastPayoutPrincipal || 0.95);
            
            // Pass Stop Blindado State
            const blindadoState = {
                active: this.sessionState.stopBlindadoActive || false,
                floor: this.sessionState.stopBlindadoFloor || 0
            };

            // Log Protected Amount if Active
            if (blindadoState.active) {
                 this.addLog(`🛡️ VALIDAÇÃO DE ENTRADA: Protegendo $${blindadoState.floor.toFixed(2)} do lucro acumulado.`, 'info');
            }

            const survivalResult = RiskManager.applySurvivalMode(stake, currentProfit, globalConfig, explicitPayout || payoutRate, blindadoState);
            const survivalStake = survivalResult.stake;
            const survivalReason = survivalResult.reason;

            if (survivalStake < stake) {
                 this.addLog(`🛡️ Survival Mode: Stake ajustada para proteger limites. Motivo: ${survivalReason || 'Ajuste de Risco'} (${stake.toFixed(2)} -> ${survivalStake.toFixed(2)})`, 'warning');
                 stake = survivalStake;
            }
            
            // CRITICAL: Stop if stake is too low (Survival Mode Triggered Hard)
            if (stake < 0.35) {
                this.addLog(`⚠️ VISÃO DE SOBREVIVÊNCIA: Ajuste de stake ($${stake.toFixed(2)}) menor que o mínimo ($0.35). Parando para proteger capital.`, 'warning');
                
                let stopReason = 'Stop de Segurança (Stake Mínimo)';
                if (blindadoState.active && (currentProfit - stake < blindadoState.floor)) {
                    stopReason = 'Stop Blindado (Margem Insuficiente)';
                }
                
                this.stopMonitoring(stopReason);
                this.stopResult = {
                    title: 'Proteção Ativada 🛡️',
                    message: `O robô parou porque a próxima entrada arriscaria seu lucro protegido ou limite de perda.`,
                    profit: currentProfit,
                    type: 'warning'
                };
                this.showStopModal = true;
                return 0; // Return 0 to signal caller
            }
            // ---------------------

            const sorosLevel = config.sorosLevel || 1;
            if (!isRecovery && 
                this.sessionState.consecutiveWins >= 1 && 
                this.sessionState.consecutiveWins <= sorosLevel &&
                this.sessionState.lastResultWin) {
                
                if (stake > config.initialStake) {
                     this.addLog(`🚀 SOROS ATIVADO: Stake base + último lucro = $${stake.toFixed(2)}`, 'info');
                }
            }

            console.log('[StrategyCreator] Calculated stake:', stake);
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
            
            // ✅ FULL SESSION RESET (User Request: "100% from zero")
            // 1. Reset RiskManager State
            RiskManager.reset();
            
            // 2. Reset Session State
            this.sessionState = RiskManager.initSession(this.sessionState.initialNegotiationMode || 'VELOZ');
            
            // 3. Clear History & Buffers
            this.tickHistory = [];
            this.digitHistory = [];
            this.activeContracts = new Map();
            this.tickCount = 0;
            this.lastTickPrice = null;
            this.isNegotiating = false;
            this.retryingProposal = false;
            this.pendingFastResult = { contractId: null, barrier: null, contractType: null, active: false, stake: 0 };
            this.pendingVirtualTrade = null;
            this.pauseUntil = 0;
            
            // 4. Clear Logs & Operations
            this.monitoringLogs = [];
            this.logCounter = 0;
            this.monitoringOperations = [];
            
            // 5. Reset Stats (Keep balance for now as it is real state)
            this.monitoringStats = {
                balance: this.monitoringStats.balance, // Preserve Balance
                profit: 0,
                wins: 0,
                losses: 0,
                status: 'Parado',
                statusDesc: stopReason
            };

            this.$root.$toast.info('Sessão finalizada e registros limpos.');
        },
        executeRealTrade(overrideContractType = null, explicitPayout = null) {
            try {
                if (!this.isAuthorized) {
                    this.addLog('⚠️ Entrada negada: Não autorizado (Token inválido ou ausente).', 'warning');
                    return;
                }

                if (this.checkLimits()) return;
                
                // CRITICAL: Lock negotiation to avoid multiple simultaneous analysis/purchases from different ticks
                this.isNegotiating = true;

                // Note: isRecovery for logic is based on activeStrategy (filters/contracts)
                const isRecoveryStrategy = this.sessionState.activeStrategy === 'RECUPERACAO';
                // Note: isRecovery for financial (stake) is based on analysisType (Martingale)
                const isFinancialRecovery = this.sessionState.analysisType === 'RECUPERACAO';

                // CRITICAL: If we are in Financial Recovery (Martingale), we MUST use the Recovery Contract 
                // to ensure the Payout (e.g. 126%) matches the Stake Calculation.
                // So we override 'config' to recoveryConfig if isFinancialRecovery is true.
                const config = (isFinancialRecovery || isRecoveryStrategy) ? this.recoveryConfig : this.form;
                
                // 🔍 DEBUG: Log which config is being used
                console.log(`[executeRealTrade] Mode: ${isFinancialRecovery ? 'RECUPERAÇÃO' : 'PRINCIPAL'}, ` +
                    `Using Config: ${isFinancialRecovery || isRecoveryStrategy ? 'recoveryConfig' : 'form'}, ` +
                    `TradeType: ${config.tradeType}, ` +
                    `Override: ${overrideContractType || 'NONE'}`);
                
                // Check for Contract Switch
                if (this.sessionState.lastContractType && this.sessionState.lastContractType !== (overrideContractType || config.tradeType)) {
                    this.addLog(`📊 CONTRATO ALTERADO: ${this.sessionState.lastContractType} ➔ ${overrideContractType || config.tradeType}`, 'info');
                }
                this.sessionState.lastContractType = overrideContractType || config.tradeType;
                
                // Debug Log
                console.log('[StrategyCreator] Calculando stake...');
                const stake = this.calculateNextStake(explicitPayout);

                if (!stake || stake <= 0) {
                    console.warn('[StrategyCreator] Stake inválido (0 ou Cancelado). Abortando entrada.');
                    return;
                }

                this.addLog(`📡 Solicitando proposta (${isFinancialRecovery ? 'RECUPERAÇÃO/MARTINGALE' : 'PRINCIPAL'}): ${overrideContractType || config.tradeType} $${stake}`, 'info');
                
                // Step 1: Request Proposal to get exact payout
                const proposalParams = {
                    proposal: 1,
                    amount: stake,
                    basis: 'stake',
                    contract_type: overrideContractType || config.tradeType,
                    currency: 'USD',
                    duration: this.form.duration,
                    duration_unit: this.form.durationUnit,
                    symbol: config.market || this.form.market
                };

                if (['DIGITOVER', 'DIGITUNDER', 'DIGITMATCH', 'DIGITDIFF'].includes(proposalParams.contract_type)) {
                    // Determine barrier based on direction
                    let targetBarrier = config.prediction; // fallback

                    if (config.targetDigitUp !== undefined && ['DIGITOVER', 'DIGITMATCH'].includes(proposalParams.contract_type)) {
                        targetBarrier = config.targetDigitUp;
                    } else if (config.targetDigitDown !== undefined && ['DIGITUNDER', 'DIGITDIFF'].includes(proposalParams.contract_type)) {
                        targetBarrier = config.targetDigitDown;
                    }
                    
                    // Fallback using default prediction or 8 if absolutely nothing set
                    if (targetBarrier === undefined) targetBarrier = 8;
                    
                    proposalParams.barrier = targetBarrier.toString(); 
                }

                // Store current context for fast result (will be activated on buy response)
                this.pendingFastResult = {
                    contractId: null,
                    barrier: parseInt(proposalParams.barrier || config.prediction || 8), // Ensure we capture the calculated barrier

                    contractType: overrideContractType || config.tradeType,
                    active: false, // DISABLED FAST RESULT as per user request
                    stake: stake,
                    analysisType: isFinancialRecovery ? 'RECUPERACAO' : 'PRINCIPAL',
                    payout: null, // Will be filled when proposal arrives
                    duration: this.form.duration,
                    durationUnit: this.form.durationUnit
                };

                this.ws.send(JSON.stringify(proposalParams));

            } catch (err) {
                this.isNegotiating = false;
                console.error('[StrategyCreator] Erro fatal em executeRealTrade:', err);
                this.addLog(`❌ ERRO NO SISTEMA: ${err.message}`, 'error');
            }
        },
        executeVirtualTrade(overrideContractType = null) {
            // Check context
            const isRecoveryStrategy = this.sessionState.activeStrategy === 'RECUPERACAO';
            // ✅ FIX: Correctly merge configs
            const config = {
                ...this.form,
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
                entryPrice: this.lastTickPrice,
                tradeType: overrideContractType || config.tradeType,
                prediction: config.prediction,
                duration: this.form.duration,
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
                this.addLog(`👻 SIMULAÇÃO WIN (Dígito ${lastDigit}) ➔ Sequência quebrada. Reiniciando contagem.`, 'success');
            } else {
                // Loss Virtual = Increment sequence
                vl.current++;
                const faltam = vl.target - vl.current;
                
                if (faltam > 0) {
                    this.addLog(`👻 SIMULAÇÃO LOSS (Dígito ${lastDigit}) ➔ Confirmado Loss Virtual #${vl.current}. Faltam ${faltam}.`, 'warning');
                } else {
                    this.addLog(`👻 SIMULAÇÃO LOSS (Dígito ${lastDigit}) ➔ Alvo Atingido (${vl.current}/${vl.target})! PRÓXIMA ENTRADA SERÁ REAL.`, 'warning');
                }
            }
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
                    // Save Barrier for history key update later
                    barrier: contract.barrier,
                    entryPrice: contract.entry_tick_display_value,
                    exitPrice: contract.exit_tick_display_value,
                    lastDigit: contract.exit_tick_display_value ? contract.exit_tick_display_value.slice(-1) : null
                };
                this.monitoringOperations.unshift(trade);
                this.activeContracts.set(id, trade);
                
                // CRITICAL: Release negotiation lock only when contract is officially tracked
                // This avoids race conditions where a second buy is triggered before the first is registered.
                this.isNegotiating = false; 
                console.log(`[StrategyCreator] Contract ${id} tracked. Releasing isNegotiating lock.`);
            } else {

                trade.pnl = contract.profit || 0;
                if (contract.entry_tick_display_value) trade.entryPrice = contract.entry_tick_display_value;
                if (contract.exit_tick_display_value) {
                    trade.exitPrice = contract.exit_tick_display_value;
                    trade.lastDigit = contract.exit_tick_display_value.slice(-1);
                }
            }

            if (contract.is_sold) {
                // Determine Entry/Exit if not set
                if (!trade.entryPrice) trade.entryPrice = contract.entry_tick_display_value || contract.entry_tick || contract.entry_spot;
                
                // Detailed Debug for Exit Price
                const exitSources = {
                     display: contract.exit_tick_display_value,
                     tick: contract.exit_tick,
                     spot: contract.exit_spot,
                     current: contract.current_spot
                };
                
                if (!trade.exitPrice) trade.exitPrice = contract.exit_tick_display_value || contract.exit_tick || contract.exit_spot;
                
                // Debug missing exit price or discrepancy
                console.log(`[StrategyCreator] Contract Sold ${id}. Exit Sources:`, exitSources, 'Selected:', trade.exitPrice);

                if (!trade.exitPrice) {
                    console.warn('[StrategyCreator] Exit Price Missing for Sold Contract:', contract);
                    // Force log available keys
                    console.log('[StrategyCreator] Keys available:', Object.keys(contract));
                    console.log('[StrategyCreator] Audit Details:', contract.audit_details);
                }
                
                // Update Last Digit if exit price is set (final check)
                if (trade.exitPrice) {
                    trade.lastDigit = trade.exitPrice.toString().slice(-1);
                }

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
                } else {
                    const oldAnalysis = this.sessionState.analysisType;
                    const oldMode = this.sessionState.negotiationMode;

                    // ✅ CORRECTED LOGIC: Process ALL results (WIN and LOSS) if not fast-processed
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
                        // Do not stop ticks here as it might affect tracking
                    }
                    
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
                    } else if (this.sessionState.analysisType === 'RECUPERACAO' && trade.result === 'LOST') {
                         this.addLog(`📉 Loss na Recuperação. Ajustando Martingale...`, 'warning');
                    }
                    // Refine result from Fast Result logic with official data
                    RiskManager.refineTradeResult(this.sessionState, trade.pnl, trade.stake);
                }
                
                // Always update payout history for this contract type (Win or Loss? Payout is mostly constant per type unless barrier changes)
                // For a loss, we don't know the real payout unless we saved it from proposal. 
                // But for a WIN, we know exactly.
                if (trade.result === 'WON') {
                     const payoutRate = (trade.pnl + trade.stake) / trade.stake;
                     
                     // Determine prefix (use stored analysisType from trade if available, or current? Trade has it)
                     const prefix = (trade.analysisType === 'RECUPERACAO') ? 'RECUPERACAO_' : 'PRINCIPAL_';
                     
                     let barrierSuffix = '';
                     if (trade.barrier !== undefined) {
                         barrierSuffix = '_' + trade.barrier;
                     } 
                     
                     RiskManager.updatePayoutHistory(prefix + trade.contract + barrierSuffix, payoutRate);
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
            if (this.monitoringLogs.length > 5000) this.monitoringLogs.pop();
        }
    },
    watch: {
        'recoveryConfig.martingale': {
            handler(newVal) {
                if (newVal === false) {
                    this.form.riskProfile = 'conservador';
                    console.log('[StrategyCreator] Martingale Disabled -> Enforcing Risk Profile: Conservador');
                } else {
                    // ✅ Re-enable logic: If profile was Conservador (likely forced), switch to Moderado or keep current if valid
                    // We default to 'Moderado' as a safe "Active" state if it was stuck on Conservador
                    if (this.form.riskProfile === 'conservador') {
                        this.form.riskProfile = 'moderado';
                        console.log('[StrategyCreator] Martingale Enabled -> Restoring Risk Profile: Moderado');
                    }
                }
            },
            immediate: true
        },
        'form.riskProfile': {
            handler(newVal) {
                if (newVal) {
                    this.recoveryConfig.riskProfile = newVal;
                    console.log(`[StrategyCreator] Synced riskProfile to recoveryConfig: ${newVal}`);
                }
            }
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

