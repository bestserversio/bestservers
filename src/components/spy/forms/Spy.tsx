import Switch from "@components/helpers/Switch";
import { ErrorCtx, SuccessCtx } from "@pages/_app";
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
    const errorCtx = useContext(ErrorCtx);
    const successCtx = useContext(SuccessCtx);

    const addOrUpdateMut = api.spy.addOrUpdateSpy.useMutation({
        onError: (opts) => {
            const { message } = opts;

            console.error(message);

            if (errorCtx) {
                errorCtx.setTitle(`Failed To ${spy ? "Save" : "Add"} Spy Instance`);
                errorCtx.setMsg(`Error ${spy ? "saving" : "adding"} Spy Instance.`);
            }
        },
        onSuccess: () => {
            if (successCtx) {
                successCtx.setTitle(`Successfully ${spy ? "Saved" : "Added"} Spy Instance!`);
                successCtx.setMsg(`Successfully ${spy ? "saved" : "added"} Spy Instance!`)
            }
        }
    });

    const [spyScanners, setSpyScanners] = useState<number[]>(spy?.scanners.map(s => s.id) ?? []);

    const [vmsEnabled, setVmsEnabled] = useState(spy?.vmsEnabled ?? true);
    const [vmsRecvOnly, setVmsRecvOnly] = useState(spy?.vmsRecvOnly ?? false);
    const [vmsExcludeEmpty, setVmsExcludeEmpty] = useState(spy?.vmsExcludeEmpty ?? true);
    const [vmsSubBots, setVmsSubBots] = useState(spy?.vmsSubBots ?? false);
    const [vmsPlatforms, setVmsPlatforms] = useState<number[]>(spy?.vmsPlatforms.map(p => p.id) ?? []);

    return (
        <Formik
            initialValues={{
                host: spy?.host ?? "",
                verbose: spy?.verbose ?? "",
                keyId: spy?.keyId ?? 0,
                apiTimeout: spy?.apiTimeout ?? "",
                vmsKey: spy?.vmsKey ?? "",
                vmsTimeout: spy?.vmsTimeout ?? "",
                vmsLimit: spy?.vmsLimit ?? "",
                vmsMinWait: spy?.vmsMinWait ?? "",
                vmsMaxWait: spy?.vmsMaxWait ?? ""
            }}
            onSubmit={(values) => {
                const { verbose, apiTimeout, vmsKey, vmsTimeout, vmsLimit, vmsMinWait, vmsMaxWait } = values;
                addOrUpdateMut.mutate({
                    id: spy?.id,
                    host: values.host,
                    verbose: verbose ? Number(verbose) : undefined,
                    apiTimeout: apiTimeout ? Number(apiTimeout) : undefined,
                    vmsEnabled: vmsEnabled,
                    vmsKey: vmsKey,
                    vmsTimeout: vmsTimeout ? Number(vmsTimeout) : undefined,
                    vmsLimit: vmsLimit ? Number(vmsLimit) : undefined,
                    vmsMinWait: vmsMinWait ? Number(vmsMinWait) : undefined,
                    vmsMaxWait: vmsMaxWait ? Number(vmsMaxWait) : undefined,
                    vmsRecvOnly: vmsRecvOnly,
                    vmsExcludeEmpty: vmsExcludeEmpty,
                    vmsSubBots: vmsSubBots,
                    vmsPlatforms: vmsPlatforms,
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
                        <label htmlFor="vmsKey">API Key</label>
                        <select
                            name="vmsKey"
                            onChange={form.handleChange}
                            onBlur={form.handleBlur}
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