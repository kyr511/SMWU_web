// userinfo.js

function signup() { //회원가입에서 회원정보를 저장하는 함수
    const username = document.getElementById("signup-username").value;
    const id = document.getElementById("signup-ID").value;
    const password = document.getElementById("signup-password").value;
    const checkpass = document.getElementById("signup-checkpass").value;

    if (!username || !id || !password || !checkpass){
        alert("모든 항목을 작성해주십시오.");
        return;
    }

    if (password !== checkpass) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
    }

    const user = {username, id, password};
    localStorage.setItem("user", JSON.stringify(user));
    alert("회원가입 완료!");
}

function login(event) { //로그인하는 함수: 입력값이 회원정보와 일치하면 로그인 상태로 변경
    event.preventDefault();
    const inputID = document.getElementById("login-ID").value;
    const inputPassword = document.getElementById("login-pass").value;

    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && inputID === userData.id && inputPassword === userData.password) {
        sessionStorage.setItem("loggedIn", "true")
        sessionStorage.setItem("username", userData.username);
        sessionStorage.setItem("ID", userData.id);
        alert("로그인 완료!");
        window.location.href = "index.html"; //작동안함 로그인 후 메인페이지로 이동동
    }else {
        alert("아이디 또는 비밀번호가 일치하지 않습니다.");
    }
}

function logout() { //로그아웃 버튼 구현
    sessionStorage.clear();
    alert("로그아웃 완료!");
    window.location.href = "index.html";
}

function updateUI() { //헤더에 로그인 회원가입 로그아웃 버튼 유무
    const isLoggedIn = sessionStorage.getItem("loggedIn") === "true";
    const username = sessionStorage.getItem("username");

    const loginItem = document.querySelector('a[href="login.html"]').parentElement;
    const signupItem = document.querySelector('a[href="signup.html"]').parentElement;
    const logoutItem = document.querySelector('a[onclick="logout()"]').parentElement;

    if (isLoggedIn) {
      loginItem.style.display = "none";
      signupItem.style.display = "none";
      logoutItem.style.display = "block";
    } else {
      loginItem.style.display = "block";
      signupItem.style.display = "block";
      logoutItem.style.display = "none";
    }
}

//찜목록 관리------------
function addMovieWish(movieCd) { //영화 찜 추가
    if (sessionStorage.getItem("loggedIn") !== "true") {//로그인 여부 확인
            alert("로그인이 필요한 서비스입니다.");
            window.location.href = "login.html";
            return
    }

    let user = JSON.parse(localStorage.getItem("user"));
    if (!user.MovieWishlist) {
        user.MovieWishlist= [];
    }

    const index = user.MovieWishlist.indexOf(movieCd); //찜목록에 포함되어있다면 인덱스 위치, 없다면 -1 반환
    if (index === -1) {    //찜 추가
        user.MovieWishlist.push(movieCd);
        localStorage.setItem("user", JSON.stringify(user));
        alert("찜 목록에 추가되었습니다.");
    } else {    //찜 삭제
        user.MovieWishlist.splice(index, 1);
        alert("찜 목록에서 제거되었습니다.");
    }
    
    localStorage.setItem("user", JSON.stringify(user));//변경사항 저장
}

function addBookWish(bookId) { //책 찜 추가
    if (sessionStorage.getItem("loggedIn") !== "true") {//로그인 여부 확인
            alert("로그인이 필요한 서비스입니다.");
            window.location.href = "login.html";
            return
    }

    let user = JSON.parse(localStorage.getItem("user"));
    if (!user.BookWishlist) {
        user.BookWishlist= [];
    }

    const index = user.BookWishlist.indexOf(bookId);
    if (index === -1) {
        user.BookWishlist.push(bookId);
        localStorage.setItem("user", JSON.stringify(user));
        alert("찜 목록에 추가되었습니다.");
    } else {
        user.BookWishlist.splice(index, 1);
        alert("찜 목록에서 제거되었습니다.");
    }

    localStorage.setItem("user", JSON.stringify(user));
}

function getMovieWishlist() { //영화 찜 목록 배열 가져오기
    let user = JSON.parse(localStorage.getItem("user"));
    return user.MovieWishlist || [];
}

function getBookWishlist() { //책 찜 목록 배열 가져오기
    let user = JSON.parse(localStorage.getItem("user"));
    return user.BookWishlist || [];
}

function getWishCount() { //찜목록개수(영화 배열+책 배열)
    const user = JSON.parse(localStorage.getItem("user"));
    return ((user.MovieWishlist || []).length + (user.BookWishlist || []).length);
}

