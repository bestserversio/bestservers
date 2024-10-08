import { prisma } from "@server/db";
import { CheckApiAccess } from "@utils/apihelpers";
import { ProcessPrismaError } from "@utils/error";
import { type NextApiRequest, type NextApiResponse } from "next";

type ApiT = {
    host?: string
    authorization?: string
    timeout?: number
}

type WebApiT = {
    enabled?: boolean
    host?: string
    endpoint?: string
    authorization?: string
    timeout?: number
    interval?: number
    save_to_fs?: boolean
}

type VmsT = {
    timeout?: number
    api_token?: string
    app_ids?: number[]
    recv_only?: boolean
    min_wait?: number
    max_wait?: number
    limit?: number
    exclude_empty?: boolean
    sub_bots?: boolean
    add_only?: boolean
    random_apps?: boolean
    set_offline?: boolean
    only_empty?: boolean
    update_limit?: number
    randomize_res?: boolean
}

type ScannerT = {
    protocol?: string
    platform_ids?: number[]
    min_wait?: number
    max_wait?: number
    limit?: number
    recv_only?: boolean
    sub_bots?: boolean
    query_timeout?: number
    a2s_player?: boolean
    random_platforms?: boolean
    visible_skip_count?: number
    request_delay?: number
}

type PlatformMapT = {
    app_id: number
    platform_id: number
}

type RemoveInactiveT = {
    enabled: boolean
    interval: number
    inactive_time: number
    timeout: number
}

type PlatformFilterT = {
    id: number
    max_cur_users?: number
    max_users?: number
    allow_user_overflow?: boolean
}

type RemoveDupsT = {
    enabled: boolean
    interval: number
    limit: number
    max_servers: number
    timeout: number
}

type RemoveTimedOutT = {
    enabled: boolean
    interval: number
    platform_ids: number[]
    timed_out_time: number
    timeout: number
}

type SpyResp = {
    verbose: number
    log_directory?: string | null

    api: ApiT
    web_api: WebApiT
    vms: VmsT[]
    scanners: ScannerT[]
    platform_maps: PlatformMapT[]
    remove_inactive: RemoveInactiveT
    bad_words: string[]
    bad_ips: string[]
    bad_asns: number[]
    good_ips: string[]
    platform_filters: PlatformFilterT[],
    remove_dups: RemoveDupsT
    remove_timed_out: RemoveTimedOutT
}

