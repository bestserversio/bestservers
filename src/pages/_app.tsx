import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";

import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "@styles/globals.css";
import { useCookies } from "react-cookie";

type Noti = {
    id: number
    type: "Error" | "Success"
    title: string
    msg?: string
}

type NotiFuncT = {
    type: "Error" | "Success"
    title: string
    msg?: string
    duration?: 5000
}

type NotiCtx = {
    notis: Noti[]
    addNoti: ({ type, title, msg, duration }: NotiFuncT) => void
}

export const NotiCtx = createContext<NotiCtx | undefined>(undefined);

export type UserSettings = {
    showBg: boolean
    setShowBg: Dispatch<SetStateAction<boolean>>
    useGrid: boolean
    setUseGrid: Dispatch<SetStateAction<boolean>>
}

export const UserSettingsCtx = createContext<UserSettings | undefined>(undefined);

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
    const [notis, setNotis] = useState<Noti[]>([]);

    const addNoti = ({
        type,
        title,
        msg,
        duration = 5000
    } : NotiFuncT) => {
        const id = Date.now();

        setNotis((p) => [...p, { id, type, title, msg}])

        setTimeout(() => {
            setNotis((p) => p.filter((n) => n.id !== id))
        }, duration)
    }

    const [cookies] = useCookies(["bs_showbg", "bs_usegrid"]);

    const [showBg, setShowBg] = useState(false);
    const [useGrid, setUseGrid] = useState(false);

    useEffect(() => {
        if (cookies.bs_showbg !== "undefined")
            setShowBg(Boolean(cookies.bs_showbg));

        if (cookies.bs_usegrid !== "undefined")
            setUseGrid(Boolean(cookies.bs_usegrid));
    }, [cookies])

    return (
        <SessionProvider session={session}>
            <NotiCtx.Provider value={{
                notis: notis,
                addNoti: addNoti
            }}>
                <UserSettingsCtx.Provider value={{
                    showBg: showBg,
                    setShowBg: setShowBg,
                    useGrid: useGrid,
                    setUseGrid: setUseGrid
                }}>
                    <Component {...pageProps} />
                </UserSettingsCtx.Provider>
            </NotiCtx.Provider>
        </SessionProvider>
    );
};

export default api.withTRPC(MyApp);
