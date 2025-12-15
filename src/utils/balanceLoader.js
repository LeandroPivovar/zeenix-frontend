/**
 * Utilitário para carregar saldo da conta Deriv
 * Centraliza o carregamento de saldo para todas as páginas
 */

const BALANCE_CACHE_KEY = 'deriv_balance_cache';
const BALANCE_CACHE_TIMESTAMP_KEY = 'deriv_balance_cache_timestamp';
const BALANCE_CACHE_DURATION = 30 * 1000; // 30 segundos (saldo muda frequentemente)

/**
 * Carrega o saldo da conta Deriv atual
 * @returns {Promise<Object|null>} Objeto com balance, currency, loginid, isDemo, balancesByCurrencyReal, balancesByCurrencyDemo ou null se erro
 */
export async function loadAccountBalance() {
  try {
    // Verificar cache primeiro
    const cachedBalance = getCachedBalance();
    if (cachedBalance) {
      console.log('[BalanceLoader] Usando saldo do cache');
      return cachedBalance;
    }

    const appId = localStorage.getItem('deriv_app_id') || '1089';
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.warn('[BalanceLoader] Token de autenticação não disponível');
      return null;
    }
    
    // Tentar obter token Deriv de várias fontes
    let derivToken = localStorage.getItem('deriv_token');
    let loginid = null;
    
    // Se não encontrou deriv_token direto, tentar obter do deriv_connection
    if (!derivToken) {
      const connectionStr = localStorage.getItem('deriv_connection');
      if (connectionStr) {
        try {
          const connection = JSON.parse(connectionStr);
          loginid = connection.loginid || null;
          derivToken = connection.token || null;
        } catch (e) {
          console.warn('[BalanceLoader] Erro ao parsear deriv_connection:', e);
        }
      }
    }
    
    // Se ainda não encontrou, tentar obter de deriv_tokens_by_loginid
    if (!derivToken) {
      const tokensByLoginIdStr = localStorage.getItem('deriv_tokens_by_loginid');
      if (tokensByLoginIdStr) {
        try {
          const tokensByLoginId = JSON.parse(tokensByLoginIdStr);
          
          // Se tiver loginid, buscar token específico
          if (loginid && tokensByLoginId[loginid]) {
            derivToken = tokensByLoginId[loginid];
            console.log('[BalanceLoader] ✅ Token extraído de deriv_tokens_by_loginid para loginid:', loginid);
          } else if (Object.keys(tokensByLoginId).length > 0) {
            // Se não tiver loginid específico, usar o primeiro token disponível
            const firstLoginId = Object.keys(tokensByLoginId)[0];
            derivToken = tokensByLoginId[firstLoginId];
            loginid = firstLoginId;
            console.log('[BalanceLoader] ✅ Token extraído de deriv_tokens_by_loginid (primeiro disponível):', firstLoginId);
          }
        } catch (e) {
          console.warn('[BalanceLoader] Erro ao parsear deriv_tokens_by_loginid:', e);
        }
      }
    }
    
    if (!derivToken) {
      console.warn('[BalanceLoader] Token Deriv não disponível');
      return null;
    }

    const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
    
    // Tentar primeiro o endpoint /broker/deriv/status (mais completo)
    try {
      const response = await fetch(`${apiBase}/broker/deriv/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          token: derivToken,
          appId: parseInt(appId)
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Extrair informações do saldo
        let balance = 0;
        let currency = 'USD';
        let accountLoginid = loginid || null; // Usar loginid já obtido, se disponível
        let isDemo = false;
        
        // Extrair balancesByCurrencyReal e balancesByCurrencyDemo (essenciais para TopNavbar)
        const balancesByCurrencyReal = data.balancesByCurrencyReal || {};
        const balancesByCurrencyDemo = data.balancesByCurrencyDemo || {};
        
        // Tentar buscar da estrutura accountsByCurrency primeiro
        if (data.accountsByCurrency && typeof data.accountsByCurrency === 'object') {
          // Buscar conta USD real primeiro, depois demo
          const usdReal = data.accountsByCurrency['USD']?.find(acc => !acc.isDemo);
          const usdDemo = data.accountsByCurrency['USD']?.find(acc => acc.isDemo);
          const account = usdReal || usdDemo || Object.values(data.accountsByCurrency).flat()[0];
          
          if (account) {
            balance = parseFloat(account.value) || 0;
            currency = 'USD';
            accountLoginid = account.loginid || accountLoginid;
            isDemo = account.isDemo || false;
          }
        }
        
        // Se não encontrou, tentar buscar do raw.accounts
        if (!accountLoginid && data.raw && data.raw.accounts) {
          const accounts = data.raw.accounts;
          const accountIds = Object.keys(accounts);
          
          // Priorizar conta USD real
          let selectedAccount = null;
          for (const accountId of accountIds) {
            const acc = accounts[accountId];
            if (acc.currency === 'USD' && acc.demo_account !== 1 && acc.demo_account !== true) {
              selectedAccount = acc;
              accountLoginid = accountId;
              break;
            }
          }
          
          // Se não encontrou USD real, buscar qualquer conta
          if (!selectedAccount && accountIds.length > 0) {
            accountLoginid = accountIds[0];
            selectedAccount = accounts[accountLoginid];
          }
          
          if (selectedAccount) {
            currency = (selectedAccount.currency || 'USD').toUpperCase();
            balance = selectedAccount.converted_amount !== null && selectedAccount.converted_amount !== undefined
              ? parseFloat(selectedAccount.converted_amount) || 0
              : parseFloat(selectedAccount.balance || 0);
            isDemo = selectedAccount.demo_account === 1 || selectedAccount.demo_account === true;
          }
        }
        
        // Se ainda não encontrou, usar fallback com saldos agregados
        if (!loginid) {
          // Verificar se há saldo agregado
          if (balancesByCurrencyReal && balancesByCurrencyReal['USD']) {
            balance = parseFloat(balancesByCurrencyReal['USD']) || 0;
            currency = 'USD';
            isDemo = false;
          } else if (balancesByCurrencyDemo && balancesByCurrencyDemo['USD']) {
            balance = parseFloat(balancesByCurrencyDemo['USD']) || 0;
            currency = 'USD';
            isDemo = true;
          } else if (data.balance) {
            balance = typeof data.balance === 'object' ? (parseFloat(data.balance.value) || 0) : (parseFloat(data.balance) || 0);
            currency = data.currency || (data.balance?.currency || 'USD');
          }
          
          // Tentar pegar loginid da conexão salva se ainda não tiver
          if (!accountLoginid) {
            const connectionStr = localStorage.getItem('deriv_connection');
            if (connectionStr) {
              try {
                const connection = JSON.parse(connectionStr);
                accountLoginid = connection.loginid || null;
                if (accountLoginid) {
                  isDemo = accountLoginid.startsWith('VRTC') || accountLoginid.startsWith('VRT');
                }
              } catch (e) {
                // Ignorar erro
              }
            }
          }
        }
        
        // Confirmar se é demo baseado no loginid
        if (accountLoginid && (accountLoginid.startsWith('VRTC') || accountLoginid.startsWith('VRT'))) {
          isDemo = true;
        }
        
        // Se ainda não tiver loginid, usar o que foi obtido anteriormente
        if (!accountLoginid) {
          accountLoginid = loginid;
        }
        
        const balanceData = {
          balance: parseFloat(balance) || 0,
          currency: (currency || 'USD').toUpperCase(),
          loginid: accountLoginid,
          isDemo: isDemo,
          balancesByCurrencyReal: balancesByCurrencyReal,
          balancesByCurrencyDemo: balancesByCurrencyDemo,
          // Manter compatibilidade com estrutura antiga
          balanceValue: parseFloat(balance) || 0
        };
        
        // Armazenar no cache
        setCachedBalance(balanceData);
        
        console.log('[BalanceLoader] Saldo carregado:', balanceData);
        return balanceData;
      }
    } catch (error) {
      console.warn('[BalanceLoader] Erro ao buscar saldo via /broker/deriv/status:', error);
    }
    
    // Fallback: tentar endpoint alternativo
    try {
      const response = await fetch(`${apiBase}/ai/deriv-balance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ derivToken: derivToken })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          const balanceData = {
            balance: parseFloat(result.data.balance) || 0,
            currency: (result.data.currency || 'USD').toUpperCase(),
            loginid: result.data.loginid || null,
            isDemo: result.data.loginid?.startsWith('VRTC') || result.data.loginid?.startsWith('VRT') || false,
            // Criar estruturas vazias se não vierem do endpoint
            balancesByCurrencyReal: result.data.balancesByCurrencyReal || {},
            balancesByCurrencyDemo: result.data.balancesByCurrencyDemo || {},
            balanceValue: parseFloat(result.data.balance) || 0
          };
          
          // Armazenar no cache
          setCachedBalance(balanceData);
          
          console.log('[BalanceLoader] Saldo carregado via fallback:', balanceData);
          return balanceData;
        }
      }
    } catch (error) {
      console.warn('[BalanceLoader] Erro ao buscar saldo via /ai/deriv-balance:', error);
    }
    
    return null;
  } catch (error) {
    console.error('[BalanceLoader] Erro ao carregar saldo:', error);
    return null;
  }
}

