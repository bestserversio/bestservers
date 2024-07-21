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
            <div className="bg-shade-2/70 p-4 rounded-sm [&_a]:!text-cyan-400 [&_a:link]:!text-cyan-400 [&_a:hover]:!text-cyan-200 [&_p]:mb-4">
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
            <div className="[&_p]:mb-4 [&_a]:!text-cyan-400 [&_a:link]:!text-cyan-400 [&_a:hover]:!text-cyan-200">
                {children}
            </div>
        </div>
    )
}
