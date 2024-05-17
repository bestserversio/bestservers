import { FiltersCtx } from "@components/servers/Browser";
import { api } from "@utils/api";

import { useContext } from "react";

export default function FiltersCategories ({
    className
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
                <div className={`${className ? className : ""} overflow-y-auto max-h-[50%]`}>
                   <div className="rounded-t-md bg-cyan-800/70 p-4 text-center">
                       <h4>Categories</h4>
                   </div>
                   <div className="bg-slate-800/70">
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
                                                           className={`${(filters.filterCategories.length < 1 || filters.filterCategories.includes(child.id)) ? "opacity-100" : "opacity-75"} pl-4`}
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
            )}
        </>
    );
}