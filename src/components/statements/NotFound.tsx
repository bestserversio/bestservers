export default function NotFound({
    item
} : {
    item?: string
}) {
    const itemName = item ? item.charAt(0).toUpperCase() + item.slice(1) : "Item";

    return (
        <div>
            <h1>{itemName} Not Found</h1>
            <p>{itemName} not found. Please check the URL or report this issue to an administrator.</p>
        </div>
    )
}