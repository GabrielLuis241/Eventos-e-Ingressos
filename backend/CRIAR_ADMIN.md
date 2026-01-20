# 👨‍💼 Como Criar o Administrador Padrão

## 📋 Passo a Passo

### 1️⃣ Navegue até a pasta do backend

```bash
cd backend
```

### 2️⃣ Execute o script de criação do admin

**Versão automática (recomendada):**
```bash
python create_default_admin_auto.py
```

**Versão interativa (opcional):**
```bash
python create_default_admin.py
```

### 3️⃣ O script irá criar um admin com as seguintes credenciais:

```
👤 Usuário: admin
📧 Email: admin@eventos.com
🔑 Senha: 123
🎭 Tipo: organizador
```

## ⚠️ IMPORTANTE!

- **Compartilhe essas credenciais com sua equipe** para que todos possam acessar
- Após o primeiro login, **recomendamos alterar a senha** por segurança
- Se o admin já existe, o script oferece a opção de **resetar a senha**

## 🔐 Funcionalidades do Administrador

Um administrador tem acesso a:

✅ Criar, editar e excluir eventos
✅ Visualizar relatórios e dashboard completo
✅ Cadastrar novos administradores
✅ Todas as funcionalidades do sistema

## 🚀 Como seus colegas podem acessar?

1. Acesse a aplicação: `http://localhost:3000/login`
2. Faça login com as credenciais do admin padrão
3. Navegue para **Gerenciar Eventos** → **👨‍💼 Novo Admin**
4. Cadastre novos administradores para sua equipe

## 🆘 Problemas?

Se encontrar algum erro ao executar o script:

1. Certifique-se de estar na pasta `backend`
2. Verifique se todas as dependências estão instaladas: `pip install -r requirements.txt`
3. Verifique se o banco de dados está funcionando

---

**💡 Dica:** Mantenha essas credenciais em um local seguro e compartilhe apenas com pessoas autorizadas!
