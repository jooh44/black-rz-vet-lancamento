# Planejamento - Seção de Acessórios Black Friday RZ VET

**Data:** 13 de Novembro de 2025
**Status:** 📋 PLANEJAMENTO - Aguardando Aprovação
**Versão:** 1.0

---

## 📊 Resumo Executivo

### Objetivo

Implementar a segunda seção da página de promoções, dedicada aos **acessórios veterinários**, seguindo o mesmo padrão visual e funcional da seção de equipamentos já implementada.

### Dados de Entrada

- **Fonte:** `Promo consumo - Exportação do Gemini_ 13 de novembro de 2025 às 03_43_11 BRT.csv`
- **Total de Produtos:** 21 acessórios
- **Categorias:** Agulhas, balões, cateteres, cânulas, ataduras, reanimadores, kits

### Escopo

- Criar arquivo JSON com dados dos 21 acessórios
- Adicionar seção HTML para acessórios na página de promoções
- Estender JavaScript para renderizar acessórios
- Manter consistência visual 100% com seção de equipamentos
- Integrar tracking Meta Pixel para acessórios

---

## 📋 Análise dos Dados do CSV

### Estrutura dos Dados

- **Coluna 1:** Produto (Descrição - Tamanho/Modelo)
- **Coluna 2:** Preço Original (R$)
- **Coluna 3:** Preço PIX (R$)
- **Coluna 4:** % OFF

### Produtos Identificados (21 itens)

#### Agulhas (5 produtos)

1. AGULHA TUOHY p/ Anestesia 16G X 90MM/18G X 90MM - 50% OFF
2. AGULHA TUOHY p/ Anestesia 20G X 90MM - 40% OFF
3. AGULHA TUOHY p/ Anestesia 20G X 50MM - 40% OFF
4. AGULHA TUOHY p/ Anestesia 22G X 50MM - 40% OFF
5. AGULHA TUOHY p/ Anestesia 17G X 90MM - 34% OFF
6. AGULHA BLOQUEIO Periférico 21G X 100MM - 31% OFF
7. AGULHA BLOQUEIO Periférico 22G X 50MM - 31% OFF

#### Balões de Látex (5 produtos)

7. BALÃO DE LÁTEX p/ Reinalação 250ML - 35% OFF
8. BALÃO DE LÁTEX p/ Reinalação 500ML - 35% OFF
9. BALÃO DE LÁTEX p/ Reinalação 1 LITRO - 35% OFF
10. BALÃO DE LÁTEX p/ Reinalação 2 LITROS - 35% OFF
11. BALÃO DE LÁTEX p/ Reinalação 3 LITROS - 35% OFF

#### Outros Acessórios (9 produtos)

12. MULTI INJETOR LINEAR 3 APLICADORES - 40% OFF
13. CATETER VENOSO CENTRAL 4FR/5FR - 30% OFF
14. CATETER VENOSO CENTRAL 7FR - 30% OFF
15. REANIMADOR MANUAL AMBU - 29% OFF
16. KIT CABO ECG 03 VIAS + 03 GARRAS - 29% OFF
17. CÂNULA GATO Nº 03 3,0 A 5,0 KG - 25% OFF
18. CÂNULA COELHO Nº 02/Nº 03 - 25% OFF
19. ATADURA ELÁSTICA - 5CM - 20% OFF
20. ATADURA ELÁSTICA - 10CM - 18% OFF

### Desafios Identificados

1. **Conversão de Preços:** Valores no CSV estão com vírgula (formato brasileiro) - precisa converter para número
2. **Slugs para URLs:** Criar slugs únicos para cada produto
3. **Imagens:** Verificar se existem imagens dos acessórios ou criar placeholders
4. **Especificações:** Extrair informações técnicas do nome do produto

---

## 🎯 Plano de Implementação por Área

### 1. **Data/Backend** - Estrutura de Dados

#### Tarefa 1.1: Criar arquivo `public/data/accessories.json`

**Responsável:** Dev Agent
**Entrada:** CSV de acessórios
**Saída:** Arquivo JSON estruturado

**Estrutura JSON:**

```json
{
  "id": "agulha-tuohy-16g-90mm",
  "name": "AGULHA TUOHY p/ Anestesia 16G X 90MM/18G X 90MM",
  "slug": "agulha-tuohy-16g-90mm",
  "image": "/valores-black/acessorios/agulha-tuohy-16g-90mm.png",
  "price_original": 14.36,
  "price_promotional": 7.29,
  "discount_percentage": 50,
  "url": "https://rzvet.com.br/produto/agulha-tuohy-16g-90mm",
  "specifications": [
    "Tamanho: 16G/18G",
    "Comprimento: 90MM",
    "Para anestesia"
  ],
  "description": "Agulha Tuohy para anestesia veterinária",
  "category": "agulhas",
  "available": true
}
```

