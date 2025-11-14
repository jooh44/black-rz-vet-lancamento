# Landing Page Black Friday RZ VET - Product Requirements Document (PRD)

**Versão:** 1.1
**Data:** 13 de Novembro de 2025
**Status:** ✅ IMPLEMENTADO - Fase 1 Concluída

---

## 1. Goals and Background Context

### 1.1 Goals

- Criar uma página de promoções da Black Friday que destaque todos os equipamentos veterinários em promoção
- Exibir informações completas de cada produto (nome, preço, desconto, imagem, especificações)
- Fornecer botões "Ver Produto" que direcionem para as páginas de produto no site rzvet.com.br
- Manter integração com Meta Pixel para rastreamento de conversões
- Criar uma experiência visual impactante e profissional que gere desejo de compra
- Implementar seção de headline com espaço para banners promocionais
- Garantir design responsivo e pixel perfect em todos os dispositivos
- Preparar estrutura para futura seção de produtos de consumo (fase 2)

### 1.2 Background Context

A RZ VET está lançando sua campanha Black Friday 2025, com início em 14 de novembro de 2025 às 11:30. O evento oferece descontos agressivos em equipamentos veterinários de alta qualidade, incluindo monitores, aparelhos de anestesia, bombas de infusão, ventiladores e outros equipamentos essenciais para clínicas veterinárias.

A página atual é uma landing page de captura de leads para lista VIP. Agora precisamos criar uma nova página dedicada às promoções que:

- Destaque visualmente todos os produtos em promoção
- Apresente informações claras sobre preços e descontos
- Facilite a navegação para as páginas de produto no site principal (rzvet.com.br)
- Mantenha a infraestrutura existente de rastreamento (Meta Pixel)
- Seja visualmente impactante e profissional

Os valores e informações dos produtos estão organizados em um arquivo Excel na aba "promo", com prints de apoio visual na pasta `valores-black` para facilitar a organização e apresentação dos dados.

### 1.3 Change Log

| Date       | Version | Description                                                       | Author        |
| ---------- | ------- | ----------------------------------------------------------------- | ------------- |
| 2025-11-13 | 1.0     | Criação inicial do PRD para página de promoções Black Friday | Equipe RZ VET |
| 2025-11-13 | 1.1     | ✅ Implementação Fase 1 concluída - Página em produção          | Equipe RZ VET |

---

## 2. Requirements

### 2.1 Functional Requirements

**FR1:** A página deve exibir uma seção de headline no topo com espaço dedicado para banners promocionais (imagens ou carrossel de banners).

**FR2:** A página deve exibir uma seção individual para cada equipamento em promoção, contendo:

- Nome do produto
- Imagem do produto (usando os prints disponíveis em `valores-black/`)
- Preço original (quando aplicável)
- Preço promocional
- Percentual de desconto
- Informações relevantes do produto (especificações técnicas, características principais)
- Botão "Ver Produto" que redireciona para a página do produto no site rzvet.com.br

**FR3:** Os produtos devem ser organizados em um layout responsivo (grid ou lista) que se adapte a diferentes tamanhos de tela.

**FR4:** Cada botão "Ver Produto" deve conter a URL completa do produto no site rzvet.com.br (formato: `https://rzvet.com.br/produto/[slug-do-produto]`).

**FR5:** A página deve manter a integração com Meta Pixel existente, rastreando eventos de visualização de produtos e cliques no botão "Ver Produto".

**FR6:** A página deve exibir um contador/countdown mostrando o tempo restante até o início da promoção (14 de novembro de 2025 às 11:30) ou tempo restante da promoção, conforme necessário.

**FR7:** A página deve manter o header existente com logo RZ VET e badge "Black Days 2025".

**FR8:** A página deve manter o footer existente com informações de copyright e link para rzvet.com.br.

**FR9:** A estrutura da página deve ser preparada para futura adição de uma seção de produtos de consumo (fase 2 - não implementada no MVP).

**FR10:** Os dados dos produtos (nome, preço, desconto, URL, imagem) devem ser estruturados de forma que possam ser facilmente atualizados (via arquivo de configuração, API ou dados estáticos).

**FR11:** A página deve ser acessível via rota específica (ex: `/promocoes`, `/black-friday`, ou `/promocoes-black-friday`).

**FR12:** As imagens dos produtos devem ser otimizadas para web (formato WebP quando possível, com fallback para PNG/JPG).

### 2.2 Non-Functional Requirements

**NFR1:** A página deve carregar completamente em menos de 3 segundos em conexão 4G.

**NFR2:** A página deve ser totalmente responsiva e funcionar perfeitamente em dispositivos móveis (320px+), tablets (768px+) e desktops (1024px+).

**NFR3:** A página deve seguir os padrões de acessibilidade WCAG AA (nível mínimo).

**NFR4:** O código deve seguir os padrões de código existentes no projeto (HTML semântico, CSS modular, JavaScript ES6+).

**NFR5:** A página deve manter **100% de consistência visual** com a landing page existente da lista VIP (cores, tipografia, espaçamentos, componentes, estilos de botões, cards, bordas, sombras - todos os elementos visuais devem ser idênticos).

**NFR6:** As imagens devem ter alt text descritivo para acessibilidade e SEO.

**NFR7:** A página deve ser compatível com navegadores modernos (Chrome, Firefox, Safari, Edge - últimas 2 versões).

**NFR8:** O Meta Pixel deve rastrear corretamente os eventos de visualização de produtos e cliques, mantendo a infraestrutura existente.

---

## 3. User Interface Design Goals

### 3.1 Overall UX Vision

A página de promoções deve criar uma experiência visual impactante que:

- Gere urgência e desejo de compra através de design moderno e profissional
- Destaque claramente os descontos e benefícios de cada produto
- Facilite a navegação e descoberta de produtos
- Mantenha a identidade visual da marca RZ VET
- Seja intuitiva e fácil de usar em qualquer dispositivo

