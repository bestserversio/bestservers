import { api } from "@utils/api";
import { useState } from "react";
import { ServerPublic } from "~/types/Server";

import d3 from "d3";

export default function ServerGraph({
    server,
    className = "server-graph"
} : {
    server: ServerPublic
    className?: string
}) {
    const [timeframe, setTimeframe] = useState<number | undefined>(0);

    const statsQuery = api.servers.allStats.useQuery({
        id: server.id,
        timeframe: timeframe
    });

    const stats = statsQuery.data;

    return (
        <>
            {stats && stats.length > 0 && (
                <div className={className}>
                    <div>
                        <ul>
                            <li
                                onClick={() => {
                                    setTimeframe(0);
                                }}
                                className={timeframe == 0 ? "active" : undefined}
                            >Daily</li>
                            <li
                                onClick={() => {
                                    setTimeframe(1);
                                }}
                                className={timeframe == 1 ? "active" : undefined}
                            >Weekly</li>
                            <li
                                onClick={() => {
                                    setTimeframe(2);
                                }}
                                className={timeframe == 2 ? "active" : undefined}
                            >Monthly</li>
                            <li
                                onClick={() => {
                                    setTimeframe(3);
                                }}
                                className={timeframe == 3 ? "active" : undefined}
                            >Yearly</li>
                            <li
                                onClick={() => {
                                    setTimeframe(undefined);
                                }}
                                className={timeframe == undefined ? "active" : undefined}
                            >All Time</li>
                        </ul>
                    </div>
                    <div>
                        
                    </div>
                </div>
            )} 

        </>
    );
}