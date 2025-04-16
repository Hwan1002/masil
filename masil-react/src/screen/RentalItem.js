import React, { useState, useEffect, useContext } from "react";
import "../css/RentalItem.css";
import { useNavigate } from "react-router-dom";
import { ProjectContext } from "../context/MasilContext";
import axios from "axios";


const RentalItem = () => {
  const navigate = useNavigate();
  const [showSoldOnly, setShowSoldOnly] = useState(false);
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const { loginSuccess } = useContext(ProjectContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:9090/post`);
        if (response) setItems(response.data);
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      }
    };
    fetchData();
  }, []);

  const filteredItems = showSoldOnly
    ? items.filter((item) => item.isSold)
    : items;

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (event) => {
    const { name, checked } = event.target;
    if (name === "sold") {
      setShowSoldOnly(checked);
      setCurrentPage(1);
    }
  };

  const goToPage = (pageNum) => {
    setCurrentPage(pageNum);
  };

  return (
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
        </div>
      </aside>

      {/* 콘텐츠 섹션 */}
      <div className="content-section">
        <div className="rental-container">
          {currentItems.map((item) => (
            <div className="rental-item" key={item.postIdx}>
              {item.isSold && <span className="sold-badge">판매 완료</span>}
              {/* <a href={`/post/item/${item.postIdx}`}>
                <img
                  src={`http://localhost:9090${item.postPhotoPaths}`}
                  alt={item.postIdx}
                  className="rental-image"
                />
              </a> */}
              {item.postPhotoPaths && item.postPhotoPaths.map((path, index) => (
                <a href={`/post/item/${item.postIdx}`} key={index}>
                  <img
                    src={`http://localhost:9090${path}`}
                    alt={`${item.postIdx}-${index}`}
                    className="rental-image"
                  />
                </a>
              ))}
              <a href={`/post/item/${item.postIdx}`} className="rental-title">
                {item.postTitle}
              </a>
              <p className="rental-price">
                {item.postPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원
              </p>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="pagination-wrapper">
          <div className="pagination">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              이전
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index + 1)}
                className={currentPage === index + 1 ? "active" : ""}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              다음
            </button>
          </div>
        </div>
      </div>

      {/* 등록 버튼 */}
      {loginSuccess && (
        <button onClick={() => navigate("/postRegist")} className="fixed-button">
          +
        </button>
      )}
    </div>
  );
};

export default RentalItem;
