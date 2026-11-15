import request from 'supertest';
import app = require('../app');
import categoriaRepository = require('../repositories/categoriaRepository');
import transacaoRepository = require('../repositories/transacaoRepository');
import jwt from 'jsonwebtoken';

const tokenValido = jwt.sign({ id: 5, email: 'teste@teste.com' }, process.env.JWT_SECRET!);

jest.mock('../repositories/categoriaRepository');
jest.mock('../repositories/transacaoRepository');

describe('GET /categorias', () => {
    it('deveria retornar 401 sem token', async () => {
        const resposta = await request(app).get('/categorias');

        expect(resposta.status).toBe(401);
    });
    it('deveria retornar 200 e a lista de categorias com token válido', async () => {
        const categoriasFalsas = [{ id: 1, nome: 'Lazer', tipo: 'despesa', usuario_id: 5 }];
        (categoriaRepository.buscarTodas as jest.Mock).mockResolvedValue(categoriasFalsas);

        const resposta = await request(app)
            .get('/categorias')
            .set('Authorization', `Bearer ${tokenValido}`);

        expect(resposta.status).toBe(200);
        expect(resposta.body).toEqual(categoriasFalsas);
    });
    it('deveria retornar 500 com mensagem genérica quando o banco falhar', async () => {
        (categoriaRepository.buscarTodas as jest.Mock).mockRejectedValue(new Error("ER_NO_SUCH_TABLE: Table 'spendy.categorias' doesn't exist"));

        const resposta = await request(app)
            .get('/categorias')
            .set('Authorization', `Bearer ${tokenValido}`);

        expect(resposta.status).toBe(500);
        expect(resposta.body).toEqual({ erro: "Erro interno do servidor" });
    });
});

describe('POST /categorias', () => {
    it('deveria retornar 400 quando o corpo estiver vazio', async () => {
        const resposta = await request(app)
            .post('/categorias')
            .set('Authorization', `Bearer ${tokenValido}`)
            .send({});

        expect(resposta.status).toBe(400);
        expect(resposta.body).toEqual({ erro: "Nome inválido" });
    });
    it('deveria retornar 400 quando o JSON for inválido', async () => {
        const resposta = await request(app)
            .post('/categorias')
            .set('Authorization', `Bearer ${tokenValido}`)
            .set('Content-Type', 'application/json')
            .send('{ nome: ');

        expect(resposta.status).toBe(400);
        expect(resposta.body).toEqual({ erro: "JSON inválido" });
    });
});

describe('DELETE /categorias/:id', () => {
    it('deveria retornar 409 quando a categoria tiver transações vinculadas', async () => {
        (transacaoRepository.contarPorCategoria as jest.Mock).mockResolvedValue(2);

        const resposta = await request(app)
            .delete('/categorias/1')
            .set('Authorization', `Bearer ${tokenValido}`);

        expect(resposta.status).toBe(409);
        expect(resposta.body).toEqual({ erro: "Categoria possui transações vinculadas" });
    });
    it('deveria retornar 404 quando a categoria não existir', async () => {
        (transacaoRepository.contarPorCategoria as jest.Mock).mockResolvedValue(0);
        (categoriaRepository.excluir as jest.Mock).mockResolvedValue(null);

        const resposta = await request(app)
            .delete('/categorias/999')
            .set('Authorization', `Bearer ${tokenValido}`);

        expect(resposta.status).toBe(404);
        expect(resposta.body).toEqual({ erro: "Categoria não encontrada" });
    });
});
