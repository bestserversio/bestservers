import { type ServerPublic } from "~/types/Server";
import ServerViewGeneral from "./view/General";
import ServerLink from "./Link";
import ServerViewFeatures from "./view/Features";
import ServerViewRules from "./view/Rules";
import { useSession } from "next-auth/react";
import { isAdmin } from "@utils/auth";
import { api } from "@utils/api";
import Link from "next/link";
import { useContext, useState } from "react";
import { NotiCtx } from "@pages/_app";

export default function ServerView ({
    server,
    view = "general"
} : {
    server: ServerPublic
    view?: string
}) {
    const { data: session} = useSession();

    const notiCtx = useContext(NotiCtx);

    const editLink = `/admin/server/edit/${server.id.toString()}`;
    const deleteMut = api.servers.delete.useMutation({
        onError: (opts) => {
            const { message } = opts;

            notiCtx?.addNoti({
                type: "Error",
                title: `Failed To Delete Server`,
                msg: `Failed to delete this server. Error: ${message}`
            })
        },
        onSuccess: () => {
            notiCtx?.addNoti({
                type: "Success",
                title: `Deleted Server!`,
                msg: `Successfully deleted server!`
            })
        }
    });
    const updateMut = api.servers.update.useMutation({
        onError: (opts) => {
            const { message } = opts;

            notiCtx?.addNoti({
                type: "Error",
                title: `Failed To Hide Server`,
                msg: `Failed to hide server. Error: ${message}`
            })
        },
        onSuccess: () => {
            notiCtx?.addNoti({
                type: "Success",
                title: `Hid Server!`,
                msg: `Successfully hid server!`
            })
        }
    });

    const [visible, setVisible] = useState(server.visible);
    
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
                <div className="grow bg-shade-2/70 rounded-md p-4 flex flex-col gap-2">
                    {view == "general" && (
                        <ServerViewGeneral server={server} />
                    )}
                    {view == "features" && (
                        <ServerViewFeatures server={server} />
                    )}
                    {view == "rules" && (
                        <ServerViewRules server={server} />
                    )}
                    {isAdmin(session) && (
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link
                                href={editLink}
                                className="button button-primary"
                            >Edit</Link>
                            <button
                                onClick={() => {
                                    if (visible) {
                                        updateMut.mutate({
                                            id: server.id,
                                            visible: false
                                        })

                                        setVisible(!visible);
                                    } else {
                                        updateMut.mutate({
                                            id: server.id,
                                            visible: true
                                        })

                                        setVisible(!visible);
                                    }
                                }}
                                className="button button-secondary"
                            >{visible ? "Hide" : "Show"}</button>
                            <button
                                onClick={() => {
                                    const yes = confirm("Are you sure you want to delete this server?");

                                    if (yes) {
                                        deleteMut.mutate({
                                            id: server.id
                                        })
                                    }
                                }}
                                className="button button-danger"
                            >Delete</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}