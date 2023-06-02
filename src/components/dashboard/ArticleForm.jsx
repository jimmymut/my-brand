import { useState } from "react";
import Editor from "../Editor";
import Input from "../Input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Loader from "../Loader";
import { addArticleSchema, editArticleSchema } from "../../validations/article";
import { toast } from "react-toastify";

const ArticleForm = ({formType, article, setEditData}) => {
    const [loading, setLoading] = useState(false);
    const [imageUploadPreview, setImageUploadPreview] = useState(null);
    const [editorData, setEditorData] = useState("Please enter the article description here!");
    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm({
        resolver: yupResolver(formType === "add"? addArticleSchema: editArticleSchema),
        defaultValues:{
          title: article?.title,
          description: article?.description,
          file: article?.file,
        }
      });

      if(article){
        setImageUploadPreview(article.file);
        setEditorData(article.description);
      };

      const uploadImage = (e) => {
        const file = e.target.files[0];
        const arr = Array.from(e.target.files);
        setValue("file", arr);
        const prefile = URL.createObjectURL(file);
        setImageUploadPreview(prefile);
      }

      const hideAddForm = () => {
        setEditorData("");
        reset();
      }

      const submitHandler = async (data) => {
        console.log(data)
        const token = localStorage.getItem("token");
        const { title, description, file } = data;
        if(formType !== "add") {
          if (description === "" && file === "") {
            setLoading(true);
            await fetch(
              `${process.env.REACT_APP_BASE_URL}/blogs/${article._id}`,
              {
                method: "PATCH",
                body: JSON.stringify({ title }),
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            )
              .then((response) => {
                setLoading(false);
                if (response.status === 200) {
                  setEditData(null);
                  toast.success("Article updated successfully!");
                } else {
                  toast.error("Updating article failed!");
                  return;
                }
              })
              .catch((err) => {
                console.log(err);
                setLoading(false);
                toast.error("Error occurred!", err.message);
              });
          } else if (title === "" && file === "") {
            await fetch(
              `${process.env.REACT_APP_BASE_URL}/blogs/${article._id}`,
              {
                method: "PATCH",
                body: JSON.stringify({ description }),
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            )
            .then((response) => {
              setLoading(false);
              if (response.status === 200) {
                toast.success("Article updated successfully!");
              } else {
                toast.error("Updating article failed!");
                return;
              }
            })
            .catch((err) => {
              console.log(err);
              setLoading(false);
              toast.error("Error occurred!", err.message);
            });
          } else if (title === "" && description === "") {
            const formDada = new FormData();
            formDada.append("file", file[0]);
            await fetch(
              `${process.env.REACT_APP_BASE_URL}/blogs/${article._id}`,
              {
                method: "PATCH",
                body: formDada,
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((response) => {
              setLoading(false);
              if (response.status === 200) {
                toast.success("Article updated successfully!");
              } else {
                toast.error("Updating article failed!");
                return;
              }
            })
            .catch((err) => {
              console.log(err);
              setLoading(false);
              toast.error("Error occurred!", err.message);
            });
          } else if (file === "") {
            await fetch(
              `${process.env.REACT_APP_BASE_URL}/blogs/${article._id}`,
              {
                method: "PATCH",
                body: JSON.stringify({
                  title,
                  description,
                }),
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            )
            .then((response) => {
              setLoading(false);
              if (response.status === 200) {
                toast.success("Article updated successfully!");
              } else {
                toast.error("Updating article failed!");
                return;
              }
            })
            .catch((err) => {
              console.log(err);
              setLoading(false);
              toast.error("Error occurred!", err.message);
            });
          } else if (description === "") {
            const newFormDada = new FormData();
            newFormDada.append("title", title);
            newFormDada.append("file", file[0]);
            await fetch(
              `${process.env.REACT_APP_BASE_URL}/blogs/${article._id}`,
              {
                method: "PATCH",
                body: newFormDada,
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((response) => {
              setLoading(false);
              if (response.status === 200) {
                toast.success("Article updated successfully!");
              } else {
                toast.error("Updating article failed!");
                return;
              }
            })
            .catch((err) => {
              console.log(err);
              setLoading(false);
              toast.error("Error occurred!", err.message);
            });
          } else if (title === "") {
            const newFormDada = new FormData();
            newFormDada.append("description", description);
            newFormDada.append("file", file[0]);
            await fetch(
              `${process.env.REACT_APP_BASE_URL}/blogs/${article._id}`,
              {
                method: "PATCH",
                body: newFormDada,
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((response) => {
              setLoading(false);
              if (response.status === 200) {
                toast.success("Article updated successfully!");
              } else {
                toast.error("Updating article failed!");
                return;
              }
            })
            .catch((err) => {
              console.log(err);
              setLoading(false);
              toast.error("Error occurred!", err.message);
            });
          } else {
            const formDadaEdit = new FormData();
            formDadaEdit.append("title", title);
            formDadaEdit.append("description", description);
            formDadaEdit.append("file", file[0]);
            await fetch(
              `${process.env.REACT_APP_BASE_URL}/blogs/${article._id}`,
              {
                method: "PATCH",
                body: formDadaEdit,
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((response) => {
              setLoading(false);
              if (response.status === 200) {
                toast.success("Article updated successfully!");
              } else {
                toast.error("Updating article failed!");
                return;
              }
            })
            .catch((err) => {
              console.log(err);
              setLoading(false);
              toast.error("Error occurred!", err.message);
            });
          }
        }else{
            const formDada = new FormData();
            formDada.append("title", title);
            formDada.append("description", description);
            formDada.append("file", file[0]);
            await fetch(
              `${process.env.REACT_APP_BASE_URL}/blogs`,
              {
                method: "POST",
                body: formDada,
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((response) => {
              setLoading(false);
              if (response.status === 200) {
                toast.success("Article created successfully!");
              } else {
                toast.error("Creating article failed!");
                return;
              }
            })
            .catch((err) => {
              console.log(err);
              setLoading(false);
              toast.error("Error occurred!", err.message);
            });
        }
      };
    return(
        <div className="add-article-form">
        <form onSubmit={handleSubmit(submitHandler)}>
          <h2>{formType === "add"? "Add a new article here": "Edit this article here"}</h2>
          <Input
            type="text"
            name="title"
            label="Title"
            placeholder="Enter the title of the article"
            error={errors.title}
            register={register}
            />
          <Editor
            id="title"
            label="Description"
            placeholder="Enter the title of the article"
            setValue={setValue}
            data={editorData}
            error={errors.description}
            />
          <div>
            <label htmlFor="file">Image</label> <br />
            <input type="file" onChange={uploadImage} />
            {errors.file && <small className="input-error contact-form-error">{errors.file.message}</small>}
          </div>
          
          {imageUploadPreview && <div className="image-create-preview">
            <img src={imageUploadPreview} alt="" />
          </div>}
          <button
            className="btn contact-btn add-article-btn"
            type="submit"
            disabled={loading? true: false}
          >
            {loading?<Loader className="loader btn-loader" message="Loading..."/>:(formType === "add"? "Add article": "Update")}
          </button>
          <button
            onClick={hideAddForm}
            id="add-article-btn-cancel"
            className="btn contact-btn add-article-btn"
            type="reset"
          >
            Cancel
          </button>
        </form>
      </div>
    );
}

export default ArticleForm;