# 🔧 Solução: Email Já Cadastrado

## Problema
Você tentou criar uma conta, mas o email já está cadastrado no banco de dados.

---

## ✅ Solução Rápida (Via DBeaver)

### Passo 1: Abrir DBeaver
1. Abra o **DBeaver**
2. Conecte ao banco **fincontrol_db**

### Passo 2: Copiar e Executar SQL

**IMPORTANTE:** Substitua `'seu-email@teste.com'` pelo email que você tentou cadastrar!

```sql
-- 1. Verificar se o usuário existe
SELECT id, name, email, "emailVerified" 
FROM users 
WHERE email = 'seu-email@teste.com';

-- 2. Se existir, deletar (COPIE TUDO ABAIXO DE UMA VEZ)
BEGIN;

-- Deletar refresh tokens
DELETE FROM refresh_tokens 
WHERE "userId" IN (SELECT id FROM users WHERE email = 'seu-email@teste.com');

-- Deletar transações
DELETE FROM transactions 
WHERE "userId" IN (SELECT id FROM users WHERE email = 'seu-email@teste.com');

-- Deletar categorias
DELETE FROM categories 
WHERE "userId" IN (SELECT id FROM users WHERE email = 'seu-email@teste.com');

-- Deletar preferências
DELETE FROM user_preferences 
WHERE "userId" IN (SELECT id FROM users WHERE email = 'seu-email@teste.com');

-- Deletar códigos de verificação
DELETE FROM verification_codes 
WHERE email = 'seu-email@teste.com';

-- Deletar usuário
DELETE FROM users 
WHERE email = 'seu-email@teste.com';

COMMIT;

-- 3. Verificar se foi deletado
SELECT COUNT(*) as total 
FROM users 
WHERE email = 'seu-email@teste.com';
-- Deve retornar 0
```

### Passo 3: Testar Novamente
1. Acesse `http://localhost:3000/register`
2. Crie a conta novamente
3. **Veja o código no console do backend** (terminal onde está rodando `npm run dev`)
4. O código aparecerá assim:
   ```
   📧 Código email_verification enviado para seu-email@teste.com: 123456
   ```

---

## 🔍 Como Funciona o Sistema

### Quando você cria uma conta:

1. **Backend recebe o cadastro**
   - Verifica se email já existe
   - Se não existir, cria o usuário
   - Gera código de 6 dígitos
   - Salva código no banco (expira em 15 min)

2. **Código é exibido no console**
   - Como estamos em desenvolvimento
   - O email NÃO é enviado de verdade
   - O código aparece no **terminal do backend**
   - Procure por: `📧 Código email_verification enviado`

3. **Frontend redireciona**
   - Você é redirecionado para `/verify-email`
   - Digite o código de 6 dígitos
   - Clique em "Verificar Email"

4. **Email é verificado**
   - Backend marca `emailVerified = true`
   - Você pode fazer login

---

## 📧 Onde Ver o Código?

### No Terminal do Backend:
```bash
# Procure por esta linha no terminal onde está rodando npm run dev:
📧 Código email_verification enviado para seu-email@teste.com: 123456
                                                                 ^^^^^^
                                                            ESTE É O CÓDIGO!
```

### Exemplo de Log Completo:
```
POST /api/v1/auth/register 201 234ms
📧 Código email_verification enviado para teste@email.com: 456789
📧 Email enviado: <message-id>
```

---

## 🚨 Problemas Comuns

### 1. "Email já cadastrado"
**Solução:** Execute o SQL acima para deletar o usuário

### 2. "Não vejo o código no console"
**Solução:** 
- Verifique se o backend está rodando
- Olhe no terminal onde executou `npm run dev`
- O código aparece APÓS o registro bem-sucedido

### 3. "Código inválido ou expirado"
**Solução:**
- Código expira em 15 minutos
- Clique em "Reenviar código"
- Um novo código será gerado e aparecerá no console

### 4. "Não fui redirecionado para /verify-email"
**Solução:**
- Verifique se o frontend está rodando
- Abra o console do navegador (F12)
- Veja se há erros JavaScript
- Tente acessar manualmente: `http://localhost:3000/verify-email?email=seu-email@teste.com`

---

## 🧪 Teste Passo a Passo

### 1. Limpar Usuário Antigo (se necessário)
Execute o SQL acima no DBeaver

### 2. Iniciar Backend
```bash
cd backend
npm run dev
```
**Deixe este terminal aberto e visível!**

### 3. Iniciar Frontend (outro terminal)
```bash
npm run dev
```

### 4. Criar Conta
1. Acesse: `http://localhost:3000/register`
2. Preencha:
   - Nome: Teste
   - Email: teste@email.com
   - Senha: 123456
3. Clique em "Criar Conta"

### 5. Ver Código
**Olhe no terminal do backend!**
Você verá algo como:
```
📧 Código email_verification enviado para teste@email.com: 789012
```

### 6. Verificar Email
1. Você será redirecionado para `/verify-email`
2. Digite o código: `789012`
3. Clique em "Verificar Email"
4. ✅ Sucesso!

### 7. Fazer Login
1. Você será redirecionado para `/login`
2. Faça login com:
   - Email: teste@email.com
   - Senha: 123456
3. ✅ Pronto!

---

## 💡 Dicas

1. **Sempre olhe o terminal do backend** para ver os códigos
2. **Códigos expiram em 15 minutos** - se demorar, clique em "Reenviar"
3. **Cada código só pode ser usado uma vez**
4. **Para produção**, configure EMAIL_USER e EMAIL_PASSWORD no .env com um email real

---

## 📞 Próximos Passos

Após limpar o usuário e testar:

1. ✅ Registrar nova conta
2. ✅ Ver código no console do backend
3. ✅ Verificar email
4. ✅ Fazer login
5. ✅ Testar recuperação de senha

**Tudo funcionando! 🎉**
