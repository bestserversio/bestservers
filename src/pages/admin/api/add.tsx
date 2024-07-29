import { ContentItem1, ContentItem2 } from "@components/Content";
import Meta from "@components/Meta";
import Wrapper from "@components/Wrapper";
import AdminMenu from "@components/admin/Menu";
import ApiKeyForm from "@components/api/keys/forms/KeyForm";
import NoPermissions from "@components/statements/NoPermissions";
import { getServerAuthSession } from "@server/auth";
import { isAdmin, isMod } from "@utils/auth";
import { type GetServerSidePropsContext } from "next";
import { useSession } from "next-auth/react";

export default function Page({
    authed
} : {
    authed: boolean
}) {
    const { data: session } = useSession();
    const isA = isAdmin(session);

    return (
        <>
            <Meta
                title={`${authed ? `Admin - Add API Key` : "No Permission"} - Best Servers`}
            />
            <Wrapper>
                {authed ? (
                    <AdminMenu current="api">
                        {isA ? (  
                            <ContentItem2 title="Add API Key!">
                                <ApiKeyForm />
                            </ContentItem2>
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
    const session = await getServerAuthSession(ctx);
    const authed = isMod(session);

    return {
        props: {
            authed: authed
        }
    }
}