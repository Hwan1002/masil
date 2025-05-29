import React, { useState, useEffect, useContext } from "react";
import { ProjectContext, Api } from "../context/MasilContext";
import { useNavigate } from "react-router-dom";
import useModal from "../context/useModal";
import Modal from "../component/Modal";
import useEditStore from "../shared/useEditStore";
import "../css/RentalItem.css";

const RentalItem = () => {
  const [items, setItems] = useState([]);

  const [showSoldOnly, setShowSoldOnly] = useState(false);
  const [showNearOnly, setShowNearOnly] = useState(false);
  const [showAllPosts, setShowAllPosts] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [addressKeyword, setAddressKeyword] = useState("");

  const { setEdit } = useEditStore();

  const { loginSuccess } = useContext(ProjectContext);

  const navigate = useNavigate();

  const {
    isModalOpen,
    modalTitle,
    modalMessage,
    modalActions,
    openModal,
    closeModal,
  } = useModal();

  const itemsPerPage = 15;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api.get("/post");
        if (response) setItems(response.data);
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

  const handleFilterChange = async (event) => {
    const { name, checked } = event.target;
    // 모든 체크박스 상태를 먼저 false로 설정
    setShowSoldOnly(false);
    setShowNearOnly(false);
    setShowAllPosts(false);

    if (name === "sold") {
      setShowSoldOnly(checked);
    } else if (name === "near") {
      setShowNearOnly(checked);
      if (checked) {
        try {
          const response = await Api.get("/post/nearbyPost");
          if (response) setItems(response.data);
          console.log("근처 게시물", response.data);
        } catch (error) {
          console.error("근처 게시물 불러오기 실패:", error);
        }
      } else {
        //체크 해제시 전체 게시물 다시 불러오기
        try {
          const response = await Api.get("/post");
          setShowAllPosts(true);
          if (response) setItems(response.data);
        } catch (error) {
          console.error("데이터 불러오기 실패:", error);
        }
      }
    } else if (name === "All") {
      setShowAllPosts(checked);
      try {
        const response = await Api.get("/post");
        if (response) setItems(response.data);
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      }
    }
    setCurrentPage(1);
  };

  const filterAddress = (e) => {
    setAddressKeyword(e.target.value.toLowerCase());
  };

  const goToPage = (pageNum) => {
    setCurrentPage(pageNum);
  };

  const handleItemClick = (e, item) => {
    e.preventDefault();
    if (loginSuccess) {
      navigate(`/post/item/${item.postIdx}`);
    } else {
      openModal({
        message: "로그인이 필요한 서비스입니다.",
        actions: [
          {
            label: "확인",
            onClick: () => {
              closeModal();
              navigate("/");
            },
          },
        ],
      });
    }
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
              placeholder="구 이름으로 검색 (예: 부평구)"
              onChange={filterAddress}
              maxLength={5}
            />
          </div>
          <div className="filter-layout">
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
            <div className="checkbox-container">
              <input
                type="checkbox"
                name="near"
                checked={showNearOnly}
                onChange={handleFilterChange}
                className="custom-checkbox"
              />
              <label>내 근처 게시물 보기</label>
            </div>
            <div className="checkbox-container">
              <input
                type="checkbox"
                name="All"
                checked={showAllPosts}
                onChange={handleFilterChange}
                className="custom-checkbox"
              />
              <label>전체 게시물 보기</label>
            </div>
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
              onClick={(e) => handleItemClick(e, item)}
            >
              {item.isSold && <span className="sold-badge">대여 완료</span>}
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

      {/* 등록 버튼 */}
      {loginSuccess && (
        <button
          onClick={() => {
            setEdit(false);
            navigate("/postRegist");
          }}
          className="fixed-button"
        >
          +
        </button>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
        content={modalMessage}
        actions={modalActions}
      />
    </div>
  );
};

export default RentalItem;
