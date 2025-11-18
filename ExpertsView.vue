<template>
    <div class="layout" ref="layoutContainer" :class="{'layout-collapsed': isSidebarCollapsed && !isMobile}">
        <AppSidebar :is-open="isSidebarOpen" :is-collapsed="isSidebarCollapsed" @toggle-collapse="toggleSidebarCollapse" />
        
        <main class="layout-content">
            <button class="hamburger-btn" @click="toggleSidebar" aria-label="Abrir menu">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            
            <div class="form-expert" v-if="isFormVisible">
                <form @submit.prevent="saveExpert">
                    <div class="header-form">
                        <h1>{{ isEditing ? 'Editar Expert' : 'Adicionar novo Expert' }}</h1>
                        <a href="#" class="help-link">Ajuda</a>
                        <button class="close-btn" type="button" @click="closeForm">×</button>
                    </div>
                    <p>Adicione informações sobre o expert/especialista</p>

                    <div class="form-container">
                        <div class="form-group">
                            <label for="name">Nome Completo</label>
                            <input type="text" id="name" name="name" placeholder="ex: Carlos Silva" v-model="expertForm.name" required>
                            <span class="hint-text">Nome do expert.</span>
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" placeholder="ex: trader@dominio.com" v-model="expertForm.email" required>
                            <span class="hint-text">Email de contato do expert.</span>
                        </div>

                        <div class="form-group">
                            <label for="specialty">Especialidade</label>
                            <div class="select-wrapper">
                                <select name="specialty" id="specialty" v-model="expertForm.specialty" required>
                                    <option value="" disabled>Selecione a especialidade</option>
                                    <option value="Forex">Forex</option>
                                    <option value="Crypto">Criptomoedas</option>
                                    <option value="Stocks">Ações</option>
                                    <option value="Options">Opções</option>
                                    <option value="Commodities">Commodities</option>
                                    <option value="Indices">Índices</option>
                                </select>
                                <span class="select-icon"></span>
                            </div>
                            <span class="hint-text">Área de atuação principal.</span>
                        </div>
                        <div class="form-group">
                            <label for="experienceYears">Anos de Experiência</label>
                            <input type="number" id="experienceYears" name="experienceYears" placeholder="0" v-model.number="expertForm.experienceYears" min="0">
                            <span class="hint-text">Anos de experiência no mercado.</span>
                        </div>

                        <div class="form-group">
                            <label for="loginOriginal">LoginID Original (Deriv)</label>
                            <input type="text" id="loginOriginal" name="loginOriginal" placeholder="ex: VRTC1632585" v-model="expertForm.loginOriginal">
                            <span class="hint-text">ID de origem (conta de teste da Deriv).</span>
                        </div>

                        <div class="form-group">
                            <label for="loginAlvo">LoginID Alvo (Deriv)</label>
                            <input type="text" id="loginAlvo" name="loginAlvo" placeholder="ex: CR9191919" v-model="expertForm.loginAlvo">
                            <span class="hint-text">ID ativo (conta real conectada à Deriv).</span>
                        </div>

                        <div class="form-group">
                            <label for="saldoAlvo">Saldo Alvo (USD)</label>
                            <input type="number" id="saldoAlvo" name="saldoAlvo" placeholder="0.00" v-model.number="expertForm.saldoAlvo" min="0" step="0.01">
                            <span class="hint-text">Saldo inicial da conta.</span>
                        </div>

                        <div class="form-group" style="flex: 1 1 100%;">
                            <label for="bio">Biografia</label>
                            <textarea id="bio" name="bio" placeholder="Descrição sobre o expert, experiência, conquistas..." v-model="expertForm.bio"></textarea>
                            <span class="hint-text">Informações sobre o expert.</span>
                        </div>

                        <div class="divisor"></div>

                        <div class="footer-form">
                            <div class="right-footer">
                                <h3>&nbsp;</h3>
                            </div>
                            <div class="left-footer">
                                <button class="cancel-btn" type="button" @click="closeForm">Cancelar</button>
                                <button class="save-btn" type="submit">{{ isEditing ? 'Salvar Alterações' : 'Adicionar Expert' }}</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div class="add-expert-button-wrapper" v-if="!isFormVisible">
                <button class="add-expert-btn" @click="openForm">
                    + Adicionar Novo Expert
                </button>
            </div>
            
            <div class="cards-group">
                <div v-for="(card, index) in summaryCards" :key="index" :class="[card.class, 'card']">
                    <p class="card-title">{{ card.title }}</p>
                    <p class="card-value" :class="{'green-text': card.isGreen}">{{ card.value }}</p>
                </div>
            </div>

            <div class="experts-table">
                <div class="table-content-wrapper">
                    <div class="table-header">
                        <div class="th email">Email</div>
                        <div class="th login-original">Login Original</div>
                        <div class="th login-alvo">Login Alvo</div>
                        <div class="th saldo-alvo">Saldo Alvo</div>
                        <div class="th status">Status</div>
                        <div class="th actions">Ações</div>
                    </div>
                    <div class="table-body">
                        <div v-if="isLoading" class="table-row">
                            <div class="td" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #999;">
                                Carregando experts...
                            </div>
                        </div>
                        <div v-else-if="experts.length === 0" class="table-row">
                            <div class="td" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #999;">
                                Nenhum expert cadastrado
                            </div>
                        </div>
                        <div v-else class="table-row" v-for="expert in experts" :key="expert.id">
                            <div class="td email">{{ expert.email }}</div>
                            <div class="td login-original">{{ expert.loginOriginal || '-' }}</div>
                            <div class="td login-alvo">{{ expert.loginAlvo || '-' }}</div>
                            <div class="td saldo-alvo">{{ formatCurrency(expert.saldoAlvo || 0) }}</div>
                            <div class="td status" :class="getConnectionStatusClass(expert.connectionStatus)">
                                <span class="status-dot" :class="getConnectionStatusClass(expert.connectionStatus)"></span>
                                {{ expert.connectionStatus || 'Desconectado' }}
                            </div>
                            <div class="td actions">
                                <button v-if="expert.connectionStatus !== 'Ativo'" class="action-btn" aria-label="Sincronizar" @click="syncExpert(expert.id)" title="Sincronizar">
                                    <i class="fas fa-sync-alt"></i>
                                </button>
                                <button class="action-btn edit" aria-label="Editar" @click="editExpert(expert)"><i class="fas fa-edit"></i></button>
                                <button class="action-btn trash" aria-label="Deletar" @click="deleteExpert(expert.id)"><i class="fas fa-trash-alt"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="footer-view">
                </div>
        </main>
    </div>