### 3.2 Key Interaction Paradigms

- **Scroll vertical:** Navegação principal através de scroll suave
- **Cards de produtos:** Cada produto apresentado em um card visualmente destacado
- **Hover states:** Interações visuais ao passar o mouse sobre produtos e botões
- **Click-to-action:** Botões claros e destacados para "Ver Produto"
- **Countdown visual:** Exibição clara do tempo restante da promoção

### 3.3 Core Screens and Views

1. **Header Section:** Logo RZ VET + Badge "Black Days 2025" (mantém estrutura existente)
2. **Headline/Banner Section:** Área para banners promocionais (carrossel ou imagem única)
3. **Countdown Section:** Contador regressivo até início/fim da promoção
4. **Products Grid Section:** Grid responsivo com cards de produtos
5. **Product Card:** Card individual contendo imagem, nome, preços, desconto, informações e botão CTA
6. **Footer Section:** Copyright e links (mantém estrutura existente)

### 3.4 Accessibility: WCAG AA

A página deve atender aos requisitos WCAG AA:

- Contraste adequado de cores (mínimo 4.5:1 para texto normal, 3:1 para texto grande)
- Navegação por teclado funcional
- Alt text em todas as imagens
- Estrutura semântica HTML adequada
- Labels descritivos para elementos interativos

### 3.5 Branding

**IMPORTANTE:** A identidade visual deve ser **idêntica** à página atual da lista VIP. Todos os elementos visuais devem seguir exatamente o mesmo padrão estabelecido.

- **Cores:** Usar exatamente a mesma paleta de cores da landing page atual (vermelho/vermelho escuro para acentos, fundo escuro, texto claro) - variáveis CSS existentes devem ser reutilizadas
- **Tipografia:** Manter exatamente a mesma fonte Inter e tamanhos de texto da página atual
- **Estilo:** Design moderno, limpo, profissional, **100% alinhado com a landing page atual da lista VIP**
- **Logo:** Usar os mesmos logos existentes (logo-rz-vet.png e logo-rz-vet-alt.png)
- **Componentes visuais:** Reutilizar estilos de botões, cards, bordas, sombras e espaçamentos da página atual
- **Consistência:** A página de promoções deve parecer uma extensão natural da landing page, mantendo a mesma "cara" visual

### 3.6 Target Device and Platforms: Web Responsive

A página deve ser totalmente responsiva e funcionar perfeitamente em:

- Dispositivos móveis (smartphones)
- Tablets
- Desktops
- Todos os navegadores modernos

---

## 4. Technical Assumptions

### 4.1 Repository Structure: Monorepo

O projeto mantém a estrutura atual como monorepo, com frontend em `public/` e backend em `server/`.

### 4.2 Service Architecture

**Arquitetura:** Aplicação web estática servida pelo Express.js existente, com API para leads.

**Frontend:**

- HTML5 semântico
- CSS3 puro (sem frameworks adicionais, **reutilizando estilos existentes** de `public/styles.css`)
- JavaScript ES6+ (Vanilla JS, reutilizando funções existentes quando possível)
- Estrutura de arquivos em `public/`
- **Reutilizar variáveis CSS, classes e componentes visuais da landing page atual para garantir identidade visual idêntica**

**Backend:**

- Express.js (já configurado)
- Rotas estáticas para servir HTML/CSS/JS
- API existente para leads (mantida)

**Dados dos Produtos:**

- Opção 1: Arquivo JSON estático em `public/data/products.json` (recomendado para MVP)
- Opção 2: Endpoint API `/api/products` que retorna dados dos produtos (futuro)

### 4.3 Testing Requirements

**MVP:** Testes manuais de funcionalidade e responsividade

- Validação visual em diferentes dispositivos
- Teste de links e redirecionamentos
- Validação de Meta Pixel events
- Teste de acessibilidade básica

**Futuro:** Implementar testes automatizados conforme necessário

### 4.4 Additional Technical Assumptions and Requests

- **Imagens:** Usar imagens existentes em `valores-black/` como base. Converter para WebP quando possível.
- **URLs dos Produtos:** As URLs dos produtos no rzvet.com.br devem ser fornecidas pelo cliente ou extraídas do site existente.
- **Meta Pixel:** Manter integração existente, adicionar eventos específicos para visualização de produtos e cliques em "Ver Produto".
- **Performance:** Otimizar imagens (compressão, lazy loading) para garantir carregamento rápido.
- **SEO:** Adicionar meta tags apropriadas (title, description, Open Graph) para a página de promoções.
- **Deploy:** A página será servida pelo mesmo servidor Express.js existente, adicionando nova rota.

---

## 5. Epic List

### Epic 1: Estrutura Base e Dados dos Produtos

Estabelecer a estrutura HTML base da página de promoções, criar arquivo de dados dos produtos com todas as informações necessárias, e implementar a seção de headline com suporte a banners.

### Epic 2: Layout e Cards de Produtos

Implementar o layout responsivo em grid, criar os cards de produtos com todas as informações (imagem, nome, preços, desconto, especificações) e estilização completa seguindo o design system existente.

### Epic 3: Integrações e Funcionalidades

Implementar contador regressivo, integração com Meta Pixel para rastreamento de eventos, links para páginas de produto no rzvet.com.br, e otimizações de performance.

### Epic 4: Refinamentos e Acessibilidade

Aplicar melhorias de acessibilidade (WCAG AA), otimizações de SEO, testes de responsividade em diferentes dispositivos, e ajustes finais de design (pixel perfect).

---

## 6. Epic Details

### Epic 1: Estrutura Base e Dados dos Produtos

