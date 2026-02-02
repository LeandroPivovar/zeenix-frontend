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
     * @param {String} mode - Negotiation Mode ('VELOZ', 'MODERADO', 'PRECISO')
     * @returns {Object} { pass: boolean, reason: string }
     */
    evaluate(filter, data, mode = 'VELOZ') {
        const { id, config } = filter;
        const { tickHistory, digitHistory } = data;

        // Select correct config based on Mode (Veloz, Normal, Preciso)
        let activeConfig = config;

        // Normalize Mode String
        let modeKey = 'veloz';
        if (typeof mode === 'string') {
            modeKey = mode.toLowerCase();
        } else if (mode && typeof mode.toString === 'function') {
            modeKey = mode.toString().toLowerCase();
        }

        // Map 'moderado' to 'normal' key if used in config
        let configKey = modeKey;
        if (modeKey === 'moderado') configKey = 'normal';

        // Check if config has Tripled Structure
        if (config && config.veloz && config.normal && config.preciso) {
            activeConfig = config[configKey] || config.veloz; // fallback to veloz
        }

        // If filter has a specific target direction, we can validate it here or in the view
        // For now, checks are generic pass/fail based on the condition

        switch (id) {
            case 'digit_density':
                return this.digitDensity(activeConfig, digitHistory);
            case 'digit_sequence':
                return this.digitSequence(activeConfig, digitHistory);
            case 'parity_majority':
                return this.parityMajority(activeConfig, digitHistory);
            case 'price_momentum':
                return this.priceMomentum(activeConfig, tickHistory);
            case 'parity_sequence':
                return this.paritySequence(activeConfig, digitHistory);
            case 'over_under_sequence':
                return this.overUnderSequence(activeConfig, digitHistory);
            case 'price_ma':
                return this.priceMA(activeConfig, tickHistory);
            case 'digit_absence':
                return this.digitAbsence(activeConfig, digitHistory);
            case 'ma_crossover':
                return this.maCrossover(activeConfig, tickHistory);
            case 'rsi':
                return this.rsi(activeConfig, tickHistory);
            case 'digit_equal_sequence':
                return this.digitEqualSequence(activeConfig, digitHistory);
            case 'digit_diff_sequence':
                return this.digitDiffSequence(activeConfig, digitHistory);
            case 'parity_alternation':
                return this.parityAlternation(activeConfig, digitHistory);
            case 'digit_frequency':
                return this.digitFrequency(activeConfig, digitHistory);
            case 'digit_average':
                return this.digitAverage(activeConfig, digitHistory);
            case 'digit_position_return':
                return this.digitPositionReturn(activeConfig, digitHistory);
            case 'ma_slope':
                return this.maSlope(activeConfig, tickHistory);
            case 'macd':
                return this.macd(activeConfig, tickHistory);
            case 'stochastic':
                return this.stochastic(activeConfig, tickHistory);
            case 'bollinger_bands':
                return this.bollingerBands(activeConfig, tickHistory);
            case 'bb_width':
                return this.bbWidth(activeConfig, tickHistory);
            case 'price_action':
                return this.priceAction(activeConfig, tickHistory);
            case 'spike_detect':
                return this.spikeDetect(activeConfig, tickHistory);
            case 'step_pattern':
                return this.stepPattern(activeConfig, tickHistory);
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
    },

    // --- NEW PHASE 3 FILTERS (DIGITS) ---

    digitEqualSequence(config, digitHistory) {
        const { length, digit } = config;
        const subHistory = digitHistory.slice(0, length);
        if (subHistory.length < length) return { pass: false, reason: `Aguardando dados` };

        const allMatch = subHistory.every(d => d === digit);
        return { pass: allMatch, reason: allMatch ? `Sequência de ${length} dígitos ${digit} OK` : `Falha Sequência Igual` };
    },

    digitDiffSequence(config, digitHistory) {
        const { length } = config;
        const subHistory = digitHistory.slice(0, length);
        if (subHistory.length < length) return { pass: false, reason: `Aguardando dados` };

        const unique = new Set(subHistory);
        const pass = unique.size === length;
        return { pass, reason: pass ? `Todos os ${length} dígitos diferentes` : `Dígitos repetidos encontrados` };
    },

    parityAlternation(config, digitHistory) {
        const { length } = config;
        const subHistory = digitHistory.slice(0, length);
        if (subHistory.length < length) return { pass: false, reason: `Aguardando dados` };

        let pass = true;
        for (let i = 0; i < length - 1; i++) {
            const curr = subHistory[i] % 2;
            const next = subHistory[i + 1] % 2;
            if (curr === next) {
                pass = false;
                break;
            }
        }
        return { pass, reason: pass ? `Alternância de Paridade OK` : `Falha na Alternância` };
    },

    digitFrequency(config, digitHistory) {
        const { digit, period, op, count } = config;
        const subHistory = digitHistory.slice(0, period);
        if (subHistory.length < period) return { pass: false, reason: `Aguardando dados` };

        const found = subHistory.filter(d => d === digit).length;
        let pass = false;
        if (op === '>=' && found >= count) pass = true;
        else if (op === '<=' && found <= count) pass = true;
        else if (op === '==' && found === count) pass = true;

        return { pass, reason: pass ? `Freq. Dígito ${digit}: ${found} ${op} ${count}` : `Freq. Falhou: ${found}` };
    },

    digitAverage(config, digitHistory) {
        const { period, op, threshold } = config;
        const subHistory = digitHistory.slice(0, period);
        if (subHistory.length < period) return { pass: false, reason: `Aguardando dados` };

        const avg = subHistory.reduce((a, b) => a + b, 0) / period;
        let pass = false;
        if (op === '>' && avg > threshold) pass = true;
        else if (op === '<' && avg < threshold) pass = true;

        return { pass, reason: pass ? `Média Dígitos ${avg.toFixed(1)} ${op} ${threshold}` : `Média Falhou (${avg.toFixed(1)})` };
    },

    digitPositionReturn(config, digitHistory) {
        const { period } = config;
        if (digitHistory.length <= period) return { pass: false, reason: `Aguardando dados` };

        const current = digitHistory[0];
        const past = digitHistory[period];
        const pass = current === past;

        return { pass, reason: pass ? `Dígito retornou: ${current} == ${past}` : `Dígito não retornou` };
    },

    // --- NEW PHASE 3 FILTERS (INDICATORS) ---

    maSlope(config, tickHistory) {
        const { period, lookback, direction } = config;
        // Need history for at least period + lookback
        if (tickHistory.length < period + lookback) return { pass: false, reason: `Aguardando dados Slope` };

        // We use SMA for slope check by default
        const smaCurrent = this.calculateSMA(tickHistory, period);
        const smaPast = this.calculateSMA(tickHistory.slice(lookback), period);

        let pass = false;
        if (direction === 'up' && smaCurrent > smaPast) pass = true;
        else if (direction === 'down' && smaCurrent < smaPast) pass = true;

        return { pass, reason: pass ? `Inclinação MA ${direction} detectada` : `Inclinação Falhou` };
    },

    macd(config, tickHistory) {
        const { fast, slow, signal, condition } = config;
        if (tickHistory.length < slow + signal + 1) return { pass: false, reason: `Aguardando dados MACD` };

        const res = this.calculateMACD(tickHistory, fast, slow, signal);
        const { macdLine, signalLine, macdPrev, signalPrev } = res;

        let pass = false;
        switch (condition) {
            case 'cross_up': pass = macdPrev <= signalPrev && macdLine > signalLine; break;
            case 'cross_down': pass = macdPrev >= signalPrev && macdLine < signalLine; break;
            case 'above_signal': pass = macdLine > signalLine; break;
            case 'below_signal': pass = macdLine < signalLine; break;
        }
        return { pass, reason: pass ? `MACD ${condition} OK` : `MACD Condition Fail` };
    },

    stochastic(config, tickHistory) {
        const { k, d, smooth, condition, level } = config;
        // Simplification: Standard Stoch calc needs high/low over period.
        if (tickHistory.length < k + d + smooth) return { pass: false, reason: `Aguardando dados Stoch` };

        const res = this.calculateStochastic(tickHistory, k, d, smooth);
        const { kLine, dLine, kPrev, dPrev } = res;

        let pass = false;
        switch (condition) {
            case 'oversold': pass = kLine < level; break;
            case 'overbought': pass = kLine > level; break;
            case 'cross_up': pass = kPrev <= dPrev && kLine > dLine; break;
            case 'cross_down': pass = kPrev >= dPrev && kLine < dLine; break;
        }
        return { pass, reason: pass ? `Stoch ${condition} (${kLine.toFixed(1)})` : `Stoch Fail (${kLine.toFixed(1)})` };
    },

    bollingerBands(config, tickHistory) {
        const { period, stdDev, condition } = config;
        if (tickHistory.length < period + 1) return { pass: false, reason: `Aguardando dados BB` };

        const current = tickHistory[0];
        const prev = tickHistory[1];
        const bb = this.calculateBB(tickHistory, period, stdDev);

        let pass = false;
        // Logic for cross. Note: BB array calculated on current tick history.
        // To strictly check cross, we need BB for previous tick too. 
        // Approximate: assume BB levels don't change drastically in 1 tick relative to price jump.
        // Or calculate previous BB.
        const bbPrev = this.calculateBB(tickHistory.slice(1), period, stdDev);

        if (condition === 'cross_lower') {
            // Crosses lower band from above
            pass = prev >= bbPrev.lower && current <= bb.lower;
        }
        else if (condition === 'cross_upper') {
            // Crosses upper band from below
            pass = prev <= bbPrev.upper && current >= bb.upper;
        }

        return { pass, reason: pass ? `BB ${condition} OK` : `BB Fail` };
    },

    bbWidth(config, tickHistory) {
        const { period, stdDev, lookback, direction } = config;
        if (tickHistory.length < period + lookback) return { pass: false, reason: `Aguardando dados BB Width` };

        const bbCurr = this.calculateBB(tickHistory, period, stdDev);
        const bbPast = this.calculateBB(tickHistory.slice(lookback), period, stdDev);

        const widthCurr = bbCurr.upper - bbCurr.lower;
        const widthPast = bbPast.upper - bbPast.lower;

        let pass = false;
        if (direction === 'increasing' && widthCurr > widthPast) pass = true;
        else if (direction === 'decreasing' && widthCurr < widthPast) pass = true;

        return { pass, reason: pass ? `BB Width ${direction} OK` : `BB Width Fail` };
    },

    priceAction(config, tickHistory) {
        const { length, direction } = config;
        const subHistory = tickHistory.slice(0, length + 1);
        if (subHistory.length < length + 1) return { pass: false, reason: `Aguardando dados PA` };

        let pass = true;
        // Check moves between i and i+1. (i is newer)
        for (let i = 0; i < length; i++) {
            const newer = subHistory[i];
            const older = subHistory[i + 1];
            if (direction === 'rise') {
                if (newer <= older) pass = false;
            } else {
                if (newer >= older) pass = false;
            }
        }
        return { pass, reason: pass ? `PA Sequence ${direction} OK` : `PA Sequence Fail` };
    },

    // --- NEW PHASE 3 FILTERS (SPECIFIC) ---

    spikeDetect(config, tickHistory) {
        const { multiplier, window } = config;
        // Check if last tick is X times larger than average volatility
        if (tickHistory.length < window + 1) return { pass: false, reason: `Wait Data` };

        const currentDelta = Math.abs(tickHistory[0] - tickHistory[1]);

        // Calc average delta of previous window
        let sumDelta = 0;
        for (let i = 1; i <= window; i++) {
            sumDelta += Math.abs(tickHistory[i] - tickHistory[i + 1]);
        }
        const avgDelta = sumDelta / window;

        const pass = currentDelta > (avgDelta * multiplier);
        return { pass, reason: pass ? `Spike Detected (${currentDelta.toFixed(3)} > ${multiplier}x avg)` : `No Spike` };
    },

    stepPattern(config, tickHistory) {
        const { rangeTicks, jumpThreshold } = config;
        // Detect flatness for rangeTicks, then large move
        if (tickHistory.length < rangeTicks + 2) return { pass: false, reason: `Wait Data` };

        const currentJump = Math.abs(tickHistory[0] - tickHistory[1]);
        if (currentJump < jumpThreshold) return { pass: false, reason: `No Jump` };

        // Check flatness in previous N ticks
        const rangeSlice = tickHistory.slice(1, rangeTicks + 1);
        const max = Math.max(...rangeSlice);
        const min = Math.min(...rangeSlice);
        const range = max - min;

        // Let's enforce range < jumpThreshold / 2
        const isFlat = range < (jumpThreshold * 0.5);

        return { pass: isFlat, reason: isFlat ? `Step Pattern OK` : `Range not flat enough` };
    },

    // --- NEW INDICATOR HELPERS ---

    calculateMACD(data, fast, slow, signal) {
        // Need history of MACD line to calc Signal Line (EMA of MACD)
        const macdHistory = [];
        for (let i = 0; i < signal + 1; i++) {
            const subData = data.slice(i);
            const f = this.calculateEMA(subData, fast);
            const s = this.calculateEMA(subData, slow);
            macdHistory.push(f - s);
        }

        const signalLine = macdHistory.slice(0, signal).reduce((a, b) => a + b, 0) / signal; // using SMA as proxy for Signal EMA
        const macdPrev = macdHistory[1];
        const signalPrev = signalLine;

        return { macdLine: macdHistory[0], signalLine, macdPrev, signalPrev };
    },

    calculateStochastic(data, k, d) {
        // Fast Stochastic %K = (Current Close - Lowest Low)/(Highest High - Lowest Low) * 100
        const getK = (offset) => {
            const slice = data.slice(offset, offset + k);
            const high = Math.max(...slice);
            const low = Math.min(...slice);
            const close = slice[0];
            if (high === low) return 50;
            return ((close - low) / (high - low)) * 100;
        };

        const currentK = getK(0);
        const prevK = getK(1);

        // %D is SMA of %K over d periods.
        let sumK = 0;
        for (let i = 0; i < d; i++) sumK += getK(i);
        const dLine = sumK / d;

        // Prev D
        let sumKPrev = 0;
        for (let i = 1; i <= d; i++) sumKPrev += getK(i);
        const dPrev = sumKPrev / d;

        return { kLine: currentK, dLine, kPrev: prevK, dPrev };
    },

    calculateBB(data, period, stdDev) {
        const sma = this.calculateSMA(data, period);
        const slice = data.slice(0, period);
        const variance = slice.reduce((a, b) => a + Math.pow(b - sma, 2), 0) / period;
        const sd = Math.sqrt(variance);

        return {
            middle: sma,
            upper: sma + (sd * stdDev),
            lower: sma - (sd * stdDev)
        };
    }
};
