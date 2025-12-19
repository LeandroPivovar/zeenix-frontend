<template>
  <div class="dashboard-layout">
    <div
      v-if="isSidebarOpen && isMobile"
      class="sidebar-overlay"
      @click="closeSidebar"
    ></div>

    <!-- Sidebar -->
    <AppSidebar 
      :is-open="isSidebarOpen" 
      :is-collapsed="localSidebarCollapsed"
      :is-mobile="isMobile"
      @close-sidebar="closeSidebar" 
      @toggle-collapse="toggleSidebarCollapse" 
    />
    
    <div class="dashboard-content-wrapper" :class="{ 'sidebar-collapsed': localSidebarCollapsed }">
      <!-- Top Navbar -->
      <TopNavbar 
        v-if="!isMobile"
        :is-sidebar-collapsed="localSidebarCollapsed"
        :balance="info?.balance"
        :account-type="accountType"
        @open-settings="toggleSettingsModal"
        @account-type-changed="switchAccount"
        :balances-by-currency-real="balancesByCurrencyReal"
        :balances-by-currency-demo="balancesByCurrencyDemo"
        :currency-prefix="preferredCurrencyPrefix"
        @toggle-sidebar="toggleMobileSidebar"
        @toggle-sidebar-collapse="toggleSidebarCollapse"
      />
    
    <!-- Main Content -->
    <main class="main-content bg-zenix-bg noise-bg font-inter overflow-y-auto w-full" style="overflow-x: hidden;">
      <!-- Hero Onboarding Section -->
      <section id="hero-section" class="w-full mt-16 py-12 px-8 relative overflow-visible group h-[560px]">
      <div class="absolute inset-0 z-0 bg-gradient-to-r from-[#0B0B0B] to-transparent" style="left: -32px; width: calc(100% + 64px);">
        <!-- Video Background - Desktop Only (Dual Video for Seamless Loop) -->
        <video 
          ref="heroVideo1"
          class="hidden md:block absolute inset-0 w-full h-full object-cover video-bg video-layer-1"
          autoplay 
          muted 
          playsinline
          preload="auto"
        >
          <source src="@/assets/video/hero_background.mp4" type="video/mp4">
        </video>
        <video 
          ref="heroVideo2"
          class="hidden md:block absolute inset-0 w-full h-full object-cover video-bg video-layer-2"
          muted 
          playsinline
          preload="auto"
        >
          <source src="@/assets/video/hero_background.mp4" type="video/mp4">
        </video>
        <!-- Fallback Background for Mobile -->
        <div class="md:hidden absolute inset-0 bg-gradient-to-br from-[#0B0B0B] via-[#0d1410] to-[#0B0B0B]">
        </div>
        <!-- Overlay for Desktop - desaparece quando sidebar está colapsada -->
        <div v-if="!localSidebarCollapsed" class="hidden md:block absolute inset-0 bg-gradient-to-r from-[rgb(20_17_17/0.35)] to-transparent">
        </div>
      </div>
      <div class="relative z-10 h-full w-full px-12">
        <div class="flex justify-between items-center h-full gap-20">
          <div class="flex flex-col justify-center space-y-10 flex-shrink-0">
            <div class="space-y-6 text-left">
              <h1 class="text-[72px] font-bold leading-[1.1] tracking-[-0.03em] text-left">
                <span class="text-white">Seja bem-vindo,</span><br><span class="text-[#22C55E]">{{ userName }}</span>
              </h1>
              <p class="text-[22px] text-white/60 leading-[1.7] max-w-[600px] text-left">
                Comece agora configurando sua conta e realizando seu primeiro depósito.
              </p>
            </div>
            <div class="pt-4 self-start">
              <button 
                @click="$router.push('/settings?tab=deposit')"
                class="relative bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#15803D] text-white text-base font-semibold px-10 py-4 rounded-xl transition-all duration-300 overflow-hidden group shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:shadow-[0_0_40px_rgba(34,197,94,0.6)] hover:scale-105"
              >
                <span class="relative z-10 flex items-center space-x-2">
                  <span>Depositar agora</span>
                  <i class="fas fa-arrow-right text-sm"></i>
                </span>
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
      </section>
      
      <!-- Ticker Section -->
      <section id="ticker-section" class="px-8 py-3 relative overflow-hidden border-t border-[#22C55E]/20 bg-[rgba(11,11,11,0.8)] backdrop-blur-sm w-full">
        <div class="relative z-10 w-full">
          <div class="relative overflow-hidden w-full">
            <div class="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[rgba(11,11,11,0.95)] to-transparent z-10 pointer-events-none"></div>
            <div class="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[rgba(11,11,11,0.95)] to-transparent z-10 pointer-events-none"></div>
            <div id="ticker-scroll" class="flex items-center whitespace-nowrap w-full">
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">João lucrou <span class="text-[#22C55E] font-semibold">$101,44</span> operando com a IA ORION</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-dollar-sign text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Marcos sacou <span class="text-[#22C55E] font-semibold">$250</span> de lucro gerado pelo Agente Sentinel</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-robot text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Rafael ativou a IA TRINITY no modo Normal</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-chart-line text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Lucas depositou <span class="text-[#22C55E] font-semibold">$300</span> para escalar suas operações</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Ana lucrou <span class="text-[#22C55E] font-semibold">$187</span> com o Copy Trading</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-trophy text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Pedro bateu a meta diária de <span class="text-[#22C55E] font-semibold">$420</span> com o Agente Apex</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Felipe lucrou <span class="text-[#22C55E] font-semibold">2,3%</span> hoje usando a IA ATLAS</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-dollar-sign text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Bruno sacou <span class="text-[#22C55E] font-semibold">$1.000</span> após 7 dias operando automaticamente</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-robot text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Carlos iniciou operações com a IA APOLLO</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Daniel lucrou <span class="text-[#22C55E] font-semibold">$96</span> em operações manuais com sinais</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-chart-line text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Eduardo depositou <span class="text-[#22C55E] font-semibold">$500</span> para aumentar o volume de operações</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Thiago lucrou <span class="text-[#22C55E] font-semibold">$312</span> com a IA NEXUS</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-chart-line text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">André encerrou o dia com <span class="text-[#22C55E] font-semibold">+3,1%</span> usando a IA TITAN</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-robot text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Victor ativou o Agente Autônomo Sentinel 24/7</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-dollar-sign text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Guilherme sacou <span class="text-[#22C55E] font-semibold">$780</span> de lucro acumulado</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Henrique lucrou <span class="text-[#22C55E] font-semibold">$155</span> com sinais manuais (90% de acerto)</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-cog text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Leandro configurou gestão Moderada na IA OMEGA</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Igor lucrou <span class="text-[#22C55E] font-semibold">$1.240</span> com o Copy Trading</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-chart-line text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Matheus aumentou o depósito para <span class="text-[#22C55E] font-semibold">$1.000</span></span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-chart-line text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Diego encerrou o dia com <span class="text-[#22C55E] font-semibold">+4,7%</span> no Agente Apex</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Fernando lucrou <span class="text-[#22C55E] font-semibold">$268</span> com a IA SIGMA</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-trophy text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Vinícius bateu a meta semanal de <span class="text-[#22C55E] font-semibold">$2.100</span></span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-robot text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Renan ativou a IA GENESIS no modo Veloz</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-dollar-sign text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Caio sacou <span class="text-[#22C55E] font-semibold">$540</span> direto da corretora</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Alex lucrou <span class="text-[#22C55E] font-semibold">$89</span> em apenas 3 operações manuais</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-cog text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Samuel configurou perfil Agressivo na IA FALCON</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-chart-line text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Leonardo acumulou <span class="text-[#22C55E] font-semibold">+18%</span> no mês com o Agente Autônomo</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Gustavo lucrou <span class="text-[#22C55E] font-semibold">$460</span> hoje com o Copy Trading</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-repeat text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Wesley reinvestiu <span class="text-[#22C55E] font-semibold">$400</span> dos lucros obtidos</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-chart-line text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Patrick encerrou o dia positivo com <span class="text-[#22C55E] font-semibold">+2,9%</span></span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Diego lucrou <span class="text-[#22C55E] font-semibold">$670</span> com a IA ORION</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-dollar-sign text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Murilo sacou <span class="text-[#22C55E] font-semibold">$1.500</span> após 30 dias de operação</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-robot text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Otávio ativou o modo Agressivo na IA TRINITY</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Fábio lucrou <span class="text-[#22C55E] font-semibold">$134</span> em sinais com 85% de acerto</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-chart-line text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Jefferson aumentou o capital para <span class="text-[#22C55E] font-semibold">$2.000</span></span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-trophy text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Alan bateu a meta diária de <span class="text-[#22C55E] font-semibold">$350</span></span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Rodrigo lucrou <span class="text-[#22C55E] font-semibold">$980</span> com o Agente Sentinel</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-chart-line text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Nicolas encerrou o mês com <span class="text-[#22C55E] font-semibold">+22%</span> de lucro</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-robot text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Everton ativou o Copy Trading Profissional</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Pablo lucrou <span class="text-[#22C55E] font-semibold">$210</span> com a IA ATLAS</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-dollar-sign text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Sérgio sacou <span class="text-[#22C55E] font-semibold">$600</span> de lucro automático</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-robot text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Júnior ativou sua primeira IA no ZENIX</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Ricardo lucrou <span class="text-[#22C55E] font-semibold">$1.080</span> operando sem supervisão</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-cog text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Kelvin ajustou gestão para Conservadora e manteve lucro</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-chart-line text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Arthur acumulou <span class="text-[#22C55E] font-semibold">$3.400</span> no mês com o Agente Apex</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Douglas lucrou <span class="text-[#22C55E] font-semibold">$74</span> em uma única entrada manual</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-repeat text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Hugo reinvestiu os lucros para escalar resultados</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-chart-line text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Bruno encerrou o dia com <span class="text-[#22C55E] font-semibold">+5%</span> de performance</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Victor lucrou <span class="text-[#22C55E] font-semibold">$520</span> hoje usando a IA OMEGA</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-dollar-sign text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Rafael sacou o lucro e já ativou novas operações</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">João lucrou <span class="text-[#22C55E] font-semibold">$101,44</span> operando com a IA ORION</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-dollar-sign text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Marcos sacou <span class="text-[#22C55E] font-semibold">$250</span> de lucro gerado pelo Agente Sentinel</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-robot text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Rafael ativou a IA TRINITY no modo Normal</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-chart-line text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Lucas depositou <span class="text-[#22C55E] font-semibold">$300</span> para escalar suas operações</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Ana lucrou <span class="text-[#22C55E] font-semibold">$187</span> com o Copy Trading</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-trophy text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Pedro bateu a meta diária de <span class="text-[#22C55E] font-semibold">$420</span> com o Agente Apex</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Felipe lucrou <span class="text-[#22C55E] font-semibold">2,3%</span> hoje usando a IA ATLAS</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-dollar-sign text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Bruno sacou <span class="text-[#22C55E] font-semibold">$1.000</span> após 7 dias operando automaticamente</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-robot text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Carlos iniciou operações com a IA APOLLO</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Daniel lucrou <span class="text-[#22C55E] font-semibold">$96</span> em operações manuais com sinais</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-chart-line text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Eduardo depositou <span class="text-[#22C55E] font-semibold">$500</span> para aumentar o volume de operações</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Thiago lucrou <span class="text-[#22C55E] font-semibold">$312</span> com a IA NEXUS</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-chart-line text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">André encerrou o dia com <span class="text-[#22C55E] font-semibold">+3,1%</span> usando a IA TITAN</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-robot text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Victor ativou o Agente Autônomo Sentinel 24/7</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-dollar-sign text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Guilherme sacou <span class="text-[#22C55E] font-semibold">$780</span> de lucro acumulado</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Henrique lucrou <span class="text-[#22C55E] font-semibold">$155</span> com sinais manuais (90% de acerto)</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-cog text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Leandro configurou gestão Moderada na IA OMEGA</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Igor lucrou <span class="text-[#22C55E] font-semibold">$1.240</span> com o Copy Trading</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-chart-line text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Matheus aumentou o depósito para <span class="text-[#22C55E] font-semibold">$1.000</span></span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-chart-line text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Diego encerrou o dia com <span class="text-[#22C55E] font-semibold">+4,7%</span> no Agente Apex</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Fernando lucrou <span class="text-[#22C55E] font-semibold">$268</span> com a IA SIGMA</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-trophy text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Vinícius bateu a meta semanal de <span class="text-[#22C55E] font-semibold">$2.100</span></span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-robot text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Renan ativou a IA GENESIS no modo Veloz</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-dollar-sign text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Caio sacou <span class="text-[#22C55E] font-semibold">$540</span> direto da corretora</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Alex lucrou <span class="text-[#22C55E] font-semibold">$89</span> em apenas 3 operações manuais</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-cog text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Samuel configurou perfil Agressivo na IA FALCON</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-chart-line text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Leonardo acumulou <span class="text-[#22C55E] font-semibold">+18%</span> no mês com o Agente Autônomo</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Gustavo lucrou <span class="text-[#22C55E] font-semibold">$460</span> hoje com o Copy Trading</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-repeat text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Wesley reinvestiu <span class="text-[#22C55E] font-semibold">$400</span> dos lucros obtidos</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-chart-line text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Patrick encerrou o dia positivo com <span class="text-[#22C55E] font-semibold">+2,9%</span></span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Diego lucrou <span class="text-[#22C55E] font-semibold">$670</span> com a IA ORION</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-dollar-sign text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Murilo sacou <span class="text-[#22C55E] font-semibold">$1.500</span> após 30 dias de operação</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-robot text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Otávio ativou o modo Agressivo na IA TRINITY</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Fábio lucrou <span class="text-[#22C55E] font-semibold">$134</span> em sinais com 85% de acerto</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-chart-line text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Jefferson aumentou o capital para <span class="text-[#22C55E] font-semibold">$2.000</span></span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-trophy text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Alan bateu a meta diária de <span class="text-[#22C55E] font-semibold">$350</span></span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Rodrigo lucrou <span class="text-[#22C55E] font-semibold">$980</span> com o Agente Sentinel</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-chart-line text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Nicolas encerrou o mês com <span class="text-[#22C55E] font-semibold">+22%</span> de lucro</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-robot text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Everton ativou o Copy Trading Profissional</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Pablo lucrou <span class="text-[#22C55E] font-semibold">$210</span> com a IA ATLAS</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-dollar-sign text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Sérgio sacou <span class="text-[#22C55E] font-semibold">$600</span> de lucro automático</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-robot text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Júnior ativou sua primeira IA no ZENIX</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Ricardo lucrou <span class="text-[#22C55E] font-semibold">$1.080</span> operando sem supervisão</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-cog text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Kelvin ajustou gestão para Conservadora e manteve lucro</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-chart-line text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Arthur acumulou <span class="text-[#22C55E] font-semibold">$3.400</span> no mês com o Agente Apex</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Douglas lucrou <span class="text-[#22C55E] font-semibold">$74</span> em uma única entrada manual</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-repeat text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Hugo reinvestiu os lucros para escalar resultados</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-chart-line text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Bruno encerrou o dia com <span class="text-[#22C55E] font-semibold">+5%</span> de performance</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Victor lucrou <span class="text-[#22C55E] font-semibold">$520</span> hoje usando a IA OMEGA</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-dollar-sign text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Rafael sacou o lucro e já ativou novas operações</span></div>
            </div>
          </div>
        </div>
      </section>
      
      <div class="px-8 py-5 w-full">
        <!-- Mobile Account Summary -->
        <section class="mobile-account-summary">
          <div class="mobile-account-user">
            <div class="mobile-account-profile-wrapper">
              <img 
                v-if="userProfilePicture"
                :src="userProfilePicture"
                :alt="userName"
                class="mobile-account-avatar"
                @click="toggleMobileSidebar"
                style="cursor: pointer;"
              />
              <div 
                v-else
                class="mobile-account-avatar mobile-account-avatar-placeholder"
                @click="toggleMobileSidebar"
                style="cursor: pointer;"
              >
                <span class="mobile-account-avatar-initials">{{ userInitials }}</span>
              </div>
              <div class="mobile-account-info">
                <div class="mobile-account-name-wrapper">
                  <div class="mobile-account-name-container">
                    <div class="mobile-account-name">{{ fullUserName }}</div>
                    <div class="mobile-account-status">Conta Ativa</div>
                  </div>
                  <div class="mobile-header-icons">
                    <button 
                      id="notifications-btn-mobile"
                      @click="toggleNotificationsModal"
                      class="text-white/45 hover:text-white/80 transition-colors w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/5 active:scale-95 relative"
                    >
                      <i class="fa-solid fa-bell text-[17px]"></i>
                      <span class="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#22C55E] rounded-full"></span>
                    </button>
                    <button 
                      id="settings-btn-mobile"
                      @click="toggleSettingsModal"
                      class="text-white/45 hover:text-white/80 transition-colors w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/5 active:scale-95"
                    >
                      <i class="fa-solid fa-gear text-[17px]"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mobile-account-header">
            <h3 class="mobile-account-title">Seu total em conta</h3>
            <button class="mobile-account-eye" @click="toggleBalanceVisibility">
              <i :class="balanceVisible ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
            </button>
          </div>
          <div class="mobile-account-balance">
            <span v-if="balanceVisible" class="inline-flex items-center">
              <span v-if="currentAccountType === 'demo'" class="demo-currency-symbol-mobile-wrapper">
                <span class="demo-currency-symbol-mobile">D</span>
              </span>
              <span v-else>$</span>
              {{ balanceVisible ? mobileBalanceValue : '' }}
            </span>
            <span v-else>••••••</span>
          </div>
          <div class="mobile-account-performance">
            <span class="mobile-account-percentage">+0%</span>
            <span class="mobile-account-period">esta semana</span>
          </div>
          <div class="mobile-account-actions">
            <button class="mobile-action-btn" @click="openDepositFlow">
              <i class="fas fa-wallet"></i>
              <span>Depositar</span>
            </button>
            <button class="mobile-action-btn">
              <i class="fas fa-chart-line"></i>
              <span>Operar</span>
            </button>
          </div>
        </section>
        
        <!-- Best IAs Section -->
        <section id="best-ai-section" class="px-12 pt-20 pb-0 relative w-full">
          <div class="absolute inset-0 bg-gradient-to-b from-[#0B0B0B] via-[#0E0E0E] to-[#0B0B0B] opacity-40 pointer-events-none"></div>
          <div class="relative z-10 w-full">
            <!-- Desktop Header -->
            <div class="text-left mb-8 space-y-2 desktop-ias-header">
              <h2 class="text-5xl font-bold text-[#E6E6E6] tracking-[-0.02em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.08)]">Melhores IA's Agora</h2>
              <p class="desktop-description-text text-[17px] text-[#9B9B9B] max-w-3xl leading-[1.75]">
                Escolha entre as inteligências artificiais mais avançadas do mercado. Cada IA foi otimizada para diferentes estratégias e perfis de risco, garantindo máxima performance em suas operações.
              </p>
            </div>
            
            <!-- Mobile Header -->
            <div class="mobile-ias-header">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-[20px] font-bold text-[#E6E6E6]">Melhores IAs</h2>
                <button class="see-all-btn-mobile" @click="openIAsModal">
                  Ver todas >
                </button>
              </div>
            </div>
            
            <div class="w-full h-[1px] bg-[#1C1C1C] opacity-35 mb-12"></div>
            
            <!-- Desktop Grid -->
            <div class="grid grid-cols-4 gap-6 mb-0 desktop-grid-ias">
            <div 
              v-for="(ia, index) in bestIAs" 
              :key="index"
              :id="`ai-card-${index + 1}`"
              class="relative bg-[#0B0B0B] rounded-[20px] overflow-hidden shadow-[0_12px_48px_rgba(0,0,0,0.6),0_0_0_1px_rgba(34,197,94,0.08),0_0_32px_rgba(34,197,94,0.15),0_8px_20px_rgba(34,197,94,0.12)] hover:shadow-[0_20px_64px_rgba(0,0,0,0.7),0_0_0_1px_rgba(34,197,94,0.25),0_0_48px_rgba(34,197,94,0.25),0_12px_28px_rgba(34,197,94,0.18)] transition-all duration-500 group hover:-translate-y-1.5"
            >
              <div class="absolute -inset-4 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.10)_0%,transparent_70%)] blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.04)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.02)_0%,transparent_70%)] animate-pulse" :style="{ animationDelay: `${index * 0.5}s`, animationDuration: '4s' }"></div>
              <div class="h-[182px] w-full overflow-hidden relative">
                <img :src="ia.image" :alt="ia.alt || ia.name" class="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-[1.21] group-hover:saturate-[1.30] group-hover:-translate-y-0.5" style="filter: brightness(1.23) saturate(1.3) drop-shadow(0 0 12px rgba(34,197,94,0.18));">
                <!-- Gradiente da esquerda para direita (similar ao academy) -->
                <div class="absolute inset-0 bg-gradient-to-r from-[#0B0B0B] via-[rgba(11,11,11,0.98)] via-[rgba(11,11,11,0.95)] via-[rgba(11,11,11,0.85)] via-[rgba(11,11,11,0.75)] via-[rgba(11,11,11,0.65)] via-[rgba(11,11,11,0.5)] via-[rgba(11,11,11,0.35)] via-[rgba(11,11,11,0.25)] via-[rgba(11,11,11,0.15)] via-[rgba(11,11,11,0.1)] to-transparent pointer-events-none z-10"></div>
                <div class="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(11,11,11,0.3)] to-[#0B0B0B]"></div>
                <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent opacity-60"></div>
              </div>
              <div class="p-6 flex flex-col gap-3.5 relative">
                <div class="flex flex-col gap-2">
                  <h3 class="text-xl font-semibold text-[rgba(255,255,255,0.95)] transition-colors duration-300 group-hover:text-white">{{ ia.name }}</h3>
                  <p class="text-sm text-[rgba(255,255,255,0.78)] leading-relaxed transition-colors duration-300 group-hover:text-[rgba(255,255,255,0.85)]">{{ ia.description || ia.category }}</p>
                </div>
                <button 
                  @click="activateIA()"
                  class="w-full h-12 bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#15803D] text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_6px_20px_rgba(34,197,94,0.38),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_8px_28px_rgba(34,197,94,0.53),inset_0_1px_0_rgba(255,255,255,0.15)] group/btn"
                  style="filter: brightness(1.05) saturate(1.08);"
                >
                  <span>Ativar IA</span>
                  <i class="fas fa-arrow-right text-xs transition-transform duration-300 group-hover/btn:translate-x-1"></i>
                </button>
              </div>
            </div>
          </div>
          
          <!-- Mobile Grid - Lista vertical de 4 IAs -->
          <div class="mobile-grid-ias">
            <div 
              v-for="(ia, index) in displayedIAs" 
              :key="index"
              class="ia-card-mobile"
            >
              <div class="ia-icon-mobile">
                <img :src="ia.image" :alt="ia.name" />
              </div>
              <div class="ia-info-mobile">
                <h3 class="ia-name-mobile">{{ ia.name }}</h3>
                <p class="ia-category-mobile">{{ ia.category || 'IA de Alta Frequência' }}</p>
              </div>
              <div class="ia-performance-mobile">
                <div class="ia-chart-mobile">
                  <svg viewBox="0 0 100 30" class="sparkline-mobile">
                    <polyline 
                      :points="generateSparklinePoints(ia.sparklineData || [])" 
                      fill="none" 
                      stroke="#22C55E" 
                      stroke-width="2"
                    />
                  </svg>
                </div>
                <span class="ia-percentage-mobile">+{{ getIAPerformance(ia.id) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Overall Performance Section -->
      <section id="performance-section" class="px-12 pt-0 pb-36 relative w-full">
        <div class="absolute inset-0 bg-gradient-to-b from-[#0B0B0B] via-[#0E0E0E] to-[#0B0B0B] opacity-40 pointer-events-none"></div>
        <div class="w-full h-[1px] bg-[#1C1C1C] opacity-35 mb-12"></div>
        <div class="relative z-10 w-full">
          <!-- Desktop Header -->
          <div class="text-left mb-8 space-y-2 desktop-performance-header">
            <h2 class="text-5xl font-bold text-[#E6E6E6] tracking-[-0.02em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.08)]">Desempenho Geral</h2>
            <p class="text-[17px] text-[#9B9B9B] max-w-3xl leading-[1.75]">
              Ative agora os recursos que podem aumentar seus resultados automaticamente.<br>
              Cada ferramenta desligada é lucro não realizado.
            </p>
          </div>
          
          <!-- Mobile Header -->
          <div class="mobile-performance-header-title">
            <h2 class="text-[20px] font-bold text-[#E6E6E6]">Desempenho Geral</h2>
          </div>
          <div class="desktop-performance-grid">
            <div 
              v-for="(perf, index) in performanceData" 
              :key="index"
              :id="`performance-card-${index + 1}`"
              class="relative bg-gradient-to-br from-[#0E0E0E] to-[#0B0B0B] rounded-[18px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(34,197,94,0.12),0_0_40px_rgba(34,197,94,0.18),0_16px_24px_rgba(34,197,94,0.09)] border border-[#1C1C1C] w-full h-auto transition-all duration-[250ms] ease-out hover:scale-[1.02] hover:shadow-[0_12px_48px_rgba(0,0,0,0.65),0_0_0_1px_rgba(34,197,94,0.18),0_0_60px_rgba(34,197,94,0.28),0_20px_32px_rgba(34,197,94,0.12)] hover:bg-gradient-to-br hover:from-[#111111] hover:to-[#0A0A0A] group"
            >
              <div class="absolute -inset-4 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.12)_0%,transparent_70%)] blur-[80px] opacity-100 -z-10 transition-opacity duration-[250ms] group-hover:opacity-125"></div>
              <div class="p-6 flex flex-col gap-6">
                <div class="flex items-start justify-between">
                  <div class="w-[70px] h-[70px] bg-gradient-to-br from-[#22C55E]/10 to-[#16A34A]/5 rounded-xl flex items-center justify-center border border-[#22C55E]/20 shadow-[0_0_32px_rgba(34,197,94,0.28)]" :class="`animate-icon-pulse${index > 0 ? `-delay-${index}` : ''}`">
                    <i :class="[perf.icon, 'text-[#22C55E] text-[37px] drop-shadow-[0_0_12px_rgba(34,197,94,0.32)]']"></i>
                  </div>
                  <div class="text-right">
                    <div class="text-3xl font-bold text-[#22C55E]">{{ perf.percentage }}</div>
                    <div class="text-xs text-white/50 mt-1">esta semana</div>
                  </div>
                </div>
                <div class="h-16 relative transition-transform duration-[250ms] group-hover:translate-y-[-1px]">
                  <svg viewBox="0 0 200 60" preserveAspectRatio="none" class="w-full h-full" :style="{ filter: 'drop-shadow(0 0 3px rgba(34,197,94,0.35))' }">
                    <defs>
                      <linearGradient :id="`lineGradient${index + 1}`" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="rgba(34,197,94,0.4)" stop-opacity="1"></stop>
                        <stop offset="100%" stop-color="rgba(34,197,94,0)" stop-opacity="1"></stop>
                      </linearGradient>
                      <linearGradient :id="`strokeGradient${index + 1}`" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="rgba(34,197,94,0.95)" stop-opacity="1"></stop>
                        <stop offset="100%" stop-color="rgb(34,197,94)" stop-opacity="1"></stop>
                      </linearGradient>
                      <filter :id="`blur${index + 1}`">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="0.5"></feGaussianBlur>
                      </filter>
                      <filter :id="`glow${index + 1}`">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"></feGaussianBlur>
                        <feMerge>
                          <feMergeNode in="coloredBlur"></feMergeNode>
                          <feMergeNode in="SourceGraphic"></feMergeNode>
                        </feMerge>
                      </filter>
                    </defs>
                    <path :d="perf.chartPathFull || perf.chartPath" fill="none" :stroke="`url(#strokeGradient${index + 1})`" stroke-width="2.7" :filter="`url(#blur${index + 1})`" style="filter: brightness(1.33);"></path>
                    <circle cx="200" :cy="perf.chartEndY || 15" r="2.5" fill="#22C55E" :filter="`url(#glow${index + 1})`"></circle>
                    <path :d="`${perf.chartPathFull || perf.chartPath} L200,60 L0,60 Z`" :fill="`url(#lineGradient${index + 1})`"></path>
                  </svg>
                </div>
                <div class="space-y-3">
                  <div class="flex items-center justify-between text-sm"><span class="text-white/70">{{ perf.title }}</span></div>
                  <div class="space-y-2">
                    <div class="flex items-center justify-between text-xs">
                      <span class="text-white/50">Potencial usado</span>
                      <span :class="perf.usage > 0 ? 'text-[#22C55E] font-bold' : 'text-white/30 font-bold'" :style="perf.usage > 0 ? { filter: 'brightness(1.18) saturate(1.2);' } : { filter: 'brightness(1.1);' }">{{ perf.usage }}%</span>
                    </div>
                    <div class="w-full h-[9.7px] bg-[#1C1C1C] rounded-full overflow-hidden">
                      <div 
                        :class="perf.usage > 0 ? 'animate-bar-fill relative overflow-hidden' : ''"
                        class="h-full bg-gradient-to-r from-[#22C55E] via-[#1ED65F] to-[#16A34A] rounded-full shadow-[0_0_14px_rgba(34,197,94,0.65)]" 
                        :style="{ width: perf.usage + '%', filter: 'brightness(1.08) saturate(1.2);' }"
                      >
                        <div v-if="perf.usage > 0" class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-bar-shimmer"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <button 
                  @click="handlePerformanceAction(perf)"
                  class="w-full h-11 bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#15803D] text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-[0_6px_20px_rgba(34,197,94,0.35),0_0_22px_rgba(34,197,94,0.12),0_2px_4px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_28px_rgba(34,197,94,0.45),0_0_30px_rgba(34,197,94,0.25),0_3px_6px_rgba(0,0,0,0.4)] active:scale-[0.97] group/btn"
                  style="filter: brightness(1.1) saturate(1.1);"
                >
                  <span>{{ perf.buttonText }}</span>
                  <i class="fas fa-arrow-right text-xs transition-transform duration-200 group-hover/btn:translate-x-[3px]"></i>
                </button>
              </div>
            </div>
          </div>
          
          <!-- Mobile Performance Grid -->
          <div class="mobile-performance-grid">
            <div 
              v-for="(perf, index) in performanceData" 
              :key="index"
              class="mobile-performance-card"
            >
              <div class="mobile-performance-header">
                <div class="mobile-performance-icon">
                  <i :class="[perf.icon, 'text-[#22C55E]']"></i>
                </div>
                <h3 class="mobile-performance-title" v-html="formatTitleForMobile(perf.title)"></h3>
              </div>
              <div class="mobile-performance-percentage">{{ perf.percentage }}</div>
              <div class="mobile-performance-chart">
                <svg viewBox="0 0 200 60" preserveAspectRatio="none" class="w-full h-full">
                  <path :d="perf.chartPathFull || perf.chartPath" fill="none" stroke="#22C55E" stroke-width="2"></path>
                </svg>
              </div>
              <button 
                @click="handlePerformanceAction(perf)"
                class="mobile-performance-btn"
              >
                ATIVAR
              </button>
            </div>
          </div>
        </div>
      </section>
      </div>
    </main>
    
    <DesktopBottomNav />
  </div>
</div>

<!-- Modal de Melhores IAs -->
  <div v-if="showIAsModal" class="ias-modal-overlay" @click="closeIAsModal">
    <div class="ias-modal-content" @click.stop>
      <div class="ias-modal-header">
        <h2 class="ias-modal-title">Melhores IAs</h2>
        <button class="ias-modal-close" @click="closeIAsModal">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="ias-modal-body">
        <div class="ias-modal-grid">
          <div 
            v-for="(ia, index) in bestIAs" 
            :key="index"
            class="ia-card-modal"
          >
            <div class="ia-image-modal">
              <img :src="ia.image" :alt="ia.name" />
            </div>
            <div class="ia-content-modal">
              <h3 class="ia-name-modal">{{ ia.name }}</h3>
              <p class="ia-description-modal">{{ ia.description || ia.category }}</p>
              <div class="ia-performance-modal">
                <span class="ia-percentage-modal">+{{ getIAPerformance(ia.id) }}%</span>
              </div>
              <button 
                @click="activateIA()"
                class="ia-activate-btn-modal"
              >
                Ativar IA
                <i class="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

<!-- Modal de Settings -->
  <div v-if="showSettingsModal" class="settings-modal-overlay" @click="closeSettingsModal">
    <div class="settings-modal-content" @click.stop>
      <div class="settings-modal-header">
        <h2 class="settings-modal-title">Configurações</h2>
        <button class="settings-modal-close" @click="closeSettingsModal">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="settings-modal-body">
        <div class="settings-modal-section">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-14 h-14 rounded-full overflow-hidden border-2 border-white/10">
              <img 
                v-if="userProfilePicture"
                :src="userProfilePicture"
                :alt="userName"
                class="w-full h-full object-cover"
              />
              <div 
                v-else
                class="w-full h-full bg-[#22C55E]/20 flex items-center justify-center"
              >
                <span class="text-white text-lg font-semibold">{{ userInitials }}</span>
              </div>
            </div>
            <div class="settings-user-info">
              <h3 class="settings-user-name">{{ userName }}</h3>
              <p class="settings-user-status">Conta Ativa</p>
            </div>
          </div>

          <div class="glass-card rounded-xl p-4 mb-4">
            <div class="flex items-center justify-between mb-3">
              <span class="settings-balance-label">Saldo Total</span>
              <button 
                @click="toggleBalanceVisibility"
                class="settings-eye-btn"
              >
                <i :class="balanceVisible ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
              </button>
            </div>
            <p class="settings-balance-amount text-left">
              <span v-if="balanceVisible" class="inline-flex items-center">
                <span v-if="currentAccountType === 'demo'" class="demo-currency-symbol-wrapper">
                  <span class="demo-currency-symbol">D</span>
                </span>
                <span v-else>$</span>
                {{ balanceVisible ? mobileBalanceValue : '' }}
              </span>
              <span v-else>••••••</span>
            </p>
            <div class="flex items-center gap-3 mt-3">
              <button 
                @click="switchAccount('real')"
                :class="currentAccountType === 'real' ? 'settings-account-btn-active' : 'settings-account-btn-inactive'"
                class="settings-account-btn"
              >
                Real
              </button>
              <button 
                @click="switchAccount('demo')"
                :class="currentAccountType === 'demo' ? 'settings-account-btn-active' : 'settings-account-btn-inactive'"
                class="settings-account-btn"
              >
                Demo
              </button>
            </div>
          </div>

          <button 
            @click="openDepositFlow"
            class="settings-deposit-btn"
          >
            <i class="fa-solid fa-wallet"></i>
            <span>Depositar</span>
          </button>
        </div>

        <div class="settings-modal-section settings-modal-section-with-border">
          <div class="mb-4">
            <button 
              @click="toggleAccountsList"
              class="w-full flex items-center justify-between py-4 text-white/70 hover:text-white transition-colors"
            >
              <div class="flex items-center gap-3">
                <i class="fa-solid fa-wallet text-[16px]"></i>
                <span class="text-[14px] font-medium">Minhas Contas</span>
              </div>
              <i :class="showAccountsList ? 'fa-solid fa-chevron-up text-[12px]' : 'fa-solid fa-chevron-down text-[12px]'"></i>
            </button>
            
            <div v-if="showAccountsList" class="accounts-list">
              <div 
                v-for="account in availableAccounts" 
                :key="account.loginid"
                @click="selectAccount(account)"
                class="account-item flex items-center justify-between py-3 px-4 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-white text-[14px] font-medium">{{ account.loginid }}</span>
                    <i v-if="isCurrentAccount(account)" class="fa-solid fa-check text-[#22C55E] text-[12px]"></i>
                  </div>
                  <div class="flex items-center gap-2">
                    <span :class="account.isDemo ? 'text-white/60 text-[12px]' : 'text-white/80 text-[12px]'">
                      {{ account.isDemo ? 'Demo' : 'Real' }}
                    </span>
                    <span class="text-white/40 text-[12px]">•</span>
                    <span class="text-white/80 text-[12px] inline-flex items-center">
                      <span v-if="account.isDemo" class="demo-currency-symbol-modal-small-wrapper">
                        <span class="demo-currency-symbol-modal-small">D</span>
                      </span>
                      <span v-else>$</span>
                      {{ formatBalanceMobile(account.balance || 0) }}
                    </span>
                  </div>
                </div>
              </div>
              <div v-if="availableAccounts.length === 0" class="text-white/40 text-[12px] py-4 text-center">
                Nenhuma conta encontrada
              </div>
            </div>
          </div>

          <button 
            @click="logout"
            class="w-full flex items-center gap-3 py-4 text-[#FF4747] hover:text-[#FF6060] transition-colors"
          >
            <i class="fa-solid fa-right-from-bracket text-[16px]"></i>
            <span class="text-[14px] font-medium">Sair da corretora</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de Notificações -->
  <div v-if="showNotificationsModal" class="notifications-modal-overlay" @click="closeNotificationsModal">
    <div class="notifications-modal-content" @click.stop>
      <div class="notifications-modal-header">
        <h2 class="notifications-modal-title">Notificações</h2>
        <button class="notifications-modal-close" @click="closeNotificationsModal">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="notifications-modal-body">
        <div v-if="notifications.length === 0" class="notifications-empty">
          <i class="fa-solid fa-bell-slash text-[48px] text-white/20 mb-4"></i>
          <p class="text-white/40 text-[14px]">Nenhuma notificação</p>
        </div>
        <div v-else class="notifications-list">
          <div 
            v-for="(notification, index) in notifications" 
            :key="index"
            class="notification-item"
          >
            <div class="notification-icon">
              <i :class="notification.icon || 'fa-solid fa-info-circle'"></i>
            </div>
            <div class="notification-content">
              <h3 class="notification-title">{{ notification.title }}</h3>
              <p class="notification-message">{{ notification.message }}</p>
              <span class="notification-time">{{ notification.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopNavbar from '../components/TopNavbar.vue'
import DesktopBottomNav from '../components/DesktopBottomNav.vue'
import AppSidebar from '../components/Sidebar.vue'
import { loadAvailableAccounts } from '../utils/accountsLoader'

export default {
  name: 'DashboardConnected',
  components: {
    TopNavbar,
    DesktopBottomNav,
    AppSidebar
  },
  props: { 
    info: { 
      type: Object, 
      required: true 
    },
    isSidebarCollapsed: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isSidebarOpen: true,
      isMobile: false,
      localSidebarCollapsed: this.isSidebarCollapsed || false,
      accountType: 'real',
      showIAsModal: false,
      showSettingsModal: false,
      showNotificationsModal: false,
      showAccountsList: false,
      availableAccounts: [],
      loadingAccounts: false,
      userProfilePictureUrl: null,
      tradeCurrency: 'USD',
      notifications: [],
      quickTools: [
        {
          icon: 'fas fa-brain',
          title: 'IA de Investimento',
          description: 'Algoritmos inteligentes para maximizar seus lucros',
          buttonText: 'Acessar',
          route: '/InvestmentIA',
          image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/3597e3389b-f497a4d7c72b20551d57.png',
          alt: 'abstract futuristic AI neural network glowing green circuits holographic technology dark background'
        },
        {
          icon: 'fas fa-copy',
          title: 'Copy Trading',
          description: 'Copie estratégias de traders experientes',
          buttonText: 'Acessar',
          route: '/copy-trading',
          image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/d4268ec183-9da7a5516b5d6e6a6820.png',
          alt: 'abstract futuristic network connections holographic data streams glowing green nodes dark cyber background'
        },
        {
          icon: 'fas fa-chart-line',
          title: 'Operação Manual',
          description: 'Controle total sobre suas operações',
          buttonText: 'Acessar',
          route: '/operation',
          image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/c7a6be6838-90ddd100efdbc01f96c9.png',
          alt: 'abstract futuristic trading charts holographic financial data visualization glowing green graphs dark technology interface'
        },
        {
          icon: 'fas fa-robot',
          title: 'Agente Autônomo',
          description: 'Operações automatizadas 24/7',
          buttonText: 'Acessar',
          route: '/agente-autonomo',
          image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/1e365abefd-e72cf59c9eae4725f47b.png',
          alt: 'abstract futuristic autonomous robot AI glowing green circuits automated systems holographic technology dark background'
        }
      ],
      bestIAs: [
        {
          id: 'orion',
          name: 'IA Orion',
          category: 'Alta performance',
          description: 'Operações curtas e precisas nos movimentos dos Índices Sintéticos.',
          consistency: 82,
          image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/d5da89075d-89d4400832faf3146f3f.png',
          alt: 'circular neural network core with bright neon green glowing connections and energy nodes on pure black background, elegant thin lines, soft green ambient glow, futuristic digital brain structure',
          sparklineData: [45, 52, 48, 58, 55, 62, 58, 65, 62, 68]
        },
        {
          id: 'vega',
          name: 'IA Vega',
          category: 'Risco moderado',
          description: 'Consistência diária operando tendências estáveis.',
          consistency: 76,
          image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/32a220d5d1-0e8a97180ab9e8d7d494.png',
          alt: 'smooth flowing neural energy waves in neon green, continuous fluid motion with glowing particles following wave patterns on pure black background, elegant ambient green glow, digital energy visualization',
          sparklineData: [40, 45, 42, 48, 50, 47, 52, 55, 53, 58]
        },
        {
          id: 'pulse',
          name: 'IA Pulse',
          category: 'Alta velocidade',
          description: 'Estratégia agressiva para volatilidade intensa.',
          consistency: 91,
          image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/e3205bf243-eec06ca9c726e87c0cc2.png',
          alt: 'continuous neural pulse line with intense electric green energy spikes filling entire frame, fluid movements with glowing particles following pulse rhythm on pure black background, bright neon green peaks, soft ambient glow, zoomed in close-up view',
          sparklineData: [50, 58, 55, 65, 62, 70, 68, 75, 72, 80]
        },
        {
          id: 'titan',
          name: 'IA Titan',
          category: 'Alta volatilidade',
          description: 'IA projetada para capturar grandes movimentos de preço.',
          consistency: 88,
          image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/9c4f4d6555-824e01b659da0692b15c.png',
          alt: 'sharp triangular neural energy peaks in neon green, geometric synthetic forms with internal illumination on pure black background, non-organic digital aesthetic, glowing edges and soft ambient green light',
          sparklineData: [48, 55, 52, 62, 60, 68, 65, 72, 70, 78]
        }
      ],
      performanceData: [
        {
          icon: 'fas fa-brain',
          title: "IA's de Investimento",
          percentage: '+12.4%',
          usage: 32,
          buttonText: 'Ativar agora',
          chartPath: 'M0,20 L20,15 L40,18 L60,12 L80,14 L100,8',
          chartPathFull: 'M0,45 L25,42 L50,38 L75,35 L100,30 L125,28 L150,25 L175,20 L200,15',
          chartEndY: 15
        },
        {
          icon: 'fas fa-copy',
          title: 'Copy Trading',
          percentage: '+8.7%',
          usage: 0,
          buttonText: 'Ativar agora',
          chartPath: 'M0,22 L20,18 L40,20 L60,16 L80,17 L100,13',
          chartPathFull: 'M0,48 L25,46 L50,44 L75,40 L100,38 L125,35 L150,32 L175,28 L200,25',
          chartEndY: 25
        },
        {
          icon: 'fas fa-robot',
          title: 'Agente Autônomo',
          percentage: '+15.2%',
          usage: 0,
          buttonText: 'Ativar agora',
          chartPath: 'M0,18 L20,14 L40,16 L60,10 L80,12 L100,6',
          chartPathFull: 'M0,50 L25,48 L50,45 L75,42 L100,38 L125,33 L150,28 L175,22 L200,18',
          chartEndY: 18
        },
        {
          icon: 'fas fa-chart-line',
          title: 'Operações com Sinais',
          percentage: '+10.9%',
          usage: 58,
          buttonText: 'Operar agora',
          chartPath: 'M0,19 L20,16 L40,17 L60,13 L80,14 L100,10',
          chartPathFull: 'M0,46 L25,44 L50,41 L75,38 L100,35 L125,32 L150,28 L175,24 L200,22',
          chartEndY: 22
        }
      ],
      recommendedIA: {
        name: 'Orion',
        consistency: 82
      },
      topTrader: {
        name: 'Trader Elite',
        profit: '12.7'
      },
      todayProfit: 0,
      todayProfitPercent: 0,
      loadingTodayProfit: true,
      balanceVisible: true
    }
  },
  computed: {
    potentialValue() {
      const base = this.balanceNumeric;
      const projected = base * 0.12;
      return projected.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    },
    currencyPrefix() {
      return this.info?.currencyPrefix || this.getCurrencyPrefix(this.info?.currency);
    },
    preferredCurrencyPrefix() {
      return this.info?.preferredCurrencyPrefix || this.currencyPrefix;
    },
    balanceNumeric() {
      // Mesma lógica do TopNavbar
      const usdReal = this.balancesByCurrencyReal['USD'];
      if (usdReal !== undefined && usdReal !== null && usdReal > 0) {
        return usdReal;
      }
      const raw = this.info?.balance;
      if (typeof raw === 'number') return raw;
      if (typeof raw === 'string') {
        const parsed = Number(raw);
        return isNaN(parsed) ? 0 : parsed;
      }
      const val = raw?.value ?? raw?.balance ?? 0;
      const num = Number(val);
      return isNaN(num) ? 0 : num;
    },
    formattedBalance() {
      // Mesma lógica do TopNavbar - usa tradeCurrency para determinar se é demo
      if (this.tradeCurrency === 'DEMO') {
        const demo = this.balancesByCurrencyDemo['USD'] || 0;
        const prefix = this.getCurrencyPrefix('DEMO');
        return `${prefix}${demo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
      const value = this.balanceNumeric;
      const prefix = this.getCurrencyPrefix(this.tradeCurrency || 'USD');
      return `${prefix}${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    },
    balancesByCurrency() {
      return this.info?.balancesByCurrency || {};
    },
    balancesByCurrencyDemo() {
      return this.info?.balancesByCurrencyDemo || {};
    },
    balancesByCurrencyReal() {
      return this.info?.balancesByCurrencyReal || {};
    },
    usdBalance() {
      return this.balancesByCurrencyReal['USD'] ?? 0;
    },
    usdDemoBalance() {
      return this.balancesByCurrencyDemo['USD'] ?? 0;
    },
    btcBalance() {
      const real = this.balancesByCurrencyReal['BTC'];
      if (real !== undefined && real !== null) return real;
      return this.balancesByCurrency['BTC'] ?? 0;
    },
    userName() {
      const userInfo = localStorage.getItem('user');
      if (userInfo) {
        try {
          const user = JSON.parse(userInfo);
          if (user.name) {
            return user.name.split(' ')[0];
          }
        } catch (e) {
          console.error('Erro ao parsear informações do usuário:', e);
        }
      }
      return 'Usuário';
    },
    fullUserName() {
      const userInfo = localStorage.getItem('user');
      if (userInfo) {
        try {
          const user = JSON.parse(userInfo);
          if (user.name) {
            return user.name;
          }
        } catch (e) {
          console.error('Erro ao parsear informações do usuário:', e);
        }
      }
      return 'Usuário';
    },
    mobileBalanceValue() {
      if (this.currentAccountType === 'demo') {
        const demo = this.balancesByCurrencyDemo['USD'] || 0;
        return demo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
      const value = this.balanceNumeric;
      return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
    displayedIAs() {
      // Mobile: mostra apenas as primeiras 4 IAs
      return this.bestIAs.slice(0, 4);
    },
    userProfilePicture() {
      if (!this.userProfilePictureUrl) return null;
      
      // Se já é uma URL completa, retornar como está
      if (this.userProfilePictureUrl.startsWith('http://') || 
          this.userProfilePictureUrl.startsWith('https://')) {
        return this.userProfilePictureUrl;
      }
      
      // Se começa com /api/uploads, construir URL relativa ao domínio
      if (this.userProfilePictureUrl.startsWith('/api/uploads')) {
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
        const baseUrl = apiBaseUrl.replace(/\/api$/, '');
        return `${baseUrl}${this.userProfilePictureUrl}`;
      }
      
      // Fallback para caminhos antigos /uploads/...
      const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
      const baseUrl = apiBaseUrl.replace(/\/api$/, '');
      return `${baseUrl}${this.userProfilePictureUrl}`;
    },
    userInitials() {
      const userInfo = localStorage.getItem('user');
      if (userInfo) {
        try {
          const user = JSON.parse(userInfo);
          if (user.name) {
            const names = user.name.split(' ');
            if (names.length >= 2) {
              return (names[0][0] + names[names.length - 1][0]).toUpperCase();
            }
            return names[0][0].toUpperCase();
          }
        } catch (e) {
          // Ignorar erro de parsing
        }
      }
      return 'U';
    },
    currentAccountType() {
      // Determina o tipo de conta atual baseado no tradeCurrency do settings
      // Se tradeCurrency for 'DEMO', então é demo, senão é real
      return this.tradeCurrency === 'DEMO' ? 'demo' : 'real';
    },
    currentAccountLoginid() {
      // Retorna o loginid da conta atual
      try {
        const connectionStr = localStorage.getItem('deriv_connection');
        if (connectionStr) {
          const connection = JSON.parse(connectionStr);
          return connection.loginid || null;
        }
      } catch (e) {
        console.error('[Dashboard] Erro ao obter loginid:', e);
      }
      return null;
    },
  },
  watch: {
    accountType() {
      // Recalcular percentual quando mudar o tipo de conta
      this.recalculateProfitPercent();
    },
    balanceNumeric() {
      // Recalcular percentual quando o saldo mudar
      this.recalculateProfitPercent();
    }
  },
  created() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile);
  },
  async mounted() {
    this.initSparklines();
    await this.loadTodayProfitLoss();
    this.loadUserProfilePicture();
    await this.loadTradeCurrency();
    // Carregar contas disponíveis em background para otimizar troca de conta
    this.loadAccountsInBackground();
    // Configurar loop imperceptível do vídeo
    this.setupVideoLoop();
  },
  methods: {
    toggleMobileSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    closeSidebar() {
      this.isSidebarOpen = false;
    },
    toggleSidebarCollapse() {
      if (!this.isMobile) {
        this.localSidebarCollapsed = !this.localSidebarCollapsed;
      }
    },
    checkMobile() {
      this.isMobile = window.innerWidth <= 1024;
      if (this.isMobile) {
        this.isSidebarOpen = false;
        this.localSidebarCollapsed = false;
      } else {
        this.isSidebarOpen = true;
      }
    },
    formatTitleForMobile(title) {
      if (!this.isMobile) {
        return title;
      }
      // Aplicar quebras de linha apenas no mobile
      const titleMap = {
        "IA's de Investimento": "IA's de <br> Investimento",
        "Copy Trading": "Copy <br> Trading",
        "Agente Autônomo": "Agente <br> Autônomo",
        "Operações com Sinais": "Operações <br> com sinais"
      };
      return titleMap[title] || title;
    },
    async switchAccount(type) {
      // Usa a mesma lógica do Settings - altera o tradeCurrency
      try {
        const tradeCurrency = type === 'demo' ? 'DEMO' : 'USD';
        
        const apiBase = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${apiBase}/settings`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            tradeCurrency: tradeCurrency
          })
        });

        if (response.ok) {
          // Atualizar tradeCurrency local imediatamente
          this.tradeCurrency = tradeCurrency;
          this.accountType = type;
          
          // Recarregar página para aplicar mudanças em todos os componentes
          // Force refresh especialmente no mobile
          window.location.reload();
        } else {
          throw new Error('Erro ao alterar moeda');
        }
      } catch (error) {
        console.error('[Dashboard] Erro ao alterar moeda:', error);
        alert('Erro ao alterar moeda. Tente novamente.');
      }
    },
    async loadTradeCurrency() {
      // Carrega o tradeCurrency do settings
      try {
        const apiBase = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${apiBase}/settings`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          this.tradeCurrency = data.tradeCurrency || 'USD';
          // Atualizar accountType baseado no tradeCurrency
          this.accountType = this.tradeCurrency === 'DEMO' ? 'demo' : 'real';
        }
      } catch (error) {
        console.error('[Dashboard] Erro ao carregar tradeCurrency:', error);
        // Fallback: tentar pegar do deriv_connection
        try {
          const connectionStr = localStorage.getItem('deriv_connection');
          if (connectionStr) {
            const connection = JSON.parse(connectionStr);
            if (connection.tradeCurrency) {
              this.tradeCurrency = connection.tradeCurrency;
              this.accountType = this.tradeCurrency === 'DEMO' ? 'demo' : 'real';
            }
          }
        } catch (e) {
          // Ignorar erro
        }
      }
    },
    handleToolClick(tool) {
      if (tool.route) {
        this.$router.push(tool.route);
      }
    },
    activateIA() {
      // Fechar modal se estiver aberto
      if (this.showIAsModal) {
        this.closeIAsModal();
      }
      // Navega para a página de IAs
      this.$router.push('/InvestmentIA');
    },
    openIAsModal() {
      this.showIAsModal = true;
    },
    closeIAsModal() {
      this.showIAsModal = false;
    },
    toggleSettingsModal() {
      this.showSettingsModal = !this.showSettingsModal;
      if (this.showSettingsModal && this.availableAccounts.length === 0) {
        this.loadAvailableAccounts();
      }
    },
    closeSettingsModal() {
      this.showSettingsModal = false;
      this.showAccountsList = false;
    },
    toggleNotificationsModal() {
      this.showNotificationsModal = !this.showNotificationsModal;
    },
    closeNotificationsModal() {
      this.showNotificationsModal = false;
    },
    toggleAccountsList() {
      this.showAccountsList = !this.showAccountsList;
      if (this.showAccountsList && this.availableAccounts.length === 0) {
        this.loadAvailableAccounts();
      }
    },
    async loadAvailableAccounts() {
      // Usa a função utilitária que já tem cache e otimizações
      this.loadingAccounts = true;
      try {
        const accounts = await loadAvailableAccounts();
        this.availableAccounts = accounts;
      } catch (error) {
        console.error('[Dashboard] Erro ao carregar contas:', error);
        this.availableAccounts = [];
      } finally {
        this.loadingAccounts = false;
      }
    },
    async loadAccountsInBackground() {
      // Carregar contas em background sem bloquear a interface
      // Se houver tokens armazenados, carregar as contas
      const tokensByLoginIdStr = localStorage.getItem('deriv_tokens_by_loginid');
      if (tokensByLoginIdStr) {
        try {
          // Executar em background sem await para não bloquear a interface
          loadAvailableAccounts().then(() => {
            console.log('[DashboardConnected] Contas carregadas em background');
          }).catch(err => {
            console.warn('[DashboardConnected] Erro ao carregar contas em background:', err);
          });
        } catch (error) {
          console.warn('[DashboardConnected] Erro ao iniciar carregamento de contas:', error);
        }
      }
    },
    setupVideoLoop() {
      // Aguardar o próximo tick para garantir que o DOM está renderizado
      this.$nextTick(() => {
        const video1 = this.$refs.heroVideo1;
        const video2 = this.$refs.heroVideo2;
        
        if (!video1 || !video2) return;
        
        let isPlayingForward = true;
        let currentVideo = video1;
        let nextVideo = video2;
        let reverseAnimationFrame = null;
        let lastReverseTime = 0;
        let isTransitioning = false;
        
        const setupVideos = () => {
          // Iniciar o primeiro vídeo normalmente (forward)
          video1.style.opacity = '1';
          video2.style.opacity = '0';
          video1.currentTime = 0;
          video1.play().catch(() => {});
          
          // Função para tocar vídeo de trás para frente (apenas 2 segundos)
          const playReverse = (video) => {
            if (!video.duration || isTransitioning) return;
            
            // Começar do fim (onde o forward parou)
            const startTime = video.duration;
            const endTime = Math.max(0, video.duration - 2); // Parar 2 segundos antes do fim
            
            if (!video.currentTime || video.currentTime < startTime - 0.1) {
              video.currentTime = startTime;
            }
            
            const reverseStep = () => {
              if (!video.duration) return;
              
              const now = Date.now();
              const deltaTime = (now - lastReverseTime) / 1000;
              lastReverseTime = now;
              
              // Decrementar currentTime manualmente
              video.currentTime = Math.max(endTime, video.currentTime - (deltaTime * 1.0));
              
              if (video.currentTime > endTime + 0.01) {
                reverseAnimationFrame = requestAnimationFrame(reverseStep);
              } else {
                // Chegou aos 2 segundos, trocar imediatamente para forward
                video.pause();
                video.currentTime = endTime;
                if (reverseAnimationFrame) {
                  cancelAnimationFrame(reverseAnimationFrame);
                  reverseAnimationFrame = null;
                }
                switchToForward();
              }
            };
            
            lastReverseTime = Date.now();
            reverseAnimationFrame = requestAnimationFrame(reverseStep);
          };
          
          // Função para trocar para forward (transição rápida)
          const switchToForward = () => {
            if (isTransitioning) return;
            isTransitioning = true;
            
            if (reverseAnimationFrame) {
              cancelAnimationFrame(reverseAnimationFrame);
              reverseAnimationFrame = null;
            }
            
            // Transição rápida (200ms)
            const fadeDuration = 200;
            const startTime = Date.now();
            
            const fade = () => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / fadeDuration, 1);
              
              currentVideo.style.opacity = String(1 * (1 - progress));
              nextVideo.style.opacity = String(1 * progress);
              
              if (progress < 1) {
                requestAnimationFrame(fade);
              } else {
                // Transição completa
                currentVideo.pause();
                currentVideo.style.opacity = '0';
                
                // Trocar referências
                const temp = currentVideo;
                currentVideo = nextVideo;
                nextVideo = temp;
                
                // Iniciar vídeo forward imediatamente
                currentVideo.currentTime = 0;
                currentVideo.play().catch(() => {});
                isPlayingForward = true;
                isTransitioning = false;
              }
            };
            
            requestAnimationFrame(fade);
          };
          
          // Função para trocar para reverse (transição rápida)
          const switchToReverse = () => {
            if (isTransitioning) return;
            isTransitioning = true;
            
            // Transição rápida (200ms)
            const fadeDuration = 200;
            const startTime = Date.now();
            
            const fade = () => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / fadeDuration, 1);
              
              currentVideo.style.opacity = String(1 * (1 - progress));
              nextVideo.style.opacity = String(1 * progress);
              
              if (progress < 1) {
                requestAnimationFrame(fade);
              } else {
                // Transição completa
                currentVideo.pause();
                currentVideo.style.opacity = '0';
                
                // Trocar referências
                const temp = currentVideo;
                currentVideo = nextVideo;
                nextVideo = temp;
                
                isPlayingForward = false;
                isTransitioning = false;
                
                // Iniciar reverse imediatamente (do fim)
                playReverse(currentVideo);
              }
            };
            
            requestAnimationFrame(fade);
          };
          
          // Listener para quando vídeo forward termina
          const handleForwardEnd = () => {
            if (isPlayingForward && !isTransitioning && currentVideo.ended) {
              // Preparar próximo vídeo no fim
              if (nextVideo.duration) {
                nextVideo.currentTime = nextVideo.duration;
              }
              switchToReverse();
            }
          };
          
          // Adicionar listeners
          video1.addEventListener('ended', handleForwardEnd);
          video2.addEventListener('ended', handleForwardEnd);
          
          // Garantir que os vídeos continuem reproduzindo
          [video1, video2].forEach(video => {
            video.addEventListener('pause', () => {
              if (isPlayingForward && !isTransitioning && video === currentVideo && !video.ended) {
                video.play().catch(() => {});
              }
            });
          });
        };
        
        // Aguardar ambos os vídeos estarem prontos
        let video1Ready = false;
        let video2Ready = false;
        
        const checkReady = () => {
          if (video1.readyState >= 3) video1Ready = true;
          if (video2.readyState >= 3) video2Ready = true;
          
          if (video1Ready && video2Ready) {
            setupVideos();
          }
        };
        
        if (video1.readyState >= 3) {
          video1Ready = true;
        } else {
          video1.addEventListener('canplaythrough', () => {
            video1Ready = true;
            checkReady();
          }, { once: true });
        }
        
        if (video2.readyState >= 3) {
          video2Ready = true;
        } else {
          video2.addEventListener('canplaythrough', () => {
            video2Ready = true;
            checkReady();
          }, { once: true });
        }
        
        checkReady();
        
        // Tentar reproduzir o primeiro vídeo imediatamente
        video1.play().catch(() => {});
      });
    },
    isCurrentAccount(account) {
      // Usa a mesma lógica do sidebar - compara loginid
      const currentLoginid = this.currentAccountLoginid;
      return currentLoginid && currentLoginid === account.loginid;
    },
    async selectAccount(account) {
      // Usa a mesma lógica do TopNavbar
      try {
        const apiBase = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
        const token = localStorage.getItem('token');
        const appId = localStorage.getItem('deriv_app_id') || '1089';

        const response = await fetch(`${apiBase}/broker/deriv/status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            token: account.token,
            appId: parseInt(appId),
            currency: account.currency
          })
        });

        if (response.ok) {
          const data = await response.json();
          
          // Atualizar localStorage com a conta selecionada
          localStorage.setItem('deriv_token', account.token);
          localStorage.setItem('deriv_connection', JSON.stringify({
            ...data,
            loginid: account.loginid,
            currency: account.currency,
            isDemo: account.isDemo,
            timestamp: Date.now()
          }));

          // Emitir evento para atualizar o componente pai
          const accountType = account.isDemo ? 'demo' : 'real';
          this.accountType = accountType;
          this.$emit('account-type-changed', accountType);
          
          // Fechar modal e recarregar página para atualizar todos os componentes
          this.closeSettingsModal();
          // Force refresh no mobile
          if (this.isMobile) {
            window.location.reload();
          } else {
            window.location.reload();
          }
        } else {
          throw new Error('Erro ao selecionar conta');
        }
      } catch (error) {
        console.error('[Dashboard] Erro ao selecionar conta:', error);
        alert('Erro ao trocar de conta. Tente novamente.');
      }
    },
    getIAPerformance(iaId) {
      // Retorna performance baseada no ID da IA
      const performances = {
        'orion': '12.4',
        'vega': '18.7',
        'pulse': '15.2',
        'titan': '15.2'
      };
      return performances[iaId] || '0.0';
    },
    generateSparklinePoints(data) {
      if (!data || data.length === 0) return '';
      const max = Math.max(...data);
      const min = Math.min(...data);
      const range = max - min || 1;
      return data.map((value, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 30 - ((value - min) / range) * 25;
        return `${x},${y}`;
      }).join(' ');
    },
    handlePerformanceAction(perf) {
      if (perf.title.includes('IA')) {
        this.$router.push('/InvestmentIA');
      } else if (perf.title.includes('Copy')) {
        this.$router.push('/copy-trading');
      } else if (perf.title.includes('Agente')) {
        this.$router.push('/agente-autonomo');
      } else if (perf.title.includes('Sinais')) {
        this.$router.push('/operation');
      }
    },
    getCurrencyPrefix(currency) {
      switch ((currency || '').toUpperCase()) {
        case 'USD':
          return '$';
        case 'EUR':
          return '€';
        case 'BTC':
          return '₿';
        case 'DEMO':
          return 'D$';
        default:
          return currency ? `${currency} ` : '$';
      }
    },
    formatProfit(value) {
      if (value === null || value === undefined) return '0,00';
      return Math.abs(value).toLocaleString('pt-BR', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      });
    },
    recalculateProfitPercent() {
      const currentBalance = this.balanceNumeric;
      if (currentBalance > 0 && this.todayProfit !== 0) {
        const initialBalance = currentBalance - this.todayProfit;
        if (initialBalance > 0) {
          const percent = (this.todayProfit / initialBalance) * 100;
          this.todayProfitPercent = Math.abs(percent).toFixed(2);
        } else if (this.todayProfit > 0) {
          this.todayProfitPercent = '100.00';
        } else {
          this.todayProfitPercent = '0.00';
        }
      } else {
        this.todayProfitPercent = '0.00';
      }
    },
    async loadTodayProfitLoss() {
      try {
        this.loadingTodayProfit = true;
        const apiBase = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error('[Dashboard] Token não encontrado');
          return;
        }

        const response = await fetch(`${apiBase}/trades/today-profit`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          this.todayProfit = parseFloat(data.totalProfit || 0);
          
          // Calcular percentual baseado no saldo atual
          const currentBalance = this.balanceNumeric;
          if (currentBalance > 0 && this.todayProfit !== 0) {
            // Calcular o saldo inicial (saldo atual - lucro de hoje)
            const initialBalance = currentBalance - this.todayProfit;
            if (initialBalance > 0) {
              const percent = (this.todayProfit / initialBalance) * 100;
              this.todayProfitPercent = Math.abs(percent).toFixed(2);
            } else if (this.todayProfit > 0) {
              // Se o lucro é maior que o saldo atual, significa que começou com pouco
              this.todayProfitPercent = '100.00';
            } else {
              this.todayProfitPercent = '0.00';
            }
          } else {
            this.todayProfitPercent = '0.00';
          }
        } else {
          console.error('[Dashboard] Erro ao buscar lucro/perda de hoje:', response.statusText);
          this.todayProfit = 0;
          this.todayProfitPercent = '0.00';
        }
      } catch (error) {
        console.error('[Dashboard] Erro ao carregar lucro/perda de hoje:', error);
      } finally {
        this.loadingTodayProfit = false;
      }
    },
    initSparklines() {
      // Sparklines serão inicializados quando Plotly estiver disponível
      if (typeof window !== 'undefined' && window.Plotly) {
        this.$nextTick(() => {
          this.bestIAs.forEach(ia => {
            const element = document.getElementById(`sparkline-${ia.id}`);
            if (element) {
              try {
                window.Plotly.newPlot(`sparkline-${ia.id}`, [{
                  type: 'scatter',
                  mode: 'lines',
                  x: ia.sparklineData.map((_, i) => i),
                  y: ia.sparklineData,
                  line: {
                    color: 'rgba(34, 197, 94, 0.6)',
                    width: 1.5
                  }
                }], {
                  margin: { t: 0, r: 0, b: 0, l: 0 },
                  plot_bgcolor: 'transparent',
                  paper_bgcolor: 'transparent',
                  xaxis: { visible: false },
                  yaxis: { visible: false },
                  showlegend: false
                }, {
                  responsive: true,
                  displayModeBar: false,
                  displaylogo: false
                });
              } catch (e) {
                console.error(`Error creating sparkline for ${ia.id}:`, e);
              }
            }
          });
        });
      }
    },
    scrollToPerformance() {
      const element = document.getElementById('overall-performance');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    openDepositFlow() {
      this.$router.push('/settings?tab=deposit');
    },
    toggleBalanceVisibility() {
      this.balanceVisible = !this.balanceVisible;
    },
    formatBalance(value, currency = 'USD') {
      const prefix = this.getCurrencyPrefix(currency);
      const formatted = (parseFloat(value) || 0).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      return `${prefix}${formatted}`;
    },
    formatBalanceMobile(value) {
      // No mobile, não incluir prefixo aqui (será adicionado no template)
      const formatted = (parseFloat(value) || 0).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      return formatted;
    },
    logout() {
      // Fechar modal
      this.closeSettingsModal();
      // Remover tokens e conexão Deriv
      localStorage.removeItem('deriv_token');
      localStorage.removeItem('deriv_tokens_by_loginid');
      localStorage.removeItem('deriv_connection');
      localStorage.removeItem('deriv_app_id');
      // Recarregar página para atualizar estado
      window.location.reload();
    },
    async loadUserProfilePicture() {
      try {
        // Primeiro tenta buscar do localStorage (pode ter sido atualizado recentemente)
        const userInfo = localStorage.getItem('user');
        if (userInfo) {
          try {
            const user = JSON.parse(userInfo);
            if (user.profilePictureUrl) {
              this.userProfilePictureUrl = user.profilePictureUrl;
              return;
            }
          } catch (e) {
            // Ignorar erro de parsing
          }
        }

        // Se não encontrou no localStorage, busca da API
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
          if (data.profilePictureUrl) {
            this.userProfilePictureUrl = data.profilePictureUrl;
            
            // Atualiza o localStorage para uso futuro
            const userInfo = localStorage.getItem('user');
            if (userInfo) {
              try {
                const user = JSON.parse(userInfo);
                user.profilePictureUrl = data.profilePictureUrl;
                localStorage.setItem('user', JSON.stringify(user));
              } catch (e) {
                // Ignorar erro de parsing
              }
            }
          }
        }
      } catch (error) {
        console.error('[DashboardConnected] Erro ao carregar foto do perfil:', error);
      }
    }
  }
}
</script>

<style scoped>
/* Font Import */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.font-inter {
  font-family: 'Inter', sans-serif;
}

/* Dashboard Content Wrapper - Respeita a Sidebar */
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  position: relative;
}

/* Isolar DashboardConnected dos estilos do layout-home */
.layout-home .dashboard-layout {
  display: flex !important;
  flex-direction: row !important;
  align-items: flex-start !important;
  justify-content: flex-start !important;
  padding: 0 !important;
  margin: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
  background: transparent !important;
  min-height: 100vh !important;
  position: relative !important;
  overflow-x: hidden !important;
}

.layout-home .dashboard-layout::before {
  display: none !important;
}

/* Sidebar Overlay */
.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 998;
  backdrop-filter: blur(2px);
}

@media (max-width: 1024px) {
  .sidebar-overlay {
    display: block;
  }
}

.dashboard-content-wrapper {
  margin-left: 280px;
  min-height: 100vh;
  transition: margin-left 0.3s ease, width 0.3s ease;
  width: calc(100% - 280px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

.dashboard-content-wrapper.sidebar-collapsed {
  margin-left: 0;
  width: 100%;
}

@media (max-width: 1024px) {
  .dashboard-layout {
    flex-direction: column;
  }

  .dashboard-content-wrapper {
    margin-left: 0 !important;
    width: 100% !important;
    max-width: 100vw;
    overflow-x: hidden;
  }
  
  .dashboard-content-wrapper.sidebar-collapsed {
    margin-left: 0 !important;
    width: 100% !important;
  }
}

/* Top Header - Mesmo padrão da tela de IA */
.top-header {
  position: fixed;
  top: 0;
  right: 0;
  left: 280px;
  z-index: 40;
  background-color: #0E0E0E;
  border-bottom: 1px solid #1C1C1C;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  transition: left 0.3s ease;
  width: 100%;
  box-sizing: border-box;
}

.dashboard-content-wrapper.sidebar-collapsed .top-header {
  left: 0;
  width: 100%;
}

@media (max-width: 1024px) {
  .top-header {
    left: 0;
    width: 100%;
  }
  
  .dashboard-content-wrapper.sidebar-collapsed .top-header {
    left: 0;
    width: 100%;
  }
}

.header-content {
  padding: 1rem 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
}

.header-left-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  justify-content: center;
  align-items: flex-start;
}

.header-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #DFDFDF;
  margin: 0;
  line-height: 1.2;
}

.header-subtitle {
  font-size: 0.875rem;
  color: #A1A1A1;
  margin: 0;
  line-height: 1.4;
}

.header-actions-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Balance Display Card */
.balance-display-card {
  background-color: #0E0E0E;
  border: 1px solid #1C1C1C;
  border-radius: 0.75rem;
  padding: 0.75rem;
  transition: all 0.3s ease;
}

.balance-display-card:hover {
  background: #111;
  transform: translateY(-1px);
}

.balance-header {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.balance-header i {
  color: #22C55E;
  font-size: 0.75rem;
}

.balance-info {
  display: flex;
  flex-direction: column;
}

.balance-label {
  font-size: 0.625rem;
  color: #7A7A7A;
  font-weight: 500;
}

.balance-value-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.125rem;
}

.balance-value {
  font-size: 1rem;
  font-weight: bold;
  color: #DFDFDF;
}

.account-type-btn {
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.625rem;
  font-weight: 600;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.real-btn {
  background-color: #22C55E;
  color: #000;
}

.real-btn:hover {
  background-color: #16A34A;
}

.demo-btn {
  background-color: #333;
  color: #A1A1A1;
}

.eye-toggle-btn {
  background: none;
  border: none;
  color: #A1A1A1;
  cursor: pointer;
  padding: 0.25rem;
  transition: color 0.2s;
}

.eye-toggle-btn:hover {
  color: #DFDFDF;
}

/* Main Content */
.main-content {
  margin-top: 0;
  padding: 0;
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

@media (max-width: 1024px) {
  .main-content {
    width: 100%;
    max-width: 100vw;
    overflow-x: hidden;
  }
}

/* Top Navbar Styles */
#top-navbar {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.45), 0 0 20px rgba(34, 197, 94, 0.02);
  backdrop-filter: blur(12px);
  animation: fadeInSlide 0.35s ease-out;
  transition: left 0.3s ease, width 0.3s ease;
}

@media (max-width: 1024px) {
  #top-navbar {
    left: 0 !important;
    width: 100% !important;
  }
}

/* Hero Section Styles */
.unified-button {
  box-shadow: rgba(34, 197, 94, 0.28) 0px 2px 10px;
  border: 1px solid rgba(255, 255, 255, 0.02);
}

.unified-button:hover {
  box-shadow: rgba(34, 197, 94, 0.42) 0px 4px 18px;
  border-color: rgba(255, 255, 255, 0.04);
}

/* Noise Background */
.noise-bg {
  background: radial-gradient(circle at 85% 15%, rgba(34, 197, 94, 0.03) 0%, transparent 50%),
              radial-gradient(circle at 15% 85%, rgba(34, 197, 94, 0.02) 0%, transparent 50%),
              #0B0B0B;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.015'/%3E%3C/svg%3E");
}

/* Premium Card */
.premium-card {
  box-shadow: 0 0 36px rgba(0, 0, 0, 0.45);
  background: linear-gradient(to bottom, #0E0E0E 0%, #0C0C0C 100%);
  border: 1px solid #1C1C1C;
  animation: fadeInSlide 0.6s ease-out;
  transition: border-color 0.3s ease;
}

.premium-card:hover {
  border-color: #22C55E;
}

.premium-card-enhanced {
  box-shadow: 0 0 36px rgba(0, 0, 0, 0.45);
  background: linear-gradient(to bottom, #0E0E0E 0%, #0C0C0C 100%);
  border: 1px solid #1C1C1C;
  position: relative;
  animation: breathe 4s ease-in-out infinite;
  transition: border-color 0.3s ease;
}

.premium-card-enhanced:hover {
  border-color: #22C55E;
}

.premium-card-enhanced::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), transparent);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
}

.balance-number {
  animation: numberEntry 0.8s ease-out;
  text-shadow: 0 0 12px rgba(34, 197, 94, 0.15);
}

.btn-primary-enhanced {
  transition: all 0.2s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.02);
}

.btn-primary-enhanced:hover {
  box-shadow: 0 0 24px rgba(34, 197, 94, 0.35), 0 6px 20px rgba(0, 0, 0, 0.5);
  transform: translateY(-2px) scale(1.02);
  border-color: rgba(255, 255, 255, 0.04);
}

.eye-icon-hover {
  transition: all 0.2s ease;
}

.eye-icon-hover:hover {
  filter: drop-shadow(0 0 4px rgba(34, 197, 94, 0.4));
  transform: scale(1.08);
}

.tool-card:hover {
  transform: translateY(-2px);
}

.icon-container {
  transition: all 0.2s ease;
}

.tool-card:hover .icon-container {
  border-color: #22C55E;
  transform: scale(1.05);
}

.icon-glow {
  filter: drop-shadow(0 0 3px rgba(34, 197, 94, 0.3));
  transition: filter 0.3s ease;
}

.tool-card:hover .icon-glow {
  filter: drop-shadow(0 0 6px rgba(34, 197, 94, 0.5));
}

.performance-card:hover {
  transform: translateY(-2px);
}

.icon-perf-container {
  transition: all 0.2s ease;
}

.performance-card:hover .icon-perf-container {
  border-color: #22C55E;
  transform: scale(1.05);
}

.icon-perf {
  transition: filter 0.3s ease;
}

.performance-card:hover .icon-perf {
  filter: drop-shadow(0 0 4px rgba(34, 197, 94, 0.4));
}

.perf-line {
  animation: dash 3s linear infinite;
}

.perf-bar {
  transition: width 0.5s ease;
}

.perf-number {
  animation: numberEntry 0.5s ease-out;
}

.perf-usage {
  transition: color 0.2s ease;
}

/* Animations */
@keyframes fadeInSlide {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes numberEntry {
  from {
    opacity: 0;
    transform: translateY(4px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes breathe {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.005);
  }
}

@keyframes float-slow {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translate(15px, -20px) scale(1.1);
    opacity: 0.8;
  }
}

@keyframes float-medium {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translate(-20px, 15px) scale(1.15);
    opacity: 0.7;
  }
}

@keyframes float-fast {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.4;
  }
  50% {
    transform: translate(10px, -25px) scale(1.2);
    opacity: 0.6;
  }
}

@keyframes dash {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 100;
  }
}

@keyframes dash-reverse {
  0% {
    stroke-dashoffset: 100;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes pulse-ring {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.05);
  }
}

@keyframes data-stream {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(200%);
    opacity: 0;
  }
}

.animate-float-slow {
  animation: float-slow 8s ease-in-out infinite;
}

.animate-float-medium {
  animation: float-medium 6s ease-in-out infinite;
}

.animate-float-fast {
  animation: float-fast 4s ease-in-out infinite;
}

.animate-dash {
  animation: dash 3s linear infinite;
}

.animate-dash-reverse {
  animation: dash-reverse 4s linear infinite;
}

.animate-pulse-ring {
  animation: pulse-ring 3s ease-in-out infinite;
}

.animate-data-stream {
  animation: data-stream 3s ease-in-out infinite;
}

.animate-data-stream-delayed {
  animation: data-stream 3s ease-in-out infinite 0.5s;
}

.animate-data-stream-delayed-2 {
  animation: data-stream 3s ease-in-out infinite 1s;
}

/* Header Hamburger Menu */
.hamburger-menu {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;
}

.hamburger-menu .line {
  width: 100%;
  height: 2px;
  background-color: #e5e7eb;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.hamburger-menu:hover .line {
  background-color: #00FF87;
}

/* Hero Card Styles */
#hero-card-1 {
  backdrop-filter: blur(20px);
  box-shadow: rgba(34, 197, 94, 0.18) 0px 0px 20px;
  transition-behavior: normal;
  transition-duration: 0.25s;
  transition-timing-function: ease;
  transition-delay: 0s;
  transition-property: all;
  animation-duration: 6s;
  animation-timing-function: ease-in-out;
  animation-delay: 0s;
  animation-iteration-count: infinite;
  animation-direction: normal;
  animation-fill-mode: none;
  animation-play-state: running;
  animation-name: float-card-1;
}

#hero-card-2 {
  backdrop-filter: blur(10px);
  transition-behavior: normal;
  transition-duration: 0.25s;
  transition-timing-function: ease;
  transition-delay: 0s;
  transition-property: all;
  animation-duration: 7s;
  animation-timing-function: ease-in-out;
  animation-delay: 0.5s;
  animation-iteration-count: infinite;
  animation-direction: normal;
  animation-fill-mode: none;
  animation-play-state: running;
  animation-name: float-card-2;
}

#hero-card-3 {
  backdrop-filter: blur(8px);
  transition-behavior: normal;
  transition-duration: 0.25s;
  transition-timing-function: ease;
  transition-delay: 0s;
  transition-property: all;
  animation-duration: 8s;
  animation-timing-function: ease-in-out;
  animation-delay: 1s;
  animation-iteration-count: infinite;
  animation-direction: normal;
  animation-fill-mode: none;
  animation-play-state: running;
  animation-name: float-card-3;
}

#hero-card-1:hover,
#hero-card-2:hover,
#hero-card-3:hover {
  animation-play-state: paused;
}

@keyframes float-card-1 {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes float-card-2 {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes float-card-3 {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-12px);
  }
}

/* Hero Section Background Elements */
.grid-pattern {
  animation-duration: 4s;
  animation-timing-function: ease-in-out;
  animation-delay: 0s;
  animation-iteration-count: infinite;
  animation-direction: normal;
  animation-fill-mode: none;
  animation-play-state: running;
  animation-name: grid-pulse;
}

#hero-header {
  animation-duration: 6s;
  animation-timing-function: ease-in-out;
  animation-delay: 0s;
  animation-iteration-count: infinite;
  animation-direction: normal;
  animation-fill-mode: none;
  animation-play-state: running;
  animation-name: float-header;
}

#i99s1i {
  position: absolute;
  top: 10%;
  right: 5%;
  width: 400px;
  height: 400px;
  background-image: linear-gradient(rgba(34, 197, 94, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 197, 94, 0.12) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.4;
}

#ixr7uj {
  position: absolute;
  top: 15%;
  right: 15%;
  font-size: 14px;
  color: rgba(34, 197, 94, 0.6);
  font-weight: 600;
}

#ianwqb {
  font-size: 11px;
  color: rgba(34, 197, 94, 0.5);
}

#ivafvh {
  position: absolute;
  top: 45%;
  right: 8%;
  font-size: 14px;
  color: rgba(34, 197, 94, 0.6);
  font-weight: 600;
}

#i6bn58 {
  font-size: 11px;
  color: rgba(34, 197, 94, 0.5);
}

#im44s3 {
  position: absolute;
  top: 70%;
  right: 20%;
  font-size: 14px;
  color: rgba(34, 197, 94, 0.6);
  font-weight: 600;
}

#ijm3gj {
  font-size: 11px;
  color: rgba(34, 197, 94, 0.5);
}

#ibz4um {
  position: absolute;
  top: 25%;
  right: 25%;
  font-size: 24px;
  color: rgba(34, 197, 94, 0.4);
}

#ic8zog {
  position: absolute;
  top: 55%;
  right: 18%;
  font-size: 20px;
  color: rgba(34, 197, 94, 0.35);
}

#ixwg04 {
  position: absolute;
  top: 30%;
  left: 10%;
  font-size: 14px;
  color: rgba(34, 197, 94, 0.6);
  font-weight: 600;
}

#ijp6v7 {
  font-size: 11px;
  color: rgba(34, 197, 94, 0.5);
}

#ih4yn4 {
  position: absolute;
  top: 60%;
  left: 15%;
  font-size: 14px;
  color: rgba(34, 197, 94, 0.6);
  font-weight: 600;
}

#iyevqf {
  font-size: 11px;
  color: rgba(34, 197, 94, 0.5);
}

#ioxiss {
  position: absolute;
  top: 35%;
  right: 12%;
  font-size: 18px;
  color: rgba(34, 197, 94, 0.4);
}

#itixvs {
  color: rgb(34, 197, 94);
}

#ixl21c {
  font-size: 43px;
  position: relative;
  top: 7px;
}

#ik0zc {
  height: 560px;
}

@keyframes grid-pulse {
  0%,
  100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.02);
  }
}

@keyframes float-header {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

/* Ticker Scroll Animation */
@keyframes ticker-scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

#ticker-scroll {
  animation: ticker-scroll 60s linear infinite;
}

/* Esconder ticker-section no mobile */
@media (max-width: 768px) {
  #ticker-section {
    display: none !important;
  }
}

/* Center Pulse Animation */
@keyframes center-pulse {
  0%,
  100% {
    box-shadow: 0 0 32px rgba(34, 197, 94, 0.4);
  }
  50% {
    box-shadow: 0 0 48px rgba(34, 197, 94, 0.6);
  }
}

.animate-center-pulse {
  animation: center-pulse 3s ease-in-out infinite;
}

/* Float Card Animations */
@keyframes float-card-1 {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes float-card-2 {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-12px);
  }
}

@keyframes float-card-3 {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Bar Fill and Shimmer */
@keyframes bar-fill {
  0% {
    width: 0%;
  }
  100% {
    width: var(--bar-width);
  }
}

@keyframes bar-shimmer {
  0% {
    transform: translateX(-200%);
  }
  100% {
    transform: translateX(200%);
  }
}

.animate-bar-fill {
  animation: bar-fill 1s ease-out;
}

.animate-bar-shimmer {
  animation: bar-shimmer 2s ease-in-out infinite;
}

/* Icon Pulse Animations */
@keyframes icon-pulse {
  0%,
  100% {
    opacity: 0.8;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

@keyframes icon-pulse-delay-1 {
  0%,
  100% {
    opacity: 0.8;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

@keyframes icon-pulse-delay-2 {
  0%,
  100% {
    opacity: 0.8;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

@keyframes icon-pulse-delay-3 {
  0%,
  100% {
    opacity: 0.8;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

.animate-icon-pulse {
  animation: icon-pulse 3s ease-in-out infinite;
}

.animate-icon-pulse-delay-1 {
  animation: icon-pulse-delay-1 3s ease-in-out infinite;
  animation-delay: 0.5s;
}

.animate-icon-pulse-delay-2 {
  animation: icon-pulse-delay-2 3s ease-in-out infinite;
  animation-delay: 1s;
}

.animate-icon-pulse-delay-3 {
  animation: icon-pulse-delay-3 3s ease-in-out infinite;
  animation-delay: 1.5s;
}

/* Chart Wave Animations */
@keyframes chart-wave {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes chart-wave-delay-1 {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes chart-wave-delay-2 {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes chart-wave-delay-3 {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
  100% {
    transform: translateY(0);
  }
}

.animate-chart-wave {
  animation: chart-wave 4s ease-in-out infinite;
}

.animate-chart-wave-delay-1 {
  animation: chart-wave-delay-1 4s ease-in-out infinite;
  animation-delay: 0.5s;
}

.animate-chart-wave-delay-2 {
  animation: chart-wave-delay-2 4s ease-in-out infinite;
  animation-delay: 1s;
}

.animate-chart-wave-delay-3 {
  animation: chart-wave-delay-3 4s ease-in-out infinite;
  animation-delay: 1.5s;
}

/* Light Sweep Animation */
@keyframes light-sweep {
  0% {
    background: linear-gradient(90deg, transparent 0%, transparent 100%);
  }
  15% {
    background: linear-gradient(90deg, transparent 0%, rgba(34, 197, 94, 0.14) 25%, transparent 50%, transparent 100%);
  }
  50% {
    background: linear-gradient(90deg, transparent 0%, transparent 40%, rgba(34, 197, 94, 0.14) 50%, transparent 60%, transparent 100%);
  }
  85% {
    background: linear-gradient(90deg, transparent 0%, transparent 50%, rgba(34, 197, 94, 0.14) 75%, transparent 100%);
  }
  100% {
    background: linear-gradient(90deg, transparent 0%, transparent 100%);
  }
}

.animate-light-sweep {
  animation: light-sweep 7s ease-in-out infinite;
  animation-delay: 5s;
}

.animate-light-sweep-delay-1 {
  animation: light-sweep 7s ease-in-out infinite;
  animation-delay: 5.5s;
}

.animate-light-sweep-delay-2 {
  animation: light-sweep 7s ease-in-out infinite;
  animation-delay: 6s;
}

.animate-light-sweep-delay-3 {
  animation: light-sweep 7s ease-in-out infinite;
  animation-delay: 6.5s;
}

/* Hero Section Height Fix */
#hero-section {
  height: 700px;
}

/* Video Loop Suave */
#hero-section .video-bg {
  will-change: opacity;
  image-rendering: auto;
  backface-visibility: hidden;
  transform: translateZ(0);
  transition: opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1);
  filter: brightness(1.05) contrast(1.1) saturate(1.1);
}

#hero-section .video-layer-1,
#hero-section .video-layer-2 {
  pointer-events: none;
}

#hero-section .video-bg::-webkit-media-controls {
  display: none !important;
}



/* Dashboard específico - Cor #050705 apenas no desktop */
@media (min-width: 1025px) {
  /* Sidebar com box-shadow para transição suave entre sidebar e conteúdo do vídeo */
  .dashboard-layout .sidebar,
  .dashboard-layout aside.sidebar {
    background: #050705 !important;
    box-shadow: 10px 0 80px rgba(5, 7, 5, 0),
                10px 0 120px rgba(5, 7, 5, 0.445) !important;
  }
  
  /* Overlay no conteúdo principal para transição suave do vídeo para a sidebar */
  .dashboard-layout .main-content::before {
    content: '';
    position: fixed;
    top: 0;
    left: 280px;
    width: 50px;
    height: 100vh;
    background: linear-gradient(to right, 
      #050705 0%,
      rgba(5, 7, 5, 0) 100%,
      transparent 100%);
    pointer-events: none;
    z-index: 50;
  }
  
  .dashboard-layout.sidebar-collapsed .main-content::before,
  .dashboard-content-wrapper.sidebar-collapsed .main-content::before {
    display: none !important;
  }
  
  /* Header/TopNavbar */
  .dashboard-layout #top-navbar,
  .dashboard-layout .top-header {
    background: #050705 !important;
  }
  
  /* Ticker Section (Carrossel de nomes) */
  .dashboard-layout #ticker-section {
    background: #050705 !important;
  }
  .dashboard-layout #ticker-section .absolute {
    background: transparent !important;
  }
  
  /* Best IAs Section */
  .dashboard-layout #best-ai-section {
    background: #050705 !important;
  }
  .dashboard-layout #best-ai-section .absolute.inset-0 {
    background: transparent !important;
  }
  
  /* Performance Section */
  .dashboard-layout #performance-section {
    background: #050705 !important;
  }
  .dashboard-layout #performance-section .absolute.inset-0 {
    background: transparent !important;
  }
  
  /* Conteúdo principal */
  .dashboard-layout .main-content,
  .dashboard-layout .dashboard-content-wrapper {
    background: #050705 !important;
  }
  
  /* Sobrescrever classe bg-zenix-bg */
  .dashboard-layout .main-content.bg-zenix-bg {
    background: #050705 !important;
  }
  
  /* Garantir que o body/html também fique com a cor no dashboard */
  body:has(.dashboard-layout),
  html:has(.dashboard-layout) {
    background: #050705 !important;
  }
  
  /* Seletor alternativo para navegadores que não suportam :has() */
  .dashboard-layout {
    background: #050705 !important;
  }
}

@media (max-width: 1024px) {
  #hero-section {
    height: auto;
    min-height: 600px;
  }
  
  .grid.grid-cols-2 {
    grid-template-columns: 1fr;
  }
  
  /* Apenas grids gerais, não o desktop-grid-ias */
  .grid.grid-cols-4:not(.desktop-grid-ias) {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  /* Padding zero no dashboard layout mobile */
  .dashboard-layout {
    padding: 0 !important;
  }

  /* Isolar DashboardConnected dos estilos do layout-home no mobile */
  .layout-home .dashboard-layout {
    display: flex !important;
    flex-direction: column !important;
    align-items: stretch !important;
    justify-content: flex-start !important;
    padding: 0 !important;
    margin: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
    background: transparent !important;
    min-height: 100vh !important;
    position: relative !important;
    overflow-x: hidden !important;
  }

  .layout-home .dashboard-layout::before {
    display: none !important;
  }

  /* Background com gradiente do HTML */
  .main-content {
    background: linear-gradient(180deg, #0F2416 0%, #0A1C12 15%, #060606 45%, #030303 55%, #050505 75%, #0B0B0B 100%) !important;
    position: relative;
    padding-bottom: 90px !important;
  }

  .main-content::before {
    content: '';
    position: fixed;
    top: -150px;
    left: 50%;
    transform: translateX(-50%);
    width: 140%;
    height: 600px;
    background: radial-gradient(ellipse at center, rgba(34, 197, 94, 0.10) 0%, rgba(34, 197, 94, 0.05) 30%, rgba(34, 197, 94, 0.015) 60%, transparent 80%);
    pointer-events: none;
    z-index: 0;
    filter: blur(80px);
  }

  .main-content::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(15, 63, 15, 0.015) 3px, rgba(15, 63, 15, 0.015) 4px);
    pointer-events: none;
    z-index: 0;
    opacity: 1;
  }

  /* Animações de luzes */
  @keyframes moveLight1 {
    0% {
      top: -10%;
      left: -20%;
    }
    33% {
      top: 20%;
      left: 15%;
    }
    66% {
      top: 50%;
      left: 70%;
    }
    100% {
      top: -10%;
      left: -20%;
    }
  }

  @keyframes moveLight2 {
    0% {
      top: 60%;
      left: 75%;
    }
    50% {
      top: 30%;
      left: -10%;
    }
    100% {
      top: 60%;
      left: 75%;
    }
  }

  @keyframes float1 {
    0%, 100% {
      transform: translate(0, 0);
      opacity: 0.06;
    }
    50% {
      transform: translate(15px, -20px);
      opacity: 0.10;
    }
  }

  @keyframes float2 {
    0%, 100% {
      transform: translate(0, 0);
      opacity: 0.08;
    }
    50% {
      transform: translate(-18px, 22px);
      opacity: 0.12;
    }
  }

  @keyframes float3 {
    0%, 100% {
      transform: translate(0, 0);
      opacity: 0.07;
    }
    50% {
      transform: translate(12px, 25px);
      opacity: 0.10;
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.92);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(40px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes pulseGlow {
    0%, 100% {
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(34, 197, 94, 0.02), inset 0 1px 0 rgba(255, 255, 255, 0.02);
    }
    50% {
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 30px rgba(34, 197, 94, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.04);
    }
  }

  .grid.grid-cols-4 {
    grid-template-columns: 1fr;
  }

  /* Container principal no mobile - largura total */
  .dashboard-content-wrapper {
    max-width: 100% !important;
    width: 100% !important;
    margin: 0 !important;
    position: relative;
    z-index: 10;
    padding: 0 !important;
  }

  .main-content {
    max-width: 100% !important;
    width: 100% !important;
    margin: 0 !important;
    position: relative;
    z-index: 10;
  }

  /* Padding lateral da página no mobile - reduzido */
  .px-8,
  .px-12 {
    padding-left: 20px !important;
    padding-right: 20px !important;
  }

  .main-content {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  /* Padding das sections no mobile - sem padding lateral */
  #best-ai-section {
    padding-left: 0 !important;
    padding-right: 0 !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    animation: fadeInUp 0.9s ease-out 0.3s backwards;
  }

  #performance-section {
    padding-left: 0 !important;
    padding-right: 0 !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    animation: fadeInUp 1s ease-out 0.4s backwards;
  }

  #performance-section .relative.z-10 {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  /* Espaçamento entre seções conforme HTML - sem padding lateral */
  #portfolio-section {
    padding: 8px 0 0 0 !important;
    margin-bottom: 32px !important;
    animation: fadeInUp 0.7s ease-out 0.1s backwards;
  }

  #action-buttons {
    padding: 0 !important;
    margin-bottom: 40px !important;
    animation: fadeInUp 0.8s ease-out 0.2s backwards;
  }

  #quick-access {
    padding: 0 !important;
    margin-bottom: 40px !important;
    animation: fadeInUp 0.9s ease-out 0.3s backwards;
  }

  #recent-transactions {
    padding: 0 !important;
    margin-bottom: 40px !important;
    animation: fadeInUp 1s ease-out 0.4s backwards;
  }

  /* Apenas grids gerais, não o desktop-grid-ias */
  .grid.grid-cols-4:not(.desktop-grid-ias) {
    grid-template-columns: 1fr;
  }
  
  #performance-section .grid.grid-cols-4 {
    grid-template-columns: 1fr;
  }

  /* Mobile IAs Section */
  .desktop-ias-header,
  .desktop-grid-ias {
    display: none !important;
  }

  .mobile-ias-header {
    display: block !important;
    margin-bottom: 20px !important;
    animation: fadeInUp 0.9s ease-out 0.3s backwards;
  }

  .mobile-ias-header > div {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    margin-bottom: 20px !important;
  }

  .mobile-ias-header h2 {
    font-size: 18px !important;
    font-weight: 600 !important;
    color: #FFFFFF !important;
    letter-spacing: -0.01em !important;
    margin: 0 !important;
  }

  .mobile-ias-header + div.w-full.h-\[1px\] {
    display: none !important;
  }

  /* Mobile Performance Section Header */
  .desktop-performance-header {
    display: none !important;
  }

  .mobile-performance-header-title {
    display: block !important;
    margin-bottom: 20px !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
    animation: fadeInUp 1s ease-out 0.4s backwards;
  }

  .mobile-performance-header-title h2 {
    font-size: 17px !important;
    font-weight: 600 !important;
    color: #FFFFFF !important;
    line-height: 1.2 !important;
  }

  .mobile-grid-ias {
    display: flex !important;
    flex-direction: column !important;
    gap: 12px !important;
    width: 100% !important;
    margin-bottom: 0px !important;
    margin-top: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    visibility: visible !important;
    opacity: 1 !important;
  }

  /* Ajustar gap dos cards de IA para corresponder ao HTML (space-y-3 = 12px) */
  .mobile-grid-ias > * {
    margin-bottom: 0 !important;
    margin-top: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }

  .mobile-grid-ias > * + * {
    margin-top: 0 !important;
  }

  /* Ocultar texto descritivo no mobile */
  .desktop-description-text {
    display: none;
  }

  .see-all-btn-mobile {
    background: none;
    border: none;
    color: #22C55E !important;
    font-size: 13px !important;
    font-weight: 500 !important;
    cursor: pointer;
    padding: 4px 0;
    transition: opacity 0.3s;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .see-all-btn-mobile:hover {
    opacity: 0.8;
  }

  .see-all-btn-mobile:active {
    opacity: 0.7;
  }

  .ia-card-mobile {
    background: rgba(10, 10, 10, 0.70) !important;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(34, 197, 94, 0.08) !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(34, 197, 94, 0.12), 0 0 40px rgba(34, 197, 94, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.02) !important;
    border-radius: 22px !important;
    padding: 16px !important;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 14px !important;
    position: relative;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    animation: fadeInUp 0.8s ease-out backwards;
  }

  .ia-card-mobile:nth-child(1) {
    animation-delay: 0.35s;
  }

  .ia-card-mobile:nth-child(2) {
    animation-delay: 0.45s;
  }

  .ia-card-mobile:nth-child(3) {
    animation-delay: 0.55s;
  }

  .ia-card-mobile:nth-child(4) {
    animation-delay: 0.65s;
  }

  .ia-card-mobile::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, #22C55E, transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .ia-card-mobile:hover::before {
    opacity: 0.4;
  }


  .ia-card-mobile:hover {
    transform: translateY(-2px) scale(1.01);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.7), 0 0 30px rgba(34, 197, 94, 0.15), 0 0 50px rgba(34, 197, 94, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.04) !important;
  }

  .ia-card-mobile:active {
    transform: scale(0.99);
  }

  .ia-icon-mobile {
    width: 52px !important;
    height: 52px !important;
    border-radius: 50% !important;
    overflow: hidden;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #0F1210 0%, #0A0D0B 100%);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
    transition: all 0.3s ease;
  }

  .ia-card-mobile:hover .ia-icon-mobile {
    transform: scale(1.1);
  }

  .ia-icon-mobile img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.9;
    transition: all 0.5s ease;
  }

  .ia-card-mobile:hover .ia-icon-mobile img {
    transform: scale(1.1);
    opacity: 1;
  }

  .ia-info-mobile {
    flex: 1;
    min-width: 0;
    text-align: left;
  }

  .ia-name-mobile {
    font-size: 16px !important;
    font-weight: 700 !important;
    color: #FFFFFF !important;
    margin: 0 0 2px 0 !important;
    line-height: 1.2 !important;
    letter-spacing: 0.02em !important;
  }

  .ia-category-mobile {
    font-size: 11px !important;
    color: #6B6B6B !important;
    margin: 0 !important;
    display: block !important;
    font-weight: 400 !important;
  }

  .ia-performance-mobile {
    display: flex !important;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    flex-shrink: 0;
  }

  .ia-chart-mobile {
    width: 68px !important;
    height: 26px !important;
  }

  .sparkline-mobile {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 0 8px rgba(34, 197, 94, 0.3));
    transition: all 0.3s ease;
  }

  .ia-percentage-mobile {
    font-size: 14px !important;
    font-weight: 700 !important;
    color: #22C55E !important;
    letter-spacing: 0.02em !important;
  }

  /* Mobile Performance Section */
  .desktop-performance-grid {
    display: none !important;
  }

  .mobile-performance-grid {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 16px !important;
    width: 100% !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }

  /* Remover margin do footer no mobile */
  #footer {
    margin-top: 0 !important;
  }

  .mobile-performance-card {
    background: linear-gradient(135deg, rgba(11, 11, 11, 0.85) 0%, rgba(14, 46, 28, 0.18) 35%, rgb(10, 10, 10) 100%) !important;
    border: 1.5px solid rgba(34, 197, 94, 0.18) !important;
    box-shadow: rgba(34, 197, 94, 0.12) 0px 0px 8px, rgba(0, 0, 0, 0.4) 0px 8px 32px !important;
    border-radius: 24px !important;
    padding: 20px 20px 0 20px !important;
    display: flex;
    flex-direction: column;
    gap: 5px;
    position: relative;
    min-height: 180px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    animation: fadeInUp 0.8s ease-out backwards;
  }

  .mobile-performance-card:nth-child(1) {
    animation-delay: 0.45s;
  }

  .mobile-performance-card:nth-child(2) {
    animation-delay: 0.55s;
  }

  .mobile-performance-card:nth-child(3) {
    animation-delay: 0.65s;
  }

  .mobile-performance-card:nth-child(4) {
    animation-delay: 0.75s;
  }

  .mobile-performance-card:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.8), 0 0 40px rgba(34, 197, 94, 0.2) !important;
  }

  .mobile-performance-card:active {
    transform: translateY(-2px) scale(1.01);
  }

  /* Bordas superiores dos performance cards */
  .mobile-performance-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 50px;
    border-top: 1.8px solid rgba(34, 197, 94, 0.35);
    border-left: 1.8px solid rgba(34, 197, 94, 0.35);
    border-right: 1.8px solid rgba(34, 197, 94, 0.35);
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
    pointer-events: none;
    z-index: 1;
  }

  /* Gradiente no canto superior direito */
  .mobile-performance-card::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 50px;
    height: 50px;
    background: radial-gradient(at right top, rgba(34, 197, 94, 0.25) 0%, transparent 70%);
    pointer-events: none;
    filter: blur(16px);
    border-top-right-radius: 24px;
  }

  .mobile-performance-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 4px;
  }

  .mobile-performance-icon {
    width: 15px !important;
    height: 15px !important;
    background: transparent !important;
    border-radius: 0 !important;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
    filter: brightness(1.15);
  }

  .mobile-performance-title {
    font-size: 9px !important;
    font-weight: 500 !important;
    color: #D9D9D9 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.05em !important;
    margin: 0 !important;
    line-height: 1.2 !important;
    text-align: left !important;
  }

  .mobile-performance-percentage {
    font-size: 32px !important;
    font-weight: 700 !important;
    color: #22C55E !important;
    margin: 16px 0 16px 0 !important;
    text-align: left !important;
    line-height: 1 !important;
    letter-spacing: -0.02em !important;
  }

  .mobile-performance-chart {
    width: 100%;
    height: 28px !important;
    margin: 0 0 12px 0 !important;
  }

  .mobile-performance-chart svg {
    filter: drop-shadow(0 0 3px rgba(34, 197, 94, 0.25));
  }

  .mobile-performance-btn {
    width: calc(100% + 40px) !important;
    max-width: calc(100% + 40px) !important;
    margin-left: -20px !important;
    margin-right: -20px !important;
    margin-top: auto !important;
    margin-bottom: 0 !important;
    height: 50px !important;
    background: linear-gradient(180deg, rgb(13, 63, 36) 0%, rgb(15, 90, 44) 100%) !important;
    border: none !important;
    border-top: 1px solid rgba(34, 197, 94, 0.18) !important;
    border-radius: 0 0 24px 24px !important;
    color: rgb(232, 255, 232) !important;
    font-size: 13px !important;
    font-weight: 700 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.05em !important;
    cursor: pointer;
    transition: all 0.3s;
    flex-shrink: 0;
    box-sizing: border-box !important;
    position: relative;
    z-index: 10;
  }

  .mobile-performance-btn:hover {
    filter: brightness(1.1);
  }

  .mobile-performance-btn:active {
    transform: scale(0.95);
  }

  /* Mobile Account Summary */
  .mobile-account-summary {
    display: block !important;
    background: transparent !important;
    border-radius: 0 !important;
    padding: 0 !important;
    margin-bottom: 0 !important;
    border: none !important;
    animation: fadeInUp 0.6s ease-out;
  }

  /* Remove backgrounds das sections no mobile */
  #best-ai-section .absolute.inset-0.bg-gradient-to-b,
  #performance-section .absolute.inset-0.bg-gradient-to-b {
    display: none !important;
  }

  .mobile-account-user {
    margin-bottom: 0 !important;
    animation: fadeInUp 0.6s ease-out;
  }

  .mobile-account-profile-wrapper {
    display: flex;
    align-items: center;
    gap: 14px !important;
  }

  /* Ajustar gap do nome do usuário conforme HTML */
  .mobile-account-name-wrapper {
    gap: 16px !important;
  }

  .mobile-account-avatar {
    width: 48px !important;
    height: 48px !important;
    border-radius: 50% !important;
    object-fit: cover;
    flex-shrink: 0;
    border: 2px solid rgba(255, 255, 255, 0.1) !important;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4) !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }

  .mobile-account-avatar:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.6), 0 0 16px rgba(34, 197, 94, 0.2) !important;
  }

  .mobile-account-avatar-placeholder {
    background: #22C55E;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mobile-account-avatar-initials {
    color: #fff;
    font-size: 18px;
    font-weight: 600;
  }

  .mobile-account-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0 !important;
  }

  .mobile-account-name-wrapper {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 0 !important;
  }

  .mobile-account-name-container {
    display: flex;
    flex-direction: column;
    gap: 0 !important;
    align-items: flex-start;
  }

  .mobile-account-name {
    font-size: 15px !important;
    font-weight: 600 !important;
    color: #FFFFFF !important;
    margin: 0 !important;
    text-align: left !important;
    line-height: 1.2 !important;
    letter-spacing: -0.01em !important;
  }

  .mobile-header-icons {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .mobile-search-icon-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: all 0.3s ease;
  }

  .mobile-search-icon-btn:hover {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
  }

  .mobile-search-icon-btn:active {
    transform: scale(0.95);
  }

  .mobile-search-icon-btn i {
    font-size: 17px !important;
    color: rgba(255, 255, 255, 0.45) !important;
    transition: color 0.3s ease;
  }

  .mobile-search-icon-btn:hover i {
    color: rgba(255, 255, 255, 0.8) !important;
  }

  .mobile-notification-icon {
    flex-shrink: 0;
    cursor: pointer;
    transition: opacity 0.3s ease;
  }

  .mobile-notification-icon:hover {
    opacity: 0.8;
  }

  .mobile-account-status {
    font-size: 11px !important;
    color: #9B9B9B !important;
    text-align: left !important;
    font-weight: 500 !important;
    margin: 0 !important;
    line-height: 1.2 !important;
    padding-top: 1px !important;
  }

  .mobile-account-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px !important;
    margin-top: 32px !important;
    animation: fadeInUp 0.7s ease-out 0.1s backwards;
  }

  .mobile-account-title {
    font-size: 12px !important;
    color: #999999 !important;
    font-weight: 300 !important;
    margin: 0 !important;
  }

  .mobile-account-eye {
    background: none;
    border: none;
    color: #9B9B9B;
    font-size: 16px;
    cursor: pointer;
    padding: 4px;
  }

  .mobile-account-balance {
    font-size: 56px !important;
    font-weight: 700 !important;
    color: #FFFFFF !important;
    margin-bottom: 8px !important;
    margin-top: 0 !important;
    text-align: left !important;
    line-height: 1 !important;
    letter-spacing: -0.02em !important;
  }

  .mobile-account-performance {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px !important;
    margin-bottom: 40px !important;
    margin-top: 8px !important;
  }

  .mobile-account-percentage {
    font-size: 15px !important;
    font-weight: 500 !important;
    color: #22C55E !important;
  }

  .mobile-account-period {
    font-size: 12px !important;
    color: rgba(255, 255, 255, 0.35) !important;
    font-weight: 300 !important;
  }

  .mobile-account-actions {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 12px !important;
    justify-content: flex-start;
    width: 100%;
    margin-bottom: 40px !important;
    animation: fadeInUp 0.8s ease-out 0.2s backwards;
  }

  .mobile-action-btn {
    flex: 1;
    height: 52px !important;
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.95) 0%, rgba(22, 163, 74, 0.95) 100%) !important;
    box-shadow: 0 8px 24px rgba(34, 197, 94, 0.30), 0 0 32px rgba(34, 197, 94, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.15) !important;
    border: 1px solid rgba(34, 197, 94, 0.4) !important;
    border-radius: 12px !important;
    color: #fff !important;
    font-size: 15px !important;
    font-weight: 600 !important;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .mobile-action-btn:hover {
    background: linear-gradient(135deg, rgba(34, 197, 94, 1) 0%, rgba(22, 163, 74, 1) 100%) !important;
    box-shadow: 0 12px 32px rgba(34, 197, 94, 0.40), 0 0 48px rgba(34, 197, 94, 0.20), inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
    transform: translateY(-2px);
  }

  .mobile-action-btn:active {
    transform: scale(0.98);
  }

  .mobile-action-btn i {
    font-size: 16px;
  }
}

/* Desktop - oculta mobile e garante que desktop aparece */
@media (min-width: 769px) {
  .mobile-account-summary,
  .mobile-ias-header,
  .mobile-grid-ias,
  .mobile-performance-grid,
  .mobile-performance-header-title {
    display: none !important;
  }

  .desktop-ias-header,
  .desktop-grid-ias,
  .desktop-performance-grid,
  .desktop-performance-header {
    display: block !important;
  }

  /* Desktop Grid IAs - sempre 4 colunas lado a lado */
  .desktop-grid-ias {
    display: grid !important;
    grid-template-columns: repeat(4, 1fr) !important;
    gap: 24px !important;
  }

  .desktop-performance-grid {
    display: grid !important;
    grid-template-columns: repeat(4, 1fr) !important;
    gap: 24px !important;
  }
  
  /* Gradiente da esquerda para direita nos cards de IA (similar ao academy) */
  .desktop-grid-ias [id^="ai-card-"] > div.p-6::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100px;
    right: 0;
    height: 100%;
    background: linear-gradient(to right, 
      rgba(11, 11, 11, 0) 0%,
      rgba(11, 11, 11, 0.2) 15%,
      rgba(11, 11, 11, 0.4) 30%,
      rgba(11, 11, 11, 0.6) 45%,
      rgba(11, 11, 11, 0.75) 60%,
      rgba(11, 11, 11, 0.85) 75%,
      rgba(11, 11, 11, 0.92) 90%,
      rgba(11, 11, 11, 0.98) 100%);
    pointer-events: none;
    z-index: 1;
  }
  
  .desktop-grid-ias [id^="ai-card-"] > div.p-6 > * {
    position: relative;
    z-index: 2;
  }
}

/* ===== MODAL DE IAs ===== */
.ias-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.ias-modal-content {
  background: #0B0B0B;
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.ias-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(34, 197, 94, 0.1);
}

.ias-modal-title {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.ias-modal-close {
  background: none;
  border: none;
  color: #9B9B9B;
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  transition: color 0.3s;
}

.ias-modal-close:hover {
  color: #fff;
}

.ias-modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.ias-modal-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ia-card-modal {
  background: #0E0E0E;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(34, 197, 94, 0.1);
  transition: all 0.3s;
}

.ia-card-modal:active {
  transform: scale(0.98);
}

.ia-image-modal {
  width: 100%;
  height: 150px;
  overflow: hidden;
}

.ia-image-modal img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ia-content-modal {
  padding: 16px;
}

.ia-name-modal {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 8px 0;
}

.ia-description-modal {
  font-size: 14px;
  color: #9B9B9B;
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.ia-performance-modal {
  margin-bottom: 16px;
}

.ia-percentage-modal {
  font-size: 16px;
  font-weight: 600;
  color: #22C55E;
}

.ia-activate-btn-modal {
  width: 100%;
  height: 44px;
  background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%);
  border: none;
  border-radius: 12px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s;
}

.ia-activate-btn-modal:active {
  transform: scale(0.98);
}

/* Settings Modal Styles */
.settings-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
  padding: 0;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease-out;
}

.settings-modal-content {
  background: #0B0B0B;
  border-radius: 0;
  width: 100%;
  max-width: 400px;
  min-width: 320px;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-left: 2px solid rgba(255, 255, 255, 0.05);
  animation: slideInRight 0.3s ease-out;
}

.settings-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: none;
}

.settings-modal-title {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.settings-modal-close {
  background: none;
  border: none;
  color: #9B9B9B;
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  transition: color 0.3s;
}

.settings-modal-close:hover {
  color: #fff;
}

.settings-modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.settings-modal-section {
  margin-bottom: 24px;
}

.settings-modal-section:last-child {
  margin-bottom: 0;
}

.settings-modal-section .glass-card {
  background: #1A1A1A;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.settings-account-btn {
  flex: 1;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
}

.settings-account-btn-active {
  background: #22C55E;
  color: #FFFFFF;
}

.settings-account-btn-inactive {
  background: #2A2A2A;
  color: #9B9B9B;
}

.settings-account-btn-inactive:hover {
  background: #333333;
  color: #CCCCCC;
}

.settings-deposit-btn {
  width: 100%;
  background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%);
  border: none;
  border-radius: 12px;
  padding: 14px;
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
  margin-bottom: 0;
}

.settings-deposit-btn:hover {
  opacity: 0.9;
  box-shadow: 0 6px 16px rgba(34, 197, 94, 0.4);
  transform: translateY(-1px);
}

.settings-deposit-btn:active {
  transform: scale(0.98);
}

.settings-balance-amount {
  color: #FFFFFF;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
  text-align: left;
}

.settings-modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
  color: #FFFFFF;
}

.settings-modal-section {
  margin-bottom: 24px;
}

.settings-modal-section:last-child {
  margin-bottom: 0;
}

.settings-modal-section-with-border {
  border-top: 2px solid rgba(255, 255, 255, 0.05);
  padding-top: 24px;
  margin-top: 0;
  margin-left: -24px;
  margin-right: -24px;
  padding-left: 24px;
  padding-right: 24px;
}

.settings-user-info {
  text-align: left;
}

.settings-user-name {
  color: #FFFFFF;
  font-size: 15px;
  font-weight: 600;
  margin: 0;
  line-height: 1.3;
}

.settings-user-status {
  color: #22C55E;
  font-size: 12px;
  font-weight: 500;
  margin: 2px 0 0 0;
  line-height: 1.3;
}

.settings-balance-label {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  font-weight: 400;
}

.settings-eye-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s ease;
  font-size: 14px;
}

.settings-eye-btn:hover {
  color: rgba(255, 255, 255, 0.8);
}

.accounts-list {
  margin-top: 8px;
  border-top: 2px solid rgba(255, 255, 255, 0.05);
  padding-top: 8px;
}

.account-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.account-item:last-child {
  border-bottom: none;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .settings-modal-content {
    max-width: 85%;
    min-width: 280px;
  }
}

/* Notifications Modal Styles */
.notifications-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
  padding: 0;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease-out;
}

.notifications-modal-content {
  background: #0B0B0B;
  border-radius: 0;
  width: 100%;
  max-width: 400px;
  min-width: 320px;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-left: 2px solid rgba(255, 255, 255, 0.05);
  animation: slideInRight 0.3s ease-out;
}

.notifications-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: none;
}

.notifications-modal-title {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.notifications-modal-close {
  background: none;
  border: none;
  color: #9B9B9B;
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  transition: color 0.3s;
}

.notifications-modal-close:hover {
  color: #fff;
}

.notifications-modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
  color: #FFFFFF;
}

.notifications-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notification-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #1A1A1A;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.notification-item:hover {
  background: #1F1F1F;
  border-color: rgba(255, 255, 255, 0.1);
}

.notification-icon {
  width: 40px;
  height: 40px;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(34, 197, 94, 0.1);
  border-radius: 10px;
  color: #22C55E;
  font-size: 18px;
}

.notification-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.notification-title {
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  line-height: 1.3;
}

.notification-message {
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  margin: 0;
  line-height: 1.4;
}

.notification-time {
  color: rgba(255, 255, 255, 0.4);
  font-size: 11px;
  margin-top: 4px;
}

@media (max-width: 768px) {
  .notifications-modal-content {
    max-width: 85%;
    min-width: 280px;
  }
}

/* Símbolo D com três linhas para Demo no Mobile - baseado no TopNavbar */
.demo-currency-symbol-mobile-wrapper {
  position: relative;
  display: inline-block;
  margin-right: 4px;
}

.demo-currency-symbol-mobile {
  position: relative;
  display: inline-block;
  font-weight: bold;
  font-size: 56px;
  line-height: 1;
}

.demo-currency-symbol-mobile::before {
  content: '';
  position: absolute;
  left: 0;
  width: 0.3em;
  top: 35%;
  height: 3px;
  background-color: currentColor;
  transform: translateY(-50%);
  border-radius: 1px;
}

.demo-currency-symbol-mobile::after {
  content: '';
  position: absolute;
  left: 0;
  width: 0.3em;
  top: 65%;
  height: 3px;
  background-color: currentColor;
  transform: translateY(-50%);
  border-radius: 1px;
}


/* Símbolo D para Modal - baseado no TopNavbar */
.demo-currency-symbol-wrapper {
  position: relative;
  display: inline-block;
  margin-right: 2px;
}

.demo-currency-symbol {
  position: relative;
  display: inline-block;
  font-weight: bold;
  font-size: 1.5rem;
  line-height: 1;
}

.demo-currency-symbol::before {
  content: '';
  position: absolute;
  left: 0;
  width: 0.3em;
  top: 35%;
  height: 2.5px;
  background-color: currentColor;
  transform: translateY(-50%);
  border-radius: 1px;
}

.demo-currency-symbol::after {
  content: '';
  position: absolute;
  left: 0;
  width: 0.3em;
  top: 65%;
  height: 2.5px;
  background-color: currentColor;
  transform: translateY(-50%);
  border-radius: 1px;
}

.demo-currency-line-middle {
  position: absolute;
  left: 0;
  width: 0.3em;
  top: 50%;
  height: 2.5px;
  background-color: currentColor;
  transform: translateY(-50%);
  border-radius: 1px;
  z-index: 1;
}

/* Símbolo D pequeno para lista de contas no modal */
.demo-currency-symbol-modal-small-wrapper {
  position: relative;
  display: inline-block;
  margin-right: 2px;
}

.demo-currency-symbol-modal-small {
  position: relative;
  display: inline-block;
  font-weight: bold;
  font-size: 12px;
  line-height: 1;
}

.demo-currency-symbol-modal-small::before {
  content: '';
  position: absolute;
  left: 0;
  width: 0.3em;
  top: 35%;
  height: 2px;
  background-color: currentColor;
  transform: translateY(-50%);
  border-radius: 1px;
}

.demo-currency-symbol-modal-small::after {
  content: '';
  position: absolute;
  left: 0;
  width: 0.3em;
  top: 65%;
  height: 2px;
  background-color: currentColor;
  transform: translateY(-50%);
  border-radius: 1px;
}

.demo-currency-line-middle-small {
  position: absolute;
  left: 0;
  width: 0.3em;
  top: 50%;
  height: 2px;
  background-color: currentColor;
  transform: translateY(-50%);
  border-radius: 1px;
  z-index: 1;
}

</style>
