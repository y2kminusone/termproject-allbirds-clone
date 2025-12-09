import { useState } from "react";
import "./Accodian.css";

export const accodian = [
  {
    name: "상세정보",
    explanation: [
      "올 크루저 컬렉션은 올버즈 최초로 재활용 이탈리아산 펠트올을 사용해 제작되었습니다.",
      "올 크루저는 올버즈 역사상 가장 화려한 컬렉션입니다. 다채로운 컬러 활용으로 나만의 스타일을 완성해보세요.",
      "제조국:베트남",
    ],
  },
  {
    name: "지속 가능성",
    explanation: [
      "올버즈는 Climate Neutral에서 탄소 중립 기업 인증을 획득했으며, 탄소 저감 프로젝트 펀딩을 비롯한 지속 가능한 활동을 통해 탄소 중립을 실현합니다.",
      "지속 가능한 소재",
      "이탈리아산 펠트 울 소재 어퍼",
      "사탕수수 기반의 그린 EVA를 사용한 SweetFoam 미드솔",
      "프라스틱 페트병을 재활용한 신발 끈",
      "메모리폼과 올 혼방 소재로 만든 친환경 인솔",
    ],
  },
  {
    name: "케어 방법",
    explanation: [
      "신발 끈을 신발에서 분리해주세요.",
      "깔창을 신발에서 분리하여 신발과 같이 세탁망(베개 커버도 가능)에 넣어주세요.",
      "세탁기 사용 시 찬물/울 코스로 준성세제를 적당량 첨가하여 세탁해 주시기 바랍니다.",
      "세탁 후에 남은 물기는 털어주시고 자연 건조해 주세요.",
      "1-2회 착용 후 원래 모양으로 곧 돌아오니 걱정하지 않으셔도 됩니다.",
      "더 새로운 경험을 원하시면 새로운 인솔과 신발 끈으로 교체하세요.",
      "팁: 건조기 사용은 피해주세요.",
    ],
  },
  {
    name: "배송 & 반품",
    explanation: [
      "전체품 5만원 이상 구입시 무료 배송",
      "올멤버스: 조건없는 무료 배송 & 30일 내 무료 교환/환불",
      "비회원: 7일 내 미착용 시 교환/환불",
      "반품: 물류센터 도착 후 5 영업일 내 환불",
      "교환: 동일 가격 상품으로만 교환 가능",
    ],
  },
];

function Accodian({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div className="accordion">
      {items.map((item, i) => (
        <div key={i} className="accordion-item">
          <div className="accordion-header" onClick={() => toggle(i)}>
            <span>{item.name}</span>
            <span className="icon">{openIndex === i ? "-" : "+"}</span>
          </div>

          {openIndex === i && (
            <div className="accordion-content">
              {item.explanation.map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Accodian;
