function displayAddArticleForm() {
  document.getElementById("add-article-dashbd-form").style.display = "block";
  document.querySelector(".dashtogler").checked = false;
}
function displayEditrticleForm(blogId) {
  const blogs = JSON.parse(localStorage.getItem("Blogs"));
  document.getElementById("edit-article-dashbd-form").style.display = "block";
  for (let i = 0; i < blogs.length; i++) {
    if (blogs[i].id == blogId) {
      const editTitle = document.getElementById("titleBlg");
      editTitle.value = blogs[i].title;
      editEditor.setData(blogs[i].description);
      document
        .getElementById("edit-article-btn")
        .addEventListener("click", () => {
          const newImage = document.getElementById("editFile");
          if (!newImage.value || newImage.value === "") {
            blogs[i].image;
            blogs[i].title = editTitle.value;
            blogs[i].description = editEditor.getData();
            blogs[i].createdDate =
              new Date().toLocaleDateString() +
              " " +
              new Date().toLocaleTimeString();

            try {
              localStorage.setItem("Blogs", JSON.stringify(blogs));
              document.getElementById("editArtcleForm").style = "display: none";
              document.getElementById("editPopup").style = "display: flex";
            } catch (error) {
              document.getElementById("editArtcleForm").style = "display: none";
              document.getElementById("editPopup").style = "display: flex";
              document.querySelector("#addArticlePopup p").innerHTML =
                "Error! Failed to update the article!";
            }
          } else {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
              blogs[i].image = reader.result;

              blogs[i].title = editTitle.value;
              blogs[i].description = editEditor.getData();
              blogs[i].createdDate =
                new Date().toLocaleDateString() +
                " " +
                new Date().toLocaleTimeString();

              try {
                localStorage.setItem("Blogs", JSON.stringify(blogs));
                document.getElementById("editArtcleForm").style =
                  "display: none";
                document.getElementById("editPopup").style = "display: flex";
              } catch (error) {
                document.getElementById("editArtcleForm").style =
                  "display: none";
                document.getElementById("editPopup").style = "display: flex";
                document.querySelector("#addArticlePopup p").innerHTML =
                  "Error! Failed to update the article!";
              }
            });
            reader.readAsDataURL(newImage.files[0]);
          }
        });

      break;
    }
  }
}

function hideEditForm() {
  document.getElementById("editArtcleForm").reset();
  editEditor.setData("");
  document.getElementById("editPopup").style = "display: none";
  document.getElementById("editArtcleForm").style = "display: block";
  document.getElementById("edit-article-dashbd-form").style.display = "none";
}

function uncheckToggler() {
  document.querySelectorAll(".leftdiv a").forEach((element) => {
    element.addEventListener("click", () => {
      document.querySelector(".dashtogler").checked = false;
    });
  });
}
uncheckToggler();

function showNextSkill() {
  document.getElementById("skills-page1").style = "display: none;";
  document.getElementById("skills-page2").style = "display: flex;";
}
function backToFirstSkill() {
  document.getElementById("skills-page2").style = "display: none;";
  document.getElementById("skills-page1").style = "display: flex;";
}
function goToPage3Skill() {
  document.getElementById("skills-page2").style = "display: none;";
  document.getElementById("skills-page3").style = "display: flex;";
}

function backToSecondSkill() {
  document.getElementById("skills-page3").style = "display: none;";
  document.getElementById("skills-page2").style = "display: flex;";
}

function goToPageFourSkill() {
  document.getElementById("skills-header").style = "display: none;";
  document.getElementById("skills-page3").style = "display: none;";
  document.getElementById("skills-page4").style = "display: inline;";
}

function backToThirdPageSkill() {
  document.getElementById("skills-header").style = "display: block;";
  document.getElementById("skills-page4").style = "display: none;";
  document.getElementById("skills-page3").style = "display: flex;";
}

