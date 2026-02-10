import RiskManager from './RiskManager.js';

const config = {
    initialStake: 2.0,
    riskProfile: 'conservador',
    tradeType: 'CALL',
    expectedPayout: 0.85 // 85% net profit
};

console.log('--- STARTING RISK MANAGER TEST (CONSERVADOR) ---');

let state = RiskManager.initSession('VELOZ', config);
console.log('Initial State:', state);

// 1. Simulate 2 losses to trigger recovery
console.log('\n--- Simulation 1: Trigger Recovery (2 Losses) ---');
let stake1 = RiskManager.calculateNextStake(state, config);
console.log('Stake 1:', stake1);
RiskManager.processTradeResult(state, false, -stake1, stake1, 'PRINCIPAL', config);

let stake2 = RiskManager.calculateNextStake(state, config);
console.log('Stake 2:', stake2);
RiskManager.processTradeResult(state, false, -stake2, stake2, 'PRINCIPAL', config);

console.log('State after 2 losses:', {
    analysisType: state.analysisType,
    prejuizo_acumulado: state.prejuizo_acumulado,
    valor_parcela: state.valor_parcela,
    recoveryInstallmentsRemaining: state.recoveryInstallmentsRemaining
});

// 2. Calculate next stake in recovery
console.log('\n--- Simulation 2: First Recovery Trade (WIN) ---');
let recoveryStake1 = RiskManager.calculateNextStake(state, config);
console.log('Recovery Stake 1:', recoveryStake1);
// Suppose payout is 0.85
let profit1 = recoveryStake1 * 0.85;
RiskManager.processTradeResult(state, true, profit1, recoveryStake1, 'RECUPERACAO', config);

console.log('State after 1st Recovery Win:', {
    prejuizo_acumulado: state.prejuizo_acumulado,
    recoveryInstallmentsRemaining: state.recoveryInstallmentsRemaining,
    analysisType: state.analysisType
});

// 3. Simulate LOSS in recovery
console.log('\n--- Simulation 3: Second Recovery Trade (LOSS) ---');
let recoveryStake2 = RiskManager.calculateNextStake(state, config);
console.log('Recovery Stake 2:', recoveryStake2);
RiskManager.processTradeResult(state, false, -recoveryStake2, recoveryStake2, 'RECUPERACAO', config);

console.log('State after Recovery Loss:', {
    prejuizo_acumulado: state.prejuizo_acumulado,
    valor_parcela: state.valor_parcela,
    recoveryInstallmentsRemaining: state.recoveryInstallmentsRemaining
});

// 4. Multiple Wins to finish
console.log('\n--- Simulation 4: Completing Recovery ---');
while (state.analysisType === 'RECUPERACAO') {
    let stake = RiskManager.calculateNextStake(state, config);
    let profit = stake * 0.85;
    console.log(`Calculating stake: ${stake}, Profit: ${profit.toFixed(2)}`);
    RiskManager.processTradeResult(state, true, profit, stake, 'RECUPERACAO', config);
}

console.log('Final State:', {
    analysisType: state.analysisType,
    prejuizo_acumulado: state.prejuizo_acumulado,
    totalLossAccumulated: state.totalLossAccumulated
});

console.log('\n--- TEST COMPLETED ---');
