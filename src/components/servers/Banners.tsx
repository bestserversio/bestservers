import { type ServerBrowser, type ServerPublic } from "~/types/Server";

export default function ServerBanners({
    className
} : {
    server: ServerPublic | ServerBrowser
    className?: string
}) {
    return (
        <div className={`server-banners${className ? ` ${className}` : ``}`}>
        </div>
    )
}