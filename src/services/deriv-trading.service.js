/**
 * Serviço para comunicação com backend Deriv Trading
 * Substitui a lógica de WebSocket direto por REST/SSE
 */
import { sharedAccountState } from '../store/sharedAccountState';

// API_BASE_URL - garantir que termine com /api
// O backend usa setGlobalPrefix('api'), então todas as rotas precisam de /api
const rawApiUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
let API_BASE_URL = rawApiUrl.trim().replace(/\/$/, ''); // Remove trailing slash

// Se não termina com /api, adicionar
if (!API_BASE_URL.endsWith('/api')) {
  // Se termina com /api/api, remover duplicado
  if (API_BASE_URL.endsWith('/api/api')) {
    API_BASE_URL = API_BASE_URL.replace(/\/api\/api$/, '/api');
  } else {
    API_BASE_URL = API_BASE_URL + '/api';
  }
}

class DerivTradingService {
  constructor() {
    this.eventSource = null;
    this.listeners = new Map();
    this.isConnected = false;
    this.token = null;
  }

  /**
   * Conecta ao backend Deriv via WebSocket gerenciado
   */
  async connect(derivToken, loginid) {
    // derivToken é o token da Deriv API, não o JWT
    // O JWT de autenticação deve vir do localStorage
    const authToken = localStorage.getItem('token');

    if (!authToken) {
      throw new Error('Token de autenticação não encontrado');
    }

    if (!derivToken) {
      throw new Error('Token Deriv não encontrado');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/broker/deriv/trading/connect`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: derivToken, loginid }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao conectar');
      }

      const data = await response.json();
      this.isConnected = true;
      return data;
    } catch (error) {
      console.error('[DerivTrading] Erro ao conectar:', error);
      throw error;
    }
  }

  /**
   * Inicia stream SSE para receber dados em tempo real
   */
  async startStream(onMessage, derivToken) {
    if (this.eventSource) {
      this.stopStream();
    }

    const authToken = this.token || localStorage.getItem('token');
    if (!authToken) {
      throw new Error('Token de autenticação não encontrado');
    }

    // Obter token temporário para SSE (mais seguro que passar JWT via query)
    let sseToken;
    try {
      const tokenResponse = await fetch(`${API_BASE_URL}/broker/deriv/trading/sse-token`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!tokenResponse.ok) {
        throw new Error('Erro ao obter token SSE');
      }

      const tokenData = await tokenResponse.json();
      sseToken = tokenData.token;
    } catch (error) {
      console.error('[DerivTrading] Erro ao obter token SSE:', error);
      throw new Error('Não foi possível iniciar stream SSE');
    }

    // EventSource não suporta headers, então usamos token temporário via query
    const url = `${API_BASE_URL}/broker/deriv/trading/stream?token=${encodeURIComponent(sseToken)}${derivToken ? `&derivToken=${encodeURIComponent(derivToken)}` : ''}`;

    this.eventSource = new EventSource(url);

    this.eventSource.onopen = () => {
      console.log('[DerivTrading] SSE conectado');
      this.isConnected = true;
    };

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (onMessage) {
          onMessage(data);
        }
        // Notificar listeners específicos por tipo
        const typeListeners = this.listeners.get(data.type);
        if (typeListeners) {
          typeListeners.forEach(listener => listener(data.data || data));
        }

        // Se for do tipo 'log', também notificar quem escuta 'log'
        if (data.type === 'log') {
          const logListeners = this.listeners.get('log');
          if (logListeners) {
            logListeners.forEach(listener => listener(data.data));
          }
        }

        // ✅ NOVO: Atualizar sharedAccountState se receber saldo (Real-time)
        if (data.type === 'balance' && data.data) {
          console.log('[DerivTrading] 💰 Atualização de saldo via SSE:', data.data);
          sharedAccountState.updateBalance({
            currency: data.data.currency || 'USD',
            amount: parseFloat(data.data.balance || data.data.value),
            isDemo: data.data.isDemo
          });
        }

      } catch (error) {
        console.error('[DerivTrading] Erro ao processar mensagem SSE:', error);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error('[DerivTrading] Erro no SSE:', error);
      this.isConnected = false;
    };

    return this.eventSource;
  }

  /**
   * Para o stream SSE
   */
  stopStream() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      this.isConnected = false;
    }
  }

  /**
   * Adiciona listener para eventos específicos
   */
  on(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType).push(callback);
  }

  /**
   * Remove listener
   */
  off(eventType, callback) {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Inscreve-se em símbolo para receber ticks
   */
  async subscribeSymbol(symbol, token, loginid, count) {
    const authToken = this.token || localStorage.getItem('token');

    try {
      const response = await fetch(`${API_BASE_URL}/broker/deriv/trading/subscribe-symbol`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbol, token, loginid, count }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao inscrever-se no símbolo');
      }

      return await response.json();
    } catch (error) {
      console.error('[DerivTrading] Erro ao inscrever-se no símbolo:', error);
      throw error;
    }
  }

  /**
   * Obtém ticks atuais (polling)
   */
  async getTicks(symbol) {
    const token = this.token || localStorage.getItem('token');

    try {
      const response = await fetch(`${API_BASE_URL}/broker/deriv/trading/ticks?symbol=${encodeURIComponent(symbol)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao obter ticks');
      }

      return await response.json();
    } catch (error) {
      console.error('[DerivTrading] Erro ao obter ticks:', error);
      throw error;
    }
  }

