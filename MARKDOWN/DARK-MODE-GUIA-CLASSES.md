# ?? GUIA RÁPIDO - Cores de Destaque Dark Mode

## ?? Classes Disponíveis

### **1. Links**

```tsx
// Link padrão
<a href="#">Link automático</a>

// Links coloridos
<a className="link-primary">Link primário</a>
<a className="link-success">Link de sucesso</a>
<a className="link-danger">Link de perigo</a>
```

**Cores:**
- Light: `primary-600` ? Dark: `primary-400` (azul vibrante)
- Hover: Automaticamente mais claro no dark mode

---

### **2. Badges**

```tsx
// Badges de status
<span className="badge badge-success">Ativo</span>
<span className="badge badge-danger">Erro</span>
<span className="badge badge-warning">Aviso</span>
<span className="badge badge-primary">Info</span>
<span className="badge badge-neutral">Neutro</span>
```

**Características:**
- ? Fundo semi-transparente no dark mode
- ? Texto claro e legível
- ? Bordas arredondadas
- ? Tamanho compacto

---

### **3. Alertas**

```tsx
// Alerta de sucesso
<div className="alert alert-success">
  <strong>Sucesso!</strong> Operação realizada.
</div>

// Alerta de erro
<div className="alert alert-danger">
  <strong>Erro!</strong> Algo deu errado.
</div>

// Alerta de aviso
<div className="alert alert-warning">
  <strong>Atenção!</strong> Verifique os dados.
</div>

// Alerta informativo
<div className="alert alert-info">
  <strong>Info:</strong> Dados salvos.
</div>
```

**Características:**
- ? Background sutil no dark mode
- ? Borda colorida
- ? Padding adequado
- ? Texto legível

---

### **4. Highlights**

```tsx
// Texto destacado
<p>Valor: <mark>R$ 1.234,56</mark></p>

// Ou com classe
<span className="text-highlight">Texto importante</span>
```

**Cores:**
- Light: Fundo amarelo claro
- Dark: Fundo amarelo escuro + texto amarelo claro

---

### **5. Código**

```tsx
// Código inline
<p>Execute <code>npm install</code></p>
```

**Cores:**
- Light: Fundo cinza claro
- Dark: Fundo `neutral-800` + texto `neutral-200`

---

### **6. Ênfase**

```tsx
// Negrito
<strong>Texto em negrito</strong>

// Itálico
<em>Texto em itálico</em>
```

**Cores:**
- `strong`: Sempre branco no dark mode
- `em`: Cinza claro no dark mode

---

### **7. Tooltips**

```tsx
<div className="relative group">
  <button>Hover me</button>
  <span className="tooltip hidden group-hover:block">
    Dica aqui
  </span>
</div>
```

**Características:**
- Light: Fundo escuro + texto branco
- Dark: Fundo branco + texto escuro (invertido!)

---

### **8. Utilitários**

```tsx
// Texto
<p className="text-accent">Texto acentuado</p>
<p className="text-muted">Texto esmaecido</p>

// Background
<div className="bg-hover">Hover aqui</div>
<div className="bg-active">Item ativo</div>

// Bordas
<div className="border-light">Borda clara</div>
<div className="border-medium">Borda média</div>

// Focus
<input className="focus-ring" />
```

---

## ?? Exemplos Práticos

### **Dashboard - Card de Status**

```tsx
<div className="card">
  <div className="flex items-center justify-between">
    <h3 className="text-lg font-semibold">
      Status da Conta
    </h3>
    <span className="badge badge-success">Ativa</span>
  </div>
  <p className="text-muted mt-2">
    Última atualização: <mark>hoje</mark>
  </p>
</div>
```

### **Transações - Badge de Tipo**

```tsx
{transactions.map(tx => (
  <div key={tx.id} className="card bg-hover">
    <div className="flex items-center gap-3">
      <span className={`badge ${
        tx.type === 'income' 
          ? 'badge-success' 
          : 'badge-danger'
      }`}>
        {tx.type === 'income' ? 'Receita' : 'Despesa'}
      </span>
      <span className="font-medium">{tx.description}</span>
    </div>
  </div>
))}
```

