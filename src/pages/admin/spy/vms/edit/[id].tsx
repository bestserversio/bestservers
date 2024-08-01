import { type GetServerSidePropsContext } from "next";

import { getServerAuthSession } from "@server/auth";

import Wrapper from "@components/Wrapper";
import NoPermissions from "@components/statements/NoPermissions";

import { isAdmin } from "@utils/auth";
import Meta from "@components/Meta";
import AdminMenu from "@components/admin/Menu";
import { Platform, Spy, SpyScanner } from "@prisma/client";
import { prisma } from "@server/db";
import ScannerForm from "@components/spy/forms/Scanner";
import NotFound from "@components/statements/NotFound";
import { ScannerWithRelations, VmsWithRelations } from "~/types/Spy";
import { ContentItem2 } from "@components/Content";
import VmsForm from "@components/spy/forms/Vms";

export default function Page ({
    authed,
    platforms,
    vms
} : {
    authed: boolean
    platforms: Platform[]
    vms?: VmsWithRelations
}) {
    return (
        <>
            <Meta
                title={`${authed ? `Admin - Editing Spy VMS ${vms?.name ?? "N/A"}` : "No Permission"} - Best Servers`}
            />
            <Wrapper>
                {authed ? (
                    <AdminMenu current="spy">
                        {vms ? (
                            <ContentItem2 title={`Editing VMS - ${vms?.name ?? "N/A"}!`}>
                                <VmsForm
                                    platforms={platforms}
                                    vms={vms}
                                />
                            </ContentItem2>
                        ) : (
                            <NotFound item="spy VMS" />
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
    const session = await getServerAuthSession(ctx);

    const { params } = ctx;
    const id = params?.id?.toString();

    const authed = isAdmin(session);

    let platforms: Platform[] = [];
    let vms: VmsWithRelations | null = null;

    if (authed && id) {
        platforms = await prisma.platform.findMany();
        
        vms = await prisma.spyVms.findFirst({
            where: {
                id: Number(id)
            },
            include: {
                platforms: true
            }
        })
    }

    return {
        props: {
            authed: authed,
            platforms: platforms,
            vms: vms
        }
    }
}