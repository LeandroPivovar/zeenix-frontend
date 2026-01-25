<template>
    <div class="dashboard-layout" ref="layoutContainer">
        <div v-if="isSidebarOpen && isMobile" class="sidebar-overlay" @click="isSidebarOpen = false"></div>
        
        <AppSidebar :is-open="isSidebarOpen" :is-collapsed="isSidebarCollapsed" :is-mobile="isMobile" @toggle-collapse="toggleSidebarCollapse" @close-sidebar="isSidebarOpen = false" @open-settings="showSettingsModal = true" />
        
        <div class="dashboard-content-wrapper" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
            <TopNavbar 
                v-if="!isMobile"
                :is-sidebar-collapsed="isSidebarCollapsed"
                @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
                @toggle-sidebar-collapse="toggleSidebarCollapse"
                @open-settings="showSettingsModal = true"
            />
            
            <div v-if="isMobile" class="mobile-header-admin">
                <button class="menu-toggler-btn" @click="isSidebarOpen = true">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <div class="mobile-brand">
                    <span class="text-white font-bold text-lg">ZEN</span><span class="text-white font-bold text-lg">I</span><span class="text-[#22C55E] font-bold text-lg">X</span>
                </div>
                <button class="mobile-profile-btn" @click="showSettingsModal = true">
                    <i class="fas fa-user-circle text-2xl text-[#DFDFDF]"></i>
                </button>
            </div>

            <main class="layout-content">
            
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
                            <label style="display: block; margin-bottom: 8px; font-size: 0.9rem; color: #fff; font-weight: 500;">
                                Benefícios do Plano <span style="color: #4CAF50;">({{ planForm.benefits ? planForm.benefits.length : 0 }})</span>
                            </label>
                            
                            <div class="benefits-container">
                                <!-- Lista de benefícios -->
                                <div 
                                    v-for="(benefit, index) in planForm.benefits" 
                                    :key="`benefit-${index}`" 
                                    class="benefit-row"
                                >
                                    <span class="benefit-number">{{ index + 1 }}.</span>
                                    <input 
                                        type="text" 
                                        v-model="planForm.benefits[index]" 
                                        :placeholder="`Ex: IA Orion completa`"
                                        class="benefit-input-compact"
                                    >
                                    <button 
                                        type="button" 
                                        @click="removeBenefit(index)" 
                                        class="remove-benefit-btn-compact" 
                                        v-if="planForm.benefits.length > 1"
                                        title="Remover benefício"
                                    >
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                                
                                <button type="button" @click="addBenefit" class="add-benefit-btn-compact">
                                    <i class="fas fa-plus"></i> Adicionar Benefício
                                </button>
                            </div>
                            <span class="hint-text">Lista de recursos/benefícios que o plano oferece (ex: "Copy Trading ilimitado")</span>
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
                                <!-- Confirm Modal -->
        <ConfirmActionModal
            :visible="confirmModalData.visible"
            :title="confirmModalData.title"
            :message="confirmModalData.message"
            confirm-text="Sim, excluir"
            cancel-text="Cancelar"
            @confirm="handleConfirmAction"
            @cancel="confirmModalData.visible = false"
        />
    </div>
                            <div class="left-footer">
                                <button class="cancel-btn" type="button" @click="closeForm">Cancelar</button>
                                <button class="save-btn" type="submit">{{ isEditing ? 'Salvar Alterações' : 'Adicionar Plano' }}</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <!-- Page Header -->
            <div class="page-header-plans" v-if="!isFormVisible">
                <h1 style="font-size: 20px; font-weight: 600; margin-bottom: 4px; color: #ffffff;">Gerenciar Planos</h1>
                <p style="font-size: 14px; color: #a0a0a0; margin-bottom: 20px;">Aqui crie, gerencie ou remova os planos</p>
            </div>

            <div class="add-plan-button-wrapper" v-if="!isFormVisible">
                <button class="add-plan-btn" @click="openForm">
                    + Adicionar Novo Plano
                </button>
            </div>
            
            <!-- Tabela Desktop -->
            <div class="plans-table desktop-table">
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

            <!-- Cards Mobile -->
            <div class="mobile-plans-cards">
                <div v-if="isLoading" class="mobile-plan-card empty-state">
                    <p>Carregando planos...</p>
                </div>
                <div v-else-if="plans.length === 0" class="mobile-plan-card empty-state">
                    <p>Nenhum plano cadastrado</p>
                </div>
                <div v-else v-for="plan in plans" :key="plan.id" class="mobile-plan-card">
                    <div class="card-header-plan">
                        <h3 class="card-plan-name">{{ plan.name }}</h3>
                        <div class="card-plan-actions">
                            <button class="action-btn edit" aria-label="Editar" @click="editPlan(plan)">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn trash" aria-label="Deletar" @click="deletePlan(plan.id)">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                    <div class="card-body-plan">
                        <div class="card-row-plan">
                            <span class="card-label-plan">Slug:</span>
                            <span class="card-value-plan">{{ plan.slug }}</span>
                        </div>
                        <div class="card-row-plan">
                            <span class="card-label-plan">Preço:</span>
                            <span class="card-value-plan price-value">{{ formatCurrency(plan.price, plan.currency) }}</span>
                        </div>
                        <div class="card-row-plan">
                            <span class="card-label-plan">Mais Vendido:</span>
                            <span class="card-value-plan">
                                <span v-if="plan.isPopular" class="badge badge-popular">SIM</span>
                                <span v-else class="badge badge-no">NÃO</span>
                            </span>
                        </div>
                        <div class="card-row-plan">
                            <span class="card-label-plan">Recomendado:</span>
                            <span class="card-value-plan">
                                <span v-if="plan.isRecommended" class="badge badge-recommended">SIM</span>
                                <span v-else class="badge badge-no">NÃO</span>
                            </span>
                        </div>
                        <div class="card-row-plan">
                            <span class="card-label-plan">Status:</span>
                            <span class="card-value-plan">
                                <span :class="plan.isActive ? 'status-active' : 'status-inactive'">
                                    {{ plan.isActive ? 'Ativo' : 'Inativo' }}
                                </span>
                            </span>
                        </div>
                        <div class="card-row-plan">
                            <span class="card-label-plan">Ordem:</span>
                            <span class="card-value-plan">{{ plan.displayOrder }}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="footer-view"></div>
            </main>
        </div>

        <!-- Settings Modal -->
        <SettingsSidebar
            :is-open="showSettingsModal"
            @close="showSettingsModal = false"
        />
        <ToastNotification ref="toast" />
    </div>
