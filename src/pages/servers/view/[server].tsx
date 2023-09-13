import Meta from "@components/Meta";
import Wrapper from "@components/Wrapper";
import { GetServerSidePropsContext } from "next";

import { type ServerPublic } from "~/types/Server";

export default function Page({
    server
} : {
    server?: ServerPublic
}) {
    return (
        <>
            <Meta

            />
            <Wrapper>
                
            </Wrapper>
        </>
    );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const { params } = ctx;

    return {
        props: {

        }
    }
}