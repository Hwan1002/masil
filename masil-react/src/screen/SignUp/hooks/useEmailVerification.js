import { useState, useEffect } from "react";
import { EMAIL_VERIFICATION_TIMER } from "../constants";

/**
 * 이메일 인증 관련 로직을 관리하는 커스텀 훅
 * @returns {Object} 인증 상태와 핸들러들
 */
export const useEmailVerification = () => {
  const [certifiedBtn, setCertifiedBtn] = useState(false);
  const [verifyCodeConfirm, setVerifyCodeConfirm] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [timer, setTimer] = useState(-1);
  const [isReadonly, setIsReadOnly] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");

  // 타이머 시작
  const startTimer = () => {
    setTimer(EMAIL_VERIFICATION_TIMER);
    setCertifiedBtn(true);
    setIsReadOnly(true);
  };

  // 타이머 중지
  const stopTimer = () => {
    setTimer(0);
    setCertifiedBtn(false);
    setIsReadOnly(false);
  };

  // 인증 완료 처리
  const completeVerification = () => {
    setIsEmailVerified(true);
    setCertifiedBtn(false);
    setVerifyCodeConfirm(true);
  };

  // 인증 실패 처리
  const failVerification = () => {
    setIsEmailVerified(false);
    setCertifiedBtn(true);
  };

  // 타이머 효과
  useEffect(() => {
    if (timer <= 0) return;

    const timerInterval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          setCertifiedBtn(false);
          setIsReadOnly(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [timer]);

  return {
    certifiedBtn,
    verifyCodeConfirm,
    isEmailVerified,
    timer,
    isReadonly,
    verifyCode,
    setVerifyCode,
    startTimer,
    stopTimer,
    completeVerification,
    failVerification,
    setIsReadOnly,
  };
};
