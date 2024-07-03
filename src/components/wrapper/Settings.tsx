import Switch from "@components/helpers/Switch";
import CloseIcon from "@components/icons/Close";
import SettingsIcon from "@components/icons/Settings";
import { Dispatch, SetStateAction, useState } from "react"
import { useCookies } from "react-cookie";

export default function Settings ({
    showBg,
    setShowBg
} : {
    showBg: boolean
    setShowBg: Dispatch<SetStateAction<boolean>>
}) {
    const [_, setCookie] = useCookies(["bs_showbg"]);

    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className={`fixed z-30 bottom-0 left-0 ${showMenu ? "bg-shade-3" : "bg-shade-3/70"} p-2 rounded-tr-md`}>
            <div className="flex justify-center">
                {showMenu ? (
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-end">
                            <div
                                className="cursor-pointer"
                                onClick={() => setShowMenu(!showMenu)}
                            >
                                <CloseIcon className="w-4 h-4 fill-white" />
                            </div>
                        </div>
                        <div className="py-10">
                            <Switch
                                label={<>Image Backgrounds</>}
                                value={showBg}
                                onChange={() => {
                                    const newVal = !showBg;
                                    setShowBg(newVal);
                                    setCookie("bs_showbg", newVal);
                                }}
                            />
                        </div> 
                    </div>
                ) : (
                    <div
                        className="cursor-pointer"
                        onClick={() => setShowMenu(!showMenu)}
                    >
                        <SettingsIcon className="w-5 h-5 fill-white" />
                    </div> 
                )}
            </div>
        </div>
    )
}