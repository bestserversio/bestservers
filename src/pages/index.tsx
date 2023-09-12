import Wrapper from "@components/Wrapper";

import SearchAndFilters from "@components/SearchAndFilters";
import ServerBrowser from "@components/servers/Browser";

export default function Index() {
    return (
        <Wrapper>
            <SearchAndFilters />
            
            <ServerBrowser />
        </Wrapper>
    );
}