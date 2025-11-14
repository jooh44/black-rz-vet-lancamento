# Guia de Acesso à VPS - RZ Equipamentos

**⚠️ SEGURANÇA:** Este documento contém credenciais sensíveis. Mantenha-o seguro e não compartilhe publicamente.

---

## 🔐 Informações de Acesso

### Credenciais da VPS

- **Host:** `72.60.150.75`
- **Usuário:** `root`
- **Porta SSH:** `22` (padrão)

**⚠️ IMPORTANTE:** As credenciais completas estão no arquivo `ssh_run.py` na raiz do projeto. **NUNCA** faça commit deste arquivo no repositório público.

---

## 🚀 Métodos de Acesso

### Método 1: SSH Direto (Recomendado)

```bash
ssh root@72.60.150.75
```

Quando solicitado, insira a senha (consulte `ssh_run.py` ou administrador).

### Método 2: Usando o Script Python

O projeto inclui um script `ssh_run.py` para executar comandos remotamente:

```bash
# Executar comando simples
python ssh_run.py hostname

# Executar comando com argumentos
python ssh_run.py ls -la /var/www

# Executar múltiplos comandos
python ssh_run.py "cd /var/www && ls -la"
```

**Exemplos práticos:**

```bash
# Verificar status do serviço
python ssh_run.py systemctl status black-friday-rz-vet

# Ver logs
python ssh_run.py pm2 logs black-friday-rz-vet --lines 50

# Reiniciar aplicação
python ssh_run.py pm2 restart black-friday-rz-vet

# Verificar espaço em disco
python ssh_run.py df -h

# Ver processos Node.js
python ssh_run.py ps aux | grep node
```

### Método 3: SSH com Chave (Recomendado para Produção)

Para maior segurança, configure autenticação por chave SSH:

```bash
# Gerar chave SSH (se ainda não tiver)
ssh-keygen -t rsa -b 4096 -C "seu-email@exemplo.com"

# Copiar chave pública para o servidor
ssh-copy-id root@72.60.150.75

# Testar acesso sem senha
ssh root@72.60.150.75
```

---

## 📁 Estrutura de Diretórios na VPS

### Diretório da Aplicação

A aplicação deve estar em um diretório como:
- `/var/www/black-friday-rz-vet` ou
- `/opt/black-friday-rz-vet` ou
- `/home/black-friday-rz-vet`

### Diretórios Importantes

```
/var/www/black-friday-rz-vet/
├── public/              # Arquivos estáticos
├── server/              # Código do servidor
├── data/                # Dados e logs
│   ├── leads.json       # Leads salvos localmente
│   ├── sheets-debug.log # Logs do Google Sheets
│   └── sheets-errors.log # Erros do Google Sheets
├── node_modules/        # Dependências Node.js
├── package.json         # Configuração do projeto
└── .env                 # Variáveis de ambiente (NÃO COMMITAR)
```

---

## 🔧 Comandos Úteis

### Gerenciamento da Aplicação

```bash
# Via SSH direto
ssh root@72.60.150.75 "cd /var/www/black-friday-rz-vet && pm2 restart black-friday-rz-vet"

# Via script Python
python ssh_run.py "cd /var/www/black-friday-rz-vet && pm2 restart black-friday-rz-vet"
```

### Verificar Status

```bash
# Status do PM2
python ssh_run.py pm2 status

# Status do serviço
python ssh_run.py systemctl status black-friday-rz-vet

# Health check da API
python ssh_run.py curl http://localhost:8788/api/health
```

### Ver Logs

```bash
# Logs do PM2
python ssh_run.py pm2 logs black-friday-rz-vet --lines 100

# Logs do sistema
python ssh_run.py journalctl -u black-friday-rz-vet -n 50

# Logs do Google Sheets
python ssh_run.py tail -f /var/www/black-friday-rz-vet/data/sheets-debug.log
```

### Atualizar Aplicação

