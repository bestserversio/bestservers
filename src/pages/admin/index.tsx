import { type GetServerSidePropsContext } from "next";

import { getServerAuthSession } from "@server/auth";

import Wrapper from "@components/Wrapper";
import NoPermissions from "@components/statements/NoPermissions";

import { isAdmin } from "@utils/auth";
import Meta from "@components/Meta";
import AdminMenu from "@components/admin/Menu";
import { ContentItem2 } from "@components/Content";
import ServerRemoveInactive from "@components/servers/forms/RemoveInactive";

export default function Page ({
    authed    
} : {
    authed: boolean
}) {
    return (
        <>
            <Meta
                title={`${authed ? "Admin" : "No Permission"} - Best Servers`}
            />
            <Wrapper>
                {authed ? (
                    <AdminMenu>
                        <div className="grid grid-cols-1 sm:grid-cols-3">
                            <div>
                                <ContentItem2 title="Remove Inactive Servers">
                                    <ServerRemoveInactive />
                                </ContentItem2>
                            </div>
                        </div>
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

    const authed = isAdmin(session);

    return {
        props: {
            authed: authed
        }
    }
}