function goToPortfolio2() {
  document.querySelectorAll(".list1").forEach((element) => {
    element.style = "display: none";
  });
  document.querySelectorAll(".list2").forEach((element) => {
    element.style = "display: flex";
  });
}
function backToPortfolio1() {
  document.querySelectorAll(".list2").forEach((element) => {
    element.style = "display: none";
  });
  document.querySelectorAll(".list1").forEach((element) => {
    element.style = "display: flex";
  });
}

function showAllMessages() {
  document.getElementById("all-messages").style = "display: block";
}

function createBlogSummary() {
  const blogs = JSON.parse(localStorage.getItem("Blogs"));
  if (!blogs || blogs.length === 0) {
    const emptyArticle = document.createElement("p");
    emptyArticle.textContent =
      "There is no blog now but we are working hard to add them soon, come back later!";
    emptyArticle.style =
      "color:white; font-size:48px; width:100%; text-align:left;";
    document.querySelector("#blog-summary-1").append(emptyArticle);
  } else {
    blogs.forEach((blog) => {
      const overAllDiv = document.querySelector("#blog-summary-1");
      const summuryBlog = document.createElement("div");
      summuryBlog.className = "swiper-slide blog-summary-div";
      summuryBlog.id = "blog-sum-container";

      const blgSumImg = document.createElement("img");
      blgSumImg.src = blog.image;
      blgSumImg.alt = "A man writing codes";
      summuryBlog.append(blgSumImg);

      const articleDiv = document.createElement("div");
      articleDiv.className = "artcle blog-summury-lc";
      summuryBlog.append(articleDiv);

      const likeDiv = document.createElement("div");
      likeDiv.className = "like-coment";
      const img = document.createElement("img");
      img.className = "bloglikeImage";
      img.src = "./Images/Vector.svg";
      img.alt = "likes icon";
      likeDiv.append(img);
      const numLikesp = document.createElement("p");
      numLikesp.className = "number-oflikes";
      numLikesp.textContent = blog.likes.toString();
      likeDiv.append(numLikesp);
      articleDiv.append(likeDiv);

      const commentDiv = document.createElement("div");
      commentDiv.className = "like-coment";
      const imgOne = document.createElement("img");
      imgOne.src = "./Images/Vector (1).svg";
      imgOne.alt = "comments icon";
      commentDiv.append(imgOne);
      const numCommentsp = document.createElement("p");
      numCommentsp.className = "number-of-comments";
      numCommentsp.textContent = blog.comments.length.toString();
      commentDiv.append(numCommentsp);
      articleDiv.append(commentDiv);
      summuryBlog.append(articleDiv);

      const titleDiv = document.createElement("div");
      titleDiv.className = "blog-sum-title";
      const blh3 = document.createElement("h3");
      blh3.className = "blog-sum-title";
      blh3.textContent = blog.title;
      titleDiv.append(blh3);

      const pdateTime = document.createElement("p");
      pdateTime.textContent = blog.createdDate;
      titleDiv.append(pdateTime);
      summuryBlog.append(titleDiv);

      const pblgSummury = document.createElement("p");
      pblgSummury.className = "article-summury";
      pblgSummury.innerHTML = blog.description.substr(0, 120) + "...";
      summuryBlog.append(pblgSummury);

      const linkBlog = document.createElement("a");
      linkBlog.setAttribute("onclick", "getBlogTitle();");
      linkBlog.href = `./blogOne.html?:${blog.id}`;
      // linkBlog.target = "_blank";
      linkBlog.textContent = "Read More";
      summuryBlog.append(linkBlog);
      overAllDiv.append(summuryBlog);
    });
  }
}

