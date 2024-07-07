export default function ErrorBox({
    title,
    message
} : {
    title?: string
    message?: string
}) {
    return (
        <>
            {(title ?? message) && (
                <div className="error-box">
                    <div>
                        <h2>{title ?? "Error!"}</h2>
                    </div>
                    <div>
                        <p>{message ?? "N/A"}</p>
                    </div>
                </div>
            )}
        </>
    );
}