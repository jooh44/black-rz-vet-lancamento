# Landing Page Black Days RZ VET

Ambiente simples para validar a landing page Black Days RZ VET com frontend em HTML/CSS/JS vanilla e uma API Node.js capaz de salvar leads localmente e, opcionalmente, replicar no Google Sheets e/ou Google Apps Script.

## Requisitos

- Node.js 18 ou superior
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
- `GOOGLE_PRIVATE_KEY`: chave privada da service account (use `\n` para as quebras de linha).
- `GOOGLE_SHEETS_TAB_NAME`: aba da planilha que recebera os dados (padrao `Leads`).

Com campos Google vazios, a API continua funcionando apenas com o armazenamento local (`data/leads.json`). Use `npm run check:sheets` ou `GET /api/health` para conferir se a integracao esta ativa.

## Testando o formulario

1. Execute `npm run dev`.
2. Acesse `http://localhost:<PORT>`.
3. Envie o formulario com dados de teste.
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

## Proximos passos sugeridos

- Ajustar conteudo visual conforme layout definitivo.
- Adicionar monitoramento externo para a integracao com o Sheets.
- Expandir a suite de testes (integracao e contratos de API) conforme o projeto evoluir.
