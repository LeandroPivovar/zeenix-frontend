import RiskManager from './RiskManager.js';

const config = {
    initialStake: 0.35,
    riskProfile: 'moderado', // Standard profile to test default behavior
    tradeType: 'CALL',
    expectedPayout: 0.85
};

console.log('--- STARTING NEGOTIATION MODE TEST ---');

// Case 1: Start with VELOZ
let state1 = RiskManager.initSession('VELOZ', config);
console.log('Initial Mode (Case 1):', state1.negotiationMode); // Should be VELOZ

// First Loss (Trigger Recovery)
RiskManager.processTradeResult(state1, false, -0.35, 0.35, 'PRINCIPAL', config);
console.log('Mode after 1st Loss (Recovery Entry):', state1.negotiationMode); // Should be NORMAL now

// Second Loss (Continuing Recovery)
RiskManager.processTradeResult(state1, false, -1.0, 1.0, 'RECUPERACAO', config);
console.log('Mode after 2nd Loss (In Recovery):', state1.negotiationMode); // Should stay NORMAL (or move to PRECISO if losses >= 4)

// Case 2: Start with PRECISO (stay in it)
let state2 = RiskManager.initSession('PRECISO', config);
console.log('\nInitial Mode (Case 2):', state2.negotiationMode); // Should be PRECISO
RiskManager.processTradeResult(state2, false, -0.35, 0.35, 'PRINCIPAL', config);
console.log('Mode after 1st Loss (Case 2):', state2.negotiationMode); // Should stay PRECISO

console.log('\n--- TEST COMPLETED ---');
