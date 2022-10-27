import { IMyPages } from "src/app/my-shared/interfaces-shared/i-my-pages";
import { ISeating } from "./i-seating";

export interface IResponsePageableSeating {
    _embedded: {seatings: ISeating[]};
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
