// // //movie-detail.js

const tmdbKey = 'e563363c78911106e273c1c98c637eac';
const kobisKey = 'eccb144e2dfb491259f8b51680415fb8';
const params = new URLSearchParams(window.location.search);

// let tmdbId = params.get('id');
// let movieCd = params.get('movieCd');
let tmdbId = params.get('tmdbId') || params.get('id');
let movieCd = params.get('movieCd');


// // 깃허브 배포 시 id가 movieCd로 사용될 경우 대비
// if (tmdbId && !movieCd) {
//   movieCd = tmdbId;
//   tmdbId = null;
// }

let globalId;

window.addEventListener('DOMContentLoaded', () => {
  if (movieCd) {
    globalId = movieCd;
    fetchKOBISDetail(movieCd);
  } else if (tmdbId) {
    globalId = tmdbId;
    fetchTMDBDetail(tmdbId);
  } else {
    document.body.innerHTML = '<p>올바른 영화 정보가 없습니다.</p>';
  }
});

// async function fetchTMDBDetail(id) {
//   try {
//     const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbKey}&language=ko-KR`);
//     const data = await res.json();
//     document.getElementById('movieTitle').textContent = data.title;
//     document.getElementById('movieOverview').textContent = data.overview || '줄거리 없음';
//     document.getElementById('moviePoster').src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
//     document.getElementById('director').textContent = '감독 정보 없음';
//     document.getElementById('actors').textContent = '';
//   } catch (e) {
//     console.error('TMDB 상세 오류', e);
//   }
// }

async function fetchTMDBDetail(id) {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbKey}&language=ko-KR`);
    const data = await res.json();
    document.getElementById('movieTitle').textContent = data.title;
    document.getElementById('movieOverview').textContent = data.overview || '줄거리 없음';
    document.getElementById('moviePoster').src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;

    // 배우/감독 정보 불러오기
    const creditRes = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${tmdbKey}&language=ko-KR`);
    const creditData = await creditRes.json();

    // 감독
    const directors = creditData.crew.filter(person => person.job === 'Director');
    document.getElementById('director').textContent = directors.map(d => d.name).join(', ') || '감독 정보 없음';

    // 배우
    const actors = creditData.cast.slice(0, 5); // 상위 5명만
    document.getElementById('actors').textContent = actors.map(a => a.name).join(', ') || '출연 배우 정보 없음';

  } catch (e) {
    console.error('TMDB 상세 오류', e);
  }
}


async function fetchKOBISDetail(cd) {
  try {
    const res = await fetch(`https://kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=${kobisKey}&movieCd=${cd}`);
    const data = await res.json();
    const info = data.movieInfoResult.movieInfo;

    document.getElementById('movieTitle').textContent = info.movieNm;

    // 감독/배우는 KOBIS 사용
    const directors = info.directors.map(d => d.peopleNm).join(', ');
    const actors = info.actors.slice(0, 5).map(a => a.peopleNm).join(', ');

    document.getElementById('director').textContent = directors || '감독 정보 없음';
    document.getElementById('actors').textContent = actors || '출연 배우 정보 없음';

    // 줄거리와 포스터는 TMDB에서 가져오기
    const tmdbData = await getTMDBMovieDetail(info.movieNm);
    document.getElementById('movieOverview').textContent = tmdbData.overview || '줄거리 없음';
    document.getElementById('moviePoster').src = tmdbData.poster || 'https://via.placeholder.com/500x750?text=No+Image';

  } catch (e) {
    console.error('KOBIS 상세 오류', e);
  }
}

