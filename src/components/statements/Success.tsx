export default function SuccessBox({
    title,
    message
} : {
    title?: string
    message?: string
}) {
    return (
        <>
            {(title ?? message) && (
                <div className="success-box">
                    <div>
                        <h2>{title ?? "Success!"}</h2>
                    </div>
                    <div>
                        <p>{message ?? "N/A"}</p>
                    </div>
                </div>
            )}
        </>
    );
}