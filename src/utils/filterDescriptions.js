export const filterDescriptions = {
    // CATEGORIA A — ANÁLISE DE DÍGITOS
    digit_equal_sequence: {
        title: "Sequência de Dígitos Iguais",
        loftop: {
            what: "Verifica se o mesmo número se repete.",
            when: "Quando ocorre a repetição configurada.",
            result: "Libera a entrada após a sequência."
        },
        template: "A estratégia observa os últimos {length} resultados e, quando o mesmo dígito se repete {length} vezes seguidas, considera a condição válida."
    },
    digit_diff_sequence: {
        title: "Sequência de Dígitos Diferentes",
        loftop: {
            what: "Analisa se os números estão variando.",
            when: "Quando não há repetição entre os dígitos.",
            result: "Libera a entrada após a sequência."
        },
        template: "A estratégia verifica se os últimos {length} resultados foram todos diferentes entre si antes de permitir a entrada."
    },
    parity_sequence: {
        title: "Sequência de Paridade",
        loftop: {
            what: "Identifica se os números são pares ou ímpares.",
            when: "Quando ocorre uma sequência da paridade definida.",
            result: "Libera a entrada ao final da sequência."
        },
        template: "A cada {length} repetições de números {parity_translated}, a estratégia considera o padrão válido para entrada."
    },
    over_under_sequence: {
        title: "Sequência Over / Under",
        loftop: {
            what: "Compara os dígitos com um valor de referência.",
            when: "Quando os dígitos ficam acima ou abaixo do valor.",
            result: "Libera a entrada após a sequência."
        },
        template: "Quando os últimos {length} dígitos ficam {type_translated} de {threshold}, a estratégia libera a entrada."
    },
    parity_alternation: {
        title: "Alternância de Paridade",
        loftop: {
            what: "Verifica alternância entre par e ímpar.",
            when: "Quando ocorre a alternância configurada.",
            result: "Libera a entrada ao final do padrão."
        },
        template: "A estratégia identifica uma alternância entre números pares e ímpares nos últimos {length} resultados antes de entrar."
    },
    digit_frequency: {
        title: "Frequência de Dígito",
        loftop: {
            what: "Conta quantas vezes um dígito aparece.",
            when: "A frequência atende à condição definida.",
            result: "Libera a entrada se o dígito estiver raro ou frequente."
        },
        template: "A estratégia verifica se o dígito {digit} apareceu {op_translated} {count} vezes nos últimos {period} resultados."
    },
    digit_absence: {
        title: "Ausência de Dígito",
        loftop: {
            what: "Identifica quando um número não aparece.",
            when: "Quando o dígito fica ausente por um período.",
            result: "Libera a entrada após a ausência."
        },
        template: "Quando o dígito {digit} não aparece nos últimos {period} resultados, a estratégia considera a condição favorável."
    },
    digit_average: {
        title: "Média dos Últimos Dígitos",
        loftop: {
            what: "Calcula a média dos números recentes.",
            when: "Quando a média atinge a condição definida.",
            result: "Libera a entrada conforme a média."
        },
        template: "A estratégia calcula a média dos últimos {period} dígitos e libera a entrada quando o valor fica {op_translated} de {threshold}."
    },
    digit_position_return: {
        title: "Dígito Retorna à Posição",
        loftop: {
            what: "Verifica se um dígito retorna após variação.",
            when: "Quando o número reaparece após um intervalo.",
            result: "Libera a entrada no retorno."
        },
        template: "A estratégia identifica quando um dígito retorna após um período de {period} ticks sem aparecer e utiliza esse momento para a entrada."
    },

    // CATEGORIA B — ANÁLISE DE PREÇO / INDICADORES
    price_ma: {
        title: "Preço vs Média Móvel",
        loftop: {
            what: "Compara o preço atual com a média.",
            when: "Quando o preço fica acima ou abaixo da média.",
            result: "Libera a entrada conforme a posição do preço."
        },
        template: "A estratégia verifica se o preço atual está {op_translated} da média móvel ({type}) de {period} períodos antes de entrar."
    },
    ma_crossover: {
        title: "Cruzamento de Médias Móveis",
        loftop: {
            what: "Identifica quando médias se cruzam.",
            when: "Quando ocorre o cruzamento definido.",
            result: "Libera a entrada após o cruzamento."
        },
        template: "A estratégia entra quando a média móvel curta ({periodShort}) cruza a longa ({periodLong}) {direction_translated}, indicando uma possível mudança de direção."
    },
    ma_slope: {
        title: "Inclinação da Média Móvel",
        loftop: {
            what: "Analisa a direção da média.",
            when: "Quando a inclinação atinge o valor definido.",
            result: "Libera a entrada conforme a inclinação."
        },
        template: "A estratégia verifica se a média móvel de {period} períodos está apontando para {direction_translated} nos últimos {lookback} candles antes de realizar a entrada."
    },
    rsi: {
        title: "RSI (Índice de Força Relativa)",
        loftop: {
            what: "Mede força de compra ou venda.",
            when: "Quando entra em sobrecompra ou sobrevenda.",
            result: "Libera a entrada conforme o nível."
        },
        template: "A estratégia entra quando o indicador RSI ({period}) indica que o mercado está {condition_translated} {level}."
    },
    stochastic: {
        title: "Estocástico",
        loftop: {
            what: "Avalia a posição do preço no intervalo recente.",
            when: "Quando atinge níveis extremos.",
            result: "Libera a entrada ao sinal."
        },
        template: "A estratégia utiliza o estocástico para identificar momentos em que o preço pode estar prestes a mudar, baseado na condição {condition_translated} o nível {level}."
    },
    bollinger_bands: {
        title: "Bandas de Bollinger",
        loftop: {
            what: "Mede a distância do preço em relação às bandas.",
            when: "Quando o preço toca ou sai das bandas.",
            result: "Libera a entrada conforme o toque."
        },
        template: "A estratégia entra quando o preço {condition_translated} as Bandas de Bollinger (Período {period}, Desvio {stdDev})."
    },
    bb_width: {
        title: "Largura das Bandas de Bollinger",
        loftop: {
            what: "Avalia a abertura das bandas.",
            when: "Quando o mercado está mais calmo ou volátil.",
            result: "Libera a entrada conforme a volatilidade."
        },
        template: "A estratégia observa se a largura das bandas está {direction_translated} (Período {period}, Desvio {stdDev}) antes de realizar a entrada."
    },
    price_action: {
        title: "Sequência de Ticks (PA)",
        loftop: {
            what: "Analisa movimentos consecutivos do preço.",
            when: "Quando ocorre uma sequência definida.",
            result: "Libera a entrada ao final da sequência."
        },
        template: "A estratégia observa uma sequência de {length} movimentos de {direction_translated} do preço e entra quando esse padrão se repete."
    },

    // CATEGORIA C — MERCADOS ESPECÍFICOS
    spike_detect: {
        title: "Detecção de Spike",
        loftop: {
            what: "Identifica movimentos muito fortes.",
            when: "Quando ocorre um pico fora do padrão.",
            result: "Ativa lógica de entrada ou recuperação."
        },
        template: "A estratégia identifica um movimento {multiplier}x mais forte que a média nos últimos {window} ticks e usa esse evento como base para a entrada."
    },
    step_pattern: {
        title: "Padrão Step Index",
        loftop: {
            what: "Identifica o comportamento em degraus.",
            when: "Quando o padrão se repete.",
            result: "Libera a entrada conforme o padrão."
        },
        template: "A estratégia observa um comportamento no range de {rangeTicks} ticks com salto de {jumpThreshold} e entra quando esse padrão aparece novamente."
    },

    // FILTROS DAS IAs (IDs específicos usados no código)
    // TITAN
    parity_majority: {
        title: "Maioria de Paridade",
        loftop: {
            what: "Verifica qual paridade domina a janela.",
            when: "Quando a % de par ou ímpar atinge o alvo.",
            result: "Entra a favor da maioria."
        },
        template: "A estratégia analisa os últimos {window} dígitos e entra se a maioria for {parity_expected} (Mínimo {percentage}%)."
    },
    // ORION
    digit_sequence: {
        title: "Sequência de Dígitos (Orion)",
        loftop: {
            what: "Busca sequências de dígitos específicos.",
            when: "Quando a sequência alvo é atingida.",
            result: "Entra contra ou a favor da sequência."
        },
        template: "A estratégia aguarda uma sequência de {length} dígitos do grupo {target_translated}."
    },
    // NEXUS / ATLAS
    price_momentum: {
        title: "Momentum de Preço",
        loftop: {
            what: "Analisa a força e direção dos ticks.",
            when: "Quando o movimento atinge a força mínima.",
            result: "Entra na direção do movimento."
        },
        template: "A estratégia calcula o momentum dos últimos {window} ticks e entra se o delta for maior que {minDelta} (Confirmado por {ticksToConfirm} ticks)."
    },
    // APOLLO
    digit_density: {
        title: "Densidade de Dígitos",
        loftop: {
            what: "Conta a densidade de dígitos alvo.",
            when: "Quando a densidade é maior/menor que o limite.",
            result: "Entra baseado na densidade."
        },
        template: "A estratégia verifica se os dígitos {digits} aparecem {operator_translated} {threshold} vezes na janela de {window} ticks."
    }
};

