# Decisões técnicas

## Modelagem da tabela categorias
Separei `nome` e `tipo` mesmo parecendo redundante à primeira vista, porque
categorias como "Transferência" ou "Reembolso" podem ser receita ou despesa
dependendo do contexto, o tipo não pode ser inferido só pelo nome.

## Primeiro endpoint funcional
GET /categorias rodando de ponta a ponta: rota → controller → service →
repository → MySQL. Validei manualmente via Postman antes de avançar
pro próximo endpoint.

## Validação em duas camadas (Service + banco)
O campo `tipo` já é restrito pelo ENUM no MySQL, mas validei de novo no
Service. Motivo: se só o banco barrasse, o erro que voltaria pro cliente
seria uma mensagem técnica do driver, não uma mensagem clara. Validar no
Service garante controle sobre a mensagem de erro que o usuário recebe.

## CRUD de categorias completo
GET, POST, PUT, DELETE funcionando de ponta a ponta em 4 camadas,
com validação de negócio no Service e tratamento de erro por tipo
(400 para validação, 404 para recurso não encontrado, 500 para
falha de banco). Toda query com dado externo usa parametrização (?)
para evitar SQL Injection.

## Refactor: validação extraída
Unifiquei a validação duplicada de `criar` e `atualizar` numa função
`validar(nome, tipo)` única. Retestei os dois endpoints (nome vazio,
tipo inválido) para confirmar que o comportamento externo não mudou.

## CRUD de transações completo (com relacionamento)
GET, POST, PUT, DELETE funcionando para transações, com foreign key para
categorias. O Service de transações valida se a categoria referenciada
existe (via categoriaRepository.buscarPorId) antes de criar ou atualizar,
evitando que o erro de constraint do banco vaze como mensagem técnica
para o cliente da API.

## Refactor: validação de transação extraída
Unifiquei a validação duplicada de `criar` e `atualizar` em
`validarTransacao(descricao, valor, tipo, categoria_id)`, incluindo a
checagem assíncrona de categoria existente. Retestei os 4 casos de
validação (descrição vazia, valor negativo, tipo inválido, categoria
inexistente) via Postman para confirmar que o comportamento não mudou.

## Filtros combináveis em GET /transacoes
Implementei filtro por `tipo` e `categoria_id`, combináveis entre si,
usando query dinâmica: array de condições montado condicionalmente
(`if` independente por filtro) e unido com `.join(' AND ')`. Evita
escrever uma query fixa para cada uma das 4 combinações possíveis.

## Paginação combinável com filtros
Adicionei `page`/`limit` via query params, calculando `offset = (page - 1) * limit`. Reaproveitei a mesma estrutura de query dinâmica dos filtros: LIMIT/OFFSET são adicionados incondicionalmente, sempre parametrizados (?), depois de resolver os filtros opcionais. Valores padrão: page=1, limit=10, aplicados no Controller com Number(...) || fallback.

## Autenticação: registro e login
Senhas nunca são armazenadas em texto puro, são sempre hasheadas com bcrypt antes de salvar. Login usa bcrypt.compare para validar a senha
digitada contra o hash salvo. Login e registro sempre retornam a mesma
mensagem genérica ("Email ou senha inválidos") em caso de falha, para não
revelar se o problema foi o email não existir ou a senha estar errada
(evita enumeração de usuários cadastrados).

## Middleware de autenticação
Middleware `autenticar` extrai o token do header `Authorization: Bearer
<token>`, valida com jwt.verify, e anexa o payload decodificado em
`req.usuario`. Testado nos dois cenários: sem token (401, "Token não
fornecido") e com token válido (libera a requisição via next()).

## Isolamento de categorias por usuário
Repository, Service, Controller e Rotas de categorias refatorados para
receber/filtrar por `usuario_id`. Todas as rotas protegidas pelo
middleware `autenticar`. UPDATE/DELETE checam `id AND usuario_id`
juntos no WHERE isso impede que um usuário edite/exclua recurso de
outro.

## Isolamento de transações por usuário
Repository, Service, Controller e Rotas de transações refatorados para
receber/filtrar por `usuario_id`, mesmo padrão de categorias. Diferencial:
`validarTransacao` agora confirma que a categoria referenciada também
pertence ao mesmo usuário (via `categoriaRepository.buscarPorId(id,
usuarioId)`), impedindo que uma transação referencie categoria de outro
usuário.

## Teste de isolamento entre usuários
Validado com 2 contas reais: listagens vazias para
usuário sem dados próprios; PUT/DELETE em recurso de outro usuário
retorna 404 (categoria) ou é bloqueado na validação de categoria
referenciada (transação), nunca revelando que o recurso pertence a
outra pessoa. Dados do usuário original permanecem intactos após
tentativas de acesso indevido.