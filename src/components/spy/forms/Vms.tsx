import Switch from "@components/helpers/Switch";
import { NotiCtx } from "@pages/_app";
import { type Platform } from "@prisma/client";
import { api } from "@utils/api";
import { Field, Form, Formik } from "formik";
import { useContext, useState } from "react";
import { type VmsWithRelations } from "~/types/Spy";

export default function VmsForm ({
    vms,
    platforms = [],
} : {
    vms?: VmsWithRelations
    platforms?: Platform[]
}) {
    const notiCtx = useContext(NotiCtx);

    const addOrUpdateMut = api.spy.addOrUpdateVms.useMutation({
        onError: (opts) => {
            const { message } = opts;

            console.error(message);

            notiCtx?.addNoti({
                type: "Error",
                title: `Failed To ${vms ? "Save" : "Add"} Spy VMS`,
                msg: `Error ${vms ? "saving" : "adding"} Spy VMS.`
            })
        },
        onSuccess: () => {
            notiCtx?.addNoti({
                type: "Success",
                title: `Successfully ${vms ? "Saved" : "Added"} Spy VMS!`,
                msg: `Successfully ${vms ? "saved" : "added"} Spy VMS!`
            })
        }
    });

    // Flags and booleans
    const [recvOnly, setRecvOnly] = useState(vms?.recvOnly ?? false);
    const [excludeEmpty, setExcludeEmpty] = useState(vms?.excludeEmpty ?? true);
    const [onlyEmpty, setOnlyEmpty] = useState(vms?.onlyEmpty ?? false);
    const [subBots, setSubBots] = useState(vms?.subBots ?? false);
    const [addOnly, setAddOnly] = useState(vms?.addOnly ?? false);
    const [randomApps, setRandomApps] = useState(vms?.randomApps ?? false);
    const [setOffline, setSetOffline] = useState(vms?.setOffline ?? true);

    const [vmsPlatforms, setVmsPlatforms] = useState<number[]>(vms?.platforms.map(s => s.id) ?? []);

    return (
        <Formik
            initialValues={{
                name: vms?.name ?? "",
                key: vms?.key ?? "",
                timeout: vms?.timeout ?? "",
                minWait: vms?.minWait ?? "",
                maxWait: vms?.maxWait ?? "",
                limit: vms?.limit ?? ""
            }}
            onSubmit={(values) => {
                const { name, timeout, key, minWait, maxWait, limit } = values;

                addOrUpdateMut.mutate({
                    id: vms?.id,
                    name: name,
                    key: key,
                    minWait: minWait ? Number(minWait) : undefined,
                    maxWait: maxWait ? Number(maxWait) : undefined,
                    timeout: timeout ? Number(timeout) : undefined,
                    limit: limit ? Number(limit) : undefined,
                    recvOnly: recvOnly,
                    excludeEmpty: excludeEmpty,
                    onlyEmpty: onlyEmpty,
                    addOnly: addOnly,
                    randomApps: randomApps,
                    setOffline: setOffline,

                    platforms: vmsPlatforms
                })
            }}
        >
            {() => (
                <Form>
                    <h2>General</h2>
                    <div>
                        <label htmlFor="name">Name</label>
                        <Field name="name" />
                    </div>
                    <div>
                        <label htmlFor="key">API Key</label>
                        <Field name="key" />
                    </div>
                    <div>
                        <label htmlFor="limit">Limit</label>
                        <Field name="limit" />
                    </div>
                    <div>
                        <label htmlFor="minWait">Min Wait</label>
                        <Field name="minWait" />
                    </div>
                    <div>
                        <label htmlFor="maxWait">Max Wait</label>
                        <Field name="maxWait" />
                    </div>
                    <div>
                        <label htmlFor="timeout">Timeout</label>
                        <Field name="timeout" />
                    </div>

                    <h2>Platforms</h2>
                    <div>
                        {platforms.length > 0 ? (
                            <>
                                <select
                                    onChange={(e) => {
                                        const opts = Array.from(e.target.selectedOptions, option => Number(option.value));

                                        setVmsPlatforms(opts);
                                    }}
                                    multiple={true}
                                    value={vmsPlatforms.map(s => s.toString())}
                                >
                                    {platforms.map((platform, idx) => {
                                        return (
                                            <option
                                                key={`platform-${idx.toString()}`}
                                                value={platform.id}
                                            >{platform.name} ({platform.id.toString()})</option>
                                        )
                                    })}
                                </select>
                            </>
                        ) : (
                            <p>No platforms found.</p>
                        )}
                    </div>
                    
                    <h2>Flags</h2>
                    <div className="flex flex-row">
                        <Switch
                            onChange={() => {
                                setRecvOnly(!recvOnly);
                            }}
                            value={recvOnly}
                        />
                        <label htmlFor="recvOnly">Receive Only</label>
                    </div>
                    <div className="flex flex-row">
                        <Switch
                            onChange={() => {
                                setExcludeEmpty(!excludeEmpty);
                            }}
                            value={excludeEmpty}
                        />
                        <label htmlFor="excludeEmpty">Exclude Empty</label>
                    </div>
                    <div className="flex flex-row">
                        <Switch
                            onChange={() => {
                                setOnlyEmpty(!onlyEmpty);
                            }}
                            value={onlyEmpty}
                        />
                        <label htmlFor="onlyEmpty">Only Empty</label>
                    </div>
                    <div className="flex flex-row">
                        <Switch
                            onChange={() => {
                                setSubBots(!subBots);
                            }}
                            value={subBots}
                        />
                        <label htmlFor="subBots">Subtract Bots</label>
                    </div>
                    <div className="flex flex-row">
                        <Switch
                            onChange={() => {
                                setAddOnly(!addOnly);
                            }}
                            value={addOnly}
                        />
                        <label htmlFor="addOnly">Add Only</label>
                    </div>
                    <div className="flex flex-row">
                        <Switch
                            onChange={() => {
                                setRandomApps(!randomApps);
                            }}
                            value={randomApps}
                        />
                        <label htmlFor="randomApps">Random Apps</label>
                    </div>
                    <div className="flex flex-row">
                        <Switch
                            onChange={() => {
                                setSetOffline(!setOffline);
                            }}
                            value={setOffline}
                        />
                        <label htmlFor="setOffline">Set Offline</label>
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="button button-primary"
                        >{vms ? "Save" : "Add"} Scanner!</button>
                    </div>             
                </Form>
            )}
        </Formik>
    )
}