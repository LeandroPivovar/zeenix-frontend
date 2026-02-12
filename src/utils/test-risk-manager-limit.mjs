import RiskManager from './RiskManager.js';

const config = {
    initialStake: 1.0,
    riskProfile: 'conservador',
    tradeType: 'CALL',
    expectedPayout: 0.85
};

console.log('--- STARTING LIMIT TEST (CONSERVADOR) ---');

let state = RiskManager.initSession('VELOZ', config);

// 1. Initial Loss to enter recovery
console.log('\n--- Loss 1 (Triggers Recovery) ---');
let stake1 = RiskManager.calculateNextStake(state, config);
RiskManager.processTradeResult(state, false, -stake1, stake1, 'PRINCIPAL', config);
console.log('Mode:', state.analysisType, '| Consecutive Losses in Recovery:', state.consecutiveLossesInRecovery);

// 2. 1st Loss in recovery
console.log('\n--- Loss 2 (1st Add. Loss in Recovery) ---');
let stake2 = RiskManager.calculateNextStake(state, config);
RiskManager.processTradeResult(state, false, -stake2, stake2, 'RECUPERACAO', config);
console.log('Mode:', state.analysisType, '| Consecutive Losses in Recovery:', state.consecutiveLossesInRecovery);

// 3. 2nd Loss in recovery
console.log('\n--- Loss 3 (2nd Add. Loss in Recovery) ---');
let stake3 = RiskManager.calculateNextStake(state, config);
RiskManager.processTradeResult(state, false, -stake3, stake3, 'RECUPERACAO', config);
console.log('Mode:', state.analysisType, '| Consecutive Losses in Recovery:', state.consecutiveLossesInRecovery);

// 4. 3rd Loss in recovery (Should trigger limit)
console.log('\n--- Loss 4 (3rd Add. Loss in Recovery - Should EXIT) ---');
let stake4 = RiskManager.calculateNextStake(state, config);
RiskManager.processTradeResult(state, false, -stake4, stake4, 'RECUPERACAO', config);
console.log('Mode:', state.analysisType, '| Consecutive Losses in Recovery:', state.consecutiveLossesInRecovery);

if (state.analysisType === 'PRINCIPAL') {
    console.log('\n✅ TEST PASSED: Recovery limit reached and mode reset to PRINCIPAL.');
} else {
    console.log('\n❌ TEST FAILED: Mode is still', state.analysisType);
}

console.log('--- TEST COMPLETED ---');
