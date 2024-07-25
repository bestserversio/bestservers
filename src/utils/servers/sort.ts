import { ServerSort } from "./content";

export function GetSortFromString(str: string): ServerSort {
    let sort = ServerSort.CURUSERS;

    switch (str.toLowerCase()) {
        case "name":
            sort = ServerSort.NAME

            break;

        case "mapName":
            sort = ServerSort.MAPNAME

            break;

        case "lastQueried":
            sort = ServerSort.LASTQUERIED

            break;
    }
    
    return sort;
}