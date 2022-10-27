export interface IGrupo {
    id: number;
    instituicao: string;
    descricao: string;
    observacao: string;

    //relacinado com o seu registo cliente
    /*Client related*/ 
    nomeCliente: string;
    apelidoCliente: string;
    email: string;
    telefone: string;
    
    ativo: string;
    dataCriacao: string;
    dataUltimaActualizacao: string;

    _links: {
        cliente: { href: string ; };
        grupo: { href: string ;};
        self: { href: string ; };
    };    
}
