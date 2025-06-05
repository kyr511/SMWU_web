//영화api
const KOBIS_KEY = "8f30f3cd89878ffb75c8b9a4ca3c7d31";
const TMDB_KEY = "c195cf58dc67be7d7345c99c5a852741";

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

async function displayMovieList(lst, mode) {
    const container = document.getElementById("movieList");
    container.innerHTML = "";

    if (lst.length === 0) {
        container.innerHTML = "<p>찜한 영화가 없습니다.</p>";
        return;
    }

    for (const movieCd of lst) {
        const url = `http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=${KOBIS_KEY}&movieCd=${movieCd}`;
        const res = await fetch(url);
        const data = await res.json();
        const info = data.movieInfoResult.movieInfo;

        const title = info.movieNm;
        const openDt = info.openDt; //영화개봉일
        const genre = info.genres.map(g => g.genreNm).join(", ");
        const director = info.directors.map(d => d.peopleNm).join(", ");
        const poster = await getPoster(title);
        const reviewCnt = Math.floor(Math.random() * 500);//좋아요 리뷰 수 임의 설정
        const likeCnt = Math.floor(Math.random() * 1000);//이후에 수정하기 내꺼 +1하는 형식??

        const card = document.createElement('div');
        card.className = 'card mb-4';
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
        window.location.href = `movie-detail.html?movieCd=${movieCd}`;
        });

        card.innerHTML = `
        <div class="d-flex mb-3">
            <div class="flex-shrink-0">
                <button class="remove-btn position-absolute top-0 end-0 btn btn-sm btn-light" onclick="event.stopPropagation(); deleteMovie('${movieCd}', '${mode}');location.reload()">X</button>
                <img src="${poster}" class="img-fluid" alt="${title}" style="width: 150px; height: 225px; object-fit: cover;">
            </div>
            <div class="ms-3">
                <h5 class="card-title"><h4>${title}</h4></h5>
                <p class="card-text">개봉일: ${openDt || '정보 없음'}</p>
                <p class="card-text">감독: ${director || '정보 없음'}</p>
                <p class="card-text">리뷰: ${reviewCnt}개 | 좋아요: ${likeCnt}개</p>
            </div>
        </div>
        `;
        container.appendChild(card);
    }
    
}

function deleteMovie(movieCd, mode) {
    if (mode === "wish") {
        addMovieWish(movieCd); 
    } else if (mode === "like") {
        addMovieLike(movieCd); 
    }
}
