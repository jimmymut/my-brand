import * as Yup from "yup"

const messageSchema = Yup.object().shape({
    contName: Yup.string("Full Name accepts only string!").required("Name is required!").min(3, "The name should have a minimum of 3 characters").max(30, "The name should have a maximum of 30 characters"),
    contEmail: Yup.string("Only string allowed!").required("Email is required!").email("Invalid email!"),
    phone: Yup.string("Only string allowed!").required("Phone Number is required!").matches(/^\+\d{1,3}\d{8,14}$/, "Invalid phone number!, please include country code"),
    message: Yup.string("Only string allowed!").required("Message is required!").min(3, "Message is too short!"),
})

export default messageSchema;