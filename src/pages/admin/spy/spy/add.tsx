import { type GetServerSidePropsContext } from "next";

import { getServerAuthSession } from "@server/auth";

import Wrapper from "@components/Wrapper";
import NoPermissions from "@components/statements/NoPermissions";

import { isAdmin } from "@utils/auth";
import Meta from "@components/Meta";
import AdminMenu from "@components/admin/Menu";
import SpyForm from "@components/spy/forms/Spy";
import { ApiKey, Platform, SpyScanner } from "@prisma/client";
import { prisma } from "@server/db";

export default function Page ({
    authed,
    apiKeys,
    platforms,
    scanners
} : {
    authed: boolean
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
                        <h1>Add Spy Instance!</h1>
                        <SpyForm
                            apiKeys={apiKeys}
                            platforms={platforms}
                            scanners={scanners}
                        />
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
    let platforms: Platform[] = [];
    let scanners: SpyScanner[] = [];

    if (authed) {
        apiKeys = await prisma.apiKey.findMany();
        platforms = await prisma.platform.findMany();
        scanners = await prisma.spyScanner.findMany();
    }

    return {
        props: {
            authed: authed,
            apiKeys: apiKeys,
            platforms: platforms,
            scanners: scanners
        }
    }
}