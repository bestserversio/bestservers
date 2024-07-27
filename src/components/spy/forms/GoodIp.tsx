import { NotiCtx } from "@pages/_app";
import { api } from "@utils/api";
import { useContext, useState } from "react";

export default function GooddIpForm() {
    const notiCtx = useContext(NotiCtx);

    const [ip, setIp] = useState("");

    const addOrUpdateMut = api.spy.addOrUpdateGoodIp.useMutation({
        onError: (opts) => {
            const { message } = opts;

            console.error(message);
            
            notiCtx?.addNoti({
                type: "Error",
                title: `Failed To Add Good IP '${ip}'!`,
                msg: `Error adding good IP '${ip}'.`
            })
        },
        onSuccess: () => {
            notiCtx?.addNoti({
                type: "Success",
                title: `Successfully added good IP '${ip}'!`,
                msg: `Successfully added the good IP '${ip}'!`
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

                        setIp(val);
                    }}
                />
            </div>
            <button
                onClick={() => {
                    if (!ip || ip.length < 1)
                        return;

                    // Figure out formatting.
                    let net = ip;
                    let cidr = 32;

                    if (ip.includes("/")) {
                        const split = ip.split("/")

                        if (split.length == 2 && split[0] && split[1])
                            net = split[0];
                            cidr = Number(split[1]);
                    }

                    addOrUpdateMut.mutate({
                        ip: net,
                        cidr: cidr
                    })
                }}
                className="button button-primary"
            >Add!</button>
        </div>
    )
}