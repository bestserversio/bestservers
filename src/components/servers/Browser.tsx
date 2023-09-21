import Loader from "@components/Loader"
import { api } from "@utils/api"
import { useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroller"
import ServerRow from "./Row"
import { type ServerPublic } from "~/types/Server"
import IconAndText from "@components/helpers/IconAndText"
import Image from "next/image"

export default function ServerBrowser ({
    limit = 10
} : {
    limit?: number
}) {
    // Filters and sorting.
    const [filterSearch, setFilterSearch] = useState<string | undefined>(undefined);
    const [filterCategories, setFilterCategories] = useState<number[]>([]);
    const [filterPlatforms, setFilterPlatforms] = useState<number[]>([]);
    const [filterOnline, setFilterOnline] = useState<boolean | undefined>(undefined);

    const [sort, setSort] = useState("curUsers");
    const [sortDir, setSortDir] = useState("desc");
    
    const [needMoreServers, setNeedMoreServers] = useState(true);

    // Reset need more servers when filters or sorting are changed.
    useEffect(() => {
        setNeedMoreServers(true); // Reset to true when filters or sorting change
    }, [filterSearch, filterCategories, filterPlatforms, filterOnline, sort, sortDir]);

    const { data, fetchNextPage } = api.servers.all.useInfiniteQuery({
        limit: limit,

        search: filterSearch || undefined,
        categories: filterCategories,
        platforms: filterPlatforms,
        online: filterOnline,
        
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

    const categoriesQuery = api.categories.allMapped.useQuery();
    const categories = categoriesQuery.data;

    const platformsQuery = api.platforms.all.useQuery();
    const platforms = platformsQuery.data;

    const uploadsUrl = process.env.NEXT_PUBLIC_UPLOADS_URL ?? "";

    return (
        <div className="servers-browser">
            <div className="form">
                <div>
                    <label>Sort</label>
                    <select
                        onChange={(e) => {
                            const val = e.target.value;

                            setSort(val);
                        }}
                        defaultValue={sort}
                    >
                        <option value="curUsers">Current Users</option>
                        <option value="maxUsers">Maximum Users</option>
                        <option value="avgUsers">Average Users</option>
                    </select>
                </div>
                <div>
                    <label>Sort Direction</label>
                    <select
                        onChange={(e) => {
                            const val = e.target.value;

                            setSortDir(val);
                        }}
                        defaultValue={sortDir}
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Desending</option>
                    </select>
                </div>
                <div>
                    <label>Search</label>
                    <input
                        onChange={(e) => {
                            const val = e.currentTarget.value;

                            setFilterSearch(val);
                        }}
                    />
                </div>
            </div>
            <div>
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
                                    <li key={`catPar-${index.toString()}`}>
                                        <span
                                            onClick={() => {
                                                const newCategories = [...filterCategories];

                                                const loc = newCategories.findIndex(tmp => tmp == cat.id);

                                                if (loc !== -1)
                                                    newCategories.splice(loc, 1);
                                                else
                                                    newCategories.push(cat.id);

                                                setFilterCategories(newCategories);
                                                
                                            }}
                                            className={(filterCategories.length < 1 || filterCategories.includes(cat.id)) ? "opacity-100" : "opacity-75"}
                                        >
                                            {cat.name}
                                        </span>

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
        </div>
    );
}