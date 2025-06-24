import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Api, ProjectContext } from "../context/MasilContext";

export function useChatRoom() {
  const { updateRoomAndMessages } = useContext(ProjectContext);
  const navigate = useNavigate();

  const handleChatClick = async (receiverId, accessToken) => {
    try {
      const response = await Api.get("/chatting/chatRoom", {
        params: { receiver: receiverId },
      });
      const { room, messages } = response.data;
      updateRoomAndMessages(room, messages);

      const ws = new WebSocket(
        `ws://localhost:9090/chat?roomId=${room.roomId}`,
        ["chat-v1", accessToken]
      );

      ws.onopen = () => {
        console.log("웹소켓 연결 성공");
        navigate("/chatroom");
      };

      ws.onerror = (error) => {
        console.error("웹소켓 연결 실패:", error);
      };

      ws.onclose = () => {
        console.log("웹소켓 연결 종료");
      };

      return ws;
    } catch (error) {
      console.error("채팅방 조회/생성 실패:", error);
      navigate("/chatroom", { state: { room: null, messages: [], ws: null } });
      return null;
    }
  };
  return { handleChatClick };
}