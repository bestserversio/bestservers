import { UserRole } from "@prisma/client";
import { Session } from "next-auth";

export function isMod (
    session?: Session | null
): boolean {
    if (session && (session.user.role === UserRole.ADMIN || session.user.role === UserRole.MODERATOR))
        return true;

    return false;
}

export function isAdmin (
    session?: Session | null
): boolean {
    if (session && session.user.role === UserRole.ADMIN)
        return true;

    return false;
}