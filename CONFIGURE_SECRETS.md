# 🔐 Configurar Secrets - Passo a Passo

## 📍 Passo 1: Acessar Configurações

Acesse: **https://github.com/pedrokstro/FinControl/settings/secrets/actions**

Ou navegue:
1. Repositório → **Settings**
2. Sidebar → **Secrets and variables** → **Actions**

---

## 🔑 Passo 2: Gerar JWT Secret

Execute no terminal:

```bash
node scripts/generate-jwt-secret.js
```

Copie o valor gerado (será algo como):
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

---

## ➕ Passo 3: Adicionar Secrets

### Secret 1: JWT_SECRET

1. Clique em **"New repository secret"**
2. **Name:** `JWT_SECRET`
3. **Secret:** Cole o valor gerado no Passo 2
4. Clique em **"Add secret"**

### Secret 2: DATABASE_URL

1. Clique em **"New repository secret"**
2. **Name:** `DATABASE_URL`
3. **Secret:** `postgresql://seu_usuario:sua_senha@seu_host:5432/fincontrol_db`
   - Substitua `seu_usuario`, `sua_senha` e `seu_host` pelos valores reais
4. Clique em **"Add secret"**

### Secret 3: DATABASE_PASSWORD

1. Clique em **"New repository secret"**
2. **Name:** `DATABASE_PASSWORD`
3. **Secret:** Sua senha do PostgreSQL
4. Clique em **"Add secret"**

---

## 🚀 Passo 4: Secrets de Deploy (Opcional)

### Para Vercel:

1. Acesse: https://vercel.com/account/tokens
2. Crie um novo token
3. Adicione como secret:
   - **Name:** `VERCEL_TOKEN`
   - **Secret:** Token copiado

### Para Netlify:

1. Acesse: https://app.netlify.com/user/applications
2. Crie um Personal Access Token
3. Adicione como secret:
   - **Name:** `NETLIFY_AUTH_TOKEN`
   - **Secret:** Token copiado

4. No seu site Netlify, copie o Site ID
5. Adicione como secret:
   - **Name:** `NETLIFY_SITE_ID`
   - **Secret:** Site ID copiado

---

## ✅ Passo 5: Verificar Configuração

Após adicionar os secrets, você deve ver:

```
✓ JWT_SECRET
✓ DATABASE_URL
✓ DATABASE_PASSWORD
```

E opcionalmente:
```
✓ VERCEL_TOKEN (ou NETLIFY_AUTH_TOKEN)
✓ NETLIFY_SITE_ID
```

---

## 🧪 Passo 6: Testar Workflows

1. Faça um push ou crie um PR
2. Acesse: https://github.com/pedrokstro/FinControl/actions
3. Verifique se os workflows executam sem erros

---

## 📋 Checklist Final

- [ ] JWT_SECRET configurado
- [ ] DATABASE_URL configurado
- [ ] DATABASE_PASSWORD configurado
- [ ] Secrets de deploy configurados (se aplicável)
- [ ] Workflows executando com sucesso
- [ ] Release v1.8.0 criada

---

## 🆘 Problemas?

### Erro: "Secret not found"
- Verifique se o nome está exatamente como documentado (case-sensitive)
- Aguarde alguns minutos após adicionar o secret

### Erro: "Invalid DATABASE_URL"
- Formato correto: `postgresql://user:pass@host:5432/database`
- Certifique-se de não ter espaços extras

### Erro: "JWT_SECRET too short"
- Use o script `generate-jwt-secret.js` para gerar um secret válido
- Mínimo: 64 caracteres

---

## 📚 Documentação Completa

Para mais detalhes, consulte:
- `.github/SECRETS_SETUP.md` - Guia completo de secrets
- `.github/QUICK_START.md` - Setup rápido do projeto
- `.github/WORKFLOWS.md` - Documentação dos workflows

---

**Desenvolvido por PEDRO KSTRO** 🚀