export const getTranslation = (key, value) => {
    const maps = {
        parity: { even: 'Pares', odd: 'Ímpares' },
        type: { over: 'Acima', under: 'Abaixo', SMA: 'Simples', EMA: 'Exponencial' },
        op: { '>': 'maior que', '<': 'menor que', '>=': 'maior ou igual a', '<=': 'menor ou igual a', '=': 'igual a' },
        direction: { up: 'Para Cima', down: 'Para Baixo', rise: 'Alta', fall: 'Baixa', increasing: 'Aumentando', decreasing: 'Diminuindo' },
        condition: { cross_up: 'Cruzar para Cima', cross_down: 'Cruzar para Baixo', oversold: 'Abaixo de', overbought: 'Acima de', '>': 'Maior que', '<': 'Menor que' },
        target: { under_4: 'Abaixo de 4', over_5: 'Acima de 5', even: 'Pares', odd: 'Ímpares' }
    };

    if (key === 'parity_translated') return maps.parity[value] || value;
    if (key === 'type_translated') return maps.type[value] || value;
    if (key === 'op_translated') return maps.op[value] || value;
    if (key === 'direction_translated') return maps.direction[value] || value;
    if (key === 'condition_translated') return maps.condition[value] || value;
    if (key === 'target_translated') return maps.target[value] || value;
    if (key === 'operator_translated') return maps.op[value] || value;

    return value;
};
