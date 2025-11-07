import { useNavigate } from "react-router-dom";

/**
 * 게시물 네비게이션 로직을 관리하는 커스텀 훅
 * @param {Object} params - 파라미터
 * @param {Array} params.items - 전체 게시물 목록
 * @param {number} params.currentIdx - 현재 게시물 인덱스
 * @param {Function} params.setIdx - 인덱스 설정 함수
 * @param {Function} params.setEdit - 편집 모드 설정 함수
 * @param {Function} params.openModal - 모달 오픈 함수
 * @param {Function} params.closeModal - 모달 닫기 함수
 * @returns {Object} 네비게이션 핸들러들
 */
export const usePostNavigation = ({
  items,
  currentIdx,
  setIdx,
  setEdit,
  openModal,
  closeModal,
}) => {
  const navigate = useNavigate();

  const handleNavigation = {
    goBack: () => navigate("/rentalitem"),

    edit: () => {
      setIdx(currentIdx);
      setEdit(true);
      navigate("/postRegist");
    },

    prev: () => {
      const prevItems = items.filter((item) => item.postIdx < currentIdx);
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
      const nextItems = items.filter((item) => item.postIdx > currentIdx);
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

  return handleNavigation;
};

