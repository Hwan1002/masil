import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useModal from "../context/useModal";
import { Api, ProjectContext } from "../context/MasilContext";
import useEditStore from "../shared/useEditStore";
import useLoginStore from "../shared/useLoginStore";
import Modal from "../component/Modal";
import moment from "moment";
import "../css/SelectedRentalItem.css";




// 이미지 캐러셀 컴포넌트
const ImageCarousel = ({
  images,
  currentIndex,
  onPrev,
  onNext,
  onDotClick,
}) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="selected-image-wrapper">
      <img
        src={`http://localhost:9090${images[currentIndex]}`}
        className="selected-rental-image"
        alt="이미지"
      />
      {images.length > 1 && (
        <>
          <button
            className="carousel-arrow carousel-prev"
            onClick={onPrev}
            style={{ display: currentIndex > 0 ? "flex" : "none" }}
          >
            ❮
          </button>
          <button
            className="carousel-arrow carousel-next"
            onClick={onNext}
            style={{
              display: currentIndex < images.length - 1 ? "flex" : "none",
            }}
          >
            ❯
          </button>
        </>
      )}
      <div className="carousel-indicators">
        {images.map((_, index) => (
          <span
            key={index}
            className={`carousel-dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => onDotClick(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

// 사용자 정보 컴포넌트
const UserInfo = ({ profilePhoto, nickname, address }) => (
  <div className="user-info">
    <div className="userInfo-img">
      <img
        src={`http://localhost:9090${profilePhoto}`}
        alt="프로필"
        className="selected-rental-profile-image"
      />
    </div>
    <div className="userInfo-text">
      <div>{nickname}</div>
      <div>{address}</div>
    </div>
  </div>
);

// 게시물 정보 컴포넌트
const PostInfo = ({ item, formatDate, curency }) => (
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
);

const SelectedRentalItem = () => {

  // 컨텍스트API 
  const { accessToken, setAccessToken } = useContext(ProjectContext);

  const { idx } = useParams();
  const navigate = useNavigate();
  const { setEdit } = useEditStore();
  const { userId, setIdx } = useLoginStore();
  const {
    isModalOpen,
    modalTitle,
    modalMessage,
    modalActions,
    openModal,
    closeModal,
  } = useModal();

  const [items, setItems] = useState([]);
  const [item, setItem] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWished, setIsWished] = useState(false);
  const itemIdx = parseInt(idx);

  // 데이터 로딩 함수
  const loadData = async () => {
    const res = await fetchPostItem(idx);
    if (res) {
      setItem(res.data);
      if (res.data.wished !== undefined) {
        setIsWished(res.data.wished);
      }
    }
  };

  // API 호출 함수들
  const fetchPostItem = async (idx) => {
    try {
      return await Api.get(`/post/item/${idx}`);
    } catch (error) {
      console.error("데이터 요청 실패:", error);
      return null;
    }
  };

  const deletePostItem = async (idx) => {
    try {
      const response = await Api.delete(`/post/${idx}`);
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

  // 채팅버튼 함수
  const handleChatClick = async () => {
    try {
      const response = await Api.get('/chat/chatRoom', {
        params: { receiver: item.userId }
      });

      const { room, messages } = response.data;
      // 2. 받은 roomId로 웹소켓 연결
      const ws = new WebSocket(`ws://localhost:9090/chat?roomId=${room.roomId}`,[accessToken]);
      ws.onopen = () => {
        console.log('웹소켓 연결 성공');
        // 웹소켓 연결 후 채팅방 화면으로 이동
        navigate('/chatroom', { state: { room, messages, ws } });
      };

      ws.onerror = (error) => {
        console.error('웹소켓 연결 실패:', error);
      };

      ws.onclose = () => {
        console.log('웹소켓 연결 종료');
      };

    } catch (error) {
      console.error('채팅방 조회/생성 실패:', error);
      // 실패 시 빈 채팅방으로 이동
      navigate('/chatroom', { state: { room: null, messages: [], ws: null } });
    }
  };


  // 유틸리티 함수들
  const formatDate = (date) => moment(date).format("YYYY-MM-DD HH:mm:ss");
  const curency = (number) => {
    const num = Number(number);
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // 이미지 캐러셀 핸들러
  const handleImageNavigation = {
    prev: () => {
      if (item.postPhotoPaths && currentImageIndex > 0) {
        setCurrentImageIndex(currentImageIndex - 1);
      }
    },
    next: () => {
      if (
        item.postPhotoPaths &&
        currentImageIndex < item.postPhotoPaths.length - 1
      ) {
        setCurrentImageIndex(currentImageIndex + 1);
      }
    },
    goTo: (index) => setCurrentImageIndex(index),
  };

  // 네비게이션 핸들러
  const handleNavigation = {
    goBack: () => navigate("/rentalitem"),
    edit: () => {
      setIdx(idx);
      setEdit(true);
      navigate("/postRegist");
    },
    prev: () => {
      const prevItems = items.filter((item) => item.postIdx < itemIdx);
      if (prevItems.length === 0) {
        openModal({
          message: "첫 번째 게시글입니다.",
          actions: [{ label: "확인", onClick: closeModal }],
        });
      } else {
        const prevIdx = Math.max(...prevItems.map((item) => item.postIdx));
        navigate(`/post/item/${prevIdx}`);
      }
    },
    next: () => {
      const nextItems = items.filter((item) => item.postIdx > itemIdx);
      if (nextItems.length === 0) {
        openModal({
          message: "마지막 게시글입니다.",
          actions: [{ label: "확인", onClick: closeModal }],
        });
      } else {
        const nextIdx = Math.min(...nextItems.map((item) => item.postIdx));
        navigate(`/post/item/${nextIdx}`);
      }
    },
  };

  // 위시리스트 핸들러
  const handleWishClick = async () => {
    try {
      let response;
      const wishDto = {
        postIdx: itemIdx,
        wished: !isWished,
        wishCount: null,
      };

      if (isWished) {
        response = await Api.delete(`/wish/${itemIdx}`);
      } else {
        try {
          response = await Api.post("/wish", wishDto);
        } catch (error) {
          if (error.response?.status === 409) {
            openModal({
              message: "이미 찜한 게시물입니다.",
              actions: [{ label: "확인", onClick: closeModal }],
            });
            setIsWished(true);
            return;
          }
          throw error;
        }
      }

      if (response.status === 200) {
        setIsWished(!isWished);
        openModal({
          message: isWished
            ? "위시리스트에서 제거되었습니다."
            : "위시리스트에 추가되었습니다.",
          actions: [{ label: "확인", onClick: closeModal }],
        });
      }
    } catch (error) {
      console.error("위시리스트 처리 실패:", error);
      openModal({
        message:
          error.response?.data?.message ||
          "위시리스트 처리 중 오류가 발생했습니다.",
        actions: [{ label: "확인", onClick: closeModal }],
      });
    }
  };

  // 초기 데이터 로딩
  useEffect(() => {
    loadData();
  }, [idx]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api.get(`/post`);
        if (response) setItems(response.data);
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="selected-container">
      <div className="selected-content">
        <div className="select-post-container">
          <div className="selected-title">
            {item.postTitle}
            <button onClick={handleWishClick} className="wish-btn">
              <i
                className={`wish-icon fa-heart ${isWished ? "fas is-wished" : "far"
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
            <PostInfo item={item} formatDate={formatDate} curency={curency} />
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
                          { label: "삭제", onClick: () => deletePostItem(idx) },
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
            <button className="" onClick={handleChatClick}>
              채팅
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
