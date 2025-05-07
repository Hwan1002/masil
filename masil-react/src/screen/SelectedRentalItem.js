import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useModal from "../context/useModal";
import useEditStore from "../shared/useEditStore";
import Modal from "../component/Modal";
import moment from "moment";
import { Api } from "../context/MasilContext";
import "../css/SelectedRentalItem.css";
import useLoginStore from "../shared/useLoginStore";

const SelectedRentalItem = () => {
  const { idx } = useParams();
  const [item, setItem] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { setEdit } = useEditStore();
  const { userId } = useLoginStore;
  const navigate = useNavigate();

  const {
    isModalOpen,
    modalTitle,
    modalMessage,
    modalActions,
    openModal,
    closeModal,
  } = useModal();

  const fetchPostItem = async (idx) => {
    try {
      const response = await Api.get(`/post/item/${idx}`);
      setItem(response.data);
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

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchPostItem(idx);
      if (data) {
      }
    };

    loadData();
  }, [idx]);

  const formatDate = (date, format = "YYYY-MM-DD HH:mm:ss") => {
    return moment(date).format(format);
  };

  const curency = (number) => {
    const num = Number(number);
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const prevImage = () => {
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
    // get해온 userId와 로그인할때 저장한 값이 동일한지 비교 해야함
    // if (userId === item.userId) {
    setEdit(true);
    navigate("/postRegist");
    // } else {
    // openModal({
    //   message: "수정할 수 없는 게시물입니다.",
    //   actions: [
    //     {
    //       label: "확인",
    //       onClick: () => {
    //         closeModal();
    //       },
    //     },
    //   ],
    // });
    // }
  };
  console.log("로그인 아이디 : ", userId);
  console.log("게시물 아이디 : ", item.userId);
  return (
    <div className="selected-container">
      <div className="selected-ud">
        <div>
          <button onClick={handleGoBack}>뒤로가기</button>
        </div>
        <div>
          <button className="selected-u" onClick={handleEditBtn}>
            <a href={`/post/item/${idx}`}>수정</a>
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
        </div>
      </div>
      <div className="selected-item-container">
        <div className="selected-photo-container">
          <div className="selected-title">{item.postTitle}</div>
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
          <div className="selected-bottom-title">
            <img
              src={`http://localhost:9090${item.userProfilePhotoPath}`}
              alt={item.postIdx}
              className="selected-rental-profile-image"
            />
            <div className="selected-explanation">
              <div className="selected-rental-profile-text">
                {item.userNickName}
              </div>
              <div className="selected-rental-profile-text">{item.address}</div>
            </div>
          </div>
        </div>
        <div className="selected-description-container">
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
          </div>
          <div className="selected-dp">
            <div className="selected-explanation">{item.description}</div>
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
