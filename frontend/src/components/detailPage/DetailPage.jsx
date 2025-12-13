import { useEffect, useState } from "react";
import DetailProducts from "./DetailProducts";
import Accodian, { accodian } from "./Accodian";
import "./DetailPage.css";

function DetailPage({ productId, onAddToCart }) {
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    fetch(`/api/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setMainImage(data.images?.[0]?.imageUrl ?? "");
      })
      .catch(console.error);
  }, [productId]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="detail-wrapper">
      <div className="main">
        <img src={mainImage} className="main-image" />
        <Accodian items={accodian} />
      </div>

      <DetailProducts product={product} onAddToCart={onAddToCart} />
    </div>
  );
}

export default DetailPage;
