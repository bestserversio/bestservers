import { type ReactNode, createContext, useRef, useState } from "react";

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
                <div className="m-auto absolute z-10 p-6 rounded animate-gameplayer-slide-in">
                    <div className="flex justify-between bg-slate-800">
                            <h2>Game Player</h2>
                            <div
                                onClick={() => {
                                    setVisible(false);
                                }}
                            >
                                X
                            </div>
                    </div>
                    <div className="p-6 bg-slate-700">
                            {internal && (
                                <canvas
                                    ref={canvas}
                                    className="w-full"
                                >
                                </canvas>
                            )}
                            {external && (
                                <iframe
                                    src={external}
                                    allowFullScreen={true}
                                    ref={iframe}
                                    className="w-full h-3/4"
                                />
                            )}
                            <div className="mx-auto">
                                <button
                                    onClick={() => {
                                        const c = canvas.current;
                                        const i = iframe.current;
                                        
                                        if (c)
                                            void c.requestFullscreen();
                                        else if (i)
                                            void i.requestFullscreen();

                                        setFullScreen(!fullScreen);
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