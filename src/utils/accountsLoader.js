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

    // Carregar tokens do backend para garantir que temos os mais recentes
    // Isso resolve o problema de limpar cache ou login em novo dispositivo
    const backendTokens = await fetchBackendTokens();

    // Verificar se há tokens armazenados no localStorage
    const tokensByLoginIdStr = localStorage.getItem('deriv_tokens_by_loginid');
    let tokensByLoginId = {};

    if (tokensByLoginIdStr) {
      tokensByLoginId = JSON.parse(tokensByLoginIdStr);
    }

    // Mesclar tokens do backend com os locais (backend tem prioridade se existirem)
    if (backendTokens) {
      console.log('[AccountsLoader] Mesclando tokens do backend:', backendTokens);
      if (backendTokens.tokenReal) {
        // Não sabemos o loginId ainda, será descoberto ao carregar a conta
        // Mas podemos adicionar ao mapa se conseguirmos descobrir o loginId pela API depois
        // Por enquanto, vamos confiar que o backendTokens servirá de fallback se o localStorage estiver vazio
      }

      // Se não tivermos nenhum token local, mas tivermos do backend, vamos usar os do backend para carregar
      // O problema é que precisamos do LOGINID para fazer a chave do tokensByLoginId.
      // A solução é carregar as contas usando os tokens do backend diretamente se não tivermos loginIds.
    }

    const loginIds = Object.keys(tokensByLoginId);

    // Se temos tokens do backend mas não temos loginIds locais, precisamos tentar carregar usando os tokens do backend
    const backendTokenList = [];
    if (backendTokens && backendTokens.tokenReal) backendTokenList.push({ token: backendTokens.tokenReal, type: 'real' });
    if (backendTokens && backendTokens.tokenDemo) backendTokenList.push({ token: backendTokens.tokenDemo, type: 'demo' });

    console.log(`[AccountsLoader] Tokens locais: ${loginIds.length}, Tokens backend: ${backendTokenList.length}`);

    if (loginIds.length === 0 && backendTokenList.length === 0) {
      console.log('[AccountsLoader] Nenhum token encontrado (local ou backend)');
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
    // Criar uma nova promise para o carregamento
    loadingForceReload = forceReload;
    loadingPromise = loadAccountsFromAPI(loginIds, tokensByLoginId, backendTokenList);

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
async function loadAccountsFromAPI(loginIds, tokensByLoginId, backendTokensList = []) {

  // Buscar informações de cada conta
  const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
  const token = localStorage.getItem('token');
  const appId = localStorage.getItem('deriv_app_id') || '1089';

  // ✅ Armazenar respostas completas para reutilizar depois (evitar requisições duplicadas)
  const responseDataCache = new Map();

  // Coletar todas as contas encontradas, usando um Map para evitar duplicatas
  // Chave será sempre UPPERCASE para evitar duplicatas por case sensitivity
  const allAccountsMap = new Map();

  // Carregar todas as contas em paralelo para melhor performance
  // Combinar loginIds com tokens do backend que podem não estar no localStorage
  const requestsToMake = [...loginIds];

  // Adicionar tokens do backend à lista de requisições se não estiverem associados a um loginId conhecido
  // Como não sabemos o loginId dos tokens do backend, vamos fazer uma request para descobrir
  const backendRequests = backendTokensList.map(item => ({ token: item.token, isBackend: true }));

  // Carregar todas as contas em paralelo
  // Para loginIds conhecidos:
  const knownAccountPromises = requestsToMake.map(async (loginid) => {
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

  // Para tokens do backend (desconhecidos):
  const backendPromises = backendRequests.map(async (item) => {
    try {
      const response = await fetch(`${apiBase}/broker/deriv/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          token: item.token,
          appId: parseInt(appId)
        })
      });

      if (response.ok) {
        const data = await response.json();
        const loginid = data.loginid;

        if (loginid) {
          // Atualizar cache de resposta
          responseDataCache.set(loginid, data);

          // Adicionar ao tokensByLoginId se não existir
          if (!tokensByLoginId[loginid]) {
            tokensByLoginId[loginid] = item.token;
            // Salvar no localStorage atualizado
            localStorage.setItem('deriv_tokens_by_loginid', JSON.stringify(tokensByLoginId));
          }

          console.log(`[AccountsLoader] Conta descoberta via backend token: ${loginid}`);

          // Retornar estrutura compatível
          return {
            loginid: loginid,
            token: item.token,
            // Dados preliminares, serão refinados pelo processamento raw
            isDemo: loginid.toUpperCase().startsWith('VRT'),
            balance: 0,
            currency: 'USD'
          };
        }
      }
      return null;
    } catch (error) {
      console.error(`[AccountsLoader] Erro ao buscar token do backend:`, error);
      return null;
    }
  });

  // Aguardar todas as requisições (conhecidas + backend)
  const accountPromises = [...knownAccountPromises, ...backendPromises];
  const results = await Promise.all(accountPromises);

  // Adicionar resultados iniciais ao mapa
  for (const result of results) {
    if (result && result.loginid) {
      allAccountsMap.set(result.loginid.toUpperCase(), result);
    }
  }

  // ✅ Agora, buscar todas as contas do raw.accounts de QUALQUER resposta válida (apenas 1 é suficiente se tiver tudo)
  // ✅ Agora, buscar todas as contas do raw.accounts de QUALQUER resposta válida (apenas 1 é suficiente se tiver tudo)
  // Verificar todos os loginIds agora disponíveis (incluindo os descobertos)
  const allAvailableLoginIds = Array.from(allAccountsMap.keys());

  for (let i = 0; i < allAvailableLoginIds.length; i++) {
    const loginid = allAvailableLoginIds[i];
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
  return await loadAvailableAccounts(true);
}

/**
 * Busca tokens armazenados no backend
 */
async function fetchBackendTokens() {
  try {
    const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
    const token = localStorage.getItem('token');

    if (!token) return null;

    const response = await fetch(`${apiBase}/settings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      return {
        tokenReal: data.tokenReal,
        tokenDemo: data.tokenDemo
      };
    }
    return null;
  } catch (error) {
    console.error('[AccountsLoader] Erro ao buscar tokens do backend:', error);
    return null;
  }
}
