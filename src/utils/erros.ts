export class ErroApp extends Error {
    status: number;

    constructor(mensagem: string, status: number) {
        super(mensagem);
        this.status = status;
    }
}

export class ErroValidacao extends ErroApp {
    constructor(mensagem: string) {
        super(mensagem, 400);
    }
}

export class ErroNaoAutorizado extends ErroApp {
    constructor(mensagem: string) {
        super(mensagem, 401);
    }
}

export class ErroNaoEncontrado extends ErroApp {
    constructor(mensagem: string) {
        super(mensagem, 404);
    }
}

export class ErroConflito extends ErroApp {
    constructor(mensagem: string) {
        super(mensagem, 409);
    }
}