  /**
   * Inscreve-se em proposta
   */
  async getProposal(config) {
    const authToken = localStorage.getItem('token');
    if (!authToken) {
      throw new Error('Token de autenticação não encontrado');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/broker/deriv/trading/proposal`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbol: config.symbol,
          contractType: config.contractType,
          duration: config.duration,
          durationUnit: config.durationUnit,
          amount: config.amount,
          barrier: config.barrier,
          multiplier: config.multiplier,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao buscar proposta');
      }

      const data = await response.json();
      return data.proposal;
    } catch (error) {
      console.error('[DerivTrading] Erro ao buscar proposta:', error);
      throw error;
    }
  }

  async getDefaultValues(symbol, contractType) {
    const authToken = localStorage.getItem('token');
    if (!authToken) {
      throw new Error('Token de autenticação não encontrado');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/broker/deriv/trading/default-values`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbol,
          contractType,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao buscar valores padrão');
      }

      const data = await response.json();
      return data.defaultValues;
    } catch (error) {
      console.error('[DerivTrading] Erro ao buscar valores padrão:', error);
      throw error;
    }
  }

  async subscribeProposal(config) {
    const token = this.token || localStorage.getItem('token');

    try {
      const response = await fetch(`${API_BASE_URL}/broker/deriv/trading/subscribe-proposal`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao inscrever-se em proposta');
      }

      return await response.json();
    } catch (error) {
      console.error('[DerivTrading] Erro ao inscrever-se em proposta:', error);
      throw error;
    }
  }

  /**
   * Executa compra de contrato
   */
  async buyContract(config) {
    const authToken = localStorage.getItem('token');
    if (!authToken) {
      throw new Error('Token de autenticação não encontrado');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/broker/deriv/trading/buy`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbol: config.symbol,
          contractType: config.contractType,
          duration: config.duration,
          durationUnit: config.durationUnit,
          amount: config.amount,
          proposalId: config.proposalId, // Opcional, se não fornecido o backend busca
          loginid: config.loginid, // Opcional, força o uso desta conta
          token: config.token, // ✅ CRUCIAL: Passar token para o backend
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao comprar contrato');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('[DerivTrading] Erro ao comprar contrato:', error);
      throw error;
    }
  }

  // Método antigo mantido para compatibilidade
  async buyContractOld(proposalId, price) {
    const token = this.token || localStorage.getItem('token');

    try {
      const response = await fetch(`${API_BASE_URL}/broker/deriv/trading/buy`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ proposalId, price }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao comprar contrato');
      }

      return await response.json();
    } catch (error) {
      console.error('[DerivTrading] Erro ao comprar contrato:', error);
      throw error;
    }
  }

  /**
   * Solicita símbolos ativos (via WebSocket interno do backend)
   */
  async requestActiveSymbols() {
    const authToken = this.token || localStorage.getItem('token');
    if (!authToken) {
      throw new Error('Token de autenticação não encontrado');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/broker/deriv/trading/active-symbols`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao solicitar símbolos');
      }

      return await response.json();
    } catch (error) {
      console.error('[DerivTrading] Erro ao solicitar símbolos:', error);
      throw error;
    }
  }

  /**
   * Executa venda de contrato
   */
  async sellContract(contractId) {
    const authToken = localStorage.getItem('token');
    if (!authToken) {
      throw new Error('Token de autenticação não encontrado');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/broker/deriv/trading/sell`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contractId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao vender contrato');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('[DerivTrading] Erro ao vender contrato:', error);
      throw error;
    }
  }

  // Método antigo mantido para compatibilidade
  async sellContractOld(contractId, price) {
    const token = this.token || localStorage.getItem('token');

    try {
      const response = await fetch(`${API_BASE_URL}/broker/deriv/trading/sell`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contractId, price }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao vender contrato');
      }

      return await response.json();
    } catch (error) {
      console.error('[DerivTrading] Erro ao vender contrato:', error);
      throw error;
    }
  }

  /**
   * Busca contratos disponíveis
   */
  async getContracts(symbol, currency = 'USD') {
    const token = this.token || localStorage.getItem('token');

    try {
      const response = await fetch(`${API_BASE_URL}/broker/deriv/trading/get-contracts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbol, currency, token }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao buscar contratos');
      }

      return await response.json();
    } catch (error) {
      console.error('[DerivTrading] Erro ao buscar contratos:', error);
      throw error;
    }
  }

  /**
   * Cancela uma subscription específica
   */
  async cancelSubscription(subscriptionId) {
    const token = this.token || localStorage.getItem('token');

    try {
      const response = await fetch(`${API_BASE_URL}/broker/deriv/trading/cancel-subscription`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao cancelar subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('[DerivTrading] Erro ao cancelar subscription:', error);
      throw error;
    }
  }

  /**
   * Cancela subscription de ticks
   */
  async cancelTickSubscription() {
    const token = this.token || localStorage.getItem('token');

    try {
      const response = await fetch(`${API_BASE_URL}/broker/deriv/trading/cancel-tick-subscription`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao cancelar subscription de ticks');
      }

      return await response.json();
    } catch (error) {
      console.error('[DerivTrading] Erro ao cancelar subscription de ticks:', error);
      throw error;
    }
  }

  /**
   * Cancela subscription de proposta
   */
  async cancelProposalSubscription() {
    const token = this.token || localStorage.getItem('token');

    try {
      const response = await fetch(`${API_BASE_URL}/broker/deriv/trading/cancel-proposal-subscription`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao cancelar subscription de proposta');
      }

      return await response.json();
    } catch (error) {
      console.error('[DerivTrading] Erro ao cancelar subscription de proposta:', error);
      throw error;
    }
  }

  /**
   * Desconecta tudo
   */
  disconnect() {
    this.stopStream();
    this.listeners.clear();
    this.isConnected = false;
  }
}

// Exportar instância singleton
export default new DerivTradingService();

