<template>
	<div class="layout">
		<button
			class="hamburger-btn"
			@click="toggleMobileSidebar"
			:class="{ active: isSidebarOpen }"
		>
			<span></span>
			<span></span>
			<span></span>
		</button>

		<div
			v-if="isSidebarOpen && isMobile"
			class="sidebar-overlay"
			@click="closeSidebar"
		></div>

		<AppSidebar 
			:is-open="isSidebarOpen" 
			:is-collapsed="isSidebarCollapsed" 
			:is-mobile="isMobile"
			@close-sidebar="closeSidebar" 
			@toggle-collapse="toggleSidebarCollapse" 
		/>

		<div class="dashboard-content-wrapper" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
			<!-- Top Navbar -->
			<TopNavbar 
				v-if="!isMobile"
				:is-sidebar-collapsed="isSidebarCollapsed"
				@toggle-sidebar="isSidebarOpen = !isSidebarOpen"
				@toggle-sidebar-collapse="toggleSidebarCollapse"
			/>
			
			<!-- Mobile Header -->
			<div v-if="isMobile" class="mobile-header-admin">
				<button class="menu-toggler-btn" @click="isSidebarOpen = true">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
				<div class="mobile-brand">
					<span class="text-white font-bold text-lg">ZEN</span><span class="text-white font-bold text-lg">I</span><span class="text-[#22C55E] font-bold text-lg">X</span>
				</div>
			</div>

		<main class="layout-content">
			<div class="background-glow"></div>
			<div class="background-grid"></div>

			<div class="main-header">
				<div class="main-header-left">
					<h1>Estatísticas das IAs</h1>
					<p>Monitoramento de performance e resultados das IAs cadastradas na Deriv.</p>
				</div>
				<div class="main-header-right">
					<button class="btn pdf-btn" @click="exportReportToPDF">
						<img src="../../assets/icons/box-down.svg" alt="Exportar PDF" width="20px"> Exportar Relatório
					</button>
				</div>
			</div>

			<!-- Seção Principal - IA Desativada (Padrão) -->
			<div v-if="!tradingConfig.isActive && !aiMonitoring.isActive" class="ia-inactive-section">
				<!-- Card de Saldo e Status -->
				<div class="balance-status-card">
					<div class="balance-info">
						<div class="balance-main">
							<div class="balance-label">Saldo</div>
							<div class="balance-value">{{ formatBalance(accountBalance) }}</div>
							<div class="account-type">
								<span :class="['account-badge', accountType === 'Real' ? 'real' : 'demo']">
									{{ accountType }}
								</span>
							</div>
						</div>
						<div class="result-today">
							<div class="result-label">Resultado Hoje</div>
							<div :class="['result-value', todayResult >= 0 ? 'positive' : 'negative']">
								{{ todayResult >= 0 ? '+' : '' }}{{ formatCurrency(todayResult) }}
							</div>
							<div :class="['result-percent', todayResultPercent >= 0 ? 'positive' : 'negative']">
								({{ todayResultPercent >= 0 ? '+' : '' }}{{ todayResultPercent.toFixed(2) }}%)
							</div>
						</div>
						<div class="trades-today">
							<div class="trades-label">Trades Hoje</div>
							<div class="trades-value">{{ todayTrades }}</div>
						</div>
					</div>
					<div class="status-actions">
						<div class="status-info">
							<div class="status-label">Status</div>
							<div class="status-value inactive">IA Inativa</div>
						</div>
						<button class="btn-activate-ia" @click="activateIAFromDefault">
							▶ Ativar IA
						</button>
						<button class="btn-disconnect">Desconectar</button>
					</div>
				</div>

				<!-- Visão da IA | Orion -->
				<div class="ia-vision-card">
					<div class="vision-header">
						<h3>Visão da IA | Orion</h3>
						<p>Análise em tempo real do mercado</p>
					</div>
					<div class="vision-status">
						<div class="status-item">
							<span class="status-dot active"></span>
							<span class="status-text">Operando</span>
						</div>
						<div class="status-item">
							<span class="status-label">IA Orion</span>
							<span class="status-value" style="display: inline-flex; align-items: center; gap: 4px;">
								Ativo Atual
								<div class="tooltip-container">
									<svg class="icon-help" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<circle cx="12" cy="12" r="10"></circle>
										<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
										<line x1="12" y1="17" x2="12.01" y2="17"></line>
									</svg>
									<span class="tooltip-text">Ativo que a IA analisa agora.</span>
								</div>
							</span>
						</div>
					</div>
					<div class="market-info-grid">
						<div class="info-item">
							<div class="info-label">EUR/USD</div>
							<div class="info-value">Forex</div>
						</div>
						<div class="info-item">
							<div class="info-label">Timeframe</div>
							<div class="info-value">M5</div>
						</div>
						<div class="info-item">
							<div class="info-label">
								Probabilidade
								<div class="tooltip-container">
									<svg class="icon-help" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<circle cx="12" cy="12" r="10"></circle>
										<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
										<line x1="12" y1="17" x2="12.01" y2="17"></line>
									</svg>
									<span class="tooltip-text">Chance estimada de acerto do próximo sinal.</span>
								</div>
							</div>
							<div class="info-value high-confidence">82%</div>
							<div class="info-hint">Alta confiança</div>
						</div>
						<div class="info-item">
							<div class="info-label">
								Latência
								<div class="tooltip-container">
									<svg class="icon-help" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<circle cx="12" cy="12" r="10"></circle>
										<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
										<line x1="12" y1="17" x2="12.01" y2="17"></line>
									</svg>
									<span class="tooltip-text">Tempo de resposta da IA com o servidor.</span>
								</div>
							</div>
							<div class="info-value excellent">12ms</div>
							<div class="info-hint">Excelente</div>
						</div>
						<div class="info-item">
							<div class="info-label">
								Última Leitura
								<div class="tooltip-container">
									<svg class="icon-help" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<circle cx="12" cy="12" r="10"></circle>
										<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
										<line x1="12" y1="17" x2="12.01" y2="17"></line>
									</svg>
									<span class="tooltip-text">Momento da última análise do mercado.</span>
								</div>
							</div>
							<div class="info-value">{{ lastReadingTime }}</div>
							<div class="info-hint">Agora</div>
						</div>
						<div class="info-item">
							<div class="info-label">
								Status
								<div class="tooltip-container">
									<svg class="icon-help" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<circle cx="12" cy="12" r="10"></circle>
										<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
										<line x1="12" y1="17" x2="12.01" y2="17"></line>
									</svg>
									<span class="tooltip-text">Situação operacional da IA no momento.</span>
								</div>
							</div>
							<div class="info-value status-active">Ativo</div>
							<div class="info-hint">Monitorando</div>
						</div>
					</div>
					<div class="precision-info">
						<div class="precision-item">
							<div class="precision-label">Precisão</div>
							<div class="precision-value">78%</div>
						</div>
						<div class="precision-item">
							<div class="precision-label">
								WinRate
								<div class="tooltip-container">
									<svg class="icon-help" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<circle cx="12" cy="12" r="10"></circle>
										<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
										<line x1="12" y1="17" x2="12.01" y2="17"></line>
									</svg>
									<span class="tooltip-text">Taxa de acerto recente da IA.</span>
								</div>
							</div>
							<div class="precision-value">{{ winRate }}%</div>
						</div>
					</div>
					
					<!-- Análise de Mercado -->
					<div class="market-analysis-section">
						<div class="market-analysis-header">
							<h3>Análise de Mercado</h3>
							<div class="market-analysis-meta">
								<span>Volatility 10 • M5 • Última atualização: {{ lastReadingTime }}</span>
							</div>
						</div>
						<div class="market-chart-container">
							<div ref="marketChartContainerInactive" class="market-chart-wrapper"></div>
							<div v-if="!marketChartInitializedInactive && aiMonitoring.ticks.length === 0" class="chart-placeholder">
								<p>Gráfico em tempo real (não implementado)</p>
								<p class="chart-placeholder-hint">Aguardando dados de preço...</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Configurações -->
				<div class="config-section-inactive">
					<!-- Mercado & Estratégia -->
					<div class="config-group">
						<div class="config-group-header">
							<h4>Mercado & Estratégia <span class="info-icon">ⓘ</span></h4>
						</div>
						<div class="config-group-content">
							<div class="config-field">
								<label>
									Selecionar o mercado
									<div class="tooltip-container">
										<svg class="icon-help" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
											<circle cx="12" cy="12" r="10"></circle>
											<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
											<line x1="12" y1="17" x2="12.01" y2="17"></line>
										</svg>
										<span class="tooltip-text">Escolha o ativo que deseja operar.</span>
									</div>
								</label>
								<div class="select-field disabled">
									<span>EUR/USD - Forex</span>
								</div>
							</div>
							<div class="config-field">
								<label>
									Estratégia
									<div class="tooltip-container">
										<svg class="icon-help" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
											<circle cx="12" cy="12" r="10"></circle>
											<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
											<line x1="12" y1="17" x2="12.01" y2="17"></line>
										</svg>
										<span class="tooltip-text">Modelo de análise usado pela IA</span>
									</div>
								</label>
								<div class="select-field disabled">
									<span>IA Orion - Alta Performance</span>
									<small>Análise técnica avançada com machine learning</small>
								</div>
							</div>
						</div>
					</div>

					<!-- Modo de Negociação -->
					<div class="config-group">
						<div class="config-group-header">
							<h4>Modo de Negociação</h4>
						</div>
						<div class="config-group-content">
							<div class="mode-options">
								<button class="mode-option active" disabled>
									⚡ Veloz
									<span class="mode-hint">Executa sinais imediatamente</span>
								</button>
								<button class="mode-option" disabled>⚖️ Moderado</button>
								<button class="mode-option" disabled>🐢 Devagar</button>
							</div>
						</div>
					</div>

					<!-- Parâmetros de Entrada -->
					<div class="config-group">
						<div class="config-group-header">
							<h4>Parâmetros de Entrada</h4>
						</div>
						<div class="config-group-content">
							<div class="input-group">
								<label>Valor de Entrada (USD)</label>
								<span class="input-hint">Valor por operação (mínimo: $0.35)</span>
								<input 
									type="number" 
									v-model.number="tradingConfig.stakeAmount" 
									min="0.35"
									step="0.5"
									placeholder="50"
									:disabled="tradingConfig.isActive"
								/>
								<button 
									v-if="!tradingConfig.isActive"
									class="btn-save-config" 
									@click="updateStakeAmount"
									:disabled="isUpdatingConfig"
								>
									{{ isUpdatingConfig ? 'Salvando...' : '💾 Salvar Alteração' }}
								</button>
								<span v-if="configUpdateMessage" :class="['config-message', configUpdateSuccess ? 'success' : 'error']">
									{{ configUpdateMessage }}
								</span>
							</div>
							<div class="input-group">
								<label>Alvo de Lucro (USD)</label>
								<span class="input-hint">Meta diária de lucro</span>
								<input 
									type="number" 
									v-model.number="tradingConfig.profitTarget" 
									min="0"
									step="0.01"
									placeholder="100"
									disabled
								/>
							</div>
							<div class="input-group">
								<label>Limite de Perda (USD)</label>
								<span class="input-hint">Stop loss diário</span>
								<input 
									type="number" 
									v-model.number="tradingConfig.lossLimit" 
									min="0"
									step="0.01"
									placeholder="25"
									disabled
								/>
							</div>
						</div>
					</div>

					<!-- Gerenciamento de Risco -->
					<div class="config-group">
						<div class="config-group-header">
							<h4>Gerenciamento de Risco</h4>
						</div>
						<div class="config-group-content">
							<div class="risk-options">
								<button class="risk-option" disabled>Fixo</button>
								<button class="risk-option active" disabled>
									🛡️ Conservador
									<span class="risk-hint">Nível de Risco: Baixo</span>
									<span class="risk-description">Proteção máxima do capital com crescimento estável</span>
								</button>
								<button class="risk-option" disabled>⚖️ Moderado</button>
								<button class="risk-option" disabled>⚡ Agressivo</button>
							</div>
						</div>
					</div>

					<!-- Controle da IA -->
					<div class="config-group">
						<div class="config-group-header">
							<h4>Controle da IA</h4>
						</div>
						<div class="config-group-content">
							<div class="control-info">
								<div class="control-status">
									<span class="status-label">Status da IA</span>
									<span class="status-badge inactive">Inativa</span>
								</div>
								<p class="control-hint">Quando ativada, a IA executa operações automaticamente</p>
							</div>
						</div>
					</div>

					<!-- Logs Recentes -->
					<div class="config-group">
						<div class="config-group-header">
							<h4>Logs Recentes</h4>
						</div>
						<div class="config-group-content">
							<div class="logs-container">
								<div v-if="recentLogs.length === 0" class="no-logs">
									<p>Nenhum log disponível</p>
								</div>
								<div v-else class="logs-list">
									<div v-for="(log, index) in recentLogs" :key="index" class="log-item">
										<span class="log-time">{{ log.time }}</span>
										<span class="log-message">{{ log.message }}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Seção de Monitoramento de IA (aparece quando monitoramento está ativo) -->
			<div v-if="aiMonitoring.isActive" class="ai-monitoring-section">
				<div class="ai-monitoring-header">
					<h2>Monitor de Volatilidade 100</h2>
					<button :class="['btn-ai-toggle', aiMonitoring.isActive ? 'active' : '']" @click="toggleAIMonitoring">
						<span v-if="!aiMonitoring.isActive">▶ Ativar IA</span>
						<span v-else>⏸ Desativar IA</span>
					</button>
				</div>

				<div class="ai-monitoring-content">
					<div class="price-display-section">
						<div class="current-price-card">
							<h3>Preço Atual</h3>
							<div class="price-value">
								<span v-if="aiMonitoring.currentPrice">{{ aiMonitoring.currentPrice.toFixed(2) }}</span>
								<span v-else>--</span>
							</div>
							<p class="price-timestamp">{{ aiMonitoring.lastUpdate }}</p>
						</div>

						<div class="last-10-prices-card">
							<h3>Últimos 10 Preços</h3>
							<div class="price-list">
								<div v-for="(tick, index) in aiMonitoring.ticks" :key="index" class="price-item">
									<span class="price-number">{{ (index + 1).toString().padStart(2, '0') }}.</span>
									<span class="price-value-item">{{ tick.value.toFixed(2) }}</span>
									<span class="price-time">{{ tick.timestamp }}</span>
									<span v-if="index > 0" :class="['price-variation', getVariationClass(tick.value, aiMonitoring.ticks[index - 1].value)]">
										{{ getVariationText(tick.value, aiMonitoring.ticks[index - 1].value) }}
									</span>
								</div>
								<div v-if="aiMonitoring.ticks.length === 0" class="no-data">
									<p>Aguardando dados...</p>
								</div>
							</div>
						</div>

						<div v-if="aiMonitoring.statistics" class="statistics-card">
							<h3>Estatísticas</h3>
							<div class="stats-grid">
								<div class="stat-item">
									<span class="stat-label">Mínimo:</span>
									<span class="stat-value">{{ aiMonitoring.statistics.min.toFixed(2) }}</span>
								</div>
								<div class="stat-item">
									<span class="stat-label">Máximo:</span>
									<span class="stat-value">{{ aiMonitoring.statistics.max.toFixed(2) }}</span>
								</div>
								<div class="stat-item">
									<span class="stat-label">Média:</span>
									<span class="stat-value">{{ aiMonitoring.statistics.avg.toFixed(2) }}</span>
								</div>
								<div class="stat-item">
									<span class="stat-label">Variação:</span>
									<span :class="['stat-value', aiMonitoring.statistics.change >= 0 ? 'positive' : 'negative']">
										{{ aiMonitoring.statistics.change.toFixed(2) }}%
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Seção de Trading Automático -->
				<div v-if="aiMonitoring.isActive" class="ai-trading-section">
					<!-- Performance Summary Cards -->
					<div class="performance-summary-section">
						<div class="performance-cards-grid">
							<!-- Card 1 - Saldo Total -->
							<div class="premium-card performance-card">
								<div class="card-header-row">
									<span class="card-label">Saldo Total</span>
									<button class="eye-btn" @click="balanceVisibleActive = !balanceVisibleActive">
										<i :class="balanceVisibleActive ? 'fas fa-eye' : 'fas fa-eye-slash'" class="text-xs"></i>
									</button>
								</div>
								<div class="card-value-large">
									<span v-if="accountBalance !== null" class="balance-value" :class="{ 'hidden-value': !balanceVisibleActive }">
										{{ formatBalance(accountBalance) }}
									</span>
									<span v-else class="text-zenix-secondary">Carregando...</span>
								</div>
								<div class="card-actions-row">
									<button :class="['account-type-btn', accountType === 'Real' ? 'active' : '']" @click="accountType = 'Real'">Real</button>
									<button :class="['account-type-btn', accountType === 'Demo' ? 'active' : '']" @click="accountType = 'Demo'">Demo</button>
								</div>
							</div>

							<!-- Card 2 - Lucro do Dia -->
							<div class="premium-card performance-card">
								<div class="card-header-row">
									<span class="card-label">Lucro do Dia</span>
									<button class="eye-btn" @click="profitVisibleActive = !profitVisibleActive">
										<i :class="profitVisibleActive ? 'fas fa-eye' : 'fas fa-eye-slash'" class="text-xs"></i>
									</button>
								</div>
								<div class="card-value-large">
									<span :class="['profit-value', todayResult >= 0 ? 'positive' : 'negative', { 'hidden-value': !profitVisibleActive }]">
										{{ todayResult >= 0 ? '+' : '' }}{{ formatCurrency(todayResult) }}
									</span>
								</div>
								<span class="profit-percentage" :class="todayResultPercent >= 0 ? 'positive' : 'negative'">
									{{ todayResultPercent >= 0 ? '+' : '' }}{{ todayResultPercent.toFixed(2) }}%
								</span>
							</div>

							<!-- Card 3 - Winrate -->
							<div class="premium-card performance-card">
								<div class="card-header-row">
									<span class="card-label">Winrate</span>
									<button class="eye-btn" @click="winrateVisibleActive = !winrateVisibleActive">
										<i :class="winrateVisibleActive ? 'fas fa-eye' : 'fas fa-eye-slash'" class="text-xs"></i>
									</button>
								</div>
								<div class="card-value-large">
									<span class="winrate-value" :class="{ 'hidden-value': !winrateVisibleActive }">
										{{ winRate }}%
									</span>
								</div>
								<span class="text-xs" :class="winRate >= 70 ? 'text-zenix-green' : winRate >= 50 ? 'text-yellow-500' : 'text-zenix-red'" style="font-weight: 500;">
									{{ winRate >= 70 ? 'Ótimo' : winRate >= 50 ? 'Regular' : 'Baixo' }}
								</span>
							</div>

							<!-- Card 4 - Trades Hoje -->
							<div class="premium-card performance-card">
								<div class="card-header-row">
									<span class="card-label">Trades Hoje</span>
									<button class="eye-btn" @click="tradesVisibleActive = !tradesVisibleActive">
										<i :class="tradesVisibleActive ? 'fas fa-eye' : 'fas fa-eye-slash'" class="text-xs"></i>
									</button>
								</div>
								<div class="card-value-large">
									<span class="trades-value" :class="{ 'hidden-value': !tradesVisibleActive }">
										{{ todayTrades }}
									</span>
								</div>
								<div class="trades-stats-row">
									<span class="text-xs text-zenix-green font-medium">{{ tradingStats.wins || 0 }} Vitórias</span>
									<span class="text-xs text-zenix-red/70 font-medium">{{ tradingStats.losses || 0 }} Perdas</span>
								</div>
							</div>
						</div>

						<!-- Status da Operação Card -->
						<div class="premium-card status-card">
							<div class="status-card-content">
								<div class="status-card-left">
									<div class="ai-status-widget">
										<div class="ai-status-bg"></div>
										<div class="ai-status-content">
											<div class="ai-status-spinner-wrapper">
												<div class="ai-status-pulse-bg"></div>
												<div class="ai-status-spinner">
													<svg fill="none" viewBox="0 0 24 24" class="spinner-svg">
														<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="20 60" opacity="0.3"></circle>
														<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="15 65" stroke-linecap="round"></circle>
													</svg>
												</div>
											</div>
										</div>
									</div>
									<div class="status-text-content">
										<h3 class="status-title">Status da Operação</h3>
										<div class="status-subtitle-row">
											<span class="status-indicator-text text-[#FFD058] font-medium">Analisando</span>
											<span class="status-indicator-dot">•</span>
											<span class="status-indicator-subtext">Aguardando padrão de entrada</span>
										</div>
									</div>
								</div>
								<div class="status-card-right">
									<div class="ai-online-indicator">
										<div class="ai-pulse-dot"></div>
										<span class="text-xs font-medium text-zenix-green">IA Online</span>
									</div>
									<button 
										class="deactivate-ai-btn-new" 
										@click="deactivateIAFromActive"
										:disabled="isDeactivating"
										title="Desativar IA"
									>
										<i class="fas fa-power-off"></i>
										<span>{{ isDeactivating ? 'Desativando...' : 'Desativar IA' }}</span>
									</button>
								</div>
							</div>
						</div>
					</div>

					<div class="ai-trading-header">
						<h2>🤖 Trading Automático com IA</h2>
						
						<!-- Banner de IA Ativa -->
						<div v-if="tradingConfig.isActive" class="ai-active-banner">
							<div class="banner-icon">🤖</div>
							<div class="banner-content">
								<strong>IA ATIVA</strong>
								<span>Operando em background 24/7</span>
							</div>
							<div class="banner-status">
								<span class="status-indicator"></span>
								<span>Online</span>
							</div>
						</div>
						
						<!-- Configurações Fixas (apenas visualização) -->
						<div class="fixed-config-info">
							<div class="config-info-item">
								<label>
									Mercado:
									<div class="tooltip-container">
										<svg class="icon-help" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
											<circle cx="12" cy="12" r="10"></circle>
											<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
											<line x1="12" y1="17" x2="12.01" y2="17"></line>
										</svg>
										<span class="tooltip-text">Escolha o ativo que deseja operar.</span>
									</div>
								</label>
								<span class="fixed-value">Volatilidade 100 (R_10)</span>
							</div>
							<div class="config-info-item">
								<label>
									Estratégia:
									<div class="tooltip-container">
										<svg class="icon-help" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
											<circle cx="12" cy="12" r="10"></circle>
											<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
											<line x1="12" y1="17" x2="12.01" y2="17"></line>
										</svg>
										<span class="tooltip-text">Modelo de análise usado pela IA</span>
									</div>
								</label>
								<span class="fixed-value">Veloz Automático</span>
							</div>
							<div class="config-info-item">
								<label>Modo de Negociação:</label>
								<span class="fixed-value">⚡ Veloz</span>
							</div>
						</div>
						
						<!-- Parâmetros de Entrada -->
						<div class="trading-controls">
							<div class="input-group">
								<label>Valor de Entrada (USD)</label>
								<span class="input-hint">Valor por operação (mínimo: $0.35)</span>
								<input 
									type="number" 
									v-model.number="tradingConfig.stakeAmount" 
									min="0.35"
									step="0.5"
									:disabled="tradingConfig.isActive"
									placeholder="50"
								/>
								<button 
									v-if="!tradingConfig.isActive"
									class="btn-save-config" 
									@click="updateStakeAmount"
									:disabled="isUpdatingConfig"
								>
									{{ isUpdatingConfig ? 'Salvando...' : '💾 Salvar Alteração' }}
								</button>
								<span v-if="configUpdateMessage" :class="['config-message', configUpdateSuccess ? 'success' : 'error']">
									{{ configUpdateMessage }}
								</span>
							</div>
							
							<div class="input-group">
								<label>Alvo de Lucro (USD)</label>
								<span class="input-hint">Meta diária de lucro</span>
								<input 
									type="number" 
									v-model.number="tradingConfig.profitTarget" 
									min="0"
									step="0.01"
									:disabled="tradingConfig.isActive"
									placeholder="100"
								/>
							</div>
							
							<div class="input-group">
								<label>Limite de Perda (USD)</label>
								<span class="input-hint">Stop loss diário</span>
								<input 
									type="number" 
									v-model.number="tradingConfig.lossLimit" 
									min="0"
									step="0.01"
									:disabled="tradingConfig.isActive"
									placeholder="25"
								/>
							</div>
							
							<button 
								:class="['btn-trading-toggle', tradingConfig.isActive ? 'active' : '']" 
								@click="toggleAutomatedTrading"
								:disabled="!aiMonitoring.isActive"
							>
								<span v-if="!tradingConfig.isActive">▶ Ativar IA</span>
								<span v-else>⏸ Desativar IA</span>
							</button>
						</div>
					</div>

					<!-- Análise de Mercado (IA Ativa) -->
					<div class="market-analysis-section">
						<div class="market-analysis-header">
							<h3>Análise de Mercado</h3>
							<div class="market-analysis-meta">
								<span>Volatility 10 • M5 • Última atualização: {{ aiMonitoring.lastUpdate || lastReadingTime }}</span>
							</div>
						</div>
						
						<!-- Controles do gráfico (IA ativa) -->
						<div class="chart-controls-active">
							<div class="zoom-buttons">
								<button
									@click="setZoomPeriodActive(10)"
									:class="['zoom-btn', zoomPeriodActive === 10 ? 'active' : '']"
								>10m</button>
								<button
									@click="setZoomPeriodActive(5)"
									:class="['zoom-btn', zoomPeriodActive === 5 ? 'active' : '']"
								>5m</button>
								<button
									@click="setZoomPeriodActive(3)"
									:class="['zoom-btn', zoomPeriodActive === 3 ? 'active' : '']"
								>3m</button>
							</div>
							<button class="type-toggle" @click="toggleChartTypeActive">
								<i :class="chartTypeActive === 'line' ? 'fas fa-chart-line' : 'fas fa-chart-bar'"></i>
								<span>{{ chartTypeActive === 'line' ? 'Linhas' : 'Velas' }}</span>
							</button>
						</div>
						<div class="market-chart-container">
							<div ref="marketChartContainerActive" class="market-chart-wrapper"></div>
							<div v-if="!marketChartInitializedActive && aiMonitoring.ticks.length === 0" class="chart-placeholder">
								<p>Gráfico em tempo real (não implementado)</p>
								<p class="chart-placeholder-hint">Aguardando dados de preço...</p>
							</div>
						</div>
					</div>

					<div v-if="tradingConfig.isActive" class="trading-active-content">
						<!-- Operação Ativa -->
						<div v-if="activeTrade" class="active-trade-card">
							<div class="trade-header">
								<h3>📊 Operação em Andamento</h3>
								<span :class="['trade-signal', activeTrade.signal]">
									{{ activeTrade.signal === 'CALL' ? '📈 CALL' : '📉 PUT' }}
								</span>
							</div>

							<div class="trade-details">
								<div class="detail-row">
									<span class="detail-label">Preço de Entrada:</span>
									<span class="detail-value">${{ activeTrade.entryPrice?.toFixed(2) }}</span>
								</div>
								<div class="detail-row">
									<span class="detail-label">Preço Atual:</span>
									<span :class="['detail-value', getPriceChangeClass(activeTrade.entryPrice, activeTrade.currentPrice)]">
										${{ activeTrade.currentPrice?.toFixed(2) || '--' }}
									</span>
								</div>
								<div class="detail-row">
									<span class="detail-label">Variação:</span>
									<span :class="['detail-value', getPriceChangeClass(activeTrade.entryPrice, activeTrade.currentPrice)]">
										{{ getPriceDifference() }} ({{ getPriceChangePercent() }})
									</span>
								</div>
								<div class="detail-row">
									<span class="detail-label">Tempo Restante:</span>
									<span class="detail-value countdown">{{ formatTimeRemaining(activeTrade.timeRemaining) }}</span>
								</div>
								<div class="detail-row">
									<span class="detail-label">Investimento:</span>
									<span class="detail-value">${{ activeTrade.stakeAmount?.toFixed(2) }}</span>
								</div>
								<div class="detail-row profit-row">
									<span class="detail-label">Lucro Estimado:</span>
									<span :class="['detail-value profit-value', getEstimatedProfitClass()]">
										{{ getEstimatedProfit() }}
									</span>
								</div>
								
								<!-- Barra de progresso visual -->
								<div class="profit-progress-bar">
									<div :class="['progress-fill', getEstimatedProfitClass()]" :style="{ width: getProgressBarWidth() }"></div>
									<span class="progress-label">{{ isCurrentlyWinning() ? '✓ Ganhando' : '✗ Perdendo' }}</span>
								</div>
							</div>

							<div class="trade-reasoning">
								<p><strong>Análise da IA:</strong> {{ activeTrade.reasoning }}</p>
							</div>
						</div>

					<!-- Aguardando Próxima Operação -->
					<div v-else class="next-trade-card">
						<div class="next-trade-info">
							<div class="timer-icon">⏱️</div>
							<div>
								<h3>🔄 Aguardando próxima operação...</h3>
								<p class="countdown-text">Intervalo de segurança: {{ formatTimeRemaining(nextTradeCountdown) }}</p>
								<p class="info-text">A IA analisará o mercado novamente em breve</p>
							</div>
						</div>
					</div>

						<!-- Estatísticas do Trading -->
						<div class="trading-stats-card">
							<h3>Estatísticas da Sessão</h3>
							<div class="stats-row">
								<div class="stat-box">
									<span class="stat-number">{{ tradingStats.totalTrades }}</span>
									<span class="stat-label">Total de Operações</span>
								</div>
								<div class="stat-box win">
									<span class="stat-number">{{ tradingStats.wins }}</span>
									<span class="stat-label">Vitórias</span>
								</div>
								<div class="stat-box loss">
									<span class="stat-number">{{ tradingStats.losses }}</span>
									<span class="stat-label">Perdas</span>
								</div>
								<div class="stat-box">
									<span :class="['stat-number', tradingStats.profitLoss >= 0 ? 'positive' : 'negative']">
										{{ tradingStats.profitLoss >= 0 ? '+' : '' }}${{ tradingStats.profitLoss.toFixed(2) }}
									</span>
									<span class="stat-label">Lucro/Perda</span>
								</div>
							</div>
						</div>
					</div>

					<!-- Histórico de Operações -->
					<div v-if="tradingConfig.isActive" class="trade-history-card">
						<div class="history-header">
							<h3>📋 Histórico de Operações</h3>
							<button class="btn-refresh" @click="loadTradeHistory">🔄 Atualizar</button>
						</div>
						
						<div v-if="tradeHistory.length > 0" class="history-table">
							<table>
								<thead>
									<tr>
										<th>Mercado</th>
										<th>Negociação</th>
										<th>Preço Entrada</th>
										<th>Preço Saída</th>
										<th>Investimento</th>
										<th>Retorno</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="trade in tradeHistory" :key="trade.id" :class="['trade-row', trade.status.toLowerCase()]">
										<td>{{ trade.symbol || 'R_10' }}</td>
										<td>
											<span :class="['signal-badge', (trade.signal || trade.geminiSignal || '').toLowerCase()]">
												{{ (trade.signal || trade.geminiSignal || '') === 'CALL' || (trade.signal || trade.geminiSignal || '') === 'PAR' ? '📈 PAR' : '📉 ÍMPAR' }}
											</span>
										</td>
										<td>${{ (trade.entryPrice || trade.entry_price || 0).toFixed(2) }}</td>
										<td>
											<span v-if="trade.exitPrice || trade.exit_price">${{ (trade.exitPrice || trade.exit_price || 0).toFixed(2) }}</span>
											<span v-else class="text-muted">-</span>
										</td>
										<td>${{ (trade.stakeAmount || trade.stake_amount || 0).toFixed(2) }}</td>
										<td :class="['profit-cell', (trade.profitLoss || trade.profit_loss || 0) >= 0 ? 'positive' : 'negative']">
											{{ (trade.profitLoss || trade.profit_loss || 0) >= 0 ? '+' : '' }}${{ (trade.profitLoss || trade.profit_loss || 0).toFixed(2) }}
										</td>
									</tr>
								</tbody>
							</table>
						</div>

						<div v-else class="no-history">
							<p>📊 Nenhuma operação realizada ainda</p>
							<p class="hint">As operações aparecerão aqui após serem finalizadas</p>
						</div>
					</div>
				</div>
			</div>

			<div class="main-content">
				<div class="filter-controls">
					<div class="date-filter">
						<input type="date" v-model="filterStartDate">
					</div>
					<div class="date-filter">
						<input type="date" v-model="filterEndDate">
					</div>
					<button class="btn btn-search" @click="fetchData">Buscar</button>
				</div>

				<div class="table-container" id="ia-stats-table">
					<table>
						<thead>
							<tr>
								<th class="bot-name-col">Nome do Bot</th>
								<th>Total de Trades</th>
								<th>Ganho</th>
								<th>Perda</th>
								<th class="profit-col">Lucro Total</th>
								<th>Lucro Alcançado</th>
								<th>Perda Alcançada</th>
								<th>Parada Ativada</th>
								<th>Risco Mais Usado</th>
								<th>Modo Mais Usado</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="bot in displayedStats" :key="bot.name">
								<td class="bot-name-col">
									<span :class="['status-dot', bot.status]"></span>
									{{ bot.name }}
								</td>
								<td>{{ bot.totalTrades }}</td>
								<td>{{ bot.wins }}</td>
								<td>{{ bot.losses }}</td>
								<td :class="['profit-col', bot.profit >= 0 ? 'positive-profit' : 'negative-profit']">
									{{ formatCurrency(bot.profit) }}
								</td>
								<td>{{ bot.profitReached }}</td>
								<td>{{ bot.lossReached }}</td>
								<td>{{ bot.activeStop }}</td>
								<td>{{ bot.riskMode }}</td>
								<td>{{ bot.tradeMode }}</td>
							</tr>
						</tbody>
					</table>
				</div>
				
				<div class="bottom-summary-cards">
					<div class="bottom-card">
						<div class="card-content">
							<img src="../../assets/icons/robot.svg" alt="Total de IAs Ativas" class="card-icon" >
							<div class="card-text-group"> 
								<p class="card-value card-value-white">12</p>
								<h3 class="card-title">Total de IAs Ativas</h3>
							</div>
						</div>
					</div>

					<div class="bottom-card">
						<div class="card-content">
							<img src="../../assets/icons/stats.svg" alt="Lucro Combinado (7 dias)" class="card-icon">
							<div class="card-text-group"> 
								<p class="card-value positive-profit">+U$ 5.481,20</p>
								<h3 class="card-title">Lucro Combinado (7 dias)</h3>
							</div>
						</div>
					</div>

					<div class="bottom-card">
						<div class="card-content">
							<img src="../../assets/icons/target-IA.svg" alt="Média de Acerto Global" class="card-icon">
							<div class="card-text-group"> 
								<p class="card-value card-value-white">72,4%</p>
								<h3 class="card-title">Média de Acerto Global</h3>
							</div>
						</div>
					</div>

					<div class="bottom-card">
						<div class="card-content">
							<img src="../../assets/icons/trophy.svg" alt="IA com Maior Lucro" class="card-icon">
							<div class="card-text-group"> 
								<p class="card-value positive-profit">IA Zenix 2 <span class="card-value-white">(+3,848.93)</span></p>
								<h3 class="card-title">IA com Maior Lucro</h3>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
		</div>
	</div>
	
	<!-- Modais de Stop Loss e Target Profit -->
	<StopLossModal
		:visible="showStopLossModal"
		:result="sessionResult"
		:currency="accountType === 'Demo' ? 'DEMO' : 'USD'"
		@confirm="handleStopLossConfirm"
	/>
	
	<TargetProfitModal
		:visible="showTargetProfitModal"
		:result="sessionResult"
		:currency="accountType === 'Demo' ? 'DEMO' : 'USD'"
		@confirm="handleTargetProfitConfirm"
	/>
