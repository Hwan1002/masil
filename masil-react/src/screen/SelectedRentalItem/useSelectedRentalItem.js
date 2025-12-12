import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Api, ProjectContext } from "context/MasilContext";
import useModal from "context/useModal";
import useEditStore from "shared/useEditStore";
import useLoginStore from "shared/useLoginStore";
import { useChatRoom } from "hook/useChatRoom";
import { useImageCarousel } from "./hooks/useImageCarousel";
import { usePostNavigation } from "./hooks/usePostNavigation";
import { useWishlist } from "./hooks/useWishlist";
import { formatDateTime, formatCurrency } from "utils/utils.ts";

export const useSelectedRentalItem = () => {
  const {
    isModalOpen,
    modalTitle,
    modalMessage,
    modalActions,
    openModal,
    closeModal,
  } = useModal();

  const { accessToken } = useContext(ProjectContext);
  const { idx } = useParams();
  const { userId, setIdx } = useLoginStore();
  const { setEdit } = useEditStore();
  const { handleChatClick } = useChatRoom();

  const [items, setItems] = useState([]);
  const [item, setItem] = useState({});
  const itemIdx = parseInt(idx);

  // 커스텀 훅 사용
  const { currentIndex, setCurrentIndex, handleImageNavigation } =
    useImageCarousel(item.postPhotoPaths);

  const { isWished, setIsWished, handleWishClick } = useWishlist(
    itemIdx,
    openModal,
    closeModal
  );

  const handleNavigation = usePostNavigation({
    items,
    currentIdx: itemIdx,
    setIdx,
    setEdit,
    openModal,
    closeModal,
  });

  // 전체 게시물 목록 로딩
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

  // 특정 게시물 상세 정보 로딩
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await Api.get(`/post/item/${idx}`);
        if (response) {
          setItem(response.data);
          setIsWished(response.data.wished || false);
          setCurrentIndex(0); // 이미지 인덱스 초기화
        }
      } catch (error) {
        console.error("게시물 상세 정보 로딩 실패:", error);
      }
    };
    loadData();
  }, [idx, setIsWished, setCurrentIndex]);

  // 게시물 삭제
  const deletePostItem = async (postIdx) => {
    try {
      const response = await Api.delete(`/post/${postIdx}`);
      if (response) {
        openModal({
          message: "삭제가 완료되었습니다.",
          actions: [
            {
              label: "확인",
              onClick: () => {
                closeModal();
                handleNavigation.goBack();
              },
            },
          ],
        });
      }
    } catch (error) {
      console.error("게시글 삭제 실패:", error);
      openModal({
        message: "게시글 삭제에 실패했습니다.",
        actions: [{ label: "확인", onClick: closeModal }],
      });
    }
  };

  return {
    // 모달 관련
    isModalOpen,
    modalTitle,
    modalMessage,
    modalActions,
    openModal,
    closeModal,

    // 데이터
    item,
    userId,
    accessToken,

    // 이미지 캐러셀
    currentImageIndex: currentIndex,
    handleImageNavigation,

    // 위시리스트
    isWished,
    handleWishClick,

    // 네비게이션
    handleNavigation,

    // 액션
    deletePostItem,
    handleChatClick,

    // 유틸리티
    formatDate: formatDateTime,
    formatCurrency,
  };
};
