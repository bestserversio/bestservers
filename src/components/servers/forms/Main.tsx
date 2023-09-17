import { ErrorCtx, SuccessCtx } from "@pages/_app";
import { type Platform } from "@prisma/client";
import { api } from "@utils/api";
import { Field, Form, Formik } from "formik";
import React, { useContext } from "react";
import { type CategoryWithChildren } from "~/types/Category";
import { type ServerWithRelations } from "~/types/Server";

export default function ServerForm ({
    server,
    platforms = [],
    categories = []
} : {
    server: ServerWithRelations
    platforms?: Platform[]
    categories?: CategoryWithChildren[]
}) {
    const errorCtx = useContext(ErrorCtx);
    const successCtx = useContext(SuccessCtx);

    const updateMut = api.servers.update.useMutation({
        onError: (opts) => {
            const { message, data } = opts;

            console.error(message);

            if (errorCtx) {
                errorCtx.setTitle("Failed To Update Server");
                errorCtx.setMsg("An error occurred when attempting to update the server.");
            }
        },
        onSuccess: () => {
            if (successCtx) {
                successCtx.setTitle("Successfully Updated Server!");
                successCtx.setMsg("Successfully updated server!");
            }
        }
    });

    return (
        <Formik
            initialValues={{
                visible: server.visible,

                platform: server.platform?.id ?? 0,
                category: server.category?.id ?? 0,

                url: server.url ?? "",
                name: server.name ?? "",
                descriptionShort: server.descriptionShort ?? "",
                description: server.description ?? "",
                features: server.features ?? "",
                rules: server.rules ?? "",

                ip: server.ip ?? "",
                ip6: server.ip6 ?? "",
                port: server.port ?? 0,
                hostName: server.hostName ?? ""
            }}
            onSubmit={(values) => {
                updateMut.mutate({
                    id: server.id,

                    visible: values.visible,

                    platform: values.platform,
                    category: values.category,

                    url: values.url || null,
                    name: values.name || null,
                    descriptionShort: values.descriptionShort || null,
                    description: values.description || null,
                    features: values.features || null,
                    rules: values.rules || null,

                    ip: values.ip || null,
                    ip6: values.ip6 || null,
                    port: values.port || null,
                    hostName: values.hostName || null
                });
            }}
        >
            <Form>
                <h2>Platform & Category</h2>
                <div>
                    <label htmlFor="platform">Platform</label>
                    <select name="platform">
                        {platforms.map((platform, index) => {
                            return (
                                <option
                                    key={`platform-${index.toString()}`}
                                    value={platform.id}
                                >{platform.name}</option>
                            );
                        })}
                    </select>
                </div>
                <div>
                    <label htmlFor="category">Category</label>
                    <select name="category">
                        <option value={0}>None</option>
                        {categories.map((category, index) => {
                            return (
                                <React.Fragment key={`category-${index.toString()}`}>
                                    <option value={category.id}>
                                        {category.name}
                                    </option>
                                    {category.children.map((child, index) => {
                                        return (
                                            <option
                                                key={`child-${index.toString()}`}
                                                value={child.id}
                                            >{child.name}</option>
                                        );
                                    })}
                                </React.Fragment>
                            );
                        })}
                    </select>
                </div>
                <h2>General</h2>
                <div>
                    <label htmlFor="url">URL</label>
                    <Field name="url" />
                </div>
                <div>
                    <label htmlFor="name">Name</label>
                    <Field name="name" />
                </div>
                <div>
                    <label htmlFor="descriptionShort">Short Description</label>
                    <Field
                        as="textfield"
                        name="descriptionShort"
                        rows={30}
                        cols={15}
                    />
                </div>
                <div>
                    <label htmlFor="description">Description</label>
                    <Field
                        as="textfield"
                        name="description"
                        rows={30}
                        cols={15}
                    />
                </div>
                <div>
                    <label htmlFor="features">Features</label>
                    <Field
                        as="textfield"
                        name="features"
                        rows={30}
                        cols={15}
                    />
                </div>
                <div>
                    <label htmlFor="rules">Rules</label>
                    <Field
                        as="textfield"
                        name="rules"
                        rows={30}
                        cols={30}
                    />
                </div>
                <h2>Network</h2>
                <div>
                    <label htmlFor="ip">IPv4 Address</label>
                    <Field name="ip" />
                </div>
                <div>
                    <label htmlFor="ip6">IPv6 Address</label>
                    <Field name="ip6" />
                </div>
                <div>
                    <label htmlFor="port">Port</label>
                    <Field name="port" />
                </div>
                <div>
                    <label htmlFor="hostName">Host Name</label>
                    <Field name="hostName" />
                </div>
            </Form>
        </Formik>
    );
}