<template>
  <div class="dashboard-layout">


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
        @account-type-changed="null"
        :balances-by-currency-real="balancesByCurrencyReal"
        :balances-by-currency-demo="balancesByCurrencyDemo"
        :currency-prefix="preferredCurrencyPrefix"
        @toggle-sidebar="toggleMobileSidebar"
        @toggle-sidebar-collapse="toggleSidebarCollapse"
      />
    
    <!-- Main Content -->
    <main class="main-content bg-zenix-bg noise-bg font-inter overflow-y-auto w-full" style="overflow-x: hidden;">
      <!-- Hero Onboarding Section -->
      <section id="hero-section" class="w-full mt-16 py-12 relative overflow-visible group h-[560px]">
      <div class="absolute inset-0 z-0 bg-gradient-to-r from-[#0B0B0B] to-transparent" style="left: -32px; width: calc(100% + 64px);">
        <!-- Video Background - Desktop Only (Dual Video for Seamless Loop) -->
        <template v-if="!isMobile">
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
        </template>
        <!-- Fallback Background for Mobile -->
        <div v-else class="md:hidden absolute inset-0 bg-gradient-to-br from-[#0B0B0B] via-[#0d1410] to-[#0B0B0B]">
        </div>
        <!-- Overlay for Desktop - desaparece quando sidebar está colapsada -->
        <div v-if="!isMobile && !localSidebarCollapsed" class="hidden md:block absolute inset-0 bg-gradient-to-r from-[rgb(20_17_17/0.35)] to-transparent">
        </div>
      </div>
      <div class="relative z-10 h-full w-full">
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
                @click="openDepositFlow"
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
      <section id="ticker-section" class="py-3 relative overflow-hidden border-t border-[#22C55E]/20 bg-[rgba(11,11,11,0.8)] backdrop-blur-sm w-full">
        <div class="relative z-10 w-full">
          <div class="relative overflow-hidden w-full">
            <div class="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[rgba(11,11,11,0.95)] to-transparent z-10 pointer-events-none"></div>
            <div class="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[rgba(11,11,11,0.95)] to-transparent z-10 pointer-events-none"></div>
            <div id="ticker-scroll" class="flex items-center whitespace-nowrap w-full">
              <div 
                v-for="(item, index) in tickerItems" 
                :key="index" 
                class="inline-flex items-center space-x-3 px-8"
              >
                <i :class="[item.icon, 'text-[#22C55E] text-sm opacity-100']"></i>
                <span class="text-white/95 text-sm font-medium" v-html="item.text"></span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <div class="py-0 w-full" style="padding-left: 0; padding-right: 0;">
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
                      <span v-if="hasUnreadNotifications" class="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#22C55E] rounded-full"></span>
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
            <span v-if="balanceVisible" class="inline-flex items-center gap-2">
              <span>{{ mobileCurrencyPrefix }}</span>
              {{ balanceVisible ? mobileBalanceValue : '' }}
            </span>
            <span v-else>••••••</span>
          </div>
          <div class="mobile-account-performance">
            <span class="mobile-account-percentage" :class="totalWeeklyPerformance >= 0 ? 'text-[#22C55E]' : 'text-[#FF4747]'">
              {{ totalWeeklyPerformance >= 0 ? '+' : '' }}{{ totalWeeklyPerformance.toFixed(1) }}%
            </span>
            <span class="mobile-account-period">esta semana</span>
          </div>
          <div class="mobile-account-actions">
            <button class="mobile-action-btn" @click="openDepositFlow">
              <i class="fas fa-wallet"></i>
              <span>Depositar</span>
            </button>
            <button class="mobile-action-btn" @click="activateIA()">
              <i class="fas fa-chart-line"></i>
              <span>Operar</span>
            </button>
          </div>
        </section>
        
        <!-- Best IAs Section -->
        <section id="best-ai-section" class="pt-0 pb-0 relative w-full">
          <div class="absolute inset-0 bg-gradient-to-b from-[#020302] via-[#030403] to-[#020302] opacity-60 pointer-events-none"></div>
          <div class="relative z-10 w-full px-6 md:px-10">
            <!-- Desktop Header -->
            <div class="text-left mb-8 space-y-2 desktop-ias-header">
              <div class="flex justify-between items-center mb-2">
                <h2 class="text-5xl font-bold text-[#E6E6E6] tracking-[-0.02em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.08)]">Melhores IA's <span class="text-[#22C55E]">Agora</span></h2>
                <a href="#" class="see-all-link-desktop" @click.prevent="navigateToIAs">Ver tudo</a>
              </div>
              <p class="desktop-description-text text-[17px] text-[#9B9B9B] max-w-3xl leading-[1.75]">
                Escolha entre as inteligências artificiais mais avançadas do mercado. Cada IA foi otimizada para diferentes estratégias e perfis de risco, <span class="text-[#22C55E]">garantindo máxima performance em suas operações.</span>
              </p>
            </div>
            
            <!-- Mobile Header -->
            <div class="mobile-ias-header">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-[20px] font-bold text-[#E6E6E6]">Melhores IAs</h2>
                <a href="#" class="see-all-link-mobile" @click.prevent="navigateToIAs">Ver tudo</a>
              </div>
            </div>
            
            
            <!-- Desktop Grid -->
            <div v-if="!isMobile" class="grid grid-cols-5 gap-6 mb-0 desktop-grid-ias">
            <div 
              v-for="(ia, index) in bestIAs" 
              :key="index"
              :id="`ai-card-${index + 1}`"
              class="relative bg-[#0B0B0B] rounded-[20px] overflow-hidden desktop-no-shadow transition-all duration-500 group hover:-translate-y-1.5 cursor-pointer"
              @click="activateIA(ia.id)"
            >
              <div class="absolute -inset-4 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.10)_0%,transparent_70%)] blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.04)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.02)_0%,transparent_70%)] animate-pulse" :style="{ animationDelay: `${index * 0.5}s`, animationDuration: '4s' }"></div>
              <div class="h-[182px] w-full overflow-hidden relative" style="padding-left: 0; padding-right: 0;">
                <img :src="ia.image" :alt="ia.alt || ia.name" class="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-[1.21] group-hover:saturate-[1.30] group-hover:-translate-y-0.5" style="filter: brightness(1.23) saturate(1.3) drop-shadow(0 0 12px rgba(34,197,94,0.18)); padding-left: 0; padding-right: 0;">
                <!-- Gradiente da esquerda para direita (similar ao academy) -->
                <div class="absolute inset-0 bg-gradient-to-r from-[#0B0B0B] via-[rgba(11,11,11,0.98)] via-[rgba(11,11,11,0.95)] via-[rgba(11,11,11,0.85)] via-[rgba(11,11,11,0.75)] via-[rgba(11,11,11,0.65)] via-[rgba(11,11,11,0.5)] via-[rgba(11,11,11,0.35)] via-[rgba(11,11,11,0.25)] via-[rgba(11,11,11,0.15)] via-[rgba(11,11,11,0.1)] to-transparent pointer-events-none z-10"></div>
                <div class="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(11,11,11,0.3)] to-[#0B0B0B]"></div>
                <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent opacity-60"></div>
                <!-- Sombra de transição entre imagem e título -->
                <div class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent via-[rgba(11,11,11,0.4)] to-[#0B0B0B] pointer-events-none z-20" style="box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.5);"></div>
              </div>
              <div class="p-6 flex flex-col gap-3.5 relative">
                <div class="flex flex-col gap-2">
                  <h3 class="text-xl font-semibold text-[rgba(255,255,255,0.95)] transition-colors duration-300 group-hover:text-white">{{ ia.name }}</h3>
                  <p class="text-sm text-[rgba(255,255,255,0.78)] leading-relaxed transition-colors duration-300 group-hover:text-[rgba(255,255,255,0.85)]">{{ ia.description || ia.category }}</p>
                </div>
                <button 
                  @click.stop="activateIA(ia.id)"
                  class="w-full h-12 bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#15803D] text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_6px_20px_rgba(34,197,94,0.38),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_8px_28px_rgba(34,197,94,0.53),inset_0_1px_0_rgba(255,255,255,0.15)] group/btn"
                  style="filter: brightness(1.05) saturate(1.08);"
                >
                  <span>Ativar agora</span>
                  <i class="fas fa-arrow-right text-xs transition-transform duration-300 group-hover/btn:translate-x-1"></i>
                </button>
              </div>
            </div>
          </div>
          
          <!-- Mobile Grid - Lista vertical de 4 IAs -->
          <div v-else class="mobile-grid-ias">
            <div 
              v-for="(ia, index) in displayedIAs" 
              :key="index"
              class="ia-card-mobile cursor-pointer"
              @click="activateIA(ia.id)"
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
      <section id="performance-section" class="pt-4 pb-36 relative w-full">
        <div class="absolute inset-0 bg-gradient-to-b from-[#0B0B0B] via-[#0E0E0E] to-[#0B0B0B] opacity-40 pointer-events-none"></div>
        <div class="relative z-10 w-full px-6 md:px-10">
          <!-- Desktop Header -->
          <div class="text-left mb-8 space-y-2 desktop-performance-header">
            <h2 class="text-5xl font-bold text-[#E6E6E6] tracking-[-0.02em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.08)] desktop-performance-title">Desempenho <span class="desktop-green-text">Geral</span></h2>
            <p class="text-[17px] text-[#9B9B9B] max-w-3xl leading-[1.75] desktop-performance-description">
              Ative agora os recursos que podem aumentar seus resultados automaticamente.<br>
              <span class="desktop-green-text">Cada ferramenta desligada é lucro não realizado.</span>
            </p>
          </div>
          
          <!-- Mobile Header -->
          <div class="mobile-performance-header-title">
            <h2 class="text-[20px] font-bold text-[#E6E6E6]">Desempenho Geral</h2>
          </div>
          
          <!-- Performance Grid (Desktop) -->
          <div v-if="!isMobile" class="desktop-performance-grid hidden md:grid grid-cols-4 gap-6">
            <div 
              v-for="(perf, index) in sortedPerformanceData" 
              :key="index"
              class="performance-card relative rounded-2xl border border-[#22C55E]/20 bg-gradient-to-br from-[#0B0B0B] to-[#141414] shadow-[0_6px_24px_rgba(0,0,0,0.35)] transition-all duration-[250ms] hover:shadow-[0_12px_36px_rgba(34,197,94,0.25),0_0_42px_rgba(34,197,94,0.12)] hover:border-[#22C55E]/35 hover:scale-[1.006] group"
              :class="{ 'opacity-60 cursor-not-allowed hover:scale-100 hover:shadow-[0_6px_24px_rgba(0,0,0,0.35)]': perf.disabled }"
              :title="perf.disabled ? perf.tooltip : ''"
              @click="!perf.disabled && handlePerformanceAction(perf)"
              style="cursor: pointer;"
            >
              <div class="absolute -inset-4 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.12)_0%,transparent_70%)] blur-[80px] opacity-100 -z-10 transition-opacity duration-[250ms] group-hover:opacity-125"></div>
              <div class="p-6 flex flex-col gap-6">
                <div class="flex items-start justify-between">
                  <div class="w-[70px] h-[70px] bg-gradient-to-br from-[#22C55E]/10 to-[#16A34A]/5 rounded-xl flex items-center justify-center border border-[#22C55E]/20 shadow-[0_0_32px_rgba(34,197,94,0.28)]" :class="`animate-icon-pulse${index > 0 ? `-delay-${index}` : ''}`">
                    <i :class="[perf.icon, 'text-[#22C55E] text-[37px] drop-shadow-[0_0_12px_rgba(34,197,94,0.32)]']"></i>
                  </div>
                  <div class="text-right">
                    <div class="text-3xl font-bold text-[#22C55E]">+{{ getPerformancePercentage(perf.id) }}%</div>
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
                  @click.stop="!perf.disabled && handlePerformanceAction(perf)"
                  class="w-full h-11 bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#15803D] text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-[0_6px_20px_rgba(34,197,94,0.35),0_0_22px_rgba(34,197,94,0.12),0_2px_4px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_28px_rgba(34,197,94,0.45),0_0_30px_rgba(34,197,94,0.25),0_3px_6px_rgba(0,0,0,0.4)] active:scale-[0.97] group/btn"
                  :class="{ 'from-[#333] to-[#222] hover:from-[#333] hover:to-[#222] cursor-not-allowed shadow-none hover:shadow-none': perf.disabled }"
                  style="filter: brightness(1.1) saturate(1.1);"
                >
                  <span>{{ perf.buttonText }}</span>
                  <i v-if="!perf.disabled" class="fas fa-arrow-right text-xs transition-transform duration-200 group-hover/btn:translate-x-[3px]"></i>
                  <i v-else class="fas fa-lock text-xs"></i>
                </button>
              </div>
            </div>
          </div>
          
          <!-- Mobile Performance Grid -->
          <div v-else class="mobile-performance-grid">
            <div 
              v-for="(perf, index) in sortedPerformanceData" 
              :key="index"
              class="mobile-performance-card"
              :class="{ 'opacity-60 cursor-not-allowed': perf.disabled }"
              :title="perf.disabled ? perf.tooltip : ''"
              @click="!perf.disabled && handlePerformanceAction(perf)"
            >
              <div class="mobile-performance-header">
                <div class="mobile-performance-icon">
                  <i :class="[perf.icon, 'text-[#22C55E]']"></i>
                </div>
                <h3 class="mobile-performance-title" v-html="formatTitleForMobile(perf.title)"></h3>
              </div>
              <div class="mobile-performance-percentage">+{{ getPerformancePercentage(perf.id) }}%</div>
              <div class="mobile-performance-chart">
                <svg viewBox="0 0 200 60" preserveAspectRatio="none" class="w-full h-full">
                  <path :d="perf.chartPathFull || perf.chartPath" fill="none" stroke="#22C55E" stroke-width="2"></path>
                </svg>
              </div>
              <button 
                @click.stop="!perf.disabled && handlePerformanceAction(perf)"
                class="mobile-performance-btn"
                :class="{ 'bg-[#333] cursor-not-allowed': perf.disabled }"
              >
                {{ perf.disabled ? 'EM BREVE' : 'ATIVAR' }}
              </button>
            </div>
          </div>
        </div>
      </section>
      </div>
    </main>
    
    <DesktopBottomNav />
    
    <FirstAccessVideoModal 
      :visible="showWelcomeVideo"
      @close="handleWelcomeVideoClose"
    />
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
                @click="activateIA(ia.id)"
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

<!-- Settings Modal (usando componente SettingsSidebar) -->
  <SettingsSidebar
    :is-open="showSettingsModal"
    :balance="info?.balance"
    :account-type="accountType"
    :balances-by-currency-real="balancesByCurrencyReal"
    :balances-by-currency-demo="balancesByCurrencyDemo"
    :currency-prefix="preferredCurrencyPrefix"
    @close="closeSettingsModal"
    @account-type-changed="null"
  />

  <!-- Modal de Notificações -->
  <div 
    v-if="showNotificationsModal" 
    class="notifications-modal-overlay"
    @click.self="closeNotificationsModal"
  >
    <div class="notifications-modal-content">
      <div class="notifications-modal-header">
        <h2 class="notifications-modal-title">Notificações</h2>
        <button 
          @click="closeNotificationsModal"
          class="notifications-modal-close"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="notifications-modal-body">
        <div v-if="notifications.length === 0" class="notifications-empty">
          <i class="fas fa-bell-slash text-[48px] text-white/20 mb-4"></i>
          <p class="text-white/40 text-[14px]">Nenhuma notificação</p>
        </div>
        <div v-else class="notifications-list">
          <div 
            v-for="notification in notifications" 
            :key="notification.id"
            class="notification-item"
          >
            <div class="notification-icon">
              <i :class="notification.icon || 'fa-solid fa-info-circle'"></i>
            </div>
            <div class="notification-content">
              <h3 class="notification-title">{{ removeEmojis(notification.title) }}</h3>
              <p class="notification-message">{{ notification.message }}</p>
              <span class="notification-time">{{ formatNotificationDate(notification.date) }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="notifications.length > 0" class="notifications-modal-footer">
        <button 
          @click="deleteAllNotifications" 
          class="w-full flex items-center justify-center gap-2 py-3 bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] rounded-lg text-sm font-medium transition-all duration-200 border border-transparent hover:border-[#EF4444]/20"
        >
          <i class="fas fa-trash"></i>
          <span>Excluir Notificações</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import TopNavbar from '../components/TopNavbar.vue'
import DesktopBottomNav from '../components/DesktopBottomNav.vue'
import AppSidebar from '../components/Sidebar.vue'
import SettingsSidebar from '../components/SettingsSidebar.vue'
import { loadAvailableAccounts } from '../utils/accountsLoader'
import FirstAccessVideoModal from '../components/modals/FirstAccessVideoModal.vue'

import accountBalanceMixin from '../mixins/accountBalanceMixin'

export default {
  name: 'DashboardConnected',
  mixins: [accountBalanceMixin],
  components: {
    TopNavbar,
    DesktopBottomNav,
    AppSidebar,
    SettingsSidebar,
    FirstAccessVideoModal

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
      showWelcomeVideo: false,
      userProfilePictureUrl: null,
      tradeCurrency: 'USD',
      tickerItems: [
        { icon: 'fas fa-bolt', text: 'João lucrou <span class="text-[#22C55E] font-semibold">$101,44</span> operando com a IA ORION' },
        { icon: 'fas fa-dollar-sign', text: 'Marcos sacou <span class="text-[#22C55E] font-semibold">$250</span> de lucro gerado pelo Agente Sentinel' },
        { icon: 'fas fa-robot', text: 'Rafael ativou a IA TRINITY no modo Normal' },
        { icon: 'fas fa-chart-line', text: 'Lucas depositou <span class="text-[#22C55E] font-semibold">$300</span> para escalar suas operações' },
        { icon: 'fas fa-bolt', text: 'Ana lucrou <span class="text-[#22C55E] font-semibold">$187</span> com o Copy Trading' },
        { icon: 'fas fa-trophy', text: 'Pedro bateu a meta diária de <span class="text-[#22C55E] font-semibold">$420</span> com o Agente Apex' },
        { icon: 'fas fa-bolt', text: 'Felipe lucrou <span class="text-[#22C55E] font-semibold">2,3%</span> hoje usando a IA ATLAS' },
        { icon: 'fas fa-dollar-sign', text: 'Bruno sacou <span class="text-[#22C55E] font-semibold">$1.000</span> após 7 dias operando automaticamente' },
        { icon: 'fas fa-robot', text: 'Carlos iniciou operações com a IA APOLLO' },
        { icon: 'fas fa-bolt', text: 'Daniel lucrou <span class="text-[#22C55E] font-semibold">$96</span> em operações manuais com sinais' },
        { icon: 'fas fa-chart-line', text: 'Eduardo depositou <span class="text-[#22C55E] font-semibold">$500</span> para aumentar o volume de operações' },
        { icon: 'fas fa-bolt', text: 'Thiago lucrou <span class="text-[#22C55E] font-semibold">$312</span> com a IA NEXUS' },
        { icon: 'fas fa-chart-line', text: 'André encerrou o dia com <span class="text-[#22C55E] font-semibold">+3,1%</span> usando a IA TITAN' },
        { icon: 'fas fa-robot', text: 'Victor ativou o Agente Autônomo Sentinel 24/7' },
        { icon: 'fas fa-dollar-sign', text: 'Guilherme sacou <span class="text-[#22C55E] font-semibold">$780</span> de lucro acumulado' },
        { icon: 'fas fa-bolt', text: 'Henrique lucrou <span class="text-[#22C55E] font-semibold">$155</span> com sinais manuais (90% de acerto)' },
        { icon: 'fas fa-cog', text: 'Leandro configurou gestão Moderada na IA OMEGA' },
        { icon: 'fas fa-bolt', text: 'Igor lucrou <span class="text-[#22C55E] font-semibold">$1.240</span> com o Copy Trading' },
        { icon: 'fas fa-chart-line', text: 'Matheus aumentou o depósito para <span class="text-[#22C55E] font-semibold">$1.000</span>' },
        { icon: 'fas fa-chart-line', text: 'Diego encerrou o dia com <span class="text-[#22C55E] font-semibold">+4,7%</span> no Agente Apex' },
        { icon: 'fas fa-bolt', text: 'Fernando lucrou <span class="text-[#22C55E] font-semibold">$268</span> com a IA SIGMA' },
        { icon: 'fas fa-trophy', text: 'Vinícius bateu a meta semanal de <span class="text-[#22C55E] font-semibold">$2.100</span>' },
        { icon: 'fas fa-robot', text: 'Renan ativou a IA GENESIS no modo Veloz' },
        { icon: 'fas fa-dollar-sign', text: 'Caio sacou <span class="text-[#22C55E] font-semibold">$540</span> direto da corretora' },
        { icon: 'fas fa-bolt', text: 'Alex lucrou <span class="text-[#22C55E] font-semibold">$89</span> em apenas 3 operações manuais' },
        { icon: 'fas fa-cog', text: 'Samuel configurou perfil Agressivo na IA FALCON' },
        { icon: 'fas fa-chart-line', text: 'Leonardo acumulou <span class="text-[#22C55E] font-semibold">+18%</span> no mês com o Agente Autônomo' },
        { icon: 'fas fa-bolt', text: 'Gustavo lucrou <span class="text-[#22C55E] font-semibold">$460</span> hoje com o Copy Trading' },
        { icon: 'fas fa-repeat', text: 'Wesley reinvestiu <span class="text-[#22C55E] font-semibold">$400</span> dos lucros obtidos' },
        { icon: 'fas fa-chart-line', text: 'Patrick encerrou o dia positivo com <span class="text-[#22C55E] font-semibold">+2,9%</span>' },
        { icon: 'fas fa-bolt', text: 'Diego lucrou <span class="text-[#22C55E] font-semibold">$670</span> com a IA ORION' },
        { icon: 'fas fa-dollar-sign', text: 'Murilo sacou <span class="text-[#22C55E] font-semibold">$1.500</span> após 30 dias de operação' },
        { icon: 'fas fa-robot', text: 'Otávio ativou o modo Agressivo na IA TRINITY' },
        { icon: 'fas fa-bolt', text: 'Fábio lucrou <span class="text-[#22C55E] font-semibold">$134</span> em sinais com 85% de acerto' },
        { icon: 'fas fa-chart-line', text: 'Jefferson aumentou o capital para <span class="text-[#22C55E] font-semibold">$2.000</span>' },
        { icon: 'fas fa-trophy', text: 'Alan bateu a meta diária de <span class="text-[#22C55E] font-semibold">$350</span>' },
        { icon: 'fas fa-bolt', text: 'Rodrigo lucrou <span class="text-[#22C55E] font-semibold">$980</span> com o Agente Sentinel' },
        { icon: 'fas fa-chart-line', text: 'Nicolas encerrou o mês com <span class="text-[#22C55E] font-semibold">+22%</span> de lucro' },
        { icon: 'fas fa-robot', text: 'Everton ativou o Copy Trading Profissional' },
        { icon: 'fas fa-bolt', text: 'Pablo lucrou <span class="text-[#22C55E] font-semibold">$210</span> com a IA ATLAS' },
        { icon: 'fas fa-dollar-sign', text: 'Sérgio sacou <span class="text-[#22C55E] font-semibold">$600</span> de lucro automático' },
        { icon: 'fas fa-robot', text: 'Júnior ativou sua primeira IA no ZENIX' },
        { icon: 'fas fa-bolt', text: 'Ricardo lucrou <span class="text-[#22C55E] font-semibold">$1.080</span> operando sem supervisão' },
        { icon: 'fas fa-cog', text: 'Kelvin ajustou gestão para Conservadora e manteve lucro' },
        { icon: 'fas fa-chart-line', text: 'Arthur acumulou <span class="text-[#22C55E] font-semibold">$3.400</span> no mês com o Agente Apex' },
        { icon: 'fas fa-bolt', text: 'Douglas lucrou <span class="text-[#22C55E] font-semibold">$74</span> em uma única entrada manual' },
        { icon: 'fas fa-repeat', text: 'Hugo reinvestiu os lucros para escalar resultados' },
        { icon: 'fas fa-chart-line', text: 'Bruno encerrou o dia com <span class="text-[#22C55E] font-semibold">+5%</span> de performance' },
        { icon: 'fas fa-bolt', text: 'Victor lucrou <span class="text-[#22C55E] font-semibold">$520</span> hoje usando a IA OMEGA' },
        { icon: 'fas fa-dollar-sign', text: 'Rafael sacou o lucro e já ativou novas operações' }
      ],
      notifications: [],
      hasUnreadNotifications: false,
      quickTools: [
        {
          icon: 'fas fa-robot',
          title: 'IA de Investimento',
          description: 'Algoritmos inteligentes para maximizar seus lucros',
          buttonText: 'Acessar',
          route: '/InvestmentIA',
          image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/3597e3389b-f497a4d7c72b20551d57.png',
          alt: 'abstract futuristic AI neural network glowing green circuits holographic technology dark background'
        },
        {
          icon: 'fas fa-users',
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
          icon: 'fas fa-atom',
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
          id: 'atlas',
          name: 'IA Atlas',
          category: 'Risco moderado',
          description: 'Consistência diária operando tendências estáveis.',
          consistency: 76,
          image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/32a220d5d1-0e8a97180ab9e8d7d494.png',
          alt: 'smooth flowing neural energy waves in neon green, continuous fluid motion with glowing particles following wave patterns on pure black background, elegant ambient green glow, digital energy visualization',
          sparklineData: [40, 45, 42, 48, 50, 47, 52, 55, 53, 58]
        },
        {
          id: 'apollo',
          name: 'IA Apollo',
          category: 'Alta velocidade',
          description: 'Estratégia agressiva para volatilidade intensa.',
          consistency: 91,
          image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/e3205bf243-eec06ca9c726e87c0cc2.png',
          alt: 'continuous neural pulse line with intense electric green energy spikes filling entire frame, fluid movements with glowing particles following pulse rhythm on pure black background, bright neon green peaks, soft ambient glow, zoomed in close-up view',
          sparklineData: [50, 58, 55, 65, 62, 70, 68, 75, 72, 80]
        },
        {
          id: 'nexus',
          name: 'IA Nexus',
          category: 'Barreira de segurança',
          description: 'Price Action com Barreira de Segurança e troca de contrato.',
          consistency: 85,
          image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/3597e3389b-f497a4d7c72b20551d57.png',
          alt: 'abstract futuristic AI neural network glowing green circuits holographic technology dark background',
          sparklineData: [42, 48, 45, 55, 50, 60, 55, 65, 60, 70]
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
          id: 'ia',
          icon: 'fas fa-brain',
          title: "IA's de Investimento",
          usage: 32,
          buttonText: 'Ativar agora',
          chartPath: 'M0,20 L20,15 L40,18 L60,12 L80,14 L100,8',
          chartPathFull: 'M0,45 L25,42 L50,38 L75,35 L100,30 L125,28 L150,25 L175,20 L200,15',
          chartEndY: 15
        },
        {
          id: 'copy',
          icon: 'fas fa-users',
          title: 'Copy Trading',
          usage: 0,
          buttonText: 'Em breve',
          chartPath: 'M0,22 L20,18 L40,20 L60,16 L80,17 L100,13',
          chartPathFull: 'M0,48 L25,46 L50,44 L75,40 L100,38 L125,35 L150,32 L175,28 L200,25',
          chartEndY: 25,
          disabled: true,
          tooltip: 'Funcionalidade em desenvolvimento.\n\nPara seu total conforto e aproveitamento da plataforma, estamos finalizando o desenvolvimento dessa funcionalidade, logo quando terminarmos você será avisado.'
        },
        {
          id: 'agent',
          icon: 'fas fa-atom',
          title: 'Agente Autônomo',
          usage: 0,
          buttonText: 'Em breve',
          chartPath: 'M0,18 L20,14 L40,16 L60,10 L80,12 L100,6',
          chartPathFull: 'M0,50 L25,48 L50,45 L75,42 L100,38 L125,33 L150,28 L175,22 L200,18',
          chartEndY: 18,
          disabled: true,
          tooltip: 'Funcionalidade em desenvolvimento.\n\nPara seu total conforto e aproveitamento da plataforma, estamos finalizando o desenvolvimento dessa funcionalidade, logo quando terminarmos você será avisado.'
        },
        {
          id: 'signals',
          icon: 'fas fa-chart-line',
          title: 'Operações com Sinais',
          usage: 0,
          buttonText: 'Em breve',
          chartPath: 'M0,19 L20,16 L40,17 L60,13 L80,14 L100,10',
          chartPathFull: 'M0,46 L25,44 L50,41 L75,38 L100,35 L125,32 L150,28 L175,24 L200,22',
          chartEndY: 22,
          disabled: true,
          tooltip: 'Funcionalidade em desenvolvimento.\n\nPara seu total conforto e aproveitamento da plataforma, estamos finalizando o desenvolvimento dessa funcionalidade, logo quando terminarmos você será avisado.'
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
      balanceVisible: localStorage.getItem('balanceVisible') !== 'false', // Persistir estado
      totalWeeklyPerformance: 0
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
    mobileCurrencyPrefix() {
      // Se o saldo fictício estiver ativo, sempre mostrar $ (nunca D$)
      if (this.isFictitiousBalanceActive) {
        return '$';
      }
      // Caso contrário, usar o prefixo padrão
      return this.preferredCurrencyPrefix;
    },
    sortedPerformanceData() {
      // Ordenar performance data pela porcentagem (da maior para menor)
      return [...this.performanceData].sort((a, b) => {
        const perfA = parseFloat(this.getPerformancePercentage(a.id));
        const perfB = parseFloat(this.getPerformancePercentage(b.id));
        return perfB - perfA; // Ordem decrescente
      });
    },
    // Removidos balanceNumeric e formattedBalance para usar os do mixin
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
      const value = this.balanceNumeric;
      const currency = this.info?.currency || 'USD';
      const isCrypto = ['BTC', 'ETH', 'LTC', 'USDC', 'UST'].includes(currency.toUpperCase());
      const decimals = isCrypto ? (currency === 'BTC' ? 8 : 4) : 2;

      return value.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    },
    displayedIAs() {
      // Ordenar IAs pela porcentagem (maior para menor) e mostrar todas as 5 IAs
      return this.sortedBestIAs.slice(0, 5);
    },
    sortedBestIAs() {
      // Ordenar IAs pela porcentagem (da maior para menor)
      return [...this.bestIAs].sort((a, b) => {
        const perfA = parseFloat(this.getIAPerformance(a.id));
        const perfB = parseFloat(this.getIAPerformance(b.id));
        return perfB - perfA; // Ordem decrescente
      });
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
    this.tickerItems = this.shuffleTicker(this.tickerItems);
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
    // Carregar desempenho semanal
    await this.loadWeeklyPerformance();
    this.loadLoginNotifications();
    // Check for welcome video flag
    this.checkWelcomeVideo();

    // Iniciar atualização de saldo em tempo real (5s)
    this.startBalancePolling(5000);
  },
  methods: {
    async loadWeeklyPerformance() {
      try {
        const apiBase = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${apiBase}/ai/performance/weekly/current`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const result = await response.json();
          const stats = result.data;
          
          // Escolher qual saldo usar baseado no tipo de conta (Real ou Demo)
          const isDemo = this.accountType === 'demo';
          const initial = isDemo ? stats.initialBalances.demo : stats.initialBalances.real;
          const current = isDemo ? stats.currentBalances.demo : stats.currentBalances.real;
          
          // Calcular percentual baseado no histórico de saldo
          let performance = 0;
          if (initial > 0) {
            performance = ((current - initial) / initial) * 100;
          }
          
          // ✅ REQUISITO: Se for negativa, mostrar +0,0%
          if (performance < 0) {
            performance = 0;
          }
          
          this.totalWeeklyPerformance = performance;

          // 1. Atualizar performanceData no estado reativo com Percentuais
          if (stats && stats.sources) {
            const mapping = {
              'ai': 0,
              'copy': 1,
              'agent': 2,
              'manual': 3
            };

            Object.entries(stats.sources).forEach(([source, value]) => {
              const index = mapping[source];
              if (index !== undefined && this.performanceData[index]) {
                // const sourcePercent = (value / safeInitialBalance) * 100;
                // const prefix = sourcePercent >= 0 ? '+' : '';
                // this.performanceData[index].percentage = `${prefix}${sourcePercent.toFixed(1)}%`;
                
                // Ajustar usage baseado se houve lucro ou não para dar feedback visual
                if (value !== 0) {
                  this.performanceData[index].usage = Math.min(100, Math.max(30, this.performanceData[index].usage));
                }
              }
            });
          }

          // 2. Logar no console com emojis (Requisito do Usuário)
          console.log('%c📈 EVOLUÇÃO SEMANAL DE SALDO', 'color: #22C55E; font-weight: bold; font-size: 14px;');
          console.log(`📅 Período: ${stats.period.start} - ${stats.period.end}`);
          console.log('');
          console.log(`🤖 IA: ${stats.sources.ai >= 0 ? '+$' : '-$'}${Math.abs(stats.sources.ai).toFixed(2)}`);
          console.log(`💼 Agente Autônomo: ${stats.sources.agent >= 0 ? '+$' : '-$'}${Math.abs(stats.sources.agent).toFixed(2)}`);
          console.log(`👥 Copy Trade: ${stats.sources.copy >= 0 ? '+$' : '-$'}${Math.abs(stats.sources.copy).toFixed(2)}`);
          console.log(`📊 Operação/Manual: ${stats.sources.manual >= 0 ? '+$' : '-$'}${Math.abs(stats.sources.manual).toFixed(2)}`);
          console.log('');
          const totalEmoji = stats.netResult >= 0 ? '🚀' : '🔻';
          const performanceText = stats.netResult >= 0 ? 'Ótimo desempenho!' : 'Atenção aos riscos.';
          console.log(`💰 Saldo Total: $${this.balanceNumeric.toFixed(2)}`);
          console.log(`✨ Resultado Total: ${stats.netResult >= 0 ? '+' : ''}$${stats.netResult.toFixed(2)} (${totalEmoji} ${performanceText})`);
          console.log('%c──────────────────────────────────', 'color: #333');
        }
      } catch (error) {
        console.error('[Dashboard] Erro ao carregar desempenho semanal:', error);
      }
    },
    toggleMobileSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    closeSidebar() {
      this.isSidebarOpen = false;
    },
    shuffleTicker(array) {
      // Cria uma cópia para não mutar o original diretamente
      let currentIndex = array.length, randomIndex;
      const newArray = [...array];

      // While there remain elements to shuffle.
      while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [newArray[currentIndex], newArray[randomIndex]] = [
          newArray[randomIndex], newArray[currentIndex]];
      }

      // Duplicar a lista embaralhada para garantir scroll contínuo suave
      return [...newArray, ...newArray, ...newArray];
    },
    /**
     * Retorna nome amigável da conta baseado no tipo e moeda
     * Ex: "Conta Demo (USD)" ou "Conta Real (USD)"
     */
    getAccountDisplayName(account) {
      if (!account) return 'Conta';
      
      const type = account.isDemo ? 'Demo' : 'Real';
      const currency = account.currency || 'USD';
      
      return `Conta ${type} (${currency})`;
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
      try {
        const isDemo = type === 'demo';
        const tradeCurrency = isDemo ? 'DEMO' : 'USD';
        
        // Tentar encontrar uma conta correspondente no cache de contas disponíveis
        const matchingAccount = this.availableAccounts.find(acc => acc.isDemo === isDemo);
        
        const apiBase = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
        const token = localStorage.getItem('token');
        
        if (matchingAccount) {
          console.log(`[Dashboard] Sincronizando conta ${type} com token: ${matchingAccount.loginid}`);
          
          // Usar o endpoint unificado que salva token E moeda
          const response = await fetch(`${apiBase}/settings/deriv-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              token: matchingAccount.token,
              tradeCurrency: tradeCurrency
            })
          });

          if (response.ok) {
            // Atualizar localStorage local para manter consistência imediata
            localStorage.setItem('deriv_token', matchingAccount.token);
            
            this.tradeCurrency = tradeCurrency;
            this.accountType = type;
            
            console.log('[Dashboard] ✅ Conta e token sincronizados com sucesso');
            window.location.reload();
            return;
          }
        }

        // Fallback: se não encontrar conta específica ou falhar, tentar atualizar apenas a moeda
        console.warn('[Dashboard] ⚠️ Nenhuma conta correspondente encontrada ou falha no sync, tentando apenas moeda...');
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
          this.tradeCurrency = tradeCurrency;
          this.accountType = type;
          window.location.reload();
        } else {
          throw new Error('Erro ao alterar conta');
        }
      } catch (error) {
        console.error('[Dashboard] Erro ao alterar moeda:', error);
        await alert('Erro ao alterar moeda. Tente novamente.');
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
    activateIA(strategyId) {
      // Fechar modal se estiver aberto
      if (this.showIAsModal) {
        this.closeIAsModal();
      }
      
      // Se tiver um ID de estratégia, passar como query param
      if (strategyId) {
        this.$router.push({
          path: '/InvestmentIA',
          query: { strategy: strategyId }
        });
      } else {
        // Navega para a página de IAs (padrão)
        this.$router.push('/InvestmentIA');
      }
    },
    navigateToIAs() {
      this.$router.push('/StatsIAs');
    },
    openIAsModal() {
      this.showIAsModal = true;
    },
    closeIAsModal() {
      this.showIAsModal = false;
    },
    toggleSettingsModal() {
      this.showSettingsModal = !this.showSettingsModal;
      // Não carregar contas automaticamente - o SettingsSidebar vai carregar quando necessário
      // Isso evita chamadas duplicadas
    },
    closeSettingsModal() {
      this.showSettingsModal = false;
      this.showAccountsList = false;
    },
    toggleNotificationsModal() {
      this.showNotificationsModal = !this.showNotificationsModal;
      if (this.showNotificationsModal) {
        this.hasUnreadNotifications = false;
      }
    },
    closeNotificationsModal() {
      this.showNotificationsModal = false;
    },
    async deleteAllNotifications() {
      // Solução persistente no frontend sem mudar o banco: salvar timestamp do "limpar"
      const timestamp = Date.now();
      localStorage.setItem('zenix_notifications_cleared_at', timestamp);
      
      this.notifications = [];
      this.hasUnreadNotifications = false;
      
      try {
        const apiBase = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
        const token = localStorage.getItem('token');
        
        // Chamada ao backend opcional (limpeza real se suportado, senão o local garante)
        fetch(`${apiBase}/notifications/clear`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }).catch(() => {});
      } catch (error) {
        console.error('[DashboardConnected] Erro ao limpar notificações:', error);
      }
    },
    async loadLoginNotifications() {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        
        const res = await fetch(`${apiBaseUrl}/notifications/login-summary`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data.notifications && data.notifications.length > 0) {
            // Pegar timestamp da última limpeza
            const clearedAt = parseInt(localStorage.getItem('zenix_notifications_cleared_at') || '0');
            
            // Filtrar apenas notificações mais recentes que a limpeza
            const filtered = data.notifications.filter(notif => {
              const notifDate = new Date(notif.timestamp).getTime();
              return notifDate > clearedAt;
            });

            const formattedNotifications = filtered.map((notif, index) => ({
              id: `login-notif-${index}`,
              title: notif.title,
              message: notif.message,
              icon: this.getNotificationIcon(notif.type),
              date: notif.timestamp,
              type: notif.type
            }));

            this.notifications = [...formattedNotifications];
            
            if (this.notifications.length > 0) {
              this.hasUnreadNotifications = true;
            } else {
              this.hasUnreadNotifications = false;
            }
          }
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('[DashboardConnected] Erro ao carregar notificações:', error);
        }
      }
    },

    checkWelcomeVideo() {
      // Check if the flag is set in localStorage
      const shouldShow = localStorage.getItem('showDashboardWelcomeVideo');
      if (shouldShow === 'true') {
        this.showWelcomeVideo = true;
      }
    },
    
    handleWelcomeVideoClose() {
      this.showWelcomeVideo = false;
      // Remove the flag so it doesn't show again
      localStorage.removeItem('showDashboardWelcomeVideo');
    },

    getNotificationIcon(type) {
      const iconMap = {
        'success': 'fa-solid fa-check-circle',
        'warning': 'fa-solid fa-exclamation-triangle',
        'error': 'fa-solid fa-times-circle',
        'info': 'fa-solid fa-info-circle'
      };
      return iconMap[type] || 'fa-solid fa-info-circle';
    },
    formatNotificationDate(date) {
      if (!date) return '';
      const d = new Date(date);
      return d.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    removeEmojis(text) {
      if (!text) return '';
      // Remove emojis usando regex
      return text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim();
    },
    toggleAccountsList() {
      this.showAccountsList = !this.showAccountsList;
      // Carregar apenas se não tiver contas - o cache já será usado automaticamente
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
      // Carregar contas em background apenas se não houver cache válido
      // Isso evita requisições desnecessárias
      const tokensByLoginIdStr = localStorage.getItem('deriv_tokens_by_loginid');
      if (tokensByLoginIdStr) {
        try {
          // Verificar se já há cache válido antes de fazer requisição
          const cacheKey = 'deriv_available_accounts_cache';
          const cacheTimestampKey = 'deriv_accounts_cache_timestamp';
          const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
          
          const cachedStr = localStorage.getItem(cacheKey);
          const timestampStr = localStorage.getItem(cacheTimestampKey);
          
          if (cachedStr && timestampStr) {
            const timestamp = parseInt(timestampStr);
            const now = Date.now();
            // Se cache ainda é válido, não precisa recarregar
            if (now - timestamp <= CACHE_DURATION) {
              console.log('[DashboardConnected] Cache válido encontrado, não recarregando em background');
              return;
            }
          }
          
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
        await alert('Erro ao trocar de conta. Tente novamente.');
      }
    },
    getCurrentTimePeriod() {
      // Determina o período do dia (manhã, tarde, noite)
      const hour = new Date().getHours();
      
      if (hour >= 6 && hour < 12) {
        return 'morning'; // Manhã: 6:00 - 11:59
      } else if (hour >= 12 && hour < 18) {
        return 'afternoon'; // Tarde: 12:00 - 17:59
      } else {
        return 'night'; // Noite: 18:00 - 5:59
      }
    },
    getIAPerformance(iaId) {
      // Retorna performance baseada no ID da IA e período do dia
      const period = this.getCurrentTimePeriod();
      const dayOfMonth = new Date().getDate(); // Pega o dia do mês (1-31)
      const dayModifier = dayOfMonth / 100; // Converte para casas decimais (0.01 a 0.31)
      
      // Valores entre 1 e 5 (valores quebrados) variando por período
      const performances = {
        'orion': {
          'morning': 3.7,
          'afternoon': 4.2,
          'night': 2.8
        },
        'atlas': {
          'morning': 4.5,
          'afternoon': 3.1,
          'night': 4.9
        },
        'apollo': {
          'morning': 2.3,
          'afternoon': 4.8,
          'night': 3.6
        },
        'nexus': {
          'morning': 3.9,
          'afternoon': 2.6,
          'night': 4.4
        },
        'titan': {
          'morning': 4.1,
          'afternoon': 3.8,
          'night': 2.2
        }
      };
      
      const basePerformance = performances[iaId]?.[period] || 0;
      const finalPerformance = basePerformance + dayModifier;
      
      return finalPerformance.toFixed(2);
    },
    getPerformancePercentage(performanceId) {
      // Retorna performance baseada no ID do serviço e período do dia
      const period = this.getCurrentTimePeriod();
      const dayOfMonth = new Date().getDate(); // Pega o dia do mês (1-31)
      const dayModifier = dayOfMonth / 100; // Converte para casas decimais (0.01 a 0.31)
      
      // Valores entre 1 e 6 (variando por período)
      const performances = {
        'ia': {
          'morning': 3.2,
          'afternoon': 4.5,
          'night': 2.1
        },
        'copy': {
          'morning': 5.3,
          'afternoon': 4.8,
          'night': 5.7
        },
        'agent': {
          'morning': 2.8,
          'afternoon': 3.9,
          'night': 1.9
        },
        'signals': {
          'morning': 2.3,
          'afternoon': 3.1,
          'night': 1.5
        }
      };
      
      const basePerformance = performances[performanceId]?.[period] || 0;
      const finalPerformance = basePerformance + dayModifier;
      
      return finalPerformance.toFixed(1);
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
      if (perf.title.includes('IA') || perf.title.includes('Investimento')) {
        this.$router.push('/StatsIAs');
      } else if (perf.title.includes('Copy')) {
        this.$router.push('/copy-trading');
      } else if (perf.title.includes('Agente')) {
        this.$router.push('/agente-autonomo');
      } else if (perf.title.includes('Sinais') || perf.title.includes('Manual')) {
        this.$router.push('/operation');
      }
    },
    getCurrencyPrefix(currency, isDemo = false) {
      // Se for demo, retornar vazio (o D será renderizado via CSS)
      if (isDemo) {
        return '';
      }
      // Para real, retornar símbolo padrão da moeda
      switch ((currency || '').toUpperCase()) {
        case 'USD':
          return '$';
        case 'EUR':
          return '€';
        case 'BTC':
          return '₿';
        default:
          return currency ? `${currency} ` : '$';
      }
    },
    getCurrencyIcon(currency, accountType) {
      // Retorna o ícone da moeda baseado no tipo de conta
      const isDemo = accountType === 'demo';
      const curr = (currency || 'USD').toUpperCase();
      
      // Para demo, não mostrar ícone
      if (isDemo) {
        return null;
      }
      
      // Para real, retornar ícone baseado na moeda
      if (curr === 'USD') {
        // Bandeira dos EUA - usando SVG inline
        return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='15' viewBox='0 0 20 15'%3E%3Crect width='20' height='15' fill='%23BD0023'/%3E%3Cpath d='M0 3h20M0 6h20M0 9h20M0 12h20' stroke='%23fff' stroke-width='2'/%3E%3Crect width='8' height='8' fill='%2300007F'/%3E%3C/svg%3E";
      } else if (curr === 'USDT') {
        // Logo do USDT (Tether) - usando SVG inline
        return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Ccircle cx='10' cy='10' r='10' fill='%2326A378'/%3E%3Ctext x='10' y='15' font-size='12' font-weight='bold' fill='white' text-anchor='middle'%3ET%3C/text%3E%3C/svg%3E";
      }
      
      return null;
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
      // Redirecionamento para a Academy - Aula 2
      this.$router.push({ 
        name: 'CourseDetail', 
        params: { id: '25054bef-4f7c-4388-b22a-f01374671da3' },
        query: { lesson: '2' }
      });
    },
    toggleBalanceVisibility() {
      this.balanceVisible = !this.balanceVisible;
      localStorage.setItem('balanceVisible', this.balanceVisible.toString());
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
/* Animations moved to animations.css */
@import '../assets/css/animations.css';

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

/* Float Card Animations removed - moved to animations.css */

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

/* Grid/Header/Ticker Animations removed - moved to animations.css */

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
/* Remaining animations removed - moved to animations.css */

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
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  .dashboard-layout #ticker-section .absolute {
    background: transparent !important;
  }
  
  /* Hero Section - padding de 3rem no desktop */
  .dashboard-layout #hero-section {
    padding: 3rem !important;
  }
  
  /* Best IAs Section */
  .dashboard-layout #best-ai-section {
    background-color: #020302;
    background-image: url('@/assets/background/bestia.svg');
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    padding-left: 0 !important;
    padding-right: 0 !important;
    padding-bottom: 20px !important;
    box-shadow: inset 0 0 0 9999px rgba(0, 0, 0, 0.7);
  }
  .dashboard-layout #best-ai-section .absolute.inset-0 {
    background: transparent !important;
  }
  
  /* Padding de 2rem no container interno da seção de Melhores IAs */
  .dashboard-layout #best-ai-section > .relative.z-10,
  .dashboard-layout #best-ai-section .relative.z-10.w-full,
  .dashboard-layout #best-ai-section .relative.z-10 {
    padding: 2.8rem 2rem!important;
  }
  
  /* Padding de 2rem no container interno da seção de Desempenho Geral */
  .dashboard-layout #performance-section > .relative.z-10,
  .dashboard-layout #performance-section .relative.z-10.w-full,
  .dashboard-layout #performance-section .relative.z-10 {
    padding: 0rem 2rem !important;
  }
  
  /* Performance Section */
  .dashboard-layout #performance-section {
    background-color: #040504;
    background-image: url('@/assets/background/performance.svg');
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    padding-left: 0 !important;
    padding-right: 0 !important;
    padding-top: 0 !important;
    box-shadow: inset 0 0 0 9999px rgba(0, 0, 0, 0.7);
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
  /* Padding de 1rem no dashboard layout mobile */
  .dashboard-layout {
    padding: 1rem !important;
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
    padding: 1rem !important;
    padding-bottom: 90px !important;
  }
  
  /* Hero Section - padding de 1rem no mobile */
  #hero-section {
    padding: 1rem !important;
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
    background: none !important;
    background-color: transparent !important;
    background-image: none !important;
    animation: fadeInUp 0.9s ease-out 0.3s backwards;
  }
  
  #best-ai-section .relative.z-10 {
    padding: 2rem !important;
  }

  #performance-section {
    padding-left: 0 !important;
    padding-right: 0 !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    background: none !important;
    background-color: transparent !important;
    background-image: none !important;
    animation: fadeInUp 1s ease-out 0.4s backwards;
  }

  #performance-section .relative.z-10 {
    padding: 2rem !important;
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

  .see-all-link-mobile {
    color: #22C55E !important;
    font-size: 12px !important;
    font-weight: 500 !important;
    text-decoration: none !important;
    cursor: pointer;
    transition: opacity 0.3s;
  }

  .see-all-link-mobile:hover {
    opacity: 0.8;
  }

  .see-all-link-mobile:active {
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
    padding-left: 2rem !important;
    padding-right: 2rem !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
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

  .desktop-grid-ias {
    display: grid !important;
    grid-template-columns: repeat(5, 1fr) !important;
    gap: 24px !important;
  }

  .desktop-performance-grid {
    display: grid !important;
    grid-template-columns: repeat(4, 1fr) !important;
    gap: 24px !important;
  }

  .see-all-link-desktop {
    color: #22C55E !important;
    font-size: 16px !important;
    font-weight: 500 !important;
    text-decoration: none !important;
    cursor: pointer;
    transition: opacity 0.3s;
  }

  .see-all-link-desktop:hover {
    opacity: 0.8;
  }

  .see-all-link-desktop:active {
    opacity: 0.7;
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

  /* Remover padding lateral da imagem nos cards de IA */
  .desktop-grid-ias [id^="ai-card-"] > div.h-\[182px\] {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  
  .desktop-grid-ias [id^="ai-card-"] > div.h-\[182px\] > img {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  /* Remover box-shadow dos cards de Melhores IAs e Desempenho Geral apenas no desktop */
  .desktop-no-shadow {
    box-shadow: none !important;
  }
  
  .desktop-no-shadow:hover {
    box-shadow: none !important;
  }
  
  /* Aplicar mesma borda dos cards de IA nos cards de desempenho geral */
  .desktop-performance-card-border {
    border: none !important;
    border-radius: 20px !important;
  }
  
  /* Borda nos cards de IAs e Performance no desktop */
  .desktop-grid-ias [id^="ai-card-"],
  .desktop-performance-grid [id^="performance-card-"] {
    border: 1px solid rgba(34, 197, 94, 0.08) !important;
  }
  
  /* Textos verdes apenas no desktop */
  .desktop-performance-title .desktop-green-text,
  .desktop-performance-description .desktop-green-text {
    color: #22C55E !important;
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

/* Settings Modal Styles - Premium Glassmorphism */
.settings-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 9999;
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
  padding: 0;
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.settings-modal-content {
  background: rgba(11, 11, 11, 0.82);
  width: 100%;
  max-width: 400px;
  min-width: 320px;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: -20px 0 60px rgba(0, 0, 0, 0.5);
  animation: slideInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.settings-modal-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 150px;
  background: radial-gradient(circle at top right, rgba(34, 197, 94, 0.12), transparent 70%);
  pointer-events: none;
}

.settings-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 24px 20px;
  background: transparent;
  position: relative;
  z-index: 2;
}

.settings-modal-title {
  font-size: 26px;
  font-weight: 800;
  color: #fff;
  margin: 0;
  letter-spacing: -0.02em;
}

.settings-modal-close {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.settings-modal-close:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: rotate(90deg);
}

.settings-modal-body {
  padding: 0 24px 30px;
  overflow-y: auto;
  flex: 1;
  position: relative;
  z-index: 2;
}

.settings-user-info-container {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.settings-user-name {
  color: #FFFFFF;
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}

.settings-user-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(34, 197, 94, 0.12);
  border: 1px solid rgba(34, 197, 94, 0.2);
  padding: 3px 10px;
  border-radius: 100px;
  color: #22C55E;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  width: fit-content;
}

.settings-modal-section .glass-card {
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
}

.settings-balance-label {
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
  font-weight: 500;
}

.settings-balance-amount {
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.01em;
  margin: 4px 0 16px;
}

.settings-account-btn {
  flex: 1;
  padding: 12px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
}

.settings-account-btn-active {
  background: #22C55E;
  color: #FFFFFF;
  box-shadow: 0 8px 20px rgba(34, 197, 94, 0.3);
}

.settings-account-btn-inactive {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.6);
  border-color: rgba(255, 255, 255, 0.05);
}

.settings-account-btn-inactive:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.settings-deposit-btn {
  width: 100%;
  background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%);
  border: none;
  border-radius: 16px;
  padding: 18px;
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 25px rgba(34, 197, 94, 0.35);
}

.settings-deposit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px rgba(34, 197, 94, 0.45);
  filter: brightness(1.1);
}

.settings-modal-section-with-border {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 24px;
}

.account-item {
  border: 1px solid transparent;
  margin-bottom: 4px;
}

.account-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.05);
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
  height: 100vh;
}

