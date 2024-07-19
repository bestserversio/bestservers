import React, { type MouseEventHandler, useEffect, useState } from "react";
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

import { type ReactNode } from "react";
import { Cabin, Source_Code_Pro } from "next/font/google";
import { DropDown } from "./helpers/DropDown";
import CodeIcon from "./icons/header/Code";
import AnnouncementIcon from "./icons/header/Announcement";
import RoadmapIcon from "./icons/header/RoadMap";

const FCabin = Cabin({ subsets: ["latin"], weight: "700" })
const FSourceCode = Source_Code_Pro({ subsets: ["cyrillic"], weight: "900" })

const navItemClassName = `${FCabin.className} text-white duration-150 opacity-80 hover:opacity-100`

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
                                link: "https://github.com/bestserversio/bestservers/issues",
                                contents: <IconAndText
                                    icon={<RoadmapIcon className="fill-white h-6 w-6" />}
                                    text={<>Roadmap</>}
                                    inline={true}
                                />,
                                newTab: true,
                                className: "text-sm font-normal text-gray-200 hover:text-white"
                            }
                        ]}

                    >
                        More
                    </DropDown>
                    
                    <div className="grow"></div>
                    {session?.user ? (
                        <NavItem
                            url="/account"
                            onClick={(e) => {
                                e.preventDefault();

                                void signIn();
                            }}
                            active={path.includes("/account")}
                        >
                            <IconAndText
                                icon={
                                    <AccountIcon className="w-6 h-6 stroke-white" />
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
            className={`${FCabin.className} text-white text-lg duration-150 font-bold ${active ? "opacity-100": "opacity-80"} hover:opacity-100`}
            target={newTab ? "_blank" : undefined}
        >
            {children}
        </Link>
    )
}