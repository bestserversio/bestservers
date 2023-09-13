import { Field, Form, Formik } from "formik";

import { type Category } from "@prisma/client";
import { api } from "@utils/api";
import { useContext } from "react";
import { ErrorCtx, SuccessCtx } from "@pages/_app";

export default function CategoryForm({
    category,
    categories
} : {
    category?: Category,
    categories: Category[]
}) {
    const errorCtx = useContext(ErrorCtx);
    const successCtx = useContext(SuccessCtx);

    // Mutations.
    const addOrUpdate = api.categories.addOrUpdate.useMutation({
        onError: (opts) => {
            const { message, data } = opts;

            if (errorCtx) {
                
            }
        },
        onSuccess: () => {
            if (successCtx) {

            }
        }
    });

    return (
        <Formik
            initialValues={{
                parent: category?.parentId ?? 0,
                url: category?.url ?? "",
                name: category?.name ?? "",
                description: category?.description
            }}
            onSubmit={(values) => {
                console.log(values);
            }}
        >
            <Form>
                <div>
                    <select
                        name="parent"
                    >
                        <option value="0">None</option>
                        {categories.map((category, index) => {
                            return (
                                <option
                                    value={category.id}
                                    key={`server-${index.toString()}`}
                                >{category.name}</option>
                            );
                        })}
                    </select>
                </div>
                <div>
                    <label htmlFor="name">Name</label>
                    <Field
                        name="name"
                    />  
                </div>
                <div>
                    <label htmlFor="url">URL</label>
                    <Field
                        name="url"
                    />
                </div>
                <div>
                    <label htmlFor="description">Description</label>
                    <Field
                        name="description"
                        as="textarea"
                        rows={10}
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="button-primary"
                    >Add Category!</button>
                </div>
            </Form>
        </Formik>
    );
}