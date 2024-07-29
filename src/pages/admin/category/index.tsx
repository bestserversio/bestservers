import { type GetServerSidePropsContext } from "next";

import { getServerAuthSession } from "@server/auth";

import Wrapper from "@components/Wrapper";
import NoPermissions from "@components/statements/NoPermissions";

import { isMod } from "@utils/auth";
import Meta from "@components/Meta";
import AdminMenu from "@components/admin/Menu";
import { type CategoryWithChildren } from "~/types/Category";
import { prisma } from "@server/db";
import { type Category } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { api } from "@utils/api";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { NotiCtx } from "@pages/_app";

export default function Page ({
    authed,
    categories 
} : {
    authed: boolean
    categories: CategoryWithChildren[]
}) {
    return (
        <>
            <Meta
                title={`${authed ? `Admin - Categories` : "No Permission"} - Best Servers`}
            />
            <Wrapper>
                {authed ? (
                    <AdminMenu current="categories">
                        <div className="flex flex-col gap-2">
                            <h1>Categories</h1>
                            <div>
                                {categories.length > 0 ? (
                                    <table className="table table-auto w-full">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {categories.map((category, idx) => {
                                                return (
                                                    <ParentRow
                                                        key={`pr-${idx.toString()}`}
                                                        category={category}
                                                    />
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>No categories found.</p>
                                )}
                            </div>
                            <div className="flex justify-center">
                                <Link
                                    href="/admin/category/add"
                                    className="button button-primary"
                                >Add Category!</Link>
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

function ParentRow({
    category
} : {
    category: CategoryWithChildren
}) {
    const [showChildren, setShowChildren] = useState(false);

    return (
        <>
            <tr>
                <CategoryInfo
                    category={category}
                    setShowChildren={setShowChildren}
                    showChildren={showChildren}
                    childrenCnt={category.children.length}
                />
            </tr>
            {(category.children.length > 0 && showChildren) && (
                <>
                    {category.children.map((child, idx) => {
                        return (
                            <ChildRow
                                key={`cr-${idx.toString()}`}
                                category={child}
                            />
                        )
                    })}
                </>
            )}
        </>
    )
}

function ChildRow({
    category
} : {
    category: Category
}) {
    return (
        <tr>
            <CategoryInfo category={category} />
        </tr>
    )
}

function CategoryInfo({
    category,
    showChildren = false,
    setShowChildren,
    childrenCnt = 0
} : {
    category: CategoryWithChildren | Category
    showChildren?: boolean
    setShowChildren?: Dispatch<SetStateAction<boolean>>
    childrenCnt?: number
}) {
    const notiCtx = useContext(NotiCtx);

    const uploadPath = process.env.NEXT_PUBLIC_UPLOADS_URL ?? "";

    let icon = "/images/default_icon.png";

    if (category.icon)
        icon = uploadPath + category.icon;

    const editUrl = `/admin/category/edit/${category.id.toString()}`;
    const deleteMut = api.categories.delete.useMutation({
        onError: (opts) => {
            const { message } = opts;

            notiCtx?.addNoti({
                type: "Error",
                title: `Failed To Delete Category '${category.name}'`,
                msg: `Failed to delete category '${category.name}' due to error. Error: ${message}`
            })
        },
        onSuccess: () => {
            notiCtx?.addNoti({
                type: "Success",
                title: `Deleted Category '${category.name}'!`,
                msg: `Successfully deleted category '${category.name}'!`
            })
        }
    });

    return (
        <>
            <td className="w-8">
                <Image
                    src={icon}
                    height={32}
                    width={32}
                    alt="Category Icon"
                />
            </td>
            <td>
                <span>{category.name}</span>
            </td>
            <td>
                <div className="flex gap-2">
                    <Link
                        href={editUrl}
                        className="button button-primary"
                    >Edit</Link>
                    <button
                        onClick={() => {
                            const yes = confirm("Are you sure you want to delete this category?");

                            if (yes) {
                                deleteMut.mutate({
                                    id: category.id
                                });
                            }
                        }}
                        className="button button-danger"
                    >Delete</button>
                    {(setShowChildren && childrenCnt > 0) && (
                        <button
                            onClick={() => setShowChildren(!showChildren)}
                            className="button button-secondary"
                        >{showChildren ? "Hide Children" : "Show Children"}</button>
                    )}
                </div>
            </td>
        </> 
    )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const session = await getServerAuthSession(ctx);

    const authed = isMod(session);
    let categories: CategoryWithChildren[] = [];

    if (authed) {
        categories = await prisma.category.findMany({
            where: {
                parent: null
            },
            include: {
                children: true
            }
        })
    }

    return {
        props: {
            authed: authed,
            categories: categories
        }
    }
}