</template>

<script>
import AppSidebar from '../../components/Sidebar.vue';
import TopNavbar from '../../components/TopNavbar.vue';
import StopLossModal from '../../components/StopLossModal.vue';
import TargetProfitModal from '../../components/TargetProfitModal.vue';
import { createChart, ColorType } from 'lightweight-charts';

export default {
	name: 'StatsIAs',
	components: {
		AppSidebar,
		TopNavbar,
		StopLossModal,
		TargetProfitModal,
	},
	data() {
		const currentDate = '2025-11-18';
		const startOfWeek = '2025-11-10'; 
	
		const botStats = [
			{ name: 'IA Zenix 2', status: 'active', totalTrades: 1320, wins: 1073, losses: 646, profit: 3848.93, profitReached: 399, lossReached: 0, activeStop: 71, riskMode: 'Conservador', tradeMode: 'Veloz' },
			{ name: 'IA Zenix 3', status: 'active', totalTrades: 2034, wins: 1456, losses: 845, profit: 1129.70, profitReached: 245, lossReached: 22, activeStop: 57, riskMode: 'Moderado', tradeMode: 'Veloz' },
			{ name: 'IA Orion V2', status: 'warning', totalTrades: 890, wins: 512, losses: 378, profit: 990.50, profitReached: 150, lossReached: 15, activeStop: 30, riskMode: 'Balanceado', tradeMode: 'Moderado' },
			{ name: 'IA Centauri', status: 'inactive', totalTrades: 315, wins: 150, losses: 165, profit: -210.00, profitReached: 40, lossReached: 55, activeStop: 25, riskMode: 'Agressivo', tradeMode: 'Lento' },
		];

		return {
			isSidebarOpen: false, 
			isSidebarCollapsed: false,
			isMobile: false,
			
			filterStartDate: startOfWeek, 
			filterEndDate: currentDate,  

			allStats: botStats,
			displayedStats: botStats, 

			totalActiveIAs: 12,
			combinedProfit7Days: 5481.20,
			globalAccuracy: 72.4,
			topProfitIA: 'IA Zenix 2 (+3,848.93)',

			// Monitoramento de IA
			aiMonitoring: {
				isActive: false,
				currentPrice: null,
				ticks: [],
				statistics: null,
				lastUpdate: '--',
			},
			aiPollingInterval: null,

			// Trading Automático
			tradingConfig: {
				isActive: false,
				stakeAmount: 50,
				mode: 'veloz', // Apenas veloz disponível
				profitTarget: 100,
				lossLimit: 25,
			},
			activeTrade: null,
			nextTradeCountdown: 300, // 5 minutos em segundos
			tradingInterval: null,
			countdownInterval: null,
			tradingStats: {
				totalTrades: 0,
				wins: 0,
				losses: 0,
				profitLoss: 0,
			},
			tradeHistory: [],
			tradeEventsSource: null,
			
			// Dados para tela padrão (IA desativada)
			accountBalance: 0,
			accountType: 'Demo', // Real ou Demo
			todayResult: 0,
			todayResultPercent: 0,
			todayTrades: 0,
			
			// Visibilidade dos cards na seção IA ativa
			balanceVisibleActive: true,
			profitVisibleActive: true,
			winrateVisibleActive: true,
			tradesVisibleActive: true,
			isDeactivating: false,
			lastReadingTime: '--:--:--',
			winRate: 78,
			recentLogs: [],
			
			// Estatísticas agregadas do StatsIAs
			statsIAs: {
				totalUsers: 0,
				activeUsers: 0,
				totalTrades: 0,
				totalWins: 0,
				totalLosses: 0,
				winRate: 0,
				totalProfit: 0,
				averageProfit: 0,
				source: 'local', // 'external' ou 'local'
			},
			tradingParams: {
				dvxMax: 70,
				window: 3,
				betPercent: 0.005,
			},
			
			// Gráfico IA ativa (market chart)
			chartTypeActive: 'line', // 'line' ou 'candles'
			zoomPeriodActive: 10, // minutos: 10 (padrão), 5, 3
			
			// Estado para atualização de configuração
			isUpdatingConfig: false,
			configUpdateMessage: '',
			configUpdateSuccess: false,
			
			// Gráfico de mercado
			marketChartInactive: null,
			marketLineSeriesInactive: null,
			marketChartInitializedInactive: false,
			marketChartActive: null,
			marketLineSeriesActive: null,
			marketChartInitializedActive: false,
			
			// Modais de Stop Loss e Target Profit
			showStopLossModal: false,
			showTargetProfitModal: false,
			sessionResult: 0,
			previousSessionStatus: null,
		};
	},
	computed: {
		chartData() {
			// Converter ticks para dados do gráfico (apenas valores)
			if (!this.aiMonitoring.ticks || this.aiMonitoring.ticks.length === 0) {
				return [];
			}
			// Pegar apenas os últimos 50 ticks para não sobrecarregar o gráfico
			const recentTicks = this.aiMonitoring.ticks.slice(-50);
			return recentTicks.map(tick => tick.value || tick.price || 0);
		},
	},
	methods: {
		formatCurrency(value) {
			const sign = value >= 0 ? '+' : ''; 
			const absoluteValue = Math.abs(value);
			return `${sign}${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(absoluteValue)}`;
		},
		
		formatBalance(value) {
			const formatter = new Intl.NumberFormat('pt-BR', { 
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			});
			// ✅ Se for conta Demo, usar símbolo Đ (D com barra)
			// Verificar tanto 'Demo' quanto 'demo' (case insensitive)
			const isDemo = this.accountType === 'Demo' || this.accountType === 'demo' || this.accountType?.toLowerCase() === 'demo';
			if (isDemo) {
				return `Đ${formatter.format(value)}`;
			}
			return `$${formatter.format(value)}`;
		},

		applySessionStats(data) {
			if (!data) return;
			
			const totalTrades = data.totalTrades ?? 0;
			const profitLoss = data.profitLoss ?? 0;
			
			// Atualizar blocos de estatística
			this.tradingStats.totalTrades = totalTrades;
			this.tradingStats.wins = data.wins ?? 0;
			this.tradingStats.losses = data.losses ?? 0;
			this.tradingStats.profitLoss = profitLoss;
			
			// Atualizar cards principais
			this.todayTrades = totalTrades;
			this.todayResult = profitLoss;
			
			// Atualizar resultado da sessão para os modais
			this.sessionResult = profitLoss;
			
			// Porcentagem baseada no saldo total atual
			const baseBalance = this.accountBalance > 0
				? this.accountBalance
				: (data.sessionBalance ?? 0);
			this.todayResultPercent = baseBalance > 0 ? (profitLoss / baseBalance) * 100 : 0;
		},
		
		/**
		 * Carrega o resultado da sessão para exibir nos modais
		 */
		async loadSessionResult() {
			try {
				const userId = this.getUserId();
				if (!userId) return;
				
				const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
				const response = await fetch(`${apiBase}/ai/session-stats/${userId}`, {
					headers: {
						'Authorization': `Bearer ${localStorage.getItem('token')}`
					}
				});
				const result = await response.json();
				
				if (result.success && result.data) {
					this.sessionResult = result.data.profitLoss || 0;
				}
			} catch (error) {
				console.error('[StatsIAsView] Erro ao carregar resultado da sessão:', error);
				// Usar resultado atual como fallback
				this.sessionResult = this.todayResult;
			}
		},
		
		/**
		 * Handler para confirmação do modal de Stop Loss
		 */
		async handleStopLossConfirm() {
			this.showStopLossModal = false;
			// Resetar previousSessionStatus para permitir nova detecção se necessário
			this.previousSessionStatus = null;
			// Recarregar configuração para atualizar status e garantir que IA está inativa
			await this.loadAIConfigOnMount();
			// Forçar atualização do status
			await this.fetchBackgroundStatus();
		},
		
		/**
		 * Handler para confirmação do modal de Target Profit
		 */
		async handleTargetProfitConfirm() {
			this.showTargetProfitModal = false;
			// Resetar previousSessionStatus para permitir nova detecção se necessário
			this.previousSessionStatus = null;
			// Recarregar configuração para atualizar status e garantir que IA está inativa
			await this.loadAIConfigOnMount();
			// Forçar atualização do status
			await this.fetchBackgroundStatus();
		},
		
		async loadAccountInfo() {
			try {
				// ✅ OTIMIZAÇÃO: Atualizar saldo da API primeiro (igual outras páginas)
				const connectionStr = localStorage.getItem('deriv_connection');
				if (!connectionStr) {
					// Sem conexão salva, usar dados do localStorage se existir
					this.loadAccountInfoFromLocal();
					return;
				}
				
				const connection = JSON.parse(connectionStr);
				const token = localStorage.getItem('deriv_token');
				const appId = localStorage.getItem('deriv_app_id') || '1089';
				
				// Se temos token, atualizar saldo da API
				if (token) {
					try {
						const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
						const response = await fetch(`${apiBase}/broker/deriv/status`, {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
								'Authorization': `Bearer ${localStorage.getItem('token')}`
							},
							body: JSON.stringify({
								token: token,
								appId: parseInt(appId),
								currency: connection.currency || 'USD'
							})
						});
						
						if (response.ok) {
							const data = await response.json();
							
							// Atualizar localStorage com dados atualizados
							const updatedConnection = {
								...data,
								loginid: connection.loginid || data.loginid,
								currency: connection.currency || data.currency || 'USD',
								isDemo: connection.isDemo !== undefined ? connection.isDemo : (data.loginid?.startsWith('VRTC') || data.loginid?.startsWith('VRT')),
								timestamp: Date.now()
							};
							localStorage.setItem('deriv_connection', JSON.stringify(updatedConnection));
							
							// Processar dados atualizados usando a mesma lógica do loadAccountInfoFromLocal
							const loginid = updatedConnection.loginid || '';
							const isDemo = loginid.startsWith('VRTC') || loginid.startsWith('VRT') || updatedConnection.isDemo === true;
							this.accountType = isDemo ? 'Demo' : 'Real';
							
							// Buscar saldo correto baseado no tipo de conta
							let balance = 0;
							if (isDemo && updatedConnection.balancesByCurrencyDemo) {
								const demoBalances = updatedConnection.balancesByCurrencyDemo;
								balance = demoBalances['USD'] || Object.values(demoBalances)[0] || 0;
							} else if (!isDemo && updatedConnection.balancesByCurrencyReal) {
								const realBalances = updatedConnection.balancesByCurrencyReal;
								balance = realBalances['USD'] || Object.values(realBalances)[0] || 0;
							} else {
								balance = updatedConnection.balance || updatedConnection.balanceAfter || 0;
							}
							this.accountBalance = parseFloat(balance) || 0;
							
							console.log('[StatsIAsView] ✅ Saldo atualizado da API:', this.accountBalance);
						} else {
							// Se API falhar, usar dados do localStorage (fallback)
							console.warn('[StatsIAsView] ⚠️ Erro ao atualizar saldo da API, usando cache local');
							this.loadAccountInfoFromLocal();
						}
					} catch (apiError) {
						console.warn('[StatsIAsView] ⚠️ Erro ao atualizar saldo da API:', apiError);
						// Se API falhar, usar dados do localStorage (fallback)
						this.loadAccountInfoFromLocal();
					}
				} else {
					// Sem token, usar dados do localStorage
					this.loadAccountInfoFromLocal();
				}
				
				// Buscar estatísticas de hoje
				const userId = this.getUserId();
				if (userId) {
					const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
					const response = await fetch(`${apiBase}/ai/session-stats/${userId}`, {
						headers: {
							'Authorization': `Bearer ${localStorage.getItem('token')}`
						}
					});
					const result = await response.json();
					
					if (result.success && result.data) {
						this.applySessionStats(result.data);
					}
				}
				
				// Carregar estatísticas agregadas do StatsIAs
				await this.loadStatsIAs();
				
				// Carregar parâmetros de trading ajustados
				await this.loadTradingParams();

				// Carregar últimos logs (para tela padrão)
				await this.loadRecentLogs();
				
				// Atualizar última leitura
				this.lastReadingTime = new Date().toLocaleTimeString('pt-BR', { 
					hour: '2-digit', 
					minute: '2-digit', 
					second: '2-digit' 
				});
			} catch (error) {
				console.error('[StatsIAsView] Erro ao carregar informações da conta:', error);
			}
		},
		
		/**
		 * Carrega estatísticas agregadas do StatsIAs
		 */
		async loadStatsIAs() {
			try {
				const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
				const response = await fetch(`${apiBase}/ai/stats-ias`, {
					headers: {
						'Authorization': `Bearer ${localStorage.getItem('token')}`
					}
				});
				const result = await response.json();
				
				if (result.success && result.data && result.data.data) {
					const stats = result.data.data;
					this.statsIAs = {
						totalUsers: stats.totalUsers || 0,
						activeUsers: stats.activeUsers || 0,
						totalTrades: stats.totalTrades || 0,
						totalWins: stats.totalWins || 0,
						totalLosses: stats.totalLosses || 0,
						winRate: stats.winRate || 0,
						totalProfit: stats.totalProfit || 0,
						averageProfit: stats.averageProfit || 0,
						source: result.data.source || 'local',
					};
					console.log('[StatsIAsView] Estatísticas agregadas carregadas:', this.statsIAs);
				}
			} catch (error) {
				console.error('[StatsIAsView] Erro ao carregar estatísticas do StatsIAs:', error);
			}
		},
		
		/**
		 * Carrega parâmetros de trading ajustados baseados nas estatísticas
		 */
		async loadTradingParams() {
			try {
				const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
				const response = await fetch(`${apiBase}/ai/trading-params`, {
					headers: {
						'Authorization': `Bearer ${localStorage.getItem('token')}`
					}
				});
				const result = await response.json();
				
				if (result.success && result.data) {
					this.tradingParams = {
						dvxMax: result.data.dvxMax || 70,
						window: result.data.window || 3,
						betPercent: result.data.betPercent || 0.005,
					};
					console.log('[StatsIAsView] Parâmetros de trading ajustados:', this.tradingParams);
				}
			} catch (error) {
				console.error('[StatsIAsView] Erro ao carregar parâmetros de trading:', error);
			}
		},
		
		/**
		 * Atualiza o valor de entrada (stake amount) da IA
		 */
		async updateStakeAmount() {
			if (this.tradingConfig.stakeAmount < 0.35) {
				this.configUpdateMessage = 'Valor mínimo é $0.35';
				this.configUpdateSuccess = false;
				setTimeout(() => {
					this.configUpdateMessage = '';
				}, 3000);
				return;
			}

			this.isUpdatingConfig = true;
			this.configUpdateMessage = '';

			try {
				const userId = this.getUserId();
				if (!userId) {
					throw new Error('Usuário não identificado');
				}

				const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
				const response = await fetch(`${apiBase}/ai/update-config`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${localStorage.getItem('token')}`
					},
					body: JSON.stringify({
						userId: userId,
						stakeAmount: this.tradingConfig.stakeAmount,
					}),
				});

				const result = await response.json();

				if (result.success) {
					this.configUpdateMessage = '✅ Valor de entrada atualizado com sucesso!';
					this.configUpdateSuccess = true;
					console.log('[StatsIAsView] Valor de entrada atualizado:', this.tradingConfig.stakeAmount);
					
					// Limpar mensagem após 3 segundos
					setTimeout(() => {
						this.configUpdateMessage = '';
					}, 3000);
				} else {
					throw new Error(result.message || 'Erro ao atualizar configuração');
				}
			} catch (error) {
				console.error('[StatsIAsView] Erro ao atualizar valor de entrada:', error);
				this.configUpdateMessage = `❌ Erro: ${error.message || 'Não foi possível atualizar'}`;
				this.configUpdateSuccess = false;
				
				// Limpar mensagem após 5 segundos
				setTimeout(() => {
					this.configUpdateMessage = '';
				}, 5000);
			} finally {
				this.isUpdatingConfig = false;
			}
		},
		
		/**
		 * Obter token da Deriv baseado na conta ativa
		 * EXATAMENTE como o OperationChart.vue faz
		 */
		getDerivToken() {
			console.log('[StatsIAsView] getTokenForAccount - Buscando token para conta');
			
			// 1. Obter informações da conta ativa do deriv_connection
			let accountLoginid = null;
			let preferredCurrency = null;
			
			try {
				const connectionStr = localStorage.getItem('deriv_connection');
				if (connectionStr) {
					const connection = JSON.parse(connectionStr);
					accountLoginid = connection.loginid;
					preferredCurrency = connection.tradeCurrency;
					
					console.log('[StatsIAsView] Informações da conta ativa:', {
						loginid: accountLoginid,
						currency: preferredCurrency
					});
				}
			} catch (error) {
				console.error('[StatsIAsView] Erro ao parsear deriv_connection:', error);
			}
			
			// 2. Se a moeda preferida for DEMO, buscar token de conta demo
			const isDemoPreferred = preferredCurrency?.toUpperCase() === 'DEMO';
			if (isDemoPreferred) {
				console.log('[StatsIAsView] Moeda preferida é DEMO, buscando token de conta demo...');
				try {
					const tokensByLoginIdStr = localStorage.getItem('deriv_tokens_by_loginid') || '{}';
					const tokensByLoginId = JSON.parse(tokensByLoginIdStr);
					
					// Buscar qualquer conta demo disponível (VRTC ou VRT)
					for (const [loginid, token] of Object.entries(tokensByLoginId)) {
						if (loginid.startsWith('VRTC') || loginid.startsWith('VRT')) {
							console.log('[StatsIAsView] ✓ Token demo encontrado:', loginid);
							return token;
						}
					}
					console.warn('[StatsIAsView] ⚠ Nenhuma conta demo encontrada, mas moeda preferida é DEMO');
				} catch (error) {
					console.error('[StatsIAsView] Erro ao buscar token demo:', error);
				}
			}
			
			// 3. Se temos um loginid específico, buscar o token correspondente
			if (accountLoginid) {
				try {
					const tokensByLoginIdStr = localStorage.getItem('deriv_tokens_by_loginid') || '{}';
					const tokensByLoginId = JSON.parse(tokensByLoginIdStr);
					
					console.log('[StatsIAsView] Buscando token para loginid:', accountLoginid);
					console.log('[StatsIAsView] Loginids disponíveis:', Object.keys(tokensByLoginId));
					
					// Verificar se é conta demo
					const isDemoLoginId = accountLoginid.startsWith('VRTC') || accountLoginid.startsWith('VRT');
					if (isDemoLoginId) {
						console.log('[StatsIAsView] ✓ LoginID identificado como conta DEMO');
					}
					
					const specificToken = tokensByLoginId[accountLoginid];
					if (specificToken) {
						console.log('[StatsIAsView] ✓ Token específico encontrado para loginid:', accountLoginid);
						console.log('[StatsIAsView] - Tipo:', isDemoLoginId ? 'DEMO' : 'REAL');
						return specificToken;
					} else {
						console.warn('[StatsIAsView] ⚠ Token específico NÃO encontrado para loginid:', accountLoginid);
						
						// Se for conta demo e não encontrou token, buscar qualquer token demo
						if (isDemoLoginId) {
							console.log('[StatsIAsView] Tentando encontrar token demo alternativo...');
							for (const [loginid, token] of Object.entries(tokensByLoginId)) {
								if (loginid.startsWith('VRTC') || loginid.startsWith('VRT')) {
									console.log('[StatsIAsView] ✓ Token demo alternativo encontrado:', loginid);
									return token;
								}
							}
						}
					}
				} catch (error) {
					console.error('[StatsIAsView] Erro ao buscar token específico:', error);
				}
			}
			
			// 4. Fallback: token padrão
			const defaultToken = localStorage.getItem('deriv_token');
			console.log('[StatsIAsView] Usando token padrão:', {
				hasToken: !!defaultToken,
				tokenPreview: defaultToken ? `${defaultToken.substring(0, 10)}...` : 'null'
			});
			
			if (!defaultToken) {
				console.error('[StatsIAsView] ERRO: Nenhum token encontrado!');
			}
			
			return defaultToken;
		},
		
		/**
		 * Obter userId do token JWT ou localStorage
		 */
		getUserId() {
			try {
				// Tentar obter do token JWT
				const token = localStorage.getItem('token');
				if (token) {
					// Decodificar JWT (base64)
					const payload = JSON.parse(atob(token.split('.')[1]));
					if (payload.userId || payload.sub || payload.id) {
						return payload.userId || payload.sub || payload.id;
					}
				}
				
				// Fallback: tentar obter de user_info
				const userInfoStr = localStorage.getItem('user_info');
				if (userInfoStr) {
					const userInfo = JSON.parse(userInfoStr);
					if (userInfo.id || userInfo.userId) {
						return userInfo.id || userInfo.userId;
					}
				}
				
				console.warn('[StatsIAsView] Não foi possível obter userId');
				return null;
			} catch (error) {
				console.error('[StatsIAsView] Erro ao obter userId:', error);
				return null;
			}
		},
		
		/**
		 * Obter moeda preferida do usuário
		 * Igual ao OperationChart.vue - pega a moeda da conta ativa
		 */
		getPreferredCurrency() {
			console.log('[StatsIAsView] Buscando moeda preferida...');
			
			// 1. Tentar buscar do objeto de conexão (moeda da conta ativa)
			try {
				const connectionStr = localStorage.getItem('deriv_connection');
				if (connectionStr) {
					const connection = JSON.parse(connectionStr);
					if (connection.tradeCurrency) {
						const currency = connection.tradeCurrency.toUpperCase();
						console.log('[StatsIAsView] Moeda encontrada em deriv_connection:', currency);
						
						// Se for DEMO, retornar USD (DEMO não é moeda real)
						if (currency === 'DEMO') {
							console.log('[StatsIAsView] Moeda é DEMO, usando USD');
							return 'USD';
						}
						
						return currency;
					}
				}
			} catch (error) {
				console.error('[StatsIAsView] Erro ao parsear deriv_connection:', error);
			}
			
			// 2. Fallback: tentar buscar currency do userSettings
			try {
				const userSettingsStr = localStorage.getItem('user_settings');
				if (userSettingsStr) {
					const userSettings = JSON.parse(userSettingsStr);
					if (userSettings.currency) {
						console.log('[StatsIAsView] Moeda encontrada em user_settings:', userSettings.currency);
						return userSettings.currency.toUpperCase();
					}
				}
			} catch (error) {
				console.error('[StatsIAsView] Erro ao parsear user_settings:', error);
			}
			
			// 3. Fallback final: USD
			console.log('[StatsIAsView] Usando USD como fallback');
			return 'USD';
		},
		
		fetchData() {
			console.log(`Buscando dados de ${this.filterStartDate} a ${this.filterEndDate}`);
			this.displayedStats = this.allStats; 
		},

		exportReportToPDF() {
			this.$root.$toast.success(`Download do PDF de Estatísticas iniciado! (Arquivo: Relatorio_IAs_${this.filterStartDate}_a_${this.filterEndDate}.pdf)`);
		},

		// Métodos de monitoramento de IA
		async toggleAIMonitoring() {
			if (this.aiMonitoring.isActive) {
				this.stopAIMonitoring();
			} else {
				await this.startAIMonitoring();
				// Após iniciar monitoramento, mostrar seção de trading automático
				// A seção padrão será ocultada automaticamente pelo v-if="!tradingConfig.isActive"
			}
		},
		
		// Ativar IA a partir da tela padrão
		async activateIAFromDefault() {
			// Primeiro iniciar o monitoramento
			await this.startAIMonitoring();
			// A seção de monitoramento aparecerá automaticamente
		},
	
	async deactivateIAFromActive() {
		this.isDeactivating = true;
		try {
			// Desativar IA e trading
			if (this.tradingConfig.isActive) {
				await this.stopAutomatedTrading();
			}
			
			// Parar monitoramento usando o método existente
			this.stopAIMonitoring();
			
			console.log('[StatsIAsView] ✅ IA desativada da seção ativa');
			this.$root.$toast.success('IA desativada com sucesso.');
		} catch (error) {
			console.error('[StatsIAsView] Erro ao desativar IA:', error);
			this.$root.$toast.error('Erro ao desativar IA');
		} finally {
			this.isDeactivating = false;
		}
	},

		async startAIMonitoring() {
			try {
				console.log('[StatsIAsView] Iniciando monitoramento de IA...');
				
				// Iniciar monitoramento no backend
				const response = await fetch('https://taxafacil.site/api/ai/start', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
				});

				const result = await response.json();

				if (result.success) {
					this.aiMonitoring.isActive = true;
					console.log('[StatsIAsView] Monitoramento iniciado com sucesso');
					
					// ✅ POOLING DESATIVADO: Buscar dados apenas uma vez (sem polling)
					this.startPolling();
					
					// Inicializar gráfico de mercado ativo
					this.$nextTick(() => {
						setTimeout(() => {
							if (this.$refs.marketChartContainerActive) {
								this.initMarketChartActive();
							}
						}, 500);
					});
					
					// A seção de trading automático aparecerá automaticamente
					// pois aiMonitoring.isActive agora é true
				} else {
					console.error('[StatsIAsView] Erro ao iniciar monitoramento:', result.message);
					this.$root.$toast.error('Erro ao iniciar monitoramento: ' + result.message);
				}
			} catch (error) {
				console.error('[StatsIAsView] Erro ao iniciar monitoramento:', error);
				this.$root.$toast.error('Erro ao conectar com o servidor');
			}
		},
		
	/**
	 * Verifica se há sessão ativa de IA antes de iniciar carregamento de ticks
	 */
	async checkActiveAISession() {
		try {
			const userId = this.getUserId();
			if (!userId) {
				console.log('[StatsIAsView] Usuário não encontrado, não iniciando carregamento de ticks');
				return false;
			}
			
			const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
			const response = await fetch(`${apiBase}/ai/config/${userId}`, {
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token')}`
				}
			});
			
			const result = await response.json();
			
			if (result.success && result.data) {
				const isActive = result.data.isActive || false;
				console.log('[StatsIAsView] Sessão de IA:', isActive ? 'ATIVA' : 'INATIVA');
				return isActive;
			}
			
			return false;
		} catch (error) {
			console.error('[StatsIAsView] Erro ao verificar sessão ativa:', error);
			return false;
		}
	},

	/**
	 * Inicia o carregamento de dados mesmo quando a IA está desativada
	 * para mostrar o gráfico na tela padrão
	 * AGORA: Só inicia se houver sessão ativa de IA
	 */
	async startDataLoading() {
		try {
			console.log('[StatsIAsView] ===== VERIFICANDO SESSÃO ATIVA ANTES DE CARREGAR TICKS =====');
			
			// ✅ Verificar se há sessão ativa antes de iniciar carregamento
			const hasActiveSession = await this.checkActiveAISession();
			
			if (!hasActiveSession) {
				console.log('[StatsIAsView] ⏸️ Nenhuma sessão ativa de IA encontrada. Ticks não serão carregados.');
				return;
			}
			
			console.log('[StatsIAsView] ✅ Sessão ativa encontrada. Iniciando carregamento de ticks...');
			console.log('[StatsIAsView] URL:', 'https://taxafacil.site/api/ai/start');
			
			// Iniciar monitoramento no backend (sem ativar a IA)
			const response = await fetch('https://taxafacil.site/api/ai/start', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			console.log('[StatsIAsView] Status da resposta:', response.status);
			console.log('[StatsIAsView] Response OK?', response.ok);

			const result = await response.json();
			console.log('[StatsIAsView] Resultado:', result);

			if (result.success) {
				console.log('[StatsIAsView] ✅ Carregamento de dados iniciado (IA desativada)');
				
				// ✅ NÃO iniciar polling quando IA está desativada
				// O polling só deve ocorrer quando a IA estiver ativa
				// Buscar dados apenas uma vez para inicializar o gráfico
				this.fetchAIData();
			} else {
				console.warn('[StatsIAsView] ⚠ Não foi possível iniciar carregamento de dados:', result.message);
			}
		} catch (error) {
			console.error('[StatsIAsView] ❌ ERRO ao iniciar carregamento de dados:', error);
			console.error('[StatsIAsView] Detalhes do erro:', error.message);
			console.error('[StatsIAsView] Stack:', error.stack);
		}
	},

		stopAIMonitoring() {
			console.log('[StatsIAsView] Parando monitoramento de IA...');
			
			this.aiMonitoring.isActive = false;
			this.stopPolling();

			// Parar monitoramento no backend
			fetch('https://taxafacil.site/api/ai/stop', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			}).catch(error => {
				console.error('[StatsIAsView] Erro ao parar monitoramento:', error);
			});

			// Limpar dados
			this.aiMonitoring.currentPrice = null;
			this.aiMonitoring.ticks = [];
			this.aiMonitoring.statistics = null;
			this.aiMonitoring.lastUpdate = '--';
		},

		startPolling() {
			// ✅ POOLING DESATIVADO: Não fazer polling de ticks conforme solicitado
			// Os ticks são recebidos via WebSocket no backend, não precisam de polling no frontend
			console.log('[StatsIAsView] ⏸️ Polling de ticks desativado - ticks vêm via WebSocket do backend');
			
			// Buscar dados apenas uma vez para inicializar
			this.fetchAIData();
		},

		stopPolling() {
			if (this.aiPollingInterval) {
				clearInterval(this.aiPollingInterval);
				this.aiPollingInterval = null;
			}
		},

	async fetchAIData() {
		// ✅ Não buscar ticks se a IA não estiver ativa
		if (!this.tradingConfig.isActive && !this.aiMonitoring.isActive) {
			console.log('[StatsIAsView] ⏸️ IA não está ativa, pulando busca de ticks');
			return;
		}
		
		try {
			const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
			console.log('[StatsIAsView] Buscando ticks de', `${apiBase}/ai/ticks`);
			
			const response = await fetch(`${apiBase}/ai/ticks`);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			
			const result = await response.json();

			console.log('[StatsIAsView] Resposta de ticks:', {
				success: result.success,
				ticksCount: result.data?.ticks?.length || 0,
				currentPrice: result.data?.currentPrice,
				firstTick: result.data?.ticks?.[0]
			});

			if (result.success && result.data) {
				// Estrutura Tick da API: { value, epoch, timestamp, digit, parity }
				const ticks = result.data.ticks || [];
				
				console.log('[StatsIAsView] Ticks recebidos:', ticks.length);
				console.log('[StatsIAsView] Exemplo de tick:', ticks[0]);
				
				// Garantir que cada tick tenha epoch válido
				const processedTicks = ticks.map((tick, index) => {
					// Se não tiver epoch, calcular baseado no índice (assumindo 1 tick por segundo)
					if (!tick.epoch) {
						const baseEpoch = Date.now() / 1000;
						tick.epoch = baseEpoch - (ticks.length - index - 1);
					}
					return tick;
				});
				
				this.aiMonitoring.ticks = processedTicks;
				this.aiMonitoring.currentPrice = result.data.currentPrice;
				this.aiMonitoring.statistics = result.data.statistics;
				this.aiMonitoring.lastUpdate = new Date().toLocaleTimeString('pt-BR');
				
				// Atualizar gráficos após processar os ticks
				this.$nextTick(() => {
					setTimeout(() => {
					if (!this.aiMonitoring.isActive) {
						if (!this.marketChartInitializedInactive) {
							console.log('[StatsIAsView] Inicializando gráfico inativo...');
							this.initMarketChartInactive();
						} else {
							console.log('[StatsIAsView] Atualizando gráfico inativo...');
							this.updateMarketChartInactive();
						}
					} else {
						if (!this.marketChartInitializedActive) {
							console.log('[StatsIAsView] Inicializando gráfico ativo...');
							this.initMarketChartActive();
						} else {
							console.log('[StatsIAsView] Atualizando gráfico ativo...');
							this.updateMarketChartActive();
						}
					}
					}, 100);
				});
			}
		} catch (error) {
			console.error('[StatsIAsView] ❌ Erro ao buscar dados:', error);
			console.error('[StatsIAsView] Detalhes:', error.message);
		}
	},

		getVariationClass(current, previous) {
			if (current > previous) return 'positive';
			if (current < previous) return 'negative';
			return 'neutral';
		},

		getVariationText(current, previous) {
			const diff = current - previous;
			if (diff > 0) return `+${diff.toFixed(2)}`;
			return diff.toFixed(2);
		},

		// Métodos de Trading Automático
		async toggleAutomatedTrading() {
			if (this.tradingConfig.isActive) {
				this.stopAutomatedTrading();
			} else {
				await this.startAutomatedTrading();
			}
		},

	async startAutomatedTrading() {
		if (this.tradingConfig.stakeAmount < 1) {
			this.$root.$toast.error('Valor de entrada deve ser no mínimo $1');
			return;
		}

		console.log('[StatsIAsView] Ativando IA em background...');
		
		try {
			// Obter userId do localStorage (token JWT ou user info)
			const userId = this.getUserId();
			if (!userId) {
				this.$root.$toast.error('Erro: usuário não identificado. Por favor, faça login novamente.');
				return;
			}
			
			// Obter token e moeda
			const derivToken = this.getDerivToken();
			if (!derivToken) {
				this.$root.$toast.error('Por favor, conecte sua conta Deriv primeiro');
				// Redirecionar para a tela de conexão Deriv já existente
				if (this.$router) {
					this.$router.push('/dashboard');
				}
				return;
			}
			
			const preferredCurrency = this.getPreferredCurrency();
			
			// Ativar IA no backend (roda em background)
			const response = await fetch((process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api') + '/ai/activate', {
				method: 'POST',
				headers: { 
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${localStorage.getItem('token')}`
				},
				body: JSON.stringify({
					userId: userId,
					stakeAmount: this.tradingConfig.stakeAmount,
					derivToken: derivToken,
					currency: preferredCurrency,
					mode: 'veloz', // Sempre veloz
					profitTarget: this.tradingConfig.profitTarget || null,
					lossLimit: this.tradingConfig.lossLimit || null,
				}),
			});
			
			const result = await response.json();
			
			if (result.success) {
				this.tradingConfig.isActive = true;
				console.log('[StatsIAsView] ✅ IA ativada em background!');
				this.$root.$toast.success('IA ativada! Ela continuará operando mesmo se você fechar a plataforma.');
				
				// Carregar estatísticas e histórico do banco
				await this.loadSessionStats();
				await this.loadTradeHistory();
				
				// Iniciar polling para atualizar a tela
				this.startBackgroundPolling();
			} else {
				this.$root.$toast.error('Erro ao ativar IA: ' + result.message);
			}
		} catch (error) {
			console.error('[StatsIAsView] Erro ao ativar IA:', error);
			this.$root.$toast.error('Erro ao ativar IA. Verifique sua conexão.');
		}
	},

	async stopAutomatedTrading() {
		console.log('[StatsIAsView] Desativando IA em background...');
		
		try {
			const userId = this.getUserId();
			if (!userId) {
				this.$root.$toast.error('Erro: usuário não identificado.');
				return;
			}
			
			const response = await fetch((process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api') + '/ai/deactivate', {
				method: 'POST',
				headers: { 
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${localStorage.getItem('token')}`
				},
				body: JSON.stringify({
					userId: userId,
				}),
			});
			
			const result = await response.json();
			
			if (result.success) {
				this.tradingConfig.isActive = false;
				console.log('[StatsIAsView] ✅ IA desativada!');
				this.$root.$toast.success('IA desativada com sucesso.');
				
				// Parar polling
				this.stopBackgroundPolling();
			} else {
				this.$root.$toast.error('Erro ao desativar IA: ' + result.message);
			}
		} catch (error) {
			console.error('[StatsIAsView] Erro ao desativar IA:', error);
			this.$root.$toast.error('Erro ao desativar IA.');
		}
	},

		async executeNextTrade() {
			if (!this.tradingConfig.isActive) return;

			try {
				console.log('[StatsIAsView] Analisando mercado com Gemini...');

				const analyzeResponse = await fetch('https://taxafacil.site/api/ai/analyze', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ userId: 1 }),
				});

				const analyzeResult = await analyzeResponse.json();

				if (!analyzeResult.success) {
					console.error('[StatsIAsView] Erro na análise:', analyzeResult.message);
					return;
				}

				const signal = analyzeResult.data;
				console.log('[StatsIAsView] Sinal recebido:', signal);

			// Obter token real da Deriv (mesmo método do OperationChart.vue)
			const derivToken = this.getDerivToken();
			
			if (!derivToken) {
				console.error('[StatsIAsView] Token da Deriv não encontrado');
				this.$root.$toast.error('Por favor, conecte sua conta Deriv primeiro');
				return;
			}
			
			// Obter moeda preferida (USD, BTC, DEMO, etc)
			const preferredCurrency = this.getPreferredCurrency();
			console.log('[StatsIAsView] ====== INFORMAÇÕES DA CONTA ======');
			console.log('[StatsIAsView] Moeda:', preferredCurrency);
			console.log('[StatsIAsView] Token (preview):', derivToken.substring(0, 15) + '...');
			console.log('[StatsIAsView] Stake Amount:', this.tradingConfig.stakeAmount);
			console.log('[StatsIAsView] =====================================');
			
			const tradeResponse = await fetch('https://taxafacil.site/api/ai/execute-trade', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					userId: 1,
					signal,
					stakeAmount: this.tradingConfig.stakeAmount,
					derivToken: derivToken,
					currency: preferredCurrency,
				}),
			});

			const tradeResult = await tradeResponse.json();

			if (!tradeResult.success) {
				console.error('[StatsIAsView] Erro ao executar trade:', tradeResult.message);
				
				// Verificar se é erro de saldo insuficiente
				if (tradeResult.error && tradeResult.error.includes('InsufficientBalance')) {
					this.$root.$toast.error(
						'Saldo insuficiente!<br><br>' +
						'Seu saldo não é suficiente para esta operação.\n\n' +
						'💡 Dica: Se você tem uma conta DEMO USD, troque de conta no Dashboard:\n' +
						'1. Vá para o Dashboard\n' +
						'2. Clique no seletor de contas (canto superior direito)\n' +
						'3. Selecione sua conta DEMO USD\n' +
						'4. Volte para IAs de Investimento e tente novamente'
					, 8000);
				} else {
					this.$root.$toast.error(`Erro ao executar operação: ${tradeResult.error || tradeResult.message}`);
				}
				
				return;
			}

				console.log('[StatsIAsView] Trade iniciado:', tradeResult.data.tradeId);

				this.activeTrade = {
					id: tradeResult.data.tradeId,
					signal: signal.signal,
					entryPrice: this.aiMonitoring.currentPrice,
					currentPrice: this.aiMonitoring.currentPrice,
					timeRemaining: signal.duration,
					reasoning: signal.reasoning,
					stakeAmount: this.tradingConfig.stakeAmount,
				};

				this.monitorActiveTrade();

			} catch (error) {
				console.error('[StatsIAsView] Erro ao executar trade:', error);
			}
		},

		monitorActiveTrade() {
			const monitorInterval = setInterval(async () => {
				if (!this.activeTrade) {
					clearInterval(monitorInterval);
					return;
				}

				try {
					const response = await fetch('https://taxafacil.site/api/ai/active-trade');
					const result = await response.json();

					if (!result.success || !result.data) {
						clearInterval(monitorInterval);
						return;
					}

					const trade = result.data;

					this.activeTrade.currentPrice = trade.currentPrice || this.aiMonitoring.currentPrice;
					this.activeTrade.timeRemaining = trade.timeRemaining;
					this.activeTrade.profitLoss = trade.profitLoss;

				// Verificar se o tempo acabou OU se o status é final
				if (trade.timeRemaining <= 0 || trade.status === 'WON' || trade.status === 'LOST') {
					console.log('[StatsIAsView] Trade finalizado:', trade.status || 'Tempo esgotado');
					
					// Limpar operação ativa imediatamente
					this.activeTrade = null;
					clearInterval(monitorInterval);

					// Recarregar estatísticas e histórico do banco
					await this.loadSessionStats();
					await this.loadTradeHistory();
					
					// Iniciar countdown de 5 minutos (300 segundos) para a próxima operação
					if (this.tradingConfig.isActive) {
						console.log('[StatsIAsView] Aguardando 5 minutos para próxima operação...');
						this.nextTradeCountdown = 300;
						this.startCountdown();
						
						// Executar próxima operação após 5 minutos
						setTimeout(() => {
							if (this.tradingConfig.isActive) {
								this.executeNextTrade();
							}
						}, 300000); // 300000ms = 5 minutos
					}
				}

				} catch (error) {
					console.error('[StatsIAsView] Erro ao monitorar trade:', error);
				}
			}, 1000);
		},

		startCountdown() {
			this.countdownInterval = setInterval(() => {
				if (this.nextTradeCountdown > 0) {
					this.nextTradeCountdown--;
				}
			}, 1000);
		},

		formatTimeRemaining(seconds) {
			if (!seconds || seconds < 0) return '00:00';
			const minutes = Math.floor(seconds / 60);
			const secs = seconds % 60;
			return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
		},

		getPriceChangeClass(entryPrice, currentPrice) {
			if (!entryPrice || !currentPrice) return '';
			if (currentPrice > entryPrice) return 'positive';
			if (currentPrice < entryPrice) return 'negative';
			return '';
		},

		getEstimatedProfitClass() {
			if (!this.activeTrade) return '';
			
			// Usar o profitLoss da API para determinar a classe
			const profit = this.activeTrade.profitLoss || 0;
			return profit >= 0 ? 'positive' : 'negative';
		},

		getEstimatedProfit() {
			if (!this.activeTrade) return '$0.00';
			
			// Usar o profitLoss retornado pela API (cálculo em tempo real do backend)
			const profit = this.activeTrade.profitLoss || 0;
			
			const sign = profit >= 0 ? '+' : '';
			return `${sign}$${profit.toFixed(2)}`;
		},

		getPriceDifference() {
			if (!this.activeTrade || !this.activeTrade.entryPrice || !this.activeTrade.currentPrice) {
				return '--';
			}
			
			const diff = this.activeTrade.currentPrice - this.activeTrade.entryPrice;
			const sign = diff >= 0 ? '+' : '';
			return `${sign}$${diff.toFixed(2)}`;
		},

		getPriceChangePercent() {
			if (!this.activeTrade || !this.activeTrade.entryPrice || !this.activeTrade.currentPrice) {
				return '0.00%';
			}
			
			const percentChange = ((this.activeTrade.currentPrice - this.activeTrade.entryPrice) / this.activeTrade.entryPrice) * 100;
			const sign = percentChange >= 0 ? '+' : '';
			return `${sign}${percentChange.toFixed(2)}%`;
		},

		isCurrentlyWinning() {
			if (!this.activeTrade || !this.activeTrade.entryPrice || !this.activeTrade.currentPrice) {
				return false;
			}
			
			const { signal, entryPrice, currentPrice } = this.activeTrade;
			return (signal === 'CALL' && currentPrice > entryPrice) ||
				(signal === 'PUT' && currentPrice < entryPrice);
		},

		getProgressBarWidth() {
			if (!this.activeTrade || !this.activeTrade.entryPrice || !this.activeTrade.currentPrice) {
				return '50%';
			}
			
			const { entryPrice, currentPrice } = this.activeTrade;
			const diff = Math.abs(currentPrice - entryPrice);
			const percentDiff = (diff / entryPrice) * 100;
			
			// Normalizar para barra de 0-100%
			// Se a diferença for muito pequena, mostrar pelo menos 20%
			// Se for grande (>1%), mostrar 100%
			const normalizedWidth = Math.min(Math.max(percentDiff * 50, 20), 100);
			
			return `${normalizedWidth}%`;
		},

		async loadSessionStats() {
			try {
				const userId = this.getUserId();
				if (!userId) return;
				
				const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
				const response = await fetch(`${apiBase}/ai/session-stats/${userId}`, {
					headers: {
						'Authorization': `Bearer ${localStorage.getItem('token')}`
					}
				});
				const result = await response.json();

				if (result.success && result.data) {
					this.applySessionStats(result.data);
					console.log('[StatsIAsView] Estatísticas carregadas:', result.data);
				}
			} catch (error) {
				console.error('[StatsIAsView] Erro ao carregar estatísticas:', error);
			}
		},

		async loadTradeHistory() {
			try {
				const userId = this.getUserId();
				if (!userId) return;
				
				const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
				const response = await fetch(`${apiBase}/ai/trade-history/${userId}`, {
					headers: {
						'Authorization': `Bearer ${localStorage.getItem('token')}`
					}
				});
				const result = await response.json();

				if (result.success && result.data) {
					// ✅ Filtrar operações com status ERROR (não devem aparecer no histórico)
					this.tradeHistory = result.data.filter(trade => 
						trade.status !== 'ERROR' && 
						trade.status !== 'error' &&
						!trade.error_message
					);
					console.log('[StatsIAsView] Histórico carregado:', this.tradeHistory.length, 'operações (filtradas)');
				}
			} catch (error) {
				console.error('[StatsIAsView] Erro ao carregar histórico:', error);
			}
		},

		async loadRecentLogs(limit = 50) {
			try {
				const userId = this.getUserId();
				if (!userId) return;

				const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
				const response = await fetch(`${apiBase}/ai/logs/${userId}`, {
					headers: {
						'Authorization': `Bearer ${localStorage.getItem('token')}`
					}
				});

				if (!response.ok) {
					console.warn('[StatsIAsView] ⚠️ Erro ao buscar logs:', response.status, response.statusText);
					return;
				}

				const result = await response.json();
				if (result.success && Array.isArray(result.data)) {
					this.recentLogs = result.data
						.slice(0, limit)
						.map(log => {
							const timestamp = log.timestamp || log.created_at;
							const time = timestamp
								? new Date(timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
								: '--:--:--';
							return {
								time,
								message: log.message || '',
								type: log.type || 'info',
							};
						});
					
					// ✅ Verificar se há mensagem de meta de lucro atingida nos logs recentes
					// Isso garante que o modal seja mostrado mesmo se o sessionStatus ainda não foi atualizado
					const hasTargetProfitMessage = this.recentLogs.some(log => 
						log.message && log.message.includes('META DE LUCRO ATINGIDA')
					);
					
					if (hasTargetProfitMessage && !this.showTargetProfitModal) {
						console.log('[StatsIAsView] 🎯 [Logs] Meta de lucro detectada nos logs! Mostrando modal...');
						await this.loadSessionResult();
						this.showTargetProfitModal = true;
					}
					
					// ✅ Verificar se há mensagem de stop loss nos logs recentes
					const hasStopLossMessage = this.recentLogs.some(log => 
						log.message && log.message.includes('STOP LOSS ATINGIDO')
					);
					
					if (hasStopLossMessage && !this.showStopLossModal) {
						console.log('[StatsIAsView] 🛑 [Logs] Stop loss detectado nos logs! Mostrando modal...');
						await this.loadSessionResult();
						this.showStopLossModal = true;
					}
				}
			} catch (error) {
				console.error('[StatsIAsView] Erro ao carregar logs:', error);
			}
		},

	formatTradeTime(timestamp) {
		if (!timestamp) return '--';
		const date = new Date(timestamp);
		return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
	},

	// Polling para atualizar status da IA em background
	startBackgroundPolling() {
		// ✅ Buscar status imediatamente (mesmo se inativa, para detectar mudanças de status)
		this.fetchBackgroundStatus();
		
		// Continuar buscando a cada 5 segundos
		// ✅ IMPORTANTE: Continuar polling mesmo quando inativa para detectar mudanças de session_status
		// (ex: quando stop loss é atingido e muda para stopped_loss)
		if (this.tradingInterval) {
			clearInterval(this.tradingInterval);
		}
		
		this.tradingInterval = setInterval(() => {
			// ✅ Sempre buscar status para detectar mudanças (incluindo stopped_loss/stopped_profit)
			this.fetchBackgroundStatus();
		}, 5000);
	},

	stopBackgroundPolling() {
		if (this.tradingInterval) {
			clearInterval(this.tradingInterval);
			this.tradingInterval = null;
		}
	},

	startTradeEventsStream() {
		const userId = this.getUserId();
		if (!userId) return;

		// Evitar múltiplas conexões
		if (this.tradeEventsSource) {
			this.tradeEventsSource.close();
		}

		const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
		const url = `${apiBase}/ai/trade-events/${userId}`;

		const source = new EventSource(url);
		this.tradeEventsSource = source;

		source.onmessage = async (event) => {
			try {
				const payload = JSON.parse(event.data);
				console.log('[StatsIAsView] Evento de trade recebido:', payload);

				// Recarregar histórico e estatísticas apenas quando houver mudança real
				await Promise.all([
					this.loadTradeHistory(),
					this.loadSessionStats(),
					this.loadRecentLogs(),
				]);
			} catch (e) {
				console.warn('[StatsIAsView] Evento de trade inválido:', e);
			}
		};

		source.onerror = () => {
			console.warn('[StatsIAsView] Erro na conexão SSE, tentando reconectar em 5s...');
			source.close();
			this.tradeEventsSource = null;
			setTimeout(() => this.startTradeEventsStream(), 5000);
		};
	},

	stopTradeEventsStream() {
		if (this.tradeEventsSource) {
			this.tradeEventsSource.close();
			this.tradeEventsSource = null;
		}
	},

	async fetchBackgroundStatus() {
		try {
			const userId = this.getUserId();
			if (!userId) return;
			
			const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
			// Buscar configuração da IA
			const configResponse = await fetch(`${apiBase}/ai/config/${userId}`, {
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token')}`
				}
			});
			const configResult = await configResponse.json();
			
			if (configResult.success && configResult.data) {
				const config = configResult.data;
				this.tradingConfig.isActive = config.isActive;
				
				// ✅ Verificar mudança de session_status para mostrar modais
				const currentSessionStatus = config.sessionStatus || config.session_status || null;
				
				// ✅ Log para debug
				if (this.previousSessionStatus !== currentSessionStatus) {
					console.log(`[StatsIAsView] 🔄 [Background] Mudança de session_status: ${this.previousSessionStatus} → ${currentSessionStatus}`);
				}
				
				// ✅ PRIORIDADE 1: Se o status atual é stopped_loss ou stopped_profit, mostrar modal
				// (independentemente do estado anterior, desde que o modal não esteja já aberto)
				if (currentSessionStatus === 'stopped_loss') {
					if (!this.showStopLossModal) {
						console.log('[StatsIAsView] 🛑 [Background] Stop loss detectado! Mostrando modal...');
						console.log('[StatsIAsView] 📊 [Background] Estado anterior:', this.previousSessionStatus, '| Estado atual:', currentSessionStatus);
						// Buscar resultado da sessão
						await this.loadSessionResult();
						this.showStopLossModal = true;
						console.log('[StatsIAsView] ✅ [Background] Modal de stop loss exibido');
					}
					this.previousSessionStatus = currentSessionStatus;
				} else if (currentSessionStatus === 'stopped_profit') {
					// ✅ IMPORTANTE: Mostrar modal mesmo se previousSessionStatus já for stopped_profit
					// Isso garante que o modal seja exibido se a página foi carregada após a meta ser atingida
					if (!this.showTargetProfitModal) {
						console.log('[StatsIAsView] 🎯 [Background] Target profit detectado! Mostrando modal...');
						console.log('[StatsIAsView] 📊 [Background] Estado anterior:', this.previousSessionStatus, '| Estado atual:', currentSessionStatus);
						// Buscar resultado da sessão
						await this.loadSessionResult();
						this.showTargetProfitModal = true;
						console.log('[StatsIAsView] ✅ [Background] Modal de target profit exibido');
					}
					this.previousSessionStatus = currentSessionStatus;
				} else if (this.previousSessionStatus !== currentSessionStatus) {
					// Se mudou para outro status, atualizar previousSessionStatus
					console.log('[StatsIAsView] 🔄 [Background] Status mudou para:', currentSessionStatus);
					this.previousSessionStatus = currentSessionStatus;
				}
				
				// ✅ Verificar também nos logs recentes para garantir detecção imediata
				// Isso é uma camada extra de segurança caso o sessionStatus ainda não tenha sido atualizado
				if (!this.showTargetProfitModal && !this.showStopLossModal) {
					await this.loadRecentLogs(10); // Carregar apenas os últimos 10 logs para verificação rápida
				}
				
				// ✅ PRIORIDADE 2: Se a IA foi desativada e não mostramos modal ainda, verificar novamente
				// Esta é uma verificação de segurança caso a PRIORIDADE 1 não tenha capturado
				if (!config.isActive && !this.showStopLossModal && !this.showTargetProfitModal) {
					// Pode ter sido desativada por stop loss ou target profit
					if (currentSessionStatus === 'stopped_loss') {
						console.log('[StatsIAsView] 🛑 [Background] IA desativada por stop loss (verificação de segurança)! Mostrando modal...');
						await this.loadSessionResult();
						this.showStopLossModal = true;
						this.previousSessionStatus = currentSessionStatus;
					} else if (currentSessionStatus === 'stopped_profit') {
						console.log('[StatsIAsView] 🎯 [Background] IA desativada por target profit (verificação de segurança)! Mostrando modal...');
						await this.loadSessionResult();
						this.showTargetProfitModal = true;
						this.previousSessionStatus = currentSessionStatus;
					}
				}
				
				// Calcular countdown baseado no nextTradeAt
				if (config.nextTradeAt) {
					const now = new Date().getTime();
					const nextTrade = new Date(config.nextTradeAt).getTime();
					const diff = Math.floor((nextTrade - now) / 1000);
					this.nextTradeCountdown = diff > 0 ? diff : 0;
				}
			}
			
			// Buscar operação ativa
			const tradeResponse = await fetch(`${apiBase}/ai/active-trade`, {
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token')}`
				}
			});
			const tradeResult = await tradeResponse.json();
			
			if (tradeResult.success && tradeResult.data) {
				const trade = tradeResult.data;
				
				// Atualizar ou criar activeTrade
				if (trade.status === 'ACTIVE' || trade.status === 'PENDING') {
					this.activeTrade = {
						id: trade.tradeId,
						signal: trade.signal,
						entryPrice: trade.entryPrice,
						currentPrice: trade.currentPrice,
						timeRemaining: trade.timeRemaining,
						reasoning: trade.reasoning,
						stakeAmount: trade.stakeAmount,
						profitLoss: trade.profitLoss,
					};
				} else {
					// Operação finalizada, limpar
					this.activeTrade = null;
				}
			} else {
				this.activeTrade = null;
			}
			
		} catch (error) {
			console.error('[StatsIAsView] Erro ao buscar status background:', error);
		}
	},

	// ✅ OTIMIZAÇÃO: Carrega configuração do CACHE LOCAL instantaneamente
	loadAIConfigFromCache() {
		try {
			const cachedConfig = localStorage.getItem('ai_config_cache');
			if (cachedConfig) {
				const config = JSON.parse(cachedConfig);
				const cacheAge = Date.now() - (config._cacheTimestamp || 0);
				
				// Usar cache se tiver menos de 5 minutos
				if (cacheAge < 5 * 60 * 1000) {
					console.log('[StatsIAsView] ⚡ Carregando config do CACHE LOCAL (instantâneo)');
					this.tradingConfig.isActive = config.isActive || false;
					this.aiMonitoring.isActive = !!config.isActive;
					this.tradingConfig.stakeAmount = config.stakeAmount || 50;
					this.tradingConfig.mode = config.mode || 'veloz';
					this.tradingConfig.profitTarget = config.profitTarget || 100;
					this.tradingConfig.lossLimit = config.lossLimit || 25;
					
					if (config.isActive) {
						console.log('[StatsIAsView] ⚡ IA estava ATIVA no cache - mostrando UI ativa');
						if (!this.aiPollingInterval) {
							this.startPolling();
						}
						this.startBackgroundPolling();
					}
				}
			}
		} catch (e) {
			console.warn('[StatsIAsView] Cache de config inválido:', e);
		}
	},
	
	// ✅ OTIMIZAÇÃO: Carrega dados da conta do localStorage instantaneamente
	loadAccountInfoFromLocal() {
		try {
			const connectionStr = localStorage.getItem('deriv_connection');
			if (connectionStr) {
				const connection = JSON.parse(connectionStr);
				
				// Determinar tipo de conta pelo loginid
				const loginid = connection.loginid || '';
				const isDemo = loginid.startsWith('VRTC') || loginid.startsWith('VRT') || connection.isDemo === true;
				this.accountType = isDemo ? 'Demo' : 'Real';
				
				// Buscar saldo correto baseado no tipo de conta
				let balance = 0;
				if (isDemo && connection.balancesByCurrencyDemo) {
					const demoBalances = connection.balancesByCurrencyDemo;
					balance = demoBalances['USD'] || Object.values(demoBalances)[0] || 0;
				} else if (!isDemo && connection.balancesByCurrencyReal) {
					const realBalances = connection.balancesByCurrencyReal;
					balance = realBalances['USD'] || Object.values(realBalances)[0] || 0;
				} else {
					balance = connection.balance || connection.balanceAfter || 0;
				}
				this.accountBalance = parseFloat(balance) || 0;
				
				console.log('[StatsIAsView] ⚡ Dados da conta carregados do localStorage (instantâneo)');
			}
		} catch (e) {
			console.warn('[StatsIAsView] Erro ao carregar dados locais:', e);
		}
	},
	
	// ✅ Salva configuração no cache local para próximo carregamento
	saveAIConfigToCache(config) {
		try {
			const cacheData = {
				...config,
				_cacheTimestamp: Date.now()
			};
			localStorage.setItem('ai_config_cache', JSON.stringify(cacheData));
		} catch (e) {
			console.warn('[StatsIAsView] Erro ao salvar cache:', e);
		}
	},

	async loadAIConfigOnMount() {
		try {
			console.log('[StatsIAsView] Buscando config atualizada da API...');
			
			const userId = this.getUserId();
			if (!userId) {
				console.warn('[StatsIAsView] userId não encontrado, pulando carregamento de config');
				return;
			}
			
			const apiBase = process.env.VUE_APP_API_BASE_URL || 'https://taxafacil.site/api';
			const response = await fetch(`${apiBase}/ai/config/${userId}`, {
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token')}`
				}
			});
			const result = await response.json();
			
			if (result.success && result.data) {
				const config = result.data;
				
				// ✅ Salvar no cache para próximo carregamento instantâneo
				this.saveAIConfigToCache(config);
				
				// ✅ Detectar mudança de session_status para mostrar modais
				const currentSessionStatus = config.sessionStatus || config.session_status || null;
				
				// ✅ Log para debug
				if (this.previousSessionStatus !== currentSessionStatus) {
					console.log(`[StatsIAsView] 🔄 [OnMount] Mudança de session_status: ${this.previousSessionStatus} → ${currentSessionStatus}`);
				}
				
				// ✅ PRIORIDADE 1: Se o status atual é stopped_loss ou stopped_profit, mostrar modal
				// (independentemente do estado anterior, desde que o modal não esteja já aberto)
				if (currentSessionStatus === 'stopped_loss') {
					if (!this.showStopLossModal) {
						console.log('[StatsIAsView] 🛑 [OnMount] Stop loss detectado! Mostrando modal...');
						console.log('[StatsIAsView] 📊 [OnMount] Estado anterior:', this.previousSessionStatus, '| Estado atual:', currentSessionStatus);
						// Buscar resultado da sessão
						await this.loadSessionResult();
						this.showStopLossModal = true;
						console.log('[StatsIAsView] ✅ [OnMount] Modal de stop loss exibido');
					}
					this.previousSessionStatus = currentSessionStatus;
				} else if (currentSessionStatus === 'stopped_profit') {
					// ✅ IMPORTANTE: Mostrar modal mesmo se previousSessionStatus já for stopped_profit
					// Isso garante que o modal seja exibido se a página foi carregada após a meta ser atingida
					if (!this.showTargetProfitModal) {
						console.log('[StatsIAsView] 🎯 [OnMount] Target profit detectado! Mostrando modal...');
						console.log('[StatsIAsView] 📊 [OnMount] Estado anterior:', this.previousSessionStatus, '| Estado atual:', currentSessionStatus);
						// Buscar resultado da sessão
						await this.loadSessionResult();
						this.showTargetProfitModal = true;
						console.log('[StatsIAsView] ✅ [OnMount] Modal de target profit exibido');
					}
					this.previousSessionStatus = currentSessionStatus;
				} else if (this.previousSessionStatus !== currentSessionStatus) {
					// Se mudou para outro status, atualizar previousSessionStatus
					console.log('[StatsIAsView] 🔄 [OnMount] Status mudou para:', currentSessionStatus);
					this.previousSessionStatus = currentSessionStatus;
				}
				
				// ✅ Verificar também nos logs recentes para garantir detecção imediata
				// Isso é uma camada extra de segurança caso o sessionStatus ainda não tenha sido atualizado
				if (!this.showTargetProfitModal && !this.showStopLossModal) {
					await this.loadRecentLogs(10); // Carregar apenas os últimos 10 logs para verificação rápida
				}
				
				this.tradingConfig.isActive = config.isActive || false;
				this.aiMonitoring.isActive = !!config.isActive;
				this.tradingConfig.stakeAmount = config.stakeAmount || 50;
				this.tradingConfig.mode = config.mode || 'veloz';
				this.tradingConfig.profitTarget = config.profitTarget || 100;
				this.tradingConfig.lossLimit = config.lossLimit || 25;
				
				// Se a IA está ativa, carregar tudo automaticamente
				if (config.isActive) {
					console.log('[StatsIAsView] ✅ IA ATIVA confirmada pela API');
					
					// Não bloquear a UI: já ativamos flags e começamos os polls sem esperar /ai/start
					if (!this.aiPollingInterval) {
						this.startPolling();
					}
					this.startBackgroundPolling();
				} else {
					// ✅ Mesmo quando inativa, iniciar polling para detectar mudanças de status
					// (ex: quando stop loss é atingido e muda para stopped_loss)
					if (!this.tradingInterval) {
						console.log('[StatsIAsView] 🔍 IA inativa, mas iniciando polling para detectar mudanças de status...');
						this.startBackgroundPolling();
					}
					console.log('[StatsIAsView] IA está inativa. Aguardando ativação do usuário.');
				}
				
				// Carregar estatísticas e histórico em paralelo
				Promise.all([
					this.loadSessionStats(),
					this.loadTradeHistory()
				]).catch(err => console.warn('[StatsIAsView] Erro ao carregar stats:', err));
				
				if (config.isActive) {
					console.log('[StatsIAsView] ✅ Sistema pronto! IA operando em background.');
				}
			}
		} catch (error) {
			console.error('[StatsIAsView] Erro ao carregar configuração:', error);
		}
	},
	
	/**
	 * Inicializa o gráfico de mercado para IA desativada
	 */
	initMarketChartInactive() {
		if (this.marketChartInitializedInactive || !this.$refs.marketChartContainerInactive) {
			return;
		}
		
		try {
			const container = this.$refs.marketChartContainerInactive;
			const containerWidth = container.offsetWidth || 800;
			const containerHeight = 400;
			
			this.marketChartInactive = createChart(container, {
				width: containerWidth,
				height: containerHeight,
				localization: { 
					locale: 'pt-BR',
					timeFormatter: (time) => {
						const date = new Date(time * 1000);
						const hours = String(date.getHours()).padStart(2, '0');
						const minutes = String(date.getMinutes()).padStart(2, '0');
						return `${hours}:${minutes}`;
					}
				},
				layout: {
					background: { type: ColorType.Solid, color: '#0B0B0B' },
					textColor: '#DFDFDF',
				},
				rightPriceScale: {
					borderColor: '#1C1C1C',
					scaleMargins: {
						top: 0.1,
						bottom: 0.1,
					},
				},
				leftPriceScale: {
					visible: false,
				},
				timeScale: {
					borderColor: '#1C1C1C',
					timeVisible: true,
					secondsVisible: false,
					rightOffset: 10,
					fixLeftEdge: false,
					fixRightEdge: false,
				},
				grid: {
					vertLines: { 
						color: 'rgba(148, 163, 184, 0.1)',
						style: 0,
						visible: true,
					},
					horzLines: { 
						color: 'rgba(148, 163, 184, 0.1)',
						style: 0,
						visible: true,
					},
				},
				crosshair: {
					mode: 1,
					vertLine: {
						color: '#22C55E',
						width: 1,
						style: 3,
						labelBackgroundColor: '#22C55E',
					},
					horzLine: {
						color: '#22C55E',
						width: 1,
						style: 3,
						labelBackgroundColor: '#22C55E',
					},
				},
				handleScroll: {
					mouseWheel: true,
					pressedMouseMove: true,
					horzTouchDrag: true,
					vertTouchDrag: true,
				},
				handleScale: {
					axisPressedMouseMove: {
						time: true,
						price: true,
					},
					axisDoubleClickReset: true,
					axisTouchDrag: true,
					mouseWheel: true,
					pinch: true,
				},
			});
			
			this.marketLineSeriesInactive = this.marketChartInactive.addCandlestickSeries({
				upColor: '#22C55E',
				downColor: '#FF4747',
				borderVisible: true,
				borderUpColor: '#22C55E',
				borderDownColor: '#FF4747',
				wickUpColor: '#22C55E',
				wickDownColor: '#FF4747',
				priceFormat: {
					type: 'price',
					precision: 1,
					minMove: 0.1,
				},
			});
			
			console.log('[StatsIAsView] ✅ Gráfico inativo inicializado com candlestick');
			this.marketChartInitializedInactive = true;
			
			// Aguardar um pouco antes de atualizar para garantir que o container está pronto
			setTimeout(() => {
				if (this.aiMonitoring.ticks.length > 0) {
			this.updateMarketChartInactive();
				}
			}, 200);
		} catch (error) {
			console.error('[StatsIAsView] Erro ao inicializar gráfico de mercado (inativo):', error);
		}
	},
	
	/**
	 * Atualiza o gráfico de mercado para IA desativada
	 */
	updateMarketChartInactive() {
		if (!this.marketChartInitializedInactive || !this.marketLineSeriesInactive || this.aiMonitoring.ticks.length === 0) {
			return;
		}
		
		try {
			console.log('[StatsIAsView] Atualizando gráfico inativo. Ticks disponíveis:', this.aiMonitoring.ticks.length);
			
			// Converter ticks em velas
			const candles = this.aggregateTicksToCandles(this.aiMonitoring.ticks);
			
			if (candles.length > 0) {
				console.log('[StatsIAsView] Atualizando gráfico com', candles.length, 'velas');
				this.marketLineSeriesInactive.setData(candles);
			this.marketChartInactive.timeScale().fitContent();
			} else {
				console.warn('[StatsIAsView] Nenhuma vela gerada para o gráfico inativo');
			}
		} catch (error) {
			console.error('[StatsIAsView] Erro ao atualizar gráfico de mercado (inativo):', error);
			console.error('[StatsIAsView] Stack:', error.stack);
		}
	},
	
	/**
	 * Inicializa o gráfico de mercado para IA ativa
	 */
	initMarketChartActive() {
		if (this.marketChartInitializedActive || !this.$refs.marketChartContainerActive) {
			return;
		}
		
		try {
			const container = this.$refs.marketChartContainerActive;
			const containerWidth = container.offsetWidth || 800;
			const containerHeight = 400;
			
			this.marketChartActive = createChart(container, {
				width: containerWidth,
				height: containerHeight,
				localization: { 
					locale: 'pt-BR',
					timeFormatter: (time) => {
						const date = new Date(time * 1000);
						const hours = String(date.getHours()).padStart(2, '0');
						const minutes = String(date.getMinutes()).padStart(2, '0');
						return `${hours}:${minutes}`;
					}
				},
				layout: {
					background: { type: ColorType.Solid, color: '#0B0B0B' },
					textColor: '#DFDFDF',
				},
				rightPriceScale: {
					borderColor: '#1C1C1C',
					scaleMargins: {
						top: 0.1,
						bottom: 0.1,
					},
				},
				leftPriceScale: {
					visible: false,
				},
				timeScale: {
					borderColor: '#1C1C1C',
					timeVisible: true,
					secondsVisible: false,
					rightOffset: 10,
					fixLeftEdge: false,
					fixRightEdge: false,
				},
				grid: {
					vertLines: { 
						color: 'rgba(148, 163, 184, 0.1)',
						style: 0,
						visible: true,
					},
					horzLines: { 
						color: 'rgba(148, 163, 184, 0.1)',
						style: 0,
						visible: true,
					},
				},
				crosshair: {
					mode: 1,
					vertLine: {
						color: '#22C55E',
						width: 1,
						style: 3,
						labelBackgroundColor: '#22C55E',
					},
					horzLine: {
						color: '#22C55E',
						width: 1,
						style: 3,
						labelBackgroundColor: '#22C55E',
					},
				},
				handleScroll: {
					mouseWheel: true,
					pressedMouseMove: true,
					horzTouchDrag: true,
					vertTouchDrag: true,
				},
				handleScale: {
					axisPressedMouseMove: {
						time: true,
						price: true,
					},
					axisDoubleClickReset: true,
					axisTouchDrag: true,
					mouseWheel: true,
					pinch: true,
				},
			});
			
			this.createMarketSeriesActive();
			
			console.log('[StatsIAsView] ✅ Gráfico ativo inicializado (linhas por padrão)');
			this.marketChartInitializedActive = true;
			
			// Aguardar um pouco antes de atualizar para garantir que o container está pronto
			setTimeout(() => {
				if (this.aiMonitoring.ticks.length > 0) {
					this.updateMarketChartActive();
				}
			}, 200);
		} catch (error) {
			console.error('[StatsIAsView] Erro ao inicializar gráfico de mercado (ativo):', error);
		}
	},
	
	/**
	 * Atualiza o gráfico de mercado para IA ativa
	 */
	updateMarketChartActive() {
		if (!this.marketChartInitializedActive || !this.marketLineSeriesActive || this.aiMonitoring.ticks.length === 0) {
			return;
		}
		
		try {
			console.log('[StatsIAsView] Atualizando gráfico ativo. Ticks disponíveis:', this.aiMonitoring.ticks.length);
			
			const filteredTicks = this.filterTicksByZoomActive(this.aiMonitoring.ticks);
			
			if (this.chartTypeActive === 'line') {
				const lineData = filteredTicks
					.map(tick => {
						let epoch = Number(tick.epoch || (tick.timestamp ? new Date(tick.timestamp).getTime() / 1000 : 0));
						if (epoch > 10000000000) epoch = Math.floor(epoch / 1000);
						return { time: Math.floor(epoch), value: Number(tick.value || 0) };
					})
					.filter(p => p.value > 0 && p.time > 0)
					.sort((a, b) => a.time - b.time);
				
				if (lineData.length > 0) {
					this.marketLineSeriesActive.setData(lineData);
					this.marketChartActive.timeScale().fitContent();
				} else {
					console.warn('[StatsIAsView] Nenhum ponto para gráfico de linhas');
				}
			} else {
				const candles = this.aggregateTicksToCandles(filteredTicks);
				
				if (candles.length > 0) {
					this.marketLineSeriesActive.setData(candles);
					this.marketChartActive.timeScale().fitContent();
				} else {
					console.warn('[StatsIAsView] Nenhuma vela gerada para o gráfico ativo');
				}
			}
		} catch (error) {
			console.error('[StatsIAsView] Erro ao atualizar gráfico de mercado (ativo):', error);
			console.error('[StatsIAsView] Stack:', error.stack);
		}
	},

	createMarketSeriesActive() {
		if (!this.marketChartActive) return;
		
		// Remover série anterior, se existir
		if (this.marketLineSeriesActive) {
			try {
				this.marketChartActive.removeSeries(this.marketLineSeriesActive);
			} catch (e) {
				console.warn('[StatsIAsView] Erro ao remover série anterior:', e);
			}
		}
		
		if (this.chartTypeActive === 'line') {
			this.marketLineSeriesActive = this.marketChartActive.addLineSeries({
				color: '#22C55E',
				lineWidth: 2,
			});
		} else {
			this.marketLineSeriesActive = this.marketChartActive.addCandlestickSeries({
				upColor: '#22C55E',
				downColor: '#FF4747',
				borderVisible: true,
				borderUpColor: '#22C55E',
				borderDownColor: '#FF4747',
				wickUpColor: '#22C55E',
				wickDownColor: '#FF4747',
				priceFormat: {
					type: 'price',
					precision: 1,
					minMove: 0.1,
				},
			});
		}
	},

	setZoomPeriodActive(minutes) {
		if (this.zoomPeriodActive === minutes) return;
		this.zoomPeriodActive = minutes;
		this.updateMarketChartActive();
	},
	
	toggleChartTypeActive() {
		this.chartTypeActive = this.chartTypeActive === 'line' ? 'candles' : 'line';
		this.createMarketSeriesActive();
		this.updateMarketChartActive();
	},
	
	filterTicksByZoomActive(ticks) {
		if (!Array.isArray(ticks) || ticks.length === 0) return [];
		const now = Math.floor(Date.now() / 1000);
		const minutesAgo = now - (this.zoomPeriodActive * 60);
		
		const filtered = ticks.filter(tick => {
			let epoch = Number(tick.epoch || (tick.timestamp ? new Date(tick.timestamp).getTime() / 1000 : 0));
			if (epoch > 10000000000) epoch = Math.floor(epoch / 1000);
			return epoch >= minutesAgo;
		});
		
		if (filtered.length === 0 && ticks.length > 0) {
			// fallback: últimos 200 ticks
			return ticks.slice(-200);
		}
		return filtered;
	},
	
	/**
	 * Converte ticks em velas (candles) - uma vela por segundo
	 * Estrutura Tick: { value: number, epoch: number, timestamp: string }
	 */
	aggregateTicksToCandles(ticks) {
		if (!Array.isArray(ticks) || ticks.length === 0) {
			console.log('[StatsIAsView] Nenhum tick disponível para converter');
			return [];
		}

		console.log('[StatsIAsView] Iniciando conversão de ticks para velas. Total de ticks:', ticks.length);

		// Filtrar e processar ticks - estrutura da API: { value, epoch, timestamp }
		const validTicks = ticks
			.map(tick => {
				// Epoch vem em segundos Unix da API
				const epoch = tick.epoch || (tick.timestamp ? new Date(tick.timestamp).getTime() / 1000 : Date.now() / 1000);
				const price = Number(tick.value || 0);
				
				if (!price || price <= 0) {
					return null;
				}
				
				return {
					time: Math.floor(epoch), // Arredondar para segundo
					price: price,
					epoch: epoch
				};
			})
			.filter(tick => tick !== null);

		if (validTicks.length === 0) {
			console.warn('[StatsIAsView] Nenhum tick válido após processamento');
			return [];
		}

		console.log('[StatsIAsView] Ticks válidos:', validTicks.length);

		// Ordenar por tempo
		const sortedTicks = [...validTicks].sort((a, b) => a.time - b.time);
		
		// Agrupar ticks por segundo - cada segundo vira uma vela
		const candleMap = new Map();

		for (const tick of sortedTicks) {
			const candleTime = tick.time;
			
			if (!candleMap.has(candleTime)) {
				// Primeiro tick do segundo
				candleMap.set(candleTime, {
					time: candleTime,
					open: tick.price,
					high: tick.price,
					low: tick.price,
					close: tick.price,
					count: 1
				});
			} else {
				// Adicionar tick ao segundo existente
				const candle = candleMap.get(candleTime);
				candle.high = Math.max(candle.high, tick.price);
				candle.low = Math.min(candle.low, tick.price);
				candle.close = tick.price; // Último tick define o close
				candle.count++;
			}
		}

		// Converter Map em array ordenado (formato esperado pelo lightweight-charts)
		const candles = Array.from(candleMap.values())
			.sort((a, b) => a.time - b.time)
			.map(candle => ({
				time: candle.time,
				open: candle.open,
				high: candle.high,
				low: candle.low,
				close: candle.close
			}));

		console.log(`[StatsIAsView] ✅ Convertidos ${sortedTicks.length} ticks em ${candles.length} velas`);
		console.log('[StatsIAsView] Primeiras 3 velas:', candles.slice(0, 3));
		
		return candles;
	},

	toggleMobileSidebar() {
		this.isSidebarOpen = !this.isSidebarOpen;
	},

	closeSidebar() {
		this.isSidebarOpen = false;
	},

	toggleSidebarCollapse() {
		if (!this.isMobile) {
			this.isSidebarCollapsed = !this.isSidebarCollapsed;
		}
	},

	checkMobile() {
		const wasMobile = this.isMobile;
		this.isMobile = window.innerWidth <= 1024;
		
		console.log('[StatsIAsView] checkMobile - isMobile:', this.isMobile, 'width:', window.innerWidth);
		
		if (this.isMobile) {
			// No mobile, sidebar começa fechada
			if (!wasMobile) {
				// Se acabou de mudar para mobile, fecha o sidebar
				this.isSidebarOpen = false;
			}
			this.isSidebarCollapsed = false;
		} else {
			// No desktop, sidebar sempre aberta
			this.isSidebarOpen = true;
		}
	},
},

