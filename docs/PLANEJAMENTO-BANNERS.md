# Planejamento - Sistema de Banners Black Friday RZ VET

**Data:** 13 de Novembro de 2025  
**Status:** 📋 PLANEJAMENTO - Aguardando Aprovação  
**Versão:** 1.0

---

## 📊 Resumo Executivo

### Objetivo
Implementar sistema de banners promocionais com:
1. **Carrossel de banners na hero** - Largura total, estilo e-commerce, com slides automáticos
2. **Banner entre seções** - Banner menor entre equipamentos e acessórios

### Requisitos
- Carrossel com transições suaves
- Controles de navegação (setas, indicadores)
- Autoplay configurável
- Placeholders para substituição futura
- Responsivo e acessível
- Performance otimizada

---

## 🎯 Análise de Requisitos

### Banner 1: Carrossel Hero (Full-Width)

**Características:**
- Largura: 100% da viewport (full-width)
- Altura: 400-600px desktop, proporcional mobile
- Estilo: E-commerce profissional
- Funcionalidade: Carrossel com múltiplos slides
- Transição: Suave, fade ou slide
- Autoplay: Sim, com pausa no hover
- Controles: Setas laterais + indicadores (dots)
- Acessibilidade: Navegação por teclado, ARIA labels

### Banner 2: Banner Entre Seções

**Características:**
- Largura: Container (mesma largura das seções)
- Altura: Menor (200-300px desktop)
- Posição: Entre seção de equipamentos e acessórios
- Estilo: Banner estático (pode ser expandido para carrossel depois)
- Responsivo: Adapta-se ao container

---

## 🏗️ Arquitetura da Solução

### Estrutura de Dados

**Arquivo:** `public/data/banners.json` (novo)

```json
{
  "heroBanners": [
    {
      "id": "hero-banner-1",
      "image": "/banners/hero/hero-banner-1.jpg",
      "alt": "Banner promocional Black Days 2025",
      "link": "https://rzvet.com.br/promocoes",
      "order": 1,
      "active": true
    },
    {
      "id": "hero-banner-2",
      "image": "/banners/hero/hero-banner-2.jpg",
      "alt": "Ofertas exclusivas em equipamentos",
      "link": "https://rzvet.com.br/equipamentos",
      "order": 2,
      "active": true
    }
  ],
  "middleBanner": {
    "id": "middle-banner-1",
    "image": "/banners/middle/middle-banner-1.jpg",
    "alt": "Confira também nossos acessórios",
    "link": "https://rzvet.com.br/acessorios",
    "active": true
  }
}
```

### Estrutura HTML

**Hero Carrossel:**
```html
<section class="hero-carousel" aria-label="Banners promocionais">
  <div class="hero-carousel__container">
    <div class="hero-carousel__slides">
      <!-- Slides serão renderizados via JS -->
    </div>
    <button class="hero-carousel__prev" aria-label="Banner anterior">‹</button>
    <button class="hero-carousel__next" aria-label="Próximo banner">›</button>
    <div class="hero-carousel__indicators" role="tablist">
      <!-- Indicadores serão renderizados via JS -->
    </div>
  </div>
</section>
```

**Banner Entre Seções:**
```html
<section class="middle-banner" aria-label="Banner promocional">
  <a href="#" class="middle-banner__link">
    <img src="/banners/middle/placeholder.jpg" alt="Banner promocional" class="middle-banner__image" />
  </a>
</section>
```

---

## 💻 Plano de Implementação

### Fase 1: Estrutura de Dados e Placeholders

#### Tarefa 1.1: Criar arquivo `banners.json`
**Responsável:** Dev Agent  
**Arquivo:** `public/data/banners.json`

**Ações:**
- Criar estrutura JSON com placeholders
- 2-3 banners hero (placeholders)
- 1 banner middle (placeholder)
- URLs de imagem placeholder ou caminhos preparados

**Placeholders:**
- Imagens: Usar SVG placeholder ou caminhos preparados
- Links: "#" temporários

---

### Fase 2: HTML - Estrutura do Carrossel Hero

#### Tarefa 2.1: Substituir headline-banner por hero-carousel
**Responsável:** Dev Agent  
**Arquivo:** `public/promocoes.html`

**Mudanças:**
- Remover ou adaptar seção `headline-banner` atual
- Adicionar nova seção `hero-carousel`
- Manter countdown (pode ficar sobreposto ou abaixo do carrossel)
- Estrutura semântica e acessível

