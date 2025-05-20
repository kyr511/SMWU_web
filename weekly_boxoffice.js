const API_KEY = "8f30f3cd89878ffb75c8b9a4ca3c7d31";
const TMDB_KEY = "c195cf58dc67be7d7345c99c5a852741";

const today = new Date();
const dayOfWeek = today.getDay();
today.setDate(today.getDate() - dayOfWeek - 7);
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0'); // 01, 02와 같이 앞에 0을 채웁니다.
const day = String(today.getDate()).padStart(2, '0'); // 01, 02와 같이 앞에 0을 채웁니다.

const targetDt = `${year}${month}${day}`;

//영화상세정보 api
const url = `https://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchWeeklyBoxOfficeList.json?key=${API_KEY}&targetDt=${targetDt}&weekGb=0`;

async function getPoster(title) {//포스터이미지 링크로 가져오기
    //영화포스터이미지 api
  const tmdbURL = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(title)}&language=ko`;
  const res = await fetch(tmdbURL);
  const data = await res.json();
  if (data.results && data.results[0] && data.results[0].poster_path) {
    return `https://image.tmdb.org/t/p/w500${data.results[0].poster_path}`;
  }
  return null;
}

function getResponsiveGroupSize() {  //메인 화면에 노출할 영화 개수수
    const width = window.innerWidth;
    if (width >= 1200) return 5;   // 데스크탑
    if (width >= 768) return 3;    // 태블릿
    return 2;                      // 모바일
}

//박스오피스 캐러셀 슬라이드에 넣기
async function loadCarouselBoxOffice() {
    const res = await fetch(url);
    const data = await res.json();
    const movies = data.boxOfficeResult.weeklyBoxOfficeList;

    document.getElementById("movierank").innerText = `주간 박스오피스`;

    const carouselInner = document.querySelector(".carousel-inner"); //클래스지정정
    const indicators = document.querySelector(".carousel-indicators");
    carouselInner.innerHTML = ""; //이건 왜 있는거지지
    indicators.innerHTML = "";

    const groupSize = getResponsiveGroupSize();
    const groups = [];

    for (let i=0; i< movies.length; i+=groupSize){ //5개씩끊기
        groups.push(movies.slice(i,i+groupSize));
    }

    for (let i = 0; i < groups.length; i++) {
        const group = groups[i];

        const div = document.createElement("div");
        div.className = `carousel-item${ i===0 ? " active" : ""}`;//첫번째 요소면 active클래스
        div.setAttribute("data-bs-interval", "5000");

        const ul = document.createElement("ul"); //css 설정-> css파일에서 걍 하면안되나/근데 이거 다른 ul에도 같이 적용되는건가가
        ul.style.listStyle = "none"; 
        ul.style.display = "flex";
        ul.style.justifyContent = "center";
        ul.style.gap = "10px";
        ul.style.flexWrap = "wrap";
        ul.style.padding = "0";

        for (const movie of group) {
            const li = document.createElement("li");
            li.style.textAlign = "center"; //텍스트정렬?
            li.style.width = "180px";

            const poster = await getPoster(movie.movieNm);
            li.innerHTML =`
                <div>
                    <img src="${poster || 'https://via.placeholder.com/150x220?text=No+Image'}" alt="${movie.movieNm}" class="d-block w-100" style="height: 220px; object-fit: cover; border-radius: 5px;">
                    <p style="font-size: 0.9rem; margin-top: 5px;"><strong>${movie.rank}위</strong> - ${movie.movieNm}</p>
                </div>
                `;

                ul.appendChild(li);
        }

        div.appendChild(ul);
        carouselInner.appendChild(div);

        const btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("data-bs-target", "#carouselExampleDark");
    btn.setAttribute("data-bs-slide-to", i.toString());
    if (i === 0) {
      btn.classList.add("active");
      btn.setAttribute("aria-current", "true");
    }
    btn.setAttribute("aria-label", `Slide ${i + 1}`);
    indicators.appendChild(btn);
  }
};

loadCarouselBoxOffice();

let resizeTimer;

window.addEventListener("resize", () => {
    clearTimeout(resizeTimer); // 타이머 초기화
    resizeTimer = setTimeout(() => {
        loadCarouselBoxOffice(); // 마지막 resize 이벤트에서만 실행
    }, 500); // 0.5초 후 실행
});