/**
 * StrategyAnalysis Utility
 * Pure logic for evaluating attack filters (Apollo, Atlas, Nexus, Orion, Titan)
 * based on tick/digit history.
 */

export const StrategyAnalysis = {
    /**
     * Main evaluate method
     * @param {Object} filter - Filter object { id, config }
     * @param {Object} data - Analysis data { tickHistory, digitHistory }
     * @returns {Object} { pass: boolean, reason: string }
     */
    evaluate(filter, data) {
        const { id, config } = filter;
        const { tickHistory, digitHistory } = data;

        // If filter has a specific target direction, we can validate it here or in the view
        // For now, checks are generic pass/fail based on the condition

        switch (id) {
            case 'digit_density':
                return this.digitDensity(config, digitHistory);
            case 'digit_sequence':
                return this.digitSequence(config, digitHistory);
            case 'parity_majority':
                return this.parityMajority(config, digitHistory);
            case 'price_momentum':
                return this.priceMomentum(config, tickHistory);
            case 'parity_sequence':
                return this.paritySequence(config, digitHistory);
            case 'over_under_sequence':
                return this.overUnderSequence(config, digitHistory);
            case 'price_ma':
                return this.priceMA(config, tickHistory);
            case 'digit_absence':
                return this.digitAbsence(config, digitHistory);
            case 'ma_crossover':
                return this.maCrossover(config, tickHistory);
            case 'rsi':
                return this.rsi(config, tickHistory);
            default:
                return { pass: false, reason: 'Filtro desconhecido' };
        }
    },

    /**
     * Digit Density - Counts frequency of specific digits in a window.
     */
    digitDensity(config, digitHistory) {
        const { window, digits, operator, threshold } = config;
        const subHistory = digitHistory.slice(0, window);

        if (subHistory.length < window) {
            return { pass: false, reason: `Aguardando dados (${subHistory.length}/${window})` };
        }

        const targetDigits = digits.split(',').map(d => parseInt(d.trim()));
        const count = subHistory.filter(d => targetDigits.includes(d)).length;

        let pass = false;
        switch (operator) {
            case '<': pass = count < threshold; break;
            case '>': pass = count > threshold; break;
            case '=': pass = count === threshold; break;
        }

        return {
            pass,
            reason: pass
                ? `Densidade OK: Encontrado ${count} dígitos ${targetDigits.join('/')}`
                : `Densidade negada: Encontrado ${count} dígitos (Limite ${operator}${threshold})`
        };
    },

    /**
     * Digit Sequence - Checks for N consecutive digits of a group (under 4, over 5, etc).
     */
    digitSequence(config, digitHistory) {
        const { length, target } = config;
        const subHistory = digitHistory.slice(0, length);

        if (subHistory.length < length) {
            return { pass: false, reason: `Aguardando dados (${subHistory.length}/${length})` };
        }

        const checkValue = (val) => {
            switch (target) {
                case 'under_4': return val < 4;
                case 'over_5': return val > 5;
                case 'even': return val % 2 === 0;
                case 'odd': return val % 2 !== 0;
                default: return false;
            }
        };

        const allMatch = subHistory.every(checkValue);

        return {
            pass: allMatch,
            reason: allMatch
                ? `Sequência de ${length} dígitos (${target}) detectada`
                : `Sequência negada: Últimos dígitos não seguem o padrão ${target}`
        };
    },

    /**
     * Parity Majority - Evaluates if Odd/Even dominates a window with max allowed noise.
     */
    parityMajority(config, digitHistory) {
        const { window, percentage, maxNoise } = config;
        const subHistory = digitHistory.slice(0, window);

        if (subHistory.length < window) {
            return { pass: false, reason: `Aguardando dados (${subHistory.length}/${window})` };
        }

        const evens = subHistory.filter(d => d % 2 === 0).length;
        const odds = window - evens;

        const evenPerc = (evens / window) * 100;
        const oddPerc = (odds / window) * 100;

        // "Noise" is the minority side
        const noise = Math.min(evens, odds);

        if (evenPerc >= percentage && noise <= maxNoise) {
            return { pass: true, reason: `Maioria Par: ${evenPerc.toFixed(1)}% (Ruído: ${noise})` };
        }
        if (oddPerc >= percentage && noise <= maxNoise) {
            return { pass: true, reason: `Maioria Ímpar: ${oddPerc.toFixed(1)}% (Ruído: ${noise})` };
        }

        return {
            pass: false,
            reason: `Sem maioria clara: Par ${evenPerc.toFixed(1)}% / Ímpar ${oddPerc.toFixed(1)}% (Máx Ruído: ${maxNoise})`
        };
    },

    /**
     * Price Momentum - Detects strength of price movement in a window.
     */
    priceMomentum(config, tickHistory) {
        const { window, ticksToConfirm, minDelta } = config;
        const subHistory = tickHistory.slice(0, window);

        if (subHistory.length < window) {
            return { pass: false, reason: `Aguardando dados (${subHistory.length}/${window})` };
        }

        const current = subHistory[0];
        const previous = subHistory[window - 1];
        const delta = Math.abs(current - previous);

        // Simple confirmation: check if last N ticks are in same direction
        let direction = 0; // 1 up, -1 down
        let consistent = true;
        for (let i = 0; i < ticksToConfirm - 1; i++) {
            const diff = subHistory[i] - subHistory[i + 1];
            const currentDir = diff > 0 ? 1 : (diff < 0 ? -1 : 0);
            if (i === 0) direction = currentDir;
            else if (currentDir !== direction || currentDir === 0) {
                consistent = false;
                break;
            }
        }

        const pass = delta >= minDelta && consistent;

        return {
            pass,
            reason: pass
                ? `Momentum OK: Delta ${delta.toFixed(4)} (Consistência: ${ticksToConfirm} tiques)`
                : `Momentum negado: Delta ${delta.toFixed(4)} (Min ${minDelta}) ou inconsistente`
        };
    },

    // --- NEW FILTERS ---

    paritySequence(config, digitHistory) {
        const { length, parity } = config;
        const subHistory = digitHistory.slice(0, length);
        if (subHistory.length < length) return { pass: false, reason: `Aguardando dados (${subHistory.length}/${length})` };

        const isEven = parity === 'even';
        const allMatch = subHistory.every(d => (d % 2 === 0) === isEven);

        return {
            pass: allMatch,
            reason: allMatch ? `Sequência Paridade (${parity}) OK` : `Sequência Paridade falhou`
        };
    },

    overUnderSequence(config, digitHistory) {
        const { length, type, threshold } = config;
        const subHistory = digitHistory.slice(0, length);
        if (subHistory.length < length) return { pass: false, reason: `Aguardando dados (${subHistory.length}/${length})` };

        const allMatch = subHistory.every(d => type === 'over' ? d > threshold : d < threshold);
        return {
            pass: allMatch,
            reason: allMatch ? `Sequência ${type}/${threshold} OK` : `Falha no Over/Under`
        };
    },

    digitAbsence(config, digitHistory) {
        const { period, digit } = config;
        const subHistory = digitHistory.slice(0, period);
        if (subHistory.length < period) return { pass: false, reason: `Aguardando dados (${subHistory.length}/${period})` };

        const present = subHistory.includes(digit);
        return {
            pass: !present,
            reason: !present ? `Dígito ${digit} ausente por ${period} ticks (OK)` : `Dígito ${digit} encontrado recentemente`
        };
    },

    priceMA(config, tickHistory) {
        const { period, type, op } = config;
        if (tickHistory.length < period) return { pass: false, reason: `Aguardando dados MA (${tickHistory.length}/${period})` };

        const currentPrice = tickHistory[0];
        const ma = type === 'SMA' ? this.calculateSMA(tickHistory, period) : this.calculateEMA(tickHistory, period);

        let pass = false;
        if (op === '>' && currentPrice > ma) pass = true;
        if (op === '<' && currentPrice < ma) pass = true;

        return {
            pass,
            reason: pass ? `Preço ${op} MA (${ma.toFixed(4)})` : `Preço não satisfaz MA (${ma.toFixed(4)})`
        };
    },

    maCrossover(config, tickHistory) {
        const { periodShort, periodLong, type, direction } = config;
        // Need at least periodLong + 1 history to see the crossover (current and previous)
        if (tickHistory.length < periodLong + 1) return { pass: false, reason: `Aguardando dados Cross (${tickHistory.length}/${periodLong})` };

        // t0 = current, t1 = previous
        const pricesT0 = tickHistory;
        const pricesT1 = tickHistory.slice(1);

        const shortMA0 = type === 'SMA' ? this.calculateSMA(pricesT0, periodShort) : this.calculateEMA(pricesT0, periodShort);
        const longMA0 = type === 'SMA' ? this.calculateSMA(pricesT0, periodLong) : this.calculateEMA(pricesT0, periodLong);

        const shortMA1 = type === 'SMA' ? this.calculateSMA(pricesT1, periodShort) : this.calculateEMA(pricesT1, periodShort);
        const longMA1 = type === 'SMA' ? this.calculateSMA(pricesT1, periodLong) : this.calculateEMA(pricesT1, periodLong);

        let pass = false;
        if (direction === 'up') {
            // Short crosses Long from below
            if (shortMA1 <= longMA1 && shortMA0 > longMA0) pass = true;
        } else {
            // Short crosses Long from above
            if (shortMA1 >= longMA1 && shortMA0 < longMA0) pass = true;
        }

        return {
            pass,
            reason: pass ? `Cruzamento ${direction} detectado` : `Sem cruzamento`
        };
    },

    rsi(config, tickHistory) {
        const { period, level, condition } = config;
        // RSI needs more data for accuracy, but minimally period + 1
        if (tickHistory.length < period + 1) return { pass: false, reason: `Aguardando RSI (${tickHistory.length}/${period})` };

        const val = this.calculateRSI(tickHistory, period);
        let pass = false;

        if (condition === '>' && val > level) pass = true; // Overbought check usually
        if (condition === '<' && val < level) pass = true; // Oversold check usually

        return {
            pass,
            reason: pass ? `RSI ${val.toFixed(2)} ${condition} ${level}` : `RSI ${val.toFixed(2)} fora da zona`
        };
    },

    // --- INDICATOR HELPERS ---

    calculateSMA(data, period) {
        const slice = data.slice(0, period);
        const sum = slice.reduce((a, b) => a + b, 0);
        return sum / period;
    },

    calculateEMA(data, period) {
        const slice = data.slice(0, period * 2); // Get enough data for EMA stability
        // Simple implementation: reverse to calculate from past to present
        const reversed = [...slice].reverse();
        const k = 2 / (period + 1);

        let ema = reversed[0];
        for (let i = 1; i < reversed.length; i++) {
            ema = (reversed[i] * k) + (ema * (1 - k));
        }
        return ema;
    },

    calculateRSI(data, period) {
        // Need decent history. 
        const changes = [];
        // Iterate backwards from current (index 0) to get price changes
        for (let i = 0; i < data.length - 1; i++) {
            // change[0] is (P_current - P_previous) = data[i] - data[i+1]
            changes.push(data[i] - data[i + 1]);
        }

        // We need 'period' amount of changes to calc initial RSI step, 
        // but typically RSI is smoothed over time. 
        // For simplicity in this context, we'll calculate basic RSI on the last 'period' changes.
        // A better generic lib would handle smoothing better.

        if (changes.length < period) return 50;

        // Use the most recent 'period' changes (which are at the start of the 'changes' array because data is reversed 0=newest)
        const relevantChanges = changes.slice(0, period);

        let gains = 0;
        let losses = 0;

        relevantChanges.forEach(chg => {
            if (chg > 0) gains += chg;
            if (chg < 0) losses += Math.abs(chg);
        });

        const avgGain = gains / period;
        const avgLoss = losses / period;

        if (avgLoss === 0) return 100;

        const rs = avgGain / avgLoss;
        return 100 - (100 / (1 + rs));
    }
};
