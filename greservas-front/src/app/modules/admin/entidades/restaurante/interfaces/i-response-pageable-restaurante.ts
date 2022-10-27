import { IMyPages } from "src/app/my-shared/interfaces-shared/i-my-pages";
import { IRestaurante } from "./i-restaurante";

export interface IResponsePageableRestaurante {
    _embedded: {restaurantes: IRestaurante[]};
    _links: {
        first:{href: String};
        next: {href: String};
        last: {href: String};
        self: {href: String};
        profile: {href: String};
        search: {href: String};
    };
    page: IMyPages;

    total_count: number;
}