</template>

<script>
import AppSidebar from '../../components/Sidebar.vue'; 

export default {
    name: 'ExpertsView',
    components: {
        AppSidebar,
    },
    data() {
        return {
            isSidebarOpen: true, 
            isSidebarCollapsed: false,
            isMobile: false,
            
            // Gerenciamento do Formulário
            isFormVisible: false, // Começa escondido, mostra quando clica em adicionar
            isEditing: false,
            expertForm: this.getEmptyExpertForm(),
            
            // Dados Dinâmicos
            summaryCards: [
                { class: 'active-expert', title: 'Experts Ativos', value: '0', isGreen: false },
                { class: 'balance', title: 'Total de Experts', value: '0', isGreen: false },
                { class: 'profit', title: 'Experts Verificados', value: '0', isGreen: true },
                { class: 'last-up', title: 'Avaliação Média', value: '0.0 ⭐', isGreen: false }
            ],
            experts: [],
            isLoading: true,
        };
    },
    async mounted() {
        this.checkMobileStatus();
        window.addEventListener('resize', this.checkMobileStatus);
        document.addEventListener('click', this.handleClickOutside);
        await this.loadExperts();
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.checkMobileStatus);
        document.removeEventListener('click', this.handleClickOutside);
    },
    methods: {
        // --- Métodos de Integração com Backend ---
        async loadExperts() {
            this.isLoading = true;
            try {
                const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                const url = `${baseUrl}/experts`;
                console.log('🔍 [ExpertsView] Carregando experts de:', url);
                console.log('🔍 [ExpertsView] Base URL config:', baseUrl);

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                console.log('🔍 [ExpertsView] Response status:', response.status);
                console.log('🔍 [ExpertsView] Response headers:', Object.fromEntries(response.headers.entries()));

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('❌ [ExpertsView] Erro na resposta:', errorText);
                    let errorMessage = `Falha ao carregar experts: ${response.status} ${response.statusText}`;
                    try {
                        const errorJson = JSON.parse(errorText);
                        errorMessage = errorJson.message || errorMessage;
                    } catch (e) {
                        errorMessage = errorText || errorMessage;
                    }
                    
                    // Mostrar erro específico para ajudar no debug
                    if (response.status === 0 || response.status === 'undefined') {
                        alert('❌ Erro de conexão! Verifique se o backend está rodando em ' + baseUrl);
                    } else if (response.status === 404) {
                        alert('❌ Endpoint não encontrado. Verifique a URL da API.');
                    } else if (response.status === 401) {
                        alert('❌ Não autorizado. Faça login novamente.');
                    } else if (response.status >= 500) {
                        alert('❌ Erro no servidor. Verifique os logs do backend.');
                    } else {
                        alert(`❌ Erro ${response.status}: ${errorMessage}`);
                    }
                    throw new Error(errorMessage);
                }

                const data = await response.json();
                console.log('✅ [ExpertsView] Dados recebidos do backend:', data);
                console.log('✅ [ExpertsView] Tipo dos dados:', typeof data, Array.isArray(data));

                if (!Array.isArray(data)) {
                    console.error('❌ [ExpertsView] Resposta não é um array:', data);
                    throw new Error('Resposta da API não é um array');
                }

                this.experts = data.map(expert => this.mapExpertFromBackend(expert));
                this.updateSummaryCards();
                console.log('✅ [ExpertsView] Experts carregados com sucesso:', this.experts.length);
            } catch (error) {
                console.error('❌ [ExpertsView] Erro ao carregar experts:', error);
                console.error('❌ [ExpertsView] Stack trace:', error.stack);
                
                // Se for um erro de rede, mostrar mensagem clara
                if (error.name === 'TypeError' && error.message.includes('fetch')) {
                    alert('❌ Erro de conexão com o backend!\n\nVerifique:\n1. Se o backend está rodando (http://localhost:3000)\n2. Se há problemas de CORS\n3. Se a URL está correta');
                }
                
                this.experts = []; // Garante que a lista está vazia em caso de erro
            } finally {
                this.isLoading = false;
            }
        },

        mapExpertFromBackend(expert) {
            return {
                id: expert.id,
                name: expert.name || '',
                email: expert.email || '',
                specialty: expert.specialty || '',
                bio: expert.bio || '',
                avatarUrl: expert.avatarUrl || null,
                experienceYears: expert.experienceYears || 0,
                rating: expert.rating || 0,
                totalReviews: expert.totalReviews || 0,
                totalFollowers: expert.totalFollowers || 0,
                totalSignals: expert.totalSignals || 0,
                winRate: expert.winRate || 0,
                isVerified: expert.isVerified || false,
                isActive: expert.isActive !== undefined ? expert.isActive : true,
                loginOriginal: expert.loginOriginal || null,
                loginAlvo: expert.loginAlvo || null,
                saldoAlvo: expert.saldoAlvo || 0,
                connectionStatus: expert.connectionStatus || 'Desconectado',
                statusLabel: (expert.connectionStatus === 'Ativo' || expert.isActive) ? 'Ativo' : 'Inativo',
                statusClass: expert.isActive ? 'active' : 'disconnected',
            };
        },

        updateSummaryCards() {
            const activeConnections = this.experts.filter(e => e.connectionStatus === 'Ativo').length;
            const totalBalance = this.experts.reduce((sum, e) => sum + (e.saldoAlvo || 0), 0);
            const avgDailyProfit = (totalBalance * 0.015).toFixed(2); // Simulado: 1.5% do total
            const lastSync = this.experts.length > 0 ? new Date().toLocaleString('pt-BR') : 'Nunca';

            this.summaryCards[0].value = activeConnections.toString();
            this.summaryCards[0].title = 'Experts Ativos';
            this.summaryCards[1].value = this.formatCurrency(totalBalance);
            this.summaryCards[1].title = 'Saldo Total Gerenciado';
            this.summaryCards[1].isGreen = true;
            this.summaryCards[2].value = `+${this.formatCurrency(avgDailyProfit)}`;
            this.summaryCards[2].title = 'Lucro Médio Diário';
            this.summaryCards[2].isGreen = true;
            this.summaryCards[3].value = lastSync;
            this.summaryCards[3].title = 'Última Sincronização';
        },

        getConnectionStatusClass(status) {
            if (!status) return 'disconnected';
            if (status === 'Ativo') return 'active';
            if (status === 'Sincronizando') return 'syncing';
            return 'disconnected';
        },

        async syncExpert(expertId) {
            try {
                const token = localStorage.getItem('token');
                
                if (!token) {
                    alert('Você precisa estar autenticado para realizar esta ação');
                    return;
                }

                const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                const url = `${baseUrl}/experts/${expertId}`;
                
                console.log('Sincronizando expert:', url);

                // Atualizar connection_status para "Sincronizando"
                const response = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        connectionStatus: 'Sincronizando'
                    }),
                });

                console.log('Response status:', response.status);

                if (!response.ok) {
                    const errorText = await response.text();
                    let errorMessage = 'Erro ao sincronizar expert';
                    try {
                        const errorJson = JSON.parse(errorText);
                        errorMessage = errorJson.message || errorMessage;
                    } catch (e) {
                        errorMessage = errorText || `Erro HTTP ${response.status}`;
                    }
                    throw new Error(errorMessage);
                }

                await this.loadExperts();
                alert('Sincronização iniciada!');
            } catch (error) {
                console.error('Erro ao sincronizar:', error);
                alert(error.message || 'Erro ao sincronizar expert');
            }
        },

        // --- Métodos de Utilitário ---
        getEmptyExpertForm() {
            return {
                id: null,
                name: '',
                email: '',
                specialty: '',
                bio: '',
                experienceYears: 0,
                loginOriginal: '',
                loginAlvo: '',
                saldoAlvo: 0,
            };
        },
        formatCurrency(value) {
            return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'USD' }).format(value);
        },

        // --- Métodos de Gerenciamento de Formulário (CRUD) ---
        openForm() {
            this.expertForm = this.getEmptyExpertForm();
            this.isEditing = false;
            this.isFormVisible = true;
        },
        closeForm() {
            this.isFormVisible = false;
        },
        async saveExpert() {
            // Validações básicas
            if (!this.expertForm.name || !this.expertForm.name.trim()) {
                alert('Por favor, preencha o nome do expert');
                return;
            }
            
            if (!this.expertForm.email || !this.expertForm.email.trim()) {
                alert('Por favor, preencha o email do expert');
                return;
            }
            
            if (!this.expertForm.specialty || !this.expertForm.specialty.trim()) {
                alert('Por favor, selecione a especialidade');
                return;
            }

            // Validação de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this.expertForm.email)) {
                alert('Por favor, insira um email válido');
                return;
            }

            try {
                const token = localStorage.getItem('token');
                
                if (!token) {
                    alert('❌ Você precisa estar autenticado para realizar esta ação.\n\nPor favor, faça login novamente.');
                    return;
                }

                const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                const url = this.isEditing
                    ? `${baseUrl}/experts/${this.expertForm.id}`
                    : `${baseUrl}/experts`;

                const method = this.isEditing ? 'PUT' : 'POST';

                const payload = {
                    name: this.expertForm.name.trim(),
                    email: this.expertForm.email.trim(),
                    specialty: this.expertForm.specialty.trim(),
                    bio: this.expertForm.bio ? this.expertForm.bio.trim() : '',
                    experienceYears: parseInt(this.expertForm.experienceYears) || 0,
                    loginOriginal: this.expertForm.loginOriginal ? this.expertForm.loginOriginal.trim() : null,
                    loginAlvo: this.expertForm.loginAlvo ? this.expertForm.loginAlvo.trim() : null,
                    saldoAlvo: parseFloat(this.expertForm.saldoAlvo) || 0,
                };

                console.log('🔍 [ExpertsView] Enviando dados:', payload);
                console.log('🔍 [ExpertsView] URL:', url);
                console.log('🔍 [ExpertsView] Method:', method);
                console.log('🔍 [ExpertsView] Token presente:', !!token);

                const response = await fetch(url, {
                    method,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                console.log('🔍 [ExpertsView] Response status:', response.status);
                console.log('🔍 [ExpertsView] Response ok:', response.ok);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('❌ [ExpertsView] Erro na resposta:', errorText);
                    let errorMessage = 'Erro ao salvar expert';
                    try {
                        const errorJson = JSON.parse(errorText);
                        errorMessage = errorJson.message || errorMessage;
                    } catch (e) {
                        if (errorText) {
                            errorMessage = errorText;
                        } else {
                            errorMessage = `Erro HTTP ${response.status}: ${response.statusText}`;
                        }
                    }
                    
                    // Mensagens de erro mais específicas
                    if (response.status === 401) {
                        alert('❌ Não autorizado! Seu token pode ter expirado.\n\nPor favor, faça login novamente.');
                    } else if (response.status === 409) {
                        alert(`❌ ${errorMessage}\n\nO email informado já está em uso.`);
                    } else if (response.status === 400) {
                        alert(`❌ Erro de validação:\n${errorMessage}`);
                    } else if (response.status >= 500) {
                        alert(`❌ Erro no servidor:\n${errorMessage}\n\nVerifique os logs do backend.`);
                    } else {
                        alert(`❌ Erro ao salvar expert:\n${errorMessage}`);
                    }
                    throw new Error(errorMessage);
                }

                const result = await response.json();
                console.log('✅ [ExpertsView] Expert salvo com sucesso:', result);

                this.closeForm();
                await this.loadExperts();
                alert(this.isEditing ? 'Expert atualizado com sucesso!' : 'Expert adicionado com sucesso!');
            } catch (error) {
                console.error('❌ [ExpertsView] Erro ao salvar expert:', error);
                console.error('❌ [ExpertsView] Stack trace:', error.stack);
                
                // Se for um erro de rede, mostrar mensagem clara
                if (error.name === 'TypeError' && error.message.includes('fetch')) {
                    alert('❌ Erro de conexão com o backend!\n\nVerifique:\n1. Se o backend está rodando (http://localhost:3000)\n2. Se há problemas de CORS\n3. Se a URL está correta');
                } else if (!error.message.includes('HTTP') && !error.message.includes('não autorizado')) {
                    alert(error.message || 'Erro ao salvar expert. Verifique os dados e tente novamente.');
                }
            }
        },
        editExpert(expert) {
            this.expertForm = { 
                id: expert.id,
                name: expert.name,
                email: expert.email,
                specialty: expert.specialty,
                bio: expert.bio,
                experienceYears: expert.experienceYears,
                loginOriginal: expert.loginOriginal || '',
                loginAlvo: expert.loginAlvo || '',
                saldoAlvo: expert.saldoAlvo || 0,
            };
            this.isEditing = true;
            this.isFormVisible = true;
        },
        async deleteExpert(expertId) {
            const expert = this.experts.find(e => e.id === expertId);
            if (!confirm(`Tem certeza que deseja deletar o expert ${expert?.email || expertId}?`)) {
                return;
            }

            try {
                const token = localStorage.getItem('token');
                
                if (!token) {
                    alert('Você precisa estar autenticado para realizar esta ação');
                    return;
                }

                const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                const url = `${baseUrl}/experts/${expertId}`;
                
                console.log('Deletando expert:', url);

                const response = await fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                console.log('Response status:', response.status);

                if (!response.ok) {
                    const errorText = await response.text();
                    let errorMessage = 'Erro ao deletar expert';
                    try {
                        const errorJson = JSON.parse(errorText);
                        errorMessage = errorJson.message || errorMessage;
                    } catch (e) {
                        errorMessage = errorText || `Erro HTTP ${response.status}`;
                    }
                    throw new Error(errorMessage);
                }

                await this.loadExperts();
                alert('Expert deletado com sucesso!');
            } catch (error) {
                console.error('Erro ao deletar expert:', error);
                alert(error.message || 'Erro ao deletar expert');
            }
        },

        async toggleExpertStatus(expertId) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(
                    `${process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'}/experts/${expertId}/toggle-status`,
                    {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Erro ao alterar status');
                }

                await this.loadExperts();
            } catch (error) {
                console.error('Erro ao alterar status:', error);
                alert('Erro ao alterar status do expert');
            }
        },

        async toggleExpertVerified(expertId) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(
                    `${process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'}/experts/${expertId}/toggle-verified`,
                    {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Erro ao alterar verificação');
                }

                await this.loadExperts();
            } catch (error) {
                console.error('Erro ao alterar verificação:', error);
                alert('Erro ao alterar verificação do expert');
            }
        },

        // --- Métodos de Sidebar e Responsividade ---
        checkMobileStatus() {
            this.isMobile = window.innerWidth <= 768;
            
            if (!this.isMobile) {
                this.isSidebarOpen = true; // No Desktop, mantém o estado
            } else {
                this.isSidebarOpen = false; // No Mobile, esconde por padrão
            }
        },
        toggleSidebarCollapse() {
            this.isSidebarCollapsed = !this.isSidebarCollapsed;
        },
        toggleSidebar() { 
            if (this.isMobile) {
                this.isSidebarOpen = !this.isSidebarOpen;
            } else {
                this.toggleSidebarCollapse();
            }
        },
        handleClickOutside(event) {
            if (this.isMobile && this.isSidebarOpen) {
                const sidebarEl = this.$refs.layoutContainer.querySelector('.app-sidebar'); 
                const isClickOutsideSidebar = sidebarEl && !sidebarEl.contains(event.target);
                const isClickOnHamburger = event.target.closest('.hamburger-btn');
                
                if (isClickOutsideSidebar && !isClickOnHamburger) {
                    this.isSidebarOpen = false;
                }
            }
        },
    }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

