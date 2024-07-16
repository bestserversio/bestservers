import { NotiCtx } from "@pages/_app";
import { api } from "@utils/api";
import { useContext, useState } from "react";

export default function BadAsnForm() {
    const notiCtx = useContext(NotiCtx);

    const [asn, setAsn] = useState(0);

    const addOrUpdateMut = api.spy.addOrUpdateBadAsn.useMutation({
        onError: (opts) => {
            const { message } = opts;

            console.error(message);

            notiCtx?.addNoti({
                type: "Error",
                title: `Added Bad Word 'AS${asn}'!`,
                msg: `Error adding bad word 'AS${asn}'.`
            })
        },
        onSuccess: () => {
            notiCtx?.addNoti({
                type: "Success",
                title: `Successfully Added Bad Word 'AS${asn}'!`,
                msg: `Successfully added the bad word 'AS${asn}'.`
            })
        }
    });

    return (
        <div className="flex flex-wrap gap-2">
            <div className="grow">
                <input
                    type="text"
                    className="bg-shade-1/70 p-4 text-white w-full"
                    onChange={(e) => {
                        const val = e.target.value;

                        setAsn(Number(val));
                    }}
                />
            </div>
            <button
                onClick={() => {
                    if (!asn)
                        return;
                    
                    addOrUpdateMut.mutate({
                        asn: asn
                    })
                }}
                className="button button-primary"
            >Add!</button>
        </div>
    )
}