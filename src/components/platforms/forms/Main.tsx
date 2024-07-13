import Switch from "@components/helpers/Switch";
import { ErrorCtx, SuccessCtx } from "@pages/_app";
import { PlatformFlag, type Platform } from "@prisma/client";
import { api } from "@utils/api";
import { GetContents } from "@utils/file_cl";
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
            const { message } = opts;

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

    const [flagA2s, setFlagA2s] = useState(platform?.flags?.includes("A2S") ?? false);
    const [flagTs, setFlagTs] = useState(platform?.flags?.includes("TEAMSPEAK3") ?? false);
    const [flagDiscord, setFlagDiscord] = useState(platform?.flags?.includes("DISCORD") ?? false);

    return (
        <Formik
            initialValues={{
                url: platform?.url ?? "",
                name: platform?.name ?? "",
                nameShort: platform?.nameShort ?? "",
                description: platform?.description ?? "",
                vmsId: platform?.vmsId ?? "",

                bannerRemove: false,
                iconRemove: false,

                jsExternal: platform?.jsExternal ?? ""
            }}
            onSubmit={(values) => {
                // Compile flags.
                const flags: PlatformFlag[] = [];

                if (flagA2s)
                    flags.push("A2S");

                if (flagTs)
                    flags.push("TEAMSPEAK3");
                
                if (flagDiscord)
                        flags.push("DISCORD");

                addOrUpdateMut.mutate({
                    banner: banner?.toString(),
                    icon: icon?.toString(),
                    id: platform?.id,

                    bannerRemove: values.bannerRemove,
                    iconRemove: values.iconRemove,

                    url: values.url,
                    name: values.name,
                    nameShort: values.nameShort,
                    description: values.description || null,
                    vmsId: Number(values.vmsId),

                    jsInternal: jsInternal?.toString(),
                    jsExternal: values.jsExternal || null,

                    flags: flags
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
                        onChange={(e) => {
                            const file = e.target.files?.[0];

                            if (file) {
                                void (async () => {
                                    try {
                                        const contents = await GetContents(file);
                                        setBanner(contents);
                                    } catch (err) {
                                        console.error(err);
                                    }
                                })();
                            }
                        }}
                    />
                </div>
                <div>
                    <label htmlFor="icon">Icon</label>
                    <input
                        type="file"
                        name="icon"
                        onChange={(e) => {
                            const file = e.target.files?.[0];

                            if (file) {
                                void (async () => {
                                    try {
                                        const contents = await GetContents(file);
                                        setIcon(contents);
                                    } catch (err) {
                                        console.error(err);
                                    }
                                })();
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
                    <label htmlFor="nameShort">Short Name</label>
                    <Field name="nameShort" />
                </div>
                <div>
                    <label htmlFor="description">Description</label>
                    <Field name="description" />
                </div>
                <div>
                    <label htmlFor="vmsId">App/VMS ID</label>
                    <Field name="vmsId" />
                </div>

                <h2>Web Settings</h2>
                <div>
                    <label htmlFor="jsInternal">Internal JS Package</label>
                    <input
                        type="file"
                        name="jsInternal"
                        onChange={(e) => {
                            const file = e.target.files?.[0];

                            if (file) {
                                void (async () => {
                                    try {
                                        const contents = await GetContents(file);
                                        setJsInternal(contents);
                                    } catch (err) {
                                        console.error(err);
                                    }
                                })();
                            }
                        }}
                    />
                </div>
                <div>
                    <label htmlFor="jsExternal">External JS URL</label>
                    <Field name="jsExternal" />
                </div>

                <h2>Flags</h2>
                <div>
                    <Switch
                        onChange={() => {
                            setFlagA2s(!flagA2s);
                        }}
                        value={flagA2s}
                        label={<>A2S</>}
                    />
                    <Switch
                        onChange={() => {
                            setFlagTs(!flagTs);
                        }}
                        value={flagTs}
                        label={<>TeamSpeak</>}
                    />
                    <Switch
                        onChange={() => {
                            setFlagDiscord(!flagDiscord);
                        }}
                        value={flagDiscord}
                        label={<>Discord</>}
                    />  
                </div>
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="button button-primary"
                    >{platform ? "Save Platform" : "Add Platform"}</button>
                </div>
            </Form>
        </Formik>
    )
}