body {
    color: #fff;
    font-family: 'Roboto', sans-serif;
    margin: 0;
}

.layout {
    background-color: #0e0f0f;
    color: #fff;
    min-height: 100vh;
    box-sizing: border-box;
    transition: margin-left 0.3s ease, width 0.3s ease;
}

.layout-collapsed {
    margin-left: 80px; 
    width: calc(100% - 80px);
}

.layout-content {
    margin: 0;
}

.hamburger-btn {
    position: fixed;
    top: 15px;
    left: 15px;
    background: #1f1f1f;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #e5e7eb;
    cursor: pointer;
    padding: 8px;
    border-radius: 6px;
    display: none; 
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.hamburger-btn svg {
    display: block;
}

/* Adicionando botão de adicionar expert */
.add-expert-button-wrapper {
    margin-top: 20px;
    margin-bottom: 30px;
    opacity: 0;
    animation: fadeIn 0.5s ease-out forwards;
}
.add-expert-btn {
    background-color: #4CAF50;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 1rem;
}
.add-expert-btn:hover {
    background-color: #45a049;
}


/* Formulário Expert (Mantido como estava, mas agora é v-if) */
.form-expert {
    background-color: #1f1f1f;
    border-radius: 8px;
    padding: 25px;
    margin-bottom: 30px;
    margin-top: 20px;
    box-shadow: 0 4px 12px rgba(7, 51, 1, 0.4);
    max-height: 500px;
    overflow-y: auto;
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.6s ease-out forwards; 
    padding-right: 15px;
}

.form-expert::-webkit-scrollbar { width: 8px; }
.form-expert::-webkit-scrollbar-track { background: #2a2a2a; border-radius: 10px; }
.form-expert::-webkit-scrollbar-thumb { background-color: #555; border-radius: 10px; }
.form-expert::-webkit-scrollbar-thumb:hover { background-color: #777; }

.form-expert .header-form {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #333;
    padding-bottom: 15px;
    margin-bottom: 15px;
}

.form-expert h1 {
    font-size: 1.5rem;
    font-weight: 500;
    margin: 0;
}

.form-expert .help-link {
    color: #00fa08;
    text-decoration: none;
    font-size: 0.9rem;
    margin-left: auto;
    margin-right: 20px;
}

.form-expert .close-btn {
    background: none;
    border: none;
    color: #fff;
    font-size: 1.5rem;
    cursor: pointer;
    opacity: 0.6;
    padding: 0;
    line-height: 1;
}

.form-expert > p {
    color: #aaa;
    margin-top: 0;
    margin-bottom: 25px;
}

.form-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

.form-group {
    flex: 1 1 calc(50% - 10px);
    display: flex;
    flex-direction: column;
}

.form-group label {
    font-size: 0.9rem;
    color: #fff;
    margin-bottom: 5px;
    font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
    background-color: #2a2a2a;
    border: 1px solid #3a3a3a;
    color: #fff;
    padding: 10px;
    border-radius: 4px;
    font-size: 1rem;
    box-sizing: border-box;
    width: 100%;
}

.form-group textarea {
    height: 200px;
    resize: vertical;
}

.form-group input::placeholder,
.form-group textarea::placeholder,
.form-group select option[disabled]:checked {
    color: #777;
}

.form-group .hint-text {
    font-size: 0.8rem;
    color: #a09f9f;
    margin-top: 5px;
}

.select-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
}

.form-group select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    padding-right: 30px;
}

.select-icon {
    position: absolute;
    right: 10px;
    color: #fff;
    pointer-events: none;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #fff;
}

.divisor {
    height: 1px;
    width: 100%;
    background-color: #333;
    margin: 20px 0;
    border: 1px solid #535353;
}

.footer-form {
    grid-column: 1 / -1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.right-footer h3 {
    font-size: 0.9rem;
    color: #4CAF50;
    font-weight: 400;
    margin: 0;
}

.left-footer button {
    padding: 10px 20px;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
}

.cancel-btn {
    background-color: transparent;
    border: 1px solid #777;
    color: #fff;
    margin-right: 10px;
}

.cancel-btn:hover {
    background-color: #333;
}

.save-btn {
    background-color: #4CAF50;
    border: none;
    color: #fff;
}

.save-btn:hover {
    background-color: #45a049;
}

.cards-group {
    display: flex;
    gap: 20px;
    width: 100%;
}

.card {
    background-color: #1f1f1f;
    border-radius: 8px;
    padding: 15px 20px;
    flex: 1;
    display: flex;
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.6s ease-out forwards;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    min-height: 80px; 
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.card-title {
    font-size: 0.85rem;
    color: #aaa;
    margin: 0 0 5px 0;
    text-transform: uppercase;
}

.card-value {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
    line-height: 1;
}

/* Delays escalonados para cada card */
.active-expert { animation-delay: 0.1s; }
.balance { animation-delay: 0.2s; }
.profit { animation-delay: 0.3s; }
.last-up { animation-delay: 0.4s; }

.active-expert .card-value {
    font-size: 2.2rem;
    font-weight: 500;
}
.last-up .card-value {
    font-size: 1.2rem;
    font-weight: 400;
}


.green-text {
    color: #00b862; 
    font-weight: 700;
}

.experts-table {
    background-color: #1f1f1f;
    border-radius: 8px;
    padding: 0 20px 20px 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    width: 100%;
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.6s ease-out forwards;
    animation-delay: 0.5s;
    overflow-x: auto; 
}

.table-content-wrapper {
    min-width: 900px; 
}

.table-header,
.table-row {
    display: grid;
    grid-template-columns: 2fr 1.5fr 1.5fr 1.3fr 1fr 1fr; 
    align-items: center;
    padding: 10px 0;
}

.table-header {
    font-weight: 500;
    color: #aaa;
    font-size: 0.85rem;
    border-bottom: 1px solid #333;
    padding-top: 20px;
}

.table-body {
    padding-top: 10px;
}

.table-row {
    color: #fff;
    font-size: 0.9rem;
    border-bottom: 1px solid #2a2a2a; 
}

.table-row:last-child {
    border-bottom: none;
}

.th, .td {
    padding: 5px 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.td.status {
    display: flex;
    align-items: center;
    font-weight: 500;
}

.status-dot {
    height: 8px;
    width: 8px;
    border-radius: 50%;
    margin-right: 8px;
    display: inline-block;
}

.status-dot.active { background-color: #4CAF50; }
.status-dot.syncing { background-color: #ffc107; }
.status-dot.disconnected { background-color: #f44336; }

.td.status.active { color: #4CAF50; }
.td.status.syncing { color: #ffc107; }
.td.status.disconnected { color: #f44336; }

.td.saldo-alvo {
    color: #4CAF50;
    font-weight: 500;
}

.td.actions {
    display: flex;
    gap: 5px;
    justify-content: flex-end;
}

.action-btn {
    background: none;
    border: none;
    color: #aaa;
    cursor: pointer;
    padding: 5px;
    font-size: 1rem;
    transition: color 0.2s;
}

.action-btn:hover {
    color: #fff;
}

/* Media Queries Otimizadas */

@media (min-width: 769px) {
    /* Desktop: Sidebar e Layout */
    .hamburger-btn {
        display: none;
    }
}

@media (max-width: 768px) {
    /* Mobile: Sidebar e Layout */
    .hamburger-btn {
        display: block; 
    }
    
    .layout {
        width: 100%;
        margin-left: 0;
        padding: 10px;
        padding-top: 60px; /* Espaço para o hamburger */
    }


    .left-footer {
        margin-top: 15px; 
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-end;

        
    }

    .left-footer button {
        flex: 1;
        max-width: 190px;
        width: 100%;
        text-align: center;
    }

    h3{
        text-align: left;
    }

    .cancel-btn {
        margin-right: 0;
        margin-bottom: 10px;
    }
    .cards-group {
        flex-direction: column;
        gap: 10px;
    }
    .card {
        flex: 1 1 calc(50% - 5px); 
        padding: 10px 15px;
    }
    .card-value {
        font-size: 1.2rem;
    }
    .active-expert .card-value {
        font-size: 1.8rem;
    }

    .form-container{
        flex-direction: column;
    }

    .form-expert {
        padding: 15px;
        max-height: 400px;
        margin-top: 20px;
    }
    .form-expert h1 {
        font-size: 1.2rem;
    }
    .form-expert .help-link {
        display: none; 
    }

    p{
        text-align: left;
    }

    .hint-text{
        text-align: left;
    }
}

@media (max-width: 480px) {
    .card {
        flex: 1 1 100%; 
    }
}

/* Animações */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.background-glow {
    position: fixed;
    inset: 0;
    background: radial-gradient(circle at 15% 20%, rgba(99, 102, 241, 0.22), transparent 45%),
        radial-gradient(circle at 80% 15%, rgba(56, 189, 248, 0.18), transparent 50%),
        radial-gradient(circle at 50% 75%, rgba(16, 185, 129, 0.18), transparent 55%),
        rgba(9, 10, 12, 0.95);
    z-index: -2;
    pointer-events: none;
}

.background-grid {
    position: fixed;
    inset: 0;
    background-image: linear-gradient(rgba(148, 163, 184, 0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(148, 163, 184, 0.06) 1px, transparent 1px);
    background-size: 48px 48px;
    z-index: -1;
    opacity: 0.6;
    pointer-events: none;
    animation: moveGrid 18s linear infinite;
}

@keyframes moveGrid {
    0% {
        background-position: 0 0, 0 0;
    }
    100% {
        background-position: -48px -48px, -48px -48px;
    }
}
</style>