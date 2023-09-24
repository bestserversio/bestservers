import { FiltersCtx } from "@components/servers/Browser";
import { useContext } from "react";

export default function FiltersMain ({
    className,
    showSort,
    showSortDir,
    showSearch,
    showMapName,
    showOffline,
    showHideEmpty,
    showHideFull,
    showMinCurUsers,
    showMaxCurUsers,
    showHeader
} : {
    className?: string
    showSort?: boolean
    showSortDir?: boolean
    showSearch?: boolean
    showMapName?: boolean
    showOffline?: boolean
    showHideEmpty?: boolean
    showHideFull?: boolean
    showMinCurUsers?: boolean
    showMaxCurUsers?: boolean
    showHeader?: boolean
}) {
    const filters = useContext(FiltersCtx);

    return (
        <>
            {filters && (
                <div className={`server-filters-main ${className ? className : ""}`}>
                    {showHeader && (
                        <div>
                            <h2>Filters</h2>
                        </div>
                    )}
                    <div className="form">
                        {showSort && (
                            <div>
                                <label>Sort</label>
                                <select
                                    onChange={(e) => {
                                        const val = e.target.value;

                                        filters.setSort(val);
                                    }}
                                    defaultValue={filters.sort}
                                >
                                    <option value="curUsers">Current Users</option>
                                    <option value="maxUsers">Maximum Users</option>
                                    <option value="avgUsers">Average Users</option>
                                </select>
                            </div>
                        )}
                        {showSortDir && (
                            <div>
                                <label>Sort Direction</label>
                                <select
                                    onChange={(e) => {
                                        const val = e.target.value;

                                        filters.setSortDir(val);
                                    }}
                                    defaultValue={filters.sortDir}
                                >
                                    <option value="asc">Ascending</option>
                                    <option value="desc">Descending</option>
                                </select>
                            </div>
                        )}
                        {showSearch && (
                            <div>
                                <label>Search</label>
                                <input
                                    onChange={(e) => {
                                        const val = e.currentTarget.value;

                                        filters.setFilterSearch(val);
                                    }}
                                />
                            </div>
                        )}
                        {showMapName && (
                            <div>
                                <label>Map Name</label>
                                <input
                                    onChange={(e) => {
                                        const val = e.currentTarget.value;

                                        filters.setFilterMapName(val);
                                    }}
                                />
                            </div>
                        )}
                        {showOffline && (
                            <div>
                                <label>Show Offline</label>
                                <input
                                    type="checkbox"
                                    onClick={() => {
                                        filters.setFilterOffline(filters?.filterOffline ? !filters.filterOffline : true);
                                    }}
                                />
                            </div>
                        )}
                        {showHideEmpty && (
                            <div>
                                <label>Hide Empty</label>
                                <input
                                    type="checkbox"
                                    onClick={() => {
                                        filters.setFilterHideEmpty(filters?.filterHideEmpty ? !filters.filterHideEmpty : true);
                                    }}
                                />
                            </div>
                        )}
                        {showHideFull && (
                            <div>
                                <label>Hide Full</label>
                                <input
                                    type="checkbox"
                                    onChange={(e) => {
                                        filters.setFilterHideFull(filters?.filterHideFull ? !filters.filterHideFull : true);
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}