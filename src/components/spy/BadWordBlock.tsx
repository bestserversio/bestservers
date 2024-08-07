import Loader from "@components/Loader";
import { type BadWord } from "@prisma/client";
import { api } from "@utils/api";
import { useContext, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import BadWordForm from "./forms/BadWord";
import { NotiCtx } from "@pages/_app";

export default function BadWordsBlock ({
    limit = 10
} : {
    limit?: number
}) {
    const [needMore, setNeedMore] = useState(true);

    const { data, fetchNextPage } = api.spy.allBadWords.useInfiniteQuery({
        limit: limit
    }, {
        getNextPageParam: (lastPage) => lastPage.nextBadWord
    });

    const loadMore = () => {
        void (async () => {
            await fetchNextPage();
        })()
    }

    const badWords: BadWord[] = [];

    if (data) {
        data.pages.map((pg) => {
            badWords.push(...pg.badWords);

            if (!pg.nextBadWord && needMore)
                    setNeedMore(false);
        })
    }

    const badWordsLoading = !data || badWords.length > 0;

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="p-2 rounded-lg bg-shade-2/70 h-72 overflow-y-auto">
                {badWordsLoading ? (
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={loadMore}
                        loader={<Loader key="loader" />}
                        hasMore={needMore}
                    >
                        <table className="table table-auto w-full">
                            <thead>
                                <tr className="text-left">
                                    <th>Word</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {badWords.map((badWord, idx) => {
                                    return (
                                        <Row
                                            key={`badword-${idx.toString()}`}
                                            badWord={badWord}
                                        />
                                    )
                                })}
                            </tbody>
                        </table>
                    </InfiniteScroll>
                ) : (
                    <p>No bad words found.</p>
                )}
            </div>
            <BadWordForm />
        </div>
    )
}

function Row({
    badWord
} : {
    badWord: BadWord
}) {
    const notiCtx = useContext(NotiCtx);

    const [editMode, setEditMode] = useState(false);
    const [newWord, setNewWord] = useState(badWord.word);

    const editMut = api.spy.addOrUpdateBadWord.useMutation({
        onError: (opts) => {
            const { message } = opts;

            notiCtx?.addNoti({
                type: "Error",
                title: `Failed to modify bad word '${badWord.word}'`,
                msg: `Failed to edit modify word '${badWord.word}'. Error: ${message}`
            })
        },
        onSuccess: () => {
            notiCtx?.addNoti({
                type: "Success",
                title: `Modifed Bad word '${badWord.word}'!`,
                msg: `Successfully modified bad word '${badWord.word}'`
            })
        }
    });
    const deleteMut = api.spy.deleteBadWord.useMutation({
        onError: (opts) => {
            const { message } = opts;

            notiCtx?.addNoti({
                type: "Error",
                title: `Failed to delete bad word '${badWord.word}'`,
                msg: `Failed to delete bad word '${badWord.word}'. Error: ${message}`
            })
        },
        onSuccess: () => {
            notiCtx?.addNoti({
                type: "Success",
                title: `Deleted Bad word '${badWord.word}'!`,
                msg: `Successfully deleted bad word '${badWord.word}'`
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
                        defaultValue={newWord}
                        onChange={(e) => {
                            setNewWord(e.target.value);
                        }}
                    />
                ) : (
                    <span>{badWord.word}</span>
                )}
            </td>
            <td>
                <div className="flex flex-wrap gap-2">
                    {editMode ? (
                        <button
                            onClick={() => {
                                editMut.mutate({
                                    id: badWord.id,
                                    word: newWord
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
                            const yes = confirm("Are you sure you want to delete this Bad Word?");

                            if (yes) {
                                deleteMut.mutate({
                                    id: badWord.id
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