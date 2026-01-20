<template>
	<div class="container-copiers">
		<div class="main-copiers">
			<section>
				<h2 class="section-title">Copiadores</h2>
				<p class="section-subtitle">Gerencie seus copiadores e acompanhe seus resultados</p>

				<div class="box">
					<div class="search-add-bar">
						<input
							type="text"
							class="input-token"
							v-model="newToken"
						/>
						<button class="btn-adicionar" @click="addCopier">
							<span class="btn-plus">+</span> Adicionar
						</button>
						
						<div class="search-input-container">
							<span class="search-icon">
								<img src="../../assets/icons/search.svg" alt="Pesquisar" width="20px">
							</span>
							<input
								type="text"
								placeholder="Buscar copiador..."
								class="input-search"
								v-model="searchTerm"
							/>
						</div>
					</div>

					
					<div class="controls-bar">
						<div class="switch-card">
							<label class="switch-control">
								<input type="checkbox" v-model="activateAllToggle" />
								<span class="slider-control" :class="{ 'slider-active': activateAllToggle }"></span>
								<span class="switch-label-text">Ativar todos</span>
							</label>
						</div>
						<div class="switch-card">
							<label class="switch-control">
								<input type="checkbox" v-model="deactivateAllToggle" />
								<span class="slider-control" :class="{ 'slider-active': deactivateAllToggle }"></span>
								<span class="switch-label-text">Desativar todos</span>
							</label>
						</div>
						<div class="switch-card switch-card-full">
							<label class="switch-control">
								<input type="checkbox" v-model="hideEmailsToggle" />
								<span class="slider-control" :class="{ 'slider-active': hideEmailsToggle }"></span>
								<span class="switch-label-text">Ocultar e-mails</span>
							</label>
						</div>
					</div>
				</div>

				<div class="copiadores-list">
					<!-- Loading state -->
					<div v-if="loadingCopiers" class="loading-state">
						<p>Carregando copiadores...</p>
					</div>
					<!-- Empty state -->
					<div v-else-if="filteredCopiers.length === 0" class="empty-state">
						<p>Nenhum copiador encontrado.</p>
					</div>
					<!-- Versão Desktop -->
					<template v-else>
						<div v-for="copier in filteredCopiers" :key="copier.id" class="copiador-item copiador-item-desktop">
						<div class="copiador-info">
							<span class="copiador-name">{{ copier.name }}</span>
							<span class="copiador-email" :style="{ visibility: emailVisibility }">
								{{ copier.email }}
							</span>
							<span class="copiador-tag">{{ copier.tag }}</span>
						</div>

						<div class="copiador-stats">
							<div class="stat-item">
								<span class="stat-label">Multiplicador</span>
								<span class="stat-value">{{ copier.multiplier }}</span>
							</div>
							<div class="stat-item">
								<span class="stat-label">Alvo de Lucro</span>
								<span class="stat-value">${{ copier.profitTarget }}</span>
							</div>
							<div class="stat-item">
								<span class="stat-label">Limite de perdas</span>
								<span class="stat-value">${{ copier.lossLimit }}</span>
							</div>
							<div class="stat-item">
								<span class="stat-label">Saldo</span>
								<span class="stat-value">${{ copier.balance }}</span>
							</div>
							<div class="stat-item">
								<span class="stat-label">Lucro/Perda</span>
								<span class="stat-value" :class="copier.pnl > 0 ? 'profit-green' : 'profit-red'">
									{{ copier.pnl > 0 ? '+' : '' }}${{ copier.pnl.toFixed(2) }}
								</span>
							</div>
						</div>

						<div class="copiador-actions">
							<label class="switch">
								<input type="checkbox" v-model="copier.isActive" />
								<span class="slider"></span>
							</label>
							<!-- Ícones Desktop -->
							<span class="action-icon action-icon-desktop" @click="openEditModal(copier)" title="Editar dados">
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
							</span>
							<span class="action-icon action-icon-desktop" @click="openHistoryModal(copier)" title="Ver histórico">
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
									<polyline points="12 6 12 12 16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
							</span>
							<span class="action-icon" @click="deleteCopier(copier.id)">
								<img src="../../assets/icons/delete.svg" alt="Excluir" width="15px">
							</span>
						</div>
						</div>

						<!-- Versão Mobile -->
						<div v-for="copier in filteredCopiers" :key="'mobile-' + copier.id" class="copiador-item copiador-item-mobile">
						<!-- Topo: Nome + Tag à esquerda, Botões + Slider à direita -->
						<div class="copiador-header-mobile">
							<div class="copiador-name-tag-mobile">
								<span class="copiador-name-mobile">{{ copier.name }}</span>
								<span class="copiador-tag-mobile">{{ copier.tag }}</span>
							</div>
							<div class="copiador-actions-mobile">
								<span class="action-icon-mobile-btn" @click="openHistoryModal(copier)" title="Ver histórico">
									<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<circle cx="12" cy="12" r="10" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
										<polyline points="12 6 12 12 16 14" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
									</svg>
								</span>
								<span class="action-icon-mobile-btn" @click="openEditModal(copier)" title="Editar dados">
									<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
										<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
									</svg>
								</span>
								<label class="switch switch-mobile">
									<input type="checkbox" v-model="copier.isActive" />
									<span class="slider"></span>
								</label>
							</div>
						</div>

						<!-- Meio: Informações em linha -->
						<div class="copiador-info-line-mobile">
							<span class="info-item-mobile">{{ copier.multiplier }}</span>
							<span class="info-item-mobile">TakeProfit: ${{ copier.profitTarget }}</span>
							<span class="info-item-mobile">StopLoss: ${{ copier.lossLimit }}</span>
							<span class="info-item-mobile">Saldo: ${{ copier.balance }}</span>
						</div>

						<!-- Abaixo: Resultado à esquerda, Excluir à direita -->
						<div class="copiador-footer-mobile">
							<span class="resultado-mobile">
								Resultado: 
								<span :class="copier.pnl > 0 ? 'profit-green' : 'profit-red'">
									{{ copier.pnl > 0 ? '+' : '' }}${{ copier.pnl.toFixed(2) }}
								</span>
							</span>
							<span class="action-icon-mobile-delete" @click="deleteCopier(copier.id)">
								<img src="../../assets/icons/delete.svg" alt="Excluir" width="18px">
							</span>
						</div>
						</div>
					</template>
				</div>
			</section>
		</div>

		<!-- Modal de Edição -->
		<Teleport to="body">
			<div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
				<div class="modal-content" @click.stop>
					<div class="modal-header">
						<h3 class="modal-title">Editar Dados do Copiador</h3>
						<button class="modal-close" @click="closeEditModal">×</button>
					</div>
					<div class="modal-body">
						<div class="form-group">
							<label class="form-label">Nome</label>
							<input type="text" v-model="editingCopier.name" class="form-input" />
						</div>
						<div class="form-group">
							<label class="form-label">E-mail</label>
							<input type="email" v-model="editingCopier.email" class="form-input" />
						</div>
						<div class="form-group">
							<label class="form-label">Multiplicador</label>
							<input type="text" v-model="editingCopier.multiplier" class="form-input" placeholder="ex: 1.5x" />
						</div>
						<div class="form-group">
							<label class="form-label">Alvo de Lucro ($)</label>
							<input type="number" v-model.number="editingCopier.profitTarget" class="form-input" />
						</div>
						<div class="form-group">
							<label class="form-label">Limite de Perdas ($)</label>
							<input type="number" v-model.number="editingCopier.lossLimit" class="form-input" />
						</div>
					</div>
					<div class="modal-footer">
						<button class="btn-cancel" @click="closeEditModal">Cancelar</button>
						<button class="btn-save" @click="saveCopierChanges">Salvar</button>
					</div>
				</div>
			</div>
		</Teleport>

		<!-- Modal de Histórico -->
		<Teleport to="body">
			<div v-if="showHistoryModal" class="modal-overlay" @click="closeHistoryModal">
				<div class="modal-content modal-history" @click.stop>
					<div class="modal-header">
						<h3 class="modal-title">Histórico de Trades Replicados</h3>
						<button class="modal-close" @click="closeHistoryModal">×</button>
					</div>
					<div class="modal-body">
						<div v-if="historyCopier" class="history-copier-info">
							<p><strong>Copiador:</strong> {{ historyCopier.name }}</p>
							<p><strong>E-mail:</strong> {{ historyCopier.email }}</p>
						</div>
						<div class="history-list">
							<div v-if="tradesHistory.length === 0" class="no-history">
								<p>Nenhum trade replicado ainda.</p>
							</div>
							<div v-for="trade in tradesHistory" :key="trade.id" class="history-item">
								<div class="history-item-header">
									<span class="history-symbol">{{ trade.symbol }}</span>
									<button class="history-type-btn" :class="trade.type === 'buy' ? 'type-buy' : 'type-sell'">
										{{ trade.type === 'buy' ? 'Compra' : 'Venda' }}
									</button>
								</div>
								<div class="history-item-details">
									<div class="history-detail">
										<span class="detail-label">Volume:</span>
										<span class="detail-value">${{ trade.volume }}</span>
									</div>
									<div class="history-detail">
										<span class="detail-label">Resultado:</span>
										<span class="detail-value" :class="trade.result >= 0 ? 'profit-green' : 'profit-red'">
											{{ trade.result >= 0 ? '+' : '' }}${{ trade.result.toFixed(2) }}
										</span>
									</div>
									<div class="history-detail">
										<span class="detail-label">Preço:</span>
										<span class="detail-value">${{ trade.price }}</span>
									</div>
									<div class="history-detail">
										<span class="detail-label">Data:</span>
										<span class="detail-value">{{ formatDate(trade.date) }}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="modal-footer">
						<button class="btn-close" @click="closeHistoryModal">Fechar</button>
					</div>
				</div>
			</div>
		</Teleport>
	</div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

