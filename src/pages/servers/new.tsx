import Meta from "@components/Meta";
import Wrapper from "@components/Wrapper";
import ServerQuickForm from "@components/servers/forms/Quick";
import NoPermissions from "@components/statements/NoPermissions";
import { useSession } from "next-auth/react";

export default function Page() {
    const { data: session } = useSession();

    return (
        <>
            <Meta
                title="Add Server - Best Servers"
                contentTitle="Add Server"
                description="Add a game or Discord server to our server browser!"
            />

            <Wrapper>
                {session?.user ? (
                    <div>
                        <ServerQuickForm />
                    </div>
                ) : (
                    <NoPermissions />
                )}
            </Wrapper>
        </>
    );
}