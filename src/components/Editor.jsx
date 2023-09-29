import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const Editor = ({data, label, id, labelClassName, error, setValue}) => {
    return (
        <div>
            {label &&<><label htmlFor={id} className={labelClassName || ""}>{label}</label><br /></>}
            <CKEditor
                editor={ ClassicEditor }
                data={data? data: ""}
                // onReady={ editor => {
                //     console.log( 'Editor is ready to use!', editor );
                // } }
                onChange={ ( event, editor ) => {
                    const data = editor.getData();
                    setValue("description", data);
                } }
                // onBlur={ ( event, editor ) => {
                //     console.log( 'Blur.', editor );
                // } }
                // onFocus={ ( event, editor ) => {
                //     console.log( 'Focus.', editor );
                // } }
            />
            {error && <small className="input-error contact-form-error">{error.message}</small>}
        </div>
    );
}

export default Editor;
