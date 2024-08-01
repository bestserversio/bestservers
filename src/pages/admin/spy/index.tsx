import { type GetServerSidePropsContext } from "next";

import { getServerAuthSession } from "@server/auth";

import Wrapper from "@components/Wrapper";
import NoPermissions from "@components/statements/NoPermissions";

import { isAdmin, isMod } from "@utils/auth";
import Meta from "@components/Meta";
import AdminMenu from "@components/admin/Menu";
import SpyBlock from "@components/spy/SpyBlock";
import ScannerBlock from "@components/spy/ScannerBlock";
import BadWordsBlock from "@components/spy/BadWordBlock";
import { ContentItem2 } from "@components/Content";
import BadIpsBlock from "@components/spy/BadIpBlock";
import BadAsnsBlock from "@components/spy/BadAsnBlock";
import GoodIpsBlock from "@components/spy/GoodIpBlock";
import { useSession } from "next-auth/react";
import VmsBlock from "@components/spy/VmsBlock";

export default function Page ({
    authed    
} : {
    authed: boolean
}) {
    const { data: session } = useSession();
    const isA = isAdmin(session);

    return (
        <>
            <Meta
                title={`${authed ? "Admin - Spy" : "No Permission"} - Best Servers`}
            />
            <Wrapper>
                {authed ? (
                    <AdminMenu current="spy">
                        <div className="flex gap-6 justify-between">
                            <div className="w-full flex flex-col gap-2">
                                {isA && (
                                    <ContentItem2 title="Spies">
                                        <SpyBlock />
                                    </ContentItem2>
                                )}
                                {isA && (
                                    <ContentItem2 title="Scanners">
                                        <ScannerBlock />
                                    </ContentItem2>
                                )}
                                {isA && (
                                    <ContentItem2 title="VMS">
                                        <VmsBlock />
                                    </ContentItem2>
                                )}
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                                <ContentItem2 title="Bad Words">
                                    <BadWordsBlock />
                                </ContentItem2>
                                <ContentItem2 title="Bad IPs">
                                    <BadIpsBlock />
                                </ContentItem2>
                                <ContentItem2 title="Bad ASNs">
                                    <BadAsnsBlock />
                                </ContentItem2>
                                <ContentItem2 title="Good IPs">
                                    <GoodIpsBlock />
                                </ContentItem2>
                            </div>
                        </div>
                    </AdminMenu>
                ) : (
                    <NoPermissions />
                )}
            </Wrapper>
        </>
    );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const session = await getServerAuthSession(ctx);

    const authed = isMod(session);

    return {
        props: {
            authed: authed
        }
    }
}