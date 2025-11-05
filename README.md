# Landing Page Black Days RZ VET

Ambiente simples para validar a landing page Black Days RZ VET com frontend em HTML/CSS/JS vanilla e uma API Node.js capaz de salvar leads localmente e, opcionalmente, replicar no Google Sheets e/ou Google Apps Script.

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
- `npm run check:sheets`: valida a configuracao do Google Sheets e tenta estabelecer conexao com a planilha.

A API serve os arquivos estaticos em `http://localhost:<PORT>`.

### Configurando o frontend

Se estiver usando um dev server (ex.: Vite), defina `VITE_API_BASE_URL` apontando para o backend:

```bash
set VITE_API_BASE_URL=http://localhost:8788/api
npm run dev
```

Ou ajuste `window.API_BASE_URL` manualmente antes de carregar `app.js` quando servir os arquivos de outra forma.

## Variaveis de ambiente

Copie `.env.example` para `.env` e ajuste os valores:

- `PORT`: porta da API (padrao 8788).
- `ALLOWED_ORIGIN`: origens permitidas para CORS (separe por virgulas).
- `GOOGLE_APPS_SCRIPT_URL`: WebApp opcional para encaminhar o lead.
- `GOOGLE_SHEETS_ID`: ID da planilha de destino.
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`: e-mail da service account com acesso a planilha.
- `GOOGLE_PRIVATE_KEY`: chave privada da service account.
  - Em arquivos `.env`, mantenha tudo em uma unica linha usando `\n` para representar as quebras de linha.
  - Em `docker-compose.yml`, prefira o bloco literal:
    ```yaml
    GOOGLE_PRIVATE_KEY: |-
      -----BEGIN PRIVATE KEY-----
      ...
      -----END PRIVATE KEY-----
    ```
- `GOOGLE_SHEETS_TAB_NAME`: aba da planilha que recebera os dados (padrao `Leads`).

Com campos Google vazios, a API continua funcionando apenas com o armazenamento local (`data/leads.json`). Use `npm run check:sheets` ou `GET /api/health` para conferir se a integracao esta ativa.

### Timezone Sao Paulo

A aplicacao normaliza todos os timestamps para `America/Sao_Paulo`. No backend (`getSaoPauloTimestamp`) isso ja esta habilitado. No Google Sheets a inicializacao do servico garante que a planilha esteja com o mesmo fuso (via `updateSpreadsheetProperties`). Nao e preciso acerto manual.

### Docker e Node Options

Quando executar em containers baseados em Node 18 ou superior, defina a variavel `NODE_OPTIONS=--openssl-legacy-provider` antes do processo iniciar (necessario por conta da lib do Google que ainda utiliza algoritmos marcados como legacy). Exemplo:

```yaml
services:
  app:
    build: .
    environment:
      - NODE_OPTIONS=--openssl-legacy-provider
      - GOOGLE_PRIVATE_KEY=${GOOGLE_PRIVATE_KEY}
```

Se preferir evitar a flag, utilize uma imagem Node 16 (sem suporte Long Term, mas ainda compativel com as dependencias).

### Rede no Docker Swarm

Se o projeto rodar em um cluster Swarm usando redes `overlay`, garanta que os containers consigam sair para a Internet (necessario para autenticar no Google APIs):

```bash
iptables -t nat -A POSTROUTING -s 172.18.0.0/16 -o eth0 -j MASQUERADE   # ajuste o CIDR conforme a rede overlay local
iptables -t nat -A POSTROUTING -s 10.0.0.0/8   -o eth0 -j MASQUERADE   # se houver redes adicionais para os services
```

> 💡 Salve as regras com `netfilter-persistent save` (ou mecanismo equivalente) para sobreviver a reboot.

## Testando o formulario

1. Execute `npm run dev`.
2. Acesse `http://localhost:<PORT>`.
  3. Envie o formulario com dados de teste (incluindo, se desejar, a seleção de produtos de interesse).
4. Confira `http://localhost:<PORT>/api/leads` ou o arquivo `data/leads.json`.
5. Com as credenciais do Google configuradas, acompanhe os logs em `data/sheets-debug.log` e `data/sheets-errors.log`.

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

- `GET /api/health`: status da aplicacao e da integracao com Google Sheets.
- `GET /api/leads`: lista os leads armazenados localmente.
- `POST /api/leads`: recebe `nome`, `email`, `telefone`, `atuacao` e `possui_clinica`; persiste localmente e replica para Sheets/Apps Script quando configurado.
  - Campos opcionais: `produtos_interesse` (array de slugs definidos no frontend) é convertido para texto e enviado à coluna **Produtos de interesse** na planilha.

## Fluxo de deploy recomendado

1. Crie um arquivo `.env` com as credenciais locais para desenvolvimento.
2. Gere uma chave SSH e de acesso aos servidores/containers.
3. Ajuste o `docker-compose.yml` (ou orquestrador equivalente) com:
   - `GOOGLE_*` informados.
   - `NODE_OPTIONS=--openssl-legacy-provider` (quando Node 18+).
   - Volume para `data/` se quiser persistir leads e logs fora do container.
4. Ajuste as regras de NAT conforme explicado em [Rede no Docker Swarm](#rede-no-docker-swarm) quando estiver em Swarm.
5. Execute `docker compose up -d --build` (ou `docker stack deploy` / `npm start`) e teste com `npm run check:sheets`.
5. Aponte o frontend (quando servido por CDN/aplicacao externa) para `https://<dominio>/api`.

Logs importantes ficam em `data/sheets-debug.log`, `data/sheets-errors.log` e no stdout do processo Node (via Pino).

### Checklist pós-deploy

- `curl https://<dominio>/api/health` deve retornar `"initialized": true` e sem `lastError`.
- Dentro do container de produção: `docker exec <id> node server/scripts/checkSheets.js`.
- Verifique `data/sheets-debug.log` (dentro do container) para confirmar a mensagem `Lead inserido com sucesso`.
- Confira na planilha se a coluna **Produtos de interesse** recebe os itens selecionados (separados por `; `).
- Envie um lead real de teste e confirme a chegada na aba configurada do Sheets; remova o registro em seguida.
- Garanta que as regras de NAT estejam persistidas (`iptables-save` / `netfilter-persistent save`) para evitar perda após reboot.

## Troubleshooting

- **ERR_OSSL_UNSUPPORTED**: defina `NODE_OPTIONS=--openssl-legacy-provider` antes do processo (ex.: via compose) ou rode em Node 16.
- **Falha ao autenticar no Google Sheets**: confira se a service account tem permissao de edicao na planilha e se `GOOGLE_PRIVATE_KEY` esta com quebras corretas (`\n` no `.env` ou bloco literal no compose).
- **Planilha com timezone incorreto**: ao inicializar o servico com credenciais validas a planilha passa a usar `America/Sao_Paulo`. Rode `npm run check:sheets` para forcar essa etapa.
- **CORS bloqueando requisicoes**: ajuste `ALLOWED_ORIGIN` com a origem completa (`https://dominio.com`).
- **Dados nao chegam ao Sheets mas estao em `data/leads.json`**: verifique `data/sheets-errors.log`. A fila de replicacao eh assinc; falhas temporarias sao reprocessadas ate 3 vezes.

## Proximos passos sugeridos

- Ajustar conteudo visual conforme layout definitivo.
- Adicionar monitoramento externo para a integracao com o Sheets.
- Expandir a suite de testes (integracao e contratos de API) conforme o projeto evoluir.
