# Configuração da TradingView Charting Library

## Instruções para Implementar

O gráfico de IA ativa na rota `StatsIAs` agora está configurado para usar a TradingView Charting Library. Para que funcione completamente, siga os passos abaixo:

### 1. Obter os Arquivos da TradingView

A TradingView Charting Library é um repositório privado. Você precisa:

1. Solicitar acesso ao repositório: https://www.tradingview.com/charting-library/
2. Fazer download dos arquivos necessários:
   - `charting_library/` - Pasta completa da biblioteca
   - `datafeeds/udf/dist/bundle.js` - Datafeed UDF

### 2. Estrutura de Pastas

Coloque os arquivos na seguinte estrutura:

```
zeenix-frontend/
├── public/
│   ├── charting_library/
│   │   ├── charting_library.standalone.js
│   │   └── ... (todos os arquivos da biblioteca)
│   └── datafeeds/
│       └── udf/
│           └── dist/
│               └── bundle.js
```

### 3. Habilitar os Scripts no index.html

Descomente as linhas no arquivo `public/index.html`:

```html
<!-- TradingView Charting Library -->
<script src="<%= BASE_URL %>charting_library/charting_library.standalone.js"></script>
<script src="<%= BASE_URL %>datafeeds/udf/dist/bundle.js"></script>
```

### 4. Configurar Endpoint da API para TradingView

O gráfico espera que a API tenha um endpoint compatível com UDF (Unified Data Feed). Você precisará criar um endpoint que retorne dados no formato esperado pela TradingView.

**Exemplo de endpoint necessário:**
- `GET /api/ai/tradingview/config` - Configuração do símbolo
- `GET /api/ai/tradingview/symbols?symbol=R_10` - Informações do símbolo
- `GET /api/ai/tradingview/history?symbol=R_10&resolution=5&from=<timestamp>&to=<timestamp>` - Histórico de velas
- `GET /api/ai/tradingview/time` - Timestamp do servidor

### 5. Fallback Automático

Se a TradingView Charting Library não estiver disponível, o sistema automaticamente usará `lightweight-charts` como fallback, mantendo a funcionalidade básica.

### 6. Personalização

As cores e configurações do gráfico TradingView estão definidas no método `initMarketChartActive()` seguindo a documentação fornecida:

- **Fundo**: `#131722`
- **Grade**: `#363c4e`
- **Velas de Alta**: `#00a65a` (verde)
- **Velas de Baixa**: `#ff3a3a` (vermelho)
- **Texto**: `#a9b2b8`

### Notas Importantes

- A TradingView Charting Library requer uma licença para uso comercial
- O datafeed customizado precisa ser configurado para conectar com a sua API de ticks
- O fallback para `lightweight-charts` garante que o gráfico funcione mesmo sem a TradingView