**Objetivo Expandido:**
Criar a estrutura HTML base da página de promoções, incluindo header, seção de headline para banners, e preparar o arquivo de dados JSON com todas as informações dos produtos (nome, preço original, preço promocional, desconto, URL, imagem, especificações). Esta epic estabelece a fundação para todas as funcionalidades subsequentes.

#### Story 1.1: Criar estrutura HTML base da página de promoções

**Como um** visitante do site,
**Eu quero** acessar uma página dedicada às promoções da Black Friday,
**Para que** eu possa visualizar todos os produtos em promoção de forma organizada.

**Acceptance Criteria:**

1. Criar arquivo HTML `public/promocoes.html` (ou rota equivalente)
2. Incluir estrutura HTML5 semântica com `<header>`, `<main>`, `<section>`, `<footer>`
3. Manter header existente com logo RZ VET e badge "Black Days 2025"
4. Criar seção de headline com container para banners promocionais (estrutura preparada, conteúdo pode ser adicionado depois)
5. Criar seção principal para produtos (container vazio, será populado na próxima story)
6. Manter footer existente com copyright e link para rzvet.com.br
7. Incluir links para CSS e JS existentes, além de Meta Pixel
8. Adicionar meta tags básicas (title, description, charset, viewport)

#### Story 1.2: Criar arquivo de dados JSON com informações dos produtos

**Como um** desenvolvedor,
**Eu quero** ter um arquivo JSON estruturado com todas as informações dos produtos,
**Para que** os dados possam ser facilmente consumidos e atualizados.

**Acceptance Criteria:**

1. Criar arquivo `public/data/products.json` com estrutura JSON válida
2. Incluir array de produtos com os seguintes campos para cada produto:
   - `id`: identificador único (string)
   - `name`: nome do produto (string)
   - `slug`: slug para URL (string)
   - `image`: caminho relativo para imagem (string, ex: `/valores-black/monitor-rm1200.png`)
   - `price_original`: preço original em reais (number, opcional)
   - `price_promotional`: preço promocional em reais (number)
   - `discount_percentage`: percentual de desconto (number)
   - `url`: URL completa para página do produto no rzvet.com.br (string)
   - `specifications`: array de strings com especificações principais (array)
   - `description`: descrição breve do produto (string, opcional)
   - `available`: se o produto está disponível (boolean)
3. Incluir todos os 12 produtos identificados:
   - Aparelho de Anestesia VP1000
   - Bomba de Seringa M200A
   - Central de Controle Workstation
   - Kit 4 Bomba de Seringa
   - Monitor Portátil R1000
   - Monitor Portátil R200
   - Bomba de Equipo RE700
   - Monitor RM-700
   - Monitor RM1200
   - Neurostim
   - Oxímetro
   - Vent-Pet 2.0
4. Valores devem ser extraídos do Excel ou fornecidos pelo cliente (usar placeholders se necessário)
5. URLs dos produtos devem ser fornecidas ou seguir padrão `https://rzvet.com.br/produto/[slug]`
6. Arquivo deve ser válido JSON e seguir estrutura consistente

#### Story 1.3: Implementar seção de headline com suporte a banners

**Como um** visitante do site,
**Eu quero** ver banners promocionais impactantes no topo da página,
**Para que** eu seja atraído pelas ofertas e promoções principais.

**Acceptance Criteria:**

1. Criar seção `.headline-banner` no HTML
2. Implementar container flexível que suporte:
   - Imagem única de banner
   - Carrossel de múltiplos banners (estrutura preparada, funcionalidade pode ser adicionada depois)
3. Seção deve ser responsiva e ocupar largura total da viewport
4. Altura deve ser adaptável ao conteúdo (recomendado: 300-500px em desktop, proporcional em mobile)
5. Adicionar estilos CSS básicos para a seção (pode ser refinado depois)
6. Preparar estrutura para adicionar banners via HTML ou via dados JSON (opcional)

---

### Epic 2: Layout e Cards de Produtos

**Objetivo Expandido:**
Implementar o layout responsivo em grid para exibir os produtos, criar cards visuais atraentes para cada produto com todas as informações (imagem, nome, preços formatados, badge de desconto, especificações, botão CTA), e aplicar estilização completa seguindo o design system existente da landing page.

#### Story 2.1: Implementar grid responsivo para exibição de produtos

**Como um** visitante do site,
**Eu quero** ver os produtos organizados em um layout limpo e responsivo,
**Para que** eu possa navegar facilmente entre os produtos em qualquer dispositivo.

**Acceptance Criteria:**

1. Criar seção `.products-section` no HTML
2. Implementar grid CSS responsivo que:
   - Exiba 1 coluna em mobile (< 768px)
   - Exiba 2 colunas em tablet (768px - 1023px)
   - Exiba 3 colunas em desktop (≥ 1024px)
3. Grid deve ter gap adequado entre cards (recomendado: 1.5rem - 2rem)
4. Grid deve ser centralizado e ter largura máxima (seguir padrão `.container` existente)
5. Adicionar estilos CSS **reutilizando classes e variáveis existentes** da landing page (cores, espaçamentos, tipografia devem ser idênticos)
6. Grid deve funcionar corretamente em todos os tamanhos de tela testados

#### Story 2.2: Criar componente de card de produto com informações básicas

**Como um** visitante do site,
**Eu quero** ver informações claras sobre cada produto em cards visuais,
**Para que** eu possa entender rapidamente o que está sendo oferecido.

**Acceptance Criteria:**

1. Criar estrutura HTML para `.product-card` dentro do grid
2. Card deve conter:
   - Container para imagem do produto
   - Nome do produto (h3 ou elemento semântico equivalente)
   - Container para informações de preço (estrutura preparada)
   - Container para especificações (estrutura preparada)
   - Container para botão CTA (estrutura preparada)
