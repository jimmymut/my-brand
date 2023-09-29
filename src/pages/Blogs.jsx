import { useEffect, useState } from "react";
import Header from "../components/Header";
import Loader from "../components/Loader";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import "swiper/css/bundle";
import likeIcon from "../images/Vector.svg";
import commentIcon from "../images/Vector (1).svg";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFlip, Pagination, Navigation } from "swiper";

const Blogs = () => {
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_BASE_URL}/blogs`)
      .then(async (res) => {
        setLoading(false);
        if (res.status === 200) {
          const resBlogs = await res.json();
          setBlogs(resBlogs);
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.message);
      });
  }, []);

  return (
    <div>
      {loading ? (
        <Loader className="loader dashboard-loader" message="Loading..." />
      ) : (
        <div>
          <ToastContainer />
          <Header />
          <h1 className="blogs-summary-h1">
            <b>Blogs</b>
          </h1>
          <Swiper
            effect={"flip"}
            grabCursor={true}
            pagination={true}
            navigation={true}
            modules={[EffectFlip, Pagination, Navigation]}
            className="swiper mySwiper"
          >
            <div id="blog-summary-1" className="swiper-wrapper mainblog-summry">
              {!blogs || !blogs.length ? (
                <p className="no-data-yet">
                  There is no blog now but we are working hard to add them soon,
                  come back later!
                </p>
              ) : (
                blogs.map((blog) => (
                  <SwiperSlide key={blog._id}>
                    <div className="swiper-slide blog-summary-div">
                      <img src={blog.file.url} alt="" />

                      <div className="artcle blog-summury-lc">
                        <div className="like-coment">
                          <img
                            className="bloglikeImage"
                            src={likeIcon}
                            alt=""
                          />
                          <p className="number-oflikes">
                            {blog.likes.length.toString()}
                          </p>
                        </div>
                        <div className="like-coment">
                          <img src={commentIcon} alt="" />
                          <p className="number-of-comments">
                            {blog.comments.length.toString()}
                          </p>
                        </div>
                      </div>
                      <div className="blog-sum-title">
                        <h4 className="blog-sum-main-title">{blog.title}</h4>
                        <p>
                          {"Created " +
                            new Date(blog.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <p className="article-summury" dangerouslySetInnerHTML={{ __html: blog.description.substring(0, 100) + "..." }}></p>
                      <Link
                        to={`/blogs?:${blog._id}`}
                        target="_blank"
                        disabled={false}
                      >
                        Read More
                      </Link>
                    </div>
                  </SwiperSlide>
                ))
              )}
            </div>
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default Blogs;
