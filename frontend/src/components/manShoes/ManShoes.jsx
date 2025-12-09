import "./ManShoes.css";
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
  return (
    <div>
      <div class="genderSelection">
        <button>남성</button>
        <button>여성</button>
      </div>
      <h2>남성 신발</h2>
      <h3>
        Wool, Tree, Sugar 등 자연 소재로 만들어 놀랍도록 편안한 올버즈 제품을
        만나보세요. 우리는 편안한 신발의 기준을 만들어가고 있습니다.
      </h3>
      {sorting.map((sort, index) => (
        <button key={index}>{sort}</button>
      ))}
      <div className="size-container">
        {sizes.map((size) => (
          <button key={size} className="size-btn">
            {size}
          </button>
        ))}
      </div>
      {setting.map((group, i) => (
        <div key={i} className="filter-group">
          <h3>{group.name}</h3>
          {group.selection.map((item, idx) => (
            <label key={idx} className="filter-item">
              <input type="checkbox" />
              {item}
            </label>
          ))}
        </div>
      ))}
    </div>
  );
}

export default ManShoes;
