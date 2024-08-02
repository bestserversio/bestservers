import { type GetServerSidePropsContext } from "next";

import { getServerAuthSession } from "@server/auth";

import Wrapper from "@components/Wrapper";
import NoPermissions from "@components/statements/NoPermissions";

import { isAdmin } from "@utils/auth";
import Meta from "@components/Meta";
import AdminMenu from "@components/admin/Menu";
import SpyForm from "@components/spy/forms/Spy";
import { type ApiKey, type Platform, type SpyScanner, type SpyVms } from "@prisma/client";
import { prisma } from "@server/db";
import { ContentItem2 } from "@components/Content";

export default function Page ({
    authed,
    apiKeys,
    scanners,
    vms,
    platforms
} : {
    authed: boolean
    apiKeys: ApiKey[]
    scanners: SpyScanner[]
    vms: SpyVms[]
    platforms: Platform[]
}) {
    return (
        <>
            <Meta
                title={`${authed ? "Admin - Spy Add" : "No Permission"} - Best Servers`}
            />
            <Wrapper>
                {authed ? (
                    <AdminMenu current="spy">
                        <ContentItem2 title="Add Spy Instance!">
                            <SpyForm
                                apiKeys={apiKeys}
                                scanners={scanners}
                                vms={vms}
                                platforms={platforms}
                            />
                        </ContentItem2>
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

    const authed = isAdmin(session);

    let apiKeys: ApiKey[] = [];
    let scanners: SpyScanner[] = [];
    let vms: SpyVms[] = []
    let platforms: Platform[] = [];

    if (authed) {
        apiKeys = await prisma.apiKey.findMany();
        scanners = await prisma.spyScanner.findMany();
        vms = await prisma.spyVms.findMany();
        platforms = await prisma.platform.findMany();
    }

    return {
        props: {
            authed: authed,
            apiKeys: apiKeys,
            scanners: scanners,
            vms: vms,
            platforms: platforms
        }
    }
}