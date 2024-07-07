import { type ServerPublic } from "~/types/Server";

import Markdown from "@components/markdown/Markdown";

export default function ServerViewFeatures ({
    server
} : {
    server: ServerPublic
}) {
    return (
        <Markdown>
            {server.features ?? "*None*"}
        </Markdown>
    )
}