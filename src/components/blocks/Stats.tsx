import { ContentItem1 } from "@components/Content";

export default function StatsBlock({
    servers = 0,
    serversOnline = 0,
    platforms = 0,
    categories = 0,
    users = 0
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
                    {servers !== undefined && (
                        <Row
                            title="Total Servers"
                            cnt={servers}
                        />
                    )}
                    {serversOnline !== undefined && (
                        <Row
                            title="Online Servers"
                            cnt={serversOnline}
                        />
                    )}
                    {platforms !== undefined && (
                        <Row
                            title="Platforms"
                            cnt={platforms}
                        />
                    )}
                    {categories !== undefined && (
                        <Row
                            title="Categories"
                            cnt={categories}
                        />
                    )}
                    {users !== undefined && (
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