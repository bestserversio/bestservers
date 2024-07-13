import { type GetServerSidePropsContext } from "next";

import { getServerAuthSession } from "@server/auth";

import Wrapper from "@components/Wrapper";
import NoPermissions from "@components/statements/NoPermissions";

import { isAdmin } from "@utils/auth";
import Meta from "@components/Meta";
import AdminMenu from "@components/admin/Menu";
import { Platform } from "@prisma/client";
import { prisma } from "@server/db";
import ScannerForm from "@components/spy/forms/Scanner";
import { ContentItem2 } from "@components/Content";

export default function Page ({
    authed,
    platforms
} : {
    authed: boolean
    platforms: Platform[]
}) {
    return (
        <>
            <Meta

            />
            <Wrapper>
                {authed ? (
                    <AdminMenu current="spy">
                        <ContentItem2 title="Add Spy Scanner!">
                            <ScannerForm platforms={platforms} />
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

    let platforms: Platform[] = [];

    if (authed)
        platforms = await prisma.platform.findMany();

    return {
        props: {
            authed: authed,
            platforms: platforms,
        }
    }
}