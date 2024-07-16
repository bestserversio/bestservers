import { createContext, useState } from "react";

import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "@styles/globals.css";

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

    return (
        <SessionProvider session={session}>
            <NotiCtx.Provider value={{
                notis: notis,
                addNoti: addNoti
            }}>
                <Component {...pageProps} />
            </NotiCtx.Provider>
        </SessionProvider>
    );
};

export default api.withTRPC(MyApp);
