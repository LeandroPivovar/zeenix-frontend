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
        const sorosLevel = config.sorosLevel || 1; // Number of Soros steps (Compounding) after base

        // Cycle Logic:
        // Level 1: [Base, Soros] -> [0, 1]
        // Level 2: [Base, Soros1, Soros2] -> [0, 1, 2]
        const cyclePosition = state.consecutiveWins % (sorosLevel + 1);

        // B. SOROS TRADES (Compounding)
        if (state.lastResultWin && state.lastProfit > 0 && cyclePosition > 0 && !state.skipSorosNext) {
            return Math.max(0.35, parseFloat((state.lastStake + state.lastProfit).toFixed(2)));
        }

        // C. DEFAULT: Base Stake (Start of Cycle)
        return baseStake;
    },

    /**
     * Updates the session state after a trade finishes.
     */
    processTradeResult(state, win, profit, stakeUsed) {
        state.lastProfit = profit;
        state.lastResultWin = win;
        state.lastStake = stakeUsed;

        if (win) {
            const currentPayout = profit / stakeUsed;

            // Save payout to the specific tracker for this context
            if (state.analysisType === 'RECUPERACAO') {
                state.lastPayoutRecovery = currentPayout;
                state.recoveredAmount += profit;
                state.lossStreakRecovery = 0;
                state.skipSorosNext = true; // Skip Soros immediately after a recovery win

                // Single Win Recovery: Exit immediately after any win
                state.analysisType = 'PRINCIPAL';
                state.consecutiveLosses = 0;
                state.totalLossAccumulated = 0;
                state.recoveredAmount = 0;
            } else {
                state.lastPayoutPrincipal = currentPayout;
                // Main Mode Win
                state.consecutiveLosses = 0;
                state.totalLossAccumulated = 0;
                state.consecutiveWins++;
                state.skipSorosNext = false;
            }
        } else {
            // LOSS
            state.consecutiveWins = 0;
            const absoluteLoss = Math.abs(profit);
            state.totalLossAccumulated += absoluteLoss;

            if (state.analysisType === 'RECUPERACAO') {
                state.lossStreakRecovery++;
            } else {
                state.consecutiveLosses++;
                // Transition to Recovery Mode immediately after 1 loss (Standard Pattern)
                state.analysisType = 'RECUPERACAO';
                state.recoveredAmount = 0;
                state.lossStreakRecovery = 0;
            }
        }
    },

    /**
     * Refines the result of a trade that was previously processed by Fast Result.
     * Ensures financial accuracy without double-counting wins/losses.
     */
    refineTradeResult(state, realProfit, stakeUsed) {
        const estimatedProfit = state.lastProfit;
        const win = realProfit > 0;

        // 1. Correct the general profit tracking in state if needed
        // (RiskManager focuses on sessionState, so we update recoveredAmount and lastProfit)
        state.lastProfit = realProfit;

        if (state.analysisType === 'RECUPERACAO') {
            // Deduct the estimated profit and add the real one
            state.recoveredAmount = state.recoveredAmount - estimatedProfit + realProfit;

            // Single Win Recovery: Exit immediately after any win
            state.analysisType = 'PRINCIPAL';
            state.consecutiveLosses = 0;
            state.totalLossAccumulated = 0;
            state.recoveredAmount = 0;
        }

        // 2. Update payout rate with official data
        if (win) {
            const currentPayout = realProfit / stakeUsed;
            if (state.analysisType === 'RECUPERACAO') {
                state.lastPayoutRecovery = currentPayout;
            } else {
                state.lastPayoutPrincipal = currentPayout;
            }
        }
    }
};
