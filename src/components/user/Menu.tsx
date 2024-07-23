import { TabItemT, TabsMenu } from "@components/helpers/Tabs"
import ServerQuickForm from "@components/servers/forms/Quick"
import { signOut } from "next-auth/react"

export default function UserMenu({
    current = "general"
} : {
    current?: string
}) {
    const tabs: TabItemT[] = [
        {
            label: <>General</>,
            link: "/account",
            active: current == "general"
        },
        {
            label: <>Servers</>,
            link: "/account/servers",
            active: current == "servers"
        }
    ]

    return (
        <TabsMenu items={tabs}>
            {current == "general" && (
                <div className="flex flex-col gap-2">
                    <p>Welcome to the account menu! We will be adding more things to this in the future.</p>
                    <div className="flex justify-center">
                        <button
                            onClick={() => signOut()}
                            className="button button-primary w-64"
                        >Sign Out!</button>
                    </div>
                </div>
            )}
            {current == "servers" && (
                <div className="flex flex-col gap-2">
                    <h2>Add Server!</h2>
                    <ServerQuickForm />
                </div>
            )}
        </TabsMenu>
    )
}