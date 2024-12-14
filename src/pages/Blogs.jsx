import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import likeIcon from "../images/Vector.svg";
import commentIcon from "../images/Vector (1).svg";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFlip, Pagination, Navigation } from "swiper";
import "swiper/css/bundle";
import Layout from "../components/Layout";
import { AppContext } from "../App";
import { useContext } from "react";

const Blogs = () => {
  const { state } = useContext(AppContext);

  return (
    <div>
      {state.blogsLoading ? (
        <Loader className="loader dashboard-loader" message="Loading..." />
      ) : (
        <div>
          <Layout>
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
              {!state.blogs.length ? (
                <p className="no-data-yet">
                  There is no blog now but we are working hard to add them soon,
                  come back later!
                </p>
              ) : (
                state.blogs.map((blog) => (
                  <SwiperSlide key={blog._id}>
                    <div className="blog-summary-div">
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
                      <p
                        className="article-summury"
                        dangerouslySetInnerHTML={{
                          __html: blog.description.substring(0, 100) + "...",
                        }}
                      ></p>
                      <Link
                      to={`/blogs/${blog._id}`}
                    >
                      Read More
                    </Link>
                    </div>
                  </SwiperSlide>
                ))
              )}
            </div>
          </Swiper>
          </Layout>
        </div>
      )}
    </div>
  );
};

export default Blogs;
