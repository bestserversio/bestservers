import { type Platform } from "@prisma/client";

export function GetPlatformIcon({
    platform,
    setDefault = true
} : {
    platform?: Platform | null
    setDefault?: boolean
}): string | undefined {
    let icon: string | undefined = undefined;

    if (setDefault)
        icon = "/images/platforms/default_icon.png"

    if (!platform?.icon)
        return icon;

    const uploadsUrl = process.env.NEXT_PUBLIC_UPLOADS_URL ?? "";

    if (platform.icon)
        icon = uploadsUrl + platform.icon;

    return icon;
}

export function GetPlatformBanner({
    platform,
    setDefault = true
} : {
    platform?: Platform | null
    setDefault?: boolean
}): string | undefined {
    let banner: string | undefined = undefined;

    if (setDefault)
        banner = "/images/platforms/default_banner.png"

    if (!platform?.banner)
            return banner;

    const uploadsUrl = process.env.NEXT_PUBLIC_UPLOADS_URL ?? "";

    if (platform.banner)
        banner = uploadsUrl + platform.banner;

    return banner;
}