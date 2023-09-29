import * as Yup from "yup"

const signUpSchema = Yup.object().shape({
    firstName: Yup.string("Only string allowed!").min(3, "The name should be at least 3 characters!").required("First Name can not be empty!"),
    lastName: Yup.string("Only string allowed!").min(3, "The name should be at least 3 characters!").required("Last Name can not be empty!"),
    email: Yup.string("Only string allowed!").email("Invalid email!").required("Email can not be empty!"),
    password: Yup
      .string("Only string allowed!")
      .required("Password is required!")
      .min(8, "Password length should be at least 8 characters").matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,"password must have at least one letter and one number"),
    comfirmPassword: Yup
      .string()
      .required("Confirm password is a required field")
      .oneOf([Yup.ref("password")], "Passwords do not match"),
})
export default signUpSchema;