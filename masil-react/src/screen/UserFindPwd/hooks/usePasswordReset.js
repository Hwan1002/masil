import { useState } from "react";
import { MESSAGES } from "../constants";
import {
  sendPasswordResetEmail,
  verifyEmailCode,
  resetPassword,
} from "../actions/userFindPwdActions";

/**
 * 비밀번호 재설정 로직을 관리하는 커스텀 훅
 * @param {Function} openModal - 모달 열기 함수
 * @param {Function} navigate - 네비게이션 함수
 * @returns {Object} 상태와 핸들러
 */
export const usePasswordReset = (openModal, navigate) => {
  const [email, setEmail] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [pwdConfirm, setPwdConfirm] = useState("");
  const [verifyCode, setVerifyCode] = useState("");

  // 이메일 인증번호 전송
  const handleSendVerificationCode = async (e) => {
    e.preventDefault();

    openModal({
      title: MESSAGES.SENDING,
      message: "인증번호를 전송하고 있습니다...",
    });

    try {
      const response = await sendPasswordResetEmail(email);
      openModal({ message: response.value });
    } catch (error) {
      openModal({
        message: error.response?.data?.error || "전송에 실패했습니다.",
      });
    }
  };

  // 인증번호 확인
  const handleVerifyCode = async (e) => {
    e.preventDefault();

    try {
      const response = await verifyEmailCode(email, verifyCode);
      setIsVerified(true);
      openModal({ message: MESSAGES.VERIFICATION_SUCCESS });
    } catch (error) {
      openModal({
        message: error.response?.data?.error || "인증에 실패했습니다.",
      });
    }
  };

  // 비밀번호 재설정
  const handleResetPassword = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (password.trim() === "" || pwdConfirm.trim() === "") {
      openModal({ message: MESSAGES.ENTER_PASSWORD });
      return;
    }

    if (password !== pwdConfirm) {
      openModal({ message: MESSAGES.PASSWORD_MISMATCH });
      return;
    }

    try {
      const response = await resetPassword(email, password);

      if (response) {
        openModal({
          message: response.value,
          actions: [
            {
              label: "확인",
              onClick: () => navigate("/login"),
            },
          ],
        });
      }
    } catch (error) {
      openModal({ message: MESSAGES.PASSWORD_CHANGE_FAILED });
      console.error(error);
    }
  };

  // Enter 키 핸들러
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (e.target.name === "email") {
        handleSendVerificationCode(e);
      } else if (e.target.name === "verifyCode") {
        handleVerifyCode(e);
      }
    }
  };

  return {
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
    handleSendVerificationCode,
    handleVerifyCode,
    handleResetPassword,
    handleKeyPress,
  };
};






