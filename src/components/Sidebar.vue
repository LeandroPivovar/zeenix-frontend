<template>
    <div class="sidebar-wrapper">
        <aside class="sidebar" :class="{ 'is-open': isOpen, 'collapsed': isCollapsed }">
        <nav class="menu">
            <a
                href="#"
                class="menu-item"
                :class="{ active: isDashboardActive }"
                @click.prevent="navigateAndClose('/dashboard')"
                data-text="Dashboard"
            >
                <i class="fa-solid fa-chart-line w-5 opacity-85"></i>
                <span>Dashboard</span>
            </a>
            
            <a
                href="#"
                class="menu-item"
                :class="{ active: isStatsIAsActive }"
                @click.prevent="navigateAndClose('/StatsIAs')"
                data-text="IAs de Investimento"
            >
                <i class="fa-solid fa-brain w-5 opacity-85"></i>
                <span>IA's de Investimento</span>
            </a>

            <a
                href="#"
                class="menu-item"
                :class="{ active: isAutonomousAgentActive, disabled: !isAdmin }"
                @click.prevent="isAdmin ? navigateAndClose('/agente-autonomo') : openDevModal()"
                data-text="Agente Autônomo"
            >
                <i class="fa-solid fa-microchip w-5 opacity-85"></i>
                <span>Agente Autônomo</span>
                <i v-if="!isAdmin" class="fa-solid fa-lock text-red-500 text-xs ml-auto"></i>
            </a>

            <a
                href="#"
                class="menu-item disabled"
                :title="'Funcionalidade em desenvolvimento.\n\nPara seu total conforto e aproveitamento da plataforma, estamos finalizando o desenvolvimento dessa funcionalidade, logo quando terminarmos você será avisado.'"
                @click.prevent="openDevModal"
                data-text="Copy Trading"
            >
                <i class="fa-solid fa-users w-5 opacity-85"></i>
                <span>Copy Trading</span>
                <i v-if="!isAdmin" class="fa-solid fa-lock text-red-500 text-xs ml-auto"></i>
            </a>

            <a 
                href="#"
                class="menu-item" 
                :class="{ active: isOperationActive, disabled: !isAdmin }"
                @click.prevent="isAdmin ? navigateAndClose('/operation') : openDevModal()"
                data-text="Operação Manual"
            >
                <i class="fa-solid fa-hand-pointer w-5 opacity-85"></i>
                <span>Operação Manual</span>
                <i v-if="!isAdmin" class="fa-solid fa-lock text-red-500 text-xs ml-auto"></i>
            </a>

            <a
                v-if="isAdmin"
                href="#"
                class="menu-item"
                :class="{ active: isMasterTraderActive }"
                @click.prevent="navigateAndClose('/MasterTrader')"
                data-text="Trader Mestre"
            >
                <i class="fa-solid fa-user-crown w-5 opacity-85"></i>
                <span>Trader Mestre</span>
            </a>

            <div class="separator"></div>
            
            <a
                href="#"
                class="menu-item"
                :class="{ active: isAcademyActive }"
                @click.prevent="navigateAndClose('/academy')"
                data-text="Zenix Academy"
            >
                <i class="fa-solid fa-graduation-cap w-5 opacity-85"></i>
                <span>Zenix Academy</span>
            </a>

            <a
                href="#"
                class="menu-item"
                :class="{ active: isPlansActive }"
                @click.prevent="navigateAndClose('/plans')"
                data-text="Planos"
            >
                <i class="fa-solid fa-crown w-5 opacity-85"></i>
                <span>Planos</span>
            </a>

            <a
                href="#"
                class="menu-item"
                :class="{ active: isSettingsActive }"
                @click.prevent="navigateAndClose('/settings')"
                data-text="Configuração"
            >
                <i class="fa-solid fa-gear w-5 opacity-85"></i>
                <span>Configuração</span>
            </a>

            <a
                href="#"
                class="menu-item"
                :class="{ active: isSupportActive }"
                @click.prevent="navigateAndClose('/support')"
                data-text="Suporte"
            >
                <i class="fa-solid fa-headset w-5 opacity-85"></i>
                <span>Suporte</span>
            </a>

            <a
                href="#"
                class="menu-item"
                @click.prevent="logout"
                data-text="Sair"
            >
                <i class="fa-solid fa-arrow-right-from-bracket w-5 opacity-85"></i>
                <span>Sair</span>
            </a>

            <!-- Links de Administração (apenas para admins) -->
            <template v-if="isAdmin">
                <div class="separator"></div>
                
                <a
                    href="#"
                    class="menu-item"
                    :class="{ active: isAdminViewActive }"
                    @click.prevent="navigateAndClose('/Admin')"
                    data-text="Admin"
                >
                    <i class="fa-solid fa-shield-halved w-5 opacity-85"></i>
                    <span>Admin</span>
                </a>

                <a
                    href="#"
                    class="menu-item"
                    :class="{ active: isAdminStatsIAsActive }"
                    @click.prevent="navigateAndClose('/AdminStatsIAs')"
                    data-text="Estatísticas IAs"
                >
                    <i class="fa-solid fa-chart-bar w-5 opacity-85"></i>
                    <span>Estatísticas IAs</span>
                </a>

                <a
                    href="#"
                    class="menu-item"
                    :class="{ active: isExpertsActive }"
                    @click.prevent="navigateAndClose('/Experts')"
                    data-text="Experts"
                >
                    <i class="fa-solid fa-user-tie w-5 opacity-85"></i>
                    <span>Experts</span>
                </a>

                <a
                    href="#"
                    class="menu-item"
                    :class="{ active: isClientesActive }"
                    @click.prevent="navigateAndClose('/Clientes')"
                    data-text="Clientes"
                >
                    <i class="fa-solid fa-users w-5 opacity-85"></i>
                    <span>Clientes</span>
                </a>

                <a
                    href="#"
                    class="menu-item"
                    :class="{ active: isWebhooksActive }"
                    @click.prevent="navigateAndClose('/Webhooks')"
                    data-text="Webhooks"
                >
                    <i class="fa-solid fa-webhook w-5 opacity-85"></i>
                    <span>Webhooks</span>
                </a>

                <a
                    href="#"
                    class="menu-item"
                    :class="{ active: isAcademyManagementActive }"
                    @click.prevent="navigateAndClose('/AcademyManagement')"
                    data-text="Gerenciar Academia"
                >
                    <i class="fa-solid fa-book w-5 opacity-85"></i>
                    <span>Gerenciar Academia</span>
                </a>

                <a
                    href="#"
                    class="menu-item"
                    :class="{ active: isSupportItemsActive }"
                    @click.prevent="navigateAndClose('/SupportItems')"
                    data-text="Itens de Suporte"
                >
                    <i class="fa-solid fa-ticket w-5 opacity-85"></i>
                    <span>Itens de Suporte</span>
                </a>

                <a
                    href="#"
                    class="menu-item"
                    :class="{ active: isMarkupActive }"
                    @click.prevent="navigateAndClose('/markup')"
                    data-text="Markup"
                >
                    <i class="fa-solid fa-percent w-5 opacity-85"></i>
                    <span>Markup</span>
                </a>

                <a
                    href="#"
                    class="menu-item"
                    :class="{ active: isPlansManagementActive }"
                    @click.prevent="navigateAndClose('/PlansManagement')"
                    data-text="Gerenciar Planos"
                >
                    <i class="fa-solid fa-crown w-5 opacity-85"></i>
                    <span>Gerenciar Planos</span>
                </a>
            </template>

        </aside>

        <!-- Modal de Funcionalidade em Desenvolvimento -->
        <div v-if="showDevModal" class="dev-modal-overlay" @click.self="showDevModal = false">
            <div class="dev-modal-content">
                <div class="dev-modal-header">
                    <i class="fa-solid fa-screwdriver-wrench text-zenix-green text-4xl mb-4"></i>
                    <h2>Funcionalidade em desenvolvimento</h2>
                </div>
                <div class="dev-modal-body">
                    <p>Para seu total conforto e aproveitamento da plataforma, estamos finalizando o desenvolvimento dessa funcionalidade.</p>
                    <p class="mt-2 text-sm opacity-70">Logo quando terminarmos você será avisado!</p>
                </div>
                <button class="dev-modal-button" @click="showDevModal = false">Entendi</button>
            </div>
        </div>
    </div>
