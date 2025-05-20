import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useModal from "../context/useModal";
import { Api } from "../context/MasilContext";
import useEditStore from "../shared/useEditStore";
import useLoginStore from "../shared/useLoginStore";
import Modal from "../component/Modal";
import moment from "moment";
import "../css/SelectedRentalItem.css";
import axios from "axios";

const SelectedRentalItem = () => {
  const { idx } = useParams();
  const [item, setItem] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { setEdit } = useEditStore();
  const { userId, setIdx } = useLoginStore();
  const itemIdx = parseInt(idx);
  const [items, setItems] = useState([]);


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

  // 전체게시글 idx값 찾기위한 전체게시글 조회
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

const handlePrev = () => {
  const prevItems = items.filter(item => item.postIdx < itemIdx);
  if (prevItems.length === 0) {
    openModal({
      message: "첫 번째 게시글입니다.",
      actions: [{ label: "확인", onClick: closeModal }],
    });
  } else {
    const prevIdx = Math.max(...prevItems.map(item => item.postIdx));
    navigate(`/post/item/${prevIdx}`);
  }
};

const handleNext = () => {
  const nextItems = items.filter(item => item.postIdx > itemIdx);
  if (nextItems.length === 0) {
    openModal({
      message: "마지막 게시글입니다.",
      actions: [{ label: "확인", onClick: closeModal }],
    });
  } else {
    const nextIdx = Math.min(...nextItems.map(item => item.postIdx));
    navigate(`/post/item/${nextIdx}`);
  }
};

  return (
    <div className="selected-container">
      <div className="selected-content">
        <div className="select-post-container">
          <div className="selected-title">{item.postTitle}</div>
          <div className="user-info">
            <div className="userInfo-img">
              <img
                src={`http://localhost:9090${item.userProfilePhotoPath}`}
                alt={item.postIdx}
                className="selected-rental-profile-image"
              />
            </div>
            <div className="userInfo-text">
              <div>{item.userNickName}</div>
              <div>{item.userAddress}</div>
            </div>
          </div>
          <div className="selected-imagePost">
            <div className="selected-image-container">
              <div className="selected-image-wrapper">
                {item.postPhotoPaths && item.postPhotoPaths.length > 0 && (
                  <>
                    <img
                      src={`http://localhost:9090${item.postPhotoPaths[currentImageIndex]}`}
                      className="selected-rental-image"
                      alt="이미지"
                    />
                    {item.postPhotoPaths.length > 1 && (
                      <>
                        <button
                          className="carousel-arrow carousel-prev"
                          onClick={prevImage}
                          style={{
                            display: currentImageIndex > 0 ? "flex" : "none",
                          }}
                        >
                          ❮
                        </button>
                        <button
                          className="carousel-arrow carousel-next"
                          onClick={nextImage}
                          style={{
                            display:
                              currentImageIndex < item.postPhotoPaths.length - 1
                                ? "flex"
                                : "none",
                          }}
                        >
                          ❯
                        </button>
                      </>
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
            <div className="selected-post-info">
              <div className="selected-info">
                <div className="div-flex">
                  <label>등록일 : </label>
                  <p>{formatDate(item.updateDate)}</p>
                </div>
                <div className="div-flex">
                  <label>대여일 : </label>
                  <p>{formatDate(item.postStartDate)}</p>
                </div>
                <div className="div-flex">
                  <label>가격 : </label>
                  <p>{curency(item.postPrice)}원</p>
                </div>
                <div className="div-flex">
                  <label>거래희망장소 : </label>
                  {item.address}
                </div>
              </div>
              <div className="selected-description">
                <label>설명 : </label>
                <p>{item.description}</p>
              </div>
            </div>
          </div>
          <div className="selected-buttons">
            <div>
              <button className="back-btn" onClick={handleGoBack}>
                뒤로가기
              </button>
            </div>
            <div className="edit-button">
              {userId === item.userId ? (
                <>
                  <button className="update-btn" onClick={handleEditBtn}>
                    수정
                  </button>

                  <button
                    className="delete-btn"
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
                ""
              )}
            </div>
          </div>
           <div className="selected-buttons">
              <button className="arrow-left" onClick={handlePrev}>이전</button>
              <button className="arrow-right" onClick={handleNext}>다음 </button>
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
