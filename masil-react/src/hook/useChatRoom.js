import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Api, ProjectContext } from "../context/MasilContext";

export const  useChatRoom = () =>  {
  const { updateRoomAndMessages } = useContext(ProjectContext);
  const navigate = useNavigate();

  // webSokcet 연결함수 
  const handleChatClick = async (receiverId, accessToken) => {
    try {
      const response = await Api.get("/chatting/chatRoom", {
        params: { receiver: receiverId }, // (상세게시물에서 상대방의 userId 가 포함되어있기에 receiverId 사용가능 .채팅목록에서 채팅하기를 누를떄는 다른방법 사용 .)
      });
      const { room, messages } = response.data;
      updateRoomAndMessages(room, messages);

      const ws = new WebSocket(
        `ws://localhost:9090/chat?roomId=${room.roomId}`,
        ["chat-v1", accessToken] // 서브프로토콜 
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
    } catch (error) {
      console.error("채팅방 조회/생성 실패:", error);
      navigate("/chatroom", { state: { room: null, messages: [], ws: null } });
      return null;
    }
  };
  return { handleChatClick };
}