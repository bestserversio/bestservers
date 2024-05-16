import { ServerPublic } from "~/types/Server";
import ServerRow from "../Row";

export default function ServerBrowserTable ({
    servers
} : {
    servers: ServerPublic[]
}) {
    return (
        <table className="table-auto w-full">
            <tbody>
                {servers.map((server, index) => {
                    return (
                        <ServerRow
                            server={server}
                            table={true}
                            key={`server-${index.toString()}`}
                        />
                    )
                })}
            </tbody>
        </table> 
    );
}