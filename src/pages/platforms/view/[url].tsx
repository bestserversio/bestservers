import Meta from "@components/Meta";
import Wrapper from "@components/Wrapper";
import NotFound from "@components/statements/NotFound";
import { Platform } from "@prisma/client";
import { prisma } from "@server/db";
import { GetServerSidePropsContext } from "next";

export default function ({
    platform
} : {
    platform?: Platform
}) {
    return (
        <>
            <Meta
                title={`Viewing Platform - Best Servers`}
                contentTitle={`Platform`}
            />
            <Wrapper>
                {platform ? (
                    <>
                        <h1>{platform.name}</h1>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <div className="flex flex-col gap-4 col-span-1 sm:col-span-3">
                                <h2>Main</h2>
                            </div>
                            <div className="flex flex-col gap-4 col-span-1 sm:col-span-1">
                                <h2>Sidebar</h2>
                            </div>
                        </div>
                    </>
                ) : (
                    <NotFound item="platform" />
                )}
            </Wrapper>
        </>
    );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const { params } = ctx;

    const url = params?.url?.toString();

    let platform: Platform | null = null;

    if (url) {
        platform = await prisma.platform.findFirst({
            where: {
                url: url
            }
        });
    }

    return {
        props: {
            platform: platform
        }
    }
}