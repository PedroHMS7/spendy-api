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