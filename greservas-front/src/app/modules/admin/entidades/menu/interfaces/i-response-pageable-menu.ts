import { IMyPages } from "src/app/my-shared/interfaces-shared/i-my-pages";
import { IMenu } from "./i-menu";

export interface IResponsePageableMenu {
    _embedded: {menus: IMenu[]};
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
