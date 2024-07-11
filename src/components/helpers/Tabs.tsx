import { ContentItem1 } from "@components/Content";
import Link from "next/link";
import React from "react";

export type TabItemT = {
    label: JSX.Element | string
    link: string
    newTab?: boolean
    className?: string
    active?: boolean
};

export function TabsMenu({
    items,
    className,
    children
} : {
    items: TabItemT[]
    className?: string
    children: React.ReactNode
}) {
    return (
        <div className={`${className ?? ""} flex flex-wrap gap-4`}>
            <div className="w-full sm:w-48">
                <ul className="flex flex-col gap-2 [&>a]:p-4 [&>a]:rounded-md [&>a]:bg-shade-5/70 [&>a:hover]:bg-shade-6/70 [&>a]:text-gray-200">
                    {items.map((item, idx) => {
                        return (
                            <TabItem
                                key={`ti-${idx.toString()}`}
                                item={item}
                            />
                        )
                    })}
                </ul>
            </div>
            <ContentItem1 className="grow">
                {children}
            </ContentItem1>
        </div>
    )
}

export function TabItem({
    item
} : {
    item: TabItemT
}) {
    return (
        <Link
            href={item.link}
            target={item.newTab ? "_blank" : undefined}
            className={`${item.className ?? ""} ${item.active ? "text-white !bg-shade-7/70" : ""}`}
        >
            {item.label}
        </Link>

    )
}