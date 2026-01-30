/**
 * 🛡️ RiskManager - Standardized Risk Logic (Frontend)
 * Based on Apollo Strategy Patterns: Dynamic Payouts, 1-Level Soros, and Recovery.
 */

export const RiskManager = {
    /**
     * Calculates the next stake based on current session state and user config.
     * @param {Object} state - Current session state (sessionState)
     * @param {Object} config - Strategy configuration (form or recoveryConfig)
     * @returns {number} The calculated stake amount.
     */
    calculateNextStake(state, config) {
        const baseStake = config.initialStake || 0.35;
        const riskProfile = config.riskProfile || 'moderado';

        // Profit Margin Factor based on Risk Profile (Apollo Standard)
        let profitFactor = 0.15; // Moderado
        if (riskProfile === 'conservador') profitFactor = 0.00;
        else if (riskProfile === 'agressivo') profitFactor = 0.30;

        // Payout Rates (Defaults if not tracked yet)
        const payout = state.lastPayoutRate || 0.95;

        // 1. RECOVERY MODE (RECUPERACAO)
        if (state.analysisType === 'RECUPERACAO') {
            const lossToRecover = state.totalLossAccumulated - state.recoveredAmount;
            const stake = (lossToRecover * (1 + profitFactor)) / payout;
            return Math.max(0.35, parseFloat(stake.toFixed(2)));
        }

        // 2. PRINCIPAL MODE (Standard)

        // A. Reset after Soros Level 1
        if (state.consecutiveWins >= 2) {
            return baseStake;
        }

        // B. SOROS LEVEL 1 (Base + Profit of last win)
        if (state.lastResultWin && state.lastProfit > 0 && state.consecutiveWins === 1 && !state.skipSorosNext) {
            return Math.max(0.35, parseFloat((baseStake + state.lastProfit).toFixed(2)));
        }

        // C. DEFAULT: Base Stake
        return baseStake;
    },

    /**
     * Updates the session state after a trade finishes.
     */
    processTradeResult(state, win, profit, stakeUsed) {
        state.lastProfit = profit;
        state.lastResultWin = win;

        if (win) {
            state.lastPayoutRate = profit / stakeUsed;
            if (state.analysisType === 'RECUPERACAO') {
                state.recoveredAmount += profit;
                state.lossStreakRecovery = 0;
                state.skipSorosNext = true; // Skip Soros immediately after a recovery win

                // Check if recovery is complete
                if (state.recoveredAmount >= state.totalLossAccumulated) {
                    state.analysisType = 'PRINCIPAL';
                    state.consecutiveLosses = 0;
                    state.totalLossAccumulated = 0;
                    state.recoveredAmount = 0;
                }
            } else {
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

            // Re-check if recovery is now complete or needs more
            if (state.recoveredAmount >= state.totalLossAccumulated) {
                state.analysisType = 'PRINCIPAL';
                state.consecutiveLosses = 0;
                state.totalLossAccumulated = 0;
                state.recoveredAmount = 0;
            }
        }

        // 2. Update payout rate with official data
        if (win) {
            state.lastPayoutRate = realProfit / stakeUsed;
        }
    }
};
