import Switch from "@components/helpers/Switch";
import { ErrorCtx, SuccessCtx } from "@pages/_app";
import { Platform, SpyScanner, type Spy } from "@prisma/client";
import { api } from "@utils/api";
import { Field, Form, Formik } from "formik";
import { useContext, useState } from "react";
import { ScannerWithRelations } from "~/types/Spy";

export default function ScannerForm ({
    scanner,
    platforms = [],
} : {
    scanner?: ScannerWithRelations
    platforms?: Platform[]
}) {
    const errorCtx = useContext(ErrorCtx);
    const successCtx = useContext(SuccessCtx);

    const addOrUpdateMut = api.spy.addOrUpdateScanner.useMutation({
        onError: (opts) => {
            const { message } = opts;

            console.error(message);

            if (errorCtx) {
                errorCtx.setTitle(`Failed To ${scanner ? "Save" : "Add"} Spy Scanner`);
                errorCtx.setMsg(`Error ${scanner ? "saving" : "adding"} Spy Scanner.`);
            }
        },
        onSuccess: () => {
            if (successCtx) {
                successCtx.setTitle(`Successfully ${scanner ? "Saved" : "Added"} Spy Scanner!`);
                successCtx.setMsg(`Successfully ${scanner ? "saved" : "added"} Spy Scanner!`)
            }
        }
    });

    const [recvOnly, setRecvOnly] = useState(scanner?.recvOnly ?? false);
    const [subBots, setSubBots] = useState(scanner?.subBots ?? false);
    const [scannerPlatforms, setScannerPlatforms] = useState<number[]>(scanner?.platforms.map(s => s.id) ?? []);

    return (
        <Formik
            initialValues={{
                name: scanner?.name ?? "",
                protocol: scanner?.protocol ?? "A2S",
                minWait: scanner?.minWait ?? "",
                maxWait: scanner?.maxWait ?? "",
                limit: scanner?.limit ?? ""
            }}
            onSubmit={(values) => {
                const { name, protocol, minWait, maxWait, limit } = values;

                addOrUpdateMut.mutate({
                    id: scanner?.id,
                    name: name,
                    protocol: protocol,
                    minWait: minWait ? Number(minWait) : undefined,
                    maxWait: maxWait ? Number(maxWait) : undefined,
                    limit: limit ? Number(limit) : undefined,
                    recvOnly: recvOnly,
                    subBots: subBots,
                    platforms: scannerPlatforms
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
                        <label htmlFor="protocol">Protocol</label>
                        <Field name="protocol" />
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
                        <label htmlFor="limit">Limit</label>
                        <Field name="limit" />
                    </div>

                    <h2>Platforms</h2>
                    <div>
                        {platforms.length > 0 ? (
                            <>
                                <select
                                    onChange={(e) => {
                                        const opts = Array.from(e.target.selectedOptions, option => Number(option.value));

                                        setScannerPlatforms(opts);
                                    }}
                                    multiple={true}
                                    value={scannerPlatforms.map(s => s.toString())}
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
                            <p>No scanners found.</p>
                        )}
                    </div>
                    
                    <h2>Misc</h2>
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
                                setSubBots(!subBots);
                            }}
                            value={subBots}
                        />
                        <label htmlFor="subBots">Subtract Bots</label>
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="button button-primary"
                        >{scanner ? "Save" : "Add"} Scanner!</button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}