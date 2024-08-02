import Loader from "@components/Loader";
import { NotiCtx } from "@pages/_app";
import { type SpyVms } from "@prisma/client";
import { api } from "@utils/api";
import Link from "next/link";
import { useContext, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";

export default function VmsBlock({
    limit = 10
} : {
    limit?: number
}) {
    const [needMore, setNeedMore] = useState(true);

    const { data, fetchNextPage } = api.spy.allVms.useInfiniteQuery({
        limit: limit
    }, {
        getNextPageParam: (lastPage) => lastPage.nextVms
    });

    const loadMore = () => {
        void (async () => {
            await fetchNextPage();
        })()
    }

    const vms: SpyVms[] = [];

    if (data) {
        data.pages.map((pg) => {
            vms.push(...pg.vms);

            if (!pg.nextVms && needMore)
                setNeedMore(false);
        })
    }

    const vmsLoading = !data || vms.length > 0;

    return (
        <div className="flex flex-col gap-2">
            <div className="p-2 rounded-lg bg-shade-2/70 h-72 overflow-y-auto">
                {vmsLoading ? (
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={loadMore}
                        loader={<Loader key="loader" />}
                        hasMore={needMore}
                    >
                        <table className="table table-auto w-full">
                            <thead>
                                <tr className="text-left">
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vms.map((vms, idx) => {
                                    return (
                                        <Row
                                            key={`vms-${idx.toString()}`}
                                            vms={vms}
                                        />
                                    )
                                })}
                            </tbody>
                        </table>
                    </InfiniteScroll>
                ) : (
                    <p>No VMS found. Click below to add!</p>
                )}
            </div>
            <div className="flex justify-center">
                <Link
                    href="/admin/spy/vms/add"
                    className="button button-primary"
                >Add VMS!</Link>
            </div>
        </div>
    )
}

function Row({
    vms
} : {
    vms: SpyVms
}) {
    const notiCtx = useContext(NotiCtx);

    const editLink = `/admin/spy/vms/edit/${vms.id.toString()}`;
    const deleteMut = api.spy.deleteVms.useMutation({
        onError: (opts) => {
            const { message } = opts;

            notiCtx?.addNoti({
                type: "Error",
                title: `Failed To Delete VMS '${vms?.name ?? "N/A"}' (${vms.id.toString()})`,
                msg: `Failed to delete VMS '${vms?.name ?? "N/A"}' due to error. Error: ${message}`
            })
        },
        onSuccess: () => {
            notiCtx?.addNoti({
                type: "Success",
                title: `Deleted Scanner '${vms?.name ?? "N/A"}' (${vms.id.toString()})!`,
                msg: `Successfully deleted scanner '${vms?.name ?? "N/A"}'!`
            })
        }
    });

    return (
        <tr>
            <td>{vms.id.toString()}</td>
            <td>{vms?.name ?? "N/A"}</td>
            <td>
                <div className="flex flex-wrap gap-2">
                    <Link
                        href={editLink}
                        className="button button-primary"
                    >Edit</Link>
                    <button
                        onClick={() => {
                            const yes = confirm("Are you sure you want to delete this Spy VMS?");

                            if (yes) {
                                deleteMut.mutate({
                                    id: vms.id
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