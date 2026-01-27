// Enter 키 입력 시 콜백을 실행하는 핸들러 생성
export const useKeyPress = (callback) => {
  return (e) => {
    if (e.key === "Enter") {
      callback(e);
    }
  };
};
