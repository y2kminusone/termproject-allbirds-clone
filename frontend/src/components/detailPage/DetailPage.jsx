import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Accodian, { accodian } from "./Accodian";
import DetailProducts from "./DetailProducts";
import "./DetailPage.css";

const mockProduct = [
  {
    id: 1,
    name: "올버즈 예시 1",
    description: "설명",
    price: 10000,
    images: ["/img/logo.png"],
    sizes: [
      { size: 100, stock: 1 },
      { size: 200, stock: 2 },
    ],
  },
  {
    id: 2,
    name: "올버즈 슬리퍼",
    description:
      "올버즈 슬리퍼는 집 안에서의 여유부터 가벼운 외출까지, 구름같은 쿠셔닝으로 일상을 부드럽게 이어줍니다.",
    price: 80000,
    images: [
      "/img/cart.png",
      "/img/left.png",
      "/img/newSlide.jpg",
      "/img/right.png",
      "/img/search.png",
    ],
    sizes: [
      { size: 220, stock: 0 },
      { size: 230, stock: 10 },
      { size: 240, stock: 3 },
      { size: 250, stock: 6 },
      { size: 260, stock: 0 },
      { size: 270, stock: 4 },
      { size: 280, stock: 5 },
    ],
  },
];

function DetailPage({ productId, onAddToCart }) {
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    const idNum = Number(productId) || 1;
    const data = mockProduct.find((p) => p.id === idNum);
    if (data) {
      setProduct(data);
      setMainImage(data.images[0]);
    }
    // const { productId } = useParams();
    //  const res = await fetch(`/api/products/${productId}`);
    // const data = await res.json();
    // setProduct(data);
    // setMainImage(data.images[0]);
    //Api서버 완성 시에 교체, 현재 예시로 넣어둔 것으로 적용되게 해둠.
  }, [productId]);

  if (!product) return <div>Loading..</div>;
  return (
    <div className="detail-wrapper">
      <div className="main">
        <img className="main-image" src={mainImage} alt="main" />

        <div className="accodian-section">
          <Accodian items={accodian} />
        </div>
      </div>

      <div className="detail">
        <DetailProducts
          product={product}
          onChangeMainImage={setMainImage}
          onAddToCart={onAddToCart}
        />
        <hr className="divide" />
        <button className="buy">구매하기</button>
      </div>
    </div>
  );
}

export default DetailPage;
