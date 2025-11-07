
# Backend — Eventos e Ingressos

## O que tem
- Cadastro e login simples (sem JWT)
- Criar, listar, editar e remover eventos
- Compra via **Pix simulado** e **gera QR Code (UUID)**
- Ver **meus ingressos**

## Como rodar
```bash
# dentro da pasta backend/
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

## Rotas principais
### Usuários
- `POST /api/usuarios/registrar/` → cria usuário (username, email, password, tipo)
- `POST /api/usuarios/login/` → login simples (retorna mensagem e um token fictício)
- `GET  /api/usuarios/perfil/` → dados básicos do usuário (usa sessão simples)

### Eventos
- `GET  /api/eventos/` → lista todos
- `POST /api/eventos/` → cria um evento
- `GET  /api/eventos/<id>/` → detalhes
- `PUT  /api/eventos/<id>/` → edita
- `DELETE /api/eventos/<id>/` → apaga
- `GET  /api/eventos/meus/` → lista ingressos do usuário (usa username logado ou ?username=alice)

### Pagamentos (Pix simples)
- `POST /api/pagamentos/pix/` → inicia compra (pendente) e retorna `codigo_pix`
- `POST /api/pagamentos/pix/confirmar/` → confirma (aprovado), **abate estoque** e cria ingresso com `qr_code`

> **Observação:** Este backend usa autenticação **simples de sessão** (sem JWT), para facilitar o entendimento. Se o seu front esperar um token JWT, você pode adaptar a tela de login para **apenas armazenar o `token_fake`** que retornamos e enviar em headers (o backend atual ignora esse token, é só para compatibilidade visual no front).
