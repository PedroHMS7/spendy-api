import categoriaService = require('../services/categoriaService');
import categoriaRepository = require('../repositories/categoriaRepository');

jest.mock('../repositories/categoriaRepository');

describe('categorias', () => {
    it('não deveria lançar erro com dados válidos', () => {
        expect(() => categoriaService.validarCategoria("Lazer", "despesa")).not.toThrow();
    });
    it('deveria lançar erro se o nome estiver vazio', () => {
        expect(() => categoriaService.validarCategoria("", "despesa")).toThrow("Nome inválido");
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
});


