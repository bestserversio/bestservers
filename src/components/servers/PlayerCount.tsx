import { Server } from "@prisma/client";
import { ServerPublic } from "~/types/Server";

const colors: {[key: number]: string} = {
    65: "text-orange-300",
    80: "text-green-300",
    100: "text-red-400"
}

export default function PlayerCount ({
    server
} : {
    server: ServerPublic | Server
}) {
    let curUserClasses: string | undefined = undefined;
    let avgUserClasses: string | undefined = undefined;

    // Get fill percentage.
    const curUserFill = (server.curUsers / server.maxUsers) * 100;
    const avgUserFill = (server.avgUsers / server.maxUsers) * 100;

    for (const key in colors) {
        const color = colors[key];

        if (Number(key) <= curUserFill)
            curUserClasses = color;

        if (Number(key) <= avgUserFill)
            avgUserClasses = color;  
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-1">
                <span className={curUserClasses}>{server.curUsers.toString()}</span>
                <span>/</span>
                <span className={colors[100]}>{server.maxUsers.toString()}</span>
            </div>
            <div>
                Avg <span className={avgUserClasses}>{server.avgUsers.toString()}</span>
            </div>
        </div>
    );
}