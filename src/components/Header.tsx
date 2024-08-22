import React, { type MouseEventHandler, useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import IconAndText from "./helpers/IconAndText";
import { signIn, useSession } from "next-auth/react";
import LoginIcon from "./icons/header/Login";
import AccountIcon from "./icons/header/Account";
import { useRouter } from "next/router";

import { type ReactNode } from "react";
import { Cabin, Source_Code_Pro } from "next/font/google";
import { DropDown } from "./helpers/DropDown";
import CodeIcon from "./icons/header/Code";
import AnnouncementIcon from "./icons/header/Announcement";
import RoadmapIcon from "./icons/header/RoadMap";
import AdminIcon from "./icons/Admin";
import { isMod } from "@utils/auth";
import FeedbackIcon from "./icons/header/Feedback";
import { ViewPortCtx } from "./Wrapper";
import MobileIcon from "./icons/header/Mobile";
import ArrowIcon from "./icons/Arrow";
import HomeIcon from "./icons/header/Home";
import AboutIcon from "./icons/header/About";

const FCabin = Cabin({ subsets: ["latin"], weight: "700" })
const FSourceCode = Source_Code_Pro({ subsets: ["cyrillic"], weight: "900" })

const navItemClassName = `${FCabin.className} text-white duration-150 opacity-80 hover:opacity-100`

export default function Header () {
    // Get view port.
    const viewPort = useContext(ViewPortCtx);
    
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

    const { data: session } = useSession();

    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const mobileMenu = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const div = mobileMenu.current;

        if (!div)
            return;
        
        if (showMobileMenu) {
            div.classList.remove("animate-right-to-left");
            div.classList.remove("hidden")

            div.classList.add("animate-left-to-right");
            div.classList.add("flex");  
        } else {
            div.classList.remove("animate-left-to-right");
            div.classList.add("animate-right-to-left");
        }

        const animEnd = (e: AnimationEvent) => {
            if (e.animationName == "right-to-left") {
                div.classList.remove("flex");
                div.classList.add("hidden");
            }
        }

        div.addEventListener("animationend", animEnd, {
            once: true
        })

        return () => {
            div.removeEventListener("animationend", animEnd);
        }
    }, [showMobileMenu])

    return (
        <header className={`sticky top-0 p-2 z-10 w-full ${navFixed ? "bg-shade-1" : "bg-shade-1/60"}`}>
            <div className="content">
                {viewPort.isMobile ? (
                    <div className="flex justify-end">
                        <button
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                            className="flex justify-center items-center"
                        >
                            <MobileIcon className="w-4 h-4 fill-white" />
                        </button>
                        
                        <div className="hidden bg-shade-2 p-4 fixed w-[50%] top-0 left-0 h-full rounded-tr rounded-br flex-col" ref={mobileMenu}>
                            <div className="flex justify-end cursor-pointer">
                                <button
                                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                                >
                                    <ArrowIcon className="w-6 h-6 fill-white rotate-90" />
                                </button>
                            </div>
                            <div className="flex flex-col gap-4">
                                <Link href="/">
                                    <IconAndText
                                        icon={<HomeIcon className="w-4 h-4 fill-white" />}
                                        text={<>Home</>}
                                        inline={true}
                                    />
                                </Link>
                                <Link href="/about">
                                    <IconAndText
                                        icon={<AboutIcon className="w-4 h-4 stroke-white" />}
                                        text={<>About</>}
                                        inline={true}
                                    />
                                </Link>
                                <Link href="/account">
                                    <IconAndText
                                        icon={<AccountIcon className="w-4 h-4 fill-white" />}
                                        text={<>Account</>}
                                        inline={true}
                                    />
                                </Link>
                                <h3>More Links</h3>
                                <Link href="https://github.com/bestserversio" target="_blank">
                                    <IconAndText
                                        icon={<CodeIcon className="fill-white h-4 w-4" />}
                                        text={<>Source Code</>}
                                        inline={true}
                                    />
                                </Link>
                                <Link href="https://moddingcommunity.com/forum/262-announcements/" target="_blank">
                                    <IconAndText
                                        icon={<AnnouncementIcon className="fill-white h-4 w-4" />}
                                        text={<>Announcements</>}
                                        inline={true}
                                    />
                                </Link>
                                <Link href="https://github.com/orgs/bestserversio/projects/2" target="_blank">
                                    <IconAndText
                                        icon={<RoadmapIcon className="fill-white h-4 w-4" />}
                                        text={<>Roadmap</>}
                                        inline={true}
                                    />
                                </Link>
                                <Link href="https://moddingcommunity.com/forum/263-suggestions/" target="_blank">
                                    <IconAndText
                                        icon={<FeedbackIcon className="fill-white h-4 w-4" />}
                                        text={<>Feedback</>}
                                        inline={true}
                                    />
                                </Link>
                                <Link href="/admin">
                                    <IconAndText
                                        icon={<AdminIcon className="fill-white h-4 w-4" />}
                                        text={<>Admin</>}
                                        inline={true}
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <nav className="flex flex-wrap gap-6 items-center">
                        <div className="relative pr-8">
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
                        >Home</NavItem>
                        <NavItem
                            url="/about"
                            active={path == "/about"}
                        >About</NavItem>

                        <DropDown
                            btnClassName={navItemClassName}
                            items={[
                                {
                                    link: "https://github.com/bestserversio",
                                    contents: <IconAndText
                                        icon={<CodeIcon className="fill-white h-6 w-6" />}
                                        text={<>Source Code</>}
                                        inline={true}
                                    />,
                                    newTab: true,
                                    className: "text-sm font-normal text-gray-200 hover:text-white"
                                },
                                {
                                    link: "https://moddingcommunity.com/forum/262-announcements/",
                                    contents: <IconAndText
                                        icon={<AnnouncementIcon className="fill-white h-6 w-6" />}
                                        text={<>Announcements</>}
                                        inline={true}
                                        />,
                                    newTab: true,
                                    className: "text-sm font-normal text-gray-200 hover:text-white"
                                },
                                {
                                    link: "https://github.com/orgs/bestserversio/projects/2",
                                    contents: <IconAndText
                                        icon={<RoadmapIcon className="fill-white h-6 w-6" />}
                                        text={<>Roadmap</>}
                                        inline={true}
                                    />,
                                    newTab: true,
                                    className: "text-sm font-normal text-gray-200 hover:text-white"
                                },
                                {
                                    link: "https://moddingcommunity.com/forum/263-suggestions/",
                                    contents: <IconAndText
                                        icon={<FeedbackIcon className="fill-white h-6 w-6" />}
                                        text={<>Feedback</>}
                                        inline={true}
                                    />,
                                    newTab: true,
                                    className: "text-sm font-normal text-gray-200 hover:text-white"
                                },
                                ...(isMod(session) ? [
                                    {
                                        link: "/admin",
                                        contents: <IconAndText
                                            icon={<AdminIcon className="fill-white h-6 w-6" />}
                                            text={<>Admin</>}
                                            inline={true}
                                        />,
                                        className: "text-sm font-normal text-gray-200 hover:text-white"
                                    }
                                ] : [])
                            ]}

                        >
                            More
                        </DropDown>
                        
                        <div className="grow"></div>
                        {session?.user ? (
                            <NavItem
                                url="/account"
                                active={path.includes("/account")}
                            >
                                <IconAndText
                                    icon={
                                        <AccountIcon className="w-6 h-6 fill-white" />
                                    }
                                    text={<>Account</>}
                                    inline={true}
                                />
                            </NavItem>
                        ) : (
                            <NavItem
                                url="/login"
                                onClick={(e) => {
                                    e.preventDefault();

                                    void signIn();
                                }}
                            >
                                <IconAndText
                                    icon={
                                        <LoginIcon className="w-6 h-6 stroke-white" />
                                    }
                                    text={<>Login</>}
                                    inline={true}
                                />
                            </NavItem>
                        )}
                    </nav>
                )}
                
            </div>
        </header>
    );
}

function NavItem({
    active,
    url,
    newTab,
    onClick,
    children
} : {
    active?: boolean
    url: string
    onClick?: MouseEventHandler<HTMLAnchorElement>
    newTab?: boolean
    children: ReactNode
}) {
    return (
        <Link
            href={url}
            onClick={onClick}
            className={`${FCabin.className} text-white duration-150 font-bold ${active ? "opacity-100": "opacity-80"} hover:opacity-100`}
            target={newTab ? "_blank" : undefined}
        >
            {children}
        </Link>
    )
}