import { type GetServerSidePropsContext } from "next";

import { getServerAuthSession } from "@server/auth";

import Wrapper from "@components/Wrapper";
import NoPermissions from "@components/statements/NoPermissions";

import { isAdmin } from "@utils/auth";
import PlatformForm from "@components/platforms/forms/Main";
import AdminMenu from "@components/admin/Menu";
import { ContentItem2 } from "@components/Content";

export default function Page ({
    authed    
} : {
    authed: boolean
}) {
    return (
        <>
            <Wrapper>
                {authed ? (
                    <AdminMenu current="platforms">
                        <ContentItem2 title="Add Platform!">
                            <PlatformForm />
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

    const authed = isAdmin(session);

    return {
        props: {
            authed: authed
        }
    }
}