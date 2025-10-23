import { Api } from "context/MasilContext";

import { API_ENDPOINTS } from "../constants";

/**
 * 아이디 중복 체크
 * @param {string} userId - 확인할 사용자 ID
 * @returns {Promise<boolean>} 중복 여부
 */
export const checkUserIdDuplicate = async (userId) => {
  const response = await Api.get(API_ENDPOINTS.USER, {
    params: { userId },
  });
  return response.data; // true면 중복, false면 사용 가능
};

/**
 * 이메일 인증번호 전송
 * @param {string} email - 인증번호를 받을 이메일
 * @returns {Promise<Object>} 응답 데이터
 */
export const sendVerificationEmail = async (email) => {
  const response = await Api.post(API_ENDPOINTS.SEND_EMAIL, { email });
  return response.data;
};

/**
 * 이메일 인증번호 확인
 * @param {string} email - 이메일
 * @param {string} verifyCode - 인증번호
 * @returns {Promise<Object>} 응답 데이터
 */
export const verifyEmailCode = async (email, verifyCode) => {
  const response = await Api.post(API_ENDPOINTS.VERIFY_EMAIL, {
    email,
    verifyCode,
  });
  return response.data;
};

/**
 * 회원가입 요청
 * @param {FormData} formData - 회원가입 데이터
 * @returns {Promise<Object>} 응답 데이터
 */
export const registerUser = async (formData) => {
  const response = await Api.post(API_ENDPOINTS.USER, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * 좌표로 주소 가져오기
 * @param {number} lat - 위도
 * @param {number} lng - 경도
 * @returns {Promise<Object>} 주소 정보
 */
export const getAddressFromCoordinates = async (lat, lng) => {
  const response = await Api.post(API_ENDPOINTS.LOCATION, { lat, lng });
  return response.data;
};
