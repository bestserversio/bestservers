import { type ServerBrowser } from "~/types/Server";
import ServerRow from "../Row";
import { type Dispatch, type SetStateAction } from "react";

export default function ServerBrowserCol ({
    servers,
    setRefresh: _setRefresh
} : {
    servers: ServerBrowser[]
    setRefresh: Dispatch<SetStateAction<boolean>>
}) {
    return (
        <div
            className="grid gap-x-4 gap-y-6 px-2"
            style={{
                gridTemplateColumns: `repeat(auto-fill, minmax(320px, 1fr))`
            }}
        >
            {servers.map((server, index) => {
                return (
                    <ServerRow
                        server={server}
                        table={false}
                        key={`server-${index.toString()}`}
                    />
                )
            })}
        </div>
    );
}