import Switch from "@components/helpers/Switch";
import { NotiCtx } from "@pages/_app";
import { type ApiKey } from "@prisma/client";
import { api } from "@utils/api";
import { randomBytes } from "crypto";
import { Field, Form, Formik } from "formik";
import { useContext, useEffect, useState } from "react";

export default function ApiKeyForm({
    apiKey
} : {
    apiKey?: ApiKey
}) {
    const notiCtx = useContext(NotiCtx);

    const add = api.api.add.useMutation({
        onError: (opts) => {
            const { message } = opts;

            notiCtx?.addNoti({
                type: "Error",
                title: `Failed To Add API Key`,
                msg: `Failed to add API key due to error. Error: ${message}`
            })
        },
        onSuccess: () => {
            notiCtx?.addNoti({
                type: "Success",
                title: `Added API Key!`,
                msg: `Successfully added API key!`
            })
        }
    })
    const update = api.api.update.useMutation({
        onError: (opts) => {
            const { message } = opts;

            notiCtx?.addNoti({
                type: "Error",
                title: `Failed To Update API Key '${apiKey?.key ?? "N/A"}'`,
                msg: `Failed to update API key '${apiKey?.key ?? "N/A"}' due to error. Error: ${message}`
            })
        },
        onSuccess: () => {
            notiCtx?.addNoti({
                type: "Success",
                title: `Updated API Key '${apiKey?.key ?? "N/A"}'!`,
                msg: `Successfully updated API key '${apiKey?.key ?? "N/A"}'!`
            })
        }
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
                        host: values.host || null,
                        endpoint: values.endpoint || null,
                        writeAccess: writeAccess,
                        limit: Number(values.limit),
                        key: key
                    })
                } else {
                    add.mutate({
                        key: key,
                        host: values.host,
                        endpoint: values.endpoint || undefined,
                        writeAccess: writeAccess || undefined,
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