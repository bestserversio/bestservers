import { ReactNode, createContext, useRef, useState } from "react";

type GameplayerType = {
    setInternal: React.Dispatch<React.SetStateAction<string | undefined>>
    setExternal: React.Dispatch<React.SetStateAction<string | undefined>>
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export const GameplayerCtx = createContext<GameplayerType | null>(null);

export default function GamePlayer({
    children
} : {
    children: ReactNode
}) {
    const [internal, setInternal] = useState<string | undefined>(undefined);
    const [external, setExternal] = useState<string | undefined>(undefined);

    const [visible, setVisible] = useState(false);
    
    const [fullScreen, setFullScreen] = useState(false);

    const iframe = useRef<HTMLIFrameElement | null>(null);
    const canvas = useRef<HTMLCanvasElement | null>(null);

    return (
        <GameplayerCtx.Provider value={{
            setInternal: setInternal,
            setExternal: setExternal,
            setVisible: setVisible
        }}>
            {visible && (
                <div className="gameplayer">
                    <div>
                            <h2>Game Player</h2>
                            <div
                                onClick={() => {
                                    setVisible(false);
                                }}
                            >
                                X
                            </div>
                    </div>
                    <div>
                            {internal && (
                                <canvas ref={canvas}>
                                </canvas>
                            )}
                            {external && (
                                <iframe
                                    src={external}
                                    allowFullScreen={true}
                                    ref={iframe}
                                />
                            )}
                            <div className="mx-auto">
                                <button
                                    onClick={async () => {
                                        const c = canvas.current;
                                        const i = iframe.current;
                                        
                                        if (c)
                                            await c.requestFullscreen();
                                        else if (i)
                                            await i.requestFullscreen();

                                        setFullScreen(true);
                                    }}
                                    className="button"
                                >Full Screen</button>
                            </div>
                    </div>
                </div>
            )}

            {children}
        </GameplayerCtx.Provider>
    );
}