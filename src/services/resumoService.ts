export function agruparPorCategoria(transacoes: any[]) {
    const receitas: any[] = [];
    const despesas: any[] = [];

    for (const transacao of transacoes) {
        const grupo = transacao.tipo === 'receita' ? receitas : despesas;

        const grupoExistente = grupo.find(item => item.categoria_id === transacao.categoria_id);

        if (grupoExistente) {
            grupoExistente.total += transacao.valor;
            grupoExistente.quantidade += 1;
        } else {
            grupo.push({
                categoria_id: transacao.categoria_id,
                nome_categoria: transacao.nome_categoria,
                total: transacao.valor,
                quantidade: 1
            });
        }
    }

    return { receitas, despesas };
}