//movie-detail.js

const kobisKey = 'eccb144e2dfb491259f8b51680415fb8';
const tmdbKey = 'e563363c78911106e273c1c98c637eac';

const params = new URLSearchParams(window.location.search);
const movieCd = params.get('movieCd');
const tmdbId = params.get('tmdbId') || params.get('id');

let reviewData = [ // 기본 더미 리뷰
  { username: 'user01', profileImg: '임시프로필.jpeg', text: '정말 감동적인 영화였어요.' },
  { username: 'user02', profileImg: '임시프로필.jpeg', text: '연출이 뛰어났습니다.' },
  { username: 'user03', profileImg: '임시프로필.jpeg', text: '배우들의 연기가 인상 깊었어요.' },
  { username: 'user04', profileImg: '임시프로필.jpeg', text: '스토리가 정말 좋아요!' }
];

// 사용자 정보 - 예: localStorage에 저장된 유저 데이터 형식
let user = JSON.parse(localStorage.getItem("user") || '{}');

// 영화 상세 정보 가져오는 통합 함수
async function fetchMovieDetail() {
  if (movieCd) {
    await fetchKOBISDetail(movieCd);
  } else if (tmdbId) {
    await fetchTMDBDetail(tmdbId);
  } else {
    document.body.innerHTML = '<p>올바른 영화 정보가 없습니다.</p>';
    return;
  }

  // 사용자 리뷰가 있으면 기본 리뷰 앞에 넣기
  if (user.MovieReviewlist && user.MovieReviewlist[movieCd || tmdbId]) {
    reviewData.unshift({
      username: user.username,
      profileImg: '임시프로필.jpeg',
      text: user.MovieReviewlist[movieCd || tmdbId]
    });
  }
  
  loadReviews();
}

// KOBIS API 상세 + TMDB 줄거리/포스터 조합
async function fetchKOBISDetail(cd) {
  try {
    const res = await fetch(`https://kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=${kobisKey}&movieCd=${cd}`);
    const data = await res.json();
    const info = data.movieInfoResult.movieInfo;

    document.getElementById('movieTitle').textContent = info.movieNm;

    // 감독
    const directorDiv = document.getElementById('director');
    directorDiv.textContent = info.directors.length
      ? info.directors.map(d => d.peopleNm).join(', ')
      : '감독 정보 없음';


    // 배우
    const actorsDiv = document.getElementById('actors');
    actorsDiv.textContent = info.actors.length
      ? info.actors.slice(0, 5).map(a => a.peopleNm).join(', ')
      : '출연 배우 정보 없음';


    // TMDB에서 줄거리 및 포스터 가져오기
    const tmdbData = await getTMDBMovieDetail(info.movieNm);
    document.getElementById('movieOverview').textContent = tmdbData.overview || '줄거리 없음';
    document.getElementById('moviePoster').src = tmdbData.poster || 'https://via.placeholder.com/500x750?text=No+Image';

  } catch (e) {
    console.error('KOBIS 상세 오류', e);
    document.body.innerHTML = '<p>영화 정보를 불러오는 데 실패했습니다.</p>';
  }
}

// TMDB API 상세 (id로) + 배우/감독 크레딧까지
async function fetchTMDBDetail(id) {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbKey}&language=ko-KR`);
    const data = await res.json();

    document.getElementById('movieTitle').textContent = data.title || '제목 정보 없음';
    document.getElementById('movieOverview').textContent = data.overview || '줄거리 없음';
    document.getElementById('moviePoster').src = data.poster_path
      ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
      : 'https://via.placeholder.com/500x750?text=No+Image';

    // 배우/감독 정보 크레딧에서 가져오기
    const creditRes = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${tmdbKey}&language=ko-KR`);
    const creditData = await creditRes.json();

    // 감독
    const directorDiv = document.getElementById('director');
    const directors = creditData.crew.filter(person => person.job === 'Director');
    directorDiv.textContent = directors.length
      ? directors.map(d => d.name).join(', ')
      : '감독 정보 없음';

    // 배우 (상위 5명)
    const actorsDiv = document.getElementById('actors');
    const actors = creditData.cast.slice(0, 5);
    actorsDiv.textContent = actors.length
      ? actors.map(a => a.name).join(', ')
      : '출연 배우 정보 없음';

      } catch (e) {
        console.error('TMDB 상세 오류', e);
        document.body.innerHTML = '<p>영화 정보를 불러오는 데 실패했습니다.</p>';
      }
    }

