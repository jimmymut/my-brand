import * as Yup from "yup"

const loginSchema = Yup.object().shape({
    email: Yup.string("Only string allowed!").required("Email is required!").email("Invalid email!"),
    password: Yup.string("Only string allowed!").required("Password is required!"),
})
export default loginSchema;