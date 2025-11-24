import React from "react";
import "./Product.css";

const shoes = [
  {
    shoe: "남성 트리 러너",
    color: "제트 블랙 (블랙)",
    sale_price: "\u20A978,000",
    price: "\u20A9150,000",
    size: [290],
  },
  {
    shoe: "남성 울 러너 NZ",
    color: "내추럴 블랙 (내추럴 블랙)",
    sale_price: "\u20A9119,000",
    price: "\u20A9170,000",
    size: [260, 265, 270, 275, 280],
  },
  {
    shoe: "여성 트리 러너",
    color: "제트 블랙 (블랙)",
    sale_price: "\u20A978,000",
    price: "\u20A9150,000",
    size: [230],
  },
  {
    shoe: "남성 울 러너",
    color: "내추럴 그레이 (라이트 그레이)",
    sale_price: "\u20A978,000",
    price: "\u20A9150,000",
    size: [260, 320],
  },
  {
    shoe: "여성 울 러너 NZ",
    color: "내추럴 블랙 (내추럴 블랙)",
    sale_price: "\u20A9119,000",
    price: "\u20A9170,000",
    size: [230, 235, 240, 245, 250],
  },
  {
    shoe: "남성 울 대셔 미즐",
    color: "스토니 크림 (내추럴 화이트)",
    sale_price: "\u20A998,000",
    price: "\u20A9200,000",
    size: [275, 290],
  },
  {
    shoe: "여성 울 러너",
    color: "내추럴 화이트 (크림)",
    sale_price: "\u20A978,000",
    price: "\u20A9150,000",
    size: [230, 240, 250, 260],
  },
  {
    shoe: "남성 트리 러너",
    color: "미스트 (화이트)",
    sale_price: "\u20A978,000",
    price: "\u20A9150,000",
    size: [260, 270, 280, 290],
  },
  {
    shoe: "남성 트리 대셔 2",
    color: "내추럴 블랙 (내추럴 블랙)",
    sale_price: "\u20A998,000",
    price: "\u20A9180,000",
    size: [270, 275, 280, 285],
  },
  {
    shoe: "남성 트리 러너 NZ",
    color: "내추럴 블랙 (내추럴 블랙)",
    sale_price: "\u20A9119,000",
    price: "\u20A9170,000",
    size: [260, 265, 270, 275, 280],
  },
];
function Product() {
  return (
    <div className="popular">
      <button className="left-arrow">
        <img src="/img/left.png" alt="left-arrow" />
      </button>
      <div className="product-list">
        {shoes.map((item, index) => (
          <div className="product" key={index}>
            <div className="product-img">
              <div className="num">
                <p>{index + 1}</p>
              </div>
              <img src="" alt="shoes-img"></img>
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
      <button className="right-arrow">
        <img src="/img/right.png" alt="right-arrow" />
      </button>
    </div>
  );
}

export default Product;
