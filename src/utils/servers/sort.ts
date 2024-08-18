import { ServerSort } from "./content";

export function GetSortFromString(str: string): ServerSort {
    let sort = ServerSort.CURUSERS;

    switch (str.toLowerCase()) {
        case "name":
            sort = ServerSort.NAME

            break;

        case "mapname":
            sort = ServerSort.MAPNAME

            break;

        case "lastqueried":
            sort = ServerSort.LASTQUERIED

            break;

        default:
            sort = ServerSort.CURUSERS
    }

    return sort;
}