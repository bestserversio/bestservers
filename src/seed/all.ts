import { PrismaClient, Region } from "@prisma/client";

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
            id: 1,
            banner: "/categories/1_banner.png",
            icon: "/categories/1_icon.png",
            url: "vanilla",
            name: "Vanilla",
            description: "Vanilla/stock game modes and types."
        }
    });

    const cp = await prisma.category.create({
        data: {
            id: 2,
            banner: "/categories/2_banner.png",
            icon: "/categories/2_icon.png",
            url: "cp",
            name: "Control Point",
            description: "Control point game mode."
        }
    });

    const ctf = await prisma.category.create({
        data: {
            id: 3,
            banner: "/categories/3_banner.png",
            icon: "/categories/3_icon.png",
            url: "ctf",
            name: "Capture The Flag",
            description: "Capture the flag game mode."
        }
    });

    const ttt = await prisma.category.create({
        data: {
            id: 4,
            banner: "/categories/4_banner.png",
            icon: "/categories/4_icon.png",
            url: "ttt",
            name: "Trouble in Terrorist Town",
            description: "TTT game mode."
        }
    });

    const zombies = await prisma.category.create({
        data: {
            id: 5,
            banner: "/categories/5_banner.png",
            icon: "/categories/5_icon.png",
            url: "zombies",
            name: "Zombies",
            description: "All game modes related to zombies and infected."
        }
    });

    const zEscape = await prisma.category.create({
        data: {
            id: 6,
            parentId: 4,
            banner: "/categories/6_banner.png",
            icon: "/categories/6_icon.png",
            url: "escape",
            name: "Escape",
            description: "Zombie escape game mode!"
        }
    });

    const minigames = await prisma.category.create({
        data: {
            id: 7,
            banner: "/categories/7_banner.png",
            icon: "/categories/7_icon.png",
            url: "mg",
            name: "Minigames",
            description: "MiniGames game mode."
        }
    });

    const surf = await prisma.category.create({
        data: {
            id: 8,
            banner: "/categories/8_banner.png",
            icon: "/categories/8_icon.png",
            url: "surf",
            name: "Surf",
            description: "Surf game mode."
        }
    });

    const surfDm = await prisma.category.create({
        data: {
            id: 9,
            parentId: 8,
            banner: "/categories/9_banner.png",
            icon: "/categories/9_icon.png",
            url: "deathmatch",
            name: "Deathmatch",
            description: "Surf Deathmatch game mode."
        }
    });

    console.log({ vanilla, cp, ctf, ttt, zombies, zEscape, minigames, surf, surfDm });
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

            region: Region.NA,

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

            region: Region.NA,

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

            region: Region.EU,

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

            region: Region.EU,

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

    const server5 = await prisma.server.create({
        data: {
            url: "cm2-darkrp",
            ip: INTERNAL_IP2,
            port: 27017,
            hostName: "cm2-darkrp.bestservers.io",

            region: Region.EU,

            platformId: 3,
            categoryId: 1,

            name: "[CM2] DarkRP | Purge Timer | No Lag",
            descriptionShort: "CM2's DarkRP server.",
            description: "CM1's DarkRP server!",
            features: "new features!",
            rules: "New rules!",

            online: true,
            curUsers: 102,
            maxUsers: 127,
            mapName: "rp_downtownv49",
            avgUsers: 68,

            locationLat: 23.3233172346,
            locationLon: -2.91827312312
        }
    });

    const server6 = await prisma.server.create({
        data: {
            url: "cm2-ttt",
            ip: INTERNAL_IP2,
            port: 27018,
            hostName: "cm2-ttt.bestservers.io",

            region: Region.EU,

            platformId: 3,
            categoryId: 1,

            name: "[CM2] TTT | Fun | No Lag",
            descriptionShort: "CM2's TTT server.",
            description: "CM1's TTT server!",
            features: "new features!",
            rules: "New rules!",

            online: true,
            curUsers: 18,
            maxUsers: 24,
            mapName: "ttt_paradise",
            avgUsers: 18,

            locationLat: 23.3233172346,
            locationLon: -2.91827312312
        }
    });

    const server7 = await prisma.server.create({
        data: {
            url: "cm1-csmg",
            ip: INTERNAL_IP1,
            port: 27017,
            hostName: "cm1-csmg.bestservers.io",

            platformId: 5,
            categoryId: 7,

            region: Region.NA,

            name: "[CM1] MiniGames | Fun | No Lag",
            descriptionShort: "CM1's new MiniGames server with no autos/awps allowed!",
            description: "CM1's new MiniGames server!",
            features: "new features!",
            rules: "New rules!",

            online: true,
            curUsers: 33,
            maxUsers: 40,
            mapName: "mg_bobiii",
            avgUsers: 22,

            locationLat: 47.3232312321,
            locationLon: 10.12321321351
        }
    });

    const server8 = await prisma.server.create({
        data: {
            url: "cm1-gosurf",
            ip: INTERNAL_IP1,
            port: 27018,
            hostName: "cm1-gosurf.bestservers.io",

            region: Region.AS,

            platformId: 1,
            categoryId: 8,

            name: "[CM1] Surf Timer Beginner | Custom Timer | Rap Battles | No Lag",
            descriptionShort: "CM1's new Surf Timer server!",
            description: "CM1's new Surf Timer server!",
            features: "new features!",
            rules: "New rules!",

            online: true,
            curUsers: 64,
            maxUsers: 64,
            mapName: "surf_kitsune",
            avgUsers: 54,

            locationLat: 12.123125123,
            locationLon: 31.123213157
        }
    });

    const server9 = await prisma.server.create({
        data: {
            url: "cm1-gosurfdm",
            ip: INTERNAL_IP1,
            port: 27019,
            hostName: "cm1-gosurfdm.bestservers.io",

            region: Region.NA,

            platformId: 1,
            categoryId: 9,

            name: "[CM1] Surf Deathmatch | RPG | 100 tick | No Lag",
            descriptionShort: "CM1's new Surf Deathmatch server with RPG!",
            description: "CM1's new Surf Deathmatch server!",
            features: "new features!",
            rules: "New rules!",

            online: true,
            curUsers: 15,
            maxUsers: 36,
            mapName: "surf_10x_reloaded",
            avgUsers: 17,

            locationLat: 47.3232312321,
            locationLon: 10.12321321351
        }
    });

    const server10 = await prisma.server.create({
        data: {
            url: "cm1-rustvan",
            ip: INTERNAL_IP1,
            port: 28015,
            hostName: "cm1-rustvan.bestservers.io",

            region: Region.SA,

            platformId: 4,
            categoryId: 1,

            name: "[CM1] Vanilla | Active Admins | No Lag",
            descriptionShort: "CM1's new Rust Vanilla server!",
            description: "CM1's new Rust Vanilla server!",
            features: "new features!",
            rules: "New rules!",

            online: true,
            curUsers: 213,
            maxUsers: 350,
            mapName: "defaultmap",
            avgUsers: 99,

            locationLat: 47.3232312321,
            locationLon: 10.12321321351
        }
    });

    const server11 = await prisma.server.create({
        data: {
            url: "cm2-rust10x",
            ip: INTERNAL_IP2,
            port: 28015,
            hostName: "cm2-rustvan.bestservers.io",

            region: Region.EU,

            platformId: 4,
            categoryId: 1,

            name: "[CM2] 10x | Active Admins | No Lag",
            descriptionShort: "CM2's new Rust Vanilla server!",
            description: "CM2's new Rust Vanilla server!",
            features: "new features!",
            rules: "New rules!",

            online: true,
            curUsers: 130,
            maxUsers: 200,
            mapName: "customMap",
            avgUsers: 120,

            locationLat: 47.3232312321,
            locationLon: 10.12321321351
        }
    });

    const server12 = await prisma.server.create({
        data: {
            url: "cm1-csjb",
            ip: INTERNAL_IP1,
            port: 27020,
            hostName: "cm1-csjb.bestservers.io",

            region: Region.NA,

            platformId: 5,

            name: "[CM1] Jailbreak | 800 tick | No Lag",
            descriptionShort: "CM1's new Jailbreak server with RPG!",
            description: "CM1's new Jailbreak server!",
            features: "new features!",
            rules: "New rules!",

            online: true,
            curUsers: 52,
            maxUsers: 54,
            mapName: "jb_allaround",
            avgUsers: 17,

            locationLat: 47.3232312321,
            locationLon: 10.12321321351
        }
    });

    const server13 = await prisma.server.create({
        data: {
            url: "cm1-csd2",
            ip: INTERNAL_IP1,
            port: 27021,
            hostName: "cm1-csd2.bestservers.io",

            region: Region.NA,

            platformId: 5,
            categoryId: 1,

            name: "[CM1] Dust2 | 800 tick | No Lag",
            descriptionShort: "CM1's new Dust2 server with RPG!",
            description: "CM1's new Dust2 server!",
            features: "new features!",
            rules: "New rules!",

            online: true,
            curUsers: 32,
            maxUsers: 32,
            mapName: "de_dust2",
            avgUsers: 30,

            locationLat: 47.3232312321,
            locationLon: 10.12321321351
        }
    });

    const server14 = await prisma.server.create({
        data: {
            url: "cm1-tfdodgeball",
            ip: INTERNAL_IP1,
            port: 27022,
            hostName: "cm1-tfdodgeball.bestservers.io",

            region: Region.NA,

            platformId: 2,
            categoryId: 1,

            name: "[CM1] Dodgeball | No Lag",
            descriptionShort: "CM1's new Dodgeball server with RPG!",
            description: "CM1's new Dodgeball server!",
            features: "new features!",
            rules: "New rules!",

            online: true,
            curUsers: 32,
            maxUsers: 32,
            mapName: "db_space",
            avgUsers: 10,

            locationLat: 47.3232312321,
            locationLon: 10.12321321351
        }
    });

    const server15 = await prisma.server.create({
        data: {
            url: "cm1-tfturbine",
            ip: INTERNAL_IP1,
            port: 27023,
            hostName: "cm1-tfturbine.bestservers.io",

            region: Region.NA,

            platformId: 2,
            categoryId: 1,

            name: "[CM1] 24/7 Turbine | No Lag",
            descriptionShort: "CM1's new 24/7 Turbine server with RPG!",
            description: "CM1's new Turbine server!",
            features: "new features!",
            rules: "New rules!",

            online: true,
            curUsers: 29,
            maxUsers: 32,
            mapName: "ctf_turbine",
            avgUsers: 21,

            locationLat: 47.3232312321,
            locationLon: 10.12321321351
        }
    });

    const server16 = await prisma.server.create({
        data: {
            url: "cm1-tf2ware",
            ip: INTERNAL_IP1,
            port: 27024,
            hostName: "cm1-tf2ware.bestservers.io",

            region: Region.NA,

            platformId: 2,
            categoryId: 1,

            name: "[CM1] TF2Ware Multigames | No Lag",
            descriptionShort: "CM1's new 24/7 TF2Ware multigames server with RPG!",
            description: "CM1's new 24/7 TF2ware multigames server!",
            features: "new features!",
            rules: "New rules!",

            online: true,
            curUsers: 22,
            maxUsers: 24,
            mapName: "ctf_turbine",
            avgUsers: 18,

            locationLat: 47.3232312321,
            locationLon: 10.12321321351
        }
    });

    const server17 = await prisma.server.create({
        data: {
            ip: INTERNAL_IP1,
            port: 27025,
            hostName: "cm1-echo.bestservers.io",

            region: Region.NA,

            platformId: 2,
            categoryId: 1,

            name: "[CM1 Echo] 24/7 2Fort | No Lag",
            descriptionShort: "CM1's new 24/7 2Fort server with RPG!",
            description: "CM1's new 24/7 2Fort server!",
            features: "new features!",
            rules: "New rules!",

            online: true,
            curUsers: 12,
            maxUsers: 24,
            mapName: "ctf_2fort",
            avgUsers: 18,

            locationLat: 47.3232312321,
            locationLon: 10.12321321351
        }
    });

    const server18 = await prisma.server.create({
        data: {
            ip: INTERNAL_IP1,
            port: 27026,
            hostName: "cm1-echo2.bestservers.io",

            region: Region.NA,

            platformId: 2,
            categoryId: 1,

            name: "[CM1 Echo] 24/7 2Fort #2 | No Lag",
            descriptionShort: "CM1's new 24/7 2Fort #2 server with RPG!",
            description: "CM1's new 24/7 2Fort #2 server!",
            features: "new features!",
            rules: "New rules!",

            online: true,
            curUsers: 20,
            maxUsers: 24,
            mapName: "ctf_2fort",
            avgUsers: 12,

            locationLat: 47.3232312321,
            locationLon: 10.12321321351
        }
    });

    const server19 = await prisma.server.create({
        data: {
            ip: INTERNAL_IP1,
            port: 27027,
            hostName: "cm1-echo3.bestservers.io",

            region: Region.OC,

            platformId: 2,
            categoryId: 1,

            name: "[CM1 Echo] 24/7 2Fort #3 | No Lag",
            descriptionShort: "CM1's new 24/7 2Fort #3 server with RPG!",
            description: "CM1's new 24/7 2Fort #3 server!",
            features: "new features!",
            rules: "New rules!",

            online: true,
            curUsers: 23,
            maxUsers: 24,
            mapName: "ctf_2fort",
            avgUsers: 21,

            locationLat: 47.3232312321,
            locationLon: 10.12321321351
        }
    });

    const server20 = await prisma.server.create({
        data: {
            ip: INTERNAL_IP1,
            port: 27028,
            hostName: "cm1-echo4.bestservers.io",

            region: Region.OC,

            platformId: 2,
            categoryId: 1,

            name: "[CM1 Echo] 24/7 2Fort #4 | No Lag",
            descriptionShort: "CM1's new 24/7 2Fort #4 server with RPG!",
            description: "CM1's new 24/7 2Fort #4 server!",
            features: "new features!",
            rules: "New rules!",

            online: true,
            curUsers: 19,
            maxUsers: 24,
            mapName: "ctf_2fort",
            avgUsers: 21,

            locationLat: 47.3232312321,
            locationLon: 10.12321321351
        }
    });

    const server21 = await prisma.server.create({
        data: {
            ip: INTERNAL_IP1,
            port: 27029,
            hostName: "cm1-echo5.bestservers.io",

            region: Region.AF,

            platformId: 2,
            categoryId: 1,

            name: "[CM1 Echo] 24/7 2Fort #5 | No Lag",
            descriptionShort: "CM1's new 24/7 2Fort #5 server with RPG!",
            description: "CM1's new 24/7 2Fort #5 server!",
            features: "new features!",
            rules: "New rules!",

            online: true,
            curUsers: 24,
            maxUsers: 24,
            mapName: "ctf_2fort",
            avgUsers: 23,

            locationLat: 47.3232312321,
            locationLon: 10.12321321351
        }
    });

    console.log({ server1, server2, server3, server4, server5, server6, server7, server8, server9, server10, server11, server12, server13, server14, server15, server16 });
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