import { useState, useRef, useContext, useEffect } from "react";
import { ProjectContext } from "context/MasilContext";
import userDefault from "css/img/userDefault.svg";

/**
 * 프로필 사진 관련 로직을 관리하는 커스텀 훅
 * @returns {Object} 프로필 사진 상태와 핸들러들
 */
export const useProfilePhoto = () => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const inputImgRef = useRef(null);
  const { imagePreview, setImagePreview } = useContext(ProjectContext);

  // 초기 기본 이미지 설정
  useEffect(() => {
    setImagePreview(userDefault);
  }, [setImagePreview]);

  // 프로필 클릭 핸들러
  const handleProfileClick = () => {
    if (inputImgRef.current) {
      inputImgRef.current.click();
    }
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = (e, setFormData) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profilePhoto: file.name,
      }));
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return {
    profilePhoto,
    imagePreview,
    inputImgRef,
    handleProfileClick,
    handleImageUpload,
  };
};





