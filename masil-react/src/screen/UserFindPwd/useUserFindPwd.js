import { useNavigate } from "react-router-dom";
import useModal from "context/useModal";
import { usePasswordReset } from "./hooks/usePasswordReset";
import { MESSAGES } from "./constants";

export const useUserFindPwd = () => {
  const navigate = useNavigate();

  const {
    isModalOpen,
    modalTitle,
    modalMessage,
    modalActions,
    openModal,
    closeModal,
  } = useModal();

  const {
    email,
    setEmail,
    isVerified,
    password,
    setPassword,
    pwdConfirm,
    setPwdConfirm,
    verifyCode,
    setVerifyCode,
    handleSendVerificationCode,
    handleVerifyCode,
    handleResetPassword,
    handleKeyPress,
  } = usePasswordReset(openModal, navigate);

  // 폼 제출 핸들러 (기본 검증)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isVerified) {
      if (email.trim() === "") {
        openModal({
          title: "이메일 입력",
          message: MESSAGES.ENTER_EMAIL,
        });
        return;
      }
    } else {
      if (pwdConfirm !== password) {
        openModal({ message: MESSAGES.PASSWORD_MISMATCH });
        return;
      }
    }
  };

  // 네비게이션 핸들러
  const handleGoBack = () => navigate("/userfindid");
  const handleLogin = () => navigate("/login");
  const handleFindId = () => navigate("/userfindid");

  return {
    // 모달
    isModalOpen,
    modalTitle,
    modalMessage,
    modalActions,
    closeModal,

    // 상태
    email,
    setEmail,
    isVerified,
    password,
    setPassword,
    pwdConfirm,
    setPwdConfirm,
    verifyCode,
    setVerifyCode,

    // 핸들러
    handleSubmit,
    handleSendVerificationCode,
    handleVerifyCode,
    handleResetPassword,
    handleKeyPress,
    handleGoBack,
    handleLogin,
    handleFindId,
  };
};





