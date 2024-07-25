import Switch from "@components/helpers/Switch";
import { NotiCtx } from "@pages/_app";
import { ApiKey, Platform, SpyScanner, type Spy } from "@prisma/client";
import { api } from "@utils/api";
import { Field, Form, Formik } from "formik";
import { useContext, useState } from "react";
import { SpyWithRelations } from "~/types/Spy";

export default function SpyForm ({
    spy,
    apiKeys = [],
    platforms = [],
    scanners = []
} : {
    spy?: SpyWithRelations
    apiKeys?: ApiKey[]
    platforms?: Platform[]
    scanners?: SpyScanner[]
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

    const [vmsEnabled, setVmsEnabled] = useState(spy?.vmsEnabled ?? true);
    const [vmsRecvOnly, setVmsRecvOnly] = useState(spy?.vmsRecvOnly ?? false);
    const [vmsExcludeEmpty, setVmsExcludeEmpty] = useState(spy?.vmsExcludeEmpty ?? true);
    const [vmsSubBots, setVmsSubBots] = useState(spy?.vmsSubBots ?? false);
    const [vmsPlatforms, setVmsPlatforms] = useState<number[]>(spy?.vmsPlatforms.map(p => p.id) ?? []);
    const [vmsAddOnly, setVmsAddOnly] = useState(spy?.vmsAddOnly ?? false);
    const [vmsRandomApps, setVmsRandomApps] = useState(spy?.vmsRandomApps ?? false);

    const [removeInactive, setRemoveInactive] = useState(spy?.removeInactive ?? false);

    const [webApiEnabled, setWebApiEnabled] = useState(spy?.webApiEnabled ?? false);

    return (
        <Formik
            initialValues={{
                host: spy?.host ?? "",
                verbose: spy?.verbose ?? "",
                keyId: spy?.keyId ?? 0,

                apiHost: spy?.apiHost ?? "",
                apiTimeout: spy?.apiTimeout ?? "",

                webApiHost: spy?.webApiHost ?? "",
                webApiEndpoint: spy?.webApiEndpoint ?? "",
                webApiTimeout: spy?.webApiTimeout ?? "",
                webApiInterval: spy?.webApiInterval ?? "",
                
                vmsKey: spy?.vmsKey ?? "",
                vmsTimeout: spy?.vmsTimeout ?? "",
                vmsLimit: spy?.vmsLimit ?? "",
                vmsMinWait: spy?.vmsMinWait ?? "",
                vmsMaxWait: spy?.vmsMaxWait ?? "",

                removeInactiveTime: spy?.removeInactiveTime ?? "",
                removeInactiveInterval: spy?.removeInactiveInterval ?? "",
                removeInactiveTimeout: spy?.removeInactiveTimeout ?? ""
            }}
            onSubmit={(values) => {
                const { verbose, apiHost, apiTimeout, webApiHost, keyId, webApiEndpoint, webApiInterval, webApiTimeout, vmsKey, vmsTimeout, vmsLimit, vmsMinWait, vmsMaxWait, removeInactiveTime, removeInactiveInterval, removeInactiveTimeout } = values;
                
                addOrUpdateMut.mutate({
                    id: spy?.id,
                    host: values.host,
                    verbose: verbose ? Number(verbose) : undefined,
                    keyId: keyId > 0 ? Number(keyId) : null,
                    apiHost: apiHost,
                    apiTimeout: apiTimeout ? Number(apiTimeout) : undefined,
                    webApiEnabled: webApiEnabled,
                    webApiHost: webApiHost,
                    webApiEndpoint: webApiEndpoint,
                    webApiTimeout: webApiTimeout ? Number(webApiTimeout) : undefined,
                    webApiInterval: webApiInterval ? Number(webApiInterval) : undefined,
                    vmsEnabled: vmsEnabled,
                    vmsKey: vmsKey,
                    vmsTimeout: vmsTimeout ? Number(vmsTimeout) : undefined,
                    vmsLimit: vmsLimit ? Number(vmsLimit) : undefined,
                    vmsMinWait: vmsMinWait ? Number(vmsMinWait) : undefined,
                    vmsMaxWait: vmsMaxWait ? Number(vmsMaxWait) : undefined,
                    vmsRecvOnly: vmsRecvOnly,
                    vmsExcludeEmpty: vmsExcludeEmpty,
                    vmsSubBots: vmsSubBots,
                    vmsAddOnly: vmsAddOnly,
                    vmsRandomApps: vmsRandomApps,
                    vmsPlatforms: vmsPlatforms,
                    removeInactive: removeInactive,
                    removeInactiveTime: removeInactiveTime ? Number(removeInactiveTime) : undefined,
                    removeInactiveInterval: removeInactiveInterval ? Number(removeInactiveInterval) : undefined,
                    removeInactiveTimeout: removeInactiveTimeout ? Number(removeInactiveTimeout) : undefined,

                    scanners: spyScanners
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
                    
                    <h2>VMS Settings</h2>
                    <div className="flex flex-row">
                        <Switch
                            onChange={() => {
                                setVmsEnabled(!vmsEnabled);
                            }}
                            value={vmsEnabled}
                        />
                        <label htmlFor="vmsEnabled">Enabled</label>
                    </div>
                    <div>
                        <label htmlFor="vmsPlatforms">Platforms</label>
                        <select
                            onChange={(e) => {
                                const opts = Array.from(e.target.selectedOptions, option => Number(option.value));

                                setVmsPlatforms(opts);
                            }}
                            multiple={true}
                            value={vmsPlatforms.map(p => p.toString())}

                        >
                            {platforms.length > 0 && (
                                <>
                                    {platforms.map((platform, idx) => {
                                        return (
                                            <option
                                                key={`platform-${idx.toString()}`}
                                                value={platform.id}
                                            >{platform.name}</option>
                                        )
                                    })}
                                </>
                            )}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="vmsKey">Key</label>
                        <Field name="vmsKey" />
                    </div>
                    <div>
                        <label htmlFor="vmsTimeout">Timeout</label>
                        <Field name="vmsTimeout" />
                    </div>
                    <div>
                        <label htmlFor="vmsLimit">Limit</label>
                        <Field name="vmsLimit" />
                    </div>
                    <div>
                        <label htmlFor="vmsMinWait">Min Wait</label>
                        <Field name="vmsMinWait" />
                    </div>
                    <div>
                        <label htmlFor="vmsMaxWait">Max Wait</label>
                        <Field name="vmsMaxWait" />
                    </div>
                    <div className="flex flex-row">
                        <Switch
                            onChange={() => {
                                setVmsRecvOnly(!vmsRecvOnly);
                            }}
                            value={vmsRecvOnly}
                        />
                        <label htmlFor="vmsRecvOnly">Receive Only</label>
                    </div>
                    <div className="flex flex-row">
                        <Switch
                            onChange={() => {
                                setVmsExcludeEmpty(!vmsExcludeEmpty);
                            }}
                            value={vmsExcludeEmpty}
                        />
                        <label htmlFor="vmsExcludeEmpty">Exclude Empty</label>
                    </div>
                    <div className="flex flex-row">
                        <Switch
                            onChange={() => {
                                setVmsSubBots(!vmsSubBots);
                            }}
                            value={vmsSubBots}
                        />
                        <label htmlFor="vmsSubBots">Subtract Bots</label>
                    </div>
                    <div className="flex flex-row">
                        <Switch
                            onChange={() => {
                                setVmsAddOnly(!vmsAddOnly);
                            }}
                            value={vmsAddOnly}
                        />
                        <label htmlFor="vmsAddOnly">Add Only</label>
                    </div>
                    <div className="flex flex-row">
                        <Switch
                            onChange={() => {
                                setVmsRandomApps(!vmsRandomApps);
                            }}
                            value={vmsRandomApps}
                        />
                        <label htmlFor="vmsRandomApps">Random Apps</label>
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