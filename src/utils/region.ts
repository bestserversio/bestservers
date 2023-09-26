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

export function GetRegionFullName(region: Region): string {
    switch (region) {
        case Region.AF:
            return "Africa";
        
        case Region.AS:
            return "Asia";

        case Region.EU:
            return "Europe";

        case Region.NA:
            return "North America";

        case Region.SA:
            return "South America";
        
        case Region.OC:
            return "Oceania";

        case Region.AN:
            return "Antarctica";
    }
}

export function GetRegionFromString(str?: string): Region | undefined {
    if (!str)
        return undefined;
    
    switch (str.toLowerCase()) {
        case "af":
            return Region.AF;

        case "as":
            return Region.AS;

        case "eu":
            return Region.EU;

        case "na":
            return Region.NA;

        case "sa":
            return Region.SA;

        case "oc":
            return Region.SA;

        case "an":
            return Region.AN;
    }

    return undefined;
}