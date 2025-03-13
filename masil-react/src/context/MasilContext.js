import React, { createContext, useEffect, useRef, useState } from "react";
import userDefault from "../css/img/userDefault.svg";
import axios from "axios";

export const ProjectContext = createContext();

// Axios 인스턴스 생성
export const Api = axios.create({
  baseURL: "http://localhost:9090",
  withCredentials: true, //쿠키포함
});

// 새로고침 axios 인스턴스 
const refreshInstance = axios.create({
  baseURL: "http://localhost:9090",
  withCredentials: true, //쿠키포함
});

export const ProjectProvider = ({ children }) => {
  //로그인 상태
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  //프로필사진
  const [imagePreview, setImagePreview] = useState(userDefault);
  //로딩중 상태
  const [isLoading, setIsLoading] = useState(false);

  // 컴포넌트 렌더링 상태 
  const [isTokenLoading, setIsTokenLoading] = useState(false);

  // 렌더링없는 추적
  const tokenValueRef = useRef(accessToken);

  useEffect(() => {
    tokenValueRef.current = accessToken;
  }, [accessToken]);


  // refreshToken(httpOnlyCookie) 를통한 accessToken 갱신요청 
  const refreshToken = async () => {
    try {
      const { data } = await refreshInstance.post('/auth/refresh-token',{});
      const newAccessToken = data.accessToken;
      setAccessToken(newAccessToken);
      setLoginSuccess(true);
      Api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
      setAccessToken(prev => {
        if (prev !== newAccessToken) return newAccessToken;
        return prev;
      });
      console.log(newAccessToken)
      return newAccessToken;
    } catch (error) {
      console.log("Token refresh failed:", error);
      setAccessToken(null);
      setLoginSuccess(false);
      delete Api.defaults.headers.common['Authorization'];
    }
  };

  // 최초 렌더링시 토큰갱신시도 
  useEffect(() => {
    if (!accessToken) {
      const initialize = async () => {
        setIsTokenLoading(true); // 로딩 시작
        await refreshToken(); // 토큰 갱신
        setIsTokenLoading(false); // 로딩 종료
      };
      initialize();
    }
  }, [accessToken]);


  // 인터셉터 설정
  useEffect(() => {
    let isRefreshing = false;
    let failedQueue = [];
    
    const processQueue = (error, token = null) => {
      failedQueue.forEach(prom => {
        if (error) {
          prom.reject(error);
        } else {
          prom.resolve(token);
        }
      });
      failedQueue = [];
    };

    // 요청 인터셉터
    const reqInterceptor = Api.interceptors.request.use(config => {
      if (tokenValueRef.current) {
        config.headers.Authorization = `Bearer ${tokenValueRef.current}`;
      }
      return config;
    },
    error => Promise.reject(error) 
  );

    // 응답 인터셉터
    const resInterceptor = Api.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;


        // /auth/refresh-token 요청은 인터셉터 처리 제외 
        if (originalRequest.url.includes('/auth/refresh-token')) {
          return Promise.reject(error);
        }
    
        // 401 에러 & 첫 재시도
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          // 중복 갱신 방지
          if (!isRefreshing) {
            isRefreshing = true;
            try {
              const newAccessToken = await refreshToken(); // 토큰 갱신             
              processQueue(null, newAccessToken); // 대기열 처리
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return Api(originalRequest);  // 원래요청 재시도

            } catch (refreshError) {
              processQueue(refreshError, null);
              setAccessToken(null);
              setLoginSuccess(false);
              //로그아웃 처리나 로그인 페이지로 리다이렉트 로직을 추가필요
              return Promise.reject(refreshError);
            } finally {
              isRefreshing = false;
            }
          }
          // 다른 요청은 대기열에 추가
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
        }
        // 401이외의 에러는 그대로 반환 
        return Promise.reject(error);
      }
    );

    return () => {
      Api.interceptors.request.eject(reqInterceptor);
      Api.interceptors.response.eject(resInterceptor);
    };
  }, [accessToken]);


  const value = {
    loginSuccess, setLoginSuccess,
    accessToken, setAccessToken,
    // tokenTimer, setTokenTimer,
    // timeText, setTimeText,
    imagePreview, setImagePreview,
    isLoading, setIsLoading,
  };



  if (isTokenLoading) {
    return <div>Loading...</div>;
  }
  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
}