// TMDB 영화명으로 검색해서 줄거리, 포스터 찾기 (KOBIS용)
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

// 리뷰 불러오기 & 렌더링
function loadReviews() {
  const reviewContainer = document.getElementById('reviews');
  reviewContainer.innerHTML = '';

  const isAdmin = getCookie("mode") === "1"; // 관리자 모드 여부

  reviewData.forEach(data => {
    const card = document.createElement('div');
    card.className = 'card review-card position-relative mb-3 p-3';

    card.innerHTML = `
      <div class="d-flex align-items-center mb-2">
        <img src="${data.profileImg}" class="rounded-circle me-2" width="50" height="50" alt="프로필 이미지">
        <strong>${data.username}</strong>
      </div>
      <p class="mb-0">${data.text}</p>
    `;

    if (isAdmin) {
      const btn = document.createElement('button');
      btn.className = 'btn btn-sm btn-danger position-absolute top-0 end-0';
      btn.textContent = 'X';
      btn.onclick = (e) => {
        e.stopPropagation();
        deleteReview(data.username);
      };
      card.appendChild(btn);
    }

    reviewContainer.appendChild(card);
  });
}

// 리뷰 삭제 (관리자 전용)
function deleteReview(username) {
  const idx = reviewData.findIndex(r => r.username === username);
  if (idx !== -1) {
    reviewData.splice(idx, 1);
    alert(`'${username}'의 리뷰가 삭제되었습니다.`);
    saveUserReviews();
    loadReviews();
  }
}

// 리뷰 작성 이벤트
function addReview() {
  const input = document.getElementById('reviewInput');
  const text = input.value.trim();
  if (!text) {
    alert('리뷰 내용을 입력하세요.');
    return;
  }

  if (!user.username) {
    alert('로그인 후 리뷰를 작성할 수 있습니다.');
    return;
  }

  // 새 리뷰 추가
  reviewData.unshift({
    username: user.username,
    profileImg: '임시프로필.jpeg',
    text
  });

  // 사용자 리뷰도 저장
  if (!user.MovieReviewlist) user.MovieReviewlist = {};
  user.MovieReviewlist[movieCd || tmdbId] = text;
  localStorage.setItem('user', JSON.stringify(user));

  input.value = '';
  loadReviews();
}

// 쿠키 읽기 함수
function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (const c of cookies) {
    const [k, v] = c.trim().split('=');
    if (k === name) return v;
  }
  return null;
}

// 사용자가 작성한 리뷰를 로컬에 저장
function saveUserReviews() {
  if (user.username && user.MovieReviewlist) {
    localStorage.setItem('user', JSON.stringify(user));
  }
}

// 페이지 로드 시 실행
window.addEventListener('DOMContentLoaded', () => {
  fetchMovieDetail();

  // 리뷰 작성 버튼 연결
  const btn = document.getElementById('addReviewBtn');
  if (btn) {
    btn.addEventListener('click', addReview);
  }
});




// const kobisKey = 'eccb144e2dfb491259f8b51680415fb8';
// const tmdbKey = 'e563363c78911106e273c1c98c637eac';

// const params = new URLSearchParams(window.location.search);
// const movieCd = params.get('movieCd');

