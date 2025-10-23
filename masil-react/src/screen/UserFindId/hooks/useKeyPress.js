/**
 * Enter 키 입력 시 콜백을 실행하는 핸들러 생성
 * @param {Function} callback - Enter 키 눌렀을 때 실행할 함수
 * @returns {Function} 키 이벤트 핸들러
 */
export const useKeyPress = (callback) => {
  return (e) => {
    if (e.key === "Enter") {
      callback(e);
    }
  };
};

