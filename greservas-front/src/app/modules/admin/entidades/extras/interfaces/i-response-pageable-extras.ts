import { IMyPages } from "src/app/my-shared/interfaces-shared/i-my-pages";
import { IExtras } from "./i-extras";

export interface IResponsePageableExtras {
    _embedded: {extras: IExtras[]};
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
