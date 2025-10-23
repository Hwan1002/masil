import { useState } from "react";

/**
 * 이미지 캐러셀 로직을 관리하는 커스텀 훅
 * @param {Array} images - 이미지 배열
 * @returns {Object} 현재 인덱스와 네비게이션 핸들러
 */

export const useImageCarousel = (images) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleImageNavigation = {
    prev: () => {
      if (images && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    },
    next: () => {
      if (images && currentIndex < images.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    },
    goTo: (index) => setCurrentIndex(index),
  };

  return {
    currentIndex,
    setCurrentIndex,
    handleImageNavigation,
  };
};
