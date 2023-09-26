import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import Header from "./Header";
import GoogleAnalytics from "./GoogleAnalytics";
import { ErrorCtx, SuccessCtx } from "@pages/_app";
import SuccessBox from "./statements/Success";
import ErrorBox from "./statements/Error";
import GamePlayer from "./GamePlayer";

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
    const errorCtx = useContext(ErrorCtx);
    const successCtx = useContext(SuccessCtx);

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
            if (isMobile || typeof window === "undefined")
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

        if (!curBg)
            switchBg();

        return () => clearInterval(timerId);
    }, [curBg, isMobile, bgImages])

    // Location.
    const [curLocation, setCurLocation] = useState<LocationT | undefined>(undefined);

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

    return (
        <ViewPortCtx.Provider value={{
            isMobile: isMobile
        }}>
            <LocationCtx.Provider value={curLocation}>
                <main className={isMobile ? "bg-gradient-to-b from-gray-900 to-gray-950" : undefined}>
                    <div
                        id="bg"
                        className={isMobile ? "hidden" : undefined}
                        style={{
                            backgroundImage: (!isMobile && curBg) ? `url('/images/background/${curBg}')` : undefined
                        }}
                    />
                    <div
                        id="bg-overlay"
                        className={isMobile ? "hidden" : undefined}
                    />

                    <Header />
                    <GoogleAnalytics />
                    <div className="content">
                        <ErrorBox
                            title={errorCtx?.title}
                            message={errorCtx?.msg}
                        />
                        <SuccessBox
                            title={successCtx?.title}
                            message={successCtx?.msg}
                        />
                        <GamePlayer>
                            {children}
                        </GamePlayer>
                    </div>
                </main>
            </LocationCtx.Provider>
        </ViewPortCtx.Provider>
    );
}