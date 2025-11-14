# Checklist Pré-Deploy

Use este checklist antes de fazer o deploy em produção.

## ✅ Configuração

- [ ] Arquivo `.env` configurado com variáveis necessárias
- [ ] `PORT` definido corretamente (padrão: 8788)
- [ ] `NODE_OPTIONS=--openssl-legacy-provider` configurado (se Node 18+)

## ✅ Código

- [ ] Código limpo (sem console.log/error desnecessários)
- [ ] Sem código comentado ou não utilizado
- [ ] Todas as funcionalidades testadas localmente
- [ ] Testes unitários passando (`npm test`)
- [ ] Validação do Google Sheets funcionando (`npm run check:sheets`)

## ✅ Arquivos Estáticos

- [ ] Todas as imagens de produtos carregadas corretamente
- [ ] Banners desktop e mobile configurados
- [ ] Logos e assets presentes
- [ ] Arquivos JSON de dados (`products.json`, `accessories.json`, `banners.json`) atualizados

## ✅ Funcionalidades

- [ ] Página de promoções funcionando (`promocoes.html`)
- [ ] Carrossel de banners funcionando
- [ ] Contador regressivo funcionando
- [ ] Navegação por categorias funcionando (Equipamentos/Acessórios)
- [ ] Smooth scroll funcionando
- [ ] Barra de navegação mobile funcionando
- [ ] Meta Pixel configurado e rastreando eventos
- [ ] Links "Ver Produto" redirecionando corretamente para rzvet.com.br

## ✅ API

- [ ] Endpoint `/api/health` retornando status correto
- [ ] Servidor servindo arquivos estáticos corretamente
- [ ] Logs sendo gerados corretamente

## ✅ Performance

- [ ] Imagens otimizadas (formato WebP)
- [ ] Lazy loading de imagens funcionando
- [ ] Código JavaScript minificado (se aplicável)
- [ ] CSS otimizado

## ✅ Segurança

- [ ] Variáveis sensíveis em `.env` (não commitadas)
- [ ] CORS configurado apenas para domínios permitidos
- [ ] Validação de entrada no formulário
- [ ] Rate limiting considerado (se necessário)

## ✅ Responsividade

- [ ] Layout funcionando em desktop
- [ ] Layout funcionando em tablet
- [ ] Layout funcionando em mobile
- [ ] Navegação mobile funcionando corretamente
- [ ] Área de toque adequada em mobile

## ✅ Acessibilidade

- [ ] ARIA labels presentes
- [ ] Navegação por teclado funcionando
- [ ] Contraste de cores adequado
- [ ] Textos alternativos em imagens

## ✅ Monitoramento

- [ ] Logs configurados
- [ ] Health check endpoint funcionando
- [ ] Sistema de alertas configurado (se aplicável)

## ✅ Documentação

- [ ] README.md atualizado
- [ ] DEPLOY.md revisado
- [ ] CHANGELOG.md atualizado
- [ ] Documentação técnica atualizada

## ✅ Testes Finais

- [ ] Teste completo da página de promoções
- [ ] Teste de carregamento de produtos e acessórios
- [ ] Teste de links de produtos (redirecionamento)
- [ ] Teste de navegação entre categorias
- [ ] Teste do carrossel de banners
- [ ] Teste em diferentes navegadores (Chrome, Firefox, Safari, Edge)
- [ ] Teste em diferentes dispositivos (desktop, tablet, mobile)

## ✅ Deploy

- [ ] Backup dos dados existentes feito
- [ ] Servidor/container preparado
- [ ] Variáveis de ambiente configuradas no servidor
- [ ] Processo manager configurado (PM2, Docker, etc.)
- [ ] Proxy reverso configurado (Nginx, etc.)
- [ ] SSL/HTTPS configurado
- [ ] Domínio apontando corretamente

## ✅ Pós-Deploy

- [ ] Health check retornando `"status": "ok"`
- [ ] Página de promoções carregando corretamente
- [ ] Produtos e acessórios sendo exibidos
- [ ] Links de produtos funcionando
- [ ] Meta Pixel rastreando eventos
- [ ] Logs sendo gerados corretamente
- [ ] Performance adequada
- [ ] Sem erros no console do navegador

---

**Data do Deploy:** _______________  
**Responsável:** _______________  
**Observações:** _______________