// Dados reativos
const newToken = ref('');
const searchTerm = ref('');

// Novos toggles para os controles globais
const activateAllToggle = ref(true); // Começa ativo, como no cenário inicial
const deactivateAllToggle = ref(false);
const hideEmailsToggle = ref(false);

// Estados dos modais
const showEditModal = ref(false);
const showHistoryModal = ref(false);
const editingCopier = ref(null);
const historyCopier = ref(null);


const copiers = ref([]);
const loadingCopiers = ref(false);

// Função para carregar copiadores do backend
const loadCopiers = async () => {
	loadingCopiers.value = true;
	try {
		const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';
		const token = localStorage.getItem('token');

		const response = await fetch(`${apiBase}/copy-trading/copiers`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			}
		});

		const result = await response.json();
		if (result.success && result.data) {
			copiers.value = result.data;
		} else {
			console.error('Erro ao carregar copiadores:', result.message || 'Unknown error');
			copiers.value = [];
		}
	} catch (error) {
		console.error('Erro ao buscar copiadores:', error);
		copiers.value = [];
	} finally {
		loadingCopiers.value = false;
	}
};

// Funções de manipulação
const addCopier = () => {
	if (newToken.value.trim() !== '') {
		console.log('Adicionar copiador com token:', newToken.value);
		// TODO: Implementar adição de copiador via API
		newToken.value = ''; // Limpa o campo
	}
};