// let reviewData = [ // 기본 더미 리뷰
//   { username: 'user01', profileImg: '임시프로필.jpeg', text: '정말 감동적인 영화였어요.' },
//   { username: 'user02', profileImg: '임시프로필.jpeg', text: '연출이 뛰어났습니다.' },
//   { username: 'user03', profileImg: '임시프로필.jpeg', text: '배우들의 연기가 인상 깊었어요.' },
//   { username: 'user04', profileImg: '임시프로필.jpeg', text: '스토리가 정말 좋아요!' }
// ];

// // 사용자 정보 - 예: localStorage에 저장된 유저 데이터 형식
// let user = JSON.parse(localStorage.getItem("user") || '{}');

// // 영화 정보 불러오기 & 리뷰 함께 처리
// async function fetchMovieDetail() {
//   if (!movieCd) {
//     document.body.innerHTML = '<p>올바른 영화 정보가 없습니다.</p>';
//     return;
//   }

//   try {
//     // KOBIS 영화 상세 정보
//     const kobisRes = await fetch(`https://kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=${kobisKey}&movieCd=${movieCd}`);
//     const kobisData = await kobisRes.json();
//     const movieInfo = kobisData.movieInfoResult.movieInfo;

//     // 제목, 감독, 배우 표시
//     document.getElementById('movieTitle').textContent = movieInfo.movieNm;

//     const directorDiv = document.getElementById('director');
//     directorDiv.innerHTML = ''; // 초기화
//     movieInfo.directors.forEach(d => {
//       const badge = document.createElement('span');
//       badge.className = 'badge bg-secondary text-white me-1';
//       badge.textContent = d.peopleNm;
//       directorDiv.appendChild(badge);
//     });

//     const actorsDiv = document.getElementById('actors');
//     actorsDiv.innerHTML = ''; // 초기화
//     movieInfo.actors.slice(0, 5).forEach(a => {
//       const badge = document.createElement('span');
//       badge.className = 'badge bg-secondary text-white me-1';
//       badge.textContent = a.peopleNm;
//       actorsDiv.appendChild(badge);
//     });

//     // TMDB에서 포스터 및 줄거리
//     const tmdbRes = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&query=${encodeURIComponent(movieInfo.movieNm)}&language=ko-KR`);
//     const tmdbData = await tmdbRes.json();

//     if (tmdbData.results && tmdbData.results.length > 0) {
//       const movie = tmdbData.results[0];
//       document.getElementById('moviePoster').src = movie.poster_path
//         ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
//         : 'https://via.placeholder.com/500x750?text=No+Image';
//       document.getElementById('movieOverview').textContent = movie.overview || '줄거리 정보 없음';
//     } else {
//       document.getElementById('moviePoster').src = 'https://via.placeholder.com/500x750?text=No+Image';
//       document.getElementById('movieOverview').textContent = '줄거리 정보 없음';
//     }

//     // 사용자 리뷰가 있으면 더미 리뷰 앞에 추가
//     if (user.MovieReviewlist && user.MovieReviewlist[movieCd]) {
//       reviewData.unshift({
//         username: user.username,
//         profileImg: '임시프로필.jpeg',
//         text: user.MovieReviewlist[movieCd]
//       });
//     }

//     loadReviews();

//   } catch (err) {
//     console.error('영화 정보 로딩 실패:', err);
//     document.body.innerHTML = '<p>영화 정보를 불러오는 데 실패했습니다.</p>';
//   }
// }

// // 리뷰 불러오기 & 렌더링
// function loadReviews() {
//   const reviewContainer = document.getElementById('reviews');
//   reviewContainer.innerHTML = '';

//   const isAdmin = getCookie("mode") === "1"; // 관리자 모드 여부

//   reviewData.forEach(data => {
//     const card = document.createElement('div');
//     card.className = 'card review-card position-relative mb-3 p-3';

//     card.innerHTML = `
//       <div class="d-flex align-items-center mb-2">
//         <img src="${data.profileImg}" class="rounded-circle me-2" width="50" height="50" alt="프로필 이미지">
//         <strong>${data.username}</strong>
//       </div>
//       <p class="mb-0">${data.text}</p>
//     `;

