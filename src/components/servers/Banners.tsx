import { ServerPublic } from "~/types/Server";

export default function ServerBanners({
    server,
    className
} : {
    server: ServerPublic
    className?: string
}) {
    return (
        <div className={`server-banners${className ? ` ${className}` : ``}`}>
        </div>
    )
}