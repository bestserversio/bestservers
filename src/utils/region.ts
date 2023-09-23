import { Region } from "@prisma/client";

export function GetRegionFlag(region: Region): string {
    const basePath = `/images/regions/`;

    switch (region) {
        case Region.AF:
            return basePath + "af.png";

        case Region.AS:
            return basePath + "as.png";

        case Region.EU:
            return basePath + "eu.png";
        
        case Region.NA:
            return basePath + "na.png";

        case Region.SA:
            return basePath + "sa.png";

        case Region.OC:
            return basePath + "oc.png";

        case Region.AN:
            return basePath + "an.png";
    }
}