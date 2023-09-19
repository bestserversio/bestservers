import React, { createContext, useState } from "react";

import { type Category } from "@prisma/client";

type filters = {
    categories?: number[]
    sort?: string
    sortDir?: string
    online?: boolean
    search?: string,

    setCategories?: React.Dispatch<React.SetStateAction<number[] | undefined>>
    setSort?: React.Dispatch<React.SetStateAction<string | undefined>>
    setSortDir?: React.Dispatch<React.SetStateAction<string | undefined>>
    setOnline?: React.Dispatch<React.SetStateAction<boolean | undefined>>
    setSearch?: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const SearchAndFiltersCtx = createContext<filters | null>(null);

export default function SearchAndFilters ({
    categoriesList,
    children
} : {
    categoriesList?: Category[]
    children?: React.ReactNode
}) {
    const [categories, setCategories] = useState<number[] | undefined>(undefined);
    const [sort, setSort] = useState<string | undefined>(undefined);
    const [sortDir, setSortDir] = useState<string | undefined>(undefined);
    const [online, setOnline] = useState<boolean | undefined>(undefined);
    const [search, setSearch] = useState<string | undefined>(undefined);

    return (
        <div className="search-and-filters">
            <div>
                <form>
                    <div className="w-1/3">
                        <label>Platforms</label>
                        <select
                            multiple={true}
                            value={categories?.toString()}
                        >
                            {categoriesList?.map((category, index) => {
                                return (
                                    <option
                                        value={category.id}
                                        key={`category-${index.toString()}`}
                                    >{category.name}</option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="w-2/3">
                        <label>Search</label>
                        <input
                            value={search}
                            onChange={(e) => {
                                const val = e.currentTarget.value;

                                setSearch(val);
                            }}
                        />
                    </div>
                </form>
            </div>
            <div>
                <SearchAndFiltersCtx.Provider value={{
                    categories: categories,
                    sort: sort,
                    sortDir: sortDir,
                    online: online,
                    search: search,

                    setCategories: setCategories,
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