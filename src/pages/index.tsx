import Wrapper from "@components/Wrapper";

import ServerBrowser from "@components/servers/Browser";

export default function Index() {
    return (
        <Wrapper>
            <ServerBrowser table={true} />
        </Wrapper>
    );
}