<template>
  <div class="flex flex-col h-full">
    <!-- Header -->
    <header class="bg-zenix-card border-b border-zenix-border px-4 lg:px-6 xl:px-8 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div class="flex items-center gap-4">
        <button class="lg:hidden hamburger-menu" @click="$emit('toggle-sidebar')">
          <span class="line"></span>
          <span class="line"></span>
          <span class="line"></span>
        </button>
        <h1 class="text-lg font-semibold text-zenix-text">Zenix</h1>
      </div>
      
      <div class="flex items-center gap-4">
        <!-- Status da Conexão Deriv -->
        <div class="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#0A0A0A] border border-zenix-border rounded-lg">
          <div class="w-2 h-2 bg-zenix-green rounded-full animate-pulse"></div>
          <span class="text-xs text-zenix-secondary">Deriv Conectado</span>
        </div>
        
        <!-- Notificações -->
        <button class="relative p-2 hover:bg-zenix-bg rounded-lg transition-colors">
          <i class="fas fa-bell text-zenix-secondary text-lg"></i>
          <span class="absolute top-1 right-1 w-2 h-2 bg-zenix-green rounded-full"></span>
        </button>
        
        <!-- Menu do Usuário -->
        <div class="flex items-center gap-2 px-3 py-1.5 bg-[#0A0A0A] border border-zenix-border rounded-lg cursor-pointer hover:bg-[#0D0D0D] transition-colors">
          <div class="w-8 h-8 bg-zenix-green rounded-full flex items-center justify-center text-black font-semibold text-sm">
            {{ userInitials }}
          </div>
          <span class="hidden md:block text-sm text-zenix-text font-medium">{{ userName }}</span>
          <i class="fas fa-chevron-down text-zenix-secondary text-xs"></i>
        </div>
      </div>
    </header>
    
    <!-- Main Content -->
    <main class="flex-1 px-4 lg:px-6 xl:px-8 py-8 bg-zenix-bg noise-bg font-inter overflow-y-auto">
    <!-- Ultra Pro Balance Card -->
    <div class="grid grid-cols-1 gap-6 mb-8">
      <div id="ultra-pro-balance-card" class="relative bg-zenix-card border border-zenix-border rounded-[20px] p-6 premium-card-enhanced overflow-hidden min-h-[126px]">
        <!-- Ultra Pro Abstract Background -->
        <div class="absolute inset-0 pointer-events-none overflow-hidden">
          <!-- Base gradient -->
          <div class="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#0D0D0D] to-[#080808]"></div>
          
          <!-- Animated Abstract Shapes -->
          <div class="absolute inset-0">
            <!-- Floating orbs -->
            <div class="absolute top-[20%] right-[15%] w-32 h-32 rounded-full blur-2xl animate-float-slow" style="background: radial-gradient(circle, rgba(34, 197, 94, 0.2), transparent);"></div>
            <div class="absolute top-[60%] right-[45%] w-24 h-24 rounded-full blur-xl animate-float-medium" style="background: radial-gradient(circle, rgba(34, 197, 94, 0.15), transparent);"></div>
            <div class="absolute top-[40%] right-[70%] w-20 h-20 rounded-full blur-lg animate-float-fast" style="background: radial-gradient(circle, rgba(34, 197, 94, 0.1), transparent);"></div>
            
            <!-- Geometric lines -->
            <svg xmlns="http://www.w3.org/2000/svg" class="absolute inset-0 w-full h-full opacity-20">
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#22C55E" stop-opacity="0.4"></stop>
                  <stop offset="100%" stop-color="#22C55E" stop-opacity="0"></stop>
                </linearGradient>
              </defs>
              <line x1="10%" y1="20%" x2="90%" y2="80%" stroke="url(#lineGrad)" stroke-width="1.5" stroke-dasharray="5,5" class="animate-dash"></line>
              <line x1="20%" y1="70%" x2="80%" y2="30%" stroke="url(#lineGrad)" stroke-width="1" stroke-dasharray="3,3" class="animate-dash-reverse"></line>
              <circle cx="75%" cy="25%" r="40" fill="none" stroke="rgba(34,197,94,0.15)" stroke-width="1.5" class="animate-pulse-ring"></circle>
            </svg>
            
            <!-- Data stream effect -->
            <div class="absolute inset-0 opacity-10">
              <div class="absolute top-[15%] right-[25%] w-px h-16 bg-gradient-to-b from-zenix-green to-transparent animate-data-stream"></div>
              <div class="absolute top-[45%] right-[55%] w-px h-12 bg-gradient-to-b from-zenix-green to-transparent animate-data-stream-delayed"></div>
              <div class="absolute top-[65%] right-[35%] w-px h-14 bg-gradient-to-b from-zenix-green to-transparent animate-data-stream-delayed-2"></div>
            </div>
          </div>
          
          <!-- Enhanced diagonal institutional lines with glow -->
          <svg xmlns="http://www.w3.org/2000/svg" class="absolute inset-0 w-full h-full opacity-[0.12]">
            <defs>
              <linearGradient id="diagonalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#22C55E" stop-opacity="0.5"></stop>
                <stop offset="100%" stop-color="#22C55E" stop-opacity="0"></stop>
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"></feGaussianBlur>
                <feMerge>
                  <feMergeNode in="coloredBlur"></feMergeNode>
                  <feMergeNode in="SourceGraphic"></feMergeNode>
                </feMerge>
              </filter>
            </defs>
            <line x1="0" y1="0" x2="100%" y2="100%" stroke="url(#diagonalGrad)" stroke-width="2" filter="url(#glow)"></line>
            <line x1="15%" y1="0" x2="100%" y2="85%" stroke="url(#diagonalGrad)" stroke-width="1.5" filter="url(#glow)"></line>
            <line x1="30%" y1="0" x2="100%" y2="70%" stroke="url(#diagonalGrad)" stroke-width="1"></line>
          </svg>
          
          <!-- Enhanced green glow -->
          <div class="absolute top-[15%] right-[20%] w-[500px] h-[500px] blur-3xl opacity-70" style="background: radial-gradient(circle, rgba(34,197,94,0.12), rgba(34,197,94,0.04), transparent);"></div>
          <div class="absolute top-[40%] right-[35%] w-[300px] h-[300px] blur-2xl opacity-60" style="background: radial-gradient(circle, rgba(34,197,94,0.1), rgba(34,197,94,0.02), transparent);"></div>
          
          <!-- Grid pattern overlay -->
          <div class="absolute inset-0 opacity-[0.03]">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
              <defs>
                <pattern id="ultragrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(34,197,94,0.25)" stroke-width="0.6"></path>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#ultragrid)"></rect>
            </svg>
          </div>
          
          <!-- Animated particles effect -->
          <div class="absolute inset-0 opacity-[0.06]">
            <div class="absolute top-[25%] right-[25%] w-1 h-1 bg-zenix-green rounded-full animate-pulse"></div>
            <div class="absolute top-[45%] right-[40%] w-1 h-1 bg-zenix-green rounded-full animate-pulse" style="animation-delay: 0.5s;"></div>
            <div class="absolute top-[65%] right-[30%] w-1 h-1 bg-zenix-green rounded-full animate-pulse" style="animation-delay: 1s;"></div>
          </div>
        </div>
        
        <!-- Content Layer -->
        <div class="relative z-10 flex flex-col h-full">
          <!-- Header Section -->
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-3">
              <span id="balanceAmount" class="text-[31px] font-bold text-zenix-green balance-number leading-none tracking-tight">
                {{ balanceHidden ? '******' : formattedBalance }}
              </span>
              <button @click="toggleBalance" class="text-zenix-label hover:text-zenix-text transition-all eye-icon-hover">
                <i :class="balanceHidden ? 'fas fa-eye text-base' : 'fas fa-eye-slash text-base'"></i>
              </button>
            </div>
            <div class="flex items-center bg-[#0F0F0F] border border-zenix-border rounded-full p-0.5">
              <button 
                @click="switchAccount('real')"
                :class="[
                  'px-3 py-1 rounded-full text-xs font-medium transition-all',
                  accountType === 'real' ? 'bg-zenix-green text-black' : 'text-zenix-label'
                ]"
              >
                Real
              </button>
              <button 
                @click="switchAccount('demo')"
                :class="[
                  'px-3 py-1 rounded-full text-xs font-medium transition-all',
                  accountType === 'demo' ? 'bg-zenix-green text-black' : 'text-zenix-label'
                ]"
              >
                Demo
              </button>
            </div>
          </div>
          
          <!-- Divider -->
          <div class="w-full h-[1px] bg-[rgba(255,255,255,0.06)] mb-3"></div>
          
          <!-- Profit/Loss & Operations Section -->
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-[10px] text-[#B0B0B0] font-medium mb-1 opacity-80">Lucro/Perda (Hoje)</p>
              <div class="flex items-baseline space-x-2">
                <p class="text-xl font-bold text-zenix-green">+{{ preferredCurrencyPrefix }}{{ todayProfit }}</p>
                <span class="text-[11px] text-zenix-green bg-zenix-green/10 px-2 py-1 rounded-md font-semibold">+{{ todayProfitPercent }}%</span>
              </div>
            </div>
          </div>
          
          <!-- Divider -->
          <div class="w-full h-[1px] bg-[rgba(255,255,255,0.06)] mb-3"></div>
          
          <!-- MICROINSIGHTS ULTRA PRO -->
          <div>
            <div class="grid grid-cols-3 gap-3">
              <!-- IA Recomendada -->
              <div class="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-2.5">
                <div class="flex items-center space-x-1.5 mb-1">
                  <i class="fas fa-brain text-zenix-green text-[10px]"></i>
                  <p class="text-[9px] text-[#A0A0A0] font-medium">IA Recomendada</p>
                </div>
                <p class="text-[13px] font-bold text-zenix-text mb-0.5">{{ recommendedIA.name }}</p>
                <p class="text-[11px] text-zenix-green font-semibold">{{ recommendedIA.consistency }}% Consistência</p>
              </div>
              
              <!-- Copy Mais Rentável -->
              <div class="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-2.5">
                <div class="flex items-center space-x-1.5 mb-1">
                  <i class="fas fa-copy text-zenix-green text-[10px]"></i>
                  <p class="text-[9px] text-[#A0A0A0] font-medium">Copy Mais Rentável</p>
                </div>
                <p class="text-[13px] font-bold text-zenix-text mb-0.5">{{ topTrader.name }}</p>
                <p class="text-[11px] text-zenix-green font-semibold">+{{ topTrader.profit }}% hoje</p>
              </div>
              
              <!-- Agente Autônomo -->
              <div class="bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg p-2.5">
                <div class="flex items-center space-x-1.5 mb-1">
                  <i class="fas fa-robot text-zenix-label text-[10px]"></i>
                  <p class="text-[9px] text-[#A0A0A0] font-medium">Agente Autônomo</p>
                </div>
                <p class="text-[13px] font-bold text-zenix-secondary mb-0.5">Nenhum ativo</p>
                <p class="text-[9px] text-zenix-label">Ative para aumentar consistência</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Quick Tools Section -->
    <section id="quick-tools" class="mt-12 mb-16">
      <h2 class="text-sm font-semibold text-zenix-text opacity-95 mb-4">Ferramentas Principais</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        <div 
          v-for="(tool, index) in quickTools" 
          :key="index"
          class="bg-zenix-card border border-zenix-border rounded-xl p-6 premium-card transition-all duration-300 cursor-pointer h-[200px] flex flex-col tool-card"
          @click="handleToolClick(tool)"
        >
          <div class="w-14 h-14 bg-zenix-bg rounded-xl flex items-center justify-center mb-4 border border-zenix-green icon-container">
            <i :class="[tool.icon, 'text-zenix-green text-xl icon-glow']"></i>
          </div>
          <h3 class="text-sm font-semibold text-zenix-text mb-2">{{ tool.title }}</h3>
          <p class="text-xs text-zenix-secondary mb-auto leading-relaxed">{{ tool.description }}</p>
          <button class="w-full bg-zenix-green hover:bg-zenix-green-hover text-black font-semibold py-3 rounded-lg text-xs transition-all mt-4 btn-primary-enhanced">
            {{ tool.buttonText }}
          </button>
        </div>
      </div>
    </section>
    
    <!-- Best IAs Section -->
    <section id="best-ias" class="mb-6">
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-sm font-semibold text-zenix-text">Melhores IA's Agora</h2>
        <span class="text-xs text-zenix-label">Baseado no mercado em tempo real</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
        <div 
          v-for="(ia, index) in bestIAs" 
          :key="index"
          class="bg-zenix-card border border-zenix-border rounded-xl overflow-hidden premium-card hover:border-zenix-green transition-all h-[200px]"
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
    <section id="overall-performance" class="mb-12">
      <div class="bg-zenix-card border border-zenix-border rounded-xl p-10 premium-card">
        <h2 class="text-lg font-semibold text-zenix-text mb-2">Desempenho Geral</h2>
        <p class="text-sm text-[#AFAFAF] mb-10">Você está deixando dinheiro na mesa. Ative todos os recursos para maximizar seus resultados.</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div 
            v-for="(perf, index) in performanceData" 
            :key="index"
            class="flex flex-col space-y-5 bg-zenix-bg border border-[#1C1C1C] rounded-xl p-7 performance-card hover:border-zenix-green transition-all"
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
    </main>
  </div>
</template>

<script>
export default {
  name: 'DashboardConnected',
  props: { 
    info: { 
      type: Object, 
      required: true 
    } 
  },
  data() {
    return {
      balanceHidden: false,
      accountType: 'real',
      quickTools: [
        {
          icon: 'fas fa-brain',
          title: 'IA de Investimento',
          description: 'Algoritmos inteligentes para maximizar seus lucros',
          buttonText: 'Acessar',
          route: '/InvestmentIA'
        },
        {
          icon: 'fas fa-copy',
          title: 'Copy Trading',
          description: 'Copie estratégias de traders experientes',
          buttonText: 'Acessar',
          route: '/copy-trading'
        },
        {
          icon: 'fas fa-chart-line',
          title: 'Operação Manual',
          description: 'Controle total sobre suas operações',
          buttonText: 'Acessar',
          route: '/operation'
        },
        {
          icon: 'fas fa-robot',
          title: 'Agente Autônomo',
          description: 'Operações automatizadas 24/7',
          buttonText: 'Acessar',
          route: '/agente-autonomo'
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
      todayProfit: '3.247,50',
      todayProfitPercent: '1.31'
    }
  },
  computed: {
    formattedBalance() {
      if (this.accountType === 'demo') {
        const demo = this.usdDemoBalance || 0;
        return `${this.preferredCurrencyPrefix}${demo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
      const value = this.balanceNumeric;
      return `${this.preferredCurrencyPrefix}${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    },
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
    userInitials() {
      const userInfo = localStorage.getItem('user');
      if (userInfo) {
        try {
          const user = JSON.parse(userInfo);
          if (user.name) {
            const names = user.name.split(' ');
            if (names.length >= 2) {
              return (names[0][0] + names[1][0]).toUpperCase();
            }
            return names[0][0].toUpperCase();
          }
        } catch (e) {
          console.error('Erro ao parsear informações do usuário:', e);
        }
      }
      return 'U';
    }
  },
  mounted() {
    this.initSparklines();
  },
  methods: {
    toggleBalance() {
      this.balanceHidden = !this.balanceHidden;
    },
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