async mounted() {
	// Verificar se o usuário está conectado com a Deriv
	console.log('[StatsIAsView] Verificando conexão Deriv...');
	
	const hasToken = !!localStorage.getItem('deriv_token');
	if (!hasToken) {
		try {
			const tokensByLoginId = localStorage.getItem('deriv_tokens_by_loginid');
			if (tokensByLoginId) {
				const parsed = JSON.parse(tokensByLoginId);
				if (Object.keys(parsed).length === 0) {
					console.warn('[StatsIAsView] Nenhum token Deriv encontrado, redirecionando para tela de conexão...');
					this.$router.push('/dashboard');
					return;
				}
			} else {
				console.warn('[StatsIAsView] Nenhum token Deriv encontrado, redirecionando para tela de conexão...');
				this.$router.push('/dashboard');
				return;
			}
		} catch (e) {
			console.warn('[StatsIAsView] Erro ao verificar tokens Deriv, redirecionando para tela de conexão...');
			this.$router.push('/dashboard');
			return;
		}
	}
	
	// Verificar conexão salva
	const savedConnection = localStorage.getItem('deriv_connection');
	if (!savedConnection) {
		console.warn('[StatsIAsView] Nenhuma conexão Deriv encontrada, redirecionando para tela de conexão...');
		this.$router.push('/dashboard');
		return;
	}
	
	console.log('[StatsIAsView] ===== COMPONENTE MONTADO =====');
	
	// Verificar se é mobile e configurar sidebar
	this.checkMobile();
	window.addEventListener('resize', this.checkMobile);
	
	// ✅ OTIMIZAÇÃO 1: Carregar estado do CACHE LOCAL IMEDIATAMENTE (instantâneo)
	this.loadAIConfigFromCache();
	
	// ✅ OTIMIZAÇÃO 2: Carregar dados do localStorage INSTANTÂNEO
	this.loadAccountInfoFromLocal();
	
	// ✅ OTIMIZAÇÃO 3: Fazer chamadas à API em PARALELO (não bloqueante)
	// Não usar await - deixar rodar em background enquanto UI já mostra dados do cache
	Promise.all([
		this.loadAIConfigOnMount(),
		this.loadAccountInfo(),
	]).then(async () => {
		console.log('[StatsIAsView] ✅ Dados da API carregados em background');
		// ✅ Verificação final: garantir que modais sejam mostrados se necessário
		// Isso é uma camada extra de segurança caso a verificação anterior não tenha funcionado
		await this.fetchBackgroundStatus();
		// Verificar também nos logs recentes
		await this.loadRecentLogs(10);
	}).catch(err => {
		console.warn('[StatsIAsView] Erro ao carregar dados da API:', err);
	});

	// Assinar eventos de trade para atualizar histórico somente em mudanças
	this.startTradeEventsStream();
	
	// Iniciar carregamento de dados mesmo quando IA está desativada
	console.log('[StatsIAsView] Chamando startDataLoading()...');
	this.startDataLoading();
	
	// Atualizar última leitura a cada segundo
	setInterval(() => {
		this.lastReadingTime = new Date().toLocaleTimeString('pt-BR', { 
			hour: '2-digit', 
			minute: '2-digit', 
			second: '2-digit' 
		});
	}, 1000);
	
	// Inicializar gráfico de mercado após o componente ser montado
	this.$nextTick(() => {
		setTimeout(() => {
			if (!this.aiMonitoring.isActive && this.$refs.marketChartContainerInactive) {
				console.log('[StatsIAsView] Tentando inicializar gráfico de mercado inativo...');
				this.initMarketChartInactive();
			}
		}, 500);
	});
},

	beforeUnmount() {
		window.removeEventListener('resize', this.checkMobile);
		this.stopPolling();
		this.stopBackgroundPolling();
	this.stopTradeEventsStream();
	},
}
</script>

