import { type GetServerSidePropsContext } from "next";

import { getServerAuthSession } from "@server/auth";

import Wrapper from "@components/Wrapper";
import NoPermissions from "@components/statements/NoPermissions";

import { isAdmin } from "@utils/auth";
import Meta from "@components/Meta";
import AdminMenu from "@components/admin/Menu";
import { ApiKey, Platform, SpyScanner, type Spy } from "@prisma/client";
import { prisma } from "@server/db";
import NotFound from "@components/statements/NotFound";
import SpyForm from "@components/spy/forms/Spy";
import { SpyWithRelations } from "~/types/Spy";

export default function Page ({
    authed,
    spy,
    apiKeys,
    platforms,
    scanners
} : {
    authed: boolean
    spy?: SpyWithRelations
    apiKeys: ApiKey[]
    platforms: Platform[]
    scanners: SpyScanner[]
}) {
    return (
        <>
            <Meta

            />
            <Wrapper>
                {authed ? (
                    <AdminMenu current="spy">
                        {spy ? (
                            <>
                                <h1>Editing Spy Instance - {spy.host}</h1>
                                <SpyForm
                                    spy={spy}
                                    apiKeys={apiKeys}
                                    platforms={platforms}
                                    scanners={scanners}
                                />
                            </>
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
    let platforms: Platform[] = [];
    let scanners: SpyScanner[] = [];

    if (authed && id) {
        spy = await prisma.spy.findFirst({
            where: {
                id: Number(id)
            },
            include: {
                scanners: true,
                vmsPlatforms: true
            }
        })

        apiKeys = await prisma.apiKey.findMany();
        platforms = await prisma.platform.findMany();
        scanners = await prisma.spyScanner.findMany();
    }

    return {
        props: {
            authed: authed,
            spy: spy,
            apiKeys: apiKeys,
            platforms: platforms,
            scanners: scanners
        }
    }
}