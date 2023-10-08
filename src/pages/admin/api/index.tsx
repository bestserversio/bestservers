import Wrapper from "@components/Wrapper";
import NoPermissions from "@components/statements/NoPermissions";
import { isAdmin } from "@utils/auth";
import { useSession } from "next-auth/react";

export default function Page() {
    const { data: session } = useSession()

    return (
        <Wrapper>
            {isAdmin(session) ? (
                <>
                    <h1>API Settings & Keys</h1>
                </>
            ) : (
                <NoPermissions />
            )}
        </Wrapper>
    )
}