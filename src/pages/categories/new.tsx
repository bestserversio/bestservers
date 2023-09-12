import Wrapper from "@components/Wrapper";
import CategoryForm from "@components/forms/Category";
import { Category } from "@prisma/client";
import { getServerAuthSession } from "@server/auth";
import { prisma } from "@server/db";
import { isAdmin } from "@utils/auth";
import { GetServerSidePropsContext } from "next";

export default function New({
    categories
} : {
    categories: Category[]
}) {
    return (
        <Wrapper>
            <CategoryForm categories={categories} />
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