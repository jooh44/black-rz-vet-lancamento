# Instruções para Salvar no GitHub

## 📦 Preparação do Repositório

O projeto está pronto para ser commitado e enviado para o GitHub.

## 🚀 Comandos para Executar

Execute os seguintes comandos na raiz do projeto (`Black Friday 2025`):

### 1. Inicializar Git (se ainda não foi feito)

```bash
git init
```

### 2. Adicionar Remote do GitHub

```bash
git remote add origin https://github.com/jooh44/black-rz-vet-lancamento.git
```

Ou se já existir um remote, atualize:

```bash
git remote set-url origin https://github.com/jooh44/black-rz-vet-lancamento.git
```

### 3. Adicionar Todos os Arquivos

```bash
git add .
```

### 4. Fazer Commit Inicial

```bash
git commit -m "feat: Página de promoções Black Days RZ VET v1.1.0

- Página de promoções com produtos e acessórios
- Carrossel de banners promocionais
- Contador regressivo
- Navegação por categorias com smooth scroll
- Barra de navegação mobile fixa
- Integração com Meta Pixel
- Servidor simplificado para arquivos estáticos
- Documentação completa de deploy
- Domínio: rzequipamentos.com.br"
```

### 5. Renomear Branch para main (se necessário)

```bash
git branch -M main
```

### 6. Enviar para o GitHub

```bash
git push -u origin main
```

## ⚠️ Arquivos Protegidos pelo .gitignore

Os seguintes arquivos **NÃO** serão commitados (protegidos pelo `.gitignore`):

- `node_modules/` - Dependências
- `.env` - Variáveis de ambiente (credenciais)
- `ssh_run.py` - Credenciais SSH
- `data/leads.json` - Dados de leads (se existir)
- `*.log` - Arquivos de log
- Arquivos temporários e de IDE

## ✅ Verificação

Após o push, verifique no GitHub:

1. Acesse: https://github.com/jooh44/black-rz-vet-lancamento
2. Confirme que todos os arquivos foram enviados
3. Verifique se o README.md está sendo exibido corretamente
4. Confirme que o `.gitignore` está funcionando (arquivos sensíveis não aparecem)

## 📝 Próximos Commits

Para futuras atualizações:

```bash
git add .
git commit -m "descrição da mudança"
git push
```

## 🔒 Segurança

**IMPORTANTE:** Certifique-se de que:
- ✅ `.env` está no `.gitignore`
- ✅ `ssh_run.py` está no `.gitignore`
- ✅ Nenhuma credencial está hardcoded no código
- ✅ `node_modules/` não será commitado

---

**Repositório:** https://github.com/jooh44/black-rz-vet-lancamento

