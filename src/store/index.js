import { createStore } from 'vuex'

export default createStore({
  state: {
    accountInfo: null,
    accountType: 'real',
    tradeCurrency: 'USD',
    isFictitiousBalanceActive: false,
    fictitiousBalance: 10000,
    loadingBalance: false
  },
  getters: {
    currentBalance: (state) => {
      if (!state.accountInfo) return 0;

      const balancesReal = state.accountInfo.balancesByCurrencyReal || {};
      const balancesDemo = state.accountInfo.balancesByCurrencyDemo || {};

      if (state.accountType === 'demo') {
        const demoBal = Number(balancesDemo['USD']) || 0;
        return state.isFictitiousBalanceActive ? demoBal + state.fictitiousBalance : demoBal;
      }

      // Real
      const usdReal = balancesReal['USD'];
      if (usdReal !== undefined && Number(usdReal) > 0) return Number(usdReal);

      // Fallback
      return Object.values(balancesReal).find(b => Number(b) > 0) || Number(state.accountInfo.balance) || 0;
    },
    isAccountDemo: (state) => state.accountType === 'demo'
  },
  mutations: {
    SET_ACCOUNT_INFO(state, info) {
      state.accountInfo = info;
    },
    SET_ACCOUNT_TYPE(state, type) {
      state.accountType = type;
    },
    SET_TRADE_CURRENCY(state, currency) {
      state.tradeCurrency = currency;
    },
    SET_FICTITIOUS_BALANCE(state, { active, amount }) {
      state.isFictitiousBalanceActive = active;
      state.fictitiousBalance = amount;
    },
    SET_LOADING_BALANCE(state, loading) {
      state.loadingBalance = loading;
    },
    UPDATE_BALANCE(state, { currency, amount, isDemo }) {
      if (!state.accountInfo) return;

      if (isDemo) {
        if (!state.accountInfo.balancesByCurrencyDemo) state.accountInfo.balancesByCurrencyDemo = {};
        state.accountInfo.balancesByCurrencyDemo[currency] = amount;
      } else {
        if (!state.accountInfo.balancesByCurrencyReal) state.accountInfo.balancesByCurrencyReal = {};
        state.accountInfo.balancesByCurrencyReal[currency] = amount;
      }
    }
  },
  actions: {
    updateAccountState({ commit }, payload) {
      if (payload.info) commit('SET_ACCOUNT_INFO', payload.info);
      if (payload.type) commit('SET_ACCOUNT_TYPE', payload.type);
      if (payload.currency) commit('SET_TRADE_CURRENCY', payload.currency);
    },
    setFictitiousSettings({ commit }, settings) {
      commit('SET_FICTITIOUS_BALANCE', settings);
    }
  }
})
