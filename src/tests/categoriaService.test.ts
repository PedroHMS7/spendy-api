import categoriaService = require('../services/categoriaService')

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
});

