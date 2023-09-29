import { useState } from "react";
import ArticleForm from "./ArticleForm";
import ArticleList from "./ArticleList";


const Articles = ({showArticleForm, formType, articles, setFormType, setArticles }) => {
  const [editData, setEditData] = useState(null)
  
  return (
    <div className="all-articles" id="dashboard-all-articles">
      <ArticleList articles={articles} setFormType={setFormType} setEditData={setEditData} setArticles={setArticles}/>
      {showArticleForm && <ArticleForm
      formType={formType}
      article={editData}
      setEditData={setEditData}
      />}
    </div>
  );
};

export default Articles;
