# 🧪 Guia de Teste - Isolamento de Dados

## ⚡ Teste Rápido (5 minutos)

### Objetivo
Verificar que novos usuários começam com dashboard vazio e dados são isolados entre usuários.

---

## 📋 Teste 1: Novo Usuário Dashboard Vazio

### Passo 1: Criar Novo Usuário
```
1. Ir para: http://localhost:3000/register

2. Preencher:
   Nome: Teste Isolamento
   Email: teste.isolamento@email.com
   Senha: Teste123
   [✓] Aceitar termos

3. Clicar em "Criar Conta"

4. Aguardar redirecionamento para /login
```

### Passo 2: Fazer Login
```
1. Email: teste.isolamento@email.com
2. Senha: Teste123
3. Clicar em "Entrar"
```

### Passo 3: Verificar Dashboard
```
✅ Dashboard deve estar VAZIO:
   - Saldo: R$ 0,00
   - Receitas: R$ 0,00
   - Despesas: R$ 0,00
   - Sem transações recentes
   - Sem gráficos (ou gráficos vazios)
```

### ✅ Resultado Esperado
```
Dashboard completamente limpo para novo usuário!
```

---

## 📋 Teste 2: Isolamento Entre Usuários

### Passo 1: Usuário A - Criar Dados
```
1. Login como: demo@financeiro.com / demo123

2. Criar transação:
   - Tipo: Receita
   - Descrição: Salário Novembro
   - Valor: R$ 5.000,00
   - Categoria: Salário

3. Verificar no Dashboard:
   ✅ Saldo: R$ 5.000,00
   ✅ Transação aparece
```

### Passo 2: Trocar para Usuário B
```
1. Fazer logout (clicar em "Sair")

2. Login como: teste.isolamento@email.com / Teste123

3. Verificar Dashboard:
   ✅ Saldo: R$ 0,00
   ✅ SEM a transação "Salário Novembro"
   ✅ Dashboard vazio
```

### Passo 3: Usuário B - Criar Dados
```
1. Criar transação:
   - Tipo: Receita
   - Descrição: Freelance
   - Valor: R$ 1.500,00
   - Categoria: Freelance

2. Verificar no Dashboard:
   ✅ Saldo: R$ 1.500,00
   ✅ Apenas "Freelance" aparece
   ✅ NÃO aparece "Salário Novembro"
```

### Passo 4: Voltar para Usuário A
```
1. Fazer logout

2. Login como: demo@financeiro.com / demo123

3. Verificar Dashboard:
   ✅ Saldo: R$ 5.000,00
   ✅ Apenas "Salário Novembro" aparece
   ✅ NÃO aparece "Freelance"
```

### ✅ Resultado Esperado
```
Dados completamente isolados entre usuários!
```

---

## 📋 Teste 3: Persistência Após Logout

### Passo 1: Criar Dados
```
1. Login como: teste.isolamento@email.com / Teste123

2. Criar 3 transações:
   - Receita: R$ 1.000,00
   - Despesa: R$ 500,00
   - Despesa: R$ 200,00

3. Verificar Saldo: R$ 300,00
```

### Passo 2: Logout e Login
```
1. Fazer logout

2. Fazer login novamente

3. Verificar Dashboard:
   ✅ Saldo: R$ 300,00
   ✅ 3 transações ainda estão lá
   ✅ Dados persistiram
```

### ✅ Resultado Esperado
```
Dados persistem corretamente após logout/login!
```

---

## 🔍 Teste 4: Verificar LocalStorage

### Passo 1: Abrir DevTools
```
1. Pressionar F12

2. Ir para: Application → Local Storage → http://localhost:3000
```

### Passo 2: Login Usuário A
```
1. Login como: demo@financeiro.com

2. Verificar chaves no localStorage:
   ✅ financial-storage
   ✅ financial-storage_user_1 (ou outro ID)
```

### Passo 3: Login Usuário B
```
1. Logout

2. Login como: teste.isolamento@email.com

3. Verificar chaves no localStorage:
   ✅ financial-storage
   ✅ financial-storage_user_<novo_id>
   ✅ Chaves DIFERENTES para cada usuário
```

### ✅ Resultado Esperado
```
Cada usuário tem sua própria chave no localStorage!
```

---

## 🐛 Problemas Comuns

### Problema: "Ainda vejo dados de outro usuário"

**Solução 1**: Limpar localStorage
```javascript
// Console do navegador (F12)
localStorage.clear()
location.reload()
```

**Solução 2**: Usar modo anônimo
```
1. Abrir janela anônima (Ctrl+Shift+N)
2. Testar novamente
```

### Problema: "Dados não persistem"

**Verificar**:
```
1. Backend está rodando?
2. Console mostra erros?
3. LocalStorage está habilitado?
```

---

## ✅ Checklist de Verificação

### Novo Usuário
- [ ] Dashboard vazio ao criar conta
- [ ] Saldo R$ 0,00
- [ ] Sem transações
- [ ] Sem categorias pré-preenchidas

### Isolamento
- [ ] Usuário A não vê dados do Usuário B
- [ ] Usuário B não vê dados do Usuário A
- [ ] Cada usuário tem sua própria chave no localStorage
- [ ] Trocar de usuário limpa dados do anterior

### Persistência
- [ ] Dados persistem após logout/login
- [ ] Transações não desaparecem
- [ ] Saldo mantém correto

---

## 🎯 Resultado Final

Se todos os testes passarem:

✅ **Isolamento de dados funcionando perfeitamente!**

- Novos usuários começam com dashboard vazio
- Dados isolados entre usuários
- Persistência funciona corretamente
- LocalStorage organizado por userId

---

**🔒 Sistema de isolamento testado e aprovado!** 🎉
