import { type GetServerSidePropsContext } from "next";

import { getServerAuthSession } from "@server/auth";

import Wrapper from "@components/Wrapper";
import NoPermissions from "@components/statements/NoPermissions";

import { isAdmin } from "@utils/auth";
import Meta from "@components/Meta";
import { type Platform } from "@prisma/client";
import { prisma } from "@server/db";
import Image from "next/image";
import { api } from "@utils/api";
import Link from "next/link";
import AdminMenu from "@components/admin/Menu";
import { useContext } from "react";
import { NotiCtx } from "@pages/_app";

export default function Page ({
    authed,
    platforms
} : {
    authed: boolean
    platforms?: Platform[]
}) {
    return (
        <>
            <Meta
                title={`${authed ? `Admin - Platforms` : "No Permission"} - Best Servers`}
            />
            <Wrapper>
                {authed ? (
                    <AdminMenu current="platforms">
                        <h1>Platforms</h1>
                        <div className="flex flex-col gap-2">
                            {(platforms && platforms.length > 0) ? (
                                <table className="table table-auto">
                                    <thead>
                                        <tr className="font-bold text-left">
                                            <th></th>
                                            <th>Name</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {platforms.map((platform, idx) => {
                                            return (
                                                <Row
                                                    key={`${idx.toString()}`}
                                                    platform={platform}
                                                />
                                            )
                                        })}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No platforms found.</p>
                            )}
                            <div className="flex justify-center">
                                <Link
                                    href="/admin/platform/add"
                                    className="button button-primary"
                                >
                                    Add Platform!
                                </Link>
                            </div>
                        </div>
                    </AdminMenu>
                ) : (
                    <NoPermissions />
                )}
            </Wrapper>
        </>
    );
}

function Row({
    platform
} : {
    platform: Platform
}) {
    const notiCtx = useContext(NotiCtx);

    const editLink = `/admin/platform/edit/${platform.id.toString()}`;
    const deleteMut = api.platforms.delete.useMutation({
        onError: (opts) => {
            const { message } = opts;

            notiCtx?.addNoti({
                type: "Error",
                title: `Failed To Delete Platform '${platform.name}'`,
                msg: `Failed to delete platform '${platform.name}' due to error. Error: ${message}`
            })
        },
        onSuccess: () => {
            notiCtx?.addNoti({
                type: "Success",
                title: `Deleted Platform '${platform.name}'!`,
                msg: `Successfully deleted platform '${platform.name}'!`
            })
        }
    });

    const uploadPath = process.env.NEXT_PUBLIC_UPLOADS_URL ?? "";

    return (
        <tr>
            <td className="w-8">
                {platform.icon && (
                    <Image
                        src={uploadPath + platform.icon}
                        width={24}
                        height={24}
                        alt="Platform Icon"
                        className="rounded-full"
                    />
                )}
            </td>
            <td>{platform.name}</td>
            <td>
                <div className="flex flex-wrap gap-2">
                    <Link
                        href={editLink}
                        className="button button-primary"
                    >Edit</Link>
                    <button
                        onClick={() => {
                            const yes = confirm("Are you sure you want to delete this platform?");

                            if (yes) {
                                deleteMut.mutate({
                                    id: platform.id
                                });
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

    let platforms: Platform[] | null = null;

    if (authed)
        platforms = await prisma.platform.findMany();

    return {
        props: {
            authed: authed,
            platforms: platforms
        }
    }
}