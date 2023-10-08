import { Field, Form, Formik, isObject } from "formik";

import { type Category } from "@prisma/client";
import { api } from "@utils/api";
import { useContext, useState } from "react";
import { ErrorCtx, SuccessCtx } from "@pages/_app";

export default function CategoryForm({
    category
} : {
    category?: Category
}) {
    const errorCtx = useContext(ErrorCtx);
    const successCtx = useContext(SuccessCtx);

    // Mutations.
    const addOrUpdate = api.categories.addOrUpdate.useMutation({
        onError: (opts) => {
            const { message, data } = opts;

            if (errorCtx) {
                errorCtx.setTitle(`Failed To ${category ? "Save" : "Add"} Category`)

                // To Do: Determine error message.
            }
        },
        onSuccess: () => {
            if (successCtx) {
                errorCtx?.setTitle(`Successfully ${category ? "Saved" : "Added"} Category!`)
                errorCtx?.setMsg(`The category was not ${category ? "saved" : "added"} successfully.`)
            }
        }
    });

    // Retrieve categories mapped.
    const catQuery = api.categories.allMapped.useQuery();
    const categories = catQuery.data;

    // Banners and icons.
    const [banner, setBanner] = useState<string | ArrayBuffer | null>(null);
    const [icon, setIcon] = useState<string | ArrayBuffer | null>(null);

    return (
        <Formik
            initialValues={{
                parent: category?.parentId ?? 0,
                url: category?.url ?? "",
                name: category?.name ?? "",
                description: category?.description ?? ""
            }}
            onSubmit={(values) => {
                console.log(values);

                addOrUpdate.mutate({
                    ...values,
                    parent: values.parent || null,
                    description: values.description || null,
                    id: category?.id,
                    banner: banner?.toString(),
                    icon: icon?.toString()
                });
            }}
        >
            <Form>
                <div>
                    <label>Banner</label>
                    <input
                        type="file"
                        onChange={(e) => {
                            const file = e.target.files?.[0]

                            if (file) {
                                const reader = new FileReader()
                                reader.readAsDataURL(file)

                                reader.onload = () => {
                                    setBanner(reader.result)
                                }
                            }
                        }}
                    />
                </div>
                <div>
                    <label>Icon</label>
                    <input
                        type="file"
                        onChange={(e) => {
                            const file = e.target.files?.[0]

                            if (file) {
                                const reader = new FileReader()
                                reader.readAsDataURL(file)

                                reader.onload = () => {
                                    setIcon(reader.result)
                                }
                            }
                        }}
                    />
                </div>
                <div>
                    <label htmlFor="parent">Parent</label>
                    <select
                        name="parent"
                    >
                        <option value="0">None</option>
                        {categories && (
                            <>
                                {categories.map((category, index) => {
                                    return (
                                        <option
                                            value={category.id}
                                            key={`category-${index.toString()}`}
                                        >{category.name}</option>
                                    );
                                })}
                            </>
                        )}
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