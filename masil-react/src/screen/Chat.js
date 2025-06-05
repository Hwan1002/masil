import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Api } from "../context/MasilContext";
import defaultProfile from "../css/img/userDefault.svg";

const Chat = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const fetchChatRooms = async () => {
    try {
      //채팅 목록 조회 api 연동할거
      const response = await Api.get("/chat/rooms");
      setChatRooms(response.data);
    } catch (error) {
      console.error("채팅방 목록 로딩 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-t-2 border-b-2 border-green-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl min-h-screen p-4 mx-auto bg-gray-50">
      <div className="p-6 bg-white shadow-lg rounded-xl">
        <h2 className="flex items-center gap-2 mb-6 text-2xl font-bold text-gray-800">
          <i className="text-green-500 fas fa-comments"></i>
          채팅
        </h2>

        {chatRooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <i className="mb-4 text-5xl fas fa-comments opacity-30"></i>
            <p className="text-lg">대화 가능한 채팅방이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {chatRooms.map((room) => (
              <div
                key={room.roomId}
                onClick={() => navigate(`/chat/${room.roomId}`)}
                className="flex items-center p-4 transition-colors border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <div className="relative">
                  <img
                    src={room.userProfile || defaultProfile}
                    alt={`${room.nickname}의 프로필`}
                    className="object-cover w-12 h-12 rounded-full"
                  />
                  {room.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>

                <div className="flex-1 ml-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">
                      {room.nickname}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(room.lastMessageTime)}
                    </span>
                  </div>
                  {room.lastMessage && (
                    <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                      {room.lastMessage}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