</template>

<script>
import AppSidebar from '../../components/Sidebar.vue';
import TopNavbar from '../../components/TopNavbar.vue';
import SettingsSidebar from '../../components/SettingsSidebar.vue';
import ToastNotification from '../../components/Toast.vue';
import ConfirmActionModal from '../../components/modals/ConfirmActionModal.vue';

export default {
    name: 'PlansManagementView',
    components: {
        AppSidebar,
        TopNavbar,
        SettingsSidebar,
        ToastNotification,
        ConfirmActionModal,
    },
    data() {
        return {
            isSidebarOpen: true, 
            isSidebarCollapsed: false,
            isMobile: false,
            
            showSettingsModal: false,
            // Gerenciamento do Formulário
            isFormVisible: false,
            isEditing: false,
            planForm: {
                id: null,
                name: '',
                slug: '',
                price: 0,
                currency: 'BRL',
                billingPeriod: 'month',
                benefits: ['', '', ''],  // Inicializar com 3 campos
                isPopular: false,
                isRecommended: false,
                isActive: true,
                displayOrder: 0,
            },
            
            // Dados Dinâmicos
            plans: [],
            isLoading: true,
            
            // Modal de Confirmação
            confirmModalData: {
                visible: false,
                title: '',
                message: '',
                confirmAction: null
            }
        };
    },
    async mounted() {
        console.log('🔍 [PlansManagement] Componente montado');
        console.log('📋 [PlansManagement] planForm.benefits inicial:', this.planForm.benefits);
        
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
            
            console.log('🔍 [MapPlan] Plano:', plan.name);
            console.log('   📦 Features raw:', features);
            console.log('   📦 Type of features:', typeof features);
            console.log('   📦 Is string?', typeof features === 'string');
            
            // Se features vier como string JSON, fazer parse
            let parsedFeatures = features;
            if (typeof features === 'string') {
                try {
                    parsedFeatures = JSON.parse(features);
                    console.log('   ✅ Features parseado:', parsedFeatures);
                } catch (e) {
                    console.error('   ❌ Erro ao fazer parse de features:', e);
                    parsedFeatures = {};
                }
            }
            
            // Extrair benefícios do features
            let benefits = [];
            if (parsedFeatures.benefits && Array.isArray(parsedFeatures.benefits)) {
                benefits = parsedFeatures.benefits.filter(b => b && b.trim());  // Remover vazios
                console.log('   ✅ Benefícios encontrados:', benefits.length, '→', benefits);
            } else {
                console.log('   ⚠️ Nenhum benefício encontrado em features.benefits');
            }
            
            // Se não houver benefícios, adicionar um campo vazio
            if (benefits.length === 0) {
                benefits = [''];
                console.log('   📝 Adicionado benefício vazio para input');
            }
            
            return {
                id: plan.id,
                name: plan.name || '',
                slug: plan.slug || '',
                price: plan.price || 0,
                currency: plan.currency || 'BRL',
                billingPeriod: plan.billingPeriod || 'month',
                features: parsedFeatures,
                benefits: benefits,
                isPopular: plan.isPopular || false,
                isRecommended: plan.isRecommended || false,
                isActive: plan.isActive !== undefined ? plan.isActive : true,
                displayOrder: plan.displayOrder || 0,
            };
        },

        // --- Métodos de Utilitário ---
        getEmptyPlanForm() {
            const form = {
                id: null,
                name: '',
                slug: '',
                price: 0,
                currency: 'BRL',
                billingPeriod: 'month',
                benefits: ['', '', ''],  // Começar com 3 campos vazios
                isPopular: false,
                isRecommended: false,
                isActive: true,
                displayOrder: 0,
            };
            console.log('📋 [PlansManagement] Formulário vazio criado com', form.benefits.length, 'benefícios');
            return form;
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
            console.log('➕ [PlansManagement] Benefício adicionado. Total:', this.planForm.benefits.length);
        },

        removeBenefit(index) {
            if (this.planForm.benefits.length > 1) {
                this.planForm.benefits.splice(index, 1);
                console.log('➖ [PlansManagement] Benefício removido. Total:', this.planForm.benefits.length);
            }
        },

        // --- Métodos de Gerenciamento de Formulário (CRUD) ---
        openForm() {
            this.planForm = this.getEmptyPlanForm();
            this.isEditing = false;
            this.isFormVisible = true;
            
            console.log('📝 [PlansManagement] Abrindo formulário novo plano');
            console.log('📋 [PlansManagement] Benefícios iniciais:', this.planForm.benefits);
            
            // Debug: Forçar re-renderização
            this.$nextTick(() => {
                console.log('✅ [PlansManagement] Formulário renderizado com', this.planForm.benefits.length, 'benefícios');
            });
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
            // Usar os benefícios já processados do mapPlanFromBackend
            const benefitsList = plan.benefits && plan.benefits.length > 0 
                ? [...plan.benefits]  // Clone do array
                : [''];
            
            console.log('📝 [PlansManagement] Editando plano:', plan.name);
            console.log('📋 [PlansManagement] Benefícios do plano:', benefitsList);
            console.log('📦 [PlansManagement] Features completas:', plan.features);
            
            this.planForm = { 
                id: plan.id,
                name: plan.name,
                slug: plan.slug,
                price: plan.price,
                currency: plan.currency,
                billingPeriod: plan.billingPeriod,
                benefits: benefitsList,
                isPopular: plan.isPopular || false,
                isRecommended: plan.isRecommended || false,
                isActive: plan.isActive !== undefined ? plan.isActive : true,
                displayOrder: plan.displayOrder || 0,
            };
            
            this.isEditing = true;
            this.isFormVisible = true;
            
            // Debug: Forçar re-renderização e verificar
            this.$nextTick(() => {
                console.log('✅ [PlansManagement] Formulário renderizado');
                console.log('📝 [PlansManagement] planForm.benefits:', this.planForm.benefits);
                console.log('🔢 [PlansManagement] Total de benefícios:', this.planForm.benefits.length);
                
                // Mostrar cada benefício
                this.planForm.benefits.forEach((b, i) => {
                    console.log(`   ${i + 1}. "${b}"`);
                });
            });
        },
        
        async deletePlan(planId) {
            // Confirmação via Modal
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
            this.isMobile = window.innerWidth < 1024;
            
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
        requestDeletePlan(plan) {
            this.confirmModalData = {
                visible: true,
                title: 'Excluir Plano',
                message: `Tem certeza que deseja deletar o plano "<strong>${plan.name}</strong>"?`,
                confirmAction: () => this.deletePlan(plan.id)
            };
        },
        handleConfirmAction() {
            if (this.confirmModalData.confirmAction) {
                this.confirmModalData.confirmAction();
            }
            this.confirmModalData.visible = false;
        }
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

/* Layout Base - Padrão Dashboard */
.dashboard-layout {
    display: flex;
    min-height: 100vh;
    background-color: #0B0B0B;
    color: #fff;
}

.sidebar-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
}

.dashboard-content-wrapper {
    flex-grow: 1;
    margin-left: 280px;
    transition: margin-left 0.3s ease;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.dashboard-content-wrapper.sidebar-collapsed {
    margin-left: 80px;
}

.layout-content {
    flex-grow: 1;
    padding: 20px;
    padding-top: 50px;
    background-color: #0B0B0B;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

/* Mobile Header */
.mobile-header-admin {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    background-color: #0b0b0b;
    z-index: 998;
    padding: 0 20px;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #1C1C1C;
}

.mobile-brand {
    display: flex;
    align-items: center;
}

.menu-toggler-btn {
    background-color: #1e1e1e;
    color: rgb(255, 255, 255);
    border: 1px solid #333;
    border-radius: 8px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s;
}

.menu-toggler-btn:hover {
    background-color: #2a2a2a;
}

/* Responsividade */
@media (max-width: 1024px) {
    .dashboard-content-wrapper {
        margin-left: 0;
    }
    
    .dashboard-content-wrapper.sidebar-collapsed {
        margin-left: 0;
    }
    
    .mobile-header-admin {
        display: flex;
    }
    
    .layout-content {
        padding-top: 50px;
    }
}

.hamburger-btn {
    display: none;
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

/* Novo estilo compacto para benefícios */
.benefits-container {
    display: flex !important;
    flex-direction: column !important;
    gap: 8px !important;
    width: 100% !important;
    background-color: #1a1a1a !important;
    padding: 12px !important;
    border-radius: 6px !important;
    border: 1px solid #3a3a3a !important;
    min-height: 60px !important;
}

.benefit-row {
    display: flex !important;
    gap: 8px !important;
    align-items: center !important;
    width: 100% !important;
    visibility: visible !important;
    opacity: 1 !important;
}

.benefit-number {
    color: #4CAF50 !important;
    font-weight: 600 !important;
    font-size: 0.9rem !important;
    min-width: 25px !important;
    text-align: right !important;
    flex-shrink: 0 !important;
}

.benefit-input-compact {
    flex: 1 !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    background-color: #2a2a2a !important;
    border: 1px solid #3a3a3a !important;
    color: #fff !important;
    padding: 8px 12px !important;
    border-radius: 4px !important;
    font-size: 0.9rem !important;
    height: 36px !important;
    min-height: 36px !important;
    max-height: 36px !important;
    line-height: 20px !important;
    transition: all 0.2s !important;
    box-sizing: border-box !important;
}

.benefit-input-compact:focus {
    outline: none !important;
    border-color: #4CAF50 !important;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2) !important;
}

.benefit-input-compact::placeholder {
    color: #666 !important;
    opacity: 1 !important;
}

.remove-benefit-btn-compact {
    background: #f44336 !important;
    border: none !important;
    color: #fff !important;
    width: 32px !important;
    height: 32px !important;
    min-width: 32px !important;
    min-height: 32px !important;
    border-radius: 4px !important;
    cursor: pointer !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: all 0.2s !important;
    flex-shrink: 0 !important;
    visibility: visible !important;
    opacity: 1 !important;
}

.remove-benefit-btn-compact:hover {
    background: #d32f2f !important;
    transform: scale(1.05);
}

.add-benefit-btn-compact {
    background: #4CAF50 !important;
    border: none !important;
    color: #fff !important;
    padding: 10px 16px !important;
    border-radius: 4px !important;
    cursor: pointer !important;
    font-size: 0.9rem !important;
    width: 100% !important;
    transition: all 0.2s !important;
    font-weight: 500 !important;
    margin-top: 4px !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
}

.add-benefit-btn-compact:hover {
    background: #45a049 !important;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
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

/* Cards Mobile */
.mobile-plans-cards {
    display: none;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    padding-bottom: 20px;
}

.mobile-plan-card {
    background-color: #1f1f1f;
    border-radius: 8px;
    padding: 20px;
    border: 1px solid #333;
    width: 100%;
    box-sizing: border-box;
}

.mobile-plan-card.empty-state {
    text-align: center;
    padding: 40px 20px;
    color: #999;
}

.card-header-plan {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #333;
    gap: 10px;
}

.card-plan-name {
    font-size: 18px;
    font-weight: 600;
    color: #fff;
    margin: 0;
    flex: 1;
    min-width: 0;
    word-break: break-word;
}

.card-plan-actions {
    display: flex;
    gap: 10px;
    flex-shrink: 0;
}

.card-body-plan {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.card-row-plan {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    min-height: 24px;
}

.card-label-plan {
    font-size: 14px;
    color: #999;
    font-weight: 500;
    flex-shrink: 0;
}

.card-value-plan {
    font-size: 14px;
    color: #fff;
    text-align: right;
    flex: 1;
    margin-left: 10px;
    word-break: break-word;
}

.card-value-plan.price-value {
    color: #4CAF50;
    font-weight: 600;
}

/* Responsividade - Esconder/Mostrar Tabela e Cards */
@media (max-width: 768px) {
    .desktop-table {
        display: none !important;
    }
    
    .mobile-plans-cards {
        display: flex !important;
    }
    
    .hamburger-btn {
        display: block; 
    }
    
    .layout {
        width: 100%;
        margin-left: 0;
        padding: 10px;
        padding-top: 70px;
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

@media (min-width: 769px) {
    .desktop-table {
        display: block !important;
    }
    
    .mobile-plans-cards {
        display: none !important;
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

