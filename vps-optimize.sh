#!/bin/bash
# Script de Otimização da VPS para Black Friday RZ VET
# Execute com: bash vps-optimize.sh

set -e

echo "🚀 Iniciando otimizações da VPS..."

# 1. Atualizar sistema
echo "📦 Atualizando sistema..."
apt-get update -qq
apt-get upgrade -y -qq

# 2. Instalar/Atualizar Nginx
echo "🌐 Instalando Nginx..."
apt-get install -y nginx -qq

# 3. Instalar módulos Nginx úteis (se disponíveis)
echo "🔧 Instalando módulos Nginx..."
apt-get install -y nginx-module-brotli -qq 2>/dev/null || echo "Brotli não disponível, continuando..."

# 4. Backup da configuração atual do Nginx
echo "💾 Fazendo backup da configuração atual..."
if [ -f /etc/nginx/sites-available/default ]; then
    cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup.$(date +%Y%m%d_%H%M%S)
fi

# 5. Aplicar configuração otimizada
echo "⚙️ Aplicando configuração otimizada do Nginx..."
# Nota: O arquivo nginx-optimized.conf deve ser copiado para o servidor primeiro
# cp nginx-optimized.conf /etc/nginx/sites-available/blackfriday-rzvet
# ln -sf /etc/nginx/sites-available/blackfriday-rzvet /etc/nginx/sites-enabled/

# 6. Otimizar configuração do Nginx principal
echo "🔧 Otimizando configuração principal do Nginx..."
cat >> /etc/nginx/nginx.conf << 'EOF'

# Otimizações de Performance
worker_processes auto;
worker_connections 1024;
worker_rlimit_nofile 2048;

# Otimizações de I/O
sendfile on;
tcp_nopush on;
tcp_nodelay on;
keepalive_timeout 65;
types_hash_max_size 2048;

# Gzip global
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
gzip_disable "msie6";
gzip_min_length 1000;

EOF

# 7. Habilitar compressão Brotli (se disponível)
if command -v brotli &> /dev/null; then
    echo "🗜️ Habilitando compressão Brotli..."
    # Configuração Brotli será adicionada se o módulo estiver disponível
fi

# 8. Otimizar limites do sistema
echo "⚙️ Otimizando limites do sistema..."
cat >> /etc/security/limits.conf << 'EOF'

# Limites otimizados para Nginx
www-data soft nofile 65535
www-data hard nofile 65535
root soft nofile 65535
root hard nofile 65535

EOF

# 9. Otimizar sysctl para melhor performance de rede
echo "🌐 Otimizando configurações de rede..."
cat >> /etc/sysctl.conf << 'EOF'

# Otimizações de rede para melhor performance
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_rmem = 4096 87380 16777216
net.ipv4.tcp_wmem = 4096 65536 16777216
net.ipv4.tcp_congestion_control = bbr
net.core.default_qdisc = fq
net.ipv4.tcp_fastopen = 3

EOF

sysctl -p

# 10. Verificar e reiniciar Nginx
echo "🔄 Testando configuração do Nginx..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Configuração válida! Reiniciando Nginx..."
    systemctl restart nginx
    systemctl enable nginx
    echo "✅ Nginx reiniciado com sucesso!"
else
    echo "❌ Erro na configuração do Nginx. Verifique os logs."
    exit 1
fi

# 11. Instalar e configurar PM2 para Node.js (se aplicável)
if command -v node &> /dev/null; then
    echo "📦 Configurando PM2..."
    npm install -g pm2 -qq 2>/dev/null || echo "PM2 já instalado ou npm não disponível"
fi

# 12. Configurar firewall básico (se UFW estiver disponível)
if command -v ufw &> /dev/null; then
    echo "🔥 Configurando firewall..."
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw --force enable 2>/dev/null || echo "Firewall já configurado"
fi

echo ""
echo "✅ Otimizações concluídas!"
echo ""
echo "📋 Próximos passos:"
echo "1. Copie o arquivo nginx-optimized.conf para o servidor"
echo "2. Ajuste o server_name no arquivo de configuração"
echo "3. Aplique a configuração: ln -sf /etc/nginx/sites-available/blackfriday-rzvet /etc/nginx/sites-enabled/"
echo "4. Teste: nginx -t"
echo "5. Reinicie: systemctl restart nginx"
echo ""
echo "🔍 Verificar status: systemctl status nginx"
echo "📊 Monitorar logs: tail -f /var/log/nginx/access.log"




