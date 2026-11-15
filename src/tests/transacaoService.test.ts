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
    it('deveria lançar erro na listagem se a página for inválida', async () => {
        await expect(
            transacaoService.listarTodas({}, -1, 10, 5)
        ).rejects.toThrow("Página inválida");
    });
    it('deveria lançar erro na listagem se o limite passar de 100', async () => {
        await expect(
            transacaoService.listarTodas({}, 1, 100000, 5)
        ).rejects.toThrow("Limite deve estar entre 1 e 100");
    });
    it('deveria retornar a listagem com informações de paginação', async () => {
        (transacaoRepository.buscarTodas as jest.Mock).mockResolvedValue({ transacoes: [], total: 25 });

        const resultado = await transacaoService.listarTodas({}, 2, 10, 5);

        expect(resultado).toEqual({ transacoes: [], total: 25, pagina: 2, limite: 10, totalPaginas: 3 });
    });
    it('deveria lançar erro no resumo se o mês for inválido', async () => {
        await expect(
            transacaoService.resumoMensal(13, 2026, 5)
        ).rejects.toThrow("Mês inválido");
    });
    it('deveria lançar erro no resumo se o ano for inválido', async () => {
        await expect(
            transacaoService.resumoMensal(1, -5, 5)
        ).rejects.toThrow("Ano inválido");
    });
    it('deveria buscar o resumo com mês e ano válidos', async () => {
        (transacaoRepository.buscarPorMes as jest.Mock).mockResolvedValue([]);

        const resultado = await transacaoService.resumoMensal(12, 2026, 5);

        expect(transacaoRepository.buscarPorMes).toHaveBeenCalledWith(12, 2026, 5);
        expect(resultado).toEqual({ receitas: [], despesas: [] });
    });
});
