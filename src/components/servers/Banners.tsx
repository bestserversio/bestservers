import { ServerPublic } from "~/types/Server";

export default function ServerBanners({
    server
} : {
    server: ServerPublic
}) {
    return (
        <div className="server-banners">
            <h2>Banners</h2>
        </div>
    )
}