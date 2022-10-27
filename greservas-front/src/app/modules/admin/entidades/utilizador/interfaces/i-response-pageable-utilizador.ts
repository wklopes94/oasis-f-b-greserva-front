import { IMyPages } from "src/app/my-shared/interfaces-shared/i-my-pages";
import { IUtilizador } from "./i-utilizador";

export interface IResponsePageableUtilizador {
    _embedded: {utilizadores: IUtilizador[]};
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
