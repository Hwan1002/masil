import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ProjectContext } from "context/MasilContext";
import useModal from "context/useModal";
import { useEmailVerification } from "./hooks/useEmailVerification";
import { useProfilePhoto } from "./hooks/useProfilePhoto";
import { useLocation } from "./hooks/useLocation";
import {
  checkUserIdDuplicate,
  sendVerificationEmail,
  verifyEmailCode,
  registerUser,
} from "./actions/signUpActions";
import { validateSignUpForm, createSignUpFormData } from "./utils/validators";
import { INITIAL_FORM_DATA, VALIDATION_MESSAGES } from "./constants";

export const useSignUp = () => {
  const navigate = useNavigate();
  const { setIsLoading } = useContext(ProjectContext);
  const { location, setLocation } = useLocation();

  // 모달 관리
  const {
    isModalOpen,
    modalTitle,
    modalMessage,
    modalActions,
    openModal,
    closeModal,
  } = useModal();

  // 커스텀 훅들
  const {
    profilePhoto,
    imagePreview,
    inputImgRef,
    handleProfileClick,
    handleImageUpload,
  } = useProfilePhoto();

  const {
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
  } = useEmailVerification();

  // 로컬 상태
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [pwdConfirm, setPwdConfirm] = useState("");
  const [duplicateBtn, setDuplicateBtn] = useState(false);

  // 입력 필드 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 이미지 업로드 핸들러 (래퍼)
  const onImageUpload = (e) => {
    handleImageUpload(e, setFormData);
  };

  // 아이디 중복 체크
  const handleIdDuplicate = async (e) => {
    e.preventDefault();

    if (!formData.userId) {
      openModal({ message: VALIDATION_MESSAGES.ENTER_USER_ID });
      return;
    }

    try {
      const isDuplicate = await checkUserIdDuplicate(formData.userId);

      if (isDuplicate) {
        openModal({ message: "중복된 아이디입니다." });
      } else {
        setDuplicateBtn(true);
        openModal({ message: "사용가능한 아이디입니다." });
      }
    } catch (error) {
      console.error("아이디 중복 체크 실패:", error);
      openModal({ message: "아이디 확인 중 오류가 발생했습니다." });
    }
  };

  // 이메일 인증번호 전송
  const handleSendVerificationCode = async (e) => {
    e.preventDefault();

    if (formData.email === "") {
      openModal({ message: VALIDATION_MESSAGES.ENTER_EMAIL });
      return;
    }

    setIsLoading(true);
    openModal({
      title: "전송 중",
      message: "인증번호를 전송하고 있습니다...",
    });

    try {
      const response = await sendVerificationEmail(formData.email);
      setIsLoading(false);
      startTimer();
      openModal({ message: response.value });
    } catch (error) {
      setIsLoading(false);
      openModal({ message: error.response?.data?.error || "전송 실패" });
    }
  };

  // 이메일 인증 확인
  const handleEmailVerification = async (e) => {
    e.preventDefault();

    try {
      const response = await verifyEmailCode(formData.email, verifyCode);
      completeVerification();
      openModal({ message: response.value });
    } catch (error) {
      failVerification();
      openModal({
        message: error.response?.data?.error || "인증 실패",
      });
    }
  };

  // 회원가입 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    const validation = validateSignUpForm(
      formData,
      duplicateBtn,
      pwdConfirm,
      verifyCodeConfirm
    );

    if (!validation.isValid) {
      openModal({ message: validation.message });
      return;
    }

    try {
      const data = createSignUpFormData(formData, location, profilePhoto);
      const response = await registerUser(data);

      openModal({
        title: "회원가입",
        message: response.value,
        actions: [
          {
            label: "확인",
            onClick: () => {
              closeModal();
              navigate("/login");
            },
          },
        ],
      });
    } catch (error) {
      setFormData({ ...formData, email: "" });
      setIsReadOnly(false);
      openModal({
        title: "회원가입",
        message: error.response?.data?.error || "회원가입 실패",
      });
    } finally {
      setLocation({});
    }
  };

  return {
    // 모달
    isModalOpen,
    modalTitle,
    modalMessage,
    modalActions,
    closeModal,

    // 폼 데이터
    formData,
    pwdConfirm,
    setPwdConfirm,
    handleInputChange,

    // 프로필 사진
    imagePreview,
    inputImgRef,
    handleProfileClick,
    onImageUpload,

    // 이메일 인증
    certifiedBtn,
    verifyCodeConfirm,
    timer,
    isReadonly,
    verifyCode,
    setVerifyCode,

    // 중복 체크
    duplicateBtn,

    // 액션 핸들러
    handleIdDuplicate,
    handleSendVerificationCode,
    handleEmailVerification,
    handleSubmit,

    // 네비게이션
    navigate,
  };
};