//     if (isAdmin) {
//       const btn = document.createElement('button');
//       btn.className = 'btn btn-sm btn-danger position-absolute top-0 end-0';
//       btn.textContent = 'X';
//       btn.onclick = (e) => {
//         e.stopPropagation();
//         deleteReview(data.username);
//       };
//       card.appendChild(btn);
//     }

//     reviewContainer.appendChild(card);
//   });
// }

// // 리뷰 삭제 (관리자 전용)
// function deleteReview(username) {
//   const idx = reviewData.findIndex(r => r.username === username);
//   if (idx !== -1) {
//     reviewData.splice(idx, 1);
//     alert(`'${username}'의 리뷰가 삭제되었습니다.`);
//     saveUserReviews();
//     loadReviews();
//   }
// }

// // 리뷰 작성 이벤트
// function addReview() {
//   const input = document.getElementById('reviewInput');
//   const text = input.value.trim();
//   if (!text) {
//     alert('리뷰 내용을 입력하세요.');
//     return;
//   }

//   if (!user.username) {
//     alert('로그인 후 리뷰를 작성할 수 있습니다.');
//     return;
//   }

//   // 새 리뷰 추가
//   reviewData.unshift({
//     username: user.username,
//     profileImg: '임시프로필.jpeg',
//     text
//   });

//   // 사용자 리뷰도 저장
//   if (!user.MovieReviewlist) user.MovieReviewlist = {};
//   user.MovieReviewlist[movieCd] = text;
//   localStorage.setItem('user', JSON.stringify(user));

//   input.value = '';
//   loadReviews();
// }

// // 쿠키 읽기 함수
// function getCookie(name) {
//   const cookies = document.cookie.split(';');
//   for (const c of cookies) {
//     const [k, v] = c.trim().split('=');
//     if (k === name) return v;
//   }
//   return null;
// }

// // 사용자가 작성한 리뷰를 로컬에 저장
// function saveUserReviews() {
//   if (user.username && user.MovieReviewlist) {
//     localStorage.setItem('user', JSON.stringify(user));
//   }
// }

// // 페이지 로드 시 실행
// window.addEventListener('DOMContentLoaded', () => {
//   fetchMovieDetail();

//   // 리뷰 작성 버튼 연결
//   const btn = document.getElementById('addReviewBtn');
//   if (btn) {
//     btn.addEventListener('click', addReview);
//   }
// });



// // const tmdbKey = 'e563363c78911106e273c1c98c637eac';
// // const kobisKey = 'eccb144e2dfb491259f8b51680415fb8';
// // const params = new URLSearchParams(window.location.search);

// // // let tmdbId = params.get('id');
// // // let movieCd = params.get('movieCd');
// // let tmdbId = params.get('tmdbId') || params.get('id');
// // let movieCd = params.get('movieCd');


// // // // 깃허브 배포 시 id가 movieCd로 사용될 경우 대비
// // // if (tmdbId && !movieCd) {
// // //   movieCd = tmdbId;
// // //   tmdbId = null;
// // // }

// // let globalId;

// // window.addEventListener('DOMContentLoaded', () => {
// //   if (movieCd) {
// //     globalId = movieCd;
// //     fetchKOBISDetail(movieCd);
// //   } else if (tmdbId) {
// //     globalId = tmdbId;
// //     fetchTMDBDetail(tmdbId);
// //   } else {
// //     document.body.innerHTML = '<p>올바른 영화 정보가 없습니다.</p>';
// //   }
// // });

// // // async function fetchTMDBDetail(id) {
// // //   try {
// // //     const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbKey}&language=ko-KR`);
// // //     const data = await res.json();
// // //     document.getElementById('movieTitle').textContent = data.title;
// // //     document.getElementById('movieOverview').textContent = data.overview || '줄거리 없음';
// // //     document.getElementById('moviePoster').src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
// // //     document.getElementById('director').textContent = '감독 정보 없음';
// // //     document.getElementById('actors').textContent = '';
// // //   } catch (e) {
// // //     console.error('TMDB 상세 오류', e);
// // //   }
// // // }

