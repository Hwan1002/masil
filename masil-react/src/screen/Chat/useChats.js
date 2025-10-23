import { useState, useEffect } from "react";
import { useChatRoom } from "hook/useChatRoom";
import { Api } from "context/MasilContext";

export const useChats = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const { handleChatClick } = useChatRoom();

  // chatRooms가 배열인지 확인
  const roomsToDisplay = Array.isArray(chatRooms) ? chatRooms : [];

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const fetchChatRooms = async () => {
    try {
      console.log("채팅방 목록 조회 시작");
      const response = await Api.get("/chatting/rooms");
      console.log("채팅방 목록 응답:", response.data);

      // 응답 데이터가 배열인지 확인하고 설정
      if (Array.isArray(response.data)) {
        setChatRooms(response.data);
      } else {
        console.error("응답 데이터가 배열이 아닙니다:", response.data);
        setChatRooms([]);
      }
    } catch (error) {
      console.error("채팅방 목록 로딩 실패:", error);
      console.error("에러 응답:", error.response?.data);
      // 에러 시 빈 배열로 설정
      setChatRooms([]);
    } finally {
      setLoading(false);
    }
  };

  // 테스트용 채팅방 생성
  const createTestChatRoom = async () => {
    try {
      console.log("테스트 채팅방 생성 시작");
      const response = await Api.get("/chatting/chatRoom", {
        params: { receiver: "testUser" }, // 테스트용 사용자 ID
      });
      console.log("테스트 채팅방 생성 응답:", response.data);

      // 채팅방 목록 다시 조회
      await fetchChatRooms();
    } catch (error) {
      console.error("테스트 채팅방 생성 실패:", error);
      alert("테스트 채팅방 생성에 실패했습니다.");
    }
  };

  const getPartnerNickname = (room) => {
    const loginInfo = JSON.parse(localStorage.getItem("login-storage"));
    const myUserId = loginInfo?.state?.userId;

    if (myUserId === room.lenderId) {
      return room.borrowerNickname;
    } else if (myUserId === room.borrowerId) {
      return room.lenderNickname;
    }
    return "알 수 없음";
  };

  const handleRoomClick = async (room) => {
    try {
      console.log("채팅방 클릭됨:", room);

      const loginInfo = JSON.parse(localStorage.getItem("login-storage"));
      const myUserId = loginInfo?.state?.userId;

      // 상대방 ID 결정
      let receiverId;
      if (myUserId === room.lenderId) {
        receiverId = room.borrowerId;
      } else if (myUserId === room.borrowerId) {
        receiverId = room.lenderId;
      } else {
        console.error("현재 사용자가 채팅방에 참여하지 않았습니다.");
        alert("채팅방 정보를 찾을 수 없습니다.");
        return;
      }

      console.log("상대방 ID:", receiverId);
      await handleChatClick(receiverId);
    } catch (error) {
      console.error("채팅방 입장 실패:", error);
      alert("채팅방 입장에 실패했습니다.");
    }
  };

  return {
    chatRooms,
    loading,
    roomsToDisplay,
    fetchChatRooms,
    createTestChatRoom,
    getPartnerNickname,
    handleRoomClick,
  };
};
