# Guia de Deploy - Landing Page Black Days RZ VET

**Versão:** 1.1  
**Última atualização:** Janeiro 2025  
**Domínio de Produção:** https://rzequipamentos.com.br

---

## 📋 Pré-requisitos

- Node.js 18+ (ou Node 16 com OpenSSL legacy)
- npm 9+
- Docker (opcional, para containerização)
- Acesso SSH à VPS de produção

---

## 🚀 Deploy Local/Desenvolvimento

### 1. Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd "Black Friday 2025"

# Instale as dependências
npm install
```

### 2. Configuração de Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
PORT=8788
```

O servidor serve apenas arquivos estáticos, então apenas a porta precisa ser configurada.

### 3. Executar

```bash
# Modo desenvolvimento (com hot-reload)
npm run dev

# Modo produção
npm start
```

A aplicação estará disponível em `http://localhost:8788`

---

## 🐳 Deploy com Docker

### 1. Build da Imagem

```bash
docker build -t black-friday-rz-vet .
```

### 2. Executar Container

```bash
docker run -d \
  --name black-friday-app \
  -p 8788:3000 \
  -e PORT=3000 \
  -e NODE_OPTIONS=--openssl-legacy-provider \
  black-friday-rz-vet
```

### 3. Docker Compose

Crie um arquivo `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8788:3000"
    environment:
      - NODE_ENV=production
      - NODE_OPTIONS=--openssl-legacy-provider
      - PORT=3000
    restart: unless-stopped
```

Execute:

```bash
docker-compose up -d
```

---

## 🌐 Deploy em Produção

### Checklist Pré-Deploy

- [ ] Variáveis de ambiente configuradas (PORT)
- [ ] Testes executados (`npm test`)
- [ ] Health check funcionando (`GET /api/health`)
- [ ] Arquivos estáticos servidos corretamente
- [ ] Página de promoções carregando corretamente
- [ ] Links de produtos redirecionando corretamente
- [ ] Meta Pixel configurado e funcionando

### Passos de Deploy

1. **Build da aplicação:**
   ```bash
   npm install --production
   ```

2. **Validação:**
   ```bash
   npm test
   ```

3. **Iniciar serviço:**
   ```bash
   npm start
   ```

4. **Configurar processo manager (PM2 recomendado):**
   ```bash
   npm install -g pm2
   pm2 start server/index.js --name black-friday-rz-vet
   pm2 save
   pm2 startup
   ```

### Configuração de Proxy Reverso (Nginx)

**Domínio de Produção:** `rzequipamentos.com.br`

```nginx
server {
    listen 80;
    server_name rzequipamentos.com.br www.rzequipamentos.com.br;

    # Redirecionar HTTP para HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name rzequipamentos.com.br www.rzequipamentos.com.br;

    # Certificados SSL (ajustar caminhos conforme configuração)
    ssl_certificate /etc/letsencrypt/live/rzequipamentos.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/rzequipamentos.com.br/privkey.pem;

    # Configurações SSL recomendadas
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Headers de segurança
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://localhost:8788;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:8788/api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Cache para arquivos estáticos
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|webp|svg)$ {
        proxy_pass http://localhost:8788;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

**Nota:** Certifique-se de que o certificado SSL está configurado. Use Let's Encrypt com Certbot:

```bash
sudo certbot --nginx -d rzequipamentos.com.br -d www.rzequipamentos.com.br
```

---

## 🔍 Validação Pós-Deploy

### 1. Health Check

```bash
curl https://rzequipamentos.com.br/api/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "initialized": true,
  "sheets": {
    "enabled": true,
    "lastError": null
  }
}
```

### 2. Teste da Página

1. Acesse `https://rzequipamentos.com.br`
2. Verifique se a página de promoções carrega corretamente
3. Teste a navegação entre categorias (Equipamentos/Acessórios)
4. Teste os links "Ver Produto" - devem redirecionar para rzvet.com.br
5. Verifique se o carrossel de banners está funcionando
6. Teste em diferentes dispositivos (desktop, tablet, mobile)

### 3. Verificar Logs

```bash
# Logs do servidor
pm2 logs black-friday-rz-vet
```

---

## 🐛 Troubleshooting

### ERR_OSSL_UNSUPPORTED

**Solução:** Defina `NODE_OPTIONS=--openssl-legacy-provider` antes do processo iniciar.

### Página não carrega

**Verificações:**
- Verifique se `promocoes.html` existe na pasta `public/`
- Verifique se os arquivos JSON (`products.json`, `accessories.json`, `banners.json`) existem em `public/data/`
- Verifique os logs do servidor para erros
- Confirme que a porta está correta e não está em uso

### Links não funcionam

**Verificações:**
- Verifique se os URLs dos produtos estão corretos nos arquivos JSON
- Teste os links manualmente no navegador
- Verifique o console do navegador para erros JavaScript

### Rede no Docker Swarm

Se usando redes `overlay`, garanta que os containers consigam sair para a Internet:

```bash
iptables -t nat -A POSTROUTING -s 172.18.0.0/16 -o eth0 -j MASQUERADE
iptables -t nat -A POSTROUTING -s 10.0.0.0/8 -o eth0 -j MASQUERADE

# Salvar regras
netfilter-persistent save
```

---

## 📊 Monitoramento

### Métricas Recomendadas

- Uptime do serviço
- Tempo de resposta do servidor
- Uso de memória/CPU
- Taxa de erro 404 (arquivos não encontrados)

### Logs Importantes

- Logs do processo Node (via Pino)
- Logs do PM2 (se usando)

---

## 🔄 Atualizações

### Processo de Atualização

1. Atualizar código:
   ```bash
   git pull origin main
   npm install --production
   ```

2. Reiniciar serviço:
   ```bash
   pm2 restart black-friday-rz-vet
   ```

3. Validar:
   ```bash
   curl https://rzequipamentos.com.br/api/health
   ```

---

## 📝 Notas Importantes

- O servidor serve apenas arquivos estáticos
- A aplicação não coleta ou armazena dados de usuários
- Meta Pixel está integrado e rastreia visualizações de produtos e cliques
- Todos os links de produtos redirecionam para rzvet.com.br

---

## 🖥️ Acesso à VPS

Para acessar a VPS de produção, consulte o [Guia de Acesso à VPS](./VPS-ACCESS.md).

**Informações rápidas:**
- **Host:** `72.60.150.75`
- **Usuário:** `root`
- **Script de acesso:** `ssh_run.py` (na raiz do projeto)

**⚠️ IMPORTANTE:** As credenciais completas estão no arquivo `ssh_run.py`. **NUNCA** faça commit deste arquivo.

## 🆘 Suporte

Para problemas ou dúvidas:
1. Verifique os logs
2. Consulte a seção de Troubleshooting
3. Consulte o [Guia de Acesso à VPS](./VPS-ACCESS.md) para comandos úteis
4. Verifique o README.md para informações adicionais

