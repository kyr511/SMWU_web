// movie.js

const kobisKey = 'eccb144e2dfb491259f8b51680415fb8';   // 여기에 네 KOBIS API 키
const tmdbKey = 'e563363c78911106e273c1c98c637eac';     // 여기에 네 TMDB API 키

async function kobisApi() {
const today = new Date();
today.setDate(today.getDate() - 1); // 어제
const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');

const url = `https://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=${kobisKey}&targetDt=${dateStr}`;
const response = await fetch(url);
const data = await response.json();
    
return data.boxOfficeResult.dailyBoxOfficeList;
}


async function getDirector(movieCd) {
const url = `https://kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=${kobisKey}&movieCd=${movieCd}`;
const response = await fetch(url);
const data = await response.json();

// 감독 정보가 있을 경우 반환
const directors = data.movieInfoResult.movieInfo.directors;
if (directors && directors.length > 0) {
    return directors.map(d => d.directorNm).join(', ');
} else {
    return '정보 없음';
}
}



async function getPosterFromTMDB(title) {
const url = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&query=${encodeURIComponent(title)}&language=ko-KR`;

try {
    const response = await fetch(url);
    const data = await response.json();

    // TMDB에서 결과가 없을 경우
    if (!data.results || data.results.length === 0) {
    console.warn(`TMDB 결과 없음: ${title}`);
    return 'https://via.placeholder.com/500x750?text=No+Image';
    }

    // 포스터가 있는 영화만 필터링
    const movieWithPoster = data.results.find(movie => movie.poster_path);

    // 포스터가 있으면 URL 반환, 없으면 대체 이미지
    return movieWithPoster
    ? `https://image.tmdb.org/t/p/w500${movieWithPoster.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

} catch (error) {
    console.error(`TMDB 요청 에러: ${title}`, error);
    return 'https://via.placeholder.com/500x750?text=No+Image';
}
}

async function showMovies() {
const movies = await kobisApi();
const container = document.getElementById('movie-list');

// 추후 구현될 데이터: 더미 리뷰 수 & 좋아요 수 추가
movies.forEach(movie => {
movie.reviewCnt = 0; // 추후 구현
movie.likeCnt = 0;   // 추후 구현
});

// 정렬 함수
function sortMovies(movies, criterion) {
return [...movies].sort((a, b) => {
    switch (criterion) {
    case 'rank':
        return parseInt(a.rank) - parseInt(b.rank); // 박스오피스 순위
    case 'audiCnt':
        return parseInt(b.audiAcc) - parseInt(a.audiAcc); // ✅ 누적 관객 수로 변경
    case 'reviewCnt':
        return b.reviewCnt - a.reviewCnt;
    case 'likeCnt':
        return b.likeCnt - a.likeCnt;
    default:
        return 0;
    }
});
}


// 카드 렌더링 함수
async function renderMovies(moviesToRender) {
    container.innerHTML = '';

    for (const movie of moviesToRender) {
    const title = movie.movieNm;
    const rank = movie.rank;
    const openDt = movie.openDt;
    const movieCd = movie.movieCd;

    const posterUrl = await getPosterFromTMDB(title);
    const director = await getDirector(movieCd);

    const card = document.createElement('div');
    card.className = 'card mb-4';
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
    window.location.href = `movie-detail.html?movieCd=${movieCd}`;
    });

    card.innerHTML = `
    <div class="d-flex mb-3">
        <div class="flex-shrink-0">
        <img src="${posterUrl}" class="img-fluid" alt="${title}" style="width: 150px; height: 225px; object-fit: cover;">
        </div>
        <div class="ms-3">
        <h5 class="card-title"><h4>${title}</h4></h5>
        <p class="card-text">개봉일: ${openDt || '정보 없음'}</p>
        <p class="card-text">감독: ${director || '정보 없음'}</p>
        <p class="card-text">누적 관객 수: ${parseInt(movie.audiAcc).toLocaleString()}명</p>
        <p class="card-text">리뷰: ${movie.reviewCnt}개 | 좋아요: ${movie.likeCnt}개</p>
        </div>
    </div>
    `;


    container.appendChild(card);
    }
}

// 첫 렌더링 (기본: 박스오피스 순위)
const select = document.getElementById('sortOption');
renderMovies(sortMovies(movies, select.value));

// 정렬 기준 변경 시 재렌더링
select.addEventListener('change', () => {
    const sorted = sortMovies(movies, select.value);
    renderMovies(sorted);
});
}

showMovies();
