import IconAndText from "@components/helpers/IconAndText";
import { FiltersCtx } from "@components/servers/Browser"
import { Region } from "@prisma/client";
import { GetRegionFlag } from "@utils/region";
import Image from "next/image";
import { useContext } from "react"

type ListRegion = {
    fullName: string
    region: Region
}

const regions: ListRegion[] = [
    {
        fullName: "Africa",
        region: Region.AF
    },
    {
        fullName: "Asia",
        region: Region.AS,
    },
    {
        fullName: "Europe",
        region: Region.EU,
    },
    {
        fullName: "North America",
        region: Region.NA
    },
    {
        fullName: "South America",
        region: Region.SA
    },
    {
        fullName: "Oceania",
        region: Region.OC
    },
    {
        fullName: "Antarctica",
        region: Region.AN
    }
]

export default function FiltersRegions ({
    className
} : {
    className?: string
}) {
    const filters = useContext(FiltersCtx);

    return (
        <>
            {filters && (
                <div className={`${className ? className : ""} overflow-y-auto max-h-[50%]`}>
                    <div className="rounded-t-md bg-cyan-800/70 p-4 text-center">
                        <h2>Regions</h2>
                    </div>
                    <div className="bg-slate-800/70">
                        <ul className="list-none">
                            {regions.map((region, index) => {
                                const icon = GetRegionFlag(region.region);
                                return (
                                    <li
                                        key={`region-${index.toString()}`}
                                        className={`${(filters.filterRegions.length < 1 || filters.filterRegions.includes(region.region)) ? "opacity-100" : "opacity-75"} p-6 cursor-pointer`}
                                        onClick={() => {
                                            const newRegions = [...filters.filterRegions];

                                            const loc = newRegions.findIndex(tmp => tmp == region.region);

                                            if (loc !== -1)
                                                newRegions.splice(loc, 1);
                                            else
                                                newRegions.push(region.region);

                                            filters.setFilterRegions(newRegions);
                                        }}
                                    >
                                        <IconAndText
                                            icon={
                                                <Image
                                                    src={icon}
                                                    width={32}
                                                    height={20}
                                                    alt="Region Flag"
                                                />
                                            }
                                            text={
                                                <>{region.fullName}</>
                                            }
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
    )
}