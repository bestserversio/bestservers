import Switch from "@components/helpers/Switch";
import { NotiCtx } from "@pages/_app";
import { ApiKey, Platform, SpyScanner, SpyVms } from "@prisma/client";
import { api } from "@utils/api";
import { Field, Form, Formik } from "formik";
import { useContext, useState } from "react";
import { SpyWithRelations } from "~/types/Spy";

export default function SpyForm ({
    spy,
    apiKeys = [],
    scanners = [],
    vms = [],
    platforms = []
} : {
    spy?: SpyWithRelations
    apiKeys?: ApiKey[]
    scanners?: SpyScanner[]
    vms?: SpyVms[]
    platforms?: Platform[]
}) {
    const notiCtx = useContext(NotiCtx);

    const addOrUpdateMut = api.spy.addOrUpdateSpy.useMutation({
        onError: (opts) => {
            const { message } = opts;

            console.error(message);

            notiCtx?.addNoti({
                type: "Error",
                title: `Failed To ${spy ? "Save" : "Add"} Spy Instance`,
                msg: `Error ${spy ? "saving" : "adding"} Spy Instance.`
            })
        },
        onSuccess: () => {
            notiCtx?.addNoti({
                type: "Success",
                title: `Successfully ${spy ? "Saved" : "Added"} Spy Instance!`,
                msg: `Successfully ${spy ? "saved" : "added"} Spy Instance!`
            })
        }
    });

    const [spyScanners, setSpyScanners] = useState<number[]>(spy?.scanners.map(s => s.id) ?? []);
    const [spyVms, setSpyVms] = useState<number[]>(spy?.vms.map(v => v.id) ?? [])

    const [removeInactive, setRemoveInactive] = useState(spy?.removeInactive ?? false);

    const [removeTimedOut, setRemoveTimedOut] = useState(spy?.removeTimedOut ?? false);
    const [removeTimedOutPlatforms, setRemoveTimedOutPlatforms] = useState<number[]>(spy?.removeTimedOutPlatforms?.map((p) => p.id) ?? [])

    const [webApiEnabled, setWebApiEnabled] = useState(spy?.webApiEnabled ?? false);
    const [webApiSaveToFs, setWebApiSaveToFs] = useState(spy?.webApiSaveToFs ?? true);

    const [removeDups, setRemoveDups] = useState(spy?.removeDups ?? false);

    return (
        <Formik
            initialValues={{
                host: spy?.host ?? "",
                verbose: spy?.verbose ?? "",
                logDirectory: spy?.logDirectory ?? "",
                keyId: spy?.keyId ?? 0,

                apiHost: spy?.apiHost ?? "",
                apiTimeout: spy?.apiTimeout ?? "",

                webApiHost: spy?.webApiHost ?? "",
                webApiEndpoint: spy?.webApiEndpoint ?? "",
                webApiTimeout: spy?.webApiTimeout ?? "",
                webApiInterval: spy?.webApiInterval ?? "",

                removeInactiveTime: spy?.removeInactiveTime ?? "",
                removeInactiveInterval: spy?.removeInactiveInterval ?? "",
                removeInactiveTimeout: spy?.removeInactiveTimeout ?? "",

                removeTimedOutInterval: spy?.removeTimedOutInterval  ?? "",
                removeTimedOutTime: spy?.removeTimedOutTime ?? "",
                removeTimedOutTimeout: spy?.removeTimedOutTimeout ?? "",

                removeDupsInterval: spy?.removeDupsInterval ?? "",
                removeDupsLimit: spy?.removeDupsLimit ?? "",
                removeDupsMaxServers: spy?.removeDupsMaxServers ?? "",
                removeDupsTimeout: spy?.removeDupsTimeout ?? ""
            }}
            onSubmit={(values) => {
                const { verbose, logDirectory, apiHost, apiTimeout, webApiHost, keyId, webApiEndpoint, webApiInterval, webApiTimeout, removeInactiveTime, removeInactiveInterval, removeInactiveTimeout, removeDupsInterval, removeDupsLimit, removeDupsMaxServers, removeDupsTimeout, removeTimedOutInterval, removeTimedOutTime, removeTimedOutTimeout } = values;
                
                addOrUpdateMut.mutate({
                    id: spy?.id,
                    host: values.host,
                    verbose: verbose ? Number(verbose) : undefined,
                    logDirectory: logDirectory.length > 0 ? logDirectory : null,
                    keyId: keyId > 0 ? Number(keyId) : null,
                    apiHost: apiHost,
                    apiTimeout: apiTimeout ? Number(apiTimeout) : undefined,
                    webApiEnabled: webApiEnabled,
                    webApiHost: webApiHost,
                    webApiEndpoint: webApiEndpoint,
                    webApiTimeout: webApiTimeout ? Number(webApiTimeout) : undefined,
                    webApiInterval: webApiInterval ? Number(webApiInterval) : undefined,
                    webApiSaveToFs: webApiSaveToFs,
                    removeInactive: removeInactive,
                    removeInactiveTime: removeInactiveTime ? Number(removeInactiveTime) : undefined,
                    removeInactiveInterval: removeInactiveInterval ? Number(removeInactiveInterval) : undefined,
                    removeInactiveTimeout: removeInactiveTimeout ? Number(removeInactiveTimeout) : undefined,
                    removeDups: removeDups,
                    removeDupsInterval: removeDupsInterval ? Number(removeDupsInterval) : undefined,
                    removeDupsLimit: removeDupsLimit ? Number(removeDupsLimit) : undefined,
                    removeDupsMaxServers: removeDupsMaxServers ? Number(removeDupsMaxServers) : undefined,
                    removeDupsTimeout: removeDupsTimeout ? Number(removeDupsTimeout) : undefined,
                    removeTimedOut: removeTimedOut,
                    removeTimedOutInterval: removeTimedOutInterval ? Number(removeTimedOutInterval) : undefined,
                    removeTimedOutTime: removeTimedOutTime ? Number(removeTimedOutTime) : undefined,
                    removeTimedOutTimeout: removeTimedOutTimeout ? Number(removeTimedOutTimeout) : undefined,
                    removeTimedOutPlatforms: removeTimedOutPlatforms,
                    scanners: spyScanners,
                    vms: spyVms
                })
            }}
        >
            {(form) => (
                <Form>
                    <h2>General</h2>
                    <div>
                        <label htmlFor="host">Host</label>
                        <Field name="host" />
                    </div>
                    <div>
                        <label htmlFor="verbose">Verbose Level</label>
                        <Field name="verbose" />
                    </div>
                    <div>
                        <label htmlFor="logDirectory">Log Directory</label>
                        <Field name="logDirectory" />
                    </div>
                    <div>
                        <label htmlFor="keyId">API Key</label>
                        <select
                            name="keyId"
                            onChange={form.handleChange}
                            onBlur={form.handleBlur}
                            defaultValue={spy?.keyId ?? 0}
                        >
                            <option value="0">None</option>
                            {apiKeys.length > 0 && (
                                <>
                                    {apiKeys.map((key, idx) => {
                                        return (
                                            <option
                                                key={`key-${idx.toString()}`}
                                                value={key.id}
                                            >{key.key} ({key.id})</option>
                                        )
                                    })}
                                </>
                            )}
                        </select>
                    </div>

                    <h2>Main API</h2>
                    <div>
                        <label htmlFor="apiHost">Host</label>
                        <Field name="apiHost" />
                    </div>
                    <div>
                        <label htmlFor="apiTimeout">Timeout</label>
                        <Field name="apiTimeout" />
                    </div>

                    <h2>Web API</h2>
                    <div className="flex flex-row">
                        <Switch
                            onChange={() => {
                                setWebApiEnabled(!webApiEnabled);
                            }}
                            value={webApiEnabled}
                        />
                        <label htmlFor="webApiEnabled">Enabled</label>
                    </div>
                    <div>
                        <label htmlFor="webApiHost">Host</label>
                        <Field name="webApiHost" />
                    </div>
                    <div>
                        <label htmlFor="webApiEndpoint">Endpoint</label>
                        <Field name="webApiEndpoint" />
                    </div>
                    <div>
                        <label htmlFor="webApiTimeout">Timeout</label>
                        <Field name="webApiTimeout" />
                    </div>
                    <div>
                        <label htmlFor="webApiInterval">Interval</label>
                        <Field name="webApiInterval" />
                    </div>
                    <div className="flex flex-row">
                        <Switch
                            onChange={() => {
                                setWebApiSaveToFs(!webApiSaveToFs);
                            }}
                            value={webApiSaveToFs}
                        />
                        <label htmlFor="webApiSaveToFs">Save To File System</label>
                    </div>

                    <h2>Scanners</h2>
                    <div>
                        {scanners.length > 0 ? (
                            <>
                                <select
                                    onChange={(e) => {
                                        const opts = Array.from(e.target.selectedOptions, option => Number(option.value));

                                        setSpyScanners(opts);
                                    }}
                                    multiple={true}
                                    value={spyScanners.map(s => s.toString())}
                                >
                                    {scanners.map((scanner, idx) => {
                                        return (
                                            <option
                                                key={`scanner-${idx.toString()}`}
                                                value={scanner.id}
                                            >{scanner.name} ({scanner.protocol})</option>
                                        )
                                    })}
                                </select>
                            </>
                        ) : (
                            <p>No scanners found.</p>
                        )}
                    </div>
                    
                    <h2>VMS</h2>
                    <div>
                        {vms.length > 0 ? (
                            <>
                                <select
                                    onChange={(e) => {
                                        const opts = Array.from(e.target.selectedOptions, option => Number(option.value));

                                        setSpyVms(opts);
                                    }}
                                    multiple={true}
                                    value={spyVms.map(s => s.toString())}
                                >
                                    {vms.map((vms, idx) => {
                                        return (
                                            <option
                                                key={`vms-${idx.toString()}`}
                                                value={vms.id}
                                            >{vms.name} ({vms.id.toString()})</option>
                                        )
                                    })}
                                </select>
                            </>
                        ) : (
                            <p>No VMS found.</p>
                        )}
                    </div>

                    <h2>Remove Inactive</h2>
                    <div className="flex flex-row">
                        <Switch
                            onChange={() => {
                                setRemoveInactive(!removeInactive);
                            }}
                            value={removeInactive}
                        />
                        <label htmlFor="removeInactive">Enabled</label>
                    </div>
                    <div>
                        <label htmlFor="removeInactiveTime">Inactive Time</label>
                        <Field name="removeInactiveTime" />
                    </div>
                    <div>
                        <label htmlFor="removeInactiveInterval">Interval</label>
                        <Field name="removeInactiveInterval" />
                    </div>
                    <div>
                        <label htmlFor="removeInactiveTimeout">Timeout</label>
                        <Field name="removeInactiveTimeout" />
                    </div>
                    <h2>Remove Duplicates</h2>
                    <div className="flex flex-row">
                        <Switch
                            onChange={() => {
                                setRemoveDups(!removeDups);
                            }}
                            value={removeDups}
                        />
                        <label htmlFor="removeDups">Enabled</label>
                    </div>
                    <div>
                        <label htmlFor="removeDupsInterval">Interval</label>
                        <Field name="removeDupsInterval" />
                    </div>
                    <div>
                        <label htmlFor="removeDupsLimit">Limit</label>
                        <Field name="removeDupsLimit" />
                    </div>
                    <div>
                        <label htmlFor="removeDupsMaxServers">Max Servers</label>
                        <Field name="removeDupsMaxServers" />
                    </div>
                    <div>
                        <label htmlFor="removeDupsTimeout">Timeout</label>
                        <Field name="removeDupsTimeout" />
                    </div>
                    <h2>Remove Timed Out</h2>
                    <div className="flex flex-row">
                        <Switch
                            onChange={() => {
                                setRemoveTimedOut(!removeTimedOut);
                            }}
                            value={removeTimedOut}
                        />
                        <label htmlFor="removeTimedOut">Enabled</label>
                    </div>
                    <div>
                        {platforms.length > 0 ? (
                            <>
                                <select
                                    onChange={(e) => {
                                        const opts = Array.from(e.target.selectedOptions, option => Number(option.value));

                                        setRemoveTimedOutPlatforms(opts);
                                    }}
                                    multiple={true}
                                    value={removeTimedOutPlatforms.map(s => s.toString())}
                                >
                                    {platforms.map((platform, idx) => {
                                        return (
                                            <option
                                                key={`platform-${idx.toString()}`}
                                                value={platform.id}
                                            >{platform.name}</option>
                                        )
                                    })}
                                </select>
                            </>
                        ) : (
                            <p>No platforms found.</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="removeTimedOutInterval">Interval</label>
                        <Field name="removeTimedOutInterval" />
                    </div>
                    <div>
                        <label htmlFor="removeTimedOutTime">Timeout Time</label>
                        <Field name="removeTimedOutTime" />
                    </div>
                    <div>
                        <label htmlFor="removeTimedOutTimeout">Timeout</label>
                        <Field name="removeTimedOutTimeout" />
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="button button-primary"
                        >{spy ? "Save Spy" : "Add Spy"}!</button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}