import { Api } from "context/MasilContext";
import { API_ENDPOINTS } from "../constants";

/**
 * 비밀번호 찾기 이메일 전송
 * @param {string} email - 사용자 이메일
 * @returns {Promise<Object>} 응답 데이터
 */
export const sendPasswordResetEmail = async (email) => {
  const response = await Api.post(API_ENDPOINTS.FIND_PASSWORD, { email });
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
 * 비밀번호 재설정
 * @param {string} email - 이메일
 * @param {string} password - 새 비밀번호
 * @returns {Promise<Object>} 응답 데이터
 */
export const resetPassword = async (email, password) => {
  const response = await Api.put(API_ENDPOINTS.RESET_PASSWORD, {
    email,
    password,
  });
  return response.data;
};






