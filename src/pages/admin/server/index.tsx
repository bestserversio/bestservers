import { type GetServerSidePropsContext } from "next";

import { getServerAuthSession } from "@server/auth";

import Wrapper from "@components/Wrapper";
import NoPermissions from "@components/statements/NoPermissions";

import { isAdmin, isMod } from "@utils/auth";
import Meta from "@components/Meta";
import AdminMenu from "@components/admin/Menu";

export default function Page ({
    authed    
} : {
    authed: boolean
}) {
    return (
        <>
            <Meta
                title={`${authed ? `Admin - Servers` : "No Permission"} - Best Servers`}
            />
            <Wrapper>
                {authed ? (
                    <AdminMenu current="servers">
                        <p>Placeholder.</p>
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