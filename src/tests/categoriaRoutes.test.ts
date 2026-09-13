import request from 'supertest';
import app = require('../app');
import categoriaRepository = require('../repositories/categoriaRepository');
import jwt from 'jsonwebtoken';

const tokenValido = jwt.sign({ id: 5, email: 'teste@teste.com' }, process.env.JWT_SECRET!);

jest.mock('../repositories/categoriaRepository');

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
});