# ✅ Planos Dinâmicos do Banco de Dados

## 🎯 **O que Foi Implementado:**

A tela de **Planos** (`PlansView.vue`) agora busca os planos **dinamicamente do banco de dados** ao invés de usar dados hardcoded.

---

## 📊 **Fluxo de Funcionamento:**

### **1️⃣ Banco de Dados**
```sql
-- Tabela: plans
SELECT * FROM plans WHERE is_active = 1 ORDER BY display_order;
```

**Campos importantes:**
- `id`: ID do plano
- `name`: Nome do plano (ex: "Plano Starter", "Plano Pro")
- `slug`: Identificador único (ex: "starter", "pro", "black")
- `price`: Preço do plano
- `currency`: Moeda (BRL, USD)
- `billing_period`: Período de cobrança (month, year)
- `features`: JSON com recursos do plano
- `is_popular`: Plano mais popular? (mostra badge)
- `is_recommended`: Plano recomendado? (mostra badge)
- `is_active`: Plano ativo?
- `display_order`: Ordem de exibição

### **2️⃣ API Backend**
```
GET /api/plans
```

**Response:**
```json
[
  {
    "id": "plan-starter",
    "name": "Plano Starter",
    "slug": "starter",
    "price": 0,
    "currency": "BRL",
    "billingPeriod": "month",
    "features": {
      "orion_ai": "limitada",
      "signals_per_day": 10,
      "copy_trading": false,
      "academy": "limitada",
      "support": "email"
    },
    "isPopular": false,
    "isRecommended": false,
    "isActive": true,
    "displayOrder": 1
  },
  ...
]
```

### **3️⃣ Frontend (PlansView.vue)**
```javascript
async fetchPlansFromAPI() {
  const response = await fetch(`${apiBase}/plans`);
  const plans = await response.json();
  this.plans = plans
    .filter(plan => plan.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}
```

**Renderização Dinâmica:**
```vue
<div v-for="plan in plans" :key="plan.id" class="plan-card">
  <!-- Badge Popular -->
  <div v-if="plan.isPopular" class="plan-badge-popular">
    <span>MAIS POPULAR</span>
  </div>
  
  <!-- Título e Preço -->
  <h3>{{ plan.name }}</h3>
  <span>{{ plan.price === 0 ? 'Gratuito' : `R$ ${plan.price}` }}</span>
  
  <!-- Features -->
  <ul>
    <li v-for="(value, key) in plan.features" :key="key">
      <i :class="value ? 'fa-check' : 'fa-times'"></i>
      {{ formatFeature(key, value) }}
    </li>
  </ul>
</div>
```

---

## 🔧 **Mudanças Aplicadas:**

### **1. Método `fetchPlansFromAPI()`**
- Busca planos da API `/plans`
- Filtra apenas planos ativos (`is_active = true`)
- Ordena por `display_order`
- Trata erros gracefully

### **2. Renderização Dinâmica**
- **ANTES**: 3 cards hardcoded (Starter, Pro, Black)
- **AGORA**: `v-for` que renderiza todos os planos do banco

### **3. Método `formatFeature()`**
- Traduz nomes de features para português
- Formata valores de forma legível
- Trata diferentes tipos de valores (boolean, string, number)

### **4. Badges Dinâmicos**
- **"MAIS POPULAR"**: Se `is_popular = true`
- **"RECOMENDADO"**: Se `is_recommended = true`

### **5. Classes Dinâmicas**
- `starter-card`: Se `slug = 'starter'`
- `pro-card`: Se `slug = 'pro'`
- `black-card`: Se `slug = 'black'`

---

## 📋 **Como Gerenciar Planos (Admin):**

### **1️⃣ Acessar Gerenciamento de Planos**
```
/PlansManagement
```

### **2️⃣ Criar/Editar Plano**
- Nome do plano
- Preço
- Recursos (features)
- Marcar como "Popular" ou "Recomendado"
- Definir ordem de exibição
- Ativar/Desativar plano

### **3️⃣ Plano Aparece Automaticamente**
Ao salvar no admin, o plano aparece automaticamente na tela de planos para usuários!

---

## 🧪 **Testar:**

### **1️⃣ Verificar Planos no Banco**
```bash
mysql -u root -p zeenix -e "
SELECT 
    id, 
    name, 
    slug, 
    price, 
    is_active, 
    is_popular, 
    is_recommended,
    display_order
FROM plans 
ORDER BY display_order;
"
```

### **2️⃣ Testar API**
```bash
curl https://taxafacil.site/api/plans | jq
```

### **3️⃣ Testar Frontend**
1. Acesse `/plans`
2. Deve carregar os planos do banco
3. Se houver erro, mostra mensagem de erro
4. Enquanto carrega, mostra "Carregando planos..."

---

## 🎨 **Features Suportadas:**

### **Formato do JSON `features`:**
```json
{
  "orion_ai": "limitada" | "completa" | "black_module",
  "signals_per_day": 10 | "ilimitado",
  "copy_trading": true | false | "premium",
  "academy": "limitada" | "completa" | "black_edition",
  "support": "email" | "prioritario" | "1on1",
  "dashboards": true | false
}
```

### **Tradução Automática:**
- `orion_ai` → "IA Orion"
- `signals_per_day` → "Sinais por dia"
- `copy_trading` → "Copy Trading"
- `academy` → "Zenix Academy"
- `support` → "Suporte"
- `dashboards` → "Dashboards personalizados"

---

## ✅ **Vantagens:**

1. ✅ **Flexibilidade**: Admin pode criar quantos planos quiser
2. ✅ **Sem Deploy**: Mudanças no banco aparecem instantaneamente
3. ✅ **Fácil Manutenção**: Não precisa mexer no código para mudar planos
4. ✅ **Escalável**: Suporta qualquer número de planos
5. ✅ **Features Dinâmicas**: Pode adicionar novos recursos facilmente

---

## 📊 **Exemplo de Uso:**

### **Criar Novo Plano "Enterprise":**
```sql
INSERT INTO plans (id, name, slug, price, currency, billing_period, features, is_popular, is_recommended, is_active, display_order)
VALUES (
  UUID(),
  'Plano Enterprise',
  'enterprise',
  297.00,
  'BRL',
  'month',
  JSON_OBJECT(
    'orion_ai', 'enterprise',
    'signals_per_day', 'ilimitado',
    'copy_trading', 'enterprise',
    'academy', 'enterprise',
    'support', 'dedicado',
    'dashboards', true,
    'api_access', true
  ),
  0,  -- is_popular
  1,  -- is_recommended
  1,  -- is_active
  4   -- display_order
);
```

**Resultado:** Plano "Enterprise" aparece automaticamente na tela de planos! 🎉

---

## 🎉 **Pronto!**

A tela de planos agora está 100% dinâmica e integrada com o banco de dados.

**Para testar:** Acesse `/plans` e veja os planos carregando do banco! 🚀✨

