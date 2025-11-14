# 🚀 Guia de Otimização da VPS - Black Friday RZ VET

Este guia explica como aplicar as otimizações de performance na VPS.

## 📋 Otimizações Aplicadas

### Frontend (Já aplicadas)
- ✅ `decoding="async"` em todas as imagens
- ✅ `fetchpriority="high"` no primeiro banner
- ✅ `loading="lazy"` em imagens de produtos
- ✅ Preload do primeiro banner no HTML
- ✅ Width/Height definidos para evitar layout shift

### Backend/VPS (Aplicar manualmente)
- ✅ Compressão Gzip para todos os assets
- ✅ Cache otimizado para imagens, CSS, JS
- ✅ Otimizações de rede (TCP, buffers)
- ✅ Limites do sistema otimizados

## 🔧 Como Aplicar as Otimizações na VPS

### Opção 1: Script Automático (Recomendado)

```bash
# 1. Certifique-se de que tem Python 3 e paramiko instalado
pip install paramiko

# 2. Execute o script de aplicação
python apply-vps-optimizations.py
```

### Opção 2: Manual via SSH

```bash
# 1. Conecte-se à VPS
ssh root@72.60.150.75

# 2. Faça upload dos arquivos
scp nginx-optimized.conf root@72.60.150.75:/tmp/
scp vps-optimize.sh root@72.60.150.75:/tmp/

# 3. Execute o script de otimização
ssh root@72.60.150.75 "bash /tmp/vps-optimize.sh"

# 4. Aplique a configuração do Nginx
ssh root@72.60.150.75 "cp /tmp/nginx-optimized.conf /etc/nginx/sites-available/blackfriday-rzvet"
ssh root@72.60.150.75 "ln -sf /etc/nginx/sites-available/blackfriday-rzvet /etc/nginx/sites-enabled/"

# 5. Teste e reinicie
ssh root@72.60.150.75 "nginx -t && systemctl restart nginx"
```

### Opção 3: Usando ssh_run.py

```bash
# 1. Upload dos arquivos (usar SCP ou outro método)
# 2. Executar comandos via ssh_run.py
python ssh_run.py "bash /tmp/vps-optimize.sh"
python ssh_run.py "nginx -t"
python ssh_run.py "systemctl restart nginx"
```

## ⚙️ Configurações Aplicadas

### Nginx
- **Compressão Gzip**: Nível 6 para CSS, JS, HTML, JSON
- **Cache de Imagens**: 1 ano (imutável)
- **Cache de CSS/JS**: 30 dias
- **Cache de HTML**: 1 hora
- **Cache de JSON**: 5 minutos

### Sistema
- **Worker Processes**: Auto (baseado em CPUs)
- **Worker Connections**: 1024
- **Keepalive Timeout**: 65s
- **TCP Optimizations**: BBR congestion control, fast open

## 🔍 Verificações Pós-Instalação

### 1. Verificar Compressão Gzip
```bash
curl -H "Accept-Encoding: gzip" -I http://seu-dominio.com/styles.css
# Deve retornar: Content-Encoding: gzip
```

### 2. Verificar Cache Headers
```bash
curl -I http://seu-dominio.com/banners/desktop/USG\ BANNER\ DESK.webp
# Deve retornar: Cache-Control: public, immutable
```

### 3. Verificar Status do Nginx
```bash
systemctl status nginx
```

### 4. Verificar Logs
```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## ⚠️ Importante

1. **Backup**: Sempre faça backup antes de aplicar mudanças
2. **Server Name**: Ajuste o `server_name` no `nginx-optimized.conf` para seu domínio
3. **Teste**: Sempre teste com `nginx -t` antes de reiniciar
4. **Monitoramento**: Monitore os logs após aplicar as mudanças

## 🐛 Troubleshooting

### Nginx não inicia
```bash
# Verificar erros
nginx -t
tail -f /var/log/nginx/error.log

# Restaurar backup
cp /etc/nginx/sites-available/default.backup.* /etc/nginx/sites-available/default
systemctl restart nginx
```

### Compressão não funciona
```bash
# Verificar se módulo gzip está habilitado
nginx -V 2>&1 | grep -o with-http_gzip_module

# Verificar headers
curl -H "Accept-Encoding: gzip" -I http://seu-dominio.com/
```

### Cache não funciona
```bash
# Verificar headers de cache
curl -I http://seu-dominio.com/banners/desktop/USG\ BANNER\ DESK.webp

# Limpar cache do navegador e testar novamente
```

## 📊 Resultados Esperados

Após aplicar as otimizações, você deve ver:

- ✅ **Redução de 60-80% no tamanho dos arquivos** (com Gzip)
- ✅ **Tempo de carregamento reduzido em 40-60%**
- ✅ **Menor uso de banda** (cache de imagens)
- ✅ **Melhor score no PageSpeed Insights**
- ✅ **Menor carga no servidor** (cache eficiente)

## 🔄 Reverter Mudanças

Se precisar reverter:

```bash
# Remover configuração customizada
rm /etc/nginx/sites-enabled/blackfriday-rzvet

# Restaurar configuração padrão
cp /etc/nginx/sites-available/default.backup.* /etc/nginx/sites-available/default

# Reiniciar
systemctl restart nginx
```

## 📞 Suporte

Em caso de problemas, verifique:
1. Logs do Nginx: `/var/log/nginx/error.log`
2. Status do serviço: `systemctl status nginx`
3. Configuração: `nginx -t`


