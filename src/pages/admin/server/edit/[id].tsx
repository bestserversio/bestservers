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
import AdminMenu from "@components/admin/Menu";
import { type Platform } from "@prisma/client";
import { type CategoryWithChildren } from "~/types/Category";
import { ContentItem2 } from "@components/Content";

export default function Page ({
    server,
    authed,
    platforms,
    categories
} : {
    server?: ServerWithRelations
    authed: boolean
    platforms: Platform[]
    categories: CategoryWithChildren[]
}) {
    return (
        <>
            <Meta
            
            />
            <Wrapper>
                {authed ? (
                    <AdminMenu current="servers">
                        {server ? (
                            <ContentItem2 title={`Editing Server - ${server.name} (${server.ip ?? "N/A"}:${server.port?.toString() ?? "N/A"})`}>
                                <ServerForm
                                    platforms={platforms}
                                    categories={categories}
                                    server={server}
                                />
                            </ContentItem2>
                        ) : (
                            <NotFound item="server" />
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
    let server: ServerWithRelations | null = null;

    const { params } = ctx;
    const id = params?.id?.toString();

    const session = await getServerAuthSession(ctx);
    const authed = isAdmin(session);

    let platforms: Platform[] = [];
    let categories: CategoryWithChildren[] = [];

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

        platforms = await prisma.platform.findMany();
        categories = await prisma.category.findMany({
            where: {
                parent: null
            },
            include: {
                children: true
            }
        });
    }

    return {
        props: {
            authed: authed,
            server: JSON.parse(JSON.stringify(server)) as ServerWithRelations,
            platforms: platforms,
            categories: categories
        }
    }
}