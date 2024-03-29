import { useSession } from "next-auth/react";
import { type GetServerSidePropsContext } from "next";

import { prisma } from "@server/db";
import { getServerAuthSession } from "@server/auth";

import Wrapper from "@components/Wrapper";
import NoPermissions from "@components/statements/NoPermissions";

import { isAdmin } from "@utils/auth";
import { type CategoryWithChildrenAndParent } from "~/types/Category";
import CategoryForm from "@components/categories/forms/Main";
import NotFound from "@components/statements/NotFound";
import Meta from "@components/Meta";

export default function({
    category
} : {
    category?: CategoryWithChildrenAndParent
}) {
    const { data: session } = useSession();

    return (
        <>
            <Meta

            />
            <Wrapper>
                {isAdmin(session) ? (
                    <>
                        {category ? (
                            <>
                                <h1>Edit Category {category.name}</h1>
                                <CategoryForm category={category} />
                            </>
                        ) : (
                            <NotFound item="category" />
                        )}
                    </>
                ) : (
                    <NoPermissions />
                )}
            </Wrapper>
        </>
    );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    let category: CategoryWithChildrenAndParent | null = null;

    const { params } = ctx;
    const id = params?.id?.toString();

    const session = await getServerAuthSession(ctx);

    if (isAdmin(session) && id) {
        category = await prisma.category.findFirst({
            include: {
                parent: true,
                children: true
            },
            where: {
                id: Number(id)
            }
        });
    }

    return {
        props: {
            category: category
        }
    }
}