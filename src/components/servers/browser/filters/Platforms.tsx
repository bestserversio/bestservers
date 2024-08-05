import IconAndText from "@components/helpers/IconAndText";
import { FiltersCtx } from "@components/servers/Browser";
import { api } from "@utils/api";
import { GetPlatformIcon } from "@utils/platforms/content";
import Image from "next/image";
import { useContext } from "react";

export default function FiltersPlatforms ({
    
} : {
    className?: string
}) {
    const filters = useContext(FiltersCtx);

    const platformsQuery = api.platforms.all.useQuery();
    const platforms = platformsQuery.data;

    return (
        <>
            {filters && (
                <ul className="list-none text-sm">
                    {platforms?.map((plat, index) => {
                        const platIcon = GetPlatformIcon({
                            platform: plat
                        })

                        return (
                            <li
                                onClick={() => {
                                    const newPlatforms = [...filters.filterPlatforms];

                                    const loc = newPlatforms.findIndex(tmp => tmp == plat.id);

                                    if (loc !== -1)
                                        newPlatforms.splice(loc, 1);
                                    else
                                        newPlatforms.push(plat.id);

                                    filters.setFilterPlatforms(newPlatforms);
                                }}
                                key={`platform-${index.toString()}`}
                                className={`cursor-pointer p-2`}
                            >
                                <div className={(filters.filterPlatforms.length < 1 || filters.filterPlatforms.includes(plat.id)) ? "opacity-100" : "opacity-75"}>
                                    <IconAndText
                                        icon={
                                            <>
                                                {platIcon && (
                                                    <Image
                                                        src={platIcon}
                                                        width={24}
                                                        height={24}
                                                        alt="Platform Icon"
                                                        className="rounded-full"
                                                    />
                                                )}
                                            </>
                                        }
                                        text={<>{plat.name}</>}
                                        inline={true}
                                    />
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )}
        </>
    );
}