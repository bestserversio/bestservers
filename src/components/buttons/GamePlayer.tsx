import { GameplayerCtx } from "@components/GamePlayer";
import { type Server } from "@prisma/client";
import { useContext } from "react";
import { ServerBrowser, type ServerPublic } from "~/types/Server";

export default function GamePlayerButton ({
    server,
    className = "button button-primary"
} : {
    server: ServerPublic | Server | ServerBrowser
    className?: string
}) {
    const gameplayerCtx = useContext(GameplayerCtx);

    return (
        <>
            {("platform" in server && (server.platform?.jsInternal ?? server.platform?.jsExternal)) && (
                <button
                    onClick={() => {
                        if (!gameplayerCtx)
                            return;

                        gameplayerCtx.setVisible(true);

                        if (server.platform?.jsInternal)
                            gameplayerCtx.setInternal(server.platform.jsInternal);
                        else if (server.platform?.jsExternal)
                            gameplayerCtx.setExternal(server.platform.jsExternal);
                    }}
                    className={className}
                >Game Player</button>
            )}
        </>
    )
}