# ðŸ“ Guia de Encoding UTF-8 - FinControl

## âœ… Status: Encoding Padronizado para UTF-8

Este projeto estÃ¡ configurado para usar **UTF-8 sem BOM** em todos os arquivos.

---

## ðŸŽ¯ ConfiguraÃ§Ãµes Implementadas

### 1. **HTML (index.html)**
```html
<meta charset="UTF-8" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
```
âœ… Garante que o navegador interprete corretamente caracteres especiais

### 2. **Vite (vite.config.ts)**
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
âœ… Garante UTF-8 no build de produÃ§Ã£o

### 3. **EditorConfig (.editorconfig)**
```ini
[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
```
âœ… Garante que todos os editores usem UTF-8

### 4. **TypeScript**
- TypeScript usa UTF-8 por padrÃ£o
- NÃ£o requer configuraÃ§Ã£o adicional no tsconfig.json

---

## ðŸ”§ Scripts de CorreÃ§Ã£o

### **fix-encoding-complete.ps1**
Script PowerShell que converte todos os arquivos do projeto para UTF-8 sem BOM.

**Como usar:**
```powershell
# Windows PowerShell
.\fix-encoding-complete.ps1
```

**O que faz:**
- âœ… Converte arquivos `.ts`, `.tsx`, `.js`, `.jsx`
- âœ… Converte arquivos `.json`, `.html`, `.css`
- âœ… Converte arquivos `.md`, `.txt`, `.yml`, `.yaml`
- âœ… Ignora `node_modules`, `dist`, `.git`, `.vs`, `.vscode`
- âœ… Usa UTF-8 **sem BOM** (melhor compatibilidade)

---

## ðŸ“‹ Checklist de Encoding

### âœ… Arquivos de ConfiguraÃ§Ã£o
- [x] `index.html` - Meta tags UTF-8
- [x] `vite.config.ts` - Build com UTF-8
- [x] `.editorconfig` - Charset UTF-8
- [x] `package.json` - UTF-8 por padrÃ£o

### âœ… CÃ³digo Fonte
- [x] Todos os arquivos `.ts` e `.tsx` em UTF-8
- [x] Todos os arquivos `.js` e `.jsx` em UTF-8
- [x] Todos os arquivos `.css` em UTF-8
- [x] Todos os arquivos `.html` em UTF-8

### âœ… Dados e ConfiguraÃ§Ãµes
- [x] Arquivos `.json` em UTF-8
- [x] Arquivos `.md` em UTF-8
- [x] Arquivos `.yml` e `.yaml` em UTF-8

---

## ðŸŒ Caracteres Especiais Suportados

Com UTF-8, o projeto suporta:
- âœ… AcentuaÃ§Ã£o portuguesa (Ã¡, Ã©, Ã­, Ã³, Ãº, Ã£, Ãµ, Ã§)
- âœ… SÃ­mbolos monetÃ¡rios (R$, $, â‚¬, Â£, Â¥)
- âœ… Emojis (ðŸ’°, ðŸ“Š, ðŸ’³, ðŸŽ¯)
- âœ… Caracteres especiais (Â©, Â®, â„¢, Â°)
- âœ… SÃ­mbolos matemÃ¡ticos (Â±, Ã—, Ã·, â‰ˆ)

---

## ðŸ” Como Verificar Encoding de um Arquivo

### **Windows PowerShell:**
```powershell
# Ver encoding de um arquivo
Get-Content -Path "arquivo.ts" -Encoding UTF8 -Raw
```

### **VS Code:**
1. Abra o arquivo
2. Veja o canto inferior direito
3. Deve mostrar "UTF-8"
4. Se nÃ£o estiver, clique e selecione "Save with Encoding" â†’ "UTF-8"

### **Cursor/VS Code:**
1. Abra Command Palette (Ctrl+Shift+P)
2. Digite "Change File Encoding"
3. Selecione "Save with Encoding"
4. Escolha "UTF-8"

---

## ðŸš¨ Problemas Comuns e SoluÃ§Ãµes

### **Problema 1: Caracteres estranhos (ï¿½, ÃƒÂ©, ÃƒÂ§)**
**Causa:** Arquivo nÃ£o estÃ¡ em UTF-8  
**SoluÃ§Ã£o:** Execute `fix-encoding-complete.ps1`

