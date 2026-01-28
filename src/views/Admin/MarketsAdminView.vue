<template>
  <div class="admin-markets-view p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-white">Gerenciar Mercados</h1>
      <button 
        @click="syncMarkets" 
        :disabled="loading"
        class="bg-zenix-green hover:bg-green-600 text-black font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
        <span>{{ loading ? 'Sincronizando...' : 'Sincronizar com Deriv' }}</span>
      </button>
    </div>

    <div class="bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-800">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-800 text-gray-400 text-sm uppercase">
              <th class="p-4 font-semibold border-b border-gray-700">Símbolo</th>
              <th class="p-4 font-semibold border-b border-gray-700">Nome</th>
              <th class="p-4 font-semibold border-b border-gray-700">Mercado</th>
              <th class="p-4 font-semibold border-b border-gray-700">Submercado</th>
              <th class="p-4 font-semibold border-b border-gray-700 text-center">Status</th>
            </tr>
          </thead>
          <tbody class="text-gray-300 text-sm">
            <tr v-if="markets.length === 0 && !fetching" class="hover:bg-gray-800/50 transition-colors">
              <td colspan="5" class="p-8 text-center text-gray-500">
                Nenhum mercado encontrado. Clique em sincronizar.
              </td>
            </tr>
            <tr v-else-if="fetching" class="hover:bg-gray-800/50 transition-colors">
              <td colspan="5" class="p-8 text-center text-gray-500">
                Carregando mercados...
              </td>
            </tr>
            <tr 
              v-for="market in markets" 
              :key="market.id" 
              class="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
            >
              <td class="p-4 font-mono text-zenix-green">{{ market.symbol }}</td>
              <td class="p-4 font-medium">{{ market.displayName }}</td>
              <td class="p-4 text-gray-400">{{ market.marketDisplayName || market.market }}</td>
              <td class="p-4 text-gray-400">{{ market.submarketDisplayName || market.submarket }}</td>
              <td class="p-4 text-center">
                <span 
                  class="px-2 py-1 rounded-full text-xs font-bold"
                  :class="market.isActive ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'"
                >
                  {{ market.isActive ? 'ATIVO' : 'INATIVO' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MarketsAdminView',
  data() {
    return {
      markets: [],
      loading: false,
      fetching: true
    }
  },
  mounted() {
    this.fetchMarkets();
  },
  methods: {
    async fetchMarkets() {
      this.fetching = true;
      try {
        const token = localStorage.getItem('token');
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
        
        const res = await fetch(`${apiBaseUrl}/markets`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error('Falha ao buscar mercados');

        this.markets = await res.json();
      } catch (error) {
        console.error('Erro ao buscar mercados:', error);
        this.$root.$toast.error('Erro ao carregar lista de mercados');
      } finally {
        this.fetching = false;
      }
    },
    async syncMarkets() {
      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
        
        const res = await fetch(`${apiBaseUrl}/markets/sync`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || 'Falha na sincronização');
        }

        const data = await res.json();
        this.$root.$toast.success(data.message || 'Sincronização concluída com sucesso!');
        await this.fetchMarkets(); // Refresh list
      } catch (error) {
        console.error('Erro na sincronização:', error);
        this.$root.$toast.error(error.message || 'Erro ao sincronizar com Deriv');
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
/* Scoped styles if needed, mostly using Tailwind */
</style>
