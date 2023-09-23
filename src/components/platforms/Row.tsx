import Markdown from "@components/markdown/Markdown";
import { type Platform } from "@prisma/client";
import Image from "next/image";

export default function PlatformRow({
    platform,
    defaultBanner
} : {
    platform: Platform
    defaultBanner?: string
}) {
    const uploadsUrl = process.env.NEXT_PUBLIC_UPLOADS_URL ?? "";

    let banner = defaultBanner;

    if (platform.banner)
        banner = uploadsUrl + platform.banner;

    const viewUrl = `/platforms/view/${platform.url}`;

    return (
        <div 
            className="platform-row"
            onClick={() => {
                if (typeof window !== "undefined")
                    window.location.href = viewUrl;  
            }}
        >
            <div>
                <div>
                    {banner && (
                        <Image
                            src={banner}
                            width={500}
                            height={300}
                            alt="Game Banner"
                            className="object-cover"
                            priority={true}
                        />
                    )}
                </div>
                <div>
                    <h3>{platform.name}</h3>
                </div>
                <div>
                    {platform.description && (
                        <Markdown>
                            {platform.description}
                        </Markdown>
                    )}
                </div>
            </div>
        </div>
    );
}