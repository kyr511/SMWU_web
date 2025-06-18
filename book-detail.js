//book-detail.js

const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get('bookId') || urlParams.get('title'); // 둘 다 지원
console.log("bookId:", bookId);

// 예시 API 키 (사용하는 API에 맞게 교체)
const kakaoBookKey = '5ff0b1187a7ca2ad946b92fdce92aced';

async function fetchBookDetail() {
  if (!bookId) return;

  try {
    // ✅ Kakao Book API 검색
        const res = await fetch(`https://dapi.kakao.com/v3/search/book?target=title&query=${encodeURIComponent(bookId)}`, {
        headers: {
            Authorization: `KakaoAK ${kakaoBookKey}`
        }
        });

    const data = await res.json();
    if (!data.documents || data.documents.length === 0) return;

    const book = data.documents[0];

    // 제목, 저자, 표지, 설명
    document.getElementById('bookTitle').textContent = book.title;

    const authorDiv = document.getElementById('author');
    book.authors.forEach(name => {
      const badge = document.createElement('span');
      badge.className = 'badge bg-secondary text-white';
      badge.textContent = name;
      authorDiv.appendChild(badge);
    });


    document.getElementById('bookCover').src = book.thumbnail || 'https://via.placeholder.com/500x750?text=No+Cover';
    document.getElementById('bookDescription').textContent = book.contents || '책 설명 없음';

    loadDummyReviews();

  } catch (err) {
    console.error('책 정보 로딩 실패:', err);
  }
}

const reviewData = [ //더미리뷰(전역변수)
    { username: 'reader01', profileImg: '임시프로필.jpeg' , text: '정말 좋은 책이에요.' },
    { username: 'reader02', profileImg: '임시프로필.jpeg' , text: '내용이 깊이 있었어요.' },
    { username: 'reader03', profileImg: '임시프로필.jpeg' , text: '재밌게 읽었어요!' },
    { username: 'reader04', profileImg: '임시프로필.jpeg' , text: '추천합니다!' }
  ];

let user = JSON.parse(localStorage.getItem("user") || '{}'); 
if (user.BookReviewlist && user.BookReviewlist[bookId]){ //사용자리뷰
  reviewData.unshift({ username: user.username, profileImg: '임시프로필.jpeg' , text: user.BookReviewlist[bookId] });
}

function loadDummyReviews() {
  const reviewContainer = document.getElementById('reviews');
  reviewContainer.innerHTML = '';

  const isAdmin = GetCookie("mode") === "1"; //관리자 모드 여부

  reviewData.forEach(data => {
    const card = document.createElement('div');
    card.className = 'card review-card';

    card.innerHTML = `
      <div class="d-flex align-items-center mb-2">
        ${isAdmin ? `<button class="remove-btn position-absolute top-0 end-0 btn btn-sm btn-light" onclick="event.stopPropagation(); deleteReview('${data.username}');">X</button>` : ""}
        <img src="${data.profileImg}" class="rounded-circle me-2" width="50" height="50">
        <strong>${data.username}</strong>
      </div>
      <p class="mb-0">${data.text}</p>
    `;

    reviewContainer.appendChild(card);
  });
}

function deleteReview(username){
  const index = reviewData.findIndex(review => review.username === username);
  reviewData.splice(index, 1);
  alert(`'${username}'의 리뷰가 삭제되었습니다.`);
  loadDummyReviews()
}


function scrollReviews(offset) {
  const container = document.getElementById('reviews');
  container.scrollBy({ left: offset, behavior: 'smooth' });
}

fetchBookDetail();
