import { ContentItem2 } from "@components/Content";

export default function ServerError() {
    return (
        <ContentItem2 title="Server-Side Error">
            <p>The server wasn{"'"}t able to process your request. Please try again later or report this issue to an administrator.</p>
        </ContentItem2>
    )
}