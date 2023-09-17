import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedPlatforms() {
    const csgo = await prisma.platform.create({
        data: {
            flags: ["A2S"],
            banner: "/platforms/1_banner.png",
            icon: "/platforms/1_icon.png",
            url: "csgo",
            name: "Counter-Strike: Global Offensive",
            nameShort: "CS:GO",
            description: "The game CS:GO."
        }
    });

    const tf2 = await prisma.platform.create({
        data: {
            flags: ["A2S"],
            banner: "/platforms/2_banner.png",
            icon: "/platforms/2_icon.png",
            url: "tf2",
            name: "Team Fortress 2",
            nameShort: "TF2",
            description: "The game TF2!"
        }
    });

    const gmod = await prisma.platform.create({
        data: {
            flags: ["A2S"],
            banner: "/platforms/3_banner.png",
            icon: "/platforms/3_icon.png",
            url: "gmod",
            name: "Garry's Mod",
            nameShort: "GMod",
            description: "The game Garry's Mod!"
        }
    });

    const rust = await prisma.platform.create({
        data: {
            flags: ["A2S"],
            banner: "/platforms/4_banner.png",
            icon: "/platforms/4_icon.png",
            url: "rust",
            name: "Rust",
            description: "The game Rust!"
        }
    });

    const css = await prisma.platform.create({
        data: {
            flags: ["A2S"],
            banner: "/platforms/5_banner.png",
            icon: "/platforms/5_icon.png",
            url: "css",
            name: "Counter-Strike: Source",
            nameShort: "CS:S",
            description: "The game Counter-Strike: Source!"
        }
    })

    const discord = await prisma.platform.create({
        data: {
            flags: ["DISCORD"],
            banner: "/platforms/6_banner.png",
            icon: "/platforms/6_icon.png",
            url: "discord",
            name: "Discord",
            description: "A globally used program for voice and chat communcations."
        }
    });

    console.log({ csgo, tf2, gmod, rust, css, discord });
}

async function seedCategories() {
    const vanilla = await prisma.category.create({
        data: {
            banner: "/categories/1_banner.png",
            icon: "/categories/1_icon.png",
            url: "vanilla",
            name: "Vanilla",
            description: "Vanilla/stock game modes and types."
        }
    });

    const cp = await prisma.category.create({
        data: {
            banner: "/categories/2_banner.png",
            icon: "/categories/2_icon.png",
            url: "cp",
            name: "Control Point",
            description: "Control point game mode."
        }
    });

    const ctf = await prisma.category.create({
        data: {
            banner: "/categories/3_banner.png",
            icon: "/categories/3_icon.png",
            url: "ctf",
            name: "Capture The Flag",
            description: "Capture the flag game mode."
        }
    });

    const zombies = await prisma.category.create({
        data: {
            banner: "/categories/4_banner.png",
            icon: "/categories/4_icon.png",
            url: "zombies",
            name: "Zombies",
            description: "All game modes related to zombies and infected."
        }
    });

    const zEscape = await prisma.category.create({
        data: {
            parentId: 4,
            banner: "/categories/5_banner.png",
            icon: "/categories/5_icon.png",
            url: "escape",
            name: "Escape",
            description: "Zombie escape game mode!"
        }
    });

    console.log({ vanilla, cp, ctf, zombies, zEscape });
}

async function seedServers() {
    const INTERNAL_IP1 = "10.60.0.192";
    const INTERNAL_IP2 = "10.60.0.193";

    const server1 = await prisma.server.create({
        data: {
            url: "cm1-goze",
            ip: INTERNAL_IP1,
            port: 27015,
            hostName: "cm1-goze1.bestservers.io",

            platformId: 1,
            categoryId: 5,

            name: "[CM1] 24/7 Zombie Escape | No Lag",
            descriptionShort: "CM1's new zombie escape server!",
            description: "CM1's new zombie escape server!",
            features: "new features!",
            rules: "New rules!",

            online: true,
            curUsers: 47,
            maxUsers: 64,
            mapName: "ze_racetofinish_v3",
            avgUsers: 45,

            locationLat: 47.3232312321,
            locationLon: 10.12321321351
        }
    });

    const server2 = await prisma.server.create({
        data: {
            url: "cm1-god2",
            ip: INTERNAL_IP1,
            port: 27016,
            hostName: "cm1-god2.bestservers.io",

            platformId: 1,
            categoryId: 1,

            name: "[CM1] 24/7 Dust2 | No Autos/Awps | No Lag",
            descriptionShort: "CM1's new 24/7 Dust2 server with no autos/awps allowed!",
            description: "CM1's new 24/7 Dust2 server!",
            features: "new features!",
            rules: "New rules!",

            online: true,
            curUsers: 13,
            maxUsers: 24,
            mapName: "de_dust2",
            avgUsers: 5,

            locationLat: 47.3232312321,
            locationLon: 10.12321321351
        }
    });

    const server3 = await prisma.server.create({
        data: {
            url: "cm2-2fort",
            ip: INTERNAL_IP2,
            port: 27015,
            hostName: "cm2-2fort.bestservers.io",

            platformId: 2,
            categoryId: 1,

            name: "[CM2] 24/7 2Fort | Instant Respawn | No Lag",
            descriptionShort: "CM2's new 24/7 2Fort server with instant respawn!",
            description: "CM1's new 24/7 2Fort server!",
            features: "new features!",
            rules: "New rules!",

            online: true,
            curUsers: 13,
            maxUsers: 32,
            mapName: "ctf_2fort",
            avgUsers: 15,

            locationLat: 23.3233172346,
            locationLon: -2.91827312312
        }
    });

    const server4 = await prisma.server.create({
        data: {
            url: "cm2-cp",
            ip: INTERNAL_IP2,
            port: 27016,
            hostName: "cm2-cp.bestservers.io",

            platformId: 2,
            categoryId: 1,

            name: "[CM2] Control Point Rotation | Stock | No Lag",
            descriptionShort: "CM2's Control Point rotation server with stock settings.",
            description: "CM1's new Control Point rotation server!",
            features: "new features!",
            rules: "New rules!",

            online: true,
            curUsers: 23,
            maxUsers: 24,
            mapName: "cp_dustbowl",
            avgUsers: 20,

            locationLat: 23.3233172346,
            locationLon: -2.91827312312
        }
    });

    console.log({ server1, server2, server3, server4 });
}

async function main() {
    await seedPlatforms();

    await seedCategories();

    await seedServers();
}
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch (async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    })