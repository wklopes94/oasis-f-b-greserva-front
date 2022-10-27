export interface IHospede {
    id: number;
    ativo: boolean;
    dataCriacao: string;
    dataUltimaActualizacao: string;

    nacionalidade: string;
    numeroQuarto: number;

    //relacinado com o seu registo cliente
    /*Client related*/ 
    nomeCliente: string;
    apelidoCliente: string;
    email: string;
    telefone: string;

    _links: {
        cliente: { href: string ; };
        hospede: { href: string ;};
        self: { href: string ; };
    };
}
