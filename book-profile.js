//book-profile.js

// URL 파라미터 가져오기
const params = new URLSearchParams(window.location.search);
const authorKey = params.get('name'); // 사실상 이름임
console.log(authorKey);




// 메인 진입점
fetchAuthorProfile();

async function fetchAuthorProfile() {
  if (!authorKey) return;

  // 1. authorKey가 'OL'로 시작하지 않으면 이름 기반 검색이라고 간주
  if (!authorKey.startsWith('OL')) {
    try {
      const searchResponse = await fetch(`https://openlibrary.org/search/authors.json?q=${encodeURIComponent(authorKey)}`);
      const searchData = await searchResponse.json();

      if (!searchData || !searchData.docs || searchData.docs.length === 0) {
        document.getElementById('authorBio').textContent = '작가를 찾을 수 없습니다.';
        return;
      }

      // 2. 출판 수 많은 순으로 정렬 후 대표 작가 선택
      searchData.docs.sort((a, b) => (b.work_count || 0) - (a.work_count || 0));
      const selectedAuthor = searchData.docs[0];
      const realKey = selectedAuthor.key.replace('/authors/', '');

      loadAuthorDetails(realKey);
    } catch (err) {
      console.error('작가 검색 실패:', err);
      document.getElementById('authorBio').textContent = '작가 정보를 불러오는 데 실패했습니다.';
    }
  } else {
    // 예외적으로 OL 키로 넘어온 경우
    loadAuthorDetails(authorKey);
  }
}

async function loadAuthorDetails(realKey) {
  try {
    const response = await fetch(`https://openlibrary.org/authors/${realKey}.json`);
    const author = await response.json();

    document.getElementById('authorName').textContent = author.name || '작가 이름';
    document.getElementById('authorBio').textContent = author.bio?.value || author.bio || '소개 정보가 없습니다.';

    if (author.photos && author.photos.length > 0) {
      document.getElementById('profileImage').src = `https://covers.openlibrary.org/a/id/${author.photos[0]}-L.jpg`;
    }

    fetchAuthorBooks(realKey);
  } catch (err) {
    console.error('작가 상세 불러오기 실패:', err);
    document.getElementById('authorBio').textContent = '작가 정보를 불러오는 데 실패했습니다.';
  }
}