3. Card deve ter estilo visual **idêntico aos cards da landing page atual** (reutilizar classes CSS existentes):
   - Fundo escuro com borda sutil (mesmas cores e valores)
   - Border-radius igual aos cards existentes
   - Padding interno igual aos cards existentes
   - Transições suaves em hover (mesmos efeitos)
4. Implementar JavaScript para carregar dados de `products.json` e renderizar cards dinamicamente
5. Cards devem ser renderizados corretamente com dados reais dos produtos
6. Adicionar estados de hover com efeitos visuais sutis (elevação, mudança de borda)

#### Story 2.3: Implementar exibição de preços e badge de desconto

**Como um** visitante do site,
**Eu quero** ver claramente os preços originais, preços promocionais e percentual de desconto,
**Para que** eu possa avaliar o valor da promoção.

**Acceptance Criteria:**

1. Dentro de cada card, criar seção `.product-pricing` que exiba:
   - Preço original (se existir) com estilo riscado e cor mais clara
   - Preço promocional em destaque (maior, cor mais vibrante)
   - Badge de desconto mostrando percentual (ex: "-30%")
2. Badge de desconto deve ser visualmente destacado:
   - Cor de destaque (vermelho/vermelho claro)
   - Posicionamento adequado (canto superior direito do card ou próximo ao preço)
   - Formato: "-X%" ou "X% OFF"
3. Preços devem ser formatados em Real brasileiro (R$ X.XXX,XX)
4. Se não houver preço original, exibir apenas preço promocional
5. Estilização deve seguir **exatamente os mesmos padrões visuais** da landing page (cores, tipografia, espaçamentos - reutilizar classes existentes)
6. Implementar lógica JavaScript para formatar e exibir preços corretamente

#### Story 2.4: Adicionar imagens dos produtos e especificações técnicas

**Como um** visitante do site,
**Eu quero** ver imagens dos produtos e suas especificações técnicas,
**Para que** eu possa entender melhor o que estou comprando.

**Acceptance Criteria:**

1. Implementar exibição de imagem do produto no card:
   - Imagem deve ocupar área adequada no topo do card
   - Aspect ratio mantido (evitar distorção)
   - Lazy loading implementado para performance
   - Alt text descritivo baseado no nome do produto
2. Criar seção `.product-specifications` que exiba:
   - Lista de especificações principais (máximo 3-5 itens mais relevantes)
   - Formato: lista não ordenada ou tags
   - Estilo visual limpo e legível
3. Especificações devem ser carregadas do arquivo `products.json`
4. Se produto não tiver especificações, seção deve ser ocultada ou exibir mensagem padrão
5. Imagens devem ter fallback caso não carreguem (placeholder ou tratamento de erro)
6. Adicionar estilos CSS para imagens e especificações seguindo design system

#### Story 2.5: Implementar botão "Ver Produto" com link para rzvet.com.br

**Como um** visitante do site,
**Eu quero** clicar em um botão claro para ver mais detalhes do produto,
**Para que** eu possa ser direcionado para a página completa do produto no site principal.

**Acceptance Criteria:**

1. Criar botão `.product-cta-button` ou `.btn-ver-produto` em cada card
2. Botão deve ter:
   - Texto "Ver Produto" (ou equivalente)
   - **Estilo visual idêntico ao botão de submit da landing page** (reutilizar classes `.submit-button` ou criar estilo baseado nele)
   - Estados de hover e active com feedback visual (mesmos efeitos da landing page)
   - Link para URL do produto em rzvet.com.br (campo `url` do JSON)
3. Link deve abrir em nova aba (`target="_blank"`) com `rel="noopener noreferrer"`
4. Botão deve ser acessível (navegação por teclado, aria-labels se necessário)
5. Implementar lógica JavaScript para adicionar URLs dinamicamente a partir do JSON
6. Botão deve ter tamanho adequado e ser facilmente clicável em mobile
7. Adicionar ícone opcional (seta, etc.) para indicar ação externa

---

### Epic 3: Integrações e Funcionalidades

**Objetivo Expandido:**
Implementar contador regressivo para a promoção, integrar eventos do Meta Pixel para rastreamento de visualizações e cliques, garantir que todos os links funcionem corretamente, e aplicar otimizações de performance para garantir carregamento rápido.

#### Story 3.1: Implementar contador regressivo para início da promoção

**Como um** visitante do site,
**Eu quero** ver um contador mostrando o tempo restante até o início da promoção,
**Para que** eu saiba quando as ofertas estarão disponíveis.

**Acceptance Criteria:**

1. Criar seção `.countdown-section` no HTML (pode reutilizar estrutura existente da landing page)
2. Implementar contador regressivo que:
   - Mostre dias, horas, minutos e segundos
   - Conte regressivamente até 14 de novembro de 2025 às 11:30 (horário de São Paulo)
   - Atualize a cada segundo
   - Exiba mensagem apropriada quando a promoção iniciar
3. Reutilizar lógica JavaScript existente de countdown da landing page (se possível)
4. Estilização deve seguir padrão visual existente
5. Contador deve ser responsivo e legível em todos os dispositivos
6. Adicionar tratamento para quando a data passar (exibir "Promoção em andamento" ou similar)

#### Story 3.2: Integrar Meta Pixel para rastreamento de visualizações e cliques

**Como um** gestor de marketing,
**Eu quero** rastrear visualizações de produtos e cliques no botão "Ver Produto" via Meta Pixel,
**Para que** eu possa medir a eficácia da campanha e otimizar anúncios.

**Acceptance Criteria:**

1. Manter integração existente do Meta Pixel (já presente no HTML)
2. Adicionar evento `ViewContent` quando um produto é visualizado:
   - Disparar quando produto entra na viewport (Intersection Observer)
   - Incluir dados: `content_name` (nome do produto), `content_category` ("Equipamentos Veterinários"), `content_ids` (ID do produto)
