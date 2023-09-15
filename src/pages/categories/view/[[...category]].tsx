import Meta from "@components/Meta";
import Wrapper from "@components/Wrapper";
import { GetServerSidePropsContext } from "next";

export default function Page() {
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
    };
}