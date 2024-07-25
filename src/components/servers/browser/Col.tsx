import { ServerBrowser } from "~/types/Server";
import ServerRow from "../Row";

export default function ServerBrowserCol ({
    servers
} : {
    servers: ServerBrowser[]
}) {
    return (
        <div className="col-span-1 sm:col-span-6 flex flex-col gap-4">
            {servers.map((server, index) => {
                return (
                    <ServerRow
                        server={server}
                        key={`server-${index.toString()}`}
                    />
                )
            })}
        </div>
    );
}