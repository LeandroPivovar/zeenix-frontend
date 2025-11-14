<template>
    <div class="layout" ref="layoutContainer" :class="{'layout-collapsed': isSidebarCollapsed && !isMobile}">
        <AppSidebar :is-open="isSidebarOpen" :is-collapsed="isSidebarCollapsed" @toggle-collapse="toggleSidebarCollapse" />
        
        <main class="layout-content">
            <div class="background-glow"></div>
            <div class="background-grid"></div>
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
                    <p>Conecte o trader mestre á Deriv para uso em Copy Trading</p>

                    <div class="form-container">
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" placeholder="ex: trader@dominio.com" v-model="expertForm.email" required>
                            <span class="hint-text">Usado para avisos e auditoria.</span>
                        </div>
                        <div class="form-group">
                            <label for="saldo">Saldo Alvo Inicial (USD)</label>
                            <input type="number" id="saldo" name="saldo" placeholder="0.00" v-model.number="expertForm.saldoAlvoPure" step="0.01">
                            <span class="hint-text">Valor atual detectado na conta (opcional).</span>
                        </div>

                        <div class="form-group">
                            <label for="id-original">LoginID Original</label>
                            <input type="text" id="id-original" name="id-original" placeholder="ex: VRTC1632585" v-model="expertForm.loginOriginal" required>
                            <span class="hint-text">ID de origem (conta de teste da Deriv).</span>
                        </div>
                        <div class="form-group">
                            <label for="type-expert">Tipo de Expert</label>
                            <div class="select-wrapper">
                                <select name="Expert" id="type-expert" v-model="expertForm.expertType">
                                    <option value="" disabled>Selecione o tipo</option>
                                    <option value="Trader Mestre">Trader Mestre</option>
                                    <option value="Influenciador">Influenciador</option>
                                </select>
                                <span class="select-icon"></span>
                            </div>
                            <span class="hint-text">Defina a função deste expert no ecossistema.</span>
                        </div>

                        <div class="form-group">
                            <label for="idAlvo">LoginID Alvo</label>
                            <input type="text" id="idAlvo" name="idAlvo" placeholder="ex: CR9191919" v-model="expertForm.loginAlvo" required>
                            <span class="hint-text">ID ativo (conta real conectada á Deriv).</span>
                        </div>
                        <div class="form-group">
                            <label for="observacoes">Observações (opcional)</label>
                            <textarea id="observacoes" name="observacoes" placeholder="Notas internas sobre este expert..." v-model="expertForm.observacoes"></textarea>
                            <span class="hint-text">Notas internas sobre este expert...</span>
                        </div>

                        <div class="divisor"></div>

                        <div class="footer-form">
                            <div class="right-footer">
                                <h3>Validar IDs na Deriv</h3>
                            </div>
                            <div class="left-footer">
                                <button class="cancel-btn" type="button" @click="closeForm">Cancelar</button>
                                <button class="save-btn" type="submit">{{ isEditing ? 'Salvar Alterações' : 'Salvar e Conectar Expert' }}</button>
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
                        <div class="th original-login">Login Original</div>
                        <div class="th alvo-login">Login Alvo</div>
                        <div class="th target-balance">Saldo Alvo</div>
                        <div class="th status">Status</div>
                        <div class="th actions">Ações</div>
                    </div>
                    <div class="table-body">
                        <div class="table-row" v-for="(expert, index) in experts" :key="index">
                            <div class="td email">{{ expert.email }}</div>
                            <div class="td original-login">{{ expert.loginOriginal }}</div>
                            <div class="td alvo-login">{{ expert.loginAlvo }}</div>
                            <div class="td target-balance">{{ formatCurrency(expert.saldoAlvoPure) }}</div>
                            <div class="td status" :class="expert.statusClass">
                                <span class="status-dot" :class="expert.statusClass"></span>
                                {{ expert.statusLabel }}
                            </div>
                            <div class="td actions">
                                <button v-if="expert.statusClass !== 'active'" class="action-btn" aria-label="Sincronizar"><i class="fas fa-redo"></i></button>
                                <button class="action-btn trash" aria-label="Deletar" @click="deleteExpert(index)"><i class="fas fa-trash-alt"></i></button>
                                <button class="action-btn edit" aria-label="Visualizar" @click="editExpert(expert)"><i class="fas fa-search"></i></button>
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
            isFormVisible: true, // Começa visível para refletir o design inicial
            isEditing: false,
            expertForm: this.getEmptyExpertForm(),
            
            // Dados Dinâmicos
            summaryCards: [
                { class: 'active-expert', title: 'Experts Ativos', value: '5', isGreen: false },
                { class: 'balance', title: 'Saldo Total Gerenciado', value: '$46.812,00', isGreen: true },
                { class: 'profit', title: 'Lucro Médio Diário', value: '+$312,47', isGreen: true },
                { class: 'last-up', title: 'Última Sincronização', value: '18/10/2025 10:22', isGreen: false }
            ],
            experts: [
                {
                    id: 1, email: 'expert.one@email.com', loginOriginal: 'VRTC12345678', loginAlvo: 'CR8765432', saldoAlvoPure: 15340.50, statusLabel: 'Ativo', statusClass: 'active', expertType: 'Trader Mestre'
                },
                {
                    id: 2, email: 'trader.pro@email.com', loginOriginal: 'VRTC87654321', loginAlvo: 'CR2345678', saldoAlvoPure: 21110.00, statusLabel: 'Sincronizando', statusClass: 'syncing', expertType: 'Trader Mestre'
                },
                {
                    id: 3, email: 'master.zenix@email.com', loginOriginal: 'VRTC55566677', loginAlvo: 'CR-Inválido', saldoAlvoPure: 8361.50, statusLabel: 'Desconectado', statusClass: 'disconnected', expertType: 'Influenciador'
                }
            ],
            nextExpertId: 4
        };
    },
    mounted() {
        this.checkMobileStatus();
        window.addEventListener('resize', this.checkMobileStatus);
        document.addEventListener('click', this.handleClickOutside);
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.checkMobileStatus);
        document.removeEventListener('click', this.handleClickOutside);
    },
    methods: {
        // --- Métodos de Utilitário ---
        getEmptyExpertForm() {
            return {
                id: null,
                email: '',
                loginOriginal: '',
                loginAlvo: '',
                saldoAlvoPure: 0.00,
                expertType: '',
                observacoes: '',
                statusLabel: 'Desconectado',
                statusClass: 'disconnected'
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
        saveExpert() {
            const newExpertData = { ...this.expertForm, id: this.expertForm.id || this.nextExpertId };

            if (this.isEditing) {
                // Lógica de Edição
                const index = this.experts.findIndex(e => e.id === newExpertData.id);
                if (index !== -1) {
                    this.experts.splice(index, 1, newExpertData);
                }
            } else {
                // Lógica de Adição
                this.experts.push(newExpertData);
                this.nextExpertId++; 
            }

            this.closeForm();
            // Atualiza os cards de resumo (exemplo simples: Experts Ativos)
            this.summaryCards[0].value = this.experts.filter(e => e.statusClass === 'active').length.toString();
        },
        editExpert(expert) {
            this.expertForm = { ...expert };
            this.isEditing = true;
            this.isFormVisible = true;
        },
        deleteExpert(index) {
            if (confirm(`Tem certeza que deseja deletar o expert ${this.experts[index].email}?`)) {
                this.experts.splice(index, 1);
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
    background-color: #121212;
    color: #fff;
    min-height: 100vh;
    padding: 0 20px 20px 20px;
    box-sizing: border-box;
    transition: margin-left 0.3s ease, width 0.3s ease;
    
    /* Padrão Desktop */
    margin-left: 240px; 
    width: calc(100% - 240px);
}

.layout-collapsed {
    margin-left: 80px; 
    width: calc(100% - 80px);
}

.layout-content {
    margin: 0;
    padding: 40px;

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
    margin-bottom: 30px;
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
    grid-template-columns: 2fr 1.5fr 1.5fr 1.2fr 1fr 0.8fr; 
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

.td.target-balance {
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