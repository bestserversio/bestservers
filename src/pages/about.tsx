import StatsBlock from "@components/blocks/Stats";
import { ContentItem1, ContentItem2 } from "@components/Content";
import MinusIcon from "@components/icons/Minus";
import PlusIcon from "@components/icons/Plus";
import Meta from "@components/Meta";
import Wrapper from "@components/Wrapper";
import { prisma } from "@server/db";
import Link from "next/link";
import { ReactNode, useState } from "react";

export default function Page({
    serversCnt,
    onlineServersCnt,
    platformsCnt,
    categoriesCnt,
    usersCnt
} : {
    serversCnt?: number
    onlineServersCnt?: number
    platformsCnt?: number
    categoriesCnt?: number
    usersCnt?: number
}) {
    return (
        <>
            <Meta
                title="About Us - Best Servers"
                contentTitle="About Us"
            />
            <Wrapper>
                <div className="grid grid-cols-4">
                    <div className="col-span-4 sm:col-span-3 sm:pr-4 flex flex-col gap-4">
                        <ContentItem1 title="About Us">
                            <p><Link href="/">Best Servers</Link> is an <Link href="https://github.com/bestserversio" target="_blank" className="font-bold">open-source</Link> server browser.</p>
                        </ContentItem1>
                        <ContentItem2
                            title="Frequently Asked Questions"
                            className="!gap-4"
                        >
                            <div className="flex flex-col gap-4">
                                <FAQ title="How Are Servers Collected?">
                                    <p>Most servers are added through our <Link href="https://github.com/bestserversio/spy" target="_blank">Spy</Link> program. Our Spy program sends requests to APIs such as the <Link href="https://developer.valvesoftware.com/wiki/Master_Server_Query_Protocol" target="_blank">Valve Master Server</Link> to add new servers.</p>
                                </FAQ>
                                <FAQ title="Is There A Public Roadmap Available?">
                                    <p>Yes! Our public roadmap may be found on GitHub <Link href="https://github.com/orgs/bestserversio/projects/2" target="_blank">here</Link>.</p>
                                </FAQ>
                                <FAQ title="Why Aren't Latency/Ping To Servers Displayed?">
                                    <>
                                        <p>Most game servers use queries that utilize the <Link href="https://www.fortinet.com/resources/cyberglossary/user-datagram-protocol-udp" target="_blank">UDP</Link> network protocol such as <Link href="https://developer.valvesoftware.com/wiki/Server_queries" target="_blank">A2S</Link> to measure the latency/ping to a game server. Unfortunately, most web browsers do not allow you to send these types of packets, at least not by default. Therefore, we cannot accurately display the latency in our web version of the server browser.</p>
                                        
                                        <p>With that said, we will be creating a desktop application that will support this in the future! Progress on this desktop application may be found <Link href="https://github.com/bestserversio/bestservers/issues/19" target="_blank">here</Link>.</p>
                                    </>
                                </FAQ>
                                <FAQ title="What Are The IPs Of All Query Servers?">
                                    <>
                                        <p>If your game servers aren't displaying as online, it's possible your server's firewall is blocking our servers that query all game server's information.</p>
                                        <p>Here's a list of IPs of our query servers.</p>
                                        <ul className="list-disc [&>li]:ml-4">
                                            <li>N/A</li>
                                            <li>N/A</li>
                                        </ul>
                                    </>
                                </FAQ>
                                <FAQ title="My Servers Show As Offline">
                                    <>
                                        <p>If your servers are showing as offline, please ensure our query server IPs aren't being blocked by your server's firewall. A list of query server IPs may be found under the "What Are The IPs Of All Query Servers?" question above.</p>
                                        <p>If the query IPs listed above are not blocked by your server{"'"}s firewall and the server(s) are still showing as offline, please reach out to an administrator.</p>
                                    </>
                                </FAQ>
                            </div>
                        </ContentItem2>
                    </div>
                    <div className="col-span-4 sm:col-span-1">
                        <StatsBlock
                            servers={serversCnt}
                            serversOnline={onlineServersCnt}
                            platforms={platformsCnt}
                            categories={categoriesCnt}
                            users={usersCnt}
                        />
                    </div>
                </div>
            </Wrapper>
        </>
    );
}

function FAQ({
    title,
    children
} : {
    title: JSX.Element | string
    children: ReactNode
}) {
    const [show, setShow] = useState(false);

    return (
        <div className="p-4 bg-shade-3/70 rounded-md">
            <div className="flex justify-between items-center">
                <h3>{title}</h3>
                <button
                    onClick={() => setShow(!show)}
                >
                    {show ? (
                        <MinusIcon className="fill-white w-6 h-6" />
                    ) : (
                        <PlusIcon className="fill-white w-6 h-6" />
                    )}
                </button>
            </div>
            {show && (
                <div className="text-sm">
                    {children}
                </div>
            )}
        </div>
    )
}

export async function getServerSideProps() {
    const serversCnt = await prisma.server.count({
        where: {
            visible: true
        }
    })

    const onlineServersCnt = await prisma.server.count({
        where: {
            online: true,
            visible: true
        }
    })

    const platformsCnt = await prisma.platform.count();

    const categoriesCnt = await prisma.category.count();

    const usersCnt = await prisma.user.count();

    return {
        props: {
            serversCnt: serversCnt,
            onlineServersCnt: onlineServersCnt,
            platformsCnt: platformsCnt,
            categoriesCnt: categoriesCnt,
            usersCnt: usersCnt
        }
    }
}