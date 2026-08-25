import usuarioRepository = require('../repositories/usuarioRepository');
import bcrypt = require('bcrypt');
import jwt = require('jsonwebtoken');

async function registrar(nome : string, email : string, senha : string) {
    
    if(nome.trim() === ""){
        throw new Error("Nome inválido")
    }

    if(email.trim() === ""){
        throw new Error("Email inválido")
    }

    if(senha.trim() === ""){
        throw new Error("Senha inválida")
    }

    const emailDuplicado = await usuarioRepository.buscarPorEmail(email);

    if(emailDuplicado){
        throw new Error("Email já cadastrado")
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    
    try {
        const novoUsuario = await usuarioRepository.criar(nome,email,senhaHash)
        return novoUsuario;
    }
    catch(error) {
        console.error("Erro ao criar usuário", error);
        throw error;
    }
} 

async function login(email : string, senha : string) {
    
    const usuarioExiste = await usuarioRepository.buscarPorEmail(email);
    
    if(!usuarioExiste){
        throw new Error("Email ou senha inválidos!");
    }

    const comparaSenha = await bcrypt.compare(senha, usuarioExiste.senha_hash);

    if(!comparaSenha){
        throw new Error("Email ou senha inválidos!");
    }
    
    try {
        const token = jwt.sign({ id: usuarioExiste.id, email: usuarioExiste.email }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        return token;
    }
    catch(error) {
        console.error("Erro ao fazer login", error);
        throw error;
    }
}

export = { registrar, login }