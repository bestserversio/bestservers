import { type GetServerSidePropsContext } from "next";

import { prisma } from "@server/db";
import { getServerAuthSession } from "@server/auth";

import Wrapper from "@components/Wrapper";
import NoPermissions from "@components/statements/NoPermissions";

import { isMod } from "@utils/auth";
import { type CategoryWithChildrenAndParent } from "~/types/Category";
import CategoryForm from "@components/categories/forms/Main";
import NotFound from "@components/statements/NotFound";
import Meta from "@components/Meta";
import AdminMenu from "@components/admin/Menu";
import { ContentItem2 } from "@components/Content";

export default function Page ({
    category,
    authed
} : {
    category?: CategoryWithChildrenAndParent
    authed: boolean
}) {
    return (
        <>
            <Meta
                title={`${authed ? `Admin - Editing Category ${category?.name ?? "N/A"}` : "No Permission"} - Best Servers`}
            />
            <Wrapper>
                {authed ? (
                    <AdminMenu current="categories">
                        {category ? (
                            <ContentItem2 title={`Editing Category - ${category.name}`}>
                                <CategoryForm category={category} />
                            </ContentItem2>
                        ) : (
                            <NotFound item="category" />
                        )}
                    </AdminMenu>
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
    const authed = isMod(session);

    if (authed && id) {
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
            category: category,
            authed: authed
        }
    }
}