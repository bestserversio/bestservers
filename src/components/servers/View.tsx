import { type ServerPublic } from "~/types/Server";

export default function ServerView({
    server
} : {
    server: ServerPublic
}) {
    return (
        <div>
            <h1>Viewing server {server.name ?? `${server.ip ?? "N/A"}:${server.port?.toString() ?? "N/A"}`}</h1>
        </div>
    );
}