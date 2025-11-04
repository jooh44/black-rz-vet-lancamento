
## 1. `<VisaoGeralDoProjeto>`

* **Objetivo:** Criar uma página de captura de leads (Landing Page) de alta conversão para uma lista de espera VIP da "Black Days RZ VET".
* **Público-Alvo:** Médicos veterinários e proprietários de clínicas no Brasil.
* **Domínio de Hospedagem:** `rzequipamentos.com.br`
* **Princípio Central:** O design deve ser **limpo**, **direto** e **mobile-first**, minimizando o atrito para o usuário se inscrever. Deve priorizar a **clareza e facilidade de uso**.

---

## 2. `<StackTecnologicoRecomendado>`

* **Frontend:**
    * **HTML5 Semântico:** Use tags HTML semânticas (como `<header>`, `<main>`, `<section>`, `<form>`) para acessibilidade.
    * **CSS3 (Tailwind CSS):** Utilize o framework Tailwind CSS. Ele é excelente para criar layouts responsivos rapidamente (Mobile-First) e é bem conhecido por IAs de código. Isso garantirá a aderência ao nosso **Responsive Grid System**.
    * **JavaScript (ES6+):** Use JavaScript puro (Vanilla JS) ou Alpine.js (que combina bem com Tailwind) para validação de formulário no lado do cliente e para a chamada `fetch` da API do backend.
* **Backend (Lead Capture):**
    * **Google Sheets (via Google Apps Script):** Crie um script no Google Apps Script que funcione como uma API. Ele receberá os dados do formulário (via POST) e os inserirá em uma planilha.
* **Hospedagem & Deploy:**
    * **Servidor:** VPS Hostinger (Linux).
    * **Deployment:** GitHub Actions (CI/CD) para deploy automático via SSH no servidor.

---

## 3. `<EstruturaDaPaginaEComponentes>`

### 3.1. `<Header>`

* **Conteúdo:** Apenas o logo da RZ VET.
* **Design:** Limpo, com espaçamento generoso (aderindo ao **White Space**). Fixo no topo (sticky) ou estático.

### 3.2. `<HeroSection>`

* **Objetivo:** Capturar a atenção imediatamente e apresentar a proposta de valor.
* **H1 (Título Principal):** Chamada forte e clara.
    * *Exemplo:* "A Black Friday dos Vets está chegando. Entre na Lista VIP."
* **Parágrafo (Subtítulo):** Explique o benefício de entrar na lista.
    * *Exemplo:* "Seja o primeiro a saber e tenha acesso aos maiores descontos em equipamentos."
* **Placeholder de Conteúdo (Data):**
    * ``
* **Visual:** Pode incluir uma imagem de banner de alta qualidade (otimizada para WebP) que remeta a equipamentos veterinários e Black Friday.

### 3.3. `<FormSection>`

* **Objetivo:** O ponto principal de conversão. Deve estar "above the fold" (acima da dobra) ou imediatamente após a Hero.
* **ID do Formulário:** `id="form-waitlist"`
* **Método:** `POST`
* **Campos Obrigatórios (Inputs):**
    1.  **Nome Completo:**
        * `<label for="nome">Nome Completo</label>`
        * `<input type="text" id="nome" name="nome" required>`
    2.  **Telefone (WhatsApp):**
        * `<label for="telefone">Melhor Telefone (WhatsApp)</label>`
        * `<input type="tel" id="telefone" name="telefone" required>`
        * *Instrução JS:* Aplicar máscara de telefone (ex: `(XX) XXXXX-XXXX`).
    3.  **Área de Atuação:**
        * `<label for="atuacao">Sua principal área de atuação</label>`
        * `<select id="atuacao" name="atuacao" required>`
        * `<option value="" disabled selected>Selecione sua área</option>`
        * `<option value="pequenos_animais">Pequenos Animais</option>`
        * `<option value="grandes_animais">Grandes Animais</option>`
        * `<option value="animais_silvestres">Animais Silvestres</option>`
        * `<option value="mista">Mista / Outra</option>`
        * `</select>`
    4.  **Possui Clínica Própria?**
        * `<fieldset>`
        * `<legend>Você possui clínica própria?</legend>`
        * `<input type="radio" id="clinica_sim" name="possui_clinica" value="sim" required><label for="clinica_sim">Sim</label>`
        * `<input type="radio" id="clinica_nao" name="possui_clinica" value="nao"><label for="clinica_nao">Não</label>`
        * `</fieldset>`
