import { type Prisma } from "@prisma/client";

export type SpyWithRelations = Prisma.SpyGetPayload<{
    include: {
        vms: true,
        scanners: true,
        removeTimedOutPlatforms: true
    }
}>

export type ScannerWithRelations = Prisma.SpyScannerGetPayload<{
    include: {
        platforms: true
    }
}>

export type VmsWithRelations = Prisma.SpyVmsGetPayload<{
    include: {
        platforms: true
    }
}>