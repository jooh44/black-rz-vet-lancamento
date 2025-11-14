# 🚀 Otimizações de PageSpeed Mobile - Black Friday RZ VET

## 📋 Resumo das Otimizações Implementadas

### ✅ HTML (index.html e promocoes.html)

1. **Meta Pixel Otimizado**
   - Adicionado `defer` ao script do Meta Pixel para não bloquear renderização
   - Script já estava com `async`, agora também tem `defer` para garantir não-bloqueio

2. **Resource Hints Melhorados**
   - Adicionado `dns-prefetch` para `www.facebook.com`
   - Mantidos `preconnect` para recursos críticos (Google Fonts, Facebook)
   - Adicionado `preload` para `promocoes.js` (script principal)

3. **Carregamento de CSS Não-Bloqueante**
   - CSS principal carregado com técnica `media="print" onload="this.media='all'"`
   - Polyfill inline para garantir carregamento em navegadores antigos
   - Fallback com `<noscript>` para navegadores sem JavaScript

4. **Carregamento de Fontes Otimizado**
   - Google Fonts carregado com técnica não-bloqueante
   - Mantido `display=swap` para evitar FOIT (Flash of Invisible Text)
   - Preload do CSS de fontes com `crossorigin`

### ✅ JavaScript (promocoes.js)

1. **Cache de Detecção Mobile**
   - Função `isMobileDevice()` agora usa cache para evitar recálculos
   - Cache invalidado apenas em eventos de resize/orientationchange

2. **Inicialização Otimizada**
   - Inicializações críticas (countdown, banners) executam imediatamente
   - Inicializações não-críticas (produtos, acessórios) usam `requestIdleCallback`
   - Timeout de 2 segundos para garantir execução mesmo em dispositivos lentos

3. **Event Listeners Otimizados**
   - `DOMContentLoaded` usa `{ once: true }` para evitar múltiplas execuções
   - Resize handler otimizado com `requestAnimationFrame` para evitar thrashing
   - Debounce aumentado para 200ms (de 150ms) para melhor performance

4. **Renderização Progressiva**
   - Mantido batch rendering (primeiros 6 cards imediatamente)
   - Resto dos cards renderizados com `requestIdleCallback`
   - Reduz bloqueio da thread principal

## 📊 Melhorias Esperadas no PageSpeed

### Antes das Otimizações:
- ❌ CSS bloqueando renderização
- ❌ Fontes bloqueando renderização
- ❌ Meta Pixel bloqueando renderização
- ❌ JavaScript executando tudo no carregamento
- ❌ Sem cache de detecção mobile

### Depois das Otimizações:
- ✅ **First Contentful Paint (FCP)**: Redução esperada de 20-30%
- ✅ **Largest Contentful Paint (LCP)**: Melhorado com preload de recursos críticos
- ✅ **Time to Interactive (TTI)**: Melhorado com inicialização otimizada
- ✅ **Total Blocking Time (TBT)**: Reduzido com requestIdleCallback
- ✅ **Cumulative Layout Shift (CLS)**: Mantido baixo com dimensões de imagens

## 🎯 Métricas Alvo

- **FCP**: < 1.8s (mobile)
- **LCP**: < 2.5s (mobile)
- **TTI**: < 3.8s (mobile)
- **TBT**: < 200ms (mobile)
- **CLS**: < 0.1

## 🚀 Como Aplicar na VPS

### Opção 1: Script Automatizado (Recomendado)

```bash
python deploy-optimizations.py
```

O script irá:
1. Criar backup automático dos arquivos atuais
2. Fazer upload dos arquivos otimizados
3. Atualizar configuração do Nginx
4. Testar e recarregar o Nginx
5. Reiniciar servidor Node.js (PM2 ou systemd)

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
scp public/promocoes.js root@72.60.150.75:/var/www/html/public/promocoes.js
scp public/app.js root@72.60.150.75:/var/www/html/public/app.js
scp public/styles.css root@72.60.150.75:/var/www/html/public/styles.css

# 4. Atualizar Nginx
scp nginx-optimized.conf root@72.60.150.75:/tmp/nginx-optimized.conf
ssh root@72.60.150.75 "sudo cp /tmp/nginx-optimized.conf /etc/nginx/sites-available/default"
ssh root@72.60.150.75 "sudo nginx -t"
ssh root@72.60.150.75 "sudo systemctl reload nginx"

# 5. Reiniciar servidor Node.js
ssh root@72.60.150.75 "pm2 restart black-friday-rz-vet || sudo systemctl restart node-black-friday"
```

## 🧪 Testar Performance

### Ferramentas Recomendadas:
1. **Google PageSpeed Insights**: https://pagespeed.web.dev/
2. **GTmetrix**: https://gtmetrix.com/
3. **WebPageTest**: https://www.webpagetest.org/
4. **Chrome DevTools** (Network tab + Lighthouse)

### Comandos Úteis:

```bash
# Verificar compressão Gzip
curl -H "Accept-Encoding: gzip" -I https://rzequipamentos.com.br/styles.css

# Verificar cache headers
curl -I https://rzequipamentos.com.br/banners/mobile/USG\ BANNER\ MOBILE.webp

# Verificar status do Nginx
ssh root@72.60.150.75 "sudo systemctl status nginx"

# Ver logs do Nginx
ssh root@72.60.150.75 "sudo tail -f /var/log/nginx/error.log"
```

## 📝 Checklist Pós-Deploy

- [ ] Verificar se o site carrega corretamente
- [ ] Testar formulário de leads (se aplicável)
- [ ] Verificar Meta Pixel funcionando
- [ ] Testar em diferentes dispositivos (mobile/desktop)
- [ ] Verificar headers de cache no DevTools
- [ ] Rodar PageSpeed Insights
- [ ] Verificar logs do Nginx para erros
- [ ] Testar carregamento de imagens
- [ ] Verificar carregamento de fontes
- [ ] Testar navegação e interatividade

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
4. Status do PM2: `pm2 list` ou `pm2 logs`

---

**Última atualização**: $(date)
**Versão**: 2.0.0
**Status**: ✅ Pronto para Deploy