* **Botão (CTA):**
    * Texto claro e acionável. Ex: "QUERO ACESSO VIP" ou "ENTRAR NA LISTA DE ESPERA".
    * Deve ter estados claros: `default`, `hover`, `active`, `disabled`.
* **Feedback de Envio:**
    * Implementar mensagens de **sucesso** (ex: "Obrigado! Seu nome está na lista.") e **erro** (ex: "Ops! Algo deu errado. Tente novamente.") usando as cores semânticas.

### 3.4. `<ProductPreviewSection>` (Opcional, mas recomendado)

* **Objetivo:** Aumentar o desejo mostrando o que está por vir.
* **Título (H2):** "O que esperar na Black Days RZ VET"
* **Conteúdo:**
    * ``
    * ``

### 3.5. `<Footer>`

* **Conteúdo:** Simples.
    * "© [Ano Atual] RZ Equipamentos. Todos os direitos reservados."
    * Link para o site principal: `rzvet.com.br`

---

## 4. `<Backend (Google Apps Script)>`

* **Instrução para a IA:** "Crie um script no Google Apps Script para ser publicado como um aplicativo da web (WebApp)."
* **Função `doPost(e)`:**
    1.  O script deve ser capaz de receber uma requisição `POST` com dados `JSON` ou `form-data`.
    2.  Abrir a Google Sheet pelo ID: `const sheet = SpreadsheetApp.openById('ID_DA_SUA_PLANILHA [INSIRA MAIS AQUI]').getSheetByName('Leads');`
    3.  Pegar os dados do evento: `e.parameters`.
    4.  Adicionar uma nova linha (`appendRow`) com os dados: `[new Date(), nome, telefone, atuacao, possui_clinica]`.
    5.  Retornar uma resposta `JSON` de sucesso ou erro para o frontend.
* **Planilha (Google Sheet):**
    * Nome: "Leads Black Days RZ VET"
    * Abas: "Leads"
    * Colunas: `Timestamp`, `Nome`, `Telefone`, `Area_Atuacao`, `Possui_Clinica`

---

## 5. `<Deployment (GitHub Actions & SSH)>`

* **Instrução para a IA:** "Crie um arquivo de workflow `.github/workflows/deploy.yml`. Este workflow fará o deploy do código para uma VPS Hostinger usando SSH com autenticação por senha. O usuário fornecerá o IP, usuário e senha como GitHub Secrets."
* **Gatilho (Trigger):** `on: push: branches: [ main ]`
* **Secrets:** O usuário irá configurar os seguintes "Secrets" no repositório do GitHub:
    * `VPS_HOST_IP`: O endereço IP do servidor VPS.
    * `VPS_USERNAME`: O nome de usuário para login SSH (ex: 'root').
    * `VPS_PASSWORD`: A senha SSH para o usuário.
* **Arquivo de Workflow (`deploy.yml`):**

    ```yaml
    name: Deploy to Hostinger VPS

    on:
      push:
        branches:
          - main

    jobs:
      build-and-deploy:
        runs-on: ubuntu-latest

        steps:
        - name: Checkout code
          uses: actions/checkout@v3

        # Passo 1: Configurar Node.js e construir o CSS (Necessário para Tailwind)
        - name: Setup Node.js
          uses: actions/setup-node@v3
          with:
            node-version: '18' # Use uma versão LTS
            cache: 'npm'
            
        - name: Install dependencies
          run: npm install # Assumindo que você tem um package.json

        - name: Build Tailwind CSS
          run: npm run build:css # Substitua pelo seu script de build real (ex: 'npx tailwindcss -o ./dist/style.css --minify')

        # Passo 2: Fazer o deploy dos arquivos via SSH
        - name: Deploy to VPS
          uses: appleboy/ssh-action@master
          with:
            host: ${{ secrets.VPS_HOST_IP }}
            username: ${{ secrets.VPS_USERNAME }}
            password: ${{ secrets.VPS_PASSWORD }}
            port: 22 # Porta SSH padrão
            script: |
              # Navegue até o diretório do seu site na VPS
              # Exemplo: cd /var/www/rzequipamentos.com.br
              cd /caminho/para/seu/site [INSIRA MAIS AQUI]
              
              # Puxe as últimas alterações do repositório
              git pull origin main
              
              # Reinstale dependências (se necessário)
              # npm install --production
              
              # Reinicie seu servidor (se estiver usando PM2, por exemplo)
              # pm2 restart nome-do-app
    ```