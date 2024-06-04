import { useContext, useEffect, useRef, useState } from "react";
import ArrowIcon from "./icons/Arrow";
import Link from "next/link";
import IconAndText from "./helpers/IconAndText";
import HomeIcon from "./icons/header/Home";
import ServersIcon from "./icons/header/Servers";
import GamesIcon from "./icons/header/Games";
import AboutIcon from "./icons/header/About";
import { ViewPortCtx } from "./Wrapper";
import { signIn, useSession } from "next-auth/react";
import LoginIcon from "./icons/header/Login";
import AccountIcon from "./icons/header/Account";
import { useRouter } from "next/router";

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
        <header className={`sticky top-0 ${navFixed ? "bg-slate-900" : "bg-slate-900/60"}`}>
            <div className="content">
                <nav>
                    <div className="logo">
                        <div className="flex flex-wrap gap-2 items-center">
                            <Link href="/">
                                <h2>
                                    <span className="text-sky-600 text-4xl">B</span>est <span className="text-sky-600 text-4xl">S</span>ervers
                                </h2>
                            </Link>
                        </div>
                    </div>
                    <Link
                        href="/"
                        className={path == "/" ? "nav-active" : undefined}
                    >
                        <IconAndText
                            icon={<>
                                <HomeIcon className="w-6 h-6 stroke-white" />
                            </>}
                            text={<>Home</>}
                            inline={true}
                        />
                    </Link>
                    <Link
                        href="/platforms"
                        className={path.startsWith("/platforms") ? "nav-active" : undefined}
                    >
                        <IconAndText
                            icon={<>
                                <GamesIcon className="w-6 h-6 fill-white" />
                            </>}
                            text={<>Platforms</>}
                            inline={true}
                        />
                    </Link>
                    <Link
                        href="/servers"
                        className={path.startsWith("/servers") ? "nav-active" : undefined}
                    >
                        <IconAndText
                            icon={<>
                                <ServersIcon className="w-6 h-6 stroke-white" />
                            </>}
                            text={<>Servers</>}
                            inline={true}
                        />
                    </Link>
                    <Link
                        href="/about"
                        className={path == "/about" ? "nav-active" : undefined}
                    >
                        <IconAndText
                            icon={<>
                                <AboutIcon className="w-6 h-6 stroke-white" />
                            </>}
                            text={<>About Us</>}
                            inline={true}
                        />
                    </Link>
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
            </div>
        </header>
    );
}