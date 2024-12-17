import { useEffect, useState, useContext } from "react";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import commentSchema from "../validations/comment";
import likeIcon from "../images/Vector.svg";
import commentIcon from "../images/Vector (1).svg";
import Layout from "../components/Layout";
import { AppContext } from "../App";

const BlogDetails = () => {
  const [likeLoading, setLikeLoading] = useState(false);
  const [blogData, setBlogData] = useState(null);
  const [commentLoading, setCommentLoading] = useState(false);
  const token = localStorage.getItem("token");
  const { blogId } = useParams();
  const { dispatch, state } = useContext(AppContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(commentSchema),
  });

  useEffect(() => {
    const blog = state.blogs.find(b=> b._id === blogId);
        setBlogData(blog);
  }, [blogId, state.blogs]);

  const likesFunction = async () => {
    setLikeLoading(true);
    fetch(`${process.env.REACT_APP_BASE_URL}/blogs/${blogId}/likes`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        if (response.status === 200) {
          const result = await response.json();
          dispatch({
            type: "blogs/like",
            payload: result,
        })
        } else if (response.status === 401) {
          toast.error(
            "Please login in order to like an article\nIf you don't have an account, signup and then login"
          );
        } else if (response.status === 403) {
          const result = await response.json();
          toast.error(result.message);
        } else {
          toast.error("Something went wrong!");
        }
        setLikeLoading(false);
      })
      .catch((error) => {
        setLikeLoading(false);
        toast.error(`Error! ${error}`);
      });
  };

  const handleComment = (data) => {
    setCommentLoading(true);
    fetch(`${process.env.REACT_APP_BASE_URL}/blogs/${blogId}/comments`, {
      method: "post",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        if (response.status === 200) {
          const result = await response.json();
          dispatch({
            type: "blogs/comment",
            payload: result,
        })
          reset();
        } else if (response.status === 401) {
          toast.error(
            "Please login in order to add a comment on an article\nIf you don't have an account, signup and then login"
          );
        } else {
          toast.error("Something went wrong!");
        }
        setCommentLoading(false);
      })
      .catch((err) => {
        setCommentLoading(false);
        toast.error(`Error ${err}`);
      });
  };
  return (
    <div>
      <Layout>
        {blogData && (
          <div className="blogpost-div">
            <h1 className="blog-header">Blog Post</h1>
            <h2 className="blog-post-title">{blogData.title}</h2>
            <p className="blogpost-time">{`Created   ${new Date(
              blogData.createdAt
            )
              .toString()
              .substring(0, 25)},  Last updated   ${new Date(blogData.updatedAt)
              .toString()
              .substring(0, 25)}`}</p>
            <img className="blogpost-image" src={blogData.file.url} alt="Blog pic" />
            <p
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: blogData.description }}
            ></p>
            <div className="like-coment post-like-commet">
              {likeLoading ? (
                <Loader className="loader" />
              ) : (
                <button className="bloglikeImage" onClick={likesFunction}>
                  <img
                    className="bloglikeImage"
                    style={{ cursor: "pointer" }}
                    src={likeIcon}
                    alt="likes icon"
                  />
                </button>
              )}
              <p className="specific-blog-likes">{blogData.likes.length}</p>
            </div>
            <div className="like-coment post-like-commet">
              <Link to="#comments">
                <img
                  className="bloglikeImage"
                  style={{ cursor: "pointer" }}
                  src={commentIcon}
                  alt="comments icon"
                />
              </Link>
              <p className="full-article-num-comments">
                {blogData.comments.length}
              </p>
            </div>
            <div className="all-blog-comments">
              <h3 id="comments">Comments</h3>
              <ol className="full-mode-orderd-list">
                {blogData.comments.map((comment) => (
                  <li key={comment?._id}>
                    <div>
                      <h5>{comment.user?.firstName}</h5>
                      <small>
                        -
                        {new Date(comment?.commentedAt)
                          .toString()
                          .substring(0, 25)}
                      </small>
                    </div>
                    <br />
                    <small>{comment.comment}</small>
                    <br />
                    <br />
                  </li>
                ))}
              </ol>
            </div>
            <form onSubmit={handleSubmit(handleComment)}>
              <textarea
                name="comment"
                placeholder="Add your comment"
                {...register("comment")}
              ></textarea>
              <br />
              {errors.comment && (
                <small className="input-error contact-form-error">
                  {errors.comment.message}
                </small>
              )}
              <br />
              <button
                type="submit"
                id="blog-comt"
                disabled={commentLoading ? true : false}
              >
                {commentLoading ? (
                  <Loader className="loader btn-loader" />
                ) : (
                  "Add comment"
                )}
              </button>
            </form>
          </div>
        )}
      </Layout>
    </div>
  );
};

export default BlogDetails;
