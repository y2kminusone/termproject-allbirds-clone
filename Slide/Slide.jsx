import React, { useState, useEffect } from "react";
import "./Slide.css";

const slides = [
  {
    img: "/img/newSlide.png",
    title: "슈퍼 블랙 프라이데이 세일",
    desc: "세상에서 가장 편한 신발, 올버지 | ~50% OFF",
  },
];

function Slide() {
  return (
    <div className="slide">
      <img src={slides[0].img} alt="slide-img"></img>
      <div className="slide-text">
        <h2>{slides[0].title}</h2>
        <p>{slides[0].desc}</p>
        <div className="buttons">
          <button className="man-sales">남성 세일</button>
          <button className="woman-sales">여성 세일</button>
        </div>
      </div>
    </div>
  );
}

export default Slide;
