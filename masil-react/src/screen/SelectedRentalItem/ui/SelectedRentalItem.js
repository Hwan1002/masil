import { useSelectedRentalItem } from "../useSelectedRentalItem";
import Modal from "component/Modal";
import ImageCarousel from "../components/ImageCarousel";
import UserInfo from "../components/UserInfo";
import PostInfo from "../components/PostInfo";
import "css/SelectedRentalItem.css";

const SelectedRentalItem = () => {
  const {
    isModalOpen,
    modalTitle,
    modalMessage,
    modalActions,
    openModal,
    closeModal,
    item,
    userId,
    accessToken,
    currentImageIndex,
    handleImageNavigation,
    isWished,
    handleWishClick,
    handleNavigation,
    deletePostItem,
    handleChatClick,
    formatDate,
    formatCurrency,
  } = useSelectedRentalItem();

  return (
    <div className="selected-container">
      <div className="selected-content">
        <div className="select-post-container">
          <div className="selected-title">
            {item.postTitle}
            <button onClick={handleWishClick} className="wish-btn">
              <i
                className={`wish-icon fa-heart ${
                  isWished ? "fas is-wished" : "far"
                }`}
              ></i>
            </button>
          </div>

          <UserInfo
            profilePhoto={item.userProfilePhotoPath}
            nickname={item.userNickName}
            address={item.userAddress}
          />

          <div className="selected-imagePost">
            <div className="selected-image-container">
              <ImageCarousel
                images={item.postPhotoPaths}
                currentIndex={currentImageIndex}
                onPrev={handleImageNavigation.prev}
                onNext={handleImageNavigation.next}
                onDotClick={handleImageNavigation.goTo}
              />
            </div>
            <PostInfo
              item={item}
              formatDate={formatDate}
              formatCurrency={formatCurrency}
            />
          </div>

          <div className="selected-buttons">
            <div>
              <button className="back-btn" onClick={handleNavigation.goBack}>
                뒤로가기
              </button>
            </div>
            <div className="edit-button">
              {userId === item.userId && (
                <>
                  <button
                    className="update-btn"
                    onClick={handleNavigation.edit}
                  >
                    수정
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() =>
                      openModal({
                        message: "정말 삭제하시겠습니까?",
                        actions: [
                          { label: "돌아가기", onClick: closeModal },
                          {
                            label: "삭제",
                            onClick: () => deletePostItem(item.postIdx),
                          },
                        ],
                      })
                    }
                  >
                    삭제
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="selected-buttons">
            <button className="arrow-left" onClick={handleNavigation.prev}>
              이전
            </button>
            <button
              className="px-2 py-1 text-white bg-green-500 rounded-md border border-green-500 transition-colors hover:bg-white hover:text-green-500 group"
              onClick={() => handleChatClick(item.userId, accessToken)}
            >
              채팅하기
              <i className="ml-1 text-white fas fa-comment-dots group-hover:text-green-500"></i>
            </button>
            <button className="arrow-right" onClick={handleNavigation.next}>
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
    </div>
  );
};

export default SelectedRentalItem;