<style scoped>
.layout {
	background-color: #0B0B0B;
	color: #fff;
	min-height: 100vh;
	width: 100%;
	margin-left: 0;
	padding: 0;
	font-family: 'Roboto', sans-serif;
	display: flex;
}

h1{
	font-weight: 700;
}

.dashboard-content-wrapper {
	flex: 1;
	margin-left: 280px;
	transition: margin-left 0.3s ease;
	min-height: 100vh;
	background-color: #0b0b0b;
	position: relative;
}

.dashboard-content-wrapper.sidebar-collapsed {
	margin-left: 80px;
}

/* Mobile Header */
.mobile-header-admin {
	display: none;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	height: 60px;
	background: #0B0B0B;
	border-bottom: 2px solid #9333EA;
	z-index: 999;
	align-items: center;
	padding: 0 1rem;
	justify-content: space-between;
}

.menu-toggler-btn {
	background: transparent;
	border: none;
	color: #22C55E;
	cursor: pointer;
	padding: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.mobile-brand {
	display: flex;
	align-items: center;
	gap: 0;
}

.layout-content {
	margin: 0;
	justify-content: flex-start;
	padding: 40px;
	padding-top: 100px; /* Espaço para o TopNavbar */
}

.main-header {
	display: flex;
	justify-content: space-between;
	width: 100%;
	align-items: center;
	margin-bottom: 30px;
	padding-top: 20px;
	opacity: 0;
	animation: fadeIn 0.5s ease-out forwards;
}

.main-header-left {
	width: 100%;
	text-align: left;
}

.main-content {
	width: 100%;
	margin-top: 70px;
	padding: 4rem 20px 1.5rem 20px;
	box-sizing: border-box;
}

.main-header h1 {
	font-size: 30px;
	margin: 0;
}

.main-header p {
	font-size: 14px;
	color: #999;
	margin: 5px 0 0 0;
}

.btn {
	padding: 10px 20px;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	font-weight: 500; 
}

.pdf-btn {
	background-color: #00b862;
	color: #000000;
	width: auto;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10px;
	min-width: 190px;
}

.filter-controls {
	display: flex;
	gap: 10px; 
	align-items: center; 
	margin-bottom: 20px;
	opacity: 0;
	animation: fadeIn 0.6s ease-out forwards;
	animation-delay: 0.1s;
}

.date-filter input {
	background-color: #1e1e1e;
	color: #fff;
	border: 1px solid #333;
	padding: 8px;
	border-radius: 4px;
	font-family: 'Roboto', sans-serif;
}

.btn-search {
	background-color: #00b862;
	color: #fff;
}

/* Tabela */
.table-container {
	overflow-x: auto;
	overflow-y: auto;
	background: #191a19;
	opacity: 0;
	transform: translateY(20px);
	animation: fadeInUp 0.6s ease-out forwards;
	animation-delay: 0.2s;
}

.table-container::-webkit-scrollbar {
	width: 8px;
	height: 8px; 
}

.table-container::-webkit-scrollbar-track {
	background: #2a2a2a;
}

.table-container::-webkit-scrollbar-thumb {
	background-color: #555; 
	border-radius: 4px; 
	border: 2px solid #2a2a2a; 
}

.table-container::-webkit-scrollbar-thumb:hover {
	background-color: #888;
}


table {
	width: 100%;
	overflow: hidden;
	margin-bottom: 30px; 
}

th, td {
	padding: 12px 15px;
	text-align: left;
	border-bottom: 1px solid #333;
	font-size: 13px; 
}

thead th {
	background-color: #252525;
	color: #ddd;
	font-weight: 600; 
	text-transform: uppercase;
	font-size: 11px; 
}

tbody tr {
	color: rgb(182, 182, 182);
	font-weight: 500;
}

tbody tr:hover {
	background-color: #2a2a2a;
}


.status-dot {
	display: inline-block;
	width: 10px;
	height: 10px;
	border-radius: 50%;
}

.status-dot.active {
	background-color: #00b862; 
}

.status-dot.warning {
	background-color: #ffc107; 
}

.status-dot.inactive {
	background-color: #dc3545; 
}

.profit-col {
	font-weight: bold;
}

.positive-profit {
	color: #00b862; 
}

.negative-profit {
	color: #dc3545; 
}

.bottom-summary-cards {
	display: grid;
	grid-template-columns: repeat(4, 1fr); 
	gap: 15px;
	margin-top: 20px;
}

.bottom-card {
	background-color: #1e1e1e;
	padding: 10px;
	border-radius: 8px;
	display: flex;
	height: 70px; 
	align-items: center;
	opacity: 0;
	transform: translateY(20px);
	animation: fadeInUp 0.6s ease-out forwards;
}

/* Delays escalonados para cada card */
.bottom-card:nth-child(1) { animation-delay: 0.3s; }
.bottom-card:nth-child(2) { animation-delay: 0.4s; }
.bottom-card:nth-child(3) { animation-delay: 0.5s; }
.bottom-card:nth-child(4) { animation-delay: 0.6s; }

.bottom-card .card-content {
	display: flex;
	flex-direction: row; 
	justify-content: flex-start;
	align-items: center;
	text-align: left;
	gap: 15px;
	width: 100%;
}

.card-content {
	gap: 15px;
}

.card-icon {
	filter: invert(100%); 
	width: 30px;
	margin: 0 10px;
}

.card-text-group {
	display: flex;
	flex-direction: column-reverse;
	align-items: flex-start;
	justify-content: center;
	gap: 2px; 
}

.bottom-card .card-title {
	font-size: 11px;
	color: #a7a7a7;
	margin: 0;
	text-transform: uppercase;
	font-weight: 500; 
}

.bottom-card .card-value {
	font-size: 18px;
	font-weight: 700; 
	margin: 0;
}

.card-value-white{
	color: white;
}

@media (min-width: 992px) {

    /* Tabela */
    .table-container {
        overflow-x: auto;
        min-height: 600px;
        overflow-y: auto;
        background: #191a19;
    }
}

/* Seção Principal - IA Desativada */
.ia-inactive-section {
	margin-bottom: 30px;
	animation: fadeIn 0.5s ease-out 0.1s forwards;
	opacity: 0;
}

/* Card de Saldo e Status */
.balance-status-card {
	background: rgba(30, 41, 59, 0.4);
	border: 1px solid rgba(148, 163, 184, 0.2);
	border-radius: 12px;
	padding: 24px;
	margin-bottom: 20px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 30px;
}

.balance-info {
	display: flex;
	gap: 40px;
	align-items: center;
	flex: 1;
}

.balance-main {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.balance-label {
	font-size: 12px;
	color: #94a3b8;
	text-transform: uppercase;
	letter-spacing: 0.5px;
}

.balance-value {
	font-size: 32px;
	font-weight: 700;
	color: #f8fafc;
	font-family: 'Courier New', monospace;
}

.account-type {
	margin-top: 4px;
}

.account-badge {
	padding: 4px 12px;
	border-radius: 12px;
	font-size: 11px;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.5px;
}

.account-badge.real {
	background: rgba(16, 185, 129, 0.2);
	color: #10b981;
	border: 1px solid rgba(16, 185, 129, 0.4);
}

.account-badge.demo {
	background: rgba(59, 130, 246, 0.2);
	color: #3b82f6;
	border: 1px solid rgba(59, 130, 246, 0.4);
}

.result-today, .trades-today {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.result-label, .trades-label {
	font-size: 12px;
	color: #94a3b8;
	text-transform: uppercase;
	letter-spacing: 0.5px;
}

.result-value {
	font-size: 24px;
	font-weight: 700;
	font-family: 'Courier New', monospace;
}

.result-value.positive {
	color: #10b981;
}

.result-value.negative {
	color: #ef4444;
}

.result-percent {
	font-size: 14px;
	font-weight: 600;
}

.result-percent.positive {
	color: #10b981;
}

.result-percent.negative {
	color: #ef4444;
}

.trades-value {
	font-size: 24px;
	font-weight: 700;
	color: #f8fafc;
	font-family: 'Courier New', monospace;
}

.status-actions {
	display: flex;
	flex-direction: column;
	gap: 12px;
	align-items: flex-end;
}

.status-info {
	display: flex;
	flex-direction: column;
	gap: 4px;
	align-items: flex-end;
}

.status-label {
	font-size: 12px;
	color: #94a3b8;
	text-transform: uppercase;
}

.status-value {
	font-size: 16px;
	font-weight: 600;
	padding: 6px 16px;
	border-radius: 8px;
	display: inline-flex;
	align-items: center;
	gap: 4px;
	position: relative;
}

.status-value.inactive {
	background: rgba(239, 68, 68, 0.2);
	color: #ef4444;
	border: 1px solid rgba(239, 68, 68, 0.4);
}

.btn-activate-ia {
	background: linear-gradient(135deg, #10b981 0%, #059669 100%);
	border: none;
	border-radius: 8px;
	padding: 12px 24px;
	color: white;
	font-weight: 600;
	font-size: 14px;
	cursor: pointer;
	transition: all 0.3s ease;
	box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
}

.btn-activate-ia:hover {
	transform: translateY(-2px);
	box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.btn-disconnect {
	background: rgba(30, 41, 59, 0.6);
	border: 1px solid rgba(148, 163, 184, 0.2);
	border-radius: 8px;
	padding: 8px 16px;
	color: #94a3b8;
	font-size: 12px;
	cursor: pointer;
	transition: all 0.3s ease;
}

.btn-disconnect:hover {
	background: rgba(30, 41, 59, 0.8);
	color: #f8fafc;
}

/* Visão da IA | Orion */
.ia-vision-card {
	background: rgba(30, 41, 59, 0.4);
	border: 1px solid rgba(148, 163, 184, 0.2);
	border-radius: 12px;
	padding: 24px;
	margin-bottom: 20px;
}

.vision-header {
	margin-bottom: 20px;
}

.vision-header h3 {
	font-size: 20px;
	font-weight: 700;
	color: #f8fafc;
	margin: 0 0 4px 0;
}

.vision-header p {
	font-size: 13px;
	color: #94a3b8;
	margin: 0;
}

.vision-status {
	display: flex;
	gap: 20px;
	margin-bottom: 20px;
	padding-bottom: 20px;
	border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}

.status-item {
	display: flex;
	align-items: center;
	gap: 8px;
}

.status-dot {
	width: 10px;
	height: 10px;
	border-radius: 50%;
}

.status-dot.active {
	background: #10b981;
	box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
	animation: pulse 2s ease-in-out infinite;
}

.status-text {
	font-size: 14px;
	color: #f8fafc;
	font-weight: 600;
}

.market-info-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 16px;
	margin-bottom: 20px;
}

.info-item {
	display: flex;
	flex-direction: column;
	gap: 4px;
	padding: 12px;
	background: rgba(15, 23, 42, 0.6);
	border-radius: 8px;
}

.info-label {
	font-size: 11px;
	color: #94a3b8;
	text-transform: uppercase;
	letter-spacing: 0.5px;
}

.info-value {
	font-size: 16px;
	font-weight: 700;
	color: #f8fafc;
	font-family: 'Courier New', monospace;
}

.info-value.high-confidence {
	color: #10b981;
}

.info-value.excellent {
	color: #3b82f6;
}

.info-value.status-active {
	color: #10b981;
}

.info-hint {
	font-size: 10px;
	color: #64748b;
	font-style: italic;
}

.precision-info {
	display: flex;
	gap: 30px;
	padding-top: 20px;
	border-top: 1px solid rgba(148, 163, 184, 0.1);
}

.precision-item {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.precision-label {
	font-size: 11px;
	color: #94a3b8;
	text-transform: uppercase;
}

.precision-value {
	font-size: 20px;
	font-weight: 700;
	color: #10b981;
	font-family: 'Courier New', monospace;
}

/* Seção de Configurações */
.config-section-inactive {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 20px;
	margin-bottom: 20px;
}

.config-group {
	background: rgba(30, 41, 59, 0.4);
	border: 1px solid rgba(148, 163, 184, 0.2);
	border-radius: 12px;
	padding: 20px;
}

.config-group-header {
	margin-bottom: 16px;
	padding-bottom: 12px;
	border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}

.config-group-header h4 {
	font-size: 16px;
	font-weight: 600;
	color: #f8fafc;
	margin: 0;
	display: flex;
	align-items: center;
	gap: 8px;
}

.info-icon {
	font-size: 14px;
	color: #64748b;
	cursor: help;
}

.config-group-content {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.config-field {
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.config-field label {
	font-size: 12px;
	color: #94a3b8;
	font-weight: 500;
}

.select-field {
	padding: 12px;
	background: rgba(15, 23, 42, 0.6);
	border: 1px solid rgba(148, 163, 184, 0.2);
	border-radius: 8px;
	color: #f8fafc;
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.select-field.disabled {
	opacity: 0.7;
	cursor: not-allowed;
}

.select-field small {
	font-size: 11px;
	color: #64748b;
	font-style: italic;
}

.mode-options, .risk-options {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.mode-option, .risk-option {
	padding: 14px 16px;
	background: rgba(15, 23, 42, 0.6);
	border: 1px solid rgba(148, 163, 184, 0.2);
	border-radius: 8px;
	color: #f8fafc;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.3s ease;
	display: flex;
	flex-direction: column;
	gap: 4px;
	text-align: left;
}

.mode-option:disabled, .risk-option:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.mode-option.active, .risk-option.active {
	background: rgba(16, 185, 129, 0.2);
	border-color: rgba(16, 185, 129, 0.4);
	color: #10b981;
}

.mode-hint, .risk-hint {
	font-size: 11px;
	color: #94a3b8;
	font-style: italic;
}

.risk-description {
	font-size: 11px;
	color: #64748b;
	margin-top: 4px;
}

.control-info {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.control-status {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.control-status .status-label {
	font-size: 13px;
	color: #94a3b8;
}

.status-badge {
	padding: 6px 12px;
	border-radius: 8px;
	font-size: 12px;
	font-weight: 600;
}

.status-badge.inactive {
	background: rgba(239, 68, 68, 0.2);
	color: #ef4444;
	border: 1px solid rgba(239, 68, 68, 0.4);
}

.control-hint {
	font-size: 12px;
	color: #64748b;
	margin: 0;
	font-style: italic;
}

.logs-container {
	max-height: 200px;
	overflow-y: auto;
	background: rgba(15, 23, 42, 0.6);
	border-radius: 8px;
	padding: 12px;
}

.no-logs {
	text-align: center;
	padding: 20px;
	color: #64748b;
	font-size: 13px;
}

.logs-list {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.log-item {
	display: flex;
	gap: 12px;
	padding: 8px;
	border-bottom: 1px solid rgba(148, 163, 184, 0.1);
	font-size: 12px;
}

.log-time {
	color: #64748b;
	font-family: 'Courier New', monospace;
	min-width: 80px;
}

.log-message {
	color: #f8fafc;
}

/* Seção de Monitoramento de IA */
.ai-monitoring-section {
	background: rgba(30, 41, 59, 0.4);
	border: 1px solid rgba(148, 163, 184, 0.2);
	border-radius: 12px;
	padding: 24px;
	margin-bottom: 30px;
	animation: fadeIn 0.5s ease-out 0.1s forwards;
	opacity: 0;
}

.ai-monitoring-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
}

.ai-monitoring-header h2 {
	font-size: 22px;
	font-weight: 600;
	color: #f8fafc;
	margin: 0;
}

.btn-ai-toggle {
	background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
	color: white;
	border: none;
	padding: 12px 24px;
	border-radius: 8px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
	display: flex;
	align-items: center;
	gap: 8px;
}

.btn-ai-toggle:hover {
	transform: translateY(-2px);
	box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
}

.btn-ai-toggle.active {
	background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.btn-ai-toggle.active:hover {
	box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
}

.ai-monitoring-content {
	animation: slideDown 0.4s ease-out;
}

.price-display-section {
	display: grid;
	grid-template-columns: 1fr 2fr 1fr;
	gap: 20px;
	margin-top: 20px;
}

.current-price-card,
.last-10-prices-card,
.statistics-card {
	background: rgba(15, 23, 42, 0.6);
	border: 1px solid rgba(148, 163, 184, 0.1);
	border-radius: 10px;
	padding: 20px;
}

.current-price-card h3,
.last-10-prices-card h3,
.statistics-card h3 {
	font-size: 14px;
	font-weight: 600;
	color: #94a3b8;
	margin: 0 0 16px 0;
	text-transform: uppercase;
	letter-spacing: 0.5px;
}

.price-value {
	font-size: 48px;
	font-weight: 800;
	color: #06d6a0;
	text-align: center;
	margin: 20px 0;
	text-shadow: 0 0 20px rgba(6, 214, 160, 0.3);
}

.price-timestamp {
	text-align: center;
	font-size: 12px;
	color: #64748b;
	margin: 0;
}

.price-list {
	max-height: 300px;
	overflow-y: auto;
}

.price-item {
	display: grid;
	grid-template-columns: 30px 80px 80px 1fr;
	gap: 10px;
	padding: 8px 12px;
	border-bottom: 1px solid rgba(148, 163, 184, 0.05);
	align-items: center;
	font-size: 13px;
}

.price-item:last-child {
	border-bottom: none;
}

.price-number {
	color: #64748b;
	font-weight: 600;
}

.price-value-item {
	color: #f8fafc;
	font-weight: 600;
	font-family: 'Courier New', monospace;
}

.price-time {
	color: #94a3b8;
	font-size: 11px;
}

.price-variation {
	text-align: right;
	font-weight: 600;
	font-size: 12px;
}

.price-variation.positive {
	color: #10b981;
}

.price-variation.negative {
	color: #ef4444;
}

.price-variation.neutral {
	color: #64748b;
}

.no-data {
	text-align: center;
	padding: 40px 20px;
	color: #64748b;
}

.stats-grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: 16px;
}

.stat-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 12px 16px;
	background: rgba(30, 41, 59, 0.3);
	border-radius: 8px;
}

.stat-label {
	color: #94a3b8;
	font-size: 13px;
	font-weight: 500;
}

.stat-value {
	color: #f8fafc;
	font-size: 16px;
	font-weight: 700;
	font-family: 'Courier New', monospace;
}

.stat-value.positive {
	color: #10b981;
}

.stat-value.negative {
	color: #ef4444;
}

@keyframes slideDown {
	from {
		opacity: 0;
		transform: translateY(-20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
    }
}

/* Seção de Trading Automático */
.ai-trading-section {
	background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(30, 41, 59, 0.4) 100%);
	border: 1px solid rgba(16, 185, 129, 0.3);
	border-radius: 12px;
	padding: 24px;
	margin-bottom: 30px;
	animation: fadeIn 0.5s ease-out 0.2s forwards;
	opacity: 0;
	width: 100%;
	box-sizing: border-box;
}

/* Banner de IA Ativa */
.ai-active-banner {
	display: flex;
	align-items: center;
	gap: 16px;
	padding: 16px 20px;
	background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 214, 160, 0.1));
	border: 2px solid rgba(16, 185, 129, 0.5);
	border-radius: 12px;
	margin-bottom: 20px;
	animation: pulseGlow 2s ease-in-out infinite;
}

.banner-icon {
	font-size: 32px;
	filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.6));
}

.banner-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.banner-content strong {
	font-size: 18px;
	font-weight: 700;
	color: #10b981;
	letter-spacing: 1px;
}

.banner-content span {
	font-size: 13px;
	color: #94a3b8;
}

.banner-status {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 8px 16px;
	background: rgba(16, 185, 129, 0.15);
	border-radius: 8px;
	font-size: 13px;
	font-weight: 600;
	color: #10b981;
}

.status-indicator {
	width: 8px;
	height: 8px;
	background: #10b981;
	border-radius: 50%;
	animation: pulse 2s ease-in-out infinite;
	box-shadow: 0 0 8px rgba(16, 185, 129, 0.8);
}

@keyframes pulseGlow {
	0%, 100% {
		box-shadow: 0 0 15px rgba(16, 185, 129, 0.3);
	}
	50% {
		box-shadow: 0 0 25px rgba(16, 185, 129, 0.5);
	}
}

@keyframes pulse {
	0%, 100% {
		opacity: 1;
		transform: scale(1);
	}
	50% {
		opacity: 0.6;
		transform: scale(1.2);
	}
}

.ai-trading-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24px;
	flex-wrap: wrap;
	gap: 16px;
}

.ai-trading-header h2 {
	font-size: 24px;
	font-weight: 700;
	color: #f8fafc;
	margin: 0;
}

/* Configurações Fixas */
.fixed-config-info {
	display: flex;
	gap: 20px;
	margin-bottom: 20px;
	padding: 16px;
	background: rgba(30, 41, 59, 0.3);
	border-radius: 8px;
	border: 1px solid rgba(148, 163, 184, 0.1);
}

.config-info-item {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.config-info-item label {
	font-size: 11px;
	color: #94a3b8;
	text-transform: uppercase;
	letter-spacing: 0.5px;
	display: inline-flex;
	align-items: center;
	gap: 4px;
}

.config-info-item .fixed-value {
	font-size: 14px;
	color: #f8fafc;
	font-weight: 600;
}

.trading-controls {
	display: flex;
	gap: 16px;
	align-items: flex-end;
	flex-wrap: wrap;
}

.input-group {
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.mode-select {
	padding: 10px 14px;
	background: rgba(30, 41, 59, 0.6);
	border: 1px solid rgba(148, 163, 184, 0.2);
	border-radius: 8px;
	color: #f8fafc;
	font-size: 14px;
	cursor: pointer;
	transition: all 0.3s ease;
	font-family: inherit;
}

.mode-select:hover:not(:disabled) {
	border-color: rgba(16, 185, 129, 0.4);
	background: rgba(30, 41, 59, 0.8);
}

.mode-select:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.mode-select option {
	background: #1e293b;
	color: #f8fafc;
	padding: 10px;
}

.input-group label {
	font-size: 12px;
	color: #94a3b8;
	font-weight: 500;
}

.input-hint {
	font-size: 10px;
	color: #64748b;
	font-style: italic;
	margin-top: 2px;
}

.input-group input {
	background: rgba(15, 23, 42, 0.6);
	border: 1px solid rgba(148, 163, 184, 0.2);
	border-radius: 8px;
	padding: 10px 14px;
	color: #f8fafc;
	font-size: 14px;
	font-weight: 600;
	width: 140px;
	transition: all 0.2s ease;
}

.input-group input:focus {
	outline: none;
	border-color: #10b981;
	box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.input-group input:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.btn-save-config {
	background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
	border: none;
	border-radius: 8px;
	padding: 10px 20px;
	color: white;
	font-weight: 600;
	font-size: 13px;
	cursor: pointer;
	transition: all 0.3s ease;
	box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
	margin-top: 8px;
	width: 100%;
}

.btn-save-config:hover:not(:disabled) {
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-save-config:disabled {
	opacity: 0.6;
	cursor: not-allowed;
	transform: none;
}

.config-message {
	display: block;
	margin-top: 8px;
	padding: 8px 12px;
	border-radius: 6px;
	font-size: 12px;
	font-weight: 500;
	text-align: center;
}

.config-message.success {
	background: rgba(16, 185, 129, 0.15);
	color: #10b981;
	border: 1px solid rgba(16, 185, 129, 0.3);
}

.config-message.error {
	background: rgba(239, 68, 68, 0.15);
	color: #ef4444;
	border: 1px solid rgba(239, 68, 68, 0.3);
}

.btn-trading-toggle {
	background: linear-gradient(135deg, #10b981 0%, #059669 100%);
	border: none;
	border-radius: 8px;
	padding: 12px 24px;
	color: white;
	font-weight: 600;
	font-size: 14px;
	cursor: pointer;
	transition: all 0.3s ease;
	box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
}

.btn-trading-toggle:hover {
	transform: translateY(-2px);
	box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.btn-trading-toggle.active {
	background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
	box-shadow: 0 4px 14px rgba(239, 68, 68, 0.3);
}

.btn-trading-toggle.active:hover {
	box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
}

.trading-active-content {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 20px;
	margin-top: 20px;
	width: 100%;
	box-sizing: border-box;
}

.active-trade-card,
.next-trade-card {
	background: rgba(15, 23, 42, 0.6);
	border: 1px solid rgba(148, 163, 184, 0.2);
	border-radius: 12px;
	padding: 20px;
	grid-column: span 2;
}

.trade-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
	padding-bottom: 16px;
	border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}

.trade-header h3 {
	font-size: 18px;
	font-weight: 600;
	color: #f8fafc;
	margin: 0;
}

.trade-signal {
	padding: 8px 16px;
	border-radius: 20px;
	font-size: 14px;
	font-weight: 700;
	display: flex;
	align-items: center;
	gap: 6px;
}

.trade-signal.CALL {
	background: rgba(16, 185, 129, 0.2);
	color: #10b981;
	border: 1px solid rgba(16, 185, 129, 0.4);
}

.trade-signal.PUT {
	background: rgba(239, 68, 68, 0.2);
	color: #ef4444;
	border: 1px solid rgba(239, 68, 68, 0.4);
}

.trade-details {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16px;
	margin-bottom: 20px;
}

.detail-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 14px;
	background: rgba(30, 41, 59, 0.3);
	border-radius: 8px;
}

.detail-label {
	color: #94a3b8;
	font-size: 13px;
	font-weight: 500;
}

.detail-value {
	color: #f8fafc;
	font-size: 16px;
	font-weight: 700;
	font-family: 'Courier New', monospace;
}

.detail-value.countdown {
	color: #60a5fa;
	font-size: 20px;
}

.detail-row.profit-row {
	grid-column: span 2;
	background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(99, 102, 241, 0.1));
	border: 1px solid rgba(99, 102, 241, 0.3);
	padding: 18px;
}

.detail-value.profit-value {
	font-size: 24px;
	font-weight: 800;
	text-shadow: 0 0 10px currentColor;
}

.profit-progress-bar {
	grid-column: span 2;
	position: relative;
	height: 50px;
	background: rgba(30, 41, 59, 0.5);
	border-radius: 12px;
	overflow: hidden;
	border: 1px solid rgba(148, 163, 184, 0.2);
	margin-top: 8px;
}

.progress-fill {
	position: absolute;
	left: 0;
	top: 0;
	height: 100%;
	transition: width 0.5s ease, background 0.3s ease;
	border-radius: 12px;
}

.progress-fill.positive {
	background: linear-gradient(90deg, rgba(16, 185, 129, 0.3), rgba(16, 185, 129, 0.6));
	box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
}

.progress-fill.negative {
	background: linear-gradient(90deg, rgba(239, 68, 68, 0.3), rgba(239, 68, 68, 0.6));
	box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
}

.progress-label {
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	color: #f8fafc;
	font-size: 16px;
	font-weight: 700;
	z-index: 10;
	text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.trade-reasoning {
	padding: 16px;
	background: rgba(59, 130, 246, 0.1);
	border-left: 3px solid #3b82f6;
	border-radius: 8px;
	margin-top: 16px;
}

.trade-reasoning p {
	margin: 0;
	color: #cbd5e1;
	font-size: 14px;
	line-height: 1.6;
}

.next-trade-info {
	display: flex;
	align-items: center;
	gap: 20px;
	padding: 20px;
}

.timer-icon {
	font-size: 48px;
	animation: pulse 2s ease-in-out infinite;
}

.next-trade-info h3 {
	font-size: 18px;
	color: #f8fafc;
	margin: 0 0 12px 0;
	font-weight: 600;
}

.next-trade-info .countdown-text {
	color: #06d6a0;
	font-size: 20px;
	margin: 0 0 8px 0;
	font-family: 'Courier New', monospace;
	font-weight: 700;
}

.next-trade-info .info-text {
	color: #94a3b8;
	font-size: 14px;
	margin: 0;
	font-style: italic;
}

.trading-stats-card {
	grid-column: span 2;
	background: rgba(15, 23, 42, 0.6);
	border: 1px solid rgba(148, 163, 184, 0.2);
	border-radius: 12px;
	padding: 20px;
	width: 100%;
	box-sizing: border-box;
}

.trading-stats-card h3 {
	font-size: 16px;
	color: #f8fafc;
	margin: 0 0 20px 0;
	font-weight: 600;
}

.stats-row {
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 16px;
	width: 100%;
	box-sizing: border-box;
}

.stat-box {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20px;
	background: rgba(30, 41, 59, 0.3);
	border-radius: 8px;
	border: 1px solid rgba(148, 163, 184, 0.1);
	transition: all 0.3s ease;
}

.stat-box:hover {
	transform: translateY(-4px);
	border-color: rgba(148, 163, 184, 0.3);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.stat-box.win {
	border-color: rgba(16, 185, 129, 0.3);
}

.stat-box.loss {
	border-color: rgba(239, 68, 68, 0.3);
}

.stat-number {
	font-size: 32px;
	font-weight: 700;
	color: #f8fafc;
	font-family: 'Courier New', monospace;
	margin-bottom: 8px;
}

.stat-label {
	font-size: 12px;
	color: #94a3b8;
	text-align: center;
	font-weight: 500;
}

@keyframes pulse {
	0%, 100% {
		transform: scale(1);
		opacity: 1;
	}
	50% {
		transform: scale(1.1);
		opacity: 0.8;
    }
}

@media (max-width: 992px) {
	.sidebar{
		display: none;
	}
	.layout {
		margin-left: 0;
		width: 100%;
		box-sizing: border-box;
	}
	
	.main-header {
		flex-direction: column;
		align-items: flex-start;
	}
	
	.main-header-right {
		margin-top: 15px; 
		width: 100%;
		text-align: right;
	}
	
	.filter-controls {
		flex-direction: row; 
		flex-wrap: wrap; 
	}
	
	.date-filter, .btn-search {
		width: calc(50% - 5px); 
	}

	.bottom-summary-cards {
		grid-template-columns: repeat(2, 1fr); 
	}

	.filter-controls {
		flex-direction: row; 
		align-items: stretch; 
		gap: 10px;
	}

	.pdf-btn {
		width: 100%;
	}

	th, td {
		width: 1000px;
	}

	.table-container {
		height: fit-content;
	}
}

/* Histórico de Operações */
.trade-history-card {
	background: linear-gradient(145deg, #1e1e1e, #252525);
	border-radius: 15px;
	padding: 20px;
	margin-top: 20px;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.history-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
}

.history-header h3 {
	margin: 0;
	font-size: 1.3rem;
	color: #fff;
}

.btn-refresh {
	background: linear-gradient(135deg, #4A90E2, #357ABD);
	border: none;
	padding: 8px 15px;
	border-radius: 8px;
	color: #fff;
	cursor: pointer;
	font-size: 0.9rem;
	transition: all 0.3s ease;
}

.btn-refresh:hover {
	transform: scale(1.05);
	box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4);
}

.history-table {
	overflow-x: auto;
}

.history-table table {
	width: 100%;
	border-collapse: collapse;
}

.history-table thead th {
	background: #2a2a2a;
	padding: 12px;
	text-align: left;
	font-size: 0.9rem;
	color: #999;
	border-bottom: 2px solid #333;
}

.history-table tbody tr {
	border-bottom: 1px solid #2a2a2a;
	transition: background 0.2s;
}

.history-table tbody tr:hover {
	background: #252525;
}

.history-table tbody td {
	padding: 12px;
	font-size: 0.95rem;
}

.signal-badge {
	display: inline-block;
	padding: 4px 10px;
	border-radius: 6px;
	font-size: 0.85rem;
	font-weight: 600;
}

.signal-badge.call {
	background: rgba(46, 204, 113, 0.2);
	color: #2ecc71;
}

.signal-badge.put {
	background: rgba(231, 76, 60, 0.2);
	color: #e74c3c;
}

.status-badge {
	display: inline-block;
	padding: 4px 10px;
	border-radius: 6px;
	font-size: 0.85rem;
	font-weight: 600;
}

.status-badge.won {
	background: rgba(46, 204, 113, 0.2);
	color: #2ecc71;
}

.status-badge.lost {
	background: rgba(231, 76, 60, 0.2);
	color: #e74c3c;
}

.profit-cell {
	font-weight: 700;
	font-size: 1rem;
}

.profit-cell.positive {
	color: #2ecc71;
}

.profit-cell.negative {
	color: #e74c3c;
}

.no-history {
	text-align: center;
	padding: 40px 20px;
	color: #999;
}

.no-history p {
	margin: 5px 0;
}

.no-history .hint {
	font-size: 0.9rem;
	color: #666;
}

/* Análise de Mercado */
.market-analysis-section {
	background: rgba(15, 23, 42, 0.6);
	border: 1px solid rgba(148, 163, 184, 0.2);
	border-radius: 12px;
	padding: 20px;
	margin-top: 20px;
	margin-bottom: 20px;
}

.market-analysis-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16px;
	flex-wrap: wrap;
	gap: 12px;
}

.market-analysis-header h3 {
	font-size: 18px;
	color: #f8fafc;
	margin: 0;
	font-weight: 600;
}

.market-analysis-meta {
	font-size: 12px;
	color: #94a3b8;
}

.market-chart-container {
	width: 100%;
	height: 400px;
	position: relative;
	background: rgba(9, 10, 12, 0.5);
	border-radius: 8px;
	overflow: hidden;
}

.market-chart-wrapper {
	width: 100%;
	height: 100%;
}

.chart-placeholder {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
	color: #64748b;
	font-size: 14px;
}

.chart-placeholder p {
	margin: 4px 0;
}

.chart-placeholder-hint {
	font-size: 12px;
	color: #475569;
	font-style: italic;
}

/* Controles do gráfico (IA ativa) */
.chart-controls-active {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-top: 8px;
}

.chart-controls-active .zoom-buttons {
	display: inline-flex;
	border: 1px solid #1A1A1A;
	border-radius: 8px;
	overflow: hidden;
}

.chart-controls-active .zoom-btn {
	padding: 6px 10px;
	font-size: 12px;
	color: #DFDFDF;
	background: #0B0B0B;
	border: none;
	cursor: pointer;
	transition: all 0.2s ease;
}

.chart-controls-active .zoom-btn:not(.active):hover {
	background: #1A1A1A;
}

.chart-controls-active .zoom-btn.active {
	background: #22C55E;
	color: #0B0B0B;
	font-weight: 600;
}

.chart-controls-active .type-toggle {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	padding: 6px 12px;
	font-size: 12px;
	color: #DFDFDF;
	background: #0B0B0B;
	border: 1px solid #1A1A1A;
	border-radius: 8px;
	cursor: pointer;
	transition: all 0.2s ease;
}

.chart-controls-active .type-toggle:hover {
	border-color: #22C55E;
	color: #22C55E;
}

/* Gráfico de Ticks (mantido para compatibilidade) */
.ticks-chart-container {
	background: rgba(15, 23, 42, 0.6);
	border: 1px solid rgba(148, 163, 184, 0.2);
	border-radius: 12px;
	padding: 20px;
	margin-top: 20px;
	margin-bottom: 20px;
}

.ticks-chart-container h3 {
	font-size: 16px;
	color: #f8fafc;
	margin: 0 0 16px 0;
	font-weight: 600;
}

.chart-wrapper-ticks {
	width: 100%;
	height: 200px;
	position: relative;
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

@media (max-width: 600px) {
	.layout {
		padding: 0 10px; 
	}

	.filter-controls {
		flex-direction: column; 
		align-items: stretch; 
		gap: 10px;
	}

	.date-filter, 
	.btn-search {
		width: 100%; 
	}
	
	.bottom-summary-cards {
		grid-template-columns: 1fr; 
	}
	
	.bottom-card .card-content {
		gap: 10px; 
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

/* Tooltip Styles */
.tooltip-container {
	position: relative;
	display: inline-flex;
	align-items: center;
	cursor: help;
	margin-left: 4px;
	vertical-align: middle;
}

.icon-help {
	width: 14px;
	height: 14px;
	color: #94a3b8;
	transition: color 0.2s;
	flex-shrink: 0;
}

.icon-help:hover {
	color: #fff;
}

.tooltip-text {
	visibility: hidden;
	opacity: 0;
	background-color: #1e293b;
	color: #fff;
	text-align: left;
	padding: 8px 12px;
	border-radius: 6px;
	font-size: 12px;
	width: max-content;
	max-width: 250px;
	white-space: nowrap;
	position: absolute;
	z-index: 10000;
	bottom: 100%;
	left: 50%;
	margin-bottom: 8px;
	transform: translateX(-50%);
	transition: opacity 0.2s ease, visibility 0.2s ease;
	pointer-events: none;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
	border: 1px solid #334155;
}

.tooltip-text::after {
	content: "";
	position: absolute;
	top: 100%;
	left: 50%;
	margin-left: -5px;
	border-width: 5px;
	border-style: solid;
	border-color: #1e293b transparent transparent transparent;
}

.tooltip-container:hover .tooltip-text {
	visibility: visible;
	opacity: 1;
}

/* Ajustes para labels com tooltips */
.info-label,
.status-label,
.precision-label,
.config-field label,
.config-info-item label {
	display: inline-flex;
	align-items: center;
	position: relative;
	flex-wrap: wrap;
	gap: 4px;
}

/* ========================================================== */
/* Performance Cards Styles (IA Ativa)                       */
/* ========================================================== */

.performance-summary-section {
	margin-bottom: 1.5rem;
	width: 100%;
	box-sizing: border-box;
}

.performance-cards-grid {
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 1rem;
	margin-bottom: 1rem;
	width: 100%;
	box-sizing: border-box;
}

.performance-card {
	padding: 1.25rem;
	background-color: rgba(15, 23, 42, 0.6);
	border: 1px solid rgba(148, 163, 184, 0.2);
	border-radius: 12px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	box-sizing: border-box;
	min-height: 140px;
}

.card-header-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 0.75rem;
}

.card-label {
	font-size: 0.75rem;
	color: #94a3b8;
	font-weight: 500;
	text-transform: uppercase;
	letter-spacing: 0.5px;
}

.eye-btn {
	cursor: pointer;
	transition: all 0.2s ease;
	opacity: 0.6;
	background: none;
	border: none;
	color: #94a3b8;
	padding: 0.25rem;
	display: flex;
	align-items: center;
	justify-content: center;
}

.eye-btn:hover {
	opacity: 1;
	color: #22C55E;
}

.eye-btn i {
	font-size: 0.875rem;
}

.card-value-large {
	margin-bottom: 0.75rem;
}

.card-value-large span {
	font-size: 1.875rem;
	font-weight: 700;
	color: #f8fafc;
}

.hidden-value::before {
	content: "••••••";
	letter-spacing: 2px;
}

.hidden-value {
	color: transparent !important;
	font-size: 1.875rem !important;
	font-weight: 700 !important;
}

.card-actions-row {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.account-type-btn {
	padding: 0.375rem 0.75rem;
	border-radius: 0.5rem;
	font-size: 0.75rem;
	font-weight: 600;
	border: none;
	cursor: pointer;
	transition: all 0.3s ease;
	background-color: rgba(15, 23, 42, 0.8);
	color: #94a3b8;
	border: 1px solid rgba(148, 163, 184, 0.2);
}

.account-type-btn.active {
	background-color: #22C55E;
	color: #000;
	border-color: #22C55E;
}

.profit-value.positive {
	color: #22C55E;
}

.profit-value.negative {
	color: #EF4444;
}

.profit-percentage {
	font-size: 0.875rem;
	font-weight: 500;
	display: block;
}

.profit-percentage.positive {
	color: #22C55E;
}

.profit-percentage.negative {
	color: #EF4444;
}

.trades-stats-row {
	display: flex;
	align-items: center;
	gap: 1rem;
	font-size: 0.75rem;
	margin-top: 0.5rem;
}

/* Status Card */
.status-card {
	padding: 1.25rem;
	margin-top: 1rem;
	background-color: rgba(15, 23, 42, 0.6);
	border: 1px solid rgba(148, 163, 184, 0.2);
	border-radius: 12px;
}

.status-card-content {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
}

.status-card-left {
	display: flex;
	align-items: center;
	gap: 1rem;
	flex: 1;
}

.ai-status-widget {
	position: relative;
	width: 3rem;
	height: 3rem;
	display: flex;
	align-items: center;
	justify-content: center;
}

.ai-status-bg {
	position: absolute;
	inset: 0;
	background-color: rgba(11, 11, 11, 0.5);
	border: 1px solid #1C1C1C;
	border-radius: 0.5rem;
}

.ai-status-content {
	position: relative;
	z-index: 10;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 0.375rem;
}

.ai-status-spinner-wrapper {
	position: relative;
}

.ai-status-pulse-bg {
	position: absolute;
	inset: 0;
	background-color: rgba(255, 208, 88, 0.2);
	border-radius: 9999px;
	filter: blur(12px);
	animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.ai-status-spinner {
	position: relative;
	width: 2.5rem;
	height: 2.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
}

.spinner-svg {
	width: 1.75rem;
	height: 1.75rem;
	color: #FFD058;
	animation: spin 3s linear infinite;
}

@keyframes spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

.status-text-content {
	flex: 1;
	text-align: left;
}

.status-title {
	font-size: 0.875rem;
	font-weight: 600;
	color: #f8fafc;
	margin-bottom: 0.25rem;
	text-align: left;
}

.status-subtitle-row {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	font-size: 0.75rem;
	text-align: left;
}

.status-indicator-text {
	font-weight: 500;
	color: #FFD058;
}

.status-indicator-dot {
	color: #94a3b8;
}

.status-indicator-subtext {
	color: #94a3b8;
}

.status-card-right {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.ai-online-indicator {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.ai-pulse-dot {
	width: 8px;
	height: 8px;
	background: #22C55E;
	border-radius: 50%;
	animation: pulse 2s ease-in-out infinite;
	box-shadow: 0 0 8px rgba(34, 197, 94, 0.8);
}

.deactivate-ai-btn-new {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem 1rem;
	background-color: rgba(239, 68, 68, 0.1);
	color: #EF4444;
	border: 1px solid rgba(239, 68, 68, 0.3);
	border-radius: 0.5rem;
	font-size: 0.75rem;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
}

.deactivate-ai-btn-new:hover:not(:disabled) {
	background-color: rgba(239, 68, 68, 0.2);
	border-color: rgba(239, 68, 68, 0.5);
}

.deactivate-ai-btn-new:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.deactivate-ai-btn-new i {
	font-size: 0.875rem;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
	.performance-cards-grid {
		grid-template-columns: repeat(2, 1fr);
		width: 100%;
		gap: 1rem;
	}
	
	.stats-row {
		grid-template-columns: repeat(2, 1fr);
		width: 100%;
	}
	
	.trading-active-content {
		grid-template-columns: 1fr;
		width: 100%;
	}
	
	.trading-stats-card {
		grid-column: span 1;
		width: 100%;
	}
}

@media (max-width: 768px) {
	.performance-cards-grid {
		grid-template-columns: 1fr;
		width: 100%;
		gap: 1rem;
	}
	
	.stats-row {
		grid-template-columns: 1fr;
		width: 100%;
	}
	
	.trading-active-content {
		grid-template-columns: 1fr;
		width: 100%;
	}
	
	.trading-stats-card {
		grid-column: span 1;
		width: 100%;
	}
	
	.status-card-content {
		flex-direction: column;
		align-items: flex-start;
	}
	
	.status-card-right {
		width: 100%;
		justify-content: space-between;
	}
}

/* Hamburger Button */
.hamburger-btn {
	display: none;
	position: fixed !important;
	top: 15px !important;
	left: 15px !important;
	z-index: 10001 !important;
	background-color: #1c1c1c !important;
	border: 1px solid #2c2c2c !important;
	border-radius: 8px;
	width: 45px;
	height: 45px;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 5px;
	cursor: pointer;
	transition: all 0.3s ease;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.hamburger-btn:hover {
	background-color: #252525;
	border-color: #3c3c3c;
}

.hamburger-btn span {
	display: block;
	width: 22px;
	height: 2px;
	background-color: #dfdfdf;
	transition: all 0.3s ease;
	border-radius: 2px;
}

.hamburger-btn.active span:nth-child(1) {
	transform: rotate(45deg) translate(5px, 5px);
}

.hamburger-btn.active span:nth-child(2) {
	opacity: 0;
}

.hamburger-btn.active span:nth-child(3) {
	transform: rotate(-45deg) translate(6px, -6px);
}

/* Overlay */
.sidebar-overlay {
	display: none;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.7);
	z-index: 998;
	backdrop-filter: blur(2px);
}

/* No mobile, overlay fica abaixo da sidebar quando visível */
@media (max-width: 1024px) {
	.sidebar-overlay {
		z-index: 9999;
	}
}

/* Mobile Styles */
@media (max-width: 1024px) {
	.layout {
		width: 100%;
		margin-left: 0;
		padding: 0;
		position: relative;
		flex-direction: column;
	}

	.dashboard-content-wrapper {
		margin-left: 0;
		width: 100%;
	}

	.mobile-header-admin {
		display: flex;
	}

	.layout-content {
		padding-top: 80px; /* Espaço para mobile header */
	}

	.hamburger-btn {
		display: flex !important;
		visibility: visible !important;
		opacity: 1 !important;
	}

	.sidebar-overlay {
		display: block;
	}

	/* Sidebar mobile */
	:deep(.sidebar) {
		position: fixed;
		width: 280px !important;
		height: 100vh;
		z-index: 1000;
		transform: translateX(-100%);
		transition: transform 0.3s ease-out;
	}

	/* Sidebar aberta no mobile - z-index alto para ficar acima de tudo */
	:deep(.sidebar.is-open) {
		transform: translateX(0);
		z-index: 10000 !important;
	}

	.main-header {
		padding-left: 70px;
	}
}

@media (max-width: 480px) {
	.hamburger-btn {
		width: 40px;
		height: 40px;
		top: 12px;
		left: 12px;
	}

	.hamburger-btn span {
		width: 20px;
	}
}
</style>

<style>
/* Estilos globais para garantir que o hambúrguer apareça no mobile */
@media (max-width: 1024px) {
	.hamburger-btn {
		display: flex !important;
		visibility: visible !important;
		opacity: 1 !important;
		position: fixed !important;
		top: 15px !important;
		left: 15px !important;
		z-index: 10001 !important;
	}
}
</style>