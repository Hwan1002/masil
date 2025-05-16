import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useModal from "../context/useModal";
import { Api } from "../context/MasilContext";
import useEditStore from "../shared/useEditStore";
import useLoginStore from "../shared/useLoginStore";
import Modal from "../component/Modal";
import moment from "moment";
import "../css/SelectedRentalItem.css";

const SelectedRentalItem = () => {
  const { idx } = useParams();
  const [item, setItem] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { setEdit } = useEditStore();
  const { userId, setIdx } = useLoginStore();

  const navigate = useNavigate();

  const {
    isModalOpen,
    modalTitle,
    modalMessage,
    modalActions,
    openModal,
    closeModal,
  } = useModal();

  useEffect(() => {
    const loadData = async () => {
      const res = await fetchPostItem(idx);
      if (res) {
        setItem(res.data);
      }
    };

    loadData();
  }, [idx]);

  const fetchPostItem = async (idx) => {
    try {
      const response = await Api.get(`/post/item/${idx}`);
      return response;
    } catch (error) {
      console.error("데이터 요청 실패:", error);
      return null;
    }
  };

  const deletePostItem = async (idx) => {
    try {
      const response = await Api.delete(`/post/${idx}`);

      console.log(response.data.value);
      if (response) {
        openModal({
          message: "삭제가 완료되었습니다.",
          actions: [
            {
              label: "확인",
              onClick: () => {
                closeModal();
                navigate("/rentalitem");
              },
            },
          ],
        });
      }
    } catch (error) {
      console.error("게시글 삭제 실패:", error);
    }
  };

  const formatDate = (date, format = "YYYY-MM-DD HH:mm:ss") => {
    return moment(date).format(format);
  };

  const curency = (number) => {
    const num = Number(number);
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const prevImage = () => {
    console.log("item", item);
    if (item.postPhotoPaths && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const nextImage = () => {
    if (
      item.postPhotoPaths &&
      currentImageIndex < item.postPhotoPaths.length - 1
    ) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const handleGoBack = () => {
    navigate("/rentalitem");
  };

  const handleEditBtn = () => {
    setIdx(idx);
    setEdit(true);
    navigate("/postRegist");
  };

  return (
    <div className="selected-container">
      <div className="selected-ud">
        <div>
          <button onClick={handleGoBack}>뒤로가기</button>
        </div>
        <div>
          {userId === item.userId ? (
            <>
              <button className="selected-u" onClick={handleEditBtn}>
                수정
              </button>

              <button
                onClick={() =>
                  openModal({
                    message: "정말 삭제하시겠습니까?",
                    actions: [
                      { label: "돌아가기", onClick: closeModal },
                      { label: "삭제", onClick: () => deletePostItem(idx) },
                    ],
                  })
                }
              >
                삭제
              </button>
            </>
          ) : (
            "응~ 안보여~"
          )}
        </div>
      </div>
      <div className="selected-item-container">
        <div className="selected-title">{item.postTitle}</div>
        <div className="seleceted-div-container">
          <div className="selected-photo-container">
            <div className="carousel-container">
              {item.postPhotoPaths && item.postPhotoPaths.length > 0 && (
                <>
                  <img
                    src={`http://localhost:9090${item.postPhotoPaths[currentImageIndex]}`}
                    className="selected-rental-image"
                    alt="이미지"
                  />
                  {currentImageIndex > 0 && (
                    <div className="carousel-prev" onClick={prevImage}>
                      ❮
                    </div>
                  )}
                  {currentImageIndex < item.postPhotoPaths.length - 1 && (
                    <div className="carousel-next" onClick={nextImage}>
                      ❯
                    </div>
                  )}
                </>
              )}
              <div className="carousel-indicators">
                {item.postPhotoPaths &&
                  item.postPhotoPaths.map((_, index) => (
                    <span
                      key={index}
                      className={`carousel-dot ${
                        index === currentImageIndex ? "active" : ""
                      }`}
                      onClick={() => goToImage(index)}
                    ></span>
                  ))}
              </div>
            </div>
          </div>
          <div className="selected-description-container">
            <div className="selected-bottom-title">
              <img
                src={`http://localhost:9090${item.userProfilePhotoPath}`}
                alt={item.postIdx}
                className="selected-rental-profile-image"
              />
              <div className="selected-explanation">
                <div>{item.userNickName}</div>
                <div>{item.userAddress}</div>
              </div>
            </div>
            <div className="selected-dp-title">
              <div className="selected-dp-sub-container">
                <div className="selected-dp-item-title">등록일</div>
                <div className="selected-dp-item">
                  {formatDate(item.updateDate)}
                </div>
              </div>
              <div className="selected-dp-sub-container">
                <div className="selected-dp-item-title">대여일</div>
                <div className="selected-dp-item">
                  {formatDate(item.postStartDate)}
                </div>
              </div>
              <div className="selected-dp-sub-container">
                <div className="selected-dp-item-title">가격</div>
                <div className="selected-dp-item">
                  {curency(item.postPrice)}원
                </div>
              </div>
              <div className="selected-dp-sub-container">
                <div className="selected-dp-item-title">거래희망장소</div>
                <div className="selected-dp-item">{item.address}</div>
              </div>
            </div>
            <div className="selected-dp">
              <div className="selected-explanation">{item.description}</div>
            </div>
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
