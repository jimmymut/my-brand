function displayAddArticleForm() {
  document.getElementById("add-article-dashbd-form").style.display = "block";
}
function disappearForm() {
  document.getElementById("add-article-dashbd-form").style = "display: none";
}

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
function displayImageTwo() {
  document.getElementById("home-image-1").style = "display: none;";
  document.getElementById("home-image-2").style = "display: flex;";
}
function backToImageOne() {
  document.getElementById("home-image-2").style = "display: none;";
  document.getElementById("home-image-1").style = "display: flex;";
}
function displayImageThree() {
  document.getElementById("home-image-2").style = "display: none;";
  document.getElementById("home-image-3").style = "display: flex;";
}
function backToImageTwo() {
  document.getElementById("home-image-3").style = "display: none;";
  document.getElementById("home-image-2").style = "display: flex;";
}
function displayImageFour() {
  document.getElementById("home-image-3").style = "display: none;";
  document.getElementById("home-image-4").style = "display: flex;";
}
function backToImageThree() {
  document.getElementById("home-image-4").style = "display: none;";
  document.getElementById("home-image-3").style = "display: flex;";
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

function showAllComments() {
  const loadMore = document.getElementById("load-more-comments");
  const moreCommentsBtn = document.getElementById("load-all-cmts");
  if (loadMore.style.display === "none") {
    loadMore.style = "display: block";
    moreCommentsBtn.innerHTML = "less comments";
  } else {
    loadMore.style = "display: none";
    moreCommentsBtn.innerHTML = "All comments";
  }
}

function showBlogTwo() {
  document.getElementById("blog-summary-1").style = "display: none";
  document.getElementById("blog-summary-2").style = "display: flex";
}
function showBlogOne() {
  document.getElementById("blog-summary-2").style = "display: none";
  document.getElementById("blog-summary-1").style = "display: flex";
}

function showAllMessages() {
  document.getElementById("all-messages").style = "display: block";
}
function countComments() {
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
  const blogli = document.createElement("li");
  const blogh5 = document.createElement("h5");
  blogh5.textContent = nameField.value;
  blogli.append(blogh5);
  const datep = document.createElement("p");
  datep.innerHTML = Date();
  blogli.append(datep);
  const smallComment = document.createElement("small");
  smallComment.textContent = textAreaField.value;
  blogli.append(smallComment);
  document.getElementById("load-more-comments").append(blogli);
  document.getElementById("load-more-comments").style.display = "block";

  const allBlogCommentCount = document.querySelectorAll(".number-of-comments");
  allBlogCommentCount.forEach((element) => {
    element.innerHTML = (parseInt(element.innerHTML) + 1).toString();
    // element.innerHTML = numberOfComments.toString();
    document.getElementById("blogC0mmentField").reset();
  });
}

function likesfunction() {
  const numOfLikes = document.querySelectorAll(".number-oflikes");
  numOfLikes.forEach((elim) => {
    elim.innerHTML = (parseInt(elim.innerHTML) + 1).toString();
  });
}

function contactFormValidation() {
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
  if (fullName === "") {
    fullNameError.style.display = "block";
    setTimeout(() => {
      fullNameError.style.display = "none";
    }, 6000);
    return false;
  }
  if (Email === "") {
    emailError.style.display = "block";
    setTimeout(() => {
      emailError.style.display = "none";
    }, 6000);
    return false;
  }
  if (tell === "") {
    phoneError.style.display = "block";
    setTimeout(() => {
      phoneError.style.display = "none";
    }, 6000);
    return false;
  }
  if (tell.length < 10) {
    contPhoneEengthError.style.display = "block";
    setTimeout(() => {
      contPhoneEengthError.style.display = "none";
    }, 6000);
    return false;
  }
  if (message === "") {
    messageError.style.display = "block";
    setTimeout(() => {
      messageError.style.display = "none";
    }, 6000);
    return false;
  }
  if (message.length < 30) {
    contMessageLengthError.style.display = "block";
    setTimeout(() => {
      contMessageLengthError.style.display = "none";
    }, 6000);
    return false;
  }
}

function loginValidation() {
  const loginEmail = document.getElementById("loginEmail").value;
  const loginPassw = document.getElementById("password").value;
  const loginEmailErr = document.getElementById("loginEmailError");
  const loginPasswErr = document.getElementById("loginPasswordError");
  if (loginEmail === "") {
    loginEmailErr.style.display = "block";
    setTimeout(() => {
      loginEmailErr.style.display = "none";
    }, 6000);
    return false;
  }
  if (loginPassw === "") {
    loginPasswErr.style.display = "block";
    setTimeout(() => {
      loginPasswErr.style.display = "none";
    }, 6000);
    return false;
  }
}
