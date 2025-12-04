# Teste: Exclusão de Transações

## Estado Atual do Banco

**Usuário:** demo@financeiro.com
**Total de transações:** 5 (após filtrar por novembro 2025)

### Transações Atuais:

1. **Conta de luz** - R$ 250,00 (07/11/2025)
   - ID: `c309c923-7683-4aa8-97f9-918e629425c7`
   - Categoria: Contas
   - Tipo: Despesa

2. **Teste de transacao** - R$ 150,50 (06/11/2025)
   - ID: `54457329-326b-4b42-9abc-a4d8d3a41f5c`
   - Categoria: Alimentação
   - Tipo: Despesa

3. **Cartão de Crédito** - R$ 1.511,57 (06/11/2025)
   - ID: `3d4b726a-65bb-4798-a5cb-e17b5fb99cd7`
   - Categoria: Freelance
   - Tipo: Receita

4. **Salário mensal** - R$ 5.000,00 (05/11/2025)
   - ID: `4162fd3f-9f5e-4d8d-a383-c085b1ab180b`
   - Categoria: Salário
   - Tipo: Receita

5. **Plano de saúde** - R$ 200,00 (05/11/2025)
   - ID: `47ad4d4d-aa46-4ded-8a86-27ffc2aa2756`
   - Categoria: Saúde
   - Tipo: Despesa

### Resumo:
- **Receitas:** R$ 6.511,57
- **Despesas:** R$ 600,50
- **Saldo:** R$ 5.911,07

## Teste de Exclusão

### Passo 1: Verificar Estado Inicial

Execute o script:
```bash
cd backend
.\verificar-transacoes-banco.ps1
```

Anote:
- Total de transações: ____
- Saldo atual: ____

### Passo 2: Excluir uma Transação pela Interface

1. Abra a aplicação: `http://localhost:3000`
2. Faça login com `demo@financeiro.com` / `demo123`
3. Vá para **Transações**
4. Escolha uma transação para excluir (ex: "Teste de transacao - R$ 150,50")
5. Clique no ícone de **lixeira** 🗑️
6. Confirme a exclusão no modal

**Resultado Esperado:**
- ✅ Modal de confirmação aparece
- ✅ Mostra detalhes da transação
- ✅ Ao confirmar, transação desaparece da lista
- ✅ Toast de sucesso: "Transação excluída com sucesso"
- ✅ Valores do resumo são atualizados

### Passo 3: Verificar no Banco de Dados

Execute o script novamente:
```bash
.\verificar-transacoes-banco.ps1
```

**Verificar:**
- ✅ Total de transações diminuiu em 1
- ✅ Transação excluída não aparece mais na lista
- ✅ Saldo foi recalculado corretamente

### Passo 4: Verificar Diretamente no PostgreSQL (Opcional)

No DBeaver, execute:
```sql
-- Verificar se a transação foi deletada
SELECT * FROM transactions 
WHERE id = '54457329-326b-4b42-9abc-a4d8d3a41f5c';
-- Deve retornar 0 linhas

-- Contar transações totais
SELECT COUNT(*) FROM transactions 
WHERE "userId" = '9ffaecc4-da0b-4ce4-849b-6c14ace34fff';
```

## Teste de Adição

### Passo 1: Estado Antes da Adição

Total de transações: ____

### Passo 2: Adicionar uma Nova Transação

1. Na página de Transações, clique em **"+ Nova Transação"**
2. Preencha:
   - **Tipo:** Despesa
   - **Valor:** 75,00
   - **Categoria:** Lazer
   - **Descrição:** Cinema com amigos
   - **Data:** Hoje
3. Clique em **"Adicionar"**

**Resultado Esperado:**
- ✅ Modal fecha
- ✅ Nova transação aparece na lista
- ✅ Toast de sucesso: "Transação adicionada com sucesso"
- ✅ Valores do resumo são atualizados

### Passo 3: Verificar no Banco

Execute o script:
```bash
.\verificar-transacoes-banco.ps1
```

