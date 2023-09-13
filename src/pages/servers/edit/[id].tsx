import Meta from "@components/Meta";
import Wrapper from "@components/Wrapper";
import { type Server } from "@prisma/client";
import { GetServerSidePropsContext } from "next";

export default function Page({
    server
} : {
    server?: Server
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

export async function getServerSideProps (ctx: GetServerSidePropsContext) {
    const { params } = ctx;
    
    return {
        props: {

        }
    }
}