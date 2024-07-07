import Meta from "@components/Meta";
import Wrapper from "@components/Wrapper";
import PlatformRow from "@components/platforms/Row";
import { type Platform, PlatformFlag } from "@prisma/client";
import { prisma } from "@server/db";

export default function Page({
    games,
    coms
} : {
    games?: Platform[]
    coms?: Platform[]
}) {
    const defaultGameBanner = process.env.NEXT_PUBLIC_DEFAULT_PLATFORM_GAME_BANNER;
    const defaultComBanner = process.env.NEXT_PUBLIC_DEFAULT_PLATFORM_COM_BANNER;

    return (
        <>
            <Meta
                title="Platforms & Games - Best Servers"
                contentTitle="Platforms & Games"
            />
            <Wrapper>
                {games && games.length > 0 && (
                    <>
                        <h2>Games</h2>
                        <div className="platforms-grid">
                            {games.map((game, index) => {
                                return (
                                    <PlatformRow
                                        platform={game}
                                        defaultBanner={defaultGameBanner}
                                        key={`game-${index.toString()}`}
                                    />
                                );
                            })}
                        </div>
                    </>
                )}

                {coms && coms.length > 0 && (
                    <>
                        <h2>Communication Platforms</h2>
                        <div className="platforms-grid">
                            {coms.map((com, index) => {
                                return (
                                    <PlatformRow
                                        platform={com}
                                        defaultBanner={defaultComBanner}
                                        key={`com-${index.toString()}`}
                                    />
                                );
                            })}
                        </div>
                    </>
                )}
            </Wrapper>
        </>
    );
}

export async function getServerSideProps() {
    const games = await prisma.platform.findMany({
        where: {
            flags: {
                hasSome: [
                    PlatformFlag.A2S
                ]
            }
        }
    });

    const coms = await prisma.platform.findMany({
        where: {
            flags: {
                hasSome: [
                    PlatformFlag.DISCORD,
                    PlatformFlag.TEAMSPEAK3
                ]
            }
        }
    });

    return {
        props: {
            games: games,
            coms: coms
        }
    }
}