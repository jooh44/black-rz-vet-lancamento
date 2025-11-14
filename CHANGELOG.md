# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.1.0] - 2025-01-XX

### 🗑️ Removido

- Funcionalidade de captura de leads (formulário de lista VIP)
- Integração com Google Sheets
- Integração com Google Apps Script
- API de leads (`/api/leads`)
- Armazenamento local de leads
- Dependências não utilizadas: `axios`, `cheerio`, `cors`, `googleapis`
- Script `check:sheets` do package.json

### 🔧 Simplificado

- Servidor agora serve apenas arquivos estáticos
- Configuração reduzida (apenas PORT necessário)
- Health check simplificado
- Código do servidor reduzido de ~120 para ~40 linhas

### 📚 Documentação

- README.md atualizado removendo referências a leads
- DEPLOY.md simplificado
- PRE-DEPLOY-CHECKLIST.md atualizado
- Criado SIMPLIFICATION-SUMMARY.md com resumo das mudanças

---

## [1.0.0] - 2025-01-XX

### ✨ Adicionado

- Página de promoções (`promocoes.html`) com exibição de produtos e acessórios
- Sistema de carrossel de banners promocionais no hero
- Seção de contador regressivo para Black Days
- Grid responsivo de produtos com cards informativos
- Integração com Meta Pixel para rastreamento de conversões
- Sistema de navegação por categorias (Equipamentos/Acessórios)
- Smooth scroll entre seções
- Barra de navegação fixa no mobile (parte inferior ao rolar)
- Faixas ticker animadas com emoji ⚠️
- Faixas ticker decorativas atrás do contador
- Suporte a imagens responsivas (desktop/mobile) para banners
- Sistema de badges de desconto nos produtos
- Links diretos para páginas de produto no site rzvet.com.br

### 🔧 Melhorado

- Performance do carregamento de produtos
- Responsividade em dispositivos móveis
- Acessibilidade (ARIA labels, navegação por teclado)
- Tratamento de erros de carregamento de imagens
- Otimização de área de toque em dispositivos móveis
- Transições suaves entre estados

### 🐛 Corrigido

- Faixas ticker atrás do contador agora aparecem corretamente
- Emoji ⚠️ adicionado em todas as faixas ticker
- Navegação mobile funcionando corretamente
- Smooth scroll ajustado para diferentes tamanhos de tela
- Destaque de link ativo sincronizado entre header e barra inferior

### 🧹 Limpeza

- Removidos console.log/error desnecessários do código de produção
- Código otimizado para produção

### 📚 Documentação

- Criado guia de deploy (`docs/DEPLOY.md`)
- README.md atualizado com informações completas
- Documentação de arquitetura atualizada

---

## [0.1.0] - 2025-11-13

### ✨ Adicionado

- Landing page inicial de captura de leads (`index.html`)
- Formulário de lista VIP com validação
- Integração com Google Sheets para armazenamento de leads
- Integração com Google Apps Script (opcional)
- API REST para recebimento de leads
- Sistema de contador regressivo
- Meta Pixel integrado
- Armazenamento local de leads (`data/leads.json`)
- Testes unitários (Jest)
- Dockerfile para containerização
- Sistema de logging (Pino)

### 📚 Documentação

- README.md inicial
- PRD (Product Requirements Document)
- Documentação de arquitetura
- Especificações front-end

---

## Tipos de Mudanças

- `✨ Adicionado` - para novas funcionalidades
- `🔧 Melhorado` - para mudanças em funcionalidades existentes
- `🐛 Corrigido` - para correção de bugs
- `🧹 Limpeza` - para limpeza de código
- `📚 Documentação` - para mudanças na documentação
- `🔒 Segurança` - para correções de segurança
- `⚡ Performance` - para melhorias de performance
- `♿ Acessibilidade` - para melhorias de acessibilidade

