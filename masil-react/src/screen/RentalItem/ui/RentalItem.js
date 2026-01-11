import { useRentalItem } from "../useRentalItem";
import Modal from "component/Modal";
import "css/RentalItem.css";

const RentalItem = () => {
  const {
    showSoldOnly,
    showNearOnly,
    showAllPosts,
    currentPage,
    totalPages,
    currentItems,
    loginSuccess,
    setEdit,
    isModalOpen,
    modalTitle,
    modalMessage,
    modalActions,
    navigate,
    closeModal,
    filterAddress,
    goToPage,
    handleItemClick,
    handleFilterChange,
  } = useRentalItem();
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
        <div className="pagination-wrapper" style={{ display: window.innerWidth <= 600 ? 'none' : 'block' }}>
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
          className="fixed-button"
          onClick={() => {
            setEdit(false);
            navigate("/postRegist");
          }}
        >
          <span>+</span>
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
