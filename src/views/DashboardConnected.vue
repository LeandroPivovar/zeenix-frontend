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
      <section id="hero-section" class="w-full mt-16 py-8 pb-4 relative overflow-hidden group h-[560px]">
      <div class="absolute inset-0 z-0 bg-[#0B0B0B]">
        <div class="absolute inset-0 bg-gradient-to-br from-[#0B0B0B] via-[#0d1410] to-[#0B0B0B]">
        </div>
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(34,197,94,0.15)_0%,transparent_50%)]">
        </div>
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_85%_30%,rgba(34,197,94,0.12)_0%,transparent_40%)]">
        </div>
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_90%_70%,rgba(34,197,94,0.10)_0%,transparent_35%)]">
        </div>
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(34,197,94,0.08)_0%,transparent_40%)]">
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" id="ik0zc" class="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" id="iatpj">
                <animate attributeName="stop-color" values="rgba(34,197,94,0.3);rgba(34,197,94,0.5);rgba(34,197,94,0.3)" dur="26.67s" repeatCount="indefinite"></animate>
              </stop>
              <stop offset="100%" id="ir5ig"></stop>
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur">
              </feGaussianBlur>
              <feMerge>
                <feMergeNode in="coloredBlur"></feMergeNode>
                <feMergeNode in="SourceGraphic"></feMergeNode>
              </feMerge>
            </filter>
          </defs>
          <circle cx="85%" cy="15%" r="2" fill="rgba(34,197,94,0.8)" filter="url(#glow)">
            <animate attributeName="cy" values="15%;18%;15%" dur="20s" repeatCount="indefinite"></animate>
            <animate attributeName="opacity" values="0.8;1;0.8" dur="20s" repeatCount="indefinite"></animate>
          </circle>
          <circle cx="90%" cy="40%" r="3" fill="rgba(34,197,94,0.9)" filter="url(#glow)">
            <animate attributeName="cy" values="40%;37%;40%" dur="26.67s" repeatCount="indefinite"></animate>
            <animate attributeName="r" values="3;4;3" dur="26.67s" repeatCount="indefinite"></animate>
          </circle>
          <circle cx="80%" cy="65%" r="2.5" fill="rgba(34,197,94,0.7)" filter="url(#glow)">
            <animate attributeName="cy" values="65%;68%;65%" dur="33.33s" repeatCount="indefinite"></animate>
          </circle>
          <circle cx="88%" cy="25%" r="1.5" fill="rgba(34,197,94,0.6)" filter="url(#glow)">
            <animate attributeName="cx" values="88%;90%;88%" dur="40s" repeatCount="indefinite"></animate>
            <animate attributeName="cy" values="25%;28%;25%" dur="40s" repeatCount="indefinite"></animate>
          </circle>
          <circle cx="82%" cy="50%" r="2" fill="rgba(34,197,94,0.85)" filter="url(#glow)">
            <animate attributeName="cy" values="50%;53%;50%" dur="30s" repeatCount="indefinite"></animate>
          </circle>
          <circle cx="15%" cy="20%" r="2.5" fill="rgba(34,197,94,0.75)" filter="url(#glow)">
            <animate attributeName="cy" values="20%;23%;20%" dur="26.67s" repeatCount="indefinite"></animate>
          </circle>
          <circle cx="25%" cy="60%" r="2" fill="rgba(34,197,94,0.8)" filter="url(#glow)">
            <animate attributeName="cy" values="60%;57%;60%" dur="33.33s" repeatCount="indefinite"></animate>
          </circle>
          <line x1="70%" y1="30%" x2="95%" y2="30%" stroke="rgba(34,197,94,0.3)" stroke-width="1">
            <animate attributeName="x2" values="95%;100%;95%" dur="20s" repeatCount="indefinite"></animate>
            <animate attributeName="opacity" values="0.3;0.6;0.3" dur="20s" repeatCount="indefinite"></animate>
          </line>
          <line x1="75%" y1="55%" x2="100%" y2="55%" stroke="rgba(34,197,94,0.25)" stroke-width="1">
            <animate attributeName="x2" values="100%;95%;100%" dur="26.67s" repeatCount="indefinite"></animate>
            <animate attributeName="opacity" values="0.25;0.5;0.25" dur="26.67s" repeatCount="indefinite"></animate>
          </line>
          <line x1="5%" y1="40%" x2="30%" y2="40%" stroke="rgba(34,197,94,0.3)" stroke-width="1">
            <animate attributeName="x2" values="30%;35%;30%" dur="23.33s" repeatCount="indefinite"></animate>
            <animate attributeName="opacity" values="0.3;0.6;0.3" dur="23.33s" repeatCount="indefinite"></animate>
          </line>
          <polygon points="85,80 95,100 75,100" fill="none" stroke="rgba(34,197,94,0.4)" stroke-width="1.5" transform="translate(900, 100)">
            <animateTransform attributeName="transform" type="rotate" values="0 950 150;10 950 150;0 950 150" dur="40s" repeatCount="indefinite"></animateTransform>
            <animate attributeName="opacity" values="0.4;0.7;0.4" dur="40s" repeatCount="indefinite"></animate>
          </polygon>
          <path d="M 1100 200 Q 1150 220 1200 200 T 1300 200" fill="none" stroke="rgba(34,197,94,0.35)" stroke-width="2">
            <animate attributeName="d" values="M 1100 200 Q 1150 220 1200 200 T 1300 200;M 1100 200 Q 1150 180 1200 200 T 1300 200;M 1100 200 Q 1150 220 1200 200 T 1300 200" dur="33.33s" repeatCount="indefinite"></animate>
          </path>
          <rect x="75%" y="10%" width="80" height="80" fill="none" stroke="rgba(34,197,94,0.2)" stroke-width="1" rx="5">
            <animate attributeName="opacity" values="0.2;0.5;0.2" dur="26.67s" repeatCount="indefinite"></animate>
            <animateTransform attributeName="transform" type="rotate" values="0 1100 100;5 1100 100;0 1100 100" dur="53.33s" repeatCount="indefinite"></animateTransform>
          </rect>
          <circle cx="92%" cy="35%" r="50" fill="none" stroke="rgba(34,197,94,0.15)" stroke-width="1.5">
            <animate attributeName="r" values="50;60;50" dur="33.33s" repeatCount="indefinite"></animate>
            <animate attributeName="opacity" values="0.15;0.3;0.15" dur="33.33s" repeatCount="indefinite"></animate>
          </circle>
          <circle cx="92%" cy="35%" r="50" fill="none" stroke="rgba(34,197,94,0.1)" stroke-width="1.5">
            <animate attributeName="r" values="60;70;60" dur="33.33s" repeatCount="indefinite" begin="1.67s"></animate>
            <animate attributeName="opacity" values="0.1;0.2;0.1" dur="33.33s" repeatCount="indefinite" begin="1.67s"></animate>
          </circle>
          <g transform="translate(1150, 250)">
            <polygon points="0,-20 17.32,-10 17.32,10 0,20 -17.32,10 -17.32,-10" fill="none" stroke="rgba(34,197,94,0.35)" stroke-width="1.5">
              <animateTransform attributeName="transform" type="rotate" values="0;360" dur="80s" repeatCount="indefinite" additive="sum"></animateTransform>
            </polygon>
          </g>
          <g transform="translate(1100, 400)">
            <polygon points="0,-15 12.99,-7.5 12.99,7.5 0,15 -12.99,7.5 -12.99,-7.5" fill="none" stroke="rgba(34,197,94,0.3)" stroke-width="1.5">
              <animateTransform attributeName="transform" type="rotate" values="360;0" dur="66.67s" repeatCount="indefinite" additive="sum"></animateTransform>
            </polygon>
          </g>
          <g transform="translate(150, 180)">
            <polygon points="0,-18 15.59,-9 15.59,9 0,18 -15.59,9 -15.59,-9" fill="none" stroke="rgba(34,197,94,0.35)" stroke-width="1.5">
              <animateTransform attributeName="transform" type="rotate" values="0;360" dur="93.33s" repeatCount="indefinite" additive="sum"></animateTransform>
            </polygon>
          </g>
        </svg>
      </div>
      <div class="absolute inset-0 z-[1] pointer-events-none">
        <div id="i99s1i" class="grid-pattern"></div>
        <div id="ixr7uj">
          BTC
          <div id="ianwqb">$67,234</div>
        </div>
        <div id="ivafvh">
          ETH
          <div id="i6bn58">$3,421</div>
        </div>
        <div id="im44s3">
          USD
          <div id="ijm3gj">$1.00</div>
        </div>
        <div id="ibz4um">
          ₿
        </div>
        <div id="ic8zog">
          $
        </div>
        <div id="ixwg04">
          SOL
          <div id="ijp6v7">$142.87</div>
        </div>
        <div id="ih4yn4">
          EUR
          <div id="iyevqf">€0.92</div>
        </div>
        <div id="ioxiss">
          Ξ
        </div>
      </div>
      <div class="relative z-10 px-8">
        <div id="hero-header" class="mb-10">
          <h1 id="ixl21c" class="text-3xl font-semibold mb-2 text-white/90">
            Bem-vindo ao
            Zenix, <span id="itixvs">{{ userName }}</span></h1>
          <p class="text-white/60">Configure sua conta rapidamente em 3 passos
            e deixe a IA trabalhar por você.</p>
        </div>
        <div class="flex items-start relative">
              <!-- Card 1/3: Depositar -->
              <div id="hero-card-1" class="rounded-[18px] p-8 h-56 w-80 flex flex-col justify-between transform scale-[0.88] transition-all duration-300 ease-out relative hover:scale-[0.91] z-[3] bg-[rgba(20,20,20,0.35)] border border-[rgba(34,197,94,0.25)] backdrop-blur-[18px] shadow-[0_0_20px_rgba(34,197,94,0.18),inset_0_1px_1px_rgba(255,255,255,0.05)]">
                <div>
                  <h3 class="font-semibold mb-2 text-[rgba(255,255,255,0.92)]">
                    Deposite para começar</h3>
                  <p class="text-sm text-[rgba(255,255,255,0.70)]">Para melhores
                    resultados indicamos um depósito acima de 100 dólares.</p>
                </div>
                <button @click="$router.push('/settings?tab=deposit')" class="bg-[#22C55E] hover:bg-[#16A34A] text-white py-2 px-4 rounded-[12px] h-[46px] w-full font-medium transition-all shadow-[0_0_18px_rgba(34,197,94,0.35)] hover:shadow-[0_0_22px_rgba(34,197,94,0.45)]">
                  Depositar agora
                </button>
              </div>
              <!-- Card 2/3: Configurar IA -->
              <div id="hero-card-2" class="rounded-[18px] p-8 h-56 w-80 flex flex-col justify-between transform scale-[0.88] -ml-6 transition-all duration-300 ease-out relative hover:scale-[0.90] z-[2] bg-[rgba(20,20,20,0.35)] border border-[rgba(255,255,255,0.12)] backdrop-blur-[18px] shadow-[0_0_20px_rgba(34,197,94,0.08),inset_0_1px_1px_rgba(255,255,255,0.05)]">
                <div>
                  <h3 class="font-medium mb-2 text-[rgba(255,255,255,0.55)]">
                    Configure uma IA ou Copy Trading</h3>
                  <p class="text-sm text-[rgba(255,255,255,0.40)]">Escolha e ative
                    sua estratégia automática.</p>
                </div>
                <button @click="$router.push('/InvestmentIA')" class="bg-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.15)] text-[rgba(255,255,255,0.40)] py-2 px-4 rounded-[10px] h-[42px] w-full font-medium transition-all border border-[rgba(255,255,255,0.12)]">
                  Ativar IA agora
                </button>
              </div>
              <!-- Card 3/3: Resultados -->
              <div id="hero-card-3" class="rounded-[18px] p-8 h-56 w-80 flex flex-col justify-between transform scale-[0.88] -ml-6 transition-all duration-300 ease-out relative hover:scale-[0.90] z-[1] bg-[rgba(20,20,20,0.35)] border border-[rgba(255,255,255,0.08)] backdrop-blur-[18px] shadow-[0_0_20px_rgba(34,197,94,0.08),inset_0_1px_1px_rgba(255,255,255,0.05)]">
                <div>
                  <h3 class="font-medium mb-2 text-[rgba(255,255,255,0.55)]">
                    Acompanhe seus resultados</h3>
                  <p class="text-sm text-[rgba(255,255,255,0.40)]">Veja lucros,
                    consistência e operações em tempo real com total
                    transparência.</p>
                </div>
                <button @click="scrollToPerformance" class="bg-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.15)] text-[rgba(255,255,255,0.40)] py-2 px-4 rounded-[10px] h-[42px] w-full font-medium transition-all border border-[rgba(255,255,255,0.12)]">
                  Ver resultados
                </button>
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
  margin-left: 280px;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
  width: calc(100% - 280px);
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
  left: 280px;
  z-index: 40;
  background-color: #0E0E0E;
  border-bottom: 1px solid #1C1C1C;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  transition: left 0.3s ease;
  width: calc(100% - 280px);
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
    transform: translateY(0px) scale(0.88);
  }
  50% {
    transform: translateY(-8px) scale(0.88);
  }
}

@keyframes float-card-2 {
  0%,
  100% {
    transform: translateY(0px) scale(0.88);
  }
  50% {
    transform: translateY(-10px) scale(0.88);
  }
}

@keyframes float-card-3 {
  0%,
  100% {
    transform: translateY(0px) scale(0.88);
  }
  50% {
    transform: translateY(-12px) scale(0.88);
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
  font-size: 34px;
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

</style>

