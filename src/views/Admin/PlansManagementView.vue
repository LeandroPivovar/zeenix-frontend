<template>
    <div class="layout" ref="layoutContainer" :class="{'layout-collapsed': isSidebarCollapsed && !isMobile}">
        <AppSidebar :is-open="isSidebarOpen" :is-collapsed="isSidebarCollapsed" @toggle-collapse="toggleSidebarCollapse" />
        
        <main class="layout-content">
            <button class="hamburger-btn" @click="toggleSidebar" aria-label="Abrir menu">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            
            <div class="form-plan" v-if="isFormVisible">
                <form @submit.prevent="savePlan">
                    <div class="header-form">
                        <h1>{{ isEditing ? 'Editar Plano' : 'Adicionar novo Plano' }}</h1>
                        <a href="#" class="help-link">Ajuda</a>
                        <button class="close-btn" type="button" @click="closeForm">×</button>
                    </div>
                    <p>Configure os detalhes do plano</p>

                    <div class="form-container">
                        <div class="form-group">
                            <label for="name">Nome do Plano</label>
                            <input type="text" id="name" name="name" placeholder="ex: Plano Pro" v-model="planForm.name" required>
                            <span class="hint-text">Nome exibido do plano.</span>
                        </div>
                        <div class="form-group">
                            <label for="slug">Slug</label>
                            <input type="text" id="slug" name="slug" placeholder="ex: pro" v-model="planForm.slug" required>
                            <span class="hint-text">Identificador único (minúsculas, sem espaços).</span>
                        </div>
                        <div class="form-group">
                            <label for="price">Preço</label>
                            <input type="number" id="price" name="price" placeholder="0.00" v-model.number="planForm.price" min="0" step="0.01" required>
                            <span class="hint-text">Preço do plano.</span>
                        </div>
                        <div class="form-group">
                            <label for="currency">Moeda</label>
                            <div class="select-wrapper">
                                <select name="currency" id="currency" v-model="planForm.currency" required>
                                    <option value="BRL">BRL (R$)</option>
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                </select>
                                <span class="select-icon"></span>
                            </div>
                            <span class="hint-text">Moeda do preço.</span>
                        </div>
                        <div class="form-group">
                            <label for="billingPeriod">Período de Cobrança</label>
                            <div class="select-wrapper">
                                <select name="billingPeriod" id="billingPeriod" v-model="planForm.billingPeriod" required>
                                    <option value="month">Mensal</option>
                                    <option value="year">Anual</option>
                                    <option value="lifetime">Vitalício</option>
                                </select>
                                <span class="select-icon"></span>
                            </div>
                            <span class="hint-text">Frequência de cobrança.</span>
                        </div>
                        <div class="form-group">
                            <label for="displayOrder">Ordem de Exibição</label>
                            <input type="number" id="displayOrder" name="displayOrder" placeholder="0" v-model.number="planForm.displayOrder" min="0">
                            <span class="hint-text">Ordem na lista (menor = primeiro).</span>
                        </div>
                        <div class="form-group" style="flex: 1 1 100%;">
                            <label>Benefícios do Plano</label>
                            <div class="benefits-list">
                                <div v-for="(benefit, index) in planForm.benefits" :key="index" class="benefit-item">
                                    <input 
                                        type="text" 
                                        v-model="planForm.benefits[index]" 
                                        :placeholder="`Benefício ${index + 1}`"
                                        class="benefit-input"
                                    >
                                    <button type="button" @click="removeBenefit(index)" class="remove-benefit-btn" v-if="planForm.benefits.length > 1">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                                <button type="button" @click="addBenefit" class="add-benefit-btn">
                                    <i class="fas fa-plus"></i> Adicionar Benefício
                                </button>
                            </div>
                            <span class="hint-text">Lista de benefícios do plano.</span>
                        </div>
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" v-model="planForm.isPopular">
                                <span>Mais Vendido</span>
                            </label>
                            <span class="hint-text">Marcar como plano mais vendido.</span>
                        </div>
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" v-model="planForm.isRecommended">
                                <span>Recomendado</span>
                            </label>
                            <span class="hint-text">Marcar como plano recomendado.</span>
                        </div>
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" v-model="planForm.isActive">
                                <span>Ativo</span>
                            </label>
                            <span class="hint-text">Plano ativo e visível para usuários.</span>
                        </div>

                        <div class="divisor"></div>

                        <div class="footer-form">
                            <div class="right-footer">
                                <h3>&nbsp;</h3>
                            </div>
                            <div class="left-footer">
                                <button class="cancel-btn" type="button" @click="closeForm">Cancelar</button>
                                <button class="save-btn" type="submit">{{ isEditing ? 'Salvar Alterações' : 'Adicionar Plano' }}</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div class="add-plan-button-wrapper" v-if="!isFormVisible">
                <button class="add-plan-btn" @click="openForm">
                    + Adicionar Novo Plano
                </button>
            </div>
            
            <div class="plans-table">
                <div class="table-content-wrapper">
                    <div class="table-header">
                        <div class="th name">Nome</div>
                        <div class="th slug">Slug</div>
                        <div class="th price">Preço</div>
                        <div class="th popular">Mais Vendido</div>
                        <div class="th recommended">Recomendado</div>
                        <div class="th active">Status</div>
                        <div class="th order">Ordem</div>
                        <div class="th actions">Ações</div>
                    </div>
                    <div class="table-body">
                        <div v-if="isLoading" class="table-row-plans">
                            <div class="td" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #999;">
                                Carregando planos...
                            </div>
                        </div>
                        <div v-else-if="plans.length === 0" class="table-row-plans">
                            <div class="td" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #999;">
                                Nenhum plano cadastrado
                            </div>
                        </div>
                        <div v-else class="table-row-plans" v-for="plan in plans" :key="plan.id">
                            <div class="td name">{{ plan.name }}</div>
                            <div class="td slug">{{ plan.slug }}</div>
                            <div class="td price">{{ formatCurrency(plan.price, plan.currency) }}</div>
                            <div class="td popular">
                                <span v-if="plan.isPopular" class="badge badge-popular">SIM</span>
                                <span v-else class="badge badge-no">NÃO</span>
                            </div>
                            <div class="td recommended">
                                <span v-if="plan.isRecommended" class="badge badge-recommended">SIM</span>
                                <span v-else class="badge badge-no">NÃO</span>
                            </div>
                            <div class="td active">
                                <span :class="plan.isActive ? 'status-active' : 'status-inactive'">
                                    {{ plan.isActive ? 'Ativo' : 'Inativo' }}
                                </span>
                            </div>
                            <div class="td order">{{ plan.displayOrder }}</div>
                            <div class="td actions">
                                <button class="action-btn edit" aria-label="Editar" @click="editPlan(plan)">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="action-btn trash" aria-label="Deletar" @click="deletePlan(plan.id)">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="footer-view"></div>
        </main>
        <ToastNotification ref="toast" />
    </div>
