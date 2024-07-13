import { ErrorCtx, SuccessCtx } from "@pages/_app";
import { api } from "@utils/api";
import { useContext, useState } from "react";

export default function BadAsnForm() {
    const errorCtx = useContext(ErrorCtx);
    const successCtx = useContext(SuccessCtx);

    const [asn, setAsn] = useState(0);

    const addOrUpdateMut = api.spy.addOrUpdateBadAsn.useMutation({
        onError: (opts) => {
            const { message } = opts;

            console.error(message);

            if (errorCtx) {
                errorCtx.setTitle(`Added Bad Word 'AS${asn}'!`);
                errorCtx.setMsg(`Error adding bad word 'AS${asn}'.`);
            }
        },
        onSuccess: () => {
            if (successCtx) {
                successCtx.setTitle(`Successfully Added Bad Word 'AS${asn}'!`);
                successCtx.setMsg(`Successfully added the bad word 'AS${asn}'.`)
            }
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