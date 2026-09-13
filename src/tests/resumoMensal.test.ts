import { agruparPorCategoria } from '../services/resumoService';

describe('agruparPorCategoria', () => {
    it('deveria retornar receitas e despesas vazias quando não há transações', () => {
        const resultado = agruparPorCategoria([]);

        expect(resultado).toEqual({ receitas: [], despesas: [] });
    });
    it('deveria agrupar uma única despesa corretamente', () => {
        const transacoes = [
            { categoria_id: 1, nome_categoria: 'Alimentação', tipo: 'despesa', valor: 50 }
        ];
    
        const resultado = agruparPorCategoria(transacoes);
    
        expect(resultado).toEqual({
            receitas: [],
            despesas: [
                { categoria_id: 1, nome_categoria: 'Alimentação', total: 50, quantidade: 1 }
            ]
        });
    });
    it('deveria somar duas despesas da mesma categoria', () => {
        const transacoes = [
            { categoria_id: 1, nome_categoria: 'Alimentação', tipo: 'despesa', valor: 50 },
            { categoria_id: 1, nome_categoria: 'Alimentação', tipo: 'despesa', valor: 30 }
        ];
    
        const resultado = agruparPorCategoria(transacoes);
    
        expect(resultado).toEqual({
            receitas: [],
            despesas: [
                { categoria_id: 1, nome_categoria: 'Alimentação', total: 80, quantidade: 2 }
            ]
        });
    });
    it('deveria separar receita e despesa corretamente', () => {
        const transacoes = [
            { categoria_id: 1, nome_categoria: 'Alimentação', tipo: 'despesa', valor: 50 },
            { categoria_id: 3, nome_categoria: 'Investimentos', tipo: 'receita', valor: 1000 }
        ];
    
        const resultado = agruparPorCategoria(transacoes);
    
        expect(resultado).toEqual({
            receitas: [
                { categoria_id: 3, nome_categoria: 'Investimentos', total: 1000, quantidade: 1 }
            ],
            despesas: [
                { categoria_id: 1, nome_categoria: 'Alimentação', total: 50, quantidade: 1 }
            ]
        });
    });
});