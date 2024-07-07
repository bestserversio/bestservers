import { api } from "@utils/api"
import { createContext, useEffect, useState, type Dispatch, type SetStateAction } from "react"
import { type ServerPublic } from "~/types/Server"
import { type Region } from "@prisma/client"
import ServerBrowserCol from "./browser/Col"
import ServerBrowserTable from "./browser/Table"
import FiltersMain from "./browser/filters/Main"
import FiltersPlatforms from "./browser/filters/Platforms"
import FiltersRegions from "./browser/filters/Regions"
import Loader from "@components/Loader"
import InfiniteScroll from "react-infinite-scroller"
import AnglesRightIcon from "@components/icons/AnglesRight"

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

    const { data, fetchNextPage, refetch } = api.servers.all.useInfiniteQuery({
        limit: limit,

        categories: filterCategories,
        platforms: filterPlatforms,
        regions: filterRegions,

        search: filterSearch ?? undefined,
        mapName: filterMapName ?? undefined,

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

    const countQ = api.servers.count.useQuery({
        categories: filterCategories,
        platforms: filterPlatforms,
        regions: filterRegions,

        search: filterSearch ?? undefined,
        mapName: filterMapName ?? undefined,

        showOffline: filterOffline,
        hideEmpty: filterHideEmpty,
        hideFull: filterHideFull,
        minCurUsers: filterMinCurUsers,
        maxCurUsers: filterMaxCurUsers,
    });

    const totalServers = countQ.data ?? 0;

    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        if (refresh) {
            void (async () => {
                try {
                    await refetch();
                } catch (err) {
                    console.error(err);
                }
            })();

            setRefresh(false);
        }

    }, [refresh, refetch]);

    const loadMore = () => {
        void (async () => {
            await fetchNextPage();
        })()
    }

    const servers: ServerPublic[] = [];

    if (data) {
        data.pages.map((pg) => {
            servers.push(...pg.servers);

            if (!pg.nextServer && needMoreServers)
                setNeedMoreServers(false);
        })
    }

    const serversOrLoading = !data || servers.length > 0;

    const [showFilters, setShowFilters] = useState(true);

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
            <div className="flex gap-2 py-4">
                <div className="flex flex-col">
                    <div className="flex flex-col sticky top-[3.8rem]">
                        {showFilters ? (
                            <div className="flex flex-col">
                                <div className="text-center font-bold">
                                    <span>Showing {servers.length.toString()}/{totalServers.toString()}</span>
                                </div>
                                <div className=" bg-shade-2/70 py-6 px-12 h-[75vh] overflow-auto rounded-lg">
                                    <div className="flex justify-end">
                                        <div
                                            className="cursor-pointer"
                                            onClick={() => setShowFilters(!showFilters)}
                                        >
                                            <AnglesRightIcon className="w-4 h-4 fill-white transform rotate-180" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-col gap-2">
                                            <h2>General</h2>
                                            <div>
                                                <FiltersMain
                                                    showSearch={true}
                                                    showMapName={true}
                                                    showOffline={true}
                                                    showHideEmpty={true}
                                                    showHideFull={true}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <h2>Platforms</h2>
                                            <div className="h-96 overflow-y-auto bg-shade-1 px-2 rounded-md">
                                                <FiltersPlatforms />
                                            </div>
                                        </div>
                                        {/*
                                        <div className="flex flex-col gap-2">
                                            <h2>Categories</h2>
                                            <div className="h-96 overflow-y-auto bg-shade-1 px-2 rounded-md">
                                                <FiltersCategories />
                                            </div>
                                        </div>
                                        */}
                                        <div className="flex flex-col gap-2 rounded-md">
                                            <h2>Regions</h2>
                                            <div className="h-96 overflow-y-auto bg-shade-1 px-2">
                                                <FiltersRegions />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div
                                className="cursor-pointer"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <AnglesRightIcon className="w-4 h-4 fill-white" />
                            </div>
                        )}
                    </div>
                </div>
                <div className="w-full">
                    {serversOrLoading ? (
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={loadMore}
                            loader={<Loader key="loader" />}
                            hasMore={needMoreServers}
                            className="col-span-1 sm:col-span-6"
                        >
                            {table ? (
                                <ServerBrowserTable
                                    servers={servers}
                                    setRefresh={setRefresh}
                                />
                            ) : (
                                <ServerBrowserCol servers={servers} />
                            )}
                        </InfiniteScroll>
                    ) : (
                        <div className="mx-auto">
                            <p className="text-4xl text-red-400">No Servers Found!</p>
                        </div>
                    )}
                </div>
            </div>
        </FiltersCtx.Provider>
    );
}