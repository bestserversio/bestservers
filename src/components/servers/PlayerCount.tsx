import { type Server } from "@prisma/client";
import { RetrieveUserCountClasses, RetrieveUserFullClasses } from "@utils/UserCountClasses";
import { type ServerPublic } from "~/types/Server";

export default function PlayerCount ({
    server    
} : {
    server: ServerPublic | Server
}) {
    const fullClasses = RetrieveUserFullClasses();

    const curUserClasses = RetrieveUserCountClasses(server.curUsers, server.maxUsers);
    const avgUserClasses = RetrieveUserCountClasses(server.avgUsers, server.maxUsers);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-1">
                <span className={curUserClasses}>{server.curUsers.toString()}</span>
                <span>/</span>
                <span className={fullClasses}>{server.maxUsers.toString()}</span>
                {server.bots > 0 && (
                    <span
                        className="text-[0.60rem]"
                        title={`${server.bots.toString()} Bots`}
                    >{server.bots.toString()}</span>
                )}
            </div>
            <div>
                Avg <span className={avgUserClasses}>{server.avgUsers.toString()}</span>
            </div>
        </div>
    );
}