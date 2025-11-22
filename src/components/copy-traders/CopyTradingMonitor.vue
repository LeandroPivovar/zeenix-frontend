<template>
    <div id="copy-trading-monitor">
      <div class="tabs">
        <button :class="['tab', { active: tabAtiva === 'config' }]" @click="setTab('config')">Configurar</button>
        <button :class="['tab', { active: tabAtiva === 'monitor' }]" @click="setTab('monitor')">Acompanhar & Performance</button>
      </div>
  
      <div v-if="tabAtiva === 'monitor'" class="grid">
        
        <div class="card">
          <div class="card-header">
            <span class="card-title">Resumo do Dia</span>
            <span class="tooltip">?</span>
          </div>
          <div class="profit-box">
            <div class="profit-label">Lucro Hoje</div>
            <span class="profit-value">{{ resumo.lucroHoje }}</span>
            <span class="profit-percent">{{ resumo.percentualHoje }}</span>
          </div>
          <div class="stats-row">
            <div class="stat-item">
              <span class="label">Wins</span>
              <span class="value green">{{ resumo.wins }}</span>
            </div>
            <div class="stat-item">
              <span class="label">Losses</span>
              <span class="value red">{{ resumo.losses }}</span>
            </div>
          </div>
          <div class="weekly">
            <span>Últimos 7 dias</span><br>
            <span class="weekly-value">{{ resumo.lucroSemana }} ({{ resumo.percentualSemana }})</span>
          </div>
        </div>
  
        <div class="card">
          <div class="card-header">
            <span class="card-title">Status Atual do Copy</span>
            <span class="tooltip">?</span>
          </div>
          <div class="status-header">
            <div class="status-row">
              <div class="status-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              </div>
              <div class="status-info">
                <div class="label">Status</div>
                <div class="value">{{ statusCopy.status }}</div>
              </div>
            </div>
            <button class="pause-btn">PAUSAR COPY</button>
          </div>
          <div class="trader-row">
            <div class="trader-info">
              <div class="trader-avatar">
                <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              </div>
              <div class="trader-details">
                <div class="label">Trader Seguido</div>
                <div class="name">{{ statusCopy.trader }}</div>
              </div>
            </div>
            <div class="ops-today">
              <div class="label">Operações Hoje</div>
              <div class="value">{{ statusCopy.operacoesHoje }}</div>
            </div>
          </div>
          <div class="sync-row">
            <div class="sync-info">
              <div class="label">Última Sincronização</div>
              <div class="value">{{ statusCopy.ultimaSincronizacao }}</div>
            </div>
            <div class="sync-tags">
              <span class="sync-tag">SL: {{ statusCopy.slValor }}</span>
              <span class="sync-tag">TP: {{ statusCopy.tpValor }}</span>
              <span class="sl-badge">⚡ SL Blindado</span>
            </div>
          </div>
        </div>
  
        <div class="card">
          <div class="card-header">
            <span class="card-title">Operações Replicadas</span>
            <span class="tooltip">?</span>
          </div>
          <div class="operations-list">
            <div v-for="op in operacoes" :key="op.time" class="op-item">
              <div class="op-left">
                <span class="op-check">✓</span>
                <span class="op-time">{{ op.time }}</span>
                <span :class="['op-type', op.type.toLowerCase()]">{{ op.type }}</span>
                <span class="op-vol">Vol {{ op.volume }}</span>
              </div>
              <span :class="['op-result', op.result.startsWith('+') ? 'green' : 'red']">{{ op.result }}</span>
            </div>
          </div>
          <button class="view-btn">Ver tudo</button>
        </div>
  
        <div class="card">
          <div class="card-header">
            <span class="card-title">Exposição & Risco</span>
            <span class="tooltip">?</span>
          </div>
          <div class="risk-row">
            <span class="risk-label">Exposição Atual</span>
            <span class="risk-value green">{{ risco.exposicaoAtual }}</span>
          </div>
          <div class="risk-row">
            <span class="risk-label">SL Diário</span>
            <span :class="['risk-value', risco.slDiario.startsWith('$') ? 'red' : 'green']">{{ risco.slDiario }}</span>
          </div>
          <div class="risk-row">
            <span class="risk-label">TP Diário</span>
            <span class="risk-value green">{{ risco.tpDiario }}</span>
          </div>
          <div class="risk-row">
            <span class="risk-label">SL Blindado</span>
            <span class="risk-value green">{{ risco.slBlindado }}</span>
          </div>
          <div class="risk-badge">
            <div class="risk-badge-left">
              <span class="risk-dot"></span>
              <span class="risk-text">Risco Baixo</span>
            </div>
            <div class="risk-icon">
              <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            </div>
          </div>
        </div>
  
        <div class="card full-width">
          <div class="chart-header">
            <div class="card-header" style="margin-bottom:0">
              <span class="card-title">Evolução da Performance</span>
              <span class="tooltip">?</span>
            </div>
            <div class="period-btns">
              <button v-for="periodo in periodos" :key="periodo.label" :class="['period-btn', { active: periodoAtivo === periodo.label }]" @click="setPeriodo(periodo.label)">
                <span v-if="periodo.label !== 'Personalizado'">{{ periodo.label }}</span>
                <span v-else>📅 {{ periodo.label }}</span>
              </button>
            </div>
          </div>
          <div class="chart-container">
            <div class="chart-y">
              <span v-for="y in chart.yLabels" :key="y">{{ y }}</span>
            </div>
            <div class="chart-area">
              <svg viewBox="0 0 600 180" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#22c55e" stop-opacity="0.3"/>
                    <stop offset="100%" stop-color="#22c55e" stop-opacity="0"/>
                  </linearGradient>
                </defs>
                <line x1="0" y1="30" x2="600" y2="30" stroke="#222" stroke-dasharray="4"/>
                <line x1="0" y1="90" x2="600" y2="90" stroke="#222" stroke-dasharray="4"/>
                <line x1="0" y1="150" x2="600" y2="150" stroke="#222" stroke-dasharray="4"/>
                <line x1="100" y1="0" x2="100" y2="180" stroke="#1a1a1a"/>
                <line x1="200" y1="0" x2="200" y2="180" stroke="#1a1a1a"/>
                <line x1="300" y1="0" x2="300" y2="180" stroke="#1a1a1a"/>
                <line x1="400" y1="0" x2="400" y2="180" stroke="#1a1a1a"/>
                <line x1="500" y1="0" x2="500" y2="180" stroke="#1a1a1a"/>
  
                <polygon :points="chart.polygonPoints" fill="url(#grad)"/>
                <polyline :points="chart.linePoints" fill="none" stroke="#22c55e" stroke-width="2"/>
                <circle v-for="point in chart.points" :key="point.cx" :cx="point.cx" :cy="point.cy" r="3" fill="#22c55e"/>
              </svg>
            </div>
          </div>
          <div class="chart-x">
            <span v-for="x in chart.xLabels" :key="x">{{ x }}</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CopyTradingMonitor',
    data() {
      return {
        tabAtiva: 'monitor', // 'config' ou 'monitor'
        periodoAtivo: '7 dias', // 'Hoje', '7 dias', '30 dias', 'Personalizado'
        
        resumo: {
          lucroHoje: '+$89.50',
          percentualHoje: '+1.7%',
          wins: 8,
          losses: 2,
          lucroSemana: '+$142.00',
          percentualSemana: '+2.3%',
        },
        statusCopy: {
          status: 'COPIANDO',
          trader: '@TraderMaster',
          operacoesHoje: 3,
          ultimaSincronizacao: 'há 2 minutos',
          slValor: '$250',
          tpValor: '$500',
        },
        operacoes: [
          { time: '15:05', type: 'CALL', volume: 75, result: '+$17.60' },
          { time: '14:20', type: 'PUT', volume: 100, result: '+$19.40' },
          { time: '13:42', type: 'MATCHES', volume: 75, result: '+$15.80' },
          { time: '12:08', type: 'CALL', volume: 100, result: '-$4.20' },
        ],
        risco: {
          exposicaoAtual: '2.3%',
          slDiario: '$250',
          tpDiario: '$500',
          slBlindado: 'Ativo',
          riscoNivel: 'Baixo',
        },
        periodos: [
          { label: 'Hoje' },
          { label: '7 dias' },
          { label: '30 dias' },
          { label: 'Personalizado' }
        ],
        chart: {
          yLabels: ['$150', '$100', '$50'],
          xLabels: ['01/11', '02/11', '03/11', '04/11', '05/11', '06/11', '07/11'],
          // Estes pontos são estáticos, em um app real seriam dinâmicos
          linePoints: '0,130 50,110 100,95 150,100 200,80 250,85 300,65 350,70 400,55 450,50 500,40 550,45 600,35',
          polygonPoints: '0,130 50,110 100,95 150,100 200,80 250,85 300,65 350,70 400,55 450,50 500,40 550,45 600,35 600,180 0,180',
          points: [
              { cx: 0, cy: 130 }, { cx: 100, cy: 95 }, { cx: 200, cy: 80 }, { cx: 300, cy: 65 }, 
              { cx: 400, cy: 55 }, { cx: 500, cy: 40 }, { cx: 600, cy: 35 }
          ]
        }
      };
    },
    methods: {
      setTab(tab) {
        this.tabAtiva = tab;
      },
      setPeriodo(periodo) {
        this.periodoAtivo = periodo;
        // Lógica para carregar dados do gráfico aqui
      }
    }
  };
  </script>
  
  <style scoped>
  /* Estilos copiado do HTML original */
  * { margin: 0; padding: 0; box-sizing: border-box; }
  #copy-trading-monitor {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #000; color: #fff; padding: 20px; min-height: 100vh;
  }
  .tabs { display: flex; gap: 24px; border-bottom: 1px solid #222; padding-bottom: 12px; margin-bottom: 20px; }
  .tab { background: none; border: none; color: #666; font-size: 14px; cursor: pointer; padding-bottom: 12px; }
  .tab.active { color: #fff; border-bottom: 2px solid #22c55e; margin-bottom: -13px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .card { background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 12px; padding: 20px; }
  .card-header { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
  .card-title { font-size: 14px; color: #999; font-weight: 500; }
  .tooltip { width: 16px; height: 16px; border: 1px solid #444; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #666; cursor: help; }
  .profit-box { background: #111; border: 1px solid #1a1a1a; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
  .profit-label { font-size: 12px; color: #666; margin-bottom: 4px; }
  .profit-value { font-size: 28px; font-weight: 700; color: #22c55e; }
  .profit-percent { font-size: 12px; color: #22c55e; margin-left: 8px; }
  .stats-row { display: flex; gap: 24px; margin-bottom: 16px; }
  .stat-item .label { font-size: 12px; color: #666; display: block; }
  .stat-item .value { font-size: 18px; font-weight: 600; }
  .stat-item .value.green { color: #22c55e; }
  .stat-item .value.red { color: #ef4444; }
  .weekly { font-size: 12px; color: #666; }
  .weekly-value { font-size: 14px; color: #22c55e; font-weight: 500; }
  .status-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
  .status-row { display: flex; align-items: center; gap: 12px; }
  .status-icon { width: 32px; height: 32px; background: rgba(34,197,94,0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
  .status-icon svg { width: 18px; height: 18px; color: #22c55e; }
  .status-info .label { font-size: 11px; color: #666; }
  .status-info .value { font-size: 13px; color: #22c55e; font-weight: 600; }
  .pause-btn { background: transparent; border: 1px solid #ef4444; color: #ef4444; padding: 10px 20px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
  .pause-btn:hover { background: rgba(239,68,68,0.1); }
  .trader-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  .trader-info { display: flex; align-items: center; gap: 12px; }
  .trader-avatar { width: 40px; height: 40px; background: #222; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
  .trader-avatar svg { width: 20px; height: 20px; color: #666; }
  .trader-details .label { font-size: 11px; color: #666; }
  .trader-details .name { font-size: 13px; font-weight: 500; }
  .ops-today .label { font-size: 11px; color: #666; }
  .ops-today .value { font-size: 20px; font-weight: 600; color: #22c55e; }
  .sync-row { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
  .sync-info .label { font-size: 11px; color: #666; }
  .sync-info .value { font-size: 13px; color: #ccc; }
  .sync-tags { display: flex; align-items: center; gap: 12px; }
  .sync-tag { font-size: 12px; color: #666; }
  .sl-badge { background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.3); color: #22c55e; padding: 6px 12px; border-radius: 20px; font-size: 11px; font-weight: 500; display: flex; align-items: center; gap: 4px; }
  .operations-list { margin-bottom: 12px; }
  .op-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #151515; }
  .op-item:last-child { border-bottom: none; }
  .op-left { display: flex; align-items: center; gap: 8px; }
  .op-check { color: #22c55e; }
  .op-time { font-size: 12px; color: #666; }
  .op-type { font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 4px; }
  .op-type.call { background: rgba(34,197,94,0.2); color: #22c55e; }
  .op-type.put { background: rgba(239,68,68,0.2); color: #ef4444; }
  .op-type.matches { background: rgba(234,179,8,0.2); color: #eab308; }
  .op-vol { font-size: 12px; color: #666; }
  .op-result { font-size: 13px; font-weight: 600; }
  .op-result.green { color: #22c55e; }
  .op-result.red { color: #ef4444; }
  .view-btn { width: 100%; background: transparent; border: 1px solid #333; color: #22c55e; padding: 10px; border-radius: 6px; font-size: 13px; cursor: pointer; transition: all 0.2s; }
  .view-btn:hover { border-color: #22c55e; }
  .risk-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #151515; }
  .risk-row:last-child { border-bottom: none; }
  .risk-label { font-size: 13px; color: #888; }
  .risk-value { font-size: 16px; font-weight: 600; }
  .risk-value.green { color: #22c55e; }
  .risk-value.red { color: #ef4444; }
  .risk-badge { background: #111; border: 1px solid #222; border-radius: 8px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; margin-top: 12px; }
  .risk-badge-left { display: flex; align-items: center; gap: 8px; }
  .risk-dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; }
  .risk-text { font-size: 13px; font-weight: 500; }
  .risk-icon { width: 24px; height: 24px; background: rgba(34,197,94,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
  .risk-icon svg { width: 14px; height: 14px; color: #22c55e; }
  .full-width { grid-column: span 2; }
  .chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .period-btns { display: flex; gap: 8px; }
  .period-btn { background: #1a1a1a; border: none; color: #666; padding: 6px 14px; border-radius: 6px; font-size: 12px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 4px; }
  .period-btn.active { background: #22c55e; color: #fff; }
  .period-btn:hover:not(.active) { color: #fff; }
  .chart-container { position: relative; height: 200px; }
  .chart-y { position: absolute; left: 0; top: 0; height: 100%; display: flex; flex-direction: column; justify-content: space-between; font-size: 11px; color: #666; padding: 10px 0; }
  .chart-area { margin-left: 40px; height: 100%; position: relative; }
  .chart-area svg { width: 100%; height: 100%; }
  .chart-x { display: flex; justify-content: space-between; margin-left: 40px; margin-top: 8px; font-size: 11px; color: #666; }
  @media (max-width: 768px) {
    .grid { grid-template-columns: 1fr; }
    .full-width { grid-column: span 1; }
    .sync-row { flex-direction: column; align-items: flex-start; }
  }
  </style>