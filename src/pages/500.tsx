import Meta from "@components/Meta";
import ServerError from "@components/statements/ServerError";
import Wrapper from "@components/Wrapper";

export default function Page() {
    return (
        <>
            <Meta
                title="Server-Side Error - Best Mods"
            />
            <Wrapper>
                <ServerError />
            </Wrapper>
        </>
    )
}