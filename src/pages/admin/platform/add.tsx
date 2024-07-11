import { type GetServerSidePropsContext } from "next";

import { getServerAuthSession } from "@server/auth";

import Wrapper from "@components/Wrapper";
import NoPermissions from "@components/statements/NoPermissions";

import { isAdmin } from "@utils/auth";
import PlatformForm from "@components/platforms/forms/Main";
import AdminMenu from "@components/admin/Menu";

export default function Page ({
    authed    
} : {
    authed: boolean
}) {
    return (
        <>
            <Wrapper>
                {authed ? (
                    <AdminMenu current="platforms">
                        <h1>Add Platform</h1>
                        <PlatformForm />
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