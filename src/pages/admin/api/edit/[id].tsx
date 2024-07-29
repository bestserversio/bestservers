import { ContentItem1 } from "@components/Content";
import Meta from "@components/Meta";
import Wrapper from "@components/Wrapper";
import AdminMenu from "@components/admin/Menu";
import ApiKeyForm from "@components/api/keys/forms/KeyForm";
import NoPermissions from "@components/statements/NoPermissions";
import NotFound from "@components/statements/NotFound";
import { type ApiKey } from "@prisma/client";
import { getServerAuthSession } from "@server/auth";
import { prisma } from "@server/db";
import { isAdmin, isMod } from "@utils/auth";
import { type GetServerSidePropsContext } from "next";
import { useSession } from "next-auth/react";

export default function Page({
    apiKey,
    authed
}  : {
    apiKey?: ApiKey
    authed: boolean
}) {
    const { data: session } = useSession();
    const isA = isAdmin(session);

    return (
        <>
            <Meta
                title={`${authed ? `Admin - Editing API Key ${apiKey?.id.toString() ?? "N/A"}` : "No Permission"} - Best Servers`}
            />
            <Wrapper>
                {authed ? (
                    <AdminMenu current="api">
                        {isA ? (
                            <>
                                {apiKey ? (
                                    <ContentItem1 title={`Editing API Key - #${apiKey.id.toString()}`}>
                                        <ApiKeyForm apiKey={apiKey} />
                                    </ContentItem1>
                                ) : (
                                    <NotFound item="API Key" />
                                )}
                            </>
                        ) : (
                            <p>Only admins can access this page.</p>
                        )}
                    </AdminMenu>
                ) : (
                    <NoPermissions />
                )}
            </Wrapper>
        </>
    )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const session = await getServerAuthSession(ctx)

    const { params } = ctx;

    const id = params?.id?.toString()

    let apiKey: ApiKey | null = null;

    const authed = isMod(session);

    if (authed && id) {
        apiKey = await prisma.apiKey.findFirst({
            where: {
                id: Number(id)
            }
        })
    }

    return {
        props: {
            apiKey: apiKey,
            authed: authed
        }
    }
}