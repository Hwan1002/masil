import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Api } from "../context/MasilContext";
import { useChatRoom } from "../hook/useChatRoom";
import defaultProfile from "../css/img/userDefault.svg";

const Chat = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
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

  const formatDate = (dateString) => {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-green-500 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 mx-auto bg-gray-50 w-[100vw] h-[100vh]">
      <div className="flex justify-center items-center mt-40">
        <div className="w-[500px] h-auto p-4 bg-white rounded-xl shadow-lg">
          <h2 className="flex gap-2 items-center mb-6 text-2xl font-bold text-gray-800">
            <i className="text-green-500 fas fa-comments"></i>
            채팅
          </h2>

          <div className="overflow-y-auto p-2 mb-4 text-xs bg-gray-100 rounded">
            <h2> 디버깅 정보 </h2>
            <p>chatRooms 타입: {typeof chatRooms}</p>
            <p>
              chatRooms 길이:{" "}
              {Array.isArray(chatRooms) ? chatRooms.length : "N/A"}
            </p>
            <p>chatRooms 내용: {JSON.stringify(chatRooms)}</p>
          </div>

          {roomsToDisplay.length === 0 ? (
            <div className="flex flex-col justify-center items-center py-16 text-gray-500">
              <i className="mb-4 text-5xl opacity-30 fas fa-comments"></i>
              <p className="text-lg">대화 가능한 채팅방이 없습니다.</p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={createTestChatRoom}
                  className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  테스트 채팅방 생성
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                >
                  뒤로가기
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {roomsToDisplay.map((room) => (
                <div
                  key={room.roomId}
                  onClick={() => handleRoomClick(room)}
                  className="flex items-center p-4 rounded-lg border border-gray-100 transition-colors cursor-pointer hover:bg-gray-50"
                >
                  <div className="relative">
                    <img
                      src={defaultProfile}
                      alt={`${getPartnerNickname(room)}의 프로필`}
                      className="object-cover w-12 h-12 rounded-full"
                    />
                  </div>

                  <div className="flex-1 ml-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">
                        {getPartnerNickname(room)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(room.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      채팅방 ID: {room.roomId}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
