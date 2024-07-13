import { type Prisma } from "@prisma/client";

export type SpyWithRelations = Prisma.SpyGetPayload<{
    include: {
        vmsPlatforms: true,
        scanners: true
    }
}>

export type ScannerWithRelations = Prisma.SpyScannerGetPayload<{
    include: {
        platforms: true
    }
}>