3. Adicionar evento `Lead` ou `InitiateCheckout` quando botão "Ver Produto" é clicado:
   - Disparar no clique do botão
   - Incluir dados: `content_name`, `content_category`, `value` (preço promocional), `currency` ("BRL")
4. Implementar lógica JavaScript para disparar eventos corretamente
5. Testar eventos no Facebook Events Manager ou Pixel Helper
6. Garantir que eventos não sejam duplicados (debounce/throttle se necessário)
7. Adicionar tratamento de erro caso Meta Pixel não esteja carregado

#### Story 3.3: Validar e corrigir links para páginas de produto

**Como um** visitante do site,
**Eu quero** que os links "Ver Produto" me direcionem corretamente para as páginas de produto,
**Para que** eu possa ver informações completas e realizar a compra.

**Acceptance Criteria:**

1. Validar todas as URLs dos produtos no arquivo `products.json`
2. Testar cada link manualmente para garantir que:
   - URL está correta e acessível
   - Página de destino existe e está funcionando
   - Produto corresponde ao esperado
3. Corrigir URLs incorretas ou adicionar placeholders se URLs não estiverem disponíveis
4. Implementar tratamento de erro caso link esteja quebrado (opcional: validação client-side)
5. Garantir que links abrem em nova aba corretamente
6. Documentar URLs finais no arquivo JSON ou documentação

#### Story 3.4: Otimizar performance (imagens, lazy loading, minificação)

**Como um** visitante do site,
**Eu quero** que a página carregue rapidamente,
**Para que** eu tenha uma experiência fluida mesmo em conexões mais lentas.

**Acceptance Criteria:**

1. Implementar lazy loading para imagens dos produtos:
   - Usar `loading="lazy"` nativo ou Intersection Observer
   - Imagens devem carregar apenas quando próximas da viewport
2. Otimizar imagens:
   - Converter para WebP quando possível (com fallback)
   - Comprimir imagens sem perda significativa de qualidade
   - Redimensionar imagens para tamanhos adequados (não carregar imagens maiores que necessário)
3. Minificar CSS e JavaScript para produção (ou usar build process)
4. Adicionar preload para recursos críticos (CSS, fontes)
5. Testar performance com Lighthouse ou ferramenta similar:
   - Performance score mínimo: 80
   - First Contentful Paint < 2s
   - Largest Contentful Paint < 2.5s
6. Implementar cache headers adequados (se servidor permitir)

---

### Epic 4: Refinamentos e Acessibilidade

**Objetivo Expandido:**
Aplicar melhorias de acessibilidade para atender WCAG AA, adicionar meta tags de SEO, realizar testes de responsividade em diferentes dispositivos e navegadores, e fazer ajustes finais de design para garantir pixel perfect em todos os breakpoints.

#### Story 4.1: Implementar melhorias de acessibilidade (WCAG AA)

**Como um** usuário com necessidades de acessibilidade,
**Eu quero** navegar a página usando teclado e leitores de tela,
**Para que** eu possa acessar todas as informações e funcionalidades.

**Acceptance Criteria:**

1. Adicionar alt text descritivo em todas as imagens:
   - Descrever produto e contexto
   - Evitar texto redundante ("imagem de...")
2. Garantir contraste de cores adequado:
   - Texto normal: mínimo 4.5:1
   - Texto grande: mínimo 3:1
   - Validar com ferramenta de contraste
3. Implementar navegação por teclado:
   - Todos os elementos interativos devem ser focáveis
   - Ordem de tab deve ser lógica
   - Indicadores de foco visíveis
4. Adicionar labels e aria-labels onde necessário:
   - Botões devem ter texto descritivo ou aria-label
   - Links devem ter contexto claro
5. Estrutura semântica HTML:
   - Usar headings hierarquicamente (h1, h2, h3)
   - Usar landmarks (nav, main, section, footer)
   - Listas para grupos de itens relacionados
6. Testar com leitor de tela (NVDA, JAWS, ou VoiceOver)
7. Validar com ferramenta automatizada (axe DevTools, WAVE, ou similar)

#### Story 4.2: Adicionar meta tags de SEO e Open Graph

**Como um** gestor de marketing,
**Eu quero** que a página seja otimizada para SEO e compartilhamento em redes sociais,
**Para que** ela apareça bem nos resultados de busca e quando compartilhada.

**Acceptance Criteria:**

1. Adicionar meta tags essenciais no `<head>`:
   - `<title>`: Título descritivo e otimizado
   - `<meta name="description">`: Descrição atrativa (150-160 caracteres)
   - `<meta name="keywords">`: Palavras-chave relevantes (opcional)