const deleteCopier = (id) => {
	if (confirm('Tem certeza que deseja remover este copiador?')) {
		copiers.value = copiers.value.filter(copier => copier.id !== id);
	}
};

// Funções para o modal de edição
const openEditModal = (copier) => {
	editingCopier.value = { ...copier };
	showEditModal.value = true;
};

const closeEditModal = () => {
	showEditModal.value = false;
	editingCopier.value = null;
};

const saveCopierChanges = () => {
	if (editingCopier.value) {
		const index = copiers.value.findIndex(c => c.id === editingCopier.value.id);
		if (index !== -1) {
			copiers.value[index] = { ...editingCopier.value };
		}
		closeEditModal();
	}
};

// Funções para o modal de histórico
const openHistoryModal = (copier) => {
	historyCopier.value = copier;
	showHistoryModal.value = true;
};

const closeHistoryModal = () => {
	showHistoryModal.value = false;
	historyCopier.value = null;
};

// Dados de exemplo para histórico de trades
const tradesHistory = ref([
	{
		id: 1,
		symbol: 'EUR/USD',
		type: 'buy',
		volume: 100,
		price: 1.0850,
		result: 15.50,
		date: new Date('2024-01-15T10:30:00')
	},
	{
		id: 2,
		symbol: 'GBP/USD',
		type: 'sell',
		volume: 50,
		price: 1.2650,
		result: -5.20,
		date: new Date('2024-01-14T14:20:00')
	},
	{
		id: 3,
		symbol: 'USD/JPY',
		type: 'buy',
		volume: 75,
		price: 149.50,
		result: 8.30,
		date: new Date('2024-01-13T09:15:00')
	}
]);

