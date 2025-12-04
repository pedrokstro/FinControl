# 🔧 Correção de Encoding - Página de Categorias

## 🐛 Problema Identificado

Na página de **Categorias**, os nomes estão exibindo caracteres corrompidos:
- ❌ `Sal�rio` ao invés de `Salário`
- ❌ `Alimenta��o` ao invés de `Alimentação`
- ❌ `Sa�de` ao invés de `Saúde`
- ❌ `Educa��o` ao invés de `Educação`

## 🎯 Causa Raiz

Os arquivos TypeScript não estão salvos em **UTF-8 sem BOM**, causando corrupção de caracteres acentuados quando o navegador renderiza o conteúdo.

### Arquivos Afetados:
1. ❌ `src/pages/Categories.tsx`
2. ❌ `src/store/financialStore.ts`
3. ❌ `src/data/mockData.ts`
4. ⚠️ Possivelmente outros arquivos `.ts` e `.tsx`

---

## ✅ Solução Implementada

### 1. **Scripts de Correção Automática**

Criamos 3 scripts PowerShell para corrigir o encoding:

#### **fix-all-files-utf8.ps1** (Recomendado)
```powershell
.\fix-all-files-utf8.ps1
```
- ✅ Converte TODOS os arquivos TypeScript/JavaScript
- ✅ Foco em arquivos críticos primeiro
- ✅ Tenta múltiplos encodings automaticamente
- ✅ Salva como UTF-8 sem BOM

#### **fix-encoding-complete.ps1**
```powershell
.\fix-encoding-complete.ps1
```
- ✅ Converte todos os arquivos do projeto
- ✅ Inclui JSON, HTML, CSS, MD

#### **fix-categories-encoding.ps1**
```powershell
.\fix-categories-encoding.ps1
```
- ✅ Corrige apenas Categories.tsx

### 2. **Configurações Permanentes**

#### **.editorconfig**
```ini
[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
```
✅ Garante que novos arquivos usem UTF-8

#### **vite.config.ts**
```typescript
build: {
  charset: 'utf8',
  rollupOptions: {
    output: {
      charset: 'utf8',
    },
  },
}
```
✅ Garante UTF-8 no build de produção

#### **index.html**
```html
<meta charset="UTF-8" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
```
✅ Garante interpretação UTF-8 no navegador

---

## 📋 Passo a Passo para Corrigir

### **Opção 1: Correção Automática (Recomendado)**

1. **Execute o script principal:**
   ```powershell
   .\fix-all-files-utf8.ps1
   ```

2. **Aguarde a conversão:**
   - O script processará todos os arquivos críticos
   - Mostrará progresso em tempo real
   - Exibirá resumo ao final

3. **Reinicie o servidor:**
   ```bash
   npm run dev
   ```

4. **Verifique a página de Categorias:**
   - Abra http://localhost:3000/categories
   - Todos os nomes devem aparecer corretamente

### **Opção 2: Correção Manual (VS Code/Cursor)**

1. **Abra o arquivo problemático:**
   - `src/pages/Categories.tsx`

2. **Verifique o encoding atual:**
   - Veja o canto inferior direito
   - Deve mostrar "UTF-8"

3. **Se não estiver em UTF-8:**
   - Clique no encoding mostrado
   - Selecione "Save with Encoding"
   - Escolha "UTF-8"
   - Salve o arquivo (Ctrl+S)

4. **Repita para outros arquivos:**
   - `src/store/financialStore.ts`
   - `src/data/mockData.ts`
   - Todos os arquivos em `src/pages/`

---

## 🧪 Como Testar

### **Teste 1: Verificar Nomes das Categorias**
1. Acesse a página de Categorias
2. Verifique se os nomes aparecem corretamente:
   - ✅ Salário
   - ✅ Alimentação
   - ✅ Saúde
   - ✅ Educação

### **Teste 2: Criar Nova Categoria**
1. Clique em "Nova Categoria"
2. Digite um nome com acentos: "Educação Física"
3. Salve
4. Verifique se aparece corretamente na lista

### **Teste 3: Editar Categoria Existente**
1. Clique em editar em uma categoria
2. Altere o nome para incluir acentos
3. Salve
4. Verifique se mantém os acentos

### **Teste 4: Dark Mode**
1. Alterne para dark mode
2. Verifique se os textos continuam legíveis
3. Todos os acentos devem aparecer corretamente

---

