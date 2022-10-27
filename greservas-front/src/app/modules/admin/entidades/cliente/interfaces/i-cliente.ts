export interface ICliente {
    id: number;
    ativo: boolean;

    nome: string;
    apelido: string;
    tipo: string;
    email: string;
    telefone: string;

    dataCriacao: string;
    dataUltimaActualizacao: string;   
    
    /* Hospede Related*/
    idHospede: number;
    nacionalidade: string;
    numeroQuarto: number;
    //em principio nao deve ser necessario
    idClienteHospede: number;
    
    
    /* Grupo related */
    idGrupo: number;
    descricao: string;
    instituicao: string;
    observacaoGrupo: string;
    //em principio nao deve ser necessario
    idClienteGrupo: number;

    /** Particular Related */
    idParticular: number;
    observacaoParticular: string;
    //em principio nao deve ser necessario
    idClienteParticular: number;


    _links: {
        hospede: { href: string ; };
        grupo: { href: string ;};
        particular: { href: string ; };
        //podem ser mais de uma reserva para o omesmos cliente reservas[]
        reservas: { href: string ; };
    };
}
