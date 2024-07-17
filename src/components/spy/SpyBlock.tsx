import Loader from "@components/Loader";
import { NotiCtx } from "@pages/_app";
import { Spy } from "@prisma/client";
import { api } from "@utils/api";
import Link from "next/link";
import { useContext, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";

export default function SpyBlock({
    limit = 10
} : {
    limit?: number
}) {
    const [needMore, setNeedMore] = useState(true);

    const { data, fetchNextPage } = api.spy.allSpies.useInfiniteQuery({
        limit: limit
    }, {
        getNextPageParam: (lastPage) => lastPage.nextSpy
    });

    const loadMore = () => {
        void (async () => {
            await fetchNextPage();
        })()
    }

    const spies: Spy[] = [];

    if (data) {
        data.pages.map((pg) => {
            spies.push(...pg.spies);

            if (!pg.nextSpy && needMore)
                    setNeedMore(false);
        })
    }

    const spiesLoading = !data || spies.length > 0;

    return (
        <div className="flex flex-col gap-2">
            <div className="p-2 rounded-lg bg-shade-2/70 h-72 overflow-y-auto">
                {spiesLoading ? (
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={loadMore}
                        loader={<Loader key="loader" />}
                        hasMore={needMore}
                    >
                        <table className="table table-auto w-full">
                            <thead>
                                <tr className="text-left">
                                    <th>Host</th>
                                    <th>Verbose</th>
                                    <th>VMS Enabled</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {spies.map((spy, idx) => {
                                    return (
                                        <Row
                                            key={`spy-${idx.toString()}`}
                                            spy={spy}
                                        />
                                    )
                                })}
                            </tbody>
                        </table>
                    </InfiniteScroll>
                ) : (
                    <p>No spies found. Click below to add!</p>
                )}
            </div>
            <div className="flex justify-center">
                <Link
                    href="/admin/spy/spy/add"
                    className="button button-primary"
                >Add Spy!</Link>
            </div>
        </div>
    )
}

function Row({
    spy
} : {
    spy: Spy
}) {
    const notiCtx = useContext(NotiCtx);

    const editLink = `/admin/spy/spy/edit/${spy.id.toString()}`;
    const deleteMut = api.spy.deleteSpy.useMutation({
        onError: (opts) => {
            const { message } = opts;

            notiCtx?.addNoti({
                type: "Error",
                title: `Failed To Delete Spy Instance '${spy.host}'`,
                msg: `Failed to delete Spy instance '${spy.host}' due to error. Error: ${message}`
            })
        },
        onSuccess: () => {
            notiCtx?.addNoti({
                type: "Success",
                title: `Deleted Spy Instance '${spy.host}'!`,
                msg: `Successfully deleted Spy instance '${spy.host}'!`
            })
        }
    });

    return (
        <tr>
            <td>{spy.host}</td>
            <td>{spy.verbose.toString()}</td>
            <td>{spy.vmsEnabled ? "Yes" : "No"}</td>
            <td>
                <div className="flex flex-wrap gap-2">
                    <Link
                        href={editLink}
                        className="button button-primary"
                    >Edit</Link>
                    <button
                        onClick={() => {
                            const yes = confirm("Are you sure you want to delete this Spy instance?");

                            if (yes) {
                                deleteMut.mutate({
                                    id: spy.id
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