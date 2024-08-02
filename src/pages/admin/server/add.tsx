import { type GetServerSidePropsContext } from "next";

import { getServerAuthSession } from "@server/auth";

import Wrapper from "@components/Wrapper";
import NoPermissions from "@components/statements/NoPermissions";

import { isMod } from "@utils/auth";
import Meta from "@components/Meta";
import ServerQuickForm from "@components/servers/forms/Quick";
import AdminMenu from "@components/admin/Menu";
import { ContentItem2 } from "@components/Content";

export default function Page ({
    authed    
} : {
    authed: boolean
}) {
    return (
        <>
            <Meta
                title={`${authed ? `Admin - Add Server` : "No Permission"} - Best Servers`}
            />
            <Wrapper>
                {authed ? (
                    <AdminMenu current="servers">
                        <ContentItem2 title="Add Server!">
                            <ServerQuickForm />
                        </ContentItem2>
                    </AdminMenu>
                ) : (
                    <NoPermissions />
                )}
            </Wrapper>
        </>
    );
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