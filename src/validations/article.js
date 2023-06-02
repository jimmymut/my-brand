import * as Yup from "yup"

export const addArticleSchema = Yup.object().shape({
    title: Yup.string("Only string allowed!").min(6, "The title should be at least 6 characters!").required("Title can not be empty!"),
    description: Yup.string("Only string allowed!").min(100, "The description should be at least 100 characters!").required("Description of the article can not be empty!"),
    file: Yup.array().required("Please upload an image!"),
});

export const editArticleSchema = Yup.object().shape({
    title: Yup.string("Only string allowed!").min(6, "The title should be at least 6 characters!").optional(),
    description: Yup.string("Only string allowed!").min(100, "The description should be at least 100 characters!").optional(),
    file: Yup.array().optional(),
});