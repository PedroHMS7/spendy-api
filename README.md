# spendy-api

API REST para controle de finanças pessoais. Cada usuário cadastra suas
categorias (receita ou despesa), registra transações e consulta um resumo
mensal agrupado por categoria. Os dados de um usuário ficam isolados dos
demais: ninguém lê, edita ou exclui o que pertence a outra conta.

## Funcionalidades

- Registro e login com senha em hash (bcrypt) e autenticação via JWT
- CRUD de categorias e de transações, isolado por usuário
- Listagem de transações com filtros combináveis (`tipo`, `categoria_id`) e paginação
- Resumo mensal com totais e quantidade de transações por categoria
- Tratamento de erros centralizado, sem expor detalhes do banco ao cliente
- Testes unitários e de integração rodando no CI a cada push

## Tecnologias

- **Node.js + TypeScript** (strict mode)
- **Express 5**
- **MySQL** com `mysql2` (queries parametrizadas) e **Knex** para as migrations
- **bcrypt** e **jsonwebtoken** para autenticação
- **Jest**, **ts-jest** e **Supertest** para testes
- **GitHub Actions** para CI

## Arquitetura

Cada requisição passa por camadas com responsabilidades separadas:

```
rota → middleware de autenticação → controller → service → repository → MySQL
```

- **Controller**: lê a requisição e devolve a resposta HTTP.
- **Service**: regras de negócio e validação dos dados.
- **Repository**: acesso ao banco, sempre com parâmetros (`?`) para evitar SQL Injection.

Os erros esperados são classes próprias (`ErroValidacao`, `ErroNaoAutorizado`,
`ErroNaoEncontrado`, `ErroConflito`), cada uma com seu status HTTP. Um
middleware central converte esses erros em resposta. Qualquer erro inesperado
vira `500` com mensagem genérica e é registrado apenas no log do servidor.

```
src/
├── config/         conexão com o banco
├── controllers/
├── middlewares/    autenticação e tratamento de erros
├── migrations/     criação das tabelas (Knex)
├── repositories/
├── routes/
├── services/
├── tests/
├── types/          extensão do tipo Request do Express
└── utils/          classes de erro
```

## Como rodar

**Pré-requisitos:** Node.js 20+ e um servidor MySQL.

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie um arquivo `.env` a partir do `.env.example` e preencha:

   | Variável      | Descrição                                   |
   | ------------- | ------------------------------------------- |
   | `DB_HOST`     | Endereço do MySQL                           |
   | `DB_USER`     | Usuário do banco                            |
   | `DB_PASSWORD` | Senha do banco                              |
   | `DB_NAME`     | Nome do banco (precisa existir)             |
   | `DB_PORT`     | Porta do MySQL (padrão `3306`)              |
   | `PORT`        | Porta da API (padrão `3000`)                |
   | `JWT_SECRET`  | Chave usada para assinar os tokens          |

3. Crie as tabelas:

   ```bash
   npx knex migrate:latest
   ```

4. Suba a API em modo de desenvolvimento:

   ```bash
   npm run dev
   ```

Para produção, `npm run build` compila para `dist/` e `npm start` executa a
versão compilada. Com `NODE_ENV=production`, a conexão com o banco usa SSL.

## Testes

```bash
npm test
```

Os testes usam mocks dos repositories, então não precisam de banco. Só
precisam da variável `JWT_SECRET` (no `.env` local ou, no CI, via GitHub
Secrets).

## Endpoints

Todas as rotas, exceto registro e login, exigem o header:

```
Authorization: Bearer <token>
```

### Usuários

| Método | Rota                 | Descrição                      |
| ------ | -------------------- | ------------------------------ |
| POST   | `/usuarios/registro` | Cria uma conta                 |
| POST   | `/usuarios/login`    | Retorna um token JWT (1 hora)  |

```jsonc
// POST /usuarios/registro
{ "nome": "Maria", "email": "maria@email.com", "senha": "minhasenha" }

// POST /usuarios/login
{ "email": "maria@email.com", "senha": "minhasenha" }
// resposta: { "token": "eyJhbGciOi..." }
```

### Categorias

| Método | Rota              | Descrição                                   |
| ------ | ----------------- | ------------------------------------------- |
| GET    | `/categorias`     | Lista as categorias do usuário              |
| POST   | `/categorias`     | Cria uma categoria                          |
| PUT    | `/categorias/:id` | Atualiza uma categoria                      |
| DELETE | `/categorias/:id` | Exclui (bloqueado se houver transações)     |

```json
{ "nome": "Alimentação", "tipo": "despesa" }
```

`tipo` aceita `receita` ou `despesa`.

### Transações

| Método | Rota                  | Descrição                         |
| ------ | --------------------- | --------------------------------- |
| GET    | `/transacoes`         | Lista com filtros e paginação     |
| POST   | `/transacoes`         | Cria uma transação                |
| PUT    | `/transacoes/:id`     | Atualiza uma transação            |
| DELETE | `/transacoes/:id`     | Exclui uma transação              |
| GET    | `/transacoes/resumo`  | Resumo mensal por categoria       |

```json
{
  "descricao": "Almoço",
  "valor": 35.5,
  "tipo": "despesa",
  "data": "2026-01-15T12:30:00",
  "categoria_id": 1
}
```

`valor` deve ser um número positivo, e `categoria_id` precisa ser uma
categoria do próprio usuário.

**Listagem** (`GET /transacoes`), parâmetros opcionais:

| Parâmetro      | Descrição                          | Padrão |
| -------------- | ---------------------------------- | ------ |
| `tipo`         | `receita` ou `despesa`             | todos  |
| `categoria_id` | Filtra por categoria               | todas  |
| `page`         | Página (a partir de 1)             | `1`    |
| `limit`        | Itens por página (1 a 100)         | `10`   |

Os resultados vêm ordenados da transação mais recente para a mais antiga:

```jsonc
{
  "transacoes": [ /* ... */ ],
  "total": 25,
  "pagina": 1,
  "limite": 10,
  "totalPaginas": 3
}
```

**Resumo mensal** (`GET /transacoes/resumo?mes=1&ano=2026`). Sem parâmetros,
usa o mês atual:

```json
{
  "receitas": [
    { "categoria_id": 3, "nome_categoria": "Salário", "total": 5000, "quantidade": 1 }
  ],
  "despesas": [
    { "categoria_id": 1, "nome_categoria": "Alimentação", "total": 80, "quantidade": 2 }
  ]
}
```

## Erros

Todas as respostas de erro têm o formato:

```json
{ "erro": "Descrição do problema" }
```

| Status | Quando                                                                 |
| ------ | ---------------------------------------------------------------------- |
| 400    | Dados inválidos ou ausentes, JSON malformado                           |
| 401    | Token ausente ou inválido, login com email ou senha incorretos         |
| 404    | Recurso não existe ou pertence a outro usuário                         |
| 409    | Email já cadastrado, categoria com transações vinculadas               |
| 500    | Erro inesperado (mensagem genérica, sem detalhes internos)             |

## Decisões técnicas

O raciocínio por trás das escolhas do projeto, e os problemas encontrados no
caminho, estão registrados em [decisions.md](decisions.md).
