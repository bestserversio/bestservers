import React, { createContext, useState } from "react";

type filters = {
    sort?: string
    sortDir?: string
    online?: boolean
    search?: string,

    setSort?: React.Dispatch<React.SetStateAction<string>>
    setSortDir?: React.Dispatch<React.SetStateAction<string>>
    setOnline?: React.Dispatch<React.SetStateAction<boolean | undefined>>
    setSearch?: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const SearchAndFiltersCtx = createContext<filters | null>(null);

export default function SearchAndFilters ({
    children
} : {
    children?: React.ReactNode
}) {
    const [sort, setSort] = useState<string>("curUsers");
    const [sortDir, setSortDir] = useState<string>("desc");
    const [online, setOnline] = useState<boolean | undefined>(undefined);
    const [search, setSearch] = useState<string | undefined>(undefined);

    return (
        <div className="search-and-filters">
            <div>
                <div className="form">
                    <div>
                        <div>
                            <label>Sort</label>
                            <select
                                onChange={(e) => {
                                    const val = e.target.value;

                                    setSort(val);
                                }}
                            >
                                <option value="curUsers" selected={sort == "curUsers"}>Current Users</option>
                                <option value="maxUsers" selected={sort == "maxUsers"}>Maximum Users</option>
                                <option value="avgUsers" selected={sort == "avgUsers"}>Average Users</option>
                            </select>
                        </div>
                        <div>
                            <label>Sort Direction</label>
                            <select
                                onChange={(e) => {
                                    const val = e.target.value;

                                    setSortDir(val);
                                }}
                            >
                                <option value="asc" selected={sortDir == "asc"}>Ascending</option>
                                <option value="desc" selected={sortDir == "desc"}>Desending</option>
                            </select>
                        </div>
                        <div>
                            <label>Search</label>
                            <input
                                value={search}
                                onChange={(e) => {
                                    const val = e.currentTarget.value;

                                    setSearch(val);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <SearchAndFiltersCtx.Provider value={{
                    sort: sort,
                    sortDir: sortDir,
                    online: online,
                    search: search,

                    setSort: setSort,
                    setSortDir: setSortDir,
                    setOnline: setOnline,
                    setSearch: setSearch
                }}>
                    {children}
                </SearchAndFiltersCtx.Provider>
            </div>
        </div>
    );
}