import usuarioService = require('../services/usuarioService');
import usuarioRepository = require('../repositories/usuarioRepository');
import bcrypt = require('bcrypt');

jest.mock('../repositories/usuarioRepository');
jest.mock('bcrypt');

describe('usuarios', () => {
    it('deveria registrar um usuário com sucesso', async () => {
        (usuarioRepository.buscarPorEmail as jest.Mock).mockResolvedValue(undefined);
        (bcrypt.hash as jest.Mock).mockResolvedValue('hash_fake');
        (usuarioRepository.criar as jest.Mock).mockResolvedValue({ id: 1, nome: 'Teste', email: 'teste@teste.com' });
    
        const resultado = await usuarioService.registrar('Teste', 'teste@teste.com', 'senha123');
    
        expect(resultado).toEqual({ id: 1, nome: 'Teste', email: 'teste@teste.com' });
    });
    it('deveria lançar erro se o email já estiver cadastrado', async () => {
        (usuarioRepository.buscarPorEmail as jest.Mock).mockResolvedValue({ id: 1, email: 'teste@teste.com' });
    
        await expect(
            usuarioService.registrar('Teste', 'teste@teste.com', 'senha123')
        ).rejects.toThrow('Email já cadastrado');
    });
    it('deveria logar com sucesso e retornar um token', async () => {
        (usuarioRepository.buscarPorEmail as jest.Mock).mockResolvedValue({
            id: 1,
            email: 'teste@teste.com',
            senha_hash: 'hash_fake'
        });
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    
        const resultado = await usuarioService.login('teste@teste.com', 'senha123');
    
        expect(typeof resultado).toBe('string');
    });
});