function validateArticleForm() {
  const titleValue = document.getElementById("title").value;
  if (titleValue === "") {
    document.getElementById("articleTitleError").style =
      "display:block; color:red;";
    setTimeout(() => {
      document.getElementById("articleTitleError").style.display = "none";
    }, 6000);
    return false;
  }
  const editorValue = editor.getData();
  // console.log(editorValue);
  if (editorValue === "") {
    document.getElementById("articleDescriptionError").style =
      "display:block; color:red;";
    setTimeout(() => {
      document.getElementById("articleDescriptionError").style.display = "none";
    }, 6000);
    return false;
  }
  const imageFile = document.getElementById("file");
  if (imageFile.value === "") {
    document.getElementById("articleImageUploadError").style =
      "display:block; color:red;";
    setTimeout(() => {
      document.getElementById("articleImageUploadError").style.display = "none";
    }, 6000);
    return false;
  }
  const blogs = JSON.parse(localStorage.getItem("Blogs"));
  const newBlog = {};
  newBlog["id"] = Date.now().toString();
  newBlog["title"] = titleValue;
  newBlog["description"] = editorValue;
  newBlog["comments"] = [];
  newBlog["likes"] = 0;
  newBlog["createdDate"] =
    new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    newBlog["image"] = reader.result;
    blogs.push(newBlog);
    try {
      localStorage.setItem("Blogs", JSON.stringify(blogs));
      document.getElementById("addArtcleForm").style = "display: none";
      document.getElementById("addArticlePopup").style = "display: flex";
    } catch (error) {
      document.getElementById("addArtcleForm").style = "display: none";
      document.getElementById("addArticlePopup").style = "display: flex";
      document.querySelector("#addArticlePopup p").innerHTML =
        "Error! Failed to create the blog!";
    }
  });
  reader.readAsDataURL(imageFile.files[0]);
}

function hideAddForm() {
  addArtcleForm.reset();
  editor.setData("");
  document.getElementById("addArticlePopup").style = "display: none";
  document.getElementById("addArtcleForm").style = "display: block";
  document.getElementById("add-article-dashbd-form").style.display = "none";
}

function likesfunction() {
  const blogURI = window.location.href.split("?:").reverse();
  const blogId = blogURI[0];
  var Blog = JSON.parse(localStorage.getItem("Blogs"));
  for (let i = 0; i < Blog.length; i++) {
    if (Blog[i].id == blogId) {
      var numOfLikes = Blog[i].likes;
      const newNunOfLikes = parseInt(numOfLikes) + 1;
      Blog[i].likes = newNunOfLikes;
      localStorage.setItem("Blogs", JSON.stringify(Blog));
      document.querySelector(".specific-blog-likes").innerHTML =
        newNunOfLikes.toString();
      document.querySelector(".bloglikeImage").removeEventListener("click");
      break;
    }
  }
}

function createComments() {
  const nameField = document.getElementById("name");
  const textAreaField = document.getElementById("comment");
  const nameError = document.getElementById("cmt-form-name-verify");
  const commentError = document.getElementById("cmt-form-comment-verify");
  const mainComment = textAreaField.value;
  if (nameField.value === "") {
    nameError.style.display = "block";
    setTimeout(() => {
      nameError.style.display = "none";
    }, 6000);
    return false;
  }
  if (mainComment === "") {
    commentError.style.display = "block";
    setTimeout(() => {
      commentError.style.display = "none";
    }, 6000);
    return false;
  }

  let blogs = JSON.parse(localStorage.getItem("Blogs"));

  let comment = {};
  comment["name"] = nameField.value;
  comment["date"] =
    new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
  comment["mainComment"] = mainComment;

  const blogURI = window.location.href.split("?:").reverse();
  const blogId = blogURI[0];

  for (let i = 0; i < blogs.length; i++) {
    if (blogs[i].id === blogId) {
      blogs[i].comments.push(comment);
      localStorage.setItem("Blogs", JSON.stringify(blogs));
      break;
    }
  }

  document.getElementById("blogC0mmentField").reset();
  location.reload();
}

