import { ServerPublic } from "~/types/Server";
import InfiniteScroll from "react-infinite-scroller";
import Loader from "@components/Loader";
import ServerRow from "../Row";

import FilterPlatforms from "./filters/Platforms";
import FilterCategories from "./filters/Categories";
import FilterMain from "./filters/Main";

export default function ServerBrowserCol ({
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
    return (
        <div className="server-browser">
            <FilterMain />
            <div>
                <FilterPlatforms />
                <FilterCategories />

                {serversOrLoading ? (
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={loadMore}
                        loader={<Loader key="loader" />}
                        hasMore={needMoreServers}
                        className="server-browser-col"
                    >
                        {servers.map((server, index) => {
                            return (
                                <ServerRow
                                    server={server}
                                    key={`server-${index.toString()}`}
                                />
                            );
                        })}
                    </InfiniteScroll>
                ) : (
                    <div>
                        <p>No servers found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}