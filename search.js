//영화api
const KOBIS_KEY = "8f30f3cd89878ffb75c8b9a4ca3c7d31";
const TMDB_KEY = "c195cf58dc67be7d7345c99c5a852741";

//책api


//감독 가져오기
async function getDirector(movieCd) {
const url = `https://kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=${KOBIS_KEY}&movieCd=${movieCd}`;
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

//영화 포스터 이미지 가져오기: 링크형태로 반환환
async function getPoster(title) {
    //영화포스터이미지 api
  const tmdbURL = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(title)}&language=ko`;
  const res = await fetch(tmdbURL);
  const data = await res.json();
  if (data.results && data.results[0] && data.results[0].poster_path) {
    return `https://image.tmdb.org/t/p/w500${data.results[0].poster_path}`;
  }
  return null;
}

    
async function search(search) { //검색 함수
    const url = `http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key=${KOBIS_KEY}&movieNm=${encodeURIComponent(search)}`;
    const res = await fetch(url);
    const data = await res.json();
    const movies = data.movieListResult.movieList;

    if (!movies || movies.length === 0) {
        document.getElementById("movieSearchList").innerHTML = "<p>검색 결과가 없습니다.</p>";
        return;
    }

    for (const movie of movies) {
        const div = document.getElementById("movieSearchList");
        //div스타일지정

        const title = movie.movieNm; //영화제목
        const openDt = movie.openDt; //영화개봉일
        const movieCd = movie.movieCd; //영화코드
        const posterUrl = await getPoster(title); //영화 포스터
        const director = await getDirector(movieCd); //영화 감독

        const card = document.createElement('div');
        card.className = 'card mb-4';
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
        window.location.href = `movie-detail.html?movieCd=${movieCd}`;
        });

        const reviewCnt = Math.floor(Math.random() * 500);//좋아요 리뷰 수 임의 설정
        const likeCnt = Math.floor(Math.random() * 1000);//이후에 수정하기 내꺼 +1하는 형식??

        card.innerHTML = `
        <div class="d-flex mb-3">
            <div class="flex-shrink-0">
            <img src="${posterUrl}" class="img-fluid" alt="${title}" style="width: 150px; height: 225px; object-fit: cover;">
            </div>
            <div class="ms-3">
            <h5 class="card-title"><h4>${title}</h4></h5>
            <p class="card-text">개봉일: ${openDt || '정보 없음'}</p>
            <p class="card-text">감독: ${director || '정보 없음'}</p>
            <p class="card-text">리뷰: ${reviewCnt}개 | 좋아요: ${likeCnt}개</p>
            </div>
        </div>
        `;

        div.appendChild(card);
    }
}

//다른 페이지에서 검색어를 넘겨받는 코드부분
const params = new URLSearchParams(window.location.search); //window.location.search = ?query=영화제목
const query = params.get("query"); //params 중에서 query=?값을 가져옴
if (query) search(query);