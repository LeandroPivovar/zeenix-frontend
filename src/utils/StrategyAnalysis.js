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
    }
};
