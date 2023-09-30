import { MouseEventHandler, useState } from "react";

export default function Switch ({
    onChange,
    className,
    label
} : {
    onChange?: (checked?: boolean) => void
    className?: string
    label?: JSX.Element
}) {
    const [isChecked, setIsChecked] = useState(false);

    const handleToggle = () => {
        setIsChecked(!isChecked);

        if (onChange)
            onChange(isChecked);
    }

    return (
        <label className="switch">
            <input
                type="checkbox"
                value=""
                className="peer"
                checked={isChecked}
                onChange={handleToggle}
            />
            <div className="w-11 h-6 bg-gray-900 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-900 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-700"></div>
            {label && (
                <span>
                    {label}
                </span>
            )}
        </label>
    )
}