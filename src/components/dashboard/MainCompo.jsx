import Articles from "./Articles";
import Messages from "./Messages";
import pict from "../../images/profile.png";

const MainCompo = ({showArticleForm, formType, showArticles, showMessages, articles, setFormType, messages, setMessages, setArticles}) => {
    return(
      <div className="rightdiv">
              <h2 className="dash-heading">Dashboard</h2>
              <div className="profile-pic-div">
                <img src={pict} alt="profile" />
                <p>Jimmy Mutabazi</p>
              </div>
              { showArticles && <Articles showArticleForm={showArticleForm} formType={formType} articles={articles} setFormType={setFormType} setArticles={setArticles}/>}
              {showMessages && <Messages messages={messages} setMessages={setMessages}/>}
            </div>
    );
}

export default MainCompo;