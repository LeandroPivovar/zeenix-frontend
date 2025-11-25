<template>
  <div class="dashboard-content-wrapper" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    <!-- Top Navbar -->
    <TopNavbar 
      :is-sidebar-collapsed="isSidebarCollapsed"
      :balance="info?.balance"
      :account-type="accountType"
      :balances-by-currency-real="balancesByCurrencyReal"
      :balances-by-currency-demo="balancesByCurrencyDemo"
      :currency-prefix="preferredCurrencyPrefix"
    />
    
    <!-- Main Content -->
    <main class="main-content bg-zenix-bg noise-bg font-inter overflow-y-auto w-full">
    <!-- Hero Onboarding Section -->
    <section id="integrated-hero-onboarding" class="w-full">
      <div class="relative w-full h-[620px] overflow-hidden">
        <div class="absolute inset-0">
          <div class="absolute inset-0 w-full h-full">
            <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/115dc9dc6f-4ab7d1a1c6f815b2fef3.png" alt="futuristic technology neural network glowing green circuits" class="absolute right-0 top-0 h-full w-full object-cover object-right">
          </div>
          <div class="absolute inset-0 bg-gradient-to-r from-[#000000] via-[#000000]/95 via-30% via-[#000000]/85 via-45% via-[#000000]/70 via-55% via-[#000000]/50 via-65% via-[#000000]/30 via-75% via-[#000000]/15 via-85% to-transparent"></div>
          <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(34,197,94,0.08)_0%,rgba(34,197,94,0.04)_30%,transparent_60%)]"></div>
          <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_40%,rgba(34,197,94,0.06)_0%,transparent_50%)]"></div>
          <div class="absolute left-0 top-0 w-[55%] h-full bg-gradient-to-r from-[#000000] via-[#000000]/90 to-transparent"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/85 via-transparent via-50% to-[#0B0B0B]/20"></div>
          <div class="absolute inset-0 bg-gradient-to-b from-[#0B0B0B]/15 via-transparent via-60% to-[#0B0B0B]/70"></div>
        </div>
        <div class="relative h-full flex flex-col justify-center px-16">
          <div class="max-w-2xl mb-12">
            <h1 class="text-[52px] font-bold text-white leading-[1.1] tracking-tight mb-3">
              Bem-vindo ao Zenix, <span class="text-[#22C55E]">{{ userName }}</span>
            </h1>
            <p class="text-[15px] text-[#DFDFDF]/85 leading-relaxed">
              Configure sua conta rapidamente e deixe a IA trabalhar por você.
            </p>
          </div>
          <div class="max-w-[1100px] w-full">
            <div class="grid grid-cols-3 gap-6">
              <!-- Card 1/3: Depositar -->
              <div class="relative bg-gradient-to-br from-[#0A0A0A] via-[#080808] to-[#060606] border border-[#1A1A1A]/40 rounded-[20px] p-6 h-[240px] flex flex-col transition-all duration-300 group overflow-hidden shadow-[0_0_40px_rgba(34,197,94,0.08),0_8px_32px_rgba(0,0,0,0.6)] hover:shadow-[0_0_50px_rgba(34,197,94,0.12),0_10px_38px_rgba(0,0,0,0.7)]">
                <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.06)_0%,transparent_70%)] opacity-40"></div>
                <div class="absolute top-5 left-5 flex items-center space-x-3 z-10">
                  <div class="relative w-[38px] h-[38px] rounded-full bg-[#0E0E0E]/80 border border-[#22C55E]/20 flex items-center justify-center backdrop-blur-sm">
                    <div class="absolute inset-0 rounded-full bg-[#22C55E]/[0.03]"></div>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-[#22C55E]">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 6v6l4 2"></path>
                    </svg>
                  </div>
                  <span class="text-[10px] font-semibold text-[#22C55E]/60 tracking-wide">1/3</span>
                </div>
                <div class="mt-14 flex-1 flex flex-col justify-between relative z-10">
                  <div class="space-y-3">
                    <h3 class="text-[15px] font-semibold text-[#DFDFDF]/90 leading-tight tracking-tight">Depositar para começar</h3>
                    <p class="text-[11.5px] text-[#DFDFDF]/70 leading-[1.6]">Para melhores resultados indicados um deposito acima de $100.</p>
                  </div>
                  <button @click="$router.push('/settings?tab=deposit')" class="w-full bg-[#22C55E] hover:bg-[#16A34A] text-black font-semibold py-2.5 px-5 rounded-[14px] text-[11px] transition-all inline-flex items-center justify-center space-x-2.5 group-hover:shadow-[0_6px_24px_rgba(34,197,94,0.35)] hover:translate-y-[-1px] mt-4 unified-button">
                      <span>Depositar Agora</span>
                    <svg viewBox="0 0 16 16" fill="none" class="w-3 h-3 group-hover:translate-x-1 transition-transform">
                      <path d="M1 8h14m-6-6l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <!-- Card 2/3: Configurar IA -->
              <div class="relative bg-gradient-to-br from-[#0A0A0A] via-[#080808] to-[#060606] border border-[#1A1A1A]/40 rounded-[20px] p-6 h-[240px] flex flex-col transition-all duration-300 group overflow-hidden shadow-[0_0_40px_rgba(34,197,94,0.08),0_8px_32px_rgba(0,0,0,0.6)] hover:shadow-[0_0_50px_rgba(34,197,94,0.12),0_10px_38px_rgba(0,0,0,0.7)]">
                <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.06)_0%,transparent_70%)] opacity-40"></div>
                <div class="absolute top-5 left-5 flex items-center space-x-3 z-10">
                  <div class="relative w-[38px] h-[38px] rounded-full bg-[#0E0E0E]/80 border border-[#22C55E]/20 flex items-center justify-center backdrop-blur-sm">
                    <div class="absolute inset-0 rounded-full bg-[#22C55E]/[0.03]"></div>
                    <i class="fas fa-microchip text-[#22C55E] text-sm"></i>
                  </div>
                  <span class="text-[10px] font-semibold text-[#22C55E]/60 tracking-wide">2/3</span>
                </div>
                <div class="mt-14 flex-1 flex flex-col justify-between relative z-10">
                  <div class="space-y-3">
                    <h3 class="text-[15px] font-semibold text-[#DFDFDF]/90 leading-tight tracking-tight">Configure uma IA ou Copy Trading</h3>
                    <p class="text-[11.5px] text-[#DFDFDF]/70 leading-[1.6]">Escolha e ative sua estratégia automática. A IA opera por você com apenas 1 clique.</p>
                  </div>
                  <button @click="$router.push('/InvestmentIA')" class="w-full bg-[#22C55E] hover:bg-[#16A34A] text-black font-semibold py-2.5 px-5 rounded-[14px] text-[11px] transition-all inline-flex items-center justify-center space-x-2.5 group-hover:shadow-[0_6px_24px_rgba(34,197,94,0.35)] hover:translate-y-[-1px] mt-4 unified-button">
                    <span>Ativar IA Agora</span>
                    <svg viewBox="0 0 16 16" fill="none" class="w-3 h-3 group-hover:translate-x-1 transition-transform">
                      <path d="M1 8h14m-6-6l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <!-- Card 3/3: Resultados -->
              <div class="relative bg-gradient-to-br from-[#0A0A0A] via-[#080808] to-[#060606] border border-[#1A1A1A]/40 rounded-[20px] p-6 h-[240px] flex flex-col transition-all duration-300 group overflow-hidden shadow-[0_0_40px_rgba(34,197,94,0.08),0_8px_32px_rgba(0,0,0,0.6)] hover:shadow-[0_0_50px_rgba(34,197,94,0.12),0_10px_38px_rgba(0,0,0,0.7)]">
                <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.06)_0%,transparent_70%)] opacity-40"></div>
                <div class="absolute top-5 left-5 flex items-center space-x-3 z-10">
                  <div class="relative w-[38px] h-[38px] rounded-full bg-[#0E0E0E]/80 border border-[#22C55E]/20 flex items-center justify-center backdrop-blur-sm">
                    <div class="absolute inset-0 rounded-full bg-[#22C55E]/[0.03]"></div>
                    <i class="fas fa-chart-line text-[#22C55E] text-sm"></i>
                  </div>
                  <span class="text-[10px] font-semibold text-[#22C55E]/60 tracking-wide">3/3</span>
                </div>
                <div class="mt-14 flex-1 flex flex-col justify-between relative z-10">
                  <div class="space-y-3">
                    <h3 class="text-[15px] font-semibold text-[#DFDFDF]/90 leading-tight tracking-tight">Acompanhe seus resultados</h3>
                    <p class="text-[11.5px] text-[#DFDFDF]/70 leading-[1.6]">Veja lucros, consistência e operações em tempo real com total transparência.</p>
                  </div>
                  <button @click="scrollToPerformance" class="w-full bg-[#22C55E] hover:bg-[#16A34A] text-black font-semibold py-2.5 px-5 rounded-[14px] text-[11px] transition-all inline-flex items-center justify-center space-x-2.5 group-hover:shadow-[0_6px_24px_rgba(34,197,94,0.35)] hover:translate-y-[-1px] mt-4 unified-button">
                    <span>Ver Resultados</span>
                    <svg viewBox="0 0 16 16" fill="none" class="w-3 h-3 group-hover:translate-x-1 transition-transform">
                      <path d="M1 8h14m-6-6l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <div class="w-full h-px bg-gradient-to-r from-transparent via-zenix-border to-transparent my-8"></div>
    
    <div class="px-8 py-8">
    <!-- Quick Tools Section -->
    <section id="quick-tools" class="mt-6 mb-6 w-full">
      <h2 class="text-base font-semibold text-zenix-text opacity-95 mb-4">Ferramentas Principais</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        <div 
          v-for="(tool, index) in quickTools" 
          :key="index"
          class="bg-zenix-card border border-zenix-border rounded-xl overflow-hidden premium-card transition-all duration-300 cursor-pointer h-[198px] flex tool-card relative w-full"
          @click="handleToolClick(tool)"
        >
          <div class="w-[40%] relative overflow-hidden flex-shrink-0">
            <img :src="tool.image" :alt="tool.alt" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-r from-transparent to-zenix-card"></div>
          </div>
          <div class="flex-1 p-6 flex flex-col justify-between min-h-0">
            <div class="flex-shrink-0">
              <h3 class="text-sm font-semibold text-zenix-text mb-2">{{ tool.title }}</h3>
              <p class="text-xs text-zenix-secondary leading-relaxed">{{ tool.description }}</p>
            </div>
            <button 
              @click.stop="handleToolClick(tool)"
              class="w-full bg-zenix-green hover:bg-zenix-green-hover text-black font-semibold py-2.5 rounded-lg text-xs transition-all btn-primary-enhanced flex-shrink-0 mt-auto"
            >
              {{ tool.buttonText }}
            </button>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Best IAs Section -->
    <section id="best-ias" class="mb-6 w-full">
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-base font-semibold text-zenix-text">Melhores IA's Agora</h2>
        <span class="text-xs text-zenix-label">Baseado no mercado em tempo real</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 w-full">
        <div 
          v-for="(ia, index) in bestIAs" 
          :key="index"
          class="bg-zenix-card border border-zenix-border rounded-xl overflow-hidden premium-card hover:border-zenix-green transition-all h-[200px] w-full"
        >
          <div class="flex h-full">
            <div class="w-[35%] relative overflow-hidden flex-shrink-0">
              <img :src="ia.image" :alt="ia.name" class="w-full h-full object-cover">
              <div class="absolute inset-0 bg-gradient-to-r from-transparent to-zenix-card"></div>
            </div>
            <div class="flex-1 p-5 flex flex-col justify-between min-w-0">
              <div>
                <h3 class="text-base font-semibold text-zenix-text mb-1 truncate">{{ ia.name }}</h3>
                <span class="text-xs text-zenix-label">{{ ia.category }}</span>
                <div class="flex items-baseline space-x-2 mt-3">
                  <p class="text-2xl font-bold text-zenix-green">{{ ia.consistency }}%</p>
                  <p class="text-xs text-zenix-label">Consistência</p>
                </div>
              </div>
              <div :id="`sparkline-${ia.id}`" class="h-10 mb-3"></div>
              <button 
                @click="activateIA()"
                class="w-full bg-zenix-green hover:bg-zenix-green-hover text-white font-medium py-2 rounded-lg text-xs transition-all"
              >
                Ativar IA
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Overall Performance Section -->
    <section id="overall-performance" class="mt-6 mb-12 w-full">
      <div class="bg-zenix-card border border-zenix-border rounded-xl p-10 premium-card w-full">
        <h2 class="text-base font-semibold text-zenix-text mb-2">Desempenho Geral</h2>
        <p class="text-sm text-[#AFAFAF] mb-10 text-left">Você está deixando dinheiro na mesa. Ative todos os recursos para maximizar seus resultados.</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 w-full">
          <div 
            v-for="(perf, index) in performanceData" 
            :key="index"
            class="flex flex-col space-y-5 bg-zenix-bg border border-[#1C1C1C] rounded-xl p-7 performance-card hover:border-zenix-green transition-all w-full"
          >
            <div class="flex items-center justify-between">
              <div class="w-11 h-11 bg-zenix-card rounded-lg flex items-center justify-center border border-zenix-green/20 icon-perf-container">
                <i :class="[perf.icon, 'text-zenix-green text-lg icon-perf']"></i>
              </div>
            </div>
            <h3 class="text-sm font-semibold text-zenix-text opacity-95">{{ perf.title }}</h3>
            <div class="h-8 relative overflow-hidden">
              <svg viewBox="0 0 100 30" preserveAspectRatio="none" class="w-full h-full">
                <path :d="perf.chartPath" fill="none" stroke="rgba(34,197,94,0.6)" stroke-width="1.5" class="perf-line"></path>
              </svg>
            </div>
            <div class="flex items-baseline space-x-2">
              <span class="text-3xl font-bold text-zenix-green perf-number">{{ perf.percentage }}</span>
              <span class="text-xs text-zenix-label">esta semana</span>
            </div>
            <p class="text-xs text-[#AFAFAF] perf-usage">
              Você usou <span class="font-semibold text-zenix-text">{{ perf.usage }}%</span> do potencial
            </p>
            <div class="w-full bg-[#1C1C1C] rounded-full h-2 overflow-hidden">
              <div class="bg-zenix-green h-2 rounded-full perf-bar" :style="{ width: perf.usage + '%' }"></div>
            </div>
            <button 
              @click="handlePerformanceAction(perf)"
              class="w-full bg-zenix-green hover:bg-zenix-green-hover text-black font-semibold py-2.5 rounded-lg text-xs transition-all btn-primary mt-2"
            >
              {{ perf.buttonText }}
            </button>
          </div>
        </div>
      </div>
    </section>
    </div>
    </main>
    
    <!-- Footer -->
    <footer id="footer" class="bg-zenix-bg border-t border-zenix-border mt-12 w-full">
      <div class="max-w-7xl mx-auto px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
          <div>
            <div class="flex items-center space-x-2 mb-4">
              <div class="text-lg font-semibold text-zenix-text">ZENIX</div>
              <div class="text-xs text-zenix-label">PRO</div>
            </div>
            <p class="text-zenix-label text-xs leading-relaxed mb-6 opacity-60">
              Plataforma inteligente de investimentos com IA, copy trading e automação.
            </p>
            <div class="flex items-center space-x-4">
              <a href="#" class="text-zenix-label hover:text-zenix-text transition-colors opacity-50">
                <i class="fa-brands fa-twitter text-sm"></i>
              </a>
              <a href="#" class="text-zenix-label hover:text-zenix-text transition-colors opacity-50">
                <i class="fa-brands fa-linkedin text-sm"></i>
              </a>
              <a href="#" class="text-zenix-label hover:text-zenix-text transition-colors opacity-50">
                <i class="fa-brands fa-instagram text-sm"></i>
              </a>
              <a href="#" class="text-zenix-label hover:text-zenix-text transition-colors opacity-50">
                <i class="fa-brands fa-youtube text-sm"></i>
              </a>
            </div>
          </div>
          <div>
            <h3 class="text-zenix-text font-medium mb-4 text-xs">Produto</h3>
            <ul class="space-y-2.5 text-xs text-zenix-label opacity-60">
              <li><a href="#" class="hover:text-zenix-text transition-colors">IA de Investimento</a></li>
              <li><a href="#" class="hover:text-zenix-text transition-colors">Copy Trading</a></li>
              <li><a href="#" class="hover:text-zenix-text transition-colors">Agente Autônomo</a></li>
              <li><a href="#" class="hover:text-zenix-text transition-colors">Zenix Academy</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-zenix-text font-medium mb-4 text-xs">Empresa</h3>
            <ul class="space-y-2.5 text-xs text-zenix-label opacity-60">
              <li><a href="#" class="hover:text-zenix-text transition-colors">Sobre Nós</a></li>
              <li><a href="#" class="hover:text-zenix-text transition-colors">Planos</a></li>
              <li><a href="#" class="hover:text-zenix-text transition-colors">Blog</a></li>
              <li><a href="#" class="hover:text-zenix-text transition-colors">Carreiras</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-zenix-text font-medium mb-4 text-xs">Suporte</h3>
            <ul class="space-y-2.5 text-xs text-zenix-label opacity-60">
              <li><a href="#" class="hover:text-zenix-text transition-colors">Central de Ajuda</a></li>
              <li><a href="#" class="hover:text-zenix-text transition-colors">Documentação</a></li>
              <li><a href="#" class="hover:text-zenix-text transition-colors">Status do Sistema</a></li>
              <li><a href="#" class="hover:text-zenix-text transition-colors">Contato</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-zenix-border pt-8 opacity-40">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <p class="text-zenix-label text-xs mb-3 md:mb-0">© 2025 Zenix Pro. Todos os direitos reservados.</p>
            <div class="flex space-x-6 text-xs">
              <a href="#" class="text-zenix-label hover:text-zenix-text transition-colors">Política de Privacidade</a>
              <span class="text-zenix-border">|</span>
              <a href="#" class="text-zenix-label hover:text-zenix-text transition-colors">Termos de Uso</a>
              <span class="text-zenix-border">|</span>
              <a href="#" class="text-zenix-label hover:text-zenix-text transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import TopNavbar from '../components/TopNavbar.vue'

