/**
 * Utilitário para carregar contas disponíveis da Deriv
 * Armazena as contas no localStorage para uso posterior sem necessidade de recarregar
 */

const ACCOUNTS_CACHE_KEY = 'deriv_available_accounts_cache';
const CACHE_TIMESTAMP_KEY = 'deriv_accounts_cache_timestamp';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Lock para evitar múltiplas chamadas simultâneas
let loadingPromise = null;
let loadingForceReload = false;

/**
 * Carrega todas as contas disponíveis da Deriv
 * @returns {Promise<Array>} Array de contas disponíveis
 */
export async function loadAvailableAccounts(forceReload = false) {
  try {
    // Se forçar recarregamento, limpar cache primeiro
    if (forceReload) {
      clearAccountsCache();
      console.log('[AccountsLoader] Cache limpo, forçando recarregamento');
    }

    // Verificar cache primeiro (apenas se não forçar recarregamento)
    // IMPORTANTE: Verificar cache ANTES de qualquer outra coisa para retornar imediatamente
    if (!forceReload) {
      const cachedAccounts = getCachedAccounts();
      if (cachedAccounts && cachedAccounts.length > 0) {
        console.log('[AccountsLoader] ✅ Retornando contas do cache imediatamente:', cachedAccounts.length);
        return cachedAccounts;
      }
    }

    // Verificar se há tokens armazenados
    const tokensByLoginIdStr = localStorage.getItem('deriv_tokens_by_loginid');
    if (!tokensByLoginIdStr) {
      console.log('[AccountsLoader] Nenhum token de conta encontrado');
      return [];
    }

    const tokensByLoginId = JSON.parse(tokensByLoginIdStr);
    const loginIds = Object.keys(tokensByLoginId);

    console.log(`[AccountsLoader] Tokens encontrados: ${loginIds.length}`, loginIds);

    if (loginIds.length === 0) {
      return [];
    }

    // Se já há uma requisição em andamento, aguardar o resultado dela
    // Isso evita múltiplas requisições simultâneas
    if (loadingPromise) {
      // Se a requisição em andamento é um forceReload, aguardar ela
      // Se não, verificar cache novamente antes de aguardar
      if (loadingForceReload || forceReload) {
        console.log('[AccountsLoader] ⏳ Aguardando requisição em andamento...');
        return await loadingPromise;
      } else {
        // Verificar cache novamente antes de aguardar
        const cachedAccounts = getCachedAccounts();
        if (cachedAccounts && cachedAccounts.length > 0) {
          console.log('[AccountsLoader] ✅ Cache encontrado enquanto aguardava, retornando imediatamente');
          return cachedAccounts;
        }
        console.log('[AccountsLoader] ⏳ Aguardando requisição em andamento...');
        return await loadingPromise;
      }
    }

    // Criar uma nova promise para o carregamento
    loadingForceReload = forceReload;
    loadingPromise = loadAccountsFromAPI(loginIds, tokensByLoginId);

    try {
      const result = await loadingPromise;
      return result;
    } finally {
      // Limpar a promise após completar
      loadingPromise = null;
      loadingForceReload = false;
    }
  } catch (error) {
    // Limpar a promise em caso de erro
    loadingPromise = null;
    loadingForceReload = false;
    console.error('[AccountsLoader] Erro ao carregar contas:', error);
    return [];
  }
}

/**
 * Função interna para carregar contas da API
 * @private
 */