function loadFullBlog() {
  const blogs = JSON.parse(localStorage.getItem("Blogs"));
  const blogURI = window.location.href.split("?:").reverse();
  const blogId = blogURI[0];
  for (let i = 0; i < blogs.length; i++) {
    if (blogs[i].id === blogId) {
      const blog = blogs[i];

      const blogpost_div = document.querySelector("div.blogpost-div");
      const blogposttitle = document.createElement("h2");
      blogposttitle.className = "blog-post-title";
      blogposttitle.textContent = blog.title;
      blogpost_div.append(blogposttitle);

      const updatedAt = document.createElement("p");
      updatedAt.className = "blogpost-time";
      updatedAt.textContent = "Last updated " + blog.createdDate;
      blogpost_div.append(updatedAt);

      const imageOnBlog = document.createElement("img");
      imageOnBlog.className = "blogpost-image";
      imageOnBlog.src = blog.image;
      imageOnBlog.alt = "Writing codes";
      blogpost_div.append(imageOnBlog);

      const paragOfBlog = document.createElement("p");
      paragOfBlog.className = "blog-content";
      paragOfBlog.innerHTML = blog.description;
      blogpost_div.append(paragOfBlog);

      const like_div = document.createElement("div");
      like_div.className = "like-coment post-like-commet";
      const bloglikeImage = document.createElement("img");
      bloglikeImage.className = "bloglikeImage";
      bloglikeImage.onclick = "likesfunction();";
      bloglikeImage.addEventListener("click", likesfunction);
      bloglikeImage.src = "./Images/Vector.svg";
      bloglikeImage.alt = "likes icon";
      like_div.append(bloglikeImage);
      const numLike = document.createElement("p");
      numLike.className = "specific-blog-likes";
      numLike.innerHTML = blog.likes.toString();
      like_div.append(numLike);
      blogpost_div.append(like_div);

      const comment_div = document.createElement("div");
      comment_div.className = "like-coment post-like-commet";
      const commentImage = document.createElement("img");
      commentImage.src = "./Images/Vector (1).svg";
      commentImage.alt = "comments icon";
      comment_div.append(commentImage);
      const numComment = document.createElement("p");
      numComment.innerHTML = blog.comments.length.toString();
      comment_div.append(numComment);
      blogpost_div.append(comment_div);

      const all_blog_comment_div = document.createElement("div");
      all_blog_comment_div.className = "all-blog-comments";
      const headofComments = document.createElement("h3");
      headofComments.textContent = "Comments";
      all_blog_comment_div.append(headofComments);
      const orderedList = document.createElement("ol");
      const blogComments = blog.comments;
      blogComments.forEach((cmt) => {
        const olLi = document.createElement("li");
        const commented = document.createElement("div");
        commented.innerHTML = `<h5>${cmt.name}</h5><small>- ${cmt.date}</small>`;
        olLi.append(commented);

        const brTag = document.createElement("br");
        olLi.append(brTag);

        const smallcom = document.createElement("small");
        smallcom.textContent = cmt.mainComment;
        olLi.append(smallcom);

        const brTagOne = document.createElement("br");
        olLi.append(brTagOne);

        const brTagTwo = document.createElement("br");
        olLi.append(brTagTwo);

        orderedList.append(olLi);
      });

      all_blog_comment_div.append(orderedList);
      blogpost_div.append(all_blog_comment_div);

      const formBlog = document.createElement("form");
      formBlog.action = "#";
      formBlog.method = "post";
      formBlog.setAttribute("onsubmit", "return false");
      formBlog.id = "blogC0mmentField";

      const lableName = document.createElement("label");
      lableName.setAttribute("for", "name");
      lableName.textContent = "Name: ";
      formBlog.append(lableName);

      const inputNameField = document.createElement("input");
      inputNameField.type = "text";
      inputNameField.name = "name";
      inputNameField.id = "name";
      inputNameField.placeholder = "Full name";
      formBlog.append(inputNameField);

      const brOne = document.createElement("br");
      formBlog.append(brOne);

      const smallOne = document.createElement("small");
      smallOne.className = "contact-form-error";
      smallOne.id = "cmt-form-name-verify";
      smallOne.textContent = "Please fill in this field";
      formBlog.append(smallOne);

      const brTwo = document.createElement("br");
      formBlog.append(brTwo);

      const textAreaField = document.createElement("textarea");
      textAreaField.name = "comment";
      textAreaField.id = "comment";
      textAreaField.placeholder = "Add your comment";
      formBlog.append(textAreaField);

      const brThree = document.createElement("br");
      formBlog.append(brThree);

      const smallTwo = document.createElement("small");
      smallTwo.className = "contact-form-error";
      smallTwo.id = "cmt-form-comment-verify";
      smallTwo.textContent = "Please fill in this field";
      formBlog.append(smallTwo);

      const brFour = document.createElement("br");
      formBlog.append(brFour);

      const blogFormButton = document.createElement("button");
      blogFormButton.type = "submit";
      blogFormButton.id = "blog-comt";
      blogFormButton.addEventListener("click", createComments);
      blogFormButton.textContent = "Add comment";
      formBlog.append(blogFormButton);
      blogpost_div.append(formBlog);
      break;
    }
  }
}

