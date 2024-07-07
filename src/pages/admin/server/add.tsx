import { useSession } from "next-auth/react";
import { type GetServerSidePropsContext } from "next";

import { getServerAuthSession } from "@server/auth";

import Wrapper from "@components/Wrapper";
import NoPermissions from "@components/statements/NoPermissions";

import { isAdmin } from "@utils/auth";
import Meta from "@components/Meta";
import ServerQuickForm from "@components/servers/forms/Quick";

export default function Page () {
    const { data: session } = useSession();

    return (
        <>
            <Meta

            />
            <Wrapper>
                {isAdmin(session) ? (
                    <>
                        <h1>Add Server</h1>
                        <ServerQuickForm />
                    </>
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