async function getTMDBMovieDetail(title) {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&query=${encodeURIComponent(title)}&language=ko-KR`);
    const js = await res.json();
    const m = js.results.find(m => m.overview && m.poster_path);
    return {
      overview: m?.overview || '',
      poster: m?.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null
    };
  } catch (e) {
    console.error('TMDB 검색 오류', e);
    return { overview: '', poster: null };
  }
}


// async function fetchKOBISDetail(cd) {
//   try {
//     const res = await fetch(`https://kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=${kobisKey}&movieCd=${cd}`);
//     const data = await res.json();
//     const info = data.movieInfoResult.movieInfo;
//     document.getElementById('movieTitle').textContent = info.movieNm;
//     document.getElementById('movieOverview').textContent = info.showTm ? `${info.showTm}분` : '정보 없음';
//     document.getElementById('director').textContent = info.directors.map(d => d.peopleNm).join(', ') || '감독 정보 없음';
//     document.getElementById('actors').textContent = info.actors.slice(0, 5).map(a => a.peopleNm).join(', ') || '출연 배우 정보 없음';
//     const poster = await getPosterFromTMDB(info.movieNm);
//     document.getElementById('moviePoster').src = poster;
//   } catch (e) {
//     console.error('KOBIS 상세 오류', e);
//   }
// }

// async function getPosterFromTMDB(title) {
//   try {
//     const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&query=${encodeURIComponent(title)}&language=ko-KR`);
//     const js = await res.json();
//     const m = js.results.find(m => m.poster_path);
//     return m ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image';
//   } catch {
//     return 'https://via.placeholder.com/500x750?text=No+Image';
//   }
// }


// const tmdbKey = 'e563363c78911106e273c1c98c637eac';
// const kobisKey = 'eccb144e2dfb491259f8b51680415fb8';
// const params = new URLSearchParams(window.location.search);
// const tmdbId = params.get('id');
// const movieCd = params.get('movieCd');
// let globalId;

// window.addEventListener('DOMContentLoaded', () => {
//   if (tmdbId) {
//     globalId = tmdbId;
//     fetchTMDBDetail(tmdbId);
//   } else if (movieCd) {
//     globalId = movieCd;
//     fetchKOBISDetail(movieCd);
//   } else {
//     document.body.innerHTML = '<p>올바른 영화 정보가 없습니다.</p>';
//   }
// });

// async function fetchTMDBDetail(id) {
//   try {
//     const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbKey}&language=ko-KR`);
//     const data = await res.json();
//     document.getElementById('movieTitle').textContent = data.title;
//     document.getElementById('movieOverview').textContent = data.overview || '줄거리 없음';
//     document.getElementById('moviePoster').src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
//     document.getElementById('director').textContent = '감독 정보 없음';
//     document.getElementById('actors').textContent = '';
//   } catch (e) {
//     console.error('TMDB 상세 오류', e);
//   }
// }

// async function fetchKOBISDetail(cd) {
//   try {
//     const res = await fetch(
//       `https://kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=${kobisKey}&movieCd=${cd}`
//     );
//     const data = await res.json();
//     const info = data.movieInfoResult.movieInfo;
//     document.getElementById('movieTitle').textContent = info.movieNm;
//     document.getElementById('movieOverview').textContent = info.showTm
//       ? `${info.showTm}분`
//       : '정보 없음';
//     document.getElementById(
//       'director'
//     ).textContent = info.directors.map(d => d.peopleNm).join(', ') || '감독 정보 없음';
//     document.getElementById(
//       'actors'
//     ).textContent = info.actors.slice(0,5).map(a => a.peopleNm).join(', ') || '출연 배우 정보 없음';
//     const poster = await getPosterFromTMDB(info.movieNm);
//     document.getElementById('moviePoster').src = poster;
//   } catch (e) {
//     console.error('KOBIS 상세 오류', e);
//   }
// }

// async function getPosterFromTMDB(title) {
//   try {
//     const res = await fetch(
//       `https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&query=${encodeURIComponent(title)}&language=ko-KR`
//     );
//     const js = await res.json();
//     const m = js.results.find(m => m.poster_path);
//     return m ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image';
//   } catch {
//     return 'https://via.placeholder.com/500x750?text=No+Image';
//   }
// }

// /////////////////////////////////////////////////////////////////////////////////////////////////

// // const urlParams = new URLSearchParams(window.location.search);
// // const movieCd = urlParams.get('movieCd');

// // const kobisKey = 'eccb144e2dfb491259f8b51680415fb8';
// // const tmdbKey = 'e563363c78911106e273c1c98c637eac';

// // async function fetchMovieDetail() {
// //   if (!movieCd) return;

// //   try {
// //     // ✅ KOBIS 영화 상세 정보
// //     const kobisRes = await fetch(`https://kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=${kobisKey}&movieCd=${movieCd}`);
// //     const kobisData = await kobisRes.json();
// //     const movieInfo = kobisData.movieInfoResult.movieInfo;

// //     const title = movieInfo.movieNm;
// //     const directors = movieInfo.directors.map(d => d.peopleNm);
// //     const actors = movieInfo.actors.slice(0, 5).map(actor => actor.peopleNm);

// //     document.getElementById('movieTitle').textContent = title;

// //     const directorDiv = document.getElementById('director');
// //     directors.forEach(name => {
// //       const badge = document.createElement('span');
// //       badge.className = 'badge bg-secondary text-white';
// //       badge.textContent = name;
// //       directorDiv.appendChild(badge);
// //     });


// //     const actorsDiv = document.getElementById('actors');
// //     actors.forEach(name => {
// //       const badge = document.createElement('span');
// //       badge.className = 'badge bg-secondary text-white';
// //       badge.textContent = name;
// //       actorsDiv.appendChild(badge);
// //     });


// //     // ✅ TMDB에서 포스터 및 소개
// //     const tmdbRes = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&query=${encodeURIComponent(title)}&language=ko-KR`);
// //     const tmdbData = await tmdbRes.json();

// //     if (tmdbData.results && tmdbData.results.length > 0) {
// //       const movie = tmdbData.results[0];
// //       document.getElementById('moviePoster').src = movie.poster_path
// //         ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
// //         : 'https://via.placeholder.com/500x750?text=No+Image';
// //       document.getElementById('movieOverview').textContent = movie.overview || '줄거리 정보 없음';
// //     }

// //     // ✅ 더미 리뷰 로드
// //     loadDummyReviews();

// //   } catch (err) {
// //     console.error('영화 정보 로딩 실패:', err);
// //   }
// // }

// // let reviewData = [ //더미 리뷰(전역변수)
// //     { username: 'user01', profileImg: '임시프로필.jpeg', text: '정말 감동적인 영화였어요.' },
// //     { username: 'user02', profileImg: '임시프로필.jpeg', text: '연출이 뛰어났습니다.' },
// //     { username: 'user03', profileImg: '임시프로필.jpeg', text: '배우들의 연기가 인상 깊었어요.' },
// //     { username: 'user04', profileImg: '임시프로필.jpeg', text: '스토리가 정말 좋아요!' }
// //   ];
// // let user = JSON.parse(localStorage.getItem("user") || {}); //사용자 리뷰 추가하기
// // if (user.MovieReviewlist && user.MovieReviewlist[movieCd]){
// //   reviewData.unshift({ username: user.username, profileImg: '임시프로필.jpeg' , text: user.MovieReviewlist[movieCd] });
// // }

// // function loadDummyReviews() { //리뷰 출력
// //   const reviewContainer = document.getElementById('reviews');
// //   reviewContainer.innerHTML = '';

// //   const isAdmin = GetCookie("mode") === "1"; //관리자 모드 여부

// //   reviewData.forEach(data => {
// //     const card = document.createElement('div');
// //     card.className = 'card review-card';

// //     card.innerHTML = `
// //       <div class="d-flex align-items-center mb-2">
// //         ${isAdmin ? `<button class="remove-btn position-absolute top-0 end-0 btn btn-sm btn-light" onclick="event.stopPropagation(); deleteReview('${data.username}');">X</button>` : ""}
// //         <img src="${data.profileImg}" class="rounded-circle me-2" width="50" height="50">
// //         <strong>${data.username}</strong>
// //       </div>
// //       <p class="mb-0">${data.text}</p>
// //     `;

// //     reviewContainer.appendChild(card);
// //   });
// // }

// // function deleteReview(username){
// //   const index = reviewData.findIndex(review => review.username === username);
// //   reviewData.splice(index, 1);
// //   alert(`'${username}'의 리뷰가 삭제되었습니다.`);
// //   loadDummyReviews()
// // }


// // function scrollReviews(offset) {
// //   const container = document.getElementById('reviews');
// //   container.scrollBy({ left: offset, behavior: 'smooth' });
// // }

// // fetchMovieDetail();
