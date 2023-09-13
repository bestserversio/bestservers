import Meta from "@components/Meta";
import Wrapper from "@components/Wrapper";
import NoPermissions from "@components/statements/NoPermissions";
import { type Category } from "@prisma/client";
import { isAdmin } from "@utils/auth";
import { GetServerSidePropsContext } from "next";
import { useSession } from "next-auth/react";

export default function Page({
    category
} : {
    category?: Category
}) {
    const { data: session } = useSession();

    return (
        <>
            <Meta

            />
            <Wrapper>
                {isAdmin(session) ? (
                    <p>Placeholder</p>
                ) : (
                    <NoPermissions />
                )}
            </Wrapper>
        </>
    );
}

export async function getServerSideProps (ctx: GetServerSidePropsContext) {
    const { params } = ctx;

    return {
        props: {

        }
    };
}