import { type Prisma } from "@prisma/client";

export const UserPublicSelect = {
    id: true,
    url: true,

    avatar: true,
    name: true,
    aboutMe: true
}

export type UserPublic = Prisma.UserGetPayload<{
    select: typeof UserPublicSelect
}>