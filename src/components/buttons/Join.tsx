import { type Server } from "@prisma/client";
import Link from "next/link";
import { type ServerBrowser, type ServerPublic } from "~/types/Server";

export default function JoinButton ({
    server,
    className = "button button-primary"
} : {
    server: ServerPublic | Server | ServerBrowser
    className?: string
}) {
    let joinUrl: string | undefined = undefined;

    if ("platform" in server) {
        if (server.platform?.flags.includes("A2S"))
            joinUrl = `steam://connect/${server.ip}:${server.port?.toString()}`
        else if (server.platform?.flags.includes("DISCORD") && server.hostName)
            joinUrl = server.hostName;
    }

    return (
        <>
            {joinUrl && (
                <Link
                    href={joinUrl}
                    className={className}
                >Join</Link>
            )}
        </>
    )
}