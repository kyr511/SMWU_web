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

function login() { //로그인하는 함수: 입력값이 회원정보와 일치하면 로그인 상태로 변경
    const inputID = document.getElementById("login-ID").value;
    const inputPassword = document.getElementById("login-pass").value;

    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && inputID === userData.id && inputPassword === userData.password) {
        sessionStorage.setItem("loggedIn", "true")
        sessionStorage.setItem("username", userData.username);
        sessionStorage.setItem("ID", userData.id);
        alert("로그인 완료!");
        window.location.href = "mypage.html"; //작동안함 로그인 후 마이페이지로 이동동
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

updateUI(); //페이지 로드 시 로그인 상태 반영하기