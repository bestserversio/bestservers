import Loader from "@components/Loader";
import { type BadAsn } from "@prisma/client";
import { api } from "@utils/api";
import { useContext, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import BadAsnForm from "./forms/BadAsn";
import { NotiCtx } from "@pages/_app";

export default function BadAsnsBlock ({
    limit = 10
} : {
    limit?: number
}) {
    const [needMore, setNeedMore] = useState(true);

    const { data, fetchNextPage } = api.spy.allBadAsns.useInfiniteQuery({
        limit: limit
    }, {
        getNextPageParam: (lastPage) => lastPage.nextBadAsn
    });

    const loadMore = () => {
        void (async () => {
            await fetchNextPage();
        })()
    }

    const badAsns: BadAsn[] = [];

    if (data) {
        data.pages.map((pg) => {
            badAsns.push(...pg.badAsns);

            if (!pg.nextBadAsn && needMore)
                    setNeedMore(false);
        })
    }

    const badAsnsLoading = !data || badAsns.length > 0;

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="p-2 rounded-lg bg-shade-2/70 h-72 overflow-y-auto">
                {badAsnsLoading ? (
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={loadMore}
                        loader={<Loader key="loader" />}
                        hasMore={needMore}
                    >
                        <table className="table table-auto w-full">
                            <thead>
                                <tr className="text-left">
                                    <th>ASN</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {badAsns.map((badAsn, idx) => {
                                    return (
                                        <Row
                                            key={`badAsn-${idx.toString()}`}
                                            badAsn={badAsn}
                                        />
                                    )
                                })}
                            </tbody>
                        </table>
                    </InfiniteScroll>
                ) : (
                    <p>No bad ASNs found.</p>
                )}
            </div>
            <BadAsnForm />
        </div>
    )
}

function Row({
    badAsn
} : {
    badAsn: BadAsn
}) {
    const notiCtx = useContext(NotiCtx);
    const [editMode, setEditMode] = useState(false);
    const [newAsn, setNewAsn] = useState(badAsn.asn);

    const editMut = api.spy.addOrUpdateBadAsn.useMutation({
        onError: (opts) => {
            const { message } = opts;

            notiCtx?.addNoti({
                type: "Error",
                title: `Failed to modify bad ASN 'AS${badAsn.asn.toString()}'`,
                msg: `Failed to edit modify ASN 'AS${badAsn.asn.toString()}'. Error: ${message}`
            })
        },
        onSuccess: () => {
            notiCtx?.addNoti({
                type: "Success",
                title: `Modifed Bad ASN 'AS${badAsn.asn.toString()}'!`,
                msg: `Successfully modified bad ASN '${badAsn.asn.toString()}'`
            })
        }
    });
    const deleteMut = api.spy.deleteBadAsn.useMutation({
        onError: (opts) => {
            const { message } = opts;

            notiCtx?.addNoti({
                type: "Error",
                title: `Failed to delete bad ASN 'AS${badAsn.asn.toString()}'`,
                msg: `Failed to delete bad ASN 'AS${badAsn.asn.toString()}'. Error: ${message}`
            })
        },
        onSuccess: () => {
            notiCtx?.addNoti({
                type: "Success",
                title: `Deleted Bad ASN 'AS${badAsn.asn.toString()}'!`,
                msg: `Successfully deleted bad ASN '${badAsn.asn.toString()}'`
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
                        defaultValue={newAsn}
                        onChange={(e) => {
                            setNewAsn(Number(e.target.value));
                        }}
                    />
                ) : (
                    <span>AS{newAsn.toString()}</span>
                )}
            </td>
            <td>
                <div className="flex flex-wrap gap-2">
                    {editMode ? (
                        <button
                            onClick={() => {
                                editMut.mutate({
                                    id: badAsn.id,
                                    asn: newAsn
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
                            const yes = confirm("Are you sure you want to delete this Bad ASN?");

                            if (yes) {
                                deleteMut.mutate({
                                    id: badAsn.id
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