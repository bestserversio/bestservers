import { Category } from "@prisma/client"
import { prisma } from "@server/db"

export type CategoryBodyT = {
    parentId?: number | null

    banner?: string
    icon?: string

    url?: string
    name?: string
    description?: string
}

export type CategoryDataT = {
    parentId?: number | null

    banner?: string
    icon?: string

    url: string
    name: string
    description?: string
}

export type CategoryUpdateDataT = {
    parentId?: number | null

    banner?: string
    icon?: string

    url?: string
    name?: string
    description?: string
}

export type CategoryWhereT = {
    id?: number | string
}

export async function FindCategory (where: CategoryWhereT): Promise<Category | null> {
    const { id } = where;

    if (!id)
        return null;

    return await prisma.category.findFirst({
        where: {
            id: Number(id)
        }
    })
}

export async function UpdateCategory (id: number, data: CategoryUpdateDataT): Promise<Category | null> {
    return await prisma.category.update({
        data: data,
        where: {
            id: id
        }
    })
}

export async function AddCategory (data: CategoryDataT): Promise<Category | null> {
    // Make sure we have name and URL.
    return await prisma.category.create({
        data: data
    })
}

export async function DeleteCategory (where: CategoryWhereT): Promise<Category | null> {
    const category = await FindCategory(where);

    const categoryId = category?.id;

    if (!categoryId)
        return null;

    return await prisma.category.delete({
        where: {
            id: categoryId
        }
    })
}