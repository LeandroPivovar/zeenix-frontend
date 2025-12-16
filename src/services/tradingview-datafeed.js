/**
 * TradingView Advanced Charts Datafeed
 * 
 * Este arquivo implementa a interface Datafeed necessária para conectar
 * os dados do backend ao TradingView Advanced Charts.
 * 
 * Documentação: https://www.tradingview.com/charting-library-docs/latest/connecting_data/
 */

class TradingViewDatafeed {
  constructor(backendService, symbol) {
    this.backendService = backendService;
    this.symbol = symbol;
    this.configuration = {
      supported_resolutions: ['1', '5', '15', '30', '60', '240', '1D'],
      supports_group_request: false,
      supports_marks: false,
      supports_search: true,
      supports_timescale_marks: false,
      supports_time: true,
    };
    
    // Cache de dados
    this.barsCache = new Map();
    this.subscriptions = new Map();
  }

  /**
   * Retorna a configuração do datafeed
   */
  onReady(callback) {
    setTimeout(() => {
      callback(this.configuration);
    }, 0);
  }

  /**
   * Busca símbolos (para autocomplete)
   */
  searchSymbols(userInput, exchange, symbolType, onResultReadyCallback) {
    // Implementar busca de símbolos se necessário
    onResultReadyCallback([]);
  }

  /**
   * Resolve símbolo (obtém informações do símbolo)
   */
  resolveSymbol(symbolName, onResolveCallback, onErrorCallback) {
    const symbolInfo = {
      name: symbolName || this.symbol,
      ticker: symbolName || this.symbol,
      description: symbolName || this.symbol,
      type: 'index',
      session: '24x7',
      timezone: 'America/Sao_Paulo',
      exchange: 'DERIV',
      minmov: 1,
      pricescale: 100, // 2 casas decimais
      has_intraday: true,
      has_weekly_and_monthly: false,
      supported_resolutions: this.configuration.supported_resolutions,
      volume_precision: 2,
      data_status: 'streaming',
    };

    setTimeout(() => {
      onResolveCallback(symbolInfo);
    }, 0);
  }

  /**
   * Obtém dados históricos (barras)
   */
  getBars(symbolInfo, resolution, periodParams, onResultCallback, onErrorCallback) {
    const { from, to, firstDataRequest } = periodParams;
    
    console.log('[Datafeed] Buscando barras:', {
      symbol: symbolInfo.name,
      resolution,
      from: new Date(from * 1000),
      to: new Date(to * 1000),
      firstDataRequest
    });

    // Se for a primeira requisição, buscar histórico do backend
    if (firstDataRequest) {
      this.fetchHistoricalData(symbolInfo.name, resolution, from, to)
        .then(bars => {
          if (bars && bars.length > 0) {
            this.barsCache.set(`${symbolInfo.name}_${resolution}`, bars);
            onResultCallback(bars, { noData: false });
          } else {
            onResultCallback([], { noData: true });
          }
        })
        .catch(error => {
          console.error('[Datafeed] Erro ao buscar dados históricos:', error);
          onErrorCallback(error);
        });
    } else {
      // Para requisições subsequentes, usar cache ou buscar mais dados
      const cacheKey = `${symbolInfo.name}_${resolution}`;
      const cachedBars = this.barsCache.get(cacheKey);
      
      if (cachedBars) {
        // Filtrar barras no range solicitado
        const filteredBars = cachedBars.filter(bar => 
          bar.time >= from && bar.time <= to
        );
        onResultCallback(filteredBars, { noData: filteredBars.length === 0 });
      } else {
        onResultCallback([], { noData: true });
      }
    }
  }

  /**
   * Busca dados históricos do backend
   */
  async fetchHistoricalData(symbol, resolution, from, to) {
    try {
      // Buscar ticks do backend usando o serviço deriv-trading
      const response = await this.backendService.getTicks(symbol);
      
      if (!response || !response.ticks) {
        console.warn('[Datafeed] Nenhum tick retornado do backend');
        return [];
      }

      // Filtrar ticks no range de tempo solicitado
      // from e to estão em segundos Unix
      const filteredTicks = response.ticks.filter(tick => {
        const tickTime = Math.floor(tick.epoch);
        return tickTime >= from && tickTime <= to;
      });

      if (filteredTicks.length === 0) {
        console.warn('[Datafeed] Nenhum tick no range solicitado');
        return [];
      }

      // Converter ticks para barras no formato TradingView
      const bars = this.convertTicksToBars(filteredTicks, resolution);
      return bars;
    } catch (error) {
      console.error('[Datafeed] Erro ao buscar dados históricos:', error);
      return [];
    }
  }

