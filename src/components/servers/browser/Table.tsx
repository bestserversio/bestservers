import { ServerBrowser, type ServerPublic } from "~/types/Server";
import ServerRow from "../Row";
import { type Dispatch, type SetStateAction, useContext, useState } from "react";
import { FiltersCtx } from "../Browser";
import SortIcon from "@components/icons/Sort";
import RefreshIcon from "@components/icons/Refresh";
import { ServerSort } from "@utils/servers/content";

export default function ServerBrowserTable ({
    servers,
    setRefresh
} : {
    servers: ServerBrowser[]
    setRefresh: Dispatch<SetStateAction<boolean>>
}) {
    const filtersCtx = useContext(FiltersCtx);

    const [sort, setSort] = useState<number | undefined>(5);

    return (
        <table className="table-auto w-full">
            <thead>
                <tr className="text-left">
                    <th></th>
                    <th></th>
                    <th></th>
                    <th>
                        <div className="flex gap-2 items-center">
                            Name
                            <div className="flex items-center">
                                <div
                                    className={sort == 0 ? "opacity-100" : "opacity-75"}
                                    onClick={() => {
                                        if (sort != 0 && filtersCtx) {
                                            setSort(0);

                                            filtersCtx.setSort(ServerSort.NAME);
                                            filtersCtx.setSortDir("DESC");
                                        }
                                    }}
                                >
                                    <SortIcon className="cursor-pointer fill-white w-4 h-4 transform rotate-180" />
                                </div>
                                <div
                                    className={sort == 1 ? "opacity-100" : "opacity-75"}
                                    onClick={() => {
                                        if (sort != 1 && filtersCtx) {
                                            setSort(1);

                                            filtersCtx.setSort(ServerSort.NAME);
                                            filtersCtx.setSortDir("ASC");
                                        }
                                    }}
                                >
                                    <SortIcon className="cursor-pointer fill-white w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </th>
                    <th>
                    <div className="flex gap-2 items-center">
                            Map
                            <div className="flex items-center">
                                <div
                                    className={sort == 2 ? "opacity-100" : "opacity-75"}
                                    onClick={() => {
                                        if (sort != 2 && filtersCtx) {
                                            setSort(2);

                                            filtersCtx.setSort(ServerSort.MAPNAME);
                                            filtersCtx.setSortDir("DESC");
                                        }
                                    }}
                                >
                                    <SortIcon className="cursor-pointer fill-white w-4 h-4 transform rotate-180" />
                                </div>
                                <div
                                    className={sort == 3 ? "opacity-100" : "opacity-75"}
                                    onClick={() => {
                                        if (sort != 3 && filtersCtx) {
                                            setSort(3);

                                            filtersCtx.setSort(ServerSort.MAPNAME);
                                            filtersCtx.setSortDir("ASC");
                                        }
                                    }}
                                >
                                    <SortIcon className="cursor-pointer fill-white w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </th>
                    <th>
                        <div className="flex gap-2 items-center">
                            Players
                            <div className="flex items-center">
                                <div
                                    className={sort == 4 ? "opacity-100" : "opacity-75"}
                                    onClick={() => {
                                        if (sort != 4 && filtersCtx) {
                                            setSort(4);

                                            filtersCtx.setSort(ServerSort.CURUSERS);
                                            filtersCtx.setSortDir("ASC");
                                        }
                                    }}
                                >
                                    <SortIcon className="cursor-pointer fill-white w-4 h-4 transform rotate-180" />
                                </div>
                                <div

                                    className={sort == 5 ? "opacity-100" : "opacity-75"}
                                    onClick={() => {
                                        if (sort != 5 && filtersCtx) {
                                            setSort(5);

                                            filtersCtx.setSort(ServerSort.CURUSERS);
                                            filtersCtx.setSortDir("DESC");
                                        }
                                    }}
                                >
                                    <SortIcon className="cursor-pointer fill-white w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </th>
                    <th>
                        <div className="flex gap-2 items-center">
                            Last Queried
                            <div className="flex items-center">
                                <div
                                    className={sort == 6 ? "opacity-100" : "opacity-75"}
                                    onClick={() => {
                                        if (sort != 6 && filtersCtx) {
                                            setSort(6);

                                            filtersCtx.setSort(ServerSort.LASTQUERIED);
                                            filtersCtx.setSortDir("ASC");
                                        }
                                    }}
                                >
                                    <SortIcon className="cursor-pointer fill-white w-4 h-4 transform rotate-180" />
                                </div>
                                <div

                                    className={sort == 7 ? "opacity-100" : "opacity-75"}
                                    onClick={() => {
                                        if (sort != 7 && filtersCtx) {
                                            setSort(7);

                                            filtersCtx.setSort(ServerSort.LASTQUERIED);
                                            filtersCtx.setSortDir("DESC");
                                        }
                                    }}
                                >
                                    <SortIcon className="cursor-pointer fill-white w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </th>
                    <th>
                        <div className="flex justify-end items-center">
                            <div
                                className="cursor-pointer opacity-80 hover:opacity-100"
                                onClick={() => {
                                    setRefresh(true);
                                }}
                            >
                                <RefreshIcon className="w-4 h-4 fill-white" />
                            </div>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                {servers.map((server, index) => {
                    return (
                        <ServerRow
                            server={server}
                            table={true}
                            key={`server-${index.toString()}`}
                        />
                    )
                })}
            </tbody>
        </table> 
    );
}