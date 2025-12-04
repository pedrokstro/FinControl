# 🎨 Enhanced Icon Picker - Planejamento

## 📋 Funcionalidades a Implementar

### 1. Seleção de Ícones Locais (Lucide)
- ✅ Já implementado
- Grid de ícones categorizados
- Busca por nome

### 2. Emoji Picker
- [ ] Biblioteca: emoji-picker-react
- [ ] Categorias de emojis
- [ ] Busca de emojis
- [ ] Preview

### 3. URL Externa de Ícones
- [ ] Input para URL
- [ ] Validação de URL
- [ ] Preview da imagem
- [ ] Suporte a SVG, PNG, JPG

### 4. Integração com Bibliotecas
- [ ] Font Awesome (via CDN)
- [ ] Flaticon (via URL)
- [ ] Icons8 (via URL)

## 🚀 Próximos Passos

1. Instalar emoji-picker-react
2. Criar tabs no IconPicker
3. Implementar validação de URL
4. Adicionar preview de ícones externos
5. Atualizar banco de dados para suportar tipos diferentes

## 📦 Dependências Necessárias

```bash
npm install emoji-picker-react
```

## 🔧 Estrutura de Dados

```typescript
interface CategoryIcon {
  type: 'lucide' | 'emoji' | 'url' | 'fontawesome';
  value: string; // nome do ícone, emoji ou URL
  preview?: string; // URL de preview
}
```
