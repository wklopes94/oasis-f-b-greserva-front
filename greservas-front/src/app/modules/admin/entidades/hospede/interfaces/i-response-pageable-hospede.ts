import { IMyPages } from "src/app/my-shared/interfaces-shared/i-my-pages";
import { IHospede } from "./i-hospede";

export interface IResponsePageableHospede {
    _embedded: {hospedes: IHospede[]};
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
