#!/bin/bash
# Script para aplicar otimizações de performance na VPS
# Uso: ./deploy-optimizations.sh

set -e

HOST="72.60.150.75"
USER="root"
REMOTE_DIR="/var/www/html"
NGINX_CONFIG="/etc/nginx/sites-available/default"

echo "🚀 Iniciando deploy de otimizações..."

# Backup dos arquivos atuais
echo "📦 Criando backup..."
ssh ${USER}@${HOST} "mkdir -p ${REMOTE_DIR}/backup-$(date +%Y%m%d-%H%M%S) && cp -r ${REMOTE_DIR}/public ${REMOTE_DIR}/backup-$(date +%Y%m%d-%H%M%S)/public-$(date +%Y%m%d-%H%M%S) || true"

# Copiar arquivos otimizados
echo "📤 Copiando arquivos otimizados..."
scp public/index.html ${USER}@${HOST}:${REMOTE_DIR}/public/index.html
scp public/app.js ${USER}@${HOST}:${REMOTE_DIR}/public/app.js
scp public/styles.css ${USER}@${HOST}:${REMOTE_DIR}/public/styles.css

# Atualizar configuração do Nginx
echo "⚙️  Atualizando configuração do Nginx..."
scp nginx-optimized.conf ${USER}@${HOST}:/tmp/nginx-optimized.conf
ssh ${USER}@${HOST} "sudo cp /tmp/nginx-optimized.conf ${NGINX_CONFIG} && sudo nginx -t && sudo systemctl reload nginx"

# Verificar serviços
echo "✅ Verificando serviços..."
ssh ${USER}@${HOST} "sudo systemctl status nginx --no-pager | head -5"

echo "✨ Deploy concluído com sucesso!"
echo "🌐 Teste o site e verifique a performance!"

