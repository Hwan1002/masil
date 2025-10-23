import { VALIDATION_MESSAGES } from "../constants";

// 폼 데이터 유효성 검사

export const validateSignUpForm = (
  formData,
  duplicateBtn,
  pwdConfirm,
  verifyCodeConfirm
) => {
  // 빈 값 확인
  const isEmpty = Object.values(formData).some((value) => !value);
  if (isEmpty) {
    return { isValid: false, message: VALIDATION_MESSAGES.EMPTY_FIELD };
  }

  // 중복 체크 확인
  if (!duplicateBtn) {
    return { isValid: false, message: VALIDATION_MESSAGES.DUPLICATE_CHECK };
  }

  // 비밀번호 일치 확인
  if (pwdConfirm !== formData.password) {
    return { isValid: false, message: VALIDATION_MESSAGES.PASSWORD_MISMATCH };
  }

  // 이메일 인증 확인
  if (!verifyCodeConfirm) {
    return {
      isValid: false,
      message: VALIDATION_MESSAGES.EMAIL_VERIFICATION_REQUIRED,
    };
  }

  return { isValid: true, message: "" };
};

/**
 * FormData 생성
 * @param {Object} formData - 폼 데이터
 * @param {Object} location - 위치 정보
 * @param {File} profilePhoto - 프로필 사진 파일
 * @returns {FormData} 생성된 FormData
 */
export const createSignUpFormData = (formData, location, profilePhoto) => {
  const data = new FormData();

  if (profilePhoto) {
    data.append("profilePhoto", profilePhoto);
  }

  data.append(
    "dto",
    new Blob(
      [
        JSON.stringify({
          ...formData,
          address: location.address,
          lat: location.lat,
          lng: location.lng,
        }),
      ],
      { type: "application/json" }
    )
  );

  return data;
};