**Ações:**

- Converter preços de formato brasileiro (vírgula) para número
- Criar IDs únicos baseados no nome do produto
- Gerar slugs URL-friendly
- Extrair especificações do nome do produto
- Definir categoria para cada produto
- Criar URLs padrão (serão validadas depois)

**Validações:**

- Todos os 21 produtos incluídos
- Preços convertidos corretamente
- IDs únicos e sem duplicatas
- JSON válido

---

### 2. **Frontend/HTML** - Estrutura da Página

#### Tarefa 2.1: Adicionar seção de acessórios no HTML

**Responsável:** Dev Agent
**Arquivo:** `public/promocoes.html`

**Mudanças:**

- Adicionar nova seção após a seção de equipamentos
- Manter mesma estrutura visual
- Usar classes CSS existentes

**Código a adicionar:**

```html
<section class="products-section" aria-label="Acessórios em promoção">
  <h2 class="section-title">
    <span class="section-title__highlight">Acessórios em Promoção</span>
  </h2>
  <p class="section-subtitle">Confira os descontos imperdíveis em acessórios essenciais para sua clínica veterinária.</p>
  <div id="accessories-grid" class="products-grid" role="list">
    <!-- Acessórios serão renderizados aqui via JavaScript -->
  </div>
</section>
```

**Localização:** Após a seção de equipamentos, antes do footer

---

### 3. **Frontend/JavaScript** - Lógica de Renderização

#### Tarefa 3.1: Criar função para carregar acessórios

**Responsável:** Dev Agent
**Arquivo:** `public/promocoes.js`

**Funções a criar:**

1. `loadAccessories()` - Carrega dados de `accessories.json`
2. Reutilizar `createProductCard()` existente (já funciona para qualquer produto)
3. Adicionar tracking Meta Pixel específico para acessórios

**Código:**

```javascript
// Carregar e renderizar acessórios
async function loadAccessories() {
  try {
    const response = await fetch("/data/accessories.json");
    if (!response.ok) {
      throw new Error("Falha ao carregar acessórios");
    }

    const accessories = await response.json();
    const availableAccessories = accessories.filter((a) => a.available);

    const accessoriesGrid = document.querySelector("#accessories-grid");
  
    if (!accessoriesGrid) {
      console.error("Grid de acessórios não encontrado");
      return;
    }

    if (availableAccessories.length === 0) {
      accessoriesGrid.innerHTML = `
        <div class="products-empty" role="alert">
          <p>Acessórios temporariamente indisponíveis.</p>
        </div>
      `;
      return;
    }

    // Limpar grid
    accessoriesGrid.innerHTML = "";

    // Renderizar cada acessório (reutilizar createProductCard)
    availableAccessories.forEach((accessory) => {
      const card = createProductCard(accessory);
      accessoriesGrid.appendChild(card);
    });

    // Meta Pixel: Rastrear visualização de acessórios
    if (typeof window.fbq !== "undefined") {
      window.fbq("track", "ViewContent", {
        content_name: "Black Days RZ VET - Acessórios",
        content_category: "Acessórios Veterinários",
        content_type: "product",
        content_ids: availableAccessories.map((a) => a.id),
        num_items: availableAccessories.length
      });
    }

    // Rastrear visualização individual (reutilizar lógica existente)
    // ... (mesmo código de tracking de produtos)
  } catch (error) {
    console.error("Erro ao carregar acessórios:", error);
    // Tratamento de erro
  }
}
```

**Integração:**

- Chamar `loadAccessories()` após `loadProducts()` no DOMContentLoaded
- Reutilizar toda a lógica de tracking existente

---

### 4. **Frontend/CSS** - Estilização

#### Tarefa 4.1: Verificar e ajustar estilos (se necessário)

**Responsável:** Dev Agent
**Arquivo:** `public/styles.css`

**Análise:**

- ✅ Classes `.products-section` e `.products-grid` já existem e são reutilizáveis
- ✅ Classes `.product-card` já existem e funcionam para qualquer produto
- ✅ Grid responsivo já implementado (1/2/3 colunas)

**Ações:**

- Verificar se há necessidade de ajustes específicos para acessórios
- Manter 100% de consistência visual com equipamentos
- Nenhuma nova classe CSS necessária (reutilizar tudo)

---

### 5. **Documentação** - Atualização

#### Tarefa 5.1: Atualizar PRD

**Responsável:** PM Agent
**Arquivo:** `docs/prd.md`

**Mudanças:**

- Adicionar seção sobre acessórios no escopo
- Atualizar contagem de produtos (12 equipamentos + 21 acessórios = 33 produtos)
- Documentar nova seção na estrutura da página

