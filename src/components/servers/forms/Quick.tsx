import { NotiCtx } from "@pages/_app";
import { api } from "@utils/api";
import { Field, Form, Formik } from "formik";
import { useContext } from "react";

export default function ServerQuickForm({
    inline
} : {
    inline?: boolean
}) {
    const notiCtx = useContext(NotiCtx);

    const addMut = api.servers.addGameServer.useMutation({
        onError: (opts) => {
            const { message } = opts;

            notiCtx?.addNoti({
                type: "Error",
                title: "Failed To Add Server",
                msg: `Failed to add server due to error :: ${message}`
            })
        },
        onSuccess: () => {
            notiCtx?.addNoti({
                type: "Success",
                title: "Added server!",
                msg: "Successfully added the game server! Please allow time for our system to query the server."
            })
        }
    });

    return (
        <Formik
            initialValues={{
                ip: "",
                ip6: "",
                port: 0
            }}
            onSubmit={(values) => {
                addMut.mutate({
                    ip: values.ip || undefined,
                    ip6: values.ip6 || undefined,
                    port: Number(values.port)
                });
            }}
        >
            <Form className={inline ? "form-inline" : undefined}>
                <div>
                    <label htmlFor="ip">IPv4 Address</label>
                    <Field
                        name="ip"
                    />
                </div>
                <div>
                    <label htmlFor="ip6">IPv6 Address</label>
                    <Field
                        name="ip6"
                    />
                    <p className="text-xs">Most game servers only utilize IPv4 addresses.</p>
                </div>
                <div>
                    <label htmlFor="port">Port</label>
                    <Field
                        name="port"
                    />
                    <p className="text-xs">Must be between 1 and 65535!</p>
                </div>
                <div>
                    <button
                        type="submit"
                        className="button button-primary"
                    >Add Server!</button>
                </div>
            </Form>
        </Formik>
    );
}