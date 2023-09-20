import { useSession } from "next-auth/react";
import { type GetServerSidePropsContext } from "next";

import { getServerAuthSession } from "@server/auth";

import Wrapper from "@components/Wrapper";
import NoPermissions from "@components/statements/NoPermissions";

import { isAdmin } from "@utils/auth";
import { type ServerWithRelations } from "~/types/Server";
import { prisma } from "@server/db";
import { UserPublicSelect } from "~/types/User";

export default function({
    server
} : {
    server?: ServerWithRelations
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
    let server: ServerWithRelations | null = null;

    const { params } = ctx;
    const id = params?.id?.toString();

    const session = await getServerAuthSession(ctx);

    if (isAdmin(session) && id) {
        server = await prisma.server.findFirst({
            include: {
                user: {
                    select: UserPublicSelect
                },
                platform: true,
                category: true
            },
            where: {
                id: Number(id)
            }
        });
    }

    return {
        props: {
            server: server
        }
    }
}