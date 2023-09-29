const Loader = ({ className, message }) => {
    return(
        <div className={className}>
            {message && <strong>{message}</strong>}
        </div>
    );
}

export default Loader;