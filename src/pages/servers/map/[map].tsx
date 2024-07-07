import Meta from "@components/Meta"
import Wrapper from "@components/Wrapper"
import ServerBrowser from "@components/servers/Browser"
import { type GetServerSidePropsContext } from "next"

export default function Page ({
    mapName
} : {
    mapName?: string
}) {
    return (
        <>
            <Meta

            />
            <Wrapper>
                <h1>Servers Running Map {mapName ?? "N/A"}</h1>
                <ServerBrowser
                    preFilterMapName={mapName}
                    table={true}
                />
            </Wrapper>
        </>
    )
}

export function getServerSideProps(ctx: GetServerSidePropsContext) {
    const { params } = ctx;

    const mapName = params?.map?.toString();

    return {
        props: {
            mapName: mapName ?? null
        }
    }
}