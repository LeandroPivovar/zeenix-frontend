# 🔍 Debug - Acesso Admin

## ✅ Correção Aplicada

Adicionado `v-if="isAdmin"` aos links de administração no sidebar.

```vue
<!-- ANTES -->
<template>  <!-- ❌ Sempre visível -->
    <div class="separator"></div>
    <a href="#" ...>Admin</a>
    ...
</template>

<!-- AGORA -->
<template v-if="isAdmin">  <!-- ✅ Apenas se for admin -->
    <div class="separator"></div>
    <a href="#" ...>Admin</a>
    ...
</template>
```

---

## 🔍 Como Verificar se Você é Admin

### **1️⃣ Abrir Console do Navegador (F12)**

### **2️⃣ Colar este código:**
```javascript
// Verificar token e role
const token = localStorage.getItem('token');
if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('📊 Token Payload:', payload);
    console.log('👤 Role:', payload.role || payload.roles || payload.userRole);
    console.log('🔐 isAdmin:', payload.isAdmin || payload.is_admin);
    
    // Verificar se é admin
    const role = payload.role || payload.roles || payload.userRole || payload.user_role;
    const isAdmin = payload.isAdmin || payload.is_admin;
    
    if (isAdmin === true || (role && role.toString().toLowerCase().includes('admin'))) {
        console.log('✅ VOCÊ É ADMIN!');
    } else {
        console.log('❌ VOCÊ NÃO É ADMIN');
        console.log('🔧 Role atual:', role);
    }
} else {
    console.log('❌ Token não encontrado');
}
```

---

## 📋 **Resultados Esperados:**

### ✅ **Se Você For Admin:**
```
📊 Token Payload: { userId: "...", role: "admin", ... }
👤 Role: "admin"
🔐 isAdmin: undefined
✅ VOCÊ É ADMIN!
```

**→ Links admin DEVEM aparecer no sidebar**

### ❌ **Se NÃO For Admin:**
```
📊 Token Payload: { userId: "...", role: "user", ... }
👤 Role: "user"
🔐 isAdmin: undefined
❌ VOCÊ NÃO É ADMIN
🔧 Role atual: user
```

**→ Links admin NÃO devem aparecer no sidebar**

---

## 🔧 **Corrigir Role no Banco de Dados**

Se você é admin mas a role não está correta no token, precisa atualizar no banco:

### **Opção 1: Via MySQL**
```bash
mysql -u root -p zeenix -e "
UPDATE users 
SET role = 'admin' 
WHERE id = 'SEU_USER_ID_AQUI';
"
```

### **Opção 2: Via Console SQL**
```sql
USE zeenix;

-- Verificar usuário
SELECT id, email, role FROM users WHERE email = 'seu-email@example.com';

-- Atualizar para admin
UPDATE users SET role = 'admin' WHERE email = 'seu-email@example.com';

-- Confirmar
SELECT id, email, role FROM users WHERE email = 'seu-email@example.com';
```

---

## 🔄 **Após Atualizar a Role:**

1. ✅ **Fazer logout**
2. ✅ **Fazer login novamente** (para gerar novo token)
3. ✅ **Verificar no console** (F12) se o token agora contém `role: "admin"`
4. ✅ **Links admin devem aparecer** no sidebar

---

## 🎯 **Checklist de Verificação:**

- [ ] ✅ Abrir console (F12)
- [ ] ✅ Executar script de debug
- [ ] ✅ Verificar se role é "admin" no token
- [ ] ✅ Se não for admin, atualizar no banco
- [ ] ✅ Fazer logout e login
- [ ] ✅ Verificar novamente no console
- [ ] ✅ Links admin devem aparecer

---

## 📊 **Estrutura do Token JWT:**

### **Token Correto (Admin):**
```json
{
  "userId": "a9e6dc41-8a6b-4077-a581-c66e64c926db",
  "email": "admin@zeenix.com",
  "role": "admin",  // ← DEVE SER "admin"
  "iat": 1733234567,
  "exp": 1733320967
}
```

### **Campos Verificados no Código:**
```javascript
payload.role        // Verificado
payload.roles       // Verificado
payload.userRole    // Verificado
payload.user_role   // Verificado
payload.isAdmin     // Verificado
payload.is_admin    // Verificado
```

---

## 🚨 **Problemas Comuns:**

### **1. Links não aparecem após atualizar role**
**Solução:** Faça logout e login novamente para gerar novo token

### **2. Token não contém role**
**Solução:** Verificar backend - JWT deve incluir `role` no payload

### **3. Role é "user" ao invés de "admin"**
**Solução:** Atualizar no banco de dados com SQL acima

### **4. Erro ao decodificar token**
**Solução:** Token inválido - fazer logout e login novamente

---

## 🎉 **Pronto!**

Após seguir estes passos, os links admin devem aparecer corretamente no sidebar! 🚀✨

**💡 Dica:** Guarde o script de debug para usar sempre que precisar verificar permissões.

