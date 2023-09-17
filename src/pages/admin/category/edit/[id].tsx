import { useSession } from "next-auth/react";
import { type GetServerSidePropsContext } from "next";

import { getServerAuthSession } from "@server/auth";

import Wrapper from "@components/Wrapper";
import NoPermissions from "@components/statements/NoPermissions";

import { isAdmin } from "@utils/auth";

export default function() {
    const { data: session } = useSession();

    return (
        <>
            {isAdmin(session) ? (
                <Wrapper>

                </Wrapper>
            ) : (
                <NoPermissions />
            )}
        </>
    );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const session = await getServerAuthSession(ctx);

    let authed = false;

    if (isAdmin(session))
        authed = true;

    return {
        props: {

        }
    }
}