import { PrismaClientInitializationError, PrismaClientKnownRequestError, PrismaClientRustPanicError, PrismaClientUnknownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";

export function ProcessPrismaError(err: unknown): [string | undefined, string | undefined] {
    if (err instanceof PrismaClientKnownRequestError)
        return [err.message, err.code];
    else if (err instanceof PrismaClientUnknownRequestError)
        return [err.message, undefined];
    else if (err instanceof PrismaClientInitializationError)
        return [err.message, err.errorCode];
    else if (err instanceof PrismaClientValidationError)
        return [err.message, undefined];
    else if (err instanceof PrismaClientRustPanicError)
        return [err.message, undefined];

    return [undefined, undefined];
}