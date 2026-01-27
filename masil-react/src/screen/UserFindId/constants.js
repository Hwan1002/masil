// 아이디 찾기 관련 상수

// API 엔드포인트
export const API_ENDPOINTS = {
  FIND_USER_ID: "http://localhost:9090/user/findUserId",
};

// 메시지
export const MESSAGES = {
  ENTER_EMAIL: "이메일을 입력해주세요.",
  EMAIL_LABEL: "이메일",
  TITLE: "아이디 찾기",
  BUTTON_FIND: "찾기",
  BUTTON_SENDING: "전송 중...",
  BUTTON_GO_BACK: "돌아가기",
  BUTTON_FIND_PASSWORD: "비밀번호 찾기",
  FOUND_ID: (userId) => `회원님의 아이디는 "${userId}" 입니다.`,
};







