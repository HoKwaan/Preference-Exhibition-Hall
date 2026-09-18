// 카드 내용은 각 HTML에서 직접 수정합니다. 데이터 파일이나 서버가 필요하지 않습니다.
const sharedList = document.querySelector("#shared-recommendations");
if (sharedList && sharedList.querySelector(".site-card")) {
  document.querySelector(".shared-empty").hidden = true;
}

const collection = document.querySelector(".collection");
if (collection) {
  const search = collection.querySelector("#site-search");
  const cards = Array.from(collection.querySelectorAll(".site-card"));
  const status = collection.querySelector(".result-count");
  const empty = collection.querySelector(".empty-state");
  const randomButton = collection.querySelector(".random-button");
  collection.querySelector(".collection-tools").hidden = false;

  // 띄어쓰기와 대소문자를 정리하고 사이트 이름 또는 태그에서 검색합니다.
  function normalize(text) {
    return text.normalize("NFKC").toLocaleLowerCase("ko").replace(/\s+/g, "");
  }
  function filterCards() {
    const query = normalize(search.value);
    cards.forEach((card) => {
      const name = card.querySelector(".site-name").textContent;
      const tags = card.querySelector(".tags").textContent;
      card.hidden = !normalize(name + " " + tags).includes(query);
      card.classList.remove("is-picked");
    });
    const count = cards.filter((card) => !card.hidden).length;
    empty.hidden = count !== 0;
    randomButton.disabled = count === 0;
    status.textContent = query ? `검색 결과 ${count}개 / 전체 ${cards.length}개` : `전체 ${cards.length}개의 발견`;
  }
  search.addEventListener("input", filterCards);
  collection.querySelector(".reset-search").addEventListener("click", () => {
    search.value = "";
    filterCards();
    search.focus();
  });
  // 현재 검색 결과 안에서 추천합니다. 외부 사이트를 자동으로 열지는 않습니다.
  randomButton.addEventListener("click", () => {
    const visible = cards.filter((card) => !card.hidden);
    if (!visible.length) return;
    cards.forEach((card) => card.classList.remove("is-picked"));
    const chosen = visible[Math.floor(Math.random() * visible.length)];
    chosen.classList.add("is-picked");
    status.textContent = `우연한 발견: ${chosen.querySelector(".site-name").textContent}. 현재 ${visible.length}개 중 추천했습니다.`;
    chosen.focus({ preventScroll: true });
    chosen.scrollIntoView({ behavior: "auto", block: "nearest" });
  });
  filterCards();
}

