import { type ServerPublic } from "~/types/Server";
import ServerViewGeneral from "./view/General";
import ServerLink from "./Link";
import ServerViewFeatures from "./view/Features";
import ServerViewRules from "./view/Rules";

export default function ServerView ({
    server,
    view = "general"
} : {
    server: ServerPublic
    view?: string
}) {
    
    return (
        <div className="pt-2 flex flex-col gap-2">
            <h1>{server.name ?? `${server.ip ?? "N/A"}:${server.port?.toString() ?? "N/A"}`}</h1>
            <div className="flex flex-wrap gap-2">
                <div className="w-full sm:w-48">
                    <ul className="tabs-menu">
                        <ServerLink
                            server={server}
                            className={view == "general" ? "tab-active" : undefined}
                        >
                            <li>General</li>
                        </ServerLink>
                        {server.features && server.features.length > 0 && (
                            <ServerLink
                                server={server}
                                view="features"
                                className={view == "features" ? "tab-active" : undefined}
                            >
                                <li>Features</li>
                            </ServerLink>
                        )}
                        {server.rules && server.rules.length > 0 && (
                            <ServerLink
                                server={server}
                                view="rules"
                                className={view == "rules" ? "tab-active" : undefined}
                            >
                                <li>Rules</li>
                            </ServerLink>
                        )}

                    </ul>
                </div>
                <div className="grow bg-shade-2/70 rounded-md p-4">
                    {view == "general" && (
                        <ServerViewGeneral server={server} />
                    )}
                    {view == "features" && (
                        <ServerViewFeatures server={server} />
                    )}
                    {view == "rules" && (
                        <ServerViewRules server={server} />
                    )}
                </div>
            </div>
        </div>
    );
}