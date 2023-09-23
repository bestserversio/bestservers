import { type ServerPublic } from "~/types/Server";
import ServerRowTable from "./row/Table";
import ServerRowCol from "./row/Col";

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