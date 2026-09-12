import transacaoService = require('../services/transacaoService');
import transacaoRepository = require('../repositories/transacaoRepository');
import categoriaRepository = require('../repositories/categoriaRepository');

jest.mock('../repositories/transacaoRepository');
jest.mock('../repositories/categoriaRepository');

describe('transacoes', () => {
    it('deveria lançar erro se a descrição estiver vazia', async () => {
        await expect(
            transacaoService.validarTransacao("", 50, "despesa", 1, 5)
        ).rejects.toThrow("Descrição inválida");
    });
    it('não deveria lançar erro com dados válidos', async () => {
        const categoriaFalsa = { id: 1, nome: 'Lazer', tipo: 'despesa', usuario_id: 5 };
    
        (categoriaRepository.buscarPorId as jest.Mock).mockResolvedValue(categoriaFalsa);
    
        await expect(
            transacaoService.validarTransacao("Almoço", 50, "despesa", 1, 5)
        ).resolves.not.toThrow();
    });
});