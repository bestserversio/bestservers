import { ContentItem1 } from "@components/Content";
import { signIn } from "next-auth/react";

export default function NotSignedIn() {
    return (
        <ContentItem1 title="Not Signed In">
            <p>You are not signed in!</p>
            <div className="flex justify-center">
                <button
                    onClick={() => signIn("discord")}
                    className="button button-primary"
                >Sign In!</button>
            </div>
        </ContentItem1>
    )
}