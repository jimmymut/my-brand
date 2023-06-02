import { useEffect, useState } from "react";
import Header from "../components/Header";
import Loader from "../components/Loader";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import commentSchema from "../validations/comment";
import likeIcon from "../images/Vector.svg";
import commentIcon from "../images/Vector (1).svg";

const BlogDetails = () => {
  const [loading, setLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [blogData, setBlogData] = useState(null);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const token = localStorage.getItem("token");
  const blogId = window.location.href.split("?:")[1];
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(commentSchema),
  });

  useEffect(() => {
    setLoading(true);
    async function loadFullBlog() {
      try {
        const blogURI = window.location.href.split("?:").reverse();
        const blogId = blogURI[0];
        const fetchedBlog = await fetch(
          `${process.env.REACT_APP_BASE_URL}/blogs/${blogId}`
        );
        const blog = await fetchedBlog.json();
        setBlogData(blog);
        setLikes(blog.likes.length);
        setComments(blog.comments);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        toast.error(`Error ${error.message}`);
      }
    }
    loadFullBlog();
  }, []);

  const likesFunction = async () => {
    setLikeLoading(true);
    fetch(`${process.env.REACT_APP_BASE_URL}/blogs/${blogId}/likes`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        setLikeLoading(false);
        if (response.status === 200) {
          const result = await response.json();
          setLikes(result.likes);
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
        setCommentLoading(false);
        if (response.status === 200) {
          const result = await response.json();
          comments.push(result);
          // setComments(newComs);
          reset();
        } else if (response.status === 401) {
          toast.error(
            "Please login in order to add a comment on an article\nIf you don't have an account, signup and then login"
          );
        } else {
          toast.error("Something went wrong!");
        }
      })
      .catch((err) => {
        setCommentLoading(false);
        toast.error(`Error ${err}`);
      });
  };
  return (
    <div>
      {loading ? (
        <Loader className="loader dashboard-loader" message="Loading..." />
      ) : (
        <div>
          <ToastContainer />
          <Header />

          {blogData && <div className="blogpost-div">
            <h1 className="blog-header">Blog Post</h1>
            <h2 className="blog-post-title">{blogData.title}</h2>
            <p className="blogpost-time">{`Created   ${new Date(
              blogData.createdAt
            )
              .toString()
              .substring(0, 25)},  Last updated   ${new Date(blogData.updatedAt)
              .toString()
              .substring(0, 25)}`}</p>
            <img className="blogpost-image" src={blogData.file.url} alt="" />
            <p className="blog-content" dangerouslySetInnerHTML={{ __html: blogData.description }}></p>
            <div className="like-coment post-like-commet">
              {likeLoading ? (
                <Loader className="loader" />
              ) : (
                <img
                  className="bloglikeImage"
                  onClick={likesFunction}
                  style={{ cursor: "pointer" }}
                  src={likeIcon}
                  alt="likes icon"
                />
              )}
              <p className="specific-blog-likes">{likes.toString()}</p>
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
                {comments.length.toString()}
              </p>
            </div>
            <div className="all-blog-comments">
              <h3 id="comments">Comments</h3>
              <ol className="full-mode-orderd-list">
                {comments.map((comment) => (
                  <li key={comment._id}>
                    <div>
                      <h5>{comment.user.firstName}</h5>
                      <small>
                        - 
                        {new Date(comment.commentedAt)
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
          </div>}
        </div>
      )}
    </div>
  );
};

export default BlogDetails;