// Função para formatar data
const formatDate = (date) => {
	if (!date) return '';
	const d = new Date(date);
	return d.toLocaleDateString('pt-BR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
};


// Propriedade computada para a lista filtrada
const filteredCopiers = computed(() => {
	const term = searchTerm.value.toLowerCase();
	if (!term) {
		return copiers.value;
	}
	return copiers.value.filter(copier =>
		copier.name.toLowerCase().includes(term) ||
		copier.email.toLowerCase().includes(term)
	);
});

// Propriedade computada para a visibilidade do email
const emailVisibility = computed(() =>
	hideEmailsToggle.value ? 'hidden' : 'visible'
);

// Observadores para os toggles de controle
watch(activateAllToggle, (newValue) => {
	if (newValue) {
		copiers.value.forEach(copier => (copier.isActive = true));
		deactivateAllToggle.value = false; // Desliga o oposto
	}
});

watch(deactivateAllToggle, (newValue) => {
	if (newValue) {
		copiers.value.forEach(copier => (copier.isActive = false));
		activateAllToggle.value = false; // Desliga o oposto
	}
});

// Watch para garantir que os toggles globais reflitam o estado individual da lista
watch(copiers, () => {
	const allActive = copiers.value.every(c => c.isActive);
	const allInactive = copiers.value.every(c => !c.isActive);

	if (allActive && !activateAllToggle.value) {
		activateAllToggle.value = true;
		deactivateAllToggle.value = false;
	} else if (allInactive && !deactivateAllToggle.value) {
		deactivateAllToggle.value = true;
		activateAllToggle.value = false;
	} else if (!allActive && !allInactive) {
		// Estado misto
		activateAllToggle.value = false;
		deactivateAllToggle.value = false;
	}
}, { deep: true });

// Carregar copiadores ao montar o componente
onMounted(() => {
	loadCopiers();
});
</script>

<style scoped>

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

.container-copiers {
	width: 100%;
	padding: 20px 0;
	margin-bottom: 80px;
}


.box{
	background-color: #0d0d0c;
  padding: 30px;
  margin-bottom: 20px;
  border-radius: 12px;
  border: 1px solid #2a2a2a;
}

/* Section */
.section-title {
	font-size: 23px;
	font-weight: 700;
	margin-bottom: 8px;
	color: #ffffff;
}

.section-subtitle {
	color: #888888;
	margin-bottom: 30px;
	text-align: left;
	font-size: 14px;
}

/* Search and Add Bar */
.search-add-bar {
	display: flex;
	align-items: center;
	gap: 10px;
	padding-bottom: 20px;
	flex-wrap: wrap;
}

.input-token,
.input-search {
	padding: 12px 16px;
	border: 1px solid #2a2a2a;
	border-radius: 6px;
	background-color: #0a0b0a;
	color: #ffffff;
	font-size: 14px;
	outline: none;
	transition: border-color 0.2s;
}

.input-token:focus,
.input-search:focus {
	border-color: #3a3a3a;
}

.input-token {
	flex: 1;
	max-width: 500px;
	min-width: 200px;
}

/* ESTILO: Container e Ícone de Pesquisa */
.search-input-container { 
	flex: 1;
	min-width: 200px;
	width: 100%;
	display: flex;
	align-items: center;
	gap: 10px;
	position: relative;
}

.search-icon {
	color: #888888; 
	font-size: 18px;
	cursor: default;
	position: absolute;
	left: 12px;
	z-index: 1;
	display: flex;
	align-items: center;
}

.input-search {
	width: 100%; 
	padding-left: 40px;
	padding-right: 16px;
}



/* ... (Restante dos estilos) ... */


.btn-adicionar {
	background-color: #22c55e;
	color: white;
	padding: 12px 28px;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-weight: 600;
	font-size: 14px;
	transition: background-color 0.2s;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 6px;
}

.btn-plus {
	font-size: 18px;
	font-weight: 700;
	line-height: 1;
}

.btn-adicionar:hover {
	background-color: #00b872;
}

/* Controls Bar - ESTILO COM SLIDERS */
.controls-bar {
	display: flex;
	gap: 12px;
	padding-top: 0px;
	flex-wrap: wrap;
}

.switch-card {
	background-color: transparent;
	border-radius: 0;
	padding: 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: fit-content;
	flex-shrink: 0;
}

.switch-card-full {
	width: fit-content;
}

.switch-control { /* Estilo do Label/Container */
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 100%;
	gap: 12px;
	font-size: 14px;
	color: #ffffff;
	cursor: pointer;
	position: relative;
}

.switch-label-text {
	text-align: left;
	white-space: nowrap;
}

.switch-control input[type="checkbox"] {
	opacity: 0;
	width: 0;
	height: 0;
	position: absolute;
}

.slider-control { /* O "trilho" do slider */
	position: relative;
	display: inline-block;
	width: 32px; 
	height: 20px;
	background-color: #181818; 
	transition: 0.3s;
	border-radius: 34px;
	flex-shrink: 0;
}

.slider-control:before { /* O "thumb" (círculo) */
	position: absolute;
	content: "";
	height: 12px;
	width: 12px;
	left: 4px;
	bottom: 4px;
	background-color: #ffffff;
	transition: 0.3s;
	border-radius: 50%;
}

.switch-control input[type="checkbox"]:checked ~ .slider-control,
.slider-control.slider-active {
	background-color: #00d084 !important; /* Cor ON */
}

.switch-control input[type="checkbox"]:checked ~ .slider-control:before,
.slider-control.slider-active:before {
	transform: translateX(12px) !important; /* Move o thumb */
}


/* Copiadores List */
.copiadores-list {
	display: flex;
	flex-direction: column;
	gap: 15px;
}

.copiador-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	background-color: #0d0d0c;
	padding: 20px 24px;
	border-radius: 8px;
	border: 1px solid #222222;
	transition: border-color 0.2s;
	gap: 20px;
	flex-wrap: wrap;
}

