import { ErrorCtx, SuccessCtx } from "@pages/_app";
import { api } from "@utils/api";
import { Field, Form, Formik } from "formik";
import { useContext } from "react";

export default function ServerQuickForm({
    inline
} : {
    inline?: boolean
}) {
    const errorCtx = useContext(ErrorCtx);
    const successCtx = useContext(SuccessCtx);

    const addMut = api.servers.addGameServer.useMutation({
        onError: (opts) => {
            const { message } = opts;

            if (errorCtx) {
                console.error(message);

                errorCtx.setTitle("Failed To Add Server");
                errorCtx.setMsg("Failed to add server.");
            }
        },
        onSuccess: () => {
            if (successCtx) {
                successCtx.setTitle("Successfully Added Server");
                successCtx.setMsg("Successfully added server!");
            }
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
                    ip: values.ip,
                    ip6: values.ip6,
                    port: values.port
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
                </div>
                <div>
                    <label htmlFor="port">Port</label>
                    <Field
                        name="port"
                    />
                </div>
                <div>
                    <button type="submit">Add!</button>
                </div>
            </Form>
        </Formik>
    );
}