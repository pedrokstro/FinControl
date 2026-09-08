---
title: Arquitetura e Segurança
tags:
  - arquitetura
  - seguranca
  - lgpd
---

# 🛡️ Arquitetura, Infraestrutura & Segurança

Fundamentos técnicos, isolamento de dados e proteção de privacidade do FinControl.

## 🔗 Conexões
- Retornar ao [[Visao-Geral-FinControl]]
- Protege os dados de [[Modulo-Transacoes]] e [[Modulo-Cartoes]]
- Assegura conformidade com as diretrizes de [[Modulo-Landing-e-SEO]]

## 📌 Principais Pilares
1. **Criptografia Bancária AES-256**: Armazenamento criptografado de credenciais e registros.
2. **Autenticação & 2FA**: Suporte a biometria nativa, verificação de e-mail e recuperação segura.
3. **PWA & Modo Offline**: Service Worker inteligente com Workbox para disponibilidade sem conexão.
4. **Performance & Code-Splitting**: Divisão de bundles com Vite Rollup e carregamento assíncrono de fontes.
5. **Conformidade LGPD**: Direitos de exportação de dados, exclusão definitiva e transparência total.