function loadDashboardDymanicContent() {
  var blogsArray = JSON.parse(localStorage.getItem("Blogs"));
  if (!blogsArray || blogsArray.length === 0) {
    const emptyArticle = document.createElement("p");
    emptyArticle.textContent = "There is no any article found!";
    emptyArticle.style =
      "color:red; font-size:36px; width:100%; text-align:left;";
    document.getElementById("dashboard-all-articles").append(emptyArticle);
  } else {
    const blogs = blogsArray.reverse();
    blogs.forEach((blog) => {
      const artLi = document.createElement("li");
      const article = document.createElement("div");
      article.className = "artcle";

      const aticle_title = document.createElement("p");
      aticle_title.className = "aticle-title";
      aticle_title.innerHTML = blog.title;
      article.append(aticle_title);

      const datep = document.createElement("p");
      datep.className = "article-created-date";
      datep.innerHTML = blog.createdDate;
      article.append(datep);

      const dashbrd_article_lcmts = document.createElement("div");
      dashbrd_article_lcmts.className = "dashbrd-article-lcmts";

      const like_coment = document.createElement("div");
      like_coment.className = "like-coment";
      const bloglikeImage = document.createElement("img");
      bloglikeImage.className = "bloglikeImage";
      bloglikeImage.src = "./Images/Vector.svg";
      bloglikeImage.alt = "likes icon";
      like_coment.append(bloglikeImage);
      const number_oflikesp = document.createElement("p");
      number_oflikesp.className = "number-oflikes";
      number_oflikesp.innerHTML = blog.likes.toString();
      like_coment.append(number_oflikesp);

      dashbrd_article_lcmts.append(like_coment);

      const dasCometDiv = document.createElement("div");
      dasCometDiv.className = "like-coment";

      const dasCometImg = document.createElement("img");
      dasCometImg.src = "./Images/Vector (1).svg";
      dasCometImg.alt = "comments icon";
      dasCometDiv.append(dasCometImg);

      const numberOfComments = document.createElement("p");
      numberOfComments.className = "number-of-comments";
      numberOfComments.innerHTML = blog.comments.length;

      dasCometDiv.append(numberOfComments);
      dashbrd_article_lcmts.append(dasCometDiv);
      article.append(dashbrd_article_lcmts);

      const editDeleteDiv = document.createElement("div");
      editDeleteDiv.className = "article-edit-delete";
      const editImage = document.createElement("img");
      editImage.className = "article-edit-class";
      editImage.src = "./Images/image 8.svg";
      editImage.alt = "edit icon";
      editImage.setAttribute("onclick", `displayEditrticleForm(${blog.id})`);
      editDeleteDiv.append(editImage);

      const deleteImg = document.createElement("img");
      deleteImg.className = "article-delete-class";
      deleteImg.src = "./Images/image 9.svg";
      deleteImg.alt = "delete icon";
      deleteImg.setAttribute("onclick", `deleteArticle(${blog.id})`);
      editDeleteDiv.append(deleteImg);

      article.append(editDeleteDiv);

      artLi.append(article);
      document.getElementById("dashOrderedList").append(artLi);
    });
  }

  const newsentMessages = JSON.parse(localStorage.getItem("Messages"));
  const sentMessages = newsentMessages.reverse();
  if (!sentMessages || sentMessages.length === 0) {
    document.querySelector("#tableMessages").style.display = "none";
    document.querySelector("#tablePopup").style.display = "flex";
  } else {
    sentMessages.forEach((msg) => {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.textContent = msg.name;
      tr.append(td);
      const tdOne = document.createElement("td");
      tdOne.textContent = msg.email;
      tr.append(tdOne);
      const tdTwo = document.createElement("td");
      tdTwo.textContent = msg.phone;
      tr.append(tdTwo);
      const tdThree = document.createElement("td");
      tdThree.textContent = msg.message;
      tr.append(tdThree);
      const tdFour = document.createElement("td");
      tdFour.textContent = msg.sentDate;
      tr.append(tdFour);

      const tdFive = document.createElement("td");
      const msgDeleteImage = document.createElement("img");
      msgDeleteImage.className = "message-delete-class";
      msgDeleteImage.src = "./Images/image 9.svg";
      msgDeleteImage.alt = "delete icon";
      msgDeleteImage.setAttribute("onclick", `deleteMessage(${msg.id});`);
      tdFive.append(msgDeleteImage);
      tr.append(tdFive);

      document.querySelector("tbody").append(tr);
    });
  }
}

