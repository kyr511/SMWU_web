const KAKAO_API_KEY = '5ff0b1187a7ca2ad946b92fdce92aced';

async function fetchBooks(query = "추천 도서") {
  const url = `https://dapi.kakao.com/v3/search/book?&query=${encodeURIComponent(query)}&size=10`;

  const res = await fetch(url, {
    headers: {
      Authorization: `KakaoAK ${KAKAO_API_KEY}`
    }
  });

  const data = await res.json();
  let i =1;

  return data.documents.map(book => ({
    title: book.title,
    image: book.thumbnail || "https://via.placeholder.com/150x220?text=No+Image",//표지이미지
    rank: i++
  }));
}

async function loadCarouselBookRank() {
    document.getElementById("bookrank").innerText = `주간 추천 도서`;
    const books = await fetchBooks(); //추천도서로 검색

    const carouselInner = document.querySelector("#carousel-2-inner");
    const indicators = document.querySelector("#carousel-2-indicators");
    carouselInner.innerHTML = "";
    indicators.innerHTML = "";

    const groupSize = getResponsiveGroupSize();
    const groups = [];

    for (let i=0; i< books.length; i+=groupSize){
        groups.push(books.slice(i,i+groupSize));
    }

    for (let i = 0; i<groups.length; i++) {
        const group = groups[i];

        const div = document.createElement("div");
        div.className = `carousel-item${ i===0 ? " active" : ""}`;//첫번째 요소면 active클래스
        div.setAttribute("data-bs-interval", "5000");

        const ul = document.createElement("ul"); 
        ul.style.display = "flex";
        ul.style.justifyContent = "center";
        ul.style.listStyle = "none";
        ul.style.gap = "10px";
        ul.style.flexWrap = "wrap";
        ul.style.padding = "0";

        for (const book of group) {
          const li = document.createElement("li");
          li.style.textAlign = "center"; //텍스트정렬
          li.style.width = "180px";
          li.style.cursor = 'pointer';
          li.addEventListener('click', () => {
          window.location.href = `book-detail.html?title=${encodeURIComponent(book.title)}`;
          });

          li.innerHTML =`
            <div>
                <img src="${book.image || 'https://via.placeholder.com/150x220?text=No+Image'}" alt="${book.title}" class="d-block w-100" style="height: 220px; object-fit: cover; border-radius: 5px;">
                <p style="font-size: 0.9rem; margin-top: 5px;"><strong>${book.rank || "?"}위</strong> - ${book.title}</p>
            </div>
            `;

          ul.appendChild(li);
        }
        div.appendChild(ul);
        carouselInner.appendChild(div);

        const btn = document.createElement("button");
        btn.type = "button";
        btn.setAttribute("data-bs-target", "#carousel-2");
        btn.setAttribute("data-bs-slide-to", i.toString());
        if (i === 0) {
        btn.classList.add("active");
        btn.setAttribute("aria-current", "true");
        }
        btn.setAttribute("aria-label", `Slide ${i + 1}`);
        indicators.appendChild(btn);
    }
};

loadCarouselBookRank();