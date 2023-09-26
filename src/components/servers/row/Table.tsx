import { GameplayerCtx } from "@components/GamePlayer";
import { PlatformFlag } from "@prisma/client";
import Link from "next/link";
import { useContext } from "react";
import { ServerPublic } from "~/types/Server";
import ServerLink from "../Link";
import Image from "next/image";
import PlayerCount from "../PlayerCount";
import { GetRegionFlag } from "../../../utils/region";
import JoinButton from "@components/buttons/Join";
import GamePlayerButton from "@components/buttons/GamePlayer";

export default function ServerRowTable ({
    server
} : {
    server: ServerPublic
}) {
    const uploadsUrl = process.env.NEXT_PUBLIC_UPLOADS_URL;
    const gameplayerCtx = useContext(GameplayerCtx);
    
    let joinUrl: string | undefined = undefined;

    if (server.platform?.flags.includes(PlatformFlag.A2S))
        joinUrl = `steam://connect/${server.ip}:${server.port?.toString()}`
    else if (server.platform?.flags.includes(PlatformFlag.DISCORD) && server.hostName)
        joinUrl = server.hostName;

    let platIcon: string | undefined = undefined;

    if (server.platform?.icon)
        platIcon = uploadsUrl + server.platform.icon;

    let regionFlag: string | undefined = undefined;

    if (server.region)
        regionFlag = GetRegionFlag(server.region);
    
    return (
        <tr className="server-row-table">
            <td>
                {server.rating && (
                    <span className="text-lg text-bold">{server.rating.toString()}</span>
                )}
            </td>
            <td>
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
            <td>
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
                <GamePlayerButton server={server} />
                <JoinButton server={server} />
                <ServerLink
                    server={server}
                    className="button"
                >More Info</ServerLink>
            </td>
        </tr>
    )
}