function hideTable() {
  document.querySelector("#all-messages").style.display = "none";
}

function contactFormValidation() {
  const emailTestRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const fullName = document.getElementById("contName").value;
  const Email = document.getElementById("contEmail").value;
  const tell = document.getElementById("phone").value;
  const message = document.getElementById("message").value;
  const fullNameError = document.getElementById("contNameError");
  const emailError = document.getElementById("contEmailError");
  const phoneError = document.getElementById("contPhoneError");
  const messageError = document.getElementById("contMessageError");
  const contPhoneEengthError = document.getElementById("contPhoneEengthError");
  const contMessageLengthError = document.getElementById(
    "contMessageLengthError"
  );
  const contEmailValidateError = document.getElementById(
    "contEmailValidateError"
  );
  const contfullNameLengthError = document.getElementById(
    "contfullNameLengthError"
  );
  const contPhoneNumbervalidError = document.getElementById(
    "contPhoneNumbervalidError"
  );
  const contPhonecountryCodeError = document.getElementById(
    "contPhonecountryCodeError"
  );
  if (fullName === "") {
    fullNameError.style = "display:block; color:red;";
    setTimeout(() => {
      fullNameError.style.display = "none";
    }, 6000);
    return false;
  }
  if (fullName.length < 3) {
    contfullNameLengthError.style.display = "block";
    setTimeout(() => {
      contfullNameLengthError.style.display = "none";
    }, 6000);
    return false;
  }
  if (Email === "") {
    emailError.style = "display:block; color:red;";
    setTimeout(() => {
      emailError.style.display = "none";
    }, 6000);
    return false;
  }
  if (!Email.match(emailTestRegex)) {
    contEmailValidateError.style = "display:block; color:red;";
    setTimeout(() => {
      contEmailValidateError.style.display = "none";
    }, 6000);
    return false;
  }
  if (tell === "") {
    phoneError.style = "display:block; color:red;";
    setTimeout(() => {
      phoneError.style.display = "none";
    }, 6000);
    return false;
  }
  if (tell.length < 10 || tell.length > 13) {
    contPhoneEengthError.style = "display:block; color:red;";
    setTimeout(() => {
      contPhoneEengthError.style.display = "none";
    }, 6000);
    return false;
  }
  if (tell[0] !== "+") {
    contPhonecountryCodeError.style = "display:block; color:red;";
    setTimeout(() => {
      contPhonecountryCodeError.style.display = "none";
    }, 6000);
    return false;
  }
  for (var i = 1; i < tell.length; i++) {
    if (isNaN(tell[i])) {
      contPhoneNumbervalidError.style = "display:block; color:red;";
      setTimeout(() => {
        contPhoneNumbervalidError.style.display = "none";
      }, 6000);
      return false;
    }
  }
  if (message === "") {
    messageError.style = "display:block; color:red;";
    setTimeout(() => {
      messageError.style.display = "none";
    }, 6000);
    return false;
  }
  if (message.length < 15) {
    contMessageLengthError.style = "display:block; color:red;";
    setTimeout(() => {
      contMessageLengthError.style.display = "none";
    }, 6000);
    return false;
  }

  const allMessages = JSON.parse(localStorage.getItem("Messages"));

  const newMessage = {};
  newMessage["id"] = Date.now().toString();
  newMessage["name"] = fullName;
  newMessage["email"] = Email;
  newMessage["phone"] = tell;
  newMessage["message"] = message;
  newMessage["sentDate"] = new Date().toLocaleDateString();
  allMessages.push(newMessage);
  try {
    localStorage.setItem("Messages", JSON.stringify(allMessages));
    document.querySelector("#sendMessage").reset();
    document.querySelector("#sendMessage").style.display = "none";
    document.getElementById("sendMessageForm").style =
      "background-color: none;";
    document.querySelector(".popup").style.display = "flex";
  } catch (error) {
    document.getElementById("sendMessageForm").style =
      "background-color: none;";
    document.querySelector(".popup").style.display = "flex";
    document.querySelector(".popup p").innerHTML = "Error! Message not sent!";
    document.querySelector(".popup button").innerHTML = "Try again";
  }
}

