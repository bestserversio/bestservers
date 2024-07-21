import { ContentItem1 } from "@components/Content";

export default function StatsBlock({
    servers,
    serversOnline,
    platforms,
    categories,
    users
} : {
    servers?: number
    serversOnline?: number
    platforms?: number
    categories?: number
    users?: number
}) {
    return (
        <ContentItem1 title="Stats">
            <table className="table table-auto">
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {servers && (
                        <Row
                            title="Total Servers"
                            cnt={servers}
                        />
                    )}
                    {serversOnline && (
                        <Row
                            title="Online Servers"
                            cnt={serversOnline}
                        />
                    )}
                    {platforms && (
                        <Row
                            title="Platforms"
                            cnt={platforms}
                        />
                    )}
                    {categories && (
                        <Row
                            title="Categories"
                            cnt={categories}
                        />
                    )}
                    {users && (
                        <Row
                            title="Users"
                            cnt={users}
                        />
                    )}
                </tbody>
            </table>
        </ContentItem1>
    )
}

function Row({
    title,
    cnt
} : {
    title: JSX.Element | string
    cnt: number
}) {
    return (
        <tr>
            <td className="text-white font-bold pr-4">{title}</td>
            <td>{cnt.toString()}</td>
        </tr>
    )
}