</template>

<script>
import AppSidebar from '../../components/Sidebar.vue';
import ToastNotification from '../../components/Toast.vue';

export default {
    name: 'PlansManagementView',
    components: {
        AppSidebar,
        ToastNotification,
    },
    data() {
        return {
            isSidebarOpen: true, 
            isSidebarCollapsed: false,
            isMobile: false,
            
            // Gerenciamento do Formulário
            isFormVisible: false,
            isEditing: false,
            planForm: this.getEmptyPlanForm(),
            
            // Dados Dinâmicos
            plans: [],
            isLoading: true,
        };
    },
    async mounted() {
        this.checkMobileStatus();
        window.addEventListener('resize', this.checkMobileStatus);
        document.addEventListener('click', this.handleClickOutside);
        await this.loadPlans();
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.checkMobileStatus);
        document.removeEventListener('click', this.handleClickOutside);
    },
    methods: {
        // --- Métodos de Toast ---
        showToast(message, type = 'info', duration = 5000) {
            if (this.$refs.toast) {
                if (type === 'success') {
                    this.$refs.toast.success(message, duration);
                } else if (type === 'error') {
                    this.$refs.toast.error(message, duration);
                } else if (type === 'warning') {
                    this.$refs.toast.warning(message, duration);
                } else {
                    this.$refs.toast.info(message, duration);
                }
            }
        },
        
        // --- Métodos de Integração com Backend ---
        async loadPlans() {
            this.isLoading = true;
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    this.showToast('❌ Você precisa estar autenticado', 'error', 5000);
                    return;
                }

                const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                const url = `${baseUrl}/plans/admin/all`;

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    let errorMessage = `Falha ao carregar planos: ${response.status}`;
                    try {
                        const errorJson = JSON.parse(errorText);
                        errorMessage = errorJson.message || errorMessage;
                    } catch (e) {
                        errorMessage = errorText || errorMessage;
                    }
                    throw new Error(errorMessage);
                }

                const data = await response.json();
                this.plans = data.map(plan => this.mapPlanFromBackend(plan));
            } catch (error) {
                console.error('❌ [PlansManagement] Erro ao carregar planos:', error);
                this.showToast(error.message || '❌ Erro ao carregar planos', 'error', 6000);
                this.plans = [];
            } finally {
                this.isLoading = false;
            }
        },

        mapPlanFromBackend(plan) {
            const features = plan.features || {};
            const benefits = features.benefits || [];
            
            return {
                id: plan.id,
                name: plan.name || '',
                slug: plan.slug || '',
                price: plan.price || 0,
                currency: plan.currency || 'BRL',
                billingPeriod: plan.billingPeriod || 'month',
                features: features,
                benefits: Array.isArray(benefits) ? benefits : [],
                isPopular: plan.isPopular || false,
                isRecommended: plan.isRecommended || false,
                isActive: plan.isActive !== undefined ? plan.isActive : true,
                displayOrder: plan.displayOrder || 0,
            };
        },

        // --- Métodos de Utilitário ---
        getEmptyPlanForm() {
            return {
                id: null,
                name: '',
                slug: '',
                price: 0,
                currency: 'BRL',
                billingPeriod: 'month',
                benefits: [''],
                isPopular: false,
                isRecommended: false,
                isActive: true,
                displayOrder: 0,
            };
        },
        
        formatCurrency(value, currency = 'BRL') {
            const currencyMap = {
                'BRL': 'pt-BR',
                'USD': 'en-US',
                'EUR': 'de-DE',
            };
            const locale = currencyMap[currency] || 'pt-BR';
            const currencySymbol = currency === 'BRL' ? 'BRL' : currency;
            
            return new Intl.NumberFormat(locale, { 
                style: 'currency', 
                currency: currencySymbol 
            }).format(value);
        },

        addBenefit() {
            this.planForm.benefits.push('');
        },

        removeBenefit(index) {
            if (this.planForm.benefits.length > 1) {
                this.planForm.benefits.splice(index, 1);
            }
        },

        // --- Métodos de Gerenciamento de Formulário (CRUD) ---
        openForm() {
            this.planForm = this.getEmptyPlanForm();
            this.isEditing = false;
            this.isFormVisible = true;
        },
        
        closeForm() {
            this.isFormVisible = false;
        },
        
        async savePlan() {
            // Validações básicas
            if (!this.planForm.name || !this.planForm.name.trim()) {
                this.showToast('⚠️ Por favor, preencha o nome do plano', 'warning', 4000);
                return;
            }
            
            if (!this.planForm.slug || !this.planForm.slug.trim()) {
                this.showToast('⚠️ Por favor, preencha o slug do plano', 'warning', 4000);
                return;
            }

            // Filtrar benefícios vazios
            const benefits = this.planForm.benefits.filter(b => b && b.trim());

            try {
                const token = localStorage.getItem('token');
                
                if (!token) {
                    this.showToast('❌ Você precisa estar autenticado', 'error', 5000);
                    return;
                }

                const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                const url = this.isEditing
                    ? `${baseUrl}/plans/${this.planForm.id}`
                    : `${baseUrl}/plans`;

                const method = this.isEditing ? 'PUT' : 'POST';

                const features = {
                    benefits: benefits,
                };

                const payload = {
                    name: this.planForm.name.trim(),
                    slug: this.planForm.slug.trim().toLowerCase(),
                    price: parseFloat(this.planForm.price) || 0,
                    currency: this.planForm.currency,
                    billingPeriod: this.planForm.billingPeriod,
                    features: features,
                    isPopular: this.planForm.isPopular || false,
                    isRecommended: this.planForm.isRecommended || false,
                    isActive: this.planForm.isActive !== undefined ? this.planForm.isActive : true,
                    displayOrder: parseInt(this.planForm.displayOrder) || 0,
                };

                const response = await fetch(url, {
                    method,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    let errorMessage = 'Erro ao salvar plano';
                    try {
                        const errorJson = JSON.parse(errorText);
                        errorMessage = errorJson.message || errorMessage;
                    } catch (e) {
                        errorMessage = errorText || `Erro HTTP ${response.status}`;
                    }
                    throw new Error(errorMessage);
                }

                const result = await response.json();
                console.log('✅ [PlansManagement] Plano salvo com sucesso:', result);

                this.closeForm();
                await this.loadPlans();
                this.showToast(this.isEditing ? 'Plano atualizado com sucesso!' : 'Plano adicionado com sucesso!', 'success', 4000);
            } catch (error) {
                console.error('❌ [PlansManagement] Erro ao salvar plano:', error);
                this.showToast(error.message || '❌ Erro ao salvar plano', 'error', 6000);
            }
        },
        
        editPlan(plan) {
            const features = plan.features || {};
            const benefits = features.benefits || [];
            
            this.planForm = { 
                id: plan.id,
                name: plan.name,
                slug: plan.slug,
                price: plan.price,
                currency: plan.currency,
                billingPeriod: plan.billingPeriod,
                benefits: benefits.length > 0 ? benefits : [''],
                isPopular: plan.isPopular || false,
                isRecommended: plan.isRecommended || false,
                isActive: plan.isActive !== undefined ? plan.isActive : true,
                displayOrder: plan.displayOrder || 0,
            };
            this.isEditing = true;
            this.isFormVisible = true;
        },
        
        async deletePlan(planId) {
            const plan = this.plans.find(p => p.id === planId);
            if (!confirm(`Tem certeza que deseja deletar o plano "${plan?.name || planId}"?`)) {
                return;
            }

            try {
                const token = localStorage.getItem('token');
                
                if (!token) {
                    this.showToast('❌ Você precisa estar autenticado', 'error', 5000);
                    return;
                }

                const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';
                const url = `${baseUrl}/plans/${planId}`;

                const response = await fetch(url, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    let errorMessage = 'Erro ao deletar plano';
                    try {
                        const errorJson = JSON.parse(errorText);
                        errorMessage = errorJson.message || errorMessage;
                    } catch (e) {
                        errorMessage = errorText || `Erro HTTP ${response.status}`;
                    }
                    throw new Error(errorMessage);
                }

                await this.loadPlans();
                this.showToast('✅ Plano deletado com sucesso!', 'success', 4000);
            } catch (error) {
                console.error('Erro ao deletar plano:', error);
                this.showToast(error.message || '❌ Erro ao deletar plano', 'error', 6000);
            }
        },

        // --- Métodos de Sidebar e Responsividade ---
        checkMobileStatus() {
            this.isMobile = window.innerWidth <= 768;
            
            if (!this.isMobile) {
                this.isSidebarOpen = true;
            } else {
                this.isSidebarOpen = false;
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

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

body {
    color: #fff;
    font-family: 'Roboto', sans-serif;
    margin: 0;
}

.layout {
    background-color: #0B0B0B!important;
    color: #fff;
    min-height: 100vh;
    box-sizing: border-box;
    transition: margin-left 0.3s ease, width 0.3s ease;
    width: calc(100% - 280px);
    margin-left: 280px;
}

.layout-content {
    background-color: #0B0B0B;
    padding: 20px 0px 20px 0;
}

.layout-collapsed {
    margin-left: 80px; 
    width: calc(100% - 80px);
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

.add-plan-button-wrapper {
    margin-top: 20px;
    margin-bottom: 30px;
    opacity: 0;
    animation: fadeIn 0.5s ease-out forwards;
}

.add-plan-btn {
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

.add-plan-btn:hover {
    background-color: #45a049;
}

.form-plan {
    background-color: #1f1f1f;
    border-radius: 8px;
    padding: 25px;
    margin-bottom: 30px;
    margin-top: 20px;
    box-shadow: 0 4px 12px rgba(7, 51, 1, 0.4);
    max-height: 90vh;
    overflow-y: auto;
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.6s ease-out forwards; 
    padding-right: 15px;
}

.form-plan::-webkit-scrollbar { width: 8px; }
.form-plan::-webkit-scrollbar-track { background: #2a2a2a; border-radius: 10px; }
.form-plan::-webkit-scrollbar-thumb { background-color: #555; border-radius: 10px; }
.form-plan::-webkit-scrollbar-thumb:hover { background-color: #777; }

.form-plan .header-form {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #333;
    padding-bottom: 15px;
    margin-bottom: 15px;
}

.form-plan h1 {
    font-size: 1.5rem;
    font-weight: 500;
    margin: 0;
}

.form-plan .help-link {
    color: #00fa08;
    text-decoration: none;
    font-size: 0.9rem;
    margin-left: auto;
    margin-right: 20px;
}

.form-plan .close-btn {
    background: none;
    border: none;
    color: #fff;
    font-size: 1.5rem;
    cursor: pointer;
    opacity: 0.6;
    padding: 0;
    line-height: 1;
}

.form-plan > p {
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

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
    width: auto;
    margin: 0;
    cursor: pointer;
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

.form-group .hint-text {
    font-size: 0.8rem;
    color: #a09f9f;
    margin-top: 5px;
}

.benefits-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.benefit-item {
    display: flex;
    gap: 10px;
    align-items: center;
}

.benefit-input {
    flex: 1;
}

.remove-benefit-btn {
    background: #f44336;
    border: none;
    color: #fff;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
}

.add-benefit-btn {
    background: #4CAF50;
    border: none;
    color: #fff;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
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

.plans-table {
    background-color: #1f1f1f;
    border-radius: 8px;
    padding: 0 20px 20px 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    width: 100%;
    overflow-x: scroll; 
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.6s ease-out forwards;
    animation-delay: 0.5s;
}

.table-header,
.table-row-plans {
    width: 100%; 
    text-align: left;
}

.table-content-wrapper {
    min-width: 1000px; 
}

.table-header {
    display: grid;
    grid-template-columns: 2fr 1fr 1.2fr 1fr 1fr 1fr 0.8fr 1fr;
    align-items: center;
    padding: 10px 0;
    font-weight: 500;
    color: #aaa;
    font-size: 0.85rem;
    border-bottom: 1px solid #333;
    padding-top: 20px;
}

.table-body {
    padding-top: 10px;
}

.table-row-plans {
    color: #fff;
    font-size: 0.9rem;
    border-bottom: 1px solid #2a2a2a; 
    display: grid; 
    grid-template-columns: 2fr 1fr 1.2fr 1fr 1fr 1fr 0.8fr 1fr;
    align-items: center;
    width: 100%;
    padding: 8px 0;
}

.table-row-plans:last-child {
    border-bottom: none;
}

.td {
    padding: 0 10px; 
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; 
}

.badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 500;
}

.badge-popular {
    background-color: #4CAF50;
    color: #fff;
}

.badge-recommended {
    background-color: #ff9800;
    color: #fff;
}

.badge-no {
    background-color: #555;
    color: #aaa;
}

.status-active {
    color: #4CAF50;
    font-weight: 500;
}

.status-inactive {
    color: #f44336;
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

.action-btn.trash {
    color: #f44336;
}

@media (max-width: 768px) {
    .hamburger-btn {
        display: block; 
    }
    
    .layout {
        width: 100%;
        margin-left: 0;
        padding: 10px;
        padding-top: 60px;
    }

    .form-container {
        flex-direction: column;
    }

    .form-plan {
        padding: 15px;
        max-height: 80vh;
        margin-top: 20px;
    }
}

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
</style>

