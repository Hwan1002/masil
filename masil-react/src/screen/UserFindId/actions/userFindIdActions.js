import { Api } from "context/MasilContext";
import { API_ENDPOINTS } from "../constants";

/**
 * 이메일로 아이디 찾기
 * @param {string} email - 사용자 이메일
 * @returns {Promise<string>} 찾은 사용자 아이디
 */
export const findUserIdByEmail = async (email) => {
  const response = await Api.post(API_ENDPOINTS.FIND_USER_ID, { email });
  return response.data.value;
};

