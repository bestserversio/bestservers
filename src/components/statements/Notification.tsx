export default function Notification({
    type,
    title,
    msg
} : {
    type: "Error" | "Success"
    title: string
    msg?: JSX.Element | string
}) {
    return (
        <div className={`transition duration-150 p-4 rounded-md ${type == "Error" ? "bg-red-500/70" : "bg-green-500/70"}`}>
            <h3 className="text-white font-bold">{title}</h3>
            {msg && (
                <span className="text-sm">{msg}</span>
            )}
        </div>
    )
}