.copiador-item:hover {
	border-color: #2a2a2a;
}

/* Controle de visibilidade Desktop/Mobile */
.copiador-item-mobile {
	display: none;
}

.copiador-item-desktop {
	display: flex;
}

/* Copiador Info */
.copiador-info {
	display: flex;
	flex-direction: column;
	text-align: left;
	min-width: 240px;
}

.copiador-name {
	font-weight: 700;
	font-size: 15px;
	color: #ffffff;
	margin-bottom: 4px;
}

.copiador-email {
	color: #888888;
	font-size: 13px;
	margin-bottom: 6px;
}

.copiador-tag {
	background-color: #1a4d2e;
	color: #00d084;
	padding: 3px 8px;
	border-radius: 4px;
	font-size: 11px;
	font-weight: 600;
	width: fit-content;
	letter-spacing: 0.5px;
}

/* Copiador Stats */
.copiador-stats {
	display: flex;
	gap: 30px;
	flex-grow: 1;
	justify-content: flex-start;
	flex-wrap: wrap;
	text-align: left;
}

.stat-item {
	display: flex;
	flex-direction: column;
	min-width: 90px;
}

.stat-label {
	font-size: 13px;
	color: #888888;
	margin-bottom: 4px;
}

.stat-value {
	font-size: 19px;
	color: #ffffff;
	font-weight: 600;
}

.profit-green {
	color: #00d084;
}

.profit-red {
	color: #ff4545; /* Adicionado para perdas */
}

/* Copiador Actions */
.copiador-actions {
	display: flex;
	align-items: center;
	gap: 15px;
}

.action-icon {
	font-size: 18px;
	color: #666666;
	cursor: pointer;
	transition: color 0.2s;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 5px;
}

.action-icon:hover {
	color: #22c55e;
}

.action-icon svg {
	width: 16px;
	height: 16px;
	stroke: currentColor;
}

/* Controle de visibilidade dos ícones Desktop/Mobile */
.action-icon-mobile {
	display: none;
}

.action-icon-desktop {
	display: flex;
}

/* Toggle Switch (Individual) */
.switch {
	position: relative;
	display: inline-block;
	width: 50px;
	height: 28px;
}

.switch input {
	opacity: 0;
	width: 0;
	height: 0;
}

