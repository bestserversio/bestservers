import { prisma } from "@server/db";

import Meta from "@components/Meta";
import Wrapper from "@components/Wrapper";
import NotFound from "@components/statements/NotFound";

import { type GetServerSidePropsContext } from "next";
import { type CategoryWithChildrenAndParent } from "~/types/Category";

export default function Page({
    category
} : {
    category?: CategoryWithChildrenAndParent
}) {
    return (
        <>
            <Meta
            
            />
            <Wrapper>
                {category ? (
                    <div>
                        <h1>Viewing Category {category.name}</h1>
                    </div>
                ) : (
                    <NotFound item="category" />
                )}
            </Wrapper>
        </>
    );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const { params } = ctx;

    const catUrl1 = params?.url?.[0]?.toString();
    const catUrl2 = params?.url?.[1]?.toString();

    let category: CategoryWithChildrenAndParent | null = null;

    if (!catUrl2) {
        category = await prisma.category.findFirst({
            include: {
                parent: true,
                children: true
            },
            where: {
                url: catUrl1,
                parent: null
            }
        });
    } else if (catUrl1) {
        category = await prisma.category.findFirst({
            include: {
                parent: true,
                children: true
            },
            where: {
                url: catUrl2,

                parent: {
                    url: catUrl1
                }
            }
        });
    }
    
    return {
        props: {
            category: category
        }
    };
}