import React, { createContext, useContext, useEffect, useState } from "react";
import Header from "./Header";
import GoogleAnalytics from "./GoogleAnalytics";
import GamePlayer from "./GamePlayer";
import { useCookies } from "react-cookie";
import Settings from "./wrapper/Settings";
import { NotiCtx, UserSettingsCtx } from "@pages/_app";
import Notification from "./statements/Notification";

const bgImages = [
    "csgo.jpg",
    "cs.jpg",
    "gmod.jpg",
    "rust.jpg",
    "tf2.webp"
]

export const ViewPortCtx = createContext({
    isMobile: false
})

type LocationT = {
    lat: number
    lon: number
}

export const LocationCtx = createContext<LocationT | undefined>(undefined)

export default function Wrapper ({
    children
} : {
    children: React.ReactNode
}) {
    const notiCtx = useContext(NotiCtx);

    const settings = useContext(UserSettingsCtx);

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const checkResize = () => {
                if (window.innerWidth < 640)
                    setIsMobile(true);
                else
                    setIsMobile(false);
            }

            // Check for mobile now.
            checkResize();

            // Add event listener for resize events.
            window.addEventListener("resize", checkResize);
        }
    }, [])

    const bgSpeed = process.env.NEXT_PUBLIC_BACKGROUND_SPEED ?? "15";

    const [curBg, setCurBg] = useState<string | undefined>(undefined);

    useEffect(() => {
        const switchBg = () => {
            if (!settings?.showBg || isMobile || typeof window === "undefined")
                return;
    
                // Create a new array based off of our background images.
                const bgToUse = [...bgImages];
    
                // Remove current background image from array if any.
                if (curBg) 
                    bgToUse.splice(bgToUse.findIndex(img => img === curBg), 1)
        
                // Retrieve random index for array.
                const randIndex = Math.floor(Math.random() * (bgImages.length - 1));
        
                // Retrieve random background image and set.
                const newBg = bgToUse[randIndex];
                setCurBg(newBg);
        }

        // Create new timer (keep track of ID and clear on end to prevent multiple timers on state change).
        const timerId = setInterval(() => {
            switchBg();
        }, Number(bgSpeed) * 1000)

        if (!settings?.showBg && curBg !== undefined)
            setCurBg(undefined);

        if (!curBg && settings?.showBg)
            switchBg();

        return () => clearInterval(timerId);
    }, [curBg, isMobile, settings?.showBg, bgSpeed])

    // Location.
    //const [curLocation, setCurLocation] = useState<LocationT | undefined>(undefined);

    /*
    useEffect(() => {
        if (typeof navigator !== "undefined" && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setCurLocation({
                    lat: pos.coords.latitude,
                    lon: pos.coords.longitude
                })
            }, (err) => {
                console.error("Error retrieving current location.");
                console.error(err);
            })
        }
    }, [])
    */

    const do_static_bg = isMobile || !settings?.showBg;

    return (
        <ViewPortCtx.Provider value={{
            isMobile: isMobile
        }}>
            <LocationCtx.Provider value={undefined}>
                <main className={do_static_bg ? "bg-gradient-to-b from-gray-900 to-gray-950" : undefined}>
                    <div
                        className={`${do_static_bg ? "hidden" : ""} fixed top-0 left-0 -z-20 w-full h-full bg-cover`}
                        style={{
                            backgroundImage: (!do_static_bg && curBg) ? `url('/images/background/${curBg}')` : undefined,
                            transition: "background-image ease-in-out 2s"
                        }}
                    />
                    <div
                        className={`${do_static_bg ? "hidden" : ""} fixed top-0 left-0 -z-10 w-full h-full bg-black/90`}
                    />

                    <Header />
                    <Settings />
                    <GoogleAnalytics />
                    <div className="content pt-4">
                        <div className="fixed bottom-2 right-2">
                            <div className="flex flex-col gap-2">
                                {notiCtx?.notis?.map((noti, idx) => {
                                    return (
                                        <Notification
                                            key={`noti-${idx.toString()}`}
                                            type={noti.type}
                                            title={noti.title}
                                            msg={noti.msg}
                                        />
                                    )
                                })}
                            </div>
                        </div>
                        <GamePlayer>
                            {children}
                        </GamePlayer>
                    </div>
                </main>
            </LocationCtx.Provider>
        </ViewPortCtx.Provider>
    );
}