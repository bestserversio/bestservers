import { type GetServerSidePropsContext } from "next";

import { getServerAuthSession } from "@server/auth";

import Wrapper from "@components/Wrapper";
import NoPermissions from "@components/statements/NoPermissions";

import { isAdmin } from "@utils/auth";
import PlatformForm from "@components/platforms/forms/Main";

export default function Page ({
    authed    
} : {
    authed: boolean
}) {
    return (
        <>
            <Wrapper>
                {authed ? (
                    <>
                        <h1>Add Platform</h1>
                        <div className="bg-shade-1/70 p-2 rounded-sm">
                            <PlatformForm />
                        </div>
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