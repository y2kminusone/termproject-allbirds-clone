import { useState } from "react";
import "./DetailProducts.css";

function DetailProducts({ product, onChangeMainImage, onAddToCart }) {
  const [selectedSize, setSelectedSize] = useState(null);
  // const navigate = useNavigate();
  const handleAdd = () => {
    onAddToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      image: product.images[0],
    });
  };

  return (
    <div className="detail-page">
      <h1>{product.name}</h1>
      <h2>₩{product.price.toLocaleString()}</h2>

      <p>{product.description}</p>
      <div className="thumbnail-list">
        {product.variants?.map((img, index) => (
          <img
            key={index}
            src={img}
            className="thumbnail"
            onClick={() => onChangeMainImage(img)}
            // onClick={()=>navigate(`/product/${item.id}`)}
          />
        ))}
      </div>

      <div className="gender">
        <button>남성</button>
        <button>여성</button>
      </div>

      <div className="size-selection">
        <h3>사이즈</h3>
        <div className="size-list">
          {product.sizes.map((s) => (
            <button
              key={s.size}
              disabled={!s.stock}
              onClick={() => setSelectedSize(s.size)}
              className={selectedSize === s.size ? "selected" : ""}
            >
              {s.size}
            </button>
          ))}
        </div>
      </div>

      {selectedSize && (
        <button className="cart" onClick={handleAdd}>
          장바구니 담기 ₩{product.price.toLocaleString()}
        </button>
      )}
    </div>
  );
}

export default DetailProducts;
