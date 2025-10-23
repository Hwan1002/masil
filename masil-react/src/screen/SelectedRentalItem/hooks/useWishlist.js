import { useState } from "react";
import { Api } from "context/MasilContext";

/**
 * 위시리스트 로직을 관리하는 커스텀 훅
 * @param {number} postIdx - 게시물 인덱스
 * @param {Function} openModal - 모달 오픈 함수
 * @param {Function} closeModal - 모달 닫기 함수
 * @returns {Object} 위시 상태와 핸들러
 */
export const useWishlist = (postIdx, openModal, closeModal) => {
  const [isWished, setIsWished] = useState(false);

  const handleWishClick = async () => {
    try {
      let response;
      const wishDto = {
        postIdx: postIdx,
        wished: !isWished,
        wishCount: null,
      };

      if (isWished) {
        response = await Api.delete(`/wish/${postIdx}`);
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

  return {
    isWished,
    setIsWished,
    handleWishClick,
  };
};