.notifications-modal-content {
  background: #0B0B0B;
  border-radius: 0;
  width: 100%;
  max-width: 400px;
  min-width: 320px;
  height: 100vh;
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
  text-align: left !important;
  justify-content: flex-start !important;
}

.notification-title {
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  line-height: 1.3;
  text-align: left !important;
}

.notification-message {
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  margin: 0;
  line-height: 1.4;
  text-align: left !important;
}

.notification-time {
  color: rgba(255, 255, 255, 0.4);
  font-size: 11px;
  margin-top: 4px;
  text-align: left !important;
}

.notifications-modal-footer {
  padding: 16px 24px;
  border-top: none;
  display: flex;
  justify-content: flex-end;
  background: #0B0B0B;
  flex-shrink: 0;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .settings-modal-content,
  .notifications-modal-content {
    max-width: 90%;
  }
}

/* Símbolo D estilizado para Demo no Mobile */
.demo-currency-symbol-mobile-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
  width: 16px;
  height: 16px;
}

.demo-currency-symbol-mobile-icon {
  width: 16px;
  height: 16px;
  filter: blur(0.5px);
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
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

.animate-icon-pulse {
  animation: iconPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes iconPulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.2);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
    box-shadow: 0 0 40px rgba(34, 197, 94, 0.4);
  }
}

</style>