function showContactForm() {
  document.querySelector(".popup").style.display = "none";
  document.getElementById("sendMessageForm").style.backgroundColor = "white";
  document.querySelector("#sendMessage").style.display = "block";
}

function loginValidation() {
  const emailTestRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  // const emailTestRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const loginEmail = document.getElementById("loginEmail").value;
  const loginPassw = document.getElementById("password").value;
  const loginEmailErr = document.getElementById("loginEmailError");
  const loginPasswErr = document.getElementById("loginPasswordError");
  const loginEmailValidateError = document.getElementById(
    "loginEmailValidateError"
  );
  const loginIcorrectEmailError = document.getElementById(
    "loginIcorrectEmailError"
  );
  if (loginEmail === "") {
    loginEmailErr.style = "display:block; color:red;";
    setTimeout(() => {
      loginEmailErr.style.display = "none";
    }, 6000);
    return false;
  }
  if (!loginEmail.match(emailTestRegex)) {
    loginEmailValidateError.style = "display:block; color:red;";
    setTimeout(() => {
      loginEmailValidateError.style.display = "none";
    }, 6000);
    return false;
  }

  if (loginPassw === "") {
    loginPasswErr.style = "display:block; color:red;";
    setTimeout(() => {
      loginPasswErr.style.display = "none";
    }, 6000);
    return false;
  }

  const user = JSON.parse(localStorage.getItem("users"));
  if (loginEmail !== user.email || loginPassw !== user.password) {
    loginIcorrectEmailError.style.display = "block";
    setTimeout(() => {
      loginIcorrectEmailError.style.display = "none";
    }, 6000);
    return false;
  }
}

function deleteArticle(blogId) {
  const blogs = JSON.parse(localStorage.getItem("Blogs"));
  for (let i = 0; i < blogs.length; i++) {
    if (blogs[i].id == blogId) {
      blogs.splice(i, 1);
      localStorage.setItem("Blogs", JSON.stringify(blogs));
      location.reload();
      break;
    }
  }
}
function deleteMessage(messageId) {
  const messages = JSON.parse(localStorage.getItem("Messages"));
  for (let i = 0; i < messages.length; i++) {
    if (messages[i].id == messageId) {
      messages.splice(i, 1);
      localStorage.setItem("Messages", JSON.stringify(messages));
      location.reload();
      break;
    }
  }
}
