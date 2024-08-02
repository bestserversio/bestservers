import Loader from "@components/Loader";
import { NotiCtx } from "@pages/_app";
import { type SpyScanner } from "@prisma/client";
import { api } from "@utils/api";
import Link from "next/link";
import { useContext, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";

export default function ScannerBlock({
    limit = 10
} : {
    limit?: number
}) {
    const [needMore, setNeedMore] = useState(true);

    const { data, fetchNextPage } = api.spy.allScanners.useInfiniteQuery({
        limit: limit
    }, {
        getNextPageParam: (lastPage) => lastPage.nextScanner
    });

    const loadMore = () => {
        void (async () => {
            await fetchNextPage();
        })()
    }

    const scanners: SpyScanner[] = [];

    if (data) {
        data.pages.map((pg) => {
            scanners.push(...pg.scanners);

            if (!pg.nextScanner && needMore)
                    setNeedMore(false);
        })
    }

    const scannersLoading = !data || scanners.length > 0;

    return (
        <div className="flex flex-col gap-2">
            <div className="p-2 rounded-lg bg-shade-2/70 h-72 overflow-y-auto">
                {scannersLoading ? (
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={loadMore}
                        loader={<Loader key="loader" />}
                        hasMore={needMore}
                    >
                        <table className="table table-auto w-full">
                            <thead>
                                <tr className="text-left">
                                    <th>Name</th>
                                    <th>Protocol</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scanners.map((scanner, idx) => {
                                    return (
                                        <Row
                                            key={`scanner-${idx.toString()}`}
                                            scanner={scanner}
                                        />
                                    )
                                })}
                            </tbody>
                        </table>
                    </InfiniteScroll>
                ) : (
                    <p>No scanners found. Click below to add!</p>
                )}
            </div>
            <div className="flex justify-center">
                <Link
                    href="/admin/spy/scanner/add"
                    className="button button-primary"
                >Add Scanner!</Link>
            </div>
        </div>
    )
}

function Row({
    scanner
} : {
    scanner: SpyScanner
}) {
    const notiCtx = useContext(NotiCtx);

    const editLink = `/admin/spy/scanner/edit/${scanner.id.toString()}`;
    const deleteMut = api.spy.deleteScanner.useMutation({
        onError: (opts) => {
            const { message } = opts;

            notiCtx?.addNoti({
                type: "Error",
                title: `Failed To Delete Scanner '${scanner.name}'`,
                msg: `Failed to delete scanner '${scanner.name}' due to error. Error: ${message}`
            })
        },
        onSuccess: () => {
            notiCtx?.addNoti({
                type: "Success",
                title: `Deleted Scanner '${scanner.name}'!`,
                msg: `Successfully deleted scanner '${scanner.name}'!`
            })
        }
    });

    return (
        <tr>
            <td>{scanner.name}</td>
            <td>{scanner.protocol}</td>
            <td>
                <div className="flex flex-wrap gap-2">
                    <Link
                        href={editLink}
                        className="button button-primary"
                    >Edit</Link>
                    <button
                        onClick={() => {
                            const yes = confirm("Are you sure you want to delete this Spy Scanner?");

                            if (yes) {
                                deleteMut.mutate({
                                    id: scanner.id
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