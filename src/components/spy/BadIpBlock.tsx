import Loader from "@components/Loader";
import { BadIp, BadWord } from "@prisma/client";
import { api } from "@utils/api";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import BadIpForm from "./forms/BadIp";

export default function BadIpsBlock ({
    limit = 10
} : {
    limit?: number
}) {
    const [needMore, setNeedMore] = useState(true);

    const { data, fetchNextPage } = api.spy.allBadIps.useInfiniteQuery({
        limit: limit
    }, {
        getNextPageParam: (lastPage) => lastPage.nextBadIp
    });

    const loadMore = () => {
        void (async () => {
            await fetchNextPage();
        })()
    }

    const badIps: BadIp[] = [];

    if (data) {
        data.pages.map((pg) => {
            badIps.push(...pg.badIps);

            if (!pg.nextBadIp && needMore)
                    setNeedMore(false);
        })
    }

    const badIpsLoading = !data || badIps.length > 0;

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="p-2 rounded-lg bg-shade-2/70 h-72 overflow-y-auto">
                {badIpsLoading ? (
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={loadMore}
                        loader={<Loader key="loader" />}
                        hasMore={needMore}
                    >
                        <table className="table table-auto w-full">
                            <thead>
                                <tr className="text-left">
                                    <th>IP</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {badIps.map((badIp, idx) => {
                                    return (
                                        <Row
                                            key={`badip-${idx.toString()}`}
                                            badIp={badIp}
                                        />
                                    )
                                })}
                            </tbody>
                        </table>
                    </InfiniteScroll>
                ) : (
                    <p>No bad IPs found.</p>
                )}
            </div>
            <BadIpForm />
        </div>
    )
}

function Row({
    badIp
} : {
    badIp: BadIp
}) {
    const [editMode, setEditMode] = useState(false);
    const [newIp, setNewIp] = useState(`${badIp.ip}/${badIp.cidr.toString()}`);

    const editMut = api.spy.addOrUpdateBadIp.useMutation();
    const deleteMut = api.spy.deleteBadIp.useMutation();

    return (
        <tr>
            <td>
                {editMode ? (
                    <input
                        type="text"
                        className="bg-shade-1/70 p-2 rounded text-white w-full"
                        defaultValue={newIp}
                        onChange={(e) => {
                            setNewIp(e.target.value);
                        }}
                    />
                ) : (
                    <span>{badIp.ip}/{badIp.cidr.toString()}</span>
                )}
            </td>
            <td>
                <div className="flex flex-wrap gap-2">
                    {editMode ? (
                        <button
                            onClick={() => {
                                let net = newIp;
                                let cidr = 32;

                                if (newIp.includes("/")) {
                                    const split = newIp.split("/");

                                    if (split.length == 2 && split[0] && split[1]) {
                                        net = split[0];
                                        cidr = Number(split[1]);
                                    }
                                }

                                editMut.mutate({
                                    id: badIp.id,
                                    ip: net,
                                    cidr: cidr
                                })

                                setEditMode(!editMode);
                            }}
                            className="button button-primary"
                        >Save</button>
                    ) : (
                        <button
                            onClick={() => setEditMode(!editMode)}
                            className="button button-primary"
                        >Edit</button>
                    )}
                    <button
                        onClick={() => {
                            const yes = confirm("Are you sure you want to delete this Bad IP?");

                            if (yes) {
                                deleteMut.mutate({
                                    id: badIp.id
                                })
                            }
                        }}
                        className="button button-danger"
                    >Delete</button>
                </div>
            </td>
        </tr>
    )
}