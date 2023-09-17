import fs from "fs";

export function FileType (str: string): string {
    let fileType = "unknown";

    switch (str[0]) {
        case '/':
            fileType = "jpeg";

            break;

        case 'i':
            fileType = "png";

            break;

        case 'R':
            fileType = "gif";

            break;

        case 'U':
            fileType = "webp";

            break;

        // Not supporting PDF for now.
        /*
        case 'J':
            fileType = "pdf";

            break;
        */
    }

    return fileType;
}

export async function GetContents (file: File) {
    const reader = new FileReader();

    return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
        reader.onerror = () => {
            reader.abort();

            reject(new DOMException("Problem parsing input file."));
        };

        reader.onload = () => {
            resolve(reader.result);
        };
        
        reader.readAsDataURL(file);
    });
}

export function UploadFile ({
    path,
    contents,
    allowedTypes,
    noAppendFileType,
    prepareUploadUrl
} : {
    path: string
    contents: string
    allowedTypes?: string | string[]
    noAppendFileType?: boolean
    prepareUploadUrl?: boolean
}): [boolean, string | null, string | null] {
    // Split by comma if there is any.
    contents = contents.split(",")?.[1] ?? contents;

    const fileType = FileType(contents);

    // Make sure we recongize file type.
    if (fileType == "unknown") {
        return [false, "File type is unknown.", null];
    }

    // Check if we only want to allow specific file types.
    if (allowedTypes) {
        if (!allowedTypes.includes(fileType))
            return [false, `File type '${fileType}' not allowed!`, null];
    }

    // See if we need to append file type.
    if (!noAppendFileType)
        path += `.${fileType}`;

    // Convert Base64 content.
    const buffer = Buffer.from(contents, 'base64');

    // Attempt to upload file.
    try {
        fs.writeFileSync((process.env.UPLOADS_DIR ?? "") + path, buffer);
    } catch (error) {
        console.error(`Full Upload File Path => ${process.env.UPLOADS_DIR ?? ""}${path}`);
        console.error(error);

        return [false, "Failed to upload file. Check console for errors!", (process.env.UPLOADS_DIR ?? "") + path];
    }

    // Compile full path to return.
    let fullPath = path;

    // Check if we need to prepend upload URL.
    if (prepareUploadUrl)
        fullPath = path;

    return [true, null, fullPath];
}