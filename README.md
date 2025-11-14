# Landing Page Black Days RZ VET

Página de promoções Black Days RZ VET com frontend em HTML/CSS/JS vanilla e servidor Node.js para servir arquivos estáticos. A página exibe produtos em promoção e redireciona para as páginas de produto no site rzvet.com.br.

**🌐 Domínio de Produção:** https://rzequipamentos.com.br

[![Deploy](https://github.com/jooh44/black-rz-vet-lancamento/actions/workflows/deploy.yml/badge.svg)](https://github.com/jooh44/black-rz-vet-lancamento/actions/workflows/deploy.yml)

## Requisitos

- Node.js 18 ou superior (Node 16 funciona caso o provedor OpenSSL legado nao esteja habilitado)
- npm 9 ou superior

## Instalacao

```bash
npm install
```

## Scripts

- `npm run dev`: inicia o servidor com recarregamento automatico (porta padrao 8788 ou a definida em `.env`).
- `npm start`: inicia o servidor em modo producao.
- `npm test`: executa os testes unitarios (Jest).

O servidor serve os arquivos estáticos em `http://localhost:<PORT>`.

## Variaveis de ambiente

Copie `.env.example` para `.env` e ajuste os valores:

- `PORT`: porta do servidor (padrao 8788).

O servidor serve apenas arquivos estáticos. Não há necessidade de configurações adicionais.

### Docker e Node Options

Quando executar em containers baseados em Node 18 ou superior, defina a variavel `NODE_OPTIONS=--openssl-legacy-provider` antes do processo iniciar (se necessário). Exemplo:

```yaml
services:
  app:
    build: .
    environment:
      - NODE_OPTIONS=--openssl-legacy-provider
      - PORT=3000
```


## Testando a aplicação

1. Execute `npm run dev`.
2. Acesse `http://localhost:<PORT>`.
3. Navegue pela página de promoções.
4. Teste os links de redirecionamento para produtos.
5. Verifique o health check em `http://localhost:<PORT>/api/health`.

## Estrutura

```
/
|- public/        # HTML, CSS e JS da landing page
|- server/
|  |- app.js      # Configuracao do Express
|  |- index.js    # Bootstrap do servidor
|  |- config/     # Carregamento de variaveis de ambiente
|  |- routes/     # Rotas da API
|  |- services/   # Integracoes (Sheets, Apps Script, storage local)
|  |- utils/      # Logger e helpers
|  |- scripts/    # Utilitarios (ex.: checkSheets)
|- data/          # Persistencia local e logs
|- tests/         # Testes unitarios (Jest)
|- .env.example
|- package.json
|- package-lock.json
```

## Endpoints

- `GET /api/health`: status do servidor de arquivos estáticos.
- `GET /`: serve a página de promoções (`promocoes.html`).
- Todos os outros caminhos servem arquivos estáticos da pasta `public/`.

## 📦 Deploy

Para instruções detalhadas de deploy, consulte o [Guia de Deploy](./docs/DEPLOY.md).

### Deploy Rápido

1. Configure as variáveis de ambiente (veja `.env.example`)
2. Execute `npm install --production`
3. Execute `npm start` ou use PM2/Docker
4. Valide com `curl http://localhost:8788/api/health`

### Documentação Adicional

- **[Guia de Deploy](./docs/DEPLOY.md)** - Instruções completas de deploy
- **[Acesso à VPS](./docs/VPS-ACCESS.md)** - Guia de acesso e comandos SSH
- **[CHANGELOG](./CHANGELOG.md)** - Histórico de mudanças
- **[PRD](./docs/prd.md)** - Product Requirements Document
- **[Arquitetura](./docs/architecture.md)** - Documentação técnica

### 🌐 Links de Produção

- **Site:** https://rzequipamentos.com.br
- **API Health:** https://rzequipamentos.com.br/api/health

## Troubleshooting

- **ERR_OSSL_UNSUPPORTED**: defina `NODE_OPTIONS=--openssl-legacy-provider` antes do processo (ex.: via compose) ou rode em Node 16.
- **Falha ao autenticar no Google Sheets**: confira se a service account tem permissao de edicao na planilha e se `GOOGLE_PRIVATE_KEY` esta com quebras corretas (`\n` no `.env` ou bloco literal no compose).
- **Planilha com timezone incorreto**: ao inicializar o servico com credenciais validas a planilha passa a usar `America/Sao_Paulo`. Rode `npm run check:sheets` para forcar essa etapa.
- **CORS bloqueando requisicoes**: ajuste `ALLOWED_ORIGIN` com a origem completa (`https://dominio.com`).
- **Dados nao chegam ao Sheets mas estao em `data/leads.json`**: verifique `data/sheets-errors.log`. A fila de replicacao eh assinc; falhas temporarias sao reprocessadas ate 3 vezes.

## Funcionalidades

- Página de promoções com produtos e acessórios
- Carrossel de banners promocionais
- Contador regressivo para Black Days
- Navegação por categorias (Equipamentos/Acessórios)
- Redirecionamento para páginas de produto no site rzvet.com.br
- Design responsivo e otimizado para mobile
- Integração com Meta Pixel para rastreamento
