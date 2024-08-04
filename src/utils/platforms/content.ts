import { type Platform } from "@prisma/client";

export function GetPlatformIcon({
    platform,
    setDefault = false
} : {
    platform?: Platform | null
    setDefault?: boolean
}): string | undefined {
    let icon: string | undefined = undefined;

    if (setDefault)
        icon = "/images/platforms/default_icon.png"

    if (!platform?.icon)
        return icon;

    const uploadsUrl = process.env.NEXT_PUBLIC_UPLOADS_URL;

    if (platform.icon)
        icon = uploadsUrl + platform.icon;

    return icon;
}