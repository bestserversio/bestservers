import Meta from "@components/Meta";
import Wrapper from "@components/Wrapper";

import ServerBrowser from "@components/servers/Browser";
import { prisma } from "@server/db";

export default function Index({
    totalUsers = 0,
    totalServers = 0
} : {
    totalUsers?: number
    totalServers?: number
}) {
    return (
        <>
            <Meta
                title="Best Servers"
            />
            <Wrapper>
                <div className="flex flex-col gap-2">
                    <div className="flex justify-center py-8">
                        <h2>Tracking <span className="font-bold text-shade-9">{totalUsers.toString()}</span> Users On <span className="font-bold text-shade-9">{totalServers.toString()}</span> Servers!</h2>
                    </div>
                    <ServerBrowser table={true} />
                </div>
            </Wrapper>
        </>
    );
}

export async function getServerSideProps() {
    const totalServers = await prisma.server.count({
        where: {
            visible: true
        }
    });

    let totalUsers = 0;

    const q = await prisma.server.findMany({
        select: {
            curUsers: true
        },
        where: {
            online: true
        }
    })

    q.forEach((t) => {
        totalUsers += t.curUsers;
    })

    return {
        props: {
            totalUsers: totalUsers,
            totalServers: totalServers
        }
    }
}