import { type GetServerSidePropsContext } from "next";

import { getServerAuthSession } from "@server/auth";

import Wrapper from "@components/Wrapper";
import NoPermissions from "@components/statements/NoPermissions";

import { isAdmin } from "@utils/auth";
import { type Platform } from "@prisma/client";
import { prisma } from "@server/db";
import PlatformForm from "@components/platforms/forms/Main";
import NotFound from "@components/statements/NotFound";
import Meta from "@components/Meta";
import AdminMenu from "@components/admin/Menu";
import { ContentItem2 } from "@components/Content";

export default function Page ({
    platform,
    authed
} : {
    platform?: Platform
    authed: boolean
}) {
    return (
        <>
            <Meta
                title={`${authed ? `Admin - Editing Platform ${platform?.name ?? "N/A"}` : "No Permission"} - Best Servers`}
            />
            <Wrapper>
                {authed ? (
                    <AdminMenu current="platforms">
                        {platform ? (
                            <ContentItem2 title={`Editing Platforming - ${platform.name}`}>
                                <PlatformForm platform={platform} />
                            </ContentItem2>
                        ) : (
                            <NotFound item="platform" />
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
    let platform: Platform | null = null;

    const { params } = ctx;
    const id = params?.id?.toString();

    const session = await getServerAuthSession(ctx);
    const authed = isAdmin(session);

    if (authed && id) {
        platform = await prisma.platform.findFirst({
            where: {
                id: Number(id)
            }
        });
    }

    return {
        props: {
            platform: platform,
            authed: authed
        }
    }
}