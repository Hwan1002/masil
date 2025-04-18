import React, { createContext, useEffect, useState } from "react";
import userDefault from "../css/img/userDefault.svg";
import axios from "axios";

export const ProjectContext = createContext();

// Axios 인스턴스 생성
export const Api = axios.create({
  baseURL: "http://localhost:9090",
  withCredentials: true,
});

export const ProjectProvider = ({ children }) => {
  //로그인 상태
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  //프로필사진
  const [imagePreview, setImagePreview] = useState(userDefault);
  //로딩중 상태
  const [isLoading, setIsLoading] = useState(false);

  // 새로고침시 refreshToken(httpOnlyCookie) 를통한 accessToken 갱신요청
  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const response = await axios.post(
          "http://localhost:9090/auth/refresh-token",
          {},
          { withCredentials: true }
        );
        setAccessToken(response.data.accessToken); // 새로운 Access Token 저장
        setLoginSuccess(true); // 로그인 상태 업데이트
      } catch (error) {
        console.log(error.response.data.error);
        setAccessToken(null); // Access Token 초기화
        setLoginSuccess(false); // 로그인 상태 초기화
      }
    };
    refreshAccessToken();
  }, []);

  // Axios Interceptor 설정
  useEffect(() => {
    // 요청 인터셉터
    const requestInterceptor = Api.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 응답 인터셉터
    const responseInterceptor = Api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshResponse = await axios.post(
              "http://localhost:9090/auth/refresh-token",
              {},
              { withCredentials: true }
            );
            const newAccessToken = refreshResponse.data.accessToken;
            setAccessToken(newAccessToken); // 새로운 토큰 저장
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return Api(originalRequest); // 원래 요청 재시도
          } catch (refreshError) {
            setAccessToken(null);
            setLoginSuccess(false);
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    // 컴포넌트 언마운트 시 인터셉터 제거
    return () => {
      Api.interceptors.request.eject(requestInterceptor);
      Api.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken]);

  const value = {
    loginSuccess,
    setLoginSuccess,
    accessToken,
    setAccessToken,
    // tokenTimer, setTokenTimer,
    // timeText, setTimeText,
    imagePreview,
    setImagePreview,
    isLoading,
    setIsLoading,
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};
