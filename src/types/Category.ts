import { type Prisma } from "@prisma/client";

export type CategoryWithChildren = Prisma.CategoryGetPayload<{
    include: {
        children: true
    }
}>

export type CategoryWithChildrenAndParent = Prisma.CategoryGetPayload<{
    include: {
        parent: true,
        children: true
    }
}>