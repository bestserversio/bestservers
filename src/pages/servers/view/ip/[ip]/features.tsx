import Meta from "@components/Meta";
import Wrapper from "@components/Wrapper";
import ServerView from "@components/servers/View";
import NotFound from "@components/statements/NotFound";
import { getServerAuthSession } from "@server/auth";
import { prisma } from "@server/db";
import { isAdmin } from "@utils/auth";
import { type GetServerSidePropsContext } from "next";
import { type ServerPublic, ServerPublicSelect } from "~/types/Server";

export default function Page ({
    server
} : {
    server?: ServerPublic
}) {
    return (
        <>
            <Meta
                title={`${server ? `${server.name ?? "N/A"} (${server.ip ?? "N/A"}:${server.port?.toString() ?? "N/A"})` : "Not Found"} - Best Servers`}
                description={server?.descriptionShort ? server.descriptionShort : undefined}
            />
            <Wrapper>
                {server ? (
                    <ServerView
                        server={server}
                        view="features"
                    />
                ) : (
                    <NotFound item="server" />
                )}
            </Wrapper>
        </>
    );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    let server: ServerPublic | null = null;

    const { params } = ctx;

    const paramStr = params?.ip?.toString();

    let ip: string | undefined = undefined;
    let port: number | undefined = undefined;

    if (paramStr) {
        const split = paramStr.split(":");

        if (split[0])
            ip = split[0];

        if (split[1])
            port = Number(split[1]);

        if (ip && port) {
            // Check if we're an admin or moderator.
            const session = await getServerAuthSession(ctx);
            const mod = isAdmin(session);

            server = await prisma.server.findFirst({
                select: ServerPublicSelect,
                where: {
                    ip: ip,
                    port: port,
                    ...(!mod && {
                        visible: true
                    })
                }
            });
        }
    }
    
    return {
        props: {
            server: JSON.parse(JSON.stringify(server)) as ServerPublic
        }
    }
}