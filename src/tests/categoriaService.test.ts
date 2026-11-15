import categoriaService = require('../services/categoriaService');
import categoriaRepository = require('../repositories/categoriaRepository');
import transacaoRepository = require('../repositories/transacaoRepository');

jest.mock('../repositories/categoriaRepository');
jest.mock('../repositories/transacaoRepository');

describe('categorias', () => {
    it('não deveria lançar erro com dados válidos', () => {
        expect(() => categoriaService.validarCategoria("Lazer", "despesa")).not.toThrow();
    });
    it('deveria lançar erro se o nome estiver vazio', () => {
        expect(() => categoriaService.validarCategoria("", "despesa")).toThrow("Nome inválido");
    });
    it('deveria lançar erro se o nome estiver ausente', () => {
        expect(() => categoriaService.validarCategoria(undefined as any, "despesa")).toThrow("Nome inválido");
    });
    it('deveria lançar erro se o tipo não for aceitável', () => {
        expect(() => categoriaService.validarCategoria("Corrida", "esporte")).toThrow("Tipo inválido");
    });
    it('deveria criar uma categoria com sucesso', async () => {
        const categoriaFalsa = { id: 1, nome: 'Lazer', tipo: 'despesa', usuario_id: 5 };
    
        (categoriaRepository.criar as jest.Mock).mockResolvedValue(categoriaFalsa);
    
        const resultado = await categoriaService.criar({ nome: 'Lazer', tipo: 'despesa' }, 5);
    
        expect(resultado).toEqual(categoriaFalsa);
    });
    it('deveria propagar o erro quando o repository falhar', async () => {
        (categoriaRepository.criar as jest.Mock).mockRejectedValue(new Error('Erro de conexão'));
    
        await expect(
            categoriaService.criar({ nome: 'Lazer', tipo: 'despesa' }, 5)
        ).rejects.toThrow('Erro de conexão');
    });
    it('deveria lançar erro ao excluir categoria com transações vinculadas', async () => {
        (transacaoRepository.contarPorCategoria as jest.Mock).mockResolvedValue(3);

        await expect(
            categoriaService.excluir(1, 5)
        ).rejects.toThrow('Categoria possui transações vinculadas');

        expect(categoriaRepository.excluir).not.toHaveBeenCalled();
    });
    it('deveria excluir categoria sem transações vinculadas', async () => {
        (transacaoRepository.contarPorCategoria as jest.Mock).mockResolvedValue(0);
        (categoriaRepository.excluir as jest.Mock).mockResolvedValue(1);

        const resultado = await categoriaService.excluir(1, 5);

        expect(resultado).toBe(1);
    });
});