.slider {
	position: absolute;
	cursor: pointer;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #181818;
	transition: 0.3s;
	border-radius: 34px;
}

.slider:before {
	position: absolute;
	content: "";
	height: 20px;
	width: 20px;
	left: 4px;
	bottom: 4px;
	background-color: #ffffff;
	transition: 0.3s;
	border-radius: 50%;
}

input:checked + .slider {
	background-color: #00d084;
}

input:checked + .slider:before {
	transform: translateX(22px);
}

/* Estilos Mobile - Versão Separada */
.copiador-item-mobile {
	display: none;
	flex-direction: column;
	background-color: #0d0d0c;
	padding: 16px;
	border-radius: 8px;
	border: 1px solid #222222;
	gap: 14px;
	margin-bottom: 15px;
}

.copiador-header-mobile {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	margin-bottom: 2px;
}

.copiador-name-tag-mobile {
	display: flex;
	align-items: center;
	gap: 10px;
}

.copiador-name-mobile {
	font-weight: 700;
	font-size: 15px;
	color: #ffffff;
}

.copiador-tag-mobile {
	background-color: #1a4d2e;
	color: #00d084;
	padding: 3px 8px;
	border-radius: 4px;
	font-size: 11px;
	font-weight: 600;
	letter-spacing: 0.5px;
}

.copiador-actions-mobile {
	display: flex;
	align-items: center;
	gap: 12px;
}

.action-icon-mobile-btn {
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: opacity 0.2s;
}

.action-icon-mobile-btn:hover {
	opacity: 0.7;
}

.switch-mobile {
	width: 50px;
	height: 28px;
}

.copiador-info-line-mobile {
	display: flex;
	flex-wrap: wrap;
	gap: 8px 14px;
	align-items: center;
	font-size: 14px;
	color: #ffffff;
	line-height: 1.6;
	margin: 4px 0;
}

.info-item-mobile {
	white-space: nowrap;
}

.copiador-footer-mobile {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	margin-top: 2px;
}

.resultado-mobile {
	font-size: 14px;
	color: #ffffff;
}

.action-icon-mobile-delete {
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: opacity 0.2s;
}

.action-icon-mobile-delete:hover {
	opacity: 0.7;
}

/* Responsive */
@media (max-width: 768px) {
	body {
		padding: 20px 15px;
	}

	.box {
		padding: 20px;
	}

	.search-add-bar {
		flex-direction: column;
		gap: 12px;
	}

	.input-token,
	.input-search {
		width: 100%;
		max-width: 100%;
		min-width: auto;
	}

	.btn-adicionar {
		width: 100%;
	}

	.search-input-container {
		width: 100%;
	}

	.controls-bar {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
		width: 100%;
		box-sizing: border-box;
	}

	.switch-card {
		background-color: #0a0b0a;
		border-radius: 20px;
		padding: 12px 16px;
		min-width: 0;
		width: 100%;
		box-sizing: border-box;
		overflow: hidden;
	}

	.switch-card-full {
		grid-column: 1 / -1;
		width: 100%;
		box-sizing: border-box;
	}

	.switch-control {
		justify-content: space-between;
		min-width: 0;
		width: 100%;
		box-sizing: border-box;
	}

	.switch-control .slider-control {
		order: 2;
		flex-shrink: 0;
	}

	.switch-control .switch-label-text {
		order: 1;
		min-width: 0;
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 0.7rem;
	}

	.copiador-item {
		flex-direction: column;
		align-items: flex-start;
		padding: 16px;
	}

	.copiador-info {
		min-width: 100%;
		margin-bottom: 12px;
	}

	.copiador-stats {
		width: 100%;
		justify-content: space-between;
		margin-bottom: 12px;
	}

	.stat-item {
		min-width: auto;
	}

	.copiador-actions {
		width: 100%;
		justify-content: flex-end;
	}

	/* Mostrar versão mobile e esconder desktop */
	.copiador-item-desktop {
		display: none !important;
	}

	.copiador-item-mobile {
		display: flex !important;
	}
}

/* Modal Styles */
.modal-overlay {
	position: fixed !important;
	top: 0 !important;
	left: 0 !important;
	right: 0 !important;
	bottom: 0 !important;
	background-color: rgba(0, 0, 0, 0.92) !important;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 999999 !important;
	padding: 20px;
	width: 100vw !important;
	height: 100vh !important;
	margin: 0 !important;
}

