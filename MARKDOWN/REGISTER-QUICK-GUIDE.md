# 🚀 Guia Rápido - Página de Cadastro

## ⚡ Como Usar (2 minutos)

### 1. Acessar a Página

```
http://localhost:3000/register
```

### 2. Preencher o Formulário

```
Nome Completo: Pedro Kstro
Email: pedro@teste.com
Senha: Senha123
Confirmar Senha: Senha123
[✓] Aceito os termos
```

### 3. Clicar em "Criar Conta"

### 4. Aguardar Redirecionamento

Após sucesso, você será redirecionado para `/login` em 1.5 segundos.

### 5. Fazer Login

Use as credenciais que você acabou de criar!

---

## 🎯 Validações Automáticas

### Nome
- ✅ Mínimo 3 caracteres
- ✅ Apenas letras (com acentuação)

### Email
- ✅ Formato válido (usuario@dominio.com)
- ✅ Único (não pode estar cadastrado)

### Senha
- ✅ Mínimo 6 caracteres
- ✅ Pelo menos 1 letra maiúscula
- ✅ Pelo menos 1 letra minúscula
- ✅ Pelo menos 1 número

### Indicador de Força
- 🔴 **Fraca**: 0-2 critérios
- 🟡 **Média**: 3-4 critérios
- 🟢 **Forte**: 5-6 critérios

---

## 🔐 Segurança

### O que é protegido:
- ✅ Senha criptografada (bcrypt no backend)
- ✅ Email único (verificação no banco)
- ✅ Validação client + server
- ✅ Proteção contra SQL injection
- ✅ Proteção contra XSS

### O que você vê:
- 👁️ Toggle para mostrar/ocultar senha
- 📊 Indicador de força da senha
- ✅ Validação em tempo real
- 🔒 Ícone de segurança

---

## 📱 Responsivo

### Desktop (> 1024px)
```
┌─────────────┬─────────────┐
│             │             │
│  Benefícios │  Formulário │
│             │             │
└─────────────┴─────────────┘
```

### Mobile (< 1024px)
```
┌─────────────┐
│    Logo     │
├─────────────┤
│             │
│  Formulário │
│             │
└─────────────┘
```

---

## 🎨 Dark Mode

Suporte automático! Adapta-se ao tema do sistema.

**Light Mode**: Fundo branco, texto escuro  
**Dark Mode**: Fundo escuro, texto claro

---

## ❌ Mensagens de Erro

| Situação | Mensagem |
|----------|----------|
| Email já existe | "Este email já está cadastrado. Tente fazer login." |
| Senha fraca | "Senha deve conter pelo menos uma letra maiúscula" |
| Senhas diferentes | "As senhas não coincidem" |
| Termos não aceitos | "Você deve aceitar os termos de serviço" |
| Servidor offline | "Servidor offline. Tente novamente mais tarde." |

---

## ✅ Sucesso!

Quando tudo der certo:

1. ✅ Toast verde: "Conta criada com sucesso!"
2. ⏱️ Aguarda 1.5 segundos
3. 🔄 Redireciona para `/login`
4. 🎉 Pronto para fazer login!

---

## 🔗 Links Úteis

- **Já tem conta?** → [Fazer login](/login)
- **Termos de Serviço** → (a implementar)
- **Política de Privacidade** → (a implementar)

---

## 🐛 Problemas Comuns

### "Email já cadastrado"
**Solução**: Use outro email ou faça login

### "Servidor offline"
**Solução**: Verifique se o backend está rodando
```bash
cd backend
npm run dev
```

### "Dados inválidos"
**Solução**: Verifique todos os campos e corrija os erros em vermelho

---

## 📚 Documentação Completa

Para mais detalhes, veja:
- **REGISTER-PAGE-DOCUMENTATION.md** - Documentação técnica completa

---

**🎉 Cadastro implementado com sucesso!** 🚀
