import transacaoService = require('../services/transacaoService');
import transacaoRepository = require('../repositories/transacaoRepository');
import categoriaRepository = require('../repositories/categoriaRepository');

jest.mock('../repositories/transacaoRepository');
jest.mock('../repositories/categoriaRepository');

describe('transacoes', () => {
    it('deveria lançar erro se a descrição estiver vazia', async () => {
        await expect(
            transacaoService.validarTransacao("", 50, "despesa", "2026-01-15", 1, 5)
        ).rejects.toThrow("Descrição inválida");
    });
    it('deveria lançar erro se a descrição estiver ausente', async () => {
        await expect(
            transacaoService.validarTransacao(undefined as any, 50, "despesa", "2026-01-15", 1, 5)
        ).rejects.toThrow("Descrição inválida");
    });
    it('deveria lançar erro se o valor não for um número', async () => {
        await expect(
            transacaoService.validarTransacao("Almoço", "abc" as any, "despesa", "2026-01-15", 1, 5)
        ).rejects.toThrow("Valor deve ser um número");
    });
    it('deveria lançar erro se a data estiver ausente', async () => {
        await expect(
            transacaoService.validarTransacao("Almoço", 50, "despesa", undefined as any, 1, 5)
        ).rejects.toThrow("Data inválida");
    });
    it('deveria lançar erro se a data for inválida', async () => {
        await expect(
            transacaoService.validarTransacao("Almoço", 50, "despesa", "abc", 1, 5)
        ).rejects.toThrow("Data inválida");
    });
    it('não deveria lançar erro com dados válidos', async () => {
        const categoriaFalsa = { id: 1, nome: 'Lazer', tipo: 'despesa', usuario_id: 5 };

        (categoriaRepository.buscarPorId as jest.Mock).mockResolvedValue(categoriaFalsa);

        await expect(
            transacaoService.validarTransacao("Almoço", 50, "despesa", "2026-01-15", 1, 5)
        ).resolves.not.toThrow();
    });
});
