import { Server } from "@prisma/client";
import Link from "next/link";
import { ReactNode } from "react";
import { ServerPublic } from "~/types/Server";

export default function ServerLink({
    server,
    className,
    children
} : {
    server: ServerPublic | Server
    className?: string
    children: ReactNode
}) {

    let viewUrl = `/servers/view/`;

    if (server.url)
        viewUrl += server.url;
    else if (server.ip && server.port)
        viewUrl += `ip/${server.ip}:${server.port.toString()}`;

    return (
        <Link
            href={viewUrl}
            className={className}
        >
            {children}
        </Link>
    )
}