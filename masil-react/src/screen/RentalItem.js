import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ProjectContext, Api } from "../context/MasilContext";
import "../css/RentalItem.css";

const RentalItem = () => {
  const navigate = useNavigate();
  const [showSoldOnly, setShowSoldOnly] = useState(false);
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [addressKeyword, setAddressKeyword] = useState("");
  const itemsPerPage = 15;

  const { loginSuccess } = useContext(ProjectContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api.get(`/post`);
        console.log(response.data);

        if (response) setItems(response.data);
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      }
    };
    fetchData();
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesSold = showSoldOnly ? item.isSold : true;
    const matchesAddress = (item.userAddress || "")
      .toLowerCase()
      .includes(addressKeyword);
    return matchesSold && matchesAddress;
  });


  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleFilterChange = (event) => {
    const { name, checked } = event.target;
    if (name === "sold") {
      setShowSoldOnly(checked);
      setCurrentPage(1);
    }
  };

  const filterAddress = (e) => {
    setAddressKeyword(e.target.value.toLowerCase());
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
          <input
            type="text"
            className="filter-text"
            placeholder="구 이름으로 검색 (예: 부평구)"
            onChange={filterAddress}
            maxLength={5}
          />
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
          {currentItems.length > 0 ? (
            currentItems.map((item, idx) => (
              <a href={`/post/item/${item.postIdx}`} className="rental-item">
                {item.isSold && <span className="sold-badge">판매 완료</span>}

                <div className="rental-image-wrapper">
                  {item.postPhotoPaths && item.postPhotoPaths.length > 0 && (
                    <img
                      src={`http://localhost:9090/${item.postPhotoPaths[0]}`}
                      alt={item.postTitle}
                      className="rental-image"
                    />
                  )}
                </div>

                <div className="rental-title">{item.postTitle}</div>
                <div className="rental-price">
                  {item.postPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  원
                </div>
                <div className="rental-address">{item.userAddress}</div>
              </a>
            ))
          ) : (
            <div>등록된 게시물이 없습니다.</div>
          )}
          {/* {currentItems.map((item) => (
            <a href={`/post/item/${item.postIdx}`} className="rental-item">
              {item.isSold && <span className="sold-badge">판매 완료</span>}

              <div className="rental-image-wrapper">
                {item.postPhotoPaths && item.postPhotoPaths.length > 0 && (
                  <img
                    src={`http://localhost:9090${item.postPhotoPaths[0]}`}
                    alt={item.postTitle}
                    className="rental-image"
                  />
                )}
              </div>

              <div className="rental-title">{item.postTitle}</div>
              <div className="rental-price">
                {item.postPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                원
              </div>
              <div className="rental-address">{item.userAddress}</div>
            </a>
          ))} */}
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
        <button
          onClick={() => navigate("/postRegist")}
          className="fixed-button"
        >
          +
        </button>
      )}
    </div>
  );
};

export default RentalItem;
