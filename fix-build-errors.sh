#!/bin/bash

# Script para corrigir erros de build no frontend

echo "🔧 Corrigindo erros de build..."

# 1. Remover marcadores de conflito de merge do AdminView.vue
if [ -f "src/views/Admin/AdminView.vue" ]; then
    echo "📝 Removendo marcadores de conflito de AdminView.vue..."
    sed -i '/^<<<<<<< HEAD$/,/^>>>>>>> /d' src/views/Admin/AdminView.vue
    sed -i '/^=======$/d' src/views/Admin/AdminView.vue
    echo "✅ AdminView.vue corrigido"
else
    echo "⚠️  AdminView.vue não encontrado"
fi

# 2. Remover variável timeRange não utilizada do InvestmentActive.vue
if [ -f "src/components/Investments/InvestmentActive.vue" ]; then
    echo "📝 Verificando InvestmentActive.vue..."
    # Remover linha que declara timeRange mas não usa (se existir)
    sed -i '/const timeRange =/d' src/components/Investments/InvestmentActive.vue
    sed -i '/let timeRange =/d' src/components/Investments/InvestmentActive.vue
    sed -i '/var timeRange =/d' src/components/Investments/InvestmentActive.vue
    echo "✅ InvestmentActive.vue verificado"
else
    echo "⚠️  InvestmentActive.vue não encontrado"
fi

echo "✨ Correções aplicadas! Tente executar 'npm run build' novamente."


