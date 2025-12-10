import { useState } from "react";
import "./ManShoes.css";

const sortOptions = [
  "추천순",
  "판매순",
  "가격 낮은 순",
  "가격 높은 순",
  "최신 등록 순",
];

const products = [
  {
    id: 1,
    name: "남성 브리즈니트 러너",
    tags: "캐주얼, 러닝스타일, 클래식 스니커즈",
    price: "₩170,000",
    images: ["/img/shoes1.jpg", "/img/shoes1_2.jpg", "/img/shoes1_3.jpg"],
  },
  {
    id: 2,
    name: "남성 트리러너",
    tags: "가볍고 시원한, 라이프스타일",
    price: "₩150,000",
    images: ["/img/shoes2.jpg", "/img/shoes2_2.jpg"],
  },
  {
    id: 3,
    name: "남성 코지 슬립온",
    tags: "슬립온, 편안함, 라이프스타일",
    price: "₩120,000",
    images: ["/img/shoes3.jpg", "/img/shoes3_2.jpg"],
  },
];

const setting = [
  {
    name: "소재",
    selection: [
      "가볍고 시원한 tree",
      "면",
      "부드럽고 따듯한 wool",
      "캔버스",
      "플라스틱 제로 식물성 가죽",
    ],
  },
  {
    name: "기능",
    selection: [
      "비즈니스",
      "캐주얼",
      "가벼운 산책",
      "러닝",
      "발수",
      "슬립온",
      "슬리퍼",
      "클래식 스니커즈",
      "라이프스타일",
      "강한 접지력",
      "트레일러닝",
      "등산",
      "애슬레저",
    ],
  },
  {
    name: "모델",
    selection: [
      "대셔",
      "라운저",
      "러너",
      "스키퍼",
      "크루저",
      "트레일",
      "파이퍼",
      "플라이어",
    ],
  },
];

const sizes = [
  220, 230, 240, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305,
  310, 320,
];

const sorting = ["신제품", "라이프스타일", "세일", "슬립온"];

function ManShoes() {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("추천순");

  const toggleFilter = (value) => {
    setSelectedFilters((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const selectSize = (size) => {
    toggleFilter(size.toString());
  };

  const removeTag = (value) => {
    setSelectedFilters((prev) => prev.filter((v) => v !== value));
  };

  return (
    <div className="man-container">
      <div className="buttons">
        <button className="man active">남성</button>
        <button className="woman">여성</button>
      </div>

      <h2 className="title">남성 신발</h2>
      <p className="subtitle">
        Wool, Tree, Sugar 등 자연 소재로 만들어 놀랍도록 편안한 올버즈 제품을
        만나보세요. 우리는 편안한 신발의 기준을 만들어가고 있습니다.
      </p>

      <div className="sort-buttons">
        {sorting.map((sort, index) => (
          <button key={index} className="sort-btn">
            {sort}
          </button>
        ))}
      </div>
      <hr />
      {selectedFilters.length > 0 && (
        <div className="applied-filter-box">
          <p className="filter-label">적용된 필터</p>
          <div className="filter-tag-list">
            {selectedFilters.map((filter, idx) => (
              <div key={idx} className="filter-tag">
                {filter}
                <span className="remove-tag" onClick={() => removeTag(filter)}>
                  ✕
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="layout">
        <aside className="sidebar">
          <h3 className="filter-title">사이즈</h3>

          <div className="size-container">
            {sizes.map((size) => (
              <button
                key={size}
                className={`size-btn ${
                  selectedFilters.includes(size.toString()) ? "selected" : ""
                }`}
                onClick={() => selectSize(size)}
              >
                {size}
              </button>
            ))}
          </div>

          {setting.map((group, i) => (
            <div key={i} className="filter-group">
              <h3 className="filter-title">{group.name}</h3>
              {group.selection.map((item, idx) => (
                <label key={idx} className="filter-item">
                  <input
                    type="checkbox"
                    checked={selectedFilters.includes(item)}
                    onChange={() => toggleFilter(item)}
                  />
                  {item}
                </label>
              ))}
            </div>
          ))}
        </aside>

        {/* 오른쪽 제품 & 정렬 버튼 영역 */}
        <section className="products-area">
          <div className="top-right-filter">
            <button
              className="filter-icon"
              onClick={() => setSortOpen(!sortOpen)}
            >
              ☰
            </button>

            {sortOpen && (
              <div className="sort-popup">
                {sortOptions.map((opt, idx) => (
                  <label key={idx} className="sort-option">
                    <input
                      type="radio"
                      name="sort"
                      checked={selectedSort === opt}
                      onChange={() => setSelectedSort(opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="product-grid">
            {products.map((p) => (
              <div key={p.id} className="product-card">
                <img src={p.images[0]} alt={p.name} className="product-img" />

                <div className="color-thumbs">
                  {p.images.map((thumb, idx) => (
                    <img key={idx} src={thumb} className="thumb-img" />
                  ))}
                </div>

                <p className="product-name">{p.name}</p>
                <p className="product-tags">{p.tags}</p>
                <p className="product-price">{p.price}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default ManShoes;
