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

export default function Page ({
    server,
    authed
} : {
    server?: ServerWithRelations
    authed: boolean
}) {
    return (
        <>
            <Meta
            
            />
            <Wrapper>
                {authed ? (
                    <>
                        {server ? (
                            <div className="flex flex-col gap-2">
                                <h1>Edit Server {server.name}</h1>
                                <div className="bg-shade-1/70 p-4 rounded-sm">
                                    <ServerForm server={server} />
                                </div>
                            </div>
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
    const authed = isAdmin(session);

    if (authed && id) {
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
            authed: authed,
            server: JSON.parse(JSON.stringify(server)) as ServerWithRelations
        }
    }
}