export default async function Handler (
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET") {
        return res.status(405).json({
            message: "Method not allowed."
        });
    }

    // Check if we have API access.
    const check = await CheckApiAccess({
        req: req,
        authKey: req.headers.authorization,
        endpoint: "/api/spy/get",
        writeAccess: false
    });

    if (check.code !== 200) {
        return res.status(check.code).json({
            message: check.message
        });
    }

    // Retrieve query parameters.
    const { query } = req;

    // Get host.
    let host = query?.host?.toString();

    // If host param not found, use connecting IP.
    if (!host)
        host = req.headers?.["cf-connecting-ip"]?.toString() ?? req.socket.remoteAddress;
    
    try {
        const spy = await prisma.spy.findFirst({
            where: {
                host: host
            },
            include: {
                scanners: {
                    include: {
                        platforms: true
                    }
                },
                vms: {
                    include: {
                        platforms: true
                    }
                },
                removeTimedOutPlatforms: true,
                key: true
            }
        })

        if (!spy) {
            return res.status(404).json({
                message: `Spy instance not founded for host '${host}'.`
            })
        }

        // Get bad stuff.
        const badWordsQ = await prisma.badWord.findMany();
        const badIpsQ = await prisma.badIp.findMany();
        const badAsnsQ = await prisma.badAsn.findMany();
        const goodIpsQ = await prisma.goodIp.findMany();

        // Start compiling bad stuff arrays.
        const badWords = badWordsQ.map(q => q.word)
        const badIps = badIpsQ.map(q => `${q.ip}/${q.cidr.toString()}`)
        const badAsns = badAsnsQ.map(q => q.asn)
        const goodIps = goodIpsQ.map(q => `${q.ip}/${q.cidr.toString()}`)

        // Start building API.
        const api: ApiT = {
            host: spy.apiHost,
            authorization: spy.key?.key,
            timeout: spy.apiTimeout
        }

        // Start building web API.
        const webApi: WebApiT = {
            enabled: spy.webApiEnabled,
            host: spy.webApiHost,
            endpoint: spy.webApiEndpoint,
            authorization: spy.key?.key,
            timeout: spy.webApiTimeout,
            interval: spy.webApiInterval,
            save_to_fs: spy.webApiSaveToFs
        }

        // Build remove inactive.
        const remove_inactive: RemoveInactiveT = {
            enabled: spy.removeInactive,
            interval: spy.removeInactiveInterval,
            inactive_time: spy.removeInactiveTime,
            timeout: spy.removeInactiveTimeout
        }

        // Build remove dups.
        const remove_dups: RemoveDupsT = {
            enabled: spy.removeDups,
            interval: spy.removeDupsInterval,
            limit: spy.removeDupsLimit,
            max_servers: spy.removeDupsMaxServers,
            timeout: spy.removeDupsTimeout
        }

        // Build remove timed out.
        const remove_timed_out: RemoveTimedOutT = {
            enabled: spy.removeTimedOut,
            interval: spy.removeTimedOutInterval,
            timed_out_time: spy.removeTimedOutTime,
            timeout: spy.removeTimedOutTimeout,
            platform_ids: spy.removeTimedOutPlatforms.map((p) => p.id)
        }

        // Setup scanners.
        const scanners: ScannerT[] = [];

        spy.scanners.forEach((s) => {
            // Get platform IDs.
            const platform_ids = s.platforms.map(p => p.id)

            scanners.push({
                protocol: s.protocol,
                platform_ids: platform_ids,
                min_wait: s.minWait,
                max_wait: s.maxWait,
                limit: s.limit,
                recv_only: s.recvOnly,
                sub_bots: s.subBots,
                query_timeout: s.queryTimeout,
                a2s_player: s.a2sPlayer,
                random_platforms: s.randomPlatforms,
                visible_skip_count: s.visibleSkipCount,
                request_delay: s.requestDelay
            })
        })

        // Setup VMS.
        const vms: VmsT[] = [];

        spy.vms.forEach((v) => {
            // Get app IDs.
            const app_ids = v.platforms.map(p => p.vmsId ?? 0).filter(vmsId => vmsId > 0)

            vms.push({
                api_token: v.key ?? undefined,
                timeout: v.timeout,
                limit: v.limit,
                min_wait: v.minWait,
                max_wait: v.maxWait,
                recv_only: v.recvOnly,
                exclude_empty: v.excludeEmpty,
                only_empty: v.onlyEmpty,
                sub_bots: v.subBots,
                add_only: v.addOnly,
                random_apps: v.randomApps,
                set_offline: v.setOffline,
                update_limit: v.updateLimit,
                randomize_res: v.randomizeRes,
                app_ids: app_ids
            })
        })

        // Setup platform mappings and filters.
        const platforms = await prisma.platform.findMany({
            where: {
                vmsId: {
                    gt: 0
                }
            }
        })

        const platform_maps: PlatformMapT[] = [];
        const platform_filters: PlatformFilterT[] = [];

        platforms.forEach((p) => {
            // Push VMS app ID if needed.
            if (p.vmsId) {
                platform_maps.push({
                    platform_id: p.id,
                    app_id: p.vmsId
                })
            }

            // Push filters.
            platform_filters.push({
                id: p.id,
                ...(p.maxCurUsers && {
                    max_cur_users: p.maxCurUsers
                }),
                ...(p.maxUsers && {
                    max_users: p.maxUsers
                }),
                ...(p.allowUserOverflow !== undefined && {
                    allow_user_overflow: p.allowUserOverflow
                })
            })
        })

        // Setup finaly response.
        const spyResp: SpyResp = {
            verbose: spy.verbose,
            log_directory: spy?.logDirectory ?? null,
            api: api,
            web_api: webApi,
            vms: vms,
            scanners: scanners,
            platform_maps: platform_maps,
            remove_inactive: remove_inactive,
            bad_words: badWords,
            bad_ips: badIps,
            bad_asns: badAsns,
            good_ips: goodIps,
            platform_filters: platform_filters,
            remove_dups: remove_dups,
            remove_timed_out: remove_timed_out
        }

        return res.status(200).json(spyResp);
    } catch (err) {
        console.error(err);

        const [errMsg, errCode] = ProcessPrismaError(err);

        return res.status(400).json({
            message: `Error retrieving spy instance.${errMsg ? ` Error => ${errMsg}${errCode ? ` (${errCode})` : ``}` : ``}`
        });
    }
}