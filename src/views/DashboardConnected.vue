<template>
  <div class="dashboard-content-wrapper" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    <!-- Top Navbar -->
    <TopNavbar 
      :is-sidebar-collapsed="isSidebarCollapsed"
      :balance="info?.balance"
      :account-type="accountType"
      @account-type-changed="switchAccount"
      :balances-by-currency-real="balancesByCurrencyReal"
      :balances-by-currency-demo="balancesByCurrencyDemo"
      :currency-prefix="preferredCurrencyPrefix"
    />
    
    <!-- Main Content -->
    <main class="main-content bg-zenix-bg noise-bg font-inter overflow-y-auto w-full">
      <!-- Hero Onboarding Section -->
      <section id="hero-section" class="w-full mt-16 py-12 px-8 relative overflow-hidden group h-[560px]">
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
      <div class="relative z-10 h-full max-w-[1400px] mx-auto px-12">
        <div class="grid grid-cols-2 gap-20 h-full items-center">
          <div class="flex flex-col justify-center space-y-10">
            <div class="space-y-6 text-left">
              <h1 class="text-[72px] font-bold leading-[1.1] tracking-[-0.03em] text-left">
                <span class="text-white">Seja bem-vindo,</span><br><span class="text-[#22C55E]">{{ userName }}</span>
              </h1>
              <p class="text-[22px] text-white/60 leading-[1.7] max-w-[600px] text-left">
                Comece agora configurando sua conta e realizando seu primeiro depósito.
              </p>
            </div>
            <div class="pt-4">
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
          <div class="relative h-full flex items-center justify-center">
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.08)_0%,transparent_70%)] blur-[100px] opacity-60"></div>
            <div class="relative w-[560px] h-[560px]">
              <!-- Central Core -->
              <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 group transition-transform duration-700 ease-out hover:scale-110 z-20">
                <div class="relative w-full h-full">
                  <div class="absolute inset-0 bg-gradient-to-br from-[#1C1C1C] via-[#0E0E0E] to-[#000000] rounded-2xl border-2 border-[rgba(34,197,94,0.6)] shadow-[0_0_60px_rgba(34,197,94,0.5),0_0_120px_rgba(34,197,94,0.3),inset_0_0_40px_rgba(34,197,94,0.2)] transition-all duration-700 ease-out group-hover:shadow-[0_0_80px_rgba(34,197,94,0.6),0_0_160px_rgba(34,197,94,0.4),inset_0_0_50px_rgba(34,197,94,0.25)] group-hover:border-[rgba(34,197,94,0.8)] animate-center-pulse">
                    <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.4)_0%,transparent_70%)] animate-pulse"></div>
                  </div>
                  <div class="absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-out group-hover:scale-105">
                    <i class="fas fa-brain text-[#22C55E] text-5xl drop-shadow-[0_0_25px_rgba(34,197,94,1)] transition-all duration-700 ease-out group-hover:drop-shadow-[0_0_35px_rgba(34,197,94,1)]"></i>
                  </div>
                </div>
              </div>
              <!-- SVG Lines -->
              <svg class="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <filter id="glow-line">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"></feGaussianBlur>
                    <feMerge>
                      <feMergeNode in="coloredBlur"></feMergeNode>
                      <feMergeNode in="SourceGraphic"></feMergeNode>
                    </feMerge>
                  </filter>
                </defs>
                <line x1="280" y1="280" x2="420" y2="160" stroke="rgba(34,197,94,0.4)" stroke-width="1.5" stroke-dasharray="4 8" filter="url(#glow-line)">
                  <animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.5s" repeatCount="indefinite"></animate>
                </line>
                <line x1="280" y1="280" x2="140" y2="220" stroke="rgba(34,197,94,0.4)" stroke-width="1.5" stroke-dasharray="4 8" filter="url(#glow-line)">
                  <animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.5s" repeatCount="indefinite"></animate>
                </line>
                <line x1="280" y1="280" x2="140" y2="380" stroke="rgba(34,197,94,0.4)" stroke-width="1.5" stroke-dasharray="4 8" filter="url(#glow-line)">
                  <animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.5s" repeatCount="indefinite"></animate>
                </line>
                <line x1="280" y1="280" x2="420" y2="340" stroke="rgba(34,197,94,0.4)" stroke-width="1.5" stroke-dasharray="4 8" filter="url(#glow-line)">
                  <animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.5s" repeatCount="indefinite"></animate>
                </line>
                <line x1="280" y1="280" x2="380" y2="420" stroke="rgba(34,197,94,0.4)" stroke-width="1.5" stroke-dasharray="4 8" filter="url(#glow-line)">
                  <animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.5s" repeatCount="indefinite"></animate>
                </line>
              </svg>
              <!-- Floating Cards -->
              <div class="absolute top-[15%] right-[10%] w-32 h-20 group transition-all duration-500 hover:scale-105 animate-[float-card-1_6s_ease-in-out_infinite]">
                <div class="relative w-full h-full">
                  <div class="absolute inset-0 bg-gradient-to-br from-[#1C1C1C] via-[#0E0E0E] to-[#000000] rounded-xl border border-[rgba(34,197,94,0.3)] shadow-[0_4px_20px_rgba(0,0,0,0.8),0_0_30px_rgba(34,197,94,0.15)] group-hover:shadow-[0_6px_28px_rgba(0,0,0,0.9),0_0_45px_rgba(34,197,94,0.3)]">
                    <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(34,197,94,0.06)_0%,transparent_60%)]"></div>
                  </div>
                  <div class="absolute inset-0 flex items-center px-4 space-x-2">
                    <div class="w-9 h-9 rounded-lg bg-[rgba(247,147,26,0.12)] border border-[rgba(247,147,26,0.25)] flex items-center justify-center">
                      <i class="fab fa-bitcoin text-[#F7931A] text-base"></i>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-[11px] font-semibold text-white/90">BTC</span>
                      <span class="text-[9px] text-[#22C55E] font-medium">$43,250</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="absolute top-[32%] left-[4%] w-32 h-20 group transition-all duration-500 hover:scale-105 animate-[float-card-2_7s_ease-in-out_infinite]">
                <div class="relative w-full h-full">
                  <div class="absolute inset-0 bg-gradient-to-br from-[#1C1C1C] via-[#0E0E0E] to-[#000000] rounded-xl border border-[rgba(34,197,94,0.3)] shadow-[0_4px_20px_rgba(0,0,0,0.8),0_0_30px_rgba(34,197,94,0.15)] group-hover:shadow-[0_6px_28px_rgba(0,0,0,0.9),0_0_45px_rgba(34,197,94,0.3)]">
                    <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(34,197,94,0.06)_0%,transparent_60%)]"></div>
                  </div>
                  <div class="absolute inset-0 flex items-center px-4 space-x-2">
                    <div class="w-9 h-9 rounded-lg bg-[rgba(38,161,123,0.12)] border border-[rgba(38,161,123,0.25)] flex items-center justify-center">
                      <span class="text-[#26A17B] text-sm font-bold">₮</span>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-[11px] font-semibold text-white/90">USDT</span>
                      <span class="text-[9px] text-[#22C55E] font-medium">$1.00</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="absolute bottom-[28%] left-[8%] w-32 h-20 group transition-all duration-500 hover:scale-105 animate-[float-card-3_8s_ease-in-out_infinite]">
                <div class="relative w-full h-full">
                  <div class="absolute inset-0 bg-gradient-to-br from-[#1C1C1C] via-[#0E0E0E] to-[#000000] rounded-xl border border-[rgba(34,197,94,0.3)] shadow-[0_4px_20px_rgba(0,0,0,0.8),0_0_30px_rgba(34,197,94,0.15)] group-hover:shadow-[0_6px_28px_rgba(0,0,0,0.9),0_0_45px_rgba(34,197,94,0.3)]">
                    <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(34,197,94,0.06)_0%,transparent_60%)]"></div>
                  </div>
                  <div class="absolute inset-0 flex items-center px-4 space-x-2">
                    <div class="w-9 h-9 rounded-lg bg-[rgba(34,197,94,0.12)] border border-[rgba(34,197,94,0.25)] flex items-center justify-center">
                      <i class="fas fa-dollar-sign text-[#22C55E] text-sm"></i>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-[11px] font-semibold text-white/90">USD</span>
                      <span class="text-[9px] text-[#22C55E] font-medium">+2.4%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="absolute top-[48%] right-[8%] w-36 h-20 group transition-all duration-500 hover:scale-105 animate-[float-card-1_6.5s_ease-in-out_infinite]">
                <div class="relative w-full h-full">
                  <div class="absolute inset-0 bg-gradient-to-br from-[#1C1C1C] via-[#0E0E0E] to-[#000000] rounded-xl border border-[rgba(34,197,94,0.3)] shadow-[0_4px_20px_rgba(0,0,0,0.8),0_0_30px_rgba(34,197,94,0.15)] group-hover:shadow-[0_6px_28px_rgba(0,0,0,0.9),0_0_45px_rgba(34,197,94,0.3)]">
                    <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(34,197,94,0.06)_0%,transparent_60%)]"></div>
                  </div>
                  <div class="absolute inset-0 flex items-center px-4 space-x-2">
                    <div class="w-9 h-9 rounded-lg bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.25)] flex items-center justify-center">
                      <i class="fas fa-robot text-[#22C55E] text-sm"></i>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-[11px] font-semibold text-[#22C55E]">IA Orion</span>
                      <span class="text-[9px] text-white/50 font-medium">Ativo</span>
                    </div>
                    <div class="absolute top-2 right-2 w-2 h-2 bg-[#22C55E] rounded-full shadow-[0_0_10px_rgba(34,197,94,1)] animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div class="absolute bottom-[16%] right-[14%] w-36 h-20 group transition-all duration-500 hover:scale-105 animate-[float-card-2_7.5s_ease-in-out_infinite]">
                <div class="relative w-full h-full">
                  <div class="absolute inset-0 bg-gradient-to-br from-[#1C1C1C] via-[#0E0E0E] to-[#000000] rounded-xl border border-[rgba(34,197,94,0.3)] shadow-[0_4px_20px_rgba(0,0,0,0.8),0_0_30px_rgba(34,197,94,0.15)] group-hover:shadow-[0_6px_28px_rgba(0,0,0,0.9),0_0_45px_rgba(34,197,94,0.3)]">
                    <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(34,197,94,0.06)_0%,transparent_60%)]"></div>
                  </div>
                  <div class="absolute inset-0 flex items-center px-4 space-x-2">
                    <div class="w-9 h-9 rounded-lg bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.25)] flex items-center justify-center">
                      <i class="fas fa-chart-line text-[#22C55E] text-sm"></i>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-[11px] font-semibold text-white/90">Lucro</span>
                      <span class="text-[12px] text-[#22C55E] font-bold">+12.4%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </section>
      
      <!-- Ticker Section -->
      <section id="ticker-section" class="px-8 py-3 relative overflow-hidden border-t border-[#22C55E]/20 bg-[rgba(11,11,11,0.8)] backdrop-blur-sm">
        <div class="relative z-10 max-w-[1400px] mx-auto">
          <div class="relative overflow-hidden">
            <div class="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[rgba(11,11,11,0.95)] to-transparent z-10 pointer-events-none"></div>
            <div class="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[rgba(11,11,11,0.95)] to-transparent z-10 pointer-events-none"></div>
            <div id="ticker-scroll" class="flex items-center whitespace-nowrap">
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Marcos V. lucrou <span class="text-[#22C55E] font-semibold">$103,70</span> usando IA Pulse</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-robot text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Andre S. ativou IA Vega e iniciou operações</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-dollar-sign text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Ricardo M. sacou <span class="text-[#22C55E] font-semibold">$82,10</span> do Copy Trading</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-chart-line text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">João P. depositou <span class="text-[#22C55E] font-semibold">$150</span> e ativou IA Orion</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Felipe A. teve lucro de <span class="text-[#22C55E] font-semibold">$27,40</span> em operações manuais</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-robot text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Beatriz M. ativou IA Titan para volatilidade extrema</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Rafael C. lucrou <span class="text-[#22C55E] font-semibold">$311,00</span> com IA Pulse</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-chart-line text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Matheus L. ganhou <span class="text-[#22C55E] font-semibold">$57,22</span> com Copy Trade automatizado</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Marcos V. lucrou <span class="text-[#22C55E] font-semibold">$103,70</span> usando IA Pulse</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-robot text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Andre S. ativou IA Vega e iniciou operações</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-dollar-sign text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Ricardo M. sacou <span class="text-[#22C55E] font-semibold">$82,10</span> do Copy Trading</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-chart-line text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">João P. depositou <span class="text-[#22C55E] font-semibold">$150</span> e ativou IA Orion</span></div>
            </div>
          </div>
        </div>
      </section>
      
      <div class="px-8 py-5">
      <!-- Best IAs Section -->
      <section id="best-ai-section" class="px-12 pt-20 pb-20 relative">
        <div class="absolute inset-0 bg-gradient-to-b from-[#0B0B0B] via-[#0E0E0E] to-[#0B0B0B] opacity-40 pointer-events-none"></div>
        <div class="relative z-10 max-w-[1400px] mx-auto">
          <div class="text-left mb-8 space-y-2">
            <h2 class="text-5xl font-bold text-[#E6E6E6] tracking-[-0.02em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.08)]">Melhores IA's Agora</h2>
            <p class="text-[17px] text-[#9B9B9B] max-w-3xl leading-[1.75]">
              Escolha entre as inteligências artificiais mais avançadas do mercado. Cada IA foi otimizada para diferentes estratégias e perfis de risco, garantindo máxima performance em suas operações.
            </p>
          </div>
          <div class="w-full h-[1px] bg-[#1C1C1C] opacity-35 mb-12"></div>
          <div class="grid grid-cols-4 gap-6 mb-20">
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
        </div>
      </section>
      
      <!-- Ticker Section 2 -->
      <section id="ticker-section-2" class="px-8 py-3 relative overflow-hidden border-t border-[#22C55E]/20 bg-[rgba(11,11,11,0.8)] backdrop-blur-sm">
        <div class="relative z-10 max-w-[1400px] mx-auto">
          <div class="relative overflow-hidden">
            <div class="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[rgba(11,11,11,0.95)] to-transparent z-10 pointer-events-none"></div>
            <div class="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[rgba(11,11,11,0.95)] to-transparent z-10 pointer-events-none"></div>
            <div id="ticker-scroll-2" class="flex items-center whitespace-nowrap">
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Marcos V. lucrou <span class="text-[#22C55E] font-semibold">$103,70</span> usando IA Pulse</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-robot text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Andre S. ativou IA Vega e iniciou operações</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-dollar-sign text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Ricardo M. sacou <span class="text-[#22C55E] font-semibold">$82,10</span> do Copy Trading</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-chart-line text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">João P. depositou <span class="text-[#22C55E] font-semibold">$150</span> e ativou IA Orion</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Felipe A. teve lucro de <span class="text-[#22C55E] font-semibold">$27,40</span> em operações manuais</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-robot text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Beatriz M. ativou IA Titan para volatilidade extrema</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Rafael C. lucrou <span class="text-[#22C55E] font-semibold">$311,00</span> com IA Pulse</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-chart-line text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Matheus L. ganhou <span class="text-[#22C55E] font-semibold">$57,22</span> com Copy Trade automatizado</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-bolt text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Marcos V. lucrou <span class="text-[#22C55E] font-semibold">$103,70</span> usando IA Pulse</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-robot text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Andre S. ativou IA Vega e iniciou operações</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-dollar-sign text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">Ricardo M. sacou <span class="text-[#22C55E] font-semibold">$82,10</span> do Copy Trading</span></div>
              <div class="inline-flex items-center space-x-3 px-8"><i class="fas fa-chart-line text-[#22C55E] text-sm opacity-100"></i><span class="text-white/95 text-sm font-medium">João P. depositou <span class="text-[#22C55E] font-semibold">$150</span> e ativou IA Orion</span></div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Divider -->
      <div class="relative flex items-center justify-center -mt-[70px] mb-[60px] px-12 z-20">
        <div class="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div class="w-0.5 h-[30px] relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-b from-[#0E0E0E] via-[#22C55E] to-[#0E0E0E] blur-[6px] opacity-40"></div>
          </div>
          <div class="w-0.5 h-[30px] relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-b from-[#0E0E0E] via-[#22C55E] to-[#0E0E0E] blur-[6px] opacity-40"></div>
          </div>
        </div>
      </div>
      
      <!-- Overall Performance Section -->
      <section id="performance-section" class="px-12 pt-0 pb-36 relative">
        <div class="absolute inset-0 bg-gradient-to-b from-[#0B0B0B] via-[#0E0E0E] to-[#0B0B0B] opacity-40 pointer-events-none"></div>
        <div class="w-full h-[1px] bg-[#1C1C1C] opacity-35 mb-12"></div>
        <div class="relative z-10 max-w-[1400px] mx-auto">
          <div class="text-left mb-8 space-y-2">
            <h2 class="text-5xl font-bold text-[#E6E6E6] tracking-[-0.02em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.08)]">Desempenho Geral</h2>
            <p class="text-[17px] text-[#9B9B9B] max-w-3xl leading-[1.75]">
              Ative agora os recursos que podem aumentar seus resultados automaticamente.<br>
              Cada ferramenta desligada é lucro não realizado.
            </p>
          </div>
          <div class="grid grid-cols-4 gap-4 justify-items-center">
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

#ticker-scroll,
#ticker-scroll-2 {
  animation: ticker-scroll 60s linear infinite;
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

@media (max-width: 1024px) {
  #hero-section {
    height: auto;
    min-height: 600px;
  }
  
  .grid.grid-cols-2 {
    grid-template-columns: 1fr;
  }
  
  .grid.grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .grid.grid-cols-4 {
    grid-template-columns: 1fr;
  }
  
  #best-ai-section .grid.grid-cols-4 {
    grid-template-columns: 1fr;
  }
  
  #performance-section .grid.grid-cols-4 {
    grid-template-columns: 1fr;
  }
}

</style>

