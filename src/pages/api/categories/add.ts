import { type Category } from "@prisma/client";
import { CheckApiAccess } from "@utils/apihelpers";
import { AddCategory, type CategoryBodyT } from "@utils/categories/api";
import { ProcessPrismaError } from "@utils/error";
import { type NextApiRequest, type NextApiResponse } from "next";

interface ExtendedRequest extends NextApiRequest {
    body: {
        categories: CategoryBodyT[]
    }
}

export default async function Handler (
    req: ExtendedRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({
            message: "Method not allowed."
        })
    }

    // Check if we have API access.
    const check = await CheckApiAccess({
        req: req,
        authKey: req.headers.authorization,
        endpoint: "api/categories/add",
        writeAccess: true
    });

    if (check.code !== 200) {
        return res.status(check.code).json({
            message: check.message
        })
    }

    // See if we should abort error.
    const errors: string[] = [];

    let abortOnError = false;

    const { query } = req;

    const abortOnErrorStr = query.abortOnError?.toString();

    if (abortOnErrorStr && Boolean(abortOnErrorStr))
        abortOnError = true;

    const categories: Category[] = [];

    // Loop through each category.
    const promises = req.body.categories.map(async (categoryBody) => {
        let category: Category | null = null;

        const { url, name } = categoryBody;

        if (!url || !name) {
            const errMsg = `Name or URL undefined/null for category with name ${categoryBody.name ?? "N/A"}`;

            if (abortOnError) {
                return res.status(400).json({
                    message: errMsg
                })
            } else {
                errors.push(errMsg);

                return;
            }
        }

        try {
            category = await AddCategory({
                ...categoryBody,
                url: url,
                name: name
            })

            if (category)
                categories.push(category);
        } catch (err) {
            console.error(err);

            const [errMsg, errCode] = ProcessPrismaError(err);

            const fullErrMsg = `Error adding category.${errMsg ? ` Error => ${errMsg}${errCode ? ` (${errCode})` : ``}` : ``}`;

            if (abortOnError) {
                return res.status(400).json({
                    message: fullErrMsg
                })
            } else {
                errors.push(fullErrMsg);

                return;
            }
        }
    })

    await Promise.all(promises);

    return res.status(200).json({
        categoryCount: categories.length,
        categories: categories,
        errorCount: errors.length,
        errors: errors,
        message: `Added ${categories.length.toString()} categories!`
    });
}