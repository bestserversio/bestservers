import React, { useContext } from "react";
import Header from "./Header";
import GoogleAnalytics from "./GoogleAnalytics";
import { ErrorCtx, SuccessCtx } from "@pages/_app";
import SuccessBox from "./statements/Success";
import ErrorBox from "./statements/Error";

export default function Wrapper ({
    children
} : {
    children: React.ReactNode
}) {
    const errorCtx = useContext(ErrorCtx);
    const successCtx = useContext(SuccessCtx);

    return (
        <main>
            <Header />
            <GoogleAnalytics />
            <div className="content">
                <ErrorBox
                    title={errorCtx?.title}
                    message={errorCtx?.msg}
                />
                <SuccessBox
                    title={successCtx?.title}
                    message={successCtx?.msg}
                />
                {children}
            </div>
        </main>
    );
}