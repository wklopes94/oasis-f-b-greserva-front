export interface IReqRestauranteSeating {
    id: number,
    data: string,
    lotacao: number,
    ativo: boolean,
    
    dataCriacao: string,
    dataUltimaActualizacao: string

    seating: string,
    restaurante: string,
    menu: string
}
