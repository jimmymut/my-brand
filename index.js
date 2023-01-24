window.addEventListener("DOMContentLoaded", async () => {
  isLoggedin();
  const profileNameT = document.querySelector("p.loggedin-profile-name");
  const token = localStorage.getItem("token");
  const loggedInUser = await (
    await fetch(`https://jimmy-portfolio-backend.up.railway.app/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  ).json();

  profileNameT.textContent = `${loggedInUser.name}`;
  document.querySelector("div.prof-pic-name").style.display = "flex";
});

async function genLogout() {
  const logoutEle = document.querySelector(".btn.header-btn.login-btn");
  logoutEle.addEventListener("click", () => {
    if (logoutEle.innerHTML == "Log out") {
      logoutFunc();
    }
  });
}
genLogout();

async function isLoggedin() {
  const token = localStorage.getItem("token");
  fetch("https://jimmy-portfolio-backend.up.railway.app/users/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (response) => {
      if (response.status === 200) {
        document.querySelector(".btn.header-btn.login-btn").innerHTML =
          "Log out";
        const disableSup = document.querySelector(
          ".btn.header-btn.signin-btn a"
        );
        disableSup.classList.add("disabled");
        document.querySelector(".btn.header-btn.signin-btn").style =
          "display:none";
      }
    })
    .catch((err) => console.log(err));
}

function displayAddArticleForm() {
  document.getElementById("add-article-dashbd-form").style.display = "block";
  document.querySelector(".dashtogler").checked = false;
  document.getElementById("edit-article-dashbd-form").style.display = "none";
  document.getElementById("sign-up-form-div-dash").style.display = "none";
}

function displayAdminSignUp() {
  document.getElementById("add-article-dashbd-form").style.display = "none";
  document.getElementById("edit-article-dashbd-form").style.display = "none";
  document.getElementById("all-messages").style.display = "none";
  document.getElementById("sign-up-form-div-dash").style.display = "block";
}

async function validateEditArticleForm() {
  const token = localStorage.getItem("token");

  const newformToEditArticle = document.getElementById(
    "edit-article-dashbd-form"
  );
  newformToEditArticle.addEventListener("submit", async (e) => {
    e.preventDefault();
    const titleEditValue = document.getElementById("titleBlg").value;
    const descriptionValue = editEditor.getData();
    const image = document.getElementById("editFile");
    if (titleEditValue !== "" && titleEditValue.length < 6) {
      document.getElementById("articleEditTitleLengthError").style.display =
        "block";
      setTimeout(() => {
        document.getElementById("articleEditTitleLengthError").style.display =
          "none";
      }, 6000);
      return false;
    }
    if (descriptionValue !== "" && descriptionValue.length < 100) {
      document.getElementById("articleEditDescriptionError").style.display =
        "block";
      setTimeout(() => {
        document.getElementById("articleEditDescriptionError").style.display =
          "none";
      }, 6000);
      return false;
    }

    if (
      titleEditValue === "" &&
      descriptionValue === "" &&
      image.value === ""
    ) {
      document.getElementById("error-all-empty").style.display = "block";
      setTimeout(() => {
        document.getElementById("error-all-empty").style.display = "none";
      }, 6000);
      return false;
    }
    const blogId = document.querySelector("span.edi-form_id").innerHTML;

    if (descriptionValue === "" && image.value === "") {
      document.getElementById("editArtcleForm").style = "display: none";
      document.getElementById(
        "edit-article-dashbd-form"
      ).style.backgroundColor = "white";
      const loaderEl = document.querySelector("div.loader-edit-article");
      loaderEl.style.display = "flex";
      await fetch(`https://jimmy-portfolio-backend.up.railway.app/blogs/${blogId}`, {
        method: "PATCH",
        body: JSON.stringify({ title: titleEditValue }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          loaderEl.style.display = "none";
          if (response.status === 200) {
            document.getElementById("editPopup").style = "display: flex";
          } else {
            document.getElementById("editArtcleForm").style = "display: none";
            document.getElementById(
              "edit-article-dashbd-form"
            ).style.backgroundColor = "white";

            document.getElementById("article-update-message").style =
              "display: flex";
            return;
          }
        })
        .catch((err) => console.log(err));
    } else if (titleEditValue === "" && image.value === "") {
      document.getElementById("editArtcleForm").style = "display: none";
      document.getElementById(
        "edit-article-dashbd-form"
      ).style.backgroundColor = "white";
      const loaderEl = document.querySelector("div.loader-edit-article");
      loaderEl.style.display = "flex";
      await fetch(`https://jimmy-portfolio-backend.up.railway.app/blogs/${blogId}`, {
        method: "PATCH",
        body: JSON.stringify({ description: descriptionValue }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          loaderEl.style.display = "none";
          if (response.status === 200) {
            document.getElementById("editPopup").style = "display: flex";
          } else {
            document.getElementById("editArtcleForm").style = "display: none";
            document.getElementById(
              "edit-article-dashbd-form"
            ).style.backgroundColor = "white";

            document.getElementById("article-update-message").style =
              "display: flex";
            return;
          }
        })
        .catch((err) => console.log(err));
    } else if (titleEditValue === "" && descriptionValue === "") {
      const formDada = new FormData();
      formDada.append("file", image.files[0]);
      document.getElementById("editArtcleForm").style = "display: none";
      document.getElementById(
        "edit-article-dashbd-form"
      ).style.backgroundColor = "white";
      const loaderEl = document.querySelector("div.loader-edit-article");
      loaderEl.style.display = "flex";
      await fetch(`https://jimmy-portfolio-backend.up.railway.app/blogs/${blogId}`, {
        method: "PATCH",
        body: formDada,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          loaderEl.style.display = "none";
          if (response.status === 200) {
            document.getElementById("editPopup").style = "display: flex";
          } else {
            document.getElementById("editArtcleForm").style = "display: none";
            document.getElementById(
              "edit-article-dashbd-form"
            ).style.backgroundColor = "white";

            document.getElementById("article-update-message").style =
              "display: flex";
            return;
          }
        })
        .catch((err) => console.log(err));
    } else if (image.value === "") {
      document.getElementById("editArtcleForm").style = "display: none";
      document.getElementById(
        "edit-article-dashbd-form"
      ).style.backgroundColor = "white";
      const loaderEl = document.querySelector("div.loader-edit-article");
      loaderEl.style.display = "flex";
      await fetch(`https://jimmy-portfolio-backend.up.railway.app/blogs/${blogId}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: titleEditValue,
          description: descriptionValue,
        }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          loaderEl.style.display = "none";
          if (response.status === 200) {
            document.getElementById("editPopup").style = "display: flex";
          } else {
            document.getElementById("editArtcleForm").style = "display: none";
            document.getElementById(
              "edit-article-dashbd-form"
            ).style.backgroundColor = "white";

            document.getElementById("article-update-message").style =
              "display: flex";
            return;
          }
        })
        .catch((err) => console.log(err));
    } else if (descriptionValue === "") {
      const newFormDada = new FormData();
      newFormDada.append("title", titleEditValue);
      newFormDada.append("file", image.files[0]);
      document.getElementById("editArtcleForm").style = "display: none";
      document.getElementById(
        "edit-article-dashbd-form"
      ).style.backgroundColor = "white";
      const loaderEl = document.querySelector("div.loader-edit-article");
      loaderEl.style.display = "flex";
      await fetch(`https://jimmy-portfolio-backend.up.railway.app/blogs/${blogId}`, {
        method: "PATCH",
        body: newFormDada,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          loaderEl.style.display = "none";
          if (response.status === 200) {
            document.getElementById("editPopup").style = "display: flex";
          } else {
            document.getElementById("editArtcleForm").style = "display: none";
            document.getElementById(
              "edit-article-dashbd-form"
            ).style.backgroundColor = "white";

            document.getElementById("article-update-message").style =
              "display: flex";
            return;
          }
        })
        .catch((err) => console.log(err));
    } else if (titleEditValue === "") {
      const newFormDada = new FormData();
      newFormDada.append("description", descriptionValue);
      newFormDada.append("file", image.files[0]);
      document.getElementById("editArtcleForm").style = "display: none";
      document.getElementById(
        "edit-article-dashbd-form"
      ).style.backgroundColor = "white";
      const loaderEl = document.querySelector("div.loader-edit-article");
      loaderEl.style.display = "flex";
      await fetch(`https://jimmy-portfolio-backend.up.railway.app/blogs/${blogId}`, {
        method: "PATCH",
        body: newFormDada,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          loaderEl.style.display = "none";
          if (response.status === 200) {
            document.getElementById("editPopup").style = "display: flex";
          } else {
            document.getElementById("editArtcleForm").style = "display: none";
            document.getElementById(
              "edit-article-dashbd-form"
            ).style.backgroundColor = "white";

            document.getElementById("article-update-message").style =
              "display: flex";
            return;
          }
        })
        .catch((err) => console.log(err));
    } else {
      const formDadaEdit = new FormData();
      formDadaEdit.append("title", titleEditValue);
      formDadaEdit.append("description", descriptionValue);
      formDadaEdit.append("file", image.files[0]);
      document.getElementById("editArtcleForm").style = "display: none";
      document.getElementById(
        "edit-article-dashbd-form"
      ).style.backgroundColor = "white";
      const loaderEl = document.querySelector("div.loader-edit-article");
      loaderEl.style.display = "flex";
      await fetch(`https://jimmy-portfolio-backend.up.railway.app/blogs/${blogId}`, {
        method: "PATCH",
        body: formDadaEdit,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          loaderEl.style.display = "none";
          if (response.status === 200) {
            document.getElementById("editPopup").style = "display: flex";
          } else {
            document.getElementById("editArtcleForm").style = "display: none";
            document.getElementById(
              "edit-article-dashbd-form"
            ).style.backgroundColor = "white";

            document.getElementById("article-update-message").style =
              "display: flex";
            return;
          }
        })
        .catch((err) => console.log(err));
    }
  });
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
  document.getElementById("dashboard-all-articles").style.display = "none";
}

