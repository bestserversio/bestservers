import { ServerPublic } from "~/types/Server";
import ServerRow from "../Row";

export default function ServerBrowserTable ({
    servers
} : {
    servers: ServerPublic[]
}) {
    return (
        <table className="table-auto w-full">
            <thead>
                <tr className="text-left">
                    <th></th>
                    <th></th>
                    <th></th>
                    <th>Name</th>
                    <th>Map</th>
                    <th>Players</th>
                    <th>Last Queried</th>
                </tr>
            </thead>
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