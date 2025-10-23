import { Api } from "context/MasilContext";
import { API_ENDPOINTS } from "../constants";

//이메일로 아이디 찾기
export const findUserIdByEmail = async (email) => {
  const response = await Api.post(API_ENDPOINTS.FIND_USER_ID, { email });
  return response.data.value;
};
