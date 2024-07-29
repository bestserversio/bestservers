import { type GetServerSidePropsContext } from "next";

import { getServerAuthSession } from "@server/auth";

import Wrapper from "@components/Wrapper";
import NoPermissions from "@components/statements/NoPermissions";

import { isAdmin, isMod } from "@utils/auth";
import Meta from "@components/Meta";
import AdminMenu from "@components/admin/Menu";
import { ContentItem2 } from "@components/Content";
import ServerRemoveInactive from "@components/servers/forms/RemoveInactive";
import { useSession } from "next-auth/react";

export default function Page ({
    authed    
} : {
    authed: boolean
}) {
    const { data: session } = useSession();
    const isA = isAdmin(session);

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
                                {isA && (
                                    <ContentItem2 title="Remove Inactive Servers">
                                        <ServerRemoveInactive />
                                    </ContentItem2>
                                )}
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

    const authed = isMod(session);

    return {
        props: {
            authed: authed
        }
    }
}