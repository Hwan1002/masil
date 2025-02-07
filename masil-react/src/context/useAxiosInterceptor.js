import axios from "axios";
import { useContext, useEffect } from "react";
import { ProjectContext } from "./MasilContext";

export const api = axios.create({
  baseURL: "http://localhost:9090", // Spring Boot 서버 주소
  withCredentials: true, // HTTP-Only 쿠키 전송 활성화
});






// 인터셉터 설정 함수
export const useAxiosInterceptor = () => {
  useContext(ProjectContext) ;
  const{ accessToken, setAccessToken, setLoginSuccess } = useContext(ProjectContext);
  // if (!context) {
  //   throw new Error("useAxiosInterceptor must be used within a ProjectProvider");
  // }

  // const { accessToken, setAccessToken, setLoginSuccess } = context;


  // 요청 인터셉터
  api.interceptors.request.use(
    (config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  // 응답 인터셉터
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // 토큰 만료(401) 시 처리
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // 중복 요청 방지 플래그 설정

        try {
          const refreshResponse = await axios.post(
            "http://localhost:9090/auth/refresh-token",
            {},
            { withCredentials: true }
          );

          const newAccessToken = refreshResponse.data.accessToken;
          setAccessToken(newAccessToken); // 새로운 토큰 저장
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return api(originalRequest); // 원래 요청 재시도
        } catch (refreshError) {
          setAccessToken(null); // 토큰 초기화
          setLoginSuccess(false); // 로그인 상태 해제
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};