# Instruções para enviar o projeto para o GitHub

## 1. Autenticar no GitHub

Para autenticar no GitHub, siga um dos métodos abaixo:

### Método 1: Usando GitHub CLI (gh)

```bash
# Instalar GitHub CLI (se não estiver instalado)
brew install gh

# Autenticar
gh auth login
```

Siga as instruções na tela para completar a autenticação.

### Método 2: Configurar credenciais Git

```bash
# Configurar seu nome e email
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@exemplo.com"

# Configurar armazenamento de credenciais
git config --global credential.helper osxkeychain
```

## 2. Criar um novo repositório no GitHub

### Usando GitHub CLI

```bash
# Criar repositório e enviar código
gh repo create restaurantesaas --private --source=. --remote=origin --push
```

### Manualmente através do navegador

1. Acesse [GitHub](https://github.com/new)
2. Preencha o nome do repositório: `restaurantesaas`
3. Escolha se será público ou privado
4. Não inicialize com README, .gitignore ou licença
5. Clique em "Criar repositório"

Após criar o repositório, execute:

```bash
# Adicionar o remote (substitua SEU-USUARIO pelo seu nome de usuário GitHub)
git remote add origin https://github.com/SEU-USUARIO/restaurantesaas.git

# Enviar o código para o GitHub
git push -u origin master
```

## 3. Verificar se o envio foi bem-sucedido

```bash
# Verificar status
git status

# Verificar remotes configurados
git remote -v
```

Seu código estará disponível em https://github.com/SEU-USUARIO/restaurantesaas

## 4. Sobre o domínio atendimento.adm.br

O sistema foi configurado para utilizar o domínio `atendimento.adm.br`. Todas as referências ao domínio foram atualizadas nos seguintes arquivos:

- `configure-ssl.sh`: Configurado para obter certificado SSL para atendimento.adm.br
- `deploy.sh`: Atualizado para mostrar o novo domínio nas mensagens
- `backend/.env`: Configurado com o domínio para CORS
- `frontend/.env`: Atualizado para apontar para a API no domínio correto
- `README.md`: Atualizado com referências ao novo domínio

Para uso em produção, certifique-se de que o DNS do domínio está configurado corretamente para apontar para o IP do seu servidor antes de executar o script de configuração SSL. 