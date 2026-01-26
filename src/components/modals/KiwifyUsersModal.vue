<template>
    <transition name="modal-fade">
        <div v-if="visible" class="kiwify-modal-overlay" @click.self="close">
            <div class="kiwify-modal">
                <div class="modal-header">
                    <h2 class="modal-title">
                        <i class="fas fa-sync-alt text-zenix-primary mr-2"></i>
                        Usuários Kiwify
                    </h2>
                    <button class="close-button" @click="close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="modal-body">
                    <div v-if="loading" class="loading-state">
                        <div class="spinner"></div>
                        <p>Sincronizando com Kiwify...</p>
                    </div>

                    <div v-else-if="error" class="error-state">
                        <i class="fas fa-exclamation-circle text-red-500 text-4xl mb-4"></i>
                        <p>{{ error }}</p>
                        <button class="btn-retry" @click="fetchUsers">Tentar Novamente</button>
                    </div>

                    <div v-else class="content-wrapper">
                        <div class="summary-bar">
                            <span class="summary-item">Total encontrados: <strong>{{ users.length }}</strong></span>
                            <button class="btn-copy" @click="copyToClipboard">
                                <i class="fas fa-copy mr-2"></i> Copiar Lista
                            </button>
                        </div>

                        <div class="table-container">
                            <table class="users-table">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Email</th>
                                        <th>Telefone</th>
                                        <th>Produto</th>
                                        <th>Offer ID</th>
                                        <th>Offer Name</th>
                                        <th>Raw</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(user, index) in users" :key="index">
                                        <td>{{ user.name }}</td>
                                        <td>{{ user.email }}</td>
                                        <td>{{ user.phone || '-' }}</td>
                                        <td>{{ user.product || '-' }}</td>
                                        <td>{{ user.offer_id || '-' }}</td>
                                        <td>{{ user.offer_name || '-' }}</td>
                                        <td>
                                            <div class="raw-data">
                                                <pre>{{ JSON.stringify(user.raw, null, 2) }}</pre>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'KiwifyUsersModal',
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    emits: ['close'],
    data() {
        return {
            loading: false,
            error: null,
            users: []
        };
    },
    watch: {
        visible(val) {
            if (val) {
                this.fetchUsers();
            }
        }
    },
    methods: {
        close() {
            this.$emit('close');
            this.users = [];
            this.error = null;
        },
        async fetchUsers() {
            this.loading = true;
            this.error = null;
            try {
                const token = localStorage.getItem('token');
                const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                
                const response = await fetch(`${baseUrl}/kiwify/users`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Falha ao buscar usuários da Kiwify');
                }

                const data = await response.json();
                this.users = data.users || [];
            } catch (err) {
                console.error('Erro Kiwify:', err);
                this.error = 'Não foi possível sincronizar os dados. Verifique as credenciais no backend.';
            } finally {
                this.loading = false;
            }
        },
        copyToClipboard() {
            const header = 'Nome\tEmail\tTelefone\tProduto\tOffer ID\tOffer Name\n';
            const rows = this.users.map(u => `${u.name}\t${u.email}\t${u.phone || ''}\t${u.product || ''}\t${u.offer_id || ''}\t${u.offer_name || ''}`).join('\n');
            const text = header + rows;
            
            navigator.clipboard.writeText(text).then(() => {
                this.$root.$toast.success('Lista copiada para a área de transferência!');
            }).catch(() => {
                this.$root.$toast.error('Erro ao copiar lista.');
            });
        }
    }
}
</script>

<style scoped>
.kiwify-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    backdrop-filter: blur(4px);
}

.kiwify-modal {
    background: #0B0B0B;
    width: 90%;
    max-width: 800px;
    height: 80vh;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.modal-header {
    padding: 20px 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #111;
}

.modal-title {
    font-family: 'Outfit', sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: #fff;
    margin: 0;
    display: flex;
    align-items: center;
}

.close-button {
    background: none;
    border: none;
    color: #888;
    font-size: 20px;
    cursor: pointer;
    transition: color 0.2s;
}

.close-button:hover {
    color: #fff;
}

.modal-body {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 0;
}

.loading-state, .error-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #888;
    height: 100%;
    padding: 40px;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(34, 197, 94, 0.3);
    border-radius: 50%;
    border-top-color: #22C55E;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.btn-retry {
    margin-top: 16px;
    background: #333;
    color: #fff;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
}

.content-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.summary-bar {
    padding: 16px 24px;
    background: #161616;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.summary-item {
    color: #ccc;
    font-size: 14px;
}

.summary-item strong {
    color: #22C55E;
}

.btn-copy {
    background: rgba(34, 197, 94, 0.1);
    color: #22C55E;
    border: 1px solid rgba(34, 197, 94, 0.3);
    padding: 6px 14px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
}

.btn-copy:hover {
    background: rgba(34, 197, 94, 0.2);
    transform: translateY(-1px);
}

.table-container {
    flex: 1;
    overflow-y: auto;
    padding: 0;
}

.users-table {
    width: 100%;
    border-collapse: collapse;
}

.users-table th {
    text-align: left;
    padding: 14px 24px;
    background: #111;
    color: #888;
    font-size: 12px;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.05em;
    position: sticky;
    top: 0;
    z-index: 10;
}

.users-table td {
    padding: 12px 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    color: #ddd;
    font-size: 14px;
}

.users-table tr:hover {
    background: rgba(255, 255, 255, 0.02);
}

/* Scrollbar */
.table-container::-webkit-scrollbar {
    width: 8px;
}

.table-container::-webkit-scrollbar-track {
    background: #0B0B0B;
}

.table-container::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 4px;
}

.raw-data {
    max-width: 300px;
    max-height: 150px;
    overflow: auto;
    background: #111;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #333;
}

.raw-data pre {
    margin: 0;
    font-family: monospace;
    font-size: 11px;
    color: #aaa;
    white-space: pre-wrap;
    word-break: break-all;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}
</style>
