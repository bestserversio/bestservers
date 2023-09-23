import { api } from "@utils/api"
import { createContext, useEffect, useState, Dispatch, SetStateAction } from "react"
import { type ServerPublic } from "~/types/Server"
import { Region } from "@prisma/client"
import ServerBrowserCol from "./browser/Col"
import ServerBrowserTable from "./browser/Table"

export type FiltersType = {
    filterCategories: number[]
    setFilterCategories: Dispatch<SetStateAction<number[]>>
    filterPlatforms: number[]
    setFilterPlatforms: Dispatch<SetStateAction<number[]>>
    filterRegions: Region[]
    setFilterRegions: Dispatch<SetStateAction<Region[]>>
    filterSearch?: string
    setFilterSearch: Dispatch<SetStateAction<string | undefined>>
    filterMapName?: string
    setFilterMapName: Dispatch<SetStateAction<string | undefined>>
    filterOffline?: boolean
    setFilterOffline: Dispatch<SetStateAction<boolean | undefined>>
    filterHideEmpty?: boolean
    setFilterHideEmpty: Dispatch<SetStateAction<boolean | undefined>>
    filterHideFull?: boolean
    setFilterHideFull: Dispatch<SetStateAction<boolean | undefined>>
    filterMinCurUsers?: number
    setFilterMinCurUsers: Dispatch<SetStateAction<number | undefined>>
    filterMaxCurUsers?: number
    setFilterMaxCurUsers: Dispatch<SetStateAction<number | undefined>> 

    sort: string
    setSort: Dispatch<SetStateAction<string>>
    sortDir: string
    setSortDir: Dispatch<SetStateAction<string>>
}
export const FiltersCtx = createContext<FiltersType | undefined>(undefined);

export default function ServerBrowser ({
    limit = 10,
    table,

    preFilterCategories = [],
    preFilterPlatforms = [],
    preFilterRegions = [],
    preFilterSearch,
    preFilterMapName,
    preFilterOffline,
    preFilterHideEmpty,
    preFilterHideFull,
    preFilterMinCurUsers,
    preFilterMaxCurUsers,
    preSort = "curUsers",
    preSortDir = "desc"
} : {
    limit?: number
    table?: boolean

    preFilterCategories?: number[]
    preFilterPlatforms?: number[]
    preFilterRegions?: Region[]
    preFilterSearch?: string
    preFilterMapName?: string
    preFilterOffline?: boolean
    preFilterHideEmpty?: boolean
    preFilterHideFull?: boolean
    preFilterMinCurUsers?: number
    preFilterMaxCurUsers?: number,

    preSort?: string
    preSortDir?: string
}) {
    // Filters and sorting.
    const [filterCategories, setFilterCategories] = useState<number[]>(preFilterCategories);
    const [filterPlatforms, setFilterPlatforms] = useState<number[]>(preFilterPlatforms);
    const [filterRegions, setFilterRegions] = useState<Region[]>(preFilterRegions);
    const [filterSearch, setFilterSearch] = useState<string | undefined>(preFilterSearch);
    const [filterMapName, setFilterMapName] = useState<string | undefined>(preFilterMapName);
    const [filterOffline, setFilterOffline] = useState<boolean | undefined>(preFilterOffline);
    const [filterHideEmpty, setFilterHideEmpty] = useState<boolean | undefined>(preFilterHideEmpty);
    const [filterHideFull, setFilterHideFull] = useState<boolean | undefined>(preFilterHideFull);
    const [filterMinCurUsers, setFilterMinCurUsers] = useState<number | undefined>(preFilterMinCurUsers);
    const [filterMaxCurUsers, setFilterMaxCurUsers] = useState<number | undefined>(preFilterMaxCurUsers);

    const [sort, setSort] = useState(preSort);
    const [sortDir, setSortDir] = useState(preSortDir);
    
    const [needMoreServers, setNeedMoreServers] = useState(true);

    // Reset need more servers when filters or sorting are changed.
    useEffect(() => {
        setNeedMoreServers(true); // Reset to true when filters or sorting change
    }, [filterPlatforms, filterCategories, filterSearch, filterMapName, filterOffline, filterHideEmpty, filterHideFull, filterRegions, filterMinCurUsers, filterMaxCurUsers, sort, sortDir]);

    const { data, fetchNextPage } = api.servers.all.useInfiniteQuery({
        limit: limit,

        categories: filterCategories,
        platforms: filterPlatforms,
        regions: filterRegions,

        search: filterSearch || undefined,
        mapName: filterMapName || undefined,

        showOffline: filterOffline,
        hideEmpty: filterHideEmpty,
        hideFull: filterHideFull,
        minCurUsers: filterMinCurUsers,
        maxCurUsers: filterMaxCurUsers,
        
        sort: sort,
        sortDir: sortDir,
    }, {
        getNextPageParam: (lastPage) => lastPage.nextServer
    });

    const loadMore = async () => {
        await fetchNextPage();
    }

    const servers: ServerPublic[] = [];

    if (data) {
        data.pages.map((pg, index) => {
            servers.push(...pg.servers);

            if (!pg.nextServer && needMoreServers)
                setNeedMoreServers(false);
        })
    }

    const serversOrLoading = !data || servers.length > 0;

    return (
        <FiltersCtx.Provider value={{
            filterCategories: filterCategories,
            setFilterCategories: setFilterCategories,
            filterPlatforms: filterPlatforms,
            setFilterPlatforms: setFilterPlatforms,
            filterRegions: filterRegions,
            setFilterRegions: setFilterRegions,
            filterSearch: filterSearch,
            setFilterSearch: setFilterSearch,
            filterMapName: filterMapName,
            setFilterMapName: setFilterMapName,
            filterOffline: filterOffline,
            setFilterOffline: setFilterOffline,
            filterHideEmpty: filterHideEmpty,
            setFilterHideEmpty: setFilterHideEmpty,
            filterHideFull: filterHideFull,
            setFilterHideFull: setFilterHideFull,
            filterMinCurUsers: filterMinCurUsers,
            setFilterMinCurUsers: setFilterMinCurUsers,
            filterMaxCurUsers: filterMaxCurUsers,
            setFilterMaxCurUsers: setFilterMaxCurUsers,

            sort: sort,
            setSort: setSort,
            sortDir: sortDir,
            setSortDir: setSortDir
        }}>
            {table ? (
                <ServerBrowserTable
                    servers={servers}
                    loadMore={loadMore}
                    needMoreServers={needMoreServers}
                    serversOrLoading={serversOrLoading}
                />
            ) : (
                <ServerBrowserCol
                    servers={servers}
                    loadMore={loadMore}
                    needMoreServers={needMoreServers}
                    serversOrLoading={serversOrLoading}
                />
            )}
        </FiltersCtx.Provider>
    );
}