2. Adicionar Open Graph tags para compartilhamento:
   - `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
3. Adicionar Twitter Card tags (opcional mas recomendado)
4. Adicionar canonical URL
5. Criar imagem de compartilhamento (1200x630px) se necessário
6. Validar meta tags com ferramentas (Facebook Sharing Debugger, Twitter Card Validator)

#### Story 4.3: Testar responsividade em diferentes dispositivos e navegadores

**Como um** desenvolvedor,
**Eu quero** garantir que a página funcione perfeitamente em todos os dispositivos e navegadores,
**Para que** todos os usuários tenham uma experiência consistente.

**Acceptance Criteria:**

1. Testar em diferentes tamanhos de tela:
   - Mobile: 320px, 375px, 414px (iPhone SE, iPhone 12/13, iPhone Pro Max)
   - Tablet: 768px, 1024px (iPad, iPad Pro)
   - Desktop: 1280px, 1920px (HD, Full HD)
2. Testar em diferentes navegadores:
   - Chrome (últimas 2 versões)
   - Firefox (últimas 2 versões)
   - Safari (últimas 2 versões)
   - Edge (última versão)
3. Validar que:
   - Layout não quebra em nenhum tamanho
   - Textos são legíveis
   - Botões e links são clicáveis
   - Imagens não distorcem
   - Grid se adapta corretamente
4. Corrigir problemas encontrados
5. Documentar breakpoints utilizados e decisões de design responsivo

#### Story 4.4: Ajustes finais de design (pixel perfect)

**Como um** designer,
**Eu quero** que a página esteja pixel perfect em todos os breakpoints,
**Para que** ela corresponda exatamente às especificações de design.

**Acceptance Criteria:**

1. Revisar todos os espaçamentos (margins, paddings):
   - Seguir grid system consistente
   - Espaçamentos devem ser proporcionais em todos os breakpoints
2. Revisar tipografia:
   - Tamanhos de fonte consistentes
   - Line-heights adequados
   - Hierarquia visual clara
3. Revisar cores e contrastes:
   - Cores devem corresponder ao design system
   - Gradientes e sombras aplicados corretamente
4. Revisar animações e transições:
   - Suaves e consistentes
   - Não causam problemas de performance
5. Validar alinhamentos:
   - Elementos alinhados corretamente
   - Grid respeitado
6. Fazer ajustes finais baseados em feedback visual
7. Garantir **100% de consistência visual** com landing page existente - a página de promoções deve parecer uma extensão natural da lista VIP, com identidade visual idêntica

---

## 7. Checklist Results Report

**Data da Validação:** 13 de Novembro de 2025  
**Validador:** Product Owner (PO Master Checklist)  
**Tipo de Projeto:** Brownfield com UI/UX  
**Status Geral:** ✅ **APROVADO COM RECOMENDAÇÕES**

---

### Executive Summary

- **Tipo de Projeto:** Brownfield (adicionando nova página a sistema existente) com UI/UX
- **Readiness Geral:** 92% - Pronto para desenvolvimento com pequenos ajustes recomendados
- **Recomendação:** ✅ **GO** - Pode prosseguir com desenvolvimento
- **Issues Críticas:** 0
- **Issues de Atenção:** 3 (não bloqueantes)
- **Seções Puladas:** Seção 1.1 (Project Scaffolding - apenas para greenfield)

---

### Análise por Categoria

#### 1. Project Setup & Initialization ✅

**Status:** APROVADO

- ✅ **1.2 Existing System Integration:** Excelente análise do sistema existente
  - PRD identifica claramente que é extensão da landing page existente
  - Reutilização de header, footer, CSS e JS existentes bem documentada
  - Integração com Meta Pixel existente preservada
  - **Recomendação:** Adicionar nota sobre preservar funcionalidade da landing page atual durante desenvolvimento

- ✅ **1.3 Development Environment:** Bem definido
  - Estrutura de arquivos clara (`public/` para frontend)
  - Express.js já configurado
  - Dependências existentes serão reutilizadas

- ✅ **1.4 Core Dependencies:** Adequado
  - Sem novas dependências críticas necessárias
  - Reutilização de CSS e JS existentes

**Issues:** Nenhuma

---

#### 2. Infrastructure & Deployment ✅

**Status:** APROVADO

- ✅ **2.2 API & Service Configuration:** Bem estruturado
  - Express.js já configurado
  - Nova rota estática será adicionada (Story 1.1)
  - API de leads existente será mantida intacta

- ✅ **2.3 Deployment Pipeline:** Adequado
  - Mesmo servidor Express.js
  - Deploy será simples (adicionar arquivo HTML e rota)

**Issues:** Nenhuma

---

#### 3. External Dependencies & Integrations ✅

**Status:** APROVADO COM ATENÇÃO

- ✅ **3.1 Third-Party Services:** Meta Pixel já integrado
  - Integração existente será mantida
  - Novos eventos serão adicionados (Story 3.2)

- ⚠️ **3.2 External APIs:** **ATENÇÃO**
  - URLs dos produtos em rzvet.com.br precisam ser validadas (Story 3.3)
  - **Recomendação:** Definir processo de validação de URLs antes da Story 3.3
  - Placeholders podem ser usados inicialmente, mas URLs reais devem ser confirmadas

**Issues:** 1 (não crítico - URLs dos produtos)

---

#### 4. UI/UX Considerations ✅

**Status:** APROVADO

- ✅ **4.1 Design System Setup:** Excelente abordagem
  - Reutilização explícita de estilos existentes
  - Identidade visual idêntica bem documentada (NFR5, Seção 3.5)
  - Variáveis CSS existentes serão reutilizadas

- ✅ **4.2 Frontend Infrastructure:** Bem planejado
  - Estrutura HTML5 semântica
  - CSS puro (sem frameworks adicionais)
  - JavaScript ES6+ (reutilizando funções existentes quando possível)

- ✅ **4.3 User Experience Flow:** Bem definido
  - User journeys claros (scroll vertical, cards, hover states)
  - Estados de erro e loading considerados
  - Acessibilidade WCAG AA incluída (Epic 4)

**Issues:** Nenhuma

---

#### 5. User/Agent Responsibility ✅

**Status:** APROVADO

- ✅ **5.1 User Actions:** Apropriadamente definidas
  - Validação de URLs dos produtos (Story 3.3) - ação do usuário/cliente
  - Fornecimento de dados do Excel (Story 1.2) - ação do usuário

- ✅ **5.2 Developer Agent Actions:** Bem atribuídas
  - Todo código será desenvolvido pelo agente
  - Implementação de funcionalidades claramente atribuída

**Issues:** Nenhuma

---

#### 6. Feature Sequencing & Dependencies ✅

**Status:** APROVADO

- ✅ **6.1 Functional Dependencies:** Sequenciamento lógico perfeito
  - Epic 1 estabelece base (HTML, dados JSON)
  - Epic 2 constrói sobre Epic 1 (layout, cards)
  - Epic 3 adiciona funcionalidades (countdown, Meta Pixel, links)
  - Epic 4 refina (acessibilidade, SEO, testes)
  - Nenhuma dependência circular identificada

- ✅ **6.2 Technical Dependencies:** Bem ordenado
  - Dados JSON criados antes de serem consumidos (Story 1.2 → Story 2.2)
  - Estrutura HTML antes de estilização (Story 1.1 → Story 2.1)
  - Cards criados antes de integrações (Epic 2 → Epic 3)

- ✅ **6.3 Cross-Epic Dependencies:** Excelente progressão
  - Cada epic constrói sobre anteriores
  - Valor incremental entregue em cada epic
  - Sistema existente preservado em todos os epics

**Issues:** Nenhuma

---

#### 7. Risk Management (Brownfield) ✅

**Status:** APROVADO COM ATENÇÃO

- ✅ **7.1 Breaking Change Risks:** Riscos minimizados
  - Nova página não afeta landing page existente
  - Mesma infraestrutura, sem mudanças no código existente
  - Meta Pixel existente preservado, apenas eventos adicionados

- ⚠️ **7.2 Rollback Strategy:** **ATENÇÃO**
  - **Recomendação:** Documentar processo de rollback simples (remover arquivo HTML e rota se necessário)
  - Feature flags não necessários (página isolada)
  - Backup não necessário (código em Git)

- ✅ **7.3 User Impact Mitigation:** Sem impacto
  - Landing page existente não será alterada
  - Nova página é adição, não modificação

**Issues:** 1 (não crítico - documentação de rollback)

---

#### 8. MVP Scope Alignment ✅

**Status:** APROVADO

- ✅ **8.1 Core Goals Alignment:** 100% alinhado
  - Todos os 8 goals do PRD são endereçados nas stories
  - Nenhuma feature além do escopo MVP
  - Fase 2 (produtos de consumo) claramente separada (FR9)

- ✅ **8.2 User Journey Completeness:** Completo
  - Jornada do usuário bem mapeada (visualizar produtos → ver detalhes → clicar em "Ver Produto")
  - Estados de erro considerados (imagens não carregam, links quebrados)
  - Acessibilidade incluída (Epic 4)

- ✅ **8.3 Technical Requirements:** Todos atendidos
  - Todos os 12 FRs e 8 NFRs endereçados
  - Arquitetura alinhada com constraints
  - Performance considerada (Story 3.4)

**Issues:** Nenhuma

---

#### 9. Documentation & Handoff ✅

**Status:** APROVADO COM RECOMENDAÇÃO

- ✅ **9.1 Developer Documentation:** Bem estruturado
  - PRD completo e detalhado
  - Acceptance criteria claros em todas as stories
  - Arquitetura técnica documentada (Seção 4)

- ⚠️ **9.2 User Documentation:** **RECOMENDAÇÃO**
  - **Recomendação:** Considerar documentação de como atualizar `products.json` para futuras promoções
  - Processo de adicionar novos produtos pode ser útil

- ✅ **9.3 Knowledge Transfer:** Adequado
  - PRD serve como documentação completa
  - Estrutura de código existente será seguida

**Issues:** 1 (não crítico - documentação de manutenção)

---

#### 10. Post-MVP Considerations ✅

**Status:** APROVADO

- ✅ **10.1 Future Enhancements:** Bem separado
  - Fase 2 (produtos de consumo) claramente identificada como futura (FR9)
  - Arquitetura preparada para extensão (Story 1.1 menciona preparação)
  - Sem technical debt introduzido

- ✅ **10.2 Monitoring & Feedback:** Considerado
  - Meta Pixel para rastreamento (Story 3.2)
  - Performance monitoring via Lighthouse (Story 3.4)

**Issues:** Nenhuma

---

### Risk Assessment

#### Top 5 Riscos Identificados

1. **RISCO BAIXO:** URLs dos produtos podem não estar disponíveis no início
   - **Mitigação:** Usar placeholders e validar antes da Story 3.3
   - **Impacto no Timeline:** Mínimo (pode ser feito em paralelo)

2. **RISCO BAIXO:** Dados do Excel podem precisar de limpeza/organização
   - **Mitigação:** Story 1.2 permite placeholders, dados podem ser refinados depois
   - **Impacto no Timeline:** Mínimo

3. **RISCO MUITO BAIXO:** Performance pode ser afetada por muitas imagens
   - **Mitigação:** Story 3.4 aborda otimização (lazy loading, WebP, compressão)
   - **Impacto no Timeline:** Nenhum (já planejado)

4. **RISCO MUITO BAIXO:** Inconsistência visual com landing page
   - **Mitigação:** NFR5 e múltiplas stories enfatizam reutilização de estilos
   - **Impacto no Timeline:** Nenhum (bem documentado)

5. **RISCO MUITO BAIXO:** Meta Pixel events podem não funcionar corretamente
   - **Mitigação:** Story 3.2 inclui testes e tratamento de erros
   - **Impacto no Timeline:** Nenhum (já planejado)

**Nível Geral de Risco:** 🟢 **BAIXO**

---

### MVP Completeness

- ✅ **Core Features Coverage:** 100%
  - Todos os 12 FRs endereçados
  - Todos os 8 NFRs considerados

- ✅ **Missing Essential Functionality:** Nenhuma identificada

- ✅ **Scope Creep:** Nenhum identificado
  - Fase 2 claramente separada
  - MVP bem definido

- ✅ **True MVP vs Over-engineering:** Perfeito equilíbrio
  - Funcionalidades essenciais incluídas
  - Sem over-engineering
  - Preparação para futuro sem complexidade desnecessária

---

### Implementation Readiness

- **Developer Clarity Score:** 9/10
  - Acceptance criteria claros e testáveis
  - Sequenciamento lógico
  - Dependências bem identificadas
  - **Ponto de melhoria:** Alguns detalhes técnicos podem ser refinados durante arquitetura

- **Ambiguous Requirements Count:** 0 críticos
  - Todos os requisitos são claros
  - Pequenas ambiguidades podem ser resolvidas durante desenvolvimento

- **Missing Technical Details:** Mínimos
  - Estrutura de rota específica não definida (Story 1.1 menciona `/promocoes` ou equivalente)
  - **Recomendação:** Definir rota exata na arquitetura

- **Integration Point Clarity:** Excelente
  - Reutilização de código existente bem documentada
  - Pontos de integração claros (header, footer, CSS, JS, Meta Pixel)

---

### Recomendações

#### Must-Fix Before Development (0 itens)
Nenhum item bloqueante identificado.

#### Should-Fix for Quality (3 itens)

1. **Definir rota exata da página**
   - Story 1.1 menciona `/promocoes` ou equivalente
   - **Ação:** Definir rota final na arquitetura (ex: `/promocoes`, `/black-friday`, `/promocoes-black-friday`)

2. **Documentar processo de atualização de produtos**
   - `products.json` será atualizado no futuro
   - **Ação:** Adicionar nota na Story 1.2 sobre formato e processo de atualização

3. **Validar URLs dos produtos antes da Story 3.3**
   - **Ação:** Criar checklist de validação de URLs ou processo de confirmação com cliente

#### Consider for Improvement (2 itens)

1. **Adicionar testes automatizados básicos** (pós-MVP)
   - Atualmente apenas testes manuais (NFR4)
   - Pode ser considerado para futuras iterações

2. **Documentar processo de rollback simples**
   - Embora risco seja baixo, documentação ajuda

#### Post-MVP Deferrals
- Seção de produtos de consumo (Fase 2) - já identificada como futura

---

### Brownfield Integration Confidence

- **Confidence em Preservar Funcionalidade Existente:** 🟢 **MUITO ALTA (95%)**
  - Nova página isolada, não modifica código existente
  - Apenas adiciona arquivo HTML e rota
  - Zero risco de quebrar funcionalidade existente

- **Rollback Procedure Completeness:** 🟡 **MODERADA**
  - Rollback é simples (remover arquivo e rota)
  - **Recomendação:** Documentar processo (não crítico)

- **Monitoring Coverage:** 🟢 **ADEQUADA**
  - Meta Pixel já monitora eventos
  - Performance será testada (Story 3.4)

- **Support Team Readiness:** 🟢 **ADEQUADA**
  - PRD completo serve como documentação
  - Estrutura simples facilita suporte

---

### Category Status Summary

| Categoria                                | Status | Issues Críticas | Issues Atenção |
| ---------------------------------------- | ------ | ---------------- | -------------- |
| 1. Project Setup & Initialization        | ✅     | 0                | 0              |
| 2. Infrastructure & Deployment          | ✅     | 0                | 0              |
| 3. External Dependencies & Integrations | ⚠️     | 0                | 1              |
| 4. UI/UX Considerations                 | ✅     | 0                | 0              |
| 5. User/Agent Responsibility            | ✅     | 0                | 0              |
| 6. Feature Sequencing & Dependencies    | ✅     | 0                | 0              |
| 7. Risk Management (Brownfield)         | ⚠️     | 0                | 1              |
| 8. MVP Scope Alignment                  | ✅     | 0                | 0              |
| 9. Documentation & Handoff              | ⚠️     | 0                | 1              |
| 10. Post-MVP Considerations             | ✅     | 0                | 0              |

**Total:** 7 categorias aprovadas, 3 com recomendações não bloqueantes

---

### Critical Deficiencies

**Nenhuma deficiência crítica identificada.**

O PRD está bem estruturado, completo e pronto para desenvolvimento. As recomendações são melhorias de qualidade, não bloqueantes.

---

### Final Decision

✅ **APPROVED** - O plano está compreensivo, adequadamente sequenciado e pronto para implementação.

**Justificativa:**
- Todas as dependências estão claramente identificadas e sequenciadas
- MVP scope está bem definido e alinhado com goals
- Riscos são baixos e mitigados
- Integração com sistema existente é segura (página isolada)
- Acceptance criteria são claros e testáveis
- Documentação é completa

**Recomendações finais:**
1. Prosseguir com desenvolvimento conforme planejado
2. Resolver as 3 recomendações "Should-Fix" durante arquitetura/desenvolvimento inicial
3. Manter comunicação sobre validação de URLs dos produtos

---

**Validação concluída em:** 13 de Novembro de 2025  
**Status de Implementação:**
1. ✅ Criar arquitetura técnica detalhada (Seção 8.2) - **CONCLUÍDO**
2. ✅ Criar especificação de front-end (Seção 8.1) - **CONCLUÍDO**
3. ✅ Implementação Fase 1 - **CONCLUÍDA E EM PRODUÇÃO**
   - Página acessível em `/` (rota raiz)
   - 12 produtos exibidos com valores corretos
   - Todas as funcionalidades implementadas
   - Meta Pixel integrado e funcionando

---

## 8. Next Steps

### 8.1 UX Expert Prompt

Crie a especificação de front-end detalhada para a página de promoções da Black Friday RZ VET baseada neste PRD. Foque em wireframes, especificações de componentes visuais, estados de interação, e diretrizes de design que garantam uma experiência pixel perfect e profissional.

### 8.2 Architect Prompt

Crie a arquitetura técnica detalhada para implementação da página de promoções da Black Friday RZ VET baseada neste PRD. Foque em estrutura de arquivos, organização de código, padrões de implementação, e decisões técnicas que garantam manutenibilidade e performance.

---

**Fim do Documento**
