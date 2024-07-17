import Wrapper from "@components/Wrapper";
import AdminMenu from "@components/admin/Menu";
import NoPermissions from "@components/statements/NoPermissions";
import { NotiCtx } from "@pages/_app";
import { type ApiKey } from "@prisma/client";
import { getServerAuthSession } from "@server/auth";
import { prisma } from "@server/db";
import { api } from "@utils/api";
import { isAdmin } from "@utils/auth";
import { type GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useContext } from "react";

export default function Page({
    authed,
    keys
} : {
    authed: boolean
    keys?: ApiKey[]
}) {
    return (
        <Wrapper>
            {authed ? (
                <AdminMenu current="api">
                    <h1>API Keys</h1>
                    <div className="flex flex-col gap-2">
                        {(keys && keys.length > 0) ? (
                            <table className="table table-auto">
                                <thead>
                                    <tr className="font-bold text-left">
                                        <th>Host</th>
                                        <th>Endpoint</th>
                                        <th>Write Access</th>
                                        <th>Limit</th>
                                        <th>Key</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {keys.map((key, idx) => {
                                        return (
                                            <Row
                                                key={`${idx.toString()}`}
                                                apiKey={key}
                                            />
                                        )
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <p>No API keys found.</p>
                        )}
                        <div className="flex justify-center">
                            <Link
                                href="/admin/api/add"
                                className="button button-primary"
                            >Add API Key!</Link>
                        </div>
                    </div>
                </AdminMenu>
            ) : (
                <NoPermissions />
            )}
        </Wrapper>
    )
}

function Row({
    apiKey
} : {
    apiKey: ApiKey
}) {
    const notiCtx = useContext(NotiCtx);

    const editLink = `/admin/api/edit/${apiKey.id.toString()}`;
    const deleteMut = api.api.delete.useMutation({
        onError: (opts) => {
            const { message } = opts;

            notiCtx?.addNoti({
                type: "Error",
                title: `Failed To Delete API Key '${apiKey.key}'`,
                msg: `Failed to delete API key '${apiKey.key}' due to error. Error: ${message}`
            })
        },
        onSuccess: () => {
            notiCtx?.addNoti({
                type: "Success",
                title: `Deleted API Key '${apiKey.key}'!`,
                msg: `Successfully deleted API key '${apiKey.key}'!`
            })
        }
    });

    return (
        <tr>
            <td>{apiKey.host ?? ""}</td>
            <td>{apiKey.endpoint ?? ""}</td>
            <td>{apiKey.writeAccess ? "Yes" : "No"}</td>
            <td>{apiKey.limit.toString()}</td>
            <td>{apiKey.key}</td>
            <td>
                <div className="flex flex-wrap gap-2">
                    <Link
                        href={editLink}
                        className="button button-primary"
                    >Edit</Link>
                    <button
                        onClick={() => {
                            const yes = confirm("Are you sure you want to delete this API key?");

                            if (yes) {
                                deleteMut.mutate({
                                    id: apiKey.id
                                })
                            }
                        }}
                        className="button button-danger"
                    >Delete</button>
                </div>
            </td>
        </tr>
    )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const session = await getServerAuthSession(ctx);
    const authed = isAdmin(session);

    let keys: ApiKey[] | null = null;

    if (authed)
            keys = await prisma.apiKey.findMany();

    return {
        props: {
            authed: authed,
            keys: keys
        }
    }
}