async function loadAccountsFromAPI(loginIds, tokensByLoginId) {

  // Buscar informações de cada conta
  const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
  const token = localStorage.getItem('token');
  const appId = localStorage.getItem('deriv_app_id') || '1089';

  // ✅ Armazenar respostas completas para reutilizar depois (evitar requisições duplicadas)
  const responseDataCache = new Map();

  // Coletar todas as contas encontradas, usando um Map para evitar duplicatas
  // Chave será sempre UPPERCASE para evitar duplicatas por case sensitivity
  const allAccountsMap = new Map();

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

        // ✅ Armazenar resposta completa no cache para reutilizar depois
        responseDataCache.set(loginid, data);

        console.log(`[AccountsLoader] Buscando conta ${loginid}, resposta obtida`);

        // Buscar informações específicas da conta pelo loginid (preliminar)
        let balance = 0;
        let currency = 'USD';
        let isDemo = false;
        let accountFound = false;

        // Tentar buscar do raw.accounts
        if (data.raw && data.raw.accounts && data.raw.accounts[loginid]) {
          const accountData = data.raw.accounts[loginid];
          currency = (accountData.currency || 'USD').toUpperCase();
          balance = accountData.converted_amount !== null && accountData.converted_amount !== undefined
            ? parseFloat(accountData.converted_amount) || 0
            : parseFloat(accountData.balance || 0);
          isDemo = accountData.demo_account === 1 || accountData.demo_account === true;
          accountFound = true;
        }

        // Fallbacks básicos se não encontrar em raw.accounts
        if (!accountFound) {
          if (data.accountsByCurrency) {
            // tentar achar
          }
          if (data.balance) {
            balance = typeof data.balance === 'object' ? (parseFloat(data.balance.value) || 0) : (parseFloat(data.balance) || 0);
          }
          isDemo = loginid.toUpperCase().startsWith('VRT');
        }

        return {
          loginid: loginid,
          token: accountToken,
          isDemo,
          balance: parseFloat(balance) || 0,
          currency: (currency || 'USD').toUpperCase()
        };
      }
    } catch (error) {
      console.error(`[AccountsLoader] Erro ao buscar conta ${loginid}:`, error);
      return null;
    }
  });

  // Aguardar todas as requisições
  const results = await Promise.all(accountPromises);

  // Adicionar resultados iniciais ao mapa
  for (const result of results) {
    if (result && result.loginid) {
      allAccountsMap.set(result.loginid.toUpperCase(), result);
    }
  }

  // ✅ Agora, buscar todas as contas do raw.accounts de QUALQUER resposta válida (apenas 1 é suficiente se tiver tudo)
  for (let i = 0; i < loginIds.length; i++) {
    const loginid = loginIds[i];
    const data = responseDataCache.get(loginid);

    if (data && data.raw && data.raw.accounts) {
      const rawAccountsKeys = Object.keys(data.raw.accounts);
      console.log(`[AccountsLoader] Encontrado raw.accounts completo via ${loginid} com ${rawAccountsKeys.length} contas`);

      for (const accLoginId in data.raw.accounts) {
        const accountData = data.raw.accounts[accLoginId];
        const accToken = tokensByLoginId[accLoginId] || tokensByLoginId[loginid]; // Fallback token

        const normalizedId = accLoginId.toUpperCase();

        // Atualizar ou adicionar - SOBRESCREVE se já existir (garante dados oficiais do raw)
        allAccountsMap.set(normalizedId, {
          loginid: accLoginId,
          token: accToken,
          isDemo: accountData.demo_account === 1 || accountData.demo_account === true,
          balance: accountData.converted_amount !== null && accountData.converted_amount !== undefined
            ? parseFloat(accountData.converted_amount) || 0
            : parseFloat(accountData.balance || 0),
          currency: (accountData.currency || 'USD').toUpperCase()
        });
      }

      // Se já processamos um raw.accounts completo, podemos parar
      break;
    }
  }

  // Converter Map para Array e ordenar
  const validAccounts = Array.from(allAccountsMap.values())
    .sort((a, b) => {
      // Ordenar: Real primeiro, depois Demo
      if (a.isDemo === b.isDemo) return 0;
      return a.isDemo ? 1 : -1;
    });

  // Armazenar no cache
  setCachedAccounts(validAccounts);

  console.log(`[AccountsLoader] ${validAccounts.length} contas carregadas e cacheadas.`);
  return validAccounts;
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
