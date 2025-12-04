# 🚨 Como Corrigir: "Erro ao atualizar perfil"

## ⚡ Solução Rápida (2 minutos)

### O erro acontece porque o backend não está rodando!

### Passo 1: Abrir Console do Navegador (F12)

Você verá uma mensagem como:
```
❌ Erro ao atualizar perfil: Error: Network Error
```

Isso significa que o **backend não está rodando**.

---

### Passo 2: Iniciar o Backend

```bash
# Abrir um terminal e executar:
cd backend
npm run dev
```

Aguarde até ver:
```
✅ Server running on http://localhost:3001
✅ Database connected
```

---

### Passo 3: Recarregar a Página

```bash
# No navegador:
1. Pressione F5 (recarregar)
2. Ou feche e abra novamente
```

---

### Passo 4: Tentar Novamente

```bash
1. Ir para Configurações
2. Alterar o nome
3. Clicar em "Salvar alterações"
4. Deve aparecer: ✅ "Perfil atualizado com sucesso!"
```

---

## 🎯 Verificação Rápida

### O Backend está Rodando?

```bash
# Abrir terminal e executar:
curl http://localhost:3001/api/health

# Se responder {"status":"ok"} → Backend está rodando ✅
# Se der erro "Connection refused" → Backend NÃO está rodando ❌
```

---

## 🔧 Modo Demo (Sem Backend)

Se você **não quer iniciar o backend**, o sistema funcionará em **modo demo**:

### Características do Modo Demo:
- ✅ Login funciona (demo@financeiro.com / demo123)
- ✅ Pode alterar dados
- ⚠️  Alterações ficam apenas no navegador (localStorage)
- ❌ Não salva no banco de dados
- ❌ Perde dados ao limpar cache do navegador

### Como Usar Modo Demo:

```bash
1. NÃO iniciar o backend
2. Fazer login com:
   Email: demo@financeiro.com
   Senha: demo123
3. Alterar perfil
4. Verá: "Servidor offline. Usando modo demo."
5. Depois: "Perfil atualizado localmente (modo demo)"
```

---

## 📊 Diagnóstico Automático

Execute o script de diagnóstico:

```bash
node diagnose.js
```

Ele verificará:
- ✅ Arquivos necessários
- ✅ Configuração (.env)
- ✅ Backend rodando
- ✅ Dependências instaladas

---

## 🐛 Outros Erros Possíveis

### Erro: "Sessão expirada"

**Solução**: Fazer logout e login novamente

```bash
1. Clicar em "Sair"
2. Fazer login novamente
3. Tentar atualizar perfil
```

### Erro: "Email já está em uso"

**Solução**: Usar outro email

```bash
1. Alterar para um email diferente
2. Salvar novamente
```

### Erro: "Dados inválidos"

**Solução**: Verificar campos

```bash
- Nome deve ter pelo menos 3 caracteres
- Email deve ser válido (ex: usuario@email.com)
```

---

## 📚 Documentação Completa

Para mais detalhes, consulte:

1. **TROUBLESHOOTING-PROFILE-UPDATE.md** - Diagnóstico detalhado
2. **USER-PERSISTENCE-FIX.md** - Explicação técnica da correção
3. **QUICK-TEST-GUIDE.md** - Guia rápido de teste

---

## ✅ Checklist

- [ ] Backend está rodando? (`cd backend && npm run dev`)
- [ ] Frontend está rodando? (`npm run dev`)
- [ ] Fez login após iniciar backend?
- [ ] Console (F12) mostra "🔄 Atualizando perfil via API..."?
- [ ] Aparece toast de sucesso?

Se todos os itens estão marcados, o erro está corrigido! 🎉

---

## 🆘 Ainda com Problema?

### Opção 1: Limpar Cache

```javascript
// Console do navegador (F12)
localStorage.clear()
location.reload()

// Fazer login novamente
```

### Opção 2: Verificar Logs

```bash
# Console do navegador (F12)
# Procurar por:
- "❌ Erro ao atualizar perfil"
- Detalhes do erro
- Status code (401, 409, 400, etc)

# Copiar mensagem de erro completa
```

### Opção 3: Reinstalar Dependências

```bash
# Frontend
rm -rf node_modules package-lock.json
npm install

# Backend
cd backend
rm -rf node_modules package-lock.json
npm install
cd ..

# Reiniciar ambos
```

---

## 🎉 Sucesso!

Quando funcionar, você verá:

1. ✅ Console: "🔄 Atualizando perfil via API..."
2. ✅ Console: "✅ Perfil atualizado com sucesso"
3. ✅ Toast: "Perfil atualizado com sucesso!"
4. ✅ Nome alterado no header
5. ✅ Após logout/login, nome permanece alterado

**Parabéns! A persistência está funcionando!** 🎉