**Verificar:**
- ✅ Total de transações aumentou em 1
- ✅ Nova transação aparece na lista
- ✅ Saldo foi recalculado corretamente

## Teste de Edição

### Passo 1: Editar uma Transação

1. Escolha uma transação
2. Clique no ícone de **lápis** ✏️
3. Modifique o valor (ex: de R$ 250,00 para R$ 300,00)
4. Clique em **"Salvar"**

**Resultado Esperado:**
- ✅ Modal fecha
- ✅ Transação é atualizada na lista
- ✅ Toast de sucesso: "Transação atualizada com sucesso"
- ✅ Valores do resumo são atualizados

### Passo 2: Verificar no Banco

Execute o script e verifique:
- ✅ Valor foi atualizado
- ✅ Campo `updatedAt` foi modificado
- ✅ Saldo foi recalculado

## Teste de Sincronização

### Passo 1: Fazer Logout

1. Clique no avatar
2. Clique em **"Sair"**

### Passo 2: Fazer Login Novamente

1. Faça login com `demo@financeiro.com` / `demo123`
2. Vá para **Transações**

**Resultado Esperado:**
- ✅ Todas as transações aparecem
- ✅ Valores estão corretos
- ✅ Transações excluídas não aparecem
- ✅ Transações adicionadas aparecem

## Teste de Múltiplas Exclusões

### Passo 1: Excluir 3 Transações Rapidamente

1. Exclua a primeira transação
2. Aguarde o toast de sucesso
3. Exclua a segunda transação
4. Aguarde o toast de sucesso
5. Exclua a terceira transação

**Resultado Esperado:**
- ✅ Todas as 3 transações são excluídas
- ✅ Não aparece erro 429 (rate limiting)
- ✅ Toast de sucesso para cada exclusão
- ✅ Lista é atualizada corretamente

### Passo 2: Verificar no Banco

```bash
.\verificar-transacoes-banco.ps1
```

**Verificar:**
- ✅ Total diminuiu em 3
- ✅ Nenhuma das 3 transações aparece
- ✅ Saldo está correto

## Scripts Disponíveis

### PowerShell (Via API):
```bash
cd backend
.\verificar-transacoes-banco.ps1
```

### SQL (Direto no Banco):
```bash
# No DBeaver
# Abrir: verificar-transacoes-direto.sql
# Executar queries
```

## Checklist de Validação

### Exclusão:
- [ ] Modal de confirmação aparece
- [ ] Detalhes da transação são mostrados
- [ ] Transação é removida da interface
- [ ] Transação é removida do banco de dados
- [ ] Saldo é recalculado corretamente
- [ ] Toast de sucesso aparece
- [ ] Não há erro 429

### Adição:
- [ ] Modal de criação abre
- [ ] Campos são preenchidos corretamente
- [ ] Transação aparece na interface
- [ ] Transação é salva no banco de dados
- [ ] Saldo é recalculado corretamente
- [ ] Toast de sucesso aparece

### Edição:
- [ ] Modal de edição abre com dados preenchidos
- [ ] Campos podem ser modificados
- [ ] Transação é atualizada na interface
- [ ] Transação é atualizada no banco de dados
- [ ] Saldo é recalculado corretamente
- [ ] Toast de sucesso aparece

### Sincronização:
- [ ] Dados persistem após logout/login
- [ ] Transações excluídas não reaparecem
- [ ] Transações adicionadas aparecem
- [ ] Valores estão corretos

## Resultado Esperado Final

✅ **Todas as operações CRUD funcionam perfeitamente:**
- ✅ **Create** - Adicionar transações
- ✅ **Read** - Listar transações
- ✅ **Update** - Editar transações
- ✅ **Delete** - Excluir transações

✅ **Sincronização com banco de dados:**
- ✅ Dados são salvos corretamente
- ✅ Dados são removidos corretamente
- ✅ Dados são atualizados corretamente
- ✅ Dados persistem após logout/login

✅ **Sem erros:**
- ✅ Sem erro 429 (rate limiting)
- ✅ Sem erro 401 (autenticação)
- ✅ Sem erro de validação
- ✅ Sem erro de sincronização
