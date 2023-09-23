import { ServerPublic } from "~/types/Server";
import InfiniteScroll from "react-infinite-scroller";
import Loader from "@components/Loader";
import ServerRow from "../Row";

import FilterPlatforms from "./filters/Platforms";
import FilterCategories from "./filters/Categories";
import FilterMain from "./filters/Main";
import { useContext } from "react";
import { ViewPortCtx } from "@components/Wrapper";
import FiltersRegions from "./filters/Regions";

export default function ServerBrowserTable ({
    servers,
    loadMore,
    needMoreServers,
    serversOrLoading
} : {
    servers: ServerPublic[]
    loadMore: () => Promise<void>
    needMoreServers: boolean
    serversOrLoading: boolean
}) {
    const viewPort = useContext(ViewPortCtx);

    return (
        <div className="server-browser">
            <FilterMain 
                className="server-filters-style1"
                showSort={true}
                showSortDir={true}
                showSearch={true}
            />
            {viewPort.isMobile && (
                <>
                        <FilterPlatforms />
                        <FilterCategories />
                        <FiltersRegions />
                        <FilterMain
                            showMapName={true}
                            showOffline={true}
                            showHideEmpty={true}
                            showHideFull={true}
                            showMinCurUsers={true}
                            showMaxCurUsers={true}
                        /> 
                </>
            )}
            <div>
                {!viewPort.isMobile && (
                    <div className="flex flex-col gap-2">
                        <FilterPlatforms
                            className="server-filters-platforms-style1"
                        />
                        <FilterCategories
                            className="server-filters-categoriess-style1"
                        />            
                    </div>
                )}
                {serversOrLoading ? (
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={loadMore}
                        loader={<Loader key="loader" />}
                        hasMore={needMoreServers}
                        className="server-browser-table"
                    >
                        <table>
                            <tbody>
                                {servers.map((server, index) => {
                                    return (
                                        <ServerRow
                                            server={server}
                                            table={true}
                                            key={`server-${index.toString()}`}
                                        />
                                    );
                                })}
                            </tbody>
                        </table>
                    </InfiniteScroll>
                ) : (
                    <div className="mx-auto">
                        <p className="text-4xl text-red-400">No Servers Found!</p>
                    </div>
                )}
                {!viewPort.isMobile && (
                    <div className="flex flex-col gap-2">
                        <FilterMain
                            className="server-filters-style2"
                            showHeader={true}
                            showMapName={true}
                            showOffline={true}
                            showHideEmpty={true}
                            showHideFull={true}
                            showMinCurUsers={true}
                            showMaxCurUsers={true}
                        />
                        <FiltersRegions />
                    </div>
                )}
            </div>
        </div>
    );
}