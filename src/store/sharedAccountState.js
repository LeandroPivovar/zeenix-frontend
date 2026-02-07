import { reactive } from 'vue';

/**
 * Estado reativo compartilhado para informações de conta e saldo.
 * Permite que componentes distantes (como IA e TopNavbar) se comuniquem 
 * instantaneamente sem necessidade de Vuex ou props complexas.
 */
export const sharedAccountState = reactive({
    // Dados brutos da conta
    info: null,

    // Configurações de exibição
    accountType: 'real',
    tradeCurrency: 'USD',

    // Saldo Fictício (Master Trader)
    isFictitiousBalanceActive: false,
    fictitiousBalance: 10000,

    // Status de carregamento
    loadingBalance: false,

    // Função auxiliar para atualizar o saldo rapidamente
    updateBalance(data) {
        if (!this.info) return;

        const { currency, amount, isDemo } = data;

        if (isDemo) {
            if (!this.info.balancesByCurrencyDemo) this.info.balancesByCurrencyDemo = {};
            this.info.balancesByCurrencyDemo[currency || 'USD'] = amount;
        } else {
            if (!this.info.balancesByCurrencyReal) this.info.balancesByCurrencyReal = {};
            this.info.balancesByCurrencyReal[currency || 'USD'] = amount;
        }

        // Forçar reatividade se necessário
        this.info = { ...this.info };
    }
});
