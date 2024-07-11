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
            <div className="bg-shade-1/70 p-4 rounded-sm">
                {children}
            </div>
        </div>
    )
}