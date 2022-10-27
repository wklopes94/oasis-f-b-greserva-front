import { IMyPages } from "src/app/my-shared/interfaces-shared/i-my-pages";
import { IRestauranteSeating } from "./i-restaurante-seating";

export interface IResponsePageableRestauranteSeating {
    _embedded: {restaurante_seating: IRestauranteSeating[]};

    //verificar se é mesmo necessario e se é utilizado. Se nao tirar de todos
    _links: {
        first:{href: String};
        next: {href: String};
        last: {href: String};
        self: {href: String};
        profile: {href: String};
        search: {href: String};
    };

    page: IMyPages;
    
    //verificar se é mesmo necessario e se é utilizado. Se nao tirar de todos
    total_count: number;
}
