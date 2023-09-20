import { useSession } from "next-auth/react";
import { type GetServerSidePropsContext } from "next";

import { getServerAuthSession } from "@server/auth";

import Wrapper from "@components/Wrapper";
import NoPermissions from "@components/statements/NoPermissions";

import { isAdmin } from "@utils/auth";
import { Platform } from "@prisma/client";
import { prisma } from "@server/db";

export default function({
    platform
} : {
    platform?: Platform
}) {
    const { data: session } = useSession();

    return (
        <>
            {isAdmin(session) ? (
                <Wrapper>

                </Wrapper>
            ) : (
                <NoPermissions />
            )}
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