import { useSession } from "next-auth/react";
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
    platform
} : {
    platform?: Platform
}) {
    const { data: session } = useSession();

    return (
        <>
            <Meta

            />
            <Wrapper>
                {isAdmin(session) ? (
                    <>
                        {platform ? (
                            <>
                                <h1>Edit Platform {platform.name}</h1>
                                <PlatformForm platform={platform} />
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

    if (isAdmin(session) && id) {
        platform = await prisma.platform.findFirst({
            where: {
                id: Number(id)
            }
        });
    }

    return {
        props: {
            platform: platform
        }
    }
}