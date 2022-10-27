export interface IParticular {
    id: number;
    observacao: string;

    //relacinado com o seu registo cliente
    /*Client related*/ 
    nomeCliente: string;
    apelidoCliente: string;
    email: string;
    telefone: string;
    ativo: string;

    _links: {
        cliente: { href: string ; };
        particular: { href: string ;};
        self: { href: string ; };
    };
}
