import { type GetServerSidePropsContext } from "next";

import { getServerAuthSession } from "@server/auth";

import Wrapper from "@components/Wrapper";
import NoPermissions from "@components/statements/NoPermissions";

import { isAdmin } from "@utils/auth";
import Meta from "@components/Meta";
import AdminMenu from "@components/admin/Menu";
import { type ApiKey, type Platform, type SpyScanner, type SpyVms } from "@prisma/client";
import { prisma } from "@server/db";
import NotFound from "@components/statements/NotFound";
import SpyForm from "@components/spy/forms/Spy";
import { type SpyWithRelations } from "~/types/Spy";
import { ContentItem2 } from "@components/Content";

export default function Page ({
    authed,
    spy,
    apiKeys,
    scanners,
    vms,
    platforms
} : {
    authed: boolean
    spy?: SpyWithRelations
    apiKeys: ApiKey[]
    scanners: SpyScanner[]
    vms: SpyVms[]
    platforms: Platform[]
}) {
    return (
        <>
            <Meta
                title={`${authed ? `Admin - Editing Spy ${spy?.id?.toString() ?? "N/A"}` : "No Permission"} - Best Servers`}
            />
            <Wrapper>
                {authed ? (
                    <AdminMenu current="spy">
                        {spy ? (
                            <ContentItem2 title={`Editing Spy Instance - ${spy.host}`}>
                                <SpyForm
                                    spy={spy}
                                    apiKeys={apiKeys}
                                    scanners={scanners}
                                    vms={vms}
                                    platforms={platforms}
                                />
                            </ContentItem2>
                        ) : (
                            <NotFound item="spy instance" />
                        )}
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

    const { params } = ctx;
    const id = params?.id?.toString();

    const authed = isAdmin(session);
    let spy: SpyWithRelations | null = null;

    let apiKeys: ApiKey[] = [];
    let scanners: SpyScanner[] = [];
    let vms: SpyVms[] = [];
    let platforms: Platform[] = [];

    if (authed && id) {
        spy = await prisma.spy.findFirst({
            where: {
                id: Number(id)
            },
            include: {
                scanners: true,
                vms: true,
                removeTimedOutPlatforms: true
            }
        })

        apiKeys = await prisma.apiKey.findMany();
        scanners = await prisma.spyScanner.findMany();
        vms = await prisma.spyVms.findMany();
        platforms = await prisma.platform.findMany();
    }

    return {
        props: {
            authed: authed,
            spy: spy,
            apiKeys: apiKeys,
            scanners: scanners,
            vms: vms,
            platforms: platforms
        }
    }
}