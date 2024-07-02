import { useEffect, useState } from "react"

export default function LastQueried({
    total
} : {
    total?: number
}) {
    const [text, setText] = useState("N/A");

    useEffect(() => {
        if (!total)
            return;

        const days = Math.floor(total / 86400);
        const hours = Math.floor((total % 86400) / 3600);
        const mins = Math.floor((total % 3600) / 60);
        const secs = total % 60;

        const days_str = days > 0 ? `${days} Day${days > 1 ? "s" : ""}` : "";
        const hours_str = hours > 0 ? `${hours} Hour${hours > 1 ? "s" : ""}` : "";
        const mins_str = mins > 0 ? `${mins} Min${mins > 1 ? "s" : ""}` : "";
        const secs_str = secs > 0 ? `${secs} Sec${secs > 1 ? "s" : ""}` : "";

        setText([days_str, hours_str, mins_str, secs_str].filter(Boolean).join(" "));
    }, [total])
    
    return (
        <span>{text}</span>
    )
}