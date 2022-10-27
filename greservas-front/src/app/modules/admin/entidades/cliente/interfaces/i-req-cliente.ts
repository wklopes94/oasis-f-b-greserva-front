export interface IReqCliente {
    id: number,
    nome: string, 
    apelido: string, 
    email: string, 
    telefone: string, 
    tipo: string,
    
    ativo:boolean,
    dataCriacao: string, 
    dataUltimaActualizacao: string
}
