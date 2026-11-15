import usuarioRepository = require('../repositories/usuarioRepository');
import bcrypt = require('bcrypt');
import jwt = require('jsonwebtoken');
import { ErroValidacao, ErroNaoAutorizado, ErroConflito } from '../utils/erros';

async function registrar(nome : string, email : string, senha : string) {

    if(typeof nome !== 'string' || nome.trim() === ""){
        throw new ErroValidacao("Nome inválido")
    }

    if(typeof email !== 'string' || email.trim() === ""){
        throw new ErroValidacao("Email inválido")
    }

    if(typeof senha !== 'string' || senha.trim() === ""){
        throw new ErroValidacao("Senha inválida")
    }

    const emailDuplicado = await usuarioRepository.buscarPorEmail(email);

    if(emailDuplicado){
        throw new ErroConflito("Email já cadastrado")
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    return await usuarioRepository.criar(nome,email,senhaHash);
}

async function login(email : string, senha : string) {

    if(typeof email !== 'string' || typeof senha !== 'string'){
        throw new ErroValidacao("Email e senha são obrigatórios");
    }

    const usuarioExiste = await usuarioRepository.buscarPorEmail(email);

    if(!usuarioExiste){
        throw new ErroNaoAutorizado("Email ou senha inválidos!");
    }

    const comparaSenha = await bcrypt.compare(senha, usuarioExiste.senha_hash);

    if(!comparaSenha){
        throw new ErroNaoAutorizado("Email ou senha inválidos!");
    }

    const token = jwt.sign({ id: usuarioExiste.id, email: usuarioExiste.email }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    return token;
}

export = { registrar, login }
