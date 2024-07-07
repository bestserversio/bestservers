import { FiltersCtx } from "@components/servers/Browser";
import { api } from "@utils/api";

import { useContext } from "react";

export default function FiltersCategories ({
    
} : {
    className?: string
}) {
    const filters = useContext(FiltersCtx);

    const categoriesQuery = api.categories.allMapped.useQuery();
    const categories = categoriesQuery.data;

    //const uploadsUrl = process.env.NEXT_PUBLIC_UPLOADS_URL ?? "";

    return (
        <>
            {filters && (
                <ul className="list-none">
                    {categories?.map((cat, index) => {
                        return (
                            <li
                                key={`catPar-${index.toString()}`}
                                className="p-6 cursor-pointer"
                            >
                                <span
                                    onClick={() => {
                                        const newCategories = [...filters.filterCategories];

                                        const loc = newCategories.findIndex(tmp => tmp == cat.id);

                                        if (loc !== -1)
                                            newCategories.splice(loc, 1);
                                        else
                                            newCategories.push(cat.id);

                                        filters.setFilterCategories(newCategories);
                                        
                                    }}
                                    className={(filters.filterCategories.length < 1 || filters.filterCategories.includes(cat.id)) ? "opacity-100" : "opacity-75"}
                                >
                                    {cat.name}
                                </span>

                                {cat.children.length > 0 && (
                                    <ul>
                                        {cat.children.map((child, index) => {
                                            return (
                                                <li
                                                    onClick={() => {
                                                        const newCategories = [...filters.filterCategories];

                                                        const loc = newCategories.findIndex(tmp => tmp == child.id);
        
                                                        if (loc !== -1)
                                                            newCategories.splice(loc, 1);
                                                        else
                                                            newCategories.push(child.id);
        
                                                        filters.setFilterCategories(newCategories);
                                                    }}
                                                    key={`catChi-${index.toString()}`}
                                                    className={`pl-4`}
                                                >
                                                    <span className={(filters.filterCategories.length < 1 || filters.filterCategories.includes(child.id)) ? "opacity-100" : "opacity-75"}>
                                                        {child.name}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </>
    );
}