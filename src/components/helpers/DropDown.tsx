import ArrowIcon from "@components/icons/Arrow"
import Link from "next/link"
import { MouseEventHandler, ReactNode, useState } from "react"

type DropDownItemT = {
    link: string
    newTab?: boolean
    className?: string
    contents: JSX.Element | string
    sep?: boolean
    onClick?: MouseEventHandler<HTMLAnchorElement>
}

export function DropDown({
    className,
    children,
    items,
    childrenClassName,
    btnClassName,
    menuClassName
} : {
    className?: string
    children: ReactNode
    items: DropDownItemT[]
    btnClassName?: string
    childrenClassName?: string
    menuClassName?: string
}) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className={`${className ? className : ""} relative`}>
            <button
                className={`${btnClassName ?? ""} inline-flex gap-1 items-center`}
                onClick={() => {
                    setMenuOpen(!menuOpen);
                }}
            >
                <span className={childrenClassName}>{children}</span>
                {menuOpen ? (
                    <ArrowIcon className="fill-white w-3 h-3 rotate-180" />
                ) : (
                    <ArrowIcon className="fill-white w-3 h-3" />
                )}
            </button>
            {menuOpen && (
                <div className={`${menuClassName ?? ""} origin-top-left break-all absolute left-0 mt-2 w-44 min-w-full top-[100%] z-30 rounded-b p-2 bg-shade-3/70`}>
                    <ul
                        role="menu"
                        aria-orientation="vertical" 
                        aria-labelledby="options-menu"
                        className="flex flex-col gap-2 [&>a]:p-2"
                    >
                        {items.map((item, idx) => {
                            return (
                                <DropDownItem
                                    key={`dd-${idx.toString()}`}
                                    item={item}
                                />
                            )
                        })}
                    </ul>
                </div>
            )}
            
        </div>
    )
}

function DropDownItem({
    item
} : {
    item: DropDownItemT
}) {
    return (
        <>
            {item.sep ? (
                <li className={item.className}><hr /></li>
            ) : (
                <Link
                    href={item.link}
                    target={item.newTab ? "_blank" : undefined}
                    className={`${item.className ?? ""} hover:text-inherit`}
                    onClick={item.onClick}
                >
                    <li>{item.contents}</li>
                </Link>
            )}
        </>
    )
}