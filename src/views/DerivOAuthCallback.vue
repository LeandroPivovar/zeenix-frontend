<template>
  <div class="layout-home">
    <!-- Fundo animado: luzes e partículas (Igual HomeView) -->
    <div class="animated-light-primary"></div>
    <div class="animated-light-secondary"></div>
    <div class="particles">
      <span v-for="n in 12" :key="n" class="particle"></span>
    </div>

    <main class="content loading-content">
      <div v-if="!error" class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">Concluindo conexão com a Deriv...</p>
      </div>
      <div v-else class="error-container">
         <p class="error">{{ error }}</p>
         <p class="redirect-text">Redirecionando...</p>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'DerivOAuthCallback',
  data() {
    return {
      error: '',
    };
  },
  async mounted() {
    const params = new URLSearchParams(window.location.search);
    const appToken = localStorage.getItem('token');

    if (!appToken) {
      this.error = 'Sessão expirada. Faça login novamente.';
      this.redirect('/login');
      return;
    }

    const storedState = localStorage.getItem('deriv_oauth_state');
    const stateParam = params.get('state');
    if (storedState && stateParam !== storedState) {
      this.error = 'Solicitação inválida. Tente conectar novamente.';
      localStorage.removeItem('deriv_oauth_state');
      this.redirect('/dashboard');
      return;
    }
    localStorage.removeItem('deriv_oauth_state');

    const accounts = [];
    for (let index = 1; ; index += 1) {
      const loginid = params.get(`acct${index}`);
      const token = params.get(`token${index}`);
      const currency = (params.get(`cur${index}`) || '').toUpperCase();
      if (!loginid || !token) break;
      accounts.push({ loginid, token, currency });
    }

    if (!accounts.length) {
      this.error = 'Nenhum token retornado pela Deriv.';
      this.redirect('/dashboard');
      return;
    }

    window.history.replaceState({}, document.title, `${window.location.pathname}`);

    try {
      const apiBase = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
      const res = await fetch(`${apiBase}/broker/deriv/connect/oauth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${appToken}`,
        },
        body: JSON.stringify({ accounts }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || 'Falha ao concluir conexão OAuth');
      }

      const data = await res.json();
      const chosenAccount = accounts.find(account => account.loginid === data.loginid) || accounts[0];
      
      // Armazenar token da conta escolhida como padrão
      if (chosenAccount?.token) {
        localStorage.setItem('deriv_token', chosenAccount.token);
      }
      
      // Armazenar todos os tokens mapeados por loginid para uso futuro
      const tokensByLoginId = {};
      accounts.forEach(account => {
        if (account.loginid && account.token) {
          tokensByLoginId[account.loginid] = account.token;
        }
      });
      localStorage.setItem('deriv_tokens_by_loginid', JSON.stringify(tokensByLoginId));
      
      if (data?.appId) {
        localStorage.setItem('deriv_app_id', String(data.appId));
      } else if (!localStorage.getItem('deriv_app_id')) {
        localStorage.setItem('deriv_app_id', '1089');
      }
      // Determinar isDemo baseado no loginid (mais confiável)
      const loginid = data.loginid || chosenAccount?.loginid || '';
      const isDemo = loginid.startsWith('VRTC') || loginid.startsWith('VRT');
      
      localStorage.setItem('deriv_connection', JSON.stringify({
        ...data,
        loginid: loginid,
        isDemo: isDemo,
        timestamp: Date.now(),
      }));

      // Carregar contas disponíveis em background e salvar no cache
      try {
        const { loadAvailableAccounts } = await import('../utils/accountsLoader');
        loadAvailableAccounts().then(() => {
          console.log('[DerivOAuthCallback] Contas carregadas e salvas no cache');
        }).catch(err => {
          console.warn('[DerivOAuthCallback] Erro ao carregar contas em background:', err);
        });
      } catch (error) {
        console.warn('[DerivOAuthCallback] Erro ao importar accountsLoader:', error);
      }

      this.$router.replace('/dashboard');
    } catch (error) {
      this.error = error?.message || 'Não foi possível finalizar a conexão com a Deriv.';
      this.redirect('/dashboard');
    }
  },
  methods: {
    redirect(path) {
      setTimeout(() => this.$router.replace(path), 2500);
    },
  },
};
</script>

<style scoped src="../assets/css/views/homeView.css"></style>

<style scoped>
/* Estilos adicionais específicos para o loading se não estiverem no CSS global/home */
.loading-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100%;
}

.loading-container, .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    border-top-color: #22c55e;
    animation: spin 1s ease-in-out infinite;
}

.loading-text {
    color: #9ca3af;
    font-size: 14px;
    font-weight: 500;
}

.error {
    color: #ef4444;
    font-weight: 600;
    text-align: center;
    max-width: 300px;
}

.redirect-text {
    color: #6b7280;
    font-size: 12px;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
</style>
