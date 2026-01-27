<template>
    <div v-if="visible" class="modal-overlay" @click.self="close">
        <div class="modal-content categorized-modal">
            <div class="modal-header-premium">
                <h3 class="modal-title">Destaque da Aula</h3>
                <button class="modal-close-btn" @click="close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="modal-body">
                <p class="modal-description">
                    Selecione onde esta aula deve ser exibida como destaque (tutorial).
                    Apenas uma aula por categoria pode ser selecionada em todo o sistema.
                </p>

                <div class="agents-modal-list">
                    <!-- Opção 1: Tela de Conexão -->
                    <div 
                        class="agent-option-premium" 
                        :class="{ 'active': selectedOption === 1 }"
                        @click="selectOption(1)"
                    >
                        <div class="agent-option-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                                <line x1="8" y1="21" x2="16" y2="21"></line>
                                <line x1="12" y1="17" x2="12" y2="21"></line>
                            </svg>
                        </div>
                        <div class="agent-option-info">
                            <h4 class="agent-option-title">Vídeo da Tela de Conexão</h4>
                            <p class="agent-option-desc">Exibido na tela de login/conexão do usuário.</p>
                        </div>
                        <div class="agent-option-check">
                            <i class="fas" :class="selectedOption === 1 ? 'fa-check-circle' : 'fa-circle'"></i>
                        </div>
                    </div>

                    <!-- Opção 2: Boas Vindas -->
                    <div 
                        class="agent-option-premium" 
                        :class="{ 'active': selectedOption === 2 }"
                        @click="selectOption(2)"
                    >
                        <div class="agent-option-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                            </svg>
                        </div>
                        <div class="agent-option-info">
                            <h4 class="agent-option-title">Vídeo de Boas Vindas</h4>
                            <p class="agent-option-desc">Exibido no primeiro acesso ou dashboard.</p>
                        </div>
                        <div class="agent-option-check">
                            <i class="fas" :class="selectedOption === 2 ? 'fa-check-circle' : 'fa-circle'"></i>
                        </div>
                    </div>

                    <!-- Opção 3: Planos -->
                    <div 
                        class="agent-option-premium" 
                        :class="{ 'active': selectedOption === 3 }"
                        @click="selectOption(3)"
                    >
                        <div class="agent-option-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="16"></line>
                                <line x1="8" y1="12" x2="16" y2="12"></line>
                            </svg>
                        </div>
                        <div class="agent-option-info">
                            <h4 class="agent-option-title">Vídeo de Planos</h4>
                            <p class="agent-option-desc">Exibido na seção de assinatura de planos.</p>
                        </div>
                        <div class="agent-option-check">
                            <i class="fas" :class="selectedOption === 3 ? 'fa-check-circle' : 'fa-circle'"></i>
                        </div>
                    </div>
                </div>

                <div class="modal-actions">
                    <button class="btn-cancel" @click="clearSelection" v-if="currentValue">
                        Remover Destaque
                    </button>
                    <div style="flex: 1"></div>
                    <button class="btn-primary" @click="save" :disabled="selectedOption === currentValue && currentValue !== null">
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'FeaturedLessonModal',
    props: {
        visible: {
            type: Boolean,
            required: true
        },
        currentValue: {
            type: Number,
            default: null
        }
    },
    data() {
        return {
            selectedOption: null
        };
    },
    watch: {
        visible(newVal) {
            if (newVal) {
                this.selectedOption = this.currentValue;
            }
        }
    },
    methods: {
        close() {
            this.$emit('close');
        },
        selectOption(option) {
            this.selectedOption = option;
        },
        clearSelection() {
            this.selectedOption = null;
            this.save();
        },
        save() {
            this.$emit('save', this.selectedOption);
            this.close();
        }
    }
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(4px);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}

.categorized-modal {
    width: 100%;
    max-width: 600px;
    background: #0D0D0D;
    border: 1px solid #22C55E33;
    padding: 1.5rem;
    border-radius: 1rem;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    max-height: 90vh;
    overflow-y: auto;
}

.modal-header-premium {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.modal-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #fff;
    margin: 0;
}

.modal-description {
    color: #A1A1A1;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
    line-height: 1.5;
}

.modal-close-btn {
    background: none;
    border: none;
    color: #555;
    font-size: 1.25rem;
    cursor: pointer;
    transition: color 0.2s;
}

.modal-close-btn:hover {
    color: #fff;
}

.agents-modal-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
}

.agent-option-premium {
    display: flex;
    align-items: center;
    padding: 1rem;
    background: #111;
    border: 1px solid #1C1C1C;
    border-radius: 0.75rem;
    gap: 1rem;
    cursor: pointer;
    transition: all 0.2s;
}

.agent-option-premium:hover {
    border-color: #22C55E66;
    background: #161616;
}

.agent-option-premium.active {
    border-color: #22C55E;
    background: #0d1a10;
}

.agent-option-icon {
    width: 2.5rem;
    height: 2.5rem;
    background: rgba(34, 197, 94, 0.1);
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.agent-option-icon svg, .agent-option-icon i {
    font-size: 1.25rem;
    color: #FFFFFF !important;
}

.agent-option-info {
    flex: 1;
    text-align: left;
}

.agent-option-title {
    font-size: 0.95rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.125rem 0;
}

.agent-option-desc {
    font-size: 0.75rem;
    color: #A1A1A1;
    margin: 0;
    line-height: 1.3;
}

.agent-option-check {
    color: #333;
    font-size: 1rem;
}

.agent-option-premium.active .agent-option-check {
    color: #22C55E;
}

.modal-actions {
    display: flex;
    gap: 1rem;
    align-items: center;
    margin-top: 1rem;
}

.btn-primary {
    background: #22C55E;
    color: #000;
    font-weight: 600;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-primary:hover {
    background: #1ea34d;
}

.btn-primary:represented {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-cancel {
    background: transparent;
    color: #ef4444;
    font-weight: 500;
    padding: 0.75rem;
    border: 1px solid #ef4444;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-cancel:hover {
    background: rgba(239, 68, 68, 0.1);
}
</style>
