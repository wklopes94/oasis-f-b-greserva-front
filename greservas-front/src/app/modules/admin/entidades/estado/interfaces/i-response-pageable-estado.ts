
import { IMyPages } from "src/app/my-shared/interfaces-shared/i-my-pages";
import { IEstado } from "./i-estado";

export interface IResponsePageableEstado {
    _embedded: {estados: IEstado[]};
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
    //items: number;
}