export default {
  name: 'DashboardConnected',
  components: {
    TopNavbar
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
      accountType: 'real',
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
          name: 'Orion',
          category: 'Alta performance',
          consistency: 82,
          image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/9ce74d6fb3-62541b7b8a479386c6ef.png',
          sparklineData: [45, 52, 48, 58, 55, 62, 58, 65, 62, 68]
        },
        {
          id: 'vega',
          name: 'Vega',
          category: 'Risco moderado',
          consistency: 76,
          image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/e59cfdfd69-a362376d603368410fde.png',
          sparklineData: [40, 45, 42, 48, 50, 47, 52, 55, 53, 58]
        },
        {
          id: 'pulse',
          name: 'Pulse',
          category: 'Alta velocidade',
          consistency: 91,
          image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/55bc31f629-45ed3611bcfc1eed8b5a.png',
          sparklineData: [50, 58, 55, 65, 62, 70, 68, 75, 72, 80]
        }
      ],
      performanceData: [
        {
          icon: 'fas fa-brain',
          title: "IA's de Investimento",
          percentage: '+12.4%',
          usage: 32,
          buttonText: 'Ativar agora',
          chartPath: 'M0,20 L20,15 L40,18 L60,12 L80,14 L100,8'
        },
        {
          icon: 'fas fa-clone',
          title: 'Copy Trading',
          percentage: '+8.7%',
          usage: 0,
          buttonText: 'Ativar agora',
          chartPath: 'M0,22 L20,18 L40,20 L60,16 L80,17 L100,13'
        },
        {
          icon: 'fas fa-robot',
          title: 'Agente Autônomo',
          percentage: '+15.2%',
          usage: 0,
          buttonText: 'Ativar agora',
          chartPath: 'M0,18 L20,14 L40,16 L60,10 L80,12 L100,6'
        },
        {
          icon: 'fas fa-wave-square',
          title: 'Operações com Sinais',
          percentage: '+10.9%',
          usage: 58,
          buttonText: 'Operar agora',
          chartPath: 'M0,19 L20,16 L40,17 L60,13 L80,14 L100,10'
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
      loadingTodayProfit: true
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
  async mounted() {
    this.initSparklines();
    await this.loadTodayProfitLoss();
  },
  methods: {
    switchAccount(type) {
      this.accountType = type;
    },
    handleToolClick(tool) {
      if (tool.route) {
        this.$router.push(tool.route);
      }
    },
    activateIA() {
      // Navega para a página de IAs
      this.$router.push('/InvestmentIA');
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
          return '$'
        case 'EUR':
          return '€'
        case 'BTC':
          return '₿'
        case 'DEMO':
          return 'D$'
        default:
          return currency ? `${currency} ` : ''
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
.dashboard-content-wrapper {
  margin-left: 350px;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
  width: calc(100% - 350px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.dashboard-content-wrapper.sidebar-collapsed {
  margin-left: 72px;
  width: calc(100% - 72px);
}

@media (max-width: 1024px) {
  .dashboard-content-wrapper {
    margin-left: 0;
    width: 100%;
  }
  
  .dashboard-content-wrapper.sidebar-collapsed {
    margin-left: 0;
    width: 100%;
  }
}

/* Top Header - Mesmo padrão da tela de IA */
.top-header {
  position: fixed;
  top: 0;
  right: 0;
  left: 350px;
  z-index: 40;
  background-color: #0E0E0E;
  border-bottom: 1px solid #1C1C1C;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  transition: left 0.3s ease;
  width: calc(100% - 350px);
  box-sizing: border-box;
}

.dashboard-content-wrapper.sidebar-collapsed .top-header {
  left: 72px;
  width: calc(100% - 72px);
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

</style>
