import { api } from "@utils/api";
import { useState } from "react";
import { ServerPublic } from "~/types/Server";

export default function ServerGraph({
    server
} : {
    server: ServerPublic
}) {
    const [timeframe, setTimeframe] = useState<number | undefined>(0);

    const statsQuery = api.servers.allStats.useQuery({
        id: server.id,
        timeframe: timeframe
    });

    const stats = statsQuery.data;

    return (
        <div className="server-graph">
            <div>
                <ul>
                    <li
                        onClick={() => {
                            setTimeframe(0);
                        }}
                    >Daily</li>
                    <li
                        onClick={() => {
                            setTimeframe(1);
                        }}
                    >Weekly</li>
                    <li
                        onClick={() => {
                            setTimeframe(2);
                        }}
                    >Monthly</li>
                    <li
                        onClick={() => {
                            setTimeframe(3);
                        }}
                    >Yearly</li>
                    <li
                        onClick={() => {
                            setTimeframe(undefined);
                        }}
                    >All Time</li>
                </ul>
            </div>
        </div>
    );
}