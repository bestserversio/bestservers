import Meta from "@components/Meta";
import Wrapper from "@components/Wrapper";
import ServerView from "@components/servers/View";
import NotFound from "@components/statements/NotFound";
import { prisma } from "@server/db";
import { GetServerSidePropsContext } from "next";
import { ServerPublic, ServerPublicSelect } from "~/types/Server";

export default function Page ({
    server
} : {
    server?: ServerPublic
}) {
    return (
        <>
            <Meta
            
            />
            <Wrapper>
                {server ? (
                    <ServerView
                        server={server}
                        view="rules"
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
            server = await prisma.server.findFirst({
                select: ServerPublicSelect,
                where: {
                    ip: ip,
                    port: port
                }
            });
        }
    }
    
    return {
        props: {
            server: JSON.parse(JSON.stringify(server))
        }
    }
}