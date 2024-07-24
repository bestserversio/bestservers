import { NotiCtx } from "@pages/_app";
import { api } from "@utils/api";
import { Field, Form, Formik } from "formik";
import { useContext } from "react";

export default function ServerRemoveInactive({
    inline
} : {
    inline?: boolean
}) {
    const notiCtx = useContext(NotiCtx);

    const mut = api.servers.removeInactive.useMutation({
        onError: (opts) => {
            const { message } = opts;

            notiCtx?.addNoti({
                type: "Error",
                title: "Failed To Remove Inactive Servers",
                msg: `Failed to remove inactive servers due to error :: ${message}`
            })
        },
        onSuccess: () => {
            notiCtx?.addNoti({
                type: "Success",
                title: "Removed Inactive Servers!",
                msg: "Successfully removed inactive servers!"
            })
        }
    });

    return (
        <Formik
            initialValues={{
                time: 2592000
            }}
            onSubmit={(values) => {
                const time = new Date(Date.now() - values.time)

                mut.mutate({
                    time: time
                });
            }}
        >
            <Form className={inline ? "form-inline" : undefined}>
                <div>
                    <label htmlFor="time">Time</label>
                    <Field
                        name="time"
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="button button-primary"
                    >Remove Servers!</button>
                </div>
            </Form>
        </Formik>
    );
}