function showAllDashboardBlogs() {
  document.getElementById("dashboard-all-articles").style.display = "block";
  document.getElementById("all-messages").style = "display: none";
}


function uploadImage() {
  const fileIn = document.querySelector("#file");
  fileIn.addEventListener("change", (e) => {
    const prefile = URL.createObjectURL(e.target.files[0]);
    const imagePreviewUpload = document.getElementById("image-create-preview");
    const newimg = document.createElement("img");
    newimg.src = prefile;
    imagePreviewUpload.innerHTML = "";
    imagePreviewUpload.appendChild(newimg);
    newimg.style.display = "block";
  });
}
uploadImage();

function uploadEditImage() {
  const fileIn = document.querySelector("#editFile");
  fileIn.addEventListener("change", (e) => {
    const prefile = URL.createObjectURL(e.target.files[0]);
    const imagePreviewUpload = document.getElementById("image-edit-preview");
    imagePreviewUpload.src = prefile;
  });
}
uploadEditImage();

async function validateArticleForm() {
  const titleValue = document.getElementById("title").value;
  if (titleValue === "") {
    document.getElementById("articleTitleError").style =
      "display:block; color:red;";
    setTimeout(() => {
      document.getElementById("articleTitleError").style.display = "none";
    }, 6000);
    return false;
  }
  if (titleValue.length < 6) {
    document.getElementById("articleTitleLengthError").style =
      "display:block; color:red;";
    setTimeout(() => {
      document.getElementById("articleTitleLengthError").style.display = "none";
    }, 6000);
    return false;
  }
  const editorValue = editor.getData();
  if (editorValue === "") {
    document.getElementById("articleDescriptionError").style =
      "display:block; color:red;";
    setTimeout(() => {
      document.getElementById("articleDescriptionError").style.display = "none";
    }, 6000);
    return false;
  }
  if (editorValue.length < 100) {
    document.getElementById("articleDescriptionLength").style =
      "display:block; color:red;";
    setTimeout(() => {
      document.getElementById("articleDescriptionLength").style.display =
        "none";
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

  const formDada = new FormData();
  formDada.append("title", titleValue);
  formDada.append("description", editorValue);
  formDada.append("file", imageFile.files[0]);

  const token = localStorage.getItem("token");
  document
    .getElementById("addArtcleForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      document.getElementById("addArtcleForm").style = "display: none";
      document.getElementById("add-article-dashbd-form").style.backgroundColor =
        "white";
      const loaderEl = document.querySelector("div.create-new-article-form");
      loaderEl.style.display = "flex";
      fetch("https://jimmy-portfolio-backend.up.railway.app/blogs", {
        method: "POST",
        body: formDada,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(async (response) => {
        if (response.status === 200) {
          const blog = await response.json();
          const artLi = document.createElement("li");
          const article = document.createElement("div");
          article.className = "artcle";

          const aticle_title = document.createElement("p");
          aticle_title.className = "aticle-title";
          aticle_title.innerHTML = blog.title;
          article.append(aticle_title);

          const datep = document.createElement("p");
          datep.className = "article-created-date";
          datep.innerHTML = new Date(blog.createdAt).toLocaleString();
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
          number_oflikesp.innerHTML = blog.likes.length.toString();
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
          editImage.setAttribute("identifier", `${blog._id}`);
          editImage.addEventListener("click", () => {
            const formToEditArticle = document.getElementById(
              "edit-article-dashbd-form"
            );
            document.getElementById("add-article-dashbd-form").style.display =
              "none";
            formToEditArticle.style.display = "block";
            const editTitle = document.getElementById("titleBlg");
            editTitle.value = blog.title;
            editEditor.setData(blog.description);
            const blogIdTag = document.createElement("span");
            blogIdTag.className = "edi-form_id";
            blogIdTag.innerHTML = `${blog._id}`;
            blogIdTag.style.display = "none";
            formToEditArticle.append(blogIdTag);
            const imagePreview = document.getElementById("image-edit-preview");
            imagePreview.src = blog.file.url;
          });

          editDeleteDiv.append(editImage);

          const deleteImg = document.createElement("img");
          deleteImg.className = "article-delete-class";
          deleteImg.src = "./Images/image 9.svg";
          deleteImg.alt = "delete icon";
          deleteImg.addEventListener("click", async () => {
            const deleteBLoad = document.querySelector(
              "div.delete-article-loader"
            );
            deleteBLoad.style.display = "flex";
            fetch(`https://jimmy-portfolio-backend.up.railway.app/blogs/${blog._id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            })
              .then(async (response) => {
                deleteBLoad.style.display = "none";
                if (response.status === 204) {
                  const blogParent = artLi.parentNode;
                  blogParent.removeChild(artLi);
                  alert("Blog deleted");
                } else if (response.status === 401) {
                  alert("You are not logged in");
                } else if (response.status === 403) {
                  alert("Forbiden, you are not admin");
                } else {
                  alert("Deleting article failed");
                }
              })
              .catch((error) => console.log(error));
          });
          editDeleteDiv.append(deleteImg);

          article.append(editDeleteDiv);

          artLi.append(article);
          document.getElementById("dashOrderedList").appendChild(artLi);

          loaderEl.style.display = "none";
          document.getElementById("addArticlePopup").style = "display: flex";
        } else {
          loaderEl.style.display = "none";
          document.getElementById(
            "add-article-dashbd-form"
          ).style.backgroundColor = "white";
          document.getElementById("failAddArticlePopup").style =
            "display: flex";
          return;
        }
      });
    });
}

function hideAddForm() {
  addArtcleForm.reset();
  editor.setData("");
  document.getElementById("addArticlePopup").style = "display: none";
  document.getElementById("addArtcleForm").style = "display: block";
  document.getElementById("add-article-dashbd-form").style.display = "none";
}

async function likesFunction() {
  const blogURI = window.location.href.split("?:").reverse();
  const blogId = blogURI[0];
  const token = localStorage.getItem("token");
  fetch(`https://jimmy-portfolio-backend.up.railway.app/blogs/${blogId}/likes`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(async (response) => {
      if (response.status === 200) {
        const result = await response.json();
        document.querySelector(".specific-blog-likes").innerHTML =
          result.likes.toString();
      } else if (response.status === 401) {
        alert(
          "Please login in order to like an article\nIf you don't have an account, signup and then login"
        );
      } else if (response.status === 403) {
        const result = await response.json();
        alert(result.message);
      } else {
        alert("Something went wrong!");
      }
    })
    .catch((error) => console.log(error));
}

async function validateComment() {
  const blogURI = window.location.href.split("?:").reverse();
  const blogId = blogURI[0];
  const token = localStorage.getItem("token");
  const textAreaField = document.querySelector("#comment");
  const commentLengthError = document.querySelector(
    "#cmt-form-comment-verify-length"
  );
  const commentError = document.querySelector("#cmt-form-comment-verify");
  const mainComment = textAreaField.value;

  if (mainComment === "") {
    commentError.style.display = "block";
    setTimeout(() => {
      commentError.style.display = "none";
    }, 6000);
    return false;
  }

  if (mainComment.length < 10) {
    commentLengthError.style.display = "block";
    setTimeout(() => {
      commentLengthError.style.display = "none";
    }, 6000);
    return false;
  }
  fetch(`https://jimmy-portfolio-backend.up.railway.app/blogs/${blogId}/comments`, {
    method: "post",
    body: JSON.stringify({ comment: mainComment }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (response) => {
      if (response.status === 200) {
        const result = await response.json();
        const newCmtLi = document.createElement("li");
        const commented = document.createElement("div");
        const commentedUser = await (
          await fetch(`https://jimmy-portfolio-backend.up.railway.app/users/${result.userId}`)
        ).json();
        commented.innerHTML = `<h5>${commentedUser}</h5><small>- ${new Date(
          result.commentedAt
        ).toLocaleString()}</small>`;
        newCmtLi.append(commented);

        const brTag = document.createElement("br");
        newCmtLi.append(brTag);

        const smallcom = document.createElement("small");
        smallcom.textContent = result.comment;
        newCmtLi.append(smallcom);

        const brTagOne = document.createElement("br");
        newCmtLi.append(brTagOne);

        const brTagTwo = document.createElement("br");
        newCmtLi.append(brTagTwo);

        document.querySelector(".full-mode-orderd-list").append(newCmtLi);

        fetch(`https://jimmy-portfolio-backend.up.railway.app/blogs/${blogId}/comments/comments`)
          .then(async (newRes) => {
            if (newRes.status === 200) {
              const newData = await newRes.json();
              document.querySelector(".full-article-num-comments").innerHTML =
                newData.comments.toString();
            } else {
              alert("Something went wrong");
            }
          })
          .catch((error) => console.log(error));
      } else if (response.status === 401) {
        alert(
          "Please login in order to add a comment on an article\nIf you don't have an account, signup and then login"
        );
      } else {
        alert("Something went wrong!");
      }
    })
    .catch((err) => console.log(err));
  document.querySelector("#blogC0mmentField").reset();
}

async function logoutFunc() {
  const token = localStorage.getItem("token");
  await fetch("https://jimmy-portfolio-backend.up.railway.app/logout", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => {
      if (response.status === 200) {
        localStorage.removeItem("token");
        location.href = "./login.html";
      }
    })
    .catch((error) => console.log(error));
}

async function loadFullBlog() {
  const blogURI = window.location.href.split("?:").reverse();
  const blogId = blogURI[0];
  const fetchedBlog = await fetch(`https://jimmy-portfolio-backend.up.railway.app/blogs/${blogId}`);
  const blog = await fetchedBlog.json();

  const blogpost_div = document.querySelector("div.blogpost-div");
  const blogposttitle = document.createElement("h2");
  blogposttitle.className = "blog-post-title";
  blogposttitle.textContent = blog.title;
  blogpost_div.append(blogposttitle);

  const createdtimedAt = document.createElement("p");
  createdtimedAt.className = "blogpost-time";
  createdtimedAt.textContent = `Created   ${new Date(
    blog.createdAt
  ).toLocaleString()},  Last updated   ${new Date(
    blog.updatedAt
  ).toLocaleString()}`;
  blogpost_div.append(createdtimedAt);

  const imageOnBlog = document.createElement("img");
  imageOnBlog.className = "blogpost-image";
  imageOnBlog.src = blog.file.url;
  imageOnBlog.alt = "Image";
  blogpost_div.append(imageOnBlog);

  const paragOfBlog = document.createElement("p");
  paragOfBlog.className = "blog-content";
  paragOfBlog.innerHTML = blog.description;
  blogpost_div.append(paragOfBlog);

  const like_div = document.createElement("div");
  like_div.className = "like-coment post-like-commet";
  like_div.innerHTML = `<img class="bloglikeImage" onclick="return likesFunction();" style="cursor:pointer" src="./Images/Vector.svg" alt="likes icon">`;

  const numLike = document.createElement("p");
  numLike.className = "specific-blog-likes";
  numLike.innerHTML = blog.likes.length.toString();
  like_div.append(numLike);
  blogpost_div.append(like_div);

  const comment_div = document.createElement("div");
  comment_div.className = "like-coment post-like-commet";
  const commentImage = document.createElement("img");
  commentImage.src = "./Images/Vector (1).svg";
  commentImage.alt = "comments icon";
  comment_div.append(commentImage);
  const numComment = document.createElement("p");
  numComment.className = "full-article-num-comments";
  numComment.innerHTML = blog.comments.length.toString();
  comment_div.append(numComment);
  blogpost_div.append(comment_div);

  const all_blog_comment_div = document.createElement("div");
  all_blog_comment_div.className = "all-blog-comments";
  const headofComments = document.createElement("h3");
  headofComments.textContent = "Comments";
  all_blog_comment_div.append(headofComments);
  const orderedList = document.createElement("ol");
  orderedList.className = "full-mode-orderd-list";
  const blogComments = blog.comments;
  blogComments.forEach(async (cmt) => {
    const commentedUser = await (
      await fetch(`https://jimmy-portfolio-backend.up.railway.app/users/${cmt.userId}`)
    ).json();
    const olLi = document.createElement("li");
    const commented = document.createElement("div");
    commented.innerHTML = `<h5>${commentedUser}</h5><small>- ${new Date(
      cmt.commentedAt
    ).toLocaleString()}</small>`;
    olLi.append(commented);

    const brTag = document.createElement("br");
    olLi.append(brTag);

    const smallcom = document.createElement("small");
    smallcom.textContent = cmt.comment;
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
  formBlog.id = "blogC0mmentField";
  formBlog.addEventListener("submit", (event) => {
    event.preventDefault();
    validateComment();
  });

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

  const smallThree = document.createElement("small");
  smallThree.className = "contact-form-error";
  smallThree.id = "cmt-form-comment-verify-length";
  smallThree.textContent = "A comment must be at least 10 characters!";
  formBlog.append(smallThree);

  const brFour = document.createElement("br");
  formBlog.append(brFour);

  const blogFormButton = document.createElement("button");
  blogFormButton.type = "submit";
  blogFormButton.id = "blog-comt";
  blogFormButton.textContent = "Add comment";
  formBlog.append(blogFormButton);
  blogpost_div.append(formBlog);

  document.querySelector("div.dashboard-loader").style.display = "none";
}

async function loadDashboardDymanicContent() {
  const token = localStorage.getItem("token");
  fetch("https://jimmy-portfolio-backend.up.railway.app/admins/dashboard", {
    headers: { Authorization: `Bearer ${token}` },
  }).then(async (response) => {
    if (response.status === 200) {
      const blogsArrayFetched = await fetch("https://jimmy-portfolio-backend.up.railway.app/blogs");
      const blogsArray = await blogsArrayFetched.json();

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
          aticle_title.id = `${blog._id}`;
          aticle_title.innerHTML = blog.title;
          article.append(aticle_title);

          const datep = document.createElement("p");
          datep.className = "article-created-date";
          datep.innerHTML = new Date(blog.createdAt).toLocaleString();
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
          number_oflikesp.innerHTML = blog.likes.length.toString();
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
          editImage.addEventListener("click", () => {
            const formToEditArticle = document.getElementById(
              "edit-article-dashbd-form"
            );
            document.getElementById("add-article-dashbd-form").style.display =
              "none";
            document.getElementById("sign-up-form-div-dash").style.display =
              "none";
            document.getElementById("all-messages").style.display = "none";
            formToEditArticle.style.display = "block";
            const editTitle = document.getElementById("titleBlg");
            editTitle.value = blog.title;
            editEditor.setData(blog.description);
            const blogIdTag = document.createElement("span");
            blogIdTag.className = "edi-form_id";
            blogIdTag.innerHTML = `${blog._id}`;
            blogIdTag.style.display = "none";
            formToEditArticle.append(blogIdTag);
            const imagePreview = document.getElementById("image-edit-preview");
            imagePreview.src = blog.file.url;
          });

          editDeleteDiv.append(editImage);

          const deleteImg = document.createElement("img");
          deleteImg.className = "article-delete-class";
          deleteImg.src = "./Images/image 9.svg";
          deleteImg.alt = "delete icon";
          deleteImg.addEventListener("click", async () => {
            const deleteBLoad = document.querySelector(
              "div.delete-article-loader"
            );
            deleteBLoad.style.display = "flex";
            fetch(`https://jimmy-portfolio-backend.up.railway.app/blogs/${blog._id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            })
              .then(async (response) => {
                deleteBLoad.style.display = "none";
                if (response.status === 204) {
                  const blogParent = artLi.parentNode;
                  blogParent.removeChild(artLi);
                  alert("Blog deleted");
                } else if (response.status === 401) {
                  alert("You are not logged in");
                } else if (response.status === 403) {
                  alert("Forbiden, you are not admin");
                } else {
                  alert("Deleting article failed");
                }
              })
              .catch((error) => console.log(error));
          });
          editDeleteDiv.append(deleteImg);

          article.append(editDeleteDiv);

          artLi.append(article);
          document.getElementById("dashOrderedList").append(artLi);
        });
      }

      const newsentMessages = await (
        await fetch("https://jimmy-portfolio-backend.up.railway.app/messages", {
          headers: { Authorization: `Bearer ${token}` },
        })
      ).json();
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
          tdFour.textContent = new Date(msg.createdAt).toLocaleString();
          tr.append(tdFour);

          const tdFive = document.createElement("td");
          const msgDeleteImage = document.createElement("img");
          msgDeleteImage.className = "message-delete-class";
          msgDeleteImage.src = "./Images/image 9.svg";
          msgDeleteImage.alt = "delete icon";
          msgDeleteImage.addEventListener("click", async () => {
            document.getElementById("tableMessages").style.display = "none";
            const deleteMessageLoad = document.querySelector(
              "div.delete-message-loader"
            );
            deleteMessageLoad.style.display = "flex";
            fetch(`https://jimmy-portfolio-backend.up.railway.app/messages/${msg._id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            })
              .then((response) => {
                deleteMessageLoad.style.display = "none";
                document.getElementById("tableMessages").style.display =
                  "block";
                if (response.status === 204) {
                  const parent = tr.parentNode;
                  parent.removeChild(tr);
                  alert("message deleted");
                } else if (response.status === 401) {
                  alert("You are not logged in");
                } else if (response.status === 403) {
                  alert("Forbiden, you are not admin");
                } else {
                  alert("Deleting message failed");
                }
              })
              .catch((error) => console.log(error));
          });
          tdFive.append(msgDeleteImage);
          tr.append(tdFive);

          document.querySelector("tbody").append(tr);
        });
      }
    } else {
      window.location.href = "./index.html";
      return;
    }
  });
  document.querySelector("div.dashboard-loader").style.display = "none";
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
  if (fullName.length < 6) {
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
  if (message.length < 10) {
    contMessageLengthError.style = "display:block; color:red;";
    setTimeout(() => {
      contMessageLengthError.style.display = "none";
    }, 6000);
    return false;
  }

  document
    .getElementById("sendMessage")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const loaderEl = document.querySelector("div.loader");
      document.querySelector("#sendMessage").style.display = "none";
      loaderEl.style.display = "flex";
      await fetch("https://jimmy-portfolio-backend.up.railway.app/messages", {
        method: "POST",
        body: JSON.stringify({
          contName: fullName,
          contEmail: Email,
          phone: tell,
          message,
        }),
        headers: { "Content-Type": "application/json" },
      }).then((response) => {
        loaderEl.style.display = "none";
        if (response.status === 200) {
          document.querySelector("#sendMessage").reset();
          document.getElementById("sendMessageForm").style =
            "background-color: none;";
          document.querySelector(".popup").style.display = "flex";
        } else {
          document.querySelector("#sendMessage").style.display = "none";
          document.getElementById("sendMessageForm").style =
            "background-color: none;";
          document.querySelector(".popup").style.display = "flex";
          document.querySelector(".popup p").innerHTML =
            "Error! Message not sent!";
          document.querySelector(".popup button").innerHTML = "Try again";
          return;
        }
      });
    });
}

async function loginValidation() {
  const emailTestRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
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

  document
    .getElementById("login-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      document.getElementById("login-form").style.display = "none";
      const loaderEl = document.querySelector("div.login-loader");
      loaderEl.style.display = "flex";
      fetch("https://jimmy-portfolio-backend.up.railway.app/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: loginEmail, password: loginPassw }),
        headers: { "Content-Type": "application/json" },
      })
        .then(async (response) => {
          loaderEl.style.display = "none";
          document.getElementById("login-form").style.display = "block";
          if (response.status === 200) {
            const result = await response.json();
            localStorage.setItem("token", result.token);
            fetch("https://jimmy-portfolio-backend.up.railway.app/admins/dashboard", {
              headers: { Authorization: `Bearer ${result.token}` },
            })
              .then((isAdmin) => {
                if (isAdmin.status === 200) {
                  window.location.href = "./dashboard.html";
                } else {
                  loginIcorrectEmailError.innerHTML =
                    "You successfully logged in!";
                  loginIcorrectEmailError.style = "display:block; color:red;";
                  setTimeout(() => {
                    location.href = "./index.html";
                  }, 3000);
                  return false;
                }
              })
              .catch((error) => console.log(error));
          } else {
            loginIcorrectEmailError.style = "display:block; color:red;";
            setTimeout(() => {
              loginIcorrectEmailError.style.display = "none";
            }, 6000);
            return false;
          }
        })
        .catch((err) => console.log(err));
    });
}

async function adminSignUpValidation() {
  const emailTestRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const firstName = document.getElementById("fname").value;
  const lastName = document.getElementById("lname").value;
  const email = document.getElementById("adminEail").value;
  const password = document.getElementById("adminpass").value;
  const comfirmPassword = document.getElementById("confadminpass").value;

  if (firstName === "") {
    document.getElementById("adminfnameError").style =
      "display:block; color:red;";
    setTimeout(() => {
      document.getElementById("adminfnameError").style.display = "none";
    }, 6000);
    return false;
  }

  if (firstName.length < 3) {
    document.getElementById("adminfnameValidateError").style =
      "display:block; color:red;";
    setTimeout(() => {
      document.getElementById("adminfnameValidateError").style.display = "none";
    }, 6000);
    return false;
  }
  if (lastName === "") {
    document.getElementById("adminlasNameError").style =
      "display:block; color:red;";
    setTimeout(() => {
      document.getElementById("adminlasNameError").style.display = "none";
    }, 6000);
    return false;
  }

  if (lastName.length < 3) {
    document.getElementById("adminlasNameValidateError").style =
      "display:block; color:red;";
    setTimeout(() => {
      document.getElementById("adminlasNameValidateError").style.display =
        "none";
    }, 6000);
    return false;
  }
  if (email === "") {
    document.getElementById("adminEmailError").style =
      "display:block; color:red;";
    setTimeout(() => {
      document.getElementById("adminEmailError").style.display = "none";
    }, 6000);
    return false;
  }
  if (!email.match(emailTestRegex)) {
    document.getElementById("adminEmailValidateError").style =
      "display:block; color:red;";
    setTimeout(() => {
      document.getElementById("adminEmailValidateError").style.display = "none";
    }, 6000);
    return false;
  }

  if (password === "") {
    document.getElementById("adminPasswordError").style =
      "display:block; color:red;";
    setTimeout(() => {
      document.getElementById("adminPasswordError").style.display = "none";
    }, 6000);
    return false;
  }
  if (password.length < 5) {
    document.getElementById("adminPasswordLeng").style =
      "display:block; color:red;";
    setTimeout(() => {
      document.getElementById("adminPasswordLeng").style.display = "none";
    }, 6000);
    return false;
  }

  if (comfirmPassword === "") {
    document.getElementById("adminPassComf").style =
      "display:block; color:red;";
    setTimeout(() => {
      document.getElementById("adminPassComf").style.display = "none";
    }, 6000);
    return false;
  }
  if (comfirmPassword !== password) {
    document.getElementById("adminPasswordMismatch").style =
      "display:block; color:red;";
    setTimeout(() => {
      document.getElementById("adminPasswordMismatch").style.display = "none";
    }, 6000);
    return false;
  }
  const token = localStorage.getItem("token");
  document
    .getElementById("admin-sign-up-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      document.getElementById("admin-sign-up-form").style.display = "none";
      const loaderEl = document.querySelector("div.admin-sign-up-loader");
      loaderEl.style.display = "flex";
      fetch("https://jimmy-portfolio-backend.up.railway.app/admins", {
        method: "POST",
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          comfirmPassword,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then(async (response) => {
          loaderEl.style.display = "none";
          document.getElementById("admin-sign-up-form").style.display = "block";
          if (response.status === 200) {
            alert("Account created successfully");
          } else if (response.status === 400) {
            alert("Error! Bad request!");
          } else {
            alert("Something went wrong, try again");
          }
        })
        .catch((err) => console.log(err));
    });
}

async function userSignUpValidation() {
  const emailTestRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const firstName = document.getElementById("fusername").value;
  const lastName = document.getElementById("lusername").value;
  const email = document.getElementById("userEail").value;
  const password = document.getElementById("userpass").value;
  const comfirmPassword = document.getElementById("confuserpass").value;

  if (firstName === "") {
    document.getElementById("userfusernameError").style =
      "display:block; color:red;";
    setTimeout(() => {
      document.getElementById("userfusernameError").style.display = "none";
    }, 6000);
    return false;
  }

  if (firstName.length < 3) {
    document.getElementById("userfusernameValidateError").style =
      "display:block; color:red;";
    setTimeout(() => {
      document.getElementById("userfusernameValidateError").style.display =
        "none";
    }, 6000);
    return false;
  }
  if (lastName === "") {
    document.getElementById("userlasNameError").style =
      "display:block; color:red;";
    setTimeout(() => {
      document.getElementById("userlasNameError").style.display = "none";
    }, 6000);
    return false;
  }

  if (lastName.length < 3) {
    document.getElementById("userlasNameValidateError").style =
      "display:block; color:red;";
    setTimeout(() => {
      document.getElementById("userlasNameValidateError").style.display =
        "none";
    }, 6000);
    return false;
  }
  if (email === "") {
    document.getElementById("userEmailError").style =
      "display:block; color:red;";
    setTimeout(() => {
      document.getElementById("userEmailError").style.display = "none";
    }, 6000);
    return false;
  }
  if (!email.match(emailTestRegex)) {
    document.getElementById("userEmailValidateError").style =
      "display:block; color:red;";
    setTimeout(() => {
      document.getElementById("userEmailValidateError").style.display = "none";
    }, 6000);
    return false;
  }

  if (password === "") {
    document.getElementById("userPasswordError").style =
      "display:block; color:red;";
    setTimeout(() => {
      document.getElementById("userPasswordError").style.display = "none";
    }, 6000);
    return false;
  }
  if (password.length < 5) {
    document.getElementById("userPasswordLeng").style =
      "display:block; color:red;";
    setTimeout(() => {
      document.getElementById("userPasswordLeng").style.display = "none";
    }, 6000);
    return false;
  }

  if (comfirmPassword === "") {
    document.getElementById("userPasswordErrorconfir").style =
      "display:block; color:red;";
    setTimeout(() => {
      document.getElementById("userPasswordErrorconfir").style.display = "none";
    }, 6000);
    return false;
  }
  if (comfirmPassword !== password) {
    document.getElementById("userPasswordMismatch").style =
      "display:block; color:red;";
    setTimeout(() => {
      document.getElementById("userPasswordMismatch").style.display = "none";
    }, 6000);
    return false;
  }
  const token = localStorage.getItem("token");
  document
    .getElementById("user-sign-up-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      document.getElementById("user-sign-up-form").style.display = "none";
      const loaderEl = document.querySelector("div.user-signup-loader");
      loaderEl.style.display = "flex";
      fetch("https://jimmy-portfolio-backend.up.railway.app/users", {
        method: "POST",
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          comfirmPassword,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then(async (response) => {
          loaderEl.style.display = "none";
          document.getElementById("user-sign-up-form").style.display = "block";
          if (response.status === 200) {
            alert("Account created successfully");
          } else if (response.status === 400) {
            alert("Error! User exist!");
          } else {
            alert("Something went wrong, try again");
          }
        })
        .catch((err) => console.log(err));
    });
}
