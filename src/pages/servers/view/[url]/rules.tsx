import Meta from "@components/Meta";
import Wrapper from "@components/Wrapper";
import ServerView from "@components/servers/View";
import NotFound from "@components/statements/NotFound";
import { getServerAuthSession } from "@server/auth";
import { prisma } from "@server/db";
import { isAdmin } from "@utils/auth";
import { GetServerMetaTitle } from "@utils/servers/content";
import { type GetServerSidePropsContext } from "next";

import { ServerPublicSelect, type ServerPublic } from "~/types/Server";

export default function Page({
    server
} : {
    server?: ServerPublic
}) {
    return (
        <>
            <Meta
                title={GetServerMetaTitle({ server: server })}
                description={server?.descriptionShort ? server.descriptionShort : undefined}
            />
            <Wrapper>
                <div>
                    {server ? (
                        <ServerView
                            server={server}
                            view="rules"
                        />
                    ) : (
                        <NotFound item="server" />
                    )}
                </div>
            </Wrapper>
        </>
    );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    let server: ServerPublic | null = null;

    const { params } = ctx;

    const url = params?.url?.toString();

    // Check if we're an admin or moderator.
    const session = await getServerAuthSession(ctx);
    const mod = isAdmin(session);

    if (url) {
        server = await prisma.server.findFirst({
            select: ServerPublicSelect,
            where: {
                url: url,
                ...(!mod && {
                    visible: true
                })
            }
        });
    }

    return {
        props: {
            server: JSON.parse(JSON.stringify(server)) as ServerPublic
        }
    }
}