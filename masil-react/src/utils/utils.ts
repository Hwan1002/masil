//마실에서 공통으로 사용될 함수들 여기다 모아둘거임

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
      hour12: true,
    })
    .replace(/\./g, "-")
    .replace(/-\s+/g, "-") // 하이픈 뒤 공백 제거
    .replace(/\s+-/g, "-") // 하이픈 앞 공백 제거
    .replace(/-(\s*)(오전|오후)/g, " $2")
    .replace(/(오전|오후)(\d{2})/g, "$1 $2");
};

//숫자 포맷 함수 - 천단위 콤마 추가
export const formatCurrency = (number) => {
  const num = Number(number);
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// 메시지 시간 한국시간으로 나오게
export const formatMessageTime = (dateString) => {
  if (!dateString) {
    return "";
  }

  try {
    const date = new Date(dateString);

    // Invalid Date 체크
    if (isNaN(date.getTime())) {
      console.error("Invalid Date:", dateString);
      return "";
    }

    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    console.error("날짜 포맷팅 오류:", error, dateString);
    return "";
  }
};
