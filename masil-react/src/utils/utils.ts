//마실에서 공통으로 사용될 함수들 여기다 모아둘거임

//날짜 포맷 함수 - 상대적 시간 표시 (채팅용)
export const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "어제";
  } else {
    return date.toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
    });
  }
};

//날짜 포맷 함수 - 정확한 날짜/시간 표시 (게시물용)
export const formatDateTime = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  return date
    .toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .replace(/\./g, "-")
    .replace(/,/g, "")
    .replace(/\s+/g, " ");
};

//숫자 포맷 함수 - 천단위 콤마 추가
export const formatCurrency = (number) => {
  const num = Number(number);
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
