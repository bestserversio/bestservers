import { GameplayerCtx } from "@components/GamePlayer";
import { PlatformFlag } from "@prisma/client";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { type ServerBrowser } from "~/types/Server";
import ServerLink from "../Link";
import { GetPlatformBanner, GetPlatformIcon } from "@utils/platforms/content";
import { GetRegionFlag } from "@utils/region";
import PlayerCount from "../PlayerCount";
import IconAndText from "@components/helpers/IconAndText";
import Image from "next/image";
import LastQueried from "../LastQueried";

export default function ServerRowCol ({
    server
} : {
    server: ServerBrowser
}) {
    const gameplayerCtx = useContext(GameplayerCtx);
    
    let joinUrl: string | undefined = undefined;

    if (server.platform?.flags.includes(PlatformFlag.A2S))
        joinUrl = `steam://connect/${server.ip}:${server.port?.toString()}`
    else if (server.platform?.flags.includes(PlatformFlag.DISCORD) && server.hostName)
        joinUrl = server.hostName;

    const platIcon = GetPlatformIcon({
        platform: server.platform
    })

    const platBanner = GetPlatformBanner({
        platform: server.platform
    })

    let regionFlag: string | undefined = undefined;

    if (server.region)
        regionFlag = GetRegionFlag(server.region);

    const [lastQueried, setLastQueried] = useState<number | undefined>(undefined);

    useEffect(() => {
        const getLastUpdateTime = () => {
            const last = server.lastQueried;
    
            if (last) {
                const now = new Date();
    
                const nowTs = now.getTime();
                const lastTs = last.getTime();
    
                setLastQueried(Math.floor((nowTs - lastTs) / 1000))
            }
        }

        const t = setInterval(() => {
            getLastUpdateTime()
        }, 1000)

        getLastUpdateTime()

        return () => clearInterval(t)
    }, [server.lastQueried])
    
    return (
        <div className="bg-shade-3/70 rounded-md flex flex-col gap-2 pb-4">
            {platBanner && (
                <ServerLink server={server}>
                    <div className="cursor-pointer relative">
                        <Image
                            src={platBanner}
                            width={500}
                            height={200}
                            className="rounded-t h-52 object-cover opacity-80 hover:opacity-100 w-full"
                            alt="Platform Banner"
                        />
                        {regionFlag && (
                            <div className="absolute top-1 right-1">
                                <Image
                                    src={regionFlag}
                                    width={32}
                                    height={16}
                                    alt="Region Flag"
                                    className="rounded-sm"
                                />
                            </div>
                        )}
                        
                    </div>
                </ServerLink>
            )}
            <h3 className="text-center">{server.name}</h3>

            <div className="p-4">
                <table className="table table-auto [&_td:first-child]:font-bold w-full">
                    <tbody>
                        <tr>
                            <td>Status</td>
                            <td>
                                {server.online ? (
                                    <span className="text-green-300">Online</span>
                                ) : (
                                    <span className="text-red-300">Offline</span>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td>Map</td>
                            <td>{server.mapName}</td>
                        </tr>
                        <tr>
                            <td>Users</td>
                            <td><PlayerCount server={server} /></td>
                        </tr>
                        {server.platform && (
                            <tr>
                                <td>Platform</td>
                                <td>
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
                                        text={<>{server.platform.name}</>}
                                        inline={true}
                                    />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center text-sm" title="Last Queried">
                <LastQueried
                    total={lastQueried}
                    className="text-xs"
                />
            </div>
            <div className="grow"></div>
            <div className="flex justify-center gap-4">
                {(server.platform?.jsInternal ?? server.platform?.jsExternal) && (
                    <button
                        onClick={() => {
                            if (!gameplayerCtx)
                                return;

                            gameplayerCtx.setVisible(true);

                            if (server.platform?.jsInternal)
                                gameplayerCtx.setInternal(server.platform.jsInternal);
                            else if (server.platform?.jsExternal)
                                gameplayerCtx.setExternal(server.platform.jsExternal);
                        }}
                    >Play</button>
                )}

                {joinUrl && (
                    <Link
                        href={joinUrl}
                        className="button button-primary"
                    >Join</Link>
                )}

                <ServerLink
                    server={server}
                    className="button button-secondary"
                >More Info</ServerLink>
            </div>
        </div>
    )
}