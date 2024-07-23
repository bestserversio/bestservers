import Meta from "@components/Meta";
import NotSignedIn from "@components/statements/NotSignedIn";
import UserMenu from "@components/user/Menu";
import Wrapper from "@components/Wrapper";
import { useSession } from "next-auth/react";

export default function Page() {
    const { data: session} = useSession();

    return (
        <>
            <Meta
                title="My Account"
            />
            <Wrapper>
                {session ? (
                    <UserMenu />
                ) : (
                    <NotSignedIn />
                )}
            </Wrapper>
        </>
    )
}