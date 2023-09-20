import Loader from "@components/Loader"
import { api } from "@utils/api"
import { useContext, useState } from "react"
import InfiniteScroll from "react-infinite-scroller"
import ServerRow from "./Row"
import { SearchAndFiltersCtx } from "@components/SearchAndFilters"
import { type ServerPublic } from "~/types/Server"
import IconAndText from "@components/helpers/IconAndText"
import Image from "next/image"

export default function ServerBrowser ({
    limit = 10
} : {
    limit?: number
}) {
    const [filterCategories, setFilterCategories] = useState<number[]>([]);
    const [filterPlatforms, setFilterPlatforms] = useState<number[]>([]);
    
    // Try retrieve context for search and filters.
    const searchAndFilters = useContext(SearchAndFiltersCtx);
    
    const [needMoreServers, setNeedMoreServers] = useState(true);

    const { data, fetchNextPage } = api.servers.all.useInfiniteQuery({
        limit: limit,

        categories: filterCategories,
        platforms: filterPlatforms,

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

    const servers: ServerPublic[] = [];

    if (data) {
        data.pages.map((pg) => {
            servers.push(...pg.servers);

            if (!pg.nextServer && needMoreServers)
                setNeedMoreServers(false);
        })
    }

    const categoriesQuery = api.categories.allMapped.useQuery();
    const categories = categoriesQuery.data;

    const platformsQuery = api.platforms.all.useQuery();
    const platforms = platformsQuery.data;

    const uploadsUrl = process.env.NEXT_PUBLIC_UPLOADS_URL ?? "";

    return (
        <div className="servers-browser">
            <div>
                <div>
                    <h4>Platforms</h4>
                </div>
                <div>
                    <ul>
                        {platforms?.map((plat, index) => {
                            let icon = process.env.NEXT_PUBLIC_DEFAULT_PLATFORM_ICON;

                            if (plat.icon)
                                icon = uploadsUrl + plat.icon;

                            return (
                                <li
                                    onClick={() => {
                                        const newPlatforms = [...filterPlatforms];

                                        const loc = newPlatforms.findIndex(tmp => tmp == plat.id);

                                        if (loc !== -1)
                                            newPlatforms.splice(loc, 1);
                                        else
                                            newPlatforms.push(plat.id);

                                        setFilterPlatforms(newPlatforms);
                                    }}
                                    key={`platform-${index.toString()}`}
                                    className={(filterPlatforms.length < 1 || filterPlatforms.includes(plat.id)) ? "opacity-100" : "opacity-75"}
                                >
                                    <IconAndText
                                        icon={
                                            <>
                                                {icon && (
                                                    <Image
                                                        src={icon}
                                                        width={32}
                                                        height={32}
                                                        alt="Platform Icon"
                                                        className="rounded-full"
                                                    />
                                                )}
                                            </>
                                        }
                                        text={<>{plat.nameShort || plat.name}</>}
                                        inline={true}
                                    />
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
            <div>
                <div>
                    <h4>Categories</h4>
                </div>
                <div>
                    <ul>
                        {categories?.map((cat, index) => {
                            return (
                                <li
                                    onClick={() => {
                                        const newCategories = [...filterCategories];

                                        const loc = newCategories.findIndex(tmp => tmp == cat.id);

                                        if (loc !== -1)
                                            newCategories.splice(loc, 1);
                                        else
                                            newCategories.push(cat.id);

                                        setFilterCategories(newCategories);
                                        
                                    }}
                                    key={`catPar-${index.toString()}`}
                                    className={(filterCategories.length < 1 || filterCategories.includes(cat.id)) ? "opacity-100" : "opacity-75"}
                                >
                                    {cat.name}

                                    {cat.children.length > 0 && (
                                        <ul>
                                            {cat.children.map((child, index) => {
                                                return (
                                                    <li
                                                        onClick={() => {
                                                            const newCategories = [...filterCategories];

                                                            const loc = newCategories.findIndex(tmp => tmp == child.id);
            
                                                            if (loc !== -1)
                                                                newCategories.splice(loc, 1);
                                                            else
                                                                newCategories.push(child.id);
            
                                                            setFilterCategories(newCategories);
                                                        }}
                                                        key={`catChi-${index.toString()}`}
                                                        className={(filterCategories.length < 1 || filterCategories.includes(child.id)) ? "opacity-100" : "opacity-75"}
                                                    >
                                                        {child.name}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
            {!data || servers.length > 0 ? (
                <InfiniteScroll
                    pageStart={0}
                    loadMore={loadMore}
                    loader={<Loader key="loader" />}
                    hasMore={needMoreServers}
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
    );
}