  /**
   * Converte ticks para barras no formato TradingView
   */
  convertTicksToBars(ticks, resolution) {
    if (!ticks || ticks.length === 0) {
      return [];
    }

    // Agrupar ticks por período baseado na resolução
    const resolutionSeconds = this.getResolutionSeconds(resolution);
    
    // Agrupar ticks
    const grouped = new Map();
    
    ticks.forEach(tick => {
      // Validar tick
      if (!tick || tick.epoch === null || tick.epoch === undefined || 
          tick.value === null || tick.value === undefined) {
        return;
      }

      // Converter epoch para segundos (se estiver em milissegundos)
      const epochSeconds = Math.floor(tick.epoch);
      
      // Agrupar por período
      const time = Math.floor(epochSeconds / resolutionSeconds) * resolutionSeconds;
      const value = Number(tick.value);
      
      if (isNaN(value) || !isFinite(value) || value <= 0) {
        return;
      }
      
      if (!grouped.has(time)) {
        grouped.set(time, {
          time,
          open: value,
          high: value,
          low: value,
          close: value,
          volume: 0,
        });
      } else {
        const bar = grouped.get(time);
        bar.high = Math.max(bar.high, value);
        bar.low = Math.min(bar.low, value);
        bar.close = value;
      }
    });

    // Converter para array e ordenar
    const bars = Array.from(grouped.values());
    bars.sort((a, b) => a.time - b.time);

    return bars;
  }

  /**
   * Converte resolução para segundos
   */
  getResolutionSeconds(resolution) {
    const resolutionMap = {
      '1': 60,        // 1 minuto
      '5': 300,       // 5 minutos
      '15': 900,      // 15 minutos
      '30': 1800,     // 30 minutos
      '60': 3600,     // 1 hora
      '240': 14400,   // 4 horas
      '1D': 86400,    // 1 dia
    };
    
    return resolutionMap[resolution] || 60;
  }

  /**
   * Inscreve-se em atualizações em tempo real
   */
  subscribeBars(symbolInfo, resolution, onTick, subscriberUID, onResetCacheNeededCallback) {
    console.log('[Datafeed] Inscrevendo-se em atualizações:', {
      symbol: symbolInfo.name,
      resolution,
      subscriberUID
    });

    // Armazenar callback
    this.subscriptions.set(subscriberUID, {
      symbol: symbolInfo.name,
      resolution,
      onTick,
      onResetCacheNeededCallback
    });

    // Retornar true para indicar que a subscrição foi bem-sucedida
    return true;
  }

  /**
   * Cancela subscrição
   */
  unsubscribeBars(subscriberUID) {
    console.log('[Datafeed] Cancelando subscrição:', subscriberUID);
    this.subscriptions.delete(subscriberUID);
  }

  /**
   * Atualiza com novo tick em tempo real
   */
  updateTick(tick) {
    // Notificar todos os subscribers
    this.subscriptions.forEach((subscription, uid) => {
      try {
        // Converter tick para bar
        const bar = {
          time: Math.floor(tick.epoch / this.getResolutionSeconds(subscription.resolution)) * 
                 this.getResolutionSeconds(subscription.resolution),
          open: tick.value,
          high: tick.value,
          low: tick.value,
          close: tick.value,
          volume: 0,
        };

        subscription.onTick(bar);
      } catch (error) {
        console.error('[Datafeed] Erro ao atualizar tick:', error);
      }
    });
  }

  /**
   * Atualiza símbolo atual
   */
  setSymbol(symbol) {
    this.symbol = symbol;
    // Limpar cache ao mudar símbolo
    this.barsCache.clear();
  }
}

export default TradingViewDatafeed;