</template>

<script>
// (Seu script Vue original mantido)
export default {
    name: 'AppSidebar',
    props: {
        isOpen: {
            type: Boolean,
            default: false
        },
        isCollapsed: {
            type: Boolean,
            default: false
        }
    },
    emits: ['close-sidebar', 'toggle-collapse'],
    data() {
        return { 
            showUserMenu: false,
            showDevModal: false
        }
    },
    computed: {
        isDashboardActive() { return this.$route?.path === '/dashboard'; },
        isAcademyActive() { return this.$route?.path?.startsWith('/academy') || false; },
        isSupportActive() { return this.$route?.path === '/support'; },
        isSettingsActive() { return this.$route?.path === '/settings'; },
        isPlansActive() { return this.$route?.path === '/plans'; },
        isOperationActive() { return this.$route?.path === '/operation' },
        isCopyTradingActive() { return this.$route?.path === '/copy-trading' || this.$route?.path === '/copy-trader'; },
        isAutonomousAgentActive() { return this.$route?.path === '/agente-autonomo'; },
        isMarkupActive() { return this.$route?.path === '/markup'; },
        isStatsIAsActive() { return this.$route?.path === '/StatsIAs'; },
        isAdminStatsIAsActive() { return this.$route?.path === '/AdminStatsIAs'; },
        isExpertsActive() { return this.$route?.path === '/Experts'; },
        isClientesActive() { return this.$route?.path === '/Clientes'; },
        isWebhooksActive() { return this.$route?.path === '/Webhooks'; },
        isAcademyManagementActive() { 
            return this.$route?.path === '/AcademyManagement' || 
                   this.$route?.path?.startsWith('/AcademyManagement/'); 
        },
        isAdminViewActive() { return this.$route?.path === '/Admin'; },
        isMasterTraderActive() { return this.$route?.path === '/MasterTrader' || this.$route?.path === '/tradermestre'; },
        isInvestmentIAActive() { return this.$route?.path === '/InvestmentIA'; },
        isSupportItemsActive() { return this.$route?.path === '/SupportItems'; },
        isPlansManagementActive() { return this.$route?.path === '/PlansManagement'; },
        isAdmin() {
            try {
                const token = localStorage.getItem('token');
                if (!token) return false;
                
                // Decodificar JWT token
                const payload = JSON.parse(atob(token.split('.')[1]));
                
                // Verificar se o usuário tem role de admin
                // Pode ser 'role', 'roles', 'userRole', 'isAdmin', etc.
                const role = payload.role || payload.roles || payload.userRole || payload.user_role;
                const isAdminFlag = payload.isAdmin || payload.is_admin;
                
                // Verificar se role contém 'admin' ou se isAdmin é true
                if (isAdminFlag === true || isAdminFlag === 'true') {
                    return true;
                }
                
                if (role) {
                    const roleStr = Array.isArray(role) ? role.join(',').toLowerCase() : role.toString().toLowerCase();
                    const result = roleStr.includes('admin') || roleStr === 'admin';
                    return result;
                }
                
                return false;
            } catch (error) {
                console.error('[Sidebar] Erro ao verificar se usuário é admin:', error);
                return false;
            }
        },
        canAccessCopyTrader() {
            try {
                const token = localStorage.getItem('token');
                if (!token) return false;
                
                // Decodificar JWT token
                const payload = JSON.parse(atob(token.split('.')[1]));
                
                // Obter role do payload
                const role = payload.role || payload.roles || payload.userRole || payload.user_role;
                
                if (!role) return false;
                
                // Verificar se role é master, admin ou trader
                const roleStr = Array.isArray(role) ? role.join(',').toLowerCase() : role.toString().toLowerCase();
                return roleStr === 'master' || roleStr === 'admin' || roleStr === 'trader' || 
                       roleStr.includes('master') || roleStr.includes('admin') || roleStr.includes('trader');
            } catch (error) {
                console.error('[Sidebar] Erro ao verificar acesso ao Copy Trader:', error);
                return false;
            }
        },
        isTrader() {
            try {
                const token = localStorage.getItem('token');
                if (!token) return false;
                
                // Decodificar JWT token
                const payload = JSON.parse(atob(token.split('.')[1]));
                
                // Obter role do payload
                const role = payload.role || payload.roles || payload.userRole || payload.user_role;
                
                if (!role) return false;
                
                // Verificar se role é trader
                const roleStr = Array.isArray(role) ? role.join(',').toLowerCase() : role.toString().toLowerCase();
                return roleStr === 'trader' || roleStr.includes('trader');
            } catch (error) {
                console.error('[Sidebar] Erro ao verificar se usuário é trader:', error);
                return false;
            }
        }
    },
    mounted() {
        // Verificação silenciosa de acesso admin (sem logs excessivos)
        // Os logs de debug foram removidos para reduzir poluição no console
    },
    methods: {
        close() { if (this.isOpen) { this.$emit('close-sidebar') } },
        toggleCollapse() { this.$emit('toggle-collapse') },
        openDevModal() {
            console.log('[Sidebar] Abrindo modal de desenvolvimento...');
            this.showDevModal = true;
            // NÃO fechar a sidebar automaticamente para não esconder o modal que é filho dela no DOM
        },
        navigateAndClose(route) { 
            // Verificar se router está disponível e componente está montado
            if (this._isDestroyed || !this.$el || !this.$router) {
                console.warn('[Sidebar] Componente destruído ou router não disponível, ignorando navegação');
                return;
            }
            
            try {
                // Fechar sidebar primeiro
                this.close();
                
                // Usar setTimeout com delay mínimo para garantir que a navegação aconteça após o fechamento
                // e evitar problemas durante transições de rota
                setTimeout(() => {
                    // Verificar se componente ainda está montado e router está disponível
                    if (!this.$el || !this.$el.isConnected || !this.$router) {
                        return;
                    }
                    
                    try {
                        // Verificar se componente Vue ainda está válido
                        if (!this.$ || !this.$.vnode) {
                            return;
                        }
                        
                        // Verificar se vnode ainda está válido
                        try {
                            if (this.$.vnode.component && this.$.vnode.component.isUnmounted) {
                                return;
                            }
                            
                            // Verificação adicional: garantir que o componente não está sendo desmontado
                            if (this.$.vnode.component && this.$.vnode.component.ctx === null) {
                                return;
                            }
                            
                            // Verificar se o elemento ainda está conectado
                            if (this.$.vnode.el && !this.$.vnode.el.isConnected) {
                                return;
                            }
                        } catch (vnodeCheckError) {
                            // Se verificação falhar, componente pode estar sendo desmontado
                            return;
                        }
                        
                        // Verificação final antes de navegar
                        try {
                            if (!this.$router || !this.$el || !this.$el.isConnected) {
                                return;
                            }
                            
                            // Verificar se já estamos na rota atual
                            const currentRoute = this.$route?.path;
                            if (currentRoute === route) {
                                // Forçar atualização da view mesmo estando na mesma rota
                                this.$router.replace(route).then(() => {
                                    // Forçar reload do componente se necessário
                                    if (this.$router.currentRoute.value.path === route) {
                                        // Disparar evento para forçar atualização
                                        window.dispatchEvent(new PopStateEvent('popstate'));
                                    }
                                }).catch(() => {
                                    // Ignorar erros de navegação duplicada
                                });
                            } else {
                            this.$router.push(route).catch(err => {
                                // Ignorar erros de navegação duplicada e erros relacionados a componentes null
                                const errMsg = String(err?.message || err || '');
                                if (err.name !== 'NavigationDuplicated' && 
                                    !errMsg.includes('Cannot destructure') &&
                                    !errMsg.includes('bum') &&
                                    !errMsg.includes('insertBefore') &&
                                    !errMsg.includes('Symbol(_assign)')) {
                                    console.error('[Sidebar] Erro ao navegar:', err);
                                }
                            });
                            }
                        } catch (pushError) {
                            // Ignorar erros de push se componente está sendo desmontado
                            const errMsg = String(pushError?.message || pushError || '');
                            const errStack = String(pushError?.stack || '');
                            const knownErrors = [
                                'Cannot destructure',
                                'bum',
                                'insertBefore',
                                'Symbol(_assign)',
                                'emitsOptions',
                                '_assigning'
                            ];
                            const isKnownError = knownErrors.some(err => errMsg.includes(err) || errStack.includes(err));
                            if (!isKnownError) {
                                console.warn('[Sidebar] Erro ao executar push:', pushError);
                            }
                        }
                    } catch (error) {
                        // Ignorar erros conhecidos relacionados a componentes desmontados
                        const errMsg = String(error?.message || error || '');
                        const errStack = String(error?.stack || '');
                        const knownErrors = [
                            'Cannot destructure',
                            'bum',
                            'insertBefore',
                            'Symbol(_assign)',
                            'emitsOptions',
                            '_assigning'
                        ];
                        const isKnownError = knownErrors.some(err => errMsg.includes(err) || errStack.includes(err));
                        if (!isKnownError) {
                            console.warn('[Sidebar] Erro geral:', error);
                        }
                        const errorMsg = String(error?.message || error || '');
                        if (!errorMsg.includes('Cannot destructure') && 
                            !errorMsg.includes('bum') &&
                            !errorMsg.includes('insertBefore') &&
                            !errorMsg.includes('Symbol(_assign)')) {
                            console.warn('[Sidebar] Erro ao executar navegação:', error);
                        }
                    }
                }, 50); // Pequeno delay para garantir que o DOM foi atualizado
            } catch (error) {
                console.error('[Sidebar] Erro ao navegar:', error);
            }
        },
        toggleUserMenu() { this.showUserMenu = !this.showUserMenu },
        logout() {
            // Verificar se router está disponível
            if (!this.$router) {
                console.warn('[Sidebar] Router não disponível, redirecionando via window.location');
                localStorage.removeItem('token');
                localStorage.removeItem('deriv_connection');
                window.location.href = '/login';
                return;
            }
            
            localStorage.removeItem('token');
            localStorage.removeItem('deriv_connection');
            this.$router.push('/login').catch(err => {
                // Se falhar, tentar redirecionar via window.location
                if (err.name !== 'NavigationDuplicated') {
                    window.location.href = '/login';
                }
            });
        },
        goProfile() { 
            if (this.$router && !this._isDestroyed && this.$el) {
                this.$router.push('/profile').catch(err => {
                    if (err.name !== 'NavigationDuplicated') {
                        console.error('[Sidebar] Erro ao navegar para perfil:', err);
                    }
                });
            }
        }
    }
}
</script>

<style src="../assets/css/components/sidebar.css"></style>