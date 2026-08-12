const usuarioService = require('../services/usuarioService');

async function registrar(req,res) {
    const { nome, email, senha } = req.body;

    try {
        const novoUsuario = await usuarioService.registrar(nome, email, senha);
        return res.status(201).json(novoUsuario);
    }
    catch(error) {
        console.error("Erro ao registrar usuário", error);

        if(error.message === "Email já cadastrado"){
            return res.status(409).json({ erro: error.message});
        }

        return res.status(400).json({ erro: error.message });
    }
}

async function login(req,res) {
    const { email, senha } = req.body;

    try {
        const token = await usuarioService.login(email, senha);
        return res.status(200).json({ token });
    }
    catch(error) {
        console.error("Erro ao logar", error);
        return res.status(400).json({ erro: error.message });
    }
}

module.exports = { registrar, login }