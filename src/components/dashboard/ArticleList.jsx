import likeIcon from '../../images/Vector.svg';
import commentIcon from '../../images/Vector (1).svg';
import editIcon from '../../images/image 8.svg';
import deleteIcon from '../../images/image 9.svg';
import { useState } from 'react';
import Loader from '../Loader';
import { toast } from 'react-toastify';

const ArticleList = ({articles, setFormType, setEditData, setArticles}) => {

  const [delLoading, setDelLoading] = useState(false);

  const handleEdit = (data) => {
    setFormType("edit");
    setEditData(data);
  }

  const handleDelete = async (id) => {
    setDelLoading(true);
    const token = localStorage.getItem("token");
    fetch(
      `${process.env.REACT_APP_BASE_URL}/blogs/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then(async (response) => {
        setDelLoading(false);
        if (response.status === 204) {
          const newArticles = articles.filter(art => art._id !== id);
          setArticles(newArticles);
          toast.success("Blog deleted");
        } else if (response.status === 401) {
          toast.error("You are not logged in");
        } else if (response.status === 403) {
          toast.error("Forbiden, you are not admin");
        } else {
          toast.error("Deleting article failed"); 
        }
      })
      .catch((error) => {
        console.log(error);
        setDelLoading(false);
        toast.error(error.message);
      });
  }

    return(
        <ol>
        <h2>Articles</h2>
        {articles?.length?(
          articles.map(article =>(
            <li key={article._id}>
              <div className="artcle">
                <p className="aticle-title">{article.title}</p>
                <p className="article-created-date">{new Date(article.createdAt).toLocaleString()}</p>
                <div className="dashbrd-article-lcmts">
                  <div className="like-coment">
                    <img src={likeIcon} alt="" className="bloglikeImage" />
                    <p className="number-oflikes">{article.likes.length.toString()}</p>
                  </div>
                  <div className="like-coment">
                    <img src={commentIcon} alt="" />
                    <p className="number-oflikes">{article.comments.length.toString()}</p>
                  </div>
                </div>
                <div className="article-edit-delete">
                  <img src={editIcon} alt="" className="article-edit-class" onClick={()=>handleEdit(article)} />
                  {delLoading? <Loader className="loader"/>:<img src={deleteIcon} alt="" className="article-delete-class" onClick={()=>handleDelete(article._id)} />}
                </div>
              </div>
            </li>
          ))
        ): <p className="empty">There is no any article found!</p>}
      </ol>
    );
}

export default ArticleList;