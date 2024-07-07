import { type Category } from "@prisma/client";

export default function CategoryView ({
    category
} : {
    category: Category
}) {
    return (
        <div>
            <span>{category.name}</span>
        </div>
    );
}