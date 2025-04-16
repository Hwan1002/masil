import React, { useState, useEffect } from "react";
import "../css/RentalItem.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RentalItem = () => {
  const navigate = useNavigate();
  const [showSoldOnly, setShowSoldOnly] = useState(false);
  const [item, setItem] = useState([]);

  // 렌탈 아이템 데이터(예제)
  useEffect(() => {
    const test = async (e) => {
      try {
        const response = await axios.get(`http://localhost:9090/post`);
        if (response) {
          setItem(response.data);
        }
      } catch (error) {}
    };
    test();
  }, []);

  const handleFilterChange = (event) => {
    const { name, checked } = event.target;
    if (name === "sold") {
      setShowSoldOnly(checked);
    }
  };

  return (
    <div className="rentalItem-container">
      <div className="page-container">
        {/* 필터 섹션 */}
        <aside className="filter-section">
          <h3>필터</h3>
          <div className="filter-options">
            <label>
              <input
                type="checkbox"
                name="sold"
                checked={showSoldOnly}
                onChange={handleFilterChange}
              />
              판매 완료만 보기
            </label>
            {/* 추가 필터 옵션 */}
          </div>
        </aside>

        {/* 렌탈 아이템 섹션 */}
        <div className="rental-container">
          {item.map((item) => (
            <a
              href={`/post/item/${item.postIdx}`}
              key={item.postIdx}
              className="rental-item-link"
            >
              <div className="rental-item">
                {item.isSold && <span className="sold-badge">판매 완료</span>}
                <img
                  src={`http://localhost:9090${item.postPhotoPaths}`}
                  alt={item.postIdx}
                  className="rental-image"
                />
                <p className="rental-title">{item.postTitle}</p>
                <p className="rental-price">
                  {item.postPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  원
                </p>
              </div>
            </a>
          ))}
        </div>
        <button
          onClick={() => navigate("/postRegist")}
          className="fixed-button"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default RentalItem;
