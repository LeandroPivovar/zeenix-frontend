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
    calculateNextStake(state, config) {
        const baseStake = config.initialStake || 0.35;
        const riskProfile = config.riskProfile || 'moderado';
        const tradeType = config.tradeType || 'CALL';

        // Profit Margin Factor based on Risk Profile
        let profitFactor = 0.15; // Moderado
        if (riskProfile === 'conservador') profitFactor = 0.02;
        else if (riskProfile === 'agressivo') profitFactor = 0.30;

        // Determine which payout tracker to use based on mode
        const isRecovery = state.analysisType === 'RECUPERACAO';
        const lastPayout = isRecovery ? state.lastPayoutRecovery : state.lastPayoutPrincipal;

        // Use last tracked payout, or fallback to default for this contract type
        const payout = lastPayout || this.payoutDefaults[tradeType] || 0.95;

        // 1. RECOVERY MODE
        if (isRecovery) {
            const lossToRecover = state.totalLossAccumulated - state.recoveredAmount;
            const stake = (lossToRecover * (1 + profitFactor)) / payout;
            // Use ceil to ensure 100% coverage even with rounding
            return Math.max(0.35, Math.ceil(stake * 100) / 100);
        }

        // 2. PRINCIPAL MODE (Standard)
        const sorosLevel = config.sorosLevel || 1;

        // Cycle Logic:
        const cyclePosition = state.consecutiveWins % (sorosLevel + 1);

        // B. SOROS TRADES (Compounding)
        if (state.lastResultWin && state.lastProfitPrincipal > 0 && cyclePosition > 0 && !state.skipSorosNext) {
            return Math.max(0.35, parseFloat((state.lastStakePrincipal + state.lastProfitPrincipal).toFixed(2)));
        }

        // C. DEFAULT: Base Stake (Start of Cycle)
        return baseStake;
    },

    processTradeResult(state, win, profit, stakeUsed, tradeMode = 'PRINCIPAL') {
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

                // Immediate Transition to Recovery (Martingale Active)
                state.analysisType = 'RECUPERACAO';
                state.negotiationMode = 'VELOZ'; // Starts in VELOZ even in recovery until 2nd loss

                state.recoveredAmount = 0;
                state.lossStreakRecovery = 0;
            }
        }
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
            state.analysisType = 'PRINCIPAL';
            state.consecutiveLosses = 0;
            state.totalLossAccumulated = 0;
            state.recoveredAmount = 0;
        } else {
            state.lastProfitPrincipal = realProfit;
        }

        // 2. Update payout rate with official data
        if (win) {
            const currentPayout = realProfit / stakeUsed;
            if (tradeMode === 'RECUPERACAO') {
                state.lastPayoutRecovery = currentPayout;
            } else {
                state.lastPayoutPrincipal = currentPayout;
            }
        }
    }
};
