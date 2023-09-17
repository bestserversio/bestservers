import { ErrorCtx, SuccessCtx } from "@pages/_app";
import { type Platform } from "@prisma/client";
import { api } from "@utils/api";
import { GetContents } from "@utils/file";
import { Field, Form, Formik } from "formik";
import { useContext, useState } from "react";

export default function PlatformForm ({
    platform
} : {
    platform?: Platform
}) {
    const errorCtx = useContext(ErrorCtx);
    const successCtx = useContext(SuccessCtx);

    const addOrUpdateMut = api.platforms.addOrUpdate.useMutation({
        onError: (opts) => {
            const { message, data } = opts;

            console.error(message);

            if (errorCtx) {
                errorCtx.setTitle(`Failed To ${platform ? "Save" : "Add"} Platform`);
                errorCtx.setMsg(`Error ${platform ? "saving" : "adding"} platform.`);
            }
        },
        onSuccess: () => {
            if (successCtx) {
                successCtx.setTitle(`Successfully ${platform ? "Saved" : "Added"} Platform!`);
                successCtx.setMsg(`Successfully ${platform ? "saved" : "added"} platform!`)
            }
        }
    });

    const [banner, setBanner] = useState<string | ArrayBuffer | null>(null);
    const [icon, setIcon] = useState<string | ArrayBuffer | null>(null);

    const [jsInternal, setJsInternal] = useState<string | ArrayBuffer | null>(null);

    return (
        <Formik
            initialValues={{
                url: platform?.url ?? "",
                name: platform?.name ?? "",
                description: platform?.description ?? "",

                bannerRemove: false,
                iconRemove: false,

                jsExternal: platform?.jsExternal ?? ""
            }}
            onSubmit={(values) => {
                addOrUpdateMut.mutate({
                    banner: banner?.toString(),
                    icon: icon?.toString(),

                    bannerRemove: values.bannerRemove,
                    iconRemove: values.iconRemove,

                    url: values.url,
                    name: values.name,
                    description: values.description || null,

                    jsInternal: jsInternal?.toString(),
                    jsExternal: values.jsExternal || null
                })
            }}
        >
            <Form>
                <h2>Images</h2>
                <div>
                    <label htmlFor="banner">Banner</label>
                    <input
                        type="file"
                        name="banner"
                        onChange={async (e) => {
                            const file = e.target.files?.[0];

                            if (file) {
                                const contents = await GetContents(file);

                                setBanner(contents);
                            }
                        }}
                    />
                </div>
                <div>
                    <label htmlFor="icon">Icon</label>
                    <input
                        type="file"
                        name="icon"
                        onChange={async (e) => {
                            const file = e.target.files?.[0];

                            if (file) {
                                const contents = await GetContents(file);

                                setIcon(contents);
                            }
                        }}
                    />
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
                    <label htmlFor="description">Description</label>
                    <Field name="description" />
                </div>

                <h2>Web Settings</h2>
                <div>
                    <label htmlFor="jsInternal">Internal JS Package</label>
                    <input
                        type="file"
                        name="jsInternal"
                        onChange={async (e) => {
                            const file = e.target.files?.[0];

                            if (file) {
                                const contents = await GetContents(file);

                                setJsInternal(contents);
                            }
                        }}
                    />
                </div>
                <div>
                    <label htmlFor="jsExternal">External JS URL</label>
                    <Field name="jsExternal" />
                </div>
            </Form>
        </Formik>
    )
}