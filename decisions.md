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