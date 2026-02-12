export const RiskManager = {
    /**
     * Default payouts per contract type for safe estimation
     */
    payoutDefaults: {
        'CALL': 1.95,
        'PUT': 1.95,
        'DIGITOVER': 1.19,  // Standard for Over 8 or similar
        'DIGITUNDER': 1.19, // Standard for Under 8 or similar
        'DIGITMATCH': 9.00,
        'DIGITDIFF': 1.09,
        'DIGITEVEN': 1.95,
        'DIGITODD': 1.95
    },

    /**
     * Calculates the next stake based on current session state and user config.
     */
    payoutHistory: {},

    reset() {
        this.payoutHistory = {};
    },

    initSession(initialNegotiationMode = 'VELOZ', config = {}) {
        // ✅ Ensure initialNegotiationMode is always a string and uppercase
        if (typeof initialNegotiationMode !== 'string') {
            console.warn('[RiskManager] initialNegotiationMode was not a string, defaulting to VELOZ');
            initialNegotiationMode = 'VELOZ';
        } else {
            initialNegotiationMode = initialNegotiationMode.toUpperCase();
        }
        return {
            isRecoveryMode: false,
            isStopped: false,
            peakProfit: 0,
            stopBlindadoActive: false,
            stopBlindadoFloor: 0,

            // RiskManager Variables
            analysisType: 'PRINCIPAL',
            negotiationMode: initialNegotiationMode,
            initialNegotiationMode: initialNegotiationMode, // Store for reset after recovery
            strategy: config.strategy || null, // Strategy name for display
            initialStake: config.initialStake || 0.35, // ✅ STORE THE BASE STAKE!
            activeStrategy: 'PRINCIPAL',
            lastResultWin: false,
            lastProfit: 0,
            lastStake: 0,
            lastPayoutPrincipal: null,
            lastProfitPrincipal: 0,
            lastStakePrincipal: 0,
            lastPayoutRecovery: null,
            lastProfitRecovery: 0,
            lastStakeRecovery: 0,
            consecutiveLosses: 0,
            consecutiveWins: 0,
            lossStreakRecovery: 0,
            totalLossAccumulated: 0,
            recoveredAmount: 0,
            skipSorosNext: false,
            lastContractType: null,

            // Conservador specific (Martingale Parcelado)
            prejuizo_acumulado: 0,
            parcelas_total: 4,
            valor_parcela: 0,
            recoveryInstallmentsRemaining: 0,
            consecutiveLossesInRecovery: 0
        };
    },

    calculateNextStake(state, config, explicitPayout = null) {
        // ✅ PRIORITY: Pass through config > State (initSession) > Default
        const baseStake = config.initialStake || state.initialStake || 0.35;
        const riskProfile = (config.riskProfile || 'moderado').toLowerCase();
        // Normalize contract type to avoid mismatches
        const tradeType = (config.tradeType || 'CALL').toUpperCase();

        // Profit Margin Factor based on Risk Profile
        let profitFactor = 0.15; // Moderado
        if (riskProfile === 'conservador') profitFactor = 0.02;
        else if (riskProfile === 'agressivo') profitFactor = 0.30;

        // Determine best payout estimate
        // Use composite key to separate Principal vs Recovery payouts AND Barriers
        // e.g. DIGITUNDER_8 != DIGITUNDER_4
        const isRecovery = state.analysisType === 'RECUPERACAO';
        const modePrefix = isRecovery ? 'RECUPERACAO_' : 'PRINCIPAL_';

        // Append barrier/prediction if available for digit/over/under contracts
        let barrierSuffix = '';
        if (config.prediction !== undefined && config.prediction !== null) {
            barrierSuffix = '_' + config.prediction;
        }

        const historyKey = modePrefix + tradeType + barrierSuffix;

        const configPayout = config.expectedPayout || null;

        // ✅ PRIORITY ORDER: Explicit Payout (from WS) > Config Payout > History > Defaults
        let estimatedPayout = explicitPayout || configPayout || this.payoutHistory[historyKey] || this.payoutHistory[tradeType] || this.payoutDefaults[tradeType] || 1.95;

        let profitRate = estimatedPayout;

        // ✅ SMART NORMALIZATION
        // If the value comes from Deriv (explicitPayout) or History, it's a multiplier (e.g., 1.85).
        // If it's a multiplier (> 1.0), we MUST subtract 1 to get the net profit rate (0.85).
        // EXCEPT if it was explicitly configured by the user (configPayout), then we respect it as a direct rate.

        const isFromUserConfig = !explicitPayout && (estimatedPayout === configPayout);

        if (!isFromUserConfig && profitRate > 1.0) {
            // Normalize multiplier to rate: 1.85 -> 0.85
            profitRate = profitRate - 1;
        }

        console.log(`[RiskManager] Calc Stake: ConfigPayout=${configPayout}, Explicit=${explicitPayout}, FinalProfitRate=${profitRate.toFixed(4)} (HistoryKey=${historyKey})`);


        // 1. RECOVERY MODE
        if (state.analysisType === 'RECUPERACAO') {
            // ✅ USER REQUEST: Check if Martingale is enabled
            if (config.martingale === false) {
                console.log('[RiskManager] Martingale Disabled -> Using Base Stake');
                return baseStake;
            }

            // ✅ RISK PROFILE: FIXO
            if (riskProfile === 'fixo') {
                console.log('[RiskManager] Risk Profile FIXO -> Using Base Stake');
                return baseStake;
            }

            // --- CONSERVADOR MODE (Martingale Parcelado) ---
            if (riskProfile === 'conservador') {
                // If installments finished but still have debt, or just starting
                if (state.recoveryInstallmentsRemaining <= 0 || state.valor_parcela <= 0) {
                    state.prejuizo_acumulado = state.totalLossAccumulated;
                    state.parcelas_total = 4;
                    state.valor_parcela = state.prejuizo_acumulado / state.parcelas_total;
                    state.recoveryInstallmentsRemaining = 4;

                    console.log('--- Martingale Parcelado (Novo Ciclo) ---');
                    console.log(`Prejuízo Acumulado: $${state.prejuizo_acumulado.toFixed(2)}`);
                    console.log(`Parcela Alvo: $${state.valor_parcela.toFixed(2)}`);
                }

                const stake = state.valor_parcela / profitRate;
                return Math.max(0.35, Math.ceil(stake * 100) / 100);
            }

            // --- STANDARD RECOVERY (MODERADO / AGRESSIVO) ---
            // Check Max Levels for Standard Recovery (Legacy logic previously used "conservador" check here, now it has its own block)
            // We can keep it or remove it. Let's keep a safety level for non-split modes.
            const maxLevels = 8; // Safety limit
            if (state.lossStreakRecovery >= maxLevels) {
                return baseStake;
            }

            const target = state.totalLossAccumulated * (1 + profitFactor);
            const stake = target / profitRate;

            console.log(`[RiskManager] Recovery Calc: Loss=$${state.totalLossAccumulated.toFixed(2)}, Rate=${(profitRate * 100).toFixed(0)}%, Margin=${(profitFactor * 100).toFixed(0)}%, Target=$${target.toFixed(2)}, Stake=$${stake.toFixed(2)}`);

            return Math.max(0.35, Math.ceil(stake * 100) / 100);
        }

        // 4. CÁLCULO DE STAKE — META (PRINCIPAL)

        // ✅ RESET APÓS RECUPERAÇÃO: Se a flag estiver ativa, ignora Soros desta vez
        if (state.skipSorosNext) {
            state.skipSorosNext = false; // Consumed
            // ❌ NÃO resetar consecutiveWins aqui! Deixa incrementar naturalmente
            return baseStake;
        }

        // ✅ SOROS LOGIC (Standard): Apply immediately after win, up to Config Level
        const sorosLevel = config.sorosLevel || 1;

        const willApplySoros = state.lastResultWin &&
            state.lastProfitPrincipal > 0 &&
            state.consecutiveWins >= 1 &&
            state.consecutiveWins <= sorosLevel;

        console.log('[RiskManager] Soros Decision:', willApplySoros);

        if (willApplySoros) {
            // Check if we just exceeded the level (should restart)
            // Actually, if wins > level, the check above (<= sorosLevel) fails, so we return base.
            // So this block only runs if we are WITHIN the sequence.

            const profit = state.lastProfitPrincipal;
            console.log(`[RiskManager] 🚀 SOROS APPLIED! Base: ${baseStake}, Profit: ${profit}, Total: ${baseStake + profit}`);
            return parseFloat((baseStake + profit).toFixed(2));
        }

        // Reset if sequence finished
        if (state.consecutiveWins > sorosLevel) {
            console.log(`[RiskManager] Soros Level ${sorosLevel} reached. Resetting to base stake.`);
            state.consecutiveWins = 0; // ✅ RESET Counter to start new cycle
            return baseStake;
        }

        // Default Fallback
        return baseStake;
    },

    processTradeResult(state, win, profit, stakeUsed, tradeMode = 'PRINCIPAL', config = {}) {
        const recoveryThreshold = config.lossesToActivate || 1;
        const riskProfile = (config.riskProfile || 'moderado').toLowerCase();

        console.log(`[RiskManager] Process Result: ${win ? 'WIN' : 'LOSS'} | Mode: ${tradeMode} | Pnl: ${profit} | AccumLoss(Before): ${state.totalLossAccumulated}`);

        state.lastProfit = profit;
        state.lastStake = stakeUsed;
        state.lastResultWin = win;

        if (win) {
            const currentPayout = (profit + stakeUsed) / stakeUsed;

            if (tradeMode === 'RECUPERACAO') {
                state.lastPayoutRecovery = currentPayout;
                state.lastProfitRecovery = profit;
                state.lastStakeRecovery = stakeUsed;
                state.recoveredAmount += profit;
                state.lossStreakRecovery = 0;

                // --- CONSERVADOR HANDLING (Martingale Parcelado) ---
                if (riskProfile === 'conservador') {
                    state.prejuizo_acumulado -= profit; // profit here is the gain from the trade
                    state.recoveryInstallmentsRemaining--;
                    state.consecutiveLossesInRecovery = 0;

                    console.log('--- Auditoria Conservadora ---');
                    console.log(`Lucro nesta operação: $${profit.toFixed(2)}`);
                    console.log(`Prejuízo Restante: $${Math.max(0, state.prejuizo_acumulado).toFixed(2)}`);

                    if (state.prejuizo_acumulado <= 0.01) { // Floating point safety
                        console.log('Recuperação Conservadora Concluída');
                        console.log('Prejuízo Final: $0.00');
                        console.log('Ação: retornar ao modo principal');
                        this._finishRecovery(state);
                    } else {
                        // If installments finished but still in debt, it will restart in calculateNextStake
                        console.log(`Ação: continuar recuperação progressiva (Restante: $${state.prejuizo_acumulado.toFixed(2)})`);
                    }
                } else {
                    // Standard Recovery: Stop on first win
                    console.log('%c[RiskManager] ✅ RECOVERY WIN! Resetting to PRINCIPAL mode', 'background: #00ff00; color: #000; font-weight: bold; padding: 4px;');
                    this._finishRecovery(state);
                }
            } else {
                state.lastPayoutPrincipal = currentPayout;
                state.lastProfitPrincipal = parseFloat(profit);
                state.lastStakePrincipal = parseFloat(stakeUsed);
                state.consecutiveLosses = 0;
                state.totalLossAccumulated = 0;
                state.consecutiveWins++;
                state.skipSorosNext = false;
                state.negotiationMode = state.initialNegotiationMode || 'VELOZ';
                state.activeStrategy = 'PRINCIPAL';
            }
        } else {
            // LOSS
            state.consecutiveWins = 0;
            const absoluteLoss = Math.abs(parseFloat(profit));
            state.totalLossAccumulated += absoluteLoss;

            if (state.analysisType === 'RECUPERACAO') {
                state.lossStreakRecovery++;

                // --- CONSERVADOR HANDLING (Martingale Parcelado) ---
                if (riskProfile === 'conservador') {
                    state.prejuizo_acumulado += absoluteLoss;
                    state.consecutiveLossesInRecovery++;

                    // ✅ USER REQUEST: Always re-split accumulated loss by 4 on new loss
                    state.parcelas_total = 4;
                    state.recoveryInstallmentsRemaining = 4;
                    state.valor_parcela = state.prejuizo_acumulado / 4;

                    console.log('--- Auditoria Conservadora (Re-parcelamento por Loss) ---');
                    console.log(`Prejuízo Acumulado: $${state.prejuizo_acumulado.toFixed(2)}`);
                    console.log(`Nova Parcela Alvo (1/4): $${state.valor_parcela.toFixed(2)}`);

                    // ✅ USER REQUEST: Limit of 3 additional losses in recovery (total 4 in streak)
                    if (state.consecutiveLossesInRecovery >= 4) {
                        console.log('%c[RiskManager] ⚠️ Limite de derrotas na recuperação atingido (3x). Voltando ao modo ataque.', 'background: #ff0000; color: #fff; font-weight: bold; padding: 4px;');
                        this._finishRecovery(state);
                        return;
                    }

                    console.log('Ação: continuar recuperação progressiva');
                }

                const totalLosses = state.consecutiveLosses + state.lossStreakRecovery;
                const totalEstimatedLosses = 1 + state.lossStreakRecovery;

                if (totalLosses >= recoveryThreshold) {
                    state.activeStrategy = 'RECUPERACAO';
                }

                if (totalEstimatedLosses >= 4) {
                    state.negotiationMode = 'PRECISO';
                } else if (totalEstimatedLosses >= 1) { // Ensure at least NORMAL if in recovery
                    const currentMode = (state.negotiationMode || 'VELOZ').toUpperCase();
                    if (currentMode === 'VELOZ') {
                        state.negotiationMode = 'NORMAL';
                    }
                }

            } else {
                state.consecutiveLosses++;
                state.analysisType = 'RECUPERACAO';

                if (state.lastPayoutRecovery <= 1.0 && state.lastPayoutPrincipal > 1.0) {
                    state.lastPayoutRecovery = state.lastPayoutPrincipal;
                }

                state.activeStrategy = (state.consecutiveLosses >= recoveryThreshold) ? 'RECUPERACAO' : 'PRINCIPAL';

                const initialMode = (state.initialNegotiationMode || 'VELOZ').toUpperCase();

                if (state.consecutiveLosses >= 4) {
                    state.negotiationMode = 'PRECISO';
                } else if (state.consecutiveLosses >= 1) {
                    // Force NORMAL if it was VELOZ
                    if (initialMode === 'VELOZ') {
                        state.negotiationMode = 'NORMAL';
                    } else {
                        state.negotiationMode = initialMode;
                    }
                }

                state.lossStreakRecovery = 0;

                // Initialize Conservador Specifics on entry
                if (riskProfile === 'conservador') {
                    state.prejuizo_acumulado = state.totalLossAccumulated;
                    state.parcelas_total = 4;
                    state.valor_parcela = state.prejuizo_acumulado / state.parcelas_total;
                    state.recoveryInstallmentsRemaining = 4;
                    state.consecutiveLossesInRecovery = 1; // The loss that triggered recovery
                }
            }
        }
    },

    _finishRecovery(state) {
        state.analysisType = 'PRINCIPAL';
        state.activeStrategy = 'PRINCIPAL';
        state.negotiationMode = state.initialNegotiationMode || 'VELOZ';
        state.consecutiveLosses = 0;
        state.totalLossAccumulated = 0;
        state.recoveredAmount = 0;
        state.skipSorosNext = true;
        state.consecutiveWins = 0;

        // Conservador reset
        state.prejuizo_acumulado = 0;
        state.parcelas_total = 4;
        state.valor_parcela = 0;
        state.recoveryInstallmentsRemaining = 0;
        state.consecutiveLossesInRecovery = 0;
    },

    refineTradeResult(state, realProfit, stakeUsed, tradeMode = 'PRINCIPAL', config = {}) {
        const estimatedProfit = (tradeMode === 'RECUPERACAO') ? state.lastProfitRecovery : state.lastProfitPrincipal;
        const win = realProfit > 0;

        // 1. Correct the general profit tracking in state
        state.lastProfit = realProfit;

        if (tradeMode === 'RECUPERACAO') {
            const riskProfile = (config.riskProfile || 'moderado').toLowerCase();
            state.lastProfitRecovery = realProfit;
            // Deduct the estimated profit and add the real one to trackers
            state.recoveredAmount = state.recoveredAmount - (estimatedProfit || 0) + realProfit;

            if (riskProfile === 'conservador') {
                // Correct debt: debts are subtracted from, so we add back estimated and subtract real
                state.prejuizo_acumulado = state.prejuizo_acumulado + (estimatedProfit || 0) - realProfit;
            }

            // ✅ SMART RECOVERY: Only exit if NOT conservador, or if conservador finished its installments
            if (win) {
                if (riskProfile === 'conservador') {
                    // Only exit if debt is cleared
                    if (state.prejuizo_acumulado <= 0.01) {
                        this._finishRecovery(state);
                    }
                } else {
                    this._finishRecovery(state);
                }
            }
        } else {
            state.lastProfitPrincipal = realProfit;

            // ✅ CORRECTION: Check if Fast Result incorrectly triggered recovery for a PRINCIPAL win
            if (win && state.analysisType === 'RECUPERACAO' && state.consecutiveWins === 0) {
                console.log('%c[RiskManager] 🔄 CORRECTION: Official WIN received. Cancelling false Fast Result LOSS.', 'background: #0000ff; color: #fff; font-weight: bold; padding: 4px;');

                // Rollback the false loss
                state.totalLossAccumulated = Math.max(0, state.totalLossAccumulated - stakeUsed);
                state.consecutiveLosses = Math.max(0, state.consecutiveLosses - 1);

                // If no more accumulated loss, exit recovery and restore win streak
                if (state.totalLossAccumulated <= 0) {
                    this._finishRecovery(state);
                    state.consecutiveWins = 1; // It was a win after all
                }
            }
        }

        // 2. Update payout rate with official data
        if (win) {
            const currentPayout = (realProfit + stakeUsed) / stakeUsed;
            // Save to generic trackers
            if (tradeMode === 'RECUPERACAO') {
                state.lastPayoutRecovery = currentPayout;
            } else {
                state.lastPayoutPrincipal = currentPayout;
            }
        }
    },

    // Helper to update specific contract history (called from View)
    updatePayoutHistory(contractType, payoutRate) {
        if (contractType && payoutRate > 0) {
            this.payoutHistory[contractType.toUpperCase()] = payoutRate;
        }
    },

    /**
     * Survival Mode: Clamps stake to avoid significantly busting Stop Loss or Profit Target.
     * @param {number} stake - The calculated stake.
     * @param {number} currentProfit - The current session profit/loss.
     * @param {Object} config - Configuration object (stopLoss, profitTarget, etc.).
     * @param {number} estimatedPayout - The estimated payout rate (multiplier, e.g., 1.95).
     * @returns {number} - The adjusted stake.
     */
    // eslint-disable-next-line no-unused-vars
    applySurvivalMode(stake, currentProfit, config, _estimatedPayout = 0.95, blindadoState = null) {
        let adjustedStake = stake;
        const { stopLoss } = config;

        let reason = null;

        // 1. Check Stop Blindado (High Priority Protection)
        if (blindadoState && blindadoState.active) {
            const floor = blindadoState.floor;
            const maxStakeBlindado = currentProfit - floor;

            if (adjustedStake > maxStakeBlindado) {
                console.log(`[Survival] 🛡️ Clamping Stake for Stop Blindado: ${adjustedStake} -> ${maxStakeBlindado.toFixed(2)} (Floor: ${floor})`);
                adjustedStake = maxStakeBlindado;
                reason = `Stop Blindado (Piso: ${floor.toFixed(2)})`;
            }
        }

        // 2. Check Stop Loss (Standard)
        if (stopLoss > 0) {
            const limit = -(stopLoss * 1.01);

            if ((currentProfit - adjustedStake) < limit) {
                const maxStake = currentProfit - limit;
                if (maxStake < adjustedStake) {
                    console.log(`[Survival] Clamping Stake for Stop Loss: ${adjustedStake} -> ${maxStake.toFixed(2)}`);
                    adjustedStake = maxStake;
                    if (!reason) reason = `Stop Loss (Limite: ${limit.toFixed(2)})`;
                }
            }
        }

        return {
            stake: parseFloat(adjustedStake.toFixed(2)),
            originalStake: stake,
            reason: reason
        };
    }
};

export default RiskManager;
