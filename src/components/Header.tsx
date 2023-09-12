import { useEffect, useRef, useState } from "react";
import ArrowIcon from "./icons/Arrow";
import Link from "next/link";

export default function Header () {
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

    const [isSiteListOpen, setIsSiteListOpen] = useState(false);
    const [isSiteListClosing, setIsSiteListClosing] = useState(false);

    const logoMenu = useRef<HTMLUListElement | null>(null);

    const animateEnd = (e: AnimationEvent) => {
        if (e.animationName == "logo-slide-up")
            setIsSiteListClosing(false);
    }

    if (logoMenu.current) {
        const ref = logoMenu.current;

        ref.addEventListener("animationend", animateEnd, {
            once: true
        });
    }

    return (
        <header>
            <nav>
                <div className="logo">
                    <div className="flex flex-wrap gap-2 items-center">
                        <Link href="/">
                            <h1>
                                <span className="text-green-500">B</span>est <span className="text-green-500">S</span>ervers
                            </h1>
                        </Link>
                        <button
                            onClick={() => {
                                if (isSiteListOpen)
                                    setIsSiteListClosing(true);

                                setIsSiteListOpen(!isSiteListOpen);
                            }}
                        >
                            {isSiteListOpen ? (
                                <ArrowIcon
                                    className="fill-gray-200 w-8 h-8 rotate-180"
                                />
                            ) : (
                                <ArrowIcon
                                    className="fill-gray-200 w-8 h-8"
                                />
                            )}
                        </button>
                    </div>

                </div>
            </nav>
            <ul
                className={isSiteListOpen ? `flex animate-logo-slide-down` : `animate-logo-slide-up ${!isSiteListClosing ? `hidden` : ``}`}
                ref={logoMenu}
            >
                <li>
                    <Link href="https://bestmods.io">
                        <h1>
                            <span className="text-sky-500">B</span>est <span className="text-sky-500">Mods</span>
                        </h1>
                    </Link>
                    <Link href="https://gamecom.io">
                        <h1>
                            <span className="text-red-500">G</span>ame<span className="text-red-500">C</span>om
                        </h1>
                    </Link>
                </li>
            </ul>
        </header>
    );
}