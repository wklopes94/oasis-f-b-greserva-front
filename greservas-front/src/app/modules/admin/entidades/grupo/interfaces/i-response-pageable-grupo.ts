import { IMyPages } from "src/app/my-shared/interfaces-shared/i-my-pages";
import { IGrupo } from "./i-grupo";

export interface IResponsePageableGrupo {
    _embedded: {grupos: IGrupo[]};
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
