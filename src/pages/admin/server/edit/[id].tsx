import { useSession } from "next-auth/react";
import { type GetServerSidePropsContext } from "next";

import { getServerAuthSession } from "@server/auth";

import Wrapper from "@components/Wrapper";
import NoPermissions from "@components/statements/NoPermissions";

import { isAdmin } from "@utils/auth";
import { type ServerWithRelations } from "~/types/Server";
import { prisma } from "@server/db";
import { UserPublicSelect } from "~/types/User";
import NotFound from "@components/statements/NotFound";
import ServerForm from "@components/servers/forms/Main";
import Meta from "@components/Meta";

export default function({
    server
} : {
    server?: ServerWithRelations
}) {
    const { data: session } = useSession();

    return (
        <>
            <Meta
            
            />
            <Wrapper>
                {isAdmin(session) ? (
                    <>
                        {server ? (
                            <>
                                <h1>Edit Server {server.name}</h1>
                                <ServerForm server={server} />
                            </>
                        ) : (
                            <NotFound item="server" />
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
                category: {
                    include: {
                        parent: true
                    }
                }
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