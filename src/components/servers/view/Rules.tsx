import { type ServerPublic } from "~/types/Server";

import Markdown from "@components/markdown/Markdown";

export default function ServerViewRules ({
    server
} : {
    server: ServerPublic
}) {
    return (
        <Markdown>
            {server.rules ?? "*None*"}
        </Markdown>
    )
}