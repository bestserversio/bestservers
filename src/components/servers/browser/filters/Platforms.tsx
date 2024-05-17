import IconAndText from "@components/helpers/IconAndText";
import { FiltersCtx } from "@components/servers/Browser";
import { api } from "@utils/api";
import Image from "next/image";
import { useContext } from "react";

export default function FiltersPlatforms ({
    className
} : {
    className?: string
}) {
    const filters = useContext(FiltersCtx);

    const platformsQuery = api.platforms.all.useQuery();
    const platforms = platformsQuery.data;

    const uploadsUrl = process.env.NEXT_PUBLIC_UPLOADS_URL ?? "";

    return (
        <>
            {filters && (
                <div className={`${className ? className : ""} overflow-y-auto max-h-[50%]`}>
                    <div className="rounded-t-md bg-cyan-800/70 p-4 text-center">
                        <h4>Platforms</h4>
                    </div>
                    <div className="bg-slate-800/70">
                        <ul className="list-none">
                            {platforms?.map((plat, index) => {
                                let icon = process.env.NEXT_PUBLIC_DEFAULT_PLATFORM_ICON;

                                if (plat.icon)
                                    icon = uploadsUrl + plat.icon;

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
                                        className={`${(filters.filterPlatforms.length < 1 || filters.filterPlatforms.includes(plat.id)) ? "opacity-100" : "opacity-75"} cursor-pointer p-6`}
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
            )}
        </>
    );
}