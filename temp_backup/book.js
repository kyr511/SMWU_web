const googleBooksApiKey = 'AIzaSyA2tHYAIxL3veZZYftM7LHnLZD8f-7plAQ'; // 실제 구글 Books API 키

// Google Books API 호출 함수
async function googleBooksApi(query) {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${googleBooksApiKey}&langRestrict=ko`;
    const response = await fetch(url);
    const data = await response.json();
    return data.items;  // 책 목록 배열
}

// 책 이미지 URL 가져오기
async function getBookImageUrl(book) {
    if (book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail) {
        return book.volumeInfo.imageLinks.thumbnail;
    } else {
        return 'https://via.placeholder.com/150x225?text=이미지+없음';
    }
}

// 책 목록 렌더링 함수
async function renderBooks(books) {
    const listEl = document.getElementById('book-list');
    listEl.innerHTML = ''; // 초기화

    books.forEach(async (book) => {
        const title = book.volumeInfo.title;
        const author = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : '작가 정보 없음';
        const pubDate = book.volumeInfo.publishedDate || '출판일 정보 없음';
        const bookImage = await getBookImageUrl(book);

        const item = document.createElement('div');
        item.classList.add('card', 'mb-3');
        item.innerHTML = `
            <div class="d-flex mb-3">
                <div class="flex-shrink-0">
                    <img src="${bookImage}" class="img-fluid" alt="${title}" style="width: 150px; height: 225px; object-fit: cover;">
                </div>
                <div class="ms-3">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">작가: ${author}</p>
                    <p class="card-text">출판일: ${pubDate}</p>
                </div>
            </div>
        `;
        listEl.appendChild(item);
    });
}

// 책 정렬 함수
function sortBooks(books, criterion) {
    return [...books].sort((a, b) => {
        switch (criterion) {
            case 'title':
                return a.volumeInfo.title.localeCompare(b.volumeInfo.title);
            case 'author':
                return a.volumeInfo.authors ? a.volumeInfo.authors[0].localeCompare(b.volumeInfo.authors[0]) : 0;
            case 'publishedDate':
                return a.volumeInfo.publishedDate.localeCompare(b.volumeInfo.publishedDate);
            default:
                return 0;
        }
    });
}

// 책 검색 후 화면에 표시
async function showBooks() {
    const books = await googleBooksApi('한국어'); // 예시로 "한국어" 책 검색
    const select = document.getElementById('sortOption');
    
    // 정렬 기준 선택 시 재렌더링
    select.addEventListener('change', () => {
        const sorted = sortBooks(books, select.value);
        renderBooks(sorted);
    });

    renderBooks(books);
}

// 페이지가 로드된 후 책 정보 로드
document.addEventListener('DOMContentLoaded', () => {
    showBooks();
});