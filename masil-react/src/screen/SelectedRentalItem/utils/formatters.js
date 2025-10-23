import moment from "moment";
//날짜를 포맷 해주는 함수 정의 공통으로 뺄까 고민중
export const formatDate = (date) => moment(date).format("YYYY-MM-DD HH:mm:ss");

export const formatCurrency = (number) => {
  const num = Number(number);
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
