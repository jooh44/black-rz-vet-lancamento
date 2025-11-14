# 🚀 Otimizações de Performance - Black Friday RZ VET

## 📋 Resumo das Otimizações Implementadas

### ✅ HTML (index.html e promocoes.html)
- ✅ **DNS Prefetch e Preconnect** para recursos externos (Google Fonts, Facebook Pixel)
- ✅ **Preload de recursos críticos** (CSS, logos, fonts)
- ✅ **Atributos de performance em imagens** (width, height, loading="eager", fetchpriority="high")
- ✅ **Defer em scripts** para não bloquear renderização
- ✅ **Google Fonts otimizado** com display=swap

### ✅ JavaScript
- ✅ **Defer adicionado** aos scripts principais
- ✅ **Meta Pixel otimizado** (já estava async)

### ✅ Servidor Express (server/app.js)
- ✅ **Headers de cache** para arquivos estáticos
- ✅ **Headers de segurança e performance** (X-Content-Type-Options, X-DNS-Prefetch-Control)
- ✅ **Cache diferenciado** por tipo de arquivo:
  - Imagens: 1 ano (immutable)
  - CSS/JS: 30 dias
  - HTML: 1 hora (must-revalidate)

### ✅ Nginx (nginx-optimized.conf)
- ✅ **Compressão Gzip** otimizada com buffers
- ✅ **Cache headers** para todos os tipos de arquivo
- ✅ **TCP optimizations** (tcp_nopush, tcp_nodelay)
- ✅ **Headers de performance** adicionais

## 🚀 Como Aplicar na VPS

### Opção 1: Script Python Automatizado (Recomendado)

```bash
python deploy-optimizations.py
```

O script irá:
1. Criar backup automático dos arquivos atuais
2. Fazer upload dos arquivos otimizados
3. Atualizar configuração do Nginx
4. Testar e recarregar o Nginx

### Opção 2: Manual via SSH

```bash
# 1. Conectar na VPS
ssh root@72.60.150.75

# 2. Criar backup
mkdir -p /var/www/html/backup-$(date +%Y%m%d-%H%M%S)
cp -r /var/www/html/public /var/www/html/backup-$(date +%Y%m%d-%H%M%S)/public-$(date +%Y%m%d-%H%M%S)

# 3. Copiar arquivos otimizados (do seu computador)
scp public/index.html root@72.60.150.75:/var/www/html/public/index.html
scp public/promocoes.html root@72.60.150.75:/var/www/html/public/promocoes.html
scp public/app.js root@72.60.150.75:/var/www/html/public/app.js
scp public/promocoes.js root@72.60.150.75:/var/www/html/public/promocoes.js
scp public/styles.css root@72.60.150.75:/var/www/html/public/styles.css
scp server/app.js root@72.60.150.75:/var/www/html/server/app.js

# 4. Atualizar Nginx
scp nginx-optimized.conf root@72.60.150.75:/tmp/nginx-optimized.conf
ssh root@72.60.150.75 "sudo cp /tmp/nginx-optimized.conf /etc/nginx/sites-available/default"
ssh root@72.60.150.75 "sudo nginx -t"
ssh root@72.60.150.75 "sudo systemctl reload nginx"
```

## 📊 Melhorias Esperadas

### Antes das Otimizações:
- ❌ Sem preload de recursos críticos
- ❌ Sem DNS prefetch/preconnect
- ❌ Scripts bloqueando renderização
- ❌ Cache não otimizado
- ❌ Headers de performance ausentes

### Depois das Otimizações:
- ✅ **First Contentful Paint (FCP)** reduzido em ~30-40%
- ✅ **Largest Contentful Paint (LCP)** melhorado com preload de imagens críticas
- ✅ **Time to Interactive (TTI)** melhorado com defer em scripts
- ✅ **Cache hit rate** aumentado significativamente
- ✅ **Bandwidth** reduzido com compressão Gzip otimizada

## 🧪 Testar Performance

### Ferramentas Recomendadas:
1. **Google PageSpeed Insights**: https://pagespeed.web.dev/
2. **GTmetrix**: https://gtmetrix.com/
3. **WebPageTest**: https://www.webpagetest.org/
4. **Chrome DevTools** (Network tab + Lighthouse)

### Métricas para Monitorar:
- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.8s
- **Total Blocking Time (TBT)**: < 200ms
- **Cumulative Layout Shift (CLS)**: < 0.1

## 📝 Checklist Pós-Deploy

- [ ] Verificar se o site carrega corretamente
- [ ] Testar formulário de leads
- [ ] Verificar Meta Pixel funcionando
- [ ] Testar em diferentes dispositivos (mobile/desktop)
- [ ] Verificar headers de cache no DevTools
- [ ] Rodar PageSpeed Insights
- [ ] Verificar logs do Nginx para erros

## 🔄 Rollback (se necessário)

Se algo der errado, você pode restaurar o backup:

```bash
# Na VPS
cd /var/www/html
# Listar backups disponíveis
ls -la backup-*

# Restaurar backup específico
cp -r backup-YYYYMMDD-HHMMSS/public-YYYYMMDD-HHMMSS/* public/

# Restaurar configuração antiga do Nginx (se necessário)
sudo nano /etc/nginx/sites-available/default
sudo nginx -t
sudo systemctl reload nginx
```

## 📞 Suporte

Se encontrar problemas durante o deploy, verifique:
1. Logs do Nginx: `sudo tail -f /var/log/nginx/error.log`
2. Status do Nginx: `sudo systemctl status nginx`
3. Teste de configuração: `sudo nginx -t`

---

**Última atualização**: $(date)
**Versão**: 1.0.0

