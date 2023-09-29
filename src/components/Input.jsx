const Input = (props) => {
    const { type, label, name, placeholder, register, error, className, labelClassName } = props;

    return(
        <div>
        {label &&<><label htmlFor={name} className={labelClassName || ""}>{label}</label></>}
        <input
            type={type || "text"}
            id={name}
            name={name}
            placeholder={placeholder || ""}
            className={className || ""}
            {...register(name)}
        />
        {error && <small className="input-error contact-form-error">{error.message}</small>}
        </div>
    );
}

export const TextArea = (props) => {
    const { label, name, placeholder, register, error, className, labelClassName } = props;

    return(
        <div>
        {label &&<><label htmlFor={name} className={labelClassName || ""}>{label || ""}</label></>}
        <textarea
            name={name}
            id={name}
            placeholder={placeholder || ""}
            className={className || ""}
            {...register(name)}
        >
        </textarea>
        {error && <small className="input-error contact-form-error">{error.message}</small>}
        </div>
    );
}

export default Input;