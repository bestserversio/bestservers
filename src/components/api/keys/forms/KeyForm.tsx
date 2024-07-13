import Switch from "@components/helpers/Switch";
import { type ApiKey } from "@prisma/client";
import { api } from "@utils/api";
import { randomBytes } from "crypto";
import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";

export default function ApiKeyForm({
    apiKey
} : {
    apiKey?: ApiKey
}) {
    //const errorCtx = useContext(ErrorCtx)
    //const successCtx = useContext(SuccessCtx)

    /*
    const errHandler = (opts: unknown) => {

    }
    const sucHandler = () => {

    }
    */

    const add = api.api.add.useMutation({
        //onError: errHandler,
        //onSuccess: sucHandler
    })
    const update = api.api.update.useMutation({
        //onError: errHandler,
        //onSuccess: sucHandler
    })

    const [writeAccess, setWriteAccess] = useState(apiKey?.writeAccess ?? false);

    const [key, setKey] = useState(apiKey?.key)

    const regenKey = () => {
        const genKey = randomBytes(64).toString("hex")

        setKey(genKey)
    }

    useEffect(() => {
        if (!key) {
            regenKey();
        }
    }, [key])
    return (
        <Formik
            initialValues={{
                host: apiKey?.host ?? "",
                endpoint: apiKey?.endpoint ?? "",
                limit: apiKey?.limit ?? 3000
            }}
            onSubmit={(values) => {
                if (!key) {
                    console.error("Key somehow null.")

                    return;
                }
                
                if (apiKey) {
                    update.mutate({
                        id: apiKey.id,
                        host: values.host,
                        endpoint: values.endpoint,
                        writeAccess: writeAccess,
                        limit: Number(values.limit),
                        key: key
                    })
                } else {
                    add.mutate({
                        key: key,
                        host: values.host,
                        endpoint: values.endpoint,
                        writeAccess: writeAccess,
                        limit: Number(values.limit)
                    })
                }
            }}
        >
            <Form className="form">
                {apiKey && (
                    <div className="flex flex-row gap-2 flex-wrap text-sm">
                        <span className="font-bold">Key</span><span>-</span><span>{key ?? "N/A"}</span>
                    </div>
                )}
                <div>
                    <label htmlFor="host">Host</label>
                    <Field name="host" />
                </div>
                <div>
                    <label htmlFor="endpoint">Endpoint</label>
                    <Field name="endpoint" />
                </div>
                <div>
                    <Switch
                        onChange={() => {
                            setWriteAccess(!writeAccess)
                        }}
                        value={writeAccess}
                        label={<>Write Access</>}
                    ></Switch>
                </div>
                <div>
                    <label htmlFor="limit">Limit</label>
                    <Field name="limit" />
                </div>
                <div className="flex justify-center gap-2">
                    <button
                        type="submit"
                        className="button button-primary"
                    >{apiKey ? "Save Key" : "Add Key"}</button>
                    {apiKey && (
                        <button
                            type="button"
                            onClick={() => {
                                regenKey();
                            }}
                            className="button button-secondary"
                        >Regenerate Key</button>
                    )}
                </div>
            </Form>
        </Formik>
    )
}