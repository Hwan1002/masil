import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useChatContext } from "../context/ChatContext";
import { useProjectContext } from "../context/MasilContext";

export function useChatRoom() {
  const { connectWebSocket, sendMessage, wsRef, disconnectWebSocket } =
    useChatContext();
  const { accessToken } = useProjectContext();
  const navigate = useNavigate();

  const handleChatClick = useCallback(
    async (receiverId) => {
      try {
        console.log("handleChatClick 호출됨 - receiverId:", receiverId);
        console.log("connectWebSocket 함수:", connectWebSocket);

        await connectWebSocket(receiverId, accessToken);
        console.log("채팅방 연결 성공, 페이지 이동");
        navigate("/chatroom");
      } catch (error) {
        console.error("채팅방 입장 실패:", error);
        console.error("에러 타입:", error.constructor.name);
        console.error("에러 메시지:", error.message);

        if (error.response) {
          console.error("응답 데이터:", error.response.data);
          console.error("응답 상태:", error.response.status);
        }

        alert("채팅방을 불러오는데 실패했습니다.");
      }
    },
    [connectWebSocket, accessToken, navigate]
  );

  return {
    handleChatClick,
    sendMessage,
    wsRef,
    disconnectWebSocket,
  };
}
