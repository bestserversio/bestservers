import Meta from "@components/Meta";
import Wrapper from "@components/Wrapper";
import { type Server } from "@prisma/client";

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
                <span>Placeholder. {server?.name ?? ""}</span>
            </Wrapper>
        </>
    );
}

export function getServerSideProps () {
    return {
        props: {

        }
    }
}