<template>
  <div class="noise-bg gradient-glow min-h-screen font-inter text-zenix-text" style="background-color: #0b0b0b !important;">

    <!-- Sidebar (using existing AppSidebar component but wrapped or positioned if needed) -->
    <AppSidebar 
      :is-open="sidebarIsOpen" 
      :is-collapsed="isSidebarCollapsed"
      @close-sidebar="closeSidebar" 
      @toggle-collapse="toggleSidebarCollapse"
    />

    <!-- Main Content -->
    <div 
      class="min-h-screen flex flex-col content-wrapper" :class="{ 'sidebar-collapsed': isSidebarCollapsed }"
    >
      <TopNavbar 
        :is-sidebar-collapsed="isSidebarCollapsed"
        :balance="currentBalance?.balance || info?.balance"
        :account-type="accountType"
        :balances-by-currency-real="balancesByCurrencyReal"
        :balances-by-currency-demo="balancesByCurrencyDemo"
        :currency-prefix="preferredCurrencyPrefix"
        @open-settings="toggleSettingsModal"
        @account-type-changed="switchAccount"
        @toggle-sidebar="toggleSidebar"
        @toggle-sidebar-collapse="toggleSidebarCollapse"
      />
      
      <!-- Settings Sidebar -->
      <SettingsSidebar
        :is-open="showSettingsModal"
        :balance="info?.balance"
        :account-type="accountType"
        :balances-by-currency-real="balancesByCurrencyReal"
        :balances-by-currency-demo="balancesByCurrencyDemo"
        :currency-prefix="preferredCurrencyPrefix"
        @close="closeSettingsModal"
        @account-type-changed="switchAccount"
      />
      <!-- Header -->
      <header id="header" class="sticky top-0 z-30 glass-effect border-b border-zenix-border" style="margin-top: 60px;">
        <div class="px-4 lg:px-8 py-4 flex items-center justify-between">
          <div class="flex items-center space-x-4 lg:space-x-6">
          </div>
          <button 
            @click="saveAll" 
            :disabled="saving"
            class="bg-zenix-green hover:bg-zenix-green-hover text-white px-4 lg:px-6 py-2 lg:py-2.5 rounded-xl transition-all font-semibold text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="saving" class="mr-2"><i class="fas fa-spinner fa-spin"></i></span>
            <i v-else class="fas fa-save mr-2"></i>
            {{ saveButtonText }}
          </button>
        </div>
      </header>

      <main class="flex-1 p-4 lg:p-8 pt-8">
        <div v-if="loading" class="flex items-center justify-center h-64">
          <div class="text-zenix-secondary">Carregando configurações...</div>
        </div>
        
        <div v-else-if="error" class="flex items-center justify-center h-64">
          <div class="text-red-500">{{ error }}</div>
        </div>

        <template v-else>
        <!-- Desktop Layout -->
        <div class="max-w-7xl mx-auto hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Column 1 -->
          <div class="space-y-8">
            <!-- Profile Card -->
            <div id="profile-card" class="bg-zenix-card border border-zenix-border rounded-2xl p-6 lg:p-8 premium-card">
              <div class="text-center mb-8">
                <div class="avatar-border w-24 h-24 mx-auto mb-4">
                  <div class="w-full h-full rounded-full overflow-hidden bg-zenix-card flex items-center justify-center">
                    <img v-if="profilePictureFullUrl" :src="profilePictureFullUrl" alt="Profile" class="w-full h-full rounded-full object-cover">
                    <i v-else class="fas fa-user text-4xl text-zenix-secondary"></i>
                  </div>
                </div>
                <h2 class="text-xl font-bold text-white mb-1 text-center">{{ settings.name || 'Usuário' }}</h2>
                <p class="text-zenix-secondary text-sm mb-1 text-center">{{ settings.email }}</p>
                <p class="text-zenix-secondary text-xs text-center">Conta criada em {{ formatDate(settings.createdAt) }}</p>
                <p v-if="settings.planExpirationDate" class="text-zenix-secondary text-xs text-center mt-1">
                  Expiração do plano em {{ formatDate(settings.planExpirationDate) }}
                </p>
              </div>

              <div class="space-y-3">
                <button @click="openEditNameModal" class="w-full hover:bg-zenix-green/10 text-zenix-text hover:text-zenix-green border border-zenix-border hover:border-zenix-green/40 py-3 rounded-xl transition-all flex items-center justify-center text-sm" style="background-color: #1d1c1d;">
                  <i class="fas fa-edit mr-2"></i>
                  Editar Nome
                </button>
                <button @click="openEditEmailModal" class="w-full hover:bg-zenix-green/10 text-zenix-text hover:text-zenix-green border border-zenix-border hover:border-zenix-green/40 py-3 rounded-xl transition-all flex items-center justify-center text-sm" style="background-color: #1d1c1d;">
                  <i class="fas fa-envelope mr-2"></i>
                  Alterar E-mail
                </button>
                <button @click="openEditPhoneModal" class="w-full hover:bg-zenix-green/10 text-zenix-text hover:text-zenix-green border border-zenix-border hover:border-zenix-green/40 py-3 rounded-xl transition-all flex items-center justify-center text-sm" style="background-color: #1d1c1d;">
                   <i class="fas fa-phone mr-2"></i>
                   Alterar Telefone
                </button>
                <button @click="openChangePhotoModal" class="w-full hover:bg-zenix-green/10 text-zenix-text hover:text-zenix-green border border-zenix-border hover:border-zenix-green/40 py-3 rounded-xl transition-all flex items-center justify-center text-sm" style="background-color: #1d1c1d;">
                  <i class="fas fa-image mr-2"></i>
                  Trocar Foto
                </button>
              </div>
            </div>

            <!-- General Settings Card -->
            <div id="general-settings-card" class="bg-zenix-card border border-zenix-border rounded-2xl p-6 lg:p-8 premium-card">
              <h3 class="text-lg font-bold text-white mb-6">Configurações Gerais</h3>
              
              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-zenix-text mb-2">Idioma</label>
                  <select v-model="settings.language" class="w-full border border-zenix-border rounded-xl px-4 py-3 text-zenix-text focus:outline-none focus:border-zenix-green transition-all appearance-none" style="background-color: #1d1c1d;">
                    <option value="pt-BR">Português (BR)</option>
                    <option value="en-US">English (US)</option>
                    <option value="es-ES">Español</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-zenix-text mb-2">Fuso Horário</label>
                  <select v-model="settings.timezone" class="w-full border border-zenix-border rounded-xl px-4 py-3 text-zenix-text focus:outline-none focus:border-zenix-green transition-all appearance-none" style="background-color: #1d1c1d;">
                    <option value="America/Sao_Paulo">GMT-3 (São Paulo)</option>
                    <option value="America/New_York">GMT-5 (New York)</option>
                    <option value="Europe/London">GMT+0 (Londres)</option>
                    <option value="Asia/Tokyo">GMT+9 (Tóquio)</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-zenix-text mb-2">Moeda padrão</label>
                  <select v-model="settings.tradeCurrency" class="w-full border border-zenix-border rounded-xl px-4 py-3 text-zenix-text focus:outline-none focus:border-zenix-green transition-all appearance-none" style="background-color: #1d1c1d;">
                    <option value="USD">USD</option>
                    <option value="BTC">BTC</option>
                    <option value="DEMO">DEMO (Conta virtual)</option>
                  </select>
                </div>

                <div v-if="settings.isMasterTrader" class="pt-4 border-t border-zenix-border">
                  <div 
                    @click="isCreatorModeExpanded = !isCreatorModeExpanded"
                    class="flex items-center justify-center cursor-pointer py-2 hover:bg-white/5 rounded-lg transition-colors group"
                    title="Modo Criador de Conteúdo"
                  >
                    <i class="fas fa-chevron-down text-zenix-secondary group-hover:text-white transition-transform duration-300 transform" :class="{ 'rotate-180': isCreatorModeExpanded }"></i>
                  </div>
                  
                  <div v-show="isCreatorModeExpanded" class="mt-4 transition-all duration-300">
                    <h4 class="text-sm font-bold text-white mb-4">Modo Criador de Conteúdo</h4>
                    
                    <div class="space-y-4">
                      <div class="flex items-center justify-between">
                        <span class="text-sm font-medium text-zenix-text">Ativar Saldo Fictício</span>
                        <label class="switch">
                          <input type="checkbox" v-model="settings.isFictitiousBalanceActive">
                          <span class="slider"></span>
                        </label>
                      </div>

                      <div v-if="settings.isFictitiousBalanceActive">
                        <label class="block text-sm font-medium text-zenix-text mb-2">Saldo Fictício</label>
                        <div class="relative">
                          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-zenix-secondary">$</span>
                          <input 
                            type="number" 
                            v-model="settings.fictitiousBalance" 
                            class="w-full border border-zenix-border rounded-xl px-4 py-3 pl-8 text-zenix-text focus:outline-none focus:border-zenix-green transition-all"
                            style="background-color: #1d1c1d;"
                            step="0.01"
                          />
                        </div>
                      </div>

                      <div class="flex items-center justify-between">
                        <span class="text-sm font-medium text-zenix-text">Exibir cifrão ($) no header</span>
                        <label class="switch">
                          <input type="checkbox" v-model="settings.showDollarSign">
                          <span class="slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-zenix-text">Notificações por e-mail</span>
                  <label class="switch">
                    <input type="checkbox" v-model="settings.emailNotifications">
                    <span class="slider"></span>
                  </label>
                </div>

                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-zenix-text">Notificações push</span>
                  <label class="switch">
                    <input type="checkbox" v-model="settings.pushNotifications">
                    <span class="slider"></span>
                  </label>
                </div>

                <div class="pt-4 border-t border-zenix-border">
                  <a href="#" class="text-zenix-blue hover:text-zenix-blue/80 text-sm transition-all flex items-center">
                    <i class="fas fa-shield-alt mr-2"></i>
                    Gerenciar minhas permissões
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Column 2 -->
          <div class="space-y-8">
            <div id="security-card" class="bg-zenix-card border border-zenix-border rounded-2xl p-6 lg:p-8 premium-card">
              <h3 class="text-lg font-bold text-white mb-6">Segurança da Conta</h3>
              
              <div class="space-y-6">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-sm font-medium text-zenix-text block">Senha</span>
                    <p class="text-xs text-zenix-secondary">••••••••</p>
                  </div>
                  <button @click="openChangePasswordModal" class="bg-zenix-bg/70 hover:bg-zenix-green/10 text-zenix-text hover:text-zenix-green border border-zenix-border hover:border-zenix-green/40 px-4 py-2 rounded-lg transition-all text-xs lg:text-sm">
                    Alterar senha
                  </button>
                </div>
              </div>
            </div>

            <div id="activity-card" class="bg-zenix-card border border-zenix-border rounded-2xl p-6 lg:p-8 premium-card">
              <h3 class="text-lg font-bold text-white mb-6">Atividade Recente</h3>
              
              <div class="space-y-4">
                <div class="flex items-center justify-between" v-if="lastLogin">
                  <span class="text-sm text-zenix-secondary">Último login</span>
                  <span class="text-sm text-zenix-text">{{ formatDateTimeShort(lastLogin.date) }}</span>
                </div>

                <div class="flex items-center space-x-3" v-if="lastLogin">
                  <i class="fab fa-chrome text-zenix-secondary"></i>
                  <span class="text-sm text-zenix-text">{{ formatDevice(lastLogin.device, lastLogin.userAgent) }}</span>
                </div>

                <div class="flex items-center justify-between">
                  <span class="text-sm text-zenix-secondary">Sessões ativas</span>
                  <span class="text-sm text-zenix-text font-semibold">{{ activeSessions }}</span>
                </div>

                <button @click="endAllSessions" class="w-full text-zenix-text hover:text-zenix-red py-3 rounded-xl transition-all text-sm" style="background-color: #1d1c1d;">
                  Encerrar todas as sessões
                </button>
              </div>
            </div>

            <div id="privacy-card" class="bg-gradient-to-br from-zenix-red/20 to-zenix-red/5 border border-zenix-red/50 rounded-2xl p-6 lg:p-8 premium-card hover:border-zenix-red transition-colors">
              <h3 class="text-lg font-bold text-white mb-6 flex items-center">
                <i class="fas fa-exclamation-triangle text-zenix-red mr-2"></i>
                Conta & Privacidade
              </h3>
              
              <div class="space-y-4">
                <a href="#" @click.prevent="downloadPersonalData" class="block text-zenix-blue hover:text-zenix-blue/80 text-sm transition-all flex items-center">
                  <i class="fas fa-download mr-2"></i>
                  Baixar meus dados
                </a>

                <a href="#" class="block text-zenix-blue hover:text-zenix-blue/80 text-sm transition-all flex items-center">
                  <i class="fas fa-file-contract mr-2"></i>
                  Termos de uso e privacidade
                </a>

                <div class="pt-4 border-t border-zenix-red/40">
                  <button @click="openDeleteAccountModal" class="w-full bg-zenix-red/20 hover:bg-zenix-red/30 border border-zenix-red/50 hover:border-zenix-red text-zenix-red py-3 rounded-xl transition-all font-semibold text-sm flex items-center justify-center">
                    <i class="fas fa-trash-alt mr-2"></i>
                    Excluir conta
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Column 3 -->
          <div>
            <div id="history-card" class="bg-zenix-card border border-zenix-border rounded-2xl p-6 lg:p-8 premium-card h-full">
              <h3 class="text-lg font-bold text-white mb-6">Histórico de Alterações</h3>
              
              <div class="space-y-0 desktop-history-scroll">
                <template v-for="(log, index) in activityLogs" :key="log.id">
                  <div class="activity-item p-4 border-l-2 border-transparent transition-all">
                    <div class="flex items-center justify-between mb-1">
                      <span class="text-xs text-zenix-secondary">{{ formatLogDate(log.createdAt) }}</span>
                    </div>
                    <p class="text-sm text-zenix-text">{{ log.description }}</p>
                  </div>
                  <div v-if="index < activityLogs.length - 1" class="border-t border-zenix-border"></div>
                </template>
                <div v-if="activityLogs.length === 0" class="text-center py-8 text-zenix-secondary text-sm">
                  Nenhuma alteração registrada ainda.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Layout -->
        <div class="max-w-7xl mx-auto lg:hidden space-y-6 px-4 mobile-settings-container">
          <!-- Profile Section -->
          <div class="bg-zenix-card border border-zenix-border rounded-2xl p-6 premium-card mobile-card-gradient">
            <div class="text-center mb-6">
              <div class="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-zenix-card flex items-center justify-center">
                <img v-if="profilePictureFullUrl" :src="profilePictureFullUrl" alt="Profile" class="w-full h-full rounded-full object-cover">
                <i v-else class="fas fa-user text-4xl text-zenix-secondary"></i>
              </div>
              <h2 class="text-lg font-bold text-white mb-1 text-center">{{ settings.name || 'Usuário' }}</h2>
              <p class="text-zenix-secondary text-xs text-center">{{ settings.email }}</p>
              <p v-if="settings.planExpirationDate" class="text-zenix-secondary text-xs text-center mt-1">
                Expiração do plano em {{ formatDate(settings.planExpirationDate) }}
              </p>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <button @click="openEditNameModal" class="hover:bg-zenix-green/10 text-white border border-zenix-border hover:border-zenix-green/40 py-2.5 rounded-xl transition-all text-xs" style="background-color: #1d1c1d;">
                Editar Nome
              </button>
              <button @click="openChangePhotoModal" class="hover:bg-zenix-green/10 text-white border border-zenix-border hover:border-zenix-green/40 py-2.5 rounded-xl transition-all text-xs" style="background-color: #1d1c1d;">
                Trocar Foto
              </button>
            </div>
          </div>

          <!-- Segurança da Conta -->
          <div class="bg-zenix-card border border-zenix-border rounded-2xl p-6 premium-card mobile-card-gradient">
            <h3 class="text-base font-bold text-white mb-5">Segurança da Conta</h3>
            <div class="grid grid-cols-2 gap-4">
              <button @click="openEditEmailModal" class="bg-zenix-bg/70 hover:bg-zenix-green/10 border border-zenix-border hover:border-zenix-green/40 rounded-xl p-3 transition-all flex flex-col items-center justify-center space-y-2">
                <i class="fas fa-envelope text-zenix-green text-xl"></i>
                <span class="text-white text-xs">Alterar E-mail</span>
              </button>
              <button @click="openChangePasswordModal" class="bg-zenix-bg/70 hover:bg-zenix-green/10 border border-zenix-border hover:border-zenix-green/40 rounded-xl p-3 transition-all flex flex-col items-center justify-center space-y-2">
                <i class="fas fa-lock text-zenix-green text-xl"></i>
                <span class="text-white text-xs">Alterar Senha</span>
              </button>
            </div>
          </div>

          <!-- Atividade Recente -->
          <div class="bg-zenix-card border border-zenix-border rounded-2xl p-6 premium-card mobile-card-gradient">
            <h3 class="text-base font-bold text-white mb-5">Atividade Recente</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-xs text-zenix-secondary">Último login</span>
                <span class="text-xs text-white">{{ lastLogin ? formatLastLogin(lastLogin.date || lastLogin) : 'N/A' }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-zenix-secondary">Status</span>
                <span class="text-xs text-zenix-green font-semibold">Ativo</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-zenix-secondary">Sessões ativas</span>
                <span class="text-xs text-white font-semibold">{{ activeSessions }}</span>
              </div>
              <button @click="endAllSessions" class="w-full text-zenix-red hover:bg-zenix-red/10 py-2.5 rounded-xl transition-all text-xs font-semibold mt-4" style="background-color: #1d1c1d;">
                Encerrar todas as sessões
              </button>
            </div>
          </div>

          <!-- Configurações Gerais -->
          <div class="bg-zenix-card border border-zenix-border rounded-2xl p-6 premium-card mobile-card-gradient">
            <h3 class="text-base font-bold text-white mb-5">Configurações Gerais</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <label class="text-xs font-medium text-white">Idioma</label>
                <select v-model="settings.language" class="border border-zenix-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-zenix-green transition-all appearance-none mobile-select" style="background-color: #1d1c1d;">
                  <option value="pt-BR">Português (BR)</option>
                  <option value="en-US">English (US)</option>
                  <option value="es-ES">Español</option>
                </select>
              </div>
              <div class="flex items-center justify-between">
                <label class="text-xs font-medium text-white">Fuso Horário</label>
                <select v-model="settings.timezone" class="border border-zenix-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-zenix-green transition-all appearance-none mobile-select" style="background-color: #1d1c1d;">
                  <option value="America/Sao_Paulo">GMT-3 (Brasília)</option>
                  <option value="America/New_York">GMT-5 (New York)</option>
                  <option value="Europe/London">GMT+0 (Londres)</option>
                  <option value="Asia/Tokyo">GMT+9 (Tóquio)</option>
                </select>
              </div>
              <div class="flex items-center justify-between">
                <label class="text-xs font-medium text-white">Moeda padrão</label>
                <select v-model="settings.tradeCurrency" class="border border-zenix-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-zenix-green transition-all appearance-none mobile-select" style="background-color: #1d1c1d;">
                  <option value="USD">USD ($)</option>
                  <option value="BTC">BTC</option>
                  <option value="DEMO">DEMO (Conta virtual)</option>
                </select>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs font-medium text-white">Notificações por e-mail</span>
                <label class="switch">
                  <input type="checkbox" v-model="settings.emailNotifications">
                  <span class="slider"></span>
                </label>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs font-medium text-white">Notificações push</span>
                <label class="switch">
                  <input type="checkbox" v-model="settings.pushNotifications">
                  <span class="slider"></span>
                </label>
              </div>

              <!-- Content Creator Section (Mobile) -->
              <div v-if="settings.isMasterTrader" class="pt-4 border-t border-zenix-border">
                <div 
                  @click="isCreatorModeExpanded = !isCreatorModeExpanded"
                  class="flex items-center justify-between cursor-pointer py-2 hover:bg-white/5 rounded-lg transition-colors group"
                >
                  <span class="text-xs font-bold text-white">Modo Criador de Conteúdo</span>
                  <i class="fas fa-chevron-down text-zenix-secondary group-hover:text-white transition-transform duration-300 transform" :class="{ 'rotate-180': isCreatorModeExpanded }"></i>
                </div>
                
                <div v-show="isCreatorModeExpanded" class="mt-4 space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-medium text-white">Ativar Saldo Fictício</span>
                    <label class="switch">
                      <input type="checkbox" v-model="settings.isFictitiousBalanceActive">
                      <span class="slider"></span>
                    </label>
                  </div>

                  <div v-if="settings.isFictitiousBalanceActive">
                    <label class="block text-[10px] font-medium text-zenix-text mb-2">Saldo Fictício</label>
                    <div class="relative">
                      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-zenix-secondary text-xs">$</span>
                      <input 
                        type="number" 
                        v-model="settings.fictitiousBalance" 
                        class="w-full border border-zenix-border rounded-xl px-3 py-2 pl-6 text-xs text-white focus:outline-none focus:border-zenix-green transition-all"
                        style="background-color: #1d1c1d;"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div class="flex items-center justify-between">
                    <span class="text-xs font-medium text-white">Exibir cifrão ($) no header</span>
                    <label class="switch">
                      <input type="checkbox" v-model="settings.showDollarSign">
                      <span class="slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="pt-4 border-t border-zenix-border">
                <a href="#" class="text-blue-500 hover:text-blue-400 text-xs transition-all">
                  Gerenciar minhas permissões
                </a>
              </div>
            </div>
          </div>

          <!-- Conta & Privacidade -->
          <div class="bg-zenix-card border border-zenix-border rounded-2xl p-6 premium-card mobile-card-gradient">
            <h3 class="text-base font-bold text-white mb-5">Conta & Privacidade</h3>
            <div class="space-y-4">
              <button @click.prevent="downloadPersonalData" class="w-full bg-transparent border-2 border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10 py-2.5 rounded-xl transition-all text-xs text-left px-4 mobile-privacy-btn-center">
                Baixar meus dados
              </button>
              <button class="w-full bg-transparent border-2 border-zenix-border hover:border-zenix-green/40 text-white py-2.5 rounded-xl transition-all text-xs text-left px-4 mobile-privacy-btn-center">
                Termos de uso e privacidade
              </button>
              <button @click="openDeleteAccountModal" class="w-full bg-transparent border-2 border-zenix-red text-zenix-red hover:bg-zenix-red/10 py-2.5 rounded-xl transition-all text-xs font-semibold mobile-privacy-btn-center">
                Excluir Conta
              </button>
            </div>
          </div>

          <!-- Histórico de Alterações -->
          <div class="bg-zenix-card border border-zenix-border rounded-2xl p-6 premium-card mobile-card-gradient">
            <h3 class="text-base font-bold text-white mb-5">Histórico de Alterações</h3>
            <div class="space-y-4 mobile-history-scroll">
              <template v-for="(log, index) in activityLogs" :key="log.id">
                <div class="pb-3 text-left" :class="{ 'border-b border-zenix-border': index < activityLogs.length - 1 }">
                  <div class="mb-1">
                    <span class="text-xs text-white">{{ log.description }}</span>
                  </div>
                  <span class="text-xs text-zenix-secondary">{{ formatLogDate(log.createdAt) }}</span>
                </div>
              </template>
              <div v-if="activityLogs.length === 0" class="text-center py-8 text-zenix-secondary text-xs">
                Nenhuma alteração registrada ainda.
              </div>
            </div>
          </div>
        </div>
        </template>
      </main>
    </div>

    <!-- Modals (Existing) -->
    <EditNameModal :visible="showEditNameModal" :currentName="settings.name" @close="closeEditNameModal" @save="handleSaveName" />
    <EditEmailModal :visible="showEditEmailModal" :currentEmail="settings.email" @close="closeEditEmailModal" @save="handleSaveEmail" />
    <EditPhoneModal :visible="showEditPhoneModal" :currentPhone="settings.phone" @close="closeEditPhoneModal" @save="handleSavePhone" />
    <ChangePasswordModal :visible="showChangePasswordModal" @close="closeChangePasswordModal" @save="handleSavePassword" />
    <ChangePhotoModal :visible="showChangePhotoModal" @close="closeChangePhotoModal" @save="handleSavePhoto" />
    <DesktopBottomNav />
  </div>
</template>

<script>
import AppSidebar from '../components/Sidebar.vue'
import TopNavbar from '../components/TopNavbar.vue'
import SettingsSidebar from '../components/SettingsSidebar.vue'
import EditNameModal from '../components/modals/EditNameModal.vue'
import EditEmailModal from '../components/modals/EditEmailModal.vue'
import EditPhoneModal from '../components/modals/EditPhoneModal.vue'
import ChangePasswordModal from '../components/modals/ChangePasswordModal.vue'
import ChangePhotoModal from '../components/modals/ChangePhotoModal.vue'
import DesktopBottomNav from '../components/DesktopBottomNav.vue'
import accountBalanceMixin from '../mixins/accountBalanceMixin'

export default {
  name: 'SettingsView',
  mixins: [accountBalanceMixin],
  components: {
    AppSidebar,
    TopNavbar,
    SettingsSidebar,
    EditNameModal,
    EditEmailModal,
    EditPhoneModal,
    ChangePasswordModal,
    ChangePhotoModal,
    DesktopBottomNav
  },
  data() {
    return {
      settings: {
        name: '',
        email: '',
        phone: '', 
        createdAt: null,
        profilePictureUrl: null,
        language: 'pt-BR',
        timezone: 'America/Sao_Paulo',
        emailNotifications: true,
        pushNotifications: true,
        twoFactorEnabled: false,
        tradeCurrency: 'USD',
        planExpirationDate: null,
        planFeatures: null
      },
      lastLogin: null,
      activeSessions: 0,
      showSettingsModal: false,
      activityLogs: [],
      loading: true,
      error: null,
      saving: false,
      showEditNameModal: false,
      showEditEmailModal: false,
      showEditPhoneModal: false,
      showChangePasswordModal: false,
      showChangePhotoModal: false,
      sidebarIsOpen: false,
      isMobile: false,
      isSidebarCollapsed: true, // Começa recolhido
      accountBalance: 0,
      accountCurrency: 'USD',
      accountLoginid: null,
      isDemo: false,

      balancesByCurrencyReal: {},
      balancesByCurrencyDemo: {},
      isCreatorModeExpanded: false
    }
  },
  computed: {
    initials() {
      if (!this.settings.name) return 'U'
      const parts = this.settings.name.split(' ')
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      }
      return this.settings.name.substring(0, 2).toUpperCase()
    },
    saveButtonText() {
      return this.isMobile ? 'Salvar' : 'Salvar alterações';
    },
    profilePictureFullUrl() {
      if (!this.settings.profilePictureUrl) return null
      
      // Se já é uma URL completa, retornar como está
      if (this.settings.profilePictureUrl.startsWith('http://') || 
          this.settings.profilePictureUrl.startsWith('https://')) {
        return this.settings.profilePictureUrl
      }
      
      // Se começa com /api/uploads, construir URL relativa ao domínio
      // Em produção, o nginx vai servir /api/uploads diretamente
      if (this.settings.profilePictureUrl.startsWith('/api/uploads')) {
        // Pegar apenas o domínio base sem /api
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'
        const baseUrl = apiBaseUrl.replace(/\/api$/, '')
        return `${baseUrl}${this.settings.profilePictureUrl}`
      }
      
      // Fallback para caminhos antigos /uploads/...
      const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'
      const baseUrl = apiBaseUrl.replace(/\/api$/, '')
      return `${baseUrl}${this.settings.profilePictureUrl}`
    }
  },
  mounted() {
    this.fetchSettings();
    window.addEventListener('resize', this.checkMobile);
    this.checkMobile();
    // Carregar saldo em background
    this.loadAccountBalance();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile);
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth <= 1024; // Adjusted for lg breakpoint
    },
    toggleSidebarCollapse() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    },
    toggleMobileSidebar() {
      this.sidebarIsOpen = !this.sidebarIsOpen;
    },
    closeSidebar() {
      this.sidebarIsOpen = false;
    },
    toggleSidebar() {
      this.sidebarIsOpen = !this.sidebarIsOpen;
    },
    async loadAccountBalance() {
      try {
        await this.loadAccountBalanceInfo();
        if (this.info) {
          this.accountBalance = this.info.balance;
          this.accountCurrency = this.info.currency;
          this.accountLoginid = this.info.loginid;
          this.isDemo = this.info.isDemo;
          this.balancesByCurrencyReal = this.info.balancesByCurrencyReal || {};
          this.balancesByCurrencyDemo = this.info.balancesByCurrencyDemo || {};
        }
      } catch (error) {
        console.error('[SettingsView] Erro ao carregar saldo:', error);
      }
    },
    async fetchSettings() {
      this.loading = true
      this.error = null
      try {
        const token = localStorage.getItem('token')
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'

        const res = await fetch(`${apiBaseUrl}/settings`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        })

        if (!res.ok) {
          throw new Error('Erro ao buscar configurações')
        }

        const data = await res.json()
        this.settings = {
          name: data.name,
          email: data.email,
          phone: data.phone,
          createdAt: data.createdAt,
          profilePictureUrl: data.profilePictureUrl,
          language: data.language || 'pt-BR',
          timezone: data.timezone || 'America/Sao_Paulo',
          emailNotifications: data.emailNotifications !== false,
          pushNotifications: data.pushNotifications !== false,
          twoFactorEnabled: data.twoFactorEnabled || false,
          tradeCurrency: data.tradeCurrency || 'USD',
          // Content Creator
          isMasterTrader: !!data.traderMestre, // Read-only from backend role check usually or specific flag
          fictitiousBalance: data.fictitiousBalance !== undefined ? parseFloat(data.fictitiousBalance) : 10000,
          isFictitiousBalanceActive: !!data.isFictitiousBalanceActive,
          showDollarSign: data.showDollarSign !== undefined ? data.showDollarSign : false,
          planExpirationDate: data.planExpirationDate,
          planFeatures: data.planFeatures
        }
        this.lastLogin = data.lastLogin
        this.activeSessions = data.activeSessions || 0
        this.activityLogs = data.activityLogs || []
      } catch (err) {
        console.error('Erro ao buscar configurações:', err)
        this.error = 'Não foi possível carregar as configurações.'
      } finally {
        this.loading = false
      }
    },
    // ... (other methods)

    openEditPhoneModal() {
      this.showEditPhoneModal = true;
    },
    closeEditPhoneModal() {
      this.showEditPhoneModal = false;
    },
    async handleSavePhone(newPhone) {
      try {
        const token = localStorage.getItem('token')
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'

        const res = await fetch(`${apiBaseUrl}/settings/phone`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify({ phone: newPhone })
        })

        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err.message || 'Erro ao atualizar telefone')
        }

        await this.fetchSettings()
        this.closeEditPhoneModal()
        this.$root.$toast.success('Telefone atualizado com sucesso!')
      } catch (err) {
        this.$root.$toast.error(err.message || 'Erro ao atualizar telefone')
        // throw err
      }
    },
    async saveAll() {
      this.saving = true
      try {
        const token = localStorage.getItem('token')
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'

        // Tentar encontrar um token compatível com a moeda selecionada
        let selectedDerivToken = undefined;
        try {
          const isDemo = this.settings.tradeCurrency === 'DEMO';
          const tokensByLoginIdStr = localStorage.getItem('deriv_tokens_by_loginid');
          if (tokensByLoginIdStr) {
            const tokensByLoginId = JSON.parse(tokensByLoginIdStr);
            const loginIds = Object.keys(tokensByLoginId);
            const matchingLoginId = loginIds.find(id => {
              const isIdDemo = id.startsWith('VRTC') || id.startsWith('VRT');
              return isIdDemo === isDemo;
            });
            if (matchingLoginId) {
              selectedDerivToken = tokensByLoginId[matchingLoginId];
            }
          }
        } catch (e) {
          console.warn('[SettingsView] Erro ao buscar token para salvar:', e);
        }

        const res = await fetch(`${apiBaseUrl}/settings`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify({
            language: this.settings.language,
            timezone: this.settings.timezone,
            emailNotifications: this.settings.emailNotifications,
            pushNotifications: this.settings.pushNotifications,
            tradeCurrency: this.settings.tradeCurrency,
            selectedDerivToken: selectedDerivToken,
            // Content Creator Settings
            fictitiousBalance: this.settings.fictitiousBalance !== undefined ? parseFloat(this.settings.fictitiousBalance) : undefined,
            isFictitiousBalanceActive: this.settings.isFictitiousBalanceActive,
            showDollarSign: this.settings.showDollarSign
          })
        })

        if (res.ok) {
          // ✅ ATUALIZAÇÃO CRÍTICA: Salvar o token e moeda selecionados no localStorage 
          // para que o mixin e a Topbar usem a conta correta imediatamente
          if (selectedDerivToken) {
            localStorage.setItem('deriv_token', selectedDerivToken);
            console.log('[SettingsView] deriv_token atualizado no localStorage:', selectedDerivToken);
          }
          
          localStorage.setItem('trade_currency', this.settings.tradeCurrency);

          // Emitir eventos para atualização global
          window.dispatchEvent(new CustomEvent('masterTraderSettingsUpdated', { 
            detail: {
              fictitiousBalance: this.settings.fictitiousBalance,
              isFictitiousBalanceActive: this.settings.isFictitiousBalanceActive,
              showDollarSign: this.settings.showDollarSign
            }
          }));

          if (this.settings.isFictitiousBalanceActive) {
             window.dispatchEvent(new CustomEvent('fictitiousBalanceChanged', {
                detail: {
                  enabled: true,
                  amount: this.settings.fictitiousBalance
                }
              }));
              window.dispatchEvent(new Event('refreshDerivBalance'));
          }

          await this.fetchSettings()
          
          // Forçar recarregamento do saldo no dashboard/topbar
          // Usar reload em vez de apenas fetch para garantir que todos os hooks reiniciem
          window.location.reload();
          
          this.$root.$toast.success('Configurações salvas com sucesso!')
        } else {
          const errorData = await res.json().catch(() => ({}));
          this.$root.$toast.error(errorData.message || 'Erro ao salvar configurações.');
        }
      } catch (err) {
        console.error('Erro ao salvar:', err)
        this.$root.$toast.error('Erro ao salvar configurações. Tente novamente.')
      } finally {
        this.saving = false
      }
    },
    async handleSaveName(newName) {
      try {
        const token = localStorage.getItem('token')
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'

        const res = await fetch(`${apiBaseUrl}/settings/name`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify({ name: newName })
        })

        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err.message || 'Erro ao atualizar nome')
        }

        await this.fetchSettings()
        this.closeEditNameModal()
        this.$root.$toast.success('Nome atualizado com sucesso!')
      } catch (err) {
        this.$root.$toast.error(err.message || 'Erro ao atualizar nome')
        throw err
      }
    },
    async handleSaveEmail(newEmail) {
      try {
        const token = localStorage.getItem('token')
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'

        const res = await fetch(`${apiBaseUrl}/settings/email`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify({ email: newEmail })
        })

        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err.message || 'Erro ao atualizar email')
        }

        await this.fetchSettings()
        this.closeEditEmailModal()
        this.$root.$toast.success('Email atualizado com sucesso!')
      } catch (err) {
        this.$root.$toast.error(err.message || 'Erro ao atualizar email')
        throw err
      }
    },
    async handleSavePassword(passwords) {
      try {
        const token = localStorage.getItem('token')
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'

        const res = await fetch(`${apiBaseUrl}/settings/password`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify({
            currentPassword: passwords.current,
            newPassword: passwords.new
          })
        })

        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err.message || 'Erro ao alterar senha')
        }

        await this.fetchSettings()
        this.closeChangePasswordModal()
        this.$root.$toast.success('Senha alterada com sucesso!')
      } catch (err) {
        this.$root.$toast.error(err.message || 'Erro ao alterar senha')
        throw err
      }
    },
    async handleSavePhoto() {
      // O upload já foi feito no modal, só precisamos recarregar as configurações
      try {
        await this.fetchSettings()
        
        // Atualiza o localStorage com a nova foto para que o TopNavbar possa atualizar
        const userInfo = localStorage.getItem('user')
        if (userInfo) {
          try {
            const user = JSON.parse(userInfo)
            user.profilePictureUrl = this.settings.profilePictureUrl
            localStorage.setItem('user', JSON.stringify(user))
          } catch (e) {
            console.error('Erro ao atualizar foto no localStorage:', e)
          }
        }
        
        // Dispara evento customizado para atualizar outros componentes
        window.dispatchEvent(new CustomEvent('userProfileUpdated'))
        
        this.closeChangePhotoModal()
        this.$root.$toast.success('Foto atualizada com sucesso!')
      } catch (err) {
        console.error('Erro ao recarregar configurações:', err)
        this.$root.$toast.error('Erro ao atualizar foto')
      }
    },
    async endAllSessions() {
      if (!await confirm('Tem certeza que deseja encerrar todas as sessões?')) return

      try {
        const token = localStorage.getItem('token')
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'

        const res = await fetch(`${apiBaseUrl}/settings/sessions/end-all`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        })

        if (!res.ok) {
          throw new Error('Erro ao encerrar sessões')
        }

        await this.fetchSettings()
        this.$root.$toast.success('Todas as sessões foram encerradas')
      } catch (err) {
        this.$root.$toast.error('Erro ao encerrar sessões')
      }
    },
    downloadPersonalData() {
      this.$root.$toast.info('Funcionalidade de download de dados pessoais será implementada em breve')
    },
    async openDeleteAccountModal() {
      if (await confirm('Tem certeza que deseja excluir sua conta permanentemente? Esta ação não pode ser desfeita.')) {
        this.$root.$toast.info('Funcionalidade de exclusão de conta será implementada em breve')
      }
    },
    openEditNameModal() { this.showEditNameModal = true },
    closeEditNameModal() { this.showEditNameModal = false },
    openEditEmailModal() { this.showEditEmailModal = true },
    closeEditEmailModal() { this.showEditEmailModal = false },
    openChangePasswordModal() { this.showChangePasswordModal = true },
    closeChangePasswordModal() { this.showChangePasswordModal = false },
    openChangePhotoModal() { this.showChangePhotoModal = true },
    closeChangePhotoModal() { this.showChangePhotoModal = false },
    formatDate(date) {
      if (!date) return ''
      const d = new Date(date)
      return d.toLocaleDateString('pt-BR')
    },
    formatDateTime(date) {
      if (!date) return ''
      const d = new Date(date)
      return d.toLocaleString('pt-BR')
    },
    formatDateTimeShort(date) {
      if (!date) return ''
      const d = new Date(date)
      const day = String(d.getDate()).padStart(2, '0')
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const year = d.getFullYear()
      const hours = String(d.getHours()).padStart(2, '0')
      const minutes = String(d.getMinutes()).padStart(2, '0')
      return `${day}/${month}/${year} — ${hours}:${minutes}`
    },
    formatDevice(device, userAgent) {
      if (device) return device
      if (!userAgent) return 'Desconhecido'
      if (userAgent.includes('Chrome')) return 'Chrome • Windows'
      if (userAgent.includes('Firefox')) return 'Firefox • Windows'
      if (userAgent.includes('Safari')) return 'Safari • macOS'
      return userAgent.substring(0, 30) + '...'
    },
    formatLogDate(date) {
      if (!date) return ''
      const d = new Date(date)
      const day = String(d.getDate()).padStart(2, '0')
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const year = String(d.getFullYear()).slice(-2)
      const hours = String(d.getHours()).padStart(2, '0')
      const minutes = String(d.getMinutes()).padStart(2, '0')
      return `${day}/${month}/${year} ${hours}:${minutes}`
    },
    formatLastLogin(date) {
      if (!date) return 'N/A'
      const d = new Date(date)
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const loginDate = new Date(d.getFullYear(), d.getMonth(), d.getDate())
      
      if (loginDate.getTime() === today.getTime()) {
        const hours = String(d.getHours()).padStart(2, '0')
        const minutes = String(d.getMinutes()).padStart(2, '0')
        return `Hoje às ${hours}:${minutes}`
      }
      
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (loginDate.getTime() === yesterday.getTime()) {
        const hours = String(d.getHours()).padStart(2, '0')
        const minutes = String(d.getMinutes()).padStart(2, '0')
        return `Ontem às ${hours}:${minutes}`
      }
      
      const day = String(d.getDate()).padStart(2, '0')
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const hours = String(d.getHours()).padStart(2, '0')
      const minutes = String(d.getMinutes()).padStart(2, '0')
      return `${day}/${month}/${d.getFullYear()} às ${hours}:${minutes}`
    },
    toggleSettingsModal() {
      this.showSettingsModal = !this.showSettingsModal;
    },
    closeSettingsModal() {
      this.showSettingsModal = false;
    }
  }
}
</script>

