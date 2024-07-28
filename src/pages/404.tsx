import Meta from "@components/Meta";
import NotFound from "@components/statements/NotFound";
import Wrapper from "@components/Wrapper";

export default function Page() {
    return (
        <>
            <Meta
                title="Not Found - Best Mods"
            />

            <Wrapper>
                <NotFound item="page" />
            </Wrapper>
        </>
    )
}