## 🔍 Verificação de Encoding

### **PowerShell - Verificar Encoding de um Arquivo:**
```powershell
# Ver primeiros bytes do arquivo (detectar BOM)
Format-Hex -Path "src\pages\Categories.tsx" -Count 10

# UTF-8 sem BOM: não deve ter EF BB BF no início
# UTF-8 com BOM: começa com EF BB BF
# ANSI/Windows-1252: outros valores
```

### **VS Code - Verificar Encoding:**
1. Abra o arquivo
2. Veja o canto inferior direito
3. Deve mostrar "UTF-8"
4. Se mostrar "UTF-8 with BOM", converta para "UTF-8"

---

## 📊 Dados de Teste (mockData.ts)

Os dados de exemplo já estão corretos em UTF-8:

```typescript
export const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Salário',      // ✅ Correto
    type: 'income',
    icon: 'DollarSign',
  },
  {
    id: 'cat-4',
    name: 'Alimentação',  // ✅ Correto
    type: 'expense',
    icon: 'UtensilsCrossed',
  },
  {
    id: 'cat-8',
    name: 'Saúde',        // ✅ Correto
    type: 'expense',
    icon: 'Heart',
  },
  {
    id: 'cat-9',
    name: 'Educação',     // ✅ Correto
    type: 'expense',
    icon: 'GraduationCap',
  },
]
```

---

## 🚨 Problemas Comuns

### **Problema 1: Script não executa**
**Erro:** "Execução de scripts está desabilitada"

**Solução:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### **Problema 2: Ainda mostra caracteres errados**
**Causa:** Cache do navegador

**Solução:**
1. Limpe o cache (Ctrl+Shift+Delete)
2. Ou abra em aba anônima (Ctrl+Shift+N)
3. Ou force reload (Ctrl+F5)

### **Problema 3: Funciona localmente mas não no build**
**Causa:** Vite não configurado para UTF-8

**Solução:**
Verifique `vite.config.ts` tem:
```typescript
build: {
  charset: 'utf8'
}
```

### **Problema 4: Git mostra todos os arquivos modificados**
**Causa:** Mudança de line endings (CRLF → LF)

**Solução:**
```bash
# Configurar Git para normalizar line endings
git config core.autocrlf true
```

---

## ✅ Checklist de Validação

Após executar a correção, verifique:

- [ ] Script executado sem erros
- [ ] Servidor reiniciado (`npm run dev`)
- [ ] Página de Categorias carrega sem erros
- [ ] Nomes das categorias aparecem corretamente
- [ ] "Salário" exibe corretamente (não "Sal�rio")
- [ ] "Alimentação" exibe corretamente
- [ ] "Saúde" exibe corretamente
- [ ] "Educação" exibe corretamente
- [ ] Criar nova categoria com acentos funciona
- [ ] Editar categoria mantém acentos
- [ ] Dark mode exibe textos corretamente
- [ ] Build de produção funciona (`npm run build`)

---

## 🎯 Resultado Esperado

### **Antes da Correção:**
```
Sal�rio          ❌
Alimenta��o      ❌
Sa�de            ❌
Educa��o         ❌
```

### **Após a Correção:**
```
Salário          ✅
Alimentação      ✅
Saúde            ✅
Educação         ✅
```

---

## 📚 Referências

- [UTF-8 Everywhere](http://utf8everywhere.org/)
- [EditorConfig](https://editorconfig.org/)
- [Vite Build Options](https://vitejs.dev/config/build-options.html)
- [MDN: Character Encoding](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#charset)

---

## 🔄 Manutenção Futura

Para evitar problemas futuros:

1. ✅ **Use .editorconfig** - Já configurado
2. ✅ **Configure seu editor** - Use UTF-8 por padrão
3. ✅ **Revise PRs** - Verifique encoding antes de merge
4. ✅ **Testes automatizados** - Adicione testes para caracteres especiais
5. ✅ **CI/CD** - Valide encoding no pipeline

---

## ✅ Status

**Problema:** ❌ Caracteres corrompidos na página de Categorias  
**Solução:** ✅ Scripts de correção criados  
**Configuração:** ✅ .editorconfig e vite.config.ts atualizados  
**Documentação:** ✅ Guia completo criado  
**Próximo Passo:** ▶️ Executar `fix-all-files-utf8.ps1`

---

**Última atualização:** 2024  
**Status:** ✅ Pronto para execução
