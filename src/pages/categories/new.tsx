import Wrapper from "@components/Wrapper";
import CategoryForm from "@components/categories/forms/Main";
import NoPermissions from "@components/statements/NoPermissions";
import { Category } from "@prisma/client";
import { getServerAuthSession } from "@server/auth";
import { prisma } from "@server/db";
import { isAdmin } from "@utils/auth";
import { GetServerSidePropsContext } from "next";
import { useSession } from "next-auth/react";

export default function New({
    categories
} : {
    categories: Category[]
}) {
    const { data: session } = useSession();

    return (
        <Wrapper>
            {isAdmin(session) ? (
                <CategoryForm categories={categories} />
            ) : (
                <NoPermissions />
            )}
        </Wrapper>
    );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const session = await getServerAuthSession(ctx);

    const authed = isAdmin(session);

    let categories: Category[] = [];

    if (authed) {
        categories = await prisma.category.findMany();
    }
    
    return {
        props: {
            categories: categories
        }
    };
}