#### Tarefa 5.2: Atualizar Architecture

**Responsável:** Architect Agent
**Arquivo:** `docs/architecture.md`

**Mudanças:**

- Documentar novo arquivo `accessories.json`
- Atualizar source tree
- Documentar extensão do JavaScript

#### Tarefa 5.3: Atualizar Front-End Spec

**Responsável:** UX Expert
**Arquivo:** `docs/front-end-spec.md`

**Mudanças:**

- Adicionar seção de acessórios nos wireframes
- Documentar layout da nova seção
- Manter especificações de componentes (reutilização)

#### Tarefa 5.4: Atualizar IMPLEMENTACAO

**Responsável:** Dev Agent
**Arquivo:** `docs/IMPLEMENTACAO.md`

**Mudanças:**

- Adicionar Fase 2: Seção de Acessórios
- Documentar arquivos criados/modificados
- Atualizar status do projeto

---

## 🔄 Fluxo de Implementação

### Sequência de Tarefas

1. **Fase 1: Preparação de Dados** (Dev Agent)

   - ✅ Analisar CSV
   - ✅ Criar `accessories.json` com todos os 21 produtos
   - ✅ Validar estrutura JSON
2. **Fase 2: Frontend HTML** (Dev Agent)

   - ✅ Adicionar seção de acessórios no HTML
   - ✅ Validar estrutura semântica
3. **Fase 3: Frontend JavaScript** (Dev Agent)

   - ✅ Criar função `loadAccessories()`
   - ✅ Integrar com tracking Meta Pixel
   - ✅ Testar renderização
4. **Fase 4: Validação** (QA Agent)

   - ✅ Testar carregamento de dados
   - ✅ Validar responsividade
   - ✅ Testar tracking Meta Pixel
   - ✅ Validar acessibilidade
5. **Fase 5: Documentação** (PM/Architect/UX/Dev)

   - ✅ Atualizar todas as documentações
   - ✅ Revisar consistência

---

## ✅ Critérios de Aceitação

### Funcionalidade

- [ ] Todos os 21 acessórios são exibidos corretamente
- [ ] Preços formatados em Real brasileiro (R$)
- [ ] Badges de desconto exibidos corretamente
- [ ] Botões "Ver Produto" funcionam
- [ ] Links abrem em nova aba
- [ ] Tracking Meta Pixel funciona para acessórios

### Visual

- [ ] Layout idêntico à seção de equipamentos
- [ ] Grid responsivo funciona (1/2/3 colunas)
- [ ] Cards com hover effects
- [ ] Consistência visual 100%

### Performance

- [ ] Carregamento rápido (< 3s)
- [ ] Lazy loading de imagens
- [ ] Sem erros no console

### Acessibilidade

- [ ] Navegação por teclado funciona
- [ ] Alt text em imagens
- [ ] Estrutura semântica correta
- [ ] ARIA labels adequados

---

## 📝 Notas Técnicas

### Conversão de Preços

Os preços no CSV estão no formato brasileiro (vírgula como separador decimal):

- `"14,36"` → `14.36`
- `"7,29"` → `7.29`

**Solução:** Criar função de conversão ou processar manualmente durante criação do JSON.

### URLs dos Produtos

- URLs padrão serão criadas: `https://rzvet.com.br/produto/{slug}`
- Validação será feita posteriormente (conforme Story 3.3 do PRD original)

### Imagens

- Verificar se existem imagens em `/valores-black/acessorios/`
- Se não existirem, usar placeholders ou imagens genéricas
- Implementar fallback para imagens não encontradas (já existe no código)

### Especificações

Extrair do nome do produto:

- Tamanhos (16G, 18G, 20G, etc.)
- Comprimentos (50MM, 90MM, 100MM)
- Capacidades (250ML, 500ML, 1L, etc.)
- Modelos (Nº 02, Nº 03, etc.)

---

## 🚀 Próximos Passos Após Aprovação

1. **Aprovação do Planejamento** ✅ (este documento)
2. **Implementação Fase 1:** Criar `accessories.json`
3. **Implementação Fase 2:** Adicionar HTML
4. **Implementação Fase 3:** Adicionar JavaScript
5. **Testes e Validação**
6. **Atualização de Documentações**
7. **Deploy**

---

## 📊 Estimativa de Esforço

- **Preparação de Dados:** 30-45 minutos
- **HTML:** 15 minutos
- **JavaScript:** 30-45 minutos
- **Testes:** 30 minutos
- **Documentação:** 45-60 minutos
- **Total:** ~3-4 horas

---

**Status:** 📋 Aguardando Aprovação
**Próxima Ação:** Após aprovação, iniciar Fase 1 (Preparação de Dados)

---

**Última atualização:** 13 de Novembro de 2025
