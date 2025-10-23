//마실에서 공통으로 사용될 함수들 여기다 모아둘거임

//날짜 포맷 함수
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
