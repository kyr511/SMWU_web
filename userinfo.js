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

function logout() { //로그아웃 버튼 구현-> 마이페이지에..?
    sessionStorage.clear();
    window.location.href = "index.html";
}

function updateUI() {
    const isLoggedIn = sessionStorage.getItem("loggedIn") === "true";
    const username = sessionStorage.getItem("username");
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
        alert("찜 목록에서 제거되었습니다.")
    }
    
    localStorage.setItem("user", JSON.stringify(user));//변경사항 저장
}

function getMovieWishlist() { //찜 목록 배열 가져오기
    let user = JSON.parse(localStorage.getItem("user"));
    return user.MovieWishlist || [];
}

function getWishCount() { //찜목록개수
    const user = JSON.parse(localStorage.getItem("user"));
    return (user.MovieWishlist || []).length;
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

function getMovieLikelist() { //좋아요요 목록 배열 가져오기
    let user = JSON.parse(localStorage.getItem("user"));
    return user.MovieLikelist || [];
}

function getLikeCount() {//좋아요목록개수
    const user = JSON.parse(localStorage.getItem("user"));
    return (user.MovieLikelist || []).length;
}


//리뷰 목록 관리-------------


updateUI(); //페이지 로드 시 로그인 상태 반영하기