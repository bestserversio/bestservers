import { TabsMenu } from "@components/helpers/Tabs"
import React from "react"

export default function AdminMenu({
    current = "index",
    children
} : {
    current?: string
    children: React.ReactNode
}) {
    return (
        <TabsMenu
            items={[
                {
                    label: "Index",
                    link: "/admin",
                    active: current == "index"
                },
                {
                    label: "API",
                    link: "/admin/api",
                    active: current == "api"
                },
                {
                    label: "Platforms",
                    link: "/admin/platform",
                    active: current == "platforms"
                },
                {
                    label: "Categories",
                    link: "/admin/category",
                    active: current == "categories"
                },
                {
                    label: "Servers",
                    link: "/admin/server",
                    active: current == "servers"
                },
                {
                    label: "Spy",
                    link: "/admin/spy",
                    active: current == "spy"
                }
            ]}
        >
            {children}
        </TabsMenu>
    )
}