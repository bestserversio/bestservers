import { type GetServerSidePropsContext } from "next";

import { getServerAuthSession } from "@server/auth";

import Wrapper from "@components/Wrapper";
import NoPermissions from "@components/statements/NoPermissions";

import { isMod } from "@utils/auth";
import Meta from "@components/Meta";
import CategoryForm from "@components/categories/forms/Main";
import AdminMenu from "@components/admin/Menu";
import { ContentItem2 } from "@components/Content";

export default function Page ({
    authed    
} : {
    authed: boolean
}) {
    return (
        <>
            <Meta
                title={`${authed ? `Admin - Category Add` : "No Permission"} - Best Servers`}
            />
            <Wrapper>
                {authed ? (
                    <AdminMenu current="categories">
                        <ContentItem2 title="Add Category!">
                            <CategoryForm />
                        </ContentItem2>
                    </AdminMenu>
                ) : (
                    <NoPermissions />
                )}
            </Wrapper>
        </>
    );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const session = await getServerAuthSession(ctx);

    const authed = isMod(session);

    return {
        props: {
            authed: authed
        }
    }
}