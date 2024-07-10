import Wrapper from "@components/Wrapper";
import NoPermissions from "@components/statements/NoPermissions";
import NotFound from "@components/statements/NotFound";
import { type ApiKey } from "@prisma/client";
import { getServerAuthSession } from "@server/auth";
import { prisma } from "@server/db";
import { isAdmin } from "@utils/auth";
import { type GetServerSidePropsContext } from "next";

export default function Page({
    apiKey,
    authed
}  : {
    apiKey?: ApiKey
    authed: boolean
}) {
    return (
        <Wrapper>
            {authed ? (
                <>
                    {apiKey ? (
                        <>
                            <h1>API Settings & Keys</h1>
                        </>
                    ) : (
                        <NotFound item="API Key" />
                    )}
                </>
            ) : (
                <NoPermissions />
            )}
        </Wrapper>
    )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const session = await getServerAuthSession(ctx)

    const { params } = ctx;

    const id = params?.id?.toString()

    let apiKey: ApiKey | null = null;

    const authed = isAdmin(session);

    if (authed && id) {
        apiKey = await prisma.apiKey.findFirst({
            where: {
                id: Number(id)
            }
        })
    }

    return {
        props: {
            apikey: apiKey,
            authed: authed
        }
    }
}