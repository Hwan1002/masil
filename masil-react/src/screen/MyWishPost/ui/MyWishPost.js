import { useMyWishPost } from "./useMyWishPost";
import Modal from "component/Modal";
import "css/RentalItem.css";

// 내가 찜한 게시물
const MyWishPost = () => {
  const {
    isModalOpen,
    modalTitle,
    modalMessage,
    modalActions,
    closeModal,
    currentItems,
    totalPages,
    currentPage,
    goToPage,
    handleItemClick,
  } = useMyWishPost();

  return (
    <div className="flex flex-col gap-y-5 p-10">
      <div>
        <h2 className="flex gap-2 mb-6 text-xl font-bold">
          나의 찜 목록<i className="text-red-500 fas fa-heart"></i>
        </h2>
      </div>
      <div className="gap-8 rental-container">
        {currentItems?.map((item) => (
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

export default MyWishPost;
