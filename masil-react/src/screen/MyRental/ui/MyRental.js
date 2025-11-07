import { useMyRental } from "../useMyRental";
import "css/RentalItem.css";

const RentalItem = () => {
  const {
    showSoldOnly,
    currentPage,
    totalPages,
    currentItems,
    handleFilterChange,
    filterAddress,
    goToPage,
  } = useMyRental();
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
