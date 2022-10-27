export interface IReqReserva {
    id: number
    numeroAdulto: string, 
    numeroCrianca: string,
    dataReserva: string, 
    observacoes: string, 
    comentarios: string,
        
    ativo:boolean,
    dataCriacao: string, 
    dataUltimaActualizacao: string,

    estado: string,
    cliente: string,
    utilizador: string,
    pagamento: string,
    restauranteSeating: string,
    extras: string[]

}
