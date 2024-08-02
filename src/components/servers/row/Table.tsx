import { useEffect, useState } from "react";
import { type ServerBrowser } from "~/types/Server";
import ServerLink from "../Link";
import Image from "next/image";
import PlayerCount from "../PlayerCount";
import { GetRegionFlag } from "../../../utils/region";
import JoinButton from "@components/buttons/Join";
import GamePlayerButton from "@components/buttons/GamePlayer";
import LastQueried from "../LastQueried";

export default function ServerRowTable ({
    server
} : {
    server: ServerBrowser
}) {
    const uploadsUrl = process.env.NEXT_PUBLIC_UPLOADS_URL;
    //const gameplayerCtx = useContext(GameplayerCtx);
    
    /*
    let joinUrl: string | undefined = undefined;

    if (server.platform?.flags.includes(PlatformFlag.A2S))
        joinUrl = `steam://connect/${server.ip}:${server.port?.toString()}`
    else if (server.platform?.flags.includes(PlatformFlag.DISCORD) && server.hostName)
        joinUrl = server.hostName;
    */

    let platIcon: string | undefined = undefined;

    if (server.platform?.icon)
        platIcon = uploadsUrl + server.platform.icon;

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
        <tr className={`server-row-table bg-gradient-to-b from-shade-2/70 to-shade-3/70 hover:duration-150 hover:from-shade-4/70 hover:to-shade-5/70 border-separate border-spacing-4 rounded-lg ${!server.online ? "opacity-60" : ""}`}>
            <td className={!server.rating ? "w-0" : "w-auto"}>
                {server.rating && (
                    <span className="text-lg text-bold">{server.rating?.toString()}</span>
                )}
            </td>
            <td className="w-[32px]">
                {platIcon && (
                    <Image
                        src={platIcon}
                        width={32}
                        height={32}
                        alt="Platform Icon"
                        className="rounded-full"
                    />
                )}
            </td>
            <td className="w-[48px]">
                {regionFlag && (
                    <Image
                        src={regionFlag}
                        width={48}
                        height={32}
                        alt="Region Flag"
                    />
                )}
            </td>
            <td>
                {server.name}
            </td>
            <td>
                {server.mapName}
            </td>
            <td>
                <PlayerCount server={server} />
            </td>
            <td>
                <LastQueried total={lastQueried} />
            </td>
            <td>
                <div>
                    <GamePlayerButton server={server} />
                    <JoinButton server={server} />
                    <ServerLink
                        server={server}
                        className="button button-secondary"
                    >More Info</ServerLink>
                </div>
            </td>
        </tr>
    )
}