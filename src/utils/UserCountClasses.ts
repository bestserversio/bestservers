const classes: Record<number, string> = {
    100: "text-red-400",
    80: "text-green-300",
    65: "text-orange-300"
}

export function RetrieveUserCountClasses(users: number, maxUsers: number): string | undefined {
    let ret: string | undefined = undefined;

    const fill = (users / maxUsers) * 100;

    for (const key in classes) {
        const c = classes[key];

        if (fill >= Number(key))
            ret = c;
    }

    return ret;
}

export function RetrieveUserFullClasses(): string | undefined {
    return classes[100];
}