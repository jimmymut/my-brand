import * as Yup from "yup"

const commentSchema = Yup.object().shape({
    comment: Yup.string("Only string allowed!").min(3, "Comment is too short!"),
})
export default commentSchema;