```bash
# 1. Fazer backup
python ssh_run.py "cd /var/www/black-friday-rz-vet && cp data/leads.json data/leads.json.backup"

# 2. Atualizar código (via git ou upload)
python ssh_run.py "cd /var/www/black-friday-rz-vet && git pull origin main"

# 3. Instalar dependências
python ssh_run.py "cd /var/www/black-friday-rz-vet && npm install --production"

# 4. Reiniciar aplicação
python ssh_run.py "cd /var/www/black-friday-rz-vet && pm2 restart black-friday-rz-vet"

# 5. Verificar status
python ssh_run.py curl http://localhost:8788/api/health
```

---

## 🔒 Segurança

### ⚠️ Avisos Importantes

1. **NUNCA** faça commit do arquivo `ssh_run.py` em repositórios públicos
2. **NUNCA** compartilhe as credenciais publicamente
3. Use autenticação por chave SSH quando possível
4. Mantenha o sistema operacional atualizado
5. Configure firewall adequadamente
6. Use senhas fortes e altere-as periodicamente

### Adicionar ao .gitignore

Certifique-se de que o arquivo `.gitignore` inclui:

```gitignore
# Credenciais e configurações sensíveis
ssh_run.py
.env
*.pem
*.key
```

### Configurar Firewall

```bash
# Permitir apenas portas necessárias
python ssh_run.py ufw allow 22/tcp    # SSH
python ssh_run.py ufw allow 80/tcp    # HTTP
python ssh_run.py ufw allow 443/tcp   # HTTPS
python ssh_run.py ufw enable
```

---

## 📊 Monitoramento

### Verificar Recursos do Sistema

```bash
# Uso de CPU e memória
python ssh_run.py top -bn1 | head -20

# Espaço em disco
python ssh_run.py df -h

# Uso de memória
python ssh_run.py free -h

# Processos Node.js
python ssh_run.py ps aux | grep node
```

### Verificar Aplicação

```bash
# Health check
python ssh_run.py curl -s http://localhost:8788/api/health | python -m json.tool

# Verificar se porta está aberta
python ssh_run.py netstat -tlnp | grep 8788

# Verificar logs de erro
python ssh_run.py tail -50 /var/www/black-friday-rz-vet/data/sheets-errors.log
```

---

## 🆘 Troubleshooting

### Não consigo conectar via SSH

1. Verifique se o IP está correto: `72.60.150.75`
2. Verifique se a porta 22 está aberta no firewall
3. Verifique se o serviço SSH está rodando: `systemctl status sshd`
4. Tente ping: `ping 72.60.150.75`

### Aplicação não está respondendo

```bash
# Verificar se o processo está rodando
python ssh_run.py pm2 list

# Verificar logs de erro
python ssh_run.py pm2 logs black-friday-rz-vet --err

# Verificar porta
python ssh_run.py netstat -tlnp | grep 8788

# Reiniciar aplicação
python ssh_run.py "cd /var/www/black-friday-rz-vet && pm2 restart black-friday-rz-vet"
```

### Erro de permissão

```bash
# Verificar permissões do diretório
python ssh_run.py ls -la /var/www/black-friday-rz-vet

# Ajustar permissões se necessário
python ssh_run.py chown -R root:root /var/www/black-friday-rz-vet
python ssh_run.py chmod -R 755 /var/www/black-friday-rz-vet
```

---

## 📝 Notas Adicionais

- O script `ssh_run.py` usa a biblioteca `paramiko` (Python)
- Para usar o script, instale: `pip install paramiko`
- O timeout padrão é de 60 segundos
- O script aceita qualquer comando como argumento

---

## 🔗 Links Úteis

- **Domínio:** https://rzequipamentos.com.br
- **API Health:** https://rzequipamentos.com.br/api/health
- **API Leads:** https://rzequipamentos.com.br/api/leads

---

**Última atualização:** Janeiro 2025  
**Mantido por:** Equipe RZ VET

