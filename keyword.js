// // keyword.js

const tmdbKey = 'e563363c78911106e273c1c98c637eac';

let currentMovies = [];   // 현재 검색된 영화 목록 저장
let currentKeyword = '';  // 현재 선택된 키워드
let currentSort = 'rank'; // 기본 정렬기준

document.addEventListener('DOMContentLoaded', () => {
    // 정렬 함수
    function sortMovies(movies, criterion) {
        return [...movies].sort((a, b) => {
            const getVal = (movie, key) => {
                switch (key) {
                    case 'rank':
                        return movie.rank ? parseInt(movie.rank) : 0;
                    case 'audiCnt':
                        return movie.audiCnt ? parseInt(movie.audiCnt) : 0;
                    case 'reviewCnt':
                        return movie.reviewCnt || 0;
                    case 'likeCnt':
                        return movie.likeCnt || 0;
                    default:
                        return 0;
                }
            };

            if (criterion === 'rank') {
                return getVal(a, criterion) - getVal(b, criterion);
            } else {
                return getVal(b, criterion) - getVal(a, criterion);
            }
        });
    }

    // 키워드 클릭 이벤트 바인딩
    document.querySelectorAll('.keyword').forEach(tag => {
        tag.addEventListener('click', () => {
            const keyword = tag.getAttribute('data-keyword');
            currentKeyword = keyword;
            fetchMovies(keyword);
        });
    });

    // 정렬 기준 변경 이벤트
    document.getElementById('sortOption').addEventListener('change', (e) => {
        currentSort = e.target.value;
        if (currentMovies.length > 0) {
            const sorted = sortMovies(currentMovies, currentSort);
            displayResults(sorted);
        }
    });

    // TMDB 영화 불러오기
    async function fetchMovies(keyword) {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&query=${encodeURIComponent(keyword)}&language=ko-KR`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            let filtered = data.results.filter(movie => movie.poster_path);

            filtered = filtered.map(movie => ({
                ...movie,
                rank: 0,
                audiCnt: 0,
                reviewCnt: Math.floor(Math.random() * 1000), // 임의 값
                likeCnt: Math.floor(Math.random() * 500)     // 임의 값
            }));

            currentMovies = filtered;

            const sorted = sortMovies(currentMovies, currentSort);
            displayResults(sorted);
        } catch (error) {
            console.error('영화 데이터를 가져오는 중 오류 발생:', error);
        }
    }

    // 결과 렌더링 함수 (세로 카드 스타일)
    function displayResults(movies) {
        const resultEl = document.getElementById('result');
        resultEl.innerHTML = '';

        if (movies.length === 0) {
            resultEl.innerHTML = '<p>검색 결과가 없습니다.</p>';
            return;
        }

        movies.forEach(movie => {
            const poster = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

            const card = document.createElement('div');
            card.className = 'card mb-4';
            card.style.cursor = 'pointer';

            card.innerHTML = `
                <div class="d-flex mb-3">
                    <div class="flex-shrink-0">
                        <img src="${poster}" class="img-fluid" alt="${movie.title}" style="width: 150px; height: 225px; object-fit: cover;">
                    </div>
                    <div class="ms-3">
                        <h4>${movie.title}</h4>
                        <p class="card-text">개봉일: ${movie.release_date || '정보 없음'}</p>
                        <p class="card-text">${movie.overview ? movie.overview.slice(0, 100) + '...' : '줄거리 없음'}</p>
                        <p class="card-text">리뷰: ${movie.reviewCnt}개 | 좋아요: ${movie.likeCnt}개</p>
                    </div>
                </div>
            `;

            resultEl.appendChild(card);
        });
    }

    // 페이지 들어오자마자 기본 키워드 실행 (선택사항)
    // fetchMovies('드라마'); // 주석 해제하면 자동 실행됨
});




// const tmdbKey = 'e563363c78911106e273c1c98c637eac';

// let currentMovies = [];   // 현재 검색된 영화 목록 저장
// let currentKeyword = '';  // 현재 선택된 키워드
// let currentSort = 'rank'; // 기본 정렬기준

// // 정렬 함수: 네가 준 기준에 맞춰서 정렬 (영화 API 결과에 없으면 기본값 0으로 처리)
// function sortMovies(movies, criterion) {
//     return [...movies].sort((a, b) => {
//         // 각 항목 없으면 0으로 치환
//         const getVal = (movie, key) => {
//             switch(key) {
//                 case 'rank':
//                     return movie.rank ? parseInt(movie.rank) : 0;
//                 case 'audiCnt':
//                     return movie.audiCnt ? parseInt(movie.audiCnt) : 0;
//                 case 'reviewCnt':
//                     return movie.reviewCnt || 0;
//                 case 'likeCnt':
//                     return movie.likeCnt || 0;
//                 default:
//                     return 0;
//             }
//         };

//         if (criterion === 'rank' || criterion === 'audiCnt') {
//             // rank는 오름차순, audiCnt 등은 내림차순(많은 순)
//             if (criterion === 'rank') {
//                 return getVal(a, criterion) - getVal(b, criterion);
//             } else {
//                 return getVal(b, criterion) - getVal(a, criterion);
//             }
//         } else {
//             // reviewCnt, likeCnt 내림차순
//             return getVal(b, criterion) - getVal(a, criterion);
//         }
//     });
// }

// document.querySelectorAll('.keyword').forEach(tag => {
//     tag.addEventListener('click', () => {
//         const keyword = tag.getAttribute('data-keyword');
//         currentKeyword = keyword;
//         fetchMovies(keyword);
//     });
// });

// document.getElementById('sortOption').addEventListener('change', (e) => {
//     currentSort = e.target.value;
//     if (currentMovies.length > 0) {
//         const sorted = sortMovies(currentMovies, currentSort);
//         displayResults(sorted);
//     }
// });

// // TMDB에서 가져온 영화 결과에 임의 데이터(박스오피스 기준) 없으니까 기본 0으로 세팅
// async function fetchMovies(keyword) {
//     const url = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&query=${encodeURIComponent(keyword)}&language=ko-KR`;

//     try {
//         const response = await fetch(url);
//         const data = await response.json();

//         // TMDB 결과중 포스터 없는 영화 제외
//         let filtered = data.results.filter(movie => movie.poster_path);

//         // 임의로 박스오피스 관련 데이터 0 세팅 (데이터가 없으므로 추후 연동 필요)
//         filtered = filtered.map(movie => ({
//             ...movie,
//             rank: 0,
//             audiCnt: 0,
//             reviewCnt: 0,
//             likeCnt: 0
//         }));

//         currentMovies = filtered;

//         const sorted = sortMovies(currentMovies, currentSort);
//         displayResults(sorted);
//     } catch (error) {
//         console.error('영화 데이터를 가져오는 중 오류 발생:', error);
//     }
// }

// function displayResults(movies) {
//     const resultEl = document.getElementById('result');
//     resultEl.innerHTML = '';

//     if (movies.length === 0) {
//         resultEl.innerHTML = '<p>검색 결과가 없습니다.</p>';
//         return;
//     }

//     movies.forEach(movie => {
//         const poster = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

//         const card = document.createElement('div');
//         card.className = 'card mb-4';
//         card.style.cursor = 'pointer';

//         card.innerHTML = `
//         <div class="d-flex mb-3">
//             <div class="flex-shrink-0">
//                 <img src="${poster}" class="img-fluid" alt="${movie.title}" style="width: 150px; height: 225px; object-fit: cover;">
//             </div>
//             <div class="ms-3">
//                 <h4>${movie.title}</h4>
//                 <p class="card-text">개봉일: ${movie.release_date || '정보 없음'}</p>
//                 <p class="card-text">${movie.overview ? movie.overview.slice(0, 100) + '...' : '줄거리 없음'}</p>
//             </div>
//         </div>
//         `;

//         resultEl.appendChild(card);
//     });
// }