/**
 * Obtém saldo do cache se ainda válido
 * @returns {Object|null} Objeto com saldo ou null se cache inválido/expirado
 */
function getCachedBalance() {
  try {
    const cachedStr = localStorage.getItem(BALANCE_CACHE_KEY);
    const timestampStr = localStorage.getItem(BALANCE_CACHE_TIMESTAMP_KEY);
    
    if (!cachedStr || !timestampStr) {
      return null;
    }

    const timestamp = parseInt(timestampStr);
    const now = Date.now();
    
    // Verificar se cache expirou
    if (now - timestamp > BALANCE_CACHE_DURATION) {
      console.log('[BalanceLoader] Cache de saldo expirado, recarregando...');
      localStorage.removeItem(BALANCE_CACHE_KEY);
      localStorage.removeItem(BALANCE_CACHE_TIMESTAMP_KEY);
      return null;
    }

    return JSON.parse(cachedStr);
  } catch (error) {
    console.error('[BalanceLoader] Erro ao ler cache de saldo:', error);
    return null;
  }
}

/**
 * Armazena saldo no cache
 * @param {Object} balanceData Objeto com saldo para cachear
 */
function setCachedBalance(balanceData) {
  try {
    localStorage.setItem(BALANCE_CACHE_KEY, JSON.stringify(balanceData));
    localStorage.setItem(BALANCE_CACHE_TIMESTAMP_KEY, String(Date.now()));
  } catch (error) {
    console.error('[BalanceLoader] Erro ao salvar cache de saldo:', error);
  }
}

/**
 * Limpa o cache de saldo
 */
export function clearBalanceCache() {
  localStorage.removeItem(BALANCE_CACHE_KEY);
  localStorage.removeItem(BALANCE_CACHE_TIMESTAMP_KEY);
}

/**
 * Força o recarregamento do saldo (ignora cache)
 * @returns {Promise<Object|null>} Objeto com saldo ou null se erro
 */
export async function reloadAccountBalance() {
  clearBalanceCache();
  return await loadAccountBalance();
}

