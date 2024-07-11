import { ContentItem1 } from "@components/Content";
import Wrapper from "@components/Wrapper";
import AdminMenu from "@components/admin/Menu";
import ApiKeyForm from "@components/api/keys/forms/KeyForm";
import NoPermissions from "@components/statements/NoPermissions";
import { type ApiKey } from "@prisma/client";
import { getServerAuthSession } from "@server/auth";
import { isAdmin } from "@utils/auth";
import { type GetServerSidePropsContext } from "next";

export default function Page({
    authed
} : {
    authed: boolean
}) {
    return (
        <Wrapper>
            {authed ? (
                <AdminMenu current="api">
                    <h1>Add API Key</h1>
                    <ApiKeyForm />
                </AdminMenu>
            ) : (
                <NoPermissions />
            )}
        </Wrapper>
    )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const session = await getServerAuthSession(ctx);
    const authed = isAdmin(session);

    return {
        props: {
            authed: authed
        }
    }
}