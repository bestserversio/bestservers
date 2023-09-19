import Link from "next/link";
import { type ServerPublic } from "~/types/Server";

export default function ServerRow ({
    server
} : {
    server: ServerPublic
}) {
    const uploadsUrl = process.env.NEXT_PUBLIC_UPLOADS_URL;

    const viewUrl = `/servers/view/${server.url ? server.url : `${server.id.toString()}`}`;
    const steamConnectUrl = `steam://connect/${server.ip}:${server.port?.toString()}`;

    return (
        <div className="server-row">
            <div className="col-span-1">

            </div>
            <div className="col-span-5">
                {server.name}
            </div>
            <div className="col-span-3">
                {server.mapName}
            </div>
            <div className="col-span-1">
                <div className="flex flex-col gap-2">
                    <div>
                        {server.curUsers.toString()}/{server.maxUsers.toString()}
                    </div>
                    <div>
                        Avg {server.avgUsers.toString()}
                    </div>
                </div>
            </div>
            <div className="col-span-2 flex gap-4">
                <Link
                    href={steamConnectUrl}
                    className="button"
                >Connect!</Link>
                <Link
                    href={viewUrl}
                    className="button"
                >More Info</Link>
            </div>
        </div>
    );
}