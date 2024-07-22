import React from "react"

export function ContentItem1({
    title,
    className,
    children
} : {
    title?: string
    className?: string
    children: React.ReactNode
}) {
    return (
        <div className={`${className ?? ""} flex flex-col gap-2`}>
            {title && (
                <h1>{title}</h1>
            )}
            <div className="bg-shade-2/70 text-sm p-4 rounded-sm [&_p_a]:!text-cyan-400 [&_p_a:link]:!text-cyan-400 [&_p_a:hover]:!text-cyan-200 [&_p]:mb-4">
                {children}
            </div>
        </div>
    )
}

export function ContentItem2({
    title,
    className,
    children
} : {
    title?: string
    className?: string
    children: React.ReactNode
}) {
    return (
        <div className={`${className ?? ""} flex flex-col gap-2`}>
            {title && (
                <h1>{title}</h1>
            )}
            <div className="[&_p]:mb-4 text-sm [&_p_a]:!text-cyan-400 [&_p_a:link]:!text-cyan-400 [&_p_a:hover]:!text-cyan-200">
                {children}
            </div>
        </div>
    )
}