**Estrutura:**
```html
<section class="hero-carousel" aria-label="Banners promocionais">
  <!-- Carrossel será renderizado via JS -->
  <div class="hero-carousel__placeholder">
    <p>Carregando banners...</p>
  </div>
</section>
```

---

### Fase 3: HTML - Banner Entre Seções

#### Tarefa 3.1: Adicionar banner entre equipamentos e acessórios
**Responsável:** Dev Agent  
**Arquivo:** `public/promocoes.html`

**Localização:** Entre `</section>` de equipamentos e `<section>` de acessórios

**Estrutura:**
```html
<section class="middle-banner" aria-label="Banner promocional">
  <a href="#" class="middle-banner__link">
    <img 
      src="/banners/middle/placeholder.jpg" 
      alt="Banner promocional" 
      class="middle-banner__image"
      loading="lazy"
    />
  </a>
</section>
```

---

### Fase 4: JavaScript - Carrossel Hero

#### Tarefa 4.1: Criar função de carrossel
**Responsável:** Dev Agent  
**Arquivo:** `public/promocoes.js`

**Funcionalidades:**
1. `loadHeroBanners()` - Carrega banners do JSON
2. `renderHeroCarousel(banners)` - Renderiza carrossel
3. `initCarousel()` - Inicializa funcionalidade
4. `nextSlide()` - Próximo slide
5. `prevSlide()` - Slide anterior
6. `goToSlide(index)` - Ir para slide específico
7. `startAutoplay()` - Iniciar autoplay
8. `stopAutoplay()` - Parar autoplay

**Características:**
- Transição suave (CSS transitions)
- Autoplay: 5 segundos por slide
- Pausa no hover
- Navegação por teclado (setas)
- Indicadores clicáveis
- Loop infinito
- Touch/swipe para mobile

---

### Fase 5: CSS - Estilização

#### Tarefa 5.1: Estilos do carrossel hero
**Responsável:** Dev Agent  
**Arquivo:** `public/styles.css`

**Classes a criar:**
- `.hero-carousel` - Container principal
- `.hero-carousel__container` - Container interno
- `.hero-carousel__slides` - Container dos slides
- `.hero-carousel__slide` - Slide individual
- `.hero-carousel__slide--active` - Slide ativo
- `.hero-carousel__prev` / `.hero-carousel__next` - Botões de navegação
- `.hero-carousel__indicators` - Container dos indicadores
- `.hero-carousel__indicator` - Indicador individual
- `.hero-carousel__indicator--active` - Indicador ativo

**Características:**
- Full-width (100vw)
- Altura responsiva (400-600px desktop)
- Transições suaves
- Botões estilizados (setas)
- Indicadores (dots) na parte inferior
- Hover effects
- Responsivo mobile

#### Tarefa 5.2: Estilos do banner middle
**Responsável:** Dev Agent  
**Arquivo:** `public/styles.css`

**Classes a criar:**
- `.middle-banner` - Container do banner
- `.middle-banner__link` - Link do banner
- `.middle-banner__image` - Imagem do banner

**Características:**
- Largura: Container (mesma das seções)
- Altura: 200-300px desktop
- Responsivo
- Hover effect sutil
- Border-radius consistente

---

## 🎨 Especificações de Design

### Hero Carrossel

**Desktop:**
- Largura: 100vw
- Altura: 500-600px
- Aspect ratio: ~16:9 ou 21:9
- Botões: 50x50px, posicionados nas laterais
- Indicadores: 12px círculos, espaçados 8px, bottom: 20px

**Mobile:**
- Largura: 100vw
- Altura: 300-400px
- Botões: 40x40px
- Indicadores: 10px círculos

**Transições:**
- Tipo: Fade (opacity) ou Slide (transform)
- Duração: 500ms ease-in-out
- Timing: Suave e profissional

### Banner Middle

**Desktop:**
- Largura: Container (max-width: 1100px)
- Altura: 250px
- Border-radius: 22px (consistente com cards)
- Margin: 3-4rem vertical

**Mobile:**
- Largura: 100% do container
- Altura: 150-200px
- Margin: 2rem vertical

---

## ♿ Acessibilidade

### Requisitos WCAG AA

1. **Navegação por Teclado:**
   - Tab para focar controles
   - Setas para navegar slides
   - Enter/Space para ativar

2. **ARIA Labels:**
   - `aria-label` em botões
   - `role="tablist"` nos indicadores
   - `aria-current="true"` no slide ativo

