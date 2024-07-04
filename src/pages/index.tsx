import Wrapper from "@components/Wrapper";

import ServerBrowser from "@components/servers/Browser";
import { prisma } from "@server/db";

export default function Index({
    totalServers = 0
} : {
    totalServers?: number
}) {
    return (
        <Wrapper>
            <div className="flex flex-col gap-2">
                <div className="flex justify-center">
                    <h2>Tracking <span className="font-bold text-shade-9">{totalServers.toString()}</span> Servers!</h2>
                </div>
                <ServerBrowser table={true} />
            </div>
        </Wrapper>
    );
}

export async function getServerSideProps() {
    const totalServers = await prisma.server.count();

    return {
        props: {
            totalServers: totalServers
        }
    }
}