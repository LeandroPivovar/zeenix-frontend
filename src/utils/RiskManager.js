export const RiskManager = {
    /**
     * Default payouts per contract type for safe estimation
     */
    payoutDefaults: {
        'CALL': 0.95,
        'PUT': 0.95,
        'DIGITOVER': 0.19,  // Standard for Over 8 or similar
        'DIGITUNDER': 0.19, // Standard for Under 8 or similar
        'DIGITMATCH': 8.00,
        'DIGITDIFF': 0.09,
        'DIGITEVEN': 0.95,
        'DIGITODD': 0.95
    },

    /**
     * Calculates the next stake based on current session state and user config.
     */
    payoutHistory: {},

    initSession() {
        return {
            isRecoveryMode: false,
            isStopped: false,
            peakProfit: 0,
            stopBlindadoActive: false,
            stopBlindadoFloor: 0,

            // RiskManager Variables
            analysisType: 'PRINCIPAL',
            negotiationMode: 'VELOZ',
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
            lastContractType: null
        };
    },

    calculateNextStake(state, config, explicitPayout = null) {
        const baseStake = config.initialStake || 0.35;
        const riskProfile = config.riskProfile || 'moderado';
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

        // 1. User-Configured Expected Payout (Highest Priority)
        // 2. Explicit Override (Real-time from Proposal)
        // 3. Check history for this specific mode+contract
        // 4. Fallback to generic contract history
        // 5. System Defaults
        const configPayout = config.expectedPayout || null;
        let estimatedPayout = configPayout || explicitPayout || this.payoutHistory[historyKey] || this.payoutHistory[tradeType] || this.payoutDefaults[tradeType] || 0.95;

        // CRITICAL: Ensure payout is a MULTIPLIER (e.g., 1.26 means $1 → $1.26)
        // If user configured profit rate (0.26), convert to multiplier
        if (estimatedPayout < 1 && estimatedPayout > 0) {
            estimatedPayout = estimatedPayout + 1; // Convert 0.26 → 1.26
            console.log(`[RiskManager] Converted profit rate ${(estimatedPayout - 1).toFixed(2)} to multiplier ${estimatedPayout.toFixed(2)}x`);
        }

        // 1. RECOVERY MODE
        if (state.analysisType === 'RECUPERACAO') {
            // Check Max Levels for Conservador
            const maxLevels = (riskProfile === 'conservador') ? 5 : null;
            if (maxLevels && state.lossStreakRecovery >= maxLevels) {
                return baseStake;
            }

            // Calculate Stake to recover ALL losses + profit margin
            const lossToRecover = state.totalLossAccumulated;

            // Formula: Stake * Payout = Target
            // Target = Loss * (1 + profitMargin)
            // Stake = Target / Payout
            // With payout as multiplier (e.g., 1.26):
            //   Stake = (Loss * (1 + margin)) / 1.26
            // Example: ($1.00 * 1.15) / 1.26 = $0.91 ✅

            const stake = (lossToRecover * (1 + profitFactor)) / estimatedPayout;

            console.log(`[RiskManager] Recovery Calc: Loss=$${lossToRecover.toFixed(2)}, Payout=${estimatedPayout.toFixed(2)}x, Margin=${(profitFactor * 100).toFixed(0)}%, Stake=$${stake.toFixed(2)}`);

            // Safety: Min stake 0.35, Round up to 2 decimals
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

    processTradeResult(state, win, profit, stakeUsed, tradeMode = 'PRINCIPAL', recoveryThreshold = 1) {
        console.log(`[RiskManager] Process Result: ${win ? 'WIN' : 'LOSS'} | Mode: ${tradeMode} | Pnl: ${profit} | AccumLoss(Before): ${state.totalLossAccumulated}`);

        state.lastProfit = profit;
        state.lastStake = stakeUsed;
        state.lastResultWin = win;

        if (win) {
            const currentPayout = profit / stakeUsed;

            // Track stats specifically by trade mode to avoid pollution
            if (tradeMode === 'RECUPERACAO') {
                state.lastPayoutRecovery = currentPayout;
                state.lastProfitRecovery = profit;
                state.lastStakeRecovery = stakeUsed;
                state.recoveredAmount += profit;
                state.lossStreakRecovery = 0;
                // Don't modify consecutiveWins here, let the else block handle it or separate logic

                console.log(`[RiskManager] Recovery Progress: ${state.recoveredAmount.toFixed(2)} / ${state.totalLossAccumulated.toFixed(2)}`);

                // FORCE RESET ON FIRST WIN (User Request)
                console.log('%c[RiskManager] ✅ RECOVERY WIN! Resetting to PRINCIPAL mode', 'background: #00ff00; color: #000; font-weight: bold; padding: 4px;');
                console.log('[RiskManager] -> Before Reset:', {
                    totalLossAccumulated: state.totalLossAccumulated,
                    recoveredAmount: state.recoveredAmount,
                    analysisType: state.analysisType
                });

                state.analysisType = 'PRINCIPAL';
                state.negotiationMode = 'VELOZ';
                state.consecutiveLosses = 0;
                state.totalLossAccumulated = 0;
                state.recoveredAmount = 0;
                state.skipSorosNext = true;
                state.consecutiveWins = 0; // Reset para começar nova sequência de Soros

                console.log('[RiskManager] -> After Reset:', {
                    totalLossAccumulated: state.totalLossAccumulated,
                    recoveredAmount: state.recoveredAmount,
                    analysisType: state.analysisType
                });
            } else {
                console.log('[RiskManager] -> Principal Win Block Triggered.');
                state.lastPayoutPrincipal = currentPayout;
                state.lastProfitPrincipal = parseFloat(profit);
                state.lastStakePrincipal = parseFloat(stakeUsed);
                // Main Mode Win
                state.consecutiveLosses = 0;
                state.totalLossAccumulated = 0;
                state.consecutiveWins++;
                state.skipSorosNext = false;
                state.negotiationMode = 'VELOZ'; // Reset mode on win
                state.activeStrategy = 'PRINCIPAL';
            }
        } else {
            // LOSS
            state.consecutiveWins = 0;
            const absoluteLoss = Math.abs(parseFloat(profit));
            state.totalLossAccumulated += absoluteLoss;

            if (state.analysisType === 'RECUPERACAO') {
                state.lossStreakRecovery++;

                // Mode Switching during Recovery
                // Total Losses = 1 (Principal) + lossStreakRecovery
                const totalEstimatedLosses = 1 + state.lossStreakRecovery;

                if (totalEstimatedLosses >= 4) { // 4th loss
                    state.negotiationMode = 'PRECISO';
                } else if (totalEstimatedLosses >= 2) { // 2nd loss
                    state.negotiationMode = 'NORMAL';
                }

            } else {
                state.consecutiveLosses++;

                // 1. MARTINGALE / FINANCIAL RECOVERY
                // Always active immediately after a loss to ensure capital protection
                state.analysisType = 'RECUPERACAO';

                // CRITICAL: Sync payout estimate for the first Martingale calculation
                if (state.lastPayoutRecovery === 0.95 && state.lastPayoutPrincipal !== 0.95) {
                    state.lastPayoutRecovery = state.lastPayoutPrincipal;
                }

                // 2. STRATEGIC RECOVERY (FILTERS & CONTRACTS)
                // Only active if losses >= configured threshold
                state.activeStrategy = (state.consecutiveLosses >= recoveryThreshold) ? 'RECUPERACAO' : 'PRINCIPAL';

                // 3. NEGOTIATION MODE (VELOZ/NORMAL/PRECISO)
                // Determines analysis frequency and aggressiveness
                if (state.consecutiveLosses >= 4) {
                    state.negotiationMode = 'PRECISO';
                } else if (state.consecutiveLosses >= 2) {
                    state.negotiationMode = 'NORMAL';
                } else {
                    state.negotiationMode = 'VELOZ';
                }

                state.lossStreakRecovery = 0;
            }
        }

        // Safety Fallback: Stop Martingale if max levels exceeded (Conservador)
        // This resets the state if we just suffered a loss at max level
        /* 
           This logic is tricky in processTradeResult because we don't know the profile here easily 
           without passing it. But calculateNextStake handles the stake calculation.
           Ideally, if we hit max levels, we should reset the mode to PRINCIPAL to stop trying to recover.
           We can leave that to the caller or allow the stake to drop to baseStake (effectively accepting the loss).
        */
    },

    refineTradeResult(state, realProfit, stakeUsed, tradeMode = 'PRINCIPAL') {
        const estimatedProfit = (tradeMode === 'RECUPERACAO') ? state.lastProfitRecovery : state.lastProfitPrincipal;
        const win = realProfit > 0;

        // 1. Correct the general profit tracking in state
        state.lastProfit = realProfit;

        if (tradeMode === 'RECUPERACAO') {
            state.lastProfitRecovery = realProfit;
            // Deduct the estimated profit and add the real one
            state.recoveredAmount = state.recoveredAmount - (estimatedProfit || 0) + realProfit;

            // Single Win Recovery: Always ensure clean exit on official result
            if (win) {
                state.analysisType = 'PRINCIPAL';
                state.activeStrategy = 'PRINCIPAL';
                state.consecutiveLosses = 0;
                state.totalLossAccumulated = 0;
                state.recoveredAmount = 0;
            }
        } else {
            state.lastProfitPrincipal = realProfit;
        }

        // 2. Update payout rate with official data
        if (win) {
            const currentPayout = realProfit / stakeUsed;
            // Save to generic trackers
            if (tradeMode === 'RECUPERACAO') {
                state.lastPayoutRecovery = currentPayout;
            } else {
                state.lastPayoutPrincipal = currentPayout;
            }

            // Save to granular history if contract type is available in state (needs updates in View to pass it)
            // For now, we rely on the View passing context or we assume the last used?
            // Since we don't have contract type here easily, we can't update the specific table perfectly 
            // unless we change signature. 
            // BUT, we can make 'processTradeResult' update it? 
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
    applySurvivalMode(stake, currentProfit, config, estimatedPayout = 0.95, blindadoState = null) {
        let adjustedStake = stake;
        const { stopLoss, profitTarget } = config;

        // Payout rate (Pure profit part)
        // If estimatedPayout is multiplier (1.95), rate is 0.95.
        // If it's already rate, use as is. RiskManager uses multiplier usually.
        // Let's standardize: if > 1, subtract 1.
        const payoutRate = estimatedPayout > 1 ? estimatedPayout - 1 : estimatedPayout;

        // 1. Check Stop Blindado (High Priority Protection)
        if (blindadoState && blindadoState.active) {
            const floor = blindadoState.floor;
            // We want (currentProfit - stake) >= floor
            // Stake <= currentProfit - floor
            const maxStakeBlindado = currentProfit - floor;

            if (adjustedStake > maxStakeBlindado) {
                console.log(`[Survival] 🛡️ Clamping Stake for Stop Blindado: ${adjustedStake} -> ${maxStakeBlindado.toFixed(2)} (Floor: ${floor})`);
                adjustedStake = maxStakeBlindado;
            }
        }

        // 2. Check Stop Loss (Standard)
        // Limit: -stopLoss
        // Scenario: Loss -> PnL becomes (currentProfit - stake)
        // We want (currentProfit - stake) >= -(stopLoss * 1.01) (1% tolerance)
        if (stopLoss > 0) {
            const limit = -(stopLoss * 1.01);

            // Re-calc projected loss with current adjusted stake
            if ((currentProfit - adjustedStake) < limit) {
                // Determine max stake allowed
                // currentProfit - maxStake = limit
                // maxStake = currentProfit - limit
                const maxStake = currentProfit - limit;
                if (maxStake < adjustedStake) {
                    console.log(`[Survival] Clamping Stake for Stop Loss: ${adjustedStake} -> ${maxStake.toFixed(2)}`);
                    adjustedStake = maxStake;
                }
            }
        }

        // 3. Check Profit Target
        // Limit: profitTarget
        // Scenario: Win -> PnL becomes (currentProfit + (stake * payoutRate))
        // We want (currentProfit + (stake * payoutRate)) <= (profitTarget * 1.01)
        if (profitTarget > 0) {
            const limit = profitTarget * 1.01;
            const projectedWin = currentProfit + (adjustedStake * payoutRate);

            if (projectedWin > limit) {
                // Determine max stake allowed
                // currentProfit + (maxStake * payoutRate) = limit
                // maxStake = (limit - currentProfit) / payoutRate
                const maxStake = (limit - currentProfit) / payoutRate;
                if (maxStake < adjustedStake) {
                    console.log(`[Survival] Clamping Stake for Target: ${adjustedStake} -> ${maxStake.toFixed(2)}`);
                    adjustedStake = maxStake;
                }
            }
        }

        // Ensure we don't return negative stake. 
        // We DO NOT round up to 0.35 here if the survival math requires less.
        // We return the raw LOW value so the caller knows it's too risky.
        // Actually, let's return 2 decimal precision.
        return parseFloat(adjustedStake.toFixed(2));
    }
};
