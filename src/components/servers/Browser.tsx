import Loader from "@components/Loader"
import { Server } from "@prisma/client"
import { api } from "@utils/api"
import { useContext, useState } from "react"
import InfiniteScroll from "react-infinite-scroller"
import ServerRow from "./Row"
import { SearchAndFiltersCtx } from "@components/SearchAndFilters"

export default function ServerBrowser ({
    limit = 10
} : {
    limit?: number
}) {
    // Try retrieve context for search and filters.
    const searchAndFilters = useContext(SearchAndFiltersCtx);
    
    const [needMoreServers, setNeedMoreServers] = useState(true);

    const { data, fetchNextPage } = api.servers.all.useInfiniteQuery({
        limit: limit,

        categories: searchAndFilters?.categories,
        sort: searchAndFilters?.sort,
        sortDir: searchAndFilters?.sortDir,
        online: searchAndFilters?.online,
        search: searchAndFilters?.search,
    }, {
        getNextPageParam: (lastPage) => lastPage.nextServer
    });

    const loadMore = () => {
        void fetchNextPage();
    }

    const servers: Server[] = [];

    if (data) {
        data.pages.map((pg) => {
            servers.push(...pg.servers);

            if (!pg.nextServer && needMoreServers)
                setNeedMoreServers(false);
        })
    }

    return (
        <div>
            {!data || servers.length > 0 ? (
                <InfiniteScroll
                    pageStart={0}
                    loadMore={loadMore}
                    loader={<Loader key="loader" />}
                    hasMore={needMoreServers}
                    className="servers-browser"
                >
                    <table>
                        <tbody>
                            {servers.map((server, index) => {
                                return (
                                    <ServerRow
                                        server={server}
                                        key={`server-${index.toString()}`}
                                    />
                                );
                            })}
                        </tbody>
                    </table>
                </InfiniteScroll>
            ) : (
                <p>No servers found.</p>
            )}
        </div>
    );
}