<template>
	<div class="container-copiers">
		<header class="header">
			<h1>Copy Trading do Trader Mestre</h1>
			<p>Gerencie suas conexões e copiadores</p>
		</header>

		<div class="main-copiers">
			<section>
				<h2 class="section-title">Copiadores</h2>
				<p class="section-subtitle">Gerencie seus copiadores e acompanhe seus resultados</p>

				<div class="box">
					<div class="search-add-bar">
						<input
							type="text"
							placeholder="Digite o token da conta"
							class="input-token"
							v-model="newToken"
						/>
						<button class="btn-adicionar" @click="addCopier">Adicionar</button>
						
						<div class="search-input-container">
							<input
								type="text"
								placeholder="Pesquisar copiador..."
								class="input-search"
								v-model="searchTerm"
							/>
							<span class="search-icon">
                <img src="../assets/icons/search.svg" alt="Pesquisar" width="20px">
              </span>
						</div>

					</div>

          <div class="seperato"></div>

					
					<div class="controls-bar">
						<label class="switch-control">
							<input type="checkbox" v-model="activateAllToggle" />
							<span class="slider-control"></span>
							Ativar todos
						</label>
						<label class="switch-control">
							<input type="checkbox" v-model="deactivateAllToggle" />
							<span class="slider-control"></span>
							Desativar todos
						</label>
						<label class="switch-control">
							<input type="checkbox" v-model="hideEmailsToggle" />
							<span class="slider-control"></span>
							Ocultar e-mails
						</label>
					</div>
				</div>

				<div class="copiadores-list">
					<div v-for="copier in filteredCopiers" :key="copier.id" class="copiador-item">
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
							<span class="action-icon" @click="deleteCopier(copier.id)">
								<img src="../assets/icons/delete.svg" alt="Excluir" width="15px">
							</span>
						</div>
					</div>
				</div>
			</section>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

// Dados reativos
const newToken = ref('');
const searchTerm = ref('');

// Novos toggles para os controles globais
const activateAllToggle = ref(true); // Começa ativo, como no cenário inicial
const deactivateAllToggle = ref(false);
const hideEmailsToggle = ref(false);


const copiers = ref([
	{
		id: 1,
		name: 'João Santos',
		email: 'joao.santos@email.com',
		tag: 'APP',
		multiplier: '1.5x',
		profitTarget: 100,
		lossLimit: 50,
		balance: 310,
		pnl: 8.20,
		isActive: true,
	},
	{
		id: 2,
		name: 'Maria Oliveira',
		email: 'maria.oliveira@email.com',
		tag: 'WEB',
		multiplier: '1.0x',
		profitTarget: 50,
		lossLimit: 25,
		balance: 550,
		pnl: -3.50,
		isActive: true,
	},
	{
		id: 3,
		name: 'Pedro Costa',
		email: 'pedro.costa@outro.com',
		tag: 'APP',
		multiplier: '2.0x',
		profitTarget: 200,
		lossLimit: 100,
		balance: 1200,
		pnl: 15.10,
		isActive: true,
	},
]);

// Funções de manipulação
const addCopier = () => {
	if (newToken.value.trim() !== '') {
		console.log('Adicionar copiador com token:', newToken.value);
		const newId = Math.max(...copiers.value.map(c => c.id)) + 1;
		copiers.value.push({
			id: newId,
			name: 'Novo Copiador',
			email: `copier_${newId}@email.com`,
			tag: 'NEW',
			multiplier: '1.0x',
			profitTarget: 50,
			lossLimit: 25,
			balance: 100,
			pnl: 0.00,
			isActive: true,
		});
		newToken.value = ''; // Limpa o campo
	}
};

const deleteCopier = (id) => {
	if (confirm('Tem certeza que deseja remover este copiador?')) {
		copiers.value = copiers.value.filter(copier => copier.id !== id);
	}
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
</script>

<style scoped>

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

.container-copiers {
	width: 100%;
	padding: 20px;
}


/* Header */
.header {
	margin-bottom:15px;
	border-bottom: 1px solid #2a2a2a;
	padding-bottom: 25px;
	text-align: left;
}

.box{
	background-color: #0d0d0c;
  padding: 30px;
  margin-bottom: 20px;
  border-radius: 12px;
  border: 1px solid #2a2a2a;
}


.header h1 {
	font-size: 22px;
	font-weight: 700;
	margin-bottom: 8px;
	color: #ffffff;
}

.header p {
	color: #888888;
	font-size: 14px;
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
  border-bottom: 1px solid #2a2a2a;
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
}

.input-search {
	width: 100%; 
	padding-right: 40px; /* Garante que o texto não vá para baixo do ícone */
}

.search-icon {
	color: #888888; 
	font-size: 18px;
	cursor: default; 
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
}

.btn-adicionar:hover {
	background-color: #00b872;
}

/* Controls Bar - ESTILO COM SLIDERS */
.controls-bar {
	display: flex;
	gap: 30px;
	flex-wrap: wrap;
  padding-top: 20px;
}

.switch-control { /* Estilo do Label/Container */
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 14px;
	color: #ffffff;
	cursor: pointer;
	position: relative;
}

.switch-control input[type="checkbox"] {
	opacity: 0;
	width: 0;
	height: 0;
}

.slider-control { /* O "trilho" do slider */
	position: relative;
	display: inline-block;
	width: 48px; 
	height: 30px;
	background-color: #181818; 
	transition: 0.3s;
	border-radius: 34px;
}

.slider-control:before { /* O "thumb" (círculo) */
	position: absolute;
	content: "";
	height: 22px;
	width: 22px;
	left: 3px;
	bottom: 3px;
	background-color: #ffffff;
	transition: 0.3s;
	border-radius: 50%;
}

.switch-control input:checked + .slider-control {
	background-color: #00d084; /* Cor ON */
}

.switch-control input:checked + .slider-control:before {
	transform: translateX(18px); /* Move o thumb */
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
}

.action-icon:hover {
	color: #ffffff;
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

/* Responsive */
@media (max-width: 768px) {
	body {
		padding: 20px 15px;
	}

	.copiador-item {
		flex-direction: column;
		align-items: flex-start;
	}

	.copiador-stats {
		width: 100%;
		justify-content: space-between;
	}

	.stat-item {
		min-width: auto;
	}
}
</style>