import { Server } from "@prisma/client";
import { ServerPublic } from "~/types/Server";

export default function ServerMaps({
    server,
    className
} : {
    server: ServerPublic | Server
    className?: string
}) {
    return (
        <div className={`server-maps${className ? ` ${className}` : ``}`}>

        </div>
    );
}