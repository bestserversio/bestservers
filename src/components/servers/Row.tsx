import { type ServerPublic } from "~/types/Server";
import ServerRowTable from "./row/Table";
import ServerRowCol from "./row/Col";
import { Server } from "@prisma/client";

export default function ServerRow ({
    server,
    table
} : {
    server: ServerPublic
    table?: boolean
}) {
    return (
        <>
            {table ? (
                <ServerRowTable server={server} />
            ) : (
                <ServerRowCol server={server} />
            )}
        </>
    );
}