//회원가입 관련 상수

// 초기 폼 데이터 구조
export const INITIAL_FORM_DATA = {
  userId: "",
  userName: "",
  userNickName: "",
  password: "",
  email: "",
};

// 이메일 인증 타이머 (초 단위)
export const EMAIL_VERIFICATION_TIMER = 300; // 5분

// API 엔드포인트
export const API_ENDPOINTS = {
  USER: "http://localhost:9090/user",
  SEND_EMAIL: "http://localhost:9090/user/send-email",
  VERIFY_EMAIL: "http://localhost:9090/user/verify",
  LOCATION: "http://localhost:9090/location",
};

// 유효성 검사 메시지
export const VALIDATION_MESSAGES = {
  EMPTY_FIELD: "빈칸을 입력해주세요.",
  DUPLICATE_CHECK: "아이디 중복 확인해주세요.",
  PASSWORD_MISMATCH: "비밀번호가 일치하지 않습니다.",
  EMAIL_VERIFICATION_REQUIRED: "이메일 인증을 해주세요.",
  ENTER_USER_ID: "아이디를 입력해주세요.",
  ENTER_EMAIL: "이메일을 작성해주세요.",
};