3. **Alt Text:**
   - Descrições descritivas em todas as imagens
   - Texto alternativo para banners

4. **Focus Indicators:**
   - Outline visível em todos os controles
   - Contraste adequado

---

## ⚡ Performance

### Otimizações

1. **Lazy Loading:**
   - Primeiro slide: eager
   - Demais slides: lazy

2. **Imagens:**
   - Formato WebP com fallback
   - Tamanhos responsivos (srcset)
   - Compressão adequada

3. **JavaScript:**
   - Debounce em eventos de resize
   - RequestAnimationFrame para animações
   - Cleanup de event listeners

4. **CSS:**
   - Transições via CSS (GPU accelerated)
   - Will-change apenas quando necessário

---

## 🔄 Fluxo de Implementação

### Sequência de Tarefas

1. **Fase 1: Dados** (15 min)
   - ✅ Criar `banners.json` com placeholders

2. **Fase 2: HTML Hero** (20 min)
   - ✅ Substituir headline-banner por hero-carousel
   - ✅ Estrutura semântica

3. **Fase 3: HTML Middle** (10 min)
   - ✅ Adicionar banner entre seções

4. **Fase 4: JavaScript** (60-90 min)
   - ✅ Função loadHeroBanners()
   - ✅ Função renderHeroCarousel()
   - ✅ Lógica de carrossel (next, prev, autoplay)
   - ✅ Event listeners
   - ✅ Acessibilidade (teclado)

5. **Fase 5: CSS** (45-60 min)
   - ✅ Estilos hero-carousel
   - ✅ Estilos middle-banner
   - ✅ Responsividade
   - ✅ Animações/transições

6. **Fase 6: Testes** (30 min)
   - ✅ Testar carrossel
   - ✅ Testar responsividade
   - ✅ Testar acessibilidade
   - ✅ Testar performance

---

## ✅ Critérios de Aceitação

### Funcionalidade
- [ ] Carrossel hero funciona com múltiplos slides
- [ ] Autoplay funciona (5s por slide)
- [ ] Navegação por setas funciona
- [ ] Indicadores clicáveis funcionam
- [ ] Pausa no hover funciona
- [ ] Loop infinito funciona
- [ ] Banner middle exibido corretamente
- [ ] Links funcionam (mesmo que placeholders)

### Visual
- [ ] Carrossel full-width na hero
- [ ] Transições suaves
- [ ] Banner middle entre seções
- [ ] Responsivo em todos os breakpoints
- [ ] Consistência visual mantida

### Acessibilidade
- [ ] Navegação por teclado funciona
- [ ] ARIA labels corretos
- [ ] Alt text em todas as imagens
- [ ] Focus indicators visíveis

### Performance
- [ ] Carregamento rápido
- [ ] Animações a 60fps
- [ ] Lazy loading funcionando
- [ ] Sem memory leaks

---

## 📝 Notas Técnicas

### Decisões de Implementação

1. **Carrossel Vanilla JS:**
   - Sem dependências externas
   - Controle total sobre funcionalidade
   - Performance otimizada

2. **Placeholders:**
   - SVG placeholders ou caminhos preparados
   - Fácil substituição depois
   - Estrutura pronta para imagens reais

3. **Countdown:**
   - Pode ficar sobreposto no carrossel (overlay)
   - Ou abaixo do carrossel
   - Decisão final: Abaixo do carrossel (mais limpo)

4. **Estrutura de Dados:**
   - JSON separado para fácil atualização
   - Estrutura extensível (pode adicionar mais banners)

---

## 🚀 Próximos Passos Após Aprovação

1. **Aprovação do Planejamento** ✅ (este documento)
2. **Implementação Fase 1:** Criar `banners.json`
3. **Implementação Fase 2:** HTML hero-carousel
4. **Implementação Fase 3:** HTML middle-banner
5. **Implementação Fase 4:** JavaScript carrossel
6. **Implementação Fase 5:** CSS estilização
7. **Testes e Validação**
8. **Substituição de Placeholders** (pelo usuário)

---

## 📊 Estimativa de Esforço

- **Preparação de Dados:** 15 minutos
- **HTML:** 30 minutos
- **JavaScript:** 60-90 minutos
- **CSS:** 45-60 minutos
- **Testes:** 30 minutos
- **Total:** ~3-4 horas

---

**Status:** 📋 Aguardando Aprovação  
**Próxima Ação:** Após aprovação, iniciar Fase 1 (Preparação de Dados)

---

**Última atualização:** 13 de Novembro de 2025

