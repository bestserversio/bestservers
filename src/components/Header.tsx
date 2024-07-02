import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import IconAndText from "./helpers/IconAndText";
import HomeIcon from "./icons/header/Home";
//import ServersIcon from "./icons/header/Servers";
//import GamesIcon from "./icons/header/Games";
import AboutIcon from "./icons/header/About";
import { signIn, useSession } from "next-auth/react";
import LoginIcon from "./icons/header/Login";
import AccountIcon from "./icons/header/Account";
import { useRouter } from "next/router";
import { FBlackOps, FKanit, FPermanentMarker } from "./Fonts";

import { ReactNode } from "react";
import { Cabin, Roboto_Mono, Source_Code_Pro } from "next/font/google";

const FRobotoMono = Roboto_Mono({ subsets: ["cyrillic"], weight: "400" })
const FCabin = Cabin({ subsets: ["latin"], weight: "700" })
const FSourceCode = Source_Code_Pro({ subsets: ["cyrillic"], weight: "900" })

export default function Header () {
    const router = useRouter();
    const path = router.asPath;

    const [navFixed, setNavFixed] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("scroll", () => {
                const scrollY = window.scrollY;

                if (scrollY > 0 && !navFixed)
                    setNavFixed(true);
                else if (scrollY <= 0 && navFixed)
                    setNavFixed(false);
            })
        }
    }, [navFixed])

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

    const { data: session } = useSession();

    return (
        <header className={`sticky top-0 p-2 z-10 w-full ${navFixed ? "bg-shade-1" : "bg-shade-1/60"}`}>
            <div className="content">
                <nav className="flex flex-wrap gap-6 items-center">
                    <div className="relative w-80">
                        <div className="flex flex-wrap gap-2 items-center">
                            <Link href="/">
                                <h2 className={`text-3xl ${FSourceCode.className}`}>
                                    <span className="text-sky-600 text-4xl">B</span>est <span className="text-sky-600 text-4xl">S</span>ervers
                                </h2>
                            </Link>
                        </div>
                    </div>
                    <NavItem
                        url="/"
                        active={path == "/"}
                    >
                        <IconAndText
                            icon={<>
                                <HomeIcon className="w-6 h-6 stroke-white" />
                            </>}
                            text={<>Home</>}
                            inline={true}
                        />
                    </NavItem>
                    <NavItem
                        url="/about"
                        active={path == "/about"}
                    >
                        <IconAndText
                            icon={<>
                                <AboutIcon className="w-6 h-6 stroke-white" />
                            </>}
                            text={<>About Us</>}
                            inline={true}
                        />
                    </NavItem>
                    
                    <div className="grow"></div>
                    {session?.user ? (
                        <Link
                            href="/account"
                            className={path.startsWith("/account") ? "nav-active" : undefined}
                        >
                            <IconAndText
                                icon={
                                    <AccountIcon className="w-6 h-6 stroke-white" />
                                }
                                text={<>My Account</>}
                                inline={true}
                            />
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            onClick={(e) => {
                                e.preventDefault();

                                signIn();
                            }}
                        >
                            <IconAndText
                                icon={
                                    <LoginIcon className="w-6 h-6 stroke-white" />
                                }
                                text={<>Login</>}
                                inline={true}
                            />
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}

function NavItem({
    active,
    url,
    new_tab,
    children
} : {
    active?: boolean
    url: string
    new_tab?: boolean
    children: ReactNode
}) {
    return (
        <Link
            href={url}
            className={`${FCabin.className} text-lg duration-150 font-bold ${active ? "opacity-100": "opacity-80"} hover:opacity-100`}
            target={new_tab ? "_blank" : undefined}
        >
            {children}
        </Link>
    )
}