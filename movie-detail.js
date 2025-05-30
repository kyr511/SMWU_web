const urlParams = new URLSearchParams(window.location.search);
const movieCd = urlParams.get('movieCd');

const kobisKey = 'eccb144e2dfb491259f8b51680415fb8';
const tmdbKey = 'e563363c78911106e273c1c98c637eac';

async function fetchMovieDetail() {
  if (!movieCd) return;

  try {
    // ✅ KOBIS 영화 상세 정보
    const kobisRes = await fetch(`https://kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=${kobisKey}&movieCd=${movieCd}`);
    const kobisData = await kobisRes.json();
    const movieInfo = kobisData.movieInfoResult.movieInfo;

    const title = movieInfo.movieNm;
    const directors = movieInfo.directors.map(d => d.peopleNm);
    const actors = movieInfo.actors.slice(0, 5).map(actor => actor.peopleNm);

    document.getElementById('movieTitle').textContent = title;

    const directorDiv = document.getElementById('director');
    directors.forEach(name => {
      const badge = document.createElement('a');
      badge.className = 'badge bg-primary text-white text-decoration-none';
      badge.href = `profile.html?name=${encodeURIComponent(name)}`;
      badge.textContent = name;
      directorDiv.appendChild(badge);
    });

    const actorsDiv = document.getElementById('actors');
    actors.forEach(name => {
      const badge = document.createElement('a');
      badge.className = 'badge bg-secondary text-white text-decoration-none';
      badge.href = `profile.html?name=${encodeURIComponent(name)}`;
      badge.textContent = name;
      actorsDiv.appendChild(badge);
    });

    // ✅ TMDB에서 포스터 및 소개
    const tmdbRes = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&query=${encodeURIComponent(title)}&language=ko-KR`);
    const tmdbData = await tmdbRes.json();

    if (tmdbData.results && tmdbData.results.length > 0) {
      const movie = tmdbData.results[0];
      document.getElementById('moviePoster').src = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Image';
      document.getElementById('movieOverview').textContent = movie.overview || '줄거리 정보 없음';
    }

    // ✅ 더미 리뷰 로드
    loadDummyReviews();

  } catch (err) {
    console.error('영화 정보 로딩 실패:', err);
  }
}

function loadDummyReviews() {
  const reviewData = [
    { username: 'user01', profileImg: 'https://via.placeholder.com/50', text: '정말 감동적인 영화였어요.' },
    { username: 'user02', profileImg: 'https://via.placeholder.com/50', text: '연출이 뛰어났습니다.' },
    { username: 'user03', profileImg: 'https://via.placeholder.com/50', text: '배우들의 연기가 인상 깊었어요.' },
    { username: 'user04', profileImg: 'https://via.placeholder.com/50', text: '스토리가 정말 좋아요!' }
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

fetchMovieDetail();
