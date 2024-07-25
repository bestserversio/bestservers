import { api } from "@utils/api";
import { type ReactNode, type SetStateAction, useState } from "react";
import { ServerBrowser, type ServerPublic } from "~/types/Server";

export default function ServerGraph({
    server,
    className = "server-graph"
} : {
    server: ServerPublic | ServerBrowser
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
                <div className={`${className ? className : ""} p-4`}>
                    <div>
                        <ul className="flex flex-wrap gap-2">
                            <DateItem
                                timeframe={timeframe}
                                setTimeFrame={setTimeframe}
                                value={0}
                            >Daily</DateItem>
                            <DateItem
                                timeframe={timeframe}
                                setTimeFrame={setTimeframe}
                                value={1}
                            >Weekly</DateItem>
                            <DateItem
                                timeframe={timeframe}
                                setTimeFrame={setTimeframe}
                                value={2}
                            >Monthly</DateItem>
                            <DateItem
                                timeframe={timeframe}
                                setTimeFrame={setTimeframe}
                                value={3}
                            >Yearly</DateItem>
                            <DateItem
                                timeframe={timeframe}
                                setTimeFrame={setTimeframe}
                                value={undefined}
                            >All Time</DateItem>
                        </ul>
                    </div>
                    <div>
                        
                    </div>
                </div>
            )} 

        </>
    );
}

function DateItem({
    timeframe,
    value,
    setTimeFrame,
    children
} : {
    timeframe?: number
    value?: number
    setTimeFrame: (value: SetStateAction<number | undefined>) => void
    children: ReactNode
}) {
    return (
        <li
            onClick={() => {
                setTimeFrame(value);
            }}
            className={`${timeframe === value ? "bg-cyan-700/70" : "bg-cyan-800/70"} cursor-pointer p-2  rounded font-bold`}
        >
            {children}
        </li>
    )
}