// // async function fetchTMDBDetail(id) {
// //   try {
// //     const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbKey}&language=ko-KR`);
// //     const data = await res.json();
// //     document.getElementById('movieTitle').textContent = data.title;
// //     document.getElementById('movieOverview').textContent = data.overview || '줄거리 없음';
// //     document.getElementById('moviePoster').src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;

// //     // 배우/감독 정보 불러오기
// //     const creditRes = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${tmdbKey}&language=ko-KR`);
// //     const creditData = await creditRes.json();

// //     // 감독
// //     const directors = creditData.crew.filter(person => person.job === 'Director');
// //     document.getElementById('director').textContent = directors.map(d => d.name).join(', ') || '감독 정보 없음';

// //     // 배우
// //     const actors = creditData.cast.slice(0, 5); // 상위 5명만
// //     document.getElementById('actors').textContent = actors.map(a => a.name).join(', ') || '출연 배우 정보 없음';

// //   } catch (e) {
// //     console.error('TMDB 상세 오류', e);
// //   }
// // }


// // async function fetchKOBISDetail(cd) {
// //   try {
// //     const res = await fetch(`https://kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=${kobisKey}&movieCd=${cd}`);
// //     const data = await res.json();
// //     const info = data.movieInfoResult.movieInfo;

// //     document.getElementById('movieTitle').textContent = info.movieNm;

// //     // 감독/배우는 KOBIS 사용
// //     const directors = info.directors.map(d => d.peopleNm).join(', ');
// //     const actors = info.actors.slice(0, 5).map(a => a.peopleNm).join(', ');

// //     document.getElementById('director').textContent = directors || '감독 정보 없음';
// //     document.getElementById('actors').textContent = actors || '출연 배우 정보 없음';

// //     // 줄거리와 포스터는 TMDB에서 가져오기
// //     const tmdbData = await getTMDBMovieDetail(info.movieNm);
// //     document.getElementById('movieOverview').textContent = tmdbData.overview || '줄거리 없음';
// //     document.getElementById('moviePoster').src = tmdbData.poster || 'https://via.placeholder.com/500x750?text=No+Image';

// //   } catch (e) {
// //     console.error('KOBIS 상세 오류', e);
// //   }
// // }

// // async function getTMDBMovieDetail(title) {
// //   try {
// //     const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&query=${encodeURIComponent(title)}&language=ko-KR`);
// //     const js = await res.json();
// //     const m = js.results.find(m => m.overview && m.poster_path);
// //     return {
// //       overview: m?.overview || '',
// //       poster: m?.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null
// //     };
// //   } catch (e) {
// //     console.error('TMDB 검색 오류', e);
// //     return { overview: '', poster: null };
// //   }
// // }


// // // /////////////////////////////////////////////////////////////////////////////////////////////////

// // // // const urlParams = new URLSearchParams(window.location.search);
// // // // const movieCd = urlParams.get('movieCd');

// // // // const kobisKey = 'eccb144e2dfb491259f8b51680415fb8';
// // // // const tmdbKey = 'e563363c78911106e273c1c98c637eac';

// // // // async function fetchMovieDetail() {
// // // //   if (!movieCd) return;

// // // //   try {
// // // //     // ✅ KOBIS 영화 상세 정보
// // // //     const kobisRes = await fetch(`https://kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=${kobisKey}&movieCd=${movieCd}`);
// // // //     const kobisData = await kobisRes.json();
// // // //     const movieInfo = kobisData.movieInfoResult.movieInfo;

// // // //     const title = movieInfo.movieNm;
// // // //     const directors = movieInfo.directors.map(d => d.peopleNm);
// // // //     const actors = movieInfo.actors.slice(0, 5).map(actor => actor.peopleNm);

// // // //     document.getElementById('movieTitle').textContent = title;

