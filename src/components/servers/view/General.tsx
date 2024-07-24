import IconAndText from "@components/helpers/IconAndText";
import { RetrieveUserCountClasses, RetrieveUserFullClasses } from "@utils/UserCountClasses";
import { GetRegionFlag, GetRegionFullName } from "@utils/region";
import Image from "next/image";
import Link from "next/link";
import { type ServerPublic } from "~/types/Server";
import ServerMaps from "../Maps";
import ServerBanners from "../Banners";
import GamePlayerButton from "@components/buttons/GamePlayer";
import ServerGraph from "../Graph";
import JoinButton from "@components/buttons/Join";

export default function ServerViewGeneral ({
    server
} : {
    server: ServerPublic
}) {
    const fullClasses = RetrieveUserFullClasses();

    const curUserClasses = RetrieveUserCountClasses(server.curUsers, server.maxUsers);
    const avgUserClasses = RetrieveUserCountClasses(server.avgUsers, server.maxUsers);

    const uploadsUrl = process.env.NEXT_PUBLIC_UPLOADS_URL;

    // Region information.
    let regionIcon: string | undefined = undefined;

    if (server.region)
        regionIcon = GetRegionFlag(server.region);

    // Platform information.
    const platform = server.platform;
    let platformUrl: string | undefined = undefined;
    let platformIcon: string | undefined = undefined;

    if (platform) {
        platformUrl = `/platforms/view/${platform.url}`;

        if (platform.icon)
            platformIcon = uploadsUrl + platform.icon;
    }

    // Category information.
    const cat = server.category;
    let catUrl: string | undefined = undefined;
    let catIcon: string | undefined = undefined;

    const catParent = server.category?.parent;
    let catParentUrl: string | undefined = undefined;
    let catParentIcon: string | undefined = undefined;
    
    if (cat) {
        if (cat.icon)
            catIcon = uploadsUrl + cat.icon;

        if (catParent) {
            catUrl = `/categories/view/${catParent.url}/${cat.url}`;
            catParentUrl = `/categories/view/${catParent.url}`;

            if (catParent.icon)
                catParentIcon = uploadsUrl + catParent.icon;
        } else
            catUrl = `/categories/view/${cat.url}`;
    }

    // Location information.
    const locStreet: string | null = null;
    const locCity: string | null = null;
    const locState: string | null = null;
    const locCountry: string | null = null;
    const locZip: string | null = null;
    const milesAway: number | null = null;

    /*
    if (server.locationLat && server.locationLon) {
        // To Do: Do location stuff.
    }
    */

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                    <div>
                        <div>
                            <h2>General Information</h2>
                        </div>
                        <div>
                            <table className="table table-auto border-separate">
                                <tbody className="[&>tr>td:first-child]:pr-4">
                                    <tr>
                                        <td className="font-bold">Status</td>
                                        <td>
                                            {server.online ? (
                                                <span className="text-green-300">Online</span>
                                            ) : (
                                                <span className="text-red-400">Offline</span>
                                            )}
                                        </td>
                                    </tr>
                                    {server.region && (
                                        <tr>
                                            <td className="font-bold">Region</td>
                                            <td>
                                                <IconAndText
                                                    icon={
                                                        <>
                                                            {regionIcon && (
                                                                <Image
                                                                    src={regionIcon}
                                                                    width={32}
                                                                    height={21}
                                                                    alt="Region Icon"
                                                                />
                                                            )}
                                                        </>
                                                    }
                                                    text={<>{GetRegionFullName(server.region)}</>}
                                                    inline={true}
                                                />
                                            </td>
                                        </tr>
                                    )}
                                    {platform && platformUrl && (
                                        <tr>
                                            <td className="font-bold">Platform</td>
                                            <td>
                                                <IconAndText
                                                    icon={<>
                                                        {platformIcon && (
                                                            <Image
                                                                src={platformIcon}
                                                                width={32}
                                                                height={32}
                                                                alt="Platform Icon"
                                                                className="rounded-full"
                                                            />
                                                        )}
                                                    </>}
                                                    text={
                                                        <Link href={platformUrl}>
                                                            {platform.name}
                                                        </Link>
                                                    }
                                                    inline={true}
                                                />
                                            </td>
                                        </tr>
                                    )}
                                    {cat && catUrl && (
                                        <tr>
                                            <td className="font-bold">Category</td>
                                            <td className="flex flex-wrap gap-1 items-center">
                                                {catParent && catParentUrl && (
                                                    <>
                                                        <IconAndText
                                                            icon={
                                                                <>
                                                                    {catParentIcon && (
                                                                        <Image
                                                                            src={catParentIcon}
                                                                            width={32}
                                                                            height={32}
                                                                            alt="Parent Category Icon"
                                                                            className="rounded-full"
                                                                        />
                                                                    )}
                                                                </>
                                                            }
                                                            text={
                                                                <Link href={catParentUrl}>
                                                                    {catParent.name}
                                                                </Link>
                                                            }
                                                            inline={true}
                                                        />
                                                        <span>{"->"}</span>
                                                    </>
                                                )}
                                                <IconAndText
                                                    icon={
                                                        <>
                                                            {catIcon && (
                                                                <Image
                                                                    src={catIcon}
                                                                    width={32}
                                                                    height={32}
                                                                    alt="Category Icon"
                                                                    className="rounded-full"
                                                                />
                                                            )}
                                                        </>
                                                    }
                                                    text={
                                                        <Link href={catUrl}>
                                                            {cat.name}
                                                        </Link>
                                                    }
                                                    inline={true}
                                                />
                                            </td>
                                        </tr>
                                    )}
                                    <tr>
                                        <td className="font-bold">Current Users</td>
                                        <td className="flex flex-wrap gap-1">
                                            <span className={curUserClasses}>{server.curUsers.toString()}</span>
                                            <span>/</span>
                                            <span className={fullClasses}>{server.maxUsers.toString()}</span>
                                        </td>
                                    </tr>
                                    {/*
                                    <tr>
                                        <td className="font-bold">Average Users</td>
                                        <td>
                                            <span className={avgUserClasses}>{server.avgUsers.toString()}</span>
                                        </td>
                                    </tr>
                                    */}
                                    <tr>
                                        <td className="font-bold">Bots</td>
                                        <td>
                                            <span>{server.bots.toString()}</span>
                                        </td>
                                    </tr>
                                    {server.mapName && (
                                        <tr>
                                            <td className="font-bold">Current Map</td>
                                            <td>
                                                <span>{server.mapName}</span>
                                            </td>
                                        </tr>
                                    )}
                                    <tr>
                                        <td className="font-bold">VAC Secured</td>
                                        <td>
                                            {server.secure ? (
                                                <span className="text-green-300">Yes</span>
                                            ) : (
                                                <span className="text-red-400">No</span>
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                            <td className="font-bold">Password Protected</td>
                                            <td>
                                                {server.password ? (
                                                    <span className="text-green-300">Yes</span>
                                                ) : (
                                                    <span className="text-red-400">No</span>
                                                )}
                                            </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div>
                        <div>
                            <h2>Network Information</h2>
                        </div>
                        <div>
                            <table className="table table-auto border-separate">
                                <tbody>
                                    <tr>
                                        <td className="pr-4">
                                            <span className="font-bold">IPv4 Address</span>
                                        </td>
                                        <td>
                                            {server.ip ? (
                                                <span>{server.ip}</span>
                                            ) : (
                                                <span className="italic">N/A</span>
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span className="font-bold">IPv6 Address</span>
                                        </td>
                                        <td>
                                            {server.ip6 ? (
                                                <span>{server.ip6}</span>
                                            ) : (
                                                <span className="italic">N/A</span>
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span className="font-bold">Port</span>
                                        </td>
                                        <td>
                                            {server.port ? (
                                                <span>{server.port.toString()}</span>
                                            ) : (
                                                <span className="italic">N/A</span>
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span className="font-bold">Host Name</span>
                                        </td>
                                        <td>
                                            {server.hostName ? (
                                                <span>{server.hostName}</span>
                                            ) : (
                                                <span className="italic">N/A</span>
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {(milesAway ?? locStreet ?? locCity ?? locState ?? locCountry ?? locZip) && (
                        <div>
                            <div>
                                <h2>Location Information</h2>
                            </div>
                            <div>
                                <table className="table table-auto border-separate">
                                    <tbody>
                                        {milesAway && (
                                            <tr>
                                                <td>
                                                    <span className="font-bold">Miles Away</span>
                                                </td>
                                                <td>
                                                    <span>{milesAway}</span>
                                                </td>
                                            </tr>
                                        )}
                                        {locStreet && (
                                            <tr>
                                                <td>
                                                    <span className="font-bold">Street</span>
                                                </td>
                                                <td>
                                                    <span>{locStreet}</span>
                                                </td>
                                            </tr>
                                        )}
                                        {locCity && (
                                            <tr>
                                                <td>
                                                    <span className="font-bold">City</span>
                                                </td>
                                                <td>
                                                    <span>{locCity}</span>
                                                </td>
                                            </tr>
                                        )}
                                        {locState && (
                                            <tr>
                                                <td>
                                                    <span className="font-bold">State</span>
                                                </td>
                                                <td>
                                                    <span>{locState}</span>
                                                </td>
                                            </tr>
                                        )}
                                        {locCountry && (
                                            <tr>
                                                <td>
                                                    <span className="font-bold">Country</span>
                                                </td>
                                                <td>
                                                    <span>{locCountry}</span>
                                                </td>
                                            </tr>
                                        )}
                                        {locZip && (
                                            <tr>
                                                <td>
                                                    <span className="font-bold">ZIP Code</span>
                                                </td>
                                                <td>
                                                    <span>{locZip}</span>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                </div>
                {/*
                <div className="flex flex-col gap-2">
                    <div>
                        <div>
                            <h2>Maps</h2>
                            <ServerMaps server={server} />
                        </div>
                    </div>
                    <div>
                        <div>
                            <h2>Banners</h2>
                            <ServerBanners server={server} />
                        </div>
                    </div>
                </div>
                */}
            </div>
            <div>
                <ServerGraph server={server} />
            </div>
            <div className="flex flex-wrap justify-center gap-4">
                <GamePlayerButton
                    server={server}
                    className="button button-primary w-72"
                />
                <JoinButton
                    server={server}
                    className="button button-primary w-72"
                />
            </div>
        </>
    )
}