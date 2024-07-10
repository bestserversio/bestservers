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

            />
            <Wrapper>
                {authed ? (
                    <>
                        {platform ? (
                            <>
                                <h1>Edit Platform {platform.name}</h1>
                                <div className="bg-shade-1/70 p-2 rounded-sm">
                                    <PlatformForm platform={platform} />
                                </div>
                            </>
                        ) : (
                            <NotFound item="platform" />
                        )}
                    </>
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