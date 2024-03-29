import Wrapper from "@components/Wrapper";
import NoPermissions from "@components/statements/NoPermissions";
import NotFound from "@components/statements/NotFound";
import { ApiKey } from "@prisma/client";
import { getServerAuthSession } from "@server/auth";
import { prisma } from "@server/db";
import { isAdmin } from "@utils/auth";
import { GetServerSidePropsContext } from "next";
import { useSession } from "next-auth/react";

export default function Page({
    apiKey
}  : {
    apiKey?: ApiKey
}) {
    const { data: session } = useSession()

    return (
        <Wrapper>
            {isAdmin(session) ? (
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

    if (isAdmin(session) && id) {
        apiKey = await prisma.apiKey.findFirst({
            where: {
                id: Number(id)
            }
        })
    }
}