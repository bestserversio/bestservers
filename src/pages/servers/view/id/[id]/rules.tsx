import Meta from "@components/Meta";
import Wrapper from "@components/Wrapper";
import ServerView from "@components/servers/View";
import NotFound from "@components/statements/NotFound";
import { prisma } from "@server/db";
import { type GetServerSidePropsContext } from "next";
import { type ServerPublic, ServerPublicSelect } from "~/types/Server";

export default function Page({
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

    const id = params?.id?.toString();

    if (id) {
        server = await prisma.server.findFirst({
            select: ServerPublicSelect,
            where: {
                id: Number(id)
            }
        });
    }
    
    return {
        props: {
            server: JSON.parse(JSON.stringify(server)) as ServerPublic
        }
    }
}