export interface IRestauranteSeating {
    id: number;
    ativo: boolean;
    dataCriacao: string;
    dataUltimaActualizacao: string;

    data: string;
    lotacao: number;

    //relacinado com o seu registo restaurante
    /*Restaurante related*/ 
    restaurante: string;

    //relacinado com o seu registo seating
    /*Seating related*/ 
    horaInicio: string;
    horaFim: string;
    completo: boolean;
    

    _links: {
        restaurante: { href: string ; };
        seating: { href: string ;};
        self: { href: string ; };
    };
}
