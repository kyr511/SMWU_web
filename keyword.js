// // // // keyword.js


const tmdbKey = 'e563363c78911106e273c1c98c637eac';
let currentMovies = [];
let currentGenreId = null;
let currentSort = 'reviewCnt';  // 기본 정렬 변경 가능

document.addEventListener('DOMContentLoaded', () => {
  function sortMovies(movies, criterion) {
    return [...movies].sort((a, b) => {
      const getVal = (m, key) => {
        switch (key) {
          case 'reviewCnt': return m.reviewCnt || 0;
          case 'likeCnt': return m.likeCnt || 0;
          default: return 0;
        }
      };
      return getVal(b, criterion) - getVal(a, criterion);
    });
  }

  document.querySelectorAll('.keyword').forEach(tag => {
    tag.addEventListener('click', () => {
      currentGenreId = tag.dataset.genreId;
      fetchMoviesByGenre(currentGenreId);
    });
  });

  document.getElementById('sortOption').addEventListener('change', e => {
    currentSort = e.target.value;
    displayResults(sortMovies(currentMovies, currentSort));
  });

  async function fetchMoviesByGenre(genreId) {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbKey}&language=ko-KR&with_genres=${genreId}&include_adult=false`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      currentMovies = data.results
        .filter(m => m.poster_path)
        .map(m => ({
          ...m,
          reviewCnt: Math.floor(Math.random() * 1000),
          likeCnt: Math.floor(Math.random() * 500),
        }));

      displayResults(sortMovies(currentMovies, currentSort));
    } catch (e) {
      console.error('TMDB 장르별 검색 오류', e);
    }
  }

  function displayResults(movies) {
    const resultEl = document.getElementById('result');
    resultEl.innerHTML = '';
    if (!movies.length) {
      resultEl.innerHTML = '<p>검색 결과가 없습니다.</p>';
      return;
    }
    movies.forEach(m => {
      const poster = `https://image.tmdb.org/t/p/w500${m.poster_path}`;
      const card = document.createElement('div');
      card.className = 'card mb-4';
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        window.location.href = `movie-detail.html?id=${m.id}`;
      });
      card.innerHTML = `
        <div class="d-flex mb-3">
          <div class="flex-shrink-0">
            <img src="${poster}" style="width:150px;height:225px;object-fit:cover" alt="${m.title}">
          </div>
          <div class="ms-3">
            <h4>${m.title}</h4>
            <p>개봉일: ${m.release_date || '정보 없음'}</p>
            <p>${m.overview ? m.overview.slice(0,100)+'...' : '줄거리 없음' }</p>
            <p>리뷰: ${m.reviewCnt} | 좋아요: ${m.likeCnt}</p>
          </div>
        </div>
      `;
      resultEl.appendChild(card);
    });
  }
});


// const tmdbKey = 'e563363c78911106e273c1c98c637eac';
// let currentMovies = [];
// let currentKeyword = '';
// let currentSort = 'rank';

// document.addEventListener('DOMContentLoaded', () => {
//   function sortMovies(movies, criterion) {
//     return [...movies].sort((a, b) => {
//       const getVal = (m, key) => {
//         switch (key) {
//           case 'rank': return m.rank || 0;
//           case 'reviewCnt': return m.reviewCnt || 0;
//           case 'likeCnt': return m.likeCnt || 0;
//           default: return 0;
//         }
//       };
//       return criterion === 'rank'
//         ? getVal(a, criterion) - getVal(b, criterion)
//         : getVal(b, criterion) - getVal(a, criterion);
//     });
//   }

//   document.querySelectorAll('.keyword').forEach(tag => {
//     tag.addEventListener('click', () => {
//       currentKeyword = tag.dataset.keyword;
//       fetchMovies(currentKeyword);
//     });
//   });

//   document.getElementById('sortOption').addEventListener('change', e => {
//     currentSort = e.target.value;
//     displayResults(sortMovies(currentMovies, currentSort));
//   });

// //   async function fetchMovies(keyword) {
// //     const url = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&query=${encodeURIComponent(keyword)}&language=ko-KR`;
// //     try {
// //       const res = await fetch(url);
// //       const data = await res.json();
// //       currentMovies = data.results.filter(m => m.poster_path).map(m => ({
// //         ...m,
// //         reviewCnt: Math.floor(Math.random() * 1000),
// //         likeCnt: Math.floor(Math.random() * 500),
// //       }));
// //       displayResults(sortMovies(currentMovies, currentSort));
// //     } catch (e) {
// //       console.error('TMDB 검색 오류', e);
// //     }
// //   }
//     async function fetchMovies(keyword) {
//         const url = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&query=${encodeURIComponent(keyword)}&language=ko-KR`;
//         try {
//             const res = await fetch(url);
//             const data = await res.json();

//             // poster_path가 있고, adult가 false인 영화만 필터링
//             currentMovies = data.results
//             .filter(m => m.poster_path && !m.adult)
//             .map(m => ({
//                 ...m,
//                 reviewCnt: Math.floor(Math.random() * 1000),
//                 likeCnt: Math.floor(Math.random() * 500),
//             }));

//             displayResults(sortMovies(currentMovies, currentSort));
//         } catch (e) {
//             console.error('TMDB 검색 오류', e);
//         }
//         }


//   function displayResults(movies) {
//     const resultEl = document.getElementById('result');
//     resultEl.innerHTML = '';
//     if (!movies.length) {
//       resultEl.innerHTML = '<p>검색 결과가 없습니다.</p>';
//       return;
//     }
//     movies.forEach(m => {
//       const poster = `https://image.tmdb.org/t/p/w500${m.poster_path}`;
//       const card = document.createElement('div');
//       card.className = 'card mb-4';
//       card.style.cursor = 'pointer';
//       card.addEventListener('click', () => {
//         window.location.href = `movie-detail.html?id=${m.id}`;
//       });
//       card.innerHTML = `
//         <div class="d-flex mb-3">
//           <div class="flex-shrink-0">
//             <img src="${poster}" style="width:150px;height:225px;object-fit:cover" alt="${m.title}">
//           </div>
//           <div class="ms-3">
//             <h4>${m.title}</h4>
//             <p>개봉일: ${m.release_date || '정보 없음'}</p>
//             <p>${m.overview ? m.overview.slice(0,100)+'...' : '줄거리 없음' }</p>
//             <p>리뷰:${m.reviewCnt} | 좋아요:${m.likeCnt}</p>
//           </div>
//         </div>
//       `;
//       resultEl.appendChild(card);
//     });
//   }
// });

