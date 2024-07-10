import { type GetServerSidePropsContext } from "next";

import { getServerAuthSession } from "@server/auth";

import Wrapper from "@components/Wrapper";
import NoPermissions from "@components/statements/NoPermissions";

import { isAdmin } from "@utils/auth";
import Meta from "@components/Meta";
import ServerQuickForm from "@components/servers/forms/Quick";

export default function Page ({
    authed    
} : {
    authed: boolean
}) {
    return (
        <>
            <Meta

            />
            <Wrapper>
                {authed ? (
                    <>
                        <h1>Add Server</h1>
                        <div className="bg-shade-1/70 p-4 rounded-sm">
                            <ServerQuickForm />
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