import { type Server } from "@prisma/client";
import { type ServerPublic } from "~/types/Server";

export default function ServerMaps({
    server,
    className
} : {
    server: ServerPublic | Server
    className?: string
}) {
    return (
        <div className={`server-maps${className ? ` ${className}` : ``}`}>
            <span>{server.name ?? "N/A"}</span>
        </div>
    );
}