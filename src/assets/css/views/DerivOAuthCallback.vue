<template>
  <main class="oauth-callback">
    <div class="card">
      <div class="indicator" v-if="!error">
        <span class="spinner"></span>
        <p>Conectando aos Servidores...</p>
      </div>
      <p v-else class="error">{{ error }}</p>
    </div>
  </main>
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
      localStorage.setItem('deriv_connection', JSON.stringify({
        ...data,
        timestamp: Date.now(),
      }));

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

<style scoped>
.oauth-callback {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(145deg,
      #0B0B0B 0%,
      #0E0F0E 20%,
      #0D0E0D 40%,
      #111111 60%,
      #0E0F0E 80%,
      #0B0B0B 100%);
  color: #fff;
  position: relative;
}

.oauth-callback::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
      radial-gradient(ellipse at 30% 20%,
          rgba(34, 197, 94, 0.08) 0%,
          transparent 60%),
      radial-gradient(ellipse at 70% 80%,
          rgba(34, 197, 94, 0.06) 0%,
          transparent 60%);
  pointer-events: none;
  z-index: 0;
}

.card {
  background: rgba(26, 26, 26, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  max-width: 360px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  position: relative;
  z-index: 1;
}

.indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spinner {
  width: 38px;
  height: 38px;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top-color: #22C55E;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.indicator p {
  color: #DFDFDF;
  font-size: 14px;
  margin-top: 16px;
}

.error {
  color: #f87171;
  font-weight: 600;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
