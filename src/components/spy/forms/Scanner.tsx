import Switch from "@components/helpers/Switch";
import { NotiCtx } from "@pages/_app";
import { type Platform } from "@prisma/client";
import { api } from "@utils/api";
import { Field, Form, Formik } from "formik";
import { useContext, useState } from "react";
import { type ScannerWithRelations } from "~/types/Spy";

export default function ScannerForm ({
    scanner,
    platforms = [],
} : {
    scanner?: ScannerWithRelations
    platforms?: Platform[]
}) {
    const notiCtx = useContext(NotiCtx);

    const addOrUpdateMut = api.spy.addOrUpdateScanner.useMutation({
        onError: (opts) => {
            const { message } = opts;

            console.error(message);

            notiCtx?.addNoti({
                type: "Error",
                title: `Failed To ${scanner ? "Save" : "Add"} Spy Scanner`,
                msg: `Error ${scanner ? "saving" : "adding"} Spy Scanner.`
            })
        },
        onSuccess: () => {
            notiCtx?.addNoti({
                type: "Success",
                title: `Successfully ${scanner ? "Saved" : "Added"} Spy Scanner!`,
                msg: `Successfully ${scanner ? "saved" : "added"} Spy Scanner!`
            })
        }
    });

    // Flags and booleans
    const [recvOnly, setRecvOnly] = useState(scanner?.recvOnly ?? false);
    const [subBots, setSubBots] = useState(scanner?.subBots ?? false);
    const [a2sPlayer, setA2sPlayer] = useState(scanner?.a2sPlayer ?? true)
    const [randomPlatforms, setRandomPlatforms] = useState(scanner?.randomPlatforms ?? false);

    const [scannerPlatforms, setScannerPlatforms] = useState<number[]>(scanner?.platforms.map(s => s.id) ?? []);

    return (
        <Formik
            initialValues={{
                name: scanner?.name ?? "",
                protocol: scanner?.protocol ?? "A2S",
                minWait: scanner?.minWait ?? "",
                maxWait: scanner?.maxWait ?? "",
                limit: scanner?.limit ?? "",
                queryTimeout: scanner?.queryTimeout ?? "",
                visibleSkipCount: scanner?.visibleSkipCount ?? "",
                requestDelay: scanner?.requestDelay ?? ""
            }}
            onSubmit={(values) => {
                const { name, protocol, minWait, maxWait, limit, queryTimeout, visibleSkipCount, requestDelay } = values;

                addOrUpdateMut.mutate({
                    id: scanner?.id,
                    name: name,
                    protocol: protocol,
                    minWait: minWait ? Number(minWait) : undefined,
                    maxWait: maxWait ? Number(maxWait) : undefined,
                    limit: limit ? Number(limit) : undefined,
                    recvOnly: recvOnly,
                    subBots: subBots,
                    queryTimeout: queryTimeout ? Number(queryTimeout) : undefined,
                    platforms: scannerPlatforms,
                    a2sPlayer: a2sPlayer,
                    visibleSkipCount: visibleSkipCount ? Number(visibleSkipCount) : undefined,
                    requestDelay: requestDelay ? Number(requestDelay) : undefined,

                    randomPlatforms: randomPlatforms
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
                    <div>
                        <label htmlFor="queryTimeout">Query Timeout</label>
                        <Field name="queryTimeout" />
                    </div>
                    <div>
                        <label htmlFor="visibleSkipCount">Visible Skip Count</label>
                        <Field name="visibleSkipCount" />
                    </div>
                    <div>
                        <label htmlFor="requestDelay">Request Delay (MS)</label>
                        <Field name="requestDelay" />
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
                                setSubBots(!subBots);
                            }}
                            value={subBots}
                        />
                        <label htmlFor="subBots">Subtract Bots</label>
                    </div>
                    <div className="flex flex-row">
                        <Switch
                            onChange={() => {
                                setA2sPlayer(!a2sPlayer);
                            }}
                            value={a2sPlayer}
                        />
                        <label htmlFor="a2sPlayer">A2S Player</label>
                    </div>

                    <div className="flex flex-row">
                        <Switch
                            onChange={() => {
                                setRandomPlatforms(!randomPlatforms);
                            }}
                            value={randomPlatforms}
                        />
                        <label htmlFor="randomPlatforms">Random Platforms</label>
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