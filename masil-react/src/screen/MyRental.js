import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import useEditStore from "../shared/useEditStore";
import { Api, ProjectContext } from "../context/MasilContext";
import "../css/RentalItem.css";

const RentalItem = () => {
  const [items, setItems] = useState([]);
  const [showSoldOnly, setShowSoldOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [addressKeyword, setAddressKeyword] = useState("");

  const navigate = useNavigate();
  const { setEdit } = useEditStore();

  const itemsPerPage = 15;

  const { loginSuccess } = useContext(ProjectContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api.get(`/post/myPost`);
        if (response) setItems(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      }
    };
    fetchData();
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesSold = showSoldOnly ? item.isSold : true;
    const matchesAddress = (item.address || "")
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
      <aside className="filter-section">
        <div className="flex flex-col gap-y-3">
          <h3 className="text-lg font-bold">검색 필터</h3>
          <div className="filter-options">
            <input
              type="text"
              className="search-input"
              placeholder="동 이름으로 검색 (예: 부평동)"
              onChange={filterAddress}
              maxLength={5}
            />
          </div>

          <div className="checkbox-container">
            <input
              type="checkbox"
              name="sold"
              checked={showSoldOnly}
              onChange={handleFilterChange}
              className="custom-checkbox"
            />
            <label>판매 완료만 보기</label>
          </div>
        </div>
      </aside>
      {/* 콘텐츠 섹션 */}
      <div className="content-section">
        <div className="rental-container">
          {currentItems.map((item) => (
            <a
              href={`/post/item/${item.postIdx}`}
              className="rental-item"
              key={item.postIdx}
            >
              {item.isSold && <span className="sold-badge">대여 완료</span>}
              {console.log("이미지 경로:", item.postPhotoPaths[0])}
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
                {item.postPrice ? item.postPrice.toLocaleString() : "error"}원
              </div>
              <div className="rental-address">{item.address}</div>
            </a>
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
    </div>
  );
};

export default RentalItem;