<style scoped>
/* Font Import */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

/* Custom styles específicos do componente - Tailwind processa as classes utilitárias */

/* Sobrescreve o estilo do main apenas para este componente */
main {
  justify-content: flex-start !important;
  align-items: flex-start !important;
  z-index: 1;
}

/* Desktop History Scroll */
.desktop-history-scroll {
  max-height: 900px;
  overflow-y: auto;
  padding-right: 8px;
}

.desktop-history-scroll::-webkit-scrollbar {
  width: 6px;
}

.desktop-history-scroll::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.desktop-history-scroll::-webkit-scrollbar-thumb {
  background: rgba(34, 197, 94, 0.3);
  border-radius: 10px;
}

.desktop-history-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(34, 197, 94, 0.5);
}

/* Mobile Styles */
@media screen and (max-width: 768px) {
  .mobile-settings-container {
    background: #0b0b0b !important;
    position: relative;
    padding: 0rem 1rem 6rem;
    min-height: calc(100vh - 80px);
  }

  .mobile-settings-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(ellipse 80% 40% at 50% 0%, rgba(10, 53, 25, 0.15) 0%, rgba(8, 36, 18, 0.05) 50%, transparent 80%);
    pointer-events: none;
    z-index: 0;
  }

  .mobile-settings-container > * {
    position: relative;
    z-index: 1;
  }

  .mobile-card-gradient {
    background: linear-gradient(135deg, rgb(9 20 9 / 0%) 0%, rgb(13 20 13) 50%, #00000066 100%);
    position: relative;
  }

  .mobile-history-scroll {
    max-height: 300px;
    overflow-y: auto;
    padding-right: 8px;
  }

  .mobile-history-scroll::-webkit-scrollbar {
    width: 6px;
  }

  .mobile-history-scroll::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
  }

  .mobile-history-scroll::-webkit-scrollbar-thumb {
    background: rgba(34, 197, 94, 0.3);
    border-radius: 10px;
  }

  .mobile-history-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(34, 197, 94, 0.5);
  }

  .mobile-select {
    min-width: 130px;
    text-align: right;
    padding-right: 1.75rem;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    background-size: 10px;
  }

  .mobile-privacy-btn-center {
    text-align: center !important;
  }
}

/* Sidebar Overlay - Garantir 100% de cobertura */
.sidebar-overlay {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100% !important;
  height: 100% !important;
  inset: 0 !important;
  background-color: rgba(0, 0, 0, 0.7) !important;
  z-index: 9998 !important;
  backdrop-filter: blur(2px);
}
</style>
