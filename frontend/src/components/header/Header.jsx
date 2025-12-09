import React from "react";
import "./Header.css";

function Header() {
  return (
    <div className="header">
      <header>
        <button className="logo">
          <img src="/img/logo.png" alt="logo" />
        </button>

        <div className="header-menu">
          <ul>
            <li>
              <a href="#">슈퍼 블랙 프라이데이</a>
            </li>
            <li>
              <a href="#">매장 위치</a>
            </li>
            <li>
              <a href="#">지속 가능성</a>
              <div className="dropdown">
                <div className="column">
                  <ul>
                    <li>
                      <a href="#">브랜드 스토리</a>
                    </li>
                    <li>
                      <a href="#">지속 가능성</a>
                    </li>
                    <li>
                      <a href="#">소재</a>
                    </li>
                    <li>
                      <a href="#">수선</a>
                    </li>
                  </ul>
                </div>
                <div className="column">
                  <h3>스토리</h3>
                  <ul>
                    <li>
                      <a href="#">올멤버스</a>
                    </li>
                    <li>
                      <a href="#">올버즈 앰배서더</a>
                    </li>
                    <li>
                      <a href="#">ReRun</a>
                    </li>
                    <li>
                      <a href="#">신발 관리 방법</a>
                    </li>
                  </ul>
                </div>

                <div className="column">
                  <h3>소식</h3>
                  <ul>
                    <li>
                      <a href="#">캠페인</a>
                    </li>
                    <li>
                      <a href="#">뉴스</a>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div className="header-image">
          <button className="search">
            <img src="/img/search.png" alt="search" />
          </button>
          <button className="user">
            <img src="/img/user.png" alt="user" />
          </button>
          <button className="shopping-cart">
            <img src="/img/cart.png" alt="cart" />
          </button>
        </div>
      </header>
    </div>
  );
}

export default Header;
