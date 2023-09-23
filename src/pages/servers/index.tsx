import Meta from "@components/Meta";
import Wrapper from "@components/Wrapper";
import ServerBrowser from "@components/servers/Browser";

export default function Page() {
    return (
        <>
            <Meta
                title="Servers - Best Servers"
                contentTitle="Servers"
            />
            <Wrapper>
                <h1>Servers</h1>
                <ServerBrowser table={true} />
            </Wrapper>
        </>
    );
}