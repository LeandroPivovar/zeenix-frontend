/**
 * Utilitário para carregar contas disponíveis da Deriv
 * Armazena as contas no localStorage para uso posterior sem necessidade de recarregar
 */

const ACCOUNTS_CACHE_KEY = 'deriv_available_accounts_cache';
const CACHE_TIMESTAMP_KEY = 'deriv_accounts_cache_timestamp';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

/**
 * Carrega todas as contas disponíveis da Deriv
 * @returns {Promise<Array>} Array de contas disponíveis
 */
export async function loadAvailableAccounts() {
  try {
    // Verificar se há tokens armazenados
    const tokensByLoginIdStr = localStorage.getItem('deriv_tokens_by_loginid');
    if (!tokensByLoginIdStr) {
      console.log('[AccountsLoader] Nenhum token de conta encontrado');
      return [];
    }

    const tokensByLoginId = JSON.parse(tokensByLoginIdStr);
    const loginIds = Object.keys(tokensByLoginId);
    
    if (loginIds.length === 0) {
      return [];
    }

    // Verificar cache primeiro
    const cachedAccounts = getCachedAccounts();
    if (cachedAccounts && cachedAccounts.length > 0) {
      console.log('[AccountsLoader] Usando contas do cache');
      return cachedAccounts;
    }

    // Buscar informações de cada conta
    const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
    const token = localStorage.getItem('token');
    const appId = localStorage.getItem('deriv_app_id') || '1089';

    // Carregar todas as contas em paralelo para melhor performance
    const accountPromises = loginIds.map(async (loginid) => {
      try {
        const accountToken = tokensByLoginId[loginid];
        
        // Buscar informações da conta
        const response = await fetch(`${apiBase}/broker/deriv/status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            token: accountToken,
            appId: parseInt(appId)
          })
        });

        if (response.ok) {
          const data = await response.json();
          
          // Buscar informações específicas da conta pelo loginid
          let balance = 0;
          let currency = 'USD';
          let isDemo = false;
          let accountFound = false;
          
          // Tentar buscar da estrutura accountsByCurrency primeiro (estrutura principal)
          if (data.accountsByCurrency && typeof data.accountsByCurrency === 'object') {
            for (const curr in data.accountsByCurrency) {
              const accountList = data.accountsByCurrency[curr];
              if (Array.isArray(accountList)) {
                const account = accountList.find(acc => acc.loginid === loginid);
                if (account) {
                  balance = parseFloat(account.value) || 0;
                  currency = curr.toUpperCase();
                  isDemo = account.isDemo || false;
                  accountFound = true;
                  break;
                }
              }
            }
          }
          
          // Se não encontrou em accountsByCurrency, tentar buscar do raw.accounts
          if (!accountFound && data.raw && data.raw.accounts && data.raw.accounts[loginid]) {
            const accountData = data.raw.accounts[loginid];
            currency = (accountData.currency || 'USD').toUpperCase();
            balance = accountData.converted_amount !== null && accountData.converted_amount !== undefined
              ? parseFloat(accountData.converted_amount) || 0
              : parseFloat(accountData.balance || 0);
            isDemo = accountData.demo_account === 1 || accountData.demo_account === true;
            accountFound = true;
          }
          
          // Se ainda não encontrou, usar fallback com saldos agregados
          if (!accountFound) {
            // Determinar se é demo baseado no loginid
            isDemo = loginid.startsWith('VRTC') || loginid.startsWith('VRT');
            
            // Buscar saldo agregado por moeda
            if (isDemo && data.balancesByCurrencyDemo) {
              const currencies = Object.keys(data.balancesByCurrencyDemo);
              if (currencies.length > 0) {
                currency = currencies[0];
                balance = parseFloat(data.balancesByCurrencyDemo[currency]) || 0;
              }
            } else if (!isDemo && data.balancesByCurrencyReal) {
              const currencies = Object.keys(data.balancesByCurrencyReal);
              if (currencies.length > 0) {
                currency = currencies[0];
                balance = parseFloat(data.balancesByCurrencyReal[currency]) || 0;
              }
            } else if (data.balance) {
              balance = typeof data.balance === 'object' ? (parseFloat(data.balance.value) || 0) : (parseFloat(data.balance) || 0);
              currency = data.currency || (data.balance?.currency || 'USD');
            }
          }
          
          // Garantir que sempre temos valores válidos
          balance = parseFloat(balance) || 0;
          currency = (currency || 'USD').toUpperCase();
          
          // Confirmar se é demo baseado no loginid
          if (loginid.startsWith('VRTC') || loginid.startsWith('VRT')) {
            isDemo = true;
          }

          return {
            loginid,
            token: accountToken,
            isDemo,
            balance: balance,
            currency: currency
          };
        }
      } catch (error) {
        console.error(`[AccountsLoader] Erro ao buscar conta ${loginid}:`, error);
        return null;
      }
    });

    // Aguardar todas as requisições
    const results = await Promise.all(accountPromises);
    
    // Filtrar resultados nulos e ordenar: contas reais primeiro, depois demo
    const validAccounts = results
      .filter(account => account !== null)
      .sort((a, b) => {
        if (a.isDemo === b.isDemo) return 0;
        return a.isDemo ? 1 : -1;
      });

    // Armazenar no cache
    setCachedAccounts(validAccounts);

    console.log(`[AccountsLoader] ${validAccounts.length} contas carregadas`);
    return validAccounts;
  } catch (error) {
    console.error('[AccountsLoader] Erro ao carregar contas:', error);
    return [];
  }
}

/**
 * Obtém contas do cache se ainda válidas
 * @returns {Array|null} Array de contas ou null se cache inválido/expirado
 */
function getCachedAccounts() {
  try {
    const cachedStr = localStorage.getItem(ACCOUNTS_CACHE_KEY);
    const timestampStr = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    
    if (!cachedStr || !timestampStr) {
      return null;
    }

    const timestamp = parseInt(timestampStr);
    const now = Date.now();
    
    // Verificar se cache expirou
    if (now - timestamp > CACHE_DURATION) {
      console.log('[AccountsLoader] Cache expirado, recarregando...');
      localStorage.removeItem(ACCOUNTS_CACHE_KEY);
      localStorage.removeItem(CACHE_TIMESTAMP_KEY);
      return null;
    }

    return JSON.parse(cachedStr);
  } catch (error) {
    console.error('[AccountsLoader] Erro ao ler cache:', error);
    return null;
  }
}

/**
 * Armazena contas no cache
 * @param {Array} accounts Array de contas para cachear
 */
function setCachedAccounts(accounts) {
  try {
    localStorage.setItem(ACCOUNTS_CACHE_KEY, JSON.stringify(accounts));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, String(Date.now()));
  } catch (error) {
    console.error('[AccountsLoader] Erro ao salvar cache:', error);
  }
}

/**
 * Limpa o cache de contas
 */
export function clearAccountsCache() {
  localStorage.removeItem(ACCOUNTS_CACHE_KEY);
  localStorage.removeItem(CACHE_TIMESTAMP_KEY);
}

/**
 * Força o recarregamento das contas (ignora cache)
 * @returns {Promise<Array>} Array de contas disponíveis
 */
export async function reloadAvailableAccounts() {
  clearAccountsCache();
  return await loadAvailableAccounts();
}

