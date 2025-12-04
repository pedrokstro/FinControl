# ⚡ CORREÇÃO RÁPIDA DE ENCODING

## 🚨 PROBLEMA: Caracteres corrompidos na página de Categorias

Você está vendo:
- ❌ `Sal�rio` ao invés de `Salário`
- ❌ `Alimenta��o` ao invés de `Alimentação`
- ❌ `Sa�de` ao invés de `Saúde`
- ❌ `Educa��o` ao invés de `Educação`

---

## ⚡ SOLUÇÃO RÁPIDA (2 minutos)

### **PASSO 1: Execute o script de correção**

Abra o PowerShell nesta pasta e execute:

```powershell
.\fix-all-files-utf8.ps1
```

### **PASSO 2: Reinicie o servidor**

```bash
npm run dev
```

### **PASSO 3: Verifique**

Abra: http://localhost:3000/categories

✅ Os nomes devem aparecer corretamente agora!

---

## 🔧 O QUE O SCRIPT FAZ?

1. ✅ Converte todos os arquivos `.ts` e `.tsx` para UTF-8
2. ✅ Remove BOM (Byte Order Mark) se existir
3. ✅ Corrige arquivos críticos primeiro:
   - `Categories.tsx`
   - `financialStore.ts`
   - `mockData.ts`
   - E todos os outros

---

## 🚨 SE O SCRIPT NÃO EXECUTAR

**Erro:** "Execução de scripts está desabilitada"

**Solução:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Depois execute novamente:
```powershell
.\fix-all-files-utf8.ps1
```

---

## 📝 CORREÇÃO MANUAL (Alternativa)

Se preferir corrigir manualmente no VS Code/Cursor:

1. Abra `src/pages/Categories.tsx`
2. Veja o canto inferior direito (deve mostrar o encoding)
3. Clique no encoding
4. Selecione "Save with Encoding"
5. Escolha "UTF-8" (sem BOM)
6. Salve (Ctrl+S)
7. Repita para:
   - `src/store/financialStore.ts`
   - `src/data/mockData.ts`

---

## ✅ VERIFICAÇÃO

Após a correção, verifique:

- [ ] Página de Categorias carrega sem erros
- [ ] "Salário" aparece corretamente
- [ ] "Alimentação" aparece corretamente
- [ ] "Saúde" aparece corretamente
- [ ] "Educação" aparece corretamente

---

## 📚 DOCUMENTAÇÃO COMPLETA

Para mais detalhes, veja:
- `CATEGORIES-ENCODING-FIX.md` - Guia detalhado
- `ENCODING-GUIDE.md` - Guia completo de encoding

---

## 🎯 RESULTADO ESPERADO

### Antes:
```
Sal�rio          ❌
Alimenta��o      ❌
Sa�de            ❌
Educa��o         ❌
```

### Depois:
```
Salário          ✅
Alimentação      ✅
Saúde            ✅
Educação         ✅
```

---

**Tempo estimado:** 2 minutos  
**Dificuldade:** Fácil  
**Status:** ✅ Pronto para executar
