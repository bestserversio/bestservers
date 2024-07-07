import { UserRole } from "@prisma/client";
import { type Session } from "next-auth";

export function isMod (
    session?: Session | null
): boolean {
    if (session && (session.user.roles.includes(UserRole.ADMIN) || session.user.roles.includes(UserRole.MODERATOR)))
        return true;

    return false;
}

export function isAdmin (
    session?: Session | null
): boolean {
    if (session && session.user.roles.includes(UserRole.ADMIN))
        return true;

    return false;
}