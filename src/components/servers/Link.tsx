import { Server } from "@prisma/client";
import Link from "next/link";
import { ReactNode } from "react";
import { ServerPublic } from "~/types/Server";

export default function ServerLink({
    server,
    view = "general",
    className,
    children
} : {
    server: ServerPublic
    view?: string
    className?: string
    children: ReactNode
}) {

    let viewUrl = `/servers/view/`;

    if (server.url)
        viewUrl += server.url;
    else if (server.ip && server.port)
        viewUrl += `ip/${server.ip}:${server.port.toString()}`;

    // If we have a view other than general, append it.
    if (view !== "general")
        viewUrl += `/${view}`;

    return (
        <Link
            href={viewUrl}
            className={className}
        >
            {children}
        </Link>
    )
}