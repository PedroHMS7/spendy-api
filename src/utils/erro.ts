function errorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return "Erro desconhecido";
  }
  
  export = errorMessage;