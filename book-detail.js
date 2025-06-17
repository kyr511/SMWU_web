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
      const badge = document.createElement('a');
      badge.className = 'badge bg-primary text-white text-decoration-none';
      badge.href = `book-profile.html?name=${encodeURIComponent(name)}`;
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

function loadDummyReviews() {
  const reviewData = [
    { username: 'reader01', profileImg: 'https://via.placeholder.com/50', text: '정말 좋은 책이에요.' },
    { username: 'reader02', profileImg: 'https://via.placeholder.com/50', text: '내용이 깊이 있었어요.' },
    { username: 'reader03', profileImg: 'https://via.placeholder.com/50', text: '재밌게 읽었어요!' },
    { username: 'reader04', profileImg: 'https://via.placeholder.com/50', text: '추천합니다!' }
  ];

  const reviewContainer = document.getElementById('reviews');
  reviewContainer.innerHTML = '';

  reviewData.forEach(data => {
    const card = document.createElement('div');
    card.className = 'card review-card';

    card.innerHTML = `
      <div class="d-flex align-items-center mb-2">
        <img src="${data.profileImg}" class="rounded-circle me-2" width="50" height="50">
        <strong>${data.username}</strong>
      </div>
      <p class="mb-0">${data.text}</p>
    `;

    reviewContainer.appendChild(card);
  });
}

function scrollReviews(offset) {
  const container = document.getElementById('reviews');
  container.scrollBy({ left: offset, behavior: 'smooth' });
}

fetchBookDetail();