// // // //     const directorDiv = document.getElementById('director');
// // // //     directors.forEach(name => {
// // // //       const badge = document.createElement('span');
// // // //       badge.className = 'badge bg-secondary text-white';
// // // //       badge.textContent = name;
// // // //       directorDiv.appendChild(badge);
// // // //     });


// // // //     const actorsDiv = document.getElementById('actors');
// // // //     actors.forEach(name => {
// // // //       const badge = document.createElement('span');
// // // //       badge.className = 'badge bg-secondary text-white';
// // // //       badge.textContent = name;
// // // //       actorsDiv.appendChild(badge);
// // // //     });


// // // //     // ✅ TMDB에서 포스터 및 소개
// // // //     const tmdbRes = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&query=${encodeURIComponent(title)}&language=ko-KR`);
// // // //     const tmdbData = await tmdbRes.json();

// // // //     if (tmdbData.results && tmdbData.results.length > 0) {
// // // //       const movie = tmdbData.results[0];
// // // //       document.getElementById('moviePoster').src = movie.poster_path
// // // //         ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
// // // //         : 'https://via.placeholder.com/500x750?text=No+Image';
// // // //       document.getElementById('movieOverview').textContent = movie.overview || '줄거리 정보 없음';
// // // //     }

// // // //     // ✅ 더미 리뷰 로드
// // // //     loadDummyReviews();

// // // //   } catch (err) {
// // // //     console.error('영화 정보 로딩 실패:', err);
// // // //   }
// // // // }

// // // // let reviewData = [ //더미 리뷰(전역변수)
// // // //     { username: 'user01', profileImg: '임시프로필.jpeg', text: '정말 감동적인 영화였어요.' },
// // // //     { username: 'user02', profileImg: '임시프로필.jpeg', text: '연출이 뛰어났습니다.' },
// // // //     { username: 'user03', profileImg: '임시프로필.jpeg', text: '배우들의 연기가 인상 깊었어요.' },
// // // //     { username: 'user04', profileImg: '임시프로필.jpeg', text: '스토리가 정말 좋아요!' }
// // // //   ];
// // // // let user = JSON.parse(localStorage.getItem("user") || {}); //사용자 리뷰 추가하기
// // // // if (user.MovieReviewlist && user.MovieReviewlist[movieCd]){
// // // //   reviewData.unshift({ username: user.username, profileImg: '임시프로필.jpeg' , text: user.MovieReviewlist[movieCd] });
// // // // }

// // // // function loadDummyReviews() { //리뷰 출력
// // // //   const reviewContainer = document.getElementById('reviews');
// // // //   reviewContainer.innerHTML = '';

// // // //   const isAdmin = GetCookie("mode") === "1"; //관리자 모드 여부

// // // //   reviewData.forEach(data => {
// // // //     const card = document.createElement('div');
// // // //     card.className = 'card review-card';

// // // //     card.innerHTML = `
// // // //       <div class="d-flex align-items-center mb-2">
// // // //         ${isAdmin ? `<button class="remove-btn position-absolute top-0 end-0 btn btn-sm btn-light" onclick="event.stopPropagation(); deleteReview('${data.username}');">X</button>` : ""}
// // // //         <img src="${data.profileImg}" class="rounded-circle me-2" width="50" height="50">
// // // //         <strong>${data.username}</strong>
// // // //       </div>
// // // //       <p class="mb-0">${data.text}</p>
// // // //     `;

// // // //     reviewContainer.appendChild(card);
// // // //   });
// // // // }

// // // // function deleteReview(username){
// // // //   const index = reviewData.findIndex(review => review.username === username);
// // // //   reviewData.splice(index, 1);
// // // //   alert(`'${username}'의 리뷰가 삭제되었습니다.`);
// // // //   loadDummyReviews()
// // // // }


// // // // function scrollReviews(offset) {
// // // //   const container = document.getElementById('reviews');
// // // //   container.scrollBy({ left: offset, behavior: 'smooth' });
// // // // }

// // // // fetchMovieDetail();
