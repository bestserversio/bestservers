import { type ServerPublic } from "~/types/Server";

export default function ServerBanners({
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