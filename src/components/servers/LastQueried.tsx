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

        let mins_single = true;
        let secs_single = true;

        const mins = Math.floor(total / 60);
        const secs = Math.floor(total % 60);

        let mins_str: string | undefined = undefined;
        let secs_str: string | undefined = undefined;
        
        if (mins > 0) {
            if (mins > 1)
                mins_single = false;

            mins_str = `${mins.toString()} ${mins_single ? "Min" : "Mins"}`;
        }

        if (secs > 0) {
            if (secs > 1)
                secs_single = false;

            secs_str = `${secs.toString()} ${secs_single ? "Sec" : "Secs"} `;
        }

        

        setText(`${mins_str ? `${mins_str} ` : ``}${secs_str ? `${secs_str} ` : ``}`);
    }, [total])
    
    return (
        <span>{text}</span>
    )
}