//좋아요목록 관리-----------
function addMovieLike(movieCd) { //영화 좋아요 추가
    if (sessionStorage.getItem("loggedIn") !== "true") {//로그인 여부 확인
            alert("로그인이 필요한 서비스입니다.");
            window.location.href = "login.html";
            return
    }

    let user = JSON.parse(localStorage.getItem("user"));
    if (!user.MovieLikelist) {
        user.MovieLikelist= [];
    }

    const index = user.MovieLikelist.indexOf(movieCd); 
    if (index === -1) {
        user.MovieLikelist.push(movieCd);
        localStorage.setItem("user", JSON.stringify(user));
        alert("좋아요 목록에 추가되었습니다.");
    } else {    //좋아요 삭제
        user.MovieLikelist.splice(index, 1);
        alert("좋아요 목록에서 제거되었습니다.");
    }
    
    localStorage.setItem("user", JSON.stringify(user));//변경사항 저장
}

function addBookLike(bookId) { //책 좋아요 추가
    if (sessionStorage.getItem("loggedIn") !== "true") {//로그인 여부 확인
            alert("로그인이 필요한 서비스입니다.");
            window.location.href = "login.html";
            return
    }

    let user = JSON.parse(localStorage.getItem("user"));
    if (!user.BookLikelist) {
        user.BookLikelist= [];
    }

    const index = user.BookLikelist.indexOf(bookId); 
    if (index === -1) {
        user.BookLikelist.push(bookId);
        localStorage.setItem("user", JSON.stringify(user));
        alert("좋아요 목록에 추가되었습니다.");
    } else {    //좋아요 삭제
        user.BookLikelist.splice(index, 1);
        alert("좋아요 목록에서 제거되었습니다.");
    }
    
    localStorage.setItem("user", JSON.stringify(user));//변경사항 저장
}

function getMovieLikelist() { //영화 좋아요 목록 배열 가져오기
    let user = JSON.parse(localStorage.getItem("user"));
    return user.MovieLikelist || [];
}

function getBookLikelist() { //책 좋아요 목록 배열 가져오기
    let user = JSON.parse(localStorage.getItem("user"));
    return user.BookLikelist || [];
}

function getLikeCount() { //좋아요목록개수(영화+책)
    const user = JSON.parse(localStorage.getItem("user"));
    return ((user.MovieLikelist || []).length + (user.BookLikelist || []).length);
}


//리뷰 목록 관리-------------
function addMovieReview(movieCd, review) { //리뷰 등록
    if (sessionStorage.getItem("loggedIn") !== "true") {//로그인 여부 확인
            alert("로그인이 필요한 서비스입니다.");
            window.location.href = "login.html";
            return
      }

    //딕셔너리 {movieCd: 리뷰 문자열}
    const user = JSON.parse(localStorage.getItem("user")) || {};
    user.MovieReviewlist = user.MovieReviewlist || {};
    user.MovieReviewlist[movieCd] = review;
    localStorage.setItem("user", JSON.stringify(user));
    alert("리뷰 등록이 완료되었습니다.");
}

function addBookReview(BookId, review) { //리뷰 등록
    if (sessionStorage.getItem("loggedIn") !== "true") {//로그인 여부 확인
            alert("로그인이 필요한 서비스입니다.");
            window.location.href = "login.html";
            return
      }

    //딕셔너리 {BookId: 리뷰 문자열}   
    const user = JSON.parse(localStorage.getItem("user")) || {};
    user.BookReviewlist = user.BookReviewlist || {};
    user.BookReviewlist[BookId] = review;
    localStorage.setItem("user", JSON.stringify(user));
    alert("리뷰 등록이 완료되었습니다.");
}

function getMovieReviewlist() { //영화 리뷰 배열 가져오기
    let user = JSON.parse(localStorage.getItem("user"));
    return user.MovieReviewlist || {};
}

function getBookReviewlist() { //책 리뷰 목록 배열 가져오기
    let user = JSON.parse(localStorage.getItem("user"));
    return user.BookReviewlist || {};
}

function getReviewCount() { //리뷰목록개수(영화+책)
    const user = JSON.parse(localStorage.getItem("user"));
    return ((Object.keys(user.MovieReviewlist || {})).length + (Object.keys(user.BookReviewlist || {})).length);
}//딕셔너리 길이-> 키 리스트의 길이

updateUI(); //페이지 로드 시 로그인 상태 반영하기