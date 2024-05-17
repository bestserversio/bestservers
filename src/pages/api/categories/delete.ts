import { Category } from "@prisma/client";
import { prisma } from "@server/db";
import { CheckApiAccess } from "@utils/apihelpers";
import { CategoryWhereT, FindCategory } from "@utils/categories/api";
import { ProcessPrismaError } from "@utils/error";
import { NextApiRequest, NextApiResponse } from "next";

interface ExtendedRequest extends NextApiRequest {
    body: {
        categories: CategoryWhereT[]
    }
}

export default async function Handler (
    req: ExtendedRequest,
    res: NextApiResponse
) {
    const { method } = req;

    if (method !== "DELETE") {
        return res.status(405).json({
            message: "Method not allowed."
        });
    }

    // Check if we have access.
    const check = await CheckApiAccess({
        req: req,
        authKey: req.headers.authorization,
        endpoint: "/api/servers/delete",
        writeAccess: true
    });

    if (check.code !== 200) {
        return res.status(check.code).json({
            message: check.message
        });
    }

    // See if we should abort on error.
    const errors: string[] = [];

    let abortOnError = false;

    const { query } = req;

    const abortOnErrorStr = query.abortOnError?.toString();

    if (abortOnErrorStr && Boolean(abortOnErrorStr))
        abortOnError = true;

    const categories: Category[] = [];

    const promises = req.body.categories.map(async (categoryBody) => {
        const { id } = categoryBody;

        if (!id) {
            const errMsg = "ID missing in category where.";

            if (abortOnError) {
                return res.status(404).json({
                    message: errMsg
                });
            } else {
                errors.push(errMsg);

                return;
            }
        }

        try {
            const categoryFind = await FindCategory({
                id: id
            });

            const categoryId = categoryFind?.id;

            if (!categoryId) {
                const errMsg = `Category not found. ID => ${id.toString()}.`;

                if (abortOnError) {
                    return res.status(404).json({
                        message: errMsg
                    })
                } else {
                    errors.push(errMsg);

                    return;
                }
            }

            let category: Category | null = null;

            try {
                category = await prisma.category.delete({
                    where: {
                        id: categoryId
                    }
                });

                if (category)
                    categories.push(category);
            } catch (err) {
                console.error(err);

                const [errMsg, errCode] = ProcessPrismaError(err);

                const fullErrMsg = `Error deleting category.${errMsg ? ` Error => ${errMsg}${errCode ? ` (${errCode})` : ``}` : ``}`;

                if (abortOnError) {
                    return res.status(400).json({
                        message: fullErrMsg
                    })
                } else {
                    errors.push(fullErrMsg);

                    return;
                }
            }
        } catch (err) {
            console.error(err);

            const [errMsg, errCode] = ProcessPrismaError(err);

            const fullErrMsg = `Error finding category.${errMsg ? ` Error => ${errMsg}${errCode ? ` (${errCode})` : ``}` : ``}`;

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
        message: `Deleted ${categories.length.toString()} categories!`
    });
}