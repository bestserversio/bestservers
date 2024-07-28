import { ContentItem1, ContentItem2 } from "@components/Content";
import Meta from "@components/Meta";
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
        <>
            <Meta
                title={`${authed ? `Admin - Add API Key` : "No Permission"} - Best Servers`}
            />
            <Wrapper>
                {authed ? (
                    <AdminMenu current="api">
                        <ContentItem2 title="Add API Key!">
                            <ApiKeyForm />
                        </ContentItem2>
                    </AdminMenu>
                ) : (
                    <NoPermissions />
                )}
            </Wrapper>
        </>
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