.modal-content {
	background-color: #0d0d0c;
	border-radius: 12px;
	border: 1px solid #2a2a2a;
	max-width: 500px;
	width: 100%;
	max-height: 90vh;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	position: relative;
	z-index: 1000000 !important;
}

.modal-history {
	max-width: 700px;
}

.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20px 24px;
	border-bottom: 1px solid #2a2a2a;
}

.modal-title {
	font-size: 20px;
	font-weight: 700;
	color: #ffffff;
	margin: 0;
}

.modal-close {
	background: none;
	border: none;
	color: #888888;
	font-size: 28px;
	cursor: pointer;
	line-height: 1;
	padding: 0;
	width: 30px;
	height: 30px;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: color 0.2s;
}

.modal-close:hover {
	color: #ffffff;
}

.modal-body {
	padding: 24px;
	flex: 1;
	overflow-y: auto;
}

.modal-footer {
	display: flex;
	justify-content: flex-end;
	gap: 12px;
	padding: 20px 24px;
	border-top: 1px solid #2a2a2a;
}

/* Form Styles */
.form-group {
	margin-bottom: 20px;
}

.form-label {
	display: block;
	font-size: 14px;
	color: #888888;
	margin-bottom: 8px;
	font-weight: 500;
}

.form-input {
	width: 100%;
	padding: 12px 16px;
	border: 1px solid #2a2a2a;
	border-radius: 6px;
	background-color: #0a0b0a;
	color: #ffffff;
	font-size: 14px;
	outline: none;
	transition: border-color 0.2s;
}

.form-input:focus {
	border-color: #22c55e;
}

/* Button Styles */
.btn-cancel,
.btn-close {
	background-color: #2a2a2a;
	color: #ffffff;
	padding: 10px 20px;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-weight: 500;
	font-size: 14px;
	transition: background-color 0.2s;
}

.btn-cancel:hover,
.btn-close:hover {
	background-color: #3a3a3a;
}

.btn-save {
	background-color: #22c55e;
	color: white;
	padding: 10px 20px;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-weight: 600;
	font-size: 14px;
	transition: background-color 0.2s;
}

.btn-save:hover {
	background-color: #00b872;
}

/* History Styles */
.history-copier-info {
	background-color: #0a0b0a;
	padding: 16px;
	border-radius: 8px;
	margin-bottom: 20px;
	border: 1px solid #2a2a2a;
}

.history-copier-info p {
	margin: 8px 0;
	color: #ffffff;
	font-size: 14px;
}

.history-copier-info strong {
	color: #22c55e;
}

.history-list {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.no-history {
	text-align: center;
	padding: 40px 20px;
	color: #888888;
	font-size: 14px;
}

.history-item {
	background-color: #0a0b0a;
	padding: 18px 20px;
	border-radius: 8px;
	border: 1px solid #2a2a2a;
	transition: border-color 0.2s;
	margin-bottom: 12px;
}

.history-item:hover {
	border-color: #3a3a3a;
}

.history-item-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 12px;
}

.history-symbol {
	font-size: 18px;
	font-weight: 700;
	color: #ffffff;
}

.history-type-btn {
	padding: 6px 14px;
	border-radius: 6px;
	font-size: 12px;
	font-weight: 600;
	border: none;
	cursor: default;
	white-space: nowrap;
}

.history-type-btn.type-buy {
	background-color: #1a4d2e;
	color: #00d084;
}

.history-type-btn.type-sell {
	background-color: #4d1a1a;
	color: #ff4545;
}

.history-item-details {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 16px;
	margin-top: 4px;
}

.history-detail {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.detail-label {
	font-size: 12px;
	color: #888888;
}

.detail-value {
	font-size: 14px;
	color: #ffffff;
	font-weight: 600;
}

@media (max-width: 768px) {
	.modal-content {
		max-width: 100%;
		margin: 10px;
	}

	.history-item-details {
		grid-template-columns: 1fr;
	}
}

/* Loading and Empty States */
.loading-state,
.empty-state {
	text-align: center;
	padding: 60px 20px;
	color: #888888;
	font-size: 14px;
}

.loading-state p,
.empty-state p {
	margin: 0;
}
</style>