//book.js

const KAKAO_API_KEY = '5ff0b1187a7ca2ad946b92fdce92aced';

async function fetchBooks(query = "자바스크립트") {
  const url = `https://dapi.kakao.com/v3/search/book?&query=${encodeURIComponent(query)}&size=20`;

  const res = await fetch(url, {
    headers: {
      Authorization: `KakaoAK ${KAKAO_API_KEY}`
    }
  });

  const data = await res.json();

  return data.documents.map(book => ({
    title: book.title,
    author: book.authors.join(", ") || "작가 정보 없음",
    date: book.datetime?.split("T")[0] || "출간일 없음",
    image: book.thumbnail || "https://via.placeholder.com/150x220?text=No+Image",
    price: book.sale_price || Math.floor(Math.random() * 30000 + 5000),
    reviewCnt: Math.floor(Math.random() * 300), // 더미
    likeCnt: Math.floor(Math.random() * 100) // 더미
  }));
}

function sortBooks(books, option) {
  return [...books].sort((a, b) => {
    if (option === "latest") {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (isNaN(dateA)) return 1;  // a 날짜 없으면 뒤로
      if (isNaN(dateB)) return -1; // b 날짜 없으면 뒤로
      return dateB - dateA;
    }
    if (option === "reviewCnt") return b.reviewCnt - a.reviewCnt;
    if (option === "likeCnt") return b.likeCnt - a.likeCnt;
    return 0;
  });
}


function renderBooks(books) {
  const container = document.getElementById("book-list");
  container.innerHTML = "";

  books.forEach(book => {
    const card = document.createElement("div");
    card.className = "card mb-4";
    card.style.cursor = "pointer";

    // 클릭 시 book-detail.html로 이동
    card.addEventListener("click", () => {
      const encodedTitle = encodeURIComponent(book.title);
      window.location.href = `book-detail.html?title=${encodedTitle}`;
    });

    card.innerHTML = `
      <div class="d-flex mb-3">
        <div class="flex-shrink-0">
        <img src="${book.image}" alt="${book.title}" class="img-fluid" style="width: 150px; height: 220px; object-fit: cover;">
        </div>
        <div class="ms-3">
          <h5 class="card-title">${book.title}</h5>
          <p class="card-text">작가: ${book.author}</p>
          <p class="card-text">출간일: ${book.date}</p>
          <p class="card-text">판매가: ${book.price.toLocaleString()}원</p>
          <p class="card-text">리뷰: ${book.reviewCnt}개 | 좋아요: ${book.likeCnt}개</p>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}
async function initBooks() {
  const books = await fetchBooks("책");
  // 기본 검색어를 책 으로 설정해놓음

  // 각 책 reviewCnt와 likeCnt를 0으로 할당
  books.forEach(book => {
    book.reviewCnt = 0;
    book.likeCnt = 0;
  });

  const select = document.getElementById("sortOption");

  renderBooks(sortBooks(books, select.value));

  select.addEventListener("change", () => {
    renderBooks(sortBooks(books, select.value));
  });
}

document.addEventListener("DOMContentLoaded", initBooks);
