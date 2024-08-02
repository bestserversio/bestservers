import Loader from "@components/Loader";
import { type GoodIp } from "@prisma/client";
import { api } from "@utils/api";
import { useContext, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import GoodIpForm from "./forms/GoodIp";
import { NotiCtx } from "@pages/_app";

export default function GoodIpsBlock ({
    limit = 10
} : {
    limit?: number
}) {
    const [needMore, setNeedMore] = useState(true);

    const { data, fetchNextPage } = api.spy.allGoodIps.useInfiniteQuery({
        limit: limit
    }, {
        getNextPageParam: (lastPage) => lastPage.nextGoodIp
    });

    const loadMore = () => {
        void (async () => {
            await fetchNextPage();
        })()
    }

    const goodIps: GoodIp[] = [];

    if (data) {
        data.pages.map((pg) => {
            goodIps.push(...pg.goodIps);

            if (!pg.nextGoodIp && needMore)
                    setNeedMore(false);
        })
    }

    const goodIpsLoading = !data || goodIps.length > 0;

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="p-2 rounded-lg bg-shade-2/70 h-72 overflow-y-auto">
                {goodIpsLoading ? (
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
                                {goodIps.map((goodIp, idx) => {
                                    return (
                                        <Row
                                            key={`goodIp-${idx.toString()}`}
                                            goodIp={goodIp}
                                        />
                                    )
                                })}
                            </tbody>
                        </table>
                    </InfiniteScroll>
                ) : (
                    <p>No good IPs found.</p>
                )}
            </div>
            <GoodIpForm />
        </div>
    )
}

function Row({
    goodIp
} : {
    goodIp: GoodIp
}) {
    const notiCtx = useContext(NotiCtx);

    const [editMode, setEditMode] = useState(false);
    const [newIp, setNewIp] = useState(`${goodIp.ip}/${goodIp.cidr.toString()}`);

    const editMut = api.spy.addOrUpdateGoodIp.useMutation({
        onError: (opts) => {
            const { message } = opts;

            notiCtx?.addNoti({
                type: "Error",
                title: `Failed To Modify Good IP '${goodIp.ip}/${goodIp.cidr.toString()}'`,
                msg: `Failed to edit modify IP '${goodIp.ip}/${goodIp.cidr.toString()}'. Error: ${message}`
            })
        },
        onSuccess: () => {
            notiCtx?.addNoti({
                type: "Success",
                title: `Modifed Good IP '${goodIp.ip}/${goodIp.cidr.toString()}'!`,
                msg: `Successfully modified good IP '${goodIp.ip}/${goodIp.cidr.toString()}'`
            })
        }
    });
    const deleteMut = api.spy.deleteGoodIp.useMutation({
        onError: (opts) => {
            const { message } = opts;

            notiCtx?.addNoti({
                type: "Error",
                title: `Failed To Delete Good IP '${goodIp.ip}/${goodIp.cidr.toString()}'`,
                msg: `Failed to delete good IP '${goodIp.ip}/${goodIp.cidr.toString()}'. Error: ${message}`
            })
        },
        onSuccess: () => {
            notiCtx?.addNoti({
                type: "Success",
                title: `Deleted Good IP '${goodIp.ip}/${goodIp.cidr.toString()}'!`,
                msg: `Successfully deleted good IP '${goodIp.ip}/${goodIp.cidr.toString()}'`
            })
        }
    });

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
                    <span>{goodIp.ip}/{goodIp.cidr.toString()}</span>
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
                                    id: goodIp.id,
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
                            const yes = confirm("Are you sure you want to delete this Good IP?");

                            if (yes) {
                                deleteMut.mutate({
                                    id: goodIp.id
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