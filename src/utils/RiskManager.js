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

    calculateNextStake(state, config) {
        const baseStake = config.initialStake || 0.35;
        const riskProfile = config.riskProfile || 'moderado';
        // Normalize contract type to avoid mismatches
        const tradeType = (config.tradeType || 'CALL').toUpperCase();

        // Profit Margin Factor based on Risk Profile
        let profitFactor = 0.15; // Moderado
        if (riskProfile === 'conservador') profitFactor = 0.02;
        else if (riskProfile === 'agressivo') profitFactor = 0.30;

        // Determine best payout estimate
        // 1. Check history for this specific contract type
        // 2. Check defaults
        // 3. Fallback to 0.95 (standard rise/fall)
        const estimatedPayout = this.payoutHistory[tradeType] || this.payoutDefaults[tradeType] || 0.95;

        // 1. RECOVERY MODE
        if (state.analysisType === 'RECUPERACAO') {
            // Check Max Levels for Conservador
            const maxLevels = (riskProfile === 'conservador') ? 5 : null;
            if (maxLevels && state.lossStreakRecovery >= maxLevels) {
                return baseStake;
            }

            // Calculate Stake to recover ALL losses + profit margin
            const lossToRecover = state.totalLossAccumulated - state.recoveredAmount;

            // Formula: Stake = Target / Payout
            // Target = TotalLoss + (TotalLoss * ProfitMargin) -> Simple aggressive recovery
            // Or better: Stake * Payout = TotalLoss + (Stake + TotalLoss) * Margin? 
            // Standard Martingale: Stake = Loss / Payout. (Breakeven).
            // With Profit: Stake = (Loss * (1 + margin)) / Payout.

            const stake = (lossToRecover * (1 + profitFactor)) / estimatedPayout;

            // Safety: Min stake 0.35, Round up to 2 decimals
            return Math.max(0.35, Math.ceil(stake * 100) / 100);
        }

        // 2. PRINCIPAL MODE (Standard)
        const sorosLevel = config.sorosLevel || 1;
        const cyclePosition = state.consecutiveWins % (sorosLevel + 1);

        // B. SOROS TRADES
        if (state.lastResultWin && state.lastProfitPrincipal > 0 && cyclePosition > 0 && !state.skipSorosNext) {
            return Math.max(0.35, parseFloat((state.lastStakePrincipal + state.lastProfitPrincipal).toFixed(2)));
        }

        // C. DEFAULT
        return baseStake;
    },

    processTradeResult(state, win, profit, stakeUsed, tradeMode = 'PRINCIPAL', recoveryThreshold = 1) {
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
                state.skipSorosNext = true;

                // Reset to initial mode after any win
                state.analysisType = 'PRINCIPAL';
                state.negotiationMode = 'VELOZ';
                state.consecutiveLosses = 0;
                state.totalLossAccumulated = 0;
                state.recoveredAmount = 0;
            } else {
                state.lastPayoutPrincipal = currentPayout;
                state.lastProfitPrincipal = profit;
                state.lastStakePrincipal = stakeUsed;
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
            const absoluteLoss = Math.abs(profit);
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
    }
};
