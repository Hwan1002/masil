import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useModal from "context/useModal";
import { findUserIdByEmail } from "./actions/userFindIdActions";
import { useKeyPress } from "./hooks/useKeyPress";
import { MESSAGES } from "./constants";

export const useUserFindId = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const {
    isModalOpen,
    modalTitle,
    modalMessage,
    modalActions,
    openModal,
    closeModal,
  } = useModal();

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 이메일 유효성 검사
    if (email.trim() === "") {
      openModal({
        title: "이메일 입력",
        message: MESSAGES.ENTER_EMAIL,
      });
      return;
    }

    setIsLoading(true);

    try {
      const userId = await findUserIdByEmail(email);
      openModal({
        message: MESSAGES.FOUND_ID(userId),
      });
    } catch (error) {
      openModal({
        title: "경고",
        message: error.response?.data?.error || "아이디 찾기에 실패했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 모달 닫기 핸들러
  const handleModalClose = () => {
    closeModal();
    setIsLoading(false);
    setEmail("");
  };

  // Enter 키 핸들러
  const handleKeyPress = useKeyPress(handleSubmit);

  // 네비게이션 핸들러
  const handleGoBack = () => navigate("/login");
  const handleFindPassword = () => navigate("/userfindpwd");

  return {
    // 상태
    isLoading,
    email,
    setEmail,

    // 모달
    isModalOpen,
    modalTitle,
    modalMessage,
    modalActions,

    // 핸들러
    handleSubmit,
    handleModalClose,
    handleKeyPress,
    handleGoBack,
    handleFindPassword,
  };
};







