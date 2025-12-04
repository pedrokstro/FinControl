# ?? DARK MODE - GUIA RÁPIDO

## ? Como Usar

### **Para Usuários:**

#### **1. Ativar Dark Mode**
1. Faça login na aplicação
2. Localize o botão no sidebar (barra lateral esquerda)
3. Clique em **"Modo Escuro"** com ícone de lua ??
4. Veja a mágica acontecer! ?

#### **2. Voltar ao Light Mode**
1. Clique no botão **"Modo Claro"** com ícone de sol ??
2. A aplicação volta ao tema claro instantaneamente

#### **3. Preferência Salva**
? Sua escolha é automaticamente salva  
? Na próxima vez que abrir, o tema estará lá!  
? Funciona em todas as abas e janelas  

---

## ?? Localização do Botão

```
???????????????????????????????
?  FinControl                 ?
?  ???????????                ?
?  ?? Dashboard              ?
?  ??  Transações            ?
?  ?? Categorias             ?
?  ?? Relatórios             ?
?  ??  Configurações         ?
?  ???????????                ?
?  ?? Modo Escuro    [???]  ? ? AQUI!
?  ???????????                ?
?  ?? Dica do Dia            ?
???????????????????????????????
```

---

## ?? Visual

### **Light Mode (Padrão)**
- Fundo branco/cinza claro
- Texto escuro
- Cards brancos
- Bordas cinza claro

### **Dark Mode**
- Fundo cinza escuro/preto
- Texto claro/branco
- Cards cinza escuro
- Bordas cinza médio

---

## ?? Dicas

### **1. Melhor Horário**
?? **Noite/Madrugada**: Use dark mode  
?? **Dia/Manhã**: Use light mode  

### **2. Conforto Visual**
- Dark mode reduz fadiga ocular em ambientes escuros
- Light mode é melhor em ambientes bem iluminados

### **3. Economia de Bateria** (em telas OLED)
- Dark mode pode economizar bateria
- Pixels pretos não consomem energia

---

## ?? Para Desenvolvedores

### **Usar o tema em um componente:**

```tsx
import { useTheme } from '@/contexts/ThemeContext'

const MeuComponente = () => {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <div>
      <p>Tema atual: {theme}</p>
      <button onClick={toggleTheme}>
        Alternar Tema
      </button>
    </div>
  )
}
```

### **Adicionar classes dark:**

```tsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Conteúdo
</div>
```

### **Cores recomendadas:**

| Elemento | Light | Dark |
|----------|-------|------|
| Background | `bg-white` | `dark:bg-gray-800` |
| Text | `text-gray-900` | `dark:text-white` |
| Border | `border-gray-200` | `dark:border-gray-700` |
| Input | `bg-white` | `dark:bg-gray-700` |

---

## ? FAQ

**P: O tema persiste após fechar o navegador?**  
R: ? Sim! Sua preferência é salva no localStorage.

**P: Funciona em mobile?**  
R: ? Sim! Totalmente responsivo.

**P: Posso usar atalho de teclado?**  
R: Atualmente não, mas está na lista de melhorias futuras!

**P: O tema é sincronizado entre dispositivos?**  
R: Não ainda, mas pode ser implementado no futuro.

**P: Como resetar para padrão?**  
R: Basta clicar no toggle novamente ou limpar os dados do navegador.

---

## ?? Problemas?

Se encontrar algum problema:

1. **Recarregue a página** (F5)
2. **Limpe o cache** do navegador
3. **Verifique o console** (F12)
4. **Reporte o bug** na issue tracker

---

## ?? Aproveite o Dark Mode!

Desfrute de uma experiência visual mais confortável e moderna! ???

---

**Dúvidas?** Consulte a [documentação completa](./DARK-MODE-IMPLEMENTADO.md)
