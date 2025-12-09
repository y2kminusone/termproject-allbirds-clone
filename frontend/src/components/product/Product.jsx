import React, { useEffect, useRef, useState } from "react";
import "./Product.css";

const shoes = [
  {
    shoe: "남성 울 러너 NZ",
    color: "내추럴 블랙 (내추럴 블랙)",
    sale_price: "\u20A978,000",
    price: "\u20A9170,000",
    size: [260, 265, 270, 275, 280],
  },
  {
    shoe: "여자 울 러너 NZ",
    color: "내추럴 블랙 (내추럴 블랙)",
    sale_price: "\u20A9119,000",
    price: "\u20A9170,000",
    size: [235, 240, 245, 250, 255],
  },
  {
    shoe: "남성 트리 러너 NZ",
    color: "내추럴 블랙 (내추럴 블랙)",
    sale_price: "\u20A9119,000",
    price: "\u20A9170,000",
    size: [260, 265, 270, 275, 280],
  },
  {
    shoe: "여성 울 대셔 미즐",
    color: "스토니 크림 (내추럴 화이트)",
    sale_price: "\u20A998,000",
    price: "\u20A9200,000",
    size: [240, 245, 250],
  },
  {
    shoe: "남성 캔버스 파이퍼",
    color: "뉴 블리자드 (블리자드)",
    sale_price: "\u20A978,000",
    price: "\u20A9150,000",
    size: [270, 275],
  },
  {
    shoe: "남성 울 러너 고",
    color: "다크 그레이 (라이트 그레이)",
    sale_price: "\u20A998,000",
    price: "\u20A9170,000",
    size: [250, 260, 270, 280],
  },
  {
    shoe: "남성 트리 대셔 2",
    color: "내추럴 블랙 (내추럴 블랙)",
    sale_price: "\u20A998,000",
    price: "\u20A9180,000",
    size: [270, 275, 280, 285],
  },
  {
    shoe: "남성 트리 대셔 2",
    color: "미디엄 그레이 (라이트 그레이)",
    sale_price: "\u20A998,000",
    price: "\u20A9180,000",
    size: [270, 275, 280, 285],
  },
  {
    shoe: "여성 울 러너",
    color: "내추럴 화이트 (크림)",
    sale_price: "\u20A978,000",
    price: "\u20A9150,000",
    size: [230, 240, 250, 260],
  },
  {
    shoe: "다크 울 러너 NZ",
    color: "다크 그레이 (라이트 그레이)",
    sale_price: "\u20A9119,000",
    price: "\u20A9170,000",
    size: [260, 265, 270, 275, 280],
  },
];

const CARD_GAP = 24;

function Product() {
  const listRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);

  useEffect(() => {
    const calculateMaxIndex = () => {
      const listEl = listRef.current;
      const firstCard = listEl?.querySelector(".product");
      if (!listEl || !firstCard) return;

      const containerWidth = listEl.getBoundingClientRect().width;
      const cardWidth = firstCard.getBoundingClientRect().width + CARD_GAP;
      const visibleCount = Math.max(1, Math.floor(containerWidth / cardWidth));

      setMaxIndex(Math.max(0, shoes.length - visibleCount));
    };

    calculateMaxIndex();
    window.addEventListener("resize", calculateMaxIndex);
    return () => window.removeEventListener("resize", calculateMaxIndex);
  }, []);

  useEffect(() => {
    setCurrentIndex((prev) => (prev > maxIndex ? maxIndex : prev));
  }, [maxIndex]);

  useEffect(() => {
    const listEl = listRef.current;
    const firstCard = listEl?.querySelector(".product");
    if (!listEl || !firstCard) return;

    const cardWidth = firstCard.getBoundingClientRect().width + CARD_GAP;
    listEl.scrollTo({
      left: currentIndex * cardWidth,
      behavior: "smooth",
    });
  }, [currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  return (
    <div className="popular">
      <h2>실시간 인기</h2>
      <button
        className="left-arrow"
        onClick={handlePrev}
        disabled={currentIndex === 0}
        aria-label="Previous products"
      >
        <img src="/img/left.png" alt="left-arrow" />
      </button>

      <div className="product-list" ref={listRef}>
        <div className="product-track">
          {shoes.map((item, index) => (
            <div className="product" key={index}>
              <div className="product-img">
                <div className="num">
                  <p>{index + 1}</p>
                </div>
                <img src="" alt="shoes-img" />
              </div>

              <p className="shoe">{item.shoe}</p>
              <p className="color">{item.color}</p>
              <p className="sale_price">{item.sale_price}</p>
              <p className="price">{item.price}</p>
              <p className="order-size">주문 가능 사이즈</p>
              <div className="size-boxes">
                {item.size.map((size, i) => (
                  <span className="size" key={i}>
                    {size}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        className="right-arrow"
        onClick={handleNext}
        disabled={currentIndex >= maxIndex}
        aria-label="Next products"
      >
        <img src="/img/right.png" alt="right-arrow" />
      </button>
    </div>
  );
}

export default Product;
