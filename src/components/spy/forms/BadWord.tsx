import { NotiCtx } from "@pages/_app";
import { api } from "@utils/api";
import { useContext, useState } from "react";

export default function BadWordForm() {
    const notiCtx = useContext(NotiCtx);

    const [word, setWord] = useState("");

    const addOrUpdateMut = api.spy.addOrUpdateBadWord.useMutation({
        onError: (opts) => {
            const { message } = opts;

            console.error(message);
            notiCtx?.addNoti({
                type: "Error",
                title: `Added Bad Word '${word}'!`,
                msg: `Error adding bad word '${word}'.`
            })
        },
        onSuccess: () => {
            notiCtx?.addNoti({
                type: "Success",
                title: `Successfully Added Bad Word '${word}'!`,
                msg: `Successfully added the bad word '${word}'.`
            })
        }
    });

    return (
        <div className="flex flex-wrap gap-2 w-full">
            <div className="grow">
                <input
                    type="text"
                    className="bg-shade-1/70 p-4 text-white w-full"
                    onChange={(e) => {
                        const val = e.target.value;

                        setWord(val);
                    }}
                />
            </div>
            <button
                onClick={() => {
                    if (!word || word.length < 1)
                        return;
                    
                    addOrUpdateMut.mutate({
                        word: word
                    })
                }}
                className="button button-primary"
            >Add!</button>
        </div>
    )
}