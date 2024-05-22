import { ServerOs } from "@prisma/client";

export function GetOsFromString(str?: string): ServerOs | undefined {
    if (str === undefined)
        return undefined;

    switch (str.toLowerCase()) {
        case "windows":
            return ServerOs.WINDOWS;

        case "linux":
            return ServerOs.LINUX;

        case "mac":
            return ServerOs.MAC
    }

    return undefined;
}