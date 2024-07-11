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

    const [writeAccess, setWriteAccess] = useState(false);

    const [key, setKey] = useState<string | undefined>(undefined)

    useEffect(() => {
        if (!key) {
            const genKey = randomBytes(64).toString("hex")

            setKey(genKey)
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
                        limit: values.limit
                    })
                } else {
                    add.mutate({
                        key: key,
                        host: values.host,
                        endpoint: values.endpoint,
                        writeAccess: writeAccess,
                        limit: values.limit
                    })
                }
            }}
        >
            <Form className="form">
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
                        label={<>Write Access</>}
                    ></Switch>
                </div>
                <div>
                    <label htmlFor="limit">Limit</label>
                    <Field
                        as="number"
                        name="limit"
                    />
                </div>
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="button button-primary"
                    >{apiKey ? "Save Key" : "Add Key"}</button>
                </div>
            </Form>
        </Formik>
    )
}