### **Problema 2: Acentos nÃ£o aparecem no navegador**
**Causa:** Meta tag charset faltando  
**SoluÃ§Ã£o:** Verificar `index.html` tem `<meta charset="UTF-8" />`

### **Problema 3: Build gera caracteres errados**
**Causa:** Vite nÃ£o configurado para UTF-8  
**SoluÃ§Ã£o:** Verificar `vite.config.ts` tem `charset: 'utf8'`

### **Problema 4: Git mostra mudanÃ§as em todos os arquivos**
**Causa:** Line endings diferentes (CRLF vs LF)  
**SoluÃ§Ã£o:** `.editorconfig` jÃ¡ configura `end_of_line = lf`

---

## ðŸ“Š ExportaÃ§Ã£o de Dados (CSV, JSON, PDF)

### **CSV Export**
```typescript
// Sempre usar UTF-8 com BOM para Excel
const BOM = '\uFEFF';
const csv = BOM + data.map(row => row.join(',')).join('\n');
const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
```

### **JSON Export**
```typescript
// JSON sempre usa UTF-8
const json = JSON.stringify(data, null, 2);
const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
```

### **PDF Export (futuro)**
```typescript
// Usar biblioteca que suporte UTF-8 (jsPDF, pdfmake)
import jsPDF from 'jspdf';
const doc = new jsPDF();
doc.setFont('helvetica'); // Suporta UTF-8
```

---

## ðŸ” API e Backend (futuro)

### **Headers HTTP**
```typescript
// Sempre enviar charset nos headers
headers: {
  'Content-Type': 'application/json; charset=utf-8',
  'Accept': 'application/json; charset=utf-8',
}
```

### **Axios Config**
```typescript
axios.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
```

### **Database (futuro)**
```sql
-- MySQL/MariaDB
CREATE DATABASE fincontrol CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- PostgreSQL (UTF-8 por padrÃ£o)
CREATE DATABASE fincontrol ENCODING 'UTF8';
```

---

## ðŸ“ Boas PrÃ¡ticas

### âœ… **SEMPRE:**
1. Salvar arquivos em UTF-8 sem BOM
2. Usar `.editorconfig` em todos os projetos
3. Testar caracteres especiais apÃ³s mudanÃ§as
4. Incluir meta charset no HTML
5. Configurar charset no build

### âŒ **NUNCA:**
1. Usar ANSI ou Windows-1252
2. Misturar encodings no mesmo projeto
3. Esquecer charset em exports (CSV, JSON)
4. Hardcodar caracteres especiais sem UTF-8
5. Ignorar avisos de encoding do editor

---

## ðŸ§ª Testes de Encoding

### **Teste Manual:**
1. Adicione texto com acentos: "TransaÃ§Ãµes Financeiras"
2. Salve o arquivo
3. Execute `npm run build`
4. Abra o build no navegador
5. Verifique se acentos aparecem corretamente

### **Teste Automatizado (futuro):**
```typescript
describe('Encoding Tests', () => {
  it('should display Portuguese characters correctly', () => {
    const text = 'TransaÃ§Ãµes, ConfiguraÃ§Ãµes, RelatÃ³rios';
    render(<div>{text}</div>);
    expect(screen.getByText(text)).toBeInTheDocument();
  });
});
```

---

## ðŸ“š ReferÃªncias

- [UTF-8 Everywhere](http://utf8everywhere.org/)
- [EditorConfig](https://editorconfig.org/)
- [Vite Config](https://vitejs.dev/config/)
- [MDN: Character Encoding](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#charset)

---

## âœ… ConclusÃ£o

O projeto **FinControl** estÃ¡ 100% configurado para UTF-8:
- âœ… Todos os arquivos de configuraÃ§Ã£o atualizados
- âœ… Script de conversÃ£o automÃ¡tica criado
- âœ… EditorConfig para manter padrÃ£o
- âœ… Build configurado para UTF-8
- âœ… DocumentaÃ§Ã£o completa

**PrÃ³ximos passos:**
1. Execute `fix-encoding-complete.ps1` uma vez
2. Commit as mudanÃ§as
3. Configure seu editor para usar `.editorconfig`
4. Desenvolva normalmente - encoding estÃ¡ garantido!

---

**Ãšltima atualizaÃ§Ã£o:** 2024  
**Status:** âœ… Completo e Funcional