### **Formulário - Mensagens de Erro/Sucesso**

```tsx
{error && (
  <div className="alert alert-danger mb-4">
    <strong>Erro!</strong> {error}
  </div>
)}

{success && (
  <div className="alert alert-success mb-4">
    <strong>Sucesso!</strong> {success}
  </div>
)}

<input 
  className="input-field focus-ring"
  placeholder="Digite aqui..."
/>
```

### **Reports - Link Destacado**

```tsx
<div className="card">
  <h3 className="font-bold text-lg mb-2">
    Relatório Mensal
  </h3>
  <p className="text-muted mb-4">
    Visualize o resumo completo das suas finanças.
  </p>
  <a href="/reports/detailed" className="link-primary font-semibold">
    Ver relatório detalhado ?
  </a>
</div>
```

### **Settings - Código de Configuração**

```tsx
<div className="alert alert-info">
  <strong>Dica:</strong> Para resetar, execute <code>npm run reset</code>
</div>
```

---

## ?? Paleta Rápida

### **Cores de Texto Dark Mode:**

| Uso | Classe | Cor |
|-----|--------|-----|
| **Principal** | `text-white` | #ffffff |
| **Secundário** | `text-neutral-300` | #d4d4d4 |
| **Terciário** | `text-neutral-400` | #a3a3a3 |
| **Muted** | `text-neutral-500` | #737373 |
| **Link** | `text-primary-400` | #38bdf8 |
| **Success** | `text-success-300` | #86efac |
| **Danger** | `text-danger-300` | #fca5a5 |
| **Warning** | `text-yellow-300` | #fcd34d |

### **Cores de Background Dark Mode:**

| Uso | Classe | Cor |
|-----|--------|-----|
| **Principal** | `bg-black` | #000000 |
| **Card** | `bg-neutral-900` | #1a1a1a |
| **Sidebar** | `bg-neutral-950` | #0a0a0a |
| **Input** | `bg-neutral-900` | #1a1a1a |
| **Badge Success** | `bg-success-900/30` | #14532d30 |
| **Badge Danger** | `bg-danger-900/30` | #7f1d1d30 |

---

## ? Checklist de Uso

Ao criar novos componentes, use:

- [ ] ? `.badge-*` para status e tags
- [ ] ? `.alert-*` para mensagens importantes
- [ ] ? `.link-*` para links destacados
- [ ] ? `<mark>` para highlights de texto
- [ ] ? `<code>` para código inline
- [ ] ? `.text-muted` para textos secundários
- [ ] ? `.focus-ring` para inputs focados
- [ ] ? `.bg-hover` para itens clicáveis

---

## ?? Regras de Ouro

1. **Links** sempre em `primary-400` no dark mode
2. **Badges** sempre com `/30` de opacidade no background
3. **Alertas** sempre com background `/20` e borda `/50`
4. **Tooltips** sempre invertidos no dark mode
5. **Highlights** sempre com texto legível
6. **Código** sempre em `neutral-800` background
7. **Strong** sempre em branco puro no dark mode
8. **Focus** sempre com ring visível

---

## ?? Dicas Finais

### **Quando usar cada badge:**

- `badge-success` ? Status ativo, operações bem-sucedidas
- `badge-danger` ? Erros, status inativo, alertas críticos
- `badge-warning` ? Avisos, ações pendentes, atenção requerida
- `badge-primary` ? Informações neutras, categorias
- `badge-neutral` ? Dados sem semântica específica

### **Quando usar cada alerta:**

- `alert-success` ? Confirmações de operações
- `alert-danger` ? Erros críticos que impedem ação
- `alert-warning` ? Avisos importantes mas não bloqueantes
- `alert-info` ? Informações úteis e dicas

### **Contraste sempre:**

? Use `primary-400` ao invés de `primary-600` no dark mode  
? Use `success-300` ao invés de `success-600` no dark mode  
? Use `danger-300` ao invés de `danger-600` no dark mode  

---

**Pronto para usar!** ???

Todas as classes estão otimizadas para **contraste WCAG AAA** no dark mode!
