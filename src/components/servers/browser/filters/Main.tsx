import Switch from "@components/helpers/Switch";
import { FiltersCtx } from "@components/servers/Browser";
import { GetSortFromString } from "@utils/servers/sort";
import { useContext } from "react";

export default function FiltersMain ({
    showSort,
    showSortDir,
    showSearch,
    showMapName,
    showOffline,
    showHideEmpty,
    showHideFull,
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
                <div>
                    {showHeader && (
                        <div>
                            <h2>Filters</h2>
                        </div>
                    )}
                    <div className="form flex flex-col gap-4 [&_label]:!text-sm">
                        {showSort && (
                            <div className="flex flex-col gap-1">
                                <label>Sort</label>
                                <select
                                    onChange={(e) => {
                                        const val = e.target.value;

                                        filters.setSort(GetSortFromString(val));
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
                            <div className="flex flex-col gap-1">
                                <label>Sort Direction</label>
                                <select
                                    onChange={(e) => {
                                        const val = e.target.value;

                                        const sortDir = val.toLowerCase() == "desc" ? "DESC" : "ASC";

                                        filters.setSortDir(sortDir);
                                    }}
                                    defaultValue={filters.sortDir}
                                >
                                    <option value="asc">Ascending</option>
                                    <option value="desc">Descending</option>
                                </select>
                            </div>
                        )}
                        {showSearch && (
                            <div className="flex flex-col gap-1">
                                <label>Search</label>
                                <input
                                    onChange={(e) => {
                                        const val = e.currentTarget.value;

                                        filters.setFilterSearch(val);
                                    }}
                                    className="!p-1"
                                />
                            </div>
                        )}
                        {showMapName && (
                            <div className="flex flex-col gap-1">
                                <label>Map Name</label>
                                <input
                                    onChange={(e) => {
                                        const val = e.currentTarget.value;

                                        filters.setFilterMapName(val);
                                    }}
                                    className="!p-1"
                                />
                            </div>
                        )}
                        {showOffline && (
                            <div className="flex gap-2 items-center">
                                <Switch
                                    label={<label>Show Offline</label>}
                                    onChange={() => {
                                        filters.setFilterOffline(filters?.filterOffline ? !filters.filterOffline : true);
                                    }}
                                />
                            </div>
                        )}
                        {showHideEmpty && (
                            <div className="flex gap-2 items-center">
                                <Switch
                                    label={<label>Hide Empty</label>}
                                    onChange={() => {
                                        filters.setFilterHideEmpty(filters?.filterHideEmpty ? !filters.filterHideEmpty : true);
                                    }}
                                />
                            </div>
                        )}
                        {showHideFull && (
                            <div className="flex gap-2 items-center">
                                <Switch
                                    label={<label>